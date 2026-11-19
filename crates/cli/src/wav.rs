// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! WAV files: 16-bit PCM mono encoding, and decoding of the usual PCM and float files.

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

/// Decodes a WAV file (integer PCM of 8, 16, 24 or 32 bits, or 32/64-bit float, plain or
/// `WAVE_FORMAT_EXTENSIBLE`) to mono samples, averaging the channels, and its sample rate.
pub fn decode(bytes: &[u8]) -> Result<(Vec<f32>, u32), String> {
    let bad = |what: &str| {
        format!(
            "not a WAV file this program reads ({what}); convert it, e.g. with ffmpeg -i IN -ar 24000 -ac 1 OUT.wav"
        )
    };
    if bytes.len() < 12 || &bytes[0..4] != b"RIFF" || &bytes[8..12] != b"WAVE" {
        return Err(bad("no RIFF/WAVE header"));
    }
    let u16_at = |i: usize| u16::from_le_bytes([bytes[i], bytes[i + 1]]);
    let u32_at = |i: usize| u32::from_le_bytes(bytes[i..i + 4].try_into().expect("4 bytes"));
    let mut format = None;
    let mut data = None;
    let mut i = 12;
    while i + 8 <= bytes.len() {
        let id = &bytes[i..i + 4];
        let size = u32_at(i + 4) as usize;
        let body = i + 8;
        let end = body.saturating_add(size).min(bytes.len());
        if id == b"fmt " && size >= 16 && end >= body + 16 {
            let mut tag = u16_at(body);
            if tag == 0xFFFE && size >= 40 && end >= body + 26 {
                tag = u16_at(body + 24); // the sub-format GUID starts with the format tag
            }
            format = Some((tag, u16_at(body + 2), u32_at(body + 4), u16_at(body + 14)));
        } else if id == b"data" {
            data = Some(&bytes[body..end]);
        }
        i = body + size + (size & 1);
    }
    let (tag, channels, rate, bits) = format.ok_or_else(|| bad("no fmt chunk"))?;
    let data = data.ok_or_else(|| bad("no data chunk"))?;
    if channels == 0 || rate == 0 {
        return Err(bad("no channels or no sample rate"));
    }
    let width = usize::from(bits / 8);
    let sample = |b: &[u8]| -> Option<f32> {
        Some(match (tag, bits) {
            (1, 8) => (f32::from(b[0]) - 128.0) / 128.0,
            (1, 16) => f32::from(i16::from_le_bytes([b[0], b[1]])) / 32768.0,
            (1, 24) => (i32::from_le_bytes([0, b[0], b[1], b[2]]) >> 8) as f32 / 8_388_608.0,
            (1, 32) => i32::from_le_bytes([b[0], b[1], b[2], b[3]]) as f32 / 2_147_483_648.0,
            (3, 32) => f32::from_le_bytes([b[0], b[1], b[2], b[3]]),
            (3, 64) => f64::from_le_bytes(b[..8].try_into().ok()?) as f32,
            _ => return None,
        })
    };
    if width == 0 || sample(&[0; 8][..width.max(1)]).is_none() {
        return Err(bad(&format!("format {tag} with {bits} bits")));
    }
    let frame = width * usize::from(channels);
    let samples = data
        .chunks_exact(frame)
        .map(|f| {
            f.chunks_exact(width)
                .map(|b| sample(b).unwrap_or(0.0))
                .sum::<f32>()
                / f32::from(channels)
        })
        .collect();
    Ok((samples, rate))
}

#[cfg(test)]
mod tests {
    #[test]
    fn decodes_what_it_encodes_and_mixes_channels() {
        let wav = super::encode(&[0.0, 0.5, -0.5], 16000);
        let (s, rate) = super::decode(&wav).unwrap();
        assert_eq!(rate, 16000);
        assert_eq!(s.len(), 3);
        assert!((s[1] - 0.5).abs() < 1e-4 && (s[2] + 0.5).abs() < 1e-4);
        // Stereo 32-bit float: the two channels are averaged.
        let mut st = wav[..44].to_vec();
        st[20..22].copy_from_slice(&3u16.to_le_bytes()); // float
        st[22..24].copy_from_slice(&2u16.to_le_bytes()); // two channels
        st[34..36].copy_from_slice(&32u16.to_le_bytes());
        let samples = [0.25f32, 0.75, -1.0, 0.0];
        st[40..44].copy_from_slice(&16u32.to_le_bytes());
        for x in samples {
            st.extend_from_slice(&x.to_le_bytes());
        }
        let (s, _) = super::decode(&st).unwrap();
        assert_eq!(s, [0.5, -0.5]);
        assert!(super::decode(b"RIFF....WAVEjunk").is_err());
    }

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
