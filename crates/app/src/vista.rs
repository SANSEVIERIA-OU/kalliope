// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! What the window of the direction «La frase che si accende» needs from Rust, kept apart from the engine and the
//! session: the words of a phrase for the bubble, the meeting mode's size, the live catalog (`--catalogo`) and the
//! demonstration scenes (`--demo SCENA`) for what the engine does not do yet (creating a voice, the saved history).
use crate::avanzamento::Lighting;
use crate::engine::Sounding;
use crate::{AppWindow, Catalogo, Creazione, Phase, Schermata, Situazione, Tratto, guida};
use slint::{ComponentHandle, LogicalSize, ModelRc, SharedString, VecModel};
use std::cell::{Cell, RefCell};
use std::process::ExitCode;
use std::rc::Rc;
use std::time::Duration;

/// How many words a phrase has, as the bubble darkens them one by one.
pub fn parole(text: &str) -> usize {
    text.split_whitespace().count()
}

/// The phrase up to its first `n` words, with the spaces it has: laid over the whole phrase in the same width, it wraps
/// the same way, so the words said so far darken in place.
pub fn prefisso(text: &str, n: usize) -> &str {
    let mut seen = 0;
    let mut in_word = false;
    for (i, c) in text.char_indices() {
        if c.is_whitespace() {
            if in_word {
                seen += 1;
                if seen == n {
                    return &text[..i];
                }
            }
            in_word = false;
        } else {
            in_word = true;
        }
    }
    if n == 0 { "" } else { text }
}

fn modello(items: Vec<SharedString>) -> ModelRc<SharedString> {
    ModelRc::new(VecModel::from(items))
}

thread_local! {
    /// The size of the window before the meeting mode made it small, to give it back.
    static BEFORE: Cell<Option<LogicalSize>> = const { Cell::new(None) };
    /// The window's own size on this screen: the design's, fitted to the work area when the window opened (schermo.rs).
    static OWN: Cell<Option<LogicalSize>> = const { Cell::new(None) };
}

/// The window's own size: the one it opened at outside the meeting mode, or the design's.
fn own_size(ui: &AppWindow) -> LogicalSize {
    OWN.get()
        .unwrap_or_else(|| LogicalSize::new(ui.get_nativa_larghezza(), ui.get_nativa_altezza()))
}

/// The size the meeting mode asks for at the current text size, in logical pixels.
pub fn compatta_misura(ui: &AppWindow) -> (f32, f32) {
    let s = compact_size(ui);
    (s.width, s.height)
}

/// The window opens at `own`, its own size fitted to the screen; in the meeting mode it opens at `chosen` (the meeting
/// size, fitted the same way) and gives back `own` when the meeting mode ends.
pub fn apertura(ui: &AppWindow, own: (f32, f32), chosen: (f32, f32)) {
    let own = LogicalSize::new(own.0, own.1);
    OWN.set(Some(own));
    if ui.get_compatta() {
        BEFORE.set(Some(own));
    }
    ui.window().set_size(LogicalSize::new(chosen.0, chosen.1));
}

/// The size the meeting mode asks for: 400 × 320 at the design's text size, and larger as the text grows, so a larger text
/// is not squeezed into the same small window (everything grows together).
fn compact_size(ui: &AppWindow) -> LogicalSize {
    let k = ui.global::<crate::Aspetto>().get_scala();
    LogicalSize::new(
        ui.get_compatta_larghezza() * k,
        ui.get_compatta_altezza() * k,
    )
}

/// The text size changed while the window is in the meeting mode: the window follows it.
pub fn compatta_riadatta(ui: &AppWindow) {
    if ui.get_compatta() {
        ui.window().set_size(compact_size(ui));
    }
}

/// Makes the window small (the meeting mode) or gives it back its size. Started in the meeting mode there is no size before,
/// and the window's own is given back.
pub fn compatta_applica(ui: &AppWindow, on: bool) {
    let window = ui.window();
    let scale = window.scale_factor();
    if on {
        BEFORE.with(|b| {
            if b.get().is_none() {
                b.set(Some(window.size().to_logical(scale)));
            }
        });
        window.set_size(compact_size(ui));
    } else {
        let size = BEFORE.with(|b| b.take()).unwrap_or_else(|| own_size(ui));
        window.set_size(size);
    }
}

/// Wires the window's own needs: words for the bubble, the meeting mode (which makes the window small and gives it back its
/// size afterwards, and tells `remember` so it is kept), and the way out of a problem and the website.
pub fn collega(ui: &AppWindow, remember: impl Fn(bool) + 'static) {
    ui.on_conta_parole(|text| parole(&text) as i32);
    ui.on_prefisso(|text, n| prefisso(&text, n.max(0) as usize).into());
    let weak = ui.as_weak();
    ui.on_compatta_cambiata(move |on| {
        if let Some(ui) = weak.upgrade() {
            compatta_applica(&ui, on);
        }
        remember(on);
    });
    ui.global::<Creazione>()
        .on_nome_valido(|name| !name.trim().is_empty());
    ui.on_apri_guida(|situazione| {
        if let Some(guida) = guida::per_situazione(situazione) {
            apri(&guida.url());
        }
    });
    ui.on_apri_sito(|| apri(&guida::sito()));
}

/// Opens a page in the browser: the way out of a problem the status line names, or the website.
pub fn apri(url: &str) {
    #[cfg(target_os = "linux")]
    let mut command = std::process::Command::new("xdg-open");
    #[cfg(target_os = "macos")]
    let mut command = std::process::Command::new("open");
    #[cfg(target_os = "windows")]
    let mut command = {
        let mut c = std::process::Command::new("cmd");
        c.args(["/C", "start", ""]);
        c
    };
    if let Err(e) = command.arg(url).spawn() {
        eprintln!("Non riesco ad aprire {url}: {e}");
    }
}

/// The live catalog of the design system: every token and every component in its states.
pub fn catalogo() -> ExitCode {
    let language = crate::lingua::choose();
    match Catalogo::new().and_then(|c| {
        crate::lingua::apply_catalog(&c, language);
        c.run()
    }) {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("Non riesco ad aprire il catalogo: {e}");
            ExitCode::FAILURE
        }
    }
}

const FRASI: [&str; 5] = [
    "Buongiorno a tutti, mi sentite bene?",
    "Ho letto il documento ieri sera.",
    "Per me va bene la seconda proposta.",
    "Scusate, posso aggiungere una cosa?",
    "Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?",
];
const LUNGA: &str = "Prima di chiudere vorrei chiedere a Luca se il preventivo di 1.250 € più IVA comprende anche l'installazione, perché nel documento non lo trovo";

/// The simulated voice of the demonstration: it cuts a phrase at its stops like the real voices, and says each piece in the
/// time its words take at the pace of the home page. The words light through the same [`Lighting`] as with the real engine.
fn demo_pieces(phrase: &str, pace: Duration) -> Vec<(std::ops::Range<usize>, Duration)> {
    let mut pieces = Vec::new();
    let mut start = 0;
    for (i, c) in phrase.char_indices() {
        if matches!(c, ',' | ';' | ':' | '.' | '!' | '?') {
            let end = i + c.len_utf8();
            if !phrase[start..end].trim().is_empty() {
                pieces.push(start..end);
                start = end;
            }
        }
    }
    if !phrase[start..].trim().is_empty() {
        pieces.push(start..phrase.len());
    }
    pieces
        .into_iter()
        .map(|span| {
            let words = parole(&phrase[span.clone()]).max(1) as u32;
            (span, pace * words)
        })
        .collect()
}

struct DemoVoice {
    phrase: std::sync::Arc<str>,
    lighting: Lighting,
    pieces: Vec<(std::ops::Range<usize>, Duration)>,
    fed: usize,
    started: std::time::Instant,
    total: Duration,
}

fn demo_tratti(ui: &AppWindow, n: usize) {
    use crate::crea::{stretch_detail, stretch_title};
    use kalliope_sample::Problem;
    let all = [
        (
            stretch_title(1, true),
            stretch_detail("0:12", "0:24", 12.0),
            String::new(),
            true,
        ),
        (
            stretch_title(2, false),
            stretch_detail("1:05", "1:17", 9.0),
            Problem::TooNoisy.message(),
            true,
        ),
        (
            stretch_title(3, false),
            stretch_detail("2:40", "2:52", 3.0),
            Problem::TooShort.message(),
            false,
        ),
    ];
    let items: Vec<Tratto> = all
        .iter()
        .take(n)
        .map(|(t, d, m, u)| Tratto {
            titolo: t.as_str().into(),
            dettaglio: d.as_str().into(),
            messaggi: m.as_str().into(),
            utilizzabile: *u,
        })
        .collect();
    ui.global::<Creazione>()
        .set_tratti(ModelRc::new(VecModel::from(items)));
}

/// The size asked for with `KALLIOPE_DEMO_MISURA=LARGHEZZAxALTEZZA`.
fn demo_misura() -> Option<(f32, f32)> {
    let m = std::env::var("KALLIOPE_DEMO_MISURA").ok()?;
    let (w, h) = m.split_once('x')?;
    Some((w.parse().ok()?, h.parse().ok()?))
}

/// A scene of the window driven by a demonstration state, without the engine: for what is designed and for screenshots that
/// need a precise moment (and for the catalog of the states that are hard to meet: a missing file, a failed recording).
/// Typing and Enter work: the voice is simulated, and nothing reaches the microphone.
pub fn demo(scena: &str) -> ExitCode {
    let language = crate::lingua::choose();
    let ui = match AppWindow::new() {
        Ok(ui) => ui,
        Err(e) => {
            eprintln!("Non riesco ad aprire la finestra: {e}");
            return ExitCode::FAILURE;
        }
    };
    crate::lingua::apply(&ui, language);
    collega(&ui, |_| {});
    ui.set_version(format!("{} · dimostrazione", env!("CARGO_PKG_VERSION")).into());
    ui.set_voices(modello(vec![
        "Giulia".into(),
        "Marco".into(),
        "La voce di Anna".into(),
    ]));
    let history = Rc::new(VecModel::<SharedString>::default());
    ui.set_history(ModelRc::from(history.clone()));
    let mut said: Vec<SharedString> = FRASI.iter().rev().map(|f| SharedString::from(*f)).collect();
    let mut phase = Phase::Ready;
    let mut status = String::new();
    let mut situazione = None;
    let creazione = ui.global::<Creazione>();
    let mic_names = || {
        ModelRc::new(VecModel::from(vec![
            SharedString::from("Cuffia USB"),
            SharedString::from("Microfono del portatile"),
            SharedString::from("Webcam"),
        ]))
    };
    match scena {
        "vuota" => said.clear(),
        "prepara" => {
            said.clear();
            phase = Phase::Loading;
        }
        "scrive" => ui.set_draft(LUNGA.into()),
        "parla" | "compatta-parla" => phase = Phase::Speaking,
        "cronologia" => {}
        // phrases of two lines in the history, the case that showed a bubble cut in half
        "cronologia-lunga" => {
            said = [
                "Per me va bene la seconda proposta ma vorrei rivedere il preventivo con calma insieme a Luca",
                "Sono d'accordo con Paola e possiamo sentirci venerdì alle tre e mezza del pomeriggio in sala grande",
                "Vorrei aggiungere una cosa importante sul progetto prima che chiudiate la riunione di oggi",
                "Buongiorno a tutti, mi sentite bene?",
            ]
            .iter()
            .map(|f| SharedString::from(*f))
            .collect();
        }
        "nessuno" => {
            phase = Phase::Speaking;
            situazione = Some(Situazione::NessunoAscolta);
            status = crate::session::not_heard();
        }
        "microfono" => {
            situazione = Some(Situazione::SenzaMicrofono);
            status = crate::audio::microphone_missing();
        }
        "problema" => {
            said.clear();
            phase = Phase::Error;
            situazione = Some(Situazione::ProblemaVoce);
            status = crate::catalog::missing_voice_text();
        }
        "compatta" => {}
        "notizia" => ui.set_notizia(crate::crea::made_notice("La voce di Anna").into()),
        "info" => {}
        "conferma" => {}
        s if s.starts_with("voce-") => {
            ui.set_schermata(Schermata::CreaVoce);
            match s {
                "voce-1" => {}
                "voce-errore" => {
                    creazione.set_errore(kalliope_sample::ReadError::NotAudio.message().into());
                    creazione.set_errore_aiuto(true);
                }
                "voce-importa" => {
                    creazione.set_importa_in_corso(true);
                    creazione.set_importa_file("Messaggio-vocale-di-nonna.opus".into());
                    creazione.set_importa_avanzamento(0.42);
                }
                "voce-mic" => {
                    creazione.set_passo(1);
                    creazione.set_microfoni(mic_names());
                    creazione.set_microfono(0);
                }
                "voce-2" | "voce-suggerimento" => {
                    creazione.set_passo(1);
                    creazione.set_registra(true);
                    creazione.set_registrato(if s == "voce-2" { 7400 } else { 5200 });
                    creazione.set_parlato(if s == "voce-2" { 6000 } else { 0 });
                    creazione.set_livello(if s == "voce-2" { 0.7 } else { 0.0 });
                    if s == "voce-suggerimento" {
                        creazione.set_suggerimento(crate::crea::no_voice_heard().into());
                    }
                }
                "voce-3" | "voce-nome" | "voce-crea" => {
                    creazione.set_passo(2);
                    creazione.set_nome("La voce di Anna".into());
                    creazione.set_consenso(true);
                    demo_tratti(&ui, 1);
                    if s == "voce-nome" {
                        creazione.set_nome("Giulia".into());
                        creazione.set_nome_messaggio(
                            crate::own_voice::check_name(
                                "Giulia",
                                std::path::Path::new("/nonexistent"),
                            )
                            .message()
                            .unwrap_or_default()
                            .into(),
                        );
                        creazione.set_nome_conferma(crate::crea::keep_name().into());
                    }
                    if s == "voce-crea" {
                        creazione.set_crea_in_corso(true);
                        creazione.set_crea_avanzamento(0.55);
                    }
                }
                "voce-tratti" => {
                    creazione.set_passo(2);
                    creazione.set_nota(crate::own_voice::long_file_note().into());
                    demo_tratti(&ui, 3);
                    creazione.set_ascolto(1);
                    creazione.set_nome("".into());
                }
                other => {
                    eprintln!("scena sconosciuta: {other}");
                    return ExitCode::FAILURE;
                }
            }
        }
        "grande" => {
            ui.global::<crate::Aspetto>().set_scala(1.5);
        }
        "" => {}
        other => {
            eprintln!("scena sconosciuta: {other}");
            return ExitCode::FAILURE;
        }
    }
    if scena == "compatta" || scena == "compatta-parla" {
        ui.set_compatta(true);
    }
    // KALLIOPE_DEMO_MISURA=360x320 opens the scene at another size (the smallest window, a low screen)
    if let Some((w, h)) = demo_misura() {
        ui.window().set_size(LogicalSize::new(w, h));
    }
    // KALLIOPE_DEMO_SCALA=1.75 opens the scene with another text size
    if let Some(scala) = std::env::var("KALLIOPE_DEMO_SCALA")
        .ok()
        .and_then(|s| s.parse::<f32>().ok())
    {
        ui.global::<crate::Aspetto>().set_scala(scala);
    }
    if scena == "compatta" || scena == "compatta-parla" {
        compatta_riadatta(&ui);
        if let Some((w, h)) = demo_misura() {
            ui.window().set_size(LogicalSize::new(w, h));
        }
    }
    // KALLIOPE_DEMO_SENZA_PRIMO_PIANO=1 shows the meeting mode as it is where the system does not let a program stay above
    ui.set_senza_primo_piano(
        std::env::var_os("KALLIOPE_DEMO_SENZA_PRIMO_PIANO").is_some()
            || crate::collega::primo_piano_negato(
                std::env::var_os("WAYLAND_DISPLAY").as_deref(),
                false,
            ),
    );
    history.set_vec(said);
    // a scene that stands in the middle of a phrase shows its words half said, as a photograph of the moment needs
    if matches!(scena, "parla" | "nessuno" | "compatta-parla") {
        ui.set_dette_vere(7);
        ui.set_sfumatura_vera(0.5);
    }
    ui.set_phase(phase);
    ui.set_status(status.into());
    if let Some(s) = situazione {
        ui.set_situazione(s);
        ui.set_warning(true);
    }
    // KALLIOPE_DEMO_FOTO=/percorso.ppm: the window takes its own picture after a moment (where nothing else can: a compositor
    // with no screen, a Wayland session without a screenshot tool) and the demonstration goes on
    let snapshot = slint::Timer::default();
    if let Some(path) = std::env::var_os("KALLIOPE_DEMO_FOTO") {
        let weak = ui.as_weak();
        snapshot.start(
            slint::TimerMode::SingleShot,
            Duration::from_millis(2500),
            move || {
                let Some(ui) = weak.upgrade() else { return };
                match ui.window().take_snapshot() {
                    Ok(buffer) => {
                        let mut out = format!("P6\n{} {}\n255\n", buffer.width(), buffer.height())
                            .into_bytes();
                        for p in buffer.as_slice() {
                            out.extend_from_slice(&[p.r, p.g, p.b]);
                        }
                        if let Err(e) = std::fs::write(&path, out) {
                            eprintln!("Non riesco a scrivere la foto: {e}");
                        }
                    }
                    Err(e) => eprintln!("La finestra non sa fotografarsi: {e}"),
                }
            },
        );
    }
    // the scenes that open over the window do it once it is on the screen
    let opens = scena.to_string();
    let weak = ui.as_weak();
    let opener = slint::Timer::default();
    opener.start(
        slint::TimerMode::SingleShot,
        Duration::from_millis(60),
        move || {
            if let Some(ui) = weak.upgrade() {
                match opens.as_str() {
                    "info" => ui.invoke_mostra_informazioni(),
                    "conferma" => ui.invoke_mostra_conferma(),
                    _ => {}
                }
            }
        },
    );
    // The simulated voice: speaking starts a moment after Enter and says each piece for as long as its words take.
    let voice: Rc<RefCell<Option<DemoVoice>>> = Rc::default();
    let tick = Rc::new(slint::Timer::default());
    let weak = ui.as_weak();
    let (voice_tick, tick_in) = (voice.clone(), tick.clone());
    ui.on_has_speech_text(|text| !text.trim().is_empty());
    let history_speak = history.clone();
    ui.on_speak(move |text| {
        let text = SharedString::from(text.trim());
        let mut items: Vec<SharedString> = (0..slint::Model::row_count(&*history_speak))
            .filter_map(|i| slint::Model::row_data(&*history_speak, i))
            .filter(|t| *t != text)
            .collect();
        items.insert(0, text.clone());
        history_speak.set_vec(items);
        let Some(ui) = weak.upgrade() else {
            return true;
        };
        let pace = Duration::from_millis(ui.get_durata_parola() as u64);
        let fade = Duration::from_millis(ui.get_durata_scurisce() as u64);
        let pieces = demo_pieces(&text, pace);
        let total: Duration = pieces.iter().map(|(_, d)| *d).sum();
        ui.set_dette_vere(0);
        ui.set_sfumatura_vera(0.0);
        *voice_tick.borrow_mut() = Some(DemoVoice {
            phrase: std::sync::Arc::from(text.as_str()),
            lighting: Lighting::new(&text),
            pieces,
            fed: 0,
            started: std::time::Instant::now() + Duration::from_millis(400),
            total,
        });
        let (weak, voice) = (weak.clone(), voice_tick.clone());
        tick_in.start(
            slint::TimerMode::Repeated,
            Duration::from_millis(ui.get_intervallo_fotogramma().max(1) as u64),
            move || {
                let Some(ui) = weak.upgrade() else { return };
                let mut guard = voice.borrow_mut();
                let Some(v) = guard.as_mut() else { return };
                let now = std::time::Instant::now();
                if now < v.started {
                    return;
                }
                if ui.get_phase() != Phase::Speaking {
                    ui.set_phase(Phase::Speaking);
                }
                // each piece is announced when it starts, as the engine does
                let mut at = Duration::ZERO;
                for (n, (span, duration)) in v.pieces.iter().enumerate() {
                    if n >= v.fed && now.duration_since(v.started) >= at {
                        v.lighting.sounding(
                            &Sounding {
                                phrase: v.phrase.clone(),
                                id: 1,
                                span: span.clone(),
                                duration: *duration,
                                exact: true,
                                last: n + 1 == v.pieces.len(),
                                words: Default::default(),
                            },
                            v.started + at,
                        );
                        v.fed = n + 1;
                    }
                    at += *duration;
                }
                if now.duration_since(v.started) > v.total + fade {
                    ui.set_dette_vere(-1);
                    ui.set_sfumatura_vera(0.0);
                    ui.set_phase(Phase::Ready);
                    *guard = None;
                    return;
                }
                let lit = v.lighting.at(now, fade);
                ui.set_dette_vere(lit.said as i32);
                ui.set_sfumatura_vera(lit.fade);
            },
        );
        true
    });
    let weak = ui.as_weak();
    let (voice_stop, tick_stop) = (voice.clone(), tick.clone());
    ui.on_stop(move || {
        if let Some(ui) = weak.upgrade() {
            tick_stop.stop();
            if let Some(v) = voice_stop.borrow_mut().take() {
                let lit = v.lighting.at(
                    std::time::Instant::now(),
                    Duration::from_millis(ui.get_durata_scurisce() as u64),
                );
                ui.set_dette_vere(lit.said as i32);
            }
            ui.set_sfumatura_vera(0.0);
            ui.set_phase(Phase::Ready);
        }
    });
    // «Torna a scrivere» closes the creation in the demonstration too
    let weak = ui.as_weak();
    ui.global::<Creazione>().on_esci(move || {
        if let Some(ui) = weak.upgrade() {
            ui.set_schermata(Schermata::Scrivi);
            ui.invoke_scrivi();
        }
    });
    match ui.run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("{e}");
            ExitCode::FAILURE
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_prefix_keeps_the_words_said_and_their_spaces() {
        let frase = "Sono d'accordo  con Paola.";
        assert_eq!(parole(frase), 4);
        assert_eq!(prefisso(frase, 0), "");
        assert_eq!(prefisso(frase, 1), "Sono");
        assert_eq!(prefisso(frase, 2), "Sono d'accordo");
        assert_eq!(prefisso(frase, 3), "Sono d'accordo  con");
        assert_eq!(prefisso(frase, 4), frase);
        assert_eq!(prefisso(frase, 9), frase);
    }
}
