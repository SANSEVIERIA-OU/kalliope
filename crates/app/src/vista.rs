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
        window.set_size(LogicalSize::new(
            ui.get_compatta_larghezza(),
            ui.get_compatta_altezza(),
        ));
    } else {
        let size = BEFORE.with(|b| b.take()).unwrap_or_else(|| {
            LogicalSize::new(ui.get_nativa_larghezza(), ui.get_nativa_altezza())
        });
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
    match Catalogo::new().and_then(|c| c.run()) {
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
    let all = [
        (
            "Tratto 1 · il più chiaro",
            "da 0:12 a 0:24 · 12 s di voce",
            "",
            true,
        ),
        (
            "Tratto 2",
            "da 1:05 a 1:17 · 9 s di voce",
            "C'è molto rumore di fondo, e la voce creata lo imiterà. Se puoi, registra in un posto più silenzioso.",
            true,
        ),
        (
            "Tratto 3",
            "da 2:40 a 2:52 · 3 s di voce",
            "C'è troppo poco parlato: servono almeno 4 secondi di voce, meglio 12. Registra ancora un po', o scegli un file più lungo.",
            false,
        ),
    ];
    let items: Vec<Tratto> = all
        .iter()
        .take(n)
        .map(|(t, d, m, u)| Tratto {
            titolo: (*t).into(),
            dettaglio: (*d).into(),
            messaggi: (*m).into(),
            utilizzabile: *u,
        })
        .collect();
    ui.global::<Creazione>()
        .set_tratti(ModelRc::new(VecModel::from(items)));
}

/// A scene of the window driven by a demonstration state, without the engine: for what is designed and for screenshots that
/// need a precise moment (and for the catalog of the states that are hard to meet: a missing file, a failed recording).
/// Typing and Enter work: the voice is simulated, and nothing reaches the microphone.
pub fn demo(scena: &str) -> ExitCode {
    let ui = match AppWindow::new() {
        Ok(ui) => ui,
        Err(e) => {
            eprintln!("Non riesco ad aprire la finestra: {e}");
            return ExitCode::FAILURE;
        }
    };
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
        "nessuno" => {
            phase = Phase::Speaking;
            situazione = Some(Situazione::NessunoAscolta);
            status = "Nessuno nella chiamata ha sentito la frase: nessuna app sta usando il microfono «Kalliope». Sceglilo come microfono nell'app della riunione.".into();
        }
        "microfono" => {
            situazione = Some(Situazione::SenzaMicrofono);
            status = "La voce è pronta, ma il microfono virtuale «Kalliope» non c'è: per ora nessuno ti sentirà nelle chiamate.".into();
        }
        "problema" => {
            said.clear();
            phase = Phase::Error;
            situazione = Some(Situazione::ProblemaVoce);
            status = "Non trovo i file della voce. Reinstalla Kalliope dal pacchetto.".into();
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
                    creazione.set_errore("Questo file non è audio, o non lo riconosco. Prova con un messaggio vocale, un video o una registrazione.".into());
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
                        creazione.set_suggerimento("Non ti sento. Avvicinati al microfono, controlla che non sia spento, o scegline un altro.".into());
                    }
                }
                "voce-3" | "voce-nome" | "voce-crea" => {
                    creazione.set_passo(2);
                    creazione.set_nome("La voce di Anna".into());
                    creazione.set_consenso(true);
                    demo_tratti(&ui, 1);
                    if s == "voce-nome" {
                        creazione.set_nome("Giulia".into());
                        creazione.set_nome_messaggio("«Giulia» è anche il nome di una voce di Kalliope. Puoi tenerlo: nel menu la tua comparirà come «Giulia (voce propria)». Oppure scegli un altro nome.".into());
                        creazione.set_nome_conferma("Tieni questo nome".into());
                    }
                    if s == "voce-crea" {
                        creazione.set_crea_in_corso(true);
                        creazione.set_crea_avanzamento(0.55);
                    }
                }
                "voce-tratti" => {
                    creazione.set_passo(2);
                    creazione
                        .set_nota("Il file è lungo: ho cercato la voce nei primi 5 minuti.".into());
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
        ui.window().set_size(LogicalSize::new(
            ui.get_compatta_larghezza(),
            ui.get_compatta_altezza(),
        ));
    }
    // KALLIOPE_DEMO_MISURA=360x320 opens the scene at another size (the smallest window, a low screen)
    if let Some((w, h)) = std::env::var("KALLIOPE_DEMO_MISURA")
        .ok()
        .and_then(|m| {
            m.split_once('x')
                .map(|(w, h)| (w.parse::<f32>(), h.parse::<f32>()))
        })
        .and_then(|(w, h)| Some((w.ok()?, h.ok()?)))
    {
        ui.window().set_size(LogicalSize::new(w, h));
    }
    // KALLIOPE_DEMO_SCALA=1.75 opens the scene with another text size
    if let Some(scala) = std::env::var("KALLIOPE_DEMO_SCALA")
        .ok()
        .and_then(|s| s.parse::<f32>().ok())
    {
        ui.global::<crate::Aspetto>().set_scala(scala);
    }
    // KALLIOPE_DEMO_SENZA_PRIMO_PIANO=1 shows the meeting mode as it is where the system does not let a program stay above
    ui.set_senza_primo_piano(std::env::var_os("KALLIOPE_DEMO_SENZA_PRIMO_PIANO").is_some());
    history.set_vec(said);
    ui.set_phase(phase);
    ui.set_status(status.into());
    if let Some(s) = situazione {
        ui.set_situazione(s);
        ui.set_warning(true);
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
