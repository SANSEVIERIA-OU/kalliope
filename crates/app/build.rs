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
    let config = slint_build::CompilerConfiguration::new()
        .with_include_paths(vec![output, system])
        .with_style(STYLE.into());
    slint_build::compile_with_config("ui/app.slint", config).expect("ui/app.slint");
}
