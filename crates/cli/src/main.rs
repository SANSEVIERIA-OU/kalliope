// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! `kalliope`: development command line (text → normalized text → phonemes → audio).

mod wav;

use std::io::Write;
use std::path::PathBuf;
use std::process::ExitCode;
use std::time::Instant;

use kalliope_voice::pocket::{Pocket, PocketOptions};
use kalliope_voice::{Voice, VoiceOptions};

const USAGE: &str = "\
usage:
  kalliope-cli say [options] TEXT...    speak TEXT into a WAV file
  kalliope-cli voice [options] RECORDING.wav -o VOICE.safetensors
                                        prepare a voice from a recording of its owner
  kalliope-cli phonemes TEXT...         print each normalized sentence and its phonemes

options for say:
  --model-dir DIR   Klein model folder (default: $KALLIOPE_MODEL_DIR, else the one that comes with
                    Kalliope, share/kalliope/klein-tts-x1.5-pro next to the program, else models/klein)
  --speaker NAME    voice, e.g. Giulia or Marco (default: Giulia)
  --voice FILE      speak with a voice prepared by `voice` (Pocket TTS) instead
  --pocket-dir DIR  Pocket TTS model folder (default: $KALLIOPE_POCKET_DIR, else the one that comes
                    with Kalliope, share/kalliope/pocket-tts-italian, else models/pocket)
  --seed N          sampling seed of Pocket TTS (default: 0)
  --temperature T   sampling temperature of Pocket TTS (default: the model's, 0.3)
  --threads N       threads per model (default: 1 for Klein, 2 for Pocket TTS)
  --ort-lib PATH    ONNX Runtime library (default: $KALLIOPE_ORT_LIB, else the one that comes with
                    Kalliope, in ../lib/kalliope or ../lib next to the program, else the system one)
  --max-chunk-tokens N  cut longer sentences at commas (default and maximum: 510; Klein)
  --phonemes        TEXT is already phonemes: skip normalization and phonemization (Klein)
  -o FILE           output WAV (default: kalliope.wav; - for standard output)

options for voice: --pocket-dir, --threads, --ort-lib as above. The recording is a WAV file; only its
first 12 seconds are used. Use your own voice, or the voice of someone who has given explicit consent:
the model's terms forbid imitating anyone else.";

struct SayArgs {
    model_dir: PathBuf,
    speaker: String,
    options: VoiceOptions,
    raw_phonemes: bool,
    output: String,
    text: String,
    /// A prepared voice: speak with Pocket TTS.
    voice: Option<PathBuf>,
    pocket_dir: PathBuf,
    pocket: PocketOptions,
    seed: u32,
    threads_given: bool,
}

/// A model folder: the variable, else the copy that comes with Kalliope (`share/kalliope/FOLDER` next
/// to the program), else `fallback` (relative to where kalliope-cli runs, for development).
fn model_folder(variable: &str, folder: &str, fallback: &str) -> PathBuf {
    if let Some(dir) = std::env::var_os(variable) {
        return PathBuf::from(dir);
    }
    kalliope_voice::models_next_to_program()
        .map(|d| d.join(folder))
        .filter(|d| d.is_dir())
        .unwrap_or_else(|| PathBuf::from(fallback))
}

fn default_pocket_dir() -> PathBuf {
    model_folder(
        "KALLIOPE_POCKET_DIR",
        kalliope_voice::POCKET_FOLDER,
        "models/pocket",
    )
}

fn parse_say(args: &[String]) -> Result<SayArgs, String> {
    let mut say = SayArgs {
        model_dir: model_folder(
            "KALLIOPE_MODEL_DIR",
            kalliope_voice::KLEIN_FOLDER,
            "models/klein",
        ),
        speaker: "Giulia".into(),
        options: VoiceOptions::default(),
        raw_phonemes: false,
        output: "kalliope.wav".into(),
        text: String::new(),
        voice: None,
        pocket_dir: default_pocket_dir(),
        pocket: PocketOptions::default(),
        seed: 0,
        threads_given: false,
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
                    .map_err(|_| "--threads needs a number".to_string())?;
                say.pocket.threads = say.options.threads;
                say.threads_given = true;
            }
            "--ort-lib" => {
                say.options.ort_lib = Some(value(arg)?.into());
                say.pocket.ort_lib = say.options.ort_lib.clone();
            }
            "--voice" => say.voice = Some(value(arg)?.into()),
            "--pocket-dir" => say.pocket_dir = value(arg)?.into(),
            "--seed" => {
                say.seed = value(arg)?
                    .parse()
                    .map_err(|_| "--seed needs a number".to_string())?
            }
            "--temperature" => {
                say.pocket.temperature = Some(
                    value(arg)?
                        .parse()
                        .map_err(|_| "--temperature needs a number".to_string())?,
                )
            }
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

/// Kalliope's normalized sentences as Pocket TTS reads them.
fn pocket_text(text: &str) -> String {
    kalliope_voice::pocket::join_sentences(&kalliope_text::normalize(text))
}

fn write_wav(output: &str, audio: &[f32], rate: u32) -> Result<(), String> {
    let bytes = wav::encode(audio, rate);
    if output == "-" {
        std::io::stdout()
            .write_all(&bytes)
            .map_err(|e| e.to_string())
    } else {
        std::fs::write(output, &bytes).map_err(|e| format!("{output}: {e}"))
    }
}

fn say_pocket(a: &SayArgs, voice_file: &std::path::Path) -> Result<(), String> {
    let text = pocket_text(&a.text);
    let t0 = Instant::now();
    let pocket = Pocket::load(&a.pocket_dir, &a.pocket).map_err(|e| e.to_string())?;
    let voice = pocket.load_voice(voice_file).map_err(|e| e.to_string())?;
    let loaded = t0.elapsed();
    let t1 = Instant::now();
    let mut audio = Vec::new();
    let mut first_audio = None;
    for (i, chunk) in pocket.chunks(&text).iter().enumerate() {
        pocket
            .speak_chunk(&voice, chunk, a.seed.wrapping_add(i as u32), &mut |part| {
                first_audio.get_or_insert_with(|| t1.elapsed());
                audio.extend_from_slice(part);
                true
            })
            .map_err(|e| e.to_string())?;
    }
    let synth = t1.elapsed();
    write_wav(&a.output, &audio, pocket.sample_rate())?;
    eprintln!(
        "load {} ms · first audio {} ms · synthesis {} ms · audio {:.2} s · ONNX Runtime {}",
        loaded.as_millis(),
        first_audio.unwrap_or_default().as_millis(),
        synth.as_millis(),
        audio.len() as f64 / f64::from(pocket.sample_rate()),
        pocket.runtime_version()
    );
    Ok(())
}

fn prepare_voice(args: &[String]) -> Result<(), String> {
    let mut pocket_dir = default_pocket_dir();
    let mut options = PocketOptions::default();
    let mut output = None;
    let mut input = None;
    let mut it = args.iter();
    while let Some(arg) = it.next() {
        let mut value = |name: &str| {
            it.next()
                .cloned()
                .ok_or_else(|| format!("{name} needs a value"))
        };
        match arg.as_str() {
            "--pocket-dir" => pocket_dir = value(arg)?.into(),
            "--threads" => {
                options.threads = value(arg)?
                    .parse()
                    .map_err(|_| "--threads needs a number".to_string())?
            }
            "--ort-lib" => options.ort_lib = Some(value(arg)?.into()),
            "-o" => output = Some(PathBuf::from(value(arg)?)),
            s if s.starts_with('-') && s.len() > 1 => return Err(format!("unknown option {s}")),
            s if input.is_none() => input = Some(PathBuf::from(s)),
            s => return Err(format!("unexpected argument {s}")),
        }
    }
    let input = input.ok_or("which recording? (a WAV file)")?;
    let output = output.ok_or("where to save the voice? (-o VOICE.safetensors)")?;
    let bytes = std::fs::read(&input).map_err(|e| format!("{}: {e}", input.display()))?;
    let (samples, rate) = wav::decode(&bytes).map_err(|e| format!("{}: {e}", input.display()))?;
    let t0 = Instant::now();
    let pocket = Pocket::load(&pocket_dir, &options).map_err(|e| e.to_string())?;
    let loaded = t0.elapsed();
    let t1 = Instant::now();
    let voice = pocket
        .prepare_voice(&samples, rate)
        .map_err(|e| e.to_string())?;
    let prepared = t1.elapsed();
    pocket
        .save_voice(&voice, &output)
        .map_err(|e| e.to_string())?;
    eprintln!(
        "load {} ms · voice prepared in {} ms ({:.1} s of recording, {} positions) · saved to {}",
        loaded.as_millis(),
        prepared.as_millis(),
        samples.len() as f64 / f64::from(rate),
        voice.positions(),
        output.display()
    );
    Ok(())
}

fn say(args: &[String]) -> Result<(), String> {
    let mut a = parse_say(args)?;
    if let Some(voice) = a.voice.clone() {
        if !a.threads_given {
            a.pocket.threads = PocketOptions::default().threads;
        }
        return say_pocket(&a, &voice);
    }
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
    write_wav(&a.output, &audio, voice.sample_rate())?;
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
        Some("voice") => prepare_voice(&args[1..]),
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
