// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The same speech controls, preferences and status messages on every desktop.
use super::{Command, Engine, Event, HISTORY, Phase, READY, Settings, catalog, config, voices};

#[derive(Clone)]
pub struct Status {
    pub phase: Phase,
    pub text: String,
    pub warning: bool,
    mic_problem: bool,
}

impl Default for Status {
    fn default() -> Self {
        Self {
            phase: Phase::Loading,
            text: "Preparo la voce…".into(),
            warning: false,
            mic_problem: false,
        }
    }
}

impl Status {
    fn update(&mut self, event: Event) {
        match event {
            Event::Loading => *self = Self::default(),
            Event::Ready { microphone } => {
                self.phase = Phase::Ready;
                self.mic_problem = microphone.is_err();
                self.warning = self.mic_problem;
                self.text = microphone.map_or_else(
                    |e| {
                        format!(
                            "La voce è pronta, ma {e}: per ora nessuno ti sentirà nelle chiamate."
                        )
                    },
                    |()| READY.into(),
                );
            }
            Event::Speaking => {
                self.phase = Phase::Speaking;
                if !self.mic_problem {
                    self.warning = false;
                    self.text = "Sto parlando…".into();
                }
            }
            Event::NotHeard => {
                self.phase = Phase::Speaking;
                self.text = "Nessuna chiamata sta usando il microfono «Kalliope»: sceglilo come microfono nell'app della riunione.".into();
            }
            Event::Idle => {
                self.phase = Phase::Ready;
                if !self.warning {
                    self.text = READY.into();
                }
            }
            Event::Error(e) => {
                self.phase = Phase::Error;
                self.warning = true;
                self.text = e;
            }
            Event::Warning(e) => {
                self.warning = true;
                self.text = e;
            }
        }
    }
}

pub struct Session {
    engine: Option<Engine>,
    pub history: Vec<String>,
    pub settings: Settings,
    pub voices: Vec<String>,
}

impl Session {
    pub fn open(on_status: impl Fn(Status) + Send + 'static) -> Self {
        let voices = voices();
        let mut settings = Settings::load();
        if !voices.contains(&settings.voice) {
            settings.voice = voices[0].clone();
        }
        let mut state = Status::default();
        let mut report = move |event| {
            state.update(event);
            on_status(state.clone());
        };
        let engine = if let Some(missing) = catalog::missing_voice() {
            report(Event::Error(missing));
            None
        } else {
            Some(Engine::start(
                config(settings.voice.clone(), settings.monitor),
                report,
            ))
        };
        Self {
            engine,
            history: Vec::new(),
            settings,
            voices,
        }
    }

    pub fn voice_index(&self) -> usize {
        self.voices
            .iter()
            .position(|v| *v == self.settings.voice)
            .unwrap_or(0)
    }
    fn send(&self, command: Command) -> bool {
        self.engine.as_ref().is_some_and(|e| e.send(command))
    }
    pub fn speak(&mut self, text: &str) -> bool {
        let text = text.trim();
        if text.is_empty() || !self.send(Command::Speak(text.into())) {
            return false;
        }
        self.history.retain(|entry| entry != text);
        self.history.insert(0, text.into());
        self.history.truncate(HISTORY);
        true
    }
    pub fn stop(&self) {
        self.send(Command::Stop);
    }
    pub fn change_voice(&mut self, index: usize) {
        if let Some(name) = self.voices.get(index) {
            self.settings.voice = name.clone();
            self.settings.save();
            self.send(Command::Voice(name.clone()));
        }
    }
    pub fn monitor(&mut self, on: bool) {
        self.settings.monitor = on;
        self.settings.save();
        self.send(Command::Monitor(on));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn unavailable_microphone_stays_visible_after_a_sentence() {
        let mut state = Status::default();
        state.update(Event::Ready {
            microphone: Err("microfono assente".into()),
        });
        state.update(Event::Speaking);
        state.update(Event::Idle);
        assert!(state.warning);
        assert!(state.text.contains("microfono assente"));
        state.update(Event::Ready { microphone: Ok(()) });
        assert!(!state.warning);
        assert_eq!(state.text, READY);
    }

    #[test]
    fn rejected_speech_does_not_enter_history() {
        let mut app = Session {
            engine: None,
            history: vec!["già detta".into()],
            settings: Settings::default(),
            voices: vec![],
        };
        assert!(!app.speak(" \t\n"));
        assert!(!app.speak("voce non disponibile"));
        assert_eq!(app.history, ["già detta"]);
    }
}
