// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Pronunciation data compiled into the binary: a lexicon of words whose stress, vowel quality
//! or z voicing the rules get wrong, and a table of word endings that predict stress.
//!
//! Both files are sorted tab-separated text, searched in place without building an index.
//! They are derived from Wiktionary and licensed CC BY-SA 4.0; see `data/README.md`.
//!
//! A third file, written for Kalliope, gives the whole pronunciation of foreign words that
//! people say in meetings ("zoom", "computer"), as an Italian speaker says them.

use crate::rules::Hint;
use std::cmp::Ordering;

static LEXICON: &str = include_str!("../data/lexicon.tsv");
static SUFFIXES: &str = include_str!("../data/suffixes.tsv");
static LOANWORDS: &str = include_str!("../data/loanwords.tsv");

/// Binary search over sorted `key\tvalue` lines.
fn lookup<'a>(data: &'a str, key: &str) -> Option<&'a str> {
    let bytes = data.as_bytes();
    let (mut lo, mut hi) = (0usize, bytes.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let start = bytes[..mid]
            .iter()
            .rposition(|&b| b == b'\n')
            .map_or(0, |p| p + 1);
        let end = bytes[start..]
            .iter()
            .position(|&b| b == b'\n')
            .map_or(bytes.len(), |p| start + p);
        let line = &data[start..end];
        let (k, rest) = line.split_once('\t').unwrap_or((line, ""));
        match k.cmp(key) {
            Ordering::Equal => return Some(rest),
            Ordering::Less => lo = end + 1,
            Ordering::Greater => hi = start,
        }
    }
    None
}

/// Reads a quality field: any of e/ɛ and o/ɔ, or "-".
fn set_quality(hint: &mut Hint, field: &str) {
    for c in field.chars() {
        match c {
            'e' | 'ɛ' => hint.quality_e = Some(c),
            'o' | 'ɔ' => hint.quality_o = Some(c),
            _ => {}
        }
    }
}

/// Parses `stress \t quality \t z`, each "-" when unknown; z is one letter per z group,
/// "d" for ʣ and "t" for ʦ.
fn parse(fields: &str) -> Hint {
    let mut f = fields.split('\t');
    let stress = f.next().and_then(|s| s.parse().ok());
    let mut hint = Hint {
        stress_from_end: stress,
        ..Hint::default()
    };
    set_quality(&mut hint, f.next().unwrap_or("-"));
    if let Some(z) = f.next().filter(|z| *z != "-" && !z.is_empty()) {
        let mut bits = 0u32;
        for (k, c) in z.chars().take(32).enumerate() {
            if c == 'd' {
                bits |= 1 << k;
            }
        }
        hint.z_voiced = Some(bits);
        hint.z_groups = z.chars().count().min(32) as u8;
    }
    hint
}

pub fn lexicon(word: &str) -> Option<Hint> {
    lookup(LEXICON, word).map(parse)
}

/// Phonemes of a foreign word whose spelling the Italian rules cannot read: "zoom" → ʣˈum.
pub fn loanword(word: &str) -> Option<&'static str> {
    lookup(LOANWORDS, word)
}

/// Hint from the longest known ending of `word`: lines are `ending \t syllable-from-end \t
/// quality`, where the syllable is counted from the end (1 = next-to-last).
pub fn suffix(word: &str) -> Option<Hint> {
    let chars: Vec<(usize, char)> = word.char_indices().collect();
    for len in (1..=chars.len().min(7)).rev() {
        let start = chars[chars.len() - len].0;
        if let Some(fields) = lookup(SUFFIXES, &word[start..]) {
            let mut f = fields.split('\t');
            let nucleus = f.next().and_then(|s| s.parse().ok());
            let mut hint = Hint {
                nucleus_from_end: nucleus,
                ..Hint::default()
            };
            set_quality(&mut hint, f.next().unwrap_or("-"));
            return Some(hint);
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::{LOANWORDS, lookup};

    /// The loanword table must stay sorted for the binary search, give one stressed vowel per
    /// word and use only the phonemes the Italian rules produce, which are the ones the voices
    /// learned for Italian.
    #[test]
    fn loanword_table() {
        const PHONEMES: &str = "aeiouɛɔɪʊjwbdfklmnprstvzɡɲʎʃʦʣʧʤŋɾSːˈ";
        let keys: Vec<&str> = LOANWORDS
            .lines()
            .map(|l| l.split_once('\t').map_or(l, |(k, _)| k))
            .collect();
        assert!(
            keys.windows(2).all(|w| w[0] < w[1]),
            "loanwords.tsv not sorted"
        );
        for line in LOANWORDS.lines() {
            let (word, phonemes) = line.split_once('\t').expect("word\tphonemes");
            assert_eq!(lookup(LOANWORDS, word), Some(phonemes));
            assert_eq!(phonemes.matches('ˈ').count(), 1, "{word}: one stress");
            let odd: String = phonemes
                .chars()
                .filter(|&c| !PHONEMES.contains(c))
                .collect();
            assert!(odd.is_empty(), "{word}: {odd:?} is not an Italian phoneme");
        }
    }

    #[test]
    fn binary_search() {
        let data = "alfa\t1\nbeta\t2\ngamma\t3\nàncora\t4";
        assert_eq!(lookup(data, "alfa"), Some("1"));
        assert_eq!(lookup(data, "beta"), Some("2"));
        assert_eq!(lookup(data, "gamma"), Some("3"));
        assert_eq!(lookup(data, "àncora"), Some("4"));
        assert_eq!(lookup(data, "delta"), None);
        assert_eq!(lookup(data, "zeta"), None);
        assert_eq!(lookup("", "x"), None);
    }
}
