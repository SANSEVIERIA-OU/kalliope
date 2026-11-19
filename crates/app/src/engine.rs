// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The speaking thread: normalizes the text and speaks it on the audio output, so speech starts
//! after the first sentence and the window never waits.
//!
//! Two kinds of voices: Giulia and Marco (Klein, one sentence at a time), and voices prepared from a
//! recording of their owner (Pocket TTS, streamed: audio goes out frame by frame while the rest of
//! the chunk is generated, and Stop is seen between frames).

use crate::audio::{self, Output};
use kalliope_voice::pocket::{Chunk, Pocket, PocketOptions, VoiceState};
use kalliope_voice::{Voice, VoiceOptions};
use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::mpsc::{Receiver, RecvTimeoutError, Sender, channel};
use std::thread::JoinHandle;
use std::time::Duration;

/// The voices of the Klein model.
pub const KLEIN_VOICES: [&str; 2] = ["Giulia", "Marco"];

pub enum Command {
    Speak(String),
    Stop,
    Voice(String),
    Monitor(bool),
    Quit,
}

#[derive(Clone, Debug)]
pub enum Event {
    Loading,
    /// Ready to speak; `Err` explains why the virtual microphone is missing.
    Ready {
        microphone: Result<(), String>,
    },
    Speaking,
    /// Speaking, but no app is listening to the microphone and the monitor is off.
    NotHeard,
    Idle,
    /// The voice cannot be used at all.
    Error(String),
    /// Something failed, but Kalliope can still speak.
    Warning(String),
}

pub struct Engine {
    tx: Sender<Command>,
    thread: Option<JoinHandle<()>>,
}

pub struct Config {
    pub model_dir: PathBuf,
    pub voice: String,
    pub monitor: bool,
    pub ort_lib: Option<PathBuf>,
    /// The Pocket TTS model, for the voices prepared from a recording.
    pub pocket_dir: PathBuf,
    /// The prepared voices, one `NAME.safetensors` each.
    pub voices_dir: PathBuf,
}

impl Engine {
    pub fn start(config: Config, on_event: impl Fn(Event) + Send + 'static) -> Engine {
        let (tx, rx) = channel();
        let thread = std::thread::Builder::new()
            .name("kalliope-voice".into())
            .spawn(move || run(config, rx, on_event))
            .ok();
        Engine { tx, thread }
    }

    pub fn send(&self, command: Command) {
        let _ = self.tx.send(command);
    }
}

impl Drop for Engine {
    fn drop(&mut self) {
        let _ = self.tx.send(Command::Quit);
        if let Some(t) = self.thread.take() {
            let _ = t.join();
        }
    }
}

/// Giulia or Marco, or a voice prepared from a recording.
enum Speaker {
    Klein(Voice),
    Own {
        model: Box<Pocket>,
        voice: VoiceState,
    },
}

impl Speaker {
    fn sample_rate(&self) -> u32 {
        match self {
            Speaker::Klein(v) => v.sample_rate(),
            Speaker::Own { model, .. } => model.sample_rate(),
        }
    }

    /// What to say for `text`: sentences for Klein; for Pocket TTS the chunks it reads (whole
    /// sentences, grouped up to 50 tokens).
    fn units(&self, text: &str) -> Vec<Unit> {
        let sentences = kalliope_text::normalize(text);
        match self {
            Speaker::Klein(_) => sentences.into_iter().map(Unit::Sentence).collect(),
            Speaker::Own { model, .. } => model
                .chunks(&kalliope_voice::pocket::join_sentences(&sentences))
                .into_iter()
                .map(Unit::Chunk)
                .collect(),
        }
    }
}

/// One piece of speech waiting to be said.
enum Unit {
    Sentence(String),
    Chunk(Chunk),
}

fn load(config: &Config, name: &str) -> Result<Speaker, String> {
    if KLEIN_VOICES.iter().any(|v| v.eq_ignore_ascii_case(name)) {
        let options = VoiceOptions {
            ort_lib: config.ort_lib.clone(),
            ..VoiceOptions::default()
        };
        return Voice::load(&config.model_dir, name, &options)
            .map(Speaker::Klein)
            .map_err(|e| e.to_string());
    }
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
    Ok(Speaker::Own {
        model: Box::new(model),
        voice,
    })
}

#[derive(Debug, PartialEq)]
enum Interrupt {
    None,
    Stop,
    Quit,
}

/// A command that arrives while a voice prepared from a recording is speaking: Stop and Quit end
/// the chunk; the others wait in `inbox`, in order. Stop also drops the text that came before it.
fn while_speaking(command: Command, inbox: &mut VecDeque<Command>) -> Interrupt {
    match command {
        Command::Stop => {
            inbox.retain(|c| !matches!(c, Command::Speak(_)));
            Interrupt::Stop
        }
        Command::Quit => Interrupt::Quit,
        other => {
            inbox.push_back(other);
            Interrupt::None
        }
    }
}

fn run(config: Config, rx: Receiver<Command>, on_event: impl Fn(Event)) {
    on_event(Event::Loading);
    let mut speaker = match load(&config, &config.voice) {
        Ok(v) => v,
        Err(e) => return on_event(Event::Error(format!("Non riesco a preparare la voce: {e}"))),
    };
    let mut rate = speaker.sample_rate();
    let (mut output, microphone): (Box<dyn Output>, Result<(), String>) = match audio::open(rate) {
        Ok(out) => (out, Ok(())),
        Err(e) => (Box::new(audio::Silent::new(rate)), Err(e)),
    };
    let mut monitor = config.monitor;
    let _ = output.set_monitor(monitor);
    on_event(Event::Ready {
        microphone: microphone.clone(),
    });

    let mut pending: VecDeque<Unit> = VecDeque::new();
    // Commands that arrived while a voice prepared from a recording was speaking.
    let mut inbox: VecDeque<Command> = VecDeque::new();
    let mut speaking = false;
    let mut seed = 0u32;
    loop {
        // Wait for a command, or poll while audio is playing or speech is waiting.
        let command = if let Some(c) = inbox.pop_front() {
            Some(c)
        } else if pending.is_empty() && !speaking {
            rx.recv().ok()
        } else {
            match rx.recv_timeout(Duration::from_millis(if pending.is_empty() {
                100
            } else {
                0
            })) {
                Ok(c) => Some(c),
                Err(RecvTimeoutError::Timeout) => None,
                Err(RecvTimeoutError::Disconnected) => Some(Command::Quit),
            }
        };
        match command {
            Some(Command::Quit) => break,
            Some(Command::Speak(text)) => {
                pending.extend(speaker.units(&text));
                continue;
            }
            Some(Command::Stop) => {
                pending.clear();
                output.clear();
            }
            Some(Command::Voice(name)) => match load(&config, &name) {
                Ok(v) => {
                    speaker = v;
                    if speaker.sample_rate() != rate {
                        rate = speaker.sample_rate();
                        output.clear();
                        if let Ok(out) = audio::open(rate) {
                            output = out;
                            let _ = output.set_monitor(monitor);
                        }
                    }
                }
                Err(e) => on_event(Event::Warning(format!(
                    "Non riesco a cambiare voce ({e}): continuo con quella di prima."
                ))),
            },
            Some(Command::Monitor(on)) => {
                monitor = on;
                if let Err(e) = output.set_monitor(on) {
                    on_event(Event::Warning(format!("Attenzione: {e}.")));
                }
            }
            None => {}
        }
        // One sentence or chunk at a time, so Stop and new text are seen in between.
        if let Some(unit) = pending.pop_front() {
            // PipeWire restarted (for example after an upgrade): bring the microphone back.
            if !output.is_connected()
                && let Ok(out) = audio::open(rate)
            {
                output = out;
                let _ = output.set_monitor(monitor);
            }
            let started = |speaking: &mut bool, output: &dyn Output| {
                if !*speaking {
                    *speaking = true;
                    on_event(if output.in_use() || monitor {
                        Event::Speaking
                    } else {
                        Event::NotHeard
                    });
                }
            };
            match (&speaker, unit) {
                (Speaker::Klein(voice), unit) => {
                    let sentence = match unit {
                        Unit::Sentence(s) => s,
                        // Left over from a voice prepared from a recording.
                        Unit::Chunk(c) => kalliope_text::normalize(&c.prompt).join(" "),
                    };
                    let phonemes = kalliope_phonemes::phonemize(&sentence);
                    match voice.synthesize(&phonemes) {
                        Ok(samples) => {
                            output.play(&samples);
                            started(&mut speaking, output.as_ref());
                        }
                        Err(e) => on_event(Event::Warning(format!(
                            "Non sono riuscita a dire questa frase: {e}"
                        ))),
                    }
                }
                (Speaker::Own { model, .. }, Unit::Sentence(s)) => {
                    // Left over from Giulia or Marco: read as this voice reads text.
                    let chunks = model.chunks(&kalliope_voice::pocket::join_sentences(&[s]));
                    for c in chunks.into_iter().rev() {
                        pending.push_front(Unit::Chunk(c));
                    }
                }
                (Speaker::Own { model, voice }, Unit::Chunk(chunk)) => {
                    let (mut stop, mut quit) = (false, false);
                    let result = model.speak_chunk(voice, &chunk, seed, &mut |audio| {
                        output.play(audio);
                        started(&mut speaking, output.as_ref());
                        while let Ok(c) = rx.try_recv() {
                            match while_speaking(c, &mut inbox) {
                                Interrupt::Stop => stop = true,
                                Interrupt::Quit => quit = true,
                                Interrupt::None => {}
                            }
                        }
                        !(stop || quit)
                    });
                    seed = seed.wrapping_add(1);
                    if let Err(e) = result {
                        on_event(Event::Warning(format!(
                            "Non sono riuscita a dire questa frase: {e}"
                        )));
                    }
                    if quit {
                        break;
                    }
                    if stop {
                        pending.clear();
                        output.clear();
                    }
                }
            }
        }
        if speaking && pending.is_empty() && output.queued_seconds() <= 0.0 {
            speaking = false;
            kalliope_voice::release_memory();
            on_event(Event::Idle);
        }
    }
    output.clear();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stop_while_speaking_drops_the_text_that_came_before_it() {
        let mut inbox = VecDeque::new();
        assert_eq!(
            while_speaking(Command::Speak("a".into()), &mut inbox),
            Interrupt::None
        );
        assert_eq!(
            while_speaking(Command::Monitor(true), &mut inbox),
            Interrupt::None
        );
        assert_eq!(while_speaking(Command::Stop, &mut inbox), Interrupt::Stop);
        assert_eq!(
            while_speaking(Command::Speak("b".into()), &mut inbox),
            Interrupt::None
        );
        let left: Vec<String> = inbox
            .iter()
            .map(|c| match c {
                Command::Speak(t) => format!("speak {t}"),
                Command::Monitor(on) => format!("monitor {on}"),
                _ => "other".into(),
            })
            .collect();
        assert_eq!(left, ["monitor true", "speak b"]);
        assert_eq!(while_speaking(Command::Quit, &mut inbox), Interrupt::Quit);
    }
}
