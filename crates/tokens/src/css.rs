// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The little of CSS that `design-system/token.css` needs: top-level rules, and the custom properties in them.

/// What the window reads out of a style sheet.
#[derive(Debug, Default)]
pub struct Sheet {
    /// `:root { --x: … }`, in the order written: the dark scheme, which is also the one of the website.
    pub root: Vec<(String, String)>,
    /// `:root[data-tema="chiaro"] { --x: … }`: what the light scheme changes.
    pub light: Vec<(String, String)>,
    /// `:root:dir(rtl) { --x: … }`: what a right-to-left language changes (the website's mirror, `--verso`).
    pub rtl: Vec<(String, String)>,
}

/// The selector of the rule that carries the light scheme.
pub const LIGHT_SELECTOR: &str = r#":root[data-tema="chiaro"]"#;
/// The selector of the rule that carries the right-to-left writing.
pub const RTL_SELECTOR: &str = ":root:dir(rtl)";

/// Removes comments, leaving strings and urls alone.
fn strip_comments(css: &str) -> Result<String, String> {
    let chars: Vec<char> = css.chars().collect();
    let mut out = String::with_capacity(css.len());
    let mut i = 0;
    let mut quote: Option<char> = None;
    while i < chars.len() {
        let c = chars[i];
        if let Some(q) = quote {
            out.push(c);
            if c == '\\' && i + 1 < chars.len() {
                out.push(chars[i + 1]);
                i += 1;
            } else if c == q {
                quote = None;
            }
        } else if c == '"' || c == '\'' {
            quote = Some(c);
            out.push(c);
        } else if c == '/' && chars.get(i + 1) == Some(&'*') {
            let mut j = i + 2;
            loop {
                if j + 1 >= chars.len() {
                    return Err("Unclosed CSS comment".into());
                }
                if chars[j] == '*' && chars[j + 1] == '/' {
                    break;
                }
                j += 1;
            }
            i = j + 1;
            out.push(' ');
        } else {
            out.push(c);
        }
        i += 1;
    }
    Ok(out)
}

/// Splits at `sep` outside strings and brackets.
fn split_top(s: &str, sep: char) -> Vec<String> {
    let (mut depth, mut quote, mut out, mut cur) = (0i32, None::<char>, Vec::new(), String::new());
    let mut prev = ' ';
    for c in s.chars() {
        if let Some(q) = quote {
            if c == q && prev != '\\' {
                quote = None;
            }
        } else {
            match c {
                '"' | '\'' => quote = Some(c),
                '(' | '[' | '{' => depth += 1,
                ')' | ']' | '}' => depth -= 1,
                _ => {}
            }
            if c == sep && depth == 0 {
                out.push(std::mem::take(&mut cur));
                prev = c;
                continue;
            }
        }
        cur.push(c);
        prev = c;
    }
    out.push(cur);
    out
}

fn declarations(body: &str, into: &mut Vec<(String, String)>) {
    for declaration in split_top(body, ';') {
        let Some((name, value)) = declaration.split_once(':') else {
            continue;
        };
        let name = name.trim();
        if !name.starts_with("--") {
            continue;
        }
        let value = value.trim().trim_end_matches("!important").trim();
        into.push((
            name.to_string(),
            value.split_whitespace().collect::<Vec<_>>().join(" "),
        ));
    }
}

pub fn parse(css: &str) -> Result<Sheet, String> {
    let css = strip_comments(css)?;
    let chars: Vec<char> = css.chars().collect();
    let mut sheet = Sheet::default();
    let (mut i, mut prelude) = (0, String::new());
    while i < chars.len() {
        match chars[i] {
            '{' => {
                // Find the matching brace, outside strings.
                let (mut depth, mut j, mut quote) = (1, i + 1, None::<char>);
                while j < chars.len() && depth > 0 {
                    let c = chars[j];
                    match quote {
                        Some(q) => {
                            if c == q && chars[j - 1] != '\\' {
                                quote = None;
                            }
                        }
                        None => match c {
                            '"' | '\'' => quote = Some(c),
                            '{' => depth += 1,
                            '}' => depth -= 1,
                            _ => {}
                        },
                    }
                    j += 1;
                }
                if depth != 0 {
                    return Err(format!("Unclosed block after `{}`", prelude.trim()));
                }
                let body: String = chars[i + 1..j - 1].iter().collect();
                let selector = prelude
                    .split_whitespace()
                    .collect::<Vec<_>>()
                    .join(" ")
                    .replace('\'', "\"");
                // At-rules (@media, @font-face, @supports…) and every other selector are for the website.
                if selector == ":root" {
                    declarations(&body, &mut sheet.root);
                } else if selector == LIGHT_SELECTOR {
                    declarations(&body, &mut sheet.light);
                } else if selector == RTL_SELECTOR {
                    declarations(&body, &mut sheet.rtl);
                }
                prelude.clear();
                i = j;
            }
            ';' => {
                // A statement at-rule (@import …;)
                prelude.clear();
                i += 1;
            }
            c => {
                prelude.push(c);
                i += 1;
            }
        }
    }
    Ok(sheet)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn root_light_and_the_rest() {
        let s = parse(
            r#"/* --x: 1px */ :root { --a: 1px; --b: "x; y" ; color: red }
            @media (max-width: 1px) { :root { --a: 2px; } }
            @font-face { font-family: "X"; src: url("a.woff2"); }
            :root[data-tema='chiaro'] { --a: 3px }
            .x { --z: 1 }
            :root:dir(rtl) { --d: -1 }
            :root { --c: calc(1px +
               2px) }"#,
        )
        .unwrap();
        assert_eq!(
            s.root,
            vec![
                ("--a".into(), "1px".into()),
                ("--b".into(), "\"x; y\"".into()),
                ("--c".into(), "calc(1px + 2px)".into())
            ]
        );
        assert_eq!(s.light, vec![("--a".into(), "3px".into())]);
        assert_eq!(s.rtl, vec![("--d".into(), "-1".into())]);
    }

    #[test]
    fn urls_with_semicolons_and_slashes_survive() {
        let s = parse(r#":root { --m: url("data:image/svg+xml,%3Csvg a='1;2'/%3E") center / contain; --n: 1px }"#).unwrap();
        assert_eq!(s.root.len(), 2);
        assert!(s.root[0].1.starts_with("url("));
    }

    #[test]
    fn broken_sheets_say_so() {
        assert!(parse(":root { --a: 1px;").is_err());
        assert!(parse("/* never closed :root { --a: 1px }").is_err());
    }
}
