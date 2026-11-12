// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! PipeWire backend: a minimal binding to libpipewire-0.3, loaded at run time with `dlopen`.
//!
//! Only the calls Kalliope needs. Struct layouts and constants were checked against the headers
//! of PipeWire 1.6.11 (`spa/include/spa/...` and `src/pipewire/...` in
//! gitlab.freedesktop.org/pipewire/pipewire); each definition names its header. Everything used
//! is stable ABI of libpipewire-0.3; `pw_buffer.requested` needs 0.3.49, older versions fall
//! back to 20 ms per buffer.
//!
//! Threading: the process callbacks run in PipeWire's realtime data thread
//! (`PW_STREAM_FLAG_RT_PROCESS`), inside the graph cycle, and only touch atomics and the
//! [`Queue`], whose realtime side never blocks or allocates. The other callbacks run in one
//! `pw_thread_loop`; app threads take its lock for the rare stream changes. Without
//! `RT_PROCESS`, PipeWire 1.x runs a stream as an asynchronous node on that thread loop, and a
//! late wake-up there dropped whole buffers of speech under load in our tests.

use std::cell::UnsafeCell;
use std::ffi::{CStr, CString, c_char, c_int, c_void};
use std::ptr;
use std::sync::atomic::{AtomicBool, AtomicI32, AtomicPtr, Ordering};
use std::sync::{Mutex, MutexGuard, OnceLock, PoisonError};
use std::time::{Duration, Instant};

use crate::Error;
use crate::pod::AudioFormat;
use crate::queue::Queue;

const LIBRARY: &CStr = c"libpipewire-0.3.so.0";
const RTLD_NOW: c_int = 2;

// pipewire/stream.h: enum pw_stream_state.
const STATE_ERROR: c_int = -1;
const STATE_UNCONNECTED: c_int = 0;
const STATE_CONNECTING: c_int = 1;
const STATE_PAUSED: c_int = 2;
const STATE_STREAMING: c_int = 3;
// pipewire/stream.h: enum pw_stream_flags.
const FLAG_AUTOCONNECT: u32 = 1 << 0;
const FLAG_INACTIVE: u32 = 1 << 1;
const FLAG_MAP_BUFFERS: u32 = 1 << 2;
const FLAG_RT_PROCESS: u32 = 1 << 4;
// spa/utils/defs.h: enum spa_direction (pw_direction is the same enum).
const DIRECTION_OUTPUT: u32 = 1;
// pipewire/core.h: PW_ID_ANY.
const ID_ANY: u32 = 0xffff_ffff;
// pipewire/stream.h: PW_VERSION_STREAM_EVENTS.
const VERSION_STREAM_EVENTS: u32 = 2;

/// Wanted latency per graph cycle: 21 ms, PipeWire's default quantum (1024 frames at 48 kHz).
/// PipeWire rounds the cycle down to a power of two, so asking for exactly 20 ms would make the
/// whole graph run 512-frame cycles, twice the wake-ups, while an app records from the mic.
const LATENCY: &CStr = c"1024/48000";
/// How long `open` waits for PipeWire to accept the stream.
const OPEN_TIMEOUT: Duration = Duration::from_secs(5);
/// Bytes per sample of the stream format (F32 mono).
const STRIDE: usize = size_of::<f32>();

unsafe extern "C" {
    fn dlopen(filename: *const c_char, flags: c_int) -> *mut c_void;
    fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
    fn dlerror() -> *const c_char;
}

/// `struct spa_dict_item` (spa/utils/dict.h).
#[repr(C)]
struct SpaDictItem {
    key: *const c_char,
    value: *const c_char,
}

/// `struct spa_dict` (spa/utils/dict.h).
#[repr(C)]
struct SpaDict {
    flags: u32,
    n_items: u32,
    items: *const SpaDictItem,
}

/// `struct spa_hook` (spa/utils/hook.h): a `spa_list` link (2 pointers), a `spa_callbacks`
/// (2 pointers), `removed` and `priv`. PipeWire owns the contents once the hook is registered;
/// Kalliope only provides zeroed storage at a fixed address.
#[repr(C)]
struct SpaHook {
    _private: [*mut c_void; 6],
}

/// `struct spa_chunk` (spa/buffer/buffer.h).
#[repr(C)]
struct SpaChunk {
    offset: u32,
    size: u32,
    stride: i32,
    flags: i32,
}

/// `struct spa_data` (spa/buffer/buffer.h).
#[repr(C)]
struct SpaData {
    kind: u32,
    flags: u32,
    fd: i64,
    mapoffset: u32,
    maxsize: u32,
    data: *mut c_void,
    chunk: *mut SpaChunk,
}

/// `struct spa_buffer` (spa/buffer/buffer.h).
#[repr(C)]
struct SpaBuffer {
    n_metas: u32,
    n_datas: u32,
    metas: *mut c_void,
    datas: *mut SpaData,
}

/// `struct pw_buffer` (pipewire/stream.h), up to `requested` (since 0.3.49); later fields are
/// never read. PipeWire allocates it.
#[repr(C)]
struct PwBuffer {
    buffer: *mut SpaBuffer,
    user_data: *mut c_void,
    size: u64,
    requested: u64,
}

type Callback = unsafe extern "C" fn(*mut c_void);

/// `struct pw_stream_events` (pipewire/stream.h), version 2.
#[repr(C)]
struct StreamEvents {
    version: u32,
    destroy: Option<Callback>,
    state_changed: Option<unsafe extern "C" fn(*mut c_void, c_int, c_int, *const c_char)>,
    control_info: Option<unsafe extern "C" fn(*mut c_void, u32, *const c_void)>,
    io_changed: Option<unsafe extern "C" fn(*mut c_void, u32, *mut c_void, u32)>,
    param_changed: Option<unsafe extern "C" fn(*mut c_void, u32, *const c_void)>,
    add_buffer: Option<unsafe extern "C" fn(*mut c_void, *mut PwBuffer)>,
    remove_buffer: Option<unsafe extern "C" fn(*mut c_void, *mut PwBuffer)>,
    process: Option<Callback>,
    drained: Option<Callback>,
    command: Option<unsafe extern "C" fn(*mut c_void, *const c_void)>,
    trigger_done: Option<Callback>,
}

#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(size_of::<SpaDict>() == 16);
    assert!(size_of::<SpaHook>() == 48);
    assert!(size_of::<SpaData>() == 40);
    assert!(size_of::<SpaBuffer>() == 24);
    assert!(std::mem::offset_of!(PwBuffer, requested) == 24);
    assert!(size_of::<StreamEvents>() == 96);
};

const EVENTS: StreamEvents = StreamEvents {
    version: VERSION_STREAM_EVENTS,
    destroy: None,
    state_changed: None,
    control_info: None,
    io_changed: None,
    param_changed: None,
    add_buffer: None,
    remove_buffer: None,
    process: None,
    drained: None,
    command: None,
    trigger_done: None,
};

static MIC_EVENTS: StreamEvents = StreamEvents {
    state_changed: Some(on_mic_state),
    process: Some(on_mic_process),
    ..EVENTS
};

static MONITOR_EVENTS: StreamEvents = StreamEvents {
    state_changed: Some(on_monitor_state),
    process: Some(on_monitor_process),
    drained: Some(on_monitor_drained),
    ..EVENTS
};

/// Declares the library's function table and its loader.
macro_rules! library {
    ($($field:ident = $symbol:literal: fn($($arg:ty),*) $(-> $ret:ty)?;)*) => {
        /// The loaded library's entry points. Loaded once per process and never unloaded:
        /// `pw_deinit` releases PipeWire's own resources, and unloading code that may still
        /// own threads or atexit handlers is not safe.
        struct Lib {
            $($field: unsafe extern "C" fn($($arg),*) $(-> $ret)?,)*
        }

        impl Lib {
            /// SAFETY: `handle` must come from `dlopen` of libpipewire-0.3.
            unsafe fn resolve(handle: *mut c_void) -> Result<Lib, String> {
                Ok(Lib {
                    $($field: {
                        let address = unsafe { dlsym(handle, $symbol.as_ptr()) };
                        if address.is_null() {
                            return Err(format!("{} not found", $symbol.to_string_lossy()));
                        }
                        // SAFETY: the symbol is the libpipewire function with this C signature
                        // (see the header named in the table below).
                        unsafe {
                            std::mem::transmute::<
                                *mut c_void,
                                unsafe extern "C" fn($($arg),*) $(-> $ret)?,
                            >(address)
                        }
                    },)*
                })
            }
        }
    };
}

// Signatures from pipewire/pipewire.h, thread-loop.h, context.h, core.h, properties.h, stream.h.
library! {
    init = c"pw_init": fn(*mut c_int, *mut *mut *mut c_char);
    deinit = c"pw_deinit": fn();
    library_version = c"pw_get_library_version": fn() -> *const c_char;
    thread_loop_new = c"pw_thread_loop_new": fn(*const c_char, *const SpaDict) -> *mut c_void;
    thread_loop_destroy = c"pw_thread_loop_destroy": fn(*mut c_void);
    thread_loop_start = c"pw_thread_loop_start": fn(*mut c_void) -> c_int;
    thread_loop_stop = c"pw_thread_loop_stop": fn(*mut c_void);
    thread_loop_lock = c"pw_thread_loop_lock": fn(*mut c_void);
    thread_loop_unlock = c"pw_thread_loop_unlock": fn(*mut c_void);
    thread_loop_signal = c"pw_thread_loop_signal": fn(*mut c_void, bool);
    thread_loop_timed_wait = c"pw_thread_loop_timed_wait": fn(*mut c_void, c_int) -> c_int;
    thread_loop_get_loop = c"pw_thread_loop_get_loop": fn(*mut c_void) -> *mut c_void;
    context_new = c"pw_context_new": fn(*mut c_void, *mut c_void, usize) -> *mut c_void;
    context_destroy = c"pw_context_destroy": fn(*mut c_void);
    context_connect = c"pw_context_connect": fn(*mut c_void, *mut c_void, usize) -> *mut c_void;
    core_disconnect = c"pw_core_disconnect": fn(*mut c_void) -> c_int;
    properties_new_dict = c"pw_properties_new_dict": fn(*const SpaDict) -> *mut c_void;
    stream_new = c"pw_stream_new": fn(*mut c_void, *const c_char, *mut c_void) -> *mut c_void;
    stream_add_listener = c"pw_stream_add_listener":
        fn(*mut c_void, *mut SpaHook, *const StreamEvents, *mut c_void);
    stream_connect = c"pw_stream_connect":
        fn(*mut c_void, u32, u32, u32, *mut *const c_void, u32) -> c_int;
    stream_destroy = c"pw_stream_destroy": fn(*mut c_void);
    stream_dequeue_buffer = c"pw_stream_dequeue_buffer": fn(*mut c_void) -> *mut PwBuffer;
    stream_queue_buffer = c"pw_stream_queue_buffer": fn(*mut c_void, *mut PwBuffer) -> c_int;
    stream_set_active = c"pw_stream_set_active": fn(*mut c_void, bool) -> c_int;
    stream_flush = c"pw_stream_flush": fn(*mut c_void, bool) -> c_int;
}

struct Loaded {
    lib: Lib,
    /// `pw_buffer.requested` exists (PipeWire 0.3.49 or newer).
    has_requested: bool,
}

// Function pointers into a library that stays loaded for the life of the process.
unsafe impl Send for Loaded {}
unsafe impl Sync for Loaded {}

static LOADED: OnceLock<Loaded> = OnceLock::new();

fn load() -> Result<&'static Loaded, Error> {
    if let Some(loaded) = LOADED.get() {
        return Ok(loaded);
    }
    // SAFETY: plain dlopen with a valid NUL-terminated name.
    let handle = unsafe { dlopen(LIBRARY.as_ptr(), RTLD_NOW) };
    if handle.is_null() {
        return Err(Error::new(format!(
            "PipeWire is not available: {}. The Kalliope microphone needs PipeWire, the sound \
             server of current Linux desktops (packages pipewire and pipewire-pulse).",
            unsafe { dl_error() }
        )));
    }
    // SAFETY: the handle is libpipewire-0.3.
    let lib = unsafe { Lib::resolve(handle) }
        .map_err(|e| Error::new(format!("PipeWire is not usable: {e} (version too old?)")))?;
    // SAFETY: returns a static NUL-terminated string.
    let version = unsafe { CStr::from_ptr((lib.library_version)()) }.to_string_lossy();
    let has_requested = version_at_least(&version, (0, 3, 49));
    let _ = LOADED.set(Loaded { lib, has_requested });
    Ok(LOADED.get().expect("just set"))
}

unsafe fn dl_error() -> String {
    let e = unsafe { dlerror() };
    if e.is_null() {
        "unknown dlopen error".into()
    } else {
        unsafe { CStr::from_ptr(e) }.to_string_lossy().into_owned()
    }
}

/// Whether a "major.minor.micro" version string is at least `wanted`.
fn version_at_least(version: &str, wanted: (u32, u32, u32)) -> bool {
    let mut parts = version
        .split('.')
        .map(|p| p.trim().parse::<u32>().unwrap_or(0));
    let found = (
        parts.next().unwrap_or(0),
        parts.next().unwrap_or(0),
        parts.next().unwrap_or(0),
    );
    found >= wanted
}

fn lock<T>(mutex: &Mutex<T>) -> MutexGuard<'_, T> {
    mutex.lock().unwrap_or_else(PoisonError::into_inner)
}

/// One output stream and the samples waiting for it.
struct Channel {
    /// The `pw_stream`, or null. Changed only with the thread-loop lock held.
    stream: AtomicPtr<c_void>,
    /// Registered with PipeWire, which writes to it; never touched from Rust after that.
    hook: UnsafeCell<SpaHook>,
    queue: Queue,
    /// Last `pw_stream_state`.
    state: AtomicI32,
    /// Error text of the last transition to the error state.
    error: Mutex<String>,
    /// Monitor only: the stream is active (set with the thread-loop lock held).
    active: AtomicBool,
    /// Monitor only: a drain was requested and `drained` has not come yet.
    draining: AtomicBool,
}

impl Channel {
    fn new() -> Channel {
        Channel {
            stream: AtomicPtr::new(ptr::null_mut()),
            hook: UnsafeCell::new(SpaHook {
                _private: [ptr::null_mut(); 6],
            }),
            queue: Queue::default(),
            state: AtomicI32::new(STATE_UNCONNECTED),
            error: Mutex::new(String::new()),
            active: AtomicBool::new(false),
            draining: AtomicBool::new(false),
        }
    }

    fn queued(&self) -> usize {
        self.queue.queued()
    }

    fn clear(&self) {
        self.queue.clear();
    }
}

/// State shared with the callbacks; boxed so its address stays fixed.
struct Shared {
    lib: &'static Lib,
    has_requested: bool,
    thread_loop: *mut c_void,
    rate: u32,
    mic: Channel,
    monitor: Channel,
}

// The raw pointers are PipeWire objects used under the rules of its thread loop, and the hooks
// are only written by PipeWire; everything else is atomics and mutexes.
unsafe impl Send for Shared {}
unsafe impl Sync for Shared {}

pub struct Mic {
    lib: &'static Lib,
    initialized: bool,
    started: bool,
    context: *mut c_void,
    core: *mut c_void,
    name: CString,
    description: CString,
    format: AudioFormat,
    shared: Box<Shared>,
}

unsafe impl Send for Mic {}
unsafe impl Sync for Mic {}

/// Holds the thread-loop lock until dropped.
struct LoopLock<'a>(&'a Shared);

impl<'a> LoopLock<'a> {
    fn new(shared: &'a Shared) -> LoopLock<'a> {
        // SAFETY: the thread loop lives as long as `shared`'s owner; the lock is recursive.
        unsafe { (shared.lib.thread_loop_lock)(shared.thread_loop) };
        LoopLock(shared)
    }
}

impl Drop for LoopLock<'_> {
    fn drop(&mut self) {
        unsafe { (self.0.lib.thread_loop_unlock)(self.0.thread_loop) };
    }
}

impl Mic {
    pub fn open(name: &str, description: &str, rate: u32) -> Result<Mic, Error> {
        let loaded = load()?;
        let lib = &loaded.lib;
        let text = |s: &str| CString::new(s).map_err(|_| Error::new("name contains NUL"));
        let (name, description) = (text(name)?, text(description)?);
        // SAFETY: pw_init accepts null arguments and counts its callers; Drop calls pw_deinit.
        unsafe { (lib.init)(ptr::null_mut(), ptr::null_mut()) };
        let thread_loop = unsafe { (lib.thread_loop_new)(c"kalliope-mic".as_ptr(), ptr::null()) };
        let mut mic = Mic {
            lib,
            initialized: true,
            started: false,
            context: ptr::null_mut(),
            core: ptr::null_mut(),
            name,
            description,
            format: AudioFormat::f32_mono(rate),
            shared: Box::new(Shared {
                lib,
                has_requested: loaded.has_requested,
                thread_loop,
                rate,
                mic: Channel::new(),
                monitor: Channel::new(),
            }),
        };
        if thread_loop.is_null() {
            return Err(os_error("PipeWire could not create its thread"));
        }
        unsafe {
            mic.context =
                (lib.context_new)((lib.thread_loop_get_loop)(thread_loop), ptr::null_mut(), 0);
            if mic.context.is_null() {
                return Err(os_error("PipeWire could not start"));
            }
            if (lib.thread_loop_start)(thread_loop) < 0 {
                return Err(os_error("PipeWire could not start its thread"));
            }
        }
        mic.started = true;
        let shared = &*mic.shared;
        let guard = LoopLock::new(shared);
        mic.core = unsafe { (lib.context_connect)(mic.context, ptr::null_mut(), 0) };
        if mic.core.is_null() {
            return Err(Error::new(format!(
                "PipeWire is not running: could not connect to it ({}). Start it with \
                 `systemctl --user start pipewire pipewire-pulse wireplumber`.",
                std::io::Error::last_os_error()
            )));
        }
        let props = [
            (c"media.type", c"Audio"),
            (c"media.class", c"Audio/Source"),
            (c"node.name", mic.name.as_c_str()),
            (c"node.description", mic.description.as_c_str()),
            (c"media.name", mic.description.as_c_str()),
            (c"node.virtual", c"true"),
            (c"node.latency", LATENCY),
        ];
        // No AUTOCONNECT: a source is linked by the apps that record from it.
        mic.connect(
            &shared.mic,
            &props,
            &MIC_EVENTS,
            FLAG_MAP_BUFFERS | FLAG_RT_PROCESS,
        )?;
        let deadline = Instant::now() + OPEN_TIMEOUT;
        loop {
            match shared.mic.state.load(Ordering::Acquire) {
                STATE_ERROR => {
                    return Err(Error::new(format!(
                        "PipeWire refused the microphone: {}",
                        lock(&shared.mic.error)
                    )));
                }
                STATE_UNCONNECTED | STATE_CONNECTING => {}
                _ => break,
            }
            if Instant::now() >= deadline {
                return Err(Error::new("PipeWire did not answer within 5 seconds"));
            }
            // SAFETY: called with the lock held; releases it while waiting.
            unsafe { (lib.thread_loop_timed_wait)(shared.thread_loop, 1) };
        }
        drop(guard);
        Ok(mic)
    }

    /// Creates and connects a stream for `channel`. Called with the thread-loop lock held.
    fn connect(
        &self,
        channel: &Channel,
        props: &[(&CStr, &CStr)],
        events: &'static StreamEvents,
        flags: u32,
    ) -> Result<(), Error> {
        let lib = self.lib;
        let items: Vec<SpaDictItem> = props
            .iter()
            .map(|(k, v)| SpaDictItem {
                key: k.as_ptr(),
                value: v.as_ptr(),
            })
            .collect();
        let dict = SpaDict {
            flags: 0,
            n_items: items.len() as u32,
            items: items.as_ptr(),
        };
        unsafe {
            // pw_properties_new_dict copies the strings; pw_stream_new takes the properties.
            let properties = (lib.properties_new_dict)(&dict);
            if properties.is_null() {
                return Err(os_error("PipeWire could not create the stream properties"));
            }
            let stream = (lib.stream_new)(self.core, self.description.as_ptr(), properties);
            if stream.is_null() {
                return Err(os_error("PipeWire could not create the stream"));
            }
            channel.state.store(STATE_UNCONNECTED, Ordering::Release);
            let data = ptr::from_ref::<Shared>(&*self.shared).cast_mut().cast();
            (lib.stream_add_listener)(stream, channel.hook.get(), events, data);
            channel.stream.store(stream, Ordering::Release);
            let mut params = [self.format.as_ptr()];
            let res = (lib.stream_connect)(
                stream,
                DIRECTION_OUTPUT,
                ID_ANY,
                flags,
                params.as_mut_ptr(),
                1,
            );
            if res < 0 {
                channel.stream.store(ptr::null_mut(), Ordering::Release);
                (lib.stream_destroy)(stream);
                return Err(Error::new(format!(
                    "PipeWire could not connect the stream: {}",
                    std::io::Error::from_raw_os_error(-res)
                )));
            }
        }
        Ok(())
    }

    pub fn play(&self, samples: &[f32]) {
        let shared = &*self.shared;
        if shared.mic.state.load(Ordering::Acquire) == STATE_STREAMING {
            shared.mic.queue.push(samples);
        }
        let monitor = &shared.monitor;
        if monitor.stream.load(Ordering::Acquire).is_null()
            || monitor.state.load(Ordering::Acquire) == STATE_ERROR
        {
            return;
        }
        monitor.queue.push(samples);
        // Wake the monitor up, or cancel a drain in progress. The thread-loop lock orders this
        // against `on_monitor_drained`, which may be about to deactivate the stream.
        let _guard = LoopLock::new(shared);
        let stream = monitor.stream.load(Ordering::Acquire);
        if !stream.is_null()
            && (!monitor.active.load(Ordering::Acquire) || monitor.draining.load(Ordering::Acquire))
        {
            monitor.draining.store(false, Ordering::Release);
            monitor.active.store(true, Ordering::Release);
            // SAFETY: a live stream, with the thread-loop lock held.
            unsafe { (shared.lib.stream_set_active)(stream, true) };
        }
    }

    pub fn clear(&self) {
        self.shared.mic.clear();
        self.shared.monitor.clear();
    }

    pub fn queued_seconds(&self) -> f32 {
        let shared = &*self.shared;
        let samples = shared.mic.queued().max(shared.monitor.queued());
        samples as f32 / shared.rate as f32
    }

    pub fn in_use(&self) -> bool {
        self.shared.mic.state.load(Ordering::Acquire) == STATE_STREAMING
    }

    pub fn is_connected(&self) -> bool {
        matches!(
            self.shared.mic.state.load(Ordering::Acquire),
            STATE_PAUSED | STATE_STREAMING
        )
    }

    pub fn sample_rate(&self) -> u32 {
        self.shared.rate
    }

    pub fn set_monitor(&self, on: bool) -> Result<(), Error> {
        let shared = &*self.shared;
        let monitor = &shared.monitor;
        let _guard = LoopLock::new(shared);
        let stream = monitor.stream.load(Ordering::Acquire);
        if on == !stream.is_null() {
            return Ok(());
        }
        if on {
            let name = CString::new(format!("{}-monitor", self.name.to_string_lossy()))
                .map_err(|_| Error::new("name contains NUL"))?;
            let props = [
                (c"media.type", c"Audio"),
                (c"media.category", c"Playback"),
                (c"media.class", c"Stream/Output/Audio"),
                (c"node.name", name.as_c_str()),
                (c"media.name", self.description.as_c_str()),
                (c"node.latency", LATENCY),
            ];
            monitor.active.store(false, Ordering::Release);
            monitor.draining.store(false, Ordering::Release);
            // Starts inactive: the stream only runs while it has audio, so the speakers can
            // suspend in between.
            self.connect(
                monitor,
                &props,
                &MONITOR_EVENTS,
                FLAG_AUTOCONNECT | FLAG_MAP_BUFFERS | FLAG_RT_PROCESS | FLAG_INACTIVE,
            )
        } else {
            monitor.stream.store(ptr::null_mut(), Ordering::Release);
            // SAFETY: a live stream, with the thread-loop lock held.
            unsafe { (shared.lib.stream_destroy)(stream) };
            monitor.state.store(STATE_UNCONNECTED, Ordering::Release);
            monitor.active.store(false, Ordering::Release);
            monitor.clear();
            Ok(())
        }
    }
}

impl Drop for Mic {
    fn drop(&mut self) {
        let lib = self.lib;
        let thread_loop = self.shared.thread_loop;
        unsafe {
            if !thread_loop.is_null() {
                let guard = LoopLock::new(&self.shared);
                for channel in [&self.shared.mic, &self.shared.monitor] {
                    let stream = channel.stream.swap(ptr::null_mut(), Ordering::AcqRel);
                    if !stream.is_null() {
                        (lib.stream_destroy)(stream);
                    }
                }
                if !self.core.is_null() {
                    (lib.core_disconnect)(self.core);
                }
                drop(guard);
                if self.started {
                    (lib.thread_loop_stop)(thread_loop);
                }
            }
            if !self.context.is_null() {
                (lib.context_destroy)(self.context);
            }
            if !thread_loop.is_null() {
                (lib.thread_loop_destroy)(thread_loop);
            }
            if self.initialized {
                (lib.deinit)();
            }
        }
    }
}

fn os_error(what: &str) -> Error {
    Error::new(format!("{what}: {}", std::io::Error::last_os_error()))
}

/// SAFETY (all callbacks): `data` is the `Shared` registered with the listener; it outlives the
/// streams, which are destroyed before it is freed. `process` runs in the realtime data thread;
/// the other callbacks run in the thread loop with its lock held.
unsafe fn shared<'a>(data: *mut c_void) -> &'a Shared {
    unsafe { &*data.cast::<Shared>() }
}

fn record_state(shared: &Shared, channel: &Channel, state: c_int, error: *const c_char) {
    if state == STATE_ERROR && !error.is_null() {
        // SAFETY: PipeWire passes a NUL-terminated message.
        *lock(&channel.error) = unsafe { CStr::from_ptr(error) }
            .to_string_lossy()
            .into_owned();
    }
    channel.state.store(state, Ordering::Release);
    // Wakes `open`, which waits for the first state change.
    unsafe { (shared.lib.thread_loop_signal)(shared.thread_loop, false) };
}

unsafe extern "C" fn on_mic_state(
    data: *mut c_void,
    old: c_int,
    state: c_int,
    error: *const c_char,
) {
    let shared = unsafe { shared(data) };
    if state == STATE_STREAMING {
        // Drop anything a `play` racing with the last pause left behind, before `play` can see
        // the new state.
        shared.mic.clear();
    }
    record_state(shared, &shared.mic, state, error);
    if state != STATE_STREAMING {
        // Nobody records any more: like a real microphone, forget what was not heard, including
        // the few milliseconds held by the stream's converter, which would otherwise open the
        // next recording.
        shared.mic.clear();
        let stream = shared.mic.stream.load(Ordering::Acquire);
        if old == STATE_STREAMING && !stream.is_null() {
            unsafe { (shared.lib.stream_flush)(stream, false) };
        }
    }
}

unsafe extern "C" fn on_monitor_state(
    data: *mut c_void,
    _old: c_int,
    state: c_int,
    error: *const c_char,
) {
    let shared = unsafe { shared(data) };
    record_state(shared, &shared.monitor, state, error);
    if state == STATE_ERROR {
        shared.monitor.clear();
    }
}

unsafe extern "C" fn on_mic_process(data: *mut c_void) {
    let shared = unsafe { shared(data) };
    unsafe { fill(shared, &shared.mic) };
}

unsafe extern "C" fn on_monitor_process(data: *mut c_void) {
    let shared = unsafe { shared(data) };
    let monitor = &shared.monitor;
    let had_audio = unsafe { fill(shared, monitor) };
    if !had_audio && !monitor.draining.swap(true, Ordering::AcqRel) {
        // Out of audio: let the queued buffers play out, then `on_monitor_drained` pauses the
        // stream so the speakers can suspend.
        let stream = monitor.stream.load(Ordering::Acquire);
        if !stream.is_null() {
            unsafe { (shared.lib.stream_flush)(stream, true) };
        }
    }
}

unsafe extern "C" fn on_monitor_drained(data: *mut c_void) {
    let shared = unsafe { shared(data) };
    let monitor = &shared.monitor;
    let stream = monitor.stream.load(Ordering::Acquire);
    if stream.is_null() || !monitor.draining.swap(false, Ordering::AcqRel) {
        return;
    }
    // Activating again also ends the drain, so new audio plays at once.
    let more = monitor.queued() > 0;
    monitor.active.store(more, Ordering::Release);
    unsafe { (shared.lib.stream_set_active)(stream, more) };
}

/// Fills one buffer of `channel`'s stream from its queue, with silence after the queued audio.
/// Returns whether any queued audio went into the buffer.
///
/// Realtime safe: no locks, allocations or system calls besides PipeWire's own RT-safe calls.
///
/// SAFETY: called from a process callback of the channel's stream.
unsafe fn fill(shared: &Shared, channel: &Channel) -> bool {
    let lib = shared.lib;
    let stream = channel.stream.load(Ordering::Acquire);
    if stream.is_null() {
        return false;
    }
    unsafe {
        let buffer = (lib.stream_dequeue_buffer)(stream);
        if buffer.is_null() {
            // Every buffer is in flight; PipeWire calls again when one comes back.
            return true;
        }
        let spa = (*buffer).buffer;
        let mut copied = 0;
        if !spa.is_null() && (*spa).n_datas > 0 && !(*spa).datas.is_null() {
            let data = &mut *(*spa).datas;
            if !data.data.is_null() && !data.chunk.is_null() && data.data.addr() % STRIDE == 0 {
                let capacity = data.maxsize as usize / STRIDE;
                let wanted = if shared.has_requested && (*buffer).requested > 0 {
                    (*buffer).requested as usize
                } else {
                    shared.rate as usize / 50
                };
                let frames = wanted.min(capacity);
                // SAFETY: the mapped buffer holds `maxsize` bytes and is f32-aligned.
                let out = std::slice::from_raw_parts_mut(data.data.cast::<f32>(), frames);
                copied = channel.queue.take(out);
                let chunk = &mut *data.chunk;
                chunk.offset = 0;
                chunk.size = (frames * STRIDE) as u32;
                chunk.stride = STRIDE as i32;
            }
        }
        (lib.stream_queue_buffer)(stream, buffer);
        copied > 0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn compares_versions() {
        assert!(version_at_least("1.6.11", (0, 3, 49)));
        assert!(version_at_least("0.3.49", (0, 3, 49)));
        assert!(!version_at_least("0.3.48", (0, 3, 49)));
        assert!(!version_at_least("garbage", (0, 3, 49)));
    }
}
