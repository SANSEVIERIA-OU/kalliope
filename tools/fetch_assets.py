#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Downloads the pinned ONNX Runtime and Klein model for CI and release builds. Stdlib only.

  fetch_assets.py onnxruntime DIR   ONNX Runtime for this system; prints KALLIOPE_ORT_LIB=…
  fetch_assets.py model DIR         the Klein model; prints KALLIOPE_MODEL_DIR=…

Every download is checked against its SHA-256 before use. DIR can be cached: what is already
there is not downloaded again (the model files are checked again each time). To move to a newer ONNX Runtime or
model, change the pins below (the release page lists each file's sha256).
"""

import hashlib
import pathlib
import platform
import shutil
import sys
import tarfile
import time
import urllib.request
import zipfile

ORT_VERSION = "1.31.1"
ORT_URL = f"https://github.com/microsoft/onnxruntime/releases/download/v{ORT_VERSION}/"
# (system, machine) → (archive, sha256, library inside the archive's top folder)
ORT = {
    ("linux", "x86_64"): (
        f"onnxruntime-linux-x64-{ORT_VERSION}.tgz",
        "c849e36a1ef3e22d4ff217b9d1ce4a3cf5b9467b975610913ae959ad5b16bdc9",
        f"lib/libonnxruntime.so.{ORT_VERSION}",
    ),
    ("darwin", "arm64"): (
        f"onnxruntime-osx-arm64-{ORT_VERSION}.tgz",
        "2e1344a1926ee50eb25b38153cb6992c3567515aef0e677a1a520a1798896d6f",
        f"lib/libonnxruntime.{ORT_VERSION}.dylib",
    ),
    ("win32", "amd64"): (
        f"onnxruntime-win-x64-{ORT_VERSION}.zip",
        "5869e26bb25314375f2d5ef1877e3ea06b1543d6c710e6e4a1ec2f7177ab4b2c",
        "lib/onnxruntime.dll",
    ),
}

MODEL_REVISION = "25e0e73bebba71e5985bc369628ebdcb81bf7116"
MODEL_URL = f"https://huggingface.co/klein-ml/Klein-TTS-X1.5-Pro/resolve/{MODEL_REVISION}/onnx/"
MODEL = {
    "encoder.onnx": "0abf547af7f8663c12134900a845087f0d220d70b4744b3a383c7a909fc4c4a6",
    "decoder.onnx": "8bcaace5e03ed273b987e5e319014fcffb08597f229e0eb11487bd24ed593918",
    "model.json": "e549b783b7650781c418f2f3c73a68e45181cea9513d1c72bd5b05b0c383a354",
}


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def fetch(url, path, expected):
    """Downloads url to path unless path already has the expected checksum."""
    if path.exists() and sha256(path) == expected:
        return
    partial = path.with_name(path.name + ".part")
    request = urllib.request.Request(url, headers={"User-Agent": "kalliope-fetch-assets"})
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(request, timeout=60) as response, open(partial, "wb") as f:
                shutil.copyfileobj(response, f, 1 << 20)
            break
        except OSError as e:
            if attempt == 3:
                sys.exit(f"fetch_assets.py: {url}: {e}")
            print(f"{url}: {e}; trying again", file=sys.stderr)
            time.sleep(5 * attempt)
    found = sha256(partial)
    if found != expected:
        partial.unlink()
        sys.exit(f"fetch_assets.py: {url}: sha256 {found}, expected {expected}")
    partial.replace(path)


def wanted(name):
    """Whether an archive member is needed: the libraries and the licence texts, not the
    headers, debug symbols (430 MB on Windows) or build files."""
    parts = name.rstrip("/").split("/")[1:]
    if parts in (["LICENSE"], ["ThirdPartyNotices.txt"]):
        return True
    return len(parts) == 2 and parts[0] == "lib" and not parts[1].endswith((".pdb", ".lib"))


def onnxruntime(dest):
    key = (sys.platform, platform.machine().lower())
    if key not in ORT:
        sys.exit(f"fetch_assets.py: no pinned ONNX Runtime for {key}")
    archive, expected, library = ORT[key]
    top = dest / archive.removesuffix(".tgz").removesuffix(".zip")
    if not (top / library).exists():
        path = dest / archive
        fetch(ORT_URL + archive, path, expected)
        if archive.endswith(".zip"):
            with zipfile.ZipFile(path) as z:
                z.extractall(dest, [m for m in z.namelist() if wanted(m) and not m.endswith("/")])
        else:
            with tarfile.open(path) as t:
                members = [m for m in t if wanted(m.name) and (m.isfile() or m.issym())]
                t.extractall(dest, members, filter="data")
        path.unlink()
    print(f"KALLIOPE_ORT_LIB={(top / library).resolve()}")


def model(dest):
    folder = dest / "klein"
    folder.mkdir(exist_ok=True)
    for name, expected in MODEL.items():
        fetch(MODEL_URL + name, folder / name, expected)
    print(f"KALLIOPE_MODEL_DIR={folder.resolve()}")


def main(args):
    if len(args) != 2 or args[0] not in ("onnxruntime", "model"):
        sys.exit(__doc__)
    dest = pathlib.Path(args[1])
    dest.mkdir(parents=True, exist_ok=True)
    if args[0] == "onnxruntime":
        onnxruntime(dest)
    else:
        model(dest)


if __name__ == "__main__":
    main(sys.argv[1:])
