// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Which words of a phrase the voice has said, from the engine's real pieces ([`Sounding`]), for the bubble that darkens
//! them one by one. It replaces the estimate of one word every 0.36 s: a piece says exactly which bytes of the phrase it
//! voices and how long it sounds, and the words of the piece share that time by how long they take to say.
//!
//! Pure: the clock comes in as an argument, so every case is tested without a window.

use crate::engine::{Said, Sounding};
use std::ops::Range;
use std::time::{Duration, Instant};

/// The byte ranges of the words of `phrase`, as the bubble counts them (split on white space).
pub fn words(phrase: &str) -> Vec<Range<usize>> {
    let mut out = Vec::new();
    let mut start = None;
    for (i, c) in phrase.char_indices() {
        match (c.is_whitespace(), start) {
            (true, Some(s)) => {
                out.push(s..i);
                start = None;
            }
            (false, None) => start = Some(i),
            _ => {}
        }
    }
    if let Some(s) = start {
        out.push(s..phrase.len());
    }
    out
}

/// How long a word takes to say, in arbitrary units: letters count one, digits three (a written number is long to say), any
/// other sign six (a «€» or a «%» is a word). A word that ends a clause or a sentence carries the pause after it: a short one
/// for a comma, a long one for a full stop, because a piece lasts until the next begins and the voice is silent at its end.
/// The two pauses were fitted on Whisper's word times against the pieces Giulia says (costruzione-prove/strumenti/adatta-pesi.py):
/// with them the start of a word is wrong by 0.08 s on average, against 0.23 s with a pause of two letters for both.
const PAUSE_CLAUSE: f32 = 2.0;
const PAUSE_SENTENCE: f32 = 10.0;

fn weight(word: &str) -> f32 {
    let mut w: f32 = word
        .chars()
        .map(|c| {
            if c.is_alphabetic() {
                1.0
            } else if c.is_ascii_digit() {
                3.0
            } else if c.is_ascii_punctuation() {
                0.0
            } else {
                6.0
            }
        })
        .sum();
    if word.ends_with(['.', '!', '?']) {
        w += PAUSE_SENTENCE;
    } else if word.ends_with([';', ':', ',']) {
        w += PAUSE_CLAUSE;
    }
    w.max(1.0)
}

/// The words a piece says: those that start inside its span.
fn in_span(words: &[Range<usize>], span: &Range<usize>) -> Range<usize> {
    let first = words.partition_point(|w| w.start < span.start);
    let last = words.partition_point(|w| w.start < span.end);
    first..last.max(first)
}

/// Where each word of `range` starts in the piece, as shares of its time (0 to 1), and the end (1).
fn starts(phrase: &str, words: &[Range<usize>], range: &Range<usize>) -> Vec<f32> {
    let weights: Vec<f32> = words[range.clone()]
        .iter()
        .map(|w| weight(&phrase[w.clone()]))
        .collect();
    let total: f32 = weights.iter().sum();
    let mut at = 0.0;
    let mut out = Vec::with_capacity(weights.len() + 1);
    for w in weights {
        out.push(at / total.max(f32::EPSILON));
        at += w;
    }
    out.push(1.0);
    out
}

struct Piece {
    span: Range<usize>,
    words: Range<usize>,
    starts: Vec<f32>,
    started: Instant,
    duration: Duration,
}

/// What the bubble shows at a moment: `said` words are dark, and the next one is darkening, `fade` of the way.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Lit {
    pub said: usize,
    pub fade: f32,
}

/// The words of one phrase while the voice says it.
pub struct Lighting {
    phrase: String,
    words: Vec<Range<usize>>,
    id: Option<u64>,
    piece: Option<Piece>,
    /// Words said before the current piece: all those up to where it starts.
    before: usize,
}

impl Lighting {
    pub fn new(phrase: &str) -> Self {
        Lighting {
            phrase: phrase.to_string(),
            words: words(phrase),
            id: None,
            piece: None,
            before: 0,
        }
    }

    /// The engine says a piece of this phrase sounds now. A piece that comes again with its exact duration (a voice that
    /// streams) keeps its start and only changes the pace; another phrase with the same words starts over.
    /// Returns false for a piece of some other phrase.
    pub fn sounding(&mut self, s: &Sounding, now: Instant) -> bool {
        if *s.phrase != *self.phrase {
            return false;
        }
        if self.id != Some(s.id) {
            self.id = Some(s.id);
            self.piece = None;
            self.before = 0;
        }
        if let Some(p) = &mut self.piece
            && p.span == s.span
        {
            p.duration = s.duration;
            return true;
        }
        if let Some(p) = &self.piece {
            self.before = p.words.end;
        }
        let words = in_span(&self.words, &s.span);
        self.before = self.before.max(words.start);
        self.piece = Some(Piece {
            starts: starts(&self.phrase, &self.words, &words),
            span: s.span.clone(),
            words,
            started: now,
            duration: s.duration,
        });
        true
    }

    /// The words lit at `now`; `fade_time` is how long a word takes to darken.
    pub fn at(&self, now: Instant, fade_time: Duration) -> Lit {
        let Some(p) = &self.piece else {
            return Lit {
                said: self.before,
                fade: 0.0,
            };
        };
        let elapsed = now.saturating_duration_since(p.started);
        if elapsed >= p.duration || p.words.is_empty() {
            return Lit {
                said: p.words.end,
                fade: 0.0,
            };
        }
        let share = elapsed.as_secs_f32() / p.duration.as_secs_f32();
        let k = p.starts[..p.words.len()]
            .partition_point(|s| *s <= share)
            .saturating_sub(1);
        let into = elapsed.as_secs_f32() - p.starts[k] * p.duration.as_secs_f32();
        Lit {
            said: p.words.start + k,
            fade: (into / fade_time.as_secs_f32().max(f32::EPSILON)).clamp(0.0, 1.0),
        }
    }

    /// How many words were said when Stop cut the phrase: those up to `done`, and of the piece that was cut, those it had
    /// finished saying by the share heard.
    pub fn after_stop(&self, said: &Said) -> usize {
        if *said.phrase != *self.phrase {
            return 0;
        }
        let done = self.words.iter().filter(|w| w.end <= said.done).count();
        let Some((span, share)) = &said.cut else {
            return done;
        };
        let range = in_span(&self.words, span);
        let starts = starts(&self.phrase, &self.words, &range);
        let finished = (1..starts.len()).filter(|&k| starts[k] <= *share).count();
        done.max(range.start) + finished
    }

    /// The number of words of the phrase.
    #[cfg(test)]
    pub fn count(&self) -> usize {
        self.words.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    const FADE: Duration = Duration::from_millis(200);

    fn piece(phrase: &str, id: u64, span: Range<usize>, ms: u64, exact: bool) -> Sounding {
        Sounding {
            phrase: Arc::from(phrase),
            id,
            last: span.end >= phrase.len(),
            span,
            duration: Duration::from_millis(ms),
            exact,
        }
    }

    #[test]
    fn words_are_found_as_the_bubble_counts_them() {
        let p = "Sono  d'accordo, con Paola.";
        let w = words(p);
        let said: Vec<&str> = w.iter().map(|r| &p[r.clone()]).collect();
        assert_eq!(said, ["Sono", "d'accordo,", "con", "Paola."]);
        assert!(words("   ").is_empty());
        assert_eq!(words("è già").len(), 2);
    }

    #[test]
    fn a_piece_lights_its_own_words_over_its_own_time() {
        let phrase = "Buongiorno a tutti, sono qui.";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        // «Buongiorno a tutti,» is the first clause (bytes 0..19), «sono qui.» the second
        assert!(l.sounding(&piece(phrase, 1, 0..19, 1500, true), t0));
        assert_eq!(l.at(t0, FADE), Lit { said: 0, fade: 0.0 });
        // the long first word takes most of the first half
        let mid = l.at(t0 + Duration::from_millis(300), FADE);
        assert_eq!((mid.said, mid.fade), (0, 1.0));
        assert_eq!(l.at(t0 + Duration::from_millis(1300), FADE).said, 2);
        // the clause ends: its three words are said, the next one is not yet
        assert_eq!(
            l.at(t0 + Duration::from_millis(1600), FADE),
            Lit { said: 3, fade: 0.0 }
        );
        // the second clause starts: the first three words stay said
        let t1 = t0 + Duration::from_millis(1500);
        assert!(l.sounding(&piece(phrase, 1, 19..phrase.len(), 900, true), t1));
        assert_eq!(l.at(t1, FADE), Lit { said: 3, fade: 0.0 });
        let end = l.at(t1 + Duration::from_millis(901), FADE);
        assert_eq!(end, Lit { said: 5, fade: 0.0 });
        assert_eq!(l.count(), 5);
    }

    #[test]
    fn a_word_darkens_in_the_fade_time_and_then_stays_dark() {
        let phrase = "uno due";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        l.sounding(&piece(phrase, 1, 0..phrase.len(), 1000, true), t0);
        let half = l.at(t0 + Duration::from_millis(100), FADE);
        assert_eq!(half.said, 0);
        assert!((half.fade - 0.5).abs() < 0.01, "{half:?}");
        let later = l.at(t0 + Duration::from_millis(400), FADE);
        assert_eq!((later.said, later.fade), (0, 1.0));
    }

    #[test]
    fn a_voice_that_streams_first_guesses_then_knows() {
        let phrase = "Ciao a tutti.";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        l.sounding(&piece(phrase, 1, 0..phrase.len(), 4000, false), t0);
        // half a second into a guessed 4 s: still on the first word
        assert_eq!(l.at(t0 + Duration::from_millis(500), FADE).said, 0);
        // the exact duration is shorter: the start does not move, the pace does
        l.sounding(&piece(phrase, 1, 0..phrase.len(), 1200, true), t0);
        assert_eq!(l.at(t0 + Duration::from_millis(1000), FADE).said, 2);
        assert_eq!(l.at(t0 + Duration::from_millis(1300), FADE).said, 3);
    }

    #[test]
    fn a_piece_of_another_phrase_is_not_ours() {
        let t0 = Instant::now();
        let mut l = Lighting::new("prima");
        assert!(!l.sounding(&piece("seconda", 2, 0..7, 500, true), t0));
        assert_eq!(l.at(t0, FADE), Lit { said: 0, fade: 0.0 });
    }

    #[test]
    fn the_same_words_said_again_start_over() {
        let phrase = "Va bene.";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        l.sounding(&piece(phrase, 1, 0..8, 600, true), t0);
        assert_eq!(l.at(t0 + Duration::from_secs(1), FADE).said, 2);
        let t1 = t0 + Duration::from_secs(2);
        l.sounding(&piece(phrase, 2, 0..8, 600, true), t1);
        assert_eq!(l.at(t1, FADE), Lit { said: 0, fade: 0.0 });
    }

    #[test]
    fn a_written_number_belongs_to_the_piece_that_says_it() {
        let phrase = "Costa 1.250 € più IVA, va bene.";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        let comma = phrase.find(',').unwrap() + 1;
        l.sounding(&piece(phrase, 1, 0..comma, 3000, true), t0);
        // the number and the euro sign take more than the short words
        assert_eq!(l.at(t0 + Duration::from_millis(300), FADE).said, 0);
        assert_eq!(l.at(t0 + Duration::from_millis(2000), FADE).said, 2);
        assert_eq!(
            l.at(t0 + Duration::from_millis(3100), FADE),
            Lit { said: 5, fade: 0.0 }
        );
    }

    #[test]
    fn stop_keeps_what_was_said_and_a_share_of_the_piece_that_was_cut() {
        let phrase = "Buongiorno a tutti, sono qui con voi.";
        let l = Lighting::new(phrase);
        let comma = phrase.find(',').unwrap() + 1;
        // cut before anything was heard
        let said = |done, cut| Said {
            phrase: Arc::from(phrase),
            id: 1,
            done,
            cut,
        };
        assert_eq!(l.after_stop(&said(0, None)), 0);
        // the first clause was said in full, the second was cut a third in
        let n = l.after_stop(&said(comma, Some((comma..phrase.len(), 0.34))));
        assert!((4..=5).contains(&n), "{n}");
        // cut at the very end of the second clause: every word
        assert_eq!(
            l.after_stop(&said(comma, Some((comma..phrase.len(), 1.0)))),
            l.count()
        );
        // a cut of another phrase says nothing here
        let other = Said {
            phrase: Arc::from("altro"),
            id: 9,
            done: 5,
            cut: None,
        };
        assert_eq!(l.after_stop(&other), 0);
    }

    #[test]
    fn a_piece_without_words_changes_nothing() {
        let phrase = "Ciao …";
        let t0 = Instant::now();
        let mut l = Lighting::new(phrase);
        l.sounding(&piece(phrase, 1, 0..4, 300, true), t0);
        l.sounding(&piece(phrase, 1, 4..phrase.len(), 300, true), t0);
        let lit = l.at(t0 + Duration::from_millis(100), FADE);
        assert!(lit.said <= 2);
    }
}
