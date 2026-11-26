// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Reads audio files and prints what Kalliope sees in them: `cargo run -p kalliope-sample --example
//! inspect -- FILE...`.

use std::sync::atomic::AtomicBool;
use std::time::Instant;

fn main() {
    println!(
        "libopus: {}",
        kalliope_sample::opus_version().unwrap_or_else(|| "missing".into())
    );
    for path in std::env::args().skip(1) {
        let t = Instant::now();
        let never = AtomicBool::new(false);
        match kalliope_sample::read_file(path.as_ref(), &never, &mut |_| {}) {
            Err(e) => println!("{path}: ERROR {:?}: {}", e, e.message()),
            Ok(audio) => {
                let read = t.elapsed();
                let s = kalliope_sample::Sample::new(&audio);
                println!(
                    "{path}: {:.2} s at {} Hz{} · read {} ms, analysed {} ms · speech {:.1} s, level {:.0} dB, SNR {:.0} dB · problems {:?}",
                    audio.seconds(),
                    audio.rate,
                    if audio.truncated { " (truncated)" } else { "" },
                    read.as_millis(),
                    (t.elapsed() - read).as_millis(),
                    s.quality.speech_seconds,
                    s.quality.level_db,
                    s.quality.snr_db,
                    s.problems
                );
                for st in &s.stretches {
                    println!(
                        "    {:6.2}–{:6.2} s score {:.2} speech {:.1} s level {:.0} dB SNR {:.0} dB clipped {:.4} dips {:.2} consonants {:.2} {:?}",
                        st.start,
                        st.end,
                        st.score,
                        st.quality.speech_seconds,
                        st.quality.level_db,
                        st.quality.snr_db,
                        st.quality.clipped,
                        st.quality.low_energy,
                        st.quality.consonants,
                        st.problems
                    );
                }
            }
        }
    }
}
