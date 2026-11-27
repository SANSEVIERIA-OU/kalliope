// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Slint's own reader of a bundle (`i-slint-compiler`, the code `slint_build::with_bundled_translations` runs) takes the bundle the build
//! writes, for the plural rule of each of the 30 languages. Slint's reader does not know `!`, which Croatian, Lithuanian and Polish use:
//! the bundle carries the same rule without it (`plural::without_negation`), and this is the test that says so.
use i_slint_compiler::source_path::SourcePath;
use i_slint_compiler::translations::TranslationsBuilder;
use kalliope_i18n::catalogo::{Entry, Language, write_slint_bundle};
use std::collections::BTreeSet;

fn languages() -> Vec<Language> {
    include_str!("plurali.txt")
        .lines()
        .map(|line| {
            let mut p = line.splitn(3, '\t');
            let (code, header) = (p.next().unwrap(), p.next().unwrap());
            let (nplurals, _) = kalliope_i18n::plural::header(header).unwrap();
            Language {
                code: code.to_string(),
                nplurals,
                plural: header.to_string(),
                entries: vec![Entry {
                    ctx: "programma.prova.conto".into(),
                    id: "{n} cosa".into(),
                    plural: Some("{n} cose".into()),
                    forms: (0..nplurals).map(|i| format!("{{n}} forma {i}")).collect(),
                    fuzzy: false,
                }],
            }
        })
        .collect()
}

#[test]
fn slint_reads_the_plural_rule_of_each_of_the_30_languages() {
    let all = languages();
    assert_eq!(all.len(), 30);
    let dir = std::env::temp_dir().join(format!("kalliope-i18n-slint-{}", std::process::id()));
    write_slint_bundle(&all, "kalliope-app", &dir).unwrap();
    let mut seen: BTreeSet<SourcePath> = BTreeSet::new();
    let builder = TranslationsBuilder::load_translations(&dir, "kalliope-app", &mut seen)
        .unwrap_or_else(|e| panic!("Slint does not read the bundle: {e}"));
    let read = builder.result().languages.len();
    assert_eq!(read, 31, "the 30 languages and the default one");
    assert_eq!(seen.len(), 30);
}

#[test]
fn the_unrewritten_rule_is_the_one_slint_cannot_read() {
    // the reason for plural::without_negation: written as CLDR gives it, Polish stops the build
    let mut pl = languages().into_iter().find(|l| l.code == "pl").unwrap();
    assert!(pl.plural.contains('!'));
    let dir = std::env::temp_dir().join(format!("kalliope-i18n-slint-raw-{}", std::process::id()));
    std::fs::create_dir_all(dir.join("pl/LC_MESSAGES")).unwrap();
    pl.entries.clear();
    std::fs::write(
        dir.join("pl/LC_MESSAGES/kalliope-app.po"),
        format!(
            "msgid \"\"\nmsgstr \"\"\n\"Plural-Forms: {}\\n\"\n",
            pl.plural
        ),
    )
    .unwrap();
    let verdict =
        TranslationsBuilder::load_translations(&dir, "kalliope-app", &mut BTreeSet::new());
    assert!(
        verdict.is_err(),
        "if Slint now reads `!`, plural::without_negation is no longer needed"
    );
}
