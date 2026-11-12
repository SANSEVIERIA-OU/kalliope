// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Neural voice: phonemes → audio samples.
//!
//! Runs Klein-TTS (an encoder that predicts phoneme durations and features, and a decoder that
//! turns the time-expanded features into a waveform) through ONNX Runtime, loaded at run time.
//! The pipeline follows the official `@kleinml/kleintts` package (`src/model.js`).

mod json;
mod noise;
pub mod ort;

use std::collections::HashMap;
use std::fmt;
use std::path::{Path, PathBuf};

use json::Json;
use ort::{Env, Session, SessionConfig, Tensor};

/// Phoneme tokens per model call (the two boundary tokens come on top).
pub const MAX_TOKENS: usize = 510;
/// Silence between chunks, as in the official package.
pub const PAUSE_SECONDS: f32 = 0.12;

/// Public voice names (from the Klein-TTS model card) for the model's internal voice ids.
const VOICE_NAMES: &[(&str, &str)] = &[
    ("af_heart", "Sarah"),
    ("af_aoede", "Lyra"),
    ("af_bella", "Maya"),
    ("af_nicole", "Ivy"),
    ("af_sarah", "Bella"),
    ("am_fenrir", "Owen"),
    ("am_michael", "Caleb"),
    ("bf_emma", "Isabella"),
    ("bf_isabella", "Harriet"),
    ("bm_fable", "Edmund"),
    ("bm_george", "Arthur"),
    ("ef_dora", "Lucia"),
    ("em_alex", "Mateo"),
    ("em_santa", "Diego"),
    ("ff_siwis", "Camille"),
    ("if_sara", "Giulia"),
    ("im_nicola", "Marco"),
];

#[derive(Debug, Clone)]
pub struct Error(String);

impl Error {
    pub fn new(message: impl Into<String>) -> Error {
        Error(message.into())
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl std::error::Error for Error {}

#[derive(Debug, Clone)]
pub struct VoiceOptions {
    /// Intra-op threads per model. One is the most efficient per watt for this small model.
    pub threads: usize,
    /// ONNX Runtime shared library; `None` reads `KALLIOPE_ORT_LIB`, then the system path.
    pub ort_lib: Option<PathBuf>,
    /// Longest chunk in phoneme tokens (at most [`MAX_TOKENS`]). Longer sentences are cut at
    /// clause punctuation, then at spaces. Peak memory grows with chunk length: a 12.7-second
    /// sentence in one chunk peaked at 255 MB, cut at its commas at 172 MB.
    pub max_chunk_tokens: usize,
}

impl Default for VoiceOptions {
    fn default() -> Self {
        VoiceOptions {
            threads: 1,
            ort_lib: None,
            max_chunk_tokens: MAX_TOKENS,
        }
    }
}

/// Model metadata from `model.json`.
struct Model {
    sample_rate: u32,
    hop: usize,
    frames_per_duration: usize,
    noise_channels: usize,
    vocab: HashMap<char, i64>,
    speakers: Vec<String>,
    styles: Vec<Vec<f32>>,
}

impl Model {
    fn read(path: &Path) -> Result<Model, Error> {
        let text = std::fs::read_to_string(path)
            .map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        let j = Json::parse(&text).map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        let num = |key: &str| -> Result<f64, Error> {
            j.get(key)
                .and_then(Json::as_f64)
                .ok_or_else(|| Error::new(format!("model.json: missing {key}")))
        };
        let missing = |key: &str| Error::new(format!("model.json: missing or invalid {key}"));
        let mut vocab = HashMap::new();
        for (k, v) in j
            .get("vocab")
            .and_then(Json::as_object)
            .ok_or_else(|| missing("vocab"))?
        {
            let mut chars = k.chars();
            let (Some(c), None, Some(id)) = (chars.next(), chars.next(), v.as_f64()) else {
                return Err(missing("vocab entry"));
            };
            vocab.insert(c, id as i64);
        }
        let speakers = j
            .get("speakers")
            .and_then(Json::as_array)
            .ok_or_else(|| missing("speakers"))?
            .iter()
            .map(|s| {
                s.as_str()
                    .map(str::to_owned)
                    .ok_or_else(|| missing("speakers"))
            })
            .collect::<Result<Vec<_>, _>>()?;
        let styles = j
            .get("styles")
            .and_then(Json::as_array)
            .ok_or_else(|| missing("styles"))?
            .iter()
            .map(|row| {
                row.as_array()
                    .ok_or_else(|| missing("styles"))?
                    .iter()
                    .map(|x| {
                        x.as_f64()
                            .map(|x| x as f32)
                            .ok_or_else(|| missing("styles"))
                    })
                    .collect::<Result<Vec<f32>, _>>()
            })
            .collect::<Result<Vec<_>, _>>()?;
        if styles.len() != speakers.len() || styles.iter().any(|s| s.len() != styles[0].len()) {
            return Err(missing("styles (shape)"));
        }
        Ok(Model {
            sample_rate: num("sample_rate")? as u32,
            hop: num("hop")? as usize,
            frames_per_duration: num("frames_per_duration")? as usize,
            noise_channels: num("noise_channels")? as usize,
            vocab,
            speakers,
            styles,
        })
    }

    /// Index of a speaker given by public name (any case) or internal id.
    fn speaker(&self, name: &str) -> Option<usize> {
        let id = VOICE_NAMES
            .iter()
            .find(|(_, public)| public.eq_ignore_ascii_case(name))
            .map_or(name, |(id, _)| *id);
        self.speakers.iter().position(|s| s == id)
    }

    fn tokens<'a>(&'a self, phonemes: &'a str) -> impl Iterator<Item = i64> + 'a {
        phonemes
            .chars()
            .filter_map(move |c| self.vocab.get(&c).copied())
    }
}

/// A loaded voice: both model graphs and one speaker's style vector.
pub struct Voice {
    model: Model,
    max_chunk_tokens: usize,
    style: Vec<f32>,
    encoder: Session,
    decoder: Session,
    env: Env,
}

impl Voice {
    /// Loads `encoder.onnx`, `decoder.onnx` and `model.json` from `model_dir`.
    pub fn load(model_dir: &Path, speaker: &str, options: &VoiceOptions) -> Result<Voice, Error> {
        let model = Model::read(&model_dir.join("model.json"))?;
        let index = model.speaker(speaker).ok_or_else(|| {
            let names: Vec<&str> = model
                .speakers
                .iter()
                .map(|id| {
                    VOICE_NAMES
                        .iter()
                        .find(|(i, _)| i == id)
                        .map_or(id.as_str(), |(_, n)| *n)
                })
                .collect();
            Error::new(format!(
                "unknown speaker \"{speaker}\" (this model has: {})",
                names.join(", ")
            ))
        })?;
        let lib = options
            .ort_lib
            .clone()
            .or_else(|| std::env::var_os("KALLIOPE_ORT_LIB").map(PathBuf::from));
        let env = Env::new(ort::load(lib.as_deref())?)?;
        let config = SessionConfig {
            threads: options.threads,
        };
        let encoder = env.session(&model_dir.join("encoder.onnx"), config)?;
        let decoder = env.session(&model_dir.join("decoder.onnx"), config)?;
        let style = model.styles[index].clone();
        let max_chunk_tokens = options.max_chunk_tokens.clamp(1, MAX_TOKENS);
        Ok(Voice {
            model,
            max_chunk_tokens,
            style,
            encoder,
            decoder,
            env,
        })
    }

    pub fn sample_rate(&self) -> u32 {
        self.model.sample_rate
    }

    /// Version string of the ONNX Runtime library in use.
    pub fn runtime_version(&self) -> &str {
        self.env.api().version()
    }

    /// Splits phonemes into model-sized chunks: one per sentence, and long sentences at clause
    /// punctuation or spaces so that no chunk exceeds the configured length.
    pub fn chunks(&self, phonemes: &str) -> Vec<String> {
        chunk(phonemes, self.max_chunk_tokens, &|s| {
            self.model.tokens(s).count()
        })
    }

    /// Synthesizes one chunk. `seed` fixes the decoder noise, so equal input gives equal audio.
    pub fn synthesize_chunk(&self, phonemes: &str, seed: u32) -> Result<Vec<f32>, Error> {
        let m = &self.model;
        let ids: Vec<i64> = m.tokens(phonemes).take(MAX_TOKENS).collect();
        // Nothing to pronounce (only spaces or punctuation): no audio rather than a short breath.
        let speakable = phonemes
            .chars()
            .any(|c| c.is_alphabetic() && m.vocab.contains_key(&c));
        if ids.is_empty() || !speakable {
            return Ok(Vec::new());
        }
        let n = ids.len() + 2;
        let mut tokens = Vec::with_capacity(n);
        tokens.push(0);
        tokens.extend_from_slice(&ids);
        tokens.push(0);
        let mut style = self.style.clone();
        let style_shape = [1, style.len() as i64];
        let mut speed = [1.0f32];

        let env = &self.env;
        let (durations, features) = {
            let tokens_t = Tensor::i64(env, &mut tokens, &[1, n as i64])?;
            let style_t = Tensor::f32(env, &mut style, &style_shape)?;
            let speed_t = Tensor::f32(env, &mut speed, &[1])?;
            let mut out = self.encoder.run(
                &[
                    (c"tokens", &tokens_t),
                    (c"style", &style_t),
                    (c"speed", &speed_t),
                ],
                &[c"durations", c"features"],
            )?;
            let features = out.pop().expect("two outputs");
            let durations = out.pop().expect("two outputs");
            (durations, features)
        };
        let width = *features.shape.last().unwrap_or(&0) as usize;
        if width == 0 || durations.data.len() != n || features.data.len() != n * width {
            return Err(Error::new(format!(
                "unexpected encoder output shapes {:?} / {:?}",
                durations.shape, features.shape
            )));
        }

        // Repeat each phoneme's feature row for its predicted duration (at least one step).
        let reps: Vec<usize> = durations
            .data
            .iter()
            .map(|&d| js_round(d).max(1) as usize * m.frames_per_duration)
            .collect();
        let total_frames: usize = reps.iter().sum();
        let mut frames = Vec::with_capacity(total_frames * width);
        for (row, &r) in features.data.chunks_exact(width).zip(&reps) {
            for _ in 0..r {
                frames.extend_from_slice(row);
            }
        }
        drop(features);
        let samples = total_frames * m.hop;
        let mut noise = noise::gaussian(m.noise_channels * samples, seed);

        let frames_t = Tensor::f32(env, &mut frames, &[1, total_frames as i64, width as i64])?;
        let style_t = Tensor::f32(env, &mut style, &style_shape)?;
        let noise_t = Tensor::f32(
            env,
            &mut noise,
            &[1, m.noise_channels as i64, samples as i64],
        )?;
        let mut out = self.decoder.run(
            &[
                (c"frames", &frames_t),
                (c"style", &style_t),
                (c"noise", &noise_t),
            ],
            &[c"audio"],
        )?;
        Ok(out.pop().expect("one output").data)
    }

    /// Synthesizes any amount of phonemes, chunk by chunk, with a short pause between chunks.
    pub fn synthesize(&self, phonemes: &str) -> Result<Vec<f32>, Error> {
        let pause = (PAUSE_SECONDS * self.model.sample_rate as f32).round() as usize;
        let mut audio = Vec::new();
        for (i, c) in self.chunks(phonemes).iter().enumerate() {
            let part = self.synthesize_chunk(c, i as u32)?;
            if part.is_empty() {
                continue;
            }
            if !audio.is_empty() {
                audio.resize(audio.len() + pause, 0.0);
            }
            audio.extend_from_slice(&part);
        }
        release_memory();
        Ok(audio)
    }
}

/// Returns memory freed after a synthesis to the operating system (glibc keeps it otherwise).
/// Measured: resident memory between utterances 135–165 MB without, 95 MB with, and no
/// measurable CPU cost. [`Voice::synthesize`] calls it; streaming callers using
/// [`Voice::synthesize_chunk`] should call it when an utterance ends.
pub fn release_memory() {
    #[cfg(all(target_os = "linux", target_env = "gnu"))]
    {
        unsafe extern "C" {
            fn malloc_trim(pad: usize) -> i32;
        }
        // SAFETY: malloc_trim only releases free heap pages.
        unsafe { malloc_trim(0) };
    }
}

/// JavaScript's `Math.round` (halves round up), as used by the reference implementation.
fn js_round(x: f32) -> i64 {
    (f64::from(x) + 0.5).floor() as i64
}

/// Splits after sentence punctuation, then packs pieces so that each chunk has at most
/// `limit` tokens as counted by `count`.
fn chunk(phonemes: &str, limit: usize, count: &dyn Fn(&str) -> usize) -> Vec<String> {
    let mut chunks = Vec::new();
    for sentence in split_after(phonemes, &['.', '!', '?', '…']) {
        if count(sentence) <= limit {
            chunks.push(sentence.to_owned());
            continue;
        }
        // Too long: clause punctuation first, then single words.
        let mut pieces = Vec::new();
        for clause in split_after(sentence, &[',', ';', ':', '—']) {
            if count(clause) <= limit {
                pieces.push(clause);
            } else {
                pieces.extend(clause.split_whitespace());
            }
        }
        let mut current = String::new();
        for piece in pieces {
            let candidate = if current.is_empty() {
                piece.to_owned()
            } else {
                format!("{current} {piece}")
            };
            if !current.is_empty() && count(&candidate) > limit {
                chunks.push(std::mem::replace(&mut current, piece.to_owned()));
            } else {
                current = candidate;
            }
        }
        if !current.is_empty() {
            chunks.push(current);
        }
    }
    chunks
}

/// Trimmed, non-empty pieces of `s`, cut after any of `marks` that is followed by whitespace.
fn split_after<'a>(s: &'a str, marks: &[char]) -> Vec<&'a str> {
    let mut out = Vec::new();
    let mut start = 0;
    let mut chars = s.char_indices().peekable();
    while let Some((i, c)) = chars.next() {
        let at_break =
            marks.contains(&c) && chars.peek().is_some_and(|(_, next)| next.is_whitespace());
        if at_break {
            let end = i + c.len_utf8();
            out.push(&s[start..end]);
            start = end;
        }
    }
    out.push(&s[start..]);
    out.into_iter()
        .map(str::trim)
        .filter(|p| !p.is_empty())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rounds_halves_up_like_javascript() {
        assert_eq!(js_round(2.5), 3);
        assert_eq!(js_round(3.5), 4);
        assert_eq!(js_round(0.49), 0);
    }

    #[test]
    fn one_chunk_per_sentence() {
        let count = |s: &str| s.chars().count();
        let chunks = chunk("pɔsso? nɔn ɔ kapˈito… bˈɛne. ok", MAX_TOKENS, &count);
        assert_eq!(chunks, ["pɔsso?", "nɔn ɔ kapˈito…", "bˈɛne.", "ok"]);
        // A decimal-like dot not followed by a space does not split.
        assert_eq!(chunk("a.b c", MAX_TOKENS, &count), ["a.b c"]);
    }

    #[test]
    fn long_sentences_are_cut_under_the_limit() {
        let count = |s: &str| s.chars().filter(|c| !c.is_whitespace()).count();
        let clause = "abcdefghij ".repeat(30); // 300 tokens
        let text = format!("{clause}, {clause}, {clause}.");
        let chunks = chunk(&text, MAX_TOKENS, &count);
        assert!(chunks.len() >= 2);
        assert!(chunks.iter().all(|c| count(c) <= MAX_TOKENS));
        let word = "x".repeat(20);
        let long_clause = vec![word.as_str(); 60].join(" "); // 1200 tokens, no punctuation
        let chunks = chunk(&long_clause, MAX_TOKENS, &count);
        assert!(chunks.len() >= 3 && chunks.iter().all(|c| count(c) <= MAX_TOKENS));
        assert_eq!(chunks.join(" "), long_clause);
    }

    #[test]
    fn a_lower_limit_cuts_at_clauses() {
        let count = |s: &str| s.chars().filter(|c| c.is_alphabetic()).count();
        let chunks = chunk("aaaa bbbb, cccc dddd, eeee. ffff", 10, &count);
        assert_eq!(chunks, ["aaaa bbbb,", "cccc dddd,", "eeee.", "ffff"]);
        // Clauses that fit together stay together.
        assert_eq!(chunk("aa, bb, cc.", 10, &count), ["aa, bb, cc."]);
    }
}
