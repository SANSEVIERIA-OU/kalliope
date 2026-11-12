// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Italian spelling → phonemes, one word at a time.
//!
//! The output follows the notation the voice models were trained on (espeak-ng IPA as fed by
//! the official Klein package): affricates as single symbols (ʧ ʤ ʦ ʣ), the stress mark right
//! before the stressed vowel, long stops and affricates with "ː" (tː, ʧː), long continuants
//! doubled (ll, nn, ɲɲ), "ss" as S, "rr" as rɾ, unstressed u as ʊ and a final unstressed i
//! after a consonant as ɪ.

/// How strongly a word is stressed in the sentence.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Stress {
    Primary,
    Secondary,
    /// Clitics and most function words ("il", "di", "che").
    None,
}

/// Pronunciation facts that spelling does not show, from the lexicon or the suffix table.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Hint {
    /// Stressed letter, counted from the end of the word (0 = last letter). Exact; from the
    /// lexicon.
    pub stress_from_end: Option<usize>,
    /// Stressed syllable, counted from the end (0 = last, 1 = next-to-last…). From the suffix
    /// table; used when `stress_from_end` is unknown.
    pub nucleus_from_end: Option<u8>,
    /// Quality of a stressed e ('e' or 'ɛ') and of a stressed o ('o' or 'ɔ').
    pub quality_e: Option<char>,
    pub quality_o: Option<char>,
    /// Voicing of each z (or zz) group in order: true = ʣ, false = ʦ.
    pub z_voiced: Option<u32>,
    /// Number of z groups described by `z_voiced`.
    pub z_groups: u8,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Role {
    Nucleus,
    /// i after c, g, sc, gl and before a vowel: spelling only ("ciao", "figlio").
    Silent,
    /// Rising i glide: "piano", "ieri".
    GlideJ,
    /// u after q or g, or initial before a vowel: "quando", "uomo".
    GlideW,
    /// u after another consonant before a vowel: "buono" → bʊˈɔno.
    GlideU,
    /// Second element of a falling diphthong: "zaino", "mai".
    FallI,
    FallU,
}

fn is_vowel(c: char) -> bool {
    matches!(c, 'a' | 'e' | 'i' | 'o' | 'u' | 'y')
}

fn front(c: Option<char>) -> bool {
    matches!(c, Some('e' | 'i' | 'y'))
}

/// Base letters and the written accent, if any: "città" → (c,i,t,t,a), Some((4, 'a')).
pub fn letters(word: &str) -> (Vec<char>, Option<(usize, char)>) {
    let mut out = Vec::with_capacity(word.len());
    let mut accent = None;
    for c in word.chars().flat_map(char::to_lowercase) {
        let (base, quality) = match c {
            'à' | 'á' | 'â' => ('a', Some('a')),
            'è' | 'ê' => ('e', Some('ɛ')),
            'é' => ('e', Some('e')),
            'ì' | 'í' | 'î' => ('i', Some('i')),
            'ò' | 'ô' => ('o', Some('ɔ')),
            'ó' => ('o', Some('o')),
            'ù' | 'ú' | 'û' => ('u', Some('u')),
            c if c.is_ascii_lowercase() => (c, None),
            _ => continue,
        };
        if let Some(q) = quality {
            accent = Some((out.len(), q));
        }
        out.push(base);
    }
    (out, accent)
}

fn roles(l: &[char], forced: Option<usize>) -> Vec<Option<Role>> {
    let n = l.len();
    let mut r: Vec<Option<Role>> = vec![None; n];
    let first_vowel = l.iter().position(|&c| is_vowel(c));
    for k in 0..n {
        let c = l[k];
        if !is_vowel(c) {
            continue;
        }
        if forced == Some(k) {
            r[k] = Some(Role::Nucleus);
            continue;
        }
        let prev = k.checked_sub(1).map(|p| l[p]);
        let prev_role = k.checked_sub(1).and_then(|p| r[p]);
        let next = l.get(k + 1).copied();
        let next_vowel = next.is_some_and(is_vowel);
        // "mio", "zia", "due", "lui": consonant + i/u + one final vowel is a hiatus.
        let short_hiatus =
            first_vowel == Some(k) && k + 2 == n && prev.is_some_and(|p| !is_vowel(p));
        let role = match c {
            'i' | 'y' if next_vowel => {
                let silent = match prev {
                    Some('c' | 'g') => true,
                    Some('l') => k >= 2 && l[k - 2] == 'g',
                    _ => false,
                };
                if silent {
                    Role::Silent
                } else if prev == Some('z') && next == Some('o') {
                    Role::Nucleus // "-zione" → ʦiˈone, as the models learned it
                } else if prev.is_none() || prev_role.is_some() {
                    Role::GlideJ
                } else if short_hiatus
                    || (matches!(prev, Some('r' | 'l')) && k >= 2 && !is_vowel(l[k - 2]))
                {
                    Role::Nucleus
                } else {
                    Role::GlideJ
                }
            }
            'i' | 'y' => {
                if prev_role == Some(Role::Nucleus) {
                    Role::FallI
                } else {
                    Role::Nucleus
                }
            }
            'u' if next_vowel => {
                if matches!(prev, Some('q' | 'g')) || prev.is_none() {
                    Role::GlideW
                } else if prev_role.is_some() || short_hiatus {
                    Role::Nucleus
                } else {
                    Role::GlideU
                }
            }
            'u' => {
                if prev_role == Some(Role::Nucleus) && matches!(prev, Some('a' | 'e')) {
                    Role::FallU
                } else {
                    Role::Nucleus
                }
            }
            _ => Role::Nucleus,
        };
        r[k] = Some(role);
    }
    r
}

/// An s that starts the second part of a compound stays voiceless between vowels:
/// "ventisette", "trentasei", "stasera".
fn compound_s(l: &[char], k: usize) -> bool {
    const FIRST: [&str; 9] = [
        "venti",
        "trenta",
        "quaranta",
        "cinquanta",
        "sessanta",
        "settanta",
        "ottanta",
        "novanta",
        "sta",
    ];
    let before: String = l[..k].iter().collect();
    let after: String = l[k..].iter().collect();
    FIRST
        .iter()
        .any(|f| before.ends_with(f) && (before.len() == f.len() || f.len() > 3))
        && (after.starts_with("se") || after.starts_with("sei") || after.starts_with("sera"))
}

/// Default voicing of the z at `k` (true = ʣ).
fn z_voiced_default(l: &[char], k: usize) -> bool {
    let word: String = l.iter().collect();
    if k == 0 {
        return true; // "zero", "zaino", "zio"
    }
    if l.get(k + 1) == Some(&'z') {
        // "organizzare", "mezzo", "azzurro" have ʣː; most zz ("pizza", "ragazzo") have ʦː.
        let izz = word.contains("izz") && !word.contains("pizz");
        return izz
            || word.starts_with("mezz")
            || word.starts_with("azzurr")
            || word.starts_with("rozz");
    }
    false
}

/// Index of the vowel letter that carries the stress: the syllable `from_end` counted from the
/// end (next-to-last by default), or the first one if the word is shorter.
fn stressed_index(l: &[char], r: &[Option<Role>], from_end: Option<u8>) -> Option<usize> {
    let nuclei: Vec<usize> = (0..l.len())
        .filter(|&k| r[k] == Some(Role::Nucleus))
        .collect();
    let n = nuclei.len();
    if n == 0 {
        return None;
    }
    let back = from_end.map_or(1, usize::from).min(n - 1);
    Some(nuclei[n - 1 - back])
}

/// Default stressed letter of a word, counted from its end.
pub fn default_stress_from_end(text: &str) -> Option<usize> {
    let (l, accent) = letters(text);
    if let Some((k, _)) = accent {
        return Some(l.len() - 1 - k);
    }
    let r = roles(&l, None);
    stressed_index(&l, &r, None).map(|k| l.len() - 1 - k)
}

/// Syllables after the stressed letter (`stress_from_end` letters from the end), or None when
/// that letter is not a syllable nucleus under the default spelling rules.
pub fn syllables_after(text: &str, stress_from_end: usize) -> Option<usize> {
    let (l, _) = letters(text);
    let k = l.len().checked_sub(stress_from_end + 1)?;
    let r = roles(&l, None);
    (r[k] == Some(Role::Nucleus)).then(|| {
        (k + 1..l.len())
            .filter(|&j| r[j] == Some(Role::Nucleus))
            .count()
    })
}

/// Phonemes of one word.
pub fn word(text: &str, hint: Hint, stress: Stress) -> String {
    let (l, accent) = letters(text);
    let n = l.len();
    if n == 0 {
        return String::new();
    }
    let forced = match accent {
        Some((k, _)) => Some(k),
        None => hint
            .stress_from_end
            .and_then(|d| n.checked_sub(d + 1))
            .filter(|&k| is_vowel(l[k])),
    };
    let r = roles(&l, forced);
    let s = forced.or_else(|| stressed_index(&l, &r, hint.nucleus_from_end));
    // Lighter-stressed function words ("della", "sulle") keep closed vowels unless written.
    let hint = if stress == Stress::Secondary {
        Hint {
            quality_e: None,
            quality_o: None,
            ..hint
        }
    } else {
        hint
    };
    let (quality_e, quality_o) = match accent {
        Some((_, q @ ('e' | 'ɛ'))) => (Some(q), hint.quality_o),
        Some((_, q @ ('o' | 'ɔ'))) => (hint.quality_e, Some(q)),
        _ => (hint.quality_e, hint.quality_o),
    };

    let mut out = String::with_capacity(n * 2);
    let mut z_group = 0u8;
    let mut k = 0;
    while k < n {
        let c = l[k];
        let next = l.get(k + 1).copied();
        let next2 = l.get(k + 2).copied();
        if is_vowel(c) {
            let stressed = s == Some(k) && stress != Stress::None;
            match r[k].unwrap_or(Role::Nucleus) {
                Role::Silent => {}
                Role::GlideJ => out.push('j'),
                Role::GlideW => out.push('w'),
                Role::GlideU | Role::FallU => out.push('ʊ'),
                Role::FallI => out.push(if k + 1 == n { 'i' } else { 'ɪ' }),
                Role::Nucleus => {
                    if stressed {
                        out.push(if stress == Stress::Primary {
                            'ˈ'
                        } else {
                            'ˌ'
                        });
                    }
                    let primary = stressed && stress == Stress::Primary;
                    let v = match c {
                        'a' => 'a',
                        'e' => match quality_e {
                            Some(q) if stressed => q,
                            _ => 'e',
                        },
                        'o' => match quality_o {
                            Some(q) if stressed => q,
                            _ if stressed && k >= 1 && r[k - 1] == Some(Role::GlideU) => 'ɔ', // "uo"
                            _ => 'o',
                        },
                        'u' => {
                            if primary {
                                'u'
                            } else {
                                'ʊ'
                            }
                        }
                        _ => {
                            // i, y: a final unstressed i after a consonant is ɪ
                            if !stressed && k + 1 == n && k > 0 && !is_vowel(l[k - 1]) {
                                'ɪ'
                            } else {
                                'i'
                            }
                        }
                    };
                    out.push(v);
                }
            }
            k += 1;
            continue;
        }
        let prev_vowel = k > 0 && is_vowel(l[k - 1]);
        let mut used = 1;
        match c {
            'b' | 'd' | 'p' | 't' | 'k' if next == Some(c) => {
                out.push(c);
                out.push('ː');
                used = 2;
            }
            'f' | 'l' | 'm' | 'v' if next == Some(c) => {
                out.push(c);
                out.push(c);
                used = 2;
            }
            'n' if next == Some('n') => {
                out.push_str("nn");
                used = 2;
            }
            'c' => {
                if next == Some('c') {
                    out.push_str(if front(next2) { "ʧː" } else { "kː" });
                    used = if next2 == Some('h') { 3 } else { 2 };
                } else if next == Some('h') {
                    out.push('k');
                    used = 2;
                } else if next == Some('q') {
                    out.push_str("kː");
                    used = 2;
                } else {
                    out.push(if front(next) { 'ʧ' } else { 'k' });
                }
            }
            'g' => {
                if next == Some('g') {
                    out.push_str(if front(next2) { "ʤː" } else { "ɡː" });
                    used = if next2 == Some('h') { 3 } else { 2 };
                } else if next == Some('h') {
                    out.push('ɡ');
                    used = 2;
                } else if next == Some('n') {
                    out.push_str(if k == 0 { "ɲ" } else { "ɲɲ" });
                    used = 2;
                } else if next == Some('l') && next2 == Some('i') {
                    out.push('ʎ');
                    used = 2;
                } else {
                    out.push(if front(next) { 'ʤ' } else { 'ɡ' });
                }
            }
            'h' => {}
            'q' => out.push('k'),
            'r' => {
                if next == Some('r') {
                    out.push_str("rɾ");
                    used = 2;
                } else {
                    out.push('r');
                }
            }
            's' => {
                if next == Some('c') && front(next2) {
                    out.push('ʃ');
                    used = 2;
                } else if next == Some('c') && next2 == Some('h') {
                    out.push_str("sk");
                    used = 3;
                } else if next == Some('c') {
                    out.push_str("sk");
                    used = 2;
                } else if next == Some('s') {
                    out.push('S');
                    used = 2;
                } else {
                    let voiced_next =
                        matches!(next, Some('b' | 'd' | 'g' | 'l' | 'm' | 'n' | 'r' | 'v'));
                    let between_vowels =
                        prev_vowel && next.is_some_and(is_vowel) && !compound_s(&l, k);
                    out.push(if voiced_next || between_vowels {
                        'z'
                    } else {
                        's'
                    });
                }
            }
            'z' => {
                let voiced = if z_group < hint.z_groups {
                    hint.z_voiced.unwrap_or(0) >> z_group & 1 == 1
                } else {
                    z_voiced_default(&l, k)
                };
                z_group += 1;
                out.push(if voiced { 'ʣ' } else { 'ʦ' });
                if next == Some('z') {
                    out.push('ː');
                    used = 2;
                }
            }
            'n' => {
                let hard_g = next == Some('g') && !front(next2) && next2 != Some('n');
                out.push(if hard_g { 'ŋ' } else { 'n' });
            }
            'x' => out.push_str("ks"),
            'j' => out.push('j'),
            'w' => out.push('w'),
            'b' | 'd' | 'f' | 'l' | 'm' | 'p' | 't' | 'v' | 'k' => out.push(c),
            _ => {}
        }
        k += used;
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn w(text: &str) -> String {
        word(text, Hint::default(), Stress::Primary)
    }

    #[test]
    fn spelling_rules() {
        let cases = [
            ("ciao", "ʧˈao"),
            ("casa", "kˈaza"),
            ("città", "ʧitːˈa"),
            ("perché", "perkˈe"),
            ("figlio", "fˈiʎo"),
            ("famiglia", "famˈiʎa"),
            ("bagno", "bˈaɲɲo"),
            ("gnomo", "ɲˈomo"),
            ("acqua", "ˈakːwa"),
            ("quando", "kwˈando"),
            ("guerra", "ɡwˈerɾa"),
            ("lingua", "lˈiŋɡwa"),
            ("aiuto", "ajˈuto"),
            ("zaino", "ʣˈaɪno"),
            ("piano", "pjˈano"),
            ("ieri", "jˈerɪ"),
            ("mio", "mˈio"),
            ("lui", "lˈui"),
            ("due", "dˈue"),
            ("buono", "bʊˈɔno"),
            ("azione", "aʦiˈone"),
            ("grazie", "ɡrˈaʦje"),
            ("scienza", "ʃˈenʦa"),
            ("cassa", "kˈaSa"),
            ("pizza", "pˈiʦːa"),
            ("fatto", "fˈatːo"),
            ("faccia", "fˈaʧːa"),
            ("sbaglio", "zbˈaʎo"),
            ("ufficio", "ʊffˈiʧo"),
            ("tutti", "tˈutːɪ"),
            ("gli", "ʎˈi"),
            ("chiesa", "kjˈeza"),
        ];
        let failures: Vec<String> = cases
            .iter()
            .filter(|(i, e)| w(i) != *e)
            .map(|(i, e)| format!("{i}: expected {e}, got {}", w(i)))
            .collect();
        assert!(failures.is_empty(), "{}", failures.join("\n"));
    }

    #[test]
    fn hints_and_function_words() {
        let tavolo = Hint {
            stress_from_end: Some(4),
            ..Hint::default()
        };
        assert_eq!(word("tavolo", tavolo, Stress::Primary), "tˈavolo");
        let telefono = Hint {
            stress_from_end: Some(4),
            quality_e: Some('ɛ'),
            ..Hint::default()
        };
        assert_eq!(word("telefono", telefono, Stress::Primary), "telˈɛfono");
        let farmacia = Hint {
            stress_from_end: Some(1),
            ..Hint::default()
        };
        assert_eq!(word("farmacia", farmacia, Stress::Primary), "farmaʧˈia");
        assert_eq!(word("di", Hint::default(), Stress::None), "dɪ");
        assert_eq!(word("un", Hint::default(), Stress::None), "ʊn");
        assert_eq!(word("una", Hint::default(), Stress::Secondary), "ˌʊna");
        let mezzo = Hint {
            z_voiced: Some(1),
            z_groups: 1,
            ..Hint::default()
        };
        assert_eq!(word("mezzo", mezzo, Stress::Primary), "mˈeʣːo");
    }
}
