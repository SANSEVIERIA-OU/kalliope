#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Downloads the pinned ONNX Runtime and Klein model for CI and release builds. Stdlib only.

  fetch_assets.py onnxruntime DIR   ONNX Runtime for this system; prints KALLIOPE_ORT_LIB=…
  fetch_assets.py model DIR         the Klein model; prints KALLIOPE_MODEL_DIR=…

Every download is checked against its SHA-256 before use. DIR can be cached: what is already
there is not downloaded again (the model files are checked again each time). To move to a newer ONNX Runtime or
model, change the pins below (NuGet's catalog lists the package's SHA-512; Hugging Face each file's SHA-256).
"""

import hashlib
import pathlib
import platform
import shutil
import sys
import time
import urllib.request
import zipfile

ORT_VERSION = "1.32.0"
# Microsoft's NuGet package of the ONNX Runtime C API: the same libraries as the release archives,
# for every system in one file, with the licence and the third-party notices. (On 2026-11-19 the
# release pages of github.com/microsoft/onnxruntime answered 404; NuGet lists the package's SHA-512
# in its catalog, which matched this file's.)
ORT_URL = (
    "https://api.nuget.org/v3-flatcontainer/microsoft.ml.onnxruntime/"
    f"{ORT_VERSION}/microsoft.ml.onnxruntime.{ORT_VERSION}.nupkg"
)
ORT_SHA256 = "a9150bc2992cbbb6722070da9910e1ffa989a8bfc67bdd5bb8e745ca755641db"
# (system, machine) → (folder, [(file in the package, file in the folder)]); the first is the library.
ORT = {
    ("linux", "x86_64"): (
        f"onnxruntime-linux-x64-{ORT_VERSION}",
        [
            ("runtimes/linux-x64/native/libonnxruntime.so", f"lib/libonnxruntime.so.{ORT_VERSION}"),
            ("runtimes/linux-x64/native/libonnxruntime_providers_shared.so", "lib/libonnxruntime_providers_shared.so"),
        ],
    ),
    ("darwin", "arm64"): (
        f"onnxruntime-osx-arm64-{ORT_VERSION}",
        [("runtimes/osx-arm64/native/libonnxruntime.dylib", f"lib/libonnxruntime.{ORT_VERSION}.dylib")],
    ),
    ("win32", "amd64"): (
        f"onnxruntime-win-x64-{ORT_VERSION}",
        [
            ("runtimes/win-x64/native/onnxruntime.dll", "lib/onnxruntime.dll"),
            ("runtimes/win-x64/native/onnxruntime_providers_shared.dll", "lib/onnxruntime_providers_shared.dll"),
        ],
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


def onnxruntime(dest):
    key = (sys.platform, platform.machine().lower())
    if key not in ORT:
        sys.exit(f"fetch_assets.py: no pinned ONNX Runtime for {key}")
    folder, files = ORT[key]
    top = dest / folder
    library = top / files[0][1]
    if not library.exists():
        path = dest / f"microsoft.ml.onnxruntime.{ORT_VERSION}.nupkg"
        fetch(ORT_URL, path, ORT_SHA256)
        # The same layout as the release archives: lib/, LICENSE, ThirdPartyNotices.txt.
        with zipfile.ZipFile(path) as z:
            for member, target in files + [("LICENSE", "LICENSE"), ("ThirdPartyNotices.txt", "ThirdPartyNotices.txt")]:
                out = top / target
                out.parent.mkdir(parents=True, exist_ok=True)
                with z.open(member) as src, open(out, "wb") as dst:
                    shutil.copyfileobj(src, dst, 1 << 20)
        path.unlink()
    print(f"KALLIOPE_ORT_LIB={library.resolve()}")


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
