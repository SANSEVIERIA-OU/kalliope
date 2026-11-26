// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
mod token_bridge;

fn main() {
    let manifest = std::path::PathBuf::from(std::env::var_os("CARGO_MANIFEST_DIR").unwrap());
    let source = manifest.join("../../design-system/token.css");
    println!("cargo:rerun-if-changed={}", source.display());
    println!("cargo:rerun-if-changed=token_bridge.rs");
    let css = std::fs::read_to_string(source).expect("design-system/token.css");
    let (rust, slint) = token_bridge::render(&css).expect("native geometry tokens");
    let output = std::path::PathBuf::from(std::env::var_os("OUT_DIR").unwrap());
    for (name, content) in [("native_tokens.rs", rust), ("native_tokens.slint", slint)] {
        let path = output.join(name);
        if std::fs::read_to_string(&path).ok().as_ref() != Some(&content) {
            std::fs::write(path, content).expect("write native geometry tokens");
        }
    }
    let style = match std::env::var("CARGO_CFG_TARGET_OS").as_deref() {
        Ok("linux") => "qt",
        Ok("macos") => "cupertino",
        _ => "fluent",
    };
    let config = slint_build::CompilerConfiguration::new()
        .with_include_paths(vec![output])
        .with_style(style.into());
    slint_build::compile_with_config("ui/app.slint", config).expect("ui/app.slint");
}
