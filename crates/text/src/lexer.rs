// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Splits cleaned text into tokens: words, numbers, punctuation, symbols, addresses,
//! abbreviations and line breaks.

use crate::lexicon;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Kind {
    /// Letters, possibly followed by digits ("covid19"); an elided word keeps its apostrophe
    /// ("l'") and the next token is glued to it.
    Word,
    /// Digits with inner separators: "1.250,50", "10:30", "15/03/2027", "3-0".
    Number,
    /// `,` `.` `;` `:` `?` `!` `…`; brackets and dashes become `,`.
    Punct,
    /// One symbol character: € $ £ % ‰ & + - = @ # * / ~ × ° º ª § < >.
    Symbol,
    /// Web address or e-mail address.
    Address,
    /// Abbreviation found in the lexicon, with its dots ("dott.", "p.es.").
    Abbrev,
    /// Line break: always ends a sentence.
    Break,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Token {
    pub text: String,
    pub kind: Kind,
    /// Whether white space separates this token from the previous one.
    pub space_before: bool,
}

impl Token {
    pub fn is(&self, kind: Kind) -> bool {
        self.kind == kind
    }
    pub fn is_symbol(&self, c: char) -> bool {
        self.kind == Kind::Symbol && self.text.starts_with(c)
    }
    pub fn first_upper(&self) -> bool {
        self.text.chars().next().is_some_and(char::is_uppercase)
    }
}

const SYMBOLS: &str = "€$£¥%‰&+-=@#*/\\~×°ºª§<>^|_";
const TRAILING: &[char] = &['.', ',', ';', ':', '!', '?', ')', ']', '}', '\'', '…'];
const TLDS: &[&str] = &[
    "it", "com", "org", "net", "eu", "io", "info", "edu", "gov", "ch", "de", "fr", "uk", "es",
    "app", "dev", "ai", "me", "tv",
];

fn is_letter(c: char) -> bool {
    c.is_alphabetic()
}

fn is_address(run: &str) -> bool {
    let lower = run.to_lowercase();
    if lower.starts_with("http://") || lower.starts_with("https://") || lower.starts_with("www.") {
        return lower.len() > 4;
    }
    if let Some((user, domain)) = lower.split_once('@') {
        return !user.is_empty()
            && domain.contains('.')
            && domain.split('.').all(|l| !l.is_empty())
            && user.chars().any(is_letter);
    }
    let labels: Vec<&str> = lower.split('.').collect();
    labels.len() >= 2
        && labels
            .iter()
            .all(|l| !l.is_empty() && l.chars().all(|c| c.is_alphanumeric() || c == '-'))
        && labels[0].chars().count() >= 2
        && labels[0].chars().any(is_letter)
        && TLDS.contains(labels.last().unwrap_or(&""))
}

/// Tokenizes text produced by [`crate::clean::clean`].
pub fn lex(text: &str) -> Vec<Token> {
    let chars: Vec<char> = text.chars().collect();
    let mut tokens: Vec<Token> = Vec::new();
    let mut i = 0;
    let mut space = true;
    let push = |tokens: &mut Vec<Token>, text: String, kind: Kind, space: &mut bool| {
        tokens.push(Token {
            text,
            kind,
            space_before: *space,
        });
        *space = false;
    };
    while i < chars.len() {
        let c = chars[i];
        if c == '\n' {
            push(&mut tokens, "\n".into(), Kind::Break, &mut space);
            space = true;
            i += 1;
            continue;
        }
        if c == ' ' {
            space = true;
            i += 1;
            continue;
        }

        // Addresses: the whole run up to the next space, minus trailing punctuation.
        if space || tokens.last().is_some_and(|t| t.is(Kind::Punct)) {
            let end = chars[i..]
                .iter()
                .position(|&c| c == ' ' || c == '\n')
                .map_or(chars.len(), |p| i + p);
            let mut run_end = end;
            while run_end > i && TRAILING.contains(&chars[run_end - 1]) {
                run_end -= 1;
            }
            let run: String = chars[i..run_end].iter().collect();
            if run.contains(['.', '@']) && is_address(&run) {
                push(&mut tokens, run, Kind::Address, &mut space);
                i = run_end;
                continue;
            }
        }

        if c == 'ª' || c == 'º' {
            push(&mut tokens, c.to_string(), Kind::Symbol, &mut space);
            i += 1;
            continue;
        }

        if is_letter(c) {
            // Abbreviations: the longest lexicon entry among the prefixes of a run of letters,
            // dots and slashes that end with a dot (or the whole run, for "c/o").
            let mut end = i;
            while end < chars.len()
                && (is_letter(chars[end])
                    || chars[end] == '.'
                    || chars[end] == '/'
                    || chars[end] == '°')
            {
                end += 1;
            }
            if chars[i..end]
                .iter()
                .any(|&c| c == '.' || c == '/' || c == '°')
            {
                let mut found = None;
                for stop in (i + 1..=end).rev() {
                    let last = chars[stop - 1];
                    if !(last == '.' || last == '°' || stop == end) {
                        continue;
                    }
                    let candidate: String = chars[i..stop].iter().collect();
                    // A lone letter before a dot is only an abbreviation if listed ("p.", "n.").
                    if lexicon::abbreviation(&candidate.to_lowercase()).is_some() {
                        found = Some((candidate, stop));
                        break;
                    }
                }
                if let Some((text, stop)) = found {
                    push(&mut tokens, text, Kind::Abbrev, &mut space);
                    i = stop;
                    continue;
                }
            }

            // Word: letters, then letters or digits.
            let start = i;
            while i < chars.len()
                && (is_letter(chars[i])
                    || chars[i].is_ascii_digit()
                    || chars[i] == '²'
                    || chars[i] == '³')
                && chars[i] != 'ª'
                && chars[i] != 'º'
            {
                i += 1;
            }
            let mut word: String = chars[start..i].iter().collect();
            if i < chars.len() && chars[i] == '\'' {
                let next = chars.get(i + 1).copied().unwrap_or(' ');
                word.push('\'');
                i += 1;
                push(&mut tokens, word, Kind::Word, &mut space);
                if is_letter(next) || next.is_ascii_digit() {
                    // Elision ("l'ancora", "dell'8"): the next token is glued to this one.
                    space = false;
                }
                continue;
            }
            push(&mut tokens, word, Kind::Word, &mut space);
            continue;
        }

        if c.is_ascii_digit() {
            let start = i;
            while i < chars.len() {
                let d = chars[i];
                let separator =
                    ".,:/-".contains(d) && chars.get(i + 1).is_some_and(char::is_ascii_digit);
                if d.is_ascii_digit() || separator {
                    i += 1;
                } else {
                    break;
                }
            }
            push(
                &mut tokens,
                chars[start..i].iter().collect(),
                Kind::Number,
                &mut space,
            );
            // "3x4": a glued x between numbers is a multiplication sign.
            if i + 1 < chars.len()
                && (chars[i] == 'x' || chars[i] == 'X')
                && chars[i + 1].is_ascii_digit()
            {
                push(&mut tokens, "×".into(), Kind::Symbol, &mut space);
                i += 1;
            }
            continue;
        }

        // A year written '80.
        if c == '\''
            && chars.get(i + 1).is_some_and(char::is_ascii_digit)
            && chars.get(i + 2).is_some_and(char::is_ascii_digit)
            && !chars.get(i + 3).is_some_and(char::is_ascii_digit)
        {
            push(
                &mut tokens,
                chars[i + 1..i + 3].iter().collect(),
                Kind::Number,
                &mut space,
            );
            i += 3;
            continue;
        }

        if c == '.' {
            let mut end = i;
            while end < chars.len() && chars[end] == '.' {
                end += 1;
            }
            let p = if end - i >= 2 { "…" } else { "." };
            push(&mut tokens, p.into(), Kind::Punct, &mut space);
            i = end;
            continue;
        }
        if c == '?' || c == '!' {
            // "?!", "!!!", "??" → the strongest mark.
            let mut end = i;
            let mut question = false;
            while end < chars.len() && (chars[end] == '?' || chars[end] == '!') {
                question |= chars[end] == '?';
                end += 1;
            }
            push(
                &mut tokens,
                if question { "?" } else { "!" }.into(),
                Kind::Punct,
                &mut space,
            );
            i = end;
            continue;
        }
        if ",;:…".contains(c) {
            push(&mut tokens, c.to_string(), Kind::Punct, &mut space);
            i += 1;
            continue;
        }
        if "()[]{}—".contains(c) {
            push(&mut tokens, ",".into(), Kind::Punct, &mut space);
            i += 1;
            continue;
        }
        if c == '-' {
            let spaced_after = chars.get(i + 1).is_none_or(|&n| n == ' ' || n == '\n');
            let digit_after = chars.get(i + 1).is_some_and(char::is_ascii_digit);
            if space && spaced_after {
                push(&mut tokens, ",".into(), Kind::Punct, &mut space);
            } else if digit_after && (space || tokens.is_empty()) {
                push(&mut tokens, "-".into(), Kind::Symbol, &mut space);
            } else {
                // Hyphen inside a compound ("socio-economico"): a word break.
                space = true;
            }
            i += 1;
            continue;
        }
        if SYMBOLS.contains(c) {
            push(&mut tokens, c.to_string(), Kind::Symbol, &mut space);
            i += 1;
            continue;
        }
        // Anything else (stray apostrophes, unknown signs) is dropped.
        i += 1;
    }
    tokens
}

#[cfg(test)]
mod tests {
    use super::*;

    fn kinds(text: &str) -> Vec<(String, Kind)> {
        lex(text).into_iter().map(|t| (t.text, t.kind)).collect()
    }

    #[test]
    fn lexes() {
        use Kind::*;
        assert_eq!(
            kinds("Il Dott. Rossi paga 1.250,50 €."),
            vec![
                ("Il".into(), Word),
                ("Dott.".into(), Abbrev),
                ("Rossi".into(), Word),
                ("paga".into(), Word),
                ("1.250,50".into(), Number),
                ("€".into(), Symbol),
                (".".into(), Punct),
            ]
        );
        assert_eq!(
            kinds("l'ancora, scrivi a mario.rossi@gmail.com!"),
            vec![
                ("l'".into(), Word),
                ("ancora".into(), Word),
                (",".into(), Punct),
                ("scrivi".into(), Word),
                ("a".into(), Word),
                ("mario.rossi@gmail.com".into(), Address),
                ("!".into(), Punct),
            ]
        );
        assert_eq!(
            kinds("Allora... ok?!"),
            vec![
                ("Allora".into(), Word),
                ("…".into(), Punct),
                ("ok".into(), Word),
                ("?".into(), Punct)
            ]
        );
        assert_eq!(
            kinds("3x4"),
            vec![
                ("3".into(), Number),
                ("×".into(), Symbol),
                ("4".into(), Number)
            ]
        );
        assert_eq!(
            kinds("anni '80"),
            vec![("anni".into(), Word), ("80".into(), Number)]
        );
        assert_eq!(
            kinds("socio-economico"),
            vec![("socio".into(), Word), ("economico".into(), Word)]
        );
        assert_eq!(
            kinds("-5 gradi"),
            vec![
                ("-".into(), Symbol),
                ("5".into(), Number),
                ("gradi".into(), Word)
            ]
        );
        assert_eq!(
            kinds("p.es. ecc."),
            vec![("p.es.".into(), Abbrev), ("ecc.".into(), Abbrev)]
        );
        let t = lex("dell'8%");
        assert!(!t[1].space_before && t[1].kind == Number);
    }
}
