// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Where Kalliope keeps downloaded models and settings on each system.

use std::env;
use std::path::PathBuf;

fn home() -> PathBuf {
    env::var_os("HOME")
        .or_else(|| env::var_os("USERPROFILE"))
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("."))
}

fn xdg(var: &str, fallback: &str) -> PathBuf {
    env::var_os(var)
        .map(PathBuf::from)
        .filter(|p| p.is_absolute())
        .unwrap_or_else(|| home().join(fallback))
}

/// Models and other downloaded data.
pub fn data_dir() -> PathBuf {
    if cfg!(target_os = "windows") {
        env::var_os("LOCALAPPDATA")
            .map(PathBuf::from)
            .unwrap_or_else(home)
            .join("Kalliope")
    } else if cfg!(target_os = "macos") {
        home().join("Library/Application Support/Kalliope")
    } else {
        xdg("XDG_DATA_HOME", ".local/share").join("kalliope")
    }
}

/// Settings.
pub fn config_dir() -> PathBuf {
    if cfg!(target_os = "windows") {
        env::var_os("APPDATA")
            .map(PathBuf::from)
            .unwrap_or_else(home)
            .join("Kalliope")
    } else if cfg!(target_os = "macos") {
        home().join("Library/Application Support/Kalliope")
    } else {
        xdg("XDG_CONFIG_HOME", ".config").join("kalliope")
    }
}

/// Writes `bytes` to `path` in one step: into a file beside it, flushed to the disk, then renamed
/// over it. A crash or a full disk leaves the old file or the new one, never half of one.
pub fn write_atomic(path: &std::path::Path, bytes: &[u8]) -> std::io::Result<()> {
    use std::io::Write;
    let dir = path
        .parent()
        .filter(|d| !d.as_os_str().is_empty())
        .unwrap_or(std::path::Path::new("."));
    std::fs::create_dir_all(dir)?;
    let name = path.file_name().unwrap_or_default().to_string_lossy();
    let part = dir.join(format!(".{name}.{}.part", std::process::id()));
    let written = std::fs::File::create(&part).and_then(|mut f| {
        f.write_all(bytes)?;
        f.sync_all()
    });
    let done = written.and_then(|()| std::fs::rename(&part, path));
    if done.is_err() {
        let _ = std::fs::remove_file(&part);
    }
    done
}
