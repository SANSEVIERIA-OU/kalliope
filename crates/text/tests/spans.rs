// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Where each spoken word was typed: numbers, abbreviations and initials change the words, and the
//! window still shows what has been said in the text as it was written.

use kalliope_text::{normalize, normalize_spans, words};

/// Each spoken word with the typed text it comes from.
fn pairs(input: &str) -> Vec<(String, String)> {
    normalize_spans(input)
        .iter()
        .flat_map(|s| {
            assert_eq!(words(&s.text).count(), s.words.len(), "{s:?}");
            words(&s.text)
                .zip(&s.words)
                .map(|(w, r)| (w.to_string(), input[r.clone()].to_string()))
                .collect::<Vec<_>>()
        })
        .collect()
}

fn p(spoken: &str, typed: &str) -> (String, String) {
    (spoken.into(), typed.into())
}

#[test]
fn the_text_is_the_same_as_normalize() {
    for input in [
        "Il Dott. Rossi paga 1.250,50 € entro il 15/03/2027, ok?",
        "J. R. R. Tolkien scrisse... Poi? Boh!!! 😀",
        "Ci vediamo alle 10:30 in via G. Verdi 3; porta l'e-mail.",
    ] {
        let texts: Vec<String> = normalize_spans(input).into_iter().map(|s| s.text).collect();
        assert_eq!(texts, normalize(input));
    }
}

#[test]
fn numbers_keep_the_digits_they_were_read_from() {
    assert_eq!(
        pairs("Costa 1.250 euro, cioè tanto."),
        [
            p("costa", "Costa"),
            p("mille", "1.250"),
            p("duecento", "1.250"),
            p("cinquanta", "1.250"),
            p("euro,", "euro,"),
            p("cioè", "cioè"),
            p("tanto.", "tanto."),
        ]
    );
    let said = pairs("Alle 10:30, poi basta.");
    assert_eq!(said[1].1, "10:30");
    assert_eq!(said.last().unwrap(), &p("basta.", "basta."));
}

#[test]
fn abbreviations_and_initials_map_to_what_was_typed() {
    let said = pairs("Il Dott. Rossi arriva.");
    assert_eq!(said[1], p("dottor", "Dott."));
    assert_eq!(said[2], p("rossi", "Rossi"));
    // The initials' dots are not sentence ends: one sentence, and the comma said before the
    // surname belongs to the last initial.
    let input = "Ho letto J. R. R. Tolkien ieri.";
    let sentences = normalize_spans(input);
    assert_eq!(sentences.len(), 1, "{sentences:?}");
    let said = pairs(input);
    let tolkien = said.iter().position(|(_, t)| t == "Tolkien").unwrap();
    assert!(said[tolkien - 1].1.starts_with('R'), "{said:?}");
    assert_eq!(said.last().unwrap(), &p("ieri.", "ieri."));
}

#[test]
fn spans_are_in_order_and_inside_the_text() {
    let input = "  «Sì», ha detto: costa 5 € l'una – più IVA; ci vediamo lunedì 3 marzo alle 9.  ";
    let mut end = 0;
    for s in normalize_spans(input) {
        for r in &s.words {
            assert!(r.start < r.end && r.end <= input.len(), "{r:?}");
            assert!(input.is_char_boundary(r.start) && input.is_char_boundary(r.end));
            assert!(r.end >= end, "{r:?} goes back from {end}");
            end = r.end;
        }
    }
    assert!(input[..end].trim_start().starts_with("«Sì"));
    assert!(input[..end].ends_with("alle 9."), "{:?}", &input[..end]);
}

#[test]
fn composed_accents_and_dropped_emoji_keep_the_right_bytes() {
    let input = "Perche\u{301} 👍 no?";
    assert_eq!(
        pairs(input),
        [p("perché", "Perche\u{301}"), p("no?", "no?")]
    );
}
