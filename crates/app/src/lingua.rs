// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The language of the window. It is chosen once, at start, from the system (`kalliope_i18n::init`: LANGUAGE, LC_ALL, LC_MESSAGES
//! and LANG on Linux, the system's own API on Windows and macOS; `KALLIOPE_LINGUA` forces one), falling back to Italian whole
//! when the catalogue has no complete file for it. This module carries the choice to what Slint draws: its translation, the
//! direction of writing, and the typeface of the script.

use kalliope_i18n::Script;
use slint::ComponentHandle;
use slint::fontique_012::{self, fontique};
use std::sync::Arc;

mod faces {
    include!(concat!(env!("OUT_DIR"), "/caratteri.rs"));
}

/// What the choice means for the window.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Language {
    pub code: &'static str,
    /// Written from right to left: the window is mirrored (`Token.rtl`, `design-system/TOKEN.md`, «Specchio»).
    pub rtl: bool,
}

/// Chooses the language and puts it in use for the texts the program builds. Before any text exists: the status line of the
/// session is made when it opens.
pub fn choose() -> Language {
    let code = kalliope_i18n::init();
    Language {
        code,
        rtl: kalliope_i18n::is_rtl(code),
    }
}

/// Slint's own translation of the window's texts. After the first component exists (Slint's rule).
fn translate(language: Language) {
    // Italian is bundled like the others (build.rs), for its decimal separator; its texts are those of the source in any case
    if let Err(e) = slint::select_bundled_translation(language.code) {
        // no translation bundled: the window has the Italian text of the source
        if language.code != kalliope_i18n::SOURCE {
            eprintln!("kalliope: {e}");
        }
    }
}

/// The ISO 15924 tag of the script of a language, for the fallback of its glyphs.
fn script_tag(script: Script) -> Option<[u8; 4]> {
    match script {
        Script::Greek => Some(*b"Grek"),
        Script::Cyrillic => Some(*b"Cyrl"),
        Script::Arabic => Some(*b"Arab"),
        Script::Devanagari => Some(*b"Deva"),
        Script::Bengali => Some(*b"Beng"),
        // Chinese has no file: the system's face draws it, as on the website. Latin is Lexend.
        Script::Han | Script::Latin => None,
    }
}

/// Registers the typeface of the language's script, and only that one: the other files stay in the program as bytes nobody reads.
/// Lexend comes first in every text (Slint's `default-font-family`); what Lexend does not draw falls to this face, then to the
/// system's. Returns whether a face was registered.
fn register_face(language: Language) -> bool {
    let Some(tag) = script_tag(kalliope_i18n::script_of(language.code)) else {
        return false;
    };
    let Some((_, bytes)) = faces::FACES.iter().find(|(l, _)| *l == language.code) else {
        return false;
    };
    let mut collection = fontique_012::shared_collection();
    let fonts = collection.register_fonts(fontique::Blob::new(Arc::new(*bytes)), None);
    let families: Vec<fontique::FamilyId> = fonts.iter().map(|(family, _)| *family).collect();
    // Slint asks for Lexend, then for the system's «system-ui» and «sans-serif», and only then for a face of the script. The
    // system's own faces cover Arabic, Devanagari and the rest on most desktops, so they would draw the script before ours: the
    // face of the design system goes in front of them (what the collection calls «ours» is searched before the system's).
    for generic in [
        fontique::GenericFamily::SystemUi,
        fontique::GenericFamily::SansSerif,
    ] {
        collection.append_generic_families(generic, families.iter().copied());
    }
    // and where no generic family is asked for, the face is the fallback of its script
    collection.set_fallbacks(
        fontique::FallbackKey::new(fontique::Script::from_bytes(tag), None),
        families.iter().copied(),
    );
    !families.is_empty()
}

/// Whether a text runs from right to left: its first strong letter says so, as in the Unicode bidirectional algorithm (P2, P3).
/// The phrases a person types keep their own direction in a window of any language: an Arabic phrase is laid out from the right,
/// and a Latin one from the left, whichever way the window is written. Numbers and signs before the first letter do not count.
pub fn text_is_rtl(text: &str) -> bool {
    for c in text.chars() {
        if !c.is_alphabetic() {
            continue;
        }
        return matches!(c as u32,
            0x0590..=0x08FF | 0xFB1D..=0xFDFF | 0xFE70..=0xFEFF | 0x10800..=0x10FFF | 0x1E800..=0x1EFFF);
    }
    false
}

/// What the window needs once it exists: Slint's translation, the typeface of the script, and the direction of writing.
pub fn apply(ui: &crate::AppWindow, language: Language) {
    let started = std::time::Instant::now();
    translate(language);
    let face = register_face(language);
    ui.set_rtl(language.rtl);
    ui.global::<crate::Aspetto>()
        .set_lingua(language.code.into());
    ui.on_da_destra(|text| text_is_rtl(&text));
    if std::env::var_os("KALLIOPE_MISURE").is_some() {
        eprintln!(
            "kalliope: language {} (rtl {}, own face {face}) applied in {:?}",
            language.code,
            language.rtl,
            started.elapsed()
        );
    }
}

/// The same for the live catalog (`--catalogo`): the catalog's own texts are Italian, but its components speak and turn round.
pub fn apply_catalog(ui: &crate::Catalogo, language: Language) {
    translate(language);
    register_face(language);
    ui.set_rtl(language.rtl);
    ui.global::<crate::Aspetto>()
        .set_lingua(language.code.into());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_language_with_its_own_script_has_a_face_except_chinese() {
        // the faces are the --app-carattere-<ll> lines of token.css
        for (code, script, _) in kalliope_i18n::KNOWN {
            if code.contains("-X") {
                continue;
            }
            let has = faces::FACES.iter().any(|(l, _)| l == code);
            assert_eq!(has, script_tag(*script).is_some(), "{code}");
        }
    }

    #[test]
    fn a_text_runs_the_way_its_first_letter_says() {
        for (text, rtl) in [
            ("Buongiorno a tutti", false),
            ("مرحبا بالجميع", true),
            ("سلام، آپ کیسے ہیں؟", true),
            ("שלום לכולם", true),
            ("12 مرحبا", true),
            ("«Kalliope» هو", false),
            ("  …  ", false),
            ("", false),
            ("नमस्ते", false),
        ] {
            assert_eq!(text_is_rtl(text), rtl, "{text}");
        }
    }

    #[test]
    fn the_window_is_mirrored_from_right_to_left_and_not_otherwise() {
        i_slint_backend_testing::init_no_event_loop();
        let ui = crate::AppWindow::new().unwrap();
        assert_eq!((ui.get_rtl(), ui.get_verso()), (false, 1));
        ui.set_rtl(true);
        assert_eq!(
            ui.get_verso(),
            -1,
            "Token.verso follows Token.rtl: -1 mirrors"
        );
        ui.set_rtl(false);
        assert_eq!(ui.get_verso(), 1);
    }

    #[test]
    fn each_script_asks_for_the_distance_between_lines_of_the_design_system() {
        i_slint_backend_testing::init_no_event_loop();
        let ui = crate::AppWindow::new().unwrap();
        let aspetto = ui.global::<crate::Aspetto>();
        // what design-system/token.css says for each language (the same numbers as the website's :lang() rules)
        for (code, want) in [
            ("it", 1.0),
            ("en", 1.0),
            ("el", 1.0),
            ("bg", 1.0),
            ("ar", 1.15),
            ("ur", 1.6),
            ("hi", 1.12),
            ("bn", 1.12),
            ("zh", 1.1),
        ] {
            aspetto.set_lingua(code.into());
            assert!(
                (aspetto.get_interlinea() - want).abs() < 1e-6,
                "{code}: {}",
                aspetto.get_interlinea()
            );
        }
    }

    #[test]
    fn the_faces_are_real_fonts() {
        for (code, bytes) in faces::FACES {
            assert!(bytes.len() > 10_000, "{code}");
            assert_eq!(&bytes[..4], &[0, 1, 0, 0], "{code}: not a TrueType file");
        }
    }
}
