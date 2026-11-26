// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! What the window of the direction «La frase che si accende» needs from Rust, kept apart from the engine and the
//! session: the words of a phrase for the bubble, the meeting mode's size, the live catalog (`--catalogo`) and the
//! demonstration scenes (`--demo SCENA`) for what the engine does not do yet (creating a voice, the saved history).
use crate::{AppWindow, Catalogo, Phase, Schermata, Situazione};
use slint::{ComponentHandle, LogicalSize, ModelRc, SharedString, VecModel};
use std::cell::Cell;
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

/// Wires the window's own needs: words for the bubble, and the meeting mode, which makes the window small and gives it
/// back its size afterwards.
pub fn collega(ui: &AppWindow) {
    ui.on_conta_parole(|text| parole(&text) as i32);
    ui.on_prefisso(|text, n| prefisso(&text, n.max(0) as usize).into());
    let weak = ui.as_weak();
    let before = Rc::new(Cell::new(None::<LogicalSize>));
    ui.on_compatta_cambiata(move |on| {
        let Some(ui) = weak.upgrade() else { return };
        let window = ui.window();
        let scale = window.scale_factor();
        if on {
            before.set(Some(window.size().to_logical(scale)));
            window.set_size(LogicalSize::new(ui.get_compatta_larghezza(), ui.get_compatta_altezza()));
        } else if let Some(size) = before.take() {
            window.set_size(size);
        }
    });
    ui.on_importa_voce(|| eprintln!("vista: importare un file audio non è ancora collegato"));
    ui.on_crea_voce(|name| eprintln!("vista: creare la voce «{name}» non è ancora collegato"));
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

/// A scene of the window driven by a demonstration state, without the engine: for what is designed but not wired yet,
/// and for screenshots that need a precise moment. Typing and Enter work: the voice is simulated with the bubble's
/// estimate, and nothing reaches the microphone.
pub fn demo(scena: &str) -> ExitCode {
    let ui = match AppWindow::new() {
        Ok(ui) => ui,
        Err(e) => {
            eprintln!("Non riesco ad aprire la finestra: {e}");
            return ExitCode::FAILURE;
        }
    };
    collega(&ui);
    ui.set_version(format!("{} · dimostrazione", env!("CARGO_PKG_VERSION")).into());
    ui.set_voices(modello(vec!["Giulia".into(), "Marco".into(), "La voce di Anna".into()]));
    let history = Rc::new(VecModel::<SharedString>::default());
    ui.set_history(ModelRc::from(history.clone()));
    let mut said: Vec<SharedString> = FRASI.iter().rev().map(|f| SharedString::from(*f)).collect();
    let mut phase = Phase::Ready;
    let mut status = String::new();
    let mut situazione = None;
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
        "voce-1" | "voce-2" | "voce-3" => {
            ui.set_schermata(Schermata::CreaVoce);
            match scena {
                "voce-2" => {
                    ui.set_passo_voce(1);
                    ui.set_registra(true);
                    ui.set_registrato(7400);
                }
                "voce-3" => {
                    ui.set_passo_voce(2);
                    ui.set_registrato(12600);
                    ui.set_nome_voce("La voce di Anna".into());
                    ui.set_consenso_voce(true);
                }
                _ => {}
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
        ui.window().set_size(LogicalSize::new(ui.get_compatta_larghezza(), ui.get_compatta_altezza()));
    }
    history.set_vec(said);
    ui.set_phase(phase);
    ui.set_status(status.into());
    if let Some(s) = situazione {
        ui.set_situazione(s);
        ui.set_warning(true);
    }
    // The simulated voice: speaking starts a moment after Enter, and lasts as the bubble's estimate says.
    let weak = ui.as_weak();
    let timer = Rc::new(slint::Timer::default());
    let history_speak = history.clone();
    ui.on_has_speech_text(|text| !text.trim().is_empty());
    ui.on_speak(move |text| {
        let text = SharedString::from(text.trim());
        let mut items: Vec<SharedString> = (0..slint::Model::row_count(&*history_speak))
            .filter_map(|i| slint::Model::row_data(&*history_speak, i))
            .filter(|t| *t != text)
            .collect();
        items.insert(0, text.clone());
        history_speak.set_vec(items);
        let words = parole(&text) as u64;
        let weak = weak.clone();
        let step = weak.upgrade().map_or(360, |ui| ui.get_durata_parola() as u64);
        let timer2 = timer.clone();
        timer.start(slint::TimerMode::SingleShot, Duration::from_millis(400), move || {
            if let Some(ui) = weak.upgrade() {
                ui.set_phase(Phase::Speaking);
                let weak = ui.as_weak();
                timer2.start(slint::TimerMode::SingleShot, Duration::from_millis(step * words + 300), move || {
                    if let Some(ui) = weak.upgrade() {
                        ui.set_phase(Phase::Ready);
                    }
                });
            }
        });
        true
    });
    let weak = ui.as_weak();
    ui.on_stop(move || {
        if let Some(ui) = weak.upgrade() {
            ui.set_phase(Phase::Ready);
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
