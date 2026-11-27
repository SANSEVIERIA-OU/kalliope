// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Where synthesized speech goes: the virtual microphone, or, where none exists yet, a silent
//! stand-in that keeps time so the app behaves the same.

use kalliope_i18n::tr;
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
/// It is never "connected" to anything: the engine keeps trying to open the microphone in its place
/// when that can help.
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
        false
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
        kalliope_mic::VirtualMic::set_monitor(self, on).map_err(|e| {
            eprintln!("kalliope: monitor: {e}");
            // TRANSLATORS: A warning: the person cannot hear their own voice from the loudspeakers (the option «Senti anche tu la voce»)
            tr!("programma.audio.casse" => "Attenzione: non riesco a farti sentire la voce dalle casse.")
        })
    }
    fn in_use(&self) -> bool {
        kalliope_mic::VirtualMic::in_use(self)
    }
    fn is_connected(&self) -> bool {
        kalliope_mic::VirtualMic::is_connected(self)
    }
}

/// Why the virtual microphone is missing.
#[derive(Clone, Debug, PartialEq)]
pub struct MicError {
    /// A whole sentence for the status line (the first words say the voice is ready).
    pub reason: String,
    /// For developers, on standard error.
    pub detail: String,
    /// Trying again later can help: PipeWire is installed but not answering yet, or it restarted.
    pub retry: bool,
}

impl MicError {
    /// PipeWire went away while Kalliope was using it (an upgrade, a restart of the session audio).
    pub fn lost() -> MicError {
        MicError {
            reason: explain(kalliope_mic::ErrorKind::NotRunning),
            detail: "PipeWire went away".into(),
            retry: true,
        }
    }
}

/// Opens the virtual microphone "Kalliope". When it is not available, says why.
pub fn open(rate: u32) -> Result<Box<dyn Output>, MicError> {
    kalliope_mic::VirtualMic::open("kalliope", "Kalliope", rate)
        .map(|mic| Box::new(mic) as Box<dyn Output>)
        .map_err(|e| {
            MicError {
                detail: e.to_string(),
                reason: explain(e.kind()),
                // A missing or too old PipeWire, or a system without the microphone, does not
                // change while Kalliope runs.
                retry: e.kind() != kalliope_mic::ErrorKind::Unavailable,
            }
        })
}

/// The sentence for a system with no virtual microphone (the catalog and the demonstration show it).
pub fn microphone_missing() -> String {
    explain(kalliope_mic::ErrorKind::Unavailable)
}

fn explain(kind: kalliope_mic::ErrorKind) -> String {
    use kalliope_mic::ErrorKind;
    match kind {
        ErrorKind::Unavailable if cfg!(target_os = "linux") => tr!(
            "programma.audio.serve-pipewire" => "La voce è pronta, ma il microfono «Kalliope» ha bisogno di PipeWire, che su questo computer manca o è troppo vecchio (pacchetti pipewire e pipewire-pulse): per ora nessuno ti sentirà nelle chiamate."
        ),
        ErrorKind::Unavailable => tr!(
            "programma.audio.sistema-non-supportato" => "La voce è pronta, ma su questo sistema il microfono «Kalliope» non c'è ancora: per ora nessuno ti sentirà nelle chiamate."
        ),
        ErrorKind::NotRunning => tr!(
            "programma.audio.pipewire-non-risponde" => "La voce è pronta, ma PipeWire, il servizio audio del computer, non risponde (riprovo da sola appena torna): per ora nessuno ti sentirà nelle chiamate."
        ),
        _ => tr!(
            "programma.audio.microfono-non-aperto" => "La voce è pronta, ma il microfono «Kalliope» non si è aperto: per ora nessuno ti sentirà nelle chiamate."
        ),
    }
}
