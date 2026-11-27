// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! A few preferences, stored as `key=value` lines. Each change rewrites only its own key, so the
//! window (monitor) and the speaking thread (the voice, once it has loaded) never undo each other.

use crate::engine::VoiceId;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

pub struct Settings {
    pub voice: VoiceId,
    pub monitor: bool,
    /// How large the text is: 1 is the design's size.
    pub text_scale: f32,
    /// The compact meeting mode.
    pub compact: bool,
    /// The hint about keeping the meeting window above the others was read («Ho capito»): it is shown once.
    pub hint_seen: bool,
    /// Where the window was when Kalliope last ended: its top left corner, frame included, in physical pixels of the
    /// desktop. It comes back only on a monitor still connected (schermo.rs); under Wayland there is none.
    pub position: Option<(i32, i32)>,
}

/// The text can be made this much smaller or larger.
pub const TEXT_SCALE: std::ops::RangeInclusive<f32> = 0.75..=3.0;

impl Default for Settings {
    fn default() -> Self {
        Settings {
            voice: VoiceId::default(),
            monitor: true,
            text_scale: 1.0,
            compact: false,
            hint_seen: false,
            position: None,
        }
    }
}

/// `X,Y`, two whole numbers (negative on a monitor left of or above the main one).
fn position(v: &str) -> Option<(i32, i32)> {
    let (x, y) = v.trim().split_once(',')?;
    Some((x.trim().parse().ok()?, y.trim().parse().ok()?))
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
                    Some(("text_scale", v)) => {
                        if let Ok(scale) = v.trim().parse::<f32>()
                            && scale.is_finite()
                        {
                            s.text_scale = scale.clamp(*TEXT_SCALE.start(), *TEXT_SCALE.end());
                        }
                    }
                    Some(("compact", v)) => s.compact = v.trim() == "true",
                    Some(("hint_seen", v)) => s.hint_seen = v.trim() == "true",
                    Some(("position", v)) => s.position = position(v),
                    _ => {}
                }
            }
        }
        s
    }

    fn write(&self, path: &Path) {
        let mut text = format!(
            "voice={}\nmonitor={}\ntext_scale={}\ncompact={}\nhint_seen={}\n",
            self.voice.key(),
            self.monitor,
            self.text_scale,
            self.compact,
            self.hint_seen
        );
        if let Some((x, y)) = self.position {
            text.push_str(&format!("position={x},{y}\n"));
        }
        if let Err(e) = crate::paths::write_atomic(path, text.as_bytes()) {
            eprintln!(
                "kalliope: cannot save the settings in {}: {e}",
                path.display()
            );
        }
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

pub fn save_text_scale(scale: f32) {
    update_at(&file(), |s| s.text_scale = scale);
}

pub fn save_compact(on: bool) {
    update_at(&file(), |s| s.compact = on);
}

/// The hint about keeping the meeting window above the others was read: it is not shown again.
pub fn save_hint_seen() {
    update_at(&file(), |s| s.hint_seen = true);
}

/// Remembers where the window was, when Kalliope ends.
pub fn save_position(position: (i32, i32)) {
    update_at(&file(), |s| s.position = Some(position));
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
            "voice=Marco.safetensors\nmonitor=false\ntext_scale=1\ncompact=false\nhint_seen=false\n"
        );
        update_at(&path, |s| s.text_scale = 1.5);
        update_at(&path, |s| s.compact = true);
        update_at(&path, |s| s.hint_seen = true);
        let s = Settings::read(&path);
        assert_eq!((s.text_scale, s.compact, s.monitor), (1.5, true, false));
        assert!(s.hint_seen, "the hint read once is remembered");
        // and the other keys survive its being written
        update_at(&path, |s| s.monitor = true);
        assert!(Settings::read(&path).hint_seen);
        // A value out of range or not a number is brought back to what the window can show.
        std::fs::write(&path, "text_scale=40\ncompact=yes\n").unwrap();
        let s = Settings::read(&path);
        assert_eq!((s.text_scale, s.compact), (3.0, false));
        std::fs::write(&path, "text_scale=NaN\n").unwrap();
        assert_eq!(Settings::read(&path).text_scale, 1.0);
        std::fs::write(&path, "voice=Anna\nmonitor=true\n").unwrap();
        assert_eq!(Settings::read(&path).voice, VoiceId::Own("Anna".into()));
        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    fn the_window_position_is_remembered_with_the_other_settings() {
        let dir = std::env::temp_dir().join(format!("kalliope-position-{}", std::process::id()));
        let path = dir.join("settings.conf");
        assert_eq!(
            Settings::read(&path).position,
            None,
            "none before the first end"
        );
        update_at(&path, |s| s.monitor = false);
        update_at(&path, |s| s.position = Some((-1440, 120)));
        let s = Settings::read(&path);
        assert_eq!(
            s.position,
            Some((-1440, 120)),
            "a monitor left of the main one"
        );
        assert!(!s.monitor, "the other keys survive it");
        update_at(&path, |s| s.text_scale = 2.0);
        assert_eq!(Settings::read(&path).position, Some((-1440, 120)));
        assert!(
            std::fs::read_to_string(&path)
                .unwrap()
                .ends_with("position=-1440,120\n")
        );
        for broken in [
            "position=12\n",
            "position=a,b\n",
            "position=1,2,3\n",
            "position=\n",
        ] {
            std::fs::write(&path, broken).unwrap();
            assert_eq!(Settings::read(&path).position, None, "{broken:?}");
        }
        std::fs::write(&path, "position= 30 , 40 \n").unwrap();
        assert_eq!(Settings::read(&path).position, Some((30, 40)));
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
