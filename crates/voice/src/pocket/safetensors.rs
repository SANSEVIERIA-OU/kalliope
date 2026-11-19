// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! Reading and writing `.safetensors` files (the format of Kyutai's voice states): an 8-byte header
//! length, a JSON header naming each tensor's type, shape and byte range, then the raw little-endian
//! data. Only `F32` and `I64` tensors, the two a voice state holds.

use std::path::Path;

use crate::Error;
use crate::json::Json;

pub enum Data {
    F32(Vec<f32>),
    I64(Vec<i64>),
}

pub struct Tensor {
    pub name: String,
    pub shape: Vec<usize>,
    pub data: Data,
}

/// The tensors of a file and its `__metadata__` strings.
pub type Contents = (Vec<Tensor>, Vec<(String, String)>);

/// Every tensor of the file at `path`, and the `__metadata__` strings.
pub fn read(path: &Path) -> Result<Contents, Error> {
    let bytes = std::fs::read(path).map_err(|e| Error::new(format!("{}: {e}", path.display())))?;
    parse(&bytes).map_err(|e| Error::new(format!("{}: {e}", path.display())))
}

fn parse(bytes: &[u8]) -> Result<Contents, Error> {
    let bad = |what: &str| Error::new(format!("not a safetensors file ({what})"));
    let len = bytes
        .get(..8)
        .map(|b| u64::from_le_bytes(b.try_into().expect("8 bytes")) as usize)
        .ok_or_else(|| bad("too short"))?;
    let header = bytes
        .get(8..8usize.saturating_add(len))
        .ok_or_else(|| bad("header length"))?;
    let data = &bytes[8 + len..];
    let header = std::str::from_utf8(header).map_err(|_| bad("header is not UTF-8"))?;
    let j = Json::parse(header)?;
    let mut tensors = Vec::new();
    let mut metadata = Vec::new();
    for (name, info) in j.as_object().ok_or_else(|| bad("header"))? {
        if name == "__metadata__" {
            for (k, v) in info.as_object().unwrap_or(&[]) {
                if let Some(v) = v.as_str() {
                    metadata.push((k.clone(), v.to_owned()));
                }
            }
            continue;
        }
        let dtype = info.get("dtype").and_then(Json::as_str).unwrap_or("");
        let shape: Vec<usize> = info
            .get("shape")
            .and_then(Json::as_array)
            .ok_or_else(|| bad("shape"))?
            .iter()
            .map(|d| d.as_f64().map(|d| d as usize).ok_or_else(|| bad("shape")))
            .collect::<Result<_, _>>()?;
        let offsets = info
            .get("data_offsets")
            .and_then(Json::as_array)
            .ok_or_else(|| bad("data_offsets"))?;
        let (Some(start), Some(end)) = (
            offsets.first().and_then(Json::as_f64),
            offsets.get(1).and_then(Json::as_f64),
        ) else {
            return Err(bad("data_offsets"));
        };
        let raw = data
            .get(start as usize..end as usize)
            .ok_or_else(|| bad("data range"))?;
        let count: usize = shape.iter().product();
        let data = match dtype {
            "F32" if raw.len() == count * 4 => Data::F32(
                raw.as_chunks::<4>()
                    .0
                    .iter()
                    .map(|&b| f32::from_le_bytes(b))
                    .collect(),
            ),
            "I64" if raw.len() == count * 8 => Data::I64(
                raw.as_chunks::<8>()
                    .0
                    .iter()
                    .map(|&b| i64::from_le_bytes(b))
                    .collect(),
            ),
            _ => {
                return Err(Error::new(format!(
                    "tensor {name}: type {dtype} with {} bytes for shape {shape:?} is not supported",
                    raw.len()
                )));
            }
        };
        tensors.push(Tensor {
            name: name.clone(),
            shape,
            data,
        });
    }
    Ok((tensors, metadata))
}

/// Writes `tensors` (in the given order) with `metadata`, atomically: a temporary file next to
/// `path`, then renamed.
pub fn write(path: &Path, tensors: &[Tensor], metadata: &[(&str, &str)]) -> Result<(), Error> {
    let mut header = String::from("{");
    let mut offset = 0usize;
    if !metadata.is_empty() {
        header.push_str("\"__metadata__\":{");
        for (i, (k, v)) in metadata.iter().enumerate() {
            if i > 0 {
                header.push(',');
            }
            header.push_str(&format!("{}:{}", quote(k), quote(v)));
        }
        header.push('}');
    }
    for (i, t) in tensors.iter().enumerate() {
        let (dtype, size) = match &t.data {
            Data::F32(v) => ("F32", v.len() * 4),
            Data::I64(v) => ("I64", v.len() * 8),
        };
        if i > 0 || !metadata.is_empty() {
            header.push(',');
        }
        let shape: Vec<String> = t.shape.iter().map(usize::to_string).collect();
        header.push_str(&format!(
            "{}:{{\"dtype\":\"{dtype}\",\"shape\":[{}],\"data_offsets\":[{offset},{}]}}",
            quote(&t.name),
            shape.join(","),
            offset + size
        ));
        offset += size;
    }
    header.push('}');
    // The data starts on an 8-byte boundary, as the reference implementation pads it.
    while !header.len().is_multiple_of(8) {
        header.push(' ');
    }
    let mut out = Vec::with_capacity(8 + header.len() + offset);
    out.extend_from_slice(&(header.len() as u64).to_le_bytes());
    out.extend_from_slice(header.as_bytes());
    for t in tensors {
        match &t.data {
            Data::F32(v) => v
                .iter()
                .for_each(|x| out.extend_from_slice(&x.to_le_bytes())),
            Data::I64(v) => v
                .iter()
                .for_each(|x| out.extend_from_slice(&x.to_le_bytes())),
        }
    }
    let tmp = path.with_extension("safetensors.part");
    std::fs::write(&tmp, &out).map_err(|e| Error::new(format!("{}: {e}", tmp.display())))?;
    std::fs::rename(&tmp, path).map_err(|e| Error::new(format!("{}: {e}", path.display())))
}

fn quote(s: &str) -> String {
    let mut out = String::from("\"");
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out.push('"');
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip() {
        let dir = std::env::temp_dir().join(format!("kalliope-st-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("v.safetensors");
        let tensors = [
            Tensor {
                name: "a/cache".into(),
                shape: vec![2, 3],
                data: Data::F32(vec![1.0, -2.5, 3.0, f32::NAN, 0.0, 6.0]),
            },
            Tensor {
                name: "a/offset".into(),
                shape: vec![1],
                data: Data::I64(vec![7]),
            },
        ];
        write(&path, &tensors, &[("format", "kalliope \"voice\"")]).unwrap();
        let (back, meta) = read(&path).unwrap();
        assert_eq!(
            meta,
            [("format".to_string(), "kalliope \"voice\"".to_string())]
        );
        assert_eq!(back.len(), 2);
        assert_eq!(back[0].shape, [2, 3]);
        match &back[0].data {
            Data::F32(v) => {
                assert_eq!(v[1], -2.5);
                assert!(v[3].is_nan());
            }
            Data::I64(_) => panic!("wrong type"),
        }
        assert!(matches!(&back[1].data, Data::I64(v) if v == &[7]));
        std::fs::remove_dir_all(&dir).unwrap();
    }
}
