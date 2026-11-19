// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Preparing a recording as the official code does before encoding it: resampled to 24 kHz like
//! `scipy.signal.resample_poly` (`pocket_tts/data/audio_utils.convert_audio`), then ended on exactly
//! 80 ms of silence (`end_on_pause`).

/// `scipy.signal.resample_poly(x, up, down)` with its default Kaiser window (beta 5) and zero padding,
/// for the rate change `from` → `to`. Computed in f64, as SciPy does with its f64 filter.
pub fn resample(x: &[f32], from: u32, to: u32) -> Vec<f32> {
    if from == to || x.is_empty() {
        return x.to_vec();
    }
    let g = gcd(from as u64, to as u64);
    let (up, down) = ((to as u64 / g) as usize, (from as u64 / g) as usize);
    let n_in = x.len();
    let n_out = (n_in * up).div_ceil(down);
    let max_rate = up.max(down);
    let half_len = 10 * max_rate;
    let taps = 2 * half_len + 1;
    let mut h = firwin_kaiser(taps, 1.0 / max_rate as f64, 5.0);
    h.iter_mut().for_each(|v| *v *= up as f64);
    // Zero padding that centres the output samples, as resample_poly does.
    let n_pre_pad = down - half_len % down;
    let n_pre_remove = (half_len + n_pre_pad) / down;
    let mut n_post_pad = 0;
    let output_len = |len_h: usize| ((n_in - 1) * up + len_h - 1) / down + 1;
    while output_len(taps + n_pre_pad + n_post_pad) < n_out + n_pre_remove {
        n_post_pad += 1;
    }
    let mut padded = vec![0.0f64; n_pre_pad];
    padded.extend_from_slice(&h);
    padded.resize(padded.len() + n_post_pad, 0.0);
    let len_h = padded.len();
    // upfirdn: y[k] = sum over input samples n of h[k*down - n*up] * x[n].
    (0..n_out)
        .map(|i| {
            let m0 = (n_pre_remove + i) * down;
            let lo = (m0 + up).saturating_sub(len_h) / up; // smallest n with m0 - n*up < len_h
            let lo = if m0 >= lo * up && m0 - lo * up >= len_h {
                lo + 1
            } else {
                lo
            };
            let hi = (m0 / up).min(n_in - 1);
            let mut acc = 0.0f64;
            let mut n = lo;
            while n <= hi {
                acc += padded[m0 - n * up] * f64::from(x[n]);
                n += 1;
            }
            acc as f32
        })
        .collect()
}

fn gcd(a: u64, b: u64) -> u64 {
    if b == 0 { a } else { gcd(b, a % b) }
}

/// `scipy.signal.firwin(taps, cutoff, window=("kaiser", beta))`: low-pass, scaled to unit gain at 0 Hz.
fn firwin_kaiser(taps: usize, cutoff: f64, beta: f64) -> Vec<f64> {
    let alpha = 0.5 * (taps - 1) as f64;
    let i0_beta = bessel_i0(beta);
    let mut h: Vec<f64> = (0..taps)
        .map(|n| {
            let m = n as f64 - alpha;
            let x = cutoff * m;
            let sinc = if x == 0.0 {
                1.0
            } else {
                (std::f64::consts::PI * x).sin() / (std::f64::consts::PI * x)
            };
            let r = 2.0 * n as f64 / (taps - 1) as f64 - 1.0;
            let window = bessel_i0(beta * (1.0 - r * r).max(0.0).sqrt()) / i0_beta;
            cutoff * sinc * window
        })
        .collect();
    let sum: f64 = h.iter().sum();
    h.iter_mut().for_each(|v| *v /= sum);
    h
}

/// Modified Bessel function of the first kind, order 0 (power series; converges fast for the
/// arguments of a Kaiser window).
fn bessel_i0(x: f64) -> f64 {
    let q = x * x / 4.0;
    let mut term = 1.0;
    let mut sum = 1.0;
    for k in 1..200 {
        term *= q / (k * k) as f64;
        sum += term;
        if term < sum * 1e-17 {
            break;
        }
    }
    sum
}

/// `end_on_pause`: cut the trailing silence (20 ms frames more than `floor_db` below the loudest),
/// fade the last `fade` seconds out, then append `pause` seconds of zeros. A prompt that stops on
/// speech makes the model continue that utterance (a wrong first word); one that ends on a long
/// silence delays the start.
pub fn end_on_pause(wav: &[f32], rate: u32, pause: f64, fade: f64, floor_db: f32) -> Vec<f32> {
    let frame = ((0.02 * f64::from(rate)) as usize).max(1);
    let n = wav.len() / frame;
    if n == 0 {
        return wav.to_vec();
    }
    let db: Vec<f32> = wav[..n * frame]
        .chunks_exact(frame)
        .map(|f| {
            let mean = f.iter().map(|s| s * s).sum::<f32>() / frame as f32;
            20.0 * (mean.sqrt() + 1e-12).log10()
        })
        .collect();
    let max = db.iter().copied().fold(f32::NEG_INFINITY, f32::max);
    let last = db.iter().rposition(|&d| d > max - floor_db).unwrap_or(0);
    let end = (last + 1) * frame;
    let mut out = wav[..end].to_vec();
    let fade = ((fade * f64::from(rate)) as usize).min(end);
    for i in 0..fade {
        let g = if fade > 1 {
            1.0 - i as f32 / (fade - 1) as f32
        } else {
            1.0
        };
        out[end - fade + i] *= g;
    }
    out.resize(end + (pause * f64::from(rate)) as usize, 0.0);
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resampling_keeps_a_tone_and_the_length() {
        let from = 48_000;
        let x: Vec<f32> = (0..4800)
            .map(|i| (2.0 * std::f32::consts::PI * 440.0 * i as f32 / from as f32).sin())
            .collect();
        let y = resample(&x, from, 24_000);
        assert_eq!(y.len(), 2400);
        // Away from the edges the tone comes through with unit gain.
        for (i, v) in y.iter().enumerate().skip(200).take(2000) {
            let want = (2.0 * std::f32::consts::PI * 440.0 * i as f32 / 24_000.0).sin();
            assert!((v - want).abs() < 2e-3, "{i}: {v} vs {want}");
        }
        assert_eq!(
            resample(&x, 44_100, 24_000).len(),
            (4800 * 80usize).div_ceil(147)
        );
    }

    #[test]
    fn ends_on_eighty_milliseconds_of_silence() {
        let rate = 24_000;
        let mut wav = vec![0.5f32; 24_000];
        wav.extend(vec![0.0001f32; 12_000]); // 0.5 s of near silence, 74 dB down
        let out = end_on_pause(&wav, rate, 0.08, 0.02, 35.0);
        assert_eq!(out.len(), 24_000 + 1_920);
        assert_eq!(out[24_000 - 480], 0.5);
        assert_eq!(out[23_999], 0.0);
        assert!(out[24_000..].iter().all(|&s| s == 0.0));
    }
}
