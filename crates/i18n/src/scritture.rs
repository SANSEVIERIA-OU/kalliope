// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! What the program knows of a language beyond its words: the script, and the direction of writing.

/// The writing systems the window has a typeface for (`design-system/caratteri/LEGGIMI.md`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Script {
    Latin,
    Greek,
    Cyrillic,
    Arabic,
    Devanagari,
    Bengali,
    /// No file: the system's Chinese face, as on the website.
    Han,
}

/// What the program knows of a language beyond its words: the script, and whether it is written from right to left.
/// `tools/test_traduzioni_app.py` keeps this equal to CLDR and to the `:lang()` rules of `design-system/token.css`.
/// A language that is not here is Latin and left to right.
pub const KNOWN: &[(&str, Script, bool)] = &[
    ("ar", Script::Arabic, true),
    ("bg", Script::Cyrillic, false),
    ("bn", Script::Bengali, false),
    ("el", Script::Greek, false),
    ("hi", Script::Devanagari, false),
    ("ur", Script::Arabic, true),
    ("zh", Script::Han, false),
    // the pseudo-languages (built only with the `pseudo` feature)
    ("ar-XB", Script::Arabic, true),
];

pub fn script_of(code: &str) -> Script {
    KNOWN
        .iter()
        .find(|(c, ..)| *c == code)
        .map_or(Script::Latin, |(_, s, _)| *s)
}

pub fn is_rtl(code: &str) -> bool {
    KNOWN.iter().any(|(c, _, rtl)| *c == code && *rtl)
}

/// The mark that opens every translated text of a language written from right to left: the Unicode right-to-left mark (U+200F,
/// invisible, a strong right-to-left character). A paragraph takes its direction from its first strong letter, so a text that
/// begins with a word in Latin («Kalliope è…») would run from left to right and sit on the left of a mirrored window; the
/// mark makes the paragraph right to left whatever it begins with, and only that: the letters still order themselves.
pub const RLM: char = '\u{200f}';

/// The marks that isolate what fills a placeholder in a text written from right to left (U+2068 first strong isolate, U+2069 pop
/// directional isolate): a Latin name, a file or a number keeps its own direction, and the punctuation around it stays where the
/// sentence puts it instead of moving to the other end of the line.
pub const FSI: char = '\u{2068}';
pub const PDI: char = '\u{2069}';
