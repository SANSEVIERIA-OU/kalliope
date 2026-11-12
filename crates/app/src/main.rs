// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Kalliope: type, and be heard. The window, the first-start download and the speaking thread.

mod audio;
mod catalog;
mod download;
mod engine;
mod paths;
mod settings;
mod sha256;

use engine::{Command, Config, Engine, Event};
use settings::Settings;
use slint::{ComponentHandle, Model, ModelRc, SharedString, VecModel};
use std::cell::RefCell;
use std::process::ExitCode;
use std::rc::Rc;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

slint::include_modules!();

const VOICES: [&str; 2] = ["Giulia", "Marco"];
const HISTORY: usize = 30;
const READY: &str = "Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.";

fn version() -> String {
    // People see "0.1" for Cargo's 0.1.0.
    let v = env!("CARGO_PKG_VERSION");
    v.strip_suffix(".0").unwrap_or(v).to_string()
}

fn usage() -> String {
    format!(
        "Kalliope {}: scrivi e fatti sentire nelle videochiamate.\n\n\
         uso:\n  kalliope                   apre la finestra\n  \
         kalliope --say TESTO       dice TESTO nel microfono virtuale, senza finestra\n  \
         kalliope --download-voice  scarica la voce (la finestra lo propone al primo avvio)\n  \
         kalliope --version         mostra la versione\n",
        version()
    )
}

/// Speaks without a window: for tests, scripts and checking the microphone from a terminal.
fn say(text: &str) -> ExitCode {
    if !catalog::installed() {
        eprintln!("La voce non è ancora scaricata: apri Kalliope una volta per scaricarla.");
        return ExitCode::FAILURE;
    }
    let settings = Settings::load();
    let (tx, rx) = std::sync::mpsc::channel();
    let engine = Engine::start(
        Config {
            model_dir: catalog::model_dir(),
            voice: settings.voice,
            monitor: settings.monitor,
            ort_lib: kalliope_voice::find_runtime(),
        },
        move |e| {
            let _ = tx.send(e);
        },
    );
    let mut spoken = false;
    while let Ok(event) = rx.recv() {
        match event {
            Event::Ready { microphone } => {
                if let Err(e) = microphone {
                    eprintln!("Attenzione: {e}.");
                }
                engine.send(Command::Speak(text.to_string()));
            }
            Event::Speaking | Event::NotHeard => spoken = true,
            Event::Idle if spoken => {
                // Apps receive audio in blocks: keep the microphone a moment longer, so the
                // last syllables reach them before it disappears.
                std::thread::sleep(std::time::Duration::from_millis(1000));
                return ExitCode::SUCCESS;
            }
            Event::Error(e) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            _ => {}
        }
    }
    ExitCode::FAILURE
}

struct App {
    ui: slint::Weak<AppWindow>,
    engine: RefCell<Option<Engine>>,
    history: Rc<VecModel<SharedString>>,
    settings: RefCell<Settings>,
    cancel: Arc<AtomicBool>,
}

impl App {
    fn start_engine(self: &Rc<Self>) {
        let weak = self.ui.clone();
        let settings = self.settings.borrow();
        let engine = Engine::start(
            Config {
                model_dir: catalog::model_dir(),
                voice: settings.voice.clone(),
                monitor: settings.monitor,
                ort_lib: kalliope_voice::find_runtime(),
            },
            move |event| {
                let weak = weak.clone();
                let _ = slint::invoke_from_event_loop(move || {
                    if let Some(ui) = weak.upgrade() {
                        show(&ui, event);
                    }
                });
            },
        );
        *self.engine.borrow_mut() = Some(engine);
    }

    fn send(&self, command: Command) {
        if let Some(engine) = self.engine.borrow().as_ref() {
            engine.send(command);
        }
    }

    fn speak(&self, text: &str) {
        let text = text.trim();
        if text.is_empty() {
            return;
        }
        self.send(Command::Speak(text.to_string()));
        if let Some(pos) = (0..self.history.row_count())
            .find(|&i| self.history.row_data(i).is_some_and(|t| t == text))
        {
            self.history.remove(pos);
        }
        self.history.insert(0, text.into());
        if self.history.row_count() > HISTORY {
            self.history.remove(HISTORY);
        }
    }

    fn download(self: &Rc<Self>) {
        let Some(ui) = self.ui.upgrade() else { return };
        ui.set_phase(Phase::Downloading);
        ui.set_warning(false);
        ui.set_progress(0.0);
        ui.set_status("Scarico la voce…".into());
        self.cancel.store(false, Ordering::Relaxed);
        let cancel = self.cancel.clone();
        let weak = self.ui.clone();
        let _ = std::thread::Builder::new()
            .name("kalliope-download".into())
            .spawn(move || {
                let progress_weak = weak.clone();
                let result =
                    download::model(&catalog::model_dir(), &cancel, &move |done, total| {
                        let w = progress_weak.clone();
                        let _ = slint::invoke_from_event_loop(move || {
                            if let Some(ui) = w.upgrade() {
                                ui.set_progress(done as f32 / total.max(1) as f32);
                                ui.set_status(
                                    format!(
                                        "Scarico la voce… {} di {} MB",
                                        done / 1_000_000,
                                        total / 1_000_000
                                    )
                                    .into(),
                                );
                            }
                        });
                    });
                let message: SharedString = result.err().unwrap_or_default().into();
                let _ = slint::invoke_from_event_loop(move || {
                    if let Some(ui) = weak.upgrade() {
                        ui.invoke_download_done(message);
                    }
                });
            });
    }
}

/// Reflects an engine event in the window.
fn show(ui: &AppWindow, event: Event) {
    match event {
        Event::Loading => {
            ui.set_phase(Phase::Loading);
            ui.set_warning(false);
            ui.set_status("Preparo la voce…".into());
        }
        Event::Ready { microphone } => {
            ui.set_phase(Phase::Ready);
            match microphone {
                Ok(()) => {
                    ui.set_warning(false);
                    ui.set_status(READY.into());
                }
                Err(e) => {
                    ui.set_warning(true);
                    ui.set_status(
                        format!(
                            "La voce è pronta, ma {e}: per ora nessuno ti sentirà nelle chiamate."
                        )
                        .into(),
                    );
                }
            }
        }
        Event::Speaking => {
            ui.set_phase(Phase::Speaking);
            if !ui.get_warning() {
                ui.set_status("Sto parlando…".into());
            }
        }
        Event::NotHeard => {
            ui.set_phase(Phase::Speaking);
            ui.set_status(
                "Nessuna chiamata sta usando il microfono «Kalliope»: sceglilo come microfono nell'app della riunione."
                    .into(),
            );
        }
        Event::Idle => {
            ui.set_phase(Phase::Ready);
            if !ui.get_warning() {
                ui.set_status(READY.into());
            }
        }
        Event::Error(e) => {
            ui.set_phase(Phase::Error);
            ui.set_warning(true);
            ui.set_status(e.into());
        }
    }
}

fn run_window() -> Result<(), slint::PlatformError> {
    let ui = AppWindow::new()?;
    // Matches the .desktop file, so desktops show the right icon and name for the window.
    let _ = slint::set_xdg_app_id("io.github.sansevieria_ou.kalliope");
    let settings = Settings::load();
    ui.set_version(version().into());
    ui.set_voices(ModelRc::new(VecModel::from(
        VOICES
            .iter()
            .map(|&v| SharedString::from(v))
            .collect::<Vec<_>>(),
    )));
    ui.set_voice_index(
        VOICES
            .iter()
            .position(|&v| v == settings.voice)
            .unwrap_or(0) as i32,
    );
    ui.set_monitor(settings.monitor);
    let history = Rc::new(VecModel::<SharedString>::default());
    ui.set_history(ModelRc::from(history.clone()));

    let app = Rc::new(App {
        ui: ui.as_weak(),
        engine: RefCell::new(None),
        history,
        settings: RefCell::new(settings),
        cancel: Arc::new(AtomicBool::new(false)),
    });

    let a = app.clone();
    ui.on_speak(move |text| a.speak(&text));
    let a = app.clone();
    ui.on_stop(move || a.send(Command::Stop));
    let a = app.clone();
    ui.on_voice_changed(move |index| {
        let name = VOICES
            .get(index as usize)
            .copied()
            .unwrap_or(VOICES[0])
            .to_string();
        a.settings.borrow_mut().voice = name.clone();
        a.settings.borrow().save();
        a.send(Command::Voice(name));
    });
    let a = app.clone();
    ui.on_monitor_changed(move |on| {
        a.settings.borrow_mut().monitor = on;
        a.settings.borrow().save();
        a.send(Command::Monitor(on));
    });
    let a = app.clone();
    ui.on_download(move || a.download());
    let a = app.clone();
    ui.on_cancel_download(move || a.cancel.store(true, Ordering::Relaxed));
    let a = app.clone();
    ui.on_download_done(move |error| {
        let Some(ui) = a.ui.upgrade() else { return };
        if error.is_empty() {
            a.start_engine();
        } else {
            ui.set_phase(Phase::NeedsModel);
            ui.set_warning(true);
            ui.set_status(error);
        }
    });

    if catalog::installed() {
        app.start_engine();
    } else {
        ui.set_phase(Phase::NeedsModel);
        ui.set_status(
            format!(
                "Per parlare, Kalliope deve scaricare la voce: {} MB, una volta sola. Poi funziona senza internet.",
                (catalog::total_size() + 500_000) / 1_000_000
            )
            .into(),
        );
    }
    let result = ui.run();
    app.cancel.store(true, Ordering::Relaxed);
    app.engine.borrow_mut().take();
    result
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    match args.first().map(String::as_str) {
        Some("--version" | "-V") => {
            println!("kalliope {}", version());
            ExitCode::SUCCESS
        }
        Some("--help" | "-h") => {
            print!("{}", usage());
            ExitCode::SUCCESS
        }
        Some("--say") => say(&args[1..].join(" ")),
        Some("--download-voice") => {
            let cancel = AtomicBool::new(false);
            let last = std::cell::Cell::new(u64::MAX);
            let result = download::model(&catalog::model_dir(), &cancel, &|done, total| {
                let step = done * 10 / total.max(1);
                if step != last.get() {
                    last.set(step);
                    eprintln!("{} di {} MB", done / 1_000_000, (total + 500_000) / 1_000_000);
                }
            });
            match result {
                Ok(()) => {
                    println!("Voce pronta in {}", catalog::model_dir().display());
                    ExitCode::SUCCESS
                }
                Err(e) => {
                    eprintln!("{e}");
                    ExitCode::FAILURE
                }
            }
        }
        Some(other) => {
            eprintln!("opzione sconosciuta: {other}\n\n{}", usage());
            ExitCode::FAILURE
        }
        None => match run_window() {
            Ok(()) => ExitCode::SUCCESS,
            Err(e) => {
                eprintln!("Non riesco ad aprire la finestra: {e}");
                ExitCode::FAILURE
            }
        },
    }
}
