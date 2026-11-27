// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The pseudo-languages in the program, with the `pseudo` feature (CI: `cargo test -p kalliope-i18n --features pseudo`): they exist
//! only then, they are chosen by name, and a window in them shows accented, longer text, or text forced right to left.
#![cfg(feature = "pseudo")]
use kalliope_i18n::{RLM, choose, current, is_rtl, languages, set, tr, trn, with_language};

#[test]
fn the_pseudo_languages_are_in_the_program_and_are_not_chosen_by_the_system() {
    assert!(languages().contains(&"en-XA") && languages().contains(&"ar-XB"));
    assert_eq!(choose(&["en-XA".to_string()]), "en-XA");
    assert_eq!(choose(&["ar_XB".to_string()]), "ar-XB");
    // `en` alone is English, not the pseudo-language: a person's system never lands in one by chance
    assert_ne!(choose(&["en_US.UTF-8".to_string()]), "en-XA");
    assert!(is_rtl("ar-XB") && !is_rtl("en-XA"));
}

#[test]
fn a_message_of_the_source_comes_out_in_the_pseudo_language() {
    // a key the program really has (crates/app/src/session.rs)
    with_language("en-XA", || {
        let t = tr!("programma.sessione.parlo" => "Sto parlando…");
        assert!(t.starts_with('[') && t.ends_with(']'), "{t}");
        assert!(t.chars().count() > "Sto parlando…".chars().count(), "{t}");
        assert!(t.contains('ţ') || t.contains('š'), "{t}");
    });
    with_language("ar-XB", || {
        let t = tr!("programma.sessione.parlo" => "Sto parlando…");
        assert!(
            t.starts_with(RLM) && t.contains('\u{202e}') && t.ends_with('\u{202c}'),
            "{t:?}"
        );
    });
    assert_eq!(current(), "it", "the language of one thread did not leak");
}

#[test]
fn a_count_picks_the_form_and_keeps_its_placeholder_in_the_pseudo_language() {
    with_language("en-XA", || {
        let one = trn!("programma.file.lungo" => "x" | "y {n}", 1);
        let many = trn!("programma.file.lungo" => "x" | "y {n}", 5);
        assert_ne!(one, many, "the singular and the plural are two texts");
        assert!(!one.contains('5') && many.contains('5'), "{one} | {many}"); // {n} is the count
        assert!(
            !one.contains("{n}") && !many.contains("{n}"),
            "{one} | {many}"
        );
    });
}

#[test]
fn set_changes_the_language_for_the_whole_program() {
    assert!(set("en-XA"));
    assert_eq!(current(), "en-XA");
    assert!(set("it"));
    assert_eq!(current(), "it");
    assert!(!set("xx"));
}
