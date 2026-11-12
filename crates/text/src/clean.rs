// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Character clean-up before tokenizing: one form per character, no emoji, no quotes.

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
pub fn clean(input: &str) -> String {
    let mut out = String::with_capacity(input.len());
    for c in input.chars() {
        match c {
            '\u{300}' | '\u{301}' => {
                if let Some(prev) = out.pop() {
                    out.push(compose(prev, c).unwrap_or(prev));
                }
            }
            '\u{302}'..='\u{36F}' => {}
            '’' | '‘' | 'ʼ' | '`' | '´' | '′' => out.push('\''),
            '“' | '”' | '„' | '«' | '»' | '"' | '‹' | '›' => out.push(' '),
            '‐' | '‑' | '‒' => out.push('-'),
            '–' | '—' | '―' => out.push('—'),
            'í' => out.push('ì'),
            'ú' => out.push('ù'),
            'á' => out.push('à'),
            'Í' => out.push('Ì'),
            'Ú' => out.push('Ù'),
            'Á' => out.push('À'),
            '\r' => {}
            '\n' => out.push('\n'),
            c if c.is_whitespace() => out.push(' '),
            c if is_pictograph(c) => out.push(' '),
            c if c.is_control() => {}
            c => out.push(c),
        }
    }
    // Drop stand-alone emoticons, keeping line breaks.
    let mut result = String::with_capacity(out.len());
    for (n, line) in out.split('\n').enumerate() {
        if n > 0 {
            result.push('\n');
        }
        let kept: Vec<&str> = line
            .split(' ')
            .filter(|w| !w.is_empty() && !is_emoticon(w))
            .collect();
        result.push_str(&kept.join(" "));
    }
    // Hyphenated loanwords read as one word.
    for (from, to) in [
        ("e-mail", "email"),
        ("E-mail", "email"),
        ("wi-fi", "wifi"),
        ("Wi-Fi", "wifi"),
    ] {
        if result.contains(from) {
            result = result.replace(from, to);
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::clean;

    #[test]
    fn cleans() {
        assert_eq!(clean("perche\u{301} e\u{300}"), "perché è");
        assert_eq!(clean("l’ancora"), "l'ancora");
        assert_eq!(clean("«ciao»  a   tutti 😀"), "ciao a tutti");
        assert_eq!(clean("ok :) a dopo"), "ok a dopo");
        assert_eq!(clean("alle 10:30"), "alle 10:30");
        assert_eq!(clean("riga uno\nriga due"), "riga uno\nriga due");
        assert_eq!(clean("così – direi"), "così — direi");
    }
}
