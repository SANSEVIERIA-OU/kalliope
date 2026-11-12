// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Manual test of the virtual microphone: creates "Kalliope" and reads commands from standard
//! input, one per line, so it can be driven by hand or by a script.
//!
//!     cargo run -p kalliope-mic --example virtual_mic -- [--rate HZ] [--monitor]
//!
//! Then pick "Kalliope" as the microphone in an app (or run `pw-record --target kalliope
//! test.wav`) and type `tone 440 2` or `wav kalliope.wav`.

use std::f32::consts::TAU;
use std::io::BufRead;
use std::process::ExitCode;
use std::thread::sleep;
use std::time::{Duration, Instant};

use kalliope_mic::VirtualMic;

const HELP: &str = "commands:
  tone HZ SECONDS   queue a sine tone (amplitude 0.5)
  wav FILE          queue a mono 16-bit or float WAV file at the microphone's rate
  clear             drop queued audio
  monitor on|off    also play to the default speakers
  status            connected? in use? queued seconds
  wait              wait until the queue is empty
  sleep SECONDS     pause (for scripts)
  quit";

fn main() -> ExitCode {
    let mut rate = 24_000;
    let mut monitor = false;
    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--rate" => match args.next().and_then(|r| r.parse().ok()) {
                Some(r) => rate = r,
                None => return fail("--rate needs a number"),
            },
            "--monitor" => monitor = true,
            _ => return fail(&format!("unknown argument {arg}\n{HELP}")),
        }
    }
    let mic = match VirtualMic::open("kalliope", "Kalliope", rate) {
        Ok(mic) => mic,
        Err(e) => return fail(&e.to_string()),
    };
    if let Err(e) = mic.set_monitor(monitor) {
        eprintln!("monitor: {e}");
    }
    println!("microphone \"Kalliope\" ready at {rate} Hz\n{HELP}");
    for line in std::io::stdin().lock().lines() {
        let Ok(line) = line else { break };
        let words: Vec<&str> = line.split_whitespace().collect();
        let started = Instant::now();
        match words.as_slice() {
            [] => {}
            ["tone", hz, seconds] => match (hz.parse::<f32>(), seconds.parse::<f32>()) {
                (Ok(hz), Ok(seconds)) => mic.play(&tone(hz, seconds, rate)),
                _ => eprintln!("usage: tone HZ SECONDS"),
            },
            ["wav", path] => match read_wav(path, rate) {
                Ok(samples) => mic.play(&samples),
                Err(e) => eprintln!("{path}: {e}"),
            },
            ["clear"] => mic.clear(),
            ["monitor", on @ ("on" | "off")] => {
                if let Err(e) = mic.set_monitor(*on == "on") {
                    eprintln!("monitor: {e}");
                }
            }
            ["status"] => {}
            ["wait"] => {
                while mic.queued_seconds() > 0.0 {
                    sleep(Duration::from_millis(10));
                }
            }
            ["sleep", seconds] => match seconds.parse::<f32>() {
                Ok(s) if s >= 0.0 => sleep(Duration::from_secs_f32(s)),
                _ => eprintln!("usage: sleep SECONDS"),
            },
            ["quit"] => break,
            _ => {
                eprintln!("{HELP}");
                continue;
            }
        }
        println!(
            "{} -> connected: {}, in use: {}, queued: {:.2} s ({:.1} ms)",
            line.trim(),
            mic.is_connected(),
            mic.in_use(),
            mic.queued_seconds(),
            started.elapsed().as_secs_f64() * 1000.0
        );
    }
    ExitCode::SUCCESS
}

fn fail(message: &str) -> ExitCode {
    eprintln!("error: {message}");
    ExitCode::FAILURE
}

fn tone(hz: f32, seconds: f32, rate: u32) -> Vec<f32> {
    let n = (seconds.max(0.0) * rate as f32) as usize;
    (0..n)
        .map(|i| 0.5 * (TAU * hz * i as f32 / rate as f32).sin())
        .collect()
}

/// Reads a WAV file as mono samples (channels are averaged).
fn read_wav(path: &str, rate: u32) -> Result<Vec<f32>, String> {
    let bytes = std::fs::read(path).map_err(|e| e.to_string())?;
    if bytes.len() < 12 || &bytes[0..4] != b"RIFF" || &bytes[8..12] != b"WAVE" {
        return Err("not a WAV file".into());
    }
    let u16_at = |i: usize| u16::from_le_bytes([bytes[i], bytes[i + 1]]);
    let u32_at =
        |i: usize| u32::from_le_bytes([bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]]);
    let (mut format, mut channels, mut file_rate, mut bits) = (0, 0, 0, 0);
    let mut pos = 12;
    while pos + 8 <= bytes.len() {
        let size = u32_at(pos + 4) as usize;
        let body = pos + 8;
        let end = body.saturating_add(size).min(bytes.len());
        match &bytes[pos..pos + 4] {
            b"fmt " if size >= 16 && end - body >= 16 => {
                format = u16_at(body);
                channels = u16_at(body + 2) as usize;
                file_rate = u32_at(body + 4);
                bits = u16_at(body + 14);
                if format == 0xfffe && size >= 26 {
                    format = u16_at(body + 24); // WAVE_FORMAT_EXTENSIBLE sub-format
                }
            }
            b"data" => {
                if channels == 0 {
                    return Err("data before format".into());
                }
                if file_rate != rate {
                    return Err(format!(
                        "{file_rate} Hz, but the microphone runs at {rate} Hz (use --rate {file_rate})"
                    ));
                }
                let data = &bytes[body..end];
                let samples: Vec<f32> = match (format, bits) {
                    (1, 16) => data
                        .chunks_exact(2)
                        .map(|b| f32::from(i16::from_le_bytes([b[0], b[1]])) / 32768.0)
                        .collect(),
                    (3, 32) => data
                        .chunks_exact(4)
                        .map(|b| f32::from_le_bytes([b[0], b[1], b[2], b[3]]))
                        .collect(),
                    _ => return Err(format!("unsupported WAV format {format}, {bits} bits")),
                };
                return Ok(samples
                    .chunks_exact(channels)
                    .map(|frame| frame.iter().sum::<f32>() / channels as f32)
                    .collect());
            }
            _ => {}
        }
        pos = body.saturating_add(size + (size & 1));
    }
    Err("no audio data".into())
}
