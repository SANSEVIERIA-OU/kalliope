// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The speaking thread: normalizes the text and speaks it on the audio output piece by piece, so
//! speech starts after the first piece and the window never waits.
//!
//! Two kinds of voices: Giulia and Marco (Klein: each sentence cut at its commas into pieces of a
//! few seconds), and voices prepared from a recording of their owner (Pocket TTS, streamed frame
//! by frame).
//!
//! Stop and closing never wait for the model. The output sits on a [`Line`] shared with the
//! window: Stop empties it at once and makes the piece being synthesized go nowhere, and closing
//! takes the microphone away before the speaking thread finishes its piece.

use crate::audio::{self, MicError, Output};
use kalliope_voice::pocket::{Chunk, Pocket, PocketOptions, VoiceState};
use kalliope_voice::{Voice, VoiceOptions};
use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::mpsc::{Receiver, RecvTimeoutError, Sender, channel};
use std::sync::{Arc, Mutex, MutexGuard};
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

/// The voices of the Klein model.
pub const KLEIN_VOICES: [&str; 2] = ["Giulia", "Marco"];

/// Phoneme tokens of the first piece of a text: about one clause, so the first sound comes quickly.
/// A clause is never cut, so a longer first clause makes a longer first piece.
const FIRST_PIECE_TOKENS: usize = 60;
/// Most phoneme tokens in one piece: a few seconds of speech. Larger pieces cut fewer commas;
/// smaller ones keep memory and the wait on closing low. Between the two, each piece takes the
/// clauses that can be synthesized while the audio already queued plays, measured on this computer.
const PIECE_TOKENS: usize = 150;
/// Phoneme tokens of the clauses after a piece that the model reads but does not say.
const CONTEXT_TOKENS: usize = 80;
/// Seconds of work per phoneme token before anything is measured: a slow computer.
const FIRST_GUESS_SECONDS_PER_TOKEN: f32 = 0.012;
/// The next piece is synthesized when less than this much audio is still queued: enough to hide
/// the time it takes, and memory stays the same whatever the length of the text.
const LOOKAHEAD_SECONDS: f32 = 3.0;
/// How often the thread looks at the microphone while nothing is said.
const WATCH: Duration = Duration::from_millis(500);
/// How often it tries to open the microphone again while PipeWire does not answer.
const RETRY: Duration = Duration::from_secs(1);

/// A voice: Giulia or Marco, or one prepared from a recording (its file name without
/// `.safetensors`). A prepared voice may have any name, Giulia and Marco included.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum VoiceId {
    Klein(String),
    Own(String),
}

impl Default for VoiceId {
    fn default() -> Self {
        VoiceId::Klein(KLEIN_VOICES[0].into())
    }
}

impl VoiceId {
    /// Reads the value stored in the settings: `NAME.safetensors` for a prepared voice, a Klein
    /// name, or (as Kalliope 0.2 stored them) the bare name of a prepared voice.
    pub fn parse(value: &str) -> Option<VoiceId> {
        let value = value.trim();
        if let Some(name) = value.strip_suffix(".safetensors") {
            return (!name.is_empty()).then(|| VoiceId::Own(name.into()));
        }
        if let Some(klein) = KLEIN_VOICES.iter().find(|v| v.eq_ignore_ascii_case(value)) {
            return Some(VoiceId::Klein((*klein).into()));
        }
        (!value.is_empty()).then(|| VoiceId::Own(value.into()))
    }

    /// The value stored in the settings.
    pub fn key(&self) -> String {
        match self {
            VoiceId::Klein(name) => name.clone(),
            VoiceId::Own(name) => format!("{name}.safetensors"),
        }
    }

    /// The name in the voice menu. A prepared voice named like Giulia or Marco says what it is.
    pub fn label(&self) -> String {
        match self {
            VoiceId::Klein(name) => name.clone(),
            VoiceId::Own(name) if KLEIN_VOICES.iter().any(|v| v.eq_ignore_ascii_case(name)) => {
                format!("{name} (voce propria)")
            }
            VoiceId::Own(name) => name.clone(),
        }
    }
}

/// Whether `text` has anything to say: at least one word once emoji, symbols and punctuation are
/// gone ("…" or "👍" alone have nothing).
pub fn has_speech(text: &str) -> bool {
    kalliope_text::normalize(text)
        .iter()
        .any(|s| s.chars().any(char::is_alphabetic))
}

pub enum Command {
    Speak(String),
    Stop,
    Voice(VoiceId),
    Monitor(bool),
    Quit,
}

#[derive(Clone, Debug, PartialEq)]
pub enum Event {
    Loading,
    /// Ready to speak; `Err` explains why the virtual microphone is missing.
    Ready {
        microphone: Result<(), String>,
    },
    /// The microphone went away, or came back, after `Ready`.
    Microphone(Result<(), String>),
    /// The voice now in use: after it loads, or after another one failed to load.
    Voice(VoiceId),
    /// A phrase was accepted and is being said, and an app records from the microphone.
    Speaking,
    /// A phrase is being said, but no app records from the microphone: nobody in the call hears it.
    NotHeard,
    /// After a phrase nobody heard, an app started recording from the microphone.
    Heard,
    Idle,
    /// The text has nothing to say.
    NothingToSay,
    /// No voice can be used.
    Error(String),
    /// Something failed, but Kalliope can still speak.
    Warning(String),
}

pub struct Engine {
    tx: Sender<(Command, u64)>,
    line: Arc<Line>,
    thread: Option<JoinHandle<()>>,
}

pub struct Config {
    pub model_dir: PathBuf,
    pub voice: VoiceId,
    pub monitor: bool,
    pub ort_lib: Option<PathBuf>,
    /// The Pocket TTS model, for the voices prepared from a recording.
    pub pocket_dir: PathBuf,
    /// The prepared voices, one `NAME.safetensors` each.
    pub voices_dir: PathBuf,
}

type Loader = Box<dyn Fn(&Config, &VoiceId) -> Result<Box<dyn Speaker>, String> + Send>;
type Opener = Box<dyn Fn(u32) -> Result<Box<dyn Output>, MicError> + Send>;

impl Engine {
    pub fn start(config: Config, on_event: impl FnMut(Event) + Send + 'static) -> Engine {
        Engine::start_with(config, on_event, Box::new(load), Box::new(audio::open))
    }

    fn start_with(
        config: Config,
        on_event: impl FnMut(Event) + Send + 'static,
        load: Loader,
        open: Opener,
    ) -> Engine {
        let (tx, rx) = channel();
        let line = Arc::new(Line::default());
        let shared = line.clone();
        let thread = std::thread::Builder::new()
            .name("kalliope-voice".into())
            .spawn(move || {
                let mut engine = Thread::new(config, shared, Box::new(on_event), load, open);
                engine.run(rx);
            })
            .ok();
        Engine { tx, line, thread }
    }

    /// Queues a command. A text to say remembers when it was sent, so a Stop pressed after it
    /// silences it even if the thread has not read it yet.
    pub fn send(&self, command: Command) -> bool {
        if matches!(command, Command::Stop) {
            self.line.stop();
        }
        self.tx.send((command, self.line.ticket())).is_ok()
    }

    /// Silences the microphone now, whatever the thread is doing, and drops what was left to say.
    pub fn stop(&self) {
        self.send(Command::Stop);
    }
}

impl Drop for Engine {
    fn drop(&mut self) {
        // The microphone disappears now; the thread only finishes the piece it is synthesizing,
        // which goes nowhere.
        drop(self.line.close());
        let _ = self.tx.send((Command::Quit, 0));
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
    }
}

/// The output, shared by the window (Stop, closing) and the speaking thread.
#[derive(Default)]
struct Line {
    output: Mutex<Slot>,
    /// Counts Stops: audio synthesized for a text sent before the last Stop is dropped.
    stops: AtomicU64,
}

#[derive(Default)]
struct Slot {
    output: Option<Box<dyn Output>>,
    closed: bool,
}

impl Line {
    fn lock(&self) -> MutexGuard<'_, Slot> {
        self.output.lock().unwrap_or_else(|e| e.into_inner())
    }

    fn ticket(&self) -> u64 {
        self.stops.load(Ordering::SeqCst)
    }

    fn stop(&self) {
        let slot = self.lock();
        self.stops.fetch_add(1, Ordering::SeqCst);
        if let Some(out) = &slot.output {
            out.clear();
        }
    }

    /// Plays `samples` unless a Stop came after `ticket` or the window closed.
    fn play(&self, ticket: u64, samples: &[f32]) -> bool {
        let slot = self.lock();
        match &slot.output {
            Some(out) if self.ticket() == ticket => {
                out.play(samples);
                true
            }
            _ => false,
        }
    }

    fn with<R: Default>(&self, f: impl FnOnce(&dyn Output) -> R) -> R {
        self.lock().output.as_deref().map(f).unwrap_or_default()
    }

    /// Puts `output` in place; returns the old one to drop outside the lock.
    fn replace(&self, output: Box<dyn Output>) -> Option<Box<dyn Output>> {
        let mut slot = self.lock();
        if slot.closed {
            return Some(output);
        }
        slot.output.replace(output)
    }

    fn close(&self) -> Option<Box<dyn Output>> {
        let mut slot = self.lock();
        slot.closed = true;
        self.stops.fetch_add(1, Ordering::SeqCst);
        if let Some(out) = &slot.output {
            out.clear();
        }
        slot.output.take()
    }
}

/// One piece of speech waiting to be said.
struct Piece {
    what: What,
    /// The sentences this piece starts, in words, so they can be read again by another voice
    /// after a voice change.
    starts: Option<String>,
    /// First or last piece of its sentence: inside a sentence the silence at the cut is shortened.
    first: bool,
    last: bool,
    /// Phoneme tokens, for pieces that can be joined with the next clause of their sentence.
    tokens: usize,
    seed: u32,
    /// When its text was sent (see [`Line::stops`]).
    ticket: u64,
}

enum What {
    /// Giulia and Marco: clauses of one sentence, with the clauses around them, which the model
    /// reads for the intonation of the whole sentence (see `Voice::synthesize_in_context`).
    Phonemes {
        text: String,
        before: String,
        after: String,
    },
    Chunk(Chunk),
    #[cfg(test)]
    Test,
}

/// A loaded voice.
trait Speaker: Send {
    fn sample_rate(&self) -> u32;
    /// The pieces to say for `text`.
    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece>;
    /// Synthesizes one piece, handing its audio to `play` as soon as it exists; `play` returns
    /// false when nobody wants it any more.
    fn speak(&self, piece: &Piece, play: &mut dyn FnMut(&[f32]) -> bool) -> Result<(), String>;
}

/// Giulia and Marco.
struct Klein(Voice);

impl Speaker for Klein {
    fn sample_rate(&self) -> u32 {
        self.0.sample_rate()
    }

    /// One piece per clause; [`Thread::next_piece`] joins them as time allows.
    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece> {
        let mut out: Vec<Piece> = Vec::new();
        for sentence in kalliope_text::normalize(text) {
            let phonemes = kalliope_phonemes::phonemize(&sentence);
            let cut = self.0.clauses(&phonemes);
            let n = cut.len();
            out.extend(cut.into_iter().enumerate().map(|(i, (p, tokens))| Piece {
                what: What::Phonemes {
                    text: p,
                    before: String::new(),
                    after: String::new(),
                },
                starts: (i == 0).then(|| sentence.clone()),
                first: i == 0,
                last: i + 1 == n,
                tokens,
                seed: i as u32,
                ticket,
            }));
        }
        out
    }

    fn speak(&self, piece: &Piece, play: &mut dyn FnMut(&[f32]) -> bool) -> Result<(), String> {
        let What::Phonemes {
            text,
            before,
            after,
        } = &piece.what
        else {
            return Ok(());
        };
        let audio = self
            .0
            .synthesize_in_context(before, text, after, piece.seed)
            .map_err(|e| e.to_string())?;
        if !audio.is_empty() {
            play(&audio);
        }
        Ok(())
    }
}

/// A voice prepared from a recording.
struct Own {
    model: Box<Pocket>,
    voice: VoiceState,
}

impl Speaker for Own {
    fn sample_rate(&self) -> u32 {
        self.model.sample_rate()
    }

    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece> {
        let sentences = kalliope_text::normalize(text);
        self.model
            .chunks(&kalliope_voice::pocket::join_sentences(&sentences))
            .into_iter()
            .enumerate()
            .map(|(i, c)| Piece {
                starts: Some(c.prompt.clone()),
                what: What::Chunk(c),
                first: true,
                last: true,
                tokens: 0,
                seed: i as u32,
                ticket,
            })
            .collect()
    }

    fn speak(&self, piece: &Piece, play: &mut dyn FnMut(&[f32]) -> bool) -> Result<(), String> {
        let What::Chunk(chunk) = &piece.what else {
            return Ok(());
        };
        self.model
            .speak_chunk(&self.voice, chunk, piece.seed, play)
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
}

fn load(config: &Config, id: &VoiceId) -> Result<Box<dyn Speaker>, String> {
    match id {
        VoiceId::Klein(name) => {
            let options = VoiceOptions {
                ort_lib: config.ort_lib.clone(),
                ..VoiceOptions::default()
            };
            Voice::load(&config.model_dir, name, &options)
                .map(|v| Box::new(Klein(v)) as Box<dyn Speaker>)
                .map_err(|e| e.to_string())
        }
        VoiceId::Own(name) => {
            let file = config.voices_dir.join(format!("{name}.safetensors"));
            if !file.is_file() {
                return Err(format!(
                    "la voce «{name}» non c'è in {}",
                    config.voices_dir.display()
                ));
            }
            let options = PocketOptions {
                ort_lib: config.ort_lib.clone(),
                ..PocketOptions::default()
            };
            let model = Pocket::load(&config.pocket_dir, &options).map_err(|e| e.to_string())?;
            let voice = model.load_voice(&file).map_err(|e| e.to_string())?;
            Ok(Box::new(Own {
                model: Box::new(model),
                voice,
            }))
        }
    }
}

/// The state of the speaking thread.
struct Thread {
    config: Config,
    line: Arc<Line>,
    on_event: Box<dyn FnMut(Event) + Send>,
    load: Loader,
    open: Opener,
    speaker: Option<(VoiceId, Box<dyn Speaker>)>,
    /// `Err` while the virtual microphone is missing (a silent stand-in keeps time instead).
    microphone: Result<(), MicError>,
    next_try: Instant,
    rate: u32,
    monitor: bool,
    pending: VecDeque<Piece>,
    speaking: bool,
    /// While speaking: whether an app records from the microphone.
    heard: bool,
    /// The last phrase was said while nobody recorded.
    unheard: bool,
    /// Measured seconds of synthesis per phoneme token.
    seconds_per_token: f32,
    /// The last clause said, the context of the next piece of the same sentence.
    previous_clause: String,
}

impl Thread {
    fn new(
        config: Config,
        line: Arc<Line>,
        on_event: Box<dyn FnMut(Event) + Send>,
        load: Loader,
        open: Opener,
    ) -> Thread {
        let monitor = config.monitor;
        Thread {
            config,
            line,
            on_event,
            load,
            open,
            speaker: None,
            microphone: Ok(()),
            next_try: Instant::now(),
            rate: 0,
            monitor,
            pending: VecDeque::new(),
            speaking: false,
            heard: true,
            unheard: false,
            seconds_per_token: FIRST_GUESS_SECONDS_PER_TOKEN,
            previous_clause: String::new(),
        }
    }

    fn emit(&mut self, event: Event) {
        (self.on_event)(event);
    }

    fn run(&mut self, rx: Receiver<(Command, u64)>) {
        self.emit(Event::Loading);
        self.start();
        loop {
            let busy = !self.pending.is_empty() || self.speaking;
            let watching = self.microphone.as_ref().map_or_else(|e| e.retry, |()| true);
            let wait = if !self.pending.is_empty() && self.queued() < LOOKAHEAD_SECONDS {
                Some(Duration::ZERO)
            } else if busy {
                Some(Duration::from_millis(20))
            } else if watching || self.unheard {
                Some(WATCH)
            } else {
                None
            };
            let message = match wait {
                None => rx.recv().ok(),
                Some(d) => match rx.recv_timeout(d) {
                    Ok(m) => Some(m),
                    Err(RecvTimeoutError::Timeout) => None,
                    Err(RecvTimeoutError::Disconnected) => break,
                },
            };
            if wait.is_none() && message.is_none() {
                break;
            }
            if let Some((command, ticket)) = message {
                if matches!(command, Command::Quit) {
                    break;
                }
                self.command(command, ticket);
                // Read every waiting command before the next piece, so a Stop or a new voice is
                // never behind it.
                continue;
            }
            self.watch_microphone();
            self.watch_listeners();
            if self.queued() < LOOKAHEAD_SECONDS
                && let Some(piece) = self.next_piece()
            {
                self.say(piece);
            }
            if self.speaking && self.pending.is_empty() && self.queued() <= 0.0 {
                self.speaking = false;
                self.unheard = !self.heard;
                kalliope_voice::release_memory();
                self.emit(Event::Idle);
            }
        }
        drop(self.line.close());
    }

    fn queued(&self) -> f32 {
        self.line.with(|o| o.queued_seconds())
    }

    /// Loads the voice of the settings, or Giulia when it fails, and opens the microphone.
    fn start(&mut self) {
        let wanted = self.config.voice.clone();
        let loaded = (self.load)(&self.config, &wanted);
        let (id, speaker, warning) = match loaded {
            Ok(s) => (wanted, s, None),
            Err(e) if wanted != VoiceId::default() => {
                eprintln!("kalliope: voice {wanted:?}: {e}");
                match (self.load)(&self.config, &VoiceId::default()) {
                    Ok(s) => {
                        // The details are for developers, on standard error.
                        let warning = format!(
                            "La voce «{}» non si apre: parlo con {}. Puoi sceglierne un'altra dal menu «Voce».",
                            wanted.label(),
                            VoiceId::default().label()
                        );
                        (VoiceId::default(), s, Some(warning))
                    }
                    Err(e) => return self.emit(Event::Error(cannot_prepare(&e))),
                }
            }
            Err(e) => return self.emit(Event::Error(cannot_prepare(&e))),
        };
        self.use_voice(id, speaker);
        if let Some(w) = warning {
            self.emit(Event::Warning(w));
        }
    }

    /// Puts a loaded voice in use; the first time, opens the microphone and says Ready.
    fn use_voice(&mut self, id: VoiceId, speaker: Box<dyn Speaker>) {
        let rate = speaker.sample_rate();
        let first = self.speaker.is_none();
        self.speaker = Some((id.clone(), speaker));
        self.emit(Event::Voice(id));
        if first || rate != self.rate {
            self.rate = rate;
            self.open_microphone();
        }
        if first {
            let microphone = self.microphone.clone().map_err(|e| e.reason);
            self.emit(Event::Ready { microphone });
        }
    }

    fn open_microphone(&mut self) {
        let (output, microphone): (Box<dyn Output>, _) = match (self.open)(self.rate) {
            Ok(out) => (out, Ok(())),
            Err(e) => {
                // Once per problem, not at every attempt.
                if self
                    .microphone
                    .as_ref()
                    .err()
                    .is_none_or(|old| old.detail != e.detail)
                {
                    eprintln!("kalliope: virtual microphone: {}", e.detail);
                }
                (Box::new(audio::Silent::new(self.rate)), Err(e))
            }
        };
        let _ = output.set_monitor(self.monitor);
        drop(self.line.replace(output));
        self.microphone = microphone;
        self.next_try = Instant::now() + RETRY;
    }

    fn command(&mut self, command: Command, ticket: u64) {
        match command {
            Command::Speak(text) => self.speak(&text, ticket),
            Command::Stop => {
                self.pending.clear();
                self.line.with(|o| o.clear());
                if self.speaking {
                    self.speaking = false;
                    kalliope_voice::release_memory();
                    self.emit(Event::Idle);
                }
            }
            Command::Voice(id) => self.change_voice(id),
            Command::Monitor(on) => {
                self.monitor = on;
                if let Some(e) = self.line.with(|o| o.set_monitor(on).err()) {
                    self.emit(Event::Warning(format!("Attenzione: {e}.")));
                }
            }
            Command::Quit => {}
        }
    }

    fn speak(&mut self, text: &str, ticket: u64) {
        let Some((_, speaker)) = &self.speaker else {
            return;
        };
        if ticket != self.line.ticket() {
            return; // Stopped before it was read.
        }
        let pieces = if has_speech(text) {
            speaker.pieces(text, ticket)
        } else {
            Vec::new()
        };
        if pieces.is_empty() {
            return self.emit(Event::NothingToSay);
        }
        self.pending.extend(pieces);
        if !self.speaking {
            self.speaking = true;
            self.unheard = false;
            self.heard = self.line.with(|o| o.in_use());
            self.emit(if self.heard {
                Event::Speaking
            } else {
                Event::NotHeard
            });
        }
    }

    fn change_voice(&mut self, id: VoiceId) {
        if self
            .speaker
            .as_ref()
            .is_some_and(|(current, _)| *current == id)
        {
            return self.emit(Event::Voice(id));
        }
        match (self.load)(&self.config, &id) {
            Ok(speaker) => {
                // What is left to say goes on in the new voice, from the next whole sentence.
                let rest: Vec<String> = self
                    .pending
                    .drain(..)
                    .skip_while(|p| p.starts.is_none())
                    .filter_map(|p| p.starts)
                    .collect();
                let ticket = self.line.ticket();
                if !rest.is_empty() {
                    self.pending.extend(speaker.pieces(&rest.join(" "), ticket));
                }
                self.use_voice(id, speaker);
            }
            Err(e) => {
                eprintln!("kalliope: voice {id:?}: {e}");
                match self.speaker.as_ref().map(|(current, _)| current.clone()) {
                    Some(current) => {
                        self.emit(Event::Warning(format!(
                            "La voce «{}» non si apre: continuo con «{}».",
                            id.label(),
                            current.label()
                        )));
                        self.emit(Event::Voice(current));
                    }
                    None => self.emit(Event::Error(cannot_prepare(&e))),
                }
            }
        }
    }

    /// The next piece: the next clause, joined with the following clauses of its sentence while
    /// their synthesis fits in the time the queued audio takes to play (at most [`PIECE_TOKENS`]).
    fn next_piece(&mut self) -> Option<Piece> {
        let mut piece = self.pending.pop_front()?;
        let queued = self.queued();
        let budget = if queued <= 0.0 {
            FIRST_PIECE_TOKENS
        } else {
            // Half the queued time, so a slower piece than expected still arrives in time.
            ((queued * 0.5 / self.seconds_per_token) as usize)
                .clamp(FIRST_PIECE_TOKENS, PIECE_TOKENS)
        };
        let What::Phonemes { text, .. } = &piece.what else {
            return Some(piece);
        };
        let mut last_clause = text.clone();
        while !piece.last
            && let Some(next) = self.pending.front()
            && next.ticket == piece.ticket
            && piece.tokens + 1 + next.tokens <= budget
            && let (What::Phonemes { text: a, .. }, What::Phonemes { text: b, .. }) =
                (&mut piece.what, &next.what)
        {
            a.push(' ');
            a.push_str(b);
            last_clause = b.clone();
            piece.tokens += 1 + next.tokens;
            piece.last = next.last;
            self.pending.pop_front();
        }
        // The clauses that follow in the sentence, up to about a clause or two: the model
        // decides the pause and the melody at the cut from what comes after it.
        let mut next_clause = String::new();
        let mut context = 0;
        for next in self.pending.iter() {
            let What::Phonemes { text, .. } = &next.what else {
                break;
            };
            if piece.last || next.ticket != piece.ticket || context >= CONTEXT_TOKENS {
                break;
            }
            if !next_clause.is_empty() {
                next_clause.push(' ');
            }
            next_clause.push_str(text);
            context += next.tokens + 1;
            if next.last {
                break;
            }
        }
        if let What::Phonemes { before, after, .. } = &mut piece.what {
            if !piece.first {
                *before = std::mem::take(&mut self.previous_clause);
            }
            *after = next_clause;
        }
        self.previous_clause = last_clause;
        Some(piece)
    }

    fn say(&mut self, piece: Piece) {
        let Some((_, speaker)) = &self.speaker else {
            return;
        };
        let line = &self.line;
        let ticket = piece.ticket;
        let started = Instant::now();
        let result = speaker.speak(&piece, &mut |audio| line.play(ticket, audio));
        if piece.tokens > 0 {
            let measured = started.elapsed().as_secs_f32() / piece.tokens as f32;
            self.seconds_per_token = 0.5 * self.seconds_per_token + 0.5 * measured;
        }
        if let Err(e) = result {
            self.emit(Event::Warning(format!(
                "Non sono riuscita a dire questa frase: {e}"
            )));
        }
    }

    /// PipeWire restarted, or was not ready at start: bring the microphone back, and say so.
    fn watch_microphone(&mut self) {
        if self.speaker.is_none() {
            return;
        }
        match &self.microphone {
            Ok(()) => {
                // (No output at all means the window closed: nothing to bring back.)
                if self.line.with(|o| !o.is_connected()) {
                    drop(self.line.replace(Box::new(audio::Silent::new(self.rate))));
                    let lost = MicError::lost();
                    self.emit(Event::Microphone(Err(lost.reason.clone())));
                    self.microphone = Err(lost);
                    self.next_try = Instant::now() + RETRY;
                }
            }
            Err(e) if e.retry && Instant::now() >= self.next_try => {
                let before = e.clone();
                self.open_microphone();
                match self.microphone.clone() {
                    Ok(()) => self.emit(Event::Microphone(Ok(()))),
                    Err(e) if e != before => self.emit(Event::Microphone(Err(e.reason))),
                    Err(_) => {}
                }
            }
            Err(_) => {}
        }
    }

    /// Whether anybody in a call hears the phrase being said, or the one said last.
    fn watch_listeners(&mut self) {
        let in_use = self.line.with(|o| o.in_use());
        if self.speaking && in_use != self.heard {
            self.heard = in_use;
            self.emit(if in_use {
                Event::Speaking
            } else {
                Event::NotHeard
            });
        } else if !self.speaking && self.unheard && in_use {
            self.unheard = false;
            self.emit(Event::Heard);
        }
    }
}

fn cannot_prepare(e: &str) -> String {
    format!("Non riesco a preparare la voce: {e}")
}

#[cfg(test)]
mod tests;
