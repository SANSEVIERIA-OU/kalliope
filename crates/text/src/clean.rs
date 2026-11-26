// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Character clean-up before tokenizing: one form per character, no emoji, no quotes.

use std::ops::Range;

/// Precomposed vowel for a vowel followed by a combining grave or acute accent.
fn compose(base: char, mark: char) -> Option<char> {
    let grave = mark == '\u{300}';
    Some(match (base, grave) {
        ('a', _) => 'à',
        ('e', true) => 'è',
        ('e', false) => 'é',
        ('i', _) => 'ì',
        ('o', true) => 'ò',
        ('o', false) => 'ó',
        ('u', _) => 'ù',
        ('A', _) => 'À',
        ('E', true) => 'È',
        ('E', false) => 'É',
        ('I', _) => 'Ì',
        ('O', true) => 'Ò',
        ('O', false) => 'Ó',
        ('U', _) => 'Ù',
        _ => return None,
    })
}

/// Pictographs and other symbols that a voice should not read out.
fn is_pictograph(c: char) -> bool {
    matches!(c as u32,
        0x1F000..=0x1FAFF   // emoji, flags, pictographs
        | 0x2600..=0x27BF   // miscellaneous symbols, dingbats
        | 0x2B00..=0x2BFF   // stars, arrows
        | 0x2190..=0x21FF   // arrows
        | 0x2300..=0x23FF   // technical symbols (⌚, ⏰)
        | 0xFE00..=0xFE0F   // variation selectors
        | 0x200B..=0x200D   // zero-width characters
        | 0x2060
        | 0x20E3            // keycap
        | 0xE0020..=0xE007F // tags
        | 0xA9 | 0xAE | 0x2122 // © ® ™
    )
}

/// Text emoticons, removed when they stand alone between spaces.
fn is_emoticon(s: &str) -> bool {
    matches!(
        s,
        ":)" | ":-)"
            | ":("
            | ":-("
            | ";)"
            | ";-)"
            | ":D"
            | ":-D"
            | ":P"
            | ":-P"
            | ":p"
            | ":-p"
            | "xD"
            | "XD"
            | ":o"
            | ":O"
            | "<3"
            | ":*"
            | "^^"
            | "^_^"
            | "-_-"
            | ":/"
            | ":-/"
            | ":')"
            | ":'("
            | "=)"
            | "(:"
            | "):"
    )
}

/// Normalizes characters: composes accents, unifies apostrophes, dashes and spaces, removes
/// emoji, emoticons and quotation marks.
#[cfg(test)]
pub fn clean(input: &str) -> String {
    clean_spans(input).into_iter().map(|(c, _)| c).collect()
}

/// [`clean`], with the byte range of `input` each character of the result comes from.
pub fn clean_spans(input: &str) -> Vec<(char, Range<usize>)> {
    let mut out: Vec<(char, Range<usize>)> = Vec::with_capacity(input.len());
    for (at, c) in input.char_indices() {
        let src = at..at + c.len_utf8();
        let mut push = |c: char| out.push((c, src.clone()));
        match c {
            '\u{300}' | '\u{301}' => {
                if let Some((prev, from)) = out.pop() {
                    out.push((compose(prev, c).unwrap_or(prev), from.start..src.end));
                }
            }
            '\u{302}'..='\u{36F}' => {}
            '’' | '‘' | 'ʼ' | '`' | '´' | '′' => push('\''),
            '“' | '”' | '„' | '«' | '»' | '"' | '‹' | '›' => push(' '),
            '‐' | '‑' | '‒' => push('-'),
            '–' | '—' | '―' => push('—'),
            'í' => push('ì'),
            'ú' => push('ù'),
            'á' => push('à'),
            'Í' => push('Ì'),
            'Ú' => push('Ù'),
            'Á' => push('À'),
            '\r' => {}
            '\n' => push('\n'),
            c if c.is_whitespace() => push(' '),
            c if is_pictograph(c) => push(' '),
            c if c.is_control() => {}
            c => push(c),
        }
    }
    // Drop stand-alone emoticons, keeping line breaks; one space between words.
    let mut result: Vec<(char, Range<usize>)> = Vec::with_capacity(out.len());
    for (n, line) in out.split(|(c, _)| *c == '\n').enumerate() {
        if n > 0 {
            let at = result.last().map_or(0, |(_, r)| r.end);
            result.push(('\n', at..at));
        }
        let mut first = true;
        for word in line.split(|(c, _)| *c == ' ') {
            let text: String = word.iter().map(|(c, _)| *c).collect();
            if text.is_empty() || is_emoticon(&text) {
                continue;
            }
            if !first {
                let at = result.last().map_or(0, |(_, r)| r.end);
                result.push((' ', at..at));
            }
            first = false;
            result.extend_from_slice(word);
        }
    }
    // Hyphenated loanwords read as one word.
    for (from, to) in [
        ("e-mail", "email"),
        ("E-mail", "email"),
        ("wi-fi", "wifi"),
        ("Wi-Fi", "wifi"),
    ] {
        let from: Vec<char> = from.chars().collect();
        let mut i = 0;
        while i + from.len() <= result.len() {
            if result[i..i + from.len()]
                .iter()
                .map(|(c, _)| *c)
                .eq(from.iter().copied())
            {
                let kept: Vec<Range<usize>> = result[i..i + from.len()]
                    .iter()
                    .filter(|(c, _)| *c != '-')
                    .map(|(_, r)| r.clone())
                    .collect();
                let replaced: Vec<(char, Range<usize>)> = to.chars().zip(kept).collect();
                let n = replaced.len();
                result.splice(i..i + from.len(), replaced);
                i += n;
            } else {
                i += 1;
            }
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::{clean, clean_spans};

    #[test]
    fn cleans() {
        assert_eq!(clean("perche\u{301} e\u{300}"), "perché è");
        assert_eq!(clean("l’ancora"), "l'ancora");
        assert_eq!(clean("«ciao»  a   tutti 😀"), "ciao a tutti");
        assert_eq!(clean("ok :) a dopo"), "ok a dopo");
        assert_eq!(clean("alle 10:30"), "alle 10:30");
        assert_eq!(clean("riga uno\nriga due"), "riga uno\nriga due");
        assert_eq!(clean("così – direi"), "così — direi");
        assert_eq!(clean("l'e-mail e il Wi-Fi"), "l'email e il wifi");
        assert_eq!(clean(":) ciao"), "ciao");
    }

    #[test]
    fn every_character_knows_where_it_was_typed() {
        let input = "«Perche\u{301}» 😀 l’e-mail";
        let out = clean_spans(input);
        let text: String = out.iter().map(|(c, _)| *c).collect();
        assert_eq!(text, "Perché l'email");
        let src = |k: usize| &input[out[k].1.clone()];
        assert_eq!(src(0), "P");
        assert_eq!(src(5), "e\u{301}");
        assert_eq!(src(8), "’");
        assert_eq!(src(9), "e");
        assert_eq!(src(10), "m");
    }
}
