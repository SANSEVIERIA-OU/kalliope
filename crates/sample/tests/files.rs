// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Reading the files a person picks, the right ones and the wrong ones.

use kalliope_sample::{Problem, ReadError, Sample, read_file, wav};
use std::path::{Path, PathBuf};
use std::sync::atomic::AtomicBool;

fn dir() -> PathBuf {
    let d = std::env::temp_dir().join(format!("kalliope-sample-{}", std::process::id()));
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn read(path: &Path) -> Result<kalliope_sample::Audio, ReadError> {
    read_file(path, &AtomicBool::new(false), &mut |_| {})
}

/// Fake speech: voiced syllables opened by a hiss, with pauses.
fn speech(seconds: f32, rate: u32) -> Vec<f32> {
    let mut x = 1u32;
    (0..(seconds * rate as f32) as usize)
        .map(|i| {
            let t = i as f32 / rate as f32;
            let phase = (t * 4.0).fract();
            x ^= x << 13;
            x ^= x >> 17;
            x ^= x << 5;
            let hiss = (x as f32 / u32::MAX as f32) * 2.0 - 1.0;
            let on = ((t / 2.0).fract() < 0.85) as u8 as f32;
            on * if phase < 0.12 {
                0.1 * hiss
            } else if phase < 0.7 {
                0.3 * (t * 150.0 * std::f32::consts::TAU).sin()
            } else {
                0.0
            }
        })
        .collect()
}

#[test]
fn a_wav_recording_gives_its_clearest_twelve_seconds() {
    let path = dir().join("voce.wav");
    std::fs::write(&path, wav::encode(&speech(20.0, 44_100), 44_100)).unwrap();
    let audio = read(&path).unwrap();
    assert_eq!(audio.rate, 44_100);
    assert!((audio.seconds() - 20.0).abs() < 0.01);
    let sample = Sample::new(&audio);
    assert!(sample.problems.is_empty(), "{:?}", sample.problems);
    let best = &sample.stretches[0];
    assert!(
        best.end - best.start <= 12.01 && best.end - best.start > 10.0,
        "{best:?}"
    );
    assert!(sample.usable(0));
    assert_eq!(
        sample.stretch(0).len(),
        ((best.end - best.start) * kalliope_sample::RATE as f32) as usize
    );
}

#[test]
fn wrong_files_are_explained_and_never_panic() {
    let d = dir();
    let empty = d.join("vuoto.wav");
    std::fs::write(&empty, b"").unwrap();
    assert_eq!(read(&empty), Err(ReadError::Empty));
    let text = d.join("lettera.mp3");
    std::fs::write(&text, "Cara Anna, ti scrivo").unwrap();
    assert_eq!(read(&text), Err(ReadError::NotAudio));
    let noise: Vec<u8> = (0..100_000u32)
        .map(|i| (i.wrapping_mul(2_654_435_761) >> 24) as u8)
        .collect();
    let junk = d.join("dati.ogg");
    std::fs::write(&junk, noise).unwrap();
    assert!(read(&junk).is_err());
    assert!(matches!(
        read(&d.join("manca.wav")),
        Err(ReadError::Open(_))
    ));
    // A WAV header with no samples.
    let header_only = d.join("solo-intestazione.wav");
    std::fs::write(&header_only, wav::encode(&[], 24_000)).unwrap();
    assert!(read(&header_only).is_err());
    for e in [ReadError::Empty, ReadError::NotAudio, ReadError::NoOpus] {
        assert!(!e.message().is_empty());
    }
}

#[test]
fn a_short_recording_makes_no_voice() {
    let path = dir().join("corto.wav");
    std::fs::write(&path, wav::encode(&speech(2.5, 24_000), 24_000)).unwrap();
    let sample = Sample::new(&read(&path).unwrap());
    assert!(
        sample.problems.contains(&Problem::TooShort),
        "{:?}",
        sample.problems
    );
    assert!(!sample.usable(0));
}

#[test]
fn cancelling_stops_reading() {
    let path = dir().join("annulla.wav");
    std::fs::write(&path, wav::encode(&speech(5.0, 24_000), 24_000)).unwrap();
    let cancel = AtomicBool::new(true);
    assert_eq!(
        read_file(&path, &cancel, &mut |_| {}),
        Err(ReadError::Cancelled)
    );
}

/// Files of every format made with ffmpeg from one recording (KALLIOPE_SAMPLE_FILES: a folder with
/// voce.wav and the same speech as FLAC, MP3, Ogg Vorbis, M4A, Opus and video): all read alike.
#[test]
fn every_format_reads_the_same_speech() {
    let Some(d) = std::env::var_os("KALLIOPE_SAMPLE_FILES").map(PathBuf::from) else {
        eprintln!("skipped: set KALLIOPE_SAMPLE_FILES to a folder of test files");
        return;
    };
    let reference = Sample::new(&read(&d.join("voce.wav")).unwrap());
    for name in [
        "voce.flac",
        "voce.mp3",
        "voce-vorbis.ogg",
        "voce.m4a",
        "whatsapp.opus",
        "telegram.oga",
        "voce-opus.ogg",
        "voce.webm",
        "video.mp4",
    ] {
        let path = d.join(name);
        let sample = match read(&path) {
            Ok(a) => Sample::new(&a),
            Err(ReadError::NoOpus) if kalliope_sample::opus_version().is_none() => continue,
            Err(e) => panic!("{name}: {e:?}"),
        };
        let (a, b) = (&reference.stretches[0], &sample.stretches[0]);
        assert!((a.start - b.start).abs() < 0.5, "{name}: {b:?}");
        assert!(
            (sample.quality.speech_seconds - reference.quality.speech_seconds).abs() < 0.5,
            "{name}"
        );
    }
}
