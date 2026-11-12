// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! The voice model Kalliope downloads at first start, pinned to one revision and fingerprint.

use std::path::PathBuf;

pub struct ModelFile {
    pub name: &'static str,
    pub url: &'static str,
    pub sha256: &'static str,
    pub size: u64,
}

macro_rules! model_url {
    ($name:literal) => {
        concat!("https://huggingface.co/klein-ml/Klein-TTS-X1.5-Pro/resolve/25e0e73bebba71e5985bc369628ebdcb81bf7116/onnx/", $name)
    };
}

/// Klein-TTS-X1.5-Pro (Apache-2.0), revision 25e0e73 of 2026-11.
pub const MODEL_FILES: [ModelFile; 3] = [
    ModelFile {
        name: "model.json",
        url: model_url!("model.json"),
        sha256: "e549b783b7650781c418f2f3c73a68e45181cea9513d1c72bd5b05b0c383a354",
        size: 92_161,
    },
    ModelFile {
        name: "encoder.onnx",
        url: model_url!("encoder.onnx"),
        sha256: "0abf547af7f8663c12134900a845087f0d220d70b4744b3a383c7a909fc4c4a6",
        size: 29_050_275,
    },
    ModelFile {
        name: "decoder.onnx",
        url: model_url!("decoder.onnx"),
        sha256: "8bcaace5e03ed273b987e5e319014fcffb08597f229e0eb11487bd24ed593918",
        size: 23_832_110,
    },
];

pub fn total_size() -> u64 {
    MODEL_FILES.iter().map(|f| f.size).sum()
}

/// The model folder: `KALLIOPE_MODEL_DIR`, or the downloaded copy.
pub fn model_dir() -> PathBuf {
    std::env::var_os("KALLIOPE_MODEL_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| {
            crate::paths::data_dir()
                .join("models")
                .join("klein-tts-x1.5-pro")
        })
}

/// Whether every model file is present with its expected size (fingerprints are checked when
/// downloading; reading 53 MB at every start would cost time and energy).
pub fn installed() -> bool {
    let dir = model_dir();
    if std::env::var_os("KALLIOPE_MODEL_DIR").is_some() {
        return dir.join("model.json").is_file();
    }
    MODEL_FILES
        .iter()
        .all(|f| std::fs::metadata(dir.join(f.name)).is_ok_and(|m| m.len() == f.size))
}

#[cfg(test)]
mod tests {
    #[test]
    fn urls_match_names() {
        for f in super::MODEL_FILES {
            assert!(
                f.url.starts_with("https://huggingface.co/") && f.url.ends_with(f.name),
                "{}",
                f.url
            );
        }
    }
}
