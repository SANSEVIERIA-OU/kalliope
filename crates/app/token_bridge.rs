// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
// The native frontends share geometry, while their toolkit owns colour and typography.
const TOKENS: [(&str, &str, &str); 5] = [
    ("--spazio-10", "SPACING", "spacing"),
    ("--app-native-width", "WINDOW_WIDTH", "window-width"),
    ("--app-native-height", "WINDOW_HEIGHT", "window-height"),
    (
        "--app-native-min-width",
        "MIN_WINDOW_WIDTH",
        "min-window-width",
    ),
    (
        "--app-native-min-height",
        "MIN_WINDOW_HEIGHT",
        "min-window-height",
    ),
];

pub fn render(css: &str) -> Result<(String, String), String> {
    let mut clean = String::new();
    let mut rest = css;
    while let Some(start) = rest.find("/*") {
        clean.push_str(&rest[..start]);
        let end = rest[start + 2..].find("*/").ok_or("Unclosed CSS comment")?;
        rest = &rest[start + 2 + end + 2..];
    }
    clean.push_str(rest);
    fn resolve(css: &str, name: &str, stack: &mut Vec<String>) -> Result<i32, String> {
        if stack.iter().any(|entry| entry == name) {
            return Err(format!("Cyclic geometry token: {name}"));
        }
        stack.push(name.into());
        let values: Vec<_> = css
            .split(';')
            .filter_map(|declaration| {
                // A declaration may follow a selector/opening brace.
                let declaration = declaration.rsplit('{').next()?.trim();
                let (key, value) = declaration.split_once(':')?;
                (key.trim() == name).then_some(value.trim())
            })
            .collect();
        if values.len() != 1 {
            return Err(format!(
                "Expected one declaration of {name}, found {}",
                values.len()
            ));
        }
        let value = values[0];
        let result =
            if let Some(alias) = value.strip_prefix("var(").and_then(|v| v.strip_suffix(')')) {
                resolve(css, alias.trim(), stack)
            } else {
                value
                    .strip_suffix("px")
                    .and_then(|v| v.trim().parse::<i32>().ok())
                    .filter(|v| *v > 0)
                    .ok_or_else(|| format!("{name} must be a positive integer px length: {value}"))
            };
        stack.pop();
        result
    }
    let mut rust = String::from("// Generated from design-system/token.css; do not edit.\n");
    let mut slint = String::from(
        "// Generated from design-system/token.css; do not edit.\nexport global NativeTokens {\n",
    );
    for (css_name, rust_name, slint_name) in TOKENS {
        let value = resolve(&clean, css_name, &mut Vec::new())?;
        rust.push_str(&format!("pub const {rust_name}: i32 = {value};\n"));
        slint.push_str(&format!(
            "    out property <length> {slint_name}: {value}px;\n"
        ));
    }
    slint.push_str("}\n");
    Ok((rust, slint))
}

#[cfg(test)]
mod tests {
    use super::*;
    fn css(spacing: &str) -> String {
        format!(
            ":root {{ --spazio-10: {spacing}; --app-native-width: 560px; --app-native-height: 460px; --app-native-min-width: 360px; --app-native-min-height: 320px; }}"
        )
    }
    #[test]
    fn both_frontends_follow_the_source() {
        let (rust, slint) = render(&css("17px")).unwrap();
        assert!(rust.contains("SPACING: i32 = 17;"));
        assert!(slint.contains("spacing: 17px;"));
        assert!(rust.contains("MIN_WINDOW_HEIGHT: i32 = 320;"));
    }
    #[test]
    fn comments_and_aliases() {
        let source = format!(
            "/* --spazio-10: 99px; */ {} :root {{ --base: 12px; }}",
            css("var(--base)")
        );
        assert!(render(&source).unwrap().0.contains("SPACING: i32 = 12;"));
    }
    #[test]
    fn ambiguous_missing_cyclic_and_non_integer_values_fail() {
        for source in [
            css("1.5px"),
            css("-1px"),
            css("var(--spazio-10)"),
            css("var(--missing)"),
            format!("{} :root {{ --spazio-10: 13px; }}", css("12px")),
        ] {
            assert!(render(&source).is_err(), "{source}");
        }
    }
}
