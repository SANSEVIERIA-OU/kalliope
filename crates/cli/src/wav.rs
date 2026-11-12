// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! 16-bit PCM mono WAV encoding.

/// Encodes `samples` (nominally within -1..1) as a mono 16-bit WAV file. Audio that would clip
/// is scaled down to fit; quieter audio is left as it is.
pub fn encode(samples: &[f32], sample_rate: u32) -> Vec<u8> {
    let peak = samples.iter().fold(0.0f32, |m, s| m.max(s.abs()));
    let gain = if peak > 1.0 { 1.0 / peak } else { 1.0 };
    let data_len = (samples.len() * 2) as u32;
    let mut out = Vec::with_capacity(44 + samples.len() * 2);
    out.extend_from_slice(b"RIFF");
    out.extend_from_slice(&(36 + data_len).to_le_bytes());
    out.extend_from_slice(b"WAVEfmt ");
    out.extend_from_slice(&16u32.to_le_bytes()); // fmt chunk size
    out.extend_from_slice(&1u16.to_le_bytes()); // PCM
    out.extend_from_slice(&1u16.to_le_bytes()); // mono
    out.extend_from_slice(&sample_rate.to_le_bytes());
    out.extend_from_slice(&(sample_rate * 2).to_le_bytes()); // bytes per second
    out.extend_from_slice(&2u16.to_le_bytes()); // block align
    out.extend_from_slice(&16u16.to_le_bytes()); // bits per sample
    out.extend_from_slice(b"data");
    out.extend_from_slice(&data_len.to_le_bytes());
    for &s in samples {
        let v = (s * gain * 32767.0).round().clamp(-32768.0, 32767.0) as i16;
        out.extend_from_slice(&v.to_le_bytes());
    }
    out
}

#[cfg(test)]
mod tests {
    #[test]
    fn header_and_samples() {
        let wav = super::encode(&[0.0, 1.0, -1.0, 2.0], 24000);
        assert_eq!(&wav[0..4], b"RIFF");
        assert_eq!(u32::from_le_bytes(wav[4..8].try_into().unwrap()), 36 + 8);
        assert_eq!(u32::from_le_bytes(wav[24..28].try_into().unwrap()), 24000);
        assert_eq!(wav.len(), 44 + 8);
        // Peak 2.0 halves everything: 1.0 → 16384 (rounded), 2.0 → 32767.
        let s = |i: usize| i16::from_le_bytes(wav[44 + 2 * i..46 + 2 * i].try_into().unwrap());
        assert_eq!((s(0), s(1), s(2), s(3)), (0, 16384, -16384, 32767));
    }
}
