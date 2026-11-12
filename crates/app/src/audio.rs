// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Where synthesized speech goes: the virtual microphone, or, where none exists yet, a silent
//! stand-in that keeps time so the app behaves the same.

use std::sync::Mutex;
use std::time::{Duration, Instant};

pub trait Output: Send {
    /// Queue samples to be played; returns at once.
    fn play(&self, samples: &[f32]);
    /// Drop everything still queued.
    fn clear(&self);
    /// Seconds of audio still to be played.
    fn queued_seconds(&self) -> f32;
    /// Also play to the speakers, so the user hears what is said.
    fn set_monitor(&self, on: bool) -> Result<(), String>;
    /// Whether an app (a call, a browser) is listening to the microphone.
    fn in_use(&self) -> bool;
    /// False when the audio system went away (PipeWire restarted): open the output again.
    fn is_connected(&self) -> bool;
}

/// No audio device: counts time as if playing, so "speaking" and "ready" still follow the audio.
pub struct Silent {
    rate: f32,
    until: Mutex<Instant>,
}

impl Silent {
    pub fn new(rate: u32) -> Silent {
        Silent {
            rate: rate as f32,
            until: Mutex::new(Instant::now()),
        }
    }
}

impl Output for Silent {
    fn play(&self, samples: &[f32]) {
        let mut until = self.until.lock().unwrap_or_else(|e| e.into_inner());
        let start = (*until).max(Instant::now());
        *until = start + Duration::from_secs_f32(samples.len() as f32 / self.rate);
    }
    fn clear(&self) {
        *self.until.lock().unwrap_or_else(|e| e.into_inner()) = Instant::now();
    }
    fn queued_seconds(&self) -> f32 {
        let until = *self.until.lock().unwrap_or_else(|e| e.into_inner());
        until
            .saturating_duration_since(Instant::now())
            .as_secs_f32()
    }
    fn set_monitor(&self, _on: bool) -> Result<(), String> {
        Ok(())
    }
    fn in_use(&self) -> bool {
        true
    }
    fn is_connected(&self) -> bool {
        true
    }
}

impl Output for kalliope_mic::VirtualMic {
    fn play(&self, samples: &[f32]) {
        kalliope_mic::VirtualMic::play(self, samples);
    }
    fn clear(&self) {
        kalliope_mic::VirtualMic::clear(self);
    }
    fn queued_seconds(&self) -> f32 {
        kalliope_mic::VirtualMic::queued_seconds(self)
    }
    fn set_monitor(&self, on: bool) -> Result<(), String> {
        kalliope_mic::VirtualMic::set_monitor(self, on).map_err(|e| e.to_string())
    }
    fn in_use(&self) -> bool {
        kalliope_mic::VirtualMic::in_use(self)
    }
    fn is_connected(&self) -> bool {
        kalliope_mic::VirtualMic::is_connected(self)
    }
}

/// Opens the virtual microphone "Kalliope". Returns the reason when it is not available.
pub fn open(rate: u32) -> Result<Box<dyn Output>, String> {
    kalliope_mic::VirtualMic::open("kalliope", "Kalliope", rate)
        .map(|mic| Box::new(mic) as Box<dyn Output>)
        .map_err(|e| format!("il microfono virtuale non si è aperto ({e})"))
}
