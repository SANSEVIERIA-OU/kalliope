// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The same speech controls, preferences and status messages on every desktop.
use super::{Command, Engine, Event, Phase, READY, Settings, catalog, config, voices};
use crate::engine::{Said, Sounding, VoiceId, has_speech};
use crate::own_voice::{
    self, CreateEvent, Creation, Import, ImportEvent, Listening, Microphone, NameCheck, Recording,
    RecordingEvent, TempFolder,
};
use crate::{history, settings};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::Duration;

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
    /// The phrases said, newest first, kept across restarts ([`history`]).
    pub history: Vec<String>,
    pub settings: Settings,
    /// The names in the voice menu, in the order of `choices`.
    pub voices: Vec<String>,
    pub choices: Vec<VoiceId>,
    report: Report,
    /// `choices` as the status reports see them, so a new voice gets its place in the menu.
    menu: Arc<Mutex<Vec<VoiceId>>>,
    history_file: PathBuf,
    making: Making,
}

/// The jobs of creating a personal voice: at most one of each at a time.
#[derive(Default)]
struct Making {
    recording: Option<Recording>,
    import: Option<Import>,
    creation: Option<Creation>,
    listening: Listening,
    temp: Option<TempFolder>,
}

impl Session {
    pub fn open(on_status: impl Fn(Status) + Send + 'static) -> Self {
        let choices = voices();
        let mut settings = Settings::load();
        if !choices.contains(&settings.voice) {
            settings.voice = choices[0].clone();
        }
        let mut state = Status::default();
        let menu = Arc::new(Mutex::new(choices.clone()));
        let shared = menu.clone();
        let report: Report = Arc::new(Mutex::new(Box::new(move |event: Event| {
            // The voice is remembered only once it has loaded.
            if let Event::Voice(id) = &event {
                settings::save_voice(id);
            }
            state.update(event, &shared.lock().unwrap_or_else(|e| e.into_inner()));
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
        let history_file = history::file();
        Self {
            engine,
            history: history::load(&history_file),
            settings,
            voices: choices.iter().map(VoiceId::label).collect(),
            choices,
            report,
            menu,
            history_file,
            making: Making::default(),
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
        history::add(&mut self.history, text);
        history::save(&self.history_file, &self.history);
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

    /// The history for the window's list.
    pub fn history_model(&self) -> Vec<slint::SharedString> {
        self.history.iter().map(|h| h.as_str().into()).collect()
    }

    #[allow(
        dead_code,
        reason = "called by the window, which the new window wires (#13)"
    )]
    /// Empties the history, in the window and on the disk.
    pub fn clear_history(&mut self) {
        self.history.clear();
        history::save(&self.history_file, &self.history);
    }

    #[allow(
        dead_code,
        reason = "called by the window, which the new window wires (#13)"
    )]
    /// Sets and remembers the size of the text (1 is the design's); returns the size kept, within
    /// [`settings::TEXT_SCALE`].
    pub fn set_text_scale(&mut self, scale: f32) -> f32 {
        let (low, high) = (*settings::TEXT_SCALE.start(), *settings::TEXT_SCALE.end());
        let scale = if scale.is_finite() {
            scale.clamp(low, high)
        } else {
            1.0
        };
        self.settings.text_scale = scale;
        settings::save_text_scale(scale);
        scale
    }

    #[allow(
        dead_code,
        reason = "called by the window, which the new window wires (#13)"
    )]
    /// Turns the compact meeting mode on or off, and remembers it.
    pub fn set_compact(&mut self, on: bool) {
        self.settings.compact = on;
        settings::save_compact(on);
    }

    /// Reads the voices folder again, after a voice was made ([`CreateEvent::Done`]); returns
    /// whether the menu changed. The menu keeps Giulia and Marco first, then the personal voices.
    pub fn refresh_voices(&mut self) -> bool {
        let choices = voices();
        if choices == self.choices {
            return false;
        }
        self.voices = choices.iter().map(VoiceId::label).collect();
        *self.menu.lock().unwrap_or_else(|e| e.into_inner()) = choices.clone();
        self.choices = choices;
        true
    }

    /// The position of `id` in the voice menu.
    pub fn voice_position(&self, id: &VoiceId) -> Option<usize> {
        self.choices.iter().position(|v| v == id)
    }

    #[allow(
        dead_code,
        reason = "called by the window, which the new window wires (#13)"
    )]
    /// The microphones a voice can be recorded from, the default first; never Kalliope's own.
    pub fn microphones(&self) -> Result<Vec<Microphone>, String> {
        own_voice::microphones()
    }

    /// Starts recording a voice from `microphone` (a [`Microphone::name`]) or the default one.
    /// Kalliope stops speaking first, so its voice is not recorded. Events come on another thread:
    /// a level about every 50 ms, then the finished take or why it failed.
    pub fn start_recording(
        &mut self,
        microphone: Option<String>,
        on_event: impl Fn(RecordingEvent) + Send + 'static,
    ) {
        self.stop();
        self.making.listening.stop();
        if let Some(old) = self.making.recording.take() {
            old.cancel();
        }
        let temp = self
            .making
            .temp
            .get_or_insert_with(TempFolder::new)
            .0
            .clone();
        self.making.recording = Some(Recording::start(microphone, temp, on_event));
    }

    /// Ends the recording: the take follows ([`RecordingEvent::Finished`]).
    pub fn stop_recording(&self) {
        if let Some(r) = &self.making.recording {
            r.stop();
        }
    }

    /// Throws the recording away.
    pub fn cancel_recording(&mut self) {
        if let Some(r) = self.making.recording.take() {
            r.cancel();
        }
    }

    /// Reads an audio or video file to make a voice from; events come on another thread.
    pub fn import_voice_file(
        &mut self,
        path: PathBuf,
        on_event: impl Fn(ImportEvent) + Send + 'static,
    ) {
        if let Some(old) = self.making.import.take() {
            old.cancel();
        }
        self.making.import = Some(Import::start(path, on_event));
    }

    pub fn cancel_import(&mut self) {
        if let Some(i) = self.making.import.take() {
            i.cancel();
        }
    }

    /// Plays stretch `stretch` of `take` on the speakers (never into the call); returns how long
    /// it lasts.
    pub fn listen(&self, take: &own_voice::Take, stretch: usize) -> Result<Duration, String> {
        self.making.listening.play(take.stretch_audio(stretch))
    }

    pub fn stop_listening(&self) {
        self.making.listening.stop();
    }

    /// Seconds of the stretch still to play.
    pub fn listening_left(&self) -> f32 {
        self.making.listening.remaining()
    }

    /// Whether `name` can be given to a new voice, and what to say if not.
    pub fn check_voice_name(&self, name: &str) -> NameCheck {
        own_voice::check_name(name, &catalog::voices_dir())
    }

    /// Makes a voice named `name` from stretch `stretch` of `take`, off the window's thread, and
    /// saves it in the voices folder. `confirmed` keeps a name that is Kalliope's or replaces a
    /// voice with the same name; without it such a name is refused here with what to ask. When
    /// [`CreateEvent::Done`] comes, call [`Session::refresh_voices`] and choose it.
    pub fn create_voice(
        &mut self,
        take: &own_voice::Take,
        stretch: usize,
        name: &str,
        confirmed: bool,
        on_event: impl Fn(CreateEvent) + Send + 'static,
    ) -> Result<(), NameCheck> {
        if let Some(old) = self.making.creation.take() {
            old.cancel();
        }
        let model = kalliope_sample::Model {
            pocket_dir: catalog::pocket_dir(),
            options: kalliope_voice::pocket::PocketOptions {
                ort_lib: kalliope_voice::find_runtime(),
                ..Default::default()
            },
        };
        let job = Creation::start(
            take,
            stretch,
            name,
            confirmed,
            model,
            &catalog::voices_dir(),
            on_event,
        )?;
        self.making.creation = Some(job);
        Ok(())
    }

    /// Stops making the voice: nothing is saved.
    pub fn cancel_voice(&mut self) {
        if let Some(c) = self.making.creation.take() {
            c.cancel();
        }
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
            menu: Arc::default(),
            history_file: std::env::temp_dir()
                .join(format!("kalliope-session-{}", std::process::id()))
                .join("history.txt"),
            making: Making::default(),
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
