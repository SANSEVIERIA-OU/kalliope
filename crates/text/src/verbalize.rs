// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Turns tokens into spoken words, looking at the tokens around each one.

use crate::lexer::{Kind, Token};
use crate::lexicon::{self, Abbreviation, When};
use crate::numbers;

#[derive(Debug, Clone, PartialEq)]
enum Out {
    Word(String),
    /// The next word attaches without a space ("l'" + "ancora").
    Glue,
    Punct(char),
    End,
}

fn strength(c: char) -> u8 {
    match c {
        '?' => 6,
        '!' => 5,
        '.' => 4,
        '…' => 3,
        ':' => 2,
        ';' => 1,
        _ => 0,
    }
}

const TENS: [&str; 8] = [
    "venti",
    "trenta",
    "quaranta",
    "cinquanta",
    "sessanta",
    "settanta",
    "ottanta",
    "novanta",
];
const DATE_WORDS: &[&str] = &[
    "il",
    "dal",
    "al",
    "del",
    "nel",
    "sul",
    "entro",
    "fino",
    "l'",
    "dall'",
    "all'",
    "dell'",
    "nell'",
    "sull'",
    "giorno",
    "lunedì",
    "martedì",
    "mercoledì",
    "giovedì",
    "venerdì",
    "sabato",
    "domenica",
];
const TIME_WORDS: &[&str] = &[
    "alle", "dalle", "ore", "le", "verso", "entro", "h", "all'", "dall'",
];
const PHONE_WORDS: &[&str] = &[
    "telefono",
    "cellulare",
    "fax",
    "whatsapp",
    "tel",
    "cell",
    "numero",
];
const NOT_NAMES: &[&str] = &[
    "il", "lo", "la", "gli", "le", "un", "una", "uno", "di", "da", "in", "con", "su", "per", "tra",
    "fra", "ma", "se", "che", "non", "come", "dove", "quando", "ecco", "anche", "ora", "poi",
    "allora", "questo", "questa", "sono", "ho", "ha", "vado", "siamo", "vitamina", "piano",
    "classe", "lettera", "taglia", "modello", "serie", "tipo", "raggi", "gruppo", "punto", "fase",
];
const SHORT_WORDS: &[&str] = &[
    "NO", "SI", "SÌ", "IO", "TU", "MA", "SE", "DA", "IL", "LA", "LO", "LE", "DI", "IN", "CI", "MI",
    "TI", "VI", "NE", "HO", "HA", "AH", "OH", "EH", "UN", "OK", "AL", "ED", "OD", "SU", "TRA",
    "FRA",
];

fn is_digits(s: &str) -> bool {
    !s.is_empty() && s.bytes().all(|b| b.is_ascii_digit())
}

fn is_thousands(s: &str) -> bool {
    let mut parts = s.split('.');
    let first = parts.next().unwrap_or("");
    let rest: Vec<&str> = parts.collect();
    !rest.is_empty()
        && is_digits(first)
        && first.len() <= 3
        && rest.iter().all(|p| p.len() == 3 && is_digits(p))
}

/// "1.250,50" → ("1250", "50").
fn split_decimal(s: &str) -> Option<(String, &str)> {
    let (int, frac) = s.split_once(',')?;
    if !is_digits(frac) {
        return None;
    }
    if is_digits(int) || is_thousands(int) {
        Some((int.replace('.', ""), frac))
    } else {
        None
    }
}

fn parse_u64(s: &str) -> Option<u64> {
    if s.len() > 15 { None } else { s.parse().ok() }
}

fn roman_value(s: &str) -> Option<u64> {
    let value = |c| match c {
        'I' => 1,
        'V' => 5,
        'X' => 10,
        'L' => 50,
        'C' => 100,
        'D' => 500,
        'M' => 1000,
        _ => 0,
    };
    let digits: Vec<u64> = s.chars().map(value).collect();
    if digits.is_empty() || digits.contains(&0) {
        return None;
    }
    let mut total = 0;
    for (k, &d) in digits.iter().enumerate() {
        if digits.get(k + 1).is_some_and(|&n| n > d) {
            total -= d as i64;
        } else {
            total += d as i64;
        }
    }
    let n = u64::try_from(total).ok().filter(|&n| n > 0 && n < 4000)?;
    // Accept only the canonical spelling, so that words like "DIC" or "MIX" are not numbers.
    (to_roman(n) == s).then_some(n)
}

fn to_roman(mut n: u64) -> String {
    const T: [(u64, &str); 13] = [
        (1000, "M"),
        (900, "CM"),
        (500, "D"),
        (400, "CD"),
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I"),
    ];
    let mut s = String::new();
    for (v, r) in T {
        while n >= v {
            s.push_str(r);
            n -= v;
        }
    }
    s
}

fn is_vowel(c: char) -> bool {
    "aeiouàèéìòóù".contains(c)
}

/// Whether an upper-case acronym can be said as an Italian word ("FIAT") rather than spelled.
fn pronounceable(lower: &str) -> bool {
    let chars: Vec<char> = lower.chars().collect();
    if chars.len() < 3 || !chars.iter().any(|&c| is_vowel(c)) {
        return false;
    }
    let consonant = |c: char| !is_vowel(c);
    if chars.windows(3).any(|w| w.iter().all(|&c| consonant(c))) {
        return false;
    }
    let n = chars.len();
    if consonant(chars[n - 1]) && consonant(chars[n - 2]) {
        return false;
    }
    if consonant(chars[0]) && consonant(chars[1]) {
        let onset: String = chars[..2].iter().collect();
        const ONSETS: &[&str] = &[
            "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr", "sc", "sp",
            "st", "sm", "sn", "sl", "sb", "sd", "sf", "sg", "sv", "ch", "gh", "gn", "ps",
        ];
        return ONSETS.contains(&onset.as_str());
    }
    true
}

/// Collapses runs of three or more equal letters: "ciaooo" → "ciao".
fn collapse_repeats(word: &str) -> String {
    let mut out = String::with_capacity(word.len());
    let chars: Vec<char> = word.chars().collect();
    let mut k = 0;
    while k < chars.len() {
        let c = chars[k];
        let mut run = 1;
        while k + run < chars.len() && chars[k + run] == c {
            run += 1;
        }
        for _ in 0..if run >= 3 { 1 } else { run } {
            out.push(c);
        }
        k += run;
    }
    out
}

fn is_laughter(lower: &str) -> bool {
    let b = lower.as_bytes();
    b.len() >= 4
        && lower.chars().all(|c| matches!(c, 'a' | 'h' | 'e'))
        && lower.contains('h')
        && b.windows(2).all(|w| w[0] != w[1])
}

/// Accent typed as an apostrophe: "e'" → "è", "perche'" → "perché", "piu'" → "più".
fn accent_from_apostrophe(base: &str) -> Option<String> {
    let mut chars: Vec<char> = base.chars().collect();
    let last = chars.pop()?;
    let accented = if last == 'e' && (base.ends_with("che") || base == "ne" || base == "se") {
        'é'
    } else {
        match last {
            'a' => 'à',
            'e' => 'è',
            'i' => 'ì',
            'o' => 'ò',
            'u' => 'ù',
            _ => return None,
        }
    };
    chars.push(accented);
    Some(chars.into_iter().collect())
}

struct Verbalizer<'a> {
    toks: &'a [Token],
    i: usize,
    out: Vec<Out>,
    shouting: bool,
    phone: bool,
    currency_before: Option<(&'static str, &'static str)>,
}

/// Spoken-form sentences for the tokens of one text.
pub fn verbalize(toks: &[Token]) -> Vec<String> {
    let words: Vec<&Token> = toks
        .iter()
        .filter(|t| t.is(Kind::Word) && t.text.chars().filter(|c| c.is_alphabetic()).count() >= 2)
        .collect();
    let upper = words
        .iter()
        .filter(|t| !t.text.chars().any(char::is_lowercase))
        .count();
    let mut v = Verbalizer {
        toks,
        i: 0,
        out: Vec::new(),
        shouting: words.len() >= 2 && upper * 10 >= words.len() * 7,
        phone: false,
        currency_before: None,
    };
    while v.i < toks.len() {
        let t = &toks[v.i];
        if t.kind != Kind::Number {
            v.phone = false;
        }
        match t.kind {
            Kind::Break => v.end(),
            Kind::Punct => v.punctuation(t),
            Kind::Address => v.address(&t.text),
            Kind::Abbrev => v.abbreviation_token(t),
            Kind::Number => v.number(&t.text),
            Kind::Symbol => v.symbol(t),
            Kind::Word => v.word_token(t),
        }
        v.i += 1;
    }
    v.render()
}

impl<'a> Verbalizer<'a> {
    // ----------------------------------------------------------------- output helpers

    fn say(&mut self, words: &str) {
        for w in words.split(' ').filter(|w| !w.is_empty()) {
            self.out.push(Out::Word(w.to_string()));
        }
    }

    fn say_all(&mut self, words: Vec<String>) {
        for w in words {
            self.say(&w);
        }
    }

    fn glue(&mut self) {
        self.out.push(Out::Glue);
    }

    fn punct(&mut self, c: char) {
        match self.out.last_mut() {
            None | Some(Out::End) | Some(Out::Glue) => {}
            Some(Out::Punct(d)) => {
                if strength(c) > strength(*d) {
                    *d = c;
                }
            }
            Some(Out::Word(_)) => self.out.push(Out::Punct(c)),
        }
    }

    fn end(&mut self) {
        if !matches!(self.out.last(), None | Some(Out::End)) {
            self.out.push(Out::End);
        }
    }

    fn render(self) -> Vec<String> {
        let mut sentences = Vec::new();
        let mut cur = String::new();
        let mut glued = false;
        let mut flush = |cur: &mut String| {
            let s = cur.trim().trim_end_matches([',', ';', ':']);
            if s.chars().any(char::is_alphanumeric) {
                sentences.push(s.to_string());
            }
            cur.clear();
        };
        for o in self.out {
            match o {
                Out::Word(w) => {
                    if !cur.is_empty() && !glued {
                        cur.push(' ');
                    }
                    cur.push_str(&w);
                    glued = false;
                }
                Out::Glue => glued = true,
                Out::Punct(c) => {
                    if !cur.is_empty() {
                        cur.push(c);
                    }
                    glued = false;
                }
                Out::End => flush(&mut cur),
            }
        }
        flush(&mut cur);
        sentences
    }

    // ----------------------------------------------------------------- context helpers

    fn at(&self, offset: isize) -> Option<&'a Token> {
        let k = self.i as isize + offset;
        if k < 0 {
            None
        } else {
            self.toks.get(k as usize)
        }
    }

    fn next(&self) -> Option<&'a Token> {
        self.at(1)
    }

    fn prev(&self) -> Option<&'a Token> {
        self.at(-1)
    }

    /// Lower-case text of the token at `offset` if it is a word or abbreviation.
    fn word_at(&self, offset: isize) -> Option<String> {
        self.at(offset)
            .filter(|t| t.is(Kind::Word) || t.is(Kind::Abbrev))
            .map(|t| t.text.to_lowercase())
    }

    fn last_said(&self) -> Option<&str> {
        self.out.iter().rev().find_map(|o| match o {
            Out::Word(w) => Some(w.as_str()),
            _ => None,
        })
    }

    fn next_is_digit_group(&self) -> bool {
        self.next()
            .is_some_and(|n| n.is(Kind::Number) && n.space_before && is_digits(&n.text))
    }

    // ----------------------------------------------------------------- punctuation

    fn punctuation(&mut self, t: &Token) {
        let c = t.text.chars().next().unwrap_or(',');
        self.punct(c);
        // A "…" ends the sentence only before a capital or at the end of the text.
        let ellipsis_ends = || {
            self.next()
                .is_none_or(|n| n.is(Kind::Break) || (n.is(Kind::Word) && n.first_upper()))
        };
        if matches!(c, '.' | '?' | '!') || (c == '…' && ellipsis_ends()) {
            self.end();
        }
    }

    // ----------------------------------------------------------------- addresses

    fn address(&mut self, text: &str) {
        let lower = text.to_lowercase();
        let body = lower
            .trim_start_matches("https://")
            .trim_start_matches("http://");
        let body = body
            .split(['?', '#'])
            .next()
            .unwrap_or("")
            .trim_end_matches('/');
        let mut piece = String::new();
        for c in body.chars() {
            let sep = match c {
                '.' => Some("punto"),
                '@' => Some("chiocciola"),
                '/' => Some("barra"),
                '-' => Some("trattino"),
                '_' => Some("trattino basso"),
                ':' | '=' | '&' => Some(""),
                _ => None,
            };
            match sep {
                Some(word) => {
                    self.address_piece(&piece);
                    piece.clear();
                    self.say(word);
                }
                None => piece.push(c),
            }
        }
        self.address_piece(&piece);
    }

    fn address_piece(&mut self, piece: &str) {
        if piece.is_empty() {
            return;
        }
        if piece == "www" {
            self.say("vu vu vu");
        } else if is_digits(piece) {
            self.say_all(numbers::digits(piece));
        } else if piece.chars().any(|c| c.is_ascii_digit()) {
            self.mixed(piece);
        } else {
            self.say(piece);
        }
    }

    // ----------------------------------------------------------------- abbreviations

    fn abbreviation_token(&mut self, t: &Token) {
        let key = t.text.to_lowercase();
        match lexicon::abbreviation(&key) {
            Some(ab) => self.abbreviation(ab, &t.text, true),
            None => self.plain_word(&t.text),
        }
    }

    fn abbreviation(&mut self, ab: Abbreviation, written: &str, dotted: bool) {
        let next = self.next();
        let applies = match ab.when {
            When::Always => true,
            When::BeforeNumber => next.is_some_and(|n| n.is(Kind::Number)),
            When::AfterNumber => self.prev().is_some_and(|p| p.is(Kind::Number)),
        };
        if !applies {
            let letters = written.trim_end_matches(['.', '°']);
            self.plain_word(letters);
            if written.ends_with('.') {
                self.punct('.');
                self.end();
            }
            return;
        }
        match ab.before_name {
            Some(short) if next.is_some_and(|n| n.is(Kind::Word) && n.first_upper()) => {
                self.say(short)
            }
            _ => self.say(ab.expansion),
        }
        let text_ends = next.is_none_or(|n| n.is(Kind::Break));
        let sentence_follows =
            ab.can_end_sentence && next.is_some_and(|n| n.is(Kind::Word) && n.first_upper());
        if dotted && written.ends_with('.') && (text_ends || sentence_follows) {
            self.punct('.');
            self.end();
        }
    }

    // ----------------------------------------------------------------- symbols

    fn symbol(&mut self, t: &Token) {
        let c = t.text.chars().next().unwrap_or(' ');
        let next = self.next();
        let prev = self.prev();
        let next_number_glued = next.is_some_and(|n| n.is(Kind::Number) && !n.space_before);
        match c {
            '+' | '-' => {
                let at_start = t.space_before
                    || self.i == 0
                    || prev.is_some_and(|p| p.is(Kind::Punct) || p.is(Kind::Break));
                if next_number_glued && at_start {
                    if c == '-' {
                        self.say("meno");
                    } else {
                        self.say("più");
                        let n = &next.map(|n| n.text.as_str()).unwrap_or("");
                        let followed = self
                            .at(2)
                            .is_some_and(|t| t.is(Kind::Number) && t.space_before);
                        if is_digits(n) && n.len() >= 2 && (followed || n.len() >= 8) {
                            self.phone = true;
                        }
                    }
                } else if c == '+' {
                    self.say("più");
                } else if prev.is_some_and(|p| p.is(Kind::Number))
                    && next.is_some_and(|n| n.is(Kind::Number))
                {
                    self.say("meno");
                }
            }
            '€' | '$' | '£' | '¥' => {
                let cur = lexicon::currency(&t.text);
                if next.is_some_and(|n| n.is(Kind::Number)) {
                    self.currency_before = cur;
                } else if let Some((_, plural)) = cur {
                    self.say(plural);
                }
            }
            '%' => self.say("per cento"),
            '‰' => self.say("per mille"),
            '&' => self.say("e"),
            '=' => self.say("uguale"),
            '@' => self.say("chiocciola"),
            '#' if next_number_glued => self.say("numero"),
            '×' => self.say("per"),
            '°' => self.say("gradi"),
            '§' => self.say("paragrafo"),
            '~' if next.is_some_and(|n| n.is(Kind::Number)) => self.say("circa"),
            '<' | '>'
                if prev.is_some_and(|p| p.is(Kind::Number))
                    && next.is_some_and(|n| n.is(Kind::Number)) =>
            {
                self.say(if c == '<' { "minore di" } else { "maggiore di" })
            }
            '/' if !t.space_before
                && prev.is_some_and(|p| p.is(Kind::Word))
                && next.is_some_and(|n| n.is(Kind::Word) && !n.space_before) =>
            {
                self.say("o")
            }
            _ => {}
        }
    }

    // ----------------------------------------------------------------- numbers

    fn number(&mut self, t: &str) {
        if self.phone && is_digits(t) {
            let first = self.last_said() == Some("più");
            if first && t.len() <= 3 {
                self.say_all(numbers::cardinal(parse_u64(t).unwrap_or(0)));
            } else {
                if !first {
                    self.punct(',');
                }
                self.phone_digits(t);
            }
            self.phone = self.next_is_digit_group();
            return;
        }
        self.phone = false;
        let prev = self.word_at(-1);

        if is_digits(t) {
            return self.integer_token(t);
        }
        if is_thousands(t) {
            let n = parse_u64(&t.replace('.', "")).unwrap_or(0);
            return self.integer(n);
        }
        if let Some((int, frac)) = split_decimal(t) {
            return self.decimal(&int, frac);
        }
        self.currency_before = None;
        if let Some((h, m, s)) = parse_time(t, prev.as_deref()) {
            return self.time(h, m, s);
        }
        if let Some((d, m, y)) = parse_date(t) {
            return self.date(d, m, y);
        }
        let two = |sep: char| -> Option<(u64, u64)> {
            let (a, b) = t.split_once(sep)?;
            if b.contains(sep) || !is_digits(a) || !is_digits(b) {
                return None;
            }
            Some((parse_u64(a)?, parse_u64(b)?))
        };
        if let Some((a, b)) = two('/') {
            let date_context = prev.as_deref().is_some_and(|p| DATE_WORDS.contains(&p));
            if date_context && (1..=31).contains(&a) && (1..=12).contains(&b) {
                return self.date(a, b, None);
            }
            if (2..=9).contains(&b) && (1..b).contains(&a) {
                if a == 1 {
                    self.say("un");
                    self.say(&if b == 2 {
                        "mezzo".to_string()
                    } else {
                        numbers::ordinal(b, false)
                    });
                } else {
                    self.say_all(numbers::cardinal(a));
                    self.say(&numbers::denominator_plural(b));
                }
                return;
            }
            self.say_all(numbers::cardinal(a));
            self.say("su");
            self.say_all(numbers::cardinal(b));
            return;
        }
        if let Some((a, b)) = two('-') {
            if b == 0 || a > b {
                self.say_all(numbers::cardinal(a));
                self.say("a");
            } else {
                self.say("da");
                self.say_all(numbers::cardinal(a));
                self.say("a");
            }
            self.say_all(numbers::cardinal(b));
            return;
        }
        if let Some((a, b)) = two(':') {
            self.say_all(numbers::cardinal(a));
            self.say("a");
            self.say_all(numbers::cardinal(b));
            return;
        }
        if let Some((a, b)) = t.split_once('.')
            && is_digits(a)
            && is_digits(b)
        {
            self.say_all(numbers::cardinal(parse_u64(a).unwrap_or(0)));
            self.say("punto");
            self.say_all(numbers::decimals(b));
            return;
        }
        // Anything else (versions, codes): each group, with its separator said.
        let mut group = String::new();
        for c in t.chars().chain(std::iter::once(' ')) {
            if c.is_ascii_digit() {
                group.push(c);
                continue;
            }
            if !group.is_empty() {
                if group.starts_with('0') && group.len() > 1 {
                    self.say_all(numbers::digits(&group));
                } else {
                    self.say_all(numbers::cardinal(parse_u64(&group).unwrap_or(0)));
                }
                group.clear();
            }
            match c {
                '.' => self.say("punto"),
                ',' => self.say("virgola"),
                '/' => self.say("barra"),
                '-' => self.say("trattino"),
                ':' => self.say("a"),
                _ => {}
            }
        }
    }

    fn phone_digits(&mut self, group: &str) {
        for (k, chunk) in numbers::phone_chunks(group).into_iter().enumerate() {
            if k > 0 {
                self.punct(',');
            }
            self.say_all(numbers::digits(chunk));
        }
    }

    fn integer_token(&mut self, t: &str) {
        let next = self.next();
        let phone_word = self.last_said().is_some_and(|w| PHONE_WORDS.contains(&w));
        let mobile = t.len() == 3
            && t.starts_with('3')
            && next.is_some_and(|n| {
                n.is(Kind::Number)
                    && n.space_before
                    && is_digits(&n.text)
                    && (6..=8).contains(&n.text.len())
            });
        let leading_zero = t.len() >= 2 && t.starts_with('0');
        if leading_zero || t.len() >= 9 || mobile || (phone_word && t.len() >= 5) {
            self.currency_before = None;
            self.phone_digits(t);
            self.phone = self.next_is_digit_group();
            return;
        }
        self.integer(parse_u64(t).unwrap_or(0));
    }

    /// Currency written next to the number at `self.i`, consuming it.
    fn take_currency(&mut self) -> Option<(&'static str, &'static str)> {
        if let Some(c) = self.currency_before.take() {
            return Some(c);
        }
        let next = self.next()?;
        let found = match next.kind {
            Kind::Symbol => lexicon::currency(&next.text),
            Kind::Word if matches!(next.text.as_str(), "CHF" | "EUR" | "USD" | "GBP") => {
                lexicon::currency(&next.text)
            }
            _ => None,
        };
        if found.is_some() {
            self.i += 1;
        }
        found
    }

    /// A unit after the number at `self.i`: (tokens used, singular, plural).
    fn unit_after(&self) -> Option<(usize, &'static str, &'static str)> {
        let w = self
            .next()
            .filter(|n| n.is(Kind::Word) || n.is(Kind::Abbrev))?;
        if let (Some(slash), Some(w2)) = (self.at(2), self.at(3))
            && slash.is_symbol('/')
            && !slash.space_before
            && w2.is(Kind::Word)
            && !w2.space_before
            && let Some((s, p, _)) = lexicon::unit(&format!("{}/{}", w.text, w2.text))
        {
            return Some((3, s, p));
        }
        let key = w.text.trim_end_matches('.');
        if key.chars().count() == 1
            && key.chars().all(char::is_uppercase)
            && key != "W"
            && key != "V"
        {
            return None;
        }
        let (s, p, glued_only) = lexicon::unit(key)?;
        if glued_only && w.space_before {
            return None;
        }
        Some((1, s, p))
    }

    /// "1" in front of a noun: "un libro", "uno studente", "una casa", "un'ora".
    fn one_before(&mut self, noun: Option<&str>) {
        let Some(noun) = noun.filter(|w| !lexicon::is_function_word(w)) else {
            return self.say("uno");
        };
        if lexicon::looks_feminine(noun) {
            if lexicon::starts_with_vowel(noun) {
                self.say("un'");
                self.glue();
            } else {
                self.say("una");
            }
        } else if lexicon::takes_uno(noun) {
            self.say("uno");
        } else {
            self.say("un");
        }
    }

    fn integer(&mut self, n: u64) {
        let next = self.next();
        if next.is_some_and(|x| {
            !x.space_before && (x.is_symbol('°') || x.is_symbol('º') || x.is_symbol('ª'))
        }) {
            self.currency_before = None;
            return self.ordinal_or_degrees(n);
        }
        if next.is_some_and(|x| x.is_symbol('%')) {
            self.say_all(numbers::cardinal(n));
            self.say("per cento");
            self.i += 1;
            return;
        }
        if next.is_some_and(|x| x.is_symbol('‰')) {
            self.say_all(numbers::cardinal(n));
            self.say("per mille");
            self.i += 1;
            return;
        }
        if let Some(cur) = self.take_currency() {
            return self.amount(n, None, cur);
        }
        if let Some((used, singular, plural)) = self.unit_after() {
            if n == 1 {
                self.one_before(Some(singular.split(' ').next().unwrap_or(singular)));
                self.say(singular);
            } else {
                self.say_all(numbers::cardinal(n));
                self.say(plural);
            }
            self.i += used;
            return;
        }
        let prev = self.word_at(-1);
        if n == 1 && prev.as_deref().is_some_and(|p| p == "alle" || p == "dalle") {
            self.elide_last();
            self.say("una");
            return;
        }
        let next_word = self
            .word_at(1)
            .filter(|_| next.is_some_and(|x| x.space_before));
        if n <= 31 && next_word.as_deref().is_some_and(lexicon::is_month) {
            if n == 1 {
                self.say("primo");
            } else {
                self.say_all(numbers::cardinal(n));
            }
            return;
        }
        if n == 1 {
            return self.one_before(next_word.as_deref());
        }
        self.say_all(numbers::cardinal(n));
    }

    /// "alle" → "all'" before "una" (one o'clock).
    fn elide_last(&mut self) {
        if let Some(Out::Word(w)) = self.out.last_mut() {
            let elided = match w.as_str() {
                "alle" => Some("all'"),
                "dalle" => Some("dall'"),
                "le" => Some("l'"),
                _ => None,
            };
            if let Some(e) = elided {
                *w = e.to_string();
                self.out.push(Out::Glue);
            }
        }
    }

    fn ordinal_or_degrees(&mut self, n: u64) {
        self.i += 1; // the marker
        let marker = self.toks[self.i].text.clone();
        let after = self.next();
        let degrees_unit = after
            .filter(|a| a.is(Kind::Word) && (a.text == "C" || a.text == "F"))
            .map(|a| a.text.clone());
        if marker != "ª"
            && let Some(unit) = degrees_unit
        {
            self.degrees(n);
            if unit == "F" {
                self.say("fahrenheit");
            }
            self.i += 1;
            return;
        }
        let prev = self
            .at(-2)
            .filter(|t| t.is(Kind::Word))
            .map(|t| t.text.to_lowercase());
        let next_word = after
            .filter(|a| a.is(Kind::Word))
            .map(|a| a.text.to_lowercase());
        let next_is_month = next_word.as_deref().is_some_and(lexicon::is_month);
        let ordinal = marker != "°"
            || prev
                .as_deref()
                .is_some_and(lexicon::is_article_or_preposition)
            || next_is_month
            || next_word.as_deref().is_some_and(lexicon::is_ordinal_noun);
        if ordinal {
            let feminine = marker == "ª"
                || prev.as_deref().is_some_and(lexicon::is_feminine_article)
                || (!next_is_month && next_word.as_deref().is_some_and(lexicon::looks_feminine));
            self.say(&numbers::ordinal(n, feminine));
        } else {
            self.degrees(n);
        }
    }

    fn degrees(&mut self, n: u64) {
        if n == 1 {
            self.say("un grado");
        } else {
            self.say_all(numbers::cardinal(n));
            self.say("gradi");
        }
    }

    /// Money: "un euro", "mille duecento cinquanta euro e cinquanta centesimi".
    fn amount(&mut self, int: u64, frac: Option<&str>, (singular, plural): (&str, &str)) {
        let cents = match frac {
            None => 0,
            Some(f) if f.len() == 1 => parse_u64(f).unwrap_or(0) * 10,
            Some(f) if f.len() == 2 => parse_u64(f).unwrap_or(0),
            Some(f) => {
                // Not cents: a plain decimal amount.
                self.say_all(numbers::cardinal(int));
                self.say("virgola");
                self.say_all(numbers::decimals(f));
                self.say(plural);
                return;
            }
        };
        if int == 1 {
            self.one_before(Some(singular));
            self.say(singular);
        } else if !(int == 0 && cents > 0) {
            self.say_all(numbers::cardinal(int));
            if int >= 1_000_000 && int % 1_000_000 == 0 {
                self.say("di");
            }
            self.say(plural);
        }
        if cents > 0 {
            if int != 0 {
                self.say("e");
            }
            if cents == 1 {
                self.say("un centesimo");
            } else {
                self.say_all(numbers::cardinal(cents));
                self.say("centesimi");
            }
        }
    }

    fn decimal(&mut self, int: &str, frac: &str) {
        let int_value = parse_u64(int).unwrap_or(0);
        if let Some(cur) = self.take_currency() {
            return self.amount(int_value, Some(frac), cur);
        }
        if frac.len() <= 2
            && let Some(next) = self.next()
            && next.is(Kind::Word)
            && let Some(cur) = lexicon::currency(&next.text.to_lowercase())
                .or_else(|| lexicon::currency(&next.text))
        {
            self.i += 1;
            return self.amount(int_value, Some(frac), cur);
        }
        self.say_all(numbers::cardinal(int_value));
        self.say("virgola");
        self.say_all(numbers::decimals(frac));
        if self.next().is_some_and(|x| x.is_symbol('%')) {
            self.say("per cento");
            self.i += 1;
        } else if let Some((used, _, plural)) = self.unit_after() {
            self.say(plural);
            self.i += used;
        }
    }

    fn time(&mut self, h: u64, m: u64, s: Option<u64>) {
        match h {
            1 => {
                self.elide_last();
                self.say("una");
            }
            0 => self.say("mezzanotte"),
            _ => self.say_all(numbers::cardinal(h)),
        }
        if m > 0 {
            self.say("e");
            self.say(&numbers::below_100(m));
        }
        if let Some(s) = s.filter(|&s| s > 0) {
            self.say("e");
            self.say_all(numbers::cardinal(s));
            self.say(if s == 1 { "secondo" } else { "secondi" });
        }
    }

    fn date(&mut self, d: u64, m: u64, y: Option<u64>) {
        if d == 1 {
            self.say("primo");
        } else {
            self.say_all(numbers::cardinal(d));
        }
        self.say(lexicon::month(m).unwrap_or(""));
        if let Some(y) = y {
            self.say_all(numbers::cardinal(y));
        }
    }

    // ----------------------------------------------------------------- words

    fn word_token(&mut self, t: &Token) {
        let raw = t.text.as_str();
        if let Some(base) = raw.strip_suffix('\'') {
            let glued = self
                .next()
                .is_some_and(|n| !n.space_before && (n.is(Kind::Word) || n.is(Kind::Number)));
            if glued {
                self.say(&raw.to_lowercase());
                self.glue();
                return;
            }
            let base = base.to_lowercase();
            if base == "po" {
                return self.say("po'");
            }
            if let Some(w) = accent_from_apostrophe(&base) {
                return self.plain_word(&w);
            }
            return self.plain_word(&base);
        }
        if raw
            .chars()
            .any(|c| c.is_ascii_digit() || c == '²' || c == '³')
        {
            return self.mixed(raw);
        }
        // Currency code before a number: "CHF 20".
        if matches!(raw, "CHF" | "EUR" | "USD" | "GBP") {
            if self.next().is_some_and(|n| n.is(Kind::Number)) {
                self.currency_before = lexicon::currency(raw);
                return;
            }
            if let Some((_, plural)) = lexicon::currency(raw) {
                return self.say(plural);
            }
        }
        self.plain_word(raw)
    }

    fn spell(&mut self, letters: &str) {
        for c in letters.chars() {
            if let Some(name) = lexicon::letter_name(c) {
                self.say(name);
            }
        }
    }

    /// Letters and digits together: "covid19", "mp3", "B2B", "h24".
    fn mixed(&mut self, raw: &str) {
        let mut run = String::new();
        let mut digits = false;
        let chars: Vec<char> = raw
            .chars()
            .map(|c| match c {
                '²' => '2',
                '³' => '3',
                c => c,
            })
            .collect();
        for (k, &c) in chars.iter().enumerate() {
            run.push(c);
            let boundary = chars
                .get(k + 1)
                .is_none_or(|&n| n.is_ascii_digit() != c.is_ascii_digit());
            if !boundary {
                continue;
            }
            digits = c.is_ascii_digit();
            if digits {
                if run.len() > 4 || (run.starts_with('0') && run.len() > 1) {
                    self.say_all(numbers::digits(&run));
                } else {
                    self.say_all(numbers::cardinal(parse_u64(&run).unwrap_or(0)));
                }
            } else {
                let lower = run.to_lowercase();
                let upper = !run.chars().any(char::is_lowercase);
                if run.chars().count() == 1
                    || (upper && run.chars().count() <= 4)
                    || !lower.chars().any(is_vowel)
                {
                    self.spell(&lower);
                } else {
                    self.say(&lower);
                }
            }
            run.clear();
        }
        let _ = digits;
    }

    fn roman_context(&self, raw: &str) -> Option<bool> {
        let next = self.word_at(1);
        let century = next
            .as_deref()
            .is_some_and(|w| matches!(w, "secolo" | "secoli" | "millennio"));
        if !century && !raw.chars().all(|c| matches!(c, 'I' | 'V' | 'X')) {
            return None;
        }
        if century || raw.chars().count() >= 2 {
            return Some(false);
        }
        // A single I, V or X only after a name: "Carlo V", "Elisabetta I".
        let prev = self
            .prev()
            .filter(|p| p.is(Kind::Word) && p.first_upper() && p.text.chars().count() >= 3)?;
        let lower = prev.text.to_lowercase();
        if NOT_NAMES.contains(&lower.as_str()) || !prev.text.chars().skip(1).all(char::is_lowercase)
        {
            return None;
        }
        Some(lower.ends_with('a'))
    }

    fn plain_word(&mut self, raw: &str) {
        if raw.is_empty() {
            return;
        }
        let lower = collapse_repeats(&raw.to_lowercase());
        if is_laughter(&lower) {
            return self.say("ah ah");
        }
        let len = raw.chars().count();
        let upper = !raw.chars().any(char::is_lowercase) && raw.chars().any(char::is_uppercase);

        if upper && !self.shouting {
            if let Some(n) = roman_value(raw)
                && let Some(feminine) = self.roman_context(raw)
            {
                return self.say(&numbers::ordinal(n, feminine));
            }
            if len >= 2 {
                return self.acronym(raw, &lower);
            }
        }
        if upper && self.shouting && lexicon::acronym_spelled(&lower) {
            return self.spell(&lower);
        }
        if len == 1 {
            return match lower.as_str() {
                "a" | "e" | "i" | "o" | "è" | "é" | "à" | "ì" | "ò" | "ù" => self.say(&lower),
                _ if !upper && lexicon::chat(&lower).is_some() => {
                    self.say(lexicon::chat(&lower).unwrap_or(""))
                }
                _ => match lower.chars().next().and_then(lexicon::letter_name) {
                    Some(name) => self.say(name),
                    None => self.say(&lower),
                },
            };
        }
        if let Some(ab) = lexicon::abbreviation(&lower) {
            return self.abbreviation(ab, raw, false);
        }
        if let Some(c) = lexicon::chat(&lower) {
            return self.say(c);
        }
        if lexicon::acronym_spelled(&lower) {
            return self.spell(&lower);
        }
        if let Some(a) = lexicon::restore_accent(&lower) {
            // "Sara" with a capital is the name, not "sarà".
            if !(lower == "sara" && raw.starts_with('S')) {
                return self.say(a);
            }
        }
        if lower == "si" {
            let alone_before = self
                .prev()
                .is_none_or(|p| p.is(Kind::Punct) || p.is(Kind::Break));
            let alone_after = self
                .next()
                .is_none_or(|n| n.is(Kind::Punct) || n.is(Kind::Break));
            if alone_before && alone_after {
                return self.say("sì");
            }
        }
        if lower == "po" && self.last_said() == Some("un") {
            return self.say("po'");
        }
        if let Some(tens) = lower.strip_suffix("tre")
            && TENS.contains(&tens)
        {
            return self.say(&format!("{tens}tré"));
        }
        self.say(&lower);
    }

    fn acronym(&mut self, raw: &str, lower: &str) {
        if lexicon::acronym_said_as_word(raw) || SHORT_WORDS.contains(&raw) {
            return self.say(lower);
        }
        if lexicon::acronym_spelled(lower) || lower.chars().count() == 2 || !pronounceable(lower) {
            return self.spell(lower);
        }
        self.say(lower);
    }
}

/// "10:30", "10:30:15", and "10.30" after "alle"/"ore".
fn parse_time(t: &str, prev: Option<&str>) -> Option<(u64, u64, Option<u64>)> {
    let colon: Vec<&str> = t.split(':').collect();
    let dot: Vec<&str> = t.split('.').collect();
    let parts = if colon.len() >= 2 {
        colon
    } else if dot.len() == 2 && prev.is_some_and(|p| TIME_WORDS.contains(&p)) {
        dot
    } else {
        return None;
    };
    if parts.len() > 3
        || !parts.iter().all(|p| is_digits(p))
        || parts[0].len() > 2
        || parts[1..].iter().any(|p| p.len() != 2)
    {
        return None;
    }
    let h = parse_u64(parts[0])?;
    let m = parse_u64(parts[1])?;
    let s = parts.get(2).and_then(|s| parse_u64(s));
    (h <= 24 && m <= 59 && s.is_none_or(|s| s <= 59)).then_some((h, m, s))
}

/// "15/03/2027", "15-3-27", "15.03.2027", "2027-03-15".
fn parse_date(t: &str) -> Option<(u64, u64, Option<u64>)> {
    let sep = ['/', '-', '.']
        .into_iter()
        .find(|&c| t.matches(c).count() == 2)?;
    let parts: Vec<&str> = t.split(sep).collect();
    if !parts.iter().all(|p| is_digits(p)) {
        return None;
    }
    let (d, m, y) = if parts[0].len() == 4 && sep == '-' {
        (parts[2], parts[1], parts[0])
    } else {
        (parts[0], parts[1], parts[2])
    };
    if d.len() > 2 || m.len() > 2 || !(y.len() == 2 || y.len() == 4) {
        return None;
    }
    let (d, m, y) = (parse_u64(d)?, parse_u64(m)?, parse_u64(y)?);
    ((1..=31).contains(&d) && (1..=12).contains(&m)).then_some((d, m, Some(y)))
}
