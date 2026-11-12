// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! The speaking thread: normalizes, phonemizes and synthesizes one sentence at a time and queues
//! it on the audio output, so speech starts after the first sentence and the window never waits.

use crate::audio::{self, Output};
use kalliope_voice::{Voice, VoiceOptions};
use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::mpsc::{Receiver, RecvTimeoutError, Sender, channel};
use std::thread::JoinHandle;
use std::time::Duration;

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

fn load(config: &Config, voice: &str) -> Result<Voice, String> {
    let options = VoiceOptions {
        ort_lib: config.ort_lib.clone(),
        ..VoiceOptions::default()
    };
    Voice::load(&config.model_dir, voice, &options).map_err(|e| e.to_string())
}

fn run(config: Config, rx: Receiver<Command>, on_event: impl Fn(Event)) {
    on_event(Event::Loading);
    let mut voice = match load(&config, &config.voice) {
        Ok(v) => v,
        Err(e) => return on_event(Event::Error(format!("Non riesco a preparare la voce: {e}"))),
    };
    let rate = voice.sample_rate();
    let (mut output, microphone): (Box<dyn Output>, Result<(), String>) = match audio::open(rate) {
        Ok(out) => (out, Ok(())),
        Err(e) => (Box::new(audio::Silent::new(rate)), Err(e)),
    };
    let mut monitor = config.monitor;
    let _ = output.set_monitor(monitor);
    on_event(Event::Ready {
        microphone: microphone.clone(),
    });

    let mut pending: VecDeque<String> = VecDeque::new();
    let mut speaking = false;
    loop {
        // Wait for a command, or poll while audio is playing or sentences are waiting.
        let command = if pending.is_empty() && !speaking {
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
                pending.extend(kalliope_text::normalize(&text));
                continue;
            }
            Some(Command::Stop) => {
                pending.clear();
                output.clear();
            }
            Some(Command::Voice(name)) => match load(&config, &name) {
                Ok(v) => voice = v,
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
        // One sentence at a time, so Stop and new text are seen between sentences.
        if let Some(sentence) = pending.pop_front() {
            // PipeWire restarted (for example after an upgrade): bring the microphone back.
            if !output.is_connected()
                && let Ok(out) = audio::open(rate)
            {
                output = out;
                let _ = output.set_monitor(monitor);
            }
            let phonemes = kalliope_phonemes::phonemize(&sentence);
            match voice.synthesize(&phonemes) {
                Ok(samples) => {
                    output.play(&samples);
                    if !speaking {
                        speaking = true;
                        on_event(if output.in_use() || monitor {
                            Event::Speaking
                        } else {
                            Event::NotHeard
                        });
                    }
                }
                Err(e) => on_event(Event::Warning(format!(
                    "Non sono riuscita a dire questa frase: {e}"
                ))),
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
