// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
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
