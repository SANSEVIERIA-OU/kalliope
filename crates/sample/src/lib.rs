// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The recording a personal voice is made from, shared by the app and `kalliope-cli voice`:
//! reading audio files ([`read_file`]), measuring them and finding their clearest stretch
//! ([`Sample`]), and preparing and saving the voice ([`prepare_voice`]).

pub mod analysis;
mod decode;
mod opus;
pub mod wav;

pub use analysis::{
    GOOD_SPEECH_SECONDS, MIN_SPEECH_SECONDS, Problem, Quality, Stretch, VOICE_SECONDS,
};
pub use decode::{Audio, MAX_SECONDS, OpenReason, ReadError, read_file};

use analysis::Analysis;
use kalliope_i18n::tr;
use kalliope_voice::pocket::{Pocket, PocketOptions};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};

/// The rate of the model: recordings are measured, cut and turned into voices at it.
pub const RATE: u32 = 24_000;
/// Candidate stretches offered for a person to choose and listen to.
pub const CANDIDATES: usize = 3;

/// The version of libopus that reads Opus files, if this computer has it.
pub fn opus_version() -> Option<String> {
    opus::version()
}

/// A recording ready to make a voice from: at [`RATE`], with its measures and its clearest
/// stretches.
#[derive(Debug, Clone)]
pub struct Sample {
    pub samples: Vec<f32>,
    /// The whole recording.
    pub quality: Quality,
    /// What is wrong with the whole recording; [`Problem::blocks`] says whether a voice can be made.
    pub problems: Vec<Problem>,
    /// At most [`CANDIDATES`] stretches of at most [`VOICE_SECONDS`], the clearest first.
    pub stretches: Vec<Stretch>,
    /// Only the start of a long file was read ([`MAX_SECONDS`]).
    pub truncated: bool,
}

impl Sample {
    pub fn new(audio: &Audio) -> Sample {
        let samples = kalliope_voice::pocket::resample(&audio.samples, audio.rate, RATE);
        let analysis = Analysis::new(&samples, RATE);
        let quality = analysis.overall();
        let mut problems = quality.problems();
        let stretches = analysis.stretches(CANDIDATES);
        // The whole recording is judged by its best stretch for distortion, level and noise:
        // a noisy minute does not spoil the clean twelve seconds that will be used.
        if let Some(best) = stretches.first() {
            problems.retain(|p| p.blocks() || best.problems.contains(p));
        }
        Sample {
            samples,
            quality,
            problems,
            stretches,
            truncated: audio.truncated,
        }
    }

    /// The samples of stretch `i`.
    pub fn stretch(&self, i: usize) -> &[f32] {
        let Some(s) = self.stretches.get(i) else {
            return &[];
        };
        let at = |t: f32| ((t * RATE as f32) as usize).min(self.samples.len());
        &self.samples[at(s.start)..at(s.end)]
    }

    /// Whether a voice can be made from stretch `i`.
    pub fn usable(&self, i: usize) -> bool {
        self.stretches
            .get(i)
            .is_some_and(|s| !s.problems.iter().any(|p| p.blocks()))
    }
}

/// Where the model is and how to run it.
#[derive(Debug, Clone)]
pub struct Model {
    pub pocket_dir: PathBuf,
    pub options: PocketOptions,
}

/// Why a voice was not made.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PrepareError {
    Cancelled,
    /// The model failed or the file could not be written: the details, for developers.
    Failed(String),
}

impl PrepareError {
    pub fn message(&self) -> String {
        match self {
            PrepareError::Cancelled => {
                tr!("programma.voce.creazione-annullata" => "Creazione della voce annullata.")
            }
            // TRANSLATORS: {causa} is the system's own message, in English: it stays as it is
            PrepareError::Failed(e) => {
                tr!("programma.voce.creazione-fallita" => "Non sono riuscita a creare la voce: {causa}", causa = e)
            }
        }
    }
}

/// Makes a voice from `samples` (mono at [`RATE`], best a stretch of [`Sample`]) and saves it as
/// `out` in one step: written beside it, then renamed, so a voice file is never half written and
/// an existing one is replaced only by a complete new one. `progress` gets 0 to 1; `cancel` stops
/// it between steps (the model's own steps take about a second).
pub fn prepare_voice(
    model: &Model,
    samples: &[f32],
    out: &Path,
    cancel: &AtomicBool,
    progress: &mut dyn FnMut(f32),
) -> Result<(), PrepareError> {
    let stop = || {
        if cancel.load(Ordering::Relaxed) {
            Err(PrepareError::Cancelled)
        } else {
            Ok(())
        }
    };
    let failed = |e: &dyn std::fmt::Display| PrepareError::Failed(e.to_string());
    progress(0.0);
    stop()?;
    let pocket = Pocket::load(&model.pocket_dir, &model.options).map_err(|e| failed(&e))?;
    progress(0.35);
    stop()?;
    let voice = pocket
        .prepare_voice(samples, RATE)
        .map_err(|e| failed(&e))?;
    progress(0.85);
    stop()?;
    let dir = out
        .parent()
        .filter(|d| !d.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    std::fs::create_dir_all(dir).map_err(|e| failed(&e))?;
    let name = out
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_default();
    let part = dir.join(format!(".{name}.{}.part", std::process::id()));
    let saved = pocket
        .save_voice(&voice, &part)
        .map_err(|e| failed(&e))
        .and_then(|()| {
            std::fs::File::open(&part)
                .and_then(|f| f.sync_all())
                .map_err(|e| failed(&e))
        })
        .and_then(|()| stop())
        .and_then(|()| std::fs::rename(&part, out).map_err(|e| failed(&e)));
    if saved.is_err() {
        let _ = std::fs::remove_file(&part);
    }
    saved?;
    progress(1.0);
    Ok(())
}
