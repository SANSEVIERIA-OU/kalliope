// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Minimal binding to the ONNX Runtime C API, loaded at run time with `dlopen`.
//!
//! Only the calls Kalliope needs. Function pointers are read from the `OrtApi` table by index:
//! the table is append-only, so an index never changes between releases. The indices below were
//! computed with `offsetof(OrtApi, Name) / sizeof(void*)` against `onnxruntime_c_api.h` of
//! ONNX Runtime 1.31.1. Every function used exists since long before [`API_VERSION`].

use std::ffi::{CStr, CString, c_char, c_int, c_void};
use std::marker::PhantomData;
use std::path::Path;
use std::ptr;
use std::sync::{Arc, OnceLock};

use crate::Error;

/// The oldest ONNX Runtime API version accepted (ONNX Runtime 1.16).
const API_VERSION: u32 = 16;

// Indices into the OrtApi function table.
const GET_ERROR_MESSAGE: usize = 2;
const CREATE_ENV: usize = 3;
const CREATE_SESSION: usize = 7;
const RUN: usize = 9;
const CREATE_SESSION_OPTIONS: usize = 10;
const DISABLE_MEM_PATTERN: usize = 17;
const DISABLE_CPU_MEM_ARENA: usize = 19;
const SET_GRAPH_OPTIMIZATION_LEVEL: usize = 23;
const SET_INTRA_OP_NUM_THREADS: usize = 24;
const SET_INTER_OP_NUM_THREADS: usize = 25;
const CREATE_TENSOR_WITH_DATA: usize = 49;
const GET_TENSOR_MUTABLE_DATA: usize = 51;
const GET_TENSOR_ELEMENT_TYPE: usize = 60;
const GET_DIMENSIONS_COUNT: usize = 61;
const GET_DIMENSIONS: usize = 62;
const GET_TENSOR_SHAPE_ELEMENT_COUNT: usize = 64;
const GET_TENSOR_TYPE_AND_SHAPE: usize = 65;
const CREATE_CPU_MEMORY_INFO: usize = 69;
const RELEASE_ENV: usize = 92;
const RELEASE_STATUS: usize = 93;
const RELEASE_MEMORY_INFO: usize = 94;
const RELEASE_SESSION: usize = 95;
const RELEASE_VALUE: usize = 96;
const RELEASE_TENSOR_TYPE_AND_SHAPE_INFO: usize = 99;
const RELEASE_SESSION_OPTIONS: usize = 100;
const ADD_SESSION_CONFIG_ENTRY: usize = 130;

// C enum values from onnxruntime_c_api.h.
const LOGGING_LEVEL_WARNING: c_int = 2;
const GRAPH_OPTIMIZATION_ALL: c_int = 99;
const DEVICE_ALLOCATOR: c_int = 0;
const MEM_TYPE_DEFAULT: c_int = 0;
const ELEMENT_FLOAT: c_int = 1;
const ELEMENT_INT64: c_int = 7;

const RTLD_NOW: c_int = 2;

type Status = *mut c_void;
type Handle = *mut c_void;

unsafe extern "C" {
    fn dlopen(filename: *const c_char, flags: c_int) -> *mut c_void;
    fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
    fn dlerror() -> *const c_char;
}

#[repr(C)]
struct OrtApiBase {
    get_api: unsafe extern "C" fn(version: u32) -> *const *const c_void,
    get_version_string: unsafe extern "C" fn() -> *const c_char,
}

/// The loaded library's function table. Loaded once per process and never unloaded.
pub struct Api {
    table: *const *const c_void,
    version: String,
}

// The table is immutable, process-wide data owned by the library.
unsafe impl Send for Api {}
unsafe impl Sync for Api {}

static API: OnceLock<Api> = OnceLock::new();

/// Loads ONNX Runtime from `path`, or from the system library path when `None`. The first
/// successful load wins for the whole process.
pub fn load(path: Option<&Path>) -> Result<&'static Api, Error> {
    if let Some(api) = API.get() {
        return Ok(api);
    }
    let candidates: Vec<String> = match path {
        Some(p) => vec![p.to_string_lossy().into_owned()],
        None => vec!["libonnxruntime.so.1".into(), "libonnxruntime.so".into()],
    };
    let mut last_error = String::new();
    for name in &candidates {
        let c_name =
            CString::new(name.as_str()).map_err(|_| Error::new("library path contains NUL"))?;
        // SAFETY: plain dlopen/dlsym calls with valid NUL-terminated strings.
        let handle = unsafe { dlopen(c_name.as_ptr(), RTLD_NOW) };
        if handle.is_null() {
            last_error = unsafe { dl_error() };
            continue;
        }
        let symbol = unsafe { dlsym(handle, c"OrtGetApiBase".as_ptr()) };
        if symbol.is_null() {
            last_error = format!("{name}: OrtGetApiBase not found");
            continue;
        }
        // SAFETY: OrtGetApiBase has this signature in every ONNX Runtime release.
        let get_base: unsafe extern "C" fn() -> *const OrtApiBase =
            unsafe { std::mem::transmute(symbol) };
        let base = unsafe { &*get_base() };
        let version = unsafe { CStr::from_ptr((base.get_version_string)()) }
            .to_string_lossy()
            .into_owned();
        let table = unsafe { (base.get_api)(API_VERSION) };
        if table.is_null() {
            return Err(Error::new(format!(
                "ONNX Runtime {version} at {name} is too old (API version {API_VERSION} or newer needed)"
            )));
        }
        let _ = API.set(Api { table, version });
        return Ok(API.get().expect("just set"));
    }
    Err(Error::new(format!(
        "could not load ONNX Runtime ({last_error}); set KALLIOPE_ORT_LIB or pass --ort-lib"
    )))
}

unsafe fn dl_error() -> String {
    let e = unsafe { dlerror() };
    if e.is_null() {
        "unknown dlopen error".into()
    } else {
        unsafe { CStr::from_ptr(e) }.to_string_lossy().into_owned()
    }
}

impl Api {
    pub fn version(&self) -> &str {
        &self.version
    }

    /// The function at `index`, as the function-pointer type `F`.
    ///
    /// SAFETY: the caller must name the exact C signature of that table entry.
    unsafe fn f<F: Copy>(&self, index: usize) -> F {
        debug_assert_eq!(size_of::<F>(), size_of::<*const c_void>());
        unsafe { std::mem::transmute_copy(&*self.table.add(index)) }
    }

    fn check(&self, status: Status) -> Result<(), Error> {
        if status.is_null() {
            return Ok(());
        }
        unsafe {
            let message: unsafe extern "C" fn(Status) -> *const c_char = self.f(GET_ERROR_MESSAGE);
            let text = CStr::from_ptr(message(status))
                .to_string_lossy()
                .into_owned();
            self.release(RELEASE_STATUS, status);
            Err(Error::new(format!("ONNX Runtime: {text}")))
        }
    }

    unsafe fn release(&self, index: usize, handle: Handle) {
        if !handle.is_null() {
            unsafe {
                let release: unsafe extern "C" fn(Handle) = self.f(index);
                release(handle);
            }
        }
    }
}

/// Session settings. Threads: intra-op as given, inter-op 1, and no spinning — idle worker
/// threads that spin burned up to 57% extra CPU in our measurements, with no speed gain.
#[derive(Clone, Copy, Debug)]
pub struct SessionConfig {
    pub threads: usize,
}

struct EnvInner {
    api: &'static Api,
    env: Handle,
    memory: Handle,
}

impl Drop for EnvInner {
    fn drop(&mut self) {
        unsafe {
            self.api.release(RELEASE_MEMORY_INFO, self.memory);
            self.api.release(RELEASE_ENV, self.env);
        }
    }
}

// ONNX Runtime environments and memory infos may be used from any thread.
unsafe impl Send for EnvInner {}
unsafe impl Sync for EnvInner {}

/// An ONNX Runtime environment; sessions keep it alive.
#[derive(Clone)]
pub struct Env(Arc<EnvInner>);

impl Env {
    pub fn new(api: &'static Api) -> Result<Env, Error> {
        let mut env = ptr::null_mut();
        let mut memory = ptr::null_mut();
        unsafe {
            let create_env: unsafe extern "C" fn(c_int, *const c_char, *mut Handle) -> Status =
                api.f(CREATE_ENV);
            api.check(create_env(
                LOGGING_LEVEL_WARNING,
                c"kalliope".as_ptr(),
                &mut env,
            ))?;
            let create_memory: unsafe extern "C" fn(c_int, c_int, *mut Handle) -> Status =
                api.f(CREATE_CPU_MEMORY_INFO);
            if let Err(e) = api.check(create_memory(
                DEVICE_ALLOCATOR,
                MEM_TYPE_DEFAULT,
                &mut memory,
            )) {
                api.release(RELEASE_ENV, env);
                return Err(e);
            }
        }
        Ok(Env(Arc::new(EnvInner { api, env, memory })))
    }

    pub fn api(&self) -> &'static Api {
        self.0.api
    }

    /// Loads the model at `path` with Kalliope's session settings.
    pub fn session(&self, path: &Path, config: SessionConfig) -> Result<Session, Error> {
        let api = self.0.api;
        let c_path = CString::new(path.to_string_lossy().as_bytes())
            .map_err(|_| Error::new("model path contains NUL"))?;
        let threads = c_int::try_from(config.threads.max(1)).unwrap_or(1);
        let mut options = ptr::null_mut();
        let mut session = ptr::null_mut();
        unsafe {
            let create_options: unsafe extern "C" fn(*mut Handle) -> Status =
                api.f(CREATE_SESSION_OPTIONS);
            api.check(create_options(&mut options))?;
            let result = (|| {
                let set_threads: unsafe extern "C" fn(Handle, c_int) -> Status =
                    api.f(SET_INTRA_OP_NUM_THREADS);
                api.check(set_threads(options, threads))?;
                let set_inter: unsafe extern "C" fn(Handle, c_int) -> Status =
                    api.f(SET_INTER_OP_NUM_THREADS);
                api.check(set_inter(options, 1))?;
                let set_level: unsafe extern "C" fn(Handle, c_int) -> Status =
                    api.f(SET_GRAPH_OPTIMIZATION_LEVEL);
                api.check(set_level(options, GRAPH_OPTIMIZATION_ALL))?;
                let no_arena: unsafe extern "C" fn(Handle) -> Status = api.f(DISABLE_CPU_MEM_ARENA);
                api.check(no_arena(options))?;
                let no_pattern: unsafe extern "C" fn(Handle) -> Status = api.f(DISABLE_MEM_PATTERN);
                api.check(no_pattern(options))?;
                let add_entry: unsafe extern "C" fn(
                    Handle,
                    *const c_char,
                    *const c_char,
                ) -> Status = api.f(ADD_SESSION_CONFIG_ENTRY);
                api.check(add_entry(
                    options,
                    c"session.intra_op.allow_spinning".as_ptr(),
                    c"0".as_ptr(),
                ))?;
                api.check(add_entry(
                    options,
                    c"session.inter_op.allow_spinning".as_ptr(),
                    c"0".as_ptr(),
                ))?;
                let create_session: unsafe extern "C" fn(
                    Handle,
                    *const c_char,
                    Handle,
                    *mut Handle,
                ) -> Status = api.f(CREATE_SESSION);
                api.check(create_session(
                    self.0.env,
                    c_path.as_ptr(),
                    options,
                    &mut session,
                ))
            })();
            api.release(RELEASE_SESSION_OPTIONS, options);
            result.map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
        }
        Ok(Session {
            env: self.clone(),
            handle: session,
        })
    }
}

/// A loaded model.
pub struct Session {
    env: Env,
    handle: Handle,
}

// ONNX Runtime documents Run as thread-safe; the handle is only released in Drop.
unsafe impl Send for Session {}

impl Drop for Session {
    fn drop(&mut self) {
        unsafe { self.env.api().release(RELEASE_SESSION, self.handle) };
    }
}

/// An input tensor borrowing caller-owned data for the duration of one run.
pub struct Tensor<'a> {
    api: &'static Api,
    value: Handle,
    _data: PhantomData<&'a mut [u8]>,
}

impl Drop for Tensor<'_> {
    fn drop(&mut self) {
        unsafe { self.api.release(RELEASE_VALUE, self.value) };
    }
}

impl<'a> Tensor<'a> {
    pub fn f32(env: &Env, data: &'a mut [f32], shape: &[i64]) -> Result<Tensor<'a>, Error> {
        Self::new(
            env,
            data.as_mut_ptr().cast(),
            size_of_val(data),
            shape,
            ELEMENT_FLOAT,
        )
    }

    pub fn i64(env: &Env, data: &'a mut [i64], shape: &[i64]) -> Result<Tensor<'a>, Error> {
        Self::new(
            env,
            data.as_mut_ptr().cast(),
            size_of_val(data),
            shape,
            ELEMENT_INT64,
        )
    }

    fn new(
        env: &Env,
        data: *mut c_void,
        bytes: usize,
        shape: &[i64],
        kind: c_int,
    ) -> Result<Tensor<'a>, Error> {
        let api = env.api();
        let mut value = ptr::null_mut();
        unsafe {
            let create: unsafe extern "C" fn(
                Handle,
                *mut c_void,
                usize,
                *const i64,
                usize,
                c_int,
                *mut Handle,
            ) -> Status = api.f(CREATE_TENSOR_WITH_DATA);
            api.check(create(
                env.0.memory,
                data,
                bytes,
                shape.as_ptr(),
                shape.len(),
                kind,
                &mut value,
            ))?;
        }
        Ok(Tensor {
            api,
            value,
            _data: PhantomData,
        })
    }
}

/// A float output tensor copied out of ONNX Runtime.
#[derive(Debug)]
pub struct Output {
    pub shape: Vec<i64>,
    pub data: Vec<f32>,
}

impl Session {
    /// Runs the model; every requested output must be a float tensor.
    pub fn run(
        &self,
        inputs: &[(&CStr, &Tensor)],
        outputs: &[&CStr],
    ) -> Result<Vec<Output>, Error> {
        let api = self.env.api();
        let input_names: Vec<*const c_char> = inputs.iter().map(|(n, _)| n.as_ptr()).collect();
        let input_values: Vec<Handle> = inputs.iter().map(|(_, t)| t.value).collect();
        let output_names: Vec<*const c_char> = outputs.iter().map(|n| n.as_ptr()).collect();
        let mut values: Vec<Handle> = vec![ptr::null_mut(); outputs.len()];
        unsafe {
            let run: unsafe extern "C" fn(
                Handle,
                *const c_void,
                *const *const c_char,
                *const Handle,
                usize,
                *const *const c_char,
                usize,
                *mut Handle,
            ) -> Status = api.f(RUN);
            api.check(run(
                self.handle,
                ptr::null(),
                input_names.as_ptr(),
                input_values.as_ptr(),
                inputs.len(),
                output_names.as_ptr(),
                outputs.len(),
                values.as_mut_ptr(),
            ))?;
        }
        let result = values
            .iter()
            .map(|&v| unsafe { read_float(api, v) })
            .collect();
        for v in values {
            unsafe { api.release(RELEASE_VALUE, v) };
        }
        result
    }
}

unsafe fn read_float(api: &'static Api, value: Handle) -> Result<Output, Error> {
    unsafe {
        let mut info = ptr::null_mut();
        let type_and_shape: unsafe extern "C" fn(Handle, *mut Handle) -> Status =
            api.f(GET_TENSOR_TYPE_AND_SHAPE);
        api.check(type_and_shape(value, &mut info))?;
        let described = (|| {
            let mut kind: c_int = 0;
            let element_type: unsafe extern "C" fn(Handle, *mut c_int) -> Status =
                api.f(GET_TENSOR_ELEMENT_TYPE);
            api.check(element_type(info, &mut kind))?;
            if kind != ELEMENT_FLOAT {
                return Err(Error::new(format!(
                    "output element type {kind}, expected float"
                )));
            }
            let mut rank = 0usize;
            let dims_count: unsafe extern "C" fn(Handle, *mut usize) -> Status =
                api.f(GET_DIMENSIONS_COUNT);
            api.check(dims_count(info, &mut rank))?;
            let mut shape = vec![0i64; rank];
            let dims: unsafe extern "C" fn(Handle, *mut i64, usize) -> Status =
                api.f(GET_DIMENSIONS);
            api.check(dims(info, shape.as_mut_ptr(), rank))?;
            let mut count = 0usize;
            let element_count: unsafe extern "C" fn(Handle, *mut usize) -> Status =
                api.f(GET_TENSOR_SHAPE_ELEMENT_COUNT);
            api.check(element_count(info, &mut count))?;
            Ok((shape, count))
        })();
        api.release(RELEASE_TENSOR_TYPE_AND_SHAPE_INFO, info);
        let (shape, count) = described?;
        let mut data_ptr: *mut c_void = ptr::null_mut();
        let mutable_data: unsafe extern "C" fn(Handle, *mut *mut c_void) -> Status =
            api.f(GET_TENSOR_MUTABLE_DATA);
        api.check(mutable_data(value, &mut data_ptr))?;
        let data = if count == 0 {
            Vec::new()
        } else {
            std::slice::from_raw_parts(data_ptr.cast::<f32>(), count).to_vec()
        };
        Ok(Output { shape, data })
    }
}
