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
use std::ops::Range;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::mpsc::{Receiver, RecvTimeoutError, Sender, channel};
use std::sync::{Arc, Condvar, Mutex, MutexGuard};
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
/// Seconds per unit of [`spoken_weight`] before anything is measured, to guess how long a streamed
/// piece lasts from where its voice begins: the median of the pieces two voices prepared from a
/// recording said (`materiali-locali/tempi-parole-prove/`). Counting sounds rather than words, a
/// written number that is said in many words is not guessed short.
const FIRST_GUESS_SECONDS_PER_UNIT: f32 = 0.049;

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
    /// A piece of a phrase starts sounding in the microphone now.
    Sounding(Sounding),
    /// Stop cut a phrase short: how much of it was said. Comes before [`Event::Idle`].
    Interrupted(Said),
}

/// A piece of a phrase that starts sounding: a clause (Giulia and Marco cut sentences at their
/// commas, semicolons and colons) or a chunk of one or two sentences (voices prepared from a
/// recording). Pieces come in order, and the next one starts when this one ends.
#[derive(Clone, Debug, PartialEq)]
pub struct Sounding {
    /// The phrase, exactly as it was sent with [`Command::Speak`].
    pub phrase: Arc<str>,
    /// Phrases are numbered from 1 in the order they were sent.
    pub id: u64,
    /// The bytes of `phrase` this piece says, with its punctuation: the words of a written number
    /// or abbreviation all belong to the piece that says them. Everything before `span.end` has
    /// been said once the piece ends.
    pub span: Range<usize>,
    /// How long the piece sounds.
    pub duration: Duration,
    /// False while a voice that streams its audio still synthesizes the piece: `duration` is then
    /// a guess, and the same piece comes again with the exact duration as soon as it is known.
    pub exact: bool,
    /// The last piece of the phrase.
    pub last: bool,
    /// Where each spoken word of the piece starts, in order. Empty when the piece does not say.
    pub words: Arc<[WordStart]>,
}

/// Where a spoken word starts in its piece.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct WordStart {
    /// The first byte of the phrase it was read from: the words of a written number or
    /// abbreviation all start where it does.
    pub byte: usize,
    /// The share of the piece's duration before the word (0 to 1). Giulia and Marco say where
    /// each word begins (the model gives every phoneme its duration); a voice prepared from a
    /// recording does not, and its words share the piece by how long each takes to say
    /// ([`spoken_weight`]).
    pub share: f32,
}

/// What was said of a phrase that Stop cut short.
#[derive(Clone, Debug, PartialEq)]
pub struct Said {
    pub phrase: Arc<str>,
    pub id: u64,
    /// `phrase[..done]` was said in full.
    pub done: usize,
    /// The piece that was sounding when Stop came, and the share of its audio that was heard
    /// (0 to 1): its words are said only in part.
    pub cut: Option<(Range<usize>, f32)>,
}

pub struct Engine {
    tx: Sender<(Command, u64)>,
    line: Arc<Line>,
    thread: Option<JoinHandle<()>>,
    herald: Option<JoinHandle<()>>,
}

/// Where events go: shared by the speaking thread and the herald, which says when each piece
/// starts sounding.
type Emit = Arc<Mutex<Box<dyn FnMut(Event) + Send>>>;

fn emit_to(emit: &Emit, event: Event) {
    (emit.lock().unwrap_or_else(|e| e.into_inner()))(event);
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
        let emit: Emit = Arc::new(Mutex::new(Box::new(on_event)));
        let (shared, events) = (line.clone(), emit.clone());
        let herald = std::thread::Builder::new()
            .name("kalliope-herald".into())
            .spawn(move || herald(&shared, &events))
            .ok();
        let shared = line.clone();
        let thread = std::thread::Builder::new()
            .name("kalliope-voice".into())
            .spawn(move || {
                let mut engine = Thread::new(config, shared, emit, load, open);
                engine.run(rx);
            })
            .ok();
        Engine {
            tx,
            line,
            thread,
            herald,
        }
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
        if let Some(t) = self.herald.take() {
            let _ = t.join();
        }
    }
}

/// Says when each piece starts sounding, at the moment its audio reaches the microphone: the
/// speaking thread may be busy synthesizing the next piece then.
fn herald(line: &Line, emit: &Emit) {
    let mut slot = line.lock();
    loop {
        if slot.closed {
            return;
        }
        let now = Instant::now();
        match slot.marks.front() {
            Some(mark) if mark.at <= now => {
                let mark = slot.marks.pop_front().expect("a mark");
                slot.sounding = Some((mark.sounding.clone(), mark.at));
                emit_to(emit, Event::Sounding(mark.sounding));
            }
            Some(mark) => {
                let wait = mark.at - now;
                slot = line
                    .wake
                    .wait_timeout(slot, wait)
                    .unwrap_or_else(|e| e.into_inner())
                    .0;
            }
            None => slot = line.wake.wait(slot).unwrap_or_else(|e| e.into_inner()),
        }
    }
}

/// The output, shared by the window (Stop, closing), the speaking thread and the herald.
#[derive(Default)]
struct Line {
    output: Mutex<Slot>,
    /// Counts Stops: audio synthesized for a text sent before the last Stop is dropped.
    stops: AtomicU64,
    /// Wakes the herald when a piece is queued, or when the line closes.
    wake: Condvar,
}

#[derive(Default)]
struct Slot {
    output: Option<Box<dyn Output>>,
    closed: bool,
    /// Pieces queued in the output that have not started sounding, in order.
    marks: VecDeque<Mark>,
    /// The piece sounding (or the last one that did) and when it started.
    sounding: Option<(Sounding, Instant)>,
    /// What Stop left of the phrase it cut, until the speaking thread reports it.
    said: Option<Said>,
}

/// A piece queued in the output, and when it will start sounding.
struct Mark {
    at: Instant,
    sounding: Sounding,
}

impl Slot {
    /// Forgets the pieces still to sound, and tells how much of the phrase was said: `None` when
    /// nothing was sounding or waiting to sound.
    fn cut(&mut self, now: Instant) -> Option<Said> {
        let next = self.marks.front().map(|m| Said {
            phrase: m.sounding.phrase.clone(),
            id: m.sounding.id,
            done: 0,
            cut: None,
        });
        self.marks.clear();
        let (s, started) = self.sounding.take()?;
        let heard = now.saturating_duration_since(started);
        if heard < s.duration || !s.exact {
            let share = heard.as_secs_f32() / s.duration.as_secs_f32().max(1e-3);
            return Some(Said {
                done: s.span.start,
                cut: Some((s.span, share.clamp(0.0, 1.0))),
                phrase: s.phrase,
                id: s.id,
            });
        }
        if s.last && next.is_some() {
            // That phrase was said in full, and the next one had not started.
            return next;
        }
        Some(Said {
            done: s.span.end,
            cut: None,
            phrase: s.phrase,
            id: s.id,
        })
    }
}

impl Line {
    fn lock(&self) -> MutexGuard<'_, Slot> {
        self.output.lock().unwrap_or_else(|e| e.into_inner())
    }

    fn ticket(&self) -> u64 {
        self.stops.load(Ordering::SeqCst)
    }

    fn stop(&self) {
        let mut slot = self.lock();
        self.stops.fetch_add(1, Ordering::SeqCst);
        if let Some(out) = &slot.output {
            out.clear();
        }
        slot.said = slot.cut(Instant::now());
    }

    /// Plays `samples` unless a Stop came after `ticket` or the window closed, and tells when they
    /// will start sounding: after what is queued before them. The audio where the voice of a piece
    /// begins also says when the piece starts sounding: that far into `samples`.
    fn play(
        &self,
        ticket: u64,
        samples: &[f32],
        starts: Option<(Sounding, Duration)>,
    ) -> Option<Instant> {
        let mut slot = self.lock();
        let out = slot.output.as_ref().filter(|_| self.ticket() == ticket)?;
        let at = Instant::now() + Duration::from_secs_f32(out.queued_seconds().max(0.0));
        out.play(samples);
        if let Some((sounding, offset)) = starts {
            slot.marks.push_back(Mark {
                at: at + offset,
                sounding,
            });
            self.wake.notify_all();
        }
        Some(at)
    }

    /// A piece that starts sounding at `at`, unless a Stop came after `ticket`: one that was all
    /// silence, announced once it is over.
    fn mark(&self, ticket: u64, at: Instant, sounding: Sounding) {
        let mut slot = self.lock();
        if slot.output.is_some() && self.ticket() == ticket {
            slot.marks.push_back(Mark { at, sounding });
            self.wake.notify_all();
        }
    }

    /// The exact duration of a piece, once a streamed voice has finished it: corrected while it
    /// waits to sound, or told again if it already started.
    fn exact(&self, id: u64, start: usize, duration: Duration) -> Option<Sounding> {
        let mut slot = self.lock();
        let same = |s: &Sounding| s.id == id && s.span.start == start;
        if let Some(mark) = slot.marks.iter_mut().find(|m| same(&m.sounding)) {
            mark.sounding.duration = duration;
            mark.sounding.exact = true;
            return None;
        }
        match &mut slot.sounding {
            Some((s, _)) if same(s) && !s.exact => {
                s.duration = duration;
                s.exact = true;
                Some(s.clone())
            }
            _ => None,
        }
    }

    /// What the last Stop left of the phrase it cut.
    fn take_said(&self) -> Option<Said> {
        self.lock().said.take()
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
        slot.marks.clear();
        self.wake.notify_all();
        slot.output.take()
    }
}

/// A phrase being said: its text and number.
struct Phrase {
    text: Arc<str>,
    id: u64,
}

/// One piece of speech waiting to be said.
struct Piece {
    what: What,
    /// The bytes of the phrase it says (see [`Sounding::span`]); after a voice change, the rest of
    /// the phrase is read again from the first piece not said.
    source: Range<usize>,
    /// Set by the speaking thread when the phrase is accepted.
    phrase: Option<Arc<Phrase>>,
    /// The last piece of its phrase.
    ends_phrase: bool,
    /// First or last piece of its sentence: inside a sentence the silence at the cut is shortened.
    first: bool,
    last: bool,
    /// Its spoken words: where each was typed, and how long it takes to say.
    spoken: Vec<Spoken>,
    /// Phoneme tokens, for pieces that can be joined with the next clause of their sentence.
    tokens: usize,
    seed: u32,
    /// When its text was sent (see [`Line::stops`]).
    ticket: u64,
}

/// A spoken word of a piece.
#[derive(Clone, Copy, Debug, PartialEq)]
struct Spoken {
    /// The first byte of the phrase it was read from.
    byte: usize,
    /// How long it takes to say, in the units of [`spoken_weight`].
    weight: f32,
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
    /// false when nobody wants it any more. A voice that knows where the spoken words of the
    /// piece begin in the audio hands that over too, one sample per word; otherwise nothing.
    fn speak(&self, piece: &Piece, play: &mut Play) -> Result<(), String>;
    /// Whether `speak` hands over a piece in parts as it synthesizes it, so its duration is known
    /// only at the end; otherwise the whole piece comes in one call.
    fn streams(&self) -> bool {
        false
    }
}

/// What a voice hands its audio to: the samples, and where the spoken words begin in them.
type Play<'a> = dyn FnMut(&[f32], &[usize]) -> bool + 'a;

/// Giulia and Marco.
struct Klein(Voice);

impl Speaker for Klein {
    fn sample_rate(&self) -> u32 {
        self.0.sample_rate()
    }

    /// One piece per clause; [`Thread::next_piece`] joins them as time allows.
    fn pieces(&self, text: &str, ticket: u64) -> Vec<Piece> {
        let mut out: Vec<Piece> = Vec::new();
        for sentence in kalliope_text::normalize_spans(text) {
            let phonemes = kalliope_phonemes::phonemize(&sentence.text);
            let cut = self.0.clauses(&phonemes);
            let sources = sources(&sentence.words, cut.iter().map(|(p, _)| p.as_str()));
            let n = cut.len();
            out.extend(cut.into_iter().zip(sources).enumerate().map(
                |(i, ((p, tokens), (source, said)))| Piece {
                    spoken: spoken(text, &p, &sentence.words[said], |w| w.to_owned()),
                    what: What::Phonemes {
                        text: p,
                        before: String::new(),
                        after: String::new(),
                    },
                    source,
                    phrase: None,
                    ends_phrase: false,
                    first: i == 0,
                    last: i + 1 == n,
                    tokens,
                    seed: i as u32,
                    ticket,
                },
            ));
        }
        if let Some(last) = out.last_mut() {
            last.ends_phrase = true;
        }
        out
    }

    fn speak(&self, piece: &Piece, play: &mut Play) -> Result<(), String> {
        let What::Phonemes {
            text,
            before,
            after,
        } = &piece.what
        else {
            return Ok(());
        };
        let timed = self
            .0
            .synthesize_timed(before, text, after, piece.seed)
            .map_err(|e| e.to_string())?;
        if !timed.audio.is_empty() {
            play(&timed.audio, &timed.words);
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
        let sentences = kalliope_text::normalize_spans(text);
        let words: Vec<Range<usize>> = sentences.iter().flat_map(|s| s.words.clone()).collect();
        let texts: Vec<String> = sentences.into_iter().map(|s| s.text).collect();
        let chunks = self
            .model
            .chunks(&kalliope_voice::pocket::join_sentences(&texts));
        let sources = sources(&words, chunks.iter().map(|c| c.prompt.as_str()));
        let n = chunks.len();
        chunks
            .into_iter()
            .zip(sources)
            .enumerate()
            .map(|(i, (c, (source, said)))| Piece {
                spoken: spoken(text, &c.prompt, &words[said], kalliope_phonemes::phonemize),
                what: What::Chunk(c),
                source,
                phrase: None,
                ends_phrase: i + 1 == n,
                first: true,
                last: true,
                tokens: 0,
                seed: i as u32,
                ticket,
            })
            .collect()
    }

    fn streams(&self) -> bool {
        true
    }

    fn speak(&self, piece: &Piece, play: &mut Play) -> Result<(), String> {
        let What::Chunk(chunk) = &piece.what else {
            return Ok(());
        };
        self.model
            .speak_chunk(&self.voice, chunk, piece.seed, &mut |audio| {
                play(audio, &[])
            })
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
}

/// The bytes of the typed phrase each piece says, from the words it has, and which of `words` it
/// says: `words` are where the spoken words of the text were typed
/// ([`kalliope_text::Sentence::words`]), `pieces` the text of each piece in order, in spoken form or
/// in phonemes, which keep one word per spoken word. The last piece reaches the last word whatever
/// the count says, so the whole text is always covered.
fn sources<'a>(
    words: &[Range<usize>],
    pieces: impl Iterator<Item = &'a str>,
) -> Vec<(Range<usize>, Range<usize>)> {
    let mut out: Vec<(Range<usize>, Range<usize>)> = Vec::new();
    let mut next = 0;
    for piece in pieces {
        let n = kalliope_text::words(piece).count();
        let before = out.last().map_or(0, |(r, _)| r.end);
        let start = words.get(next).map_or(before, |w| w.start).max(before);
        let first = next;
        next = (next + n).min(words.len());
        let end = next
            .checked_sub(1)
            .and_then(|i| words.get(i))
            .map_or(start, |w| w.end)
            .max(start);
        out.push((start..end, first..next));
    }
    if let (Some((last, said)), Some(word)) = (out.last_mut(), words.last()) {
        last.end = last.end.max(word.end);
        said.end = words.len();
    }
    out
}

/// The spoken words of a piece of `phrase`: its `text` (in spoken form or in phonemes) word by
/// word, with where each was typed (`typed`, one per word as [`sources`] counts them) and how long
/// it takes to say, from its phonemes (`phonemes` turns a word of `text` into them).
///
/// The words read together from several typed words («1.250 €» is «mille duecento cinquanta
/// euro», all from the bytes of both) are shown on them in order: the first spoken word on the
/// first typed word, the last ones on the last ones.
fn spoken(
    phrase: &str,
    text: &str,
    typed: &[Range<usize>],
    phonemes: impl Fn(&str) -> String,
) -> Vec<Spoken> {
    let mut out: Vec<Spoken> = kalliope_text::words(text)
        .zip(typed)
        .map(|(w, at)| Spoken {
            byte: at.start,
            weight: spoken_weight(&phonemes(w)),
        })
        .collect();
    let mut i = 0;
    while i < out.len() {
        let group = &typed[i..out.len()];
        let n = group
            .iter()
            .take_while(|r| r.start == typed[i].start)
            .count();
        let range = typed[i].start..group[..n].iter().map(|r| r.end).max().unwrap_or(0);
        // Where the typed words after the first begin, inside the range.
        let later: Vec<usize> = phrase
            .get(range.clone())
            .map(|t| {
                crate::avanzamento::words(t)
                    .into_iter()
                    .skip(1)
                    .map(|w| range.start + w.start)
                    .collect()
            })
            .unwrap_or_default();
        let shown = later.len().min(n - 1);
        for (k, byte) in later[later.len() - shown..].iter().enumerate() {
            out[i + n - shown + k].byte = *byte;
        }
        i += n;
    }
    out
}

/// How long a spoken word takes to say, from its phonemes: one per sound (stress and length marks
/// are not sounds), and the pause after it when it ends a clause or a sentence, because a piece
/// lasts until the next begins and the voice is silent at its end. Counting the sounds said, a
/// written number or an abbreviation weighs the words it is read as. See [`PER_WORD`].
fn spoken_weight(phonemes: &str) -> f32 {
    let sounds = phonemes
        .chars()
        .filter(|c| c.is_alphabetic() && !matches!(c, 'ˈ' | 'ˌ' | 'ː'))
        .count() as f32;
    let pause = if phonemes.ends_with(['.', '!', '?', '…']) {
        PAUSE_SENTENCE
    } else if phonemes.ends_with([',', ';', ':', '—']) {
        PAUSE_CLAUSE
    } else {
        0.0
    };
    PER_WORD + sounds + pause
}

/// Sounds each word takes on top of its own, and the pauses after a clause and after a sentence,
/// in sounds (see [`spoken_weight`]). Fitted on 16 of 32 sentences said by two voices prepared
/// from a recording, against Whisper's word times; on the other 16 the mean error of a lit word
/// fell from 0.18 s to 0.13 s (one voice) and from 0.24 s to 0.14 s (the other), the largest from
/// 1.4 s and 2.3 s to 0.6 s and 0.9 s, with the guess of the piece's duration made from them.
const PER_WORD: f32 = 1.0;
const PAUSE_CLAUSE: f32 = 5.0;
const PAUSE_SENTENCE: f32 = 11.0;

/// Where each spoken word of `piece` starts, as shares of its duration: where the voice says it
/// begins (`offsets`, samples of the piece's audio, which sounds from `voice` and has `len`
/// samples), when it said one for each word; otherwise by how long each takes to say.
fn word_starts(piece: &Piece, offsets: &[usize], voice: usize, len: usize) -> Arc<[WordStart]> {
    let shares: Vec<f32> =
        if !offsets.is_empty() && offsets.len() == piece.spoken.len() && len > voice {
            let span = (len - voice) as f32;
            offsets
                .iter()
                .map(|&o| o.saturating_sub(voice) as f32 / span)
                .collect()
        } else {
            let total: f32 = piece.spoken.iter().map(|w| w.weight).sum();
            let mut at = 0.0;
            piece
                .spoken
                .iter()
                .map(|w| {
                    let share = at / total.max(f32::EPSILON);
                    at += w.weight;
                    share
                })
                .collect()
        };
    let mut last = 0.0f32;
    piece
        .spoken
        .iter()
        .zip(shares)
        .map(|(w, share)| {
            last = last.max(share.clamp(0.0, 1.0));
            WordStart {
                byte: w.byte,
                share: last,
            }
        })
        .collect()
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
    on_event: Emit,
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
    /// Phrases accepted so far.
    phrases: u64,
    /// The phrase of the last piece taken to be synthesized.
    current: Option<Arc<Phrase>>,
    /// Measured seconds per unit of [`spoken_weight`] of the voice in use, from where its voice
    /// begins, to guess how long a streamed piece will last.
    seconds_per_unit: f32,
}

impl Thread {
    fn new(config: Config, line: Arc<Line>, on_event: Emit, load: Loader, open: Opener) -> Thread {
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
            phrases: 0,
            current: None,
            seconds_per_unit: FIRST_GUESS_SECONDS_PER_UNIT,
        }
    }

    fn emit(&mut self, event: Event) {
        emit_to(&self.on_event, event);
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
        if self.speaker.as_ref().is_none_or(|(old, _)| *old != id) {
            // Each voice has its own pace.
            self.seconds_per_unit = FIRST_GUESS_SECONDS_PER_UNIT;
        }
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
                // Stopped before anything sounded: nothing of the phrase was said.
                let said = self.line.take_said();
                let current = self.current.as_ref().map(|p| p.id);
                let said = said.filter(|s| Some(s.id) == current).or_else(|| {
                    self.current.as_ref().map(|p| Said {
                        phrase: p.text.clone(),
                        id: p.id,
                        done: 0,
                        cut: None,
                    })
                });
                self.current = None;
                if self.speaking {
                    self.speaking = false;
                    kalliope_voice::release_memory();
                    if let Some(said) = said {
                        self.emit(Event::Interrupted(said));
                    }
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
        let mut pieces = if has_speech(text) {
            speaker.pieces(text, ticket)
        } else {
            Vec::new()
        };
        if pieces.is_empty() {
            return self.emit(Event::NothingToSay);
        }
        self.phrases += 1;
        let phrase = Arc::new(Phrase {
            text: text.into(),
            id: self.phrases,
        });
        for p in &mut pieces {
            p.phrase = Some(phrase.clone());
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
                // What is left to say goes on in the new voice from the first piece not
                // synthesized yet, read again from the phrase as it was typed: no word is lost.
                let ticket = self.line.ticket();
                let mut rest: Vec<(Arc<Phrase>, usize)> = Vec::new();
                for p in self.pending.drain(..) {
                    if let Some(phrase) = p.phrase
                        && rest.last().is_none_or(|(r, _)| r.id != phrase.id)
                    {
                        rest.push((phrase, p.source.start));
                    }
                }
                for (phrase, from) in rest {
                    let mut pieces = speaker.pieces(&phrase.text[from..], ticket);
                    for p in &mut pieces {
                        p.source = p.source.start + from..p.source.end + from;
                        p.phrase = Some(phrase.clone());
                    }
                    self.pending.extend(pieces);
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
            piece.spoken.extend_from_slice(&next.spoken);
            piece.tokens += 1 + next.tokens;
            piece.last = next.last;
            piece.source.end = next.source.end;
            piece.ends_phrase = next.ends_phrase;
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
        self.current.clone_from(&piece.phrase);
        let line = &self.line;
        let ticket = piece.ticket;
        let started = Instant::now();
        let rate = speaker.sample_rate() as f32;
        let streams = speaker.streams();
        let weight: f32 = piece.spoken.iter().map(|w| w.weight).sum();
        let seconds = |samples: usize| Duration::from_secs_f32(samples as f32 / rate);
        // Samples played, and those of silence before the voice begins.
        let (mut samples, mut lead) = (0usize, 0usize);
        let mut stopped = false;
        // When the first sample of the piece sounds.
        let mut first_at = None;
        let mut sounding = piece.phrase.as_ref().map(|phrase| Sounding {
            phrase: phrase.text.clone(),
            id: phrase.id,
            span: piece.source.clone(),
            duration: Duration::from_secs_f32(weight * self.seconds_per_unit),
            exact: false,
            last: piece.ends_phrase,
            words: word_starts(&piece, &[], 0, 0),
        });
        let result = speaker.speak(&piece, &mut |audio, offsets| {
            // The piece starts sounding with its voice, not with the silence the model puts
            // before it; a voice that hands over the whole piece at once gives its exact duration
            // there.
            let voice = sounding
                .as_ref()
                .map(|_| kalliope_voice::voice_starts(audio));
            let starts = match voice {
                Some(Some(at)) => sounding.take().map(|mut s| {
                    if !streams {
                        s.duration = seconds(audio.len() - at);
                        s.exact = true;
                        s.words = word_starts(&piece, offsets, at, audio.len());
                    }
                    (s, seconds(at))
                }),
                _ => None,
            };
            let Some(at) = line.play(ticket, audio, starts) else {
                stopped = true;
                return false;
            };
            first_at.get_or_insert(at);
            lead += match voice {
                Some(Some(at)) => at,
                Some(None) => audio.len(),
                None => 0,
            };
            samples += audio.len();
            true
        });
        if samples > 0
            && let Some(phrase) = &piece.phrase
        {
            if let (Some(mut s), Some(at)) = (sounding.take(), first_at) {
                // All silence: it sounds from its first sample.
                lead = 0;
                s.duration = seconds(samples);
                s.exact = true;
                line.mark(ticket, at, s);
            }
            let duration = seconds(samples - lead);
            if let Some(update) = line.exact(phrase.id, piece.source.start, duration) {
                self.emit(Event::Sounding(update));
            }
            if weight > 0.0 && !stopped && result.is_ok() {
                let measured = duration.as_secs_f32() / weight;
                self.seconds_per_unit = 0.5 * self.seconds_per_unit + 0.5 * measured;
            }
        }
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
