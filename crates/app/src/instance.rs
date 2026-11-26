// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! One Kalliope at a time, so there is only ever one «Kalliope» microphone: a second launch asks
//! the running one to bring its window to the front, then ends.
//!
//! The first Kalliope holds an exclusive lock on `kalliope.lock` and listens on the local socket
//! `kalliope.sock`, both in the session's runtime folder (`$XDG_RUNTIME_DIR`, private to the
//! user). The lock goes away with the process, even after a crash, so a stale file never blocks a
//! start. This is what GApplication does over D-Bus, with the standard library only.
//!
//! Windows has no virtual microphone yet: there two windows can still be opened, and nothing is
//! locked. macOS already brings a running app to the front when it is opened again; the lock also
//! covers starting the program from a terminal.

#[cfg(unix)]
use std::io::{BufRead, BufReader, Write};
#[cfg(unix)]
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::{Path, PathBuf};
#[cfg(unix)]
use std::time::{Duration, Instant};

/// The first Kalliope: holds the lock while it lives.
pub struct Owner {
    #[cfg(unix)]
    _lock: std::fs::File,
    #[cfg(unix)]
    socket: PathBuf,
}

/// Kalliope is already running.
pub struct Running {
    #[cfg(unix)]
    socket: PathBuf,
}

#[cfg_attr(not(unix), allow(dead_code))]
pub enum Start {
    First(Owner),
    Running(Running),
}

/// The folder for the lock and the socket.
pub fn folder() -> PathBuf {
    std::env::var_os("XDG_RUNTIME_DIR")
        .map(PathBuf::from)
        .filter(|p| p.is_absolute() && p.is_dir())
        .unwrap_or_else(crate::paths::data_dir)
}

/// Claims the single place of Kalliope in `dir`.
#[cfg(unix)]
pub fn claim(dir: &Path) -> Start {
    let socket = dir.join("kalliope.sock");
    let _ = std::fs::create_dir_all(dir);
    let lock = std::fs::OpenOptions::new()
        .create(true)
        .truncate(false)
        .write(true)
        .open(dir.join("kalliope.lock"));
    match lock.map(|f| (f.try_lock(), f)) {
        Ok((Ok(()), lock)) => Start::First(Owner {
            _lock: lock,
            socket,
        }),
        Ok((Err(std::fs::TryLockError::WouldBlock), _)) => Start::Running(Running { socket }),
        // The folder cannot hold a lock: better two microphones than no Kalliope at all.
        Ok((Err(std::fs::TryLockError::Error(e)), _)) | Err(e) => {
            eprintln!("kalliope: cannot check for another Kalliope: {e}");
            Start::First(Owner {
                _lock: no_lock(),
                socket,
            })
        }
    }
}

#[cfg(unix)]
fn no_lock() -> std::fs::File {
    std::fs::File::open("/dev/null").expect("/dev/null exists")
}

#[cfg(not(unix))]
pub fn claim(_dir: &Path) -> Start {
    Start::First(Owner {})
}

impl Owner {
    /// Listens for later launches; `on_activate` runs on a background thread with the activation
    /// token of the launch (`XDG_ACTIVATION_TOKEN` or `DESKTOP_STARTUP_ID`), if it had one.
    #[cfg(unix)]
    pub fn listen(&self, on_activate: impl Fn(Option<String>) + Send + 'static) {
        // Only the lock holder gets here, so a socket file left by a crash can go.
        let _ = std::fs::remove_file(&self.socket);
        let listener = match UnixListener::bind(&self.socket) {
            Ok(l) => l,
            Err(e) => return eprintln!("kalliope: {}: {e}", self.socket.display()),
        };
        let _ = std::thread::Builder::new()
            .name("kalliope-instance".into())
            .spawn(move || {
                for stream in listener.incoming().flatten() {
                    let _ = stream.set_read_timeout(Some(Duration::from_secs(1)));
                    let mut line = String::new();
                    let message = std::io::Read::take(stream, 4096);
                    if BufReader::new(message).read_line(&mut line).is_ok()
                        && let Some(rest) = line.trim_end().strip_prefix("activate")
                    {
                        let token = rest.trim();
                        on_activate((!token.is_empty()).then(|| token.to_owned()));
                    }
                }
            });
    }

    #[cfg(not(unix))]
    pub fn listen(&self, _on_activate: impl Fn(Option<String>) + Send + 'static) {}
}

#[cfg(unix)]
impl Drop for Owner {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.socket);
    }
}

impl Running {
    /// Asks the running Kalliope to bring its window to the front. False when it does not answer
    /// (it is starting, or it is a `kalliope --say` without a window).
    #[cfg(unix)]
    pub fn activate(&self, token: Option<&str>) -> bool {
        // The first Kalliope may have just taken the lock and not be listening yet.
        let deadline = Instant::now() + Duration::from_secs(2);
        loop {
            if let Ok(mut stream) = UnixStream::connect(&self.socket) {
                let message = format!("activate {}\n", token.unwrap_or("").trim());
                return stream.write_all(message.as_bytes()).is_ok();
            }
            if Instant::now() >= deadline {
                return false;
            }
            std::thread::sleep(Duration::from_millis(100));
        }
    }

    #[cfg(not(unix))]
    pub fn activate(&self, _token: Option<&str>) -> bool {
        false
    }
}

/// The token a desktop launcher gives a new process, so the window it activates may take focus.
pub fn launch_token() -> Option<String> {
    ["XDG_ACTIVATION_TOKEN", "DESKTOP_STARTUP_ID"]
        .iter()
        .find_map(|v| std::env::var(v).ok().filter(|t| !t.trim().is_empty()))
}

#[cfg(all(test, unix))]
mod tests {
    use super::*;
    use std::sync::mpsc::channel;

    #[test]
    fn a_second_kalliope_finds_the_first_and_wakes_it_up() {
        let dir = std::env::temp_dir().join(format!("kalliope-instance-{}", std::process::id()));
        let Start::First(owner) = claim(&dir) else {
            panic!("the first claim must win");
        };
        let (tx, rx) = channel();
        owner.listen(move |token| {
            let _ = tx.send(token);
        });
        let Start::Running(running) = claim(&dir) else {
            panic!("a second Kalliope must see the first");
        };
        assert!(running.activate(Some("token-123")));
        assert_eq!(
            rx.recv_timeout(Duration::from_secs(2)).unwrap().as_deref(),
            Some("token-123")
        );
        assert!(running.activate(None));
        assert_eq!(rx.recv_timeout(Duration::from_secs(2)).unwrap(), None);
        // When the first one ends, the next launch is the first again.
        drop(owner);
        assert!(!dir.join("kalliope.sock").exists());
        assert!(matches!(claim(&dir), Start::First(_)));
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
