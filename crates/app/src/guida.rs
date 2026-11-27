// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! «Come si risolve»: the page of the website's guide that answers each problem the window names. The address is built
//! here from the situation, from one base, so no window keeps an address of its own.

use crate::Situazione;

/// The published website, without the language.
const SITE: &str = "https://sansevieria-ou.github.io/kalliope/";

/// The pages of the website in the language of the program. A language is in the program only when the website has it too (the
/// catalogue is one file for both: a language counts as ready when both are complete), so the folder is there. The pseudo-languages
/// are for tests and have no pages: they take Italian.
fn base() -> String {
    let code = kalliope_i18n::current();
    let folder = if code.contains("-X") {
        kalliope_i18n::SOURCE
    } else {
        code
    };
    format!("{SITE}{folder}/")
}

/// The website's home, in the language of the program.
pub fn sito() -> String {
    base()
}

/// What a person needs help with.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Guida {
    /// The phrase was said but no app in the call listens to the microphone «Kalliope».
    NessunoSente,
    /// The virtual microphone «Kalliope» is not there.
    MancaMicrofono,
    /// The voice cannot start: the files are missing or damaged.
    VoceNonParte,
    /// Recording or reading a file for a voice failed in a way the person cannot fix alone.
    Errori,
}

impl Guida {
    /// The page, and the place in it, where the problem is answered.
    pub fn url(self) -> String {
        let (page, anchor) = match self {
            Guida::NessunoSente => ("riunione/", "non-mi-sentono"),
            Guida::MancaMicrofono => ("riunione/", "non-compare"),
            Guida::VoceNonParte => ("installa/", "installa"),
            Guida::Errori => ("riunione/", "f-errori"),
        };
        format!("{}{page}#{anchor}", base())
    }
}

/// The guide for a state of the status line, when it has one.
pub fn per_situazione(situazione: Situazione) -> Option<Guida> {
    match situazione {
        Situazione::NessunoAscolta => Some(Guida::NessunoSente),
        Situazione::SenzaMicrofono => Some(Guida::MancaMicrofono),
        Situazione::ProblemaVoce => Some(Guida::VoceNonParte),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn each_problem_opens_the_place_the_website_keeps_for_it() {
        assert_eq!(
            Guida::NessunoSente.url(),
            "https://sansevieria-ou.github.io/kalliope/it/riunione/#non-mi-sentono"
        );
        assert_eq!(
            Guida::MancaMicrofono.url(),
            "https://sansevieria-ou.github.io/kalliope/it/riunione/#non-compare"
        );
        assert_eq!(
            Guida::VoceNonParte.url(),
            "https://sansevieria-ou.github.io/kalliope/it/installa/#installa"
        );
        assert_eq!(
            Guida::Errori.url(),
            "https://sansevieria-ou.github.io/kalliope/it/riunione/#f-errori"
        );
    }

    #[test]
    fn only_the_states_with_a_way_out_have_a_guide() {
        use Situazione as S;
        assert_eq!(per_situazione(S::NessunoAscolta), Some(Guida::NessunoSente));
        assert_eq!(
            per_situazione(S::SenzaMicrofono),
            Some(Guida::MancaMicrofono)
        );
        assert_eq!(per_situazione(S::ProblemaVoce), Some(Guida::VoceNonParte));
        for s in [S::Preparazione, S::Pronta, S::Parla, S::Avviso] {
            assert_eq!(per_situazione(s), None);
        }
    }
}
