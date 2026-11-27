// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! How good a recording is for a voice, and its clearest stretch.
//!
//! Everything works on 20 ms frames of the recording at the model's rate. A frame is speech when its
//! energy stands clearly above the noise floor (the quietest tenth of the frames); short gaps inside
//! words are filled and lone clicks dropped. The noise floor also gives the signal-to-noise ratio.
//! Music is told from speech by its continuity: speech dips between syllables and words, so many of
//! its frames lie well below its mean energy (after the "percentage of low-energy frames" of Scheirer
//! and Slaney, ICASSP 1997), while music and steady noise keep their energy up.

use kalliope_i18n::tr;

/// Frames per second: 20 ms each.
pub const FRAMES_PER_SECOND: usize = 50;
/// Seconds of recording a voice is made from (Pocket TTS, `kalliope_voice::pocket::MAX_VOICE_SECONDS`).
pub const VOICE_SECONDS: f32 = kalliope_voice::pocket::MAX_VOICE_SECONDS;
/// Less speech than this makes no voice.
pub const MIN_SPEECH_SECONDS: f32 = 4.0;
/// Below this much speech the voice works but resembles the person less.
pub const GOOD_SPEECH_SECONDS: f32 = 8.0;
/// A frame is speech this much above the noise floor.
const SPEECH_ABOVE_FLOOR_DB: f32 = 12.0;
/// Or less, down to this, when the loud frames are not much louder than the floor (noise).
const MIN_ABOVE_FLOOR_DB: f32 = 4.0;
/// And never below this level: digital silence would make any hiss "speech".
const SPEECH_MIN_DB: f32 = -55.0;
/// Speech below this level (dBFS, mean over speech frames) is too quiet.
const QUIET_DB: f32 = -38.0;
/// Below this signal-to-noise ratio the noise is heard in the voice.
const NOISY_SNR_DB: f32 = 15.0;
/// Share of speech samples at full scale beyond which the voice is distorted.
const CLIPPED_SHARE: f32 = 0.001;
/// A sample this close to full scale counts as clipped.
const CLIP_LEVEL: f32 = 0.985;

/// What is wrong with a recording or a stretch of it, from the most to the least serious.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Problem {
    /// No speech at all: silence, noise or music only.
    NoSpeech,
    /// Too little speech to make a voice.
    TooShort,
    /// Enough to make a voice, but more would resemble the person better.
    Short,
    /// The voice was too loud for the microphone and is distorted.
    Clipping,
    /// The voice is very quiet.
    TooQuiet,
    /// Background noise is close to the voice.
    TooNoisy,
    /// It sounds more like music than like speech.
    Music,
}

impl Problem {
    /// Whether no voice can be made from it; the other problems leave the choice to the person.
    pub fn blocks(self) -> bool {
        matches!(self, Problem::NoSpeech | Problem::TooShort)
    }

    /// What to tell the person.
    pub fn message(self) -> String {
        match self {
            Problem::NoSpeech => {
                tr!("programma.analisi.nessuna-voce" => "Non sento una voce che parla: solo silenzio, rumore o musica. Registra di nuovo, o scegli un altro file.")
            }
            Problem::TooShort => {
                tr!("programma.analisi.troppo-poco-parlato" => "C'è troppo poco parlato: servono almeno 4 secondi di voce, meglio 12. Registra ancora un po', o scegli un file più lungo.")
            }
            Problem::Short => {
                tr!("programma.analisi.parlato-breve" => "La voce si può creare, ma con 12 secondi di parlato somiglierebbe di più alla persona.")
            }
            Problem::Clipping => {
                tr!("programma.analisi.distorta" => "La voce è distorta perché era troppo forte. Allontana un po' il microfono, o abbassane il volume, e registra di nuovo.")
            }
            Problem::TooQuiet => {
                tr!("programma.analisi.troppo-bassa" => "La voce è molto bassa. Avvicinati al microfono, o alzane il volume, e registra di nuovo.")
            }
            Problem::TooNoisy => {
                tr!("programma.analisi.rumore-di-fondo" => "C'è molto rumore di fondo, e la voce creata lo imiterà. Se puoi, registra in un posto più silenzioso.")
            }
            Problem::Music => {
                tr!("programma.analisi.musica" => "Questo tratto sembra musica più che una voce che parla. Scegli un altro tratto, o un altro file.")
            }
        }
    }
}

/// Measures of a recording or of a stretch of it.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Quality {
    /// Seconds in all.
    pub seconds: f32,
    /// Seconds of speech in it.
    pub speech_seconds: f32,
    /// Mean level of the speech, in dB below full scale (0 is the loudest possible).
    pub level_db: f32,
    /// The loudest sample, in dB below full scale.
    pub peak_db: f32,
    /// Share of the speech samples at full scale (distortion).
    pub clipped: f32,
    /// Signal-to-noise ratio in dB: how far the voice stands above the background.
    pub snr_db: f32,
    /// Share of the speech frames well below its mean energy: the dips between syllables and
    /// words, many in speech, few in music and steady noise.
    pub low_energy: f32,
    /// Share of the speech frames that hiss like consonants: many in speech, few in music.
    pub consonants: f32,
    /// Seconds that are loud but sound like music.
    pub music_seconds: f32,
}

impl Quality {
    /// The problems these measures show, the most serious first.
    pub fn problems(&self) -> Vec<Problem> {
        let mut out = Vec::new();
        let music = self.music_seconds > 0.25 * self.seconds;
        if self.speech_seconds < 0.5 {
            out.push(Problem::NoSpeech);
            if music {
                out.push(Problem::Music);
            }
            return out;
        }
        if self.speech_seconds < MIN_SPEECH_SECONDS {
            out.push(Problem::TooShort);
        } else if self.speech_seconds < GOOD_SPEECH_SECONDS {
            out.push(Problem::Short);
        }
        if self.clipped > CLIPPED_SHARE {
            out.push(Problem::Clipping);
        }
        if self.level_db < QUIET_DB {
            out.push(Problem::TooQuiet);
        }
        if self.snr_db < NOISY_SNR_DB {
            out.push(Problem::TooNoisy);
        }
        if music {
            out.push(Problem::Music);
        }
        out
    }
}

/// Dips and consonants of plain speech; music has far fewer of both.
const SPEECH_DIPS: f32 = 0.15;
const SPEECH_CONSONANTS: f32 = 0.06;

/// Frames judged together for music.
const MUSIC_BLOCK: usize = FRAMES_PER_SECOND * 3 / 2;

/// How much something sounds like speech, 0 to 1, from its dips and its consonants.
fn speechlike(dips: f32, consonants: f32) -> f32 {
    ((dips / SPEECH_DIPS).min(1.0) * (consonants / SPEECH_CONSONANTS).min(1.0)).sqrt()
}

/// The mean level of loud frames in dB, the share of them well below it (dips between syllables)
/// and the share that hiss like consonants: crossing zero far more often than the mean while still
/// loud ("high zero-crossing rate ratio", Lu, Zhang and Jiang, IEEE Trans. Speech and Audio
/// Processing 2002), which speech has between its vowels and music hardly has.
fn traits(loud: &[Frame]) -> (f32, f32, f32) {
    if loud.is_empty() {
        return (-100.0, 0.0, 0.0);
    }
    let n = loud.len() as f32;
    let mean = loud.iter().map(|f| 10f32.powf(f.db / 10.0)).sum::<f32>() / n;
    let level_db = 10.0 * (mean + 1e-10).log10();
    let dips = loud
        .iter()
        .filter(|f| 10f32.powf(f.db / 10.0) < 0.25 * mean)
        .count() as f32
        / n;
    let mean_zcr = loud.iter().map(|f| f.zcr).sum::<f32>() / n;
    let consonants = loud
        .iter()
        .filter(|f| f.zcr > 1.5 * mean_zcr && f.db > level_db - 25.0)
        .count() as f32
        / n;
    (level_db, dips, consonants)
}

/// A stretch of the recording to make the voice from.
#[derive(Debug, Clone, PartialEq)]
pub struct Stretch {
    /// Where it starts and ends, in seconds from the start of the recording.
    pub start: f32,
    pub end: f32,
    pub quality: Quality,
    pub problems: Vec<Problem>,
    /// How good it is for a voice, 0 to 1: the stretches come best first.
    pub score: f32,
}

/// One 20 ms frame.
#[derive(Debug, Clone, Copy)]
struct Frame {
    /// Energy in dB below full scale.
    db: f32,
    peak: f32,
    clipped: u16,
    /// Zero crossings per sample: low in vowels, high in hissing consonants.
    zcr: f32,
    speech: bool,
    /// Loud, but in a stretch that sounds like music rather than speech.
    music: bool,
}

/// A recording cut in frames, with its noise floor and its speech marked.
pub struct Analysis {
    rate: u32,
    frame: usize,
    frames: Vec<Frame>,
    floor_db: f32,
}

impl Analysis {
    pub fn new(samples: &[f32], rate: u32) -> Analysis {
        let frame = (rate as usize / FRAMES_PER_SECOND).max(1);
        let mut frames: Vec<Frame> = samples
            .chunks(frame)
            .filter(|c| c.len() * 2 >= frame)
            .map(|c| {
                let power = c.iter().map(|s| s * s).sum::<f32>() / c.len() as f32;
                Frame {
                    db: 10.0 * (power + 1e-10).log10(),
                    peak: c.iter().fold(0.0f32, |m, s| m.max(s.abs())),
                    clipped: c.iter().filter(|s| s.abs() >= CLIP_LEVEL).count() as u16,
                    zcr: c
                        .windows(2)
                        .filter(|w| (w[0] >= 0.0) != (w[1] >= 0.0))
                        .count() as f32
                        / c.len() as f32,
                    speech: false,
                    music: false,
                }
            })
            .collect();
        let floor_db = percentile(frames.iter().map(|f| f.db), 0.1).unwrap_or(-100.0);
        let loud_db = percentile(frames.iter().map(|f| f.db), 0.9).unwrap_or(floor_db);
        // Halfway between the floor and the loud frames, so that speech in noise is still found,
        // but at least a little above the floor, where steady noise and music stay.
        let above = ((loud_db - floor_db) / 2.0).clamp(MIN_ABOVE_FLOOR_DB, SPEECH_ABOVE_FLOOR_DB);
        let threshold = (floor_db + above).max(SPEECH_MIN_DB);
        for f in &mut frames {
            f.speech = f.db > threshold;
        }
        smooth(&mut frames);
        // Music sounds loud enough to be speech: tell it apart second by second and a half.
        for block in frames.chunks_mut(MUSIC_BLOCK) {
            let loud: Vec<Frame> = block.iter().filter(|f| f.speech).copied().collect();
            if loud.len() * 3 < block.len() {
                continue;
            }
            let (_, dips, consonants) = traits(&loud);
            if speechlike(dips, consonants) < 0.5 {
                for f in block.iter_mut().filter(|f| f.speech) {
                    f.speech = false;
                    f.music = true;
                }
            }
        }
        Analysis {
            rate,
            frame,
            frames,
            floor_db,
        }
    }

    fn seconds(&self, frames: usize) -> f32 {
        frames as f32 / FRAMES_PER_SECOND as f32
    }

    /// Measures of the frames `from..to`.
    fn quality(&self, from: usize, to: usize) -> Quality {
        let part = &self.frames[from.min(self.frames.len())..to.min(self.frames.len())];
        let speech: Vec<Frame> = part.iter().filter(|f| f.speech).copied().collect();
        let (level_db, low_energy, consonants) = traits(&speech);
        let peak = part.iter().fold(0.0f32, |m, f| m.max(f.peak));
        let clipped: usize = speech.iter().map(|f| f.clipped as usize).sum();
        // The noise: the frames that are not speech here, or the whole recording's floor.
        let noise = percentile(
            part.iter().filter(|f| !f.speech && !f.music).map(|f| f.db),
            0.5,
        )
        .unwrap_or(self.floor_db)
        .max(self.floor_db);
        Quality {
            seconds: self.seconds(part.len()),
            speech_seconds: self.seconds(speech.len()),
            level_db,
            peak_db: 20.0 * (peak + 1e-10).log10(),
            clipped: clipped as f32 / (speech.len() * self.frame).max(1) as f32,
            snr_db: (level_db - noise).max(0.0),
            low_energy,
            consonants,
            music_seconds: self.seconds(part.iter().filter(|f| f.music).count()),
        }
    }

    /// The whole recording.
    pub fn overall(&self) -> Quality {
        self.quality(0, self.frames.len())
    }

    /// Speech so far, in seconds: for the meter while recording.
    pub fn speech_seconds(&self) -> f32 {
        self.seconds(self.frames.iter().filter(|f| f.speech).count())
    }

    /// Up to `count` stretches of at most [`VOICE_SECONDS`] that do not overlap, best first. Each
    /// starts just before speech and ends in a pause. A recording shorter than that is one stretch.
    pub fn stretches(&self, count: usize) -> Vec<Stretch> {
        let n = self.frames.len();
        let window = (VOICE_SECONDS * FRAMES_PER_SECOND as f32) as usize;
        if n == 0 {
            return Vec::new();
        }
        let step = FRAMES_PER_SECOND / 4;
        let mut candidates: Vec<(usize, usize, f32)> = Vec::new();
        let mut start = 0;
        loop {
            let (a, b) = self.snap(start, (start + window).min(n));
            let q = self.quality(a, b);
            candidates.push((a, b, score(&q)));
            if start + window >= n {
                break;
            }
            start += step;
        }
        candidates.sort_by(|x, y| y.2.total_cmp(&x.2).then(x.0.cmp(&y.0)));
        // Stretches with hardly any speech are offered only when there is nothing better.
        let best = candidates.first().map_or(0.0, |c| c.2);
        candidates.retain(|c| c.2 >= 0.05 || c.2 >= best);
        let mut chosen: Vec<(usize, usize, f32)> = Vec::new();
        for c in candidates {
            if chosen.len() == count {
                break;
            }
            if chosen.iter().all(|k| c.1 <= k.0 || c.0 >= k.1) {
                chosen.push(c);
            }
        }
        chosen
            .into_iter()
            .map(|(a, b, score)| {
                let quality = self.quality(a, b);
                Stretch {
                    start: self.seconds(a),
                    end: self.seconds(b),
                    problems: quality.problems(),
                    quality,
                    score,
                }
            })
            .collect()
    }

    /// Moves a window's start back to just before its first speech, and its end back to the last
    /// pause, so that no word is cut.
    fn snap(&self, start: usize, end: usize) -> (usize, usize) {
        let f = &self.frames;
        let first = (start..end).find(|&i| f[i].speech).unwrap_or(start);
        let a = first.saturating_sub(5).max(start);
        let mut b = end;
        if end < f.len() && f[end - 1].speech {
            // Back to the last pause of at least 60 ms in the last 2.5 s.
            let limit = end.saturating_sub(FRAMES_PER_SECOND * 5 / 2).max(a + 1);
            let mut quiet = 0;
            for i in (limit..end).rev() {
                if f[i].speech {
                    quiet = 0;
                } else {
                    quiet += 1;
                    if quiet >= 3 {
                        b = i + 2;
                        break;
                    }
                }
            }
        }
        (a, b.max(a + 1))
    }

    /// The samples of `stretch` from the recording `samples` (at the rate of the analysis).
    pub fn cut<'a>(&self, samples: &'a [f32], stretch: &Stretch) -> &'a [f32] {
        let at = |s: f32| ((s * self.rate as f32) as usize).min(samples.len());
        &samples[at(stretch.start)..at(stretch.end)]
    }
}

/// How good a stretch is for a voice, 0 to 1.
fn score(q: &Quality) -> f32 {
    let speech = (q.speech_seconds / VOICE_SECONDS).min(1.0);
    let clarity = ((q.snr_db - 5.0) / 25.0).clamp(0.05, 1.0);
    let level = if q.level_db < QUIET_DB { 0.6 } else { 1.0 };
    let clean = (1.0 - q.clipped / (4.0 * CLIPPED_SHARE)).clamp(0.1, 1.0);
    let speechlike = speechlike(q.low_energy, q.consonants).max(0.05);
    speech * clarity * level * clean * speechlike
}

/// Fills gaps shorter than 200 ms inside speech and drops speech bursts shorter than 60 ms.
fn smooth(frames: &mut [Frame]) {
    let n = frames.len();
    let mut i = 0;
    while i < n {
        if frames[i].speech {
            i += 1;
            continue;
        }
        let gap_end = (i..n).find(|&k| frames[k].speech).unwrap_or(n);
        if i > 0 && gap_end < n && gap_end - i < 10 {
            frames[i..gap_end].iter_mut().for_each(|f| f.speech = true);
        }
        i = gap_end;
    }
    let mut i = 0;
    while i < n {
        if !frames[i].speech {
            i += 1;
            continue;
        }
        let end = (i..n).find(|&k| !frames[k].speech).unwrap_or(n);
        if end - i < 3 {
            frames[i..end].iter_mut().for_each(|f| f.speech = false);
        }
        i = end;
    }
}

fn percentile(values: impl Iterator<Item = f32>, p: f32) -> Option<f32> {
    let mut v: Vec<f32> = values.collect();
    if v.is_empty() {
        return None;
    }
    v.sort_by(f32::total_cmp);
    Some(v[((v.len() - 1) as f32 * p).round() as usize])
}

#[cfg(test)]
mod tests {
    use super::*;

    const RATE: u32 = 24_000;

    /// Fake speech: syllables of a voiced tone, 4 per second, each opened by a hissing
    /// consonant, with a pause every 2 s.
    fn speech(seconds: f32, amplitude: f32) -> Vec<f32> {
        let n = (seconds * RATE as f32) as usize;
        let hiss = noise(n, 1.0, 17);
        (0..n)
            .map(|i| {
                let t = i as f32 / RATE as f32;
                let phase = (t * 4.0).fract();
                let consonant = (phase < 0.12) as u8 as f32;
                let syllable = (0.12..0.7).contains(&phase) as u8 as f32;
                let pause = ((t / 2.0).fract() < 0.85) as u8 as f32;
                let pitch = 140.0 + 20.0 * (t * 1.3).sin();
                amplitude
                    * pause
                    * (syllable
                        * ((t * pitch * std::f32::consts::TAU).sin()
                            + 0.4 * (t * 2.0 * pitch * std::f32::consts::TAU).sin())
                        + consonant * 0.5 * hiss[i])
            })
            .collect()
    }

    fn noise(n: usize, amplitude: f32, seed: u32) -> Vec<f32> {
        let mut x = seed.max(1);
        (0..n)
            .map(|_| {
                x ^= x << 13;
                x ^= x >> 17;
                x ^= x << 5;
                amplitude * ((x as f32 / u32::MAX as f32) * 2.0 - 1.0)
            })
            .collect()
    }

    /// "Music": chords with a beat twice a second, which dips like syllables do.
    fn music(seconds: f32) -> Vec<f32> {
        let n = (seconds * RATE as f32) as usize;
        (0..n)
            .map(|i| {
                let t = i as f32 / RATE as f32;
                let beat = 0.5 + 0.5 * (t * 2.0 * std::f32::consts::TAU).sin();
                0.15 * beat
                    * [220.0, 277.2, 329.6, 440.0]
                        .iter()
                        .map(|f| (t * f * std::f32::consts::TAU).sin())
                        .sum::<f32>()
            })
            .collect()
    }

    fn mix(a: &[f32], b: &[f32]) -> Vec<f32> {
        a.iter().zip(b).map(|(x, y)| x + y).collect()
    }

    #[test]
    fn a_clean_recording_has_no_problems() {
        let s = speech(14.0, 0.3);
        let a = Analysis::new(&mix(&s, &noise(s.len(), 0.001, 7)), RATE);
        let q = a.overall();
        assert!(q.speech_seconds > 9.0, "{q:?}");
        assert!(q.snr_db > 30.0, "{q:?}");
        let best = &a.stretches(3)[0];
        assert!(best.problems.is_empty(), "{best:?}");
        assert!(best.end - best.start <= VOICE_SECONDS + 0.01);
    }

    #[test]
    fn too_short_quiet_noisy_and_clipped_recordings_are_explained() {
        let short = Analysis::new(&speech(2.5, 0.3), RATE).overall();
        assert_eq!(short.problems().first(), Some(&Problem::TooShort));
        let quiet = Analysis::new(
            &mix(&speech(12.0, 0.004), &noise(288_000, 0.00001, 3)),
            RATE,
        );
        assert!(
            quiet.overall().problems().contains(&Problem::TooQuiet),
            "{:?}",
            quiet.overall()
        );
        let s = speech(12.0, 0.2);
        let noisy = Analysis::new(&mix(&s, &noise(s.len(), 0.08, 5)), RATE).overall();
        assert!(noisy.problems().contains(&Problem::TooNoisy), "{noisy:?}");
        let loud: Vec<f32> = speech(12.0, 2.0)
            .iter()
            .map(|x| x.clamp(-1.0, 1.0))
            .collect();
        let clipped = Analysis::new(&loud, RATE).overall();
        assert!(
            clipped.problems().contains(&Problem::Clipping),
            "{clipped:?}"
        );
        let silence = Analysis::new(&noise(240_000, 0.001, 9), RATE).overall();
        assert_eq!(silence.problems(), [Problem::NoSpeech]);
        assert!(Problem::NoSpeech.blocks() && !Problem::Clipping.blocks());
    }

    #[test]
    fn the_clearest_stretch_skips_music_and_silence() {
        // 10 s of music, 3 s of silence, then 14 s of speech.
        let mut x = music(10.0);
        x.extend(vec![0.0; 3 * RATE as usize]);
        x.extend(speech(14.0, 0.3));
        let x = mix(&x, &noise(x.len(), 0.0005, 11));
        let a = Analysis::new(&x, RATE);
        let stretches = a.stretches(3);
        let best = &stretches[0];
        assert!(best.start >= 12.5, "{stretches:#?}");
        assert!(best.quality.speech_seconds > 8.0, "{best:?}");
        // The music, if offered at all, comes later and says what it is.
        if let Some(m) = stretches.iter().find(|s| s.start < 10.0) {
            assert!(m.score < best.score);
            assert!(m.problems.contains(&Problem::Music), "{m:?}");
        }
        assert_eq!(
            a.cut(&x, best).len(),
            ((best.end - best.start) * RATE as f32) as usize
        );
    }

    #[test]
    fn a_stretch_never_cuts_a_word() {
        let x = speech(30.0, 0.3);
        let a = Analysis::new(&x, RATE);
        for s in a.stretches(3) {
            let end = (s.end * FRAMES_PER_SECOND as f32).round() as usize;
            if end < a.frames.len() {
                assert!(
                    !a.frames[end - 1].speech || !a.frames[end.min(a.frames.len() - 1)].speech,
                    "{s:?}"
                );
            }
        }
    }
}
