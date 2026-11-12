// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
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

/// Splits `input` into sentences in spoken form: lower case, numbers and abbreviations written
/// out as words, emoji removed, punctuation kept.
pub fn normalize(input: &str) -> Vec<String> {
    let cleaned = clean::clean(input);
    let tokens = lexer::lex(&cleaned);
    verbalize::verbalize(&tokens)
}
