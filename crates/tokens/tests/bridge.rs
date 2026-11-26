// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The bridge, on a synthetic style sheet (what the convention promises) and on the real design-system/token.css.
use kalliope_tokens::render;

const REAL: &str = include_str!("../../../design-system/token.css");

fn slint(css: &str) -> String {
    render(css).unwrap_or_else(|e| panic!("{e}")).slint
}
fn error(css: &str) -> String {
    match render(css) {
        Ok(o) => panic!("expected an error, got:\n{}", o.slint),
        Err(e) => e,
    }
}

#[test]
fn every_kind_of_value_becomes_a_property() {
    let out = slint(
        r#":root {
          --fondo: #1b2223;
          --app-spazio: var(--spazio-10);
          --spazio-10: 0.75rem;
          --app-fondo: color-mix(in srgb, #91dfbd 40%, #1b2223);
          --app-velo: rgba(242, 245, 244, 0.1);
          --app-durata: 1.1s;
          --app-curva: cubic-bezier(0.19, 1, 0.22, 1);
          --app-peso: 600;
          --app-opacita: 0.42;
          --app-quota: 42%;
          --app-font: "Lexend", "Lexend esteso", system-ui, sans-serif;
          --app-grande: calc(13px * 1.5);
          --app-carattere-testo: url("caratteri/lexend/Lexend-wght.ttf");
          --non-della-finestra: 8px 0 4px;
        }
        @media (max-width: 760px) { :root { --app-spazio: 99px; } }"#,
    );
    for line in [
        "out property <length> spazio: 12px;",
        "out property <color> fondo: #4a6e61;",
        "out property <color> velo: #f2f5f41a;",
        "out property <duration> durata: 1100ms;",
        "out property <easing> curva: cubic-bezier(0.19, 1, 0.22, 1);",
        "out property <int> peso: 600;",
        "out property <float> opacita: 0.42;",
        "out property <float> quota: 0.42;",
        "out property <string> font: \"Lexend\";",
        "out property <length> grande: 19.5px;",
        "import \"caratteri/lexend/Lexend-wght.ttf\";",
        "out property <bool> dark: Palette.color-scheme == ColorScheme.dark;",
    ] {
        assert!(out.contains(line), "missing `{line}` in\n{out}");
    }
    assert!(
        !out.contains("non-della-finestra") && !out.contains("99px"),
        "only :root --app- tokens: {out}"
    );
}

#[test]
fn without_a_light_scheme_colours_are_single_valued() {
    let out = slint(":root { --app-fondo: #1b2223; --app-testo: #f2f5f4; }");
    assert!(
        out.contains("<color> fondo: #1b2223;") && !out.contains("dark ?"),
        "{out}"
    );
}

const THEMED: &str = r##":root {
      --scuro: #1b2223; --chiaro: #fafafa;
      --app-fondo: var(--scuro);
      --app-testo: #f2f5f4;
      --app-logo-fisso: #91dfbd;
      --app-spazio: 12px;
    }
    :root[data-tema="chiaro"] {
      --app-fondo: var(--chiaro);
      --app-testo: #1d1d1f;
    }"##;

#[test]
fn light_and_dark_follow_the_system() {
    let out = slint(THEMED);
    assert!(
        out.contains("out property <color> fondo: dark ? #1b2223 : #fafafa;"),
        "{out}"
    );
    assert!(
        out.contains("out property <color> testo: dark ? #f2f5f4 : #1d1d1f;"),
        "{out}"
    );
    assert!(
        out.contains("out property <color> logo-fisso: #91dfbd;"),
        "{out}"
    );
    assert!(out.contains("out property <length> spazio: 12px;"), "{out}");
}

#[test]
fn a_shared_token_changed_in_the_light_scheme_changes_the_roles_that_use_it() {
    let out = slint(
        r##":root { --testo: #f2f5f4; --app-testo: var(--testo); --app-nota: var(--testo); }
           :root[data-tema="chiaro"] { --testo: #1d1d1f; }"##,
    );
    assert!(
        out.contains("testo: dark ? #f2f5f4 : #1d1d1f;")
            && out.contains("nota: dark ? #f2f5f4 : #1d1d1f;"),
        "{out}"
    );
}

#[test]
fn an_incomplete_light_scheme_stops_the_build() {
    // a colour with no light value
    let e = error(
        r##":root { --app-fondo: #1b2223; --app-testo: #f2f5f4; } :root[data-tema="chiaro"] { --app-fondo: #fafafa; }"##,
    );
    assert!(
        e.contains("--app-testo (#f2f5f4)")
            && e.contains("light scheme is incomplete")
            && e.contains("-fisso"),
        "{e}"
    );
    // a light value with no dark one
    let e = error(
        r##":root { --app-fondo: #1b2223; } :root[data-tema="chiaro"] { --app-fondo: #fafafa; --app-nuovo: #fff; }"##,
    );
    assert!(
        e.contains("--app-nuovo") && e.contains("no dark one"),
        "{e}"
    );
    // a colour named fixed that the light scheme changes
    let e = error(
        r##":root { --app-logo-fisso: #91dfbd; --app-a: #000; } :root[data-tema="chiaro"] { --app-logo-fisso: #fff; --app-a: #fff; }"##,
    );
    assert!(
        e.contains("--app-logo-fisso") && e.contains("same in both"),
        "{e}"
    );
    // a value of another kind in the other scheme
    let e = error(
        r##":root { --app-a: #000; --app-b: 4px; } :root[data-tema="chiaro"] { --app-a: #fff; --app-b: 4ms; }"##,
    );
    assert!(
        e.contains("--app-b") && e.contains("length") && e.contains("duration"),
        "{e}"
    );
}

#[test]
fn the_message_names_every_colour_that_lacks_a_light_value() {
    let e = error(
        r##":root { --app-a: #000; --app-b: #111; --app-c: #222; --app-d: #333; } :root[data-tema="chiaro"] { --app-a: #fff; }"##,
    );
    for name in ["--app-b", "--app-c", "--app-d"] {
        assert!(e.contains(name), "{e}");
    }
    assert!(!e.contains("`--app-a`"), "{e}");
}

#[test]
fn values_the_window_cannot_have_stop_the_build_with_the_name_and_the_reason() {
    for (css, name, why) in [
        (
            ":root { --app-a: 8px 0 4px; }",
            "--app-a",
            "split a composite value",
        ),
        (
            ":root { --app-a: calc(100vw - 20px); }",
            "--app-a",
            "browser window",
        ),
        (
            ":root { --app-a: var(--manca); }",
            "--app-a",
            "not declared",
        ),
        (
            ":root { --app-a: var(--app-b); --app-b: var(--app-a); }",
            "--app-a",
            "refers to itself",
        ),
        (":root { --app-a: #12; }", "--app-a", "not a hex colour"),
        (
            ":root { --app-a: 1px; --app-a: 2px; }",
            "--app-a",
            "declared 2 times",
        ),
        (":root { --app-in: 1px; }", "--app-in", "word of Slint"),
        (":root { --app-dark: #000; }", "--app-dark", "word of Slint"),
        (":root { --app-Fondo: #000; }", "--app-Fondo", "lowercase"),
        (
            ":root { --app-carattere-x: 12px; }",
            "--app-carattere-x",
            "font files",
        ),
        (
            ":root { --app-x: url(\"caratteri/a.ttf\"); }",
            "--app-x",
            "starts with --app-carattere-",
        ),
    ] {
        let e = error(css);
        assert!(e.contains(name) && e.contains(why), "{css}\n  -> {e}");
    }
}

#[test]
fn the_same_value_twice_is_not_an_ambiguity() {
    assert!(slint(":root { --app-a: 1px; --app-a: 1px; }").contains("a: 1px;"));
}

#[test]
fn the_real_token_css_is_ready() {
    let out = render(REAL).unwrap_or_else(|e| panic!("design-system/token.css: {e}"));
    for (name, kind) in [
        ("native-width", "length"),
        ("native-height", "length"),
        ("native-min-width", "length"),
        ("native-min-height", "length"),
        ("spazio-controlli", "length"),
        ("font-testo", "font family"),
        ("peso-testo", "number"),
    ] {
        assert_eq!(
            out.properties.get(name).copied(),
            Some(kind),
            "{name}: {:?}",
            out.properties.keys().collect::<Vec<_>>()
        );
    }
    assert_eq!(
        out.fonts,
        vec!["caratteri/lexend/Lexend-wght.ttf".to_string()]
    );
    assert!(
        out.slint
            .contains("out property <length> spazio-controlli: 12px;"),
        "{}",
        out.slint
    );
    assert!(
        out.slint
            .contains("out property <string> font-testo: \"Lexend\";")
    );
    // The meeting-app tokens of the website are not the window's.
    assert!(
        !out.slint.contains("griglia") && !out.slint.contains("icona"),
        "{}",
        out.slint
    );
}
