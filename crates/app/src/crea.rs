// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! «Crea la tua voce» in the window: what each step shows and what it does next, from the recording, the file and the
//! engine's reports. [`Flow`] is pure (no window, no thread): events come in, the [`View`] the screen draws comes out, and
//! every message a person can meet is decided and tested here. `collega.rs` is the thin glue to Slint and to [`Session`].

use crate::engine::VoiceId;
use crate::own_voice::{
    CreateEvent, ImportEvent, Microphone, NameCheck, Origin, RecordingEvent, Take,
};
use kalliope_i18n::tr;

/// One stretch the voice can be made from, as the screen shows it.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct StretchView {
    pub title: String,
    pub detail: String,
    pub messages: String,
    pub usable: bool,
}

/// Everything «Crea la tua voce» draws (the `Creazione` global of the window).
#[derive(Debug, Clone, PartialEq, Default)]
pub struct View {
    pub step: i32,
    pub error: String,
    pub error_help: bool,
    pub importing: bool,
    pub import_file: String,
    pub import_progress: f32,
    pub mics: Vec<String>,
    pub mic: i32,
    pub opening: bool,
    pub checking: bool,
    pub recording: bool,
    pub level: f32,
    pub recorded_ms: i64,
    pub spoken_ms: i64,
    pub hint: String,
    pub stretches: Vec<StretchView>,
    pub chosen: i32,
    pub note: String,
    pub listening: i32,
    pub listening_left: f32,
    pub name_message: String,
    pub name_confirm: String,
    pub consent_message: String,
    pub making: bool,
    pub making_progress: f32,
}

/// What to make, when the person pressed «Crea la voce» and the name and the permission are in order.
#[derive(Debug, Clone, PartialEq)]
pub struct CreateRequest {
    pub stretch: usize,
    pub confirmed: bool,
}

pub fn no_voice_heard() -> String {
    tr!("programma.crea.non-ti-sento" => "Non ti sento. Avvicinati al microfono, controlla che non sia spento, o scegline un altro.")
}

fn too_loud() -> String {
    tr!("programma.crea.troppo-forte" => "Il suono è troppo forte: allontanati un po' dal microfono.")
}

fn no_permission() -> String {
    tr!("programma.crea.serve-permesso" => "Per continuare serve il permesso: spunta la casella.")
}

/// The name of a stretch in the list: its number, and a word for the clearest.
pub fn stretch_title(number: usize, clearest: bool) -> String {
    if clearest {
        // TRANSLATORS: The first stretch of a recording, the one where the voice is clearest: {numero} is its number
        tr!("programma.crea.tratto-chiaro" => "Tratto {numero} · il più chiaro", numero = number)
    } else {
        // TRANSLATORS(programma.crea.tratto): The name of a stretch of an imported recording where a voice was found, numbered: «Stretch 2». {numero} is the number.
        tr!("programma.crea.tratto" => "Tratto {numero}", numero = number)
    }
}

/// Where a stretch is in the recording and how much voice it has.
pub fn stretch_detail(start: &str, end: &str, speech_seconds: f32) -> String {
    // TRANSLATORS: A stretch of a recording: from {inizio} to {fine} (times like 0:12), with {secondi} seconds of voice
    tr!(
        "programma.crea.tratto-dettaglio" => "da {inizio} a {fine} · {secondi} s di voce",
        inizio = start,
        fine = end,
        secondi = format!("{speech_seconds:.0}")
    )
}

/// Seconds into a recording as «0:12».
fn clock(seconds: f32) -> String {
    let s = seconds.max(0.0) as u32;
    format!("{}:{:02}", s / 60, s % 60)
}

/// The level the bars follow: a speaking voice is about 0.05 to 0.15 of full scale, so it is stretched to fill the bars.
fn bars(rms: f32) -> f32 {
    (rms * 7.0).clamp(0.0, 1.0)
}

#[derive(Default)]
pub struct Flow {
    pub view: View,
    take: Option<Take>,
    mics: Vec<Microphone>,
    /// The name a yes was asked for («Tienilo», «Sostituisci»): a second press on the same name says yes.
    awaiting: Option<String>,
    clips: u32,
}

impl Flow {
    pub fn new() -> Flow {
        let mut f = Flow::default();
        f.reset();
        f
    }

    /// The screen opens: step 0, nothing left from before.
    pub fn reset(&mut self) {
        *self = Flow {
            view: View {
                listening: -1,
                ..View::default()
            },
            ..Flow::default()
        };
    }

    pub fn take(&self) -> Option<&Take> {
        self.take.as_ref()
    }

    #[cfg(test)]
    pub fn step(&self) -> i32 {
        self.view.step
    }

    /// «Registrala adesso»: the microphones, or why there is none. True when step 1 can open.
    pub fn microphones(&mut self, found: Result<Vec<Microphone>, String>) -> bool {
        self.view.error.clear();
        match found {
            Ok(list) if !list.is_empty() => {
                self.view.mics = list.iter().map(|m| m.label.clone()).collect();
                self.view.mic = list.iter().position(|m| m.default).unwrap_or(0) as i32;
                self.mics = list;
                self.view.step = 1;
                true
            }
            Ok(_) => {
                self.fail(&crate::own_voice::no_microphone());
                false
            }
            Err(e) => {
                self.fail(&e);
                false
            }
        }
    }

    fn fail(&mut self, message: &str) {
        self.view.error = message.into();
        self.view.error_help = true;
    }

    pub fn choose_microphone(&mut self, i: i32) {
        if i >= 0 && (i as usize) < self.mics.len() {
            self.view.mic = i;
        }
    }

    /// The name of the microphone to record from, for [`crate::session::Session::start_recording`].
    pub fn microphone_name(&self) -> Option<String> {
        self.mics
            .get(self.view.mic as usize)
            .map(|m| m.name.clone())
    }

    /// The round button was pressed to record: the microphone is being opened.
    pub fn recording_requested(&mut self) {
        self.view.error.clear();
        self.view.hint.clear();
        self.view.opening = true;
        self.view.level = 0.0;
        self.view.recorded_ms = 0;
        self.view.spoken_ms = 0;
        self.clips = 0;
    }

    /// The round button was pressed to stop: the take follows.
    pub fn stop_requested(&mut self) {
        self.view.checking = true;
    }

    /// The recording was thrown away.
    pub fn recording_cancelled(&mut self) {
        self.view.opening = false;
        self.view.checking = false;
        self.view.recording = false;
        self.view.level = 0.0;
        self.view.recorded_ms = 0;
        self.view.spoken_ms = 0;
        self.view.hint.clear();
    }

    pub fn on_recording(&mut self, event: RecordingEvent) {
        match event {
            RecordingEvent::Started { .. } => {
                self.view.opening = false;
                self.view.recording = true;
            }
            RecordingEvent::Level {
                rms,
                peak,
                seconds,
                speech_seconds,
            } => {
                self.view.level = bars(rms);
                self.view.recorded_ms = (seconds * 1000.0) as i64;
                self.view.spoken_ms = (speech_seconds * 1000.0) as i64;
                if peak >= 0.99 {
                    self.clips += 1;
                }
                self.view.hint = if seconds >= 4.0 && speech_seconds < 0.5 {
                    no_voice_heard()
                } else if self.clips >= 5 {
                    too_loud()
                } else {
                    String::new()
                };
            }
            RecordingEvent::Finished(take) => {
                self.recording_cancelled();
                self.take_ready(take);
            }
            RecordingEvent::Failed(message) => {
                self.recording_cancelled();
                self.fail(&message);
            }
        }
    }

    /// A file was chosen: it is being read.
    pub fn import_started(&mut self, file: &str) {
        self.view.error.clear();
        self.view.importing = true;
        self.view.import_file = file.into();
        self.view.import_progress = 0.0;
    }

    pub fn import_cancelled(&mut self) {
        self.view.importing = false;
    }

    /// The chooser did not open (it came back at once with nothing): say so, with a way out.
    pub fn chooser_missing(&mut self) {
        self.fail(&tr!("programma.crea.scelta-file-non-si-apre" => "Non si apre la finestra per scegliere il file. Riprova; se succede ancora, serve il portale del tuo desktop o il programma «zenity»."));
    }

    pub fn on_import(&mut self, event: ImportEvent) {
        match event {
            ImportEvent::Progress(p) => self.view.import_progress = p.clamp(0.0, 1.0),
            ImportEvent::Finished(take) => {
                self.view.importing = false;
                self.take_ready(take);
            }
            ImportEvent::Failed(message) => {
                self.view.importing = false;
                self.fail(&message);
            }
        }
    }

    /// A recording or a file is ready: step 2, with its stretches.
    pub fn take_ready(&mut self, take: Take) {
        self.view.error.clear();
        self.view.step = 2;
        self.view.note = take.note.clone().unwrap_or_default();
        self.view.stretches = if take.stretches.is_empty() {
            // nothing to choose from: the whole take, with what is wrong with it
            vec![StretchView {
                title: "Registrazione".into(),
                detail: format!("{:.0} s", take.seconds),
                messages: take
                    .problems
                    .iter()
                    .map(|p| p.message())
                    .collect::<Vec<_>>()
                    .join(" "),
                usable: false,
            }]
        } else {
            take.stretches
                .iter()
                .enumerate()
                .map(|(i, s)| StretchView {
                    title: stretch_title(i + 1, i == 0 && take.stretches.len() > 1),
                    detail: stretch_detail(
                        &clock(s.start),
                        &clock(s.end),
                        s.quality.speech_seconds,
                    ),
                    messages: s
                        .problems
                        .iter()
                        .map(|p| p.message())
                        .collect::<Vec<_>>()
                        .join(" "),
                    usable: take.usable(i),
                })
                .collect()
        };
        self.view.chosen = self
            .view
            .stretches
            .iter()
            .position(|s| s.usable)
            .unwrap_or(0) as i32;
        self.view.listening = -1;
        self.take = Some(take);
        self.awaiting = None;
        self.view.name_message.clear();
        self.view.name_confirm.clear();
        self.view.consent_message.clear();
    }

    /// «Rifai»: back to the step that makes a new take (reading for a recording, the choice for a file).
    pub fn redo(&mut self) {
        let from_file = self
            .take
            .as_ref()
            .is_some_and(|t| matches!(t.origin, Origin::File(_)));
        self.take = None;
        self.view.stretches.clear();
        self.view.note.clear();
        self.view.step = if from_file { 0 } else { 1 };
        self.view.listening = -1;
        self.view.error.clear();
        self.view.recorded_ms = 0;
        self.view.spoken_ms = 0;
        self.view.level = 0.0;
    }

    pub fn listening(&mut self, stretch: Option<usize>) {
        self.view.listening = stretch.map_or(-1, |i| i as i32);
        self.view.listening_left = if stretch.is_some() { 1.0 } else { 0.0 };
    }

    /// The name was edited: what was said about the old one no longer holds.
    pub fn name_edited(&mut self) {
        self.view.name_message.clear();
        self.view.name_confirm.clear();
        self.view.consent_message.clear();
        self.awaiting = None;
    }

    /// «Crea la voce» was pressed. Returns what to make when the name and the permission are in order; otherwise the view
    /// says what is missing, next to the field it concerns. A name that is Kalliope's, or one already used, is asked once:
    /// the second press on the same name says yes.
    pub fn press_create(
        &mut self,
        name: &str,
        consent: bool,
        check: NameCheck,
    ) -> Option<CreateRequest> {
        self.view.error.clear();
        self.view.name_message.clear();
        self.view.consent_message.clear();
        let stretch = self.view.chosen.max(0) as usize;
        let usable = self.view.stretches.get(stretch).is_some_and(|s| s.usable);
        if !usable {
            self.view.error = tr!("programma.crea.tratto-inutilizzabile" => "Da questo tratto non si può creare la voce: scegli un altro tratto, o rifai.");
            return None;
        }
        if name.trim().is_empty() {
            self.view.name_message = NameCheck::Empty.message().unwrap_or_default();
            return None;
        }
        if !consent {
            self.view.consent_message = no_permission();
            return None;
        }
        match &check {
            NameCheck::Free { .. } => Some(CreateRequest {
                stretch,
                confirmed: false,
            }),
            NameCheck::Empty | NameCheck::TooLong => {
                self.view.name_message = check.message().unwrap_or_default();
                None
            }
            NameCheck::SameAsKalliope { file, .. } | NameCheck::Exists { file, .. } => {
                if self.awaiting.as_deref() == Some(file.as_str()) {
                    return Some(CreateRequest {
                        stretch,
                        confirmed: true,
                    });
                }
                self.view.name_message = check.message().unwrap_or_default();
                self.view.name_confirm = match check {
                    NameCheck::Exists { .. } => {
                        // TRANSLATORS(programma.crea.sostituisci-voce): A button: replace the existing voice that has the same name with the new one.
                        tr!("programma.crea.sostituisci-voce" => "Sostituisci la voce")
                    }
                    _ => keep_name(),
                };
                self.awaiting = Some(file.clone());
                None
            }
        }
    }

    /// The engine refused the name at the last moment (a name taken in the meantime): say it as before.
    pub fn name_refused(&mut self, check: NameCheck) {
        self.view.making = false;
        self.view.name_message = check.message().unwrap_or_default();
    }

    /// The voice is being made.
    pub fn making_started(&mut self) {
        self.view.making = true;
        self.view.making_progress = 0.0;
        self.view.error.clear();
    }

    pub fn making_cancelled(&mut self) {
        self.view.making = false;
    }

    /// The voice is made (`Some(id)`: put it in the menu and choose it) or it failed.
    pub fn on_create(&mut self, event: CreateEvent) -> Option<VoiceId> {
        match event {
            CreateEvent::Progress(p) => {
                self.view.making_progress = p.clamp(0.0, 1.0);
                None
            }
            CreateEvent::Done(id) => {
                self.view.making = false;
                Some(id)
            }
            CreateEvent::Failed(message) => {
                self.view.making = false;
                self.fail(&message);
                None
            }
        }
    }
}

/// The command that keeps a name Kalliope's own voices have.
pub fn keep_name() -> String {
    // TRANSLATORS(programma.crea.tieni-nome): A button: keep this name, although one of Kalliope's own voices has it too.
    tr!("programma.crea.tieni-nome" => "Tieni questo nome")
}

/// What the main window says once a voice is made and chosen.
pub fn made_notice(name: &str) -> String {
    tr!("programma.crea.voce-pronta" => "La voce «{nome}» è pronta, e adesso parla lei.", nome = name)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mic(name: &str, label: &str, default: bool) -> Microphone {
        Microphone {
            name: name.into(),
            label: label.into(),
            default,
        }
    }

    fn level(seconds: f32, speech: f32, rms: f32, peak: f32) -> RecordingEvent {
        RecordingEvent::Level {
            rms,
            peak,
            seconds,
            speech_seconds: speech,
        }
    }

    #[test]
    fn with_no_microphone_the_choice_says_so_and_offers_the_guide() {
        let mut f = Flow::new();
        assert!(!f.microphones(Ok(vec![])));
        assert_eq!(f.step(), 0);
        assert!(f.view.error.contains("Non trovo un microfono"));
        assert!(f.view.error_help);
        assert!(!f.microphones(Err("Il servizio audio del computer non risponde.".into())));
        assert!(f.view.error.contains("servizio audio"));
        // a microphone coming back clears it
        assert!(f.microphones(Ok(vec![mic("a", "Cuffia", true)])));
        assert!(f.view.error.is_empty());
        assert_eq!(f.step(), 1);
    }

    #[test]
    fn the_default_microphone_is_chosen_first_and_can_be_changed() {
        let mut f = Flow::new();
        f.microphones(Ok(vec![
            mic("usb", "Microfono USB", false),
            mic("int", "Interno", true),
        ]));
        assert_eq!(f.view.mic, 1);
        assert_eq!(f.microphone_name().as_deref(), Some("int"));
        f.choose_microphone(0);
        assert_eq!(f.microphone_name().as_deref(), Some("usb"));
        f.choose_microphone(9);
        assert_eq!(f.view.mic, 0);
    }

    #[test]
    fn the_level_and_the_twelve_seconds_follow_the_recording() {
        let mut f = Flow::new();
        f.microphones(Ok(vec![mic("a", "Cuffia", true)]));
        f.recording_requested();
        assert!(f.view.opening && !f.view.recording);
        f.on_recording(RecordingEvent::Started {
            microphone: "Cuffia".into(),
        });
        assert!(f.view.recording && !f.view.opening);
        f.on_recording(level(6.0, 4.5, 0.08, 0.4));
        assert_eq!((f.view.recorded_ms, f.view.spoken_ms), (6000, 4500));
        assert!(f.view.level > 0.4 && f.view.level <= 1.0);
        assert!(f.view.hint.is_empty());
    }

    #[test]
    fn a_microphone_that_hears_nothing_is_told_after_a_few_seconds() {
        let mut f = Flow::new();
        f.recording_requested();
        f.on_recording(level(2.0, 0.0, 0.0, 0.0));
        assert!(f.view.hint.is_empty(), "too early to say");
        f.on_recording(level(4.5, 0.0, 0.0, 0.0));
        assert!(f.view.hint.contains("Non ti sento"));
        // the voice comes: the advice goes
        f.on_recording(level(5.0, 1.0, 0.1, 0.5));
        assert!(f.view.hint.is_empty());
    }

    #[test]
    fn a_voice_that_is_too_loud_is_told_only_when_it_keeps_clipping() {
        let mut f = Flow::new();
        f.recording_requested();
        for i in 0..4 {
            f.on_recording(level(1.0 + i as f32 * 0.05, 1.0, 0.3, 1.0));
        }
        assert!(f.view.hint.is_empty());
        f.on_recording(level(1.3, 1.2, 0.3, 1.0));
        assert!(f.view.hint.contains("troppo forte"));
    }

    #[test]
    fn a_failed_recording_stays_on_the_step_with_its_message() {
        let mut f = Flow::new();
        f.microphones(Ok(vec![mic("a", "Cuffia", true)]));
        f.recording_requested();
        f.on_recording(RecordingEvent::Failed(
            "Il microfono non si è aperto. Riprova, o scegli un altro microfono.".into(),
        ));
        assert_eq!(f.step(), 1);
        assert!(!f.view.opening && !f.view.recording && !f.view.checking);
        assert!(f.view.error.contains("non si è aperto"));
        assert!(f.view.error_help);
        // trying again clears the message
        f.recording_requested();
        assert!(f.view.error.is_empty());
    }

    #[test]
    fn a_failed_import_stays_on_the_choice_with_its_message() {
        let mut f = Flow::new();
        f.import_started("nota.txt");
        assert!(f.view.importing);
        f.on_import(ImportEvent::Progress(0.4));
        assert_eq!(f.view.import_progress, 0.4);
        f.on_import(ImportEvent::Failed(
            "Questo file non è audio, o non lo riconosco.".into(),
        ));
        assert_eq!(f.step(), 0);
        assert!(!f.view.importing);
        assert!(f.view.error.contains("non è audio"));
        assert!(f.view.error_help);
        f.import_started("altro.mp3");
        assert!(f.view.error.is_empty());
    }

    #[test]
    fn a_chooser_that_never_opened_is_not_taken_for_a_cancel() {
        let mut f = Flow::new();
        f.chooser_missing();
        assert!(f.view.error.contains("finestra per scegliere il file"));
        assert!(f.view.error_help);
    }

    #[test]
    fn an_empty_name_and_a_missing_permission_say_what_is_missing() {
        let mut f = Flow::new();
        f.view.step = 2;
        f.view.stretches = vec![StretchView {
            usable: true,
            ..StretchView::default()
        }];
        let free = |n: &str| NameCheck::Free { file: n.into() };
        assert!(f.press_create("  ", true, NameCheck::Empty).is_none());
        assert!(f.view.name_message.contains("Scrivi un nome"));
        assert!(f.press_create("Anna", false, free("Anna")).is_none());
        assert!(f.view.name_message.is_empty());
        assert!(f.view.consent_message.contains("serve il permesso"));
        let go = f.press_create("Anna", true, free("Anna"));
        assert_eq!(
            go,
            Some(CreateRequest {
                stretch: 0,
                confirmed: false
            })
        );
        assert!(f.view.consent_message.is_empty());
    }

    #[test]
    fn a_name_that_is_kalliopes_or_taken_is_asked_once_then_confirmed() {
        let mut f = Flow::new();
        f.view.step = 2;
        f.view.stretches = vec![StretchView {
            usable: true,
            ..StretchView::default()
        }];
        let same = NameCheck::SameAsKalliope {
            name: "Giulia".into(),
            file: "Giulia".into(),
        };
        assert!(f.press_create("Giulia", true, same.clone()).is_none());
        assert!(
            f.view.name_message.contains("«Giulia (voce propria)»")
                || f.view.name_message.contains("voce propria")
        );
        assert_eq!(f.view.name_confirm, "Tieni questo nome");
        // the second press on the same name is the yes
        let go = f.press_create("Giulia", true, same.clone());
        assert_eq!(go.map(|g| g.confirmed), Some(true));
        // editing the name takes the question back
        f.press_create("Giulia", true, same.clone());
        f.name_edited();
        assert!(f.view.name_message.is_empty() && f.view.name_confirm.is_empty());
        assert!(f.press_create("Giulia", true, same).is_none());
        // a name already used asks to replace
        let exists = NameCheck::Exists {
            name: "Anna".into(),
            file: "Anna".into(),
        };
        f.name_edited();
        assert!(f.press_create("anna", true, exists).is_none());
        assert_eq!(f.view.name_confirm, "Sostituisci la voce");
    }

    #[test]
    fn a_stretch_that_cannot_make_a_voice_is_never_made() {
        let mut f = Flow::new();
        f.view.step = 2;
        f.view.stretches = vec![StretchView {
            usable: false,
            ..StretchView::default()
        }];
        let free = NameCheck::Free {
            file: "Anna".into(),
        };
        assert!(f.press_create("Anna", true, free).is_none());
        assert!(f.view.error.contains("non si può creare"));
    }

    #[test]
    fn a_made_voice_is_handed_back_and_a_failed_one_says_why() {
        let mut f = Flow::new();
        f.making_started();
        assert!(f.view.making);
        assert_eq!(f.on_create(CreateEvent::Progress(0.5)), None);
        assert_eq!(f.view.making_progress, 0.5);
        let id = VoiceId::Own("Anna".into());
        assert_eq!(f.on_create(CreateEvent::Done(id.clone())), Some(id));
        assert!(!f.view.making);
        f.making_started();
        f.on_create(CreateEvent::Failed(
            "Non sono riuscita a creare la voce.".into(),
        ));
        assert!(!f.view.making);
        assert!(f.view.error.contains("Non sono riuscita"));
        assert!(f.view.error_help);
    }

    #[test]
    fn clock_and_notice_read_like_a_person_would() {
        assert_eq!(clock(0.0), "0:00");
        assert_eq!(clock(72.4), "1:12");
        assert_eq!(
            made_notice("Anna"),
            "La voce «Anna» è pronta, e adesso parla lei."
        );
    }
}
