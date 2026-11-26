// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Creating a personal voice in the app (#15, #16): recording it from a real microphone or reading
//! it from an audio file, choosing the clearest stretch and listening to it, naming the voice and
//! saving it. Each job runs on its own thread and reports through the callback it was given, so the
//! window never waits; each can be stopped or cancelled at any moment.
//!
//! The work itself is `kalliope-sample` (shared with `kalliope-cli voice`) and `kalliope-mic`.

use crate::engine::{KLEIN_VOICES, VoiceId};
use kalliope_sample::{Audio, Problem, Quality, Sample, Stretch};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

/// How often the level meter gets a value while recording.
pub const LEVEL_EVERY: Duration = Duration::from_millis(50);
/// Speech the voice is made from: the guide while recording (Pocket TTS uses 12 s; beyond about
/// 20 s it ends sentences early, so longer recordings give their best 12 s).
pub const TARGET_SPEECH_SECONDS: f32 = kalliope_sample::VOICE_SECONDS;
/// A recording stops by itself after this long.
pub const MAX_RECORDING_SECONDS: f32 = 60.0;
/// Longest voice name, in bytes of its file name (file systems allow 255).
const MAX_NAME_BYTES: usize = 180;

/// The consent the person must give, shown before recording or importing (from the README).
pub const CONSENT: &str = "Registra la tua voce, oppure la voce di una persona che ti ha dato il suo consenso esplicito: imitare la voce di altri senza consenso non è permesso.";

/// A microphone to record from.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Microphone {
    /// What to give to [`Recording::start`].
    pub name: String,
    /// The name the system shows.
    pub label: String,
    /// The system's default input, recorded from when none is chosen.
    pub default: bool,
}

/// The microphones on this computer, the default first; never Kalliope's own.
pub fn microphones() -> Result<Vec<Microphone>, String> {
    kalliope_mic::sources()
        .map(|list| {
            list.into_iter()
                .map(|s| Microphone {
                    name: s.name,
                    label: s.description,
                    default: s.default,
                })
                .collect()
        })
        .map_err(|e| mic_message(&e))
}

fn mic_message(e: &kalliope_mic::Error) -> String {
    eprintln!("kalliope: recording: {e}");
    match e.kind() {
        kalliope_mic::ErrorKind::NoSource => {
            "Non trovo un microfono. Collegane uno (meglio una cuffia con microfono), poi riprova.".into()
        }
        kalliope_mic::ErrorKind::Unavailable => {
            "Su questo computer non posso registrare: serve PipeWire, il servizio audio dei sistemi Linux di oggi.".into()
        }
        kalliope_mic::ErrorKind::NotRunning => {
            "Il servizio audio del computer non risponde: riprova fra qualche secondo.".into()
        }
        _ => "Il microfono non si è aperto. Riprova, o scegli un altro microfono.".into(),
    }
}

/// Where a take comes from.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Origin {
    Microphone(String),
    File(PathBuf),
}

/// A recording, or the sound of a file, ready to make a voice from.
#[derive(Debug, Clone)]
pub struct Take {
    pub origin: Origin,
    sample: Arc<Sample>,
    /// The recording as a WAV file in a temporary folder (recordings only), for players and for
    /// a person who wants to keep it.
    pub wav: Option<PathBuf>,
    /// Seconds in all.
    pub seconds: f32,
    /// The whole recording.
    pub quality: Quality,
    /// What is wrong with it; a [`Problem::blocks`] one means no voice can be made.
    pub problems: Vec<Problem>,
    /// At most three stretches of at most 12 s, the clearest first: the voice is made from one.
    pub stretches: Vec<Stretch>,
    /// Something to tell the person beside the problems: the microphone went away midway, or only
    /// the start of a long file was read.
    pub note: Option<String>,
}

impl Take {
    fn new(origin: Origin, audio: &Audio, wav: Option<PathBuf>, mut note: Option<String>) -> Take {
        let sample = Sample::new(audio);
        if sample.truncated && note.is_none() {
            note = Some(format!(
                "Il file è lungo: ho cercato la voce nei primi {} minuti.",
                (kalliope_sample::MAX_SECONDS / 60.0) as u32
            ));
        }
        Take {
            origin,
            wav,
            seconds: audio.seconds(),
            quality: sample.quality,
            problems: sample.problems.clone(),
            stretches: sample.stretches.clone(),
            note,
            sample: Arc::new(sample),
        }
    }

    /// Whether a voice can be made from stretch `i`.
    pub fn usable(&self, i: usize) -> bool {
        self.sample.usable(i)
    }

    /// What to tell the person about stretch `i` (or the whole take when it has no stretch), in
    /// plain Italian, the most serious first.
    pub fn messages(&self, i: usize) -> Vec<String> {
        let problems = self
            .stretches
            .get(i)
            .map_or(&self.problems, |s| &s.problems);
        self.note
            .iter()
            .cloned()
            .chain(problems.iter().map(|p| p.message().to_string()))
            .collect()
    }

    /// The samples of stretch `i`, mono at [`kalliope_sample::RATE`].
    pub fn stretch_audio(&self, i: usize) -> &[f32] {
        self.sample.stretch(i)
    }
}

/// What a recording reports.
#[derive(Debug, Clone)]
pub enum RecordingEvent {
    /// The microphone is open: speak now.
    Started { microphone: String },
    /// About every [`LEVEL_EVERY`]: the level of the last moment (0 to 1, RMS and peak), the
    /// seconds recorded and the seconds of speech in them (the guide: [`TARGET_SPEECH_SECONDS`]).
    Level {
        rms: f32,
        peak: f32,
        seconds: f32,
        speech_seconds: f32,
    },
    /// The recording ended (Stop, the longest length, or the microphone went away: then
    /// [`Take::note`] says so and the take holds what was recorded until then).
    Finished(Take),
    /// Nothing was recorded: why, in plain Italian.
    Failed(String),
}

/// A job on its own thread that can be told to finish or to give up.
struct Job {
    finish: Arc<AtomicBool>,
    cancel: Arc<AtomicBool>,
    thread: Option<JoinHandle<()>>,
}

impl Job {
    fn spawn(
        name: &str,
        work: impl FnOnce(Arc<AtomicBool>, Arc<AtomicBool>) + Send + 'static,
    ) -> Job {
        let (finish, cancel) = (
            Arc::new(AtomicBool::new(false)),
            Arc::new(AtomicBool::new(false)),
        );
        let (f, c) = (finish.clone(), cancel.clone());
        let thread = std::thread::Builder::new()
            .name(name.into())
            .spawn(move || work(f, c))
            .ok();
        Job {
            finish,
            cancel,
            thread,
        }
    }
}

impl Job {
    /// Tells the job to give up and lets it end on its own, without waiting for it.
    fn abandon(mut self) {
        self.cancel.store(true, Ordering::SeqCst);
        drop(self.thread.take());
    }
}

impl Drop for Job {
    fn drop(&mut self) {
        // Dropped without a word: whatever it was doing is not wanted any more.
        self.cancel.store(true, Ordering::SeqCst);
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
    }
}

/// A recording from a microphone in progress.
pub struct Recording(Job);

impl Recording {
    /// Starts recording from `microphone` (a [`Microphone::name`]) or the default one. Events come
    /// on the recording's thread.
    pub fn start(
        microphone: Option<String>,
        temp: PathBuf,
        on_event: impl Fn(RecordingEvent) + Send + 'static,
    ) -> Recording {
        Recording(Job::spawn("kalliope-record", move |finish, cancel| {
            record(microphone.as_deref(), &temp, &finish, &cancel, &on_event)
        }))
    }

    /// Ends the recording: [`RecordingEvent::Finished`] follows.
    pub fn stop(&self) {
        self.0.finish.store(true, Ordering::SeqCst);
    }

    /// Throws the recording away: no more events. Never waits.
    pub fn cancel(self) {
        self.0.abandon();
    }
}

/// Numbers the recordings kept in the temporary folder.
static TAKES: AtomicU64 = AtomicU64::new(0);

fn record(
    microphone: Option<&str>,
    temp: &Path,
    finish: &AtomicBool,
    cancel: &AtomicBool,
    on_event: &dyn Fn(RecordingEvent),
) {
    let recorder = match kalliope_mic::Recorder::open(microphone) {
        Ok(r) => r,
        Err(e) => return on_event(RecordingEvent::Failed(mic_message(&e))),
    };
    let rate = kalliope_mic::Recorder::RATE;
    let label = recorder.source().description.clone();
    on_event(RecordingEvent::Started {
        microphone: label.clone(),
    });
    let mut samples: Vec<f32> = Vec::with_capacity((MAX_RECORDING_SECONDS * rate as f32) as usize);
    let mut speech_seconds = 0.0;
    let mut last_speech = Instant::now();
    let mut note = None;
    let block = (rate as f32 * LEVEL_EVERY.as_secs_f32()) as usize;
    loop {
        std::thread::sleep(LEVEL_EVERY);
        if cancel.load(Ordering::SeqCst) {
            return;
        }
        recorder.read(&mut samples);
        let recent = &samples[samples.len().saturating_sub(block)..];
        let rms = (recent.iter().map(|s| s * s).sum::<f32>() / recent.len().max(1) as f32).sqrt();
        let peak = recent.iter().fold(0.0f32, |m, s| m.max(s.abs()));
        if last_speech.elapsed() >= Duration::from_millis(500) {
            speech_seconds =
                kalliope_sample::analysis::Analysis::new(&samples, rate).speech_seconds();
            last_speech = Instant::now();
        }
        let seconds = samples.len() as f32 / rate as f32;
        on_event(RecordingEvent::Level {
            rms,
            peak,
            seconds,
            speech_seconds,
        });
        if !recorder.is_connected() {
            note = Some(format!(
                "Il microfono «{label}» si è scollegato: tengo quello che hai registrato fino a quel momento."
            ));
            break;
        }
        if finish.load(Ordering::SeqCst) || seconds >= MAX_RECORDING_SECONDS {
            break;
        }
    }
    recorder.read(&mut samples);
    drop(recorder);
    if samples.len() < rate as usize / 2 {
        return on_event(RecordingEvent::Failed(note.unwrap_or_else(|| {
            "Non è arrivato nessun suono dal microfono. Controlla che sia collegato e acceso, poi riprova.".into()
        })));
    }
    let audio = Audio {
        samples,
        rate,
        truncated: false,
    };
    let wav = temp.join(format!(
        "registrazione-{}.wav",
        TAKES.fetch_add(1, Ordering::SeqCst) + 1
    ));
    let wav = crate::paths::create_private_dir(temp)
        .and_then(|()| std::fs::write(&wav, kalliope_sample::wav::encode(&audio.samples, rate)))
        .map(|()| wav)
        .map_err(|e| {
            eprintln!(
                "kalliope: cannot keep the recording in {}: {e}",
                temp.display()
            )
        })
        .ok();
    if cancel.load(Ordering::SeqCst) {
        return;
    }
    on_event(RecordingEvent::Finished(Take::new(
        Origin::Microphone(label),
        &audio,
        wav,
        note,
    )));
}

/// What reading a file reports.
#[derive(Debug, Clone)]
pub enum ImportEvent {
    /// Share of the file read, 0 to 1.
    Progress(f32),
    Finished(Take),
    /// The file cannot be used: why, in plain Italian.
    Failed(String),
}

/// A file being read.
pub struct Import(Job);

impl Import {
    pub fn start(path: PathBuf, on_event: impl Fn(ImportEvent) + Send + 'static) -> Import {
        Import(Job::spawn("kalliope-import", move |_, cancel| {
            let read = kalliope_sample::read_file(&path, &cancel, &mut |p| {
                on_event(ImportEvent::Progress(p))
            });
            match read {
                Ok(audio) => {
                    let take = Take::new(Origin::File(path), &audio, None, None);
                    if !cancel.load(Ordering::SeqCst) {
                        on_event(ImportEvent::Finished(take));
                    }
                }
                Err(kalliope_sample::ReadError::Cancelled) => {}
                Err(e) => {
                    eprintln!("kalliope: import {}: {e:?}", path.display());
                    on_event(ImportEvent::Failed(e.message()));
                }
            }
        }))
    }

    /// Stops reading: no more events. Never waits.
    pub fn cancel(self) {
        self.0.abandon();
    }
}

/// Whether a name can be given to a new voice.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum NameCheck {
    /// Free: the voice will be saved as `file`.
    Free {
        file: String,
    },
    Empty,
    TooLong,
    /// The name of one of Kalliope's voices: allowed if the person wants it, and the menu will
    /// show «Giulia (voce propria)».
    SameAsKalliope {
        name: String,
        file: String,
    },
    /// There is already a personal voice with this name (or one that differs only in capitals):
    /// replace it, or choose another name.
    Exists {
        name: String,
        file: String,
    },
}

impl NameCheck {
    /// What to tell the person, in plain Italian; `None` when the name is free.
    pub fn message(&self) -> Option<String> {
        match self {
            NameCheck::Free { .. } => None,
            NameCheck::Empty => {
                Some("Scrivi un nome per la voce, per esempio «La voce di Anna».".into())
            }
            NameCheck::TooLong => Some("Il nome è troppo lungo: accorcialo un po'.".into()),
            NameCheck::SameAsKalliope { name, .. } => Some(format!(
                "«{name}» è anche il nome di una voce di Kalliope. Puoi tenerlo: nel menu la tua comparirà come «{name} (voce propria)». Oppure scegli un altro nome."
            )),
            NameCheck::Exists { name, .. } => Some(format!(
                "C'è già una voce che si chiama «{name}». Vuoi sostituirla con questa, o preferisci un altro nome?"
            )),
        }
    }

    /// The file name, unless the name is empty or too long.
    fn file(&self) -> Option<&str> {
        match self {
            NameCheck::Free { file }
            | NameCheck::SameAsKalliope { file, .. }
            | NameCheck::Exists { file, .. } => Some(file),
            NameCheck::Empty | NameCheck::TooLong => None,
        }
    }
}

/// The file name (without `.safetensors`) for a voice named `name`: any name a person types, with
/// the few characters no file system takes replaced by look-alikes, so the menu shows it as typed.
pub fn file_stem(name: &str) -> String {
    let mut out: String = name
        .trim()
        .chars()
        .filter(|c| !c.is_control())
        .map(|c| match c {
            '/' => '∕',
            '\\' => '⧵',
            ':' => '꞉',
            '*' => '∗',
            '?' => '？',
            '"' => '＂',
            '<' => '‹',
            '>' => '›',
            '|' => '│',
            c => c,
        })
        .collect();
    // Hidden files on Linux and macOS, names Windows refuses.
    while out.starts_with('.') {
        out.replace_range(..1, "․");
    }
    while out.ends_with(['.', ' ']) {
        out.pop();
    }
    let reserved = ["CON", "PRN", "AUX", "NUL"]
        .iter()
        .any(|r| out.eq_ignore_ascii_case(r))
        || ((out.len() == 4)
            && (out[..3].eq_ignore_ascii_case("COM") || out[..3].eq_ignore_ascii_case("LPT"))
            && out.as_bytes()[3].is_ascii_digit());
    if reserved {
        out.push('_');
    }
    out
}

/// Whether `name` can be given to a new voice in `voices_dir`.
pub fn check_name(name: &str, voices_dir: &Path) -> NameCheck {
    let file = file_stem(name);
    if file.is_empty() {
        return NameCheck::Empty;
    }
    if file.len() > MAX_NAME_BYTES {
        return NameCheck::TooLong;
    }
    let same = |a: &str, b: &str| a.to_lowercase() == b.to_lowercase();
    if let Some(existing) = crate::catalog::voice_files(voices_dir)
        .into_iter()
        .find(|f| same(f, &file))
    {
        return NameCheck::Exists {
            name: existing.clone(),
            file: existing,
        };
    }
    if let Some(klein) = KLEIN_VOICES.iter().find(|k| same(k, &file)) {
        return NameCheck::SameAsKalliope {
            name: (*klein).to_string(),
            file,
        };
    }
    NameCheck::Free { file }
}

/// What making a voice reports.
#[derive(Debug, Clone, PartialEq)]
pub enum CreateEvent {
    /// 0 to 1.
    Progress(f32),
    /// Saved: the voice to put in the menu and to choose.
    Done(VoiceId),
    /// Not made, in plain Italian; nothing was written.
    Failed(String),
}

/// A voice being made.
pub struct Creation(Job);

impl Creation {
    /// Makes a voice from stretch `stretch` of `take` and saves it in `voices_dir` under the file
    /// name [`check_name`] gave; `confirmed` accepts a name that is Kalliope's or replaces an
    /// existing voice. `Err` when the name cannot be used as it is: say [`NameCheck::message`].
    pub fn start(
        take: &Take,
        stretch: usize,
        name: &str,
        confirmed: bool,
        model: kalliope_sample::Model,
        voices_dir: &Path,
        on_event: impl Fn(CreateEvent) + Send + 'static,
    ) -> Result<Creation, NameCheck> {
        let check = check_name(name, voices_dir);
        let file = match (&check, check.file()) {
            (NameCheck::Free { .. }, Some(f)) => f.to_string(),
            (_, Some(f)) if confirmed => f.to_string(),
            _ => return Err(check),
        };
        if !take.usable(stretch) {
            let message = take
                .messages(stretch)
                .into_iter()
                .next()
                .unwrap_or_else(|| "Questa registrazione non basta per creare una voce.".into());
            on_event(CreateEvent::Failed(message));
            return Ok(Creation(Job::spawn("kalliope-create", |_, _| {})));
        }
        let samples = take.stretch_audio(stretch).to_vec();
        let out = voices_dir.join(format!("{file}.safetensors"));
        Ok(Creation(Job::spawn("kalliope-create", move |_, cancel| {
            let progress = |p| on_event(CreateEvent::Progress(p));
            let made =
                kalliope_sample::prepare_voice(&model, &samples, &out, &cancel, &mut { progress });
            match made {
                Ok(()) => on_event(CreateEvent::Done(VoiceId::Own(file))),
                Err(kalliope_sample::PrepareError::Cancelled) => {}
                Err(e) => {
                    eprintln!("kalliope: making the voice {}: {e:?}", out.display());
                    on_event(CreateEvent::Failed(
                        "Non sono riuscita a creare la voce. Riprova; se succede ancora, prova con un'altra registrazione.".into(),
                    ));
                }
            }
        })))
    }

    /// Stops making the voice: nothing is saved and no more events come. Never waits.
    pub fn cancel(self) {
        self.0.abandon();
    }
}

/// Plays a stretch on the speakers only, never into the microphone of the call.
#[derive(Default)]
pub struct Listening(Mutex<Option<kalliope_mic::Player>>);

impl Listening {
    /// Plays `samples` (at [`kalliope_sample::RATE`]) from the start; returns how long it lasts.
    pub fn play(&self, samples: &[f32]) -> Result<Duration, String> {
        let mut player = self.0.lock().unwrap_or_else(|e| e.into_inner());
        if player.is_none() {
            *player = Some(
                kalliope_mic::Player::open(
                    "kalliope-listen",
                    "Kalliope (ascolto)",
                    kalliope_sample::RATE,
                )
                .map_err(|e| {
                    eprintln!("kalliope: listening: {e}");
                    "Non riesco a farti ascoltare la registrazione dalle casse.".to_string()
                })?,
            );
        }
        let p = player.as_ref().expect("just opened");
        p.clear();
        p.play(samples);
        Ok(Duration::from_secs_f32(
            samples.len() as f32 / kalliope_sample::RATE as f32,
        ))
    }

    /// Stops what is playing.
    pub fn stop(&self) {
        if let Some(p) = self.0.lock().unwrap_or_else(|e| e.into_inner()).as_ref() {
            p.clear();
        }
    }

    /// Seconds still to play.
    pub fn remaining(&self) -> f32 {
        self.0
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .as_ref()
            .map_or(0.0, |p| p.queued_seconds())
    }
}

/// The temporary folder of this run's recordings, removed when Kalliope closes.
pub struct TempFolder(pub PathBuf);

impl TempFolder {
    pub fn new() -> TempFolder {
        TempFolder(crate::paths::private_temp(&format!(
            "kalliope-{}",
            std::process::id()
        )))
    }
}

impl Drop for TempFolder {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn voices(name: &str, files: &[&str]) -> PathBuf {
        let d = std::env::temp_dir().join(format!("kalliope-names-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&d);
        std::fs::create_dir_all(&d).unwrap();
        for f in files {
            std::fs::write(d.join(format!("{f}.safetensors")), b"").unwrap();
        }
        d
    }

    #[test]
    fn any_name_a_person_types_becomes_a_safe_file_name() {
        assert_eq!(file_stem("  La voce di Anna  "), "La voce di Anna");
        assert_eq!(file_stem("Mamma/Papà"), "Mamma∕Papà");
        assert_eq!(file_stem("..nascosta"), "․.nascosta");
        assert_eq!(file_stem("Ciao..."), "Ciao");
        assert_eq!(file_stem("a\u{0}b\nc"), "abc");
        assert_eq!(file_stem("Zoë 李 مريم 😀"), "Zoë 李 مريم 😀");
        assert_eq!(file_stem("con"), "con_");
        assert_eq!(file_stem("Com1"), "Com1_");
        assert_eq!(file_stem("Domande?"), "Domande？");
    }

    #[test]
    fn names_are_checked_against_kalliope_and_the_saved_voices() {
        let d = voices("check", &["Anna"]);
        assert_eq!(check_name("   ", &d), NameCheck::Empty);
        assert_eq!(check_name(&"x".repeat(300), &d), NameCheck::TooLong);
        assert!(matches!(check_name("anna", &d), NameCheck::Exists { name, .. } if name == "Anna"));
        assert!(
            matches!(check_name("GIULIA", &d), NameCheck::SameAsKalliope { name, file } if name == "Giulia" && file == "GIULIA")
        );
        assert_eq!(
            check_name("Marta", &d),
            NameCheck::Free {
                file: "Marta".into()
            }
        );
        for c in [
            check_name("", &d),
            check_name("anna", &d),
            check_name("marco", &d),
        ] {
            assert!(c.message().is_some_and(|m| !m.is_empty()));
        }
    }

    fn take(seconds: f32) -> Take {
        // Voiced syllables with a hiss between them, and pauses: enough like speech.
        let rate = 24_000;
        let mut x = 7u32;
        let samples = (0..(seconds * rate as f32) as usize)
            .map(|i| {
                let t = i as f32 / rate as f32;
                let phase = (t * 4.0).fract();
                x ^= x << 13;
                x ^= x >> 17;
                x ^= x << 5;
                let hiss = (x as f32 / u32::MAX as f32) * 2.0 - 1.0;
                ((t / 2.0).fract() < 0.85) as u8 as f32
                    * if phase < 0.12 {
                        0.1 * hiss
                    } else if phase < 0.7 {
                        0.3 * (t * 150.0 * std::f32::consts::TAU).sin()
                    } else {
                        0.0
                    }
            })
            .collect();
        let audio = Audio {
            samples,
            rate,
            truncated: false,
        };
        Take::new(Origin::File("prova.wav".into()), &audio, None, None)
    }

    fn model() -> kalliope_sample::Model {
        kalliope_sample::Model {
            pocket_dir: "/nessuna/cartella".into(),
            options: Default::default(),
        }
    }

    #[test]
    fn a_taken_name_is_refused_until_confirmed_and_nothing_is_written() {
        let d = voices("create", &["Anna"]);
        let t = take(15.0);
        assert!(t.usable(0), "{:?}", t.stretches);
        let refused = Creation::start(&t, 0, "anna", false, model(), &d, |_| {});
        assert!(matches!(refused, Err(NameCheck::Exists { .. })));
        assert!(matches!(
            Creation::start(&t, 0, " ", true, model(), &d, |_| {}),
            Err(NameCheck::Empty)
        ));
        // Confirmed, but the model is missing: it fails with a message and leaves the old voice.
        let (tx, rx) = std::sync::mpsc::channel();
        let job = Creation::start(&t, 0, "anna", true, model(), &d, move |e| {
            let _ = tx.send(e);
        })
        .unwrap();
        let events: Vec<CreateEvent> = rx.iter().collect();
        drop(job);
        assert!(
            matches!(events.last(), Some(CreateEvent::Failed(_))),
            "{events:?}"
        );
        assert_eq!(crate::catalog::voice_files(&d), ["Anna"]);
        assert_eq!(std::fs::read_dir(&d).unwrap().count(), 1);
    }

    #[test]
    fn a_take_too_short_makes_no_voice_and_says_why() {
        let d = voices("short", &[]);
        let t = take(2.5);
        assert!(!t.usable(0));
        let (tx, rx) = std::sync::mpsc::channel();
        let job = Creation::start(&t, 0, "Breve", false, model(), &d, move |e| {
            let _ = tx.send(e);
        })
        .unwrap();
        let events: Vec<CreateEvent> = rx.iter().collect();
        drop(job);
        assert!(
            matches!(&events[..], [CreateEvent::Failed(m)] if m.contains("poco parlato")),
            "{events:?}"
        );
    }

    #[test]
    fn cancelling_an_import_midway_sends_nothing_more_and_never_waits() {
        let path = std::env::temp_dir().join(format!("kalliope-cancel-{}.wav", std::process::id()));
        let long: Vec<f32> = (0..24_000 * 240)
            .map(|i| (i as f32 * 0.05).sin() * 0.3)
            .collect();
        std::fs::write(&path, kalliope_sample::wav::encode(&long, 24_000)).unwrap();
        let (tx, rx) = std::sync::mpsc::channel();
        let job = Import::start(path.clone(), move |e| {
            let _ = tx.send(e);
        });
        let at = Instant::now();
        job.cancel();
        assert!(at.elapsed() < Duration::from_millis(20));
        let events: Vec<ImportEvent> = rx.iter().collect();
        assert!(
            events.iter().all(|e| matches!(e, ImportEvent::Progress(_))),
            "{events:?}"
        );
        std::fs::remove_file(&path).unwrap();
    }

    #[test]
    fn a_missing_or_wrong_file_is_explained() {
        let (tx, rx) = std::sync::mpsc::channel();
        let job = Import::start("/non/esiste.opus".into(), move |e| {
            let _ = tx.send(e);
        });
        let events: Vec<ImportEvent> = rx.iter().collect();
        drop(job);
        assert!(
            matches!(events.last(), Some(ImportEvent::Failed(m)) if m.contains("Non riesco ad aprire")),
            "{events:?}"
        );
    }
}
