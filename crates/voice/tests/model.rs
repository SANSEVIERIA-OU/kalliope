// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! End-to-end check with the real model. Runs only when KALLIOPE_MODEL_DIR (the Klein folder)
//! and KALLIOPE_ORT_LIB (the ONNX Runtime library) are set; otherwise it passes without work.

use std::path::PathBuf;

use kalliope_voice::{Voice, VoiceOptions};

#[test]
fn speaks_a_sentence() {
    let (Some(dir), Some(_)) = (
        std::env::var_os("KALLIOPE_MODEL_DIR"),
        std::env::var_os("KALLIOPE_ORT_LIB"),
    ) else {
        eprintln!("skipped: set KALLIOPE_MODEL_DIR and KALLIOPE_ORT_LIB to run");
        return;
    };
    let voice = Voice::load(&PathBuf::from(dir), "Giulia", &VoiceOptions::default()).expect("load");
    // "Sì, sono d'accordo. Posso fare una domanda?" (espeak-style phonemes)
    let phonemes = "sˈiː, sˌono dakːˈɔrdo. pˈɔSo fˈare ˌʊna domˈanda?";
    assert_eq!(voice.chunks(phonemes).len(), 2);
    let audio = voice.synthesize(phonemes).expect("synthesis");
    let seconds = audio.len() as f32 / voice.sample_rate() as f32;
    assert!((2.0..6.0).contains(&seconds), "{seconds} s");
    let rms = (audio.iter().map(|s| s * s).sum::<f32>() / audio.len() as f32).sqrt();
    assert!(
        rms > 0.01 && audio.iter().all(|s| s.is_finite()),
        "rms {rms}"
    );
    // Same input, same audio.
    assert_eq!(voice.synthesize(phonemes).expect("synthesis"), audio);
    assert!(voice.synthesize(" , . ").expect("synthesis").is_empty());
}
