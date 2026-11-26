// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Kalliope: type, and be heard. The window and the speaking thread; the voice comes with the program.

#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]

mod audio;
mod catalog;
mod engine;
mod paths;
mod session;
mod settings;

use engine::{Command, Config, Engine, Event, KLEIN_VOICES};
use settings::Settings;
use slint::{ComponentHandle, ModelRc, SharedString, VecModel};
use std::cell::RefCell;
use std::process::ExitCode;
use std::rc::Rc;

slint::include_modules!();

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
         kalliope --version         mostra la versione\n",
        version()
    )
}

fn config(voice: String, monitor: bool) -> Config {
    Config {
        model_dir: catalog::model_dir(),
        voice,
        monitor,
        ort_lib: kalliope_voice::find_runtime(),
        pocket_dir: catalog::pocket_dir(),
        voices_dir: catalog::voices_dir(),
    }
}

/// Giulia and Marco, then the voices prepared from a recording.
fn voices() -> Vec<String> {
    KLEIN_VOICES
        .iter()
        .map(|&v| v.to_string())
        .chain(catalog::own_voices())
        .collect()
}

/// Speaks without a window: for tests, scripts and checking the microphone from a terminal.
fn say(text: &str) -> ExitCode {
    if let Some(missing) = catalog::missing_voice() {
        eprintln!("{missing}");
        return ExitCode::FAILURE;
    }
    let settings = Settings::load();
    let (tx, rx) = std::sync::mpsc::channel();
    let engine = Engine::start(config(settings.voice, settings.monitor), move |e| {
        let _ = tx.send(e);
    });
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
            Event::Error(e) | Event::Warning(e) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            _ => {}
        }
    }
    ExitCode::FAILURE
}

fn run_window() -> Result<(), Box<dyn std::error::Error>> {
    let ui = AppWindow::new()?;
    let _ = slint::set_xdg_app_id("io.github.sansevieria_ou.kalliope");
    let weak = ui.as_weak();
    let session = Rc::new(RefCell::new(session::Session::open(move |status| {
        let weak = weak.clone();
        let _ = slint::invoke_from_event_loop(move || {
            if let Some(ui) = weak.upgrade() {
                ui.set_phase(status.phase);
                ui.set_warning(status.warning);
                ui.set_status(status.text.into());
            }
        });
    })));
    ui.set_version(version().into());
    ui.set_voices(ModelRc::new(VecModel::from(
        session
            .borrow()
            .voices
            .iter()
            .map(|v| SharedString::from(v.as_str()))
            .collect::<Vec<_>>(),
    )));
    ui.set_voice_index(session.borrow().voice_index() as i32);
    ui.set_monitor(session.borrow().settings.monitor);
    let history = Rc::new(VecModel::<SharedString>::default());
    ui.set_history(ModelRc::from(history.clone()));
    let app = session.clone();
    ui.on_has_speech_text(|text| !text.trim().is_empty());
    ui.on_speak(move |text| {
        let mut app = app.borrow_mut();
        if !app.speak(&text) {
            return false;
        }
        history.set_vec(
            app.history
                .iter()
                .map(|v| SharedString::from(v.as_str()))
                .collect::<Vec<_>>(),
        );
        true
    });
    let app = session.clone();
    ui.on_stop(move || app.borrow().stop());
    let app = session.clone();
    ui.on_voice_changed(move |index| app.borrow_mut().change_voice(index as usize));
    ui.on_monitor_changed(move |on| session.borrow_mut().monitor(on));
    Ok(ui.run()?)
}

// A normal desktop launch has no console window. Attach terminal invocations to
// their caller while preserving the handles provided for redirected output.
#[cfg(target_os = "windows")]
fn attach_terminal() {
    #[link(name = "kernel32")]
    unsafe extern "system" {
        fn AttachConsole(process: u32) -> i32;
        fn GetStdHandle(which: u32) -> *mut std::ffi::c_void;
    }
    // STD_OUTPUT_HANDLE is -11. A pipe or file already works without a console.
    unsafe {
        let stdout = GetStdHandle(-11i32 as u32);
        if stdout.is_null() || stdout as isize == -1 {
            AttachConsole(u32::MAX);
        }
    }
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    #[cfg(target_os = "windows")]
    if !args.is_empty() {
        attach_terminal();
    }
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
