// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Where the voice models are: they come with Kalliope, in `share/kalliope/` next to the program
//! (tools/assets.json pins the files the packages put there). Nothing is downloaded.

use std::path::{Path, PathBuf};

use kalliope_voice::{KLEIN_FOLDER, POCKET_FOLDER};

/// The files of the Klein model (Giulia and Marco).
const KLEIN_FILES: [&str; 3] = ["encoder.onnx", "decoder.onnx", "model.json"];

/// `share/kalliope/NAME` next to the program; just NAME if the program cannot tell where it is.
fn next_to_program(name: &str) -> PathBuf {
    kalliope_voice::models_next_to_program()
        .map(|dir| dir.join(name))
        .unwrap_or_else(|| PathBuf::from(name))
}

/// The Klein model: `KALLIOPE_MODEL_DIR`, or the copy that comes with Kalliope.
pub fn model_dir() -> PathBuf {
    std::env::var_os("KALLIOPE_MODEL_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| next_to_program(KLEIN_FOLDER))
}

/// The files of the Klein model missing from `dir`.
fn missing_in(dir: &Path) -> Vec<&'static str> {
    KLEIN_FILES
        .into_iter()
        .filter(|f| !dir.join(f).is_file())
        .collect()
}

/// Why Kalliope cannot speak, when files of the voice are missing (a broken installation, or a
/// build without the models); `None` when they are all there.
pub fn missing_voice() -> Option<String> {
    let dir = model_dir();
    let missing = missing_in(&dir);
    (!missing.is_empty()).then(|| {
        format!(
            "Manca la voce: in {} non trovo {}. Reinstalla Kalliope.",
            dir.display(),
            missing.join(", ")
        )
    })
}

/// The Pocket TTS model that speaks with the voices prepared from a recording:
/// `KALLIOPE_POCKET_DIR`, or the copy that comes with Kalliope.
pub fn pocket_dir() -> PathBuf {
    std::env::var_os("KALLIOPE_POCKET_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| next_to_program(POCKET_FOLDER))
}

/// The voices prepared from a recording (`kalliope-cli voice … -o NAME.safetensors`):
/// `KALLIOPE_VOICES_DIR`, or `voices` in the data folder.
pub fn voices_dir() -> PathBuf {
    std::env::var_os("KALLIOPE_VOICES_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| crate::paths::data_dir().join("voices"))
}

/// Names of the prepared voices, sorted; none when the Pocket TTS model is missing.
pub fn own_voices() -> Vec<String> {
    if !pocket_dir().join("pocket.json").is_file() {
        return Vec::new();
    }
    voice_files(&voices_dir())
}

/// Names of the voice files in `dir` (`NAME.safetensors`), sorted.
pub fn voice_files(dir: &Path) -> Vec<String> {
    let mut names: Vec<String> = std::fs::read_dir(dir)
        .into_iter()
        .flatten()
        .filter_map(|e| {
            let path = e.ok()?.path();
            (path.extension()? == "safetensors")
                .then(|| path.file_stem()?.to_str().map(str::to_owned))?
        })
        .collect();
    names.sort();
    names
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn names_the_missing_files_of_the_voice() {
        let dir = std::env::temp_dir().join(format!("kalliope-catalog-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        assert_eq!(
            missing_in(&dir),
            ["encoder.onnx", "decoder.onnx", "model.json"]
        );
        std::fs::write(dir.join("model.json"), "{}").unwrap();
        std::fs::write(dir.join("encoder.onnx"), "").unwrap();
        assert_eq!(missing_in(&dir), ["decoder.onnx"]);
        std::fs::write(dir.join("decoder.onnx"), "").unwrap();
        assert!(missing_in(&dir).is_empty());
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
