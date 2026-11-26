// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
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
mod platform {
    pub use crate::pipewire::Mic;
    pub use crate::pipewire::capture::{Recorder, sources};
}

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
    /// No microphone to record from (or not the one asked for).
    NoSource,
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

/// Plays mono `f32` samples on the default speakers only: for listening to a recording, never heard
/// in a call. All methods take `&self`. Dropping it stops the sound.
pub struct Player(platform::Mic);

impl Player {
    /// `name` is the stable node name, `description` what the system's volume control shows.
    pub fn open(name: &str, description: &str, sample_rate: u32) -> Result<Player, Error> {
        if !(8_000..=192_000).contains(&sample_rate) {
            return Err(Error::new(format!(
                "unsupported sample rate {sample_rate} Hz"
            )));
        }
        platform::Mic::player(name, description, sample_rate).map(Player)
    }

    /// Appends samples to play; never waits.
    pub fn play(&self, samples: &[f32]) {
        self.0.play(samples);
    }

    /// Stops at once.
    pub fn clear(&self) {
        self.0.clear();
    }

    /// Seconds still to play.
    pub fn queued_seconds(&self) -> f32 {
        self.0.queued_seconds()
    }
}

/// A sound input a person can record their voice from: a microphone, a headset, a sound card.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Source {
    /// The stable node name, to give to [`Recorder::open`].
    pub name: String,
    /// The name the system shows, for example "Microfono USB".
    pub description: String,
    /// The one recorded from when none is chosen: the system's default input.
    pub default: bool,
}

/// The sound inputs a person can record from, the default first. Kalliope's own microphone is
/// never among them.
pub fn sources() -> Result<Vec<Source>, Error> {
    platform::sources()
}

/// A recording in progress from a real microphone, mono at [`Recorder::RATE`]. All methods take
/// `&self` and may be called from any thread. Dropping it stops the recording.
pub struct Recorder(platform::Recorder);

impl Recorder {
    /// The sample rate of what [`read`](Self::read) gives; PipeWire converts from the
    /// microphone's own rate and mixes its channels.
    pub const RATE: u32 = 48_000;

    /// Starts recording from the source named `name` (a [`Source::name`]), or from the default
    /// one. Never records from Kalliope's own microphone, and never moves to another input if
    /// this one goes away.
    pub fn open(name: Option<&str>) -> Result<Recorder, Error> {
        platform::Recorder::open(name).map(Recorder)
    }

    /// The source it records from.
    pub fn source(&self) -> &Source {
        self.0.source()
    }

    /// Appends the samples captured since the last call; returns how many came. Call it at least
    /// every few seconds.
    pub fn read(&self, out: &mut Vec<f32>) -> usize {
        self.0.read(out)
    }

    /// False once the microphone went away (unplugged, or the sound system stopped).
    pub fn is_connected(&self) -> bool {
        self.0.is_connected()
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
