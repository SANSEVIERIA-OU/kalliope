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
/// over it. A crash or a full disk leaves the old file or the new one, never half of one. Only its
/// owner can read it: phrases said and settings are nobody else's business.
pub fn write_atomic(path: &std::path::Path, bytes: &[u8]) -> std::io::Result<()> {
    use std::io::Write;
    let dir = path
        .parent()
        .filter(|d| !d.as_os_str().is_empty())
        .unwrap_or(std::path::Path::new("."));
    std::fs::create_dir_all(dir)?;
    let name = path.file_name().unwrap_or_default().to_string_lossy();
    let part = dir.join(format!(".{name}.{}.part", std::process::id()));
    let mut options = std::fs::OpenOptions::new();
    options.write(true).create(true).truncate(true);
    #[cfg(unix)]
    std::os::unix::fs::OpenOptionsExt::mode(&mut options, 0o600);
    let written = options.open(&part).and_then(|mut f| {
        f.write_all(bytes)?;
        f.sync_all()
    });
    let done = written.and_then(|()| std::fs::rename(&part, path));
    if done.is_err() {
        let _ = std::fs::remove_file(&part);
    }
    done
}

/// A folder only the person can open, for recordings kept while Kalliope runs: the session's
/// runtime folder where there is one (Linux), else the system's temporary folder.
pub fn private_temp(name: &str) -> PathBuf {
    let base = env::var_os("XDG_RUNTIME_DIR")
        .map(PathBuf::from)
        .filter(|p| p.is_absolute() && p.is_dir())
        .unwrap_or_else(env::temp_dir);
    base.join(name)
}

/// Whether the process `pid` is still running (Linux; elsewhere it is not known, and a leftover is kept).
fn running(pid: u32) -> bool {
    if cfg!(target_os = "linux") {
        std::path::Path::new(&format!("/proc/{pid}")).exists()
    } else {
        true
    }
}

/// What a Kalliope closed in a hurry (killed, the system shutting down) leaves behind: a file written and not yet put in
/// place (`.NAME.PID.part`, here or in the voices folder) and the recordings of a take (`kalliope-PID`, in the temporary
/// folder). They go at the next start, once the process that made them is gone; another Kalliope's are left alone.
pub fn clear_leftovers(dirs: &[PathBuf], temp_base: &std::path::Path) {
    for dir in dirs {
        let Ok(entries) = std::fs::read_dir(dir) else {
            continue;
        };
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().into_owned();
            let pid = name
                .strip_prefix('.')
                .and_then(|n| n.strip_suffix(".part"))
                .and_then(|n| n.rsplit('.').next())
                .and_then(|p| p.parse::<u32>().ok());
            if let Some(pid) = pid
                && !running(pid)
            {
                let _ = std::fs::remove_file(entry.path());
            }
        }
    }
    if let Ok(entries) = std::fs::read_dir(temp_base) {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().into_owned();
            if let Some(pid) = name
                .strip_prefix("kalliope-")
                .and_then(|p| p.parse::<u32>().ok())
                && pid != std::process::id()
                && !running(pid)
                && entry.path().is_dir()
            {
                let _ = std::fs::remove_dir_all(entry.path());
            }
        }
    }
}

/// The folder `private_temp` puts its folders in.
pub fn temp_base() -> PathBuf {
    private_temp("x")
        .parent()
        .map(PathBuf::from)
        .unwrap_or_else(env::temp_dir)
}

/// Creates `dir` so that only its owner can read it.
pub fn create_private_dir(dir: &std::path::Path) -> std::io::Result<()> {
    let mut builder = std::fs::DirBuilder::new();
    builder.recursive(true);
    #[cfg(unix)]
    std::os::unix::fs::DirBuilderExt::mode(&mut builder, 0o700);
    builder.create(dir)
}

#[cfg(test)]
mod tests {
    #[test]
    #[cfg(unix)]
    fn private_files_and_folders_are_the_owner_s_only() {
        use std::os::unix::fs::PermissionsExt;
        let dir = std::env::temp_dir().join(format!("kalliope-private-{}", std::process::id()));
        super::create_private_dir(&dir.join("dentro")).unwrap();
        let mode = |p: &std::path::Path| std::fs::metadata(p).unwrap().permissions().mode() & 0o777;
        assert_eq!(mode(&dir.join("dentro")), 0o700);
        let file = dir.join("history.txt");
        super::write_atomic(&file, b"uno").unwrap();
        super::write_atomic(&file, b"due").unwrap();
        assert_eq!(std::fs::read(&file).unwrap(), b"due");
        assert_eq!(mode(&file), 0o600);
        assert_eq!(
            std::fs::read_dir(&dir).unwrap().count(),
            2,
            "no part file left"
        );
        std::fs::remove_dir_all(&dir).unwrap();
    }

    #[test]
    #[cfg(target_os = "linux")]
    fn what_a_killed_kalliope_left_goes_at_the_next_start_and_what_runs_stays() {
        let base = std::env::temp_dir().join(format!("kalliope-leftovers-{}", std::process::id()));
        let voices = base.join("voci");
        let temp = base.join("temp");
        std::fs::create_dir_all(&voices).unwrap();
        std::fs::create_dir_all(temp.join("kalliope-2147483000")).unwrap();
        std::fs::create_dir_all(temp.join(format!("kalliope-{}", std::process::id()))).unwrap();
        std::fs::create_dir_all(temp.join("altro")).unwrap();
        let mine = format!(".Anna.{}.part", std::process::id());
        for f in [
            ".Anna.2147483000.part",
            mine.as_str(),
            "Anna.safetensors",
            ".nascosto",
        ] {
            std::fs::write(voices.join(f), b"x").unwrap();
        }
        super::clear_leftovers(std::slice::from_ref(&voices), &temp);
        let left = |d: &std::path::Path| {
            let mut v: Vec<String> = std::fs::read_dir(d)
                .unwrap()
                .flatten()
                .map(|e| e.file_name().to_string_lossy().into_owned())
                .collect();
            v.sort();
            v
        };
        let mut kept = vec![
            ".nascosto".to_string(),
            mine,
            "Anna.safetensors".to_string(),
        ];
        kept.sort();
        assert_eq!(left(&voices), kept);
        assert_eq!(
            left(&temp),
            vec![
                "altro".to_string(),
                format!("kalliope-{}", std::process::id())
            ]
        );
        std::fs::remove_dir_all(&base).unwrap();
    }
}
