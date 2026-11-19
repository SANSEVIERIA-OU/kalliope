// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Measures Pocket TTS as the app streams it: for each line of standard input (text already
//! normalized, as the app passes it), the time to the first audio, whether playback started at the
//! first audio would ever run dry (gaps), the CPU time and the real-time factor; at the end the peak
//! memory of the process. One JSON line per text, then a summary line.
//!
//!   cargo run --release -p kalliope-voice --example pocket_stream -- \
//!     --pocket-dir DIR --voice VOICE.safetensors [--threads 2] [--decode-frames 2] < texts.txt
//!
//! Linux only: it reads /proc and calls getrusage.

#[cfg(target_os = "linux")]
mod linux {
    use std::io::BufRead;
    use std::path::PathBuf;
    use std::time::Instant;

    use kalliope_voice::pocket::{Pocket, PocketOptions};

    #[repr(C)]
    struct Rusage {
        utime: [i64; 2],
        stime: [i64; 2],
        rest: [i64; 14],
    }

    unsafe extern "C" {
        fn getrusage(who: i32, usage: *mut Rusage) -> i32;
    }

    fn cpu_s() -> f64 {
        let mut r = Rusage {
            utime: [0; 2],
            stime: [0; 2],
            rest: [0; 14],
        };
        unsafe { getrusage(0, &mut r) };
        (r.utime[0] + r.stime[0]) as f64 + (r.utime[1] + r.stime[1]) as f64 / 1e6
    }

    /// Peak and current resident memory in MB (VmHWM, VmRSS).
    fn memory_mb() -> (f64, f64) {
        let status = std::fs::read_to_string("/proc/self/status").unwrap_or_default();
        let field = |name: &str| {
            status
                .lines()
                .find(|l| l.starts_with(name))
                .and_then(|l| l.split_whitespace().nth(1))
                .and_then(|v| v.parse::<f64>().ok())
                .map_or(0.0, |kb| kb / 1024.0)
        };
        (field("VmHWM:"), field("VmRSS:"))
    }

    pub fn main() {
        let mut dir = None;
        let mut voice = None;
        let mut options = PocketOptions::default();
        let mut args = std::env::args().skip(1);
        while let Some(a) = args.next() {
            let mut v = || args.next().expect("value");
            match a.as_str() {
                "--pocket-dir" => dir = Some(PathBuf::from(v())),
                "--voice" => voice = Some(PathBuf::from(v())),
                "--threads" => options.threads = v().parse().expect("number"),
                "--decode-frames" => options.decode_frames = v().parse().expect("number"),
                other => panic!("unknown option {other}"),
            }
        }
        let t0 = Instant::now();
        let pocket = Pocket::load(&dir.expect("--pocket-dir"), &options).expect("load");
        let voice = pocket.load_voice(&voice.expect("--voice")).expect("voice");
        let load_ms = t0.elapsed().as_secs_f64() * 1000.0;
        let (_, rss_loaded) = memory_mb();
        let rate = f64::from(pocket.sample_rate());
        let (mut total_audio, mut total_cpu, mut worst_first, mut gaps) = (0.0, 0.0, 0.0f64, 0);
        for (i, line) in std::io::stdin().lock().lines().enumerate() {
            let text = line.expect("line");
            let start = Instant::now();
            let cpu0 = cpu_s();
            let mut first: Option<f64> = None;
            let mut played_until = 0.0f64; // seconds since start when queued audio runs out
            let mut gap_s = 0.0f64;
            let mut audio_s = 0.0f64;
            let mut pieces = 0;
            for (j, chunk) in pocket.chunks(&text).iter().enumerate() {
                pocket
                    .speak_chunk(&voice, chunk, (i * 100 + j) as u32, &mut |a| {
                        let now = start.elapsed().as_secs_f64();
                        let d = a.len() as f64 / rate;
                        match first {
                            None => {
                                first = Some(now);
                                played_until = now + d;
                            }
                            Some(_) => {
                                if now > played_until {
                                    gap_s += now - played_until;
                                    played_until = now;
                                }
                                played_until += d;
                            }
                        }
                        audio_s += d;
                        pieces += 1;
                        true
                    })
                    .expect("speak");
            }
            let wall = start.elapsed().as_secs_f64();
            let cpu = cpu_s() - cpu0;
            let first_ms = first.unwrap_or(wall) * 1000.0;
            worst_first = worst_first.max(first_ms);
            total_audio += audio_s;
            total_cpu += cpu;
            if gap_s > 0.0 {
                gaps += 1;
            }
            println!(
                "{{\"text\":{i},\"first_audio_ms\":{first_ms:.1},\"audio_s\":{audio_s:.3},\"wall_s\":{wall:.3},\
                 \"cpu_s\":{cpu:.3},\"gap_ms\":{:.1},\"pieces\":{pieces}}}",
                gap_s * 1000.0
            );
            kalliope_voice::release_memory();
        }
        let (peak, rss) = memory_mb();
        println!(
            "{{\"summary\":true,\"load_ms\":{load_ms:.0},\"threads\":{},\"decode_frames\":{},\
             \"cpu_s_per_audio_s\":{:.3},\"worst_first_audio_ms\":{worst_first:.1},\"texts_with_gaps\":{gaps},\
             \"rss_loaded_mb\":{rss_loaded:.1},\"rss_end_mb\":{rss:.1},\"peak_mb\":{peak:.1},\"onnx_runtime\":\"{}\"}}",
            options.threads,
            options.decode_frames,
            total_cpu / total_audio.max(1e-9),
            pocket.runtime_version()
        );
    }
}

fn main() {
    #[cfg(target_os = "linux")]
    linux::main();
    #[cfg(not(target_os = "linux"))]
    eprintln!("pocket_stream measures on Linux only");
}
