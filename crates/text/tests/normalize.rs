// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Written → spoken pairs. Each case is one behaviour a listener would notice.

use kalliope_text::normalize;

fn n(input: &str) -> String {
    normalize(input).join(" | ")
}

#[track_caller]
fn check(cases: &[(&str, &str)]) {
    let mut failures = Vec::new();
    for (input, expected) in cases {
        let got = n(input);
        if got != *expected {
            failures.push(format!(
                "  {input:?}\n    expected {expected:?}\n    got      {got:?}"
            ));
        }
    }
    assert!(
        failures.is_empty(),
        "{} failures:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

#[test]
fn benchmark_sentences() {
    check(&[
        (
            "Buongiorno a tutti, scusate il ritardo: avevo un problema con la connessione.",
            "buongiorno a tutti, scusate il ritardo: avevo un problema con la connessione.",
        ),
        (
            "Posso fare una domanda? Non ho capito bene l'ultimo punto della presentazione.",
            "posso fare una domanda? | non ho capito bene l'ultimo punto della presentazione.",
        ),
        (
            "Allora... direi che possiamo procedere.",
            "allora… direi che possiamo procedere.",
        ),
        (
            "Il preventivo è di 1.250 euro, IVA esclusa, da saldare entro il 15 marzo 2027.",
            "il preventivo è di mille duecento cinquanta euro, iva esclusa, da saldare entro il quindici marzo duemila ventisette.",
        ),
        (
            "Perché non ne parliamo giovedì alle 10:30, dopo la riunione?",
            "perché non ne parliamo giovedì alle dieci e trenta, dopo la riunione?",
        ),
        ("Sì, va bene.", "sì, va bene."),
    ]);
}

#[test]
fn numbers_and_agreement() {
    check(&[
        ("Ho 1 figlio e 2 figlie", "ho un figlio e due figlie"),
        ("1 persona", "una persona"),
        ("1 studente", "uno studente"),
        ("1 ora", "un'ora"),
        ("1 problema", "un problema"),
        ("ne voglio 1", "ne voglio uno"),
        ("nel 2027", "nel duemila ventisette"),
        ("1.000.000 di abitanti", "un milione di abitanti"),
        ("21 anni", "ventuno anni"),
        ("2,5 milioni", "due virgola cinque milioni"),
        ("0,05", "zero virgola zero cinque"),
        ("la versione 2.0", "la versione due punto zero"),
        ("anni '80", "anni ottanta"),
        ("-5 gradi", "meno cinque gradi"),
        ("2 + 2 = 4", "due più due uguale quattro"),
        ("3x4", "tre per quattro"),
    ]);
}

#[test]
fn money_percent_units() {
    check(&[
        (
            "€ 1.250,50",
            "mille duecento cinquanta euro e cinquanta centesimi",
        ),
        ("costa 20€", "costa venti euro"),
        ("1 €", "un euro"),
        ("1,50 euro", "un euro e cinquanta centesimi"),
        ("0,99 €", "novantanove centesimi"),
        ("$5", "cinque dollari"),
        ("CHF 20", "venti franchi"),
        ("3 milioni €", "tre milioni euro"),
        ("sconto del 50%", "sconto del cinquanta per cento"),
        ("2,5%", "due virgola cinque per cento"),
        ("5 km", "cinque chilometri"),
        ("1 km", "un chilometro"),
        ("50 km/h", "cinquanta chilometri orari"),
        ("2 GB", "due gigabyte"),
        ("24h su 24", "ventiquattro ore su ventiquattro"),
        ("1 h", "un'ora"),
        ("100 m²", "cento metri quadri"),
        ("5G", "cinque gi"),
    ]);
}

#[test]
fn dates_times_ordinals() {
    check(&[
        ("il 15/03/2027", "il quindici marzo duemila ventisette"),
        ("2027-03-15", "quindici marzo duemila ventisette"),
        ("il 1/3", "il primo marzo"),
        ("1 maggio", "primo maggio"),
        ("il 1° maggio", "il primo maggio"),
        ("il 3° piano", "il terzo piano"),
        ("la 2ª volta", "la seconda volta"),
        ("20°C", "venti gradi"),
        ("fuori ci sono 30°", "fuori ci sono trenta gradi"),
        ("alle 1:30", "all'una e trenta"),
        ("alle 10.30", "alle dieci e trenta"),
        ("alle 9:00", "alle nove"),
        ("dalle 1", "dall'una"),
        ("Carlo V", "carlo quinto"),
        ("Elisabetta I", "elisabetta prima"),
        ("il XXI secolo", "il ventunesimo secolo"),
        ("Rocky II", "rocky secondo"),
        ("vitamina C", "vitamina ci"),
    ]);
}

#[test]
fn fractions_ranges_scores() {
    check(&[
        ("1/2 litro", "un mezzo litro"),
        ("3/4", "tre quarti"),
        ("8/10", "otto su dieci"),
        ("24/7", "ventiquattro su sette"),
        ("3-5 anni", "da tre a cinque anni"),
        ("finita 3-0", "finita tre a zero"),
        ("3:1", "tre a uno"),
    ]);
}

#[test]
fn phones_and_addresses() {
    check(&[
        (
            "tel. 333 1234567",
            "telefono tre tre tre, uno due tre, quattro cinque sei sette",
        ),
        (
            "+39 333 1234567",
            "più trentanove, tre tre tre, uno due tre, quattro cinque sei sette",
        ),
        (
            "chiama lo 02 1234567",
            "chiama lo zero due, uno due tre, quattro cinque sei sette",
        ),
        ("codice 007", "codice zero zero sette"),
        (
            "scrivi a mario.rossi@gmail.com",
            "scrivi a mario punto rossi chiocciola gmail punto com",
        ),
        (
            "vai su www.esempio.it.",
            "vai su vu vu vu punto esempio punto it.",
        ),
        (
            "https://kalliope.app/aiuto",
            "kalliope punto app barra aiuto",
        ),
    ]);
}

#[test]
fn abbreviations_and_acronyms() {
    check(&[
        ("il Dott. Rossi", "il dottor rossi"),
        ("chieda al dott.", "chieda al dottore."),
        ("la Dott.ssa Bianchi", "la dottoressa bianchi"),
        (
            "pane, latte ecc. Poi basta",
            "pane, latte eccetera. | poi basta",
        ),
        ("pane, latte ecc. e altro", "pane, latte eccetera e altro"),
        ("vedi art. 3 e n. 5", "vedi articolo tre e numero cinque"),
        ("a p. 12", "a pagina dodici"),
        ("nel 44 a.C.", "nel quarantaquattro avanti cristo."),
        ("ad es. questo", "ad esempio questo"),
        ("IVA esclusa", "iva esclusa"),
        ("ti mando il PDF", "ti mando il pi di effe"),
        ("una chiavetta USB", "una chiavetta u esse bi"),
        ("la FIAT", "la fiat"),
        ("lavoro alla CGIL", "lavoro alla ci gi i elle"),
        ("Ti ho detto NO", "ti ho detto no"),
        ("NON CI POSSO CREDERE", "non ci posso credere"),
        ("Rossi S.p.A.", "rossi spa."),
        ("lui e/o lei", "lui e o lei"),
        ("lui/lei", "lui o lei"),
        ("B2B", "bi due bi"),
        ("mp3", "emme pi tre"),
        ("covid19", "covid diciannove"),
        ("aperto h24", "aperto acca ventiquattro"),
    ]);
}

#[test]
fn chat_writing() {
    check(&[
        ("perche no", "perché no"),
        ("e' tardi", "è tardi"),
        ("c'e' tempo", "c'è tempo"),
        ("piu tardi", "più tardi"),
        ("cmq nn so xke", "comunque non so perché"),
        ("grazie x tutto", "grazie per tutto"),
        ("ciaooo", "ciao"),
        ("siii!", "sì!"),
        ("si, certo", "sì, certo"),
        ("si lava", "si lava"),
        ("un po di pazienza", "un po' di pazienza"),
        ("un pò", "un po'"),
        ("ahahah che ridere", "ah ah che ridere"),
        ("Grazie mille! 😀👍", "grazie mille!"),
        ("ok :) a dopo", "ok a dopo"),
        ("davvero???", "davvero?"),
        ("no!!!", "no!"),
        ("ventitre", "ventitré"),
        ("Sara arriva", "sara arriva"),
        ("sara bello", "sarà bello"),
        ("ci vediamo lunedi", "ci vediamo lunedì"),
    ]);
}

#[test]
fn sentences_and_punctuation() {
    check(&[
        ("ciao. come stai?", "ciao. | come stai?"),
        ("riga uno\nriga due", "riga uno | riga due"),
        ("(vedi sopra)", "vedi sopra"),
        ("così – direi – va bene", "così, direi, va bene"),
        ("«Ciao» disse", "ciao disse"),
        (
            "Fantastico! È esattamente quello che speravamo.",
            "fantastico! | è esattamente quello che speravamo.",
        ),
        ("socio-economico", "socio economico"),
        ("", ""),
        ("😀", ""),
    ]);
}
