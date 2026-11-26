// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The phrases said, kept across restarts in the data folder of this computer only: newest first,
//! at most [`crate::HISTORY`], each once.
//!
//! A text file, one phrase per line under a header line, with `\` escaping line breaks and itself.
//! Each save rewrites it atomically. A file that cannot be read as such (damaged, or written by
//! something else) is set aside as `history.txt.broken` and Kalliope starts with an empty history.

use std::path::{Path, PathBuf};

const HEADER: &str = "kalliope-history 1";
/// A history file larger than this is not a history: 30 phrases fit in a few kilobytes.
const MAX_BYTES: u64 = 4 << 20;

/// Where the history is kept.
pub fn file() -> PathBuf {
    crate::paths::data_dir().join("history.txt")
}

/// The saved phrases; empty when there are none, and when the file is damaged (it is set aside,
/// and standard error says so).
pub fn load(path: &Path) -> Vec<String> {
    let text = match std::fs::metadata(path) {
        Err(_) => return Vec::new(),
        Ok(m) if m.len() > MAX_BYTES => Err(format!("{} bytes", m.len())),
        Ok(_) => std::fs::read_to_string(path).map_err(|e| e.to_string()),
    };
    match text.and_then(|t| decode(&t)) {
        Ok(mut items) => {
            tidy(&mut items);
            items
        }
        Err(e) => {
            let broken = path.with_extension("txt.broken");
            let kept = std::fs::rename(path, &broken).is_ok();
            eprintln!(
                "kalliope: the phrase history in {} cannot be read ({e}); starting with an empty one{}",
                path.display(),
                if kept {
                    format!(", the old file is kept as {}", broken.display())
                } else {
                    String::new()
                }
            );
            Vec::new()
        }
    }
}

/// Saves `items` atomically; a failure goes to standard error (the phrases stay in the window).
pub fn save(path: &Path, items: &[String]) {
    if let Err(e) = crate::paths::write_atomic(path, encode(items).as_bytes()) {
        eprintln!(
            "kalliope: cannot save the phrase history in {}: {e}",
            path.display()
        );
    }
}

/// Puts `text` first, once, and keeps the newest [`crate::HISTORY`].
pub fn add(items: &mut Vec<String>, text: &str) {
    items.retain(|entry| entry != text);
    items.insert(0, text.into());
    items.truncate(crate::HISTORY);
}

fn tidy(items: &mut Vec<String>) {
    let mut seen = std::collections::HashSet::new();
    items.retain(|i| !i.trim().is_empty() && seen.insert(i.clone()));
    items.truncate(crate::HISTORY);
}

fn encode(items: &[String]) -> String {
    let mut out = format!("{HEADER}\n");
    for item in items {
        for c in item.chars() {
            match c {
                '\\' => out.push_str("\\\\"),
                '\n' => out.push_str("\\n"),
                '\r' => out.push_str("\\r"),
                c => out.push(c),
            }
        }
        out.push('\n');
    }
    out
}

fn decode(text: &str) -> Result<Vec<String>, String> {
    let mut lines = text.lines();
    if lines.next() != Some(HEADER) {
        return Err("no Kalliope header".into());
    }
    lines
        .filter(|l| !l.is_empty())
        .map(|line| {
            let mut out = String::with_capacity(line.len());
            let mut chars = line.chars();
            while let Some(c) = chars.next() {
                if c != '\\' {
                    out.push(c);
                    continue;
                }
                match chars.next() {
                    Some('\\') => out.push('\\'),
                    Some('n') => out.push('\n'),
                    Some('r') => out.push('\r'),
                    other => return Err(format!("bad escape \\{}", other.unwrap_or(' '))),
                }
            }
            Ok(out)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn dir(name: &str) -> PathBuf {
        let d =
            std::env::temp_dir().join(format!("kalliope-history-{name}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&d);
        std::fs::create_dir_all(&d).unwrap();
        d
    }

    #[test]
    fn phrases_survive_a_restart_newest_first_and_once() {
        let path = dir("restart").join("history.txt");
        assert!(load(&path).is_empty());
        let mut items = Vec::new();
        for text in ["Buongiorno", "Righe\ndue", "C:\\percorso", "Buongiorno"] {
            add(&mut items, text);
            save(&path, &items);
        }
        assert_eq!(load(&path), ["Buongiorno", "C:\\percorso", "Righe\ndue"]);
        for i in 0..40 {
            add(&mut items, &format!("frase {i}"));
        }
        save(&path, &items);
        let loaded = load(&path);
        assert_eq!(loaded.len(), crate::HISTORY);
        assert_eq!(loaded[0], "frase 39");
        save(&path, &[]);
        assert!(load(&path).is_empty());
    }

    #[test]
    fn a_damaged_file_gives_an_empty_history_and_is_kept_aside() {
        let d = dir("broken");
        let path = d.join("history.txt");
        for bad in [
            &b"\xff\xfe\x00garbage"[..],
            b"not a history\nciao\n",
            b"kalliope-history 1\nrotta\\q\n",
        ] {
            std::fs::write(&path, bad).unwrap();
            assert!(load(&path).is_empty());
            assert!(!path.exists());
            assert_eq!(std::fs::read(d.join("history.txt.broken")).unwrap(), bad);
        }
        // Saving afterwards works as usual.
        save(&path, &["dopo".to_string()]);
        assert_eq!(load(&path), ["dopo"]);
    }

    #[test]
    fn duplicates_and_blank_lines_in_the_file_are_tidied() {
        let path = dir("tidy").join("history.txt");
        std::fs::write(&path, "kalliope-history 1\nuno\n\n  \nuno\ndue\n").unwrap();
        assert_eq!(load(&path), ["uno", "due"]);
    }
}
