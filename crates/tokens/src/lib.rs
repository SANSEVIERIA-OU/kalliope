// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The bridge from `design-system/token.css` to Slint (issue #12). The build reads the style sheet and writes a
//! Slint global, `Token`, with every value the window uses; the window's `.slint` files carry no colour, length
//! or duration of their own (`tools/slint_valori.py` checks it). The convention is in `design-system/TOKEN.md`.
//!
//! - The window sees the `--app-*` tokens declared in `:root`. `var()` is resolved here, so a role such as
//!   `--app-spazio-controlli: var(--spazio-10)` is how a shared value reaches the window.
//! - Colours are converted exactly (hex, rgb, hsl, hwb, lab, lch, oklab, oklch, color(srgb), color-mix).
//! - The light scheme is the rule `:root[data-tema="chiaro"]`; the base `:root` is the dark scheme.
//!   `Token.dark` follows the system, and a colour with two values is `dark ? … : …`. A variant that is
//!   incomplete stops the build.
//! - `--app-carattere-*: url("caratteri/…/Face.ttf")` embeds a font file in the program.

pub mod color;
pub mod css;
pub mod value;

use std::collections::{BTreeMap, BTreeSet};
use value::Value;

/// The prefix of the tokens the window sees.
pub const PREFIX: &str = "--app-";
/// A colour that is the same in both schemes ends with this; any other colour needs a light value.
pub const FIXED: &str = "-fisso";
/// The prefix of the tokens that embed a font file.
pub const FONT_PREFIX: &str = "--app-carattere-";

/// What Slint reserves, and what the generated global defines itself.
const RESERVED: &[&str] = &[
    "dark",
    "in",
    "out",
    "in-out",
    "property",
    "callback",
    "function",
    "pure",
    "public",
    "private",
    "if",
    "else",
    "for",
    "root",
    "self",
    "parent",
    "true",
    "false",
    "import",
    "export",
    "global",
    "component",
    "struct",
    "enum",
    "animate",
    "states",
    "transitions",
    "init",
    "return",
    "inherits",
    "from",
    "when",
    "in-out",
    "changed",
];

pub struct Output {
    /// The text of the generated `token.slint`.
    pub slint: String,
    /// The font files it embeds, relative to `design-system/`.
    pub fonts: Vec<String>,
    /// Every property of `Token`, by its Slint name, with the kind of value.
    pub properties: BTreeMap<String, &'static str>,
}

struct Scheme<'a> {
    root: BTreeMap<&'a str, Vec<&'a str>>,
    light: BTreeMap<&'a str, Vec<&'a str>>,
    is_light: bool,
}

impl Scheme<'_> {
    fn raw(&self, name: &str) -> Result<Option<String>, String> {
        let table = if self.is_light && self.light.contains_key(name) {
            &self.light
        } else {
            &self.root
        };
        let Some(values) = table.get(name) else {
            return Ok(None);
        };
        let mut distinct: Vec<&str> = values.clone();
        distinct.dedup();
        let first = distinct[0];
        if distinct.iter().any(|v| *v != first) {
            return Err(format!(
                "{name} is declared {} times in {} with different values ({}): which one is the token?",
                values.len(),
                if self.is_light && self.light.contains_key(name) {
                    css::LIGHT_SELECTOR
                } else {
                    ":root"
                },
                distinct.join(" | ")
            ));
        }
        Ok(Some(first.to_string()))
    }

    fn value(&self, name: &str) -> Result<Value, String> {
        let raw = self
            .raw(name)?
            .ok_or_else(|| format!("{name} is not declared"))?;
        let lookup = |n: &str| self.raw(n);
        let resolved = value::substitute(&raw, &lookup, &mut vec![name.to_string()])
            .map_err(|e| format!("{name}: {e}"))?;
        value::evaluate(&resolved).map_err(|e| {
            format!(
                "{name}: {raw} cannot become a value of the window ({e}). The window takes colours, lengths in px or rem, \
                 durations, plain numbers, percentages, easing curves, and a quoted font family; split a composite value \
                 (a padding, a shadow, a grid) into one token for each part, or keep it out of the --app- tokens"
            )
        })
    }

    /// Every token name `name` reaches through `var()`, itself included.
    fn reach(&self, name: &str, into: &mut BTreeSet<String>) {
        if !into.insert(name.to_string()) {
            return;
        }
        if let Ok(Some(raw)) = self.raw(name) {
            for r in value::references(&raw) {
                self.reach(&r, into);
            }
        }
    }
}

fn group(declarations: &[(String, String)]) -> BTreeMap<&str, Vec<&str>> {
    let mut out: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    for (n, v) in declarations {
        out.entry(n.as_str()).or_default().push(v.as_str());
    }
    out
}

fn slint_number(v: f64) -> String {
    let s = format!("{:.4}", v);
    let s = s.trim_end_matches('0').trim_end_matches('.');
    if s.is_empty() || s == "-0" {
        "0".into()
    } else {
        s.to_string()
    }
}

fn literal(v: &Value) -> String {
    match v {
        Value::Color(c) => c.to_slint(),
        Value::Length(x) => format!("{}px", slint_number(*x)),
        Value::Duration(x) => format!("{}ms", slint_number(*x)),
        Value::Number(x) => slint_number(*x),
        Value::Ratio(x) => slint_number(*x),
        Value::Easing(e) => e.clone(),
        Value::Family(f) => format!("\"{}\"", f.replace('\\', "\\\\").replace('"', "\\\"")),
        Value::FontFile(_) => unreachable!("a font file is not a property"),
    }
}

fn slint_type(v: &Value) -> &'static str {
    match v {
        Value::Color(_) => "color",
        Value::Length(_) => "length",
        Value::Duration(_) => "duration",
        Value::Number(x) if x.fract() == 0.0 => "int",
        Value::Number(_) | Value::Ratio(_) => "float",
        Value::Easing(_) => "easing",
        Value::Family(_) => "string",
        Value::FontFile(_) => "",
    }
}

fn slint_name(token: &str) -> Result<String, String> {
    let name = token.strip_prefix(PREFIX).unwrap_or(token);
    let ok = name.chars().next().is_some_and(|c| c.is_ascii_lowercase())
        && name
            .chars()
            .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-');
    if !ok || name.ends_with('-') || name.contains("--") {
        return Err(format!(
            "{token}: after {PREFIX} the name must be lowercase letters, digits and single dashes, starting with a letter"
        ));
    }
    if RESERVED.contains(&name) {
        return Err(format!(
            "{token}: `{name}` is a word of Slint or of the generated Token; choose another name"
        ));
    }
    Ok(name.to_string())
}

/// Reads `token.css` and writes the Slint global.
pub fn render(css: &str) -> Result<Output, String> {
    let sheet = css::parse(css)?;
    let dark = Scheme {
        root: group(&sheet.root),
        light: group(&sheet.light),
        is_light: false,
    };
    let light = Scheme {
        root: group(&sheet.root),
        light: group(&sheet.light),
        is_light: true,
    };

    // A variant without a base is incomplete.
    for name in light.light.keys() {
        if !light.root.contains_key(name) {
            return Err(format!(
                "{name} has a light value in {} but no dark one in :root: the dark scheme is the base, give it a value there",
                css::LIGHT_SELECTOR
            ));
        }
    }

    // The window's tokens: every --app- name declared in :root (dark and light name the same tokens).
    let exported: Vec<&str> = dark
        .root
        .keys()
        .copied()
        .filter(|n| n.starts_with(PREFIX))
        .collect();
    let mut properties = BTreeMap::new();
    let mut fonts = Vec::new();
    let mut body = String::new();
    let has_light = !light.light.is_empty();
    let mut seen_names: BTreeMap<String, &str> = BTreeMap::new();
    let mut incomplete: Vec<String> = Vec::new();

    for token in exported {
        let dv = dark.value(token)?;
        if let Value::FontFile(path) = &dv {
            if !token.starts_with(FONT_PREFIX) {
                return Err(format!(
                    "{token}: a font file is declared with a name that starts with {FONT_PREFIX}"
                ));
            }
            if light.value(token)? != dv {
                return Err(format!(
                    "{token}: a font file does not change with the scheme"
                ));
            }
            fonts.push(path.clone());
            continue;
        }
        if token.starts_with(FONT_PREFIX) {
            return Err(format!(
                "{token}: {FONT_PREFIX}* tokens are font files: url(\"caratteri/…/Face.ttf\"), found a {}",
                dv.kind()
            ));
        }
        let name = slint_name(token)?;
        if let Some(other) = seen_names.insert(name.clone(), token) {
            return Err(format!(
                "{token} and {other} become the same Slint name `{name}`"
            ));
        }
        let lv = light.value(token)?;
        if std::mem::discriminant(&dv) != std::mem::discriminant(&lv) {
            return Err(format!(
                "{token} is a {} in the dark scheme and a {} in the light one",
                dv.kind(),
                lv.kind()
            ));
        }

        // Is it themed? Its own declaration, or anything it reaches, has a light value.
        let mut reach = BTreeSet::new();
        dark.reach(token, &mut reach);
        light.reach(token, &mut reach);
        let themed = reach.iter().any(|n| light.light.contains_key(n.as_str()));
        let fixed = token.ends_with(FIXED);
        if matches!(dv, Value::Color(_)) && has_light {
            if fixed && themed {
                return Err(format!(
                    "{token} is named as the same in both schemes (-fisso) but the light scheme gives it another value"
                ));
            }
            if !fixed && !themed {
                incomplete.push(format!("{token} ({})", literal(&dv)));
            }
        }
        let ty = slint_type(&dv);
        let expr = if themed && dv != lv {
            format!("dark ? {} : {}", literal(&dv), literal(&lv))
        } else {
            literal(&dv)
        };
        body.push_str(&format!("    out property <{ty}> {name}: {expr};\n"));
        properties.insert(name, dv.kind());
    }

    if !incomplete.is_empty() {
        return Err(format!(
            "the light scheme is incomplete: {} colour(s) of the window have no light value: {}. Declare each in {} or, \
             if it is the same in both schemes, add {FIXED} to its name",
            incomplete.len(),
            incomplete.join(", "),
            css::LIGHT_SELECTOR
        ));
    }

    let mut slint = String::from(
        "// Generated from design-system/token.css by crates/tokens; do not edit.\n\
         // The window takes every colour, length, duration and typeface from here (tools/slint_valori.py checks it).\n\
         import { Palette } from \"std-widgets.slint\";\n",
    );
    fonts.sort();
    fonts.dedup();
    for f in &fonts {
        slint.push_str(&format!("import \"{f}\";\n"));
    }
    slint.push_str("\nexport global Token {\n");
    slint.push_str("    /// The system asks for the dark scheme. With no answer (no settings portal) it is the light one, like every Slint widget.\n");
    slint.push_str("    out property <bool> dark: Palette.color-scheme == ColorScheme.dark;\n");
    slint.push_str(&body);
    slint.push_str("}\n");
    Ok(Output {
        slint,
        fonts,
        properties,
    })
}
