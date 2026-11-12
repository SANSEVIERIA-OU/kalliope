// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Downloads the voice model with the system's `curl` (present on current Linux, macOS and
//! Windows 10+), shows progress from the growing file, and keeps nothing whose fingerprint does
//! not match.

use crate::catalog::{MODEL_FILES, total_size};
use crate::sha256;
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

/// Downloads every missing model file into `dir`. `progress(done, total)` is called often.
pub fn model(dir: &Path, cancel: &AtomicBool, progress: &dyn Fn(u64, u64)) -> Result<(), String> {
    std::fs::create_dir_all(dir)
        .map_err(|e| format!("Non riesco a creare {}: {e}", dir.display()))?;
    let total = total_size();
    let mut done = 0;
    for f in &MODEL_FILES {
        let target = dir.join(f.name);
        if std::fs::metadata(&target).is_ok_and(|m| m.len() == f.size)
            && sha256::file(&target).is_ok_and(|h| h == f.sha256)
        {
            done += f.size;
            progress(done, total);
            continue;
        }
        let part = dir.join(format!("{}.part", f.name));
        let _ = std::fs::remove_file(&part);
        let mut child = Command::new("curl")
            .args([
                "--fail",
                "--location",
                "--silent",
                "--show-error",
                "--retry",
                "3",
                "--output",
            ])
            .arg(&part)
            .arg(f.url)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Per scaricare la voce serve il programma curl: {e}"))?;
        loop {
            if cancel.load(Ordering::Relaxed) {
                let _ = child.kill();
                let _ = child.wait();
                let _ = std::fs::remove_file(&part);
                return Err("Download annullato.".into());
            }
            let got = std::fs::metadata(&part).map(|m| m.len()).unwrap_or(0);
            progress(done + got.min(f.size), total);
            match child.try_wait() {
                Ok(Some(status)) if status.success() => break,
                Ok(Some(_)) => {
                    let mut err = String::new();
                    if let Some(mut e) = child.stderr.take() {
                        use std::io::Read;
                        let _ = e.read_to_string(&mut err);
                    }
                    let _ = std::fs::remove_file(&part);
                    return Err(format!("Download non riuscito: {}", err.trim()));
                }
                Ok(None) => std::thread::sleep(Duration::from_millis(150)),
                Err(e) => return Err(format!("Download non riuscito: {e}")),
            }
        }
        let hash = sha256::file(&part).map_err(|e| e.to_string())?;
        if hash != f.sha256 {
            let _ = std::fs::remove_file(&part);
            return Err(format!(
                "Il file {} scaricato non corrisponde all'impronta attesa: l'ho scartato.",
                f.name
            ));
        }
        std::fs::rename(&part, &target).map_err(|e| e.to_string())?;
        done += f.size;
        progress(done, total);
    }
    Ok(())
}
