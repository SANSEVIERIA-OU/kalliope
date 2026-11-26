// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Opus packets to samples with libopus (BSD-3-Clause, the reference decoder from Xiph.Org and the
//! IETF), loaded at run time like PipeWire and ONNX Runtime: Kalliope starts without it, and only
//! importing an Opus file (WhatsApp and Telegram voice messages) needs it. Symphonia demuxes the
//! packets; it has no Opus decoder.
//!
//! Signatures from `opus.h` of libopus 1.5.2 (`opus_decoder_create`, `opus_decode_float`,
//! `opus_decoder_destroy`, `opus_get_version_string`), stable since 1.0.

use std::ffi::{CStr, c_char, c_int, c_void};
use std::sync::OnceLock;

/// The largest Opus frame: 120 ms at 48 kHz.
const MAX_FRAME: usize = 5760;

#[cfg(unix)]
mod dl {
    use std::ffi::{c_char, c_int, c_void};
    unsafe extern "C" {
        pub fn dlopen(filename: *const c_char, flags: c_int) -> *mut c_void;
        pub fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
    }
}

type Create = unsafe extern "C" fn(i32, c_int, *mut c_int) -> *mut c_void;
type Decode = unsafe extern "C" fn(*mut c_void, *const u8, i32, *mut f32, c_int, c_int) -> c_int;
type Destroy = unsafe extern "C" fn(*mut c_void);
type Version = unsafe extern "C" fn() -> *const c_char;

struct Lib {
    create: Create,
    decode: Decode,
    destroy: Destroy,
    version: Version,
}

// Function pointers into a library that stays loaded for the life of the process.
unsafe impl Send for Lib {}
unsafe impl Sync for Lib {}

static LIB: OnceLock<Option<Lib>> = OnceLock::new();

/// The names libopus has on each system.
#[cfg(target_os = "macos")]
const NAMES: &[&CStr] = &[
    c"libopus.0.dylib",
    c"/opt/homebrew/lib/libopus.0.dylib",
    c"/usr/local/lib/libopus.0.dylib",
];
#[cfg(all(unix, not(target_os = "macos")))]
const NAMES: &[&CStr] = &[c"libopus.so.0"];

#[cfg(unix)]
fn open() -> Option<Lib> {
    const RTLD_NOW: c_int = 2;
    let handle = NAMES
        .iter()
        .map(|n| unsafe { dl::dlopen(n.as_ptr(), RTLD_NOW) })
        .find(|h| !h.is_null())?;
    let sym = |name: &CStr| {
        let p = unsafe { dl::dlsym(handle, name.as_ptr()) };
        (!p.is_null()).then_some(p)
    };
    // SAFETY: each symbol is the libopus function with the C signature of its field (opus.h).
    unsafe {
        Some(Lib {
            create: std::mem::transmute::<*mut c_void, Create>(sym(c"opus_decoder_create")?),
            decode: std::mem::transmute::<*mut c_void, Decode>(sym(c"opus_decode_float")?),
            destroy: std::mem::transmute::<*mut c_void, Destroy>(sym(c"opus_decoder_destroy")?),
            version: std::mem::transmute::<*mut c_void, Version>(sym(c"opus_get_version_string")?),
        })
    }
}

#[cfg(not(unix))]
fn open() -> Option<Lib> {
    None
}

fn lib() -> Option<&'static Lib> {
    LIB.get_or_init(open).as_ref()
}

/// The version of libopus found, if any.
pub fn version() -> Option<String> {
    let lib = lib()?;
    let v = unsafe { (lib.version)() };
    (!v.is_null()).then(|| unsafe { CStr::from_ptr(v) }.to_string_lossy().into_owned())
}

/// A libopus decoder at 48 kHz.
pub struct Decoder {
    lib: &'static Lib,
    state: *mut c_void,
    channels: usize,
    pcm: Vec<f32>,
}

impl Decoder {
    /// `None` when libopus is not on this computer; `Err` for a stream it cannot decode.
    pub fn new(channels: usize) -> Option<Result<Decoder, String>> {
        let lib = lib()?;
        if !(1..=2).contains(&channels) {
            return Some(Err(format!(
                "{channels} Opus channels (only mono and stereo are read)"
            )));
        }
        let mut error = 0;
        let state = unsafe { (lib.create)(48_000, channels as c_int, &mut error) };
        if state.is_null() || error != 0 {
            return Some(Err(format!("libopus could not start (error {error})")));
        }
        Some(Ok(Decoder {
            lib,
            state,
            channels,
            pcm: vec![0.0; MAX_FRAME * channels],
        }))
    }

    /// Decodes one packet; returns its samples, interleaved.
    pub fn decode(&mut self, packet: &[u8]) -> Result<&[f32], String> {
        let len = i32::try_from(packet.len()).map_err(|_| "packet too large".to_string())?;
        let n = unsafe {
            (self.lib.decode)(
                self.state,
                packet.as_ptr(),
                len,
                self.pcm.as_mut_ptr(),
                MAX_FRAME as c_int,
                0,
            )
        };
        if n < 0 {
            return Err(format!("libopus error {n}"));
        }
        Ok(&self.pcm[..n as usize * self.channels])
    }
}

impl Drop for Decoder {
    fn drop(&mut self) {
        unsafe { (self.lib.destroy)(self.state) };
    }
}
