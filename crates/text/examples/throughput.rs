// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! CPU cost of normalization: `cargo run --release -p kalliope-text --example throughput`.

use std::time::Instant;

const TEXT: &[&str] = &[
    "Buongiorno a tutti, scusate il ritardo: avevo un problema con la connessione.",
    "Il preventivo è di 1.250 euro, IVA esclusa, da saldare entro il 15/03/2027.",
    "Perché non ne parliamo giovedì alle 10:30, dopo la riunione con il Dott. Rossi?",
    "cmq nn so xke ma ok, chiamami al 333 1234567 o scrivi a mario.rossi@gmail.com",
    "Secondo me dovremmo rivedere le priorità del progetto, concentrandoci prima sulle funzioni essenziali.",
];

fn main() {
    let chars: usize = TEXT.iter().map(|t| t.chars().count()).sum();
    let rounds = 20_000;
    let start = Instant::now();
    let mut words = 0;
    for _ in 0..rounds {
        for t in TEXT {
            words += kalliope_text::normalize(std::hint::black_box(t)).len();
        }
    }
    let elapsed = start.elapsed().as_secs_f64();
    let per_char_ns = elapsed * 1e9 / (rounds * chars) as f64;
    println!(
        "{:.2} µs per sentence, {per_char_ns:.0} ns per character ({words} sentences)",
        elapsed * 1e6 / (rounds * TEXT.len()) as f64
    );
}
