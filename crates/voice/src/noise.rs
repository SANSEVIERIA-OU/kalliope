// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Decoder noise: seeded standard-normal samples.
//!
//! The decoder takes 9 noise channels at audio rate, so about 216,000 samples per second of
//! speech. Box–Muller (logarithm, square root, sine and cosine per pair) took about 5% of all
//! synthesis CPU; the ziggurat method (Marsaglia & Tsang, 2000) needs one random number, one
//! table lookup and one multiplication for 98% of samples. Layer index and value come from
//! separate bits of a 64-bit random number (avoiding the original's correlation flaw).

use std::sync::OnceLock;

const LAYERS: usize = 128;
/// Start of the tail of the 128-layer normal ziggurat.
const R: f64 = 3.442_619_855_899;
/// Area of each layer.
const V: f64 = 9.912_563_035_262_17e-3;

struct Tables {
    k: [u32; LAYERS],
    w: [f32; LAYERS],
    f: [f32; LAYERS],
}

fn tables() -> &'static Tables {
    static TABLES: OnceLock<Tables> = OnceLock::new();
    TABLES.get_or_init(|| {
        let m = 2_147_483_648.0f64;
        let mut t = Tables {
            k: [0; LAYERS],
            w: [0.0; LAYERS],
            f: [0.0; LAYERS],
        };
        let mut dn = R;
        let mut tn = dn;
        let q = V / (-0.5 * dn * dn).exp();
        t.k[0] = ((dn / q) * m) as u32;
        t.k[1] = 0;
        t.w[0] = (q / m) as f32;
        t.w[LAYERS - 1] = (dn / m) as f32;
        t.f[0] = 1.0;
        t.f[LAYERS - 1] = (-0.5 * dn * dn).exp() as f32;
        for i in (1..LAYERS - 1).rev() {
            dn = (-2.0 * (V / dn + (-0.5 * dn * dn).exp()).ln()).sqrt();
            t.k[i + 1] = ((dn / tn) * m) as u32;
            tn = dn;
            t.f[i] = (-0.5 * dn * dn).exp() as f32;
            t.w[i] = (dn / m) as f32;
        }
        t
    })
}

/// SplitMix64: tiny, fast and statistically sound for noise.
struct SplitMix64(u64);

impl SplitMix64 {
    #[inline]
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9e37_79b9_7f4a_7c15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
        z ^ (z >> 31)
    }

    /// Uniform in (0, 1), never exactly 0.
    #[inline]
    fn uniform(&mut self) -> f64 {
        ((self.next() >> 11) as f64 + 0.5) / (1u64 << 53) as f64
    }
}

#[inline]
fn sample(t: &Tables, rng: &mut SplitMix64) -> f32 {
    loop {
        let r = rng.next();
        let i = (r & (LAYERS as u64 - 1)) as usize;
        let hz = (r >> 32) as u32 as i32;
        let x = hz as f32 * t.w[i];
        if hz.unsigned_abs() < t.k[i] {
            return x;
        }
        if i == 0 {
            // Beyond R: exponential rejection from the tail.
            loop {
                let x = -rng.uniform().ln() / R;
                let y = -rng.uniform().ln();
                if y + y >= x * x {
                    return (if hz > 0 { R + x } else { -R - x }) as f32;
                }
            }
        }
        // In the wedge between this layer and the next: accept under the curve.
        if t.f[i] + rng.uniform() as f32 * (t.f[i - 1] - t.f[i]) < (-0.5 * x * x).exp() {
            return x;
        }
    }
}

/// `n` standard-normal samples; the same seed always gives the same samples.
pub fn gaussian(n: usize, seed: u32) -> Vec<f32> {
    let t = tables();
    let mut rng = SplitMix64(u64::from(seed));
    (0..n).map(|_| sample(t, &mut rng)).collect()
}

#[cfg(test)]
mod tests {
    use super::gaussian;

    #[test]
    fn standard_normal_moments_and_tails() {
        let n = 2_000_000;
        let v = gaussian(n, 42);
        let mean = v.iter().map(|&x| f64::from(x)).sum::<f64>() / n as f64;
        let var = v
            .iter()
            .map(|&x| (f64::from(x) - mean).powi(2))
            .sum::<f64>()
            / n as f64;
        let kurt = v
            .iter()
            .map(|&x| (f64::from(x) - mean).powi(4))
            .sum::<f64>()
            / n as f64
            / (var * var);
        let beyond = |a: f32| v.iter().filter(|x| x.abs() > a).count() as f64 / n as f64;
        assert!(mean.abs() < 0.003, "mean {mean}");
        assert!((var - 1.0).abs() < 0.005, "variance {var}");
        assert!((kurt - 3.0).abs() < 0.03, "kurtosis {kurt}");
        assert!(
            (beyond(1.0) - 0.3173).abs() < 0.002,
            "P(|x|>1) {}",
            beyond(1.0)
        );
        assert!(
            (beyond(2.0) - 0.0455).abs() < 0.001,
            "P(|x|>2) {}",
            beyond(2.0)
        );
        assert!(
            (beyond(3.0) - 0.0027).abs() < 0.0003,
            "P(|x|>3) {}",
            beyond(3.0)
        );
        assert!(
            (beyond(3.5) - 0.000465).abs() < 0.0001,
            "P(|x|>3.5) {}",
            beyond(3.5)
        );
    }

    #[test]
    fn seeded_and_reproducible() {
        assert_eq!(gaussian(1000, 3), gaussian(1000, 3));
        assert_ne!(gaussian(1000, 3), gaussian(1000, 4));
        assert_eq!(gaussian(7, 0).len(), 7);
    }

    #[test]
    #[ignore = "timing probe: cargo test --release -- --ignored --nocapture"]
    fn speed() {
        let t = std::time::Instant::now();
        let v = gaussian(24_900_000, 1);
        eprintln!(
            "24.9M samples: {:.3} s (checksum {})",
            t.elapsed().as_secs_f64(),
            v.iter().sum::<f32>()
        );
    }
}
