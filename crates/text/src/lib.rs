// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Italian text normalization: turns what a user types into the words a reader would say.
//!
//! "Il preventivo è di 1.250 €, IVA esclusa." becomes
//! "il preventivo è di mille duecento cinquanta euro, iva esclusa."
//!
//! Rules only, no model: numbers, dates, times, money, percentages, units, phone numbers,
//! addresses, abbreviations, acronyms, Roman numerals, chat shorthand and missing accents.
//! Punctuation that shapes pauses and intonation (`, . ; : ? ! …`) is kept; the text is split
//! into sentences so that speech can start after the first one.

mod clean;
mod lexer;
mod lexicon;
mod numbers;
mod verbalize;

use std::ops::Range;

/// Splits `input` into sentences in spoken form: lower case, numbers and abbreviations written
/// out as words, emoji removed, punctuation kept.
pub fn normalize(input: &str) -> Vec<String> {
    normalize_spans(input).into_iter().map(|s| s.text).collect()
}

/// A sentence in spoken form, and where each of its words was typed.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Sentence {
    pub text: String,
    /// One per word of `text` (see [`words`]), in order: the bytes of the input it was read
    /// from, with the punctuation said after it. The words of one written number, date or
    /// abbreviation share its bytes; a word said before what it was read with ("€ 5", "cinque
    /// euro") still has the bytes of both.
    pub words: Vec<Range<usize>>,
}

/// [`normalize`], with where each spoken word comes from in `input`: so that what has been said
/// can be shown in the text as it was typed, though numbers and abbreviations change its words.
pub fn normalize_spans(input: &str) -> Vec<Sentence> {
    let cleaned = clean::clean_spans(input);
    let text: String = cleaned.iter().map(|(c, _)| *c).collect();
    let tokens = lexer::lex(&text);
    // Characters of the cleaned text, then bytes of the input.
    let bytes = |chars: Range<usize>| -> Range<usize> {
        match (
            cleaned.get(chars.start),
            chars.end.checked_sub(1).and_then(|e| cleaned.get(e)),
        ) {
            (Some((_, a)), Some((_, b))) => a.start..b.end.max(a.start),
            _ => input.len()..input.len(),
        }
    };
    verbalize::verbalize(&tokens)
        .into_iter()
        .map(|s| {
            let words = s
                .text
                .split_whitespace()
                .zip(s.words)
                .filter(|(w, _)| is_word(w))
                .map(|(_, read)| {
                    let first = &tokens[read.start];
                    let last = &tokens[read.end - 1];
                    bytes(first.span.start..last.span.end)
                })
                .collect();
            Sentence {
                text: s.text,
                words,
            }
        })
        .collect()
}

/// The words of a spoken sentence, or of its phonemes: what lies between white space, with a
/// letter or a digit. Pieces of speech cut from a sentence are matched to [`Sentence::words`]
/// by counting these.
pub fn words(text: &str) -> impl Iterator<Item = &str> {
    text.split_whitespace().filter(|w| is_word(w))
}

fn is_word(w: &str) -> bool {
    w.chars().any(char::is_alphanumeric)
}
