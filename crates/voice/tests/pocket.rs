// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! End-to-end checks of Pocket TTS with the real model. Run only when KALLIOPE_POCKET_DIR (the
//! model folder: flow_lm.onnx, mimi_decoder.onnx, mimi_encoder.onnx, tokenizer.json, pocket.json)
//! and KALLIOPE_ORT_LIB are set; otherwise they pass without work. They need no recording of a
//! person: the voice is prepared from a synthetic signal, which is enough for the mechanics.

use std::path::PathBuf;

use kalliope_voice::pocket::{MAX_VOICE_SECONDS, Pocket, PocketOptions};

fn model() -> Option<Pocket> {
    let (Some(dir), Some(_)) = (
        std::env::var_os("KALLIOPE_POCKET_DIR"),
        std::env::var_os("KALLIOPE_ORT_LIB"),
    ) else {
        eprintln!("skipped: set KALLIOPE_POCKET_DIR and KALLIOPE_ORT_LIB to run");
        return None;
    };
    Some(Pocket::load(&PathBuf::from(dir), &PocketOptions::default()).expect("load"))
}

/// A voice-like test signal: a gliding harmonic tone with pauses, at 16 kHz.
fn signal(seconds: f32) -> Vec<f32> {
    let rate = 16_000.0;
    (0..(seconds * rate) as usize)
        .map(|i| {
            let t = i as f32 / rate;
            let on = if (t % 1.5) < 1.1 { 1.0 } else { 0.0 };
            let f0 = 140.0 + 30.0 * (t * 1.3).sin();
            let s: f32 = (1..6)
                .map(|h| (2.0 * std::f32::consts::PI * f0 * h as f32 * t).sin() / h as f32)
                .sum();
            0.2 * on * s
        })
        .collect()
}

#[test]
fn prepares_saves_and_speaks_with_a_voice() {
    let Some(pocket) = model() else { return };
    let voice = pocket.prepare_voice(&signal(4.0), 16_000).expect("prepare");
    // 12.5 frames per second, one bos position, the 80 ms pause.
    assert!(
        (45..=55).contains(&voice.positions()),
        "{}",
        voice.positions()
    );
    let dir = std::env::temp_dir().join(format!("kalliope-pocket-{}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("voice.safetensors");
    pocket.save_voice(&voice, &file).expect("save");
    let loaded = pocket.load_voice(&file).expect("load");
    assert_eq!(loaded.positions(), voice.positions());

    let text = "Buongiorno a tutti, scrivo invece di parlare.";
    let audio = pocket.synthesize(&loaded, text, 7).expect("speak");
    let seconds = audio.len() as f32 / pocket.sample_rate() as f32;
    assert!((1.0..8.0).contains(&seconds), "{seconds} s");
    assert!(audio.iter().all(|s| s.is_finite()));
    // Same voice, same seed: same audio; the saved voice speaks as the prepared one.
    assert_eq!(pocket.synthesize(&voice, text, 7).expect("speak"), audio);

    // Stopping from the audio callback ends the chunk at once.
    let chunk = &pocket.chunks(text)[0];
    let mut calls = 0;
    let stats = pocket
        .speak_chunk(&voice, chunk, 7, &mut |_| {
            calls += 1;
            calls < 3
        })
        .expect("speak");
    assert!(stats.stopped && calls == 3 && stats.frames < 6, "{stats:?}");
    std::fs::remove_dir_all(&dir).unwrap();
}

#[test]
fn uses_only_the_first_seconds_of_a_long_recording() {
    let Some(pocket) = model() else { return };
    // 30 s: without the limit the voice had 376 positions, and the model ended long sentences
    // early (V-4, benchmarks/voce-propria).
    let voice = pocket
        .prepare_voice(&signal(30.0), 16_000)
        .expect("prepare");
    let most = (MAX_VOICE_SECONDS * 12.5) as usize + 3;
    assert!(voice.positions() <= most, "{} positions", voice.positions());
}

#[test]
fn reads_text_as_the_official_code() {
    let Some(pocket) = model() else { return };
    let chunks =
        pocket.chunks("Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo. Sì.");
    assert_eq!(chunks.len(), 1);
    assert_eq!(
        chunks[0].prompt,
        "Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo. Sì."
    );
    assert_eq!(chunks[0].frames_after_eos, 3);
    let long = "Questa è una frase lunga, con molte parole e virgole, che continua ancora, \
                e ancora, finché il modello non deve dividerla in pezzi più corti per dirla bene, \
                come fa il codice ufficiale.";
    assert!(pocket.chunks(long).len() >= 2);
}
