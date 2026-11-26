// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! A few preferences, stored as `key=value` lines. Each change rewrites only its own key, so the
//! window (monitor) and the speaking thread (the voice, once it has loaded) never undo each other.

use crate::engine::VoiceId;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

pub struct Settings {
    pub voice: VoiceId,
    pub monitor: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            voice: VoiceId::default(),
            monitor: true,
        }
    }
}

/// One writer at a time.
static WRITING: Mutex<()> = Mutex::new(());

fn file() -> PathBuf {
    crate::paths::config_dir().join("settings.conf")
}

impl Settings {
    pub fn load() -> Settings {
        Settings::read(&file())
    }

    fn read(path: &Path) -> Settings {
        let mut s = Settings::default();
        if let Ok(text) = std::fs::read_to_string(path) {
            for line in text.lines() {
                match line.split_once('=') {
                    Some(("voice", v)) => {
                        if let Some(voice) = VoiceId::parse(v) {
                            s.voice = voice;
                        }
                    }
                    Some(("monitor", v)) => s.monitor = v.trim() != "false",
                    _ => {}
                }
            }
        }
        s
    }

    fn write(&self, path: &Path) {
        if let Some(dir) = path.parent() {
            let _ = std::fs::create_dir_all(dir);
        }
        let _ = std::fs::write(
            path,
            format!("voice={}\nmonitor={}\n", self.voice.key(), self.monitor),
        );
    }
}

fn update_at(path: &Path, change: impl FnOnce(&mut Settings)) {
    let _one = WRITING.lock().unwrap_or_else(|e| e.into_inner());
    let mut s = Settings::read(path);
    change(&mut s);
    s.write(path);
}

/// Remembers the voice: called only once it has loaded.
pub fn save_voice(voice: &VoiceId) {
    update_at(&file(), |s| s.voice = voice.clone());
}

pub fn save_monitor(on: bool) {
    update_at(&file(), |s| s.monitor = on);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn each_change_keeps_the_other_settings() {
        let dir = std::env::temp_dir().join(format!("kalliope-settings-{}", std::process::id()));
        let path = dir.join("settings.conf");
        let own = VoiceId::Own("Marco".into());
        update_at(&path, |s| s.monitor = false);
        update_at(&path, |s| s.voice = own.clone());
        let s = Settings::read(&path);
        assert_eq!(s.voice, own);
        assert!(!s.monitor);
        assert_eq!(
            std::fs::read_to_string(&path).unwrap(),
            "voice=Marco.safetensors\nmonitor=false\n"
        );
        std::fs::write(&path, "voice=Anna\nmonitor=true\n").unwrap();
        assert_eq!(Settings::read(&path).voice, VoiceId::Own("Anna".into()));
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
