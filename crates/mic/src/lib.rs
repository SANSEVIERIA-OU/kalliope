// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Virtual microphone: makes synthesized speech reach video-call apps as if it came from a
//! microphone.
//!
//! On Linux this is a PipeWire node of class `Audio/Source`, the same kind of node that
//! `module-loopback` creates. Recording apps list it next to the real microphones, both through
//! PipeWire and through `pipewire-pulse`, under its description (for example "Kalliope").
//! libpipewire is loaded at run time, so the program still starts on systems without it and
//! [`VirtualMic::open`] reports a readable error instead. Other systems get the same API with an
//! `open` that fails for now.
//!
//! The microphone behaves like a real one: it delivers audio only while an app records from it.
//! While nobody records, [`VirtualMic::play`] drops the samples, so a call that starts later never
//! hears stale speech, and the node costs no CPU time.

#[cfg(target_os = "linux")]
mod pipewire;
#[cfg(target_os = "linux")]
mod pod;
#[cfg(target_os = "linux")]
mod queue;
#[cfg(target_os = "linux")]
use pipewire as platform;

#[cfg(not(target_os = "linux"))]
mod unsupported;
#[cfg(not(target_os = "linux"))]
use unsupported as platform;

use std::fmt;

/// What went wrong, for apps that explain it in their own words.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[non_exhaustive]
pub enum ErrorKind {
    /// No virtual microphone on this system: PipeWire is missing or too old, or the system is
    /// not supported yet.
    Unavailable,
    /// PipeWire is installed but its server is not running or does not answer.
    NotRunning,
    /// Anything else; the message has the details.
    Other,
}

/// A developer-readable error in English, for example "PipeWire is not available: …", with its
/// [`ErrorKind`].
#[derive(Debug, Clone)]
pub struct Error {
    kind: ErrorKind,
    message: String,
}

impl Error {
    pub fn new(message: impl Into<String>) -> Error {
        Error::with_kind(ErrorKind::Other, message)
    }

    pub fn with_kind(kind: ErrorKind, message: impl Into<String>) -> Error {
        Error {
            kind,
            message: message.into(),
        }
    }

    pub fn kind(&self) -> ErrorKind {
        self.kind
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for Error {}

/// A virtual microphone fed with mono `f32` samples. All methods take `&self` and may be called
/// from any thread. Dropping it removes the microphone.
pub struct VirtualMic(platform::Mic);

impl VirtualMic {
    /// Creates the microphone. `name` is the stable node name (`node.name`, what
    /// `pw-record --target` and `parec -d` take), `description` the label users pick in apps.
    /// `sample_rate` is the rate of the samples given to [`play`](Self::play); PipeWire
    /// resamples to the rate of the graph.
    pub fn open(name: &str, description: &str, sample_rate: u32) -> Result<VirtualMic, Error> {
        if name.is_empty() || name.contains(char::is_whitespace) {
            return Err(Error::new(format!(
                "invalid microphone name {name:?}: it must be one word"
            )));
        }
        if !(8_000..=192_000).contains(&sample_rate) {
            return Err(Error::new(format!(
                "unsupported sample rate {sample_rate} Hz (8000 to 192000 Hz)"
            )));
        }
        platform::Mic::open(name, description, sample_rate).map(VirtualMic)
    }

    /// Appends mono samples, nominally within -1..1, at the rate given to
    /// [`open`](Self::open). Never waits for playback. Samples are dropped while no app records
    /// from the microphone and the monitor is off.
    pub fn play(&self, samples: &[f32]) {
        self.0.play(samples);
    }

    /// Drops all queued audio, for example when the user presses Stop.
    pub fn clear(&self) {
        self.0.clear();
    }

    /// Seconds of audio still queued for the microphone or the monitor, whichever is longer.
    pub fn queued_seconds(&self) -> f32 {
        self.0.queued_seconds()
    }

    /// Whether an app is recording from the microphone right now.
    pub fn in_use(&self) -> bool {
        self.0.in_use()
    }

    /// Whether PipeWire still has the microphone. It becomes false if PipeWire stops or restarts
    /// (for example after an upgrade); open a new `VirtualMic` then, since apps only see the
    /// microphone while it exists.
    pub fn is_connected(&self) -> bool {
        self.0.is_connected()
    }

    /// Also plays the audio on the default speakers, so the user hears what the others hear.
    /// The monitor stream only runs while it has audio to play.
    pub fn set_monitor(&self, on: bool) -> Result<(), Error> {
        self.0.set_monitor(on)
    }

    /// The sample rate given to [`open`](Self::open).
    pub fn sample_rate(&self) -> u32 {
        self.0.sample_rate()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_bad_arguments() {
        let name = VirtualMic::open("two words", "Kalliope", 24_000)
            .err()
            .unwrap();
        assert!(name.to_string().contains("one word"), "{name}");
        assert_eq!(name.kind(), ErrorKind::Other);
        let rate = VirtualMic::open("kalliope", "Kalliope", 1_000)
            .err()
            .unwrap();
        assert!(rate.to_string().contains("sample rate"), "{rate}");
    }
}
