// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! What a token's value is, once `var()` is resolved: a colour, a length, a duration, a number, an easing
//! curve, a font family or a font file.

use crate::color::{self, Rgba8};

/// The `rem` of the website: `html` sets no font size, so it is the browser's 16 px.
pub const REM_PX: f64 = 16.0;

#[derive(Clone, Debug, PartialEq)]
pub enum Value {
    Color(Rgba8),
    /// Logical pixels.
    Length(f64),
    /// Milliseconds.
    Duration(f64),
    Number(f64),
    /// A percentage, as the ratio Slint wants: 42% is 0.42.
    Ratio(f64),
    Easing(String),
    /// The first family of a quoted font list: Slint finds the glyphs the face lacks itself.
    Family(String),
    /// A font file under design-system/, embedded in the program.
    FontFile(String),
}

impl Value {
    pub fn kind(&self) -> &'static str {
        match self {
            Value::Color(_) => "colour",
            Value::Length(_) => "length",
            Value::Duration(_) => "duration",
            Value::Number(_) => "number",
            Value::Ratio(_) => "percentage",
            Value::Easing(_) => "easing curve",
            Value::Family(_) => "font family",
            Value::FontFile(_) => "font file",
        }
    }
}

/// Replaces every `var(--x)` and `var(--x, fallback)` by what `lookup` says, recursively.
pub fn substitute(
    value: &str,
    lookup: &dyn Fn(&str) -> Result<Option<String>, String>,
    stack: &mut Vec<String>,
) -> Result<String, String> {
    let mut out = String::new();
    let mut rest = value;
    while let Some(at) = rest.find("var(") {
        // `var(` must not be the end of a longer name (`somevar(`).
        if at > 0
            && rest[..at]
                .chars()
                .next_back()
                .is_some_and(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
        {
            out.push_str(&rest[..at + 4]);
            rest = &rest[at + 4..];
            continue;
        }
        out.push_str(&rest[..at]);
        let after = &rest[at + 4..];
        let mut depth = 1;
        let mut end = None;
        for (i, c) in after.char_indices() {
            match c {
                '(' => depth += 1,
                ')' => {
                    depth -= 1;
                    if depth == 0 {
                        end = Some(i);
                        break;
                    }
                }
                _ => {}
            }
        }
        let end = end.ok_or_else(|| format!("var( is never closed in `{value}`"))?;
        let inner = &after[..end];
        let (name, fallback) = match inner.split_once(',') {
            Some((n, f)) => (n.trim(), Some(f.trim())),
            None => (inner.trim(), None),
        };
        if stack.iter().any(|s| s == name) {
            return Err(format!(
                "{} refers to itself ({})",
                name,
                stack.join(" -> ")
            ));
        }
        let replacement = match lookup(name)? {
            Some(raw) => {
                stack.push(name.to_string());
                let resolved = substitute(&raw, lookup, stack)?;
                stack.pop();
                resolved
            }
            None => match fallback {
                Some(f) => substitute(f, lookup, stack)?,
                None => return Err(format!("{name} is not declared in :root")),
            },
        };
        out.push_str(&replacement);
        rest = &after[end + 1..];
    }
    out.push_str(rest);
    Ok(out)
}

/// The names `var()` reaches in a raw value (not recursive).
pub fn references(value: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut rest = value;
    while let Some(at) = rest.find("var(") {
        let after = &rest[at + 4..];
        let name: String = after
            .chars()
            .take_while(|c| *c != ',' && *c != ')')
            .collect();
        out.push(name.trim().to_string());
        rest = after;
    }
    out
}

// ---- arithmetic with units -------------------------------------------------------------------------

#[derive(Clone, Copy, Debug, PartialEq)]
enum Dim {
    Number,
    Length,
    Time,
    Ratio,
}

#[derive(Clone, Copy, Debug)]
struct Quantity {
    v: f64,
    dim: Dim,
}

struct Parser<'a> {
    s: &'a [u8],
    i: usize,
}

impl Parser<'_> {
    fn ws(&mut self) {
        while self.i < self.s.len() && self.s[self.i].is_ascii_whitespace() {
            self.i += 1;
        }
    }
    fn peek(&mut self) -> Option<u8> {
        self.ws();
        self.s.get(self.i).copied()
    }
    fn expr(&mut self) -> Result<Quantity, String> {
        let mut left = self.term()?;
        while let Some(op @ (b'+' | b'-')) = self.peek() {
            self.i += 1;
            let right = self.term()?;
            if left.dim != right.dim {
                return Err(format!(
                    "cannot add or subtract a {:?} and a {:?}",
                    left.dim, right.dim
                ));
            }
            left.v += if op == b'+' { right.v } else { -right.v };
        }
        Ok(left)
    }
    fn term(&mut self) -> Result<Quantity, String> {
        let mut left = self.factor()?;
        while let Some(op @ (b'*' | b'/')) = self.peek() {
            self.i += 1;
            let right = self.factor()?;
            left = if op == b'*' {
                match (left.dim, right.dim) {
                    (_, Dim::Number) => Quantity {
                        v: left.v * right.v,
                        dim: left.dim,
                    },
                    (Dim::Number, _) => Quantity {
                        v: left.v * right.v,
                        dim: right.dim,
                    },
                    _ => return Err("cannot multiply two quantities with units".into()),
                }
            } else {
                match (left.dim, right.dim) {
                    (_, Dim::Number) if right.v != 0.0 => Quantity {
                        v: left.v / right.v,
                        dim: left.dim,
                    },
                    (a, b) if a == b && right.v != 0.0 => Quantity {
                        v: left.v / right.v,
                        dim: Dim::Number,
                    },
                    _ => return Err("cannot divide like this".into()),
                }
            };
        }
        Ok(left)
    }
    fn factor(&mut self) -> Result<Quantity, String> {
        match self.peek() {
            Some(b'(') => {
                self.i += 1;
                let q = self.expr()?;
                self.close()?;
                Ok(q)
            }
            Some(b'+') => {
                self.i += 1;
                self.factor()
            }
            Some(b'-') => {
                self.i += 1;
                let q = self.factor()?;
                Ok(Quantity {
                    v: -q.v,
                    dim: q.dim,
                })
            }
            Some(c) if c.is_ascii_digit() || c == b'.' => self.number(),
            Some(c) if c.is_ascii_alphabetic() => self.function(),
            other => Err(format!("unexpected {:?}", other.map(|c| c as char))),
        }
    }
    fn close(&mut self) -> Result<(), String> {
        if self.peek() == Some(b')') {
            self.i += 1;
            Ok(())
        } else {
            Err("missing )".into())
        }
    }
    fn number(&mut self) -> Result<Quantity, String> {
        let start = self.i;
        while self.i < self.s.len() && (self.s[self.i].is_ascii_digit() || self.s[self.i] == b'.') {
            self.i += 1;
        }
        // An exponent: 1e3, 1e-3
        if self.i < self.s.len() && (self.s[self.i] == b'e' || self.s[self.i] == b'E') {
            let mut j = self.i + 1;
            if j < self.s.len() && (self.s[j] == b'+' || self.s[j] == b'-') {
                j += 1;
            }
            if j < self.s.len() && self.s[j].is_ascii_digit() {
                while j < self.s.len() && self.s[j].is_ascii_digit() {
                    j += 1;
                }
                self.i = j;
            }
        }
        let v: f64 = std::str::from_utf8(&self.s[start..self.i])
            .unwrap()
            .parse()
            .map_err(|_| "not a number".to_string())?;
        let unit_start = self.i;
        while self.i < self.s.len()
            && (self.s[self.i].is_ascii_alphabetic() || self.s[self.i] == b'%')
        {
            self.i += 1;
        }
        let unit = std::str::from_utf8(&self.s[unit_start..self.i])
            .unwrap()
            .to_ascii_lowercase();
        Ok(match unit.as_str() {
            "" => Quantity {
                v,
                dim: Dim::Number,
            },
            "px" => Quantity {
                v,
                dim: Dim::Length,
            },
            "rem" => Quantity {
                v: v * REM_PX,
                dim: Dim::Length,
            },
            "ms" => Quantity { v, dim: Dim::Time },
            "s" => Quantity {
                v: v * 1000.0,
                dim: Dim::Time,
            },
            "%" => Quantity {
                v: v / 100.0,
                dim: Dim::Ratio,
            },
            "vw" | "vh" | "vmin" | "vmax" | "svh" | "svw" | "dvh" | "dvw" | "lvh" | "lvw" => {
                return Err(format!(
                    "{v}{unit} depends on the size of the browser window, which the app window does not have"
                ));
            }
            "em" | "ex" | "ch" | "lh" | "rlh" => {
                return Err(format!(
                    "{v}{unit} depends on a font size that a token does not know"
                ));
            }
            "deg" | "rad" | "turn" | "grad" => {
                return Err(format!(
                    "{v}{unit} is an angle: Slint takes angles only in its own markup"
                ));
            }
            other => return Err(format!("unknown unit `{other}`")),
        })
    }
    fn function(&mut self) -> Result<Quantity, String> {
        let start = self.i;
        while self.i < self.s.len()
            && (self.s[self.i].is_ascii_alphabetic() || self.s[self.i] == b'-')
        {
            self.i += 1;
        }
        let name = std::str::from_utf8(&self.s[start..self.i])
            .unwrap()
            .to_ascii_lowercase();
        if self.peek() != Some(b'(') {
            return Err(format!("`{name}` is not a number"));
        }
        self.i += 1;
        let mut args = vec![self.expr()?];
        while self.peek() == Some(b',') {
            self.i += 1;
            args.push(self.expr()?);
        }
        self.close()?;
        let same = args.iter().all(|a| a.dim == args[0].dim);
        let pick = |f: fn(f64, f64) -> f64| -> Result<Quantity, String> {
            if !same {
                return Err(format!("{name}() mixes units"));
            }
            Ok(Quantity {
                v: args.iter().skip(1).fold(args[0].v, |a, b| f(a, b.v)),
                dim: args[0].dim,
            })
        };
        match (name.as_str(), args.len()) {
            ("calc", 1) => Ok(args[0]),
            ("min", n) if n >= 1 => pick(f64::min),
            ("max", n) if n >= 1 => pick(f64::max),
            ("clamp", 3) if same => Ok(Quantity {
                v: args[1].v.clamp(args[0].v.min(args[2].v), args[2].v),
                dim: args[1].dim,
            }),
            _ => Err(format!("{name}() is not supported")),
        }
    }
}

fn quantity(s: &str) -> Result<Quantity, String> {
    let mut p = Parser {
        s: s.as_bytes(),
        i: 0,
    };
    let q = p.expr()?;
    p.ws();
    if p.i != s.len() {
        return Err(format!("unexpected `{}`", &s[p.i..]));
    }
    Ok(q)
}

fn is_colour(s: &str) -> bool {
    if s.starts_with('#') {
        return true;
    }
    let lower = s.to_ascii_lowercase();
    if matches!(
        lower.as_str(),
        "transparent" | "white" | "black" | "currentcolor"
    ) {
        return true;
    }
    [
        "rgb(",
        "rgba(",
        "hsl(",
        "hsla(",
        "hwb(",
        "lab(",
        "lch(",
        "oklab(",
        "oklch(",
        "color(",
        "color-mix(",
        "light-dark(",
    ]
    .iter()
    .any(|f| lower.starts_with(f))
}

/// The value of a token whose `var()` have been replaced.
pub fn evaluate(raw: &str) -> Result<Value, String> {
    let s = raw.trim();
    if is_colour(s) {
        return color::parse(s).map(|c| Value::Color(c.to_rgba8()));
    }
    if let Some(inner) = s.strip_prefix("url(").and_then(|r| r.strip_suffix(')')) {
        let path = inner.trim().trim_matches(|c| c == '"' || c == '\'');
        let lower = path.to_ascii_lowercase();
        return if lower.ends_with(".ttf") || lower.ends_with(".otf") || lower.ends_with(".ttc") {
            Ok(Value::FontFile(path.to_string()))
        } else {
            Err(format!(
                "url({path}) is not a font file Slint embeds (.ttf, .otf, .ttc); an image or a mask is for the website"
            ))
        };
    }
    if s.starts_with('"') || s.starts_with('\'') {
        let q = s.chars().next().unwrap();
        let end = s[1..].find(q).ok_or("a font family is never closed")?;
        return Ok(Value::Family(s[1..1 + end].to_string()));
    }
    let lower = s.to_ascii_lowercase();
    if matches!(
        lower.as_str(),
        "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear"
    ) || lower.starts_with("cubic-bezier(")
    {
        return Ok(Value::Easing(
            lower.split_whitespace().collect::<Vec<_>>().join(" "),
        ));
    }
    let q = quantity(s)?;
    Ok(match q.dim {
        Dim::Number => Value::Number(q.v),
        Dim::Length => Value::Length(q.v),
        Dim::Time => Value::Duration(q.v),
        Dim::Ratio => Value::Ratio(q.v),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn eval(s: &str) -> Value {
        evaluate(s).unwrap()
    }

    #[test]
    fn units() {
        assert_eq!(eval("12px"), Value::Length(12.0));
        assert_eq!(eval("0.75rem"), Value::Length(12.0));
        assert_eq!(eval("320ms"), Value::Duration(320.0));
        assert_eq!(eval("1.1s"), Value::Duration(1100.0));
        assert_eq!(eval("600"), Value::Number(600.0));
        assert_eq!(eval("42%"), Value::Ratio(0.42));
        assert_eq!(eval("-0px"), Value::Length(0.0));
    }

    #[test]
    fn arithmetic() {
        assert_eq!(eval("calc(13px * 1.5)"), Value::Length(19.5));
        assert_eq!(eval("calc(2 * (10px + 2px))"), Value::Length(24.0));
        assert_eq!(eval("min(340px, 400px)"), Value::Length(340.0));
        assert_eq!(eval("clamp(200px, 100px, 362px)"), Value::Length(200.0));
        assert_eq!(eval("calc(100ms + 1s)"), Value::Duration(1100.0));
        assert_eq!(eval("calc(10px / 4)"), Value::Length(2.5));
        assert_eq!(eval("calc(10px / 5px)"), Value::Number(2.0));
    }

    #[test]
    fn what_a_window_cannot_have_is_refused_with_the_reason() {
        for (bad, why) in [
            ("calc(100vw - 20px)", "size of the browser window"),
            ("1.2em", "font size"),
            ("calc(1px + 1ms)", "cannot add"),
            ("url(\"data:image/svg+xml,%3Csvg%3E\")", "not a font file"),
            ("8px 0 4px", "unexpected"),
            ("auto", "not a number"),
            ("12foo", "unknown unit"),
        ] {
            let e = evaluate(bad).unwrap_err();
            assert!(e.contains(why), "{bad}: {e}");
        }
    }

    #[test]
    fn colours_families_curves_and_font_files() {
        assert_eq!(
            eval("#91dfbd"),
            Value::Color(Rgba8 {
                r: 0x91,
                g: 0xdf,
                b: 0xbd,
                a: 255
            })
        );
        assert_eq!(
            eval("\"Lexend\", \"Lexend esteso\", system-ui, sans-serif"),
            Value::Family("Lexend".into())
        );
        assert_eq!(
            eval("cubic-bezier(0.19, 1, 0.22, 1)"),
            Value::Easing("cubic-bezier(0.19, 1, 0.22, 1)".into())
        );
        assert_eq!(eval("ease-in-out"), Value::Easing("ease-in-out".into()));
        assert_eq!(
            eval("url(\"caratteri/lexend/Lexend-wght.ttf\")"),
            Value::FontFile("caratteri/lexend/Lexend-wght.ttf".into())
        );
    }

    #[test]
    fn var_resolution_with_fallback_cycles_and_nesting() {
        let table: std::collections::HashMap<&str, &str> = [
            ("--a", "var(--b)"),
            ("--b", "12px"),
            ("--c", "var(--d)"),
            ("--d", "var(--c)"),
        ]
        .into();
        let lookup =
            |n: &str| -> Result<Option<String>, String> { Ok(table.get(n).map(|s| s.to_string())) };
        assert_eq!(
            substitute("calc(var(--a) * 2)", &lookup, &mut vec![]).unwrap(),
            "calc(12px * 2)"
        );
        assert_eq!(
            substitute("var(--missing, 3px)", &lookup, &mut vec![]).unwrap(),
            "3px"
        );
        assert!(
            substitute("var(--missing)", &lookup, &mut vec![])
                .unwrap_err()
                .contains("not declared")
        );
        assert!(
            substitute("var(--c)", &lookup, &mut vec![])
                .unwrap_err()
                .contains("refers to itself")
        );
    }
}
