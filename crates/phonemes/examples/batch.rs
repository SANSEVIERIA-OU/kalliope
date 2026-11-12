// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Development tool: phonemes for many words, one per input line.
//!
//! `word`             full pipeline (lexicon, endings, rules)
//! `word \t -`        rules only, default stress, no data
//! `word \t K \t Q \t Z` rules only, stress on the letter K from the end, stressed e/o quality Q,
//!                    z voicing Z ("dt…"), each "-" when not given
//! `?word \t K`       syllables after the letter K from the end, or "-"

use kalliope_phonemes::{Hint, rules, stress_level, word};
use std::io::{BufRead, BufWriter, Write};

fn main() {
    let stdin = std::io::stdin();
    let mut out = BufWriter::new(std::io::stdout().lock());
    for line in stdin.lock().lines().map_while(Result::ok) {
        let mut f = line.split('\t');
        let w = f.next().unwrap_or("");
        if let Some(w) = w.strip_prefix('?') {
            let k = f.next().and_then(|k| k.parse().ok()).unwrap_or(0);
            let n = rules::syllables_after(w, k).map_or("-".to_string(), |n| n.to_string());
            let _ = writeln!(out, "{n}");
            continue;
        }
        let p = match f.next() {
            None => word(w),
            Some(k) => {
                let mut hint = Hint {
                    stress_from_end: k.parse().ok(),
                    ..Hint::default()
                };
                for c in f.next().unwrap_or("-").chars() {
                    match c {
                        'e' | 'ɛ' => hint.quality_e = Some(c),
                        'o' | 'ɔ' => hint.quality_o = Some(c),
                        _ => {}
                    }
                }
                if let Some(z) = f.next().filter(|z| *z != "-") {
                    hint.z_voiced = Some(
                        z.chars()
                            .enumerate()
                            .filter(|(_, c)| *c == 'd')
                            .fold(0, |b, (i, _)| b | 1 << i),
                    );
                    hint.z_groups = z.chars().count() as u8;
                }
                rules::word(w, hint, stress_level(w))
            }
        };
        let _ = writeln!(out, "{p}");
    }
}
