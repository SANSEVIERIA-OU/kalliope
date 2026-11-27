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

/// How long each word of the fake voice takes to say, in units of [`spoken_weight`]: a word of
/// five sounds.
const FAKE_WEIGHT: f32 = 6.0;

/// A voice that takes `work` to synthesize each word and says it in `spoken`, after `lead` of
/// silence; a streaming one hands the silence over first, on its own, then the voice in four
/// parts, `work` apart.
struct FakeVoice {
    work: Duration,
    spoken: Duration,
    lead: Duration,
    streaming: bool,
}

impl Speaker for FakeVoice {
    fn sample_rate(&self) -> u32 {
        RATE
    }
    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece> {
        let words: Vec<Range<usize>> = kalliope_text::normalize_spans(text)
            .into_iter()
            .flat_map(|s| s.words)
            .collect();
        let n = words.len();
        words
            .into_iter()
            .enumerate()
            .map(|(i, source)| Piece {
                what: What::Test,
                spoken: vec![Spoken {
                    byte: source.start,
                    weight: FAKE_WEIGHT,
                }],
                source,
                phrase: None,
                ends_phrase: i + 1 == n,
                first: true,
                last: true,
                tokens: 0,
                seed: 0,
                ticket,
            })
            .collect()
    }
    fn streams(&self) -> bool {
        self.streaming
    }
    fn speak(&self, _piece: &Piece, play: &mut Play) -> Result<(), String> {
        let samples = (self.spoken.as_secs_f32() * RATE as f32) as usize;
        let silence = vec![0.0; (self.lead.as_secs_f32() * RATE as f32) as usize];
        if self.streaming {
            if !silence.is_empty() && !play(&silence, &[]) {
                return Ok(());
            }
            for _ in 0..4 {
                std::thread::sleep(self.work);
                if !play(&vec![0.5; samples / 4], &[]) {
                    break;
                }
            }
            return Ok(());
        }
        std::thread::sleep(self.work);
        let mut audio = silence;
        audio.resize(audio.len() + samples, 0.5);
        play(&audio, &[]);
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
    lead: Duration,
    streaming: bool,
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
            lead: Duration::ZERO,
            streaming: false,
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
    let (work, spoken, lead, streaming, broken) = (
        setup.work,
        setup.spoken,
        setup.lead,
        setup.streaming,
        setup.broken,
    );
    let load: Loader = Box::new(move |_, id| {
        if broken.contains(id) {
            return Err(format!("{} rotta", id.key()));
        }
        Ok(Box::new(FakeVoice {
            work,
            spoken,
            lead,
            streaming,
        }))
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
        let mut events = rig.until(&Event::Idle, 2 * SECOND);
        events.retain(|e| !matches!(e, Event::Sounding(_)));
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
    // Each piece says the typed text up to one of its commas, and together they cover it all.
    let mut end = 0;
    for p in &pieces {
        assert_eq!(p.source.start, end + usize::from(end > 0));
        end = p.source.end;
        assert!(
            text[..end].ends_with([',', '.']),
            "{:?}",
            &text[p.source.clone()]
        );
    }
    assert_eq!(end, text.len());
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
        .speak(&pieces[0], &mut |a, _| {
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
        Arc::new(Mutex::new(Box::new(|_| {}))),
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
        source: i * 4..i * 4 + 3,
        spoken: vec![Spoken {
            byte: i * 4,
            weight: 1.0,
        }],
        phrase: None,
        ends_phrase: last,
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
    // A joined piece says the typed text of all its clauses.
    assert_eq!((first.source.clone(), next.source.clone()), (0..7, 8..31));
    assert!(next.ends_phrase);
    assert!(thread.next_piece().is_none());
}

/// Whether `d` is `ms` milliseconds, give or take one.
fn close(d: Duration, ms: u64) -> bool {
    d.as_secs_f64() * 1000.0 - ms as f64 <= 1.0 && ms as f64 - d.as_secs_f64() * 1000.0 <= 1.0
}

/// The Soundings among `events`.
fn soundings(events: &[Event]) -> Vec<Sounding> {
    events
        .iter()
        .filter_map(|e| match e {
            Event::Sounding(s) => Some(s.clone()),
            _ => None,
        })
        .collect()
}

#[test]
fn each_piece_is_announced_as_it_starts_sounding_with_the_text_it_says() {
    let rig = rig(Setup {
        work: Duration::from_millis(30),
        spoken: Duration::from_millis(150),
        ..Setup::default()
    });
    rig.ready();
    let text = "Il Dott. Rossi paga 1.250 €, poi va.";
    rig.engine.send(Command::Speak(text.into()));
    let mut times = Vec::new();
    let mut seen = Vec::new();
    let deadline = Instant::now() + 5 * SECOND;
    while let Ok(e) = rig.events.recv_timeout(deadline - Instant::now()) {
        if matches!(e, Event::Sounding(_)) {
            times.push(Instant::now());
        }
        let idle = e == Event::Idle;
        seen.push(e);
        if idle {
            break;
        }
    }
    let pieces = soundings(&seen);
    let said: Vec<&str> = pieces.iter().map(|s| &text[s.span.clone()]).collect();
    // The words of the number and of the currency all point to what was typed.
    assert_eq!(said[0], "Il");
    assert_eq!(said[1], "Dott.");
    assert!(said.contains(&"1.250 €"), "{said:?}");
    assert_eq!(said.last(), Some(&"va."));
    assert!(
        pieces.iter().all(|s| s.exact && close(s.duration, 150)),
        "{pieces:?}"
    );
    assert!(pieces.iter().rev().skip(1).all(|s| !s.last) && pieces.last().unwrap().last);
    assert!(pieces.iter().all(|s| s.id == 1 && &*s.phrase == text));
    // One after the other, as long as each lasts, though they were synthesized much faster. Each is
    // measured from the first announcement, so one late receipt on a busy machine (CI's macOS
    // runners) does not shorten the next gap: the announcements keep the schedule of the audio.
    let first = times[0];
    for (i, at) in times.iter().enumerate() {
        let expected = Duration::from_millis(150 * i as u64);
        let since = *at - first;
        assert!(
            since + Duration::from_millis(60) >= expected
                && since <= expected + Duration::from_millis(150),
            "piece {i}: {since:?} after the first, expected about {expected:?}"
        );
    }
    assert!(
        seen.iter().position(|e| *e == Event::Idle)
            > seen.iter().rposition(|e| matches!(e, Event::Sounding(_)))
    );
}

#[test]
fn stop_tells_how_much_of_the_phrase_was_said() {
    let rig = rig(Setup {
        work: Duration::from_millis(10),
        spoken: Duration::from_millis(400),
        ..Setup::default()
    });
    rig.ready();
    rig.engine
        .send(Command::Speak("uno due tre quattro".into()));
    let deadline = Instant::now() + 3 * SECOND;
    let mut second = None;
    while let Ok(e) = rig.events.recv_timeout(deadline - Instant::now()) {
        if let Event::Sounding(s) = e
            && s.span.start > 0
        {
            second = Some(s);
            break;
        }
    }
    let second = second.expect("the second word");
    let heard_from = Instant::now();
    assert_eq!(second.span, 4..7);
    std::thread::sleep(Duration::from_millis(100));
    rig.engine.stop();
    // How long the second word had sounded when Stop came, as this thread saw it: at least this
    // much (the announcement came before it was received), and at most this plus a late receipt.
    let elapsed = heard_from.elapsed().as_secs_f32();
    let events = rig.until(&Event::Idle, SECOND);
    let said = events
        .iter()
        .find_map(|e| match e {
            Event::Interrupted(s) => Some(s.clone()),
            _ => None,
        })
        .expect("what was said");
    // «uno» in full, «due» in part, nothing after it.
    assert_eq!(said.done, 4);
    let (cut, share) = said.cut.clone().expect("a piece cut midway");
    assert_eq!(cut, 4..7);
    let (low, high) = ((elapsed - 0.02) / 0.4, (elapsed + 0.15) / 0.4);
    assert!(
        share > 0.0 && share < 1.0 && share >= low && share <= high,
        "share {share}, expected {low}..{high} after {elapsed} s"
    );
    assert!(soundings(&events).is_empty(), "{events:?}");
    std::thread::sleep(Duration::from_millis(600));
    assert!(rig.events.try_recv().is_err());
}

/// Stop while the voice still synthesizes the piece that sounds (a voice prepared from a recording
/// streams it, and its duration is still a guess): what was said is told before Idle, so the
/// bubble keeps faint the words not said.
#[test]
fn stop_while_a_streamed_piece_is_synthesized_tells_what_was_said() {
    let rig = rig(Setup {
        work: Duration::from_millis(300),
        spoken: Duration::from_millis(2000),
        streaming: true,
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("uno".into()));
    let deadline = Instant::now() + 3 * SECOND;
    let (guess, sounded) = loop {
        match rig.events.recv_timeout(deadline - Instant::now()) {
            Ok(Event::Sounding(s)) => {
                assert!(!s.exact);
                break (s.duration, Instant::now());
            }
            Ok(_) => continue,
            Err(e) => panic!("no piece sounded: {e}"),
        }
    };
    std::thread::sleep(Duration::from_millis(100));
    rig.engine.stop();
    // the share said is the time it sounded over the guessed duration: bounded by the time that really passed before Stop
    // (a slow machine passes more of it), never the whole piece
    let waited = sounded.elapsed();
    let events = rig.until(&Event::Idle, SECOND);
    let said = events
        .iter()
        .find_map(|e| match e {
            Event::Interrupted(s) => Some(s.clone()),
            _ => None,
        })
        .unwrap_or_else(|| panic!("what was said: {events:?}"));
    assert_eq!(said.done, 0);
    let (cut, share) = said.cut.expect("a piece cut midway");
    assert_eq!(cut, 0..3);
    let most = ((waited.as_secs_f32() + 0.15) / guess.as_secs_f32()).min(0.99);
    assert!(
        share > 0.0 && share <= most,
        "{share} (at most {most}: {waited:?} of {guess:?})"
    );
}

#[test]
fn stop_before_any_sound_says_nothing_was_said() {
    let rig = rig(Setup {
        work: Duration::from_millis(400),
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("uno due".into()));
    rig.until(&Event::Speaking, SECOND);
    std::thread::sleep(Duration::from_millis(100));
    rig.engine.stop();
    let events = rig.until(&Event::Idle, SECOND);
    let said = events.iter().find_map(|e| match e {
        Event::Interrupted(s) => Some(s.clone()),
        _ => None,
    });
    assert_eq!(said.map(|s| (s.done, s.cut)), Some((0, None)));
}

#[test]
fn a_streamed_piece_gets_its_exact_duration_once_known() {
    let rig = rig(Setup {
        work: Duration::from_millis(60),
        spoken: Duration::from_millis(800),
        streaming: true,
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("ciao".into()));
    let events = rig.until(&Event::Idle, 3 * SECOND);
    let pieces = soundings(&events);
    assert_eq!(pieces.len(), 2, "{pieces:?}");
    assert!(!pieces[0].exact);
    assert_eq!(pieces[1].span, pieces[0].span);
    assert!(
        pieces[1].exact && close(pieces[1].duration, 800),
        "{pieces:?}"
    );
}

/// The first piece that sounds, when it was announced, and when the first audio was played.
fn first_sounding(rig: &Rig, within: Duration) -> (Sounding, Instant, Instant) {
    let deadline = Instant::now() + within;
    while let Ok(e) = rig.events.recv_timeout(deadline - Instant::now()) {
        if let Event::Sounding(s) = e {
            let now = Instant::now();
            return (
                s,
                now,
                rig.log.first("play").expect("audio before the piece"),
            );
        }
    }
    panic!("no piece sounding within {within:?}");
}

#[test]
fn a_piece_starts_sounding_with_its_voice_not_with_the_silence_before_it() {
    // Giulia and Marco start a piece with about 0.23 s of silence: the first word is not said yet.
    let rig = rig(Setup {
        spoken: Duration::from_millis(500),
        lead: Duration::from_millis(300),
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("ciao".into()));
    let (s, announced, played) = first_sounding(&rig, 2 * SECOND);
    let wait = announced - played;
    // not before the 300 ms of silence have played; on a slow machine the announcement can come later, never as late as
    // the end of the voice (500 ms more)
    assert!(
        (Duration::from_millis(270)..Duration::from_millis(600)).contains(&wait),
        "{wait:?}"
    );
    assert!(s.exact && close(s.duration, 500), "{s:?}");
    rig.until(&Event::Idle, 2 * SECOND);
}

#[test]
fn a_streamed_piece_starts_sounding_when_its_voice_reaches_the_microphone() {
    // A voice prepared from a recording hands over up to half a second of its noise floor first.
    // It synthesizes for longer than the silence lasts.
    let rig = rig(Setup {
        work: Duration::from_millis(150),
        spoken: Duration::from_millis(800),
        lead: Duration::from_millis(400),
        streaming: true,
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("ciao".into()));
    let (s, announced, played) = first_sounding(&rig, 2 * SECOND);
    let wait = announced - played;
    // not before the 400 ms of noise floor have played; on a slow machine later, never as late as the end of the voice
    assert!(
        (Duration::from_millis(370)..Duration::from_millis(700)).contains(&wait),
        "{wait:?}"
    );
    assert!(!s.exact);
    // The guess, then the exact duration: the voice only, not the silence before it.
    let events = rig.until(&Event::Idle, 3 * SECOND);
    let exact = soundings(&events);
    assert!(
        exact.len() == 1 && exact[0].exact && close(exact[0].duration, 800),
        "{exact:?}"
    );
}

#[test]
fn a_piece_of_silence_still_sounds_from_its_first_sample() {
    let rig = rig(Setup {
        spoken: Duration::ZERO,
        lead: Duration::from_millis(300),
        ..Setup::default()
    });
    rig.ready();
    rig.engine.send(Command::Speak("ciao".into()));
    let (s, announced, played) = first_sounding(&rig, 2 * SECOND);
    assert!(announced - played < Duration::from_millis(60));
    assert!(s.exact && close(s.duration, 300), "{s:?}");
    rig.until(&Event::Idle, 2 * SECOND);
}

#[test]
fn stop_during_the_silence_before_the_voice_says_nothing_was_said() {
    for streaming in [false, true] {
        let rig = rig(Setup {
            work: Duration::from_millis(20),
            spoken: Duration::from_millis(600),
            lead: Duration::from_millis(500),
            streaming,
            ..Setup::default()
        });
        rig.ready();
        rig.engine.send(Command::Speak("uno due".into()));
        let deadline = Instant::now() + SECOND;
        while rig.log.first("play").is_none() && Instant::now() < deadline {
            std::thread::sleep(Duration::from_millis(5));
        }
        std::thread::sleep(Duration::from_millis(200));
        rig.engine.stop();
        let events = rig.until(&Event::Idle, SECOND);
        let said = events.iter().find_map(|e| match e {
            Event::Interrupted(s) => Some(s.clone()),
            _ => None,
        });
        assert_eq!(
            said.map(|s| (s.done, s.cut)),
            Some((0, None)),
            "streaming {streaming}: {events:?}"
        );
        assert!(soundings(&events).is_empty(), "{events:?}");
    }
}

#[test]
fn each_voice_starts_from_the_first_guess_of_its_pace() {
    let rig = rig(Setup {
        work: Duration::from_millis(5),
        spoken: Duration::from_millis(900),
        streaming: true,
        ..Setup::default()
    });
    rig.ready();
    let guess = |rig: &Rig| {
        rig.engine.send(Command::Speak("ciao".into()));
        let events = rig.until(&Event::Idle, 3 * SECOND);
        soundings(&events)
            .into_iter()
            .find(|s| !s.exact)
            .expect("a guess")
            .duration
    };
    let first = Duration::from_secs_f32(FAKE_WEIGHT * FIRST_GUESS_SECONDS_PER_UNIT);
    assert!(close(guess(&rig), first.as_millis() as u64));
    // The same voice learns its pace from what it said...
    assert!(guess(&rig) > first + Duration::from_millis(200));
    // ...and another voice starts over.
    rig.engine
        .send(Command::Voice(VoiceId::Klein("Marco".into())));
    rig.until(&Event::Voice(VoiceId::Klein("Marco".into())), SECOND);
    assert!(close(guess(&rig), first.as_millis() as u64));
}

#[test]
fn a_voice_change_goes_on_from_the_first_word_not_said() {
    let rig = rig(Setup {
        work: Duration::from_millis(5),
        spoken: Duration::from_millis(500),
        ..Setup::default()
    });
    rig.ready();
    let text = "uno due tre quattro cinque sei sette otto";
    rig.engine.send(Command::Speak(text.into()));
    rig.until(&Event::Speaking, SECOND);
    std::thread::sleep(Duration::from_millis(300));
    rig.engine
        .send(Command::Voice(VoiceId::Klein("Marco".into())));
    let events = rig.until(&Event::Idle, 10 * SECOND);
    let said: Vec<&str> = soundings(&events)
        .iter()
        .map(|s| &text[s.span.clone()])
        .collect();
    assert_eq!(said.len(), 8, "{said:?}");
    assert_eq!(said.join(" "), text);
}

#[test]
fn pieces_map_to_the_typed_text_by_their_words() {
    let text = "Alle 10:30, il Dott. Rossi; poi J. R. Tolkien.";
    let sentence = kalliope_text::normalize_spans(text).remove(0);
    let spoken = &sentence.text;
    // Cut the spoken sentence after each comma or semicolon, as Giulia does.
    let mut pieces = Vec::new();
    let mut rest = spoken.as_str();
    while let Some(i) = rest.find([',', ';']) {
        pieces.push(&rest[..=i]);
        rest = rest[i + 1..].trim_start();
    }
    pieces.push(rest);
    let said: Vec<&str> = sources(&sentence.words, pieces.into_iter())
        .into_iter()
        .map(|(r, _)| &text[r])
        .collect();
    assert_eq!(said[0], "Alle 10:30,");
    assert_eq!(said[1], "il Dott. Rossi;");
    assert!(said.last().unwrap().ends_with("Tolkien."), "{said:?}");
    // A count that runs short still reaches the end of the text.
    let all = sources(&sentence.words, ["alle"].into_iter());
    assert_eq!(all, vec![(0..text.len(), 0..sentence.words.len())]);
}

/// Giulia and Marco say where each word of a piece begins: its share of the piece counts from where
/// the voice begins. A voice that does not say, or says a count that does not match the words,
/// shares the piece by how long each word takes to say.
#[test]
fn words_start_where_the_voice_says_them_or_by_how_long_they_take() {
    let piece = Piece {
        what: What::Test,
        source: 0..12,
        spoken: vec![
            Spoken {
                byte: 0,
                weight: 5.0,
            },
            Spoken {
                byte: 6,
                weight: 15.0,
            },
        ],
        phrase: None,
        ends_phrase: true,
        first: true,
        last: true,
        tokens: 0,
        seed: 0,
        ticket: 0,
    };
    let shares = |w: Arc<[WordStart]>| -> Vec<(usize, f32)> {
        w.iter().map(|s| (s.byte, s.share)).collect()
    };
    // 1000 samples of silence, then the voice to 3000: the second word begins at 2500.
    assert_eq!(
        shares(word_starts(&piece, &[900, 2500], 1000, 3000)),
        [(0, 0.0), (6, 0.75)]
    );
    assert_eq!(
        shares(word_starts(&piece, &[], 0, 0)),
        [(0, 0.0), (6, 0.25)]
    );
    assert_eq!(
        shares(word_starts(&piece, &[1000], 1000, 3000)),
        [(0, 0.0), (6, 0.25)]
    );
}

/// The words of a written number all start where it was typed, and weigh what they take to say:
/// «1.250» is three long words, «€» one.
#[test]
fn a_written_number_weighs_the_words_it_is_said_with() {
    let text = "Costa 1.250 €, va bene.";
    let sentence = kalliope_text::normalize_spans(text).remove(0);
    let s = spoken(
        text,
        &sentence.text,
        &sentence.words,
        kalliope_phonemes::phonemize,
    );
    let bytes: Vec<usize> = s.iter().map(|w| w.byte).collect();
    // «euro» is read with «1.250» (from the bytes of both), and shown on «€».
    assert_eq!(bytes, [0, 6, 6, 6, 12, 17, 20], "{}", sentence.text);
    let number: f32 = s[1..4].iter().map(|w| w.weight).sum();
    assert!(number > 3.0 * s[0].weight, "{s:?}");
    // «bene.» ends the sentence: its pause is part of it.
    assert_eq!(spoken_weight("bˈɛne."), PER_WORD + 4.0 + PAUSE_SENTENCE);
    assert_eq!(spoken_weight("sˈi,"), PER_WORD + 2.0 + PAUSE_CLAUSE);
    assert_eq!(spoken_weight("skrˈitːo"), PER_WORD + 6.0);
}

/// With the real model: each piece Giulia says is announced with where its words begin, one for
/// each spoken word, at the bytes where they were typed.
#[test]
fn giulia_announces_where_her_words_begin() {
    let (Some(dir), Some(_)) = (
        std::env::var_os("KALLIOPE_MODEL_DIR"),
        std::env::var_os("KALLIOPE_ORT_LIB"),
    ) else {
        eprintln!("skipped: set KALLIOPE_MODEL_DIR and KALLIOPE_ORT_LIB to run");
        return;
    };
    let voice = Voice::load(&PathBuf::from(dir), "Giulia", &VoiceOptions::default()).unwrap();
    let klein = Klein(voice);
    let text =
        "Per quanto riguarda il bilancio, le spese sono aumentate soprattutto per il personale.";
    let pieces = klein.pieces(text, 0);
    assert_eq!(pieces.len(), 2);
    let (mut offsets, mut len, mut voice_at) = (Vec::new(), 0, 0);
    klein
        .speak(&pieces[1], &mut |a, o| {
            offsets = o.to_vec();
            len = a.len();
            voice_at = kalliope_voice::voice_starts(a).unwrap();
            true
        })
        .unwrap();
    assert_eq!(offsets.len(), 8);
    let starts = word_starts(&pieces[1], &offsets, voice_at, len);
    let typed: Vec<&str> = starts
        .iter()
        .map(|w| text[w.byte..].split(' ').next().unwrap())
        .collect();
    assert_eq!(
        typed,
        [
            "le",
            "spese",
            "sono",
            "aumentate",
            "soprattutto",
            "per",
            "il",
            "personale."
        ]
    );
    assert!(starts[0].share < 0.05, "{starts:?}");
    assert!(
        starts.windows(2).all(|w| w[0].share < w[1].share),
        "{starts:?}"
    );
    // «soprattutto» is said quickly for its letters: «per» starts before 70% of the piece, which
    // ends with the silence after the full stop.
    assert!((0.45..0.7).contains(&starts[5].share), "{starts:?}");
}
