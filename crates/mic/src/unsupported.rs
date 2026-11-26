// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Systems without a virtual microphone backend yet: `open` always fails.

use crate::{Error, ErrorKind};

/// Cannot exist: no value is ever created on these systems.
pub enum Mic {}

impl Mic {
    pub fn player(name: &str, description: &str, rate: u32) -> Result<Mic, Error> {
        Mic::open(name, description, rate)
    }

    pub fn open(_name: &str, _description: &str, _rate: u32) -> Result<Mic, Error> {
        Err(Error::with_kind(
            ErrorKind::Unavailable,
            format!(
                "the Kalliope microphone is not supported on this system yet ({}); it works on \
             Linux with PipeWire",
                std::env::consts::OS
            ),
        ))
    }

    pub fn play(&self, _samples: &[f32]) {
        match *self {}
    }

    pub fn clear(&self) {
        match *self {}
    }

    pub fn queued_seconds(&self) -> f32 {
        match *self {}
    }

    pub fn in_use(&self) -> bool {
        match *self {}
    }

    pub fn is_connected(&self) -> bool {
        match *self {}
    }

    pub fn set_monitor(&self, _on: bool) -> Result<(), Error> {
        match *self {}
    }

    pub fn sample_rate(&self) -> u32 {
        match *self {}
    }
}

fn no_recording() -> Error {
    Error::with_kind(
        ErrorKind::Unavailable,
        format!(
            "recording from the microphone is not supported on this system yet ({}); it works on \
             Linux with PipeWire",
            std::env::consts::OS
        ),
    )
}

pub fn sources() -> Result<Vec<crate::Source>, Error> {
    Err(no_recording())
}

/// Cannot exist: no value is ever created on these systems.
pub enum Recorder {}

impl Recorder {
    pub fn open(_name: Option<&str>) -> Result<Recorder, Error> {
        Err(no_recording())
    }

    pub fn source(&self) -> &crate::Source {
        match *self {}
    }

    pub fn read(&self, _out: &mut Vec<f32>) -> usize {
        match *self {}
    }

    pub fn is_connected(&self) -> bool {
        match *self {}
    }
}
