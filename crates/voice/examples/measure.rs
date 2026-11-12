// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Measures load time, memory, time to first audio and CPU cost of the voice, with the same
//! method as the Python engine benchmark (bench/scripts/worker.py). Prints one JSON line.
//!
//!   cargo run --release -p kalliope-voice --example measure -- \
//!     --model-dir DIR --threads 1 --sentences phonemes.txt \
//!     --warmup "…" --short "…" --medium "…" [--speaker Giulia] [--reps 2]
//!
//! `phonemes.txt` holds one sentence's phonemes per line.

use std::path::PathBuf;
use std::time::Instant;

use kalliope_voice::{Voice, VoiceOptions};

#[repr(C)]
struct Rusage {
    utime: [i64; 2],
    stime: [i64; 2],
    rest: [i64; 14],
}

unsafe extern "C" {
    fn getrusage(who: i32, usage: *mut Rusage) -> i32;
    /// glibc: returns freed heap memory to the system.
    fn malloc_trim(pad: usize) -> i32;
}

/// User + system CPU seconds of this process.
fn cpu_s() -> f64 {
    let mut r = Rusage {
        utime: [0; 2],
        stime: [0; 2],
        rest: [0; 14],
    };
    unsafe { getrusage(0, &mut r) };
    (r.utime[0] + r.stime[0]) as f64 + (r.utime[1] + r.stime[1]) as f64 / 1e6
}

fn status_kb(field: &str) -> f64 {
    let s = std::fs::read_to_string("/proc/self/status").unwrap_or_default();
    s.lines()
        .find(|l| l.starts_with(field))
        .and_then(|l| l.split_whitespace().nth(1))
        .and_then(|v| v.parse().ok())
        .unwrap_or(0.0)
}

fn rss_mb() -> f64 {
    status_kb("VmRSS:") * 1024.0 / 1e6
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let get = |name: &str| {
        args.iter()
            .position(|a| a == name)
            .and_then(|i| args.get(i + 1))
            .cloned()
    };
    let need = |name: &str| get(name).unwrap_or_else(|| panic!("missing {name}"));
    let threads: usize = get("--threads").map_or(1, |t| t.parse().expect("--threads"));
    let reps: usize = get("--reps").map_or(2, |t| t.parse().expect("--reps"));
    let speaker = get("--speaker").unwrap_or_else(|| "Giulia".into());
    let sentences: Vec<String> = std::fs::read_to_string(need("--sentences"))
        .expect("--sentences file")
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(str::to_owned)
        .collect();
    let mut options = VoiceOptions {
        threads,
        ort_lib: get("--ort-lib").map(PathBuf::from),
        ..Default::default()
    };
    if let Some(m) = get("--max-chunk-tokens") {
        options.max_chunk_tokens = m.parse().expect("--max-chunk-tokens");
    }

    let rss_base = rss_mb();
    let (t0, c0) = (Instant::now(), cpu_s());
    let voice = Voice::load(&PathBuf::from(need("--model-dir")), &speaker, &options).expect("load");
    let (load_s, load_cpu_s) = (t0.elapsed().as_secs_f64(), cpu_s() - c0);
    let rss_loaded = rss_mb();
    let rss_peak_load = status_kb("VmHWM:") * 1024.0 / 1e6;
    let sr = f64::from(voice.sample_rate());

    voice.synthesize(&need("--warmup")).expect("warm-up");

    let first_audio = |phonemes: &str| {
        let first = voice.chunks(phonemes).into_iter().next().expect("a chunk");
        let mut times: Vec<f64> = (0..3)
            .map(|_| {
                let t = Instant::now();
                voice.synthesize_chunk(&first, 0).expect("synthesis");
                t.elapsed().as_secs_f64()
            })
            .collect();
        times.sort_by(f64::total_cmp);
        times[1]
    };
    let ttfa_short = first_audio(&need("--short"));
    let ttfa_medium = first_audio(&need("--medium"));

    // Same accounting as the Python benchmark: audio of the chunks, without inter-chunk pauses.
    // KALLIOPE_TRIM_EACH=1: return freed memory to the system after every sentence.
    let trim_each = std::env::var_os("KALLIOPE_TRIM_EACH").is_some();
    let (mut wall, mut cpu, mut audio) = (0.0, 0.0, 0.0);
    for _ in 0..reps {
        for s in &sentences {
            let (t, c) = (Instant::now(), cpu_s());
            let mut samples = 0usize;
            for (i, chunk) in voice.chunks(s).iter().enumerate() {
                samples += voice
                    .synthesize_chunk(chunk, i as u32)
                    .expect("synthesis")
                    .len();
            }
            if trim_each {
                unsafe { malloc_trim(0) };
            }
            wall += t.elapsed().as_secs_f64();
            cpu += cpu_s() - c;
            audio += samples as f64 / sr;
        }
    }
    let rss_end = rss_mb();
    unsafe { malloc_trim(0) };
    let rss_trimmed = rss_mb();
    println!(
        "{{\"threads\": {threads}, \"ort\": \"{}\", \"load_s\": {load_s:.3}, \"load_cpu_s\": {load_cpu_s:.3}, \
         \"rss_base_mb\": {rss_base:.1}, \"rss_loaded_mb\": {rss_loaded:.1}, \
         \"rss_peak_load_mb\": {rss_peak_load:.1}, \"rss_end_mb\": {rss_end:.1}, \
         \"rss_after_malloc_trim_mb\": {rss_trimmed:.1}, \"rss_peak_mb\": {:.1}, \"ttfa_short_ms\": {:.0}, \"ttfa_medium_ms\": {:.0}, \"rtf\": {:.4}, \
         \"cpu_s_per_audio_s\": {:.4}, \"audio_s\": {audio:.1}}}",
        voice.runtime_version(),
        status_kb("VmHWM:") * 1024.0 / 1e6,
        ttfa_short * 1e3,
        ttfa_medium * 1e3,
        wall / audio,
        cpu / audio,
    );
}
