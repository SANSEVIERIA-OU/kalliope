// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! For checking the Pocket TTS front end against the official Python code: reads lines from standard
//! input and prints, per line, one JSON object with the token ids, their decoded text and the chunks
//! with their prompts.
//!
//! cargo run --release -p kalliope-voice --example pocket_text -- MODEL_DIR < lines.txt

use std::io::{BufRead, Write};

fn quote(s: &str) -> String {
    let mut out = String::from("\"");
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out.push('"');
    out
}

fn main() {
    let dir = std::env::args()
        .nth(1)
        .expect("usage: pocket_text MODEL_DIR < lines");
    let front = kalliope_voice::pocket::FrontEnd::load(std::path::Path::new(&dir)).unwrap();
    let stdout = std::io::stdout();
    let mut out = stdout.lock();
    for line in std::io::stdin().lock().lines() {
        let line = line.unwrap();
        let ids = front.tokenizer().encode(&line);
        let decoded = front.tokenizer().decode(&ids);
        let chunks: Vec<String> = front
            .chunks(&line)
            .iter()
            .map(|c| format!("[{},{}]", quote(&c.prompt), c.frames_after_eos))
            .collect();
        let ids: Vec<String> = ids.iter().map(u32::to_string).collect();
        writeln!(
            out,
            "{{\"ids\":[{}],\"decode\":{},\"chunks\":[{}]}}",
            ids.join(","),
            quote(&decoded),
            chunks.join(",")
        )
        .unwrap();
    }
}
