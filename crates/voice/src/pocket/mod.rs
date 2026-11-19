// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Pocket TTS (Kyutai): speaks with the voice of a short recording.
//!
//! Three ONNX graphs exported from the official code (benchmarks/voce-propria/scripts/v4_esporta.py),
//! each with its streaming state held here:
//! - `flow_lm.onnx`: one step of the flow language model. It reads text tokens, the voice, or the last
//!   latent frame, and returns the next latent frame (80 ms of speech), the end-of-speech logit, and
//!   the attention keys and values grown by what it read;
//! - `mimi_decoder.onnx`: latent frames to 24 kHz audio, causal, any number of frames per call;
//! - `mimi_encoder.onnx`: a recording to the voice conditioning, in pieces, only to prepare a voice.
//!
//! The generation loop is the official one (`TTSModel.generate_audio_stream`, kyutai-labs/pocket-tts
//! a4a6054d) with the settings of the Italian config: the text in chunks of at most 50 tokens, each
//! chunk from the voice state; the end detected when the logit passes -4 (not before frame 6), then
//! two or three more frames; noise of variance 0.3; a fresh decoder per chunk with a 5 ms fade-in.

mod audio;
mod safetensors;
mod text;
mod tokenizer;

use std::ffi::{CStr, CString};
use std::path::{Path, PathBuf};

use crate::json::Json;
use crate::ort::{Env, Session, SessionConfig, Tensor};
use crate::{Error, find_runtime, noise};
pub use text::TextOptions;
pub use tokenizer::Tokenizer;

/// Longest part of a recording used as the voice. From four Italian readers cloned from the first
/// 6 to 25 s of a reading, five sentences each: up to 15 s, 0-3% word errors; from 20 s the model ends
/// sentences early (6-12% at 20 s, 30-33% at 25 s, with the official code too). Kyutai's ready voices
/// are 7 to 12 s (benchmarks/voce-propria, V-4).
pub const MAX_VOICE_SECONDS: f32 = 12.0;

#[derive(Debug, Clone)]
pub struct PocketOptions {
    /// Intra-op threads per graph.
    pub threads: usize,
    /// ONNX Runtime shared library; `None` reads `KALLIOPE_ORT_LIB`, then looks next to the program.
    pub ort_lib: Option<PathBuf>,
    /// Sampling temperature; `None` uses the model's (0.3).
    pub temperature: Option<f32>,
    /// Latent frames decoded per decoder call after the first (which is decoded alone, to start
    /// speaking as early as possible).
    pub decode_frames: usize,
}

impl Default for PocketOptions {
    fn default() -> Self {
        PocketOptions {
            threads: 2,
            ort_lib: None,
            temperature: None,
            decode_frames: 2,
        }
    }
}

/// `pocket.json`, written next to the graphs by the export.
struct Meta {
    model: String,
    layers: usize,
    heads: usize,
    head_dim: usize,
    latent_dim: usize,
    dim: usize,
    sample_rate: u32,
    frame_size: usize,
    steps_per_frame: i64,
    temperature: f32,
    eos_threshold: f32,
    min_frames_before_eos: usize,
    tokens_per_second: f64,
    gen_seconds_padding: f64,
    fade_in_samples: usize,
    pause_seconds: f64,
    pause_fade_seconds: f64,
    pause_floor_db: f32,
    frames_after_eos: Option<usize>,
    decoder_states: Vec<Vec<i64>>,
    encoder_states: Vec<Vec<i64>>,
    text: TextOptions,
}

impl Meta {
    fn read(path: &Path) -> Result<Meta, Error> {
        let text = std::fs::read_to_string(path)
            .map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        let j = Json::parse(&text).map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        let missing = |k: &str| Error::new(format!("pocket.json: missing or invalid {k}"));
        let num = |k: &str| j.get(k).and_then(Json::as_f64).ok_or_else(|| missing(k));
        let flag = |k: &str| match j.get(k) {
            Some(Json::Bool(b)) => Ok(*b),
            _ => Err(missing(k)),
        };
        let shapes = |k: &str| -> Result<Vec<Vec<i64>>, Error> {
            j.get(k)
                .and_then(Json::as_array)
                .ok_or_else(|| missing(k))?
                .iter()
                .map(|s| {
                    s.get("shape")
                        .and_then(Json::as_array)
                        .ok_or_else(|| missing(k))?
                        .iter()
                        .map(|d| d.as_f64().map(|d| d as i64).ok_or_else(|| missing(k)))
                        .collect()
                })
                .collect()
        };
        let mut replace = Vec::new();
        for (from, to) in j
            .get("replace_characters")
            .and_then(Json::as_object)
            .ok_or_else(|| missing("replace_characters"))?
        {
            let mut chars = from.chars();
            let (Some(c), None, Some(to)) = (chars.next(), chars.next(), to.as_str()) else {
                return Err(missing("replace_characters"));
            };
            replace.push((c, to.to_owned()));
        }
        if j.get("pad_with_spaces_for_short_inputs") != Some(&Json::Bool(false)) {
            return Err(missing(
                "pad_with_spaces_for_short_inputs (only false is supported)",
            ));
        }
        Ok(Meta {
            model: j
                .get("model")
                .and_then(Json::as_str)
                .unwrap_or_default()
                .to_owned(),
            layers: num("layers")? as usize,
            heads: num("heads")? as usize,
            head_dim: num("head_dim")? as usize,
            latent_dim: num("latent_dim")? as usize,
            dim: num("dim")? as usize,
            sample_rate: num("sample_rate")? as u32,
            frame_size: num("frame_size")? as usize,
            steps_per_frame: num("steps_per_frame")? as i64,
            temperature: num("temperature")? as f32,
            eos_threshold: num("eos_threshold")? as f32,
            min_frames_before_eos: num("min_frames_before_eos")? as usize,
            tokens_per_second: num("tokens_per_second")?,
            gen_seconds_padding: num("gen_seconds_padding")?,
            fade_in_samples: num("fade_in_samples")? as usize,
            pause_seconds: num("pause_seconds")?,
            pause_fade_seconds: num("pause_fade_seconds")?,
            pause_floor_db: num("pause_floor_db")? as f32,
            frames_after_eos: j
                .get("frames_after_eos")
                .and_then(Json::as_f64)
                .map(|n| n as usize),
            decoder_states: shapes("decoder_states")?,
            encoder_states: shapes("encoder_states")?,
            text: TextOptions {
                replace,
                remove_semicolons: flag("remove_semicolons")?,
                append_terminal_punctuation: flag("append_terminal_punctuation")?,
                capitalize_first_letter: flag("capitalize_first_letter")?,
                max_tokens: num("max_tokens_per_chunk")? as usize,
            },
        })
    }
}

/// A voice: the attention keys and values of every flow-LM layer after reading the voice
/// conditioning (`[1, heads, positions, head_dim]` each), as Kyutai's ready voices store them.
#[derive(Clone)]
pub struct VoiceState {
    keys: Vec<Vec<f32>>,
    values: Vec<Vec<f32>>,
    positions: usize,
}

impl VoiceState {
    /// Positions of the voice prompt (12.5 per second of recording, plus one).
    pub fn positions(&self) -> usize {
        self.positions
    }
}

/// One chunk of text as the model reads it.
#[derive(Debug, Clone, PartialEq)]
pub struct Chunk {
    pub prompt: String,
    pub frames_after_eos: usize,
}

/// What the model reads: the tokenizer and the official text preparation, without the graphs.
pub struct FrontEnd {
    tokenizer: Tokenizer,
    options: TextOptions,
    frames_after_eos: Option<usize>,
}

impl FrontEnd {
    /// Reads `tokenizer.json` and `pocket.json` from the model folder.
    pub fn load(dir: &Path) -> Result<FrontEnd, Error> {
        let meta = Meta::read(&dir.join("pocket.json"))?;
        Ok(FrontEnd {
            tokenizer: Tokenizer::load(&dir.join("tokenizer.json"))?,
            options: meta.text,
            frames_after_eos: meta.frames_after_eos,
        })
    }

    pub fn tokenizer(&self) -> &Tokenizer {
        &self.tokenizer
    }

    /// The chunks the model reads for `text`, with the official preparation.
    pub fn chunks(&self, text: &str) -> Vec<Chunk> {
        text::split(&self.tokenizer, text, &self.options)
            .into_iter()
            .filter_map(|c| {
                let (prompt, guess) = text::prepare(&c, &self.options)?;
                Some(Chunk {
                    prompt,
                    frames_after_eos: self.frames_after_eos.unwrap_or(guess + 2),
                })
            })
            .collect()
    }
}

/// What happened while speaking one chunk.
#[derive(Debug, Clone, Copy, Default)]
pub struct ChunkStats {
    pub frames: usize,
    /// The end of speech was detected (otherwise the frame limit was reached, or it was stopped).
    pub ended: bool,
    pub stopped: bool,
}

/// The loaded model: graphs, tokenizer and settings.
pub struct Pocket {
    meta: Meta,
    front: FrontEnd,
    flow: Session,
    decoder: Session,
    dir: PathBuf,
    env: Env,
    config: SessionConfig,
    options: PocketOptions,
    names: Names,
}

/// Input and output names of the graphs.
struct Names {
    past: Vec<CString>,
    present: Vec<CString>,
    dec_in: Vec<CString>,
    dec_out: Vec<CString>,
    enc_in: Vec<CString>,
    enc_out: Vec<CString>,
}

fn cnames(prefix: &str, n: usize) -> Vec<CString> {
    (0..n)
        .map(|i| CString::new(format!("{prefix}{i}")).expect("no NUL"))
        .collect()
}

impl Pocket {
    /// Loads `flow_lm.onnx`, `mimi_decoder.onnx`, `tokenizer.json` and `pocket.json` from `dir`.
    pub fn load(dir: &Path, options: &PocketOptions) -> Result<Pocket, Error> {
        let meta = Meta::read(&dir.join("pocket.json"))?;
        let front = FrontEnd::load(dir)?;
        let lib = options.ort_lib.clone().or_else(find_runtime);
        let env = Env::new(crate::ort::load(lib.as_deref())?)?;
        let config = SessionConfig {
            threads: options.threads,
        };
        let flow = env.session(&dir.join("flow_lm.onnx"), config)?;
        let decoder = env.session(&dir.join("mimi_decoder.onnx"), config)?;
        let mut past = Vec::new();
        let mut present = Vec::new();
        for i in 0..meta.layers {
            past.push(CString::new(format!("past_key_{i}")).expect("no NUL"));
            past.push(CString::new(format!("past_value_{i}")).expect("no NUL"));
            present.push(CString::new(format!("present_key_{i}")).expect("no NUL"));
            present.push(CString::new(format!("present_value_{i}")).expect("no NUL"));
        }
        let names = Names {
            past,
            present,
            dec_in: cnames("state_", meta.decoder_states.len()),
            dec_out: cnames("next_state_", meta.decoder_states.len()),
            enc_in: cnames("state_", meta.encoder_states.len()),
            enc_out: cnames("next_state_", meta.encoder_states.len()),
        };
        Ok(Pocket {
            meta,
            front,
            flow,
            decoder,
            dir: dir.to_path_buf(),
            env,
            config,
            options: options.clone(),
            names,
        })
    }

    pub fn sample_rate(&self) -> u32 {
        self.meta.sample_rate
    }

    pub fn runtime_version(&self) -> &str {
        self.env.api().version()
    }

    pub fn front_end(&self) -> &FrontEnd {
        &self.front
    }

    /// The model's revision, as written by the export.
    pub fn model_name(&self) -> &str {
        &self.meta.model
    }

    /// One flow-LM call. `past` grows by the tokens, voice frames and latents read.
    fn flow_step(
        &self,
        tokens: &[u32],
        voice: &[f32],
        latent: Option<&[f32]>,
        noise: &[f32],
        past: &mut VoiceState,
    ) -> Result<(Vec<f32>, f32), Error> {
        let m = &self.meta;
        let env = &self.env;
        let mut tok: Vec<i64> = tokens.iter().map(|&t| i64::from(t)).collect();
        let mut voice = voice.to_vec();
        let n_voice = voice.len() / m.dim;
        let mut lat = latent.map_or_else(Vec::new, <[f32]>::to_vec);
        let n_lat = lat.len() / m.latent_dim;
        let mut noise = noise.to_vec();
        let (h, d, p) = (m.heads as i64, m.head_dim as i64, past.positions as i64);
        let tok_t = Tensor::i64(env, &mut tok, &[1, tokens.len() as i64])?;
        let voice_t = Tensor::f32(env, &mut voice, &[1, n_voice as i64, m.dim as i64])?;
        let lat_t = Tensor::f32(env, &mut lat, &[1, n_lat as i64, m.latent_dim as i64])?;
        let noise_t = Tensor::f32(env, &mut noise, &[1, m.latent_dim as i64])?;
        let mut cache = Vec::with_capacity(2 * m.layers);
        for (k, v) in past.keys.iter_mut().zip(past.values.iter_mut()) {
            cache.push(Tensor::f32(env, k, &[1, h, p, d])?);
            cache.push(Tensor::f32(env, v, &[1, h, p, d])?);
        }
        let mut inputs: Vec<(&CStr, &Tensor)> = vec![
            (c"text_tokens", &tok_t),
            (c"voice", &voice_t),
            (c"latents", &lat_t),
            (c"noise", &noise_t),
        ];
        for (name, t) in self.names.past.iter().zip(&cache) {
            inputs.push((name.as_c_str(), t));
        }
        let mut outputs: Vec<&CStr> = vec![c"latent", c"eos_logit"];
        outputs.extend(self.names.present.iter().map(CString::as_c_str));
        let mut out = self.flow.run(&inputs, &outputs)?;
        drop(inputs);
        drop(cache);
        let presents = out.split_off(2);
        let eos = out[1].data.first().copied().unwrap_or(f32::NEG_INFINITY);
        let latent = std::mem::take(&mut out[0].data);
        let grown = (tokens.len() + n_voice + n_lat) as i64;
        for (i, o) in presents.into_iter().enumerate() {
            if o.shape != [1, h, p + grown, d] {
                return Err(Error::new(format!(
                    "flow_lm.onnx: unexpected cache shape {:?}",
                    o.shape
                )));
            }
            if i % 2 == 0 {
                past.keys[i / 2] = o.data;
            } else {
                past.values[i / 2] = o.data;
            }
        }
        past.positions += grown as usize;
        Ok((latent, eos))
    }

    fn empty_state(&self) -> VoiceState {
        VoiceState {
            keys: vec![Vec::new(); self.meta.layers],
            values: vec![Vec::new(); self.meta.layers],
            positions: 0,
        }
    }

    /// Prepares a voice from a recording (mono samples at `rate`): its first
    /// [`MAX_VOICE_SECONDS`], resampled to 24 kHz, ended on a pause, encoded in pieces (memory does
    /// not grow with the length), then read by the flow LM.
    pub fn prepare_voice(&self, samples: &[f32], rate: u32) -> Result<VoiceState, Error> {
        let m = &self.meta;
        let wav = audio::resample(samples, rate, m.sample_rate);
        let wav = first_seconds(&wav, m.sample_rate, MAX_VOICE_SECONDS);
        let mut wav = audio::end_on_pause(
            &wav,
            m.sample_rate,
            m.pause_seconds,
            m.pause_fade_seconds,
            m.pause_floor_db,
        );
        if wav.len() < m.frame_size {
            return Err(Error::new("the recording is too short"));
        }
        wav.resize(wav.len().div_ceil(m.frame_size) * m.frame_size, 0.0);
        let encoder = self
            .env
            .session(&self.dir.join("mimi_encoder.onnx"), self.config)?;
        let env = &self.env;
        let mut states: Vec<Vec<f32>> = m
            .encoder_states
            .iter()
            .map(|s| vec![0.0; s.iter().product::<i64>() as usize])
            .collect();
        let mut shapes = m.encoder_states.clone();
        let mut offset = 0i64;
        let mut voice: Vec<f32> = Vec::new();
        let piece = 10 * m.frame_size;
        for (i, chunk) in wav.chunks(piece).enumerate() {
            let mut a = chunk.to_vec();
            let mut off = [offset];
            let mut first = [if i == 0 { 1.0f32 } else { 0.0 }];
            let a_t = Tensor::f32(env, &mut a, &[1, 1, chunk.len() as i64])?;
            let off_t = Tensor::i64(env, &mut off, &[1])?;
            let first_t = Tensor::f32(env, &mut first, &[1])?;
            let state_t: Vec<Tensor> = states
                .iter_mut()
                .zip(&shapes)
                .map(|(s, shape)| Tensor::f32(env, s, shape))
                .collect::<Result<_, _>>()?;
            let mut inputs: Vec<(&CStr, &Tensor)> =
                vec![(c"audio", &a_t), (c"offset", &off_t), (c"first", &first_t)];
            for (name, t) in self.names.enc_in.iter().zip(&state_t) {
                inputs.push((name.as_c_str(), t));
            }
            let mut outputs: Vec<&CStr> = vec![c"voice", c"bos"];
            outputs.extend(self.names.enc_out.iter().map(CString::as_c_str));
            let out = encoder.run(&inputs, &outputs)?;
            drop(inputs);
            drop(state_t);
            let mut out = out.into_iter();
            let cond = out.next().expect("voice");
            let bos = out.next().expect("bos");
            if i == 0 {
                voice.extend_from_slice(&bos.data);
            }
            voice.extend_from_slice(&cond.data);
            for ((s, shape), o) in states.iter_mut().zip(shapes.iter_mut()).zip(out) {
                *shape = o.shape;
                *s = o.data;
            }
            offset += (chunk.len() / m.frame_size) as i64 * m.steps_per_frame;
        }
        drop(encoder);
        let mut state = self.empty_state();
        let noise = vec![0.0; m.latent_dim];
        self.flow_step(&[], &voice, None, &noise, &mut state)?;
        crate::release_memory();
        Ok(state)
    }

    /// Reads a voice saved by [`Pocket::save_voice`], or one of Kyutai's ready voices for this model.
    pub fn load_voice(&self, path: &Path) -> Result<VoiceState, Error> {
        let (tensors, metadata) = safetensors::read(path)?;
        let m = &self.meta;
        let mut state = self.empty_state();
        let mut positions = None;
        let bad = |what: String| Error::new(format!("{}: {what}", path.display()));
        // A voice is the model's own reading of the recording: one prepared with other weights
        // would make it speak badly. Kyutai's ready voices carry no model name.
        if let Some((_, model)) = metadata.iter().find(|(k, _)| k == "model")
            && *model != m.model
        {
            return Err(bad(format!(
                "this voice was prepared for {model}, not for {}: prepare it again from the recording",
                m.model
            )));
        }
        for i in 0..m.layers {
            let prefix = format!("transformer.layers.{i}.self_attn/");
            let find = |k: &str| tensors.iter().find(|t| t.name == format!("{prefix}{k}"));
            let cache = find("cache").ok_or_else(|| {
                bad(format!(
                    "no state for layer {i}: is it a voice for this model ({} layers)?",
                    m.layers
                ))
            })?;
            let n = match find("offset").map(|t| &t.data) {
                Some(safetensors::Data::I64(v)) if v.len() == 1 => v[0] as usize,
                _ => return Err(bad(format!("layer {i}: missing offset"))),
            };
            let safetensors::Data::F32(c) = &cache.data else {
                return Err(bad(format!("layer {i}: cache is not f32")));
            };
            // [2, 1, L, heads, head_dim] with the first `n` positions in use.
            let [2, 1, l, h, d] = cache.shape[..] else {
                return Err(bad(format!("layer {i}: cache shape {:?}", cache.shape)));
            };
            if h != m.heads || d != m.head_dim || n > l || positions.is_some_and(|p| p != n) {
                return Err(bad(format!(
                    "layer {i}: cache shape {:?} with {n} positions does not fit this model",
                    cache.shape
                )));
            }
            positions = Some(n);
            let mut k = vec![0.0; h * n * d];
            let mut v = vec![0.0; h * n * d];
            for p in 0..n {
                for hh in 0..h {
                    let src = (p * h + hh) * d;
                    let dst = (hh * n + p) * d;
                    k[dst..dst + d].copy_from_slice(&c[src..src + d]);
                    v[dst..dst + d].copy_from_slice(&c[l * h * d + src..l * h * d + src + d]);
                }
            }
            state.keys[i] = k;
            state.values[i] = v;
        }
        state.positions = positions.unwrap_or(0);
        if state.positions == 0 {
            return Err(bad("empty voice".into()));
        }
        Ok(state)
    }

    /// Saves a voice in the layout of Kyutai's voice states (`pocket-tts export-voice`), which the
    /// official code reads too.
    pub fn save_voice(&self, voice: &VoiceState, path: &Path) -> Result<(), Error> {
        let m = &self.meta;
        let (h, d, n) = (m.heads, m.head_dim, voice.positions);
        let mut tensors = Vec::new();
        for i in 0..m.layers {
            let mut c = vec![0.0f32; 2 * n * h * d];
            for p in 0..n {
                for hh in 0..h {
                    let src = (hh * n + p) * d;
                    let dst = (p * h + hh) * d;
                    c[dst..dst + d].copy_from_slice(&voice.keys[i][src..src + d]);
                    c[n * h * d + dst..n * h * d + dst + d]
                        .copy_from_slice(&voice.values[i][src..src + d]);
                }
            }
            let prefix = format!("transformer.layers.{i}.self_attn/");
            tensors.push(safetensors::Tensor {
                name: format!("{prefix}cache"),
                shape: vec![2, 1, n, h, d],
                data: safetensors::Data::F32(c),
            });
            tensors.push(safetensors::Tensor {
                name: format!("{prefix}offset"),
                shape: vec![1],
                data: safetensors::Data::I64(vec![n as i64]),
            });
            tensors.push(safetensors::Tensor {
                name: format!("{prefix}pad"),
                shape: vec![1],
                data: safetensors::Data::I64(vec![0]),
            });
        }
        safetensors::write(
            path,
            &tensors,
            &[("format", "pocket-tts voice state"), ("model", &m.model)],
        )
    }

    /// The chunks the model reads for `text`, with the official preparation.
    pub fn chunks(&self, text: &str) -> Vec<Chunk> {
        self.front.chunks(text)
    }

    /// Speaks one chunk in the voice, handing audio to `on_audio` as soon as it is decoded; it
    /// returns `false` to stop. `seed` fixes the sampling noise.
    pub fn speak_chunk(
        &self,
        voice: &VoiceState,
        chunk: &Chunk,
        seed: u32,
        on_audio: &mut dyn FnMut(&[f32]) -> bool,
    ) -> Result<ChunkStats, Error> {
        let m = &self.meta;
        let tokens = self.front.tokenizer.encode(&chunk.prompt);
        let max_frames = ((tokens.len() as f64 / m.tokens_per_second + m.gen_seconds_padding)
            * f64::from(m.sample_rate)
            / m.frame_size as f64)
            .ceil() as usize;
        let mut past = voice.clone();
        let zero = vec![0.0f32; m.latent_dim];
        self.flow_step(&tokens, &[], None, &zero, &mut past)?;
        let temperature = self.options.temperature.unwrap_or(m.temperature);
        let mut noise = noise::gaussian(m.latent_dim * max_frames, seed);
        let std = temperature.max(0.0).sqrt();
        noise.iter_mut().for_each(|x| *x *= std);
        let mut decoder = DecoderState::new(m);
        let mut latent = vec![f32::NAN; m.latent_dim];
        let mut queue: Vec<f32> = Vec::new();
        let mut eos_step = None;
        let mut stats = ChunkStats::default();
        let mut first = true;
        for step in 0..max_frames {
            let n = &noise[step * m.latent_dim..(step + 1) * m.latent_dim];
            let (next, eos) = self.flow_step(&[], &[], Some(&latent), n, &mut past)?;
            if eos > m.eos_threshold && eos_step.is_none() && step >= m.min_frames_before_eos {
                eos_step = Some(step);
            }
            if eos_step.is_some_and(|e| step >= e + chunk.frames_after_eos) {
                stats.ended = true;
                break;
            }
            queue.extend_from_slice(&next);
            stats.frames += 1;
            latent = next;
            let want = if first {
                1
            } else {
                self.options.decode_frames.max(1)
            };
            if queue.len() >= want * m.latent_dim {
                let mut audio = self.decode(&mut decoder, &queue)?;
                queue.clear();
                if first {
                    fade_in(&mut audio, m.fade_in_samples);
                    first = false;
                }
                if !on_audio(&audio) {
                    stats.stopped = true;
                    return Ok(stats);
                }
            }
        }
        if !queue.is_empty() {
            let mut audio = self.decode(&mut decoder, &queue)?;
            if first {
                fade_in(&mut audio, m.fade_in_samples);
            }
            if !on_audio(&audio) {
                stats.stopped = true;
            }
        }
        Ok(stats)
    }

    /// Speaks `text` in the voice, chunk by chunk, into one buffer.
    pub fn synthesize(&self, voice: &VoiceState, text: &str, seed: u32) -> Result<Vec<f32>, Error> {
        let mut audio = Vec::new();
        for (i, chunk) in self.chunks(text).iter().enumerate() {
            self.speak_chunk(voice, chunk, seed.wrapping_add(i as u32), &mut |a| {
                audio.extend_from_slice(a);
                true
            })?;
        }
        crate::release_memory();
        Ok(audio)
    }

    fn decode(&self, state: &mut DecoderState, latents: &[f32]) -> Result<Vec<f32>, Error> {
        let m = &self.meta;
        let env = &self.env;
        let frames = latents.len() / m.latent_dim;
        let mut lat = latents.to_vec();
        let mut off = [state.offset];
        let lat_t = Tensor::f32(env, &mut lat, &[1, frames as i64, m.latent_dim as i64])?;
        let off_t = Tensor::i64(env, &mut off, &[1])?;
        let state_t: Vec<Tensor> = state
            .data
            .iter_mut()
            .zip(&state.shapes)
            .map(|(s, shape)| Tensor::f32(env, s, shape))
            .collect::<Result<_, _>>()?;
        let mut inputs: Vec<(&CStr, &Tensor)> = vec![(c"latent", &lat_t), (c"offset", &off_t)];
        for (name, t) in self.names.dec_in.iter().zip(&state_t) {
            inputs.push((name.as_c_str(), t));
        }
        let mut outputs: Vec<&CStr> = vec![c"audio"];
        outputs.extend(self.names.dec_out.iter().map(CString::as_c_str));
        let out = self.decoder.run(&inputs, &outputs)?;
        drop(inputs);
        drop(state_t);
        let mut out = out.into_iter();
        let audio = out.next().expect("audio").data;
        for ((s, shape), o) in state.data.iter_mut().zip(state.shapes.iter_mut()).zip(out) {
            *shape = o.shape;
            *s = o.data;
        }
        state.offset += frames as i64 * m.steps_per_frame;
        Ok(audio)
    }
}

/// The decoder's streaming state for one chunk.
struct DecoderState {
    data: Vec<Vec<f32>>,
    shapes: Vec<Vec<i64>>,
    offset: i64,
}

impl DecoderState {
    fn new(m: &Meta) -> DecoderState {
        DecoderState {
            data: m
                .decoder_states
                .iter()
                .map(|s| vec![0.0; s.iter().product::<i64>() as usize])
                .collect(),
            shapes: m.decoder_states.clone(),
            offset: 0,
        }
    }
}

/// Sentences from Kalliope's normalizer (lower case) as one text for the model: each starts with a
/// capital letter, as in its training text; the model groups them into chunks of at most 50 tokens
/// itself, which reads more naturally than one sentence at a time and costs no delay.
pub fn join_sentences(sentences: &[String]) -> String {
    sentences
        .iter()
        .map(|s| {
            let mut c = s.chars();
            c.next()
                .map(|f| f.to_uppercase().chain(c).collect::<String>())
                .unwrap_or_default()
        })
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join(" ")
}

/// The official 5 ms fade-in at the start of every chunk: a fresh decoder state starts with a
/// small step, heard as a click.
fn fade_in(audio: &mut [f32], n: usize) {
    if n < 2 {
        return;
    }
    for (i, s) in audio.iter_mut().take(n).enumerate() {
        *s *= i as f32 / (n - 1) as f32;
    }
}

/// The first `seconds` of `wav`, cut at the quietest 20 ms inside the last 1.5 s so that the voice
/// does not stop in the middle of a word.
fn first_seconds(wav: &[f32], rate: u32, seconds: f32) -> Vec<f32> {
    let end = (seconds * rate as f32) as usize;
    if wav.len() <= end {
        return wav.to_vec();
    }
    let frame = (rate / 50) as usize;
    let start = end.saturating_sub((1.5 * rate as f32) as usize);
    let quietest = (start..end.saturating_sub(frame))
        .step_by(frame)
        .min_by(|&a, &b| {
            let e = |i: usize| wav[i..i + frame].iter().map(|s| s * s).sum::<f32>();
            e(a).total_cmp(&e(b))
        })
        .unwrap_or(end);
    wav[..quietest + frame / 2].to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_long_recording_is_cut_in_its_quietest_moment() {
        let rate = 1000;
        // 20 s of "speech" with one silent 20 ms frame at 11.2 s.
        let mut wav = vec![0.5f32; 20_000];
        wav[11_200..11_220].iter_mut().for_each(|s| *s = 0.0);
        let cut = first_seconds(&wav, rate, 12.0);
        assert_eq!(cut.len(), 11_210);
        assert_eq!(first_seconds(&wav[..5_000], rate, 12.0).len(), 5_000);
    }

    #[test]
    fn sentences_get_a_capital_letter() {
        let s = [
            "buongiorno a tutti!".to_string(),
            "è tardi.".into(),
            String::new(),
        ];
        assert_eq!(join_sentences(&s), "Buongiorno a tutti! È tardi.");
    }
}
