#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Downloads ONNX Runtime and the voice models that go inside Kalliope, for CI, releases and people who
build Kalliope. Standard library only. Everything comes from one release of this repository, tagged
`assets` (docs/releasing.md); nothing is downloaded from anyone else.

  fetch_assets.py onnxruntime DIR   ONNX Runtime for this system; prints KALLIOPE_ORT_LIB=…
  fetch_assets.py model DIR         Klein, the voices Giulia and Marco; prints KALLIOPE_MODEL_DIR=…
  fetch_assets.py pocket DIR        Pocket TTS, which speaks with a voice prepared from a recording;
                                    prints KALLIOPE_POCKET_DIR=…
  fetch_assets.py recording DIR     a recording (CC0) to prepare a voice from in tests;
                                    prints KALLIOPE_TEST_RECORDING=…

tools/assets.json pins every file with its SHA-256 (tools/release_assets.py writes it): a download that
does not match is deleted and the command fails. Each file unpacks into a folder named like it, with its
licence. DIR can be cached: a folder already there is checked again (every file's SHA-256) and not
downloaded again. KALLIOPE_ASSETS_URL replaces the address of the release, for example with a copy
served locally for tests.
"""

import hashlib
import json
import os
import pathlib
import platform
import shutil
import sys
import tarfile
import tempfile
import time
import urllib.request

PINS = pathlib.Path(__file__).resolve().with_name("assets.json")
# (system, machine) → the part of tools/assets.json with ONNX Runtime for it.
SYSTEMS = {
    ("linux", "x86_64"): "onnxruntime-linux-x86_64",
    ("darwin", "arm64"): "onnxruntime-macos-arm64",
    ("win32", "amd64"): "onnxruntime-windows-x64",
}


def fail(message):
    sys.exit(f"fetch_assets.py: {message}")


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()


def fetch(url, path, expected):
    """Downloads url to path and checks its SHA-256."""
    partial = path.with_name(path.name + ".part")
    request = urllib.request.Request(url, headers={"User-Agent": "kalliope-fetch-assets"})
    for attempt in range(1, 4):
        try:
            with urllib.request.urlopen(request, timeout=60) as response, open(partial, "wb") as f:
                shutil.copyfileobj(response, f, 1 << 20)
            break
        except OSError as e:
            if attempt == 3:
                partial.unlink(missing_ok=True)
                fail(f"{url}: {e}")
            print(f"{url}: {e}; trying again", file=sys.stderr)
            time.sleep(5 * attempt)
    found = sha256(partial)
    if found != expected:
        partial.unlink()
        fail(f"{url}: sha256 {found}, expected {expected}")
    partial.replace(path)


def complete(folder, entry):
    """Whether folder holds exactly the pinned files, each with its SHA-256."""
    if not folder.is_dir():
        return False
    present = sorted(p.relative_to(folder).as_posix() for p in folder.rglob("*") if p.is_file())
    if present != sorted(entry["contents"]):
        return False
    return all(sha256(folder / name) == digest for name, digest in entry["contents"].items())


def part(dest, entry, base):
    """The folder of a pinned file, downloaded and unpacked into dest if it is not there yet."""
    folder = dest / entry["folder"]
    if complete(folder, entry):
        return folder
    archive = dest / entry["name"]
    fetch(base + entry["name"], archive, entry["sha256"])
    with tarfile.open(archive, "r:xz") as tar:
        members = tar.getmembers()
        names = sorted(m.name for m in members)
        expected = sorted(f"{entry['folder']}/{name}" for name in entry["contents"])
        if names != expected or not all(m.isfile() for m in members):
            archive.unlink()
            fail(f"{entry['name']} does not hold the pinned files")
        tmp = pathlib.Path(tempfile.mkdtemp(dir=dest))
        if hasattr(tarfile, "data_filter"):
            tar.extractall(tmp, filter="data")
        else:
            tar.extractall(tmp)
    if folder.exists():
        shutil.rmtree(folder)
    (tmp / entry["folder"]).rename(folder)
    tmp.rmdir()
    archive.unlink()
    if not complete(folder, entry):
        fail(f"{entry['name']}: the unpacked files do not match their pins")
    return folder


def main(args):
    commands = {"onnxruntime": None, "model": "klein", "pocket": "pocket", "recording": "recording"}
    if len(args) != 2 or args[0] not in commands:
        sys.exit(__doc__)
    pins = json.loads(PINS.read_text())
    release = pins["release"]
    base = os.environ.get("KALLIOPE_ASSETS_URL") or (
        f"https://github.com/{release['repository']}/releases/download/{release['tag']}/"
    )
    base = base.rstrip("/") + "/"
    dest = pathlib.Path(args[1])
    dest.mkdir(parents=True, exist_ok=True)
    if args[0] == "onnxruntime":
        key = SYSTEMS.get((sys.platform, platform.machine().lower()))
        if key is None:
            fail(f"no pinned ONNX Runtime for {sys.platform} {platform.machine()}")
        entry = pins["files"][key]
        folder = part(dest, entry, base)
        print(f"KALLIOPE_ORT_LIB={(folder / entry['library']).resolve()}")
        return
    entry = pins["files"][commands[args[0]]]
    folder = part(dest, entry, base)
    if args[0] == "recording":
        (wav,) = [name for name in entry["contents"] if name.endswith(".wav")]
        print(f"KALLIOPE_TEST_RECORDING={(folder / wav).resolve()}")
    else:
        variable = "KALLIOPE_MODEL_DIR" if args[0] == "model" else "KALLIOPE_POCKET_DIR"
        print(f"{variable}={folder.resolve()}")


if __name__ == "__main__":
    main(sys.argv[1:])
