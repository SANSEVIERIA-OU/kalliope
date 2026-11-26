// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The window wired to the engine, the session and the system: the bubble that lights each word as the voice says it, the
//! history, the remembered text size and meeting mode, «Crea la tua voce» (recording, a file chosen with the system's own
//! chooser, listening, naming, making) and the way out of a problem. The decisions are in `avanzamento.rs`, `crea.rs`,
//! `guida.rs` and `session.rs`, which are pure and tested; this file only joins them to Slint.

use crate::avanzamento::Lighting;
use crate::crea::{self, Flow, StretchView, View};
use crate::engine::{Sounding, VoiceId};
use crate::session::{Session, Status};
use crate::{AppWindow, Creazione, Phase, Schermata, Tratto, guida, settings, vista};
use slint::{ComponentHandle, ModelRc, SharedString, Timer, TimerMode, VecModel, Weak};
use std::cell::RefCell;
use std::path::PathBuf;
use std::rc::Rc;
use std::time::{Duration, Instant};

/// What a person can pick to make a voice from: sounds and the sound of videos (all that `kalliope-sample` reads).
pub const FORMATS: &[&str] = &[
    "wav", "flac", "mp3", "ogg", "oga", "opus", "m4a", "mp4", "m4v", "mov", "mkv", "webm",
];

/// A chooser that comes back with nothing in less than this did not open: nobody cancels that fast.
const CHOOSER_TOO_FAST: Duration = Duration::from_millis(400);
/// How long the news of a made voice stays.
const NEWS_FOR: Duration = Duration::from_secs(10);

// ---------------------------------------------------------------------------------------------------------------------
// The bubble: which words are lit

/// With `KALLIOPE_AVANZAMENTO` set, each piece the engine announces and each change of the lit words is printed with the wall
/// clock, so a recording of the screen and of the microphone can be set against them (costruzione-prove/strumenti/sync.py).
fn trace(line: &str) {
    use std::sync::OnceLock;
    static ON: OnceLock<bool> = OnceLock::new();
    if *ON.get_or_init(|| std::env::var_os("KALLIOPE_AVANZAMENTO").is_some()) {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_or(0.0, |d| d.as_secs_f64());
        eprintln!("avanzamento {now:.3} {line}");
    }
}

#[derive(Default)]
struct Speech {
    lighting: Option<Lighting>,
    last: Option<Sounding>,
    /// The id of the phrase whose Stop was already shown: its faint words stay until the next phrase.
    stopped: Option<u64>,
    frozen: bool,
    timer: Timer,
}

thread_local! {
    static SPEECH: RefCell<Speech> = RefCell::new(Speech::default());
    static CREA: RefCell<Option<Ctl>> = const { RefCell::new(None) };
    static NEWS: Timer = Timer::default();
}

impl Speech {
    fn new_phrase(&mut self, ui: &AppWindow, phrase: &str) {
        self.timer.stop();
        self.lighting = Some(Lighting::new(phrase));
        self.last = None;
        self.frozen = false;
        ui.set_dette_vere(0);
        ui.set_sfumatura_vera(0.0);
    }

    fn update(&mut self, ui: &AppWindow, status: &Status) {
        match &status.sounding {
            Some(piece) if self.last.as_ref() != Some(piece) => {
                self.last = Some(piece.clone());
                trace(&format!(
                    "pezzo id={} byte={}..{} durata={:.3} esatto={}",
                    piece.id,
                    piece.span.start,
                    piece.span.end,
                    piece.duration.as_secs_f32(),
                    piece.exact
                ));
                if let Some(l) = &mut self.lighting
                    && l.sounding(piece, Instant::now())
                    && !self.timer.running()
                {
                    let weak = ui.as_weak();
                    self.timer.start(
                        TimerMode::Repeated,
                        Duration::from_millis(ui.get_intervallo_fotogramma().max(1) as u64),
                        move || {
                            if let Some(ui) = weak.upgrade() {
                                SPEECH.with(|s| s.borrow().tick(&ui));
                            }
                        },
                    );
                }
            }
            None => self.last = None,
            _ => {}
        }
        if let Some(said) = &status.interrupted
            && self.stopped != Some(said.id)
        {
            self.stopped = Some(said.id);
            self.timer.stop();
            self.frozen = true;
            let n = self.lighting.as_ref().map_or(0, |l| l.after_stop(said));
            ui.set_dette_vere(n as i32);
            ui.set_sfumatura_vera(0.0);
        }
        if status.phase != Phase::Speaking {
            self.timer.stop();
            if !self.frozen {
                ui.set_dette_vere(-1);
                ui.set_sfumatura_vera(0.0);
            }
        }
    }

    fn tick(&self, ui: &AppWindow) {
        if let Some(l) = &self.lighting {
            let lit = l.at(
                Instant::now(),
                Duration::from_millis(ui.get_durata_scurisce().max(1) as u64),
            );
            if ui.get_dette_vere() != lit.said as i32 {
                trace(&format!("parole-dette={}", lit.said));
            }
            ui.set_dette_vere(lit.said as i32);
            ui.set_sfumatura_vera(lit.fade);
        }
    }
}

/// The engine's report reaches the window: the status line, the voice in the menu, and the words of the bubble.
pub fn stato(ui: &AppWindow, status: &Status) {
    ui.set_phase(status.phase);
    ui.set_warning(status.warning);
    ui.set_situazione(status.situation());
    ui.set_status(status.text.clone().into());
    if let Some(index) = status.voice_index {
        ui.set_voice_index(index as i32);
    }
    SPEECH.with(|s| s.borrow_mut().update(ui, status));
}

/// A phrase was sent to the voice: the bubble starts again from its first word.
pub fn frase_detta(ui: &AppWindow, phrase: &str) {
    SPEECH.with(|s| s.borrow_mut().new_phrase(ui, phrase));
}

// ---------------------------------------------------------------------------------------------------------------------
// The window

fn voices_model(session: &Session) -> ModelRc<SharedString> {
    ModelRc::new(VecModel::from(
        session
            .voices
            .iter()
            .map(|v| SharedString::from(v.as_str()))
            .collect::<Vec<_>>(),
    ))
}

fn history_items(session: &Session) -> Vec<SharedString> {
    session.history_model()
}

/// Whether a program cannot ask the system to stay above the other windows: under Wayland it is the person who does it
/// (from the window's menu), so the meeting mode says how, once. `WAYLAND_DISPLAY` is what winit itself looks at.
pub fn primo_piano_negato(wayland_display: Option<&std::ffi::OsStr>, forced_x11: bool) -> bool {
    wayland_display.is_some_and(|d| !d.is_empty()) && !forced_x11
}

/// Wires the window to the session. Everything that is remembered is read here, once, and each change saves its own key.
pub fn collega(ui: &AppWindow, session: Rc<RefCell<Session>>) {
    let history = Rc::new(VecModel::from(history_items(&session.borrow())));
    ui.set_history(ModelRc::from(history.clone()));
    ui.set_voices(voices_model(&session.borrow()));
    ui.set_voice_index(session.borrow().voice_index() as i32);
    ui.set_monitor(session.borrow().settings.monitor);

    // what was remembered: the size of the text, the meeting mode, the hint already read
    let remembered = session.borrow().settings.text_scale;
    ui.global::<crate::Aspetto>()
        .set_scala(remembered.clamp(1.0, ui.get_scala_massima()));
    ui.set_senza_primo_piano(primo_piano_negato(
        std::env::var_os("WAYLAND_DISPLAY").as_deref(),
        std::env::var("WINIT_UNIX_BACKEND").is_ok_and(|b| b == "x11")
            || std::env::var("SLINT_BACKEND").is_ok_and(|b| b.contains("x11")),
    ));
    ui.set_suggerimento_sopra(!settings::Settings::load().hint_seen);
    let keep = session.clone();
    vista::collega(ui, move |on| keep.borrow_mut().set_compact(on));
    if session.borrow().settings.compact {
        ui.set_compatta(true);
        vista::compatta_applica(ui, true);
    }

    let app = session.clone();
    let model = history.clone();
    ui.on_has_speech_text(|text| !text.trim().is_empty());
    ui.on_speak(move |text| {
        let mut app = app.borrow_mut();
        if !app.speak(&text) {
            return false;
        }
        model.set_vec(history_items(&app));
        if let Some(phrase) = app.history.first()
            && let Some(ui) = ui_of_thread()
        {
            frase_detta(&ui, phrase);
            ui.set_notizia("".into());
        }
        true
    });
    let app = session.clone();
    ui.on_stop(move || app.borrow().stop());
    let app = session.clone();
    ui.on_voice_changed(move |index| app.borrow_mut().change_voice(index as usize));
    let app = session.clone();
    ui.on_monitor_changed(move |on| app.borrow_mut().monitor(on));
    let app = session.clone();
    ui.on_scala_cambiata(move |scale| {
        app.borrow_mut().set_text_scale(scale);
    });
    ui.on_suggerimento_letto(settings::save_hint_seen);
    let app = session.clone();
    let model = history.clone();
    ui.on_svuota_cronologia(move || {
        app.borrow_mut().clear_history();
        model.set_vec(history_items(&app.borrow()));
        if let Some(ui) = ui_of_thread() {
            SPEECH.with(|s| s.borrow_mut().lighting = None);
            ui.set_dette_vere(-1);
        }
    });
    let weak = ui.as_weak();
    ui.on_notizia_chiusa(move || {
        if let Some(ui) = weak.upgrade() {
            ui.set_notizia("".into());
        }
    });
    crea_collega(ui, session);
}

thread_local! {
    static WINDOW: RefCell<Option<Weak<AppWindow>>> = const { RefCell::new(None) };
}

/// The window, from inside one of its own callbacks (they run on its thread).
fn ui_of_thread() -> Option<AppWindow> {
    WINDOW.with(|w| w.borrow().as_ref().and_then(|w| w.upgrade()))
}

// ---------------------------------------------------------------------------------------------------------------------
// «Crea la tua voce»

struct Ctl {
    flow: Flow,
    session: Rc<RefCell<Session>>,
    weak: Weak<AppWindow>,
    applied: View,
    poll: Timer,
    /// How long the stretch being heard lasts, to show how much is left.
    heard_for: f32,
}

fn con<R>(f: impl FnOnce(&mut Ctl) -> R) -> Option<R> {
    CREA.with(|c| c.borrow_mut().as_mut().map(f))
}

fn to_tratto(s: &StretchView) -> Tratto {
    Tratto {
        titolo: s.title.as_str().into(),
        dettaglio: s.detail.as_str().into(),
        messaggi: s.messages.as_str().into(),
        utilizzabile: s.usable,
    }
}

impl Ctl {
    fn ui(&self) -> Option<AppWindow> {
        self.weak.upgrade()
    }

    /// Shows what changed in the view, and nothing else (a level every 50 ms must not rebuild the lists).
    fn apply(&mut self) {
        let Some(ui) = self.ui() else { return };
        let (v, old) = (&self.flow.view, &self.applied);
        let g = ui.global::<Creazione>();
        macro_rules! put {
            ($field:ident, $set:ident) => {
                if v.$field != old.$field {
                    g.$set(v.$field.clone().into());
                }
            };
        }
        put!(step, set_passo);
        put!(error, set_errore);
        put!(error_help, set_errore_aiuto);
        put!(importing, set_importa_in_corso);
        put!(import_file, set_importa_file);
        put!(import_progress, set_importa_avanzamento);
        put!(mic, set_microfono);
        put!(opening, set_apro);
        put!(checking, set_controllo);
        put!(recording, set_registra);
        put!(level, set_livello);
        put!(hint, set_suggerimento);
        put!(chosen, set_tratto_scelto);
        put!(note, set_nota);
        put!(listening, set_ascolto);
        put!(listening_left, set_ascolto_resto);
        put!(name_message, set_nome_messaggio);
        put!(name_confirm, set_nome_conferma);
        put!(consent_message, set_permesso_messaggio);
        put!(making, set_crea_in_corso);
        put!(making_progress, set_crea_avanzamento);
        if v.recorded_ms != old.recorded_ms {
            g.set_registrato(v.recorded_ms);
        }
        if v.spoken_ms != old.spoken_ms {
            g.set_parlato(v.spoken_ms);
        }
        if v.mics != old.mics {
            g.set_microfoni(ModelRc::new(VecModel::from(
                v.mics
                    .iter()
                    .map(|m| SharedString::from(m.as_str()))
                    .collect::<Vec<_>>(),
            )));
        }
        if v.stretches != old.stretches {
            g.set_tratti(ModelRc::new(VecModel::from(
                v.stretches.iter().map(to_tratto).collect::<Vec<_>>(),
            )));
        }
        self.applied = v.clone();
    }

    /// Everything under way stops and nothing is kept: the screen is closed or opened afresh.
    fn drop_everything(&mut self) {
        self.poll.stop();
        let mut s = self.session.borrow_mut();
        s.cancel_recording();
        s.cancel_import();
        s.cancel_voice();
        s.stop_listening();
    }

    fn open(&mut self) {
        self.drop_everything();
        self.flow.reset();
        if let Some(ui) = self.ui() {
            let g = ui.global::<Creazione>();
            g.set_nome("".into());
            g.set_consenso(false);
        }
        self.applied = View {
            step: -1,
            ..View::default()
        };
        self.apply();
    }

    fn close(&mut self) {
        self.drop_everything();
        self.flow.reset();
        if let Some(ui) = self.ui() {
            ui.set_schermata(Schermata::Scrivi);
            ui.invoke_scrivi();
        }
        self.apply();
    }

    fn choose_microphone(&mut self) {
        let found = self.session.borrow().microphones();
        self.flow.microphones(found);
        self.apply();
    }

    fn press_record(&mut self) {
        if self.flow.view.recording {
            self.flow.stop_requested();
            self.session.borrow().stop_recording();
        } else if !self.flow.view.opening && !self.flow.view.checking {
            self.flow.recording_requested();
            let microphone = self.flow.microphone_name();
            let weak = self.weak.clone();
            self.session
                .borrow_mut()
                .start_recording(microphone, move |event| {
                    let _ = weak.upgrade_in_event_loop(move |_| {
                        con(|c| {
                            c.flow.on_recording(event);
                            c.apply();
                        });
                    });
                });
        }
        self.apply();
    }

    fn cancel_recording(&mut self) {
        self.session.borrow_mut().cancel_recording();
        self.flow.recording_cancelled();
        self.apply();
    }

    fn import(&mut self, path: PathBuf) {
        let name = path
            .file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_default();
        self.flow.import_started(&name);
        let weak = self.weak.clone();
        self.session
            .borrow_mut()
            .import_voice_file(path, move |event| {
                let _ = weak.upgrade_in_event_loop(move |_| {
                    con(|c| {
                        c.flow.on_import(event);
                        c.apply();
                    });
                });
            });
        self.apply();
    }

    fn cancel_import(&mut self) {
        self.session.borrow_mut().cancel_import();
        self.flow.import_cancelled();
        self.apply();
    }

    fn listen(&mut self, stretch: usize) {
        let Some(take) = self.flow.take().cloned() else {
            return;
        };
        let result = self.session.borrow().listen(&take, stretch);
        match result {
            Ok(length) => {
                self.heard_for = length.as_secs_f32().max(0.1);
                self.flow.listening(Some(stretch));
                let weak = self.weak.clone();
                self.poll
                    .start(TimerMode::Repeated, Duration::from_millis(100), move || {
                        let _ = weak.upgrade();
                        con(|c| c.poll_listening());
                    });
            }
            Err(message) => {
                self.flow.listening(None);
                self.flow.view.error = message;
                self.flow.view.error_help = true;
            }
        }
        self.apply();
    }

    fn poll_listening(&mut self) {
        let left = self.session.borrow().listening_left();
        if left <= 0.0 {
            self.poll.stop();
            self.flow.listening(None);
        } else {
            self.flow.view.listening_left = (left / self.heard_for).clamp(0.0, 1.0);
        }
        self.apply();
    }

    fn stop_listening(&mut self) {
        self.poll.stop();
        self.session.borrow().stop_listening();
        self.flow.listening(None);
        self.apply();
    }

    fn redo(&mut self) {
        self.stop_listening();
        self.flow.redo();
        self.apply();
    }

    fn create(&mut self) {
        let Some(ui) = self.ui() else { return };
        let g = ui.global::<Creazione>();
        let (name, consent) = (g.get_nome().to_string(), g.get_consenso());
        self.flow.view.chosen = g.get_tratto_scelto();
        self.stop_listening();
        let check = self.session.borrow().check_voice_name(&name);
        let Some(request) = self.flow.press_create(&name, consent, check) else {
            self.apply();
            return;
        };
        let Some(take) = self.flow.take().cloned() else {
            return;
        };
        let weak = self.weak.clone();
        let started = self.session.borrow_mut().create_voice(
            &take,
            request.stretch,
            &name,
            request.confirmed,
            move |event| {
                let _ = weak.upgrade_in_event_loop(move |_| {
                    con(|c| c.on_create(event));
                });
            },
        );
        match started {
            Ok(()) => self.flow.making_started(),
            Err(check) => self.flow.name_refused(check),
        }
        self.apply();
    }

    fn on_create(&mut self, event: crate::own_voice::CreateEvent) {
        if let Some(id) = self.flow.on_create(event) {
            self.made(id);
        }
        self.apply();
    }

    /// The voice exists: it joins the menu, it is chosen, and the window says so.
    fn made(&mut self, id: VoiceId) {
        let Some(ui) = self.ui() else { return };
        let (position, notice) = {
            let mut s = self.session.borrow_mut();
            s.refresh_voices();
            ui.set_voices(voices_model(&s));
            let position = s.voice_position(&id);
            if let Some(i) = position {
                s.change_voice(i);
            }
            (position, crea::made_notice(&id.label()))
        };
        if let Some(i) = position {
            ui.set_voice_index(i as i32);
        }
        self.close();
        ui.set_notizia(notice.into());
        NEWS.with(|t| {
            let weak = ui.as_weak();
            t.start(TimerMode::SingleShot, NEWS_FOR, move || {
                if let Some(ui) = weak.upgrade() {
                    ui.set_notizia("".into());
                }
            });
        });
    }
}

/// The extensions the chooser offers, each in lower and upper case (the portals match the names as written).
fn extensions() -> Vec<String> {
    FORMATS
        .iter()
        .flat_map(|e| [e.to_string(), e.to_uppercase()])
        .collect()
}

/// Opens the system's chooser over the window, on a thread of its own so the window keeps drawing while it is open, and starts
/// reading the file when one is chosen.
fn choose_file(ui: &AppWindow) {
    let handle = ui.window().window_handle();
    let extensions = extensions();
    let dialog = rfd::FileDialog::new()
        .set_title("Scegli una registrazione")
        .add_filter("Audio e video", &extensions)
        .add_filter("Tutti i file", &["*"])
        .set_parent(&handle);
    let weak = ui.as_weak();
    std::thread::spawn(move || {
        let opened = Instant::now();
        let picked = dialog.pick_file();
        let missing = picked.is_none() && opened.elapsed() < CHOOSER_TOO_FAST;
        let _ = weak.upgrade_in_event_loop(move |_| {
            con(|c| match picked {
                Some(path) => c.import(path),
                None if missing => {
                    c.flow.chooser_missing();
                    c.apply();
                }
                None => {}
            });
        });
    });
}

fn crea_collega(ui: &AppWindow, session: Rc<RefCell<Session>>) {
    WINDOW.with(|w| *w.borrow_mut() = Some(ui.as_weak()));
    CREA.with(|c| {
        *c.borrow_mut() = Some(Ctl {
            flow: Flow::new(),
            session,
            weak: ui.as_weak(),
            applied: View::default(),
            poll: Timer::default(),
            heard_for: 1.0,
        });
    });
    let g = ui.global::<Creazione>();
    g.on_registra_scelta(|| {
        con(|c| c.choose_microphone());
    });
    let weak = ui.as_weak();
    g.on_importa(move || {
        if let Some(ui) = weak.upgrade() {
            choose_file(&ui);
        }
    });
    g.on_importa_annulla(|| {
        con(|c| c.cancel_import());
    });
    g.on_scegli_microfono(|i| {
        con(|c| {
            c.flow.choose_microphone(i);
            c.apply();
        });
    });
    g.on_registra_premuto(|| {
        con(|c| c.press_record());
    });
    g.on_registra_annulla(|| {
        con(|c| c.cancel_recording());
    });
    g.on_ascolta(|i| {
        con(|c| c.listen(i.max(0) as usize));
    });
    g.on_ferma_ascolto(|| {
        con(|c| c.stop_listening());
    });
    g.on_rifai(|| {
        con(|c| c.redo());
    });
    g.on_nome_modificato(|| {
        con(|c| {
            c.flow.name_edited();
            c.apply();
        });
    });
    g.on_crea(|| {
        con(|c| c.create());
    });
    g.on_crea_annulla(|| {
        con(|c| {
            c.session.borrow_mut().cancel_voice();
            c.flow.making_cancelled();
            c.apply();
        });
    });
    g.on_apri_guida(|| vista::apri(&guida::Guida::Errori.url()));
    g.on_esci(|| {
        con(|c| c.close());
    });
    ui.on_apri_crea_voce(|| {
        con(|c| c.open());
    });
}
