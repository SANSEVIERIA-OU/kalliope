// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Reads the catalogue (`website/lingue`, or the folder `KALLIOPE_CATALOGO` names: the tests of the translations use it) and
//! writes the tables of the languages that are ready, with the pseudo-languages when the `pseudo` feature is on.
#[allow(dead_code)]
#[path = "src/catalogo.rs"]
mod catalogo;
#[allow(dead_code)]
#[path = "src/plural.rs"]
mod plural;
#[allow(dead_code)]
#[path = "src/scritture.rs"]
mod scritture;

use std::path::PathBuf;

fn main() {
    println!("cargo:rerun-if-env-changed=KALLIOPE_CATALOGO");
    let manifest = PathBuf::from(std::env::var_os("CARGO_MANIFEST_DIR").unwrap());
    let dir = std::env::var_os("KALLIOPE_CATALOGO")
        .map(PathBuf::from)
        .unwrap_or_else(|| manifest.join("../../website/lingue"));
    println!("cargo:rerun-if-changed={}", dir.display());
    let ready = match catalogo::ready(&dir) {
        Ok(r) => r,
        Err(e) => {
            println!("cargo::error=the catalogue cannot be read: {e}");
            std::process::exit(1);
        }
    };
    if !ready.left_out.is_empty() {
        let names: Vec<String> = ready
            .left_out
            .iter()
            .map(|(c, why)| format!("{c} ({why})"))
            .collect();
        println!(
            "cargo:warning=kalliope-i18n: not ready, so not in the program: {}",
            names.join("; ")
        );
    }
    let mut languages = ready.languages;
    if std::env::var_os("CARGO_FEATURE_PSEUDO").is_some() {
        for code in ["en-XA", "ar-XB"] {
            languages.push(catalogo::pseudo(code, &ready.source));
        }
    }
    let tables = match catalogo::rust_tables(&languages) {
        Ok(t) => t,
        Err(e) => {
            println!("cargo::error={e}");
            std::process::exit(1);
        }
    };
    let out = PathBuf::from(std::env::var_os("OUT_DIR").unwrap()).join("tabelle.rs");
    if std::fs::read_to_string(&out).ok().as_deref() != Some(&tables) {
        std::fs::write(&out, tables).expect("write tabelle.rs");
    }
}
