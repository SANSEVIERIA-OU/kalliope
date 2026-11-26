// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Kalliope: type, and be heard. The window and the speaking thread; the voice comes with the program.

#![cfg_attr(target_os = "windows", windows_subsystem = "windows")]

mod audio;
mod catalog;
mod drive;
mod engine;
mod history;
mod instance;
mod own_voice;
mod paths;
mod session;
mod settings;

use engine::{Command, Config, Engine, Event, KLEIN_VOICES, VoiceId};
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
         kalliope --microfoni       mostra i microfoni da cui registrare una voce\n  \
         kalliope --registra-voce NOME   registra una voce propria dal microfono\n  \
         kalliope --importa-voce FILE NOME   crea una voce propria da un file audio\n  \
         kalliope --version         mostra la versione\n",
        version()
    )
}

fn config(voice: VoiceId, monitor: bool) -> Config {
    Config {
        model_dir: catalog::model_dir(),
        voice,
        monitor,
        ort_lib: kalliope_voice::find_runtime(),
        pocket_dir: catalog::pocket_dir(),
        voices_dir: catalog::voices_dir(),
    }
}

/// Giulia and Marco, then the voices prepared from a recording, which may have any name.
fn voices() -> Vec<VoiceId> {
    KLEIN_VOICES
        .iter()
        .map(|&v| VoiceId::Klein(v.to_string()))
        .chain(catalog::own_voices().into_iter().map(VoiceId::Own))
        .collect()
}

/// Speaks without a window: for tests, scripts and checking the microphone from a terminal.
fn say(text: &str) -> ExitCode {
    let text = text.trim();
    if text.is_empty() {
        eprintln!(
            "Che cosa devo dire? Scrivi il testo dopo --say.\n\n{}",
            usage()
        );
        return ExitCode::from(2);
    }
    if !engine::has_speech(text) {
        eprintln!("Non c'è niente da dire in «{text}»: scrivi almeno una parola.");
        return ExitCode::FAILURE;
    }
    if let Some(missing) = catalog::missing_voice() {
        eprintln!("{missing}");
        return ExitCode::FAILURE;
    }
    // One microphone only: while the window is open, the phrase is said from there.
    let _owner = match instance::claim(&instance::folder()) {
        instance::Start::First(owner) => owner,
        instance::Start::Running(_) => {
            eprintln!("Kalliope è già aperta: scrivi la frase nella sua finestra.");
            return ExitCode::FAILURE;
        }
    };
    let settings = Settings::load();
    let (tx, rx) = std::sync::mpsc::channel();
    let engine = Engine::start(config(settings.voice, settings.monitor), move |e| {
        let _ = tx.send(e);
    });
    let (mut spoken, mut failed) = (false, false);
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
                return if failed {
                    ExitCode::FAILURE
                } else {
                    ExitCode::SUCCESS
                };
            }
            Event::NothingToSay => {
                eprintln!("Non c'è niente da dire in «{text}»: scrivi almeno una parola.");
                return ExitCode::FAILURE;
            }
            Event::Error(e) => {
                eprintln!("{e}");
                return ExitCode::FAILURE;
            }
            Event::Warning(e) => {
                // A voice that failed and was replaced by Giulia still speaks; a phrase that
                // failed makes the exit code say so.
                eprintln!("{e}");
                failed |= spoken;
            }
            _ => {}
        }
    }
    ExitCode::FAILURE
}

/// Brings the window to the front for a second launch. Showing it again maps it on top (X11), or
/// creates it again with the launcher's activation token, which Slint reads at creation (Wayland).
fn bring_to_front(ui: &AppWindow, token: Option<String>) {
    #[cfg(target_os = "linux")]
    if let Some(token) = token {
        // SAFETY: on the UI thread, right before Slint creates the window again; Slint's winit
        // backend reads and removes this variable there, the same way, at every window creation.
        unsafe { std::env::set_var("XDG_ACTIVATION_TOKEN", token) };
    }
    #[cfg(not(target_os = "linux"))]
    let _ = token;
    ui.window().set_minimized(false);
    let _ = ui.hide();
    let _ = ui.show();
}

fn run_window(owner: &instance::Owner) -> Result<(), Box<dyn std::error::Error>> {
    let ui = AppWindow::new()?;
    let _ = slint::set_xdg_app_id("io.github.sansevieria_ou.kalliope");
    let weak = ui.as_weak();
    owner.listen(move |token| {
        let weak = weak.clone();
        let _ = slint::invoke_from_event_loop(move || {
            if let Some(ui) = weak.upgrade() {
                bring_to_front(&ui, token);
            }
        });
    });
    let weak = ui.as_weak();
    let session = Rc::new(RefCell::new(session::Session::open(move |status| {
        let weak = weak.clone();
        let _ = slint::invoke_from_event_loop(move || {
            if let Some(ui) = weak.upgrade() {
                ui.set_phase(status.phase);
                ui.set_warning(status.warning);
                ui.set_status(status.text.into());
                if let Some(index) = status.voice_index {
                    ui.set_voice_index(index as i32);
                }
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
    let history = Rc::new(VecModel::from(session.borrow().history_model()));
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
    // Bringing the window to the front hides and shows it again, so a hidden window must not end
    // Kalliope: only closing it does.
    ui.window().on_close_requested(|| {
        let _ = slint::quit_event_loop();
        slint::CloseRequestResponse::HideWindow
    });
    ui.show()?;
    slint::run_event_loop_until_quit()?;
    let _ = ui.hide();
    Ok(())
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
        Some("--microfoni") => drive::microphones(),
        Some("--registra-voce") => drive::record(&args[1..]),
        Some("--importa-voce") => drive::import(&args[1..]),
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
        None => match instance::claim(&instance::folder()) {
            instance::Start::Running(running) => {
                if running.activate(instance::launch_token().as_deref()) {
                    eprintln!("Kalliope è già aperta: ecco la sua finestra.");
                    ExitCode::SUCCESS
                } else {
                    eprintln!("Kalliope è già in funzione: riprova fra un momento.");
                    ExitCode::FAILURE
                }
            }
            instance::Start::First(owner) => match run_window(&owner) {
                Ok(()) => ExitCode::SUCCESS,
                Err(e) => {
                    eprintln!("Non riesco ad aprire la finestra: {e}");
                    ExitCode::FAILURE
                }
            },
        },
    }
}
