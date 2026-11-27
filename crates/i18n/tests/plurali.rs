// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The plural rule of each of the 30 languages, read from the `Plural-Forms` header the catalogue gives it, against the form CLDR
//! says for a set of numbers. `plurali.txt` is written from CLDR (`tools/data/cldr.json`) by `tools/test_traduzioni_app.py`, which
//! also checks that it is what CLDR gives today; the rule is read here by the same code the build uses.
use kalliope_i18n::plural;

#[test]
fn every_language_picks_the_form_cldr_says() {
    let mut languages = 0;
    for line in include_str!("plurali.txt").lines() {
        let mut p = line.splitn(3, '\t');
        let (code, header, samples) = (p.next().unwrap(), p.next().unwrap(), p.next().unwrap());
        let (nplurals, expr) = plural::header(header).unwrap_or_else(|e| panic!("{code}: {e}"));
        for s in samples.split(',') {
            let (n, want) = s.split_once('=').unwrap();
            let (n, want): (i64, i64) = (n.parse().unwrap(), want.parse().unwrap());
            let got = plural::eval(&expr, n);
            assert_eq!(got, want, "{code}: form for {n}");
            assert!(
                (got as usize) < nplurals,
                "{code}: form {got} for {n} is beyond {nplurals}"
            );
        }
        languages += 1;
    }
    assert_eq!(languages, 30);
}
