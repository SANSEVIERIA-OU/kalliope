// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Italian number words: cardinals, ordinals, digit-by-digit reading.
//!
//! Large numbers are split where speech puts a stress: thousands, hundreds and the rest become
//! separate words ("mille duecento cinquanta"), as espeak-ng does. The voice models were trained
//! on espeak-ng phonemes, so this keeps their numbers in familiar territory.

const UNITS: [&str; 20] = [
    "zero",
    "uno",
    "due",
    "tre",
    "quattro",
    "cinque",
    "sei",
    "sette",
    "otto",
    "nove",
    "dieci",
    "undici",
    "dodici",
    "tredici",
    "quattordici",
    "quindici",
    "sedici",
    "diciassette",
    "diciotto",
    "diciannove",
];
const TENS: [&str; 10] = [
    "",
    "",
    "venti",
    "trenta",
    "quaranta",
    "cinquanta",
    "sessanta",
    "settanta",
    "ottanta",
    "novanta",
];
const ORDINALS: [&str; 11] = [
    "", "primo", "secondo", "terzo", "quarto", "quinto", "sesto", "settimo", "ottavo", "nono",
    "decimo",
];

/// Largest number read as words; longer ones are read digit by digit.
pub const MAX_CARDINAL: u64 = 999_999_999_999;

/// 0–99 as one word: "ventitré", "trentotto", "ventuno".
pub fn below_100(n: u64) -> String {
    debug_assert!(n < 100);
    if n < 20 {
        return UNITS[n as usize].to_string();
    }
    let tens = TENS[(n / 10) as usize];
    match n % 10 {
        0 => tens.to_string(),
        // "venti" + "uno" → "ventuno": the final vowel drops before a vowel.
        u @ (1 | 8) => format!("{}{}", &tens[..tens.len() - 1], UNITS[u as usize]),
        3 => format!("{tens}tré"),
        u => format!("{tens}{}", UNITS[u as usize]),
    }
}

/// 1–999, hundreds separated from the rest: ["duecento", "cinquanta"].
fn below_1000(n: u64, out: &mut Vec<String>) {
    debug_assert!((1..1000).contains(&n));
    let (h, rest) = (n / 100, n % 100);
    if h == 1 {
        out.push("cento".into());
    } else if h > 1 {
        out.push(format!("{}cento", UNITS[h as usize]));
    }
    if rest > 0 {
        out.push(below_100(rest));
    }
}

/// "uno" → "un" in front of "mila"/"milioni"/"miliardi" ("ventun milioni").
fn apocope_last(words: &mut [String]) {
    if let Some(last) = words.last_mut()
        && last.ends_with("uno")
    {
        last.truncate(last.len() - 1);
    }
}

/// Cardinal number as words, e.g. 1250 → ["mille", "duecento", "cinquanta"].
/// Numbers above [`MAX_CARDINAL`] are read digit by digit.
pub fn cardinal(n: u64) -> Vec<String> {
    if n == 0 {
        return vec!["zero".into()];
    }
    if n > MAX_CARDINAL {
        return digits(&n.to_string());
    }
    let mut out = Vec::new();
    let mut rest = n;
    for (scale, one, many) in [
        (1_000_000_000u64, "miliardo", "miliardi"),
        (1_000_000, "milione", "milioni"),
    ] {
        let k = rest / scale;
        rest %= scale;
        if k == 1 {
            out.push("un".into());
            out.push(one.into());
        } else if k > 1 {
            let mut w = Vec::new();
            below_1000(k, &mut w);
            apocope_last(&mut w);
            out.extend(w);
            out.push(many.into());
        }
    }
    let k = rest / 1000;
    rest %= 1000;
    if k == 1 {
        out.push("mille".into());
    } else if k > 1 {
        let mut w = Vec::new();
        below_1000(k, &mut w);
        if k % 100 == 1 && k > 100 {
            // 201 000 → "duecentounomila": keep "uno" whole and joined.
            let last = w.pop().unwrap_or_default();
            let prev = w.pop().unwrap_or_default();
            w.push(format!("{prev}{last}mila"));
        } else {
            apocope_last(&mut w);
            if let Some(last) = w.last_mut() {
                last.push_str("mila");
            }
        }
        out.extend(w);
    }
    if rest > 0 {
        below_1000(rest, &mut out);
    }
    out
}

/// Cardinal written as one word, as used to build ordinals: 123 → "centoventitré".
fn cardinal_joined(n: u64) -> String {
    cardinal(n).concat()
}

/// Ordinal number: 1 → "primo", 21 → "ventunesimo", 23 → "ventitreesimo".
pub fn ordinal(n: u64, feminine: bool) -> String {
    let masculine = if (1..=10).contains(&n) {
        ORDINALS[n as usize].to_string()
    } else if n == 1_000_000 {
        "milionesimo".to_string()
    } else {
        let base = cardinal_joined(n);
        if let Some(stem) = base.strip_suffix("tré") {
            format!("{stem}treesimo")
        } else if base.ends_with("sei") {
            format!("{base}esimo")
        } else {
            let mut s = base;
            s.pop();
            s + "esimo"
        }
    };
    if feminine {
        let mut s = masculine;
        s.pop();
        s + "a"
    } else {
        masculine
    }
}

/// Plural ordinal for fraction denominators: 3 → "terzi", 2 → "mezzi".
pub fn denominator_plural(n: u64) -> String {
    if n == 2 {
        return "mezzi".into();
    }
    let mut s = ordinal(n, false);
    s.pop();
    s + "i"
}

/// Each digit as a word: "007" → ["zero", "zero", "sette"].
pub fn digits(s: &str) -> Vec<String> {
    s.chars()
        .filter_map(|c| c.to_digit(10))
        .map(|d| UNITS[d as usize].to_string())
        .collect()
}

/// Digits after a decimal separator: "5" → ["cinque"], "05" → ["zero", "cinque"],
/// "14" → ["quattordici"], "14159" → digit by digit.
pub fn decimals(frac: &str) -> Vec<String> {
    let zeros = frac.len() - frac.trim_start_matches('0').len();
    let rest = &frac[zeros..];
    let mut out: Vec<String> = std::iter::repeat_n("zero".to_string(), zeros).collect();
    if rest.is_empty() {
        return out;
    }
    if frac.len() <= 3 {
        out.extend(cardinal(rest.parse().unwrap_or(0)));
    } else {
        out.extend(digits(rest));
    }
    out
}

/// Splits a long digit group into chunks that are easy to follow by ear (phone numbers).
pub fn phone_chunks(group: &str) -> Vec<&str> {
    let n = group.len();
    let sizes: &[usize] = match n {
        0..=4 => &[n],
        5 => &[2, 3],
        6 => &[3, 3],
        7 => &[3, 4],
        8 => &[4, 4],
        9 => &[3, 3, 3],
        10 => &[3, 3, 4],
        11 => &[3, 4, 4],
        _ => &[],
    };
    if sizes.is_empty() {
        return group
            .as_bytes()
            .chunks(3)
            .map(|c| std::str::from_utf8(c).unwrap_or(""))
            .collect();
    }
    let mut out = Vec::new();
    let mut at = 0;
    for &s in sizes {
        out.push(&group[at..at + s]);
        at += s;
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn c(n: u64) -> String {
        cardinal(n).join(" ")
    }

    #[test]
    fn cardinals() {
        assert_eq!(c(0), "zero");
        assert_eq!(c(1), "uno");
        assert_eq!(c(3), "tre");
        assert_eq!(c(17), "diciassette");
        assert_eq!(c(21), "ventuno");
        assert_eq!(c(23), "ventitré");
        assert_eq!(c(28), "ventotto");
        assert_eq!(c(80), "ottanta");
        assert_eq!(c(100), "cento");
        assert_eq!(c(101), "cento uno");
        assert_eq!(c(188), "cento ottantotto");
        assert_eq!(c(800), "ottocento");
        assert_eq!(c(1000), "mille");
        assert_eq!(c(1250), "mille duecento cinquanta");
        assert_eq!(c(2000), "duemila");
        assert_eq!(c(2027), "duemila ventisette");
        assert_eq!(c(21_000), "ventunmila");
        assert_eq!(c(250_000), "duecento cinquantamila");
        assert_eq!(c(201_000), "duecentounomila");
        assert_eq!(c(1_000_000), "un milione");
        assert_eq!(c(1_250_000), "un milione duecento cinquantamila");
        assert_eq!(c(21_000_000), "ventun milioni");
        assert_eq!(c(3_000_000_000), "tre miliardi");
        assert_eq!(
            c(1_000_000_000_000),
            "uno zero zero zero zero zero zero zero zero zero zero zero zero"
        );
    }

    #[test]
    fn ordinals() {
        assert_eq!(ordinal(1, false), "primo");
        assert_eq!(ordinal(1, true), "prima");
        assert_eq!(ordinal(10, false), "decimo");
        assert_eq!(ordinal(11, false), "undicesimo");
        assert_eq!(ordinal(20, false), "ventesimo");
        assert_eq!(ordinal(21, false), "ventunesimo");
        assert_eq!(ordinal(23, false), "ventitreesimo");
        assert_eq!(ordinal(26, false), "ventiseiesimo");
        assert_eq!(ordinal(100, false), "centesimo");
        assert_eq!(ordinal(1000, false), "millesimo");
        assert_eq!(ordinal(14, true), "quattordicesima");
        assert_eq!(denominator_plural(3), "terzi");
        assert_eq!(denominator_plural(4), "quarti");
        assert_eq!(denominator_plural(2), "mezzi");
    }

    #[test]
    fn decimal_digits() {
        assert_eq!(decimals("5").join(" "), "cinque");
        assert_eq!(decimals("05").join(" "), "zero cinque");
        assert_eq!(decimals("14").join(" "), "quattordici");
        assert_eq!(decimals("14159").join(" "), "uno quattro uno cinque nove");
        assert_eq!(phone_chunks("1234567"), vec!["123", "4567"]);
        assert_eq!(phone_chunks("3331234567"), vec!["333", "123", "4567"]);
    }
}
