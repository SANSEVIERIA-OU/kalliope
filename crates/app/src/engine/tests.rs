// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The speaking thread with a stand-in voice and microphone: what a person sees and hears when
//! they press Stop, close the window, pick a broken voice or speak to nobody.

use super::*;
use std::sync::atomic::AtomicBool;
use std::sync::mpsc::Receiver;

const RATE: u32 = 24_000;

/// What happened to the stand-in microphone, with the time since the test started.
#[derive(Clone, Default)]
struct Log(Arc<Mutex<Vec<(Instant, String)>>>);

impl Log {
    fn push(&self, what: impl Into<String>) {
        self.0.lock().unwrap().push((Instant::now(), what.into()));
    }
    fn first(&self, what: &str) -> Option<Instant> {
        self.0
            .lock()
            .unwrap()
            .iter()
            .find(|(_, w)| w.starts_with(what))
            .map(|(t, _)| *t)
    }
    fn after(&self, t: Instant, what: &str) -> usize {
        self.0
            .lock()
            .unwrap()
            .iter()
            .filter(|(at, w)| *at > t && w.starts_with(what))
            .count()
    }
}

/// A microphone that keeps time like a real one and records what it is asked to do.
struct FakeMic {
    clock: audio::Silent,
    log: Log,
    in_use: Arc<AtomicBool>,
    connected: Arc<AtomicBool>,
    most_queued: Arc<Mutex<f32>>,
}

impl Output for FakeMic {
    fn play(&self, samples: &[f32]) {
        self.log.push(format!("play {}", samples.len()));
        self.clock.play(samples);
        let mut most = self.most_queued.lock().unwrap();
        *most = most.max(self.clock.queued_seconds());
    }
    fn clear(&self) {
        self.log.push("clear");
        self.clock.clear();
    }
    fn queued_seconds(&self) -> f32 {
        self.clock.queued_seconds()
    }
    fn set_monitor(&self, _on: bool) -> Result<(), String> {
        Ok(())
    }
    fn in_use(&self) -> bool {
        self.in_use.load(Ordering::SeqCst)
    }
    fn is_connected(&self) -> bool {
        self.connected.load(Ordering::SeqCst)
    }
}

impl Drop for FakeMic {
    fn drop(&mut self) {
        self.log.push("removed");
    }
}

/// A voice that takes `work` to synthesize each word and says it in `spoken`.
struct FakeVoice {
    work: Duration,
    spoken: Duration,
}

impl Speaker for FakeVoice {
    fn sample_rate(&self) -> u32 {
        RATE
    }
    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece> {
        kalliope_text::normalize(text)
            .join(" ")
            .split_whitespace()
            .map(|w| Piece {
                what: What::Test,
                starts: Some(w.into()),
                first: true,
                last: true,
                tokens: 0,
                seed: 0,
                ticket,
            })
            .collect()
    }
    fn speak(&self, _piece: &Piece, play: &mut dyn FnMut(&[f32]) -> bool) -> Result<(), String> {
        std::thread::sleep(self.work);
        play(&vec![
            0.5;
            (self.spoken.as_secs_f32() * RATE as f32) as usize
        ]);
        Ok(())
    }
}

struct Rig {
    engine: Engine,
    events: Receiver<Event>,
    log: Log,
    in_use: Arc<AtomicBool>,
    connected: Arc<AtomicBool>,
    most_queued: Arc<Mutex<f32>>,
    /// How many times the microphone was opened.
    opened: Arc<AtomicU64>,
}

struct Setup {
    voice: VoiceId,
    work: Duration,
    spoken: Duration,
    broken: Vec<VoiceId>,
    in_use: bool,
    /// Opening the microphone fails this many times first.
    mic_failures: u64,
    mic_retry: bool,
}

impl Default for Setup {
    fn default() -> Self {
        Setup {
            voice: VoiceId::default(),
            work: Duration::from_millis(10),
            spoken: Duration::from_millis(100),
            broken: Vec::new(),
            in_use: true,
            mic_failures: 0,
            mic_retry: true,
        }
    }
}

fn config(voice: VoiceId) -> Config {
    Config {
        model_dir: PathBuf::new(),
        voice,
        monitor: true,
        ort_lib: None,
        pocket_dir: PathBuf::new(),
        voices_dir: PathBuf::new(),
    }
}

fn rig(setup: Setup) -> Rig {
    let (tx, events) = channel();
    let log = Log::default();
    let in_use = Arc::new(AtomicBool::new(setup.in_use));
    let connected = Arc::new(AtomicBool::new(true));
    let most_queued = Arc::new(Mutex::new(0.0));
    let opened = Arc::new(AtomicU64::new(0));
    let (work, spoken, broken) = (setup.work, setup.spoken, setup.broken);
    let load: Loader = Box::new(move |_, id| {
        if broken.contains(id) {
            return Err(format!("{} rotta", id.key()));
        }
        Ok(Box::new(FakeVoice { work, spoken }))
    });
    let (l, u, c, m, o) = (
        log.clone(),
        in_use.clone(),
        connected.clone(),
        most_queued.clone(),
        opened.clone(),
    );
    let (failures, retry) = (setup.mic_failures, setup.mic_retry);
    let open: Opener = Box::new(move |rate| {
        let n = o.fetch_add(1, Ordering::SeqCst);
        if n < failures {
            return Err(MicError {
                reason: "PipeWire non risponde".into(),
                detail: "PipeWire is not running".into(),
                retry,
            });
        }
        l.push("opened");
        c.store(true, Ordering::SeqCst);
        Ok(Box::new(FakeMic {
            clock: audio::Silent::new(rate),
            log: l.clone(),
            in_use: u.clone(),
            connected: c.clone(),
            most_queued: m.clone(),
        }))
    });
    let engine = Engine::start_with(
        config(setup.voice),
        move |e| {
            let _ = tx.send(e);
        },
        load,
        open,
    );
    Rig {
        engine,
        events,
        log,
        in_use,
        connected,
        most_queued,
        opened,
    }
}

impl Rig {
    /// Events until `last` (included), or panics after `within`.
    fn until(&self, last: &Event, within: Duration) -> Vec<Event> {
        let deadline = Instant::now() + within;
        let mut seen = Vec::new();
        loop {
            let left = deadline.saturating_duration_since(Instant::now());
            match self.events.recv_timeout(left) {
                Ok(e) => {
                    let done = e == *last;
                    seen.push(e);
                    if done {
                        return seen;
                    }
                }
                Err(_) => panic!("no {last:?} within {within:?}; seen {seen:?}"),
            }
        }
    }

    fn ready(&self) -> Vec<Event> {
        let deadline = Instant::now() + Duration::from_secs(5);
        let mut seen = Vec::new();
        while Instant::now() < deadline {
            if let Ok(e) = self.events.recv_timeout(Duration::from_millis(50)) {
                let ready = matches!(e, Event::Ready { .. });
                seen.push(e);
                if ready {
                    // Anything sent right after Ready (a warning) comes too.
                    while let Ok(e) = self.events.recv_timeout(Duration::from_millis(50)) {
                        seen.push(e);
                    }
                    return seen;
                }
            }
        }
        panic!("not ready: {seen:?}");
    }
}

const SECOND: Duration = Duration::from_secs(1);

#[test]
fn stop_is_possible_at_once_and_silences_the_piece_being_synthesized() {
    let rig = rig(Setup {
        work: Duration::from_millis(800),
        spoken: Duration::from_millis(500),
        ..Setup::default()
    });
    rig.ready();
    let sent = Instant::now();
    assert!(
        rig.engine
            .send(Command::Speak("uno due tre quattro".into()))
    );
    // Ferma is usable as soon as the phrase is accepted, long before the first sound.
    rig.until(&Event::Speaking, Duration::from_millis(100));
    assert!(sent.elapsed() < Duration::from_millis(100));
    std::thread::sleep(Duration::from_millis(300));
    let stop = Instant::now();
    rig.engine.stop();
    let cleared = rig.log.first("clear").expect("the microphone was emptied");
    assert!(cleared.duration_since(stop) < Duration::from_millis(20));
    rig.until(&Event::Idle, 2 * SECOND);
    // The word being synthesized when Stop came is never played, and nothing after it.
    std::thread::sleep(Duration::from_millis(1200));
    assert_eq!(rig.log.after(stop, "play"), 0);
}

#[test]
fn a_stop_sent_after_a_text_wins_even_if_the_text_was_not_read_yet() {
    let rig = rig(Setup::default());
    rig.ready();
    rig.engine.send(Command::Speak("uno due".into()));
    rig.engine.stop();
    std::thread::sleep(Duration::from_millis(300));
    assert_eq!(rig.log.after(Instant::now() - 10 * SECOND, "play"), 0);
}

#[test]
fn sound_starts_after_the_first_piece() {
    let rig = rig(Setup {
        work: Duration::from_millis(200),
        spoken: Duration::from_millis(400),
        ..Setup::default()
    });
    rig.ready();
    let sent = Instant::now();
    rig.engine
        .send(Command::Speak("uno due tre quattro cinque sei".into()));
    let deadline = Instant::now() + 2 * SECOND;
    while rig.log.first("play").is_none() && Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(5));
    }
    let first = rig.log.first("play").expect("sound").duration_since(sent);
    assert!(first < Duration::from_millis(400), "{first:?}");
    rig.until(&Event::Idle, 5 * SECOND);
}

#[test]
fn audio_waiting_to_be_played_stays_bounded_for_long_texts() {
    let rig = rig(Setup {
        work: Duration::ZERO,
        spoken: Duration::from_millis(500),
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("parola ".repeat(400)));
    std::thread::sleep(Duration::from_millis(600));
    rig.engine.stop();
    let most = *rig.most_queued.lock().unwrap();
    assert!(most <= LOOKAHEAD_SECONDS + 0.6, "{most} s queued");
}

#[test]
fn closing_removes_the_microphone_without_waiting_for_the_voice() {
    let rig = rig(Setup {
        work: Duration::from_millis(600),
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("uno due tre".into()));
    std::thread::sleep(Duration::from_millis(100));
    let log = rig.log.clone();
    let closing = Instant::now();
    drop(rig.engine);
    let removed = log.first("removed").expect("microphone removed");
    assert!(removed.duration_since(closing) < Duration::from_millis(20));
    // Only the piece in the works was finished, and it was not played.
    assert!(closing.elapsed() < Duration::from_millis(700));
    assert_eq!(log.after(closing, "play"), 0);
    // A closed window is not a PipeWire that went away.
    let late: Vec<Event> = rig.events.try_iter().collect();
    assert!(
        !late.iter().any(|e| matches!(e, Event::Microphone(_))),
        "{late:?}"
    );
}

#[test]
fn a_voice_that_fails_at_start_falls_back_to_giulia() {
    let broken = VoiceId::Own("Vecchia".into());
    let rig = rig(Setup {
        voice: broken.clone(),
        broken: vec![broken],
        ..Setup::default()
    });
    let events = rig.ready();
    assert!(
        events.contains(&Event::Voice(VoiceId::default())),
        "{events:?}"
    );
    assert!(
        events.iter().any(
            |e| matches!(e, Event::Warning(w) if w.contains("Vecchia") && w.contains("Giulia"))
        ),
        "{events:?}"
    );
    rig.engine.send(Command::Speak("ciao".into()));
    rig.until(&Event::Idle, 2 * SECOND);
}

#[test]
fn a_failed_switch_keeps_the_voice_in_use_and_says_so() {
    let broken = VoiceId::Own("Vecchia".into());
    let rig = rig(Setup {
        broken: vec![broken.clone()],
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Voice(broken));
    let events = rig.until(&Event::Voice(VoiceId::default()), 2 * SECOND);
    assert!(matches!(&events[0], Event::Warning(w) if w.contains("continuo con «Giulia»")));
    rig.engine.send(Command::Speak("ciao".into()));
    rig.until(&Event::Idle, 2 * SECOND);
}

#[test]
fn without_any_voice_the_thread_waits_for_one_that_works() {
    let rig = rig(Setup {
        broken: vec![VoiceId::default()],
        ..Setup::default()
    });
    rig.until(&Event::Error(cannot_prepare("Giulia rotta")), 2 * SECOND);
    let own = VoiceId::Own("Anna".into());
    rig.engine.send(Command::Voice(own.clone()));
    let events = rig.ready();
    assert!(events.contains(&Event::Voice(own)));
    rig.engine.send(Command::Speak("ciao".into()));
    rig.until(&Event::Idle, 2 * SECOND);
}

#[test]
fn a_personal_voice_named_marco_is_not_klein_marco() {
    let own = VoiceId::Own("Marco".into());
    let rig = rig(Setup {
        voice: own.clone(),
        broken: vec![VoiceId::Klein("Marco".into())],
        ..Setup::default()
    });
    let events = rig.ready();
    assert!(events.contains(&Event::Voice(own)), "{events:?}");
}

#[test]
fn nobody_listening_is_reported_with_the_monitor_on_and_off() {
    for monitor in [true, false] {
        let rig = rig(Setup {
            in_use: false,
            ..Setup::default()
        });
        rig.ready();
        rig.engine.send(Command::Monitor(monitor));
        rig.engine.send(Command::Speak("ciao a tutti".into()));
        let events = rig.until(&Event::Idle, 2 * SECOND);
        assert_eq!(events, [Event::NotHeard, Event::Idle], "monitor {monitor}");
        // A call starts recording from the microphone: the notice can go.
        rig.in_use.store(true, Ordering::SeqCst);
        rig.until(&Event::Heard, 2 * SECOND);
    }
}

#[test]
fn a_text_with_nothing_to_say_is_reported() {
    let rig = rig(Setup::default());
    rig.ready();
    for text in ["…", "👍", " ", "?!"] {
        rig.engine.send(Command::Speak(text.into()));
        assert_eq!(
            rig.until(&Event::NothingToSay, SECOND),
            [Event::NothingToSay]
        );
    }
    assert!(!has_speech("…") && !has_speech("👍 🎉") && !has_speech(""));
    assert!(has_speech("ok") && has_speech("3 euro") && has_speech("Sì!"));
}

#[test]
fn the_microphone_comes_back_when_pipewire_restarts() {
    let rig = rig(Setup::default());
    rig.ready();
    rig.connected.store(false, Ordering::SeqCst);
    rig.until(&Event::Microphone(Err(MicError::lost().reason)), 2 * SECOND);
    // The next attempt finds PipeWire again (the stand-in reconnects at once).
    rig.until(&Event::Microphone(Ok(())), 3 * SECOND);
    assert_eq!(rig.opened.load(Ordering::SeqCst), 2);
}

#[test]
fn kalliope_keeps_trying_when_pipewire_was_not_ready_at_start() {
    let rig = rig(Setup {
        mic_failures: 2,
        ..Setup::default()
    });
    let events = rig.ready();
    assert!(
        events.contains(&Event::Ready {
            microphone: Err("PipeWire non risponde".into())
        }),
        "{events:?}"
    );
    rig.until(&Event::Microphone(Ok(())), 4 * SECOND);
    rig.engine.send(Command::Speak("ciao".into()));
    rig.until(&Event::Idle, 2 * SECOND);
    assert!(rig.log.first("play").is_some());
}

#[test]
fn a_missing_pipewire_is_not_retried() {
    let rig = rig(Setup {
        mic_failures: 1,
        mic_retry: false,
        ..Setup::default()
    });
    rig.ready();
    std::thread::sleep(Duration::from_millis(1500));
    assert_eq!(rig.opened.load(Ordering::SeqCst), 1);
}

#[test]
fn voices_are_stored_and_shown_without_mixing_them_up() {
    let own = VoiceId::Own("Marco".into());
    assert_eq!(own.key(), "Marco.safetensors");
    assert_eq!(VoiceId::parse("Marco.safetensors"), Some(own.clone()));
    assert_eq!(
        VoiceId::parse("marco"),
        Some(VoiceId::Klein("Marco".into()))
    );
    // Kalliope 0.2 stored a prepared voice by its bare name.
    assert_eq!(VoiceId::parse("Anna"), Some(VoiceId::Own("Anna".into())));
    assert_eq!(VoiceId::parse(" "), None);
    assert_eq!(own.label(), "Marco (voce propria)");
    assert_eq!(
        VoiceId::Own("giulia".into()).label(),
        "giulia (voce propria)"
    );
    assert_eq!(VoiceId::Own("Anna".into()).label(), "Anna");
    assert_ne!(own, VoiceId::Klein("Marco".into()));
}

/// With the real model (KALLIOPE_MODEL_DIR and KALLIOPE_ORT_LIB set): a long sentence is cut only
/// at its commas, and its first piece is short.
#[test]
fn giulia_cuts_a_long_sentence_at_its_commas() {
    let (Some(dir), Some(_)) = (
        std::env::var_os("KALLIOPE_MODEL_DIR"),
        std::env::var_os("KALLIOPE_ORT_LIB"),
    ) else {
        eprintln!("skipped: set KALLIOPE_MODEL_DIR and KALLIOPE_ORT_LIB to run");
        return;
    };
    let voice = Voice::load(&PathBuf::from(dir), "Giulia", &VoiceOptions::default()).unwrap();
    let klein = Klein(voice);
    let text = "Buongiorno a tutti, scusate se scrivo invece di parlare, oggi la voce non mi aiuta, \
        ma ho seguito tutta la riunione, vorrei dire che la proposta di Marta mi sembra molto buona, \
        però dobbiamo controllare i costi del trasporto, chiedere un secondo preventivo al fornitore \
        di Torino, e fissare una scadenza chiara per la consegna dei materiali entro la fine del mese.";
    let pieces = klein.pieces(text, 0);
    assert!(pieces.len() >= 3, "{}", pieces.len());
    for (i, p) in pieces.iter().enumerate() {
        let What::Phonemes { text, .. } = &p.what else {
            unreachable!()
        };
        assert!(
            text.ends_with([',', '.']),
            "piece {i} cut inside a clause: {text}"
        );
    }
    let started = Instant::now();
    let mut first = Vec::new();
    klein
        .speak(&pieces[0], &mut |a| {
            first.extend_from_slice(a);
            true
        })
        .unwrap();
    let work = started.elapsed();
    assert!(!first.is_empty());
    eprintln!(
        "first piece: {:.2} s of speech in {work:?}",
        first.len() as f32 / RATE as f32
    );
}

#[test]
fn clauses_are_joined_as_far_as_the_queued_audio_allows() {
    let line = Arc::new(Line::default());
    let clock = Arc::new(audio::Silent::new(RATE));
    struct Shared(Arc<audio::Silent>);
    impl Output for Shared {
        fn play(&self, s: &[f32]) {
            self.0.play(s)
        }
        fn clear(&self) {
            self.0.clear()
        }
        fn queued_seconds(&self) -> f32 {
            self.0.queued_seconds()
        }
        fn set_monitor(&self, _: bool) -> Result<(), String> {
            Ok(())
        }
        fn in_use(&self) -> bool {
            true
        }
        fn is_connected(&self) -> bool {
            true
        }
    }
    drop(line.replace(Box::new(Shared(clock.clone()))));
    let mut thread = Thread::new(
        config(VoiceId::default()),
        line,
        Box::new(|_| {}),
        Box::new(|_, _| Err(String::new())),
        Box::new(|_| Err(MicError::lost())),
    );
    thread.seconds_per_token = 0.01;
    let clause = |i: usize, last: bool| Piece {
        what: What::Phonemes {
            text: format!("c{i},"),
            before: String::new(),
            after: String::new(),
        },
        starts: (i == 0).then(|| "frase".into()),
        first: i == 0,
        last,
        tokens: 20,
        seed: i as u32,
        ticket: 0,
    };
    thread.pending.extend((0..8).map(|i| clause(i, i == 7)));
    // Nothing playing yet: a short first piece.
    let first = thread.next_piece().unwrap();
    assert_eq!(first.tokens, 41);
    assert!(first.first && !first.last);
    // The model reads the next clause too, for the intonation at the cut, but does not say it.
    let What::Phonemes {
        text,
        before,
        after,
    } = &first.what
    else {
        unreachable!()
    };
    assert_eq!(
        (text.as_str(), before.as_str(), after.as_str()),
        ("c0, c1,", "", "c2, c3, c4, c5,")
    );
    // Three seconds queued: up to 150 tokens of work fit in half of them.
    clock.play(&vec![0.0; 3 * RATE as usize]);
    let next = thread.next_piece().unwrap();
    assert_eq!(next.tokens, 6 * 20 + 5);
    let What::Phonemes {
        text,
        before,
        after,
    } = &next.what
    else {
        unreachable!()
    };
    assert_eq!(text, "c2, c3, c4, c5, c6, c7,");
    assert_eq!((before.as_str(), after.as_str()), ("c1,", ""));
    assert!(!next.first && next.last);
    assert!(thread.next_piece().is_none());
}
