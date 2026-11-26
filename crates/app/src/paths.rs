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
}
