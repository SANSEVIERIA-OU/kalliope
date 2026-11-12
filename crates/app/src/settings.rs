// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! A few preferences, stored as `key=value` lines.

use std::path::PathBuf;

pub struct Settings {
    pub voice: String,
    pub monitor: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            voice: "Giulia".into(),
            monitor: true,
        }
    }
}

fn file() -> PathBuf {
    crate::paths::config_dir().join("settings.conf")
}

impl Settings {
    pub fn load() -> Settings {
        let mut s = Settings::default();
        if let Ok(text) = std::fs::read_to_string(file()) {
            for line in text.lines() {
                match line.split_once('=') {
                    Some(("voice", v)) if !v.trim().is_empty() => s.voice = v.trim().to_string(),
                    Some(("monitor", v)) => s.monitor = v.trim() != "false",
                    _ => {}
                }
            }
        }
        s
    }

    pub fn save(&self) {
        let path = file();
        if let Some(dir) = path.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(
            path,
            format!("voice={}\nmonitor={}\n", self.voice, self.monitor),
        );
    }
}
