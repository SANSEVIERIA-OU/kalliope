// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Text preparation of Pocket TTS, as the official code does it (`pocket_tts/models/text_chunking.py`
//! of kyutai-labs/pocket-tts a4a6054d): the prompt of each chunk, and the split of a text into chunks of
//! at most `max_tokens` tokens on sentence ends, then on commas.
//!
//! Python's `str.split()`, `strip()`, `isalnum()` and `isupper()` are matched with their Rust Unicode
//! counterparts; `\d` is an ASCII digit (Kalliope's normalizer writes numbers out as words anyway).

use super::tokenizer::Tokenizer;

const TERMINAL: &[char] = &['.', '!', '?', '\u{2026}'];
const WEAK: &[char] = &[',', ';', ':', '-', '\u{2013}', '\u{2014}'];
const CLOSERS: &[char] = &['"', '\'', '\u{201d}', '\u{2019}', ')', ']', '\u{bb}'];
const OPENERS: &[char] = &['"', '\'', '\u{201c}', '\u{2018}', '(', '[', '\u{ab}'];
/// Abbreviations that always precede a name or an example, never end a sentence.
const TITLES: &[&str] = &[
    "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev.", "vs.", "e.g.", "i.e.",
];
/// A closing quote can span several byte tokens; the lookahead is bounded.
const MAX_CLOSER_TOKENS: usize = 8;

#[derive(Debug, Clone)]
pub struct TextOptions {
    /// Per-character rewrites applied first (an empty string deletes the character).
    pub replace: Vec<(char, String)>,
    pub remove_semicolons: bool,
    pub append_terminal_punctuation: bool,
    pub capitalize_first_letter: bool,
    pub max_tokens: usize,
}

/// Python's `str.isspace()`: Unicode White_Space plus the four ASCII separators.
fn is_space(c: char) -> bool {
    c.is_whitespace() || ('\u{1c}'..='\u{1f}').contains(&c)
}

fn split_words(s: &str) -> impl Iterator<Item = &str> {
    s.split(is_space).filter(|w| !w.is_empty())
}

fn strip(s: &str) -> &str {
    s.trim_matches(is_space)
}

/// The prompt for one chunk and the number of frames to generate after the end is detected
/// (`prepare_text_prompt`). `None` when nothing is left to say.
pub fn prepare(text: &str, o: &TextOptions) -> Option<(String, usize)> {
    let mut text = strip(text).to_owned();
    if !o.replace.is_empty() {
        let mut t = String::with_capacity(text.len());
        for c in text.chars() {
            match o.replace.iter().find(|(from, _)| *from == c) {
                Some((_, to)) => t.push_str(to),
                None => t.push(c),
            }
        }
        text = split_words(&t).collect::<Vec<_>>().join(" ");
        text = drop_weak_after_sentence_end(&text);
    }
    if text.is_empty() {
        return None;
    }
    text = text.replace(['\n', '\r'], " ").replace("  ", " ");
    if o.remove_semicolons {
        text = text.replace(';', ",");
    }
    let frames_after_eos = if split_words(&text).count() <= 4 {
        3
    } else {
        1
    };
    if o.capitalize_first_letter {
        let start = text.len() - text.trim_start_matches(OPENERS).len();
        if let Some(c) = text[start..].chars().next()
            && !c.is_uppercase()
        {
            let upper: String = c.to_uppercase().collect();
            text.replace_range(start..start + c.len_utf8(), &upper);
        }
    }
    if o.append_terminal_punctuation {
        text = ensure_terminal_punctuation(&text);
    }
    Some((text, frames_after_eos))
}

/// `re.sub(r"([.!?…])\s*[,;:]", r"\1", text)`: deleted quotes leave '"Hi?", she said' as
/// 'Hi?, she said'; keep the sentence mark only.
fn drop_weak_after_sentence_end(s: &str) -> String {
    let chars: Vec<char> = s.chars().collect();
    let mut out = String::with_capacity(s.len());
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        out.push(c);
        i += 1;
        if TERMINAL.contains(&c) {
            let mut j = i;
            while j < chars.len() && is_space(chars[j]) {
                j += 1;
            }
            if j < chars.len() && matches!(chars[j], ',' | ';' | ':') {
                i = j + 1;
            }
        }
    }
    out
}

fn ensure_terminal_punctuation(text: &str) -> String {
    let core = text.trim_end_matches(|c: char| CLOSERS.contains(&c) || c == ' ');
    let closers = strip(&text[core.len()..]);
    match core.chars().last() {
        None => text.to_owned(),
        Some(c) if TERMINAL.contains(&c) => text.to_owned(),
        Some(c) if WEAK.contains(&c) => {
            let base = core.trim_end_matches(|c: char| WEAK.contains(&c) || c == ' ');
            format!("{base}.{closers}")
        }
        Some(_) => format!("{text}."),
    }
}

/// `split_into_best_sentences`: chunks of whole sentences of at most `max_tokens` tokens; a longer
/// sentence is cut at commas, semicolons and colons; a chunk never ends on a decimal number.
pub fn split(tok: &Tokenizer, text: &str, o: &TextOptions) -> Vec<String> {
    let Some((prepared, _)) = prepare(text, o) else {
        return Vec::new();
    };
    let tokens = tok.encode(strip(&prepared));
    let sentence_ends: Vec<u32> = tok.encode(".!...?").into_iter().skip(1).collect();
    let bounds = boundaries(tok, &tokens, &sentence_ends);
    let commas: Vec<u32> = tok.encode(",;:").into_iter().skip(1).collect();
    let mut refined: Vec<(usize, String)> = Vec::new();
    for (n, segment) in segments(tok, &tokens, &bounds) {
        if n <= o.max_tokens {
            refined.push((n, segment));
            continue;
        }
        let sub = tok.encode(strip(&segment));
        let sub_segments = segments(tok, &sub, &boundaries(tok, &sub, &commas));
        if sub_segments.len() > 1 {
            refined.extend(sub_segments);
        } else {
            refined.push((n, segment));
        }
    }
    let mut glued: Vec<(usize, String)> = Vec::new();
    for (n, segment) in refined {
        match glued.last_mut() {
            Some((prev_n, prev)) if ends_with_decimal_number(prev) => {
                *prev = format!("{} {}", prev.trim_end_matches(is_space), strip(&segment));
                *prev_n += n;
            }
            _ => glued.push((n, segment)),
        }
    }
    let mut chunks = Vec::new();
    let mut current = String::new();
    let mut count = 0;
    for (n, sentence) in glued {
        if current.is_empty() {
            current = sentence;
            count = n;
        } else if count + n > o.max_tokens {
            chunks.push(strip(&current).to_owned());
            current = sentence;
            count = n;
        } else {
            current.push(' ');
            current.push_str(&sentence);
            count += n;
        }
    }
    if !current.is_empty() {
        chunks.push(strip(&current).to_owned());
    }
    chunks
}

/// `\d[.,]\d+\W*$`.
fn ends_with_decimal_number(s: &str) -> bool {
    let core: Vec<char> = s
        .trim_end_matches(|c: char| !(c.is_alphanumeric() || c == '_'))
        .chars()
        .collect();
    let digits = core.iter().rev().take_while(|c| c.is_ascii_digit()).count();
    let n = core.len();
    digits >= 1
        && n >= digits + 2
        && matches!(core[n - digits - 1], '.' | ',')
        && core[n - digits - 2].is_ascii_digit()
}

/// `_find_boundary_indices` with `skip_inner_punctuation`.
fn boundaries(tok: &Tokenizer, tokens: &[u32], marks: &[u32]) -> Vec<usize> {
    let mut indices = vec![0];
    let mut previous_was_boundary = false;
    for (idx, t) in tokens.iter().enumerate() {
        if marks.contains(t) {
            previous_was_boundary = true;
            continue;
        }
        if previous_was_boundary {
            if is_inner_punctuation(tok, tokens, idx) {
                previous_was_boundary = false;
                continue;
            }
            let start = skip_closers(tok, tokens, idx);
            if start < tokens.len() {
                indices.push(start);
            }
        }
        previous_was_boundary = false;
    }
    indices.push(tokens.len());
    indices
}

/// The punctuation before `idx` does not end a sentence: it is followed by a letter or digit
/// without a space ("3.14", "www.kyutai.org"), or it ends a title before a name ("Dr. Miller").
fn is_inner_punctuation(tok: &Tokenizer, tokens: &[u32], idx: usize) -> bool {
    let after = tok.decode(&tokens[idx - 1..(idx + 1).min(tokens.len())]);
    if after.chars().nth(1).is_some_and(char::is_alphanumeric) {
        return true;
    }
    let window_start = idx.saturating_sub(6);
    let window = tok.decode(&tokens[window_start..idx]);
    let words: Vec<&str> = split_words(&window).collect();
    words
        .last()
        .is_some_and(|w| TITLES.contains(w) && (words.len() > 1 || window_start == 0))
}

/// Where a segment starting at `idx` really starts: after the closing quotes and brackets that
/// directly follow the punctuation, so that they stay with their sentence.
fn skip_closers(tok: &Tokenizer, tokens: &[u32], idx: usize) -> usize {
    let punctuation = tok.decode(&tokens[idx - 1..idx]).chars().count();
    let mut start = idx;
    let stop = tokens.len().min(idx + MAX_CLOSER_TOKENS);
    for end in idx + 1..=stop {
        let window = tok.decode(&tokens[idx - 1..end]);
        let after: String = window.chars().skip(punctuation).collect();
        if after.is_empty()
            || after
                .chars()
                .any(|c| !(CLOSERS.contains(&c) || c == '\u{FFFD}'))
        {
            break;
        }
        if !after.contains('\u{FFFD}') {
            start = end;
        }
    }
    start
}

fn segments(tok: &Tokenizer, tokens: &[u32], bounds: &[usize]) -> Vec<(usize, String)> {
    bounds
        .windows(2)
        .map(|w| (w[1] - w[0], tok.decode(&tokens[w[0]..w[1]])))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn italian() -> TextOptions {
        TextOptions {
            replace: [
                ('"', ""),
                ('\u{201c}', ""),
                ('\u{201d}', ""),
                ('\u{201e}', ""),
                ('\u{ab}', ""),
                ('\u{bb}', ""),
                ('\u{2019}', "'"),
                ('\u{2018}', "'"),
                ('(', ""),
                (')', ""),
                ('[', ""),
                (']', ""),
                ('\u{2013}', ","),
            ]
            .into_iter()
            .map(|(c, s)| (c, s.to_owned()))
            .collect(),
            remove_semicolons: false,
            append_terminal_punctuation: true,
            capitalize_first_letter: true,
            max_tokens: 50,
        }
    }

    #[test]
    fn prompt_like_the_official_code() {
        let o = italian();
        assert_eq!(prepare("  va bene ", &o), Some(("Va bene.".into(), 3)));
        assert_eq!(
            prepare("«ciao», disse lui, e poi se ne andò via", &o),
            Some(("Ciao, disse lui, e poi se ne andò via.".into(), 1))
        );
        assert_eq!(
            prepare("\"Sì?\", chiese", &o),
            Some(("Sì? chiese.".into(), 3))
        );
        assert_eq!(prepare("dunque:", &o), Some(("Dunque.".into(), 3)));
        assert_eq!(prepare("“ ”", &o), None);
        // The dash becomes a comma with its spaces kept, as in the official code.
        assert_eq!(
            prepare("l’ho visto – credo", &o),
            Some(("L'ho visto , credo.".into(), 3))
        );
    }

    #[test]
    fn decimal_endings() {
        assert!(ends_with_decimal_number("costa 3,50 €,"));
        assert!(ends_with_decimal_number("pi è 3.14."));
        assert!(!ends_with_decimal_number("alle 3. Poi"));
        assert!(!ends_with_decimal_number("tre virgola cinque"));
    }
}
