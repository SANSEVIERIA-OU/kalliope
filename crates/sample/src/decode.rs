// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Audio files to mono samples: WAV, FLAC, MP3, Ogg Vorbis, M4A/AAC and the sound of MP4, MKV and
//! WebM videos through Symphonia; Opus (in Ogg, WebM or MKV) through libopus.

use crate::opus;
use kalliope_i18n::tr;
use std::fs::File;
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};
use symphonia::core::codecs::CodecParameters;
use symphonia::core::codecs::audio::AudioDecoderOptions;
use symphonia::core::codecs::audio::well_known::CODEC_ID_OPUS;
use symphonia::core::errors::Error as SymphoniaError;
use symphonia::core::formats::probe::Hint;
use symphonia::core::formats::{FormatOptions, TrackType};
use symphonia::core::io::{MediaSourceStream, MediaSourceStreamOptions};
use symphonia::core::meta::MetadataOptions;

/// The longest part of a file that is read: the clearest stretch is looked for in the first
/// five minutes, so a long video or a whole audiobook never fills the memory.
pub const MAX_SECONDS: f32 = 300.0;

/// Mono samples and their rate.
#[derive(Debug, Clone, PartialEq)]
pub struct Audio {
    pub samples: Vec<f32>,
    pub rate: u32,
    /// The file was longer than [`MAX_SECONDS`] and only its start was read.
    pub truncated: bool,
}

impl Audio {
    pub fn seconds(&self) -> f32 {
        self.samples.len() as f32 / self.rate.max(1) as f32
    }
}

/// Why a file cannot be read.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ReadError {
    /// The file cannot be opened: why, in words a person can use (the system's own message goes to standard error).
    Open(OpenReason),
    /// Empty file.
    Empty,
    /// Not an audio or video file Kalliope reads.
    NotAudio,
    /// A video or container without sound.
    NoSound,
    /// Audio in a format Kalliope does not read (for example AMR, WMA, ALAC).
    Unsupported(String),
    /// Opus, but libopus is not on this computer.
    NoOpus,
    /// The file is damaged.
    Damaged(String),
    /// Reading was cancelled.
    Cancelled,
}

impl ReadError {
    /// What to tell the person, in plain Italian.
    pub fn message(&self) -> String {
        match self {
            ReadError::Open(OpenReason::Gone) => {
                tr!("programma.file.non-c-e-piu" => "Non riesco ad aprire il file: non c'è più, forse è stato spostato o cancellato. Scegline un altro.")
            }
            ReadError::Open(OpenReason::Denied) => {
                tr!("programma.file.nessun-permesso" => "Non riesco ad aprire il file: non ho il permesso di leggerlo. Scegline un altro.")
            }
            ReadError::Open(OpenReason::Other) => {
                tr!("programma.file.non-si-apre" => "Non riesco ad aprire il file: non si apre. Scegline un altro.")
            }
            ReadError::Empty => tr!("programma.file.vuoto" => "Il file è vuoto."),
            ReadError::NotAudio => {
                tr!("programma.file.non-audio" => "Questo file non è un audio. Prova con un messaggio vocale, un video o una registrazione.")
            }
            ReadError::NoSound => {
                tr!("programma.file.senza-audio" => "In questo file non c'è audio.")
            }
            // TRANSLATORS: {formato} is the name of the audio format as the file says it (a codec): it stays as it is
            ReadError::Unsupported(what) => {
                // TRANSLATORS: {formato} is the audio format the file has
                tr!("programma.file.non-supportato" => "Kalliope non sa ancora leggere l'audio di questo file ({formato}). Convertilo in WAV o MP3, oppure scegline un altro.", formato = what)
            }
            ReadError::NoOpus => {
                tr!("programma.file.manca-libopus" => "Per leggere i messaggi vocali in formato Opus serve la libreria libopus, che su questo computer manca: installa il pacchetto «opus» (o «libopus0»).")
            }
            // TRANSLATORS: {causa} is the decoder's own message, in English: it stays as it is
            ReadError::Damaged(e) => {
                tr!("programma.file.rovinato" => "Il file sembra rovinato e non si legge ({causa}).", causa = e)
            }
            ReadError::Cancelled => tr!("programma.file.lettura-annullata" => "Lettura annullata."),
        }
    }
}

impl std::fmt::Display for ReadError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message())
    }
}

impl std::error::Error for ReadError {}

/// Why a file did not open: the system's message is English, and says «os error 2», so the person is told one of these.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OpenReason {
    Gone,
    Denied,
    Other,
}

fn open_reason(e: &std::io::Error) -> OpenReason {
    use std::io::ErrorKind;
    eprintln!("kalliope: opening a file: {e}");
    match e.kind() {
        ErrorKind::NotFound => OpenReason::Gone,
        ErrorKind::PermissionDenied => OpenReason::Denied,
        _ => OpenReason::Other,
    }
}

/// Reads the sound of `path`, mixed to mono, up to [`MAX_SECONDS`]. `progress` gets the share of
/// the file read so far (0 to 1); `cancel` stops it.
pub fn read_file(
    path: &Path,
    cancel: &AtomicBool,
    progress: &mut dyn FnMut(f32),
) -> Result<Audio, ReadError> {
    let file = File::open(path).map_err(|e| ReadError::Open(open_reason(&e)))?;
    let len = file.metadata().map(|m| m.len()).unwrap_or(0);
    if len == 0 {
        return Err(ReadError::Empty);
    }
    let mss = MediaSourceStream::new(Box::new(file), MediaSourceStreamOptions::default());
    let mut hint = Hint::new();
    if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
        hint.with_extension(&ext.to_lowercase());
    }
    let mut reader = symphonia::default::get_probe()
        .probe(
            &hint,
            mss,
            FormatOptions::default(),
            MetadataOptions::default(),
        )
        .map_err(|e| match e {
            SymphoniaError::IoError(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => {
                ReadError::NotAudio
            }
            SymphoniaError::IoError(e) => ReadError::Open(open_reason(&e)),
            _ => ReadError::NotAudio,
        })?;
    let track = reader
        .tracks()
        .iter()
        .find(|t| t.track_type() == Some(TrackType::Audio))
        .ok_or(ReadError::NoSound)?;
    let track_id = track.id;
    let Some(CodecParameters::Audio(params)) = track.codec_params.clone() else {
        return Err(ReadError::NoSound);
    };
    let rate = params.sample_rate.unwrap_or(0);
    let channels = params.channels.as_ref().map_or(1, |c| c.count().max(1));
    let mut decoder = if params.codec == CODEC_ID_OPUS {
        Decode::Opus(
            opus::Decoder::new(channels)
                .ok_or(ReadError::NoOpus)?
                .map_err(ReadError::Unsupported)?,
        )
    } else {
        Decode::Symphonia(
            symphonia::default::get_codecs()
                .make_audio_decoder(&params, &AudioDecoderOptions::default())
                .map_err(|e| ReadError::Unsupported(e.to_string()))?,
        )
    };
    let rate = if params.codec == CODEC_ID_OPUS {
        48_000
    } else {
        rate
    };
    let mut samples: Vec<f32> = Vec::new();
    let mut interleaved: Vec<f32> = Vec::new();
    let mut rate = rate;
    let mut errors = 0;
    let mut truncated = false;
    let mut last_progress = 0.0;
    loop {
        if cancel.load(Ordering::Relaxed) {
            return Err(ReadError::Cancelled);
        }
        let packet = match reader.next_packet() {
            Ok(Some(p)) => p,
            Ok(None) => break,
            Err(SymphoniaError::IoError(e)) if e.kind() == std::io::ErrorKind::UnexpectedEof => {
                break;
            }
            Err(SymphoniaError::ResetRequired) => break,
            Err(e) => {
                if samples.is_empty() {
                    return Err(ReadError::Damaged(e.to_string()));
                }
                break; // A damaged end: keep what was read.
            }
        };
        if packet.track_id != track_id {
            continue;
        }
        interleaved.clear();
        let (n_channels, trim_start, trim_end) = (
            channels,
            packet.trim_start.get() as usize,
            packet.trim_end.get() as usize,
        );
        let got = match &mut decoder {
            Decode::Opus(d) => d.decode(&packet.data).map(|pcm| {
                let frames = pcm.len() / n_channels;
                let end = frames.saturating_sub(trim_end);
                let start = trim_start.min(end);
                interleaved.extend_from_slice(&pcm[start * n_channels..end * n_channels]);
                n_channels
            }),
            Decode::Symphonia(d) => match d.decode(&packet) {
                Ok(buf) => {
                    let spec_rate = buf.spec().rate();
                    if spec_rate > 0 {
                        rate = spec_rate;
                    }
                    let ch = buf.spec().channels().count().max(1);
                    buf.copy_to_vec_interleaved(&mut interleaved);
                    Ok(ch)
                }
                Err(SymphoniaError::DecodeError(e)) => Err(e.to_string()),
                Err(e) => Err(e.to_string()),
            },
        };
        match got {
            Ok(ch) => {
                samples.extend(
                    interleaved
                        .chunks(ch)
                        .map(|f| f.iter().sum::<f32>() / ch as f32),
                );
            }
            Err(e) => {
                // A few bad packets are skipped, as players do; many mean a broken file.
                errors += 1;
                if errors > 50 {
                    return Err(ReadError::Damaged(e));
                }
            }
        }
        if rate > 0 && samples.len() as f32 >= MAX_SECONDS * rate as f32 {
            samples.truncate((MAX_SECONDS * rate as f32) as usize);
            truncated = true;
            break;
        }
        // Progress: by time read against the length when known, else nothing finer than done.
        if rate > 0 {
            let total = track_seconds(reader.tracks(), track_id).unwrap_or(MAX_SECONDS);
            let share = (samples.len() as f32 / rate as f32 / total.min(MAX_SECONDS)).min(1.0);
            if share - last_progress >= 0.02 {
                last_progress = share;
                progress(share);
            }
        }
    }
    if rate == 0 || samples.is_empty() {
        return Err(ReadError::NoSound);
    }
    progress(1.0);
    Ok(Audio {
        samples,
        rate,
        truncated,
    })
}

enum Decode {
    Symphonia(Box<dyn symphonia::core::codecs::audio::AudioDecoder>),
    Opus(opus::Decoder),
}

/// The length of a track in seconds, when the container says it.
fn track_seconds(tracks: &[symphonia::core::formats::Track], id: u32) -> Option<f32> {
    let t = tracks.iter().find(|t| t.id == id)?;
    let tb = t.time_base?;
    let frames = t.num_frames?;
    let time = tb.calc_time(symphonia::core::units::Timestamp::new(frames as i64))?;
    Some(time.as_secs_f64() as f32)
}

#[cfg(test)]
mod open_tests {
    use super::*;

    #[test]
    fn a_missing_or_forbidden_file_is_explained_without_the_system_s_english() {
        let cancel = AtomicBool::new(false);
        let gone = read_file(
            std::path::Path::new("/tmp/kalliope-non-c-e.opus"),
            &cancel,
            &mut |_| {},
        )
        .unwrap_err()
        .message();
        assert!(gone.contains("non c'è più"), "{gone}");
        assert!(
            !gone.contains("os error") && !gone.contains("No such file"),
            "{gone}"
        );
        let dir = read_file(std::path::Path::new("/"), &cancel, &mut |_| {})
            .unwrap_err()
            .message();
        assert!(!dir.contains("os error"), "{dir}");
    }
}
