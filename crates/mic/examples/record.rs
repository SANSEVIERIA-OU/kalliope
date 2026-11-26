// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Lists the sound inputs and records from one, for checking the capture by hand:
//! `cargo run -p kalliope-mic --example record -- [SECONDS] [SOURCE] [OUT.wav]`.

use std::time::{Duration, Instant};

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let seconds: f32 = args.first().and_then(|s| s.parse().ok()).unwrap_or(3.0);
    let source = args.get(1).filter(|s| !s.is_empty()).map(String::as_str);
    let out = args.get(2).map_or("record.wav", String::as_str);
    match kalliope_mic::sources() {
        Ok(list) => {
            for s in &list {
                println!(
                    "{} {:40} {}",
                    if s.default { "*" } else { " " },
                    s.name,
                    s.description
                );
            }
        }
        Err(e) => {
            eprintln!("sources: {e}");
            std::process::exit(1);
        }
    }
    let rec = match kalliope_mic::Recorder::open(source) {
        Ok(r) => r,
        Err(e) => {
            eprintln!("record: {e} ({:?})", e.kind());
            std::process::exit(1);
        }
    };
    println!("recording from {}", rec.source().name);
    let mut samples = Vec::new();
    let start = Instant::now();
    while start.elapsed().as_secs_f32() < seconds {
        std::thread::sleep(Duration::from_millis(50));
        let before = samples.len();
        rec.read(&mut samples);
        let block = &samples[before..];
        let peak = block.iter().fold(0.0f32, |m, s| m.max(s.abs()));
        if !rec.is_connected() {
            println!(
                "microphone gone after {:.1} s",
                start.elapsed().as_secs_f32()
            );
            break;
        }
        if !block.is_empty() && before % 48_000 < block.len() {
            println!("{:.1} s peak {peak:.3}", samples.len() as f32 / 48_000.0);
        }
    }
    let mut wav = Vec::new();
    let n = samples.len() as u32 * 2;
    wav.extend_from_slice(b"RIFF");
    wav.extend_from_slice(&(36 + n).to_le_bytes());
    wav.extend_from_slice(b"WAVEfmt ");
    wav.extend_from_slice(&16u32.to_le_bytes());
    wav.extend_from_slice(&[1, 0, 1, 0]);
    wav.extend_from_slice(&48_000u32.to_le_bytes());
    wav.extend_from_slice(&96_000u32.to_le_bytes());
    wav.extend_from_slice(&[2, 0, 16, 0]);
    wav.extend_from_slice(b"data");
    wav.extend_from_slice(&n.to_le_bytes());
    for s in &samples {
        wav.extend_from_slice(&((s.clamp(-1.0, 1.0) * 32767.0) as i16).to_le_bytes());
    }
    std::fs::write(out, wav).expect("write");
    println!(
        "{} samples ({:.2} s) in {out}",
        samples.len(),
        samples.len() as f32 / 48_000.0
    );
}
