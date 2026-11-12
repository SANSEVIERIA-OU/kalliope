// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! `kalliope`: development command line (text → normalized text → phonemes → audio).

mod wav;

use std::io::Write;
use std::path::PathBuf;
use std::process::ExitCode;
use std::time::Instant;

use kalliope_voice::{Voice, VoiceOptions};

const USAGE: &str = "\
usage:
  kalliope-cli say [options] TEXT...    speak TEXT into a WAV file
  kalliope-cli phonemes TEXT...         print each normalized sentence and its phonemes

options for say:
  --model-dir DIR   Klein model folder (default: $KALLIOPE_MODEL_DIR, else models/klein)
  --speaker NAME    voice, e.g. Giulia or Marco (default: Giulia)
  --threads N       threads per model (default: 1, the most efficient)
  --ort-lib PATH    ONNX Runtime library (default: $KALLIOPE_ORT_LIB, else the system one)
  --max-chunk-tokens N  cut longer sentences at commas (default and maximum: 510)
  --phonemes        TEXT is already phonemes: skip normalization and phonemization
  -o FILE           output WAV (default: kalliope.wav; - for standard output)";

struct SayArgs {
    model_dir: PathBuf,
    speaker: String,
    options: VoiceOptions,
    raw_phonemes: bool,
    output: String,
    text: String,
}

fn parse_say(args: &[String]) -> Result<SayArgs, String> {
    let mut say = SayArgs {
        model_dir: std::env::var_os("KALLIOPE_MODEL_DIR")
            .map_or_else(|| PathBuf::from("models/klein"), PathBuf::from),
        speaker: "Giulia".into(),
        options: VoiceOptions::default(),
        raw_phonemes: false,
        output: "kalliope.wav".into(),
        text: String::new(),
    };
    let mut words = Vec::new();
    let mut it = args.iter();
    while let Some(arg) = it.next() {
        let mut value = |name: &str| {
            it.next()
                .cloned()
                .ok_or_else(|| format!("{name} needs a value"))
        };
        match arg.as_str() {
            "--model-dir" => say.model_dir = value(arg)?.into(),
            "--speaker" => say.speaker = value(arg)?,
            "--threads" => {
                say.options.threads = value(arg)?
                    .parse()
                    .map_err(|_| "--threads needs a number".to_string())?
            }
            "--ort-lib" => say.options.ort_lib = Some(value(arg)?.into()),
            "--max-chunk-tokens" => {
                say.options.max_chunk_tokens = value(arg)?
                    .parse()
                    .map_err(|_| "--max-chunk-tokens needs a number".to_string())?
            }
            "--phonemes" => say.raw_phonemes = true,
            "-o" => say.output = value(arg)?,
            "--" => words.extend(it.by_ref().cloned()),
            s if s.starts_with('-') && s.len() > 1 => return Err(format!("unknown option {s}")),
            s => words.push(s.to_owned()),
        }
    }
    say.text = words.join(" ");
    if say.text.trim().is_empty() {
        return Err("nothing to say".into());
    }
    Ok(say)
}

/// Normalized sentences of `text` with their phonemes.
fn front_end(text: &str) -> Vec<(String, String)> {
    kalliope_text::normalize(text)
        .into_iter()
        .map(|s| {
            let p = kalliope_phonemes::phonemize(&s);
            (s, p)
        })
        .collect()
}

fn say(args: &[String]) -> Result<(), String> {
    let a = parse_say(args)?;
    let phonemes = if a.raw_phonemes {
        a.text.clone()
    } else {
        front_end(&a.text)
            .into_iter()
            .map(|(_, p)| p)
            .collect::<Vec<_>>()
            .join(" ")
    };
    let t0 = Instant::now();
    let voice = Voice::load(&a.model_dir, &a.speaker, &a.options).map_err(|e| e.to_string())?;
    let loaded = t0.elapsed();
    let t1 = Instant::now();
    let audio = voice.synthesize(&phonemes).map_err(|e| e.to_string())?;
    let synth = t1.elapsed();
    let bytes = wav::encode(&audio, voice.sample_rate());
    if a.output == "-" {
        std::io::stdout()
            .write_all(&bytes)
            .map_err(|e| e.to_string())?;
    } else {
        std::fs::write(&a.output, &bytes).map_err(|e| format!("{}: {e}", a.output))?;
    }
    eprintln!(
        "load {} ms · synthesis {} ms · audio {:.2} s · ONNX Runtime {}",
        loaded.as_millis(),
        synth.as_millis(),
        audio.len() as f64 / f64::from(voice.sample_rate()),
        voice.runtime_version()
    );
    Ok(())
}

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let result = match args.first().map(String::as_str) {
        Some("say") => say(&args[1..]),
        Some("phonemes") => {
            for (sentence, phonemes) in front_end(&args[1..].join(" ")) {
                println!("{sentence}\t{phonemes}");
            }
            Ok(())
        }
        Some("help" | "--help" | "-h") => {
            println!("{USAGE}");
            Ok(())
        }
        _ => Err(USAGE.to_string()),
    };
    match result {
        Ok(()) => ExitCode::SUCCESS,
        Err(e) => {
            eprintln!("kalliope: {e}");
            ExitCode::FAILURE
        }
    }
}
