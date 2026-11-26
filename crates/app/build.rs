// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Writes `token.slint` from design-system/token.css (crates/tokens) and compiles the window with it.
use std::path::PathBuf;

/// The one style of the standard widgets on every platform: it needs no toolkit besides Slint and follows the
/// system light or dark scheme. The look of the window will come from `Token`, not from a style.
const STYLE: &str = "fluent";

fn main() {
    let manifest = PathBuf::from(std::env::var_os("CARGO_MANIFEST_DIR").unwrap());
    let system = manifest.join("../../design-system");
    let source = system.join("token.css");
    println!("cargo:rerun-if-changed={}", source.display());
    let css = std::fs::read_to_string(&source).expect("design-system/token.css");
    let tokens = match kalliope_tokens::render(&css) {
        Ok(tokens) => tokens,
        Err(e) => {
            println!("cargo::error=design-system/token.css cannot become the window's tokens: {e}");
            std::process::exit(1);
        }
    };
    for font in &tokens.fonts {
        println!("cargo:rerun-if-changed={}", system.join(font).display());
    }
    let output = PathBuf::from(std::env::var_os("OUT_DIR").unwrap());
    let path = output.join("token.slint");
    if std::fs::read_to_string(&path).ok().as_deref() != Some(&tokens.slint) {
        std::fs::write(&path, &tokens.slint).expect("write token.slint");
    }
    let data = output.join("catalogo_dati.slint");
    let catalog = catalog_data(&css, &tokens.slint);
    if std::fs::read_to_string(&data).ok().as_deref() != Some(&catalog) {
        std::fs::write(&data, &catalog).expect("write catalogo_dati.slint");
    }
    let config = slint_build::CompilerConfiguration::new()
        .with_include_paths(vec![output, system])
        .with_style(STYLE.into());
    slint_build::compile_with_config("ui/app.slint", config).expect("ui/app.slint");
}

/// The live catalog's table of tokens (`kalliope --catalogo`), from the generated Token global and the comments of
/// token.css: every colour with its dark and light value side by side, every length and duration with its value, each
/// with the line that says where it comes from. Generated, so the catalog never keeps a copy by hand.
fn catalog_data(css: &str, slint: &str) -> String {
    let mut sources = std::collections::BTreeMap::new();
    for line in css.lines() {
        let line = line.trim();
        if let Some(rest) = line.strip_prefix("--app-")
            && let Some((name, after)) = rest.split_once(':')
        {
            let note = after
                .split_once("/*")
                .and_then(|(_, c)| c.split_once("*/"))
                .map(|(c, _)| c.trim().to_string())
                .unwrap_or_default();
            sources.entry(name.trim().to_string()).or_insert(note);
        }
    }
    let quote = |s: &str| s.replace('\\', "\\\\").replace('"', "\\\"");
    let (mut colours, mut lengths, mut times, mut others) = (vec![], vec![], vec![], vec![]);
    for line in slint.lines() {
        let Some(rest) = line.trim().strip_prefix("out property <") else { continue };
        let Some((ty, rest)) = rest.split_once("> ") else { continue };
        let Some((name, expr)) = rest.split_once(": ") else { continue };
        let expr = expr.trim_end_matches(';');
        if name == "dark" {
            continue;
        }
        let note = quote(sources.get(name).map(String::as_str).unwrap_or(""));
        match ty {
            "color" => {
                let (dark, light) = expr
                    .strip_prefix("dark ? ")
                    .and_then(|e| e.split_once(" : "))
                    .unwrap_or((expr, expr));
                colours.push(format!(
                    "        {{ nome: \"{name}\", scuro: {dark}, chiaro: {light}, fonte: \"{note}\" }},\n"
                ));
            }
            "length" => lengths.push(format!(
                "        {{ nome: \"{name}\", misura: {expr}, testo: \"{}\", fonte: \"{note}\" }},\n",
                quote(expr)
            )),
            "duration" => times.push(format!(
                "        {{ nome: \"{name}\", durata: {expr}, testo: \"{}\", fonte: \"{note}\" }},\n",
                quote(expr)
            )),
            _ => others.push(format!(
                "        {{ nome: \"{name}\", testo: \"{}\", fonte: \"{note}\" }},\n",
                quote(expr)
            )),
        }
    }
    format!(
        "// Generated from design-system/token.css by crates/app/build.rs for the catalog; do not edit.\n\
         export struct Colore {{ nome: string, scuro: color, chiaro: color, fonte: string }}\n\
         export struct Misura {{ nome: string, misura: length, testo: string, fonte: string }}\n\
         export struct Tempo {{ nome: string, durata: duration, testo: string, fonte: string }}\n\
         export struct Altro {{ nome: string, testo: string, fonte: string }}\n\
         export global Dati {{\n    out property <[Colore]> colori: [\n{}    ];\n    out property <[Misura]> misure: [\n{}    ];\n\
         \x20   out property <[Tempo]> tempi: [\n{}    ];\n    out property <[Altro]> altri: [\n{}    ];\n}}\n",
        colours.concat(),
        lengths.concat(),
        times.concat(),
        others.concat()
    )
}
