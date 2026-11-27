// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The program's translations. One catalogue for the website and the program (`website/lingue`, docs/translating.md): the build
//! reads it, keeps the languages that are ready, and writes their messages into the program as tables. Nothing is read at
//! run time, and there is no dependency.
//!
//! - A message is written where it is used, with its key and its Italian text: `tr!("programma.sessione.parlo" => "Sto
//!   parlando…")`, or with a count `trn!("programma.crea.mancano" => "Ne manca {n}" | "Ne mancano {n}", secondi)`, and named
//!   arguments after it: `tr!("programma.crea.leggo" => "Leggo «{nome}»…", nome = file)`. `tools/translations.py extract` finds
//!   the calls and writes the entries of the catalogue; the window's `@tr` reads the same catalogue.
//! - The language is chosen once, at start, from the system ([`choose`]); a language that is not whole in the catalogue is not
//!   in the program, so the program shows it whole or shows Italian whole, never half. Italian is the text of the source.

pub mod catalogo;
pub mod plural;
pub mod scritture;

use std::cell::Cell;
use std::fmt::Display;
use std::sync::atomic::{AtomicUsize, Ordering};

/// The messages of one language, written by the build.
pub struct Table {
    pub code: &'static str,
    pub forms: usize,
    pub plural: fn(u64) -> usize,
    /// By key, in order.
    pub messages: &'static [(&'static str, &'static [&'static str])],
}

// What the build wrote (build.rs): the tables and the plural rule of each language. It is code made by a machine, a rule written the way
// gettext writes it, so what the linters say about style is not for a person to fix there.
#[allow(unused_parens, unused_variables, clippy::all, clippy::pedantic)]
mod generato {
    include!(concat!(env!("OUT_DIR"), "/tabelle.rs"));
}
use generato::TABLES;

/// The source language: the text of the code.
pub const SOURCE: &str = "it";

pub use scritture::{KNOWN, RLM, Script, is_rtl, script_of};

// ---------- the language in use ----------
const ITALIAN: usize = usize::MAX;
static ACTIVE: AtomicUsize = AtomicUsize::new(ITALIAN);
thread_local! {
    /// A language for this thread only: the tests use it, so they do not disturb each other.
    static ONLY_HERE: Cell<Option<usize>> = const { Cell::new(None) };
}

fn index_of(code: &str) -> Option<usize> {
    if code == SOURCE {
        return Some(ITALIAN);
    }
    TABLES.iter().position(|t| t.code == code)
}

fn active() -> Option<&'static Table> {
    let i = ONLY_HERE
        .with(Cell::get)
        .unwrap_or_else(|| ACTIVE.load(Ordering::Relaxed));
    TABLES.get(i)
}

/// The codes of the languages in the program, Italian first. Only the ones whose catalogue is whole.
pub fn languages() -> Vec<&'static str> {
    std::iter::once(SOURCE)
        .chain(TABLES.iter().map(|t| t.code))
        .collect()
}

/// Puts a language in use for the whole program; false if the program does not have it.
pub fn set(code: &str) -> bool {
    match index_of(code) {
        Some(i) => {
            ACTIVE.store(i, Ordering::Relaxed);
            true
        }
        None => false,
    }
}

/// Runs `f` with `code` in use on this thread only (for tests).
pub fn with_language<T>(code: &str, f: impl FnOnce() -> T) -> T {
    let i =
        index_of(code).unwrap_or_else(|| panic!("the program has no «{code}»: {:?}", languages()));
    let before = ONLY_HERE.with(|c| c.replace(Some(i)));
    let out = f();
    ONLY_HERE.with(|c| c.set(before));
    out
}

/// The code of the language in use.
pub fn current() -> &'static str {
    active().map_or(SOURCE, |t| t.code)
}

// ---------- choosing the language ----------
/// `de_AT.UTF-8@euro` and `de-AT` → `de-AT`; `C`, `POSIX` and an empty value → nothing.
pub fn normalize(locale: &str) -> Option<String> {
    let base = locale.split(['.', '@']).next().unwrap_or_default().trim();
    if base.is_empty() || base == "C" || base == "POSIX" {
        return None;
    }
    Some(base.replace('_', "-"))
}

/// The language of the program closest to one preference (`pt-BR`, `de_AT.UTF-8`, `zh-Hant-TW`): the whole tag first (the
/// pseudo-languages), then the language part. `None` when the program has no such language.
pub fn match_one(preference: &str) -> Option<&'static str> {
    let tag = normalize(preference)?;
    let known = languages();
    // the pseudo-languages are written whole (`en-XA`), the others by their first part
    if let Some(c) = known.iter().find(|c| c.eq_ignore_ascii_case(&tag)) {
        return Some(c);
    }
    let first = tag.split('-').next()?.to_ascii_lowercase();
    known.into_iter().find(|c| *c == first)
}

/// The language to use for a list of preferences, the most wanted first: the first one the program has. Italian, the source, when
/// none is there.
pub fn choose(preferences: &[String]) -> &'static str {
    preferences
        .iter()
        .find_map(|p| match_one(p))
        .unwrap_or(SOURCE)
}

/// The preferences of a Linux (or any Unix) environment as gettext reads them: `LANGUAGE` (a list, colon-separated) first,
/// unless the locale is `C` or `POSIX`, where gettext ignores it; then `LC_ALL`, `LC_MESSAGES` and `LANG`, the first that is set.
pub fn preferences_from_env(get: &dyn Fn(&str) -> Option<String>) -> Vec<String> {
    let set = |name: &str| get(name).filter(|v| !v.is_empty());
    let locale = set("LC_ALL")
        .or_else(|| set("LC_MESSAGES"))
        .or_else(|| set("LANG"));
    let mut out = Vec::new();
    let plain = locale.as_deref().and_then(normalize);
    if plain.is_some()
        && let Some(list) = set("LANGUAGE")
    {
        out.extend(
            list.split(':')
                .filter(|p| !p.is_empty())
                .map(str::to_string),
        );
    }
    out.extend(locale);
    out
}

/// The preferences of the person, from the system: the environment on Linux, the system's own API on Windows and macOS.
#[cfg(target_os = "linux")]
pub fn system_preferences() -> Vec<String> {
    preferences_from_env(&|k| std::env::var(k).ok())
}

#[cfg(not(target_os = "linux"))]
pub fn system_preferences() -> Vec<String> {
    sys_locale::get_locales().collect()
}

/// The language to start with: `KALLIOPE_LINGUA` if it names a language of the program (to try one, or to ask for Italian), else
/// the system's. Puts it in use and says which.
pub fn init() -> &'static str {
    let forced = std::env::var("KALLIOPE_LINGUA").ok();
    let code = match forced.as_deref().and_then(match_one) {
        Some(c) => c,
        None => choose(&system_preferences()),
    };
    set(code);
    code
}

// ---------- messages ----------
/// The text of a message in the language in use, without its arguments.
fn lookup(key: &str, n: Option<u64>) -> Option<&'static str> {
    let table = active()?;
    let (_, forms) = table
        .messages
        .binary_search_by(|(k, _)| (*k).cmp(key))
        .ok()
        .map(|i| table.messages[i])?;
    let form = n
        .map_or(0, |n| (table.plural)(n))
        .min(forms.len().saturating_sub(1));
    forms.get(form).copied()
}

/// Puts the arguments in: `{name}` is the argument `name`, `{n}` the count, `{{` and `}}` the braces.
fn fill(text: &str, count: Option<u64>, args: &[(&str, &dyn Display)]) -> String {
    let mut out = String::with_capacity(text.len() + 16);
    let mut rest = text;
    while let Some(i) = rest.find(['{', '}']) {
        out.push_str(&rest[..i]);
        let after = &rest[i..];
        if after.starts_with("{{") || after.starts_with("}}") {
            out.push_str(&after[..1]);
            rest = &after[2..];
            continue;
        }
        if let Some(name) = after
            .strip_prefix('{')
            .and_then(|a| a.split_once('}'))
            .map(|(n, _)| n)
        {
            let value = if name == "n" {
                count.map(|c| c.to_string())
            } else {
                args.iter()
                    .find(|(k, _)| *k == name)
                    .map(|(_, v)| v.to_string())
            };
            if let Some(v) = value {
                out.push_str(&v);
                rest = &after[name.len() + 2..];
                continue;
            }
        }
        out.push_str(&after[..1]);
        rest = &after[1..];
    }
    out.push_str(rest);
    out
}

#[doc(hidden)]
pub fn message(key: &str, italian: &str, args: &[(&str, &dyn Display)]) -> String {
    fill(lookup(key, None).unwrap_or(italian), None, args)
}

#[doc(hidden)]
pub fn message_n(
    key: &str,
    singular: &str,
    plural: &str,
    n: u64,
    args: &[(&str, &dyn Display)],
) -> String {
    let text = match lookup(key, Some(n)) {
        Some(t) => t,
        None if n == 1 => singular,
        None => plural,
    };
    fill(text, Some(n), args)
}

/// A message: `tr!("programma.area.nome" => "Testo italiano")`, with arguments `tr!("…" => "Leggo «{nome}»", nome = x)`.
#[macro_export]
macro_rules! tr {
    ($key:literal => $text:literal $(, $name:ident = $value:expr)* $(,)?) => {
        $crate::message($key, $text, &[$((stringify!($name), &$value as &dyn ::std::fmt::Display)),*])
    };
}

/// A message with a count: `trn!("…" => "Ne manca {n}" | "Ne mancano {n}", count, nome = x)`. `{n}` is the count.
#[macro_export]
macro_rules! trn {
    ($key:literal => $one:literal | $many:literal, $n:expr $(, $name:ident = $value:expr)* $(,)?) => {
        $crate::message_n($key, $one, $many, ($n) as u64, &[$((stringify!($name), &$value as &dyn ::std::fmt::Display)),*])
    };
}

#[cfg(test)]
mod tests {
    use super::*;

    fn env(pairs: &[(&str, &str)]) -> impl Fn(&str) -> Option<String> {
        let map: Vec<(String, String)> = pairs
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect();
        move |k| map.iter().find(|(n, _)| n == k).map(|(_, v)| v.clone())
    }

    #[test]
    fn locales_are_normalised() {
        assert_eq!(normalize("de_AT.UTF-8@euro").as_deref(), Some("de-AT"));
        assert_eq!(normalize("zh-Hant-TW").as_deref(), Some("zh-Hant-TW"));
        assert_eq!(normalize("pt_BR").as_deref(), Some("pt-BR"));
        for none in ["", "C", "POSIX", "C.UTF-8", "  "] {
            assert_eq!(normalize(none), None, "{none:?}");
        }
    }

    #[test]
    fn the_environment_is_read_as_gettext_does() {
        // LANGUAGE first, then LC_ALL, LC_MESSAGES, LANG: the first that is set
        let p = preferences_from_env(&env(&[
            ("LANGUAGE", "fr:de"),
            ("LC_ALL", "it_IT.UTF-8"),
            ("LANG", "en_US.UTF-8"),
        ]));
        assert_eq!(p, ["fr", "de", "it_IT.UTF-8"]);
        let p = preferences_from_env(&env(&[("LC_MESSAGES", "de_DE"), ("LANG", "en_US")]));
        assert_eq!(p, ["de_DE"]);
        let p = preferences_from_env(&env(&[("LANG", "ar_EG.UTF-8")]));
        assert_eq!(p, ["ar_EG.UTF-8"]);
        // C or POSIX: LANGUAGE is ignored, as in gettext
        assert_eq!(
            preferences_from_env(&env(&[("LANGUAGE", "de"), ("LC_ALL", "C")])),
            ["C"]
        );
        assert_eq!(
            preferences_from_env(&env(&[("LANGUAGE", "de"), ("LANG", "POSIX")])),
            ["POSIX"]
        );
        // nothing at all
        assert!(preferences_from_env(&env(&[])).is_empty());
        // an empty value is not set
        assert_eq!(
            preferences_from_env(&env(&[("LC_ALL", ""), ("LANG", "fr_FR")])),
            ["fr_FR"]
        );
    }

    #[test]
    fn italian_is_the_answer_when_nothing_matches() {
        assert_eq!(choose(&[]), "it");
        assert_eq!(choose(&["tlh_XX".to_string()]), "it");
        assert_eq!(choose(&["it_IT.UTF-8".to_string()]), "it");
        assert_eq!(choose(&["C".to_string()]), "it");
    }

    #[test]
    fn a_language_the_program_has_is_found_by_its_first_part() {
        for code in languages().into_iter().filter(|c| !c.contains("-X")) {
            assert_eq!(choose(&[format!("{code}_XX.UTF-8")]), code, "{code}");
            assert_eq!(choose(&[code.to_uppercase()]), code, "{code}");
        }
        // the first preference the program has, not the first one written
        if let Some(&other) = languages().iter().find(|c| **c != "it") {
            assert_eq!(
                choose(&["tlh".into(), other.to_string(), "it".into()]),
                other
            );
            assert_eq!(choose(&["it".into(), other.to_string()]), "it");
        }
    }

    #[test]
    fn the_tables_are_in_order_for_the_search() {
        for t in TABLES {
            assert!(t.messages.windows(2).all(|w| w[0].0 < w[1].0), "{}", t.code);
            assert!(
                t.messages
                    .iter()
                    .all(|(_, f)| !f.is_empty() && f.len() <= t.forms.max(1)),
                "{}",
                t.code
            );
        }
    }

    #[test]
    fn arguments_and_braces() {
        assert_eq!(
            fill("Leggo «{nome}»…", None, &[("nome", &"a.wav")]),
            "Leggo «a.wav»…"
        );
        assert_eq!(fill("{{{n}}} {x}", Some(3), &[]), "{3} {x}");
        assert_eq!(fill("a {n} b {n}", Some(12), &[]), "a 12 b 12");
        assert_eq!(
            fill("senza {} niente { aperta", None, &[]),
            "senza {} niente { aperta"
        );
    }

    #[test]
    fn italian_is_the_source_text() {
        with_language("it", || {
            assert_eq!(tr!("programma.prova.x" => "Sto parlando…"), "Sto parlando…");
            assert_eq!(
                tr!("programma.prova.y" => "Leggo «{nome}»", nome = "a"),
                "Leggo «a»"
            );
            for (n, want) in [
                (0, "Ne mancano 0"),
                (1, "Ne manca 1"),
                (2, "Ne mancano 2"),
                (12, "Ne mancano 12"),
            ] {
                assert_eq!(
                    trn!("programma.prova.z" => "Ne manca {n}" | "Ne mancano {n}", n),
                    want
                );
            }
        });
    }
}
