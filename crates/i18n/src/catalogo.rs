// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The catalogue as the build reads it: `website/lingue/site.pot` is the model, `<xx>.po` one language each. A language goes
//! into the program only when its **whole** file is ready (the website's messages and the program's: docs/translating.md,
//! «When a language is ready»), the same rule `tools/translations.py` applies; the program takes from it the entries whose key
//! starts with `programma.`. The pseudo-languages `en-XA` and `ar-XB` are made here from the Italian text.
//!
//! Used by this crate's build script, by the window's build script (the bundle Slint reads) and by the tests.

use crate::plural;
use crate::scritture;
use std::collections::BTreeMap;
use std::path::Path;

/// The keys of the program's messages (the website's never start so).
pub const PREFIX: &str = "programma.";

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Entry {
    pub ctx: String,
    pub id: String,
    pub plural: Option<String>,
    /// `msgstr`, or `msgstr[0]`, `msgstr[1]`…
    pub forms: Vec<String>,
    pub fuzzy: bool,
}

#[derive(Debug, Default)]
pub struct Po {
    pub header: BTreeMap<String, String>,
    /// Without the obsolete ones (`#~`) and the ones without a `msgctxt`.
    pub entries: Vec<Entry>,
}

/// A language that is ready: the program's entries of its file.
#[derive(Debug, Clone)]
pub struct Language {
    pub code: String,
    pub nplurals: usize,
    /// The `Plural-Forms` header, as the file says it.
    pub plural: String,
    pub entries: Vec<Entry>,
}

pub struct Ready {
    /// Every language of the catalogue folder that is ready, by code (not Italian: it is the text of the source).
    pub languages: Vec<Language>,
    /// The ones that are not, and why (shown by the build).
    pub left_out: Vec<(String, String)>,
    /// The Italian text of the program's messages, from the model.
    pub source: Vec<Entry>,
    /// Italian as a language like the others, from `it.po` (which `extract` writes from the source, so it is whole): Slint bundles it
    /// too, so that a window in Italian has Italian's decimal separator, which a window with no language chosen does not.
    pub italian: Option<Language>,
}

fn unescape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c != '\\' {
            out.push(c);
            continue;
        }
        match chars.next() {
            Some('n') => out.push('\n'),
            Some('t') => out.push('\t'),
            Some('r') => out.push('\r'),
            Some('"') => out.push('"'),
            Some('\\') => out.push('\\'),
            Some(other) => {
                out.push('\\');
                out.push(other);
            }
            None => out.push('\\'),
        }
    }
    out
}

fn quoted(rest: &str) -> Option<String> {
    let rest = rest.trim();
    let inner = rest.strip_prefix('"')?.strip_suffix('"')?;
    Some(unescape(inner))
}

pub fn parse(text: &str) -> Result<Po, String> {
    let mut po = Po::default();
    let mut first = true;
    for block in text.replace("\r\n", "\n").split("\n\n") {
        if block.trim().is_empty() {
            continue;
        }
        let (mut ctx, mut id, mut plural) = (None, None::<String>, None);
        let mut strs: BTreeMap<usize, String> = BTreeMap::new();
        let (mut fuzzy, mut obsolete) = (false, false);
        // the field a continuation line adds to
        let mut field = "";
        let mut index = 0;
        for line in block.lines() {
            let line = line.trim_end();
            if line.starts_with("#~") {
                obsolete = true;
            } else if let Some(flags) = line.strip_prefix("#,") {
                fuzzy |= flags.split(',').any(|f| f.trim() == "fuzzy");
            } else if line.starts_with('#') || line.is_empty() {
            } else if let Some(r) = line.strip_prefix("msgctxt ") {
                ctx = quoted(r);
                field = "ctx";
            } else if let Some(r) = line.strip_prefix("msgid_plural ") {
                plural = quoted(r);
                field = "plural";
            } else if let Some(r) = line.strip_prefix("msgid ") {
                id = quoted(r);
                field = "id";
            } else if let Some(r) = line.strip_prefix("msgstr[") {
                let (n, rest) = r
                    .split_once(']')
                    .ok_or_else(|| format!("«{line}»: «]» missing"))?;
                index = n
                    .parse()
                    .map_err(|_| format!("«{line}»: the form is not a number"))?;
                strs.insert(
                    index,
                    quoted(rest).ok_or_else(|| format!("«{line}»: not a string"))?,
                );
                field = "str";
            } else if let Some(r) = line.strip_prefix("msgstr ") {
                index = 0;
                strs.insert(
                    0,
                    quoted(r).ok_or_else(|| format!("«{line}»: not a string"))?,
                );
                field = "str";
            } else if line.starts_with('"') {
                let more = quoted(line).ok_or_else(|| format!("«{line}»: not a string"))?;
                match field {
                    "ctx" => ctx.as_mut().map(|s| s.push_str(&more)).unwrap_or(()),
                    "id" => id.as_mut().map(|s| s.push_str(&more)).unwrap_or(()),
                    "plural" => plural.as_mut().map(|s| s.push_str(&more)).unwrap_or(()),
                    "str" => strs.entry(index).or_default().push_str(&more),
                    _ => return Err(format!("«{line}»: a string out of place")),
                }
            } else {
                return Err(format!("«{line}»: not a line of a .po file"));
            }
        }
        if obsolete {
            first = false;
            continue;
        }
        let id = id.unwrap_or_default();
        if first && ctx.is_none() && id.is_empty() {
            for l in strs.get(&0).cloned().unwrap_or_default().split('\n') {
                if let Some((k, v)) = l.split_once(':') {
                    po.header.insert(k.trim().to_string(), v.trim().to_string());
                }
            }
        } else if let Some(ctx) = ctx {
            po.entries.push(Entry {
                ctx,
                id,
                plural,
                forms: strs.into_values().collect(),
                fuzzy,
            });
        }
        first = false;
    }
    Ok(po)
}

fn read(path: &Path) -> Result<Po, String> {
    let text = std::fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
    parse(&text).map_err(|e| format!("{}: {e}", path.display()))
}

/// Why `po` is not a ready catalogue of `code` against the model, or its program's entries.
pub fn check(model: &[Entry], po: &Po, code: &str) -> Result<Language, String> {
    if let Some(l) = po.header.get("Language")
        && !l.is_empty()
        && l != code
    {
        return Err(format!("the header says Language «{l}»"));
    }
    let header = po
        .header
        .get("Plural-Forms")
        .ok_or("the header has no Plural-Forms")?;
    let (nplurals, _) = plural::header(header)?;
    let by_key: BTreeMap<&str, &Entry> = po.entries.iter().map(|e| (e.ctx.as_str(), e)).collect();
    let mut entries = Vec::new();
    for m in model {
        let Some(e) = by_key.get(m.ctx.as_str()) else {
            return Err(format!("{} is missing", m.ctx));
        };
        if e.id != m.id || e.plural != m.plural {
            return Err(format!("{}: the Italian text changed", m.ctx));
        }
        if e.fuzzy {
            return Err(format!("{} is fuzzy", m.ctx));
        }
        let wanted = if m.plural.is_some() { nplurals } else { 1 };
        if e.forms.len() != wanted || e.forms.iter().any(|f| f.trim().is_empty()) {
            return Err(format!(
                "{} is not translated ({wanted} form(s) wanted)",
                m.ctx
            ));
        }
        if m.ctx.starts_with(PREFIX) {
            entries.push((*e).clone());
        }
    }
    Ok(Language {
        code: code.to_string(),
        nplurals,
        plural: header.clone(),
        entries,
    })
}

/// Reads the catalogue folder: the model and every language, ready or not.
pub fn ready(dir: &Path) -> Result<Ready, String> {
    let model = read(&dir.join("site.pot"))?;
    let source: Vec<Entry> = model
        .entries
        .iter()
        .filter(|e| e.ctx.starts_with(PREFIX))
        .cloned()
        .collect();
    let mut files: Vec<_> = std::fs::read_dir(dir)
        .map_err(|e| format!("{}: {e}", dir.display()))?
        .filter_map(Result::ok)
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "po"))
        .collect();
    files.sort();
    let (mut languages, mut left_out, mut italian) = (Vec::new(), Vec::new(), None);
    for f in files {
        let code = f
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or_default()
            .to_string();
        let verdict = read(&f).and_then(|po| check(&model.entries, &po, &code));
        if code == "it" {
            italian = verdict.ok();
            continue;
        }
        match verdict {
            Ok(l) => languages.push(l),
            Err(why) => left_out.push((code, why)),
        }
    }
    Ok(Ready {
        languages,
        left_out,
        source,
        italian,
    })
}

// ---------- the pseudo-languages ----------
const FROM: &str = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
const TO: &str = "ÅáßβÇçÐðÉéƑƒĜĝĤĥÎîĴĵĶķĻļḾḿÑñÖöÞþǪǫŔŕŠšŢţÛûṼṽŴŵẊẋÝýŽž";
const FILLER: &str =
    "Ĺöŕéḿ ĩṕšûḿ ðöļöŕ šĩţ àḿéţ ċöñšéċţéţûŕ àðĩṕĩšċĩñĝ éļĩţ ššéð ðö éĩûšḿöð ţéḿṕöŕ";
pub const RLO: char = '\u{202e}';
pub const PDF: char = '\u{202c}';

/// What may stand between the braces of a placeholder: nothing, a number, or a name.
fn is_placeholder_name(inner: &[char]) -> bool {
    inner.iter().all(char::is_ascii_digit)
        || (inner[0].is_ascii_alphabetic() || inner[0] == '_')
            && inner.iter().all(|x| x.is_ascii_alphanumeric() || *x == '_')
}

/// Cuts a text into pieces: `(is a placeholder, text)`. A placeholder is `{}`, `{0}`, `{n}`, `{name}`; `{{` and `}}` too.
fn pieces(text: &str) -> Vec<(bool, String)> {
    let c: Vec<char> = text.chars().collect();
    let (mut out, mut plain, mut i) = (Vec::new(), String::new(), 0);
    let flush = |out: &mut Vec<(bool, String)>, plain: &mut String| {
        if !plain.is_empty() {
            out.push((false, std::mem::take(plain)));
        }
    };
    while i < c.len() {
        if (c[i] == '{' && c.get(i + 1) == Some(&'{'))
            || (c[i] == '}' && c.get(i + 1) == Some(&'}'))
        {
            flush(&mut out, &mut plain);
            out.push((true, c[i..i + 2].iter().collect()));
            i += 2;
        } else if c[i] == '{'
            && let Some(close) = c[i + 1..].iter().position(|&x| x == '}')
            && is_placeholder_name(&c[i + 1..i + 1 + close])
        {
            flush(&mut out, &mut plain);
            out.push((true, c[i..i + close + 2].iter().collect()));
            i += close + 2;
        } else {
            plain.push(c[i]);
            i += 1;
        }
    }
    flush(&mut out, &mut plain);
    out
}

fn filler(n: usize) -> String {
    let words: Vec<&str> = FILLER.split_whitespace().collect();
    let mut all = String::from(" ");
    all.push_str(
        &std::iter::repeat_n(words, n / 4 + 2)
            .flatten()
            .collect::<Vec<_>>()
            .join(" "),
    );
    let cut: Vec<char> = all.chars().take(n).collect();
    let mut out: String = cut
        .iter()
        .collect::<String>()
        .trim_end_matches(' ')
        .to_string();
    if cut.last() == Some(&' ') {
        out.push('·');
    }
    out
}

/// `en-XA`: accented letters, every piece of text 40% longer, `[` and `]` around the message. The same as
/// `tools/i18n/pseudo.py` (the fixture `tests/pseudo.txt` holds both).
pub fn en_xa(text: &str) -> String {
    let map: BTreeMap<char, char> = FROM.chars().zip(TO.chars()).collect();
    let seg = pieces(text);
    let with_text: Vec<usize> = seg
        .iter()
        .enumerate()
        .filter(|(_, (token, t))| !token && !t.trim().is_empty())
        .map(|(k, _)| k)
        .collect();
    let (first, last) = (with_text.first().copied(), with_text.last().copied());
    let mut out = String::new();
    for (k, (token, t)) in seg.iter().enumerate() {
        if *token {
            out.push_str(t);
            continue;
        }
        let mut r: String = t.chars().map(|c| *map.get(&c).unwrap_or(&c)).collect();
        let body_len = r.trim_matches(' ').chars().count();
        if body_len >= 2 {
            let end = r.trim_end_matches(' ').len();
            r.insert_str(end, &filler((body_len as f64 * 0.4).ceil() as usize));
        }
        if Some(k) == first {
            let lead = r.len() - r.trim_start_matches(' ').len();
            r.insert(lead, '[');
        }
        if Some(k) == last {
            let end = r.trim_end_matches(' ').len();
            r.insert(end, ']');
        }
        out.push_str(&r);
    }
    if first.is_none() {
        return format!("[{out}]");
    }
    out
}

/// `ar-XB`: the same words forced right to left.
pub fn ar_xb(text: &str) -> String {
    format!("{RLO}{text}{PDF}")
}

/// The pseudo-language `code` (`en-XA` or `ar-XB`) from the Italian entries.
pub fn pseudo(code: &str, source: &[Entry]) -> Language {
    let f: fn(&str) -> String = if code == "en-XA" { en_xa } else { ar_xb };
    Language {
        code: code.to_string(),
        nplurals: 2,
        plural: "nplurals=2; plural=(n != 1);".into(),
        entries: source
            .iter()
            .map(|e| Entry {
                forms: match &e.plural {
                    None => vec![f(&e.id)],
                    Some(p) => vec![f(&e.id), f(p)],
                },
                fuzzy: false,
                ..e.clone()
            })
            .collect(),
    }
}

/// The forms of an entry as the program carries them: in a language written from right to left each opens with the mark that makes
/// its paragraph right to left (`scritture::RLM`), and each placeholder is isolated (`scritture::FSI` … `scritture::PDI`).
fn forms_for(language: &Language, entry: &Entry) -> Vec<String> {
    if scritture::is_rtl(&language.code) {
        entry
            .forms
            .iter()
            .map(|f| format!("{}{}", scritture::RLM, isolate(f)))
            .collect()
    } else {
        entry.forms.clone()
    }
}

/// A text whose placeholders are each closed between the isolating marks; `{{` and `}}` are a brace, not a placeholder.
fn isolate(text: &str) -> String {
    pieces(text)
        .into_iter()
        .map(|(placeholder, t)| {
            if placeholder && t != "{{" && t != "}}" {
                format!("{}{t}{}", scritture::FSI, scritture::PDI)
            } else {
                t
            }
        })
        .collect()
}

fn escape(s: &str) -> String {
    s.replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\t', "\\t")
}

/// Writes what Slint's `with_bundled_translations` reads: `<dir>/<code>/LC_MESSAGES/<domain>.po` for each language, with the
/// program's entries only.
pub fn write_slint_bundle(languages: &[Language], domain: &str, dir: &Path) -> std::io::Result<()> {
    for l in languages {
        let folder = dir.join(&l.code).join("LC_MESSAGES");
        std::fs::create_dir_all(&folder)?;
        // Slint's reader of the rule does not know `!`: the same rule without it (plural::without_negation)
        let rule = plural::header(&l.plural)
            .map(|(n, e)| {
                format!(
                    "nplurals={n}; plural={};",
                    plural::to_gettext(&plural::without_negation(&e))
                )
            })
            .map_err(std::io::Error::other)?;
        let mut text = format!(
            "msgid \"\"\nmsgstr \"\"\n\"Content-Type: text/plain; charset=UTF-8\\n\"\n\"Language: {}\\n\"\n\"Plural-Forms: {rule}\\n\"\n",
            l.code
        );
        for e in &l.entries {
            text.push_str(&format!(
                "\nmsgctxt \"{}\"\nmsgid \"{}\"\n",
                escape(&e.ctx),
                escape(&e.id)
            ));
            match &e.plural {
                None => text.push_str(&format!("msgstr \"{}\"\n", escape(&forms_for(l, e)[0]))),
                Some(p) => {
                    text.push_str(&format!("msgid_plural \"{}\"\n", escape(p)));
                    for (i, f) in forms_for(l, e).iter().enumerate() {
                        text.push_str(&format!("msgstr[{i}] \"{}\"\n", escape(f)));
                    }
                }
            }
        }
        let path = folder.join(format!("{domain}.po"));
        if std::fs::read_to_string(&path).ok().as_deref() != Some(&text) {
            std::fs::write(path, text)?;
        }
    }
    Ok(())
}

/// The Rust text of the table the program reads: for each language its plural rule and its messages by key.
pub fn rust_tables(languages: &[Language]) -> Result<String, String> {
    let mut out = String::from(
        "// Generated by crates/i18n/build.rs from website/lingue; do not edit.\n\
         pub(crate) static TABLES: &[crate::Table] = &[\n",
    );
    let mut rules = String::new();
    for (i, l) in languages.iter().enumerate() {
        let (_, expr) = plural::header(&l.plural)?;
        rules.push_str(&format!(
            "fn plural_{i}(n: u64) -> usize {{\n    let n = n as i64;\n    ({}) as usize\n}}\n",
            plural::to_rust(&expr)
        ));
        let mut entries: Vec<&Entry> = l.entries.iter().collect();
        entries.sort_by(|a, b| a.ctx.cmp(&b.ctx));
        out.push_str(&format!(
            "    crate::Table {{ code: {:?}, forms: {}, plural: plural_{i}, messages: &[\n",
            l.code, l.nplurals
        ));
        for e in entries {
            let forms: Vec<String> = forms_for(l, e).iter().map(|f| format!("{f:?}")).collect();
            out.push_str(&format!(
                "        ({:?}, &[{}]),\n",
                e.ctx,
                forms.join(", ")
            ));
        }
        out.push_str("    ] },\n");
    }
    out.push_str("];\n");
    out.push_str(&rules);
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    const HEADER: &str = "msgid \"\"\nmsgstr \"\"\n\"Content-Type: text/plain; charset=UTF-8\\n\"\n\"Language: de\\n\"\n\"Plural-Forms: nplurals=2; plural=(n != 1);\\n\"\n";

    fn model() -> Vec<Entry> {
        parse(&format!(
            "{HEADER}\nmsgctxt \"menu.installa\"\nmsgid \"Installa\"\nmsgstr \"\"\n\n\
             msgctxt \"programma.finestra.altro\"\nmsgid \"Altro\"\nmsgstr \"\"\n\n\
             msgctxt \"programma.crea.mancano\"\nmsgid \"Ne manca {{n}}\"\nmsgid_plural \"Ne mancano {{n}}\"\nmsgstr[0] \"\"\nmsgstr[1] \"\"\n"
        ))
        .unwrap()
        .entries
    }

    fn language(body: &str) -> Po {
        parse(&format!("{HEADER}\n{body}")).unwrap()
    }

    const COMPLETE: &str = "msgctxt \"menu.installa\"\nmsgid \"Installa\"\nmsgstr \"Installieren\"\n\n\
        msgctxt \"programma.finestra.altro\"\nmsgid \"Altro\"\nmsgstr \"Mehr\"\n\n\
        msgctxt \"programma.crea.mancano\"\nmsgid \"Ne manca {n}\"\nmsgid_plural \"Ne mancano {n}\"\nmsgstr[0] \"Noch {n}\"\nmsgstr[1] \"Noch {n}\"\n";

    #[test]
    fn a_complete_file_is_ready_and_gives_the_programs_entries() {
        let l = check(&model(), &language(COMPLETE), "de").unwrap();
        assert_eq!(l.nplurals, 2);
        assert_eq!(l.entries.len(), 2);
        assert_eq!(l.entries[0].forms, ["Mehr"]);
    }

    #[test]
    fn a_language_is_not_ready_for_any_of_these() {
        let cases = [
            (
                "a program message missing",
                COMPLETE.replace("programma.finestra.altro", "programma.finestra.altro2"),
            ),
            (
                "a website message missing",
                COMPLETE.replace("menu.installa", "menu.installa2"),
            ),
            ("an empty translation", COMPLETE.replace("\"Mehr\"", "\"\"")),
            (
                "a fuzzy entry",
                COMPLETE.replace(
                    "msgctxt \"programma.finestra.altro\"",
                    "#, fuzzy\nmsgctxt \"programma.finestra.altro\"",
                ),
            ),
            (
                "a changed Italian text",
                COMPLETE.replace("msgid \"Altro\"", "msgid \"Altre cose\""),
            ),
            (
                "a missing plural form",
                COMPLETE.replace("msgstr[1] \"Noch {n}\"\n", ""),
            ),
            (
                "an empty plural form",
                COMPLETE.replace("msgstr[1] \"Noch {n}\"", "msgstr[1] \"\""),
            ),
        ];
        for (why, body) in cases {
            assert!(check(&model(), &language(&body), "de").is_err(), "{why}");
        }
        // another language's header
        assert!(check(&model(), &language(COMPLETE), "fr").is_err());
    }

    #[test]
    fn an_obsolete_entry_does_not_count_and_continued_lines_join() {
        let body = format!(
            "{COMPLETE}\n#~ msgctxt \"vecchia\"\n#~ msgid \"x\"\n#~ msgstr \"\"\n\nmsgctxt \"programma.nuova\"\nmsgid \"\"\n\"a \"\n\"b\"\nmsgstr \"\"\n\"c\\n\"\n\"d\"\n"
        );
        let po = language(&body);
        assert!(po.entries.iter().all(|e| e.ctx != "vecchia"));
        let nuova = po
            .entries
            .iter()
            .find(|e| e.ctx == "programma.nuova")
            .unwrap();
        assert_eq!(nuova.id, "a b");
        assert_eq!(nuova.forms, ["c\nd"]);
    }

    #[test]
    fn pieces_keep_placeholders_whole() {
        let p = pieces("Ne {0} di {n} «{nome}» {{ok}} {x y}");
        let tokens: Vec<&str> = p
            .iter()
            .filter(|(t, _)| *t)
            .map(|(_, s)| s.as_str())
            .collect();
        assert_eq!(tokens, ["{0}", "{n}", "{nome}", "{{", "}}"]);
    }

    #[test]
    fn pseudo_languages_match_the_python_ones() {
        // tests/pseudo.txt: `mode|input|output`, written by tools/test_traduzioni_app.py from tools/i18n/pseudo.py
        let fixture = include_str!("../tests/pseudo.txt");
        let mut n = 0;
        for line in fixture.lines().filter(|l| !l.is_empty()) {
            let mut p = line.splitn(3, '|');
            let (mode, input, output) = (p.next().unwrap(), p.next().unwrap(), p.next().unwrap());
            let (input, output) = (input.replace("\\n", "\n"), output.replace("\\n", "\n"));
            let got = if mode == "en-XA" {
                en_xa(&input)
            } else {
                ar_xb(&input)
            };
            assert_eq!(got, output, "{mode} of «{input}»");
            n += 1;
        }
        assert!(n >= 10);
    }

    #[test]
    fn a_folder_gives_the_whole_languages_and_says_why_the_others_are_left_out() {
        let dir = std::env::temp_dir().join(format!("kalliope-i18n-folder-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let pot = format!(
            "{HEADER}\nmsgctxt \"menu.installa\"\nmsgid \"Installa\"\nmsgstr \"\"\n\n\
             msgctxt \"programma.finestra.altro\"\nmsgid \"Altro\"\nmsgstr \"\"\n\n\
             msgctxt \"programma.crea.mancano\"\nmsgid \"Ne manca {{n}}\"\nmsgid_plural \"Ne mancano {{n}}\"\nmsgstr[0] \"\"\nmsgstr[1] \"\"\n"
        );
        std::fs::write(dir.join("site.pot"), &pot).unwrap();
        // it.po is what `extract` writes: the Italian text as its own translation
        std::fs::write(
            dir.join("it.po"),
            format!("{HEADER}\n{COMPLETE}")
                .replace("Language: de", "Language: it")
                .replace("Installieren", "Installa")
                .replace("\"Mehr\"", "\"Altro\"")
                .replace("\"Noch {n}\"", "\"Ne mancano {n}\""),
        )
        .unwrap();
        std::fs::write(dir.join("de.po"), format!("{HEADER}\n{COMPLETE}")).unwrap();
        // French is there, but a message of the program is not translated yet: the program shows Italian, whole, not French by half
        std::fs::write(
            dir.join("fr.po"),
            format!(
                "{HEADER}\n{}",
                COMPLETE.replace("msgstr \"Mehr\"", "msgstr \"\"")
            )
            .replace("Language: de", "Language: fr"),
        )
        .unwrap();
        let ready = ready(&dir).unwrap();
        assert_eq!(
            ready
                .languages
                .iter()
                .map(|l| l.code.as_str())
                .collect::<Vec<_>>(),
            ["de"]
        );
        // Italian is not in the list of languages the program's tables carry, but it is there for Slint's bundle
        assert_eq!(ready.italian.as_ref().map(|l| l.code.as_str()), Some("it"));
        assert_eq!(ready.left_out.len(), 1);
        assert_eq!(ready.left_out[0].0, "fr");
        assert!(
            ready.left_out[0].1.contains("programma.finestra.altro"),
            "{}",
            ready.left_out[0].1
        );
        // the program's entries of the model, in Italian
        assert_eq!(
            ready
                .source
                .iter()
                .map(|e| e.ctx.as_str())
                .collect::<Vec<_>>(),
            ["programma.finestra.altro", "programma.crea.mancano"]
        );
    }

    #[test]
    fn a_language_from_right_to_left_has_its_paragraphs_marked() {
        let model = model();
        let mut l = check(&model, &language(COMPLETE), "de").unwrap();
        let rust = rust_tables(std::slice::from_ref(&l)).unwrap();
        assert!(
            !rust.contains('\u{200f}') && !rust.contains("\\u{200f}"),
            "German is left to right"
        );
        l.code = "ar".into();
        let rust = rust_tables(std::slice::from_ref(&l)).unwrap();
        assert!(rust.contains("\"\\u{200f}Mehr\""), "{rust}");
        let dir = std::env::temp_dir().join(format!("kalliope-i18n-rtl-{}", std::process::id()));
        write_slint_bundle(std::slice::from_ref(&l), "kalliope-app", &dir).unwrap();
        let po =
            parse(&std::fs::read_to_string(dir.join("ar/LC_MESSAGES/kalliope-app.po")).unwrap())
                .unwrap();
        assert_eq!(po.entries[0].forms, ["\u{200f}Mehr"]);
        // what fills a placeholder is isolated: a Latin name keeps the punctuation of the sentence where it belongs
        assert_eq!(
            po.entries[1].forms,
            [
                "\u{200f}Noch \u{2068}{n}\u{2069}",
                "\u{200f}Noch \u{2068}{n}\u{2069}"
            ]
        );
        assert_eq!(
            isolate("«{}» {{x}} {nome}"),
            "«\u{2068}{}\u{2069}» {{x}} \u{2068}{nome}\u{2069}"
        );
        // the pseudo-language from right to left is marked too
        let p = pseudo("ar-XB", &[model[1].clone()]);
        assert!(forms_for(&p, &p.entries[0])[0].starts_with(scritture::RLM));
    }

    #[test]
    fn the_slint_bundle_and_the_tables_carry_the_same_messages() {
        let l = check(&model(), &language(COMPLETE), "de").unwrap();
        let dir = std::env::temp_dir().join(format!("kalliope-i18n-bundle-{}", std::process::id()));
        write_slint_bundle(std::slice::from_ref(&l), "kalliope-app", &dir).unwrap();
        let po =
            parse(&std::fs::read_to_string(dir.join("de/LC_MESSAGES/kalliope-app.po")).unwrap())
                .unwrap();
        assert_eq!(po.header["Plural-Forms"], "nplurals=2; plural=n!=1;");
        assert_eq!(po.entries, l.entries);
        let rust = rust_tables(&[l]).unwrap();
        assert!(rust.contains("\"programma.crea.mancano\", &[\"Noch {n}\", \"Noch {n}\"]"));
        assert!(rust.contains("fn plural_0"));
    }
}
