// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Italian grapheme-to-phoneme conversion: normalized words → IPA phonemes with stress marks.
//!
//! Spelling rules give the sounds; stress, open/closed e and o and z voicing come from the
//! written accent, then a lexicon, then word endings, then the default (next-to-last syllable).
//! No model and no espeak-ng: this replaces espeak-ng in front of the voice.

mod data;
pub mod rules;

pub use rules::{Hint, Stress};

const PUNCTUATION: &[char] = &[
    ',', '.', ';', ':', '?', '!', '…', '—', '"', '“', '”', '(', ')',
];

/// Words said without stress inside a sentence.
fn unstressed(word: &str) -> bool {
    matches!(
        word,
        "il" | "lo"
            | "la"
            | "i"
            | "gli"
            | "le"
            | "un"
            | "di"
            | "a"
            | "da"
            | "in"
            | "con"
            | "su"
            | "per"
            | "tra"
            | "fra"
            | "e"
            | "ed"
            | "o"
            | "od"
            | "ad"
            | "ma"
            | "se"
            | "che"
            | "non"
            | "mi"
            | "ti"
            | "si"
            | "ci"
            | "vi"
            | "ne"
            | "me"
            | "te"
            | "ce"
            | "ve"
            | "al"
            | "ai"
            | "del"
            | "dei"
            | "nel"
            | "nei"
            | "dal"
            | "dai"
            | "sul"
            | "sui"
            | "col"
            | "coi"
            | "ho"
            | "hai"
            | "ha"
            | "hanno"
            | "è"
    )
}

/// Words with a lighter, secondary stress.
fn secondary(word: &str) -> bool {
    matches!(
        word,
        "una"
            | "uno"
            | "della"
            | "dello"
            | "delle"
            | "degli"
            | "alla"
            | "alle"
            | "allo"
            | "agli"
            | "nella"
            | "nelle"
            | "nello"
            | "negli"
            | "dalla"
            | "dalle"
            | "dallo"
            | "dagli"
            | "sulla"
            | "sulle"
            | "sullo"
            | "sugli"
            | "questo"
            | "questa"
            | "questi"
            | "queste"
            | "sono"
            | "siete"
            | "siamo"
            | "lui"
            | "nostra"
            | "nostro"
            | "nostri"
            | "nostre"
            | "vostra"
            | "vostro"
            | "senza"
            | "perché"
    )
}

/// How a word is stressed inside a sentence.
pub fn stress_level(word: &str) -> Stress {
    if unstressed(word) {
        Stress::None
    } else if secondary(word) {
        Stress::Secondary
    } else {
        Stress::Primary
    }
}

/// Stress hint for a word: lexicon first, then its ending.
pub fn hint(word: &str) -> Hint {
    data::lexicon(word)
        .or_else(|| data::suffix(word))
        .unwrap_or_default()
}

/// Phonemes of one word, with sentence stress chosen from the word itself.
pub fn word(word: &str) -> String {
    let lower = word.to_lowercase();
    if lower == "po'" {
        return "pˈɔ".into();
    }
    // Elision: "l'ancora", "c'è", "un'ora" are one phonetic word; stress comes from the part
    // after the apostrophe, counted from the end, so it is the same in the joined word.
    let (rest, joined) = match lower.rsplit_once('\'') {
        Some((prefix, rest)) if !rest.is_empty() => (rest.to_string(), format!("{prefix}{rest}")),
        _ => (
            lower.trim_end_matches('\'').to_string(),
            lower.trim_end_matches('\'').to_string(),
        ),
    };
    let stress = if rest == "è" && rest != joined {
        Stress::Primary
    } else {
        stress_level(&rest)
    };
    let mut h = hint(&rest);
    if h.stress_from_end.is_none() && rest != joined {
        h.stress_from_end = rules::default_stress_from_end(&rest);
    }
    rules::word(&joined, h, stress)
}

/// Phonemes of a normalized sentence: words separated by spaces, punctuation kept in place.
pub fn phonemize(sentence: &str) -> String {
    let mut out = String::with_capacity(sentence.len() * 2);
    for token in sentence.split_whitespace() {
        let core = token.trim_end_matches(PUNCTUATION);
        let punct = &token[core.len()..];
        let core = core.trim_start_matches(PUNCTUATION);
        if core.is_empty() {
            out.push_str(punct);
            continue;
        }
        if !out.is_empty() {
            out.push(' ');
        }
        out.push_str(&word(core));
        out.push_str(punct);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::phonemize;

    #[test]
    fn sentences() {
        assert_eq!(phonemize("sì, va bene."), "sˈi, vˈa bˈɛne.");
        assert_eq!(phonemize("c'è tempo"), "ʧˈɛ tˈɛmpo");
        assert_eq!(
            phonemize("non ho capito l'ultimo punto?"),
            "non o kapˈito lʊltˈimo pˈunto?"
        );
        assert_eq!(phonemize("un'ora"), "ʊnˈora");
    }
}
