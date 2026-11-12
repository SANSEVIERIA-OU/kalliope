// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! The one SPA pod Kalliope sends to PipeWire: the audio format of a stream, built by hand.
//!
//! Binary layout (spa/include/spa/pod/pod.h): every pod starts with `struct spa_pod { uint32_t
//! size; uint32_t type; }`, where `size` counts the body only, and every pod is padded to 8 bytes.
//! An object body (`struct spa_pod_object_body`) holds the object type and id, followed by
//! properties (`struct spa_pod_prop { uint32_t key; uint32_t flags; struct spa_pod value; }` plus
//! the value body). An array body (`struct spa_pod_array_body`) is one child `struct spa_pod`
//! header followed by the packed child values.

// spa/include/spa/utils/type.h
const TYPE_ID: u32 = 3;
const TYPE_INT: u32 = 4;
const TYPE_ARRAY: u32 = 13;
const TYPE_OBJECT: u32 = 15;
const TYPE_OBJECT_FORMAT: u32 = 0x40003;
// spa/include/spa/param/param.h (enum spa_param_type)
const PARAM_ENUM_FORMAT: u32 = 3;
// spa/include/spa/param/format.h
const FORMAT_MEDIA_TYPE: u32 = 1;
const FORMAT_MEDIA_SUBTYPE: u32 = 2;
const FORMAT_AUDIO_FORMAT: u32 = 0x10001;
const FORMAT_AUDIO_RATE: u32 = 0x10003;
const FORMAT_AUDIO_CHANNELS: u32 = 0x10004;
const FORMAT_AUDIO_POSITION: u32 = 0x10005;
const MEDIA_TYPE_AUDIO: u32 = 1;
const MEDIA_SUBTYPE_RAW: u32 = 1;
// spa/include/spa/param/audio/raw.h: SPA_AUDIO_FORMAT_F32 is F32_LE on little-endian hosts.
#[cfg(target_endian = "little")]
const AUDIO_FORMAT_F32: u32 = 0x11b;
#[cfg(target_endian = "big")]
const AUDIO_FORMAT_F32: u32 = 0x11c;
const AUDIO_CHANNEL_MONO: u32 = 2;

/// 32-bit words of the format object; 8-byte aligned like every pod.
const WORDS: usize = 42;

#[repr(C, align(8))]
pub struct AudioFormat {
    words: [u32; WORDS],
}

impl AudioFormat {
    /// An `EnumFormat` object for interleaved F32 mono at `rate`: what
    /// `spa_format_audio_raw_build()` produces for the same `spa_audio_info_raw`.
    pub fn f32_mono(rate: u32) -> AudioFormat {
        let mut w = Writer {
            words: [0; WORDS],
            len: 0,
        };
        w.push(&[0, TYPE_OBJECT, TYPE_OBJECT_FORMAT, PARAM_ENUM_FORMAT]);
        w.prop(FORMAT_MEDIA_TYPE, TYPE_ID, MEDIA_TYPE_AUDIO);
        w.prop(FORMAT_MEDIA_SUBTYPE, TYPE_ID, MEDIA_SUBTYPE_RAW);
        w.prop(FORMAT_AUDIO_FORMAT, TYPE_ID, AUDIO_FORMAT_F32);
        w.prop(FORMAT_AUDIO_RATE, TYPE_INT, rate);
        w.prop(FORMAT_AUDIO_CHANNELS, TYPE_INT, 1);
        // Array of one Id: array size 8 (child header) + 4, padded to 8 bytes.
        w.push(&[FORMAT_AUDIO_POSITION, 0, 12, TYPE_ARRAY, 4, TYPE_ID]);
        w.push(&[AUDIO_CHANNEL_MONO, 0]);
        debug_assert_eq!(w.len, WORDS);
        w.words[0] = (4 * (w.len - 2)) as u32;
        AudioFormat { words: w.words }
    }

    /// Pointer to the `struct spa_pod`, valid while `self` lives.
    pub fn as_ptr(&self) -> *const std::ffi::c_void {
        self.words.as_ptr().cast()
    }
}

struct Writer {
    words: [u32; WORDS],
    len: usize,
}

impl Writer {
    fn push(&mut self, values: &[u32]) {
        self.words[self.len..self.len + values.len()].copy_from_slice(values);
        self.len += values.len();
    }

    /// A property holding a 4-byte scalar (Id or Int), padded to 8 bytes.
    fn prop(&mut self, key: u32, kind: u32, value: u32) {
        self.push(&[key, 0, 4, kind, value, 0]);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Output of `spa_format_audio_raw_build(&b, SPA_PARAM_EnumFormat, &info)` with
    /// `{ .format = SPA_AUDIO_FORMAT_F32, .rate = 24000, .channels = 1, .position = { MONO } }`,
    /// compiled against the PipeWire 1.6.11 headers on x86_64, as 32-bit words.
    const REFERENCE: [u32; WORDS] = [
        160, 15, 262147, 3, 1, 0, 4, 3, 1, 0, 2, 0, 4, 3, 1, 0, 65537, 0, 4, 3, 283, 0, 65539, 0,
        4, 4, 24000, 0, 65540, 0, 4, 4, 1, 0, 65541, 0, 12, 13, 4, 3, 2, 0,
    ];

    #[cfg(target_endian = "little")]
    #[test]
    fn matches_libspa_builder() {
        assert_eq!(AudioFormat::f32_mono(24_000).words, REFERENCE);
    }

    #[test]
    fn size_covers_the_body() {
        let pod = AudioFormat::f32_mono(48_000);
        assert_eq!(pod.words[0] as usize, 4 * (WORDS - 2));
        assert_eq!(pod.words[26], 48_000);
        assert_eq!(pod.as_ptr() as usize % 8, 0);
    }
}
