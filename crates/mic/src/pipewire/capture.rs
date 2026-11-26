// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Recording from a real microphone through the same run-time binding: the list of sound inputs
//! (from the PipeWire registry and the session manager's `default` metadata) and a capture stream.
//!
//! The registry, core and metadata calls are methods of `spa_interface` objects in libpipewire's
//! ABI: the static inline functions of `pipewire/core.h` and `extensions/metadata.h` call them
//! through the object's method table, and so does this module, which works with every
//! libpipewire-0.3 (some versions also export those functions as symbols, older ones do not).
//! Layouts checked against PipeWire 1.4.2's headers (`spa/utils/hook.h`, `pipewire/core.h`,
//! `pipewire/extensions/metadata.h`).
//!
//! Kalliope's own microphone carries [`OWN_MARK`] and is never listed nor recorded from, and the
//! capture stream never moves to another input when its own goes away (`node.dont-reconnect`).

use super::{
    DIRECTION_OUTPUT, EVENTS, FLAG_AUTOCONNECT, FLAG_MAP_BUFFERS, FLAG_RT_PROCESS, ID_ANY, LATENCY,
    Lib, PwBuffer, STATE_ERROR, STATE_STREAMING, STATE_UNCONNECTED, SpaDict, SpaDictItem, SpaHook,
    StreamEvents, load, lock, os_error,
};
use crate::pod::AudioFormat;
use crate::{Error, ErrorKind, Source};
use std::cell::UnsafeCell;
use std::ffi::{CStr, CString, c_char, c_int, c_void};
use std::ptr;
use std::sync::Mutex;
use std::sync::atomic::{AtomicI32, AtomicPtr, AtomicU32, AtomicU64, AtomicUsize, Ordering};
use std::time::{Duration, Instant};

/// The property that marks Kalliope's own microphone.
pub(crate) const OWN_MARK: &CStr = c"kalliope.microphone";
/// Kalliope's microphone as older versions named it, without the mark.
const OWN_NAME: &str = "kalliope";
/// The rate recordings are made at; PipeWire converts from the microphone's own.
pub(crate) const RATE: u32 = crate::Recorder::RATE;
/// How long to wait for PipeWire to answer.
const TIMEOUT: Duration = Duration::from_secs(5);
/// Captured audio held until the app reads it: 4 s, read every 50 ms.
const RING: usize = 4 * RATE as usize;
// spa/utils/defs.h: SPA_DIRECTION_INPUT.
const DIRECTION_INPUT: u32 = 0;
const _: () = assert!(DIRECTION_OUTPUT == 1);
// pipewire/core.h, extensions/metadata.h: interface versions.
const VERSION_REGISTRY: u32 = 3;
const VERSION_METADATA: u32 = 3;
// pipewire/core.h: PW_ID_CORE.
const ID_CORE: u32 = 0;

/// `struct spa_callbacks` (spa/utils/hook.h).
#[repr(C)]
struct SpaCallbacks {
    funcs: *const c_void,
    data: *mut c_void,
}

/// `struct spa_interface` (spa/utils/hook.h): first member of `pw_core`, `pw_registry` and
/// `pw_metadata` proxies.
#[repr(C)]
struct SpaInterface {
    kind: *const c_char,
    version: u32,
    cb: SpaCallbacks,
}

/// `struct pw_core_events` (pipewire/core.h), version 0.
#[repr(C)]
struct CoreEvents {
    version: u32,
    info: Option<unsafe extern "C" fn(*mut c_void, *const c_void)>,
    done: Option<unsafe extern "C" fn(*mut c_void, u32, c_int)>,
    ping: Option<unsafe extern "C" fn(*mut c_void, u32, c_int)>,
    error: Option<unsafe extern "C" fn(*mut c_void, u32, c_int, c_int, *const c_char)>,
    remove_id: Option<unsafe extern "C" fn(*mut c_void, u32)>,
    bound_id: Option<unsafe extern "C" fn(*mut c_void, u32, u32)>,
    add_mem: Option<unsafe extern "C" fn(*mut c_void, u32, u32, c_int, u32)>,
    remove_mem: Option<unsafe extern "C" fn(*mut c_void, u32)>,
}

/// `struct pw_core_methods` (pipewire/core.h), version 0, up to `get_registry`.
#[repr(C)]
struct CoreMethods {
    version: u32,
    add_listener: Option<
        unsafe extern "C" fn(*mut c_void, *mut SpaHook, *const CoreEvents, *mut c_void) -> c_int,
    >,
    hello: Option<unsafe extern "C" fn(*mut c_void, u32) -> c_int>,
    sync: Option<unsafe extern "C" fn(*mut c_void, u32, c_int) -> c_int>,
    pong: Option<unsafe extern "C" fn(*mut c_void, u32, c_int) -> c_int>,
    error: Option<unsafe extern "C" fn(*mut c_void, u32, c_int, c_int, *const c_char) -> c_int>,
    get_registry: Option<unsafe extern "C" fn(*mut c_void, u32, usize) -> *mut c_void>,
}

/// `struct pw_registry_events` (pipewire/core.h), version 0.
#[repr(C)]
struct RegistryEvents {
    version: u32,
    global: Option<unsafe extern "C" fn(*mut c_void, u32, u32, *const c_char, u32, *const SpaDict)>,
    global_remove: Option<unsafe extern "C" fn(*mut c_void, u32)>,
}

/// `struct pw_registry_methods` (pipewire/core.h), version 0.
#[repr(C)]
struct RegistryMethods {
    version: u32,
    add_listener: Option<
        unsafe extern "C" fn(
            *mut c_void,
            *mut SpaHook,
            *const RegistryEvents,
            *mut c_void,
        ) -> c_int,
    >,
    bind: Option<unsafe extern "C" fn(*mut c_void, u32, *const c_char, u32, usize) -> *mut c_void>,
}

/// `struct pw_metadata_events` (pipewire/extensions/metadata.h), version 0.
#[repr(C)]
struct MetadataEvents {
    version: u32,
    property: Option<
        unsafe extern "C" fn(
            *mut c_void,
            u32,
            *const c_char,
            *const c_char,
            *const c_char,
        ) -> c_int,
    >,
}

/// `struct pw_metadata_methods` (pipewire/extensions/metadata.h), version 0, up to
/// `add_listener`.
#[repr(C)]
struct MetadataMethods {
    version: u32,
    add_listener: Option<
        unsafe extern "C" fn(
            *mut c_void,
            *mut SpaHook,
            *const MetadataEvents,
            *mut c_void,
        ) -> c_int,
    >,
}

#[cfg(target_pointer_width = "64")]
const _: () = {
    assert!(size_of::<SpaInterface>() == 32);
    assert!(size_of::<CoreEvents>() == 72);
    assert!(std::mem::offset_of!(CoreMethods, get_registry) == 48);
    assert!(std::mem::offset_of!(RegistryMethods, bind) == 16);
};

static CORE_EVENTS: CoreEvents = CoreEvents {
    version: 0,
    info: None,
    done: Some(on_done),
    ping: None,
    error: None,
    remove_id: None,
    bound_id: None,
    add_mem: None,
    remove_mem: None,
};

static REGISTRY_EVENTS: RegistryEvents = RegistryEvents {
    version: 0,
    global: Some(on_global),
    global_remove: None,
};

static METADATA_EVENTS: MetadataEvents = MetadataEvents {
    version: 0,
    property: Some(on_property),
};

static RECORDER_EVENTS: StreamEvents = StreamEvents {
    state_changed: Some(on_recorder_state),
    process: Some(on_recorder_process),
    ..EVENTS
};

/// The method table and object of a PipeWire interface.
///
/// SAFETY: `object` is a live proxy whose interface has methods of type `T`.
unsafe fn methods<'a, T>(object: *mut c_void) -> (&'a T, *mut c_void) {
    let iface = unsafe { &*object.cast::<SpaInterface>() };
    (unsafe { &*iface.cb.funcs.cast::<T>() }, iface.cb.data)
}

/// The value of `key` in a PipeWire dictionary.
///
/// SAFETY: `dict` is null or a valid `spa_dict` for the duration of the call.
unsafe fn lookup(dict: *const SpaDict, key: &str) -> Option<String> {
    if dict.is_null() {
        return None;
    }
    let dict = unsafe { &*dict };
    (0..dict.n_items as usize).find_map(|i| {
        let item = unsafe { &*dict.items.add(i) };
        if item.key.is_null() || item.value.is_null() {
            return None;
        }
        let k = unsafe { CStr::from_ptr(item.key) };
        (k.to_bytes() == key.as_bytes()).then(|| {
            unsafe { CStr::from_ptr(item.value) }
                .to_string_lossy()
                .into_owned()
        })
    })
}

/// A connection to PipeWire with its own thread loop.
struct Connection {
    lib: &'static Lib,
    thread_loop: *mut c_void,
    context: *mut c_void,
    core: *mut c_void,
    started: bool,
}

unsafe impl Send for Connection {}
unsafe impl Sync for Connection {}

/// Holds the thread-loop lock until dropped.
struct Locked<'a>(&'a Connection);

impl Drop for Locked<'_> {
    fn drop(&mut self) {
        unsafe { (self.0.lib.thread_loop_unlock)(self.0.thread_loop) };
    }
}

impl Connection {
    fn open(name: &CStr) -> Result<Connection, Error> {
        let lib = &load()?.lib;
        // SAFETY: pw_init accepts null arguments and counts its callers; Drop calls pw_deinit.
        unsafe { (lib.init)(ptr::null_mut(), ptr::null_mut()) };
        let mut c = Connection {
            lib,
            thread_loop: unsafe { (lib.thread_loop_new)(name.as_ptr(), ptr::null()) },
            context: ptr::null_mut(),
            core: ptr::null_mut(),
            started: false,
        };
        if c.thread_loop.is_null() {
            return Err(os_error("PipeWire could not create its thread"));
        }
        unsafe {
            c.context = (lib.context_new)(
                (lib.thread_loop_get_loop)(c.thread_loop),
                ptr::null_mut(),
                0,
            );
            if c.context.is_null() {
                return Err(os_error("PipeWire could not start"));
            }
            if (lib.thread_loop_start)(c.thread_loop) < 0 {
                return Err(os_error("PipeWire could not start its thread"));
            }
        }
        c.started = true;
        let guard = c.lock();
        let core = unsafe { (lib.context_connect)(c.context, ptr::null_mut(), 0) };
        drop(guard);
        if core.is_null() {
            return Err(Error::with_kind(
                ErrorKind::NotRunning,
                format!(
                    "PipeWire is not running: could not connect to it ({})",
                    std::io::Error::last_os_error()
                ),
            ));
        }
        c.core = core;
        Ok(c)
    }

    fn lock(&self) -> Locked<'_> {
        unsafe { (self.lib.thread_loop_lock)(self.thread_loop) };
        Locked(self)
    }

    /// Waits up to a second for a signal from the loop. Called with the lock held.
    fn wait(&self) {
        unsafe { (self.lib.thread_loop_timed_wait)(self.thread_loop, 1) };
    }
}

impl Drop for Connection {
    fn drop(&mut self) {
        let lib = self.lib;
        unsafe {
            if !self.core.is_null() {
                let guard = self.lock();
                (lib.core_disconnect)(self.core);
                drop(guard);
            }
            if self.started {
                (lib.thread_loop_stop)(self.thread_loop);
            }
            if !self.context.is_null() {
                (lib.context_destroy)(self.context);
            }
            if !self.thread_loop.is_null() {
                (lib.thread_loop_destroy)(self.thread_loop);
                (lib.deinit)();
            }
        }
    }
}

/// A node seen in the registry.
struct Node {
    id: u32,
    name: String,
    description: String,
    priority: i64,
}

/// What the listing callbacks collect; they run in the thread loop with its lock held.
struct Listing {
    lib: &'static Lib,
    thread_loop: *mut c_void,
    registry: AtomicPtr<c_void>,
    metadata: AtomicPtr<c_void>,
    core_hook: UnsafeCell<SpaHook>,
    registry_hook: UnsafeCell<SpaHook>,
    metadata_hook: UnsafeCell<SpaHook>,
    done: AtomicI32,
    found: Mutex<(Vec<Node>, Option<String>)>,
}

fn hook() -> UnsafeCell<SpaHook> {
    UnsafeCell::new(SpaHook {
        _private: [ptr::null_mut(); 6],
    })
}

/// The sound inputs a person can record from, Kalliope's own microphone excluded; the default
/// one first.
pub fn sources() -> Result<Vec<Source>, Error> {
    let conn = Connection::open(c"kalliope-sources")?;
    let lib = conn.lib;
    let listing = Box::new(Listing {
        lib,
        thread_loop: conn.thread_loop,
        registry: AtomicPtr::new(ptr::null_mut()),
        metadata: AtomicPtr::new(ptr::null_mut()),
        core_hook: hook(),
        registry_hook: hook(),
        metadata_hook: hook(),
        done: AtomicI32::new(-1),
        found: Mutex::new((Vec::new(), None)),
    });
    let data = ptr::from_ref::<Listing>(&listing)
        .cast_mut()
        .cast::<c_void>();
    let guard = conn.lock();
    let result = (|| unsafe {
        let (core, object) = methods::<CoreMethods>(conn.core);
        let (Some(add), Some(sync), Some(get_registry)) =
            (core.add_listener, core.sync, core.get_registry)
        else {
            return Err(Error::new("PipeWire's core has no registry"));
        };
        add(object, listing.core_hook.get(), &CORE_EVENTS, data);
        let registry = get_registry(object, VERSION_REGISTRY, 0);
        if registry.is_null() {
            return Err(Error::new("PipeWire gave no registry"));
        }
        listing.registry.store(registry, Ordering::Release);
        let (reg, reg_object) = methods::<RegistryMethods>(registry);
        let Some(listen) = reg.add_listener else {
            return Err(Error::new("PipeWire's registry cannot be read"));
        };
        listen(
            reg_object,
            listing.registry_hook.get(),
            &REGISTRY_EVENTS,
            data,
        );
        // Two round trips: the globals, then the properties of the metadata bound meanwhile.
        for round in 0..2 {
            let seq = sync(object, ID_CORE, round);
            let deadline = Instant::now() + TIMEOUT;
            while listing.done.load(Ordering::Acquire) < seq {
                if Instant::now() >= deadline {
                    return Err(Error::with_kind(
                        ErrorKind::NotRunning,
                        "PipeWire did not answer within 5 seconds",
                    ));
                }
                conn.wait();
            }
        }
        Ok(())
    })();
    for proxy in [&listing.metadata, &listing.registry] {
        let p = proxy.swap(ptr::null_mut(), Ordering::AcqRel);
        if !p.is_null() {
            unsafe { (lib.proxy_destroy)(p) };
        }
    }
    drop(guard);
    drop(conn);
    result?;
    let (nodes, default) = std::mem::take(&mut *lock(&listing.found));
    Ok(order(nodes, default.as_deref()))
}

/// Sources in the order to offer them: the default first, then by the session manager's
/// priority; [`Source::default`] marks the one recorded from when none is chosen.
fn order(mut nodes: Vec<Node>, default: Option<&str>) -> Vec<Source> {
    nodes.sort_by(|a, b| {
        let d = |n: &Node| Some(n.name.as_str()) == default;
        d(b).cmp(&d(a))
            .then(b.priority.cmp(&a.priority))
            .then(a.id.cmp(&b.id))
    });
    nodes
        .into_iter()
        .enumerate()
        .map(|(i, n)| Source {
            name: n.name,
            description: n.description,
            default: i == 0,
        })
        .collect()
}

unsafe extern "C" fn on_done(data: *mut c_void, id: u32, seq: c_int) {
    let listing = unsafe { &*data.cast::<Listing>() };
    if id == ID_CORE {
        listing.done.store(seq, Ordering::Release);
        unsafe { (listing.lib.thread_loop_signal)(listing.thread_loop, false) };
    }
}

unsafe extern "C" fn on_global(
    data: *mut c_void,
    id: u32,
    _permissions: u32,
    kind: *const c_char,
    _version: u32,
    props: *const SpaDict,
) {
    let listing = unsafe { &*data.cast::<Listing>() };
    if kind.is_null() {
        return;
    }
    let kind = unsafe { CStr::from_ptr(kind) }.to_bytes();
    if kind == b"PipeWire:Interface:Node" {
        let class = unsafe { lookup(props, "media.class") }.unwrap_or_default();
        let name = unsafe { lookup(props, "node.name") }.unwrap_or_default();
        let own = unsafe { lookup(props, "kalliope.microphone") }.is_some() || name == OWN_NAME;
        if !matches!(
            class.as_str(),
            "Audio/Source" | "Audio/Source/Virtual" | "Audio/Duplex"
        ) || own
            || name.is_empty()
        {
            return;
        }
        let description = unsafe { lookup(props, "node.description") }
            .or_else(|| unsafe { lookup(props, "node.nick") })
            .unwrap_or_else(|| name.clone());
        let priority = unsafe { lookup(props, "priority.session") }
            .and_then(|p| p.parse().ok())
            .unwrap_or(0);
        lock(&listing.found).0.push(Node {
            id,
            name,
            description,
            priority,
        });
    } else if kind == b"PipeWire:Interface:Metadata"
        && unsafe { lookup(props, "metadata.name") }.as_deref() == Some("default")
        && listing.metadata.load(Ordering::Acquire).is_null()
    {
        let registry = listing.registry.load(Ordering::Acquire);
        unsafe {
            let (reg, object) = methods::<RegistryMethods>(registry);
            let Some(bind) = reg.bind else { return };
            let metadata = bind(
                object,
                id,
                c"PipeWire:Interface:Metadata".as_ptr(),
                VERSION_METADATA,
                0,
            );
            if metadata.is_null() {
                return;
            }
            listing.metadata.store(metadata, Ordering::Release);
            let (meta, meta_object) = methods::<MetadataMethods>(metadata);
            if let Some(listen) = meta.add_listener {
                listen(
                    meta_object,
                    listing.metadata_hook.get(),
                    &METADATA_EVENTS,
                    data,
                );
            }
        }
    }
}

unsafe extern "C" fn on_property(
    data: *mut c_void,
    subject: u32,
    key: *const c_char,
    _kind: *const c_char,
    value: *const c_char,
) -> c_int {
    let listing = unsafe { &*data.cast::<Listing>() };
    if subject != ID_CORE || key.is_null() || value.is_null() {
        return 0;
    }
    if unsafe { CStr::from_ptr(key) }.to_bytes() == b"default.audio.source" {
        let value = unsafe { CStr::from_ptr(value) }.to_string_lossy();
        lock(&listing.found).1 = json_name(&value);
    }
    0
}

/// The `name` of a metadata value such as `{ "name": "alsa_input.usb-…" }`.
fn json_name(value: &str) -> Option<String> {
    let rest = &value[value.find("\"name\"")? + 6..];
    let rest = rest
        .trim_start()
        .strip_prefix(':')?
        .trim_start()
        .strip_prefix('"')?;
    let mut out = String::new();
    let mut chars = rest.chars();
    while let Some(c) = chars.next() {
        match c {
            '"' => return Some(out),
            '\\' => out.push(chars.next()?),
            c => out.push(c),
        }
    }
    None
}

/// Captured samples between PipeWire's realtime thread (the only writer) and the app (the only
/// reader): no lock, no allocation; what does not fit while the app stops reading for 4 s is lost.
struct Ring {
    samples: Box<[AtomicU32]>,
    /// Samples written and read since the start; the difference is what waits.
    written: AtomicUsize,
    read: AtomicUsize,
}

impl Ring {
    fn new(capacity: usize) -> Ring {
        Ring {
            samples: (0..capacity).map(|_| AtomicU32::new(0)).collect(),
            written: AtomicUsize::new(0),
            read: AtomicUsize::new(0),
        }
    }

    /// Realtime side.
    fn push(&self, input: &[f32]) {
        let w = self.written.load(Ordering::Relaxed);
        let r = self.read.load(Ordering::Acquire);
        let room = self.samples.len() - (w - r);
        let n = input.len().min(room);
        for (i, s) in input[..n].iter().enumerate() {
            self.samples[(w + i) % self.samples.len()].store(s.to_bits(), Ordering::Relaxed);
        }
        self.written.store(w + n, Ordering::Release);
    }

    /// App side: appends what waits to `out`.
    fn drain(&self, out: &mut Vec<f32>) -> usize {
        let r = self.read.load(Ordering::Relaxed);
        let w = self.written.load(Ordering::Acquire);
        out.extend(
            (r..w).map(|i| {
                f32::from_bits(self.samples[i % self.samples.len()].load(Ordering::Relaxed))
            }),
        );
        self.read.store(w, Ordering::Release);
        w - r
    }
}

/// State shared with the capture callbacks; boxed so its address stays fixed.
struct Capture {
    lib: &'static Lib,
    thread_loop: *mut c_void,
    stream: AtomicPtr<c_void>,
    hook: UnsafeCell<SpaHook>,
    state: AtomicI32,
    error: Mutex<String>,
    ring: Ring,
    /// Process cycles that brought audio: the app sees the source go away when they stop.
    cycles: AtomicU64,
}

unsafe impl Send for Capture {}
unsafe impl Sync for Capture {}

/// A capture stream from one source.
pub struct Recorder {
    conn: Connection,
    capture: Box<Capture>,
    source: Source,
    /// When the app last saw new audio, and the cycle count then.
    seen: Mutex<(Instant, u64)>,
    _format: AudioFormat,
}

impl Recorder {
    /// Records from the source named `name`, or from the default one; never from Kalliope's own
    /// microphone.
    pub fn open(name: Option<&str>) -> Result<Recorder, Error> {
        let sources = sources()?;
        let source = match name {
            Some(name) => sources
                .into_iter()
                .find(|s| s.name == name)
                .ok_or_else(|| {
                    Error::with_kind(
                        ErrorKind::NoSource,
                        format!("no sound input named {name:?}"),
                    )
                })?,
            None => sources.into_iter().next().ok_or_else(|| {
                Error::with_kind(
                    ErrorKind::NoSource,
                    "no microphone: no sound input besides Kalliope's own",
                )
            })?,
        };
        let conn = Connection::open(c"kalliope-recorder")?;
        let lib = conn.lib;
        let capture = Box::new(Capture {
            lib,
            thread_loop: conn.thread_loop,
            stream: AtomicPtr::new(ptr::null_mut()),
            hook: hook(),
            state: AtomicI32::new(STATE_UNCONNECTED),
            error: Mutex::new(String::new()),
            ring: Ring::new(RING),
            cycles: AtomicU64::new(0),
        });
        let format = AudioFormat::f32_mono(RATE);
        let target =
            CString::new(source.name.as_str()).map_err(|_| Error::new("name contains NUL"))?;
        let props = [
            (c"media.type", c"Audio"),
            (c"media.category", c"Capture"),
            (c"node.name", c"kalliope-recorder"),
            (c"node.description", c"Kalliope"),
            (c"media.name", c"Kalliope voice recording"),
            (c"target.object", target.as_c_str()),
            (c"node.dont-reconnect", c"true"),
            (c"node.latency", LATENCY),
        ];
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
        let guard = conn.lock();
        unsafe {
            let properties = (lib.properties_new_dict)(&dict);
            if properties.is_null() {
                return Err(os_error("PipeWire could not create the stream properties"));
            }
            let stream = (lib.stream_new)(conn.core, c"Kalliope".as_ptr(), properties);
            if stream.is_null() {
                return Err(os_error("PipeWire could not create the stream"));
            }
            let data = ptr::from_ref::<Capture>(&capture).cast_mut().cast();
            (lib.stream_add_listener)(stream, capture.hook.get(), &RECORDER_EVENTS, data);
            capture.stream.store(stream, Ordering::Release);
            let mut params = [format.as_ptr()];
            let res = (lib.stream_connect)(
                stream,
                DIRECTION_INPUT,
                ID_ANY,
                FLAG_AUTOCONNECT | FLAG_MAP_BUFFERS | FLAG_RT_PROCESS,
                params.as_mut_ptr(),
                1,
            );
            if res < 0 {
                capture.stream.store(ptr::null_mut(), Ordering::Release);
                (lib.stream_destroy)(stream);
                return Err(Error::new(format!(
                    "PipeWire could not connect the recording: {}",
                    std::io::Error::from_raw_os_error(-res)
                )));
            }
        }
        let deadline = Instant::now() + TIMEOUT;
        loop {
            match capture.state.load(Ordering::Acquire) {
                STATE_ERROR => {
                    let e = lock(&capture.error).clone();
                    drop(guard);
                    let recorder = Recorder::new(conn, capture, source, format);
                    drop(recorder);
                    return Err(Error::new(format!("PipeWire refused the recording: {e}")));
                }
                STATE_STREAMING => break,
                _ => {}
            }
            if Instant::now() >= deadline {
                drop(guard);
                drop(Recorder::new(conn, capture, source, format));
                return Err(Error::with_kind(
                    ErrorKind::NotRunning,
                    "the microphone did not start within 5 seconds",
                ));
            }
            conn.wait();
        }
        drop(guard);
        Ok(Recorder::new(conn, capture, source, format))
    }

    fn new(
        conn: Connection,
        capture: Box<Capture>,
        source: Source,
        format: AudioFormat,
    ) -> Recorder {
        Recorder {
            conn,
            capture,
            source,
            seen: Mutex::new((Instant::now(), 0)),
            _format: format,
        }
    }

    pub fn source(&self) -> &Source {
        &self.source
    }

    /// Appends the audio captured since the last call; returns how many samples came.
    pub fn read(&self, out: &mut Vec<f32>) -> usize {
        self.capture.ring.drain(out)
    }

    /// False once the source went away (unplugged, or PipeWire stopped): nothing has come for a
    /// second and a half, or the stream failed.
    pub fn is_connected(&self) -> bool {
        let state = self.capture.state.load(Ordering::Acquire);
        if state == STATE_ERROR || state == STATE_UNCONNECTED {
            return false;
        }
        let cycles = self.capture.cycles.load(Ordering::Acquire);
        let mut seen = lock(&self.seen);
        if cycles != seen.1 {
            *seen = (Instant::now(), cycles);
            return true;
        }
        seen.0.elapsed() < Duration::from_millis(1500)
    }
}

impl Drop for Recorder {
    fn drop(&mut self) {
        let guard = self.conn.lock();
        let stream = self.capture.stream.swap(ptr::null_mut(), Ordering::AcqRel);
        if !stream.is_null() {
            unsafe { (self.conn.lib.stream_destroy)(stream) };
        }
        drop(guard);
    }
}

unsafe extern "C" fn on_recorder_state(
    data: *mut c_void,
    _old: c_int,
    state: c_int,
    error: *const c_char,
) {
    let capture = unsafe { &*data.cast::<Capture>() };
    if state == STATE_ERROR && !error.is_null() {
        *lock(&capture.error) = unsafe { CStr::from_ptr(error) }
            .to_string_lossy()
            .into_owned();
    }
    capture.state.store(state, Ordering::Release);
    unsafe { (capture.lib.thread_loop_signal)(capture.thread_loop, false) };
}

/// Moves one captured buffer into the ring. Realtime safe.
unsafe extern "C" fn on_recorder_process(data: *mut c_void) {
    let capture = unsafe { &*data.cast::<Capture>() };
    let lib = capture.lib;
    let stream = capture.stream.load(Ordering::Acquire);
    if stream.is_null() {
        return;
    }
    unsafe {
        let buffer: *mut PwBuffer = (lib.stream_dequeue_buffer)(stream);
        if buffer.is_null() {
            return;
        }
        let spa = (*buffer).buffer;
        if !spa.is_null() && (*spa).n_datas > 0 && !(*spa).datas.is_null() {
            let d = &*(*spa).datas;
            if !d.data.is_null() && !d.chunk.is_null() {
                let chunk = &*d.chunk;
                let offset = (chunk.offset % d.maxsize.max(1)) as usize;
                let size = (chunk.size as usize).min(d.maxsize as usize - offset);
                let start = d.data.cast::<u8>().add(offset);
                if start.addr().is_multiple_of(align_of::<f32>()) {
                    let samples = std::slice::from_raw_parts(start.cast::<f32>(), size / 4);
                    capture.ring.push(samples);
                    capture.cycles.fetch_add(1, Ordering::Release);
                }
            }
        }
        (lib.stream_queue_buffer)(stream, buffer);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_the_default_source_name() {
        assert_eq!(
            json_name(r#"{ "name": "alsa_input.pci-0000_00_1f.3.analog-stereo" }"#).as_deref(),
            Some("alsa_input.pci-0000_00_1f.3.analog-stereo")
        );
        assert_eq!(json_name(r#"{"name":"a\"b"}"#).as_deref(), Some("a\"b"));
        assert_eq!(json_name("{}"), None);
    }

    #[test]
    fn the_default_comes_first_then_by_priority() {
        let node = |id, name: &str, priority| Node {
            id,
            name: name.into(),
            description: name.into(),
            priority,
        };
        let nodes = vec![node(1, "a", 100), node(2, "b", 2000), node(3, "c", 10)];
        let names = |s: Vec<Source>| {
            s.into_iter()
                .map(|s| (s.name, s.default))
                .collect::<Vec<_>>()
        };
        assert_eq!(
            names(order(nodes, Some("c"))),
            [("c".into(), true), ("b".into(), false), ("a".into(), false)]
        );
        let nodes = vec![node(1, "a", 100), node(2, "b", 2000)];
        assert_eq!(names(order(nodes, Some("kalliope")))[0], ("b".into(), true));
    }

    #[test]
    fn the_ring_keeps_order_and_counts_what_did_not_fit() {
        let ring = Ring::new(4);
        ring.push(&[1.0, 2.0, 3.0]);
        let mut out = Vec::new();
        assert_eq!(ring.drain(&mut out), 3);
        ring.push(&[4.0, 5.0, 6.0, 7.0, 8.0]);
        ring.drain(&mut out);
        // Full: the newest sample waits for room, which never blocks the realtime side.
        assert_eq!(out, [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]);
    }
}
