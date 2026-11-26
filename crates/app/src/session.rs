// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The same speech controls, preferences and status messages on every desktop.
use super::{Command, Engine, Event, HISTORY, Phase, READY, Settings, catalog, config, voices};
use crate::engine::{Said, Sounding, VoiceId, has_speech};
use crate::settings;
use std::sync::{Arc, Mutex};

const NOT_HEARD: &str = "Nessuno nella chiamata ha sentito la frase: nessuna app sta usando il microfono «Kalliope». Sceglilo come microfono nell'app della riunione.";
const NOTHING_TO_SAY: &str =
    "Non c'è niente da dire in questo testo: scrivi almeno una parola, poi premi Invio.";

#[derive(Clone)]
pub struct Status {
    pub phase: Phase,
    pub text: String,
    pub warning: bool,
    /// Position in the voice menu of the voice really in use, once it has loaded.
    pub voice_index: Option<usize>,
    /// The piece of the phrase sounding now, while Kalliope speaks: what to light in the phrase.
    pub sounding: Option<Sounding>,
    /// What Stop left of the last phrase it cut, until the next phrase starts.
    pub interrupted: Option<Said>,
    mic_problem: bool,
    not_heard: bool,
}

impl Default for Status {
    fn default() -> Self {
        Self {
            phase: Phase::Loading,
            text: "Preparo la voce…".into(),
            warning: false,
            voice_index: None,
            sounding: None,
            interrupted: None,
            mic_problem: false,
            not_heard: false,
        }
    }
}

impl Status {
    fn update(&mut self, event: Event, voices: &[VoiceId]) {
        match event {
            Event::Sounding(piece) => {
                self.interrupted = None;
                self.sounding = Some(piece);
                return;
            }
            Event::Interrupted(said) => {
                self.sounding = None;
                self.interrupted = Some(said);
                return;
            }
            Event::Idle => self.sounding = None,
            _ => {}
        }
        match event {
            Event::Loading => *self = Self::default(),
            Event::Ready { microphone } => {
                self.phase = Phase::Ready;
                self.microphone(microphone);
            }
            Event::Microphone(microphone) => self.microphone(microphone),
            Event::Voice(id) => {
                let index = voices.iter().position(|v| *v == id);
                // Another voice now speaks: a message about an earlier one is old news.
                let changed = self.voice_index.is_some() && index != self.voice_index;
                if changed && self.warning && !self.mic_problem && !self.not_heard {
                    self.warning = false;
                    if self.phase == Phase::Ready {
                        self.text = READY.into();
                    }
                }
                self.voice_index = index;
            }
            Event::Speaking => {
                self.phase = Phase::Speaking;
                self.not_heard = false;
                if !self.mic_problem {
                    self.warning = false;
                    self.text = "Sto parlando…".into();
                }
            }
            Event::NotHeard => {
                self.phase = Phase::Speaking;
                if !self.mic_problem {
                    self.not_heard = true;
                    self.warning = true;
                    self.text = NOT_HEARD.into();
                }
            }
            Event::Heard => {
                if self.not_heard {
                    self.not_heard = false;
                    self.warning = false;
                    self.text = READY.into();
                }
            }
            Event::Idle => {
                self.phase = Phase::Ready;
                if !self.warning {
                    self.text = READY.into();
                }
            }
            Event::NothingToSay => {
                self.warning = true;
                self.not_heard = false;
                self.text = NOTHING_TO_SAY.into();
            }
            Event::Error(e) => {
                self.phase = Phase::Error;
                self.warning = true;
                self.text = e;
            }
            Event::Warning(e) => {
                self.warning = true;
                self.not_heard = false;
                self.text = e;
            }
            Event::Sounding(_) | Event::Interrupted(_) => {}
        }
    }

    fn microphone(&mut self, microphone: Result<(), String>) {
        match microphone {
            Err(e) => {
                self.mic_problem = true;
                self.warning = true;
                self.not_heard = false;
                self.text =
                    format!("La voce è pronta, ma {e}: per ora nessuno ti sentirà nelle chiamate.");
            }
            Ok(()) => {
                if self.mic_problem || !self.warning {
                    self.mic_problem = false;
                    self.warning = false;
                    self.text = if self.phase == Phase::Speaking {
                        "Sto parlando…".into()
                    } else {
                        READY.into()
                    };
                }
            }
        }
    }
}

type Report = Arc<Mutex<Box<dyn FnMut(Event) + Send>>>;

pub struct Session {
    engine: Option<Engine>,
    pub history: Vec<String>,
    pub settings: Settings,
    /// The names in the voice menu, in the order of `choices`.
    pub voices: Vec<String>,
    pub choices: Vec<VoiceId>,
    report: Report,
}

impl Session {
    pub fn open(on_status: impl Fn(Status) + Send + 'static) -> Self {
        let choices = voices();
        let mut settings = Settings::load();
        if !choices.contains(&settings.voice) {
            settings.voice = choices[0].clone();
        }
        let mut state = Status::default();
        let menu = choices.clone();
        let report: Report = Arc::new(Mutex::new(Box::new(move |event: Event| {
            // The voice is remembered only once it has loaded.
            if let Event::Voice(id) = &event {
                settings::save_voice(id);
            }
            state.update(event, &menu);
            on_status(state.clone());
        })));
        let engine = if let Some(missing) = catalog::missing_voice() {
            (report.lock().unwrap_or_else(|e| e.into_inner()))(Event::Error(missing));
            None
        } else {
            let report = report.clone();
            Some(Engine::start(
                config(settings.voice.clone(), settings.monitor),
                move |event| (report.lock().unwrap_or_else(|e| e.into_inner()))(event),
            ))
        };
        Self {
            engine,
            history: Vec::new(),
            settings,
            voices: choices.iter().map(VoiceId::label).collect(),
            choices,
            report,
        }
    }

    fn report(&self, event: Event) {
        (self.report.lock().unwrap_or_else(|e| e.into_inner()))(event);
    }

    pub fn voice_index(&self) -> usize {
        self.choices
            .iter()
            .position(|v| *v == self.settings.voice)
            .unwrap_or(0)
    }
    fn send(&self, command: Command) -> bool {
        self.engine.as_ref().is_some_and(|e| e.send(command))
    }
    /// Says `text`; a text with nothing to say is refused with a message and stays out of the
    /// history.
    pub fn speak(&mut self, text: &str) -> bool {
        let text = text.trim();
        if text.is_empty() {
            return false;
        }
        if !has_speech(text) {
            self.report(Event::NothingToSay);
            return false;
        }
        if !self.send(Command::Speak(text.into())) {
            return false;
        }
        self.history.retain(|entry| entry != text);
        self.history.insert(0, text.into());
        self.history.truncate(HISTORY);
        true
    }
    pub fn stop(&self) {
        if let Some(engine) = &self.engine {
            engine.stop();
        }
    }
    /// Asks for another voice. The menu and the settings follow only once it has loaded
    /// ([`Status::voice_index`]).
    pub fn change_voice(&mut self, index: usize) {
        if let Some(id) = self.choices.get(index) {
            self.send(Command::Voice(id.clone()));
        }
    }
    pub fn monitor(&mut self, on: bool) {
        self.settings.monitor = on;
        settings::save_monitor(on);
        self.send(Command::Monitor(on));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn session() -> (Session, Arc<Mutex<Vec<Status>>>) {
        let seen = Arc::new(Mutex::new(Vec::new()));
        let log = seen.clone();
        let mut state = Status::default();
        let report: Report = Arc::new(Mutex::new(Box::new(move |event| {
            state.update(event, &[]);
            log.lock().unwrap().push(state.clone());
        })));
        let app = Session {
            engine: None,
            history: vec!["già detta".into()],
            settings: Settings::default(),
            voices: vec![],
            choices: vec![],
            report,
        };
        (app, seen)
    }

    #[test]
    fn unavailable_microphone_stays_visible_after_a_sentence() {
        let mut state = Status::default();
        state.update(
            Event::Ready {
                microphone: Err("microfono assente".into()),
            },
            &[],
        );
        state.update(Event::Speaking, &[]);
        state.update(Event::Idle, &[]);
        assert!(state.warning);
        assert!(state.text.contains("microfono assente"));
        state.update(Event::Ready { microphone: Ok(()) }, &[]);
        assert!(!state.warning);
        assert_eq!(state.text, READY);
    }

    #[test]
    fn the_microphone_coming_back_after_pipewire_restarts_is_shown() {
        let mut state = Status::default();
        state.update(Event::Ready { microphone: Ok(()) }, &[]);
        state.update(Event::Microphone(Err("PipeWire non risponde".into())), &[]);
        assert!(state.warning && state.text.contains("PipeWire non risponde"));
        state.update(Event::Microphone(Ok(())), &[]);
        assert!(!state.warning);
        assert_eq!(state.text, READY);
    }

    #[test]
    fn the_notice_that_nobody_heard_stays_until_someone_listens() {
        let mut state = Status::default();
        state.update(Event::Ready { microphone: Ok(()) }, &[]);
        state.update(Event::NotHeard, &[]);
        state.update(Event::Idle, &[]);
        assert!(state.warning);
        assert_eq!(state.text, NOT_HEARD);
        assert_eq!(state.phase, Phase::Ready);
        state.update(Event::Heard, &[]);
        assert!(!state.warning);
        assert_eq!(state.text, READY);
    }

    #[test]
    fn the_menu_follows_the_voice_really_in_use() {
        let voices = [
            VoiceId::default(),
            VoiceId::Klein("Marco".into()),
            VoiceId::Own("Marco".into()),
        ];
        let mut state = Status::default();
        state.update(Event::Voice(VoiceId::Own("Marco".into())), &voices);
        assert_eq!(state.voice_index, Some(2));
        state.update(Event::Voice(VoiceId::default()), &voices);
        assert_eq!(state.voice_index, Some(0));
        // A failed switch: the warning stays while the menu goes back to the voice in use.
        state.phase = Phase::Ready;
        state.update(
            Event::Warning("La voce «Rotta» non si apre".into()),
            &voices,
        );
        state.update(Event::Voice(VoiceId::default()), &voices);
        assert!(state.warning && state.text.contains("Rotta"));
        // Another voice loads: the old warning goes.
        state.update(Event::Voice(VoiceId::Own("Marco".into())), &voices);
        assert!(!state.warning);
        assert_eq!(state.text, READY);
    }

    #[test]
    fn choosing_a_voice_saves_nothing_until_it_loads() {
        let (mut app, _) = session();
        app.choices = vec![VoiceId::default(), VoiceId::Own("Rotta".into())];
        app.change_voice(1);
        assert_eq!(app.settings.voice, VoiceId::default());
    }

    #[test]
    fn rejected_speech_does_not_enter_history() {
        let (mut app, _) = session();
        assert!(!app.speak(" \t\n"));
        assert!(!app.speak("voce non disponibile"));
        assert_eq!(app.history, ["già detta"]);
    }

    #[test]
    fn a_text_with_nothing_to_say_is_explained_and_kept_out_of_history() {
        let (mut app, seen) = session();
        for text in ["…", "👍", "?!"] {
            assert!(!app.speak(text));
        }
        assert_eq!(app.history, ["già detta"]);
        let last = seen.lock().unwrap().last().cloned().expect("a message");
        assert!(last.warning);
        assert_eq!(last.text, NOTHING_TO_SAY);
    }
}
