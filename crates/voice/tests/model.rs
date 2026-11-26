// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
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

/// A sentence said piece by piece, each piece read with the clauses around it, lasts as long as
/// the sentence said in one go: no extra pause at the cuts. Said clause by clause without context,
/// each cut adds the silence that ends and starts an utterance.
#[test]
fn a_sentence_said_in_pieces_keeps_the_pauses_of_the_whole() {
    let (Some(dir), Some(_)) = (
        std::env::var_os("KALLIOPE_MODEL_DIR"),
        std::env::var_os("KALLIOPE_ORT_LIB"),
    ) else {
        eprintln!("skipped: set KALLIOPE_MODEL_DIR and KALLIOPE_ORT_LIB to run");
        return;
    };
    let voice = Voice::load(&PathBuf::from(dir), "Giulia", &VoiceOptions::default()).expect("load");
    let rate = voice.sample_rate() as f32;
    let phonemes = "bʊonʤˈorno a tˈutːɪ, skʊzˈate se skrˈivo invˈeʧe dɪ parlˈare, ˈɔʤːɪ la vˈoʧe non mɪ ajˈuta.";
    let whole = voice.synthesize_chunk(phonemes, 0).unwrap().len() as f32 / rate;
    let clauses: Vec<String> = voice
        .clauses(phonemes)
        .into_iter()
        .map(|(c, _)| c)
        .collect();
    assert_eq!(clauses.len(), 3);
    let mut in_context = 0;
    let mut alone = 0;
    for (i, c) in clauses.iter().enumerate() {
        let before = if i > 0 { clauses[i - 1].as_str() } else { "" };
        let after = clauses.get(i + 1).map_or("", String::as_str);
        let part = voice.synthesize_in_context(before, c, after, 0).unwrap();
        assert!(part.iter().all(|s| s.is_finite()) && !part.is_empty());
        in_context += part.len();
        alone += voice.synthesize_chunk(c, 0).unwrap().len();
    }
    let (in_context, alone) = (in_context as f32 / rate, alone as f32 / rate);
    eprintln!("whole {whole:.2} s, in context {in_context:.2} s, alone {alone:.2} s");
    assert!((in_context - whole).abs() < 0.35, "{in_context} vs {whole}");
    assert!(alone - whole > 0.8, "{alone} vs {whole}");
}
