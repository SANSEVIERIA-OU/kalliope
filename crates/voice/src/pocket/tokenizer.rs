// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! The text tokenizer of Pocket TTS: the `tokenizer.json` that Kyutai ships with the Italian model,
//! read and run without the `tokenizers` library.
//!
//! That file describes a SentencePiece unigram model as Hugging Face `tokenizers` runs it, and this
//! module does the same steps in the same order:
//! - the special tokens (`<unk>`, `<s>`, `</s>`, `<pad>`) are cut out of the raw text first;
//! - normalizer `Prepend("▁")`, then pre-tokenizer `Metaspace` (spaces become `▁`, a `▁` in front if
//!   missing, pieces split before every `▁`);
//! - each piece is segmented by the best path through the lattice of vocabulary pieces (Viterbi on the
//!   log-probabilities); characters with no piece of their own are unknown, adjacent unknowns are fused,
//!   and an unknown string becomes its UTF-8 bytes as `<0xXX>` tokens (byte fallback);
//! - decoding is `Metaspace` (`▁` back to spaces, no space before the first token), `ByteFallback`
//!   (byte tokens back to UTF-8, U+FFFD for invalid bytes) and `Fuse`; special tokens are skipped.
//!
//! The results are checked token by token against `tokenizers` (benchmarks/voce-propria).

use std::collections::HashMap;
use std::path::Path;

use crate::Error;
use crate::json::Json;

const SPACE: char = '\u{2581}';
/// Penalty of an unknown character below the lowest piece score, as in `tokenizers` (`K_UNK_PENALTY`).
const UNK_PENALTY: f64 = 10.0;

pub struct Tokenizer {
    pieces: Vec<String>,
    scores: Vec<f64>,
    ids: HashMap<String, u32>,
    /// Longest piece, in bytes: the lattice never looks further ahead.
    max_len: usize,
    unk: u32,
    unk_score: f64,
    /// Byte-fallback token of every byte value.
    bytes: [Option<u32>; 256],
    /// Special tokens, matched in the raw text and skipped when decoding.
    special: Vec<(String, u32)>,
}

impl Tokenizer {
    pub fn load(path: &Path) -> Result<Tokenizer, Error> {
        let text = std::fs::read_to_string(path)
            .map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        Tokenizer::parse(&text).map_err(|e| Error::new(format!("{}: {e}", path.display())))
    }

    pub fn parse(text: &str) -> Result<Tokenizer, Error> {
        let j = Json::parse(text)?;
        let bad = |what: &str| Error::new(format!("tokenizer.json: unsupported or missing {what}"));
        let model = j.get("model").ok_or_else(|| bad("model"))?;
        if model.get("type").and_then(Json::as_str) != Some("Unigram")
            || model.get("byte_fallback") != Some(&Json::Bool(true))
        {
            return Err(bad(
                "model (a Unigram model with byte fallback is expected)",
            ));
        }
        // The pipeline this module implements; anything else would tokenize differently.
        let normalizer = j.get("normalizer").ok_or_else(|| bad("normalizer"))?;
        let prepend = normalizer
            .get("normalizers")
            .and_then(Json::as_array)
            .is_some_and(|n| {
                n.len() == 1
                    && n[0].get("type").and_then(Json::as_str) == Some("Prepend")
                    && n[0].get("prepend").and_then(Json::as_str) == Some("\u{2581}")
            });
        let pre = j.get("pre_tokenizer").ok_or_else(|| bad("pre_tokenizer"))?;
        let metaspace = pre.get("type").and_then(Json::as_str) == Some("Metaspace")
            && pre.get("replacement").and_then(Json::as_str) == Some("\u{2581}")
            && pre.get("prepend_scheme").and_then(Json::as_str) == Some("always")
            && pre.get("split") == Some(&Json::Bool(true));
        if !prepend || !metaspace || j.get("post_processor") != Some(&Json::Null) {
            return Err(bad("normalizer, pre-tokenizer or post-processor"));
        }
        let unk = model
            .get("unk_id")
            .and_then(Json::as_f64)
            .ok_or_else(|| bad("unk_id"))? as u32;
        let vocab = model
            .get("vocab")
            .and_then(Json::as_array)
            .ok_or_else(|| bad("vocab"))?;
        let mut pieces = Vec::with_capacity(vocab.len());
        let mut scores = Vec::with_capacity(vocab.len());
        let mut ids = HashMap::with_capacity(vocab.len());
        let mut bytes = [None; 256];
        let mut min_score = f64::INFINITY;
        for (id, entry) in vocab.iter().enumerate() {
            let pair = entry.as_array().ok_or_else(|| bad("vocab entry"))?;
            let (Some(piece), Some(score)) = (
                pair.first().and_then(Json::as_str),
                pair.get(1).and_then(Json::as_f64),
            ) else {
                return Err(bad("vocab entry"));
            };
            if let Some(b) = byte_token(piece) {
                bytes[b as usize] = Some(id as u32);
            }
            // First occurrence wins, as when tokenizers builds its map.
            ids.entry(piece.to_owned()).or_insert(id as u32);
            min_score = min_score.min(score);
            pieces.push(piece.to_owned());
            scores.push(score);
        }
        if unk as usize >= pieces.len() {
            return Err(bad("unk_id"));
        }
        let mut special = Vec::new();
        for t in j
            .get("added_tokens")
            .and_then(Json::as_array)
            .ok_or_else(|| bad("added_tokens"))?
        {
            let content = t.get("content").and_then(Json::as_str);
            let id = t.get("id").and_then(Json::as_f64);
            let is_special = t.get("special") == Some(&Json::Bool(true));
            let normalized = t.get("normalized") == Some(&Json::Bool(true));
            match (content, id) {
                (Some(c), Some(id)) if is_special && !normalized && !c.is_empty() => {
                    special.push((c.to_owned(), id as u32))
                }
                _ => return Err(bad("added token")),
            }
        }
        let max_len = pieces.iter().map(String::len).max().unwrap_or(1);
        Ok(Tokenizer {
            pieces,
            scores,
            ids,
            max_len,
            unk,
            unk_score: min_score - UNK_PENALTY,
            bytes,
            special,
        })
    }

    pub fn vocab_size(&self) -> usize {
        self.pieces.len()
    }

    /// Token ids of `text`, as `Tokenizer.encode(text).ids` in `tokenizers`.
    pub fn encode(&self, text: &str) -> Vec<u32> {
        let mut out = Vec::new();
        let mut rest = text;
        while !rest.is_empty() {
            match self.find_special(rest) {
                Some((at, len, id)) => {
                    self.encode_plain(&rest[..at], &mut out);
                    out.push(id);
                    rest = &rest[at + len..];
                }
                None => {
                    self.encode_plain(rest, &mut out);
                    break;
                }
            }
        }
        out
    }

    /// The leftmost special token in `s` (the longest one at that position).
    fn find_special(&self, s: &str) -> Option<(usize, usize, u32)> {
        let mut best: Option<(usize, usize, u32)> = None;
        for (content, id) in &self.special {
            if let Some(at) = s.find(content.as_str()) {
                let better = match best {
                    None => true,
                    Some((b_at, b_len, _)) => at < b_at || (at == b_at && content.len() > b_len),
                };
                if better {
                    best = Some((at, content.len(), *id));
                }
            }
        }
        best
    }

    fn encode_plain(&self, text: &str, out: &mut Vec<u32>) {
        if text.is_empty() {
            return;
        }
        // Prepend("▁"), then Metaspace: spaces to ▁ (the string already starts with ▁).
        let mut normalized = String::with_capacity(text.len() + 3);
        normalized.push(SPACE);
        for c in text.chars() {
            normalized.push(if c == ' ' { SPACE } else { c });
        }
        // Split before every ▁ (MergedWithNext).
        let mut start = 0;
        for (i, c) in normalized.char_indices().skip(1) {
            if c == SPACE {
                self.encode_piece(&normalized[start..i], out);
                start = i;
            }
        }
        self.encode_piece(&normalized[start..], out);
    }

    /// The best segmentation of one pre-tokenized piece (`Unigram::encode_optimized`), then
    /// byte fallback for unknown strings.
    fn encode_piece(&self, s: &str, out: &mut Vec<u32>) {
        #[derive(Clone, Copy)]
        struct Node {
            score: f64,
            start: Option<usize>,
            id: u32,
        }
        let n = s.len();
        let mut best = vec![
            Node {
                score: 0.0,
                start: None,
                id: 0
            };
            n + 1
        ];
        let mut at = 0;
        while at < n {
            let here = best[at].score;
            let char_len = s[at..].chars().next().map_or(1, char::len_utf8);
            let mut single = false;
            // Every vocabulary piece starting here, shortest first.
            let limit = (at + self.max_len).min(n);
            let mut end = at + char_len;
            while end <= limit {
                if s.is_char_boundary(end)
                    && let Some(&id) = self.ids.get(&s[at..end])
                {
                    let score = self.scores[id as usize] + here;
                    let node = &mut best[end];
                    if node.start.is_none() || score > node.score {
                        *node = Node {
                            score,
                            start: Some(at),
                            id,
                        };
                    }
                    if end - at == char_len {
                        single = true;
                    }
                }
                end += 1;
            }
            if !single {
                let score = self.unk_score + here;
                let node = &mut best[at + char_len];
                if node.start.is_none() || score > node.score {
                    *node = Node {
                        score,
                        start: Some(at),
                        id: self.unk,
                    };
                }
            }
            at += char_len;
        }
        // Back from the end; adjacent unknown nodes are fused into one string.
        let mut parts: Vec<(usize, usize, bool)> = Vec::new();
        let mut end = n;
        while end > 0 {
            let node = best[end];
            let start = node.start.unwrap_or(0);
            let unknown = node.id == self.unk;
            match parts.last_mut() {
                Some(last) if unknown && last.2 => last.0 = start,
                _ => parts.push((start, end, unknown)),
            }
            end = start;
        }
        for &(start, end, _) in parts.iter().rev() {
            let piece = &s[start..end];
            match self.ids.get(piece) {
                Some(&id) => out.push(id),
                None => {
                    let fallback: Option<Vec<u32>> =
                        piece.bytes().map(|b| self.bytes[b as usize]).collect();
                    match fallback {
                        Some(ids) => out.extend(ids),
                        None => out.push(self.unk),
                    }
                }
            }
        }
    }

    /// Text of `ids`, as `Tokenizer.decode(ids)` (special tokens skipped) in `tokenizers`.
    pub fn decode(&self, ids: &[u32]) -> String {
        let tokens: Vec<&str> = ids
            .iter()
            .filter(|id| !self.special.iter().any(|(_, s)| s == *id))
            .filter_map(|&id| self.pieces.get(id as usize).map(String::as_str))
            .collect();
        let mut out = String::new();
        let mut pending: Vec<u8> = Vec::new();
        let flush = |pending: &mut Vec<u8>, out: &mut String| {
            if pending.is_empty() {
                return;
            }
            match std::str::from_utf8(pending) {
                Ok(s) => out.push_str(s),
                Err(_) => (0..pending.len()).for_each(|_| out.push('\u{FFFD}')),
            }
            pending.clear();
        };
        for (i, token) in tokens.iter().enumerate() {
            if let Some(b) = byte_token(token) {
                pending.push(b);
                continue;
            }
            flush(&mut pending, &mut out);
            for c in token.chars() {
                if c == SPACE {
                    // Metaspace decoder: no space for the replacement characters of the first token.
                    if i != 0 {
                        out.push(' ');
                    }
                } else {
                    out.push(c);
                }
            }
        }
        flush(&mut pending, &mut out);
        out
    }
}

/// The byte of a `<0xXX>` token.
fn byte_token(piece: &str) -> Option<u8> {
    let hex = piece.strip_prefix("<0x")?.strip_suffix('>')?;
    if hex.len() != 2 {
        return None;
    }
    u8::from_str_radix(hex, 16).ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A tiny model with the same pipeline as Kyutai's file.
    fn tiny() -> Tokenizer {
        let mut vocab = String::from(r#"["<unk>",0.0],["<s>",0.0],["</s>",0.0],["<pad>",0.0]"#);
        for b in 0..256 {
            vocab.push_str(&format!(r#",["<0x{b:02X}>",0.0]"#));
        }
        for (p, s) in [
            ("▁", -2.0),
            ("▁ci", -3.0),
            ("ao", -3.0),
            ("▁ciao", -4.0),
            ("c", -5.0),
            ("i", -5.0),
            ("a", -5.0),
            ("o", -5.0),
            ("▁m", -4.0),
            ("ondo", -4.0),
            (".", -2.0),
            ("è", -4.0),
        ] {
            vocab.push_str(&format!(r#",["{p}",{s}]"#));
        }
        let json = format!(
            r#"{{"version":"1.0","truncation":null,"padding":null,
            "added_tokens":[{{"id":0,"content":"<unk>","single_word":false,"lstrip":false,"rstrip":false,"normalized":false,"special":true}},
              {{"id":1,"content":"<s>","single_word":false,"lstrip":false,"rstrip":false,"normalized":false,"special":true}}],
            "normalizer":{{"type":"Sequence","normalizers":[{{"type":"Prepend","prepend":"▁"}}]}},
            "pre_tokenizer":{{"type":"Metaspace","replacement":"▁","prepend_scheme":"always","split":true}},
            "post_processor":null,
            "decoder":{{"type":"Sequence","decoders":[]}},
            "model":{{"type":"Unigram","unk_id":0,"vocab":[{vocab}],"byte_fallback":true}}}}"#
        );
        Tokenizer::parse(&json).unwrap()
    }

    #[test]
    fn best_path_and_byte_fallback() {
        let t = tiny();
        let id = |p: &str| t.ids[p];
        // "▁ciao" (-4) beats "▁ci" + "ao" (-6).
        assert_eq!(
            t.encode("ciao mondo."),
            [id("▁ciao"), id("▁m"), id("ondo"), id(".")]
        );
        // "€" has no piece: its three UTF-8 bytes; adjacent unknowns fused before falling back.
        let euro: Vec<u32> = "€".bytes().map(|b| t.bytes[b as usize].unwrap()).collect();
        let mut expected = vec![id("▁")];
        expected.extend(&euro);
        expected.extend(&euro);
        assert_eq!(t.encode("€€"), expected);
        assert_eq!(t.decode(&t.encode("€€ ciao")), "€€ ciao");
        // A special token is cut out first; the text after it gets its own ▁.
        assert_eq!(t.encode("ciao<s>ciao"), [id("▁ciao"), 1, id("▁ciao")]);
        assert_eq!(t.decode(&t.encode("ciao<s>ciao")), "ciao ciao");
    }

    #[test]
    fn invalid_bytes_decode_to_replacement_characters() {
        let t = tiny();
        let e2 = t.bytes[0xE2].unwrap();
        assert_eq!(t.decode(&[t.ids["▁ciao"], e2, e2]), "ciao\u{FFFD}\u{FFFD}");
        assert_eq!(t.encode(""), Vec::<u32>::new());
    }
}
