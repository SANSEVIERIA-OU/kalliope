// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Finds the ONNX Runtime library that ships with Kalliope's packages.

use std::path::{Path, PathBuf};

fn matches(name: &str) -> bool {
    if cfg!(target_os = "windows") {
        name.eq_ignore_ascii_case("onnxruntime.dll")
    } else if cfg!(target_os = "macos") {
        name.starts_with("libonnxruntime") && name.ends_with(".dylib")
    } else {
        name.starts_with("libonnxruntime.so")
    }
}

fn find_in(dir: &Path) -> Option<PathBuf> {
    let mut found: Vec<PathBuf> = std::fs::read_dir(dir)
        .ok()?
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| p.file_name().and_then(|n| n.to_str()).is_some_and(matches))
        .collect();
    found.sort();
    found.into_iter().next()
}

/// `KALLIOPE_ORT_LIB`, then next to the program (`../lib/kalliope`, `../lib`, the program's
/// folder); `None` lets the system's library search decide.
pub fn onnxruntime() -> Option<PathBuf> {
    if let Some(p) = std::env::var_os("KALLIOPE_ORT_LIB") {
        return Some(PathBuf::from(p));
    }
    let exe = std::env::current_exe().ok()?;
    let bin = exe.parent()?;
    [
        bin.join("../lib/kalliope"),
        bin.join("../lib"),
        bin.to_path_buf(),
    ]
    .iter()
    .find_map(|d| find_in(d))
}
