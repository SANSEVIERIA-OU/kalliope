#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""ONNX Runtime and the voice models that go inside Kalliope: the maintainers' tool. Standard library only;
the Pocket TTS export runs tools/pocket_export/export.py in its own Python environment.

  release_assets.py build OUT [--onnxruntime X.Y.Z] [--klein REV] [--pocket-weights REV]
                              [--pocket-tokenizer REV] [--pocket-code COMMIT] [--rebuild NAME,...|all]
                              [--cache DIR] [--venv DIR]
  release_assets.py check [--open-issues] [--pins FILE] [--toolchain FILE]

The files live in one release of this repository, tagged `assets` (a prerelease, never "latest", so it is
never taken for a version of the program); their names carry their versions, and a file stays there as
long as a version of Kalliope uses it. tools/assets.json pins each one with its SHA-256: that file is the
only place, read by tools/fetch_assets.py (CI, releases, people who build Kalliope) and by `check`.

build, when a source has a new version (the options above; a Hugging Face revision or a GitHub ref can be
a branch, it is resolved to its commit):
  1. downloads ONNX Runtime from Microsoft's NuGet package, Klein from Hugging Face, Pocket TTS's weights
     from kyutai/pocket-tts with the owner's key in HF_TOKEN (only when the file is not in the cache yet;
     the key is never printed or written), its tokenizer, the CC BY 4.0 text, Kyutai's code at its commit
     and a CC0 recording for the checks. Each file is checked: against its pin; for a new revision,
     against the hashes Hugging Face (git blob or LFS pointer) and NuGet (SHA-512) publish.
  2. exports Pocket TTS to ONNX (tools/pocket_export/export.py, in VENV made from its requirements.txt),
     which also checks the graphs against Kyutai's code;
  3. packs each part into a .tar.xz with its licence and notices. Same contents as pinned: the pinned file
     stays and nothing is uploaded. New contents: a new file, named with its version (never a name the
     release or the pins already have).
  4. writes the pins into tools/assets.json, the new files into OUT (with pocket-export-report.json, the
     numbers of the export's checks), and prints the command that uploads them. It uploads nothing:
     that needs the owner's permission (docs/releasing.md).
Only the parts whose sources change are built; --rebuild builds others too (all: everything).

check compares the pins with the newest versions: ONNX Runtime on NuGet; the Klein files, Pocket TTS's
weights and tokenizer on Hugging Face (the git ids of the files, which even the gated repository shows
without a key); Kyutai's code (commits touching pocket_tts/); Rust stable against rust-toolchain.toml.
It prints what is new. With --open-issues (the weekly workflow, .github/workflows/versions.yml) it opens
one issue per new version with GITHUB_TOKEN, and none when an issue with the same title already exists.
"""

import argparse
import base64
import hashlib
import json
import lzma
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parent
PINS = TOOLS / "assets.json"
EXPORT = TOOLS / "pocket_export"
# Every file in the archives carries this time (2026-11-19, when the store was set up), so the same
# contents make the same archive.
MTIME = 1795046400
MAX_SIZE = 2 * 1024**3  # GitHub's limit for one file of a release
USER_AGENT = "kalliope-release-assets"
CACHE = Path(os.environ.get("XDG_CACHE_HOME") or Path.home() / ".cache") / "kalliope-assets"

# ONNX Runtime per system: the files taken from the NuGet package, as in Microsoft's own archives.
ORT_SYSTEMS = {
    "onnxruntime-linux-x86_64": ("onnxruntime-linux-x64", [
        ("runtimes/linux-x64/native/libonnxruntime.so", "lib/libonnxruntime.so.{v}"),
        ("runtimes/linux-x64/native/libonnxruntime_providers_shared.so", "lib/libonnxruntime_providers_shared.so"),
    ]),
    "onnxruntime-macos-arm64": ("onnxruntime-osx-arm64", [
        ("runtimes/osx-arm64/native/libonnxruntime.dylib", "lib/libonnxruntime.{v}.dylib"),
    ]),
    "onnxruntime-windows-x64": ("onnxruntime-win-x64", [
        ("runtimes/win-x64/native/onnxruntime.dll", "lib/onnxruntime.dll"),
        ("runtimes/win-x64/native/onnxruntime_providers_shared.dll", "lib/onnxruntime_providers_shared.dll"),
    ]),
}
KLEIN_FILES = ["onnx/encoder.onnx", "onnx/decoder.onnx", "onnx/model.json", "LICENSE"]
POCKET_FILES = ["flow_lm.onnx", "mimi_decoder.onnx", "mimi_encoder.onnx", "tokenizer.json", "pocket.json"]


def fail(message):
    sys.exit(f"release_assets.py: {message}")


# ----------------------------------------------------------------------------------------------- pins
def load_pins(path=PINS):
    return json.loads(Path(path).read_text())


def save_pins(pins, path=PINS):
    Path(path).write_text(json.dumps(pins, indent=2, ensure_ascii=False) + "\n")


# ----------------------------------------------------------------------------------------------- web
class _Redirect(urllib.request.HTTPRedirectHandler):
    """Follows redirects, but never carries a key to another host (Hugging Face sends files from a CDN)."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        new = super().redirect_request(req, fp, code, msg, headers, newurl)
        if new is not None and urllib.parse.urlsplit(newurl).netloc != urllib.parse.urlsplit(req.full_url).netloc:
            new.remove_header("Authorization")
        return new


_opener = urllib.request.build_opener(_Redirect)


def request(url, token=None, data=None, method=None, accept=None):
    headers = {"User-Agent": USER_AGENT}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if accept:
        headers["Accept"] = accept
    if data is not None:
        data = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    return urllib.request.Request(url, data=data, headers=headers, method=method)


def fetch(url, token=None, **kw):
    """The body of url. Errors name the URL only: a key is never part of a message."""
    for attempt in range(1, 4):
        try:
            with _opener.open(request(url, token, **kw), timeout=60) as response:
                return response.read()
        except urllib.error.HTTPError as e:
            if e.code < 500 or attempt == 3:
                raise
        except OSError as e:
            if attempt == 3:
                fail(f"{url}: {e}")
        time.sleep(5 * attempt)


def fetch_json(url, token=None, **kw):
    return json.loads(fetch(url, token, **kw))


def github_token():
    return os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")


def download(url, path, token=None):
    """Downloads url to path (through path.part)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    part = path.with_name(path.name + ".part")
    for attempt in range(1, 4):
        try:
            with _opener.open(request(url, token), timeout=60) as response, open(part, "wb") as f:
                shutil.copyfileobj(response, f, 1 << 20)
            break
        except urllib.error.HTTPError as e:
            if e.code < 500 or attempt == 3:
                fail(f"{url}: HTTP {e.code}")
        except OSError as e:
            if attempt == 3:
                fail(f"{url}: {e}")
        print(f"{url}: trying again", file=sys.stderr)
        time.sleep(5 * attempt)
    part.replace(path)


# ----------------------------------------------------------------------------------------------- hashes
def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def sha512(path):
    h = hashlib.sha512()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.digest()


def git_blob(data):
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def git_oid(path, lfs):
    """The id git gives the file: its own blob, or for a file in LFS the blob of its pointer."""
    if lfs:
        pointer = f"version https://git-lfs.github.com/spec/v1\noid sha256:{sha256(path)}\nsize {path.stat().st_size}\n"
        return git_blob(pointer.encode())
    return git_blob(path.read_bytes())


# ----------------------------------------------------------------------------------------------- Hugging Face
HF = "https://huggingface.co"


def hf_revision(repo, rev):
    """The commit of a revision (a branch, a tag or a commit). Gated repositories answer without a key."""
    return fetch_json(f"{HF}/api/models/{repo}/revision/{urllib.parse.quote(rev, safe='')}")["sha"]


def hf_entries(repo, rev, folder):
    """Path → tree entry (oid, size, lfs) of the files directly in folder at rev."""
    url = f"{HF}/api/models/{repo}/tree/{rev}/{urllib.parse.quote(folder)}" if folder else f"{HF}/api/models/{repo}/tree/{rev}"
    return {e["path"]: e for e in fetch_json(url) if e.get("type") == "file"}


def hf_file(repo, rev, path, cache, pin=None, key=False):
    """A file of a Hugging Face repository at a commit, from the cache or downloaded, checked against the
    pin when there is one, and always against the git id that Hugging Face lists for it. Returns the
    local path and its {"sha256", "oid"}."""
    local = cache / "huggingface" / repo / rev / path
    if pin and pin.get("oid") and local.exists() and sha256(local) == pin["sha256"]:
        return local, {"sha256": pin["sha256"], "oid": pin["oid"]}
    folder = path.rpartition("/")[0]
    entry = hf_entries(repo, rev, folder).get(path)
    if entry is None:
        fail(f"{repo}@{rev} has no {path}")
    lfs = "lfs" in entry
    if not (local.exists() and git_oid(local, lfs) == entry["oid"]):
        token = None
        if key:
            token = os.environ.get("HF_TOKEN")
            if not token:
                fail(f"{repo} is gated: set HF_TOKEN to the owner's read key to download {path} (or put the file in {local.parent})")
        download(f"{HF}/{repo}/resolve/{rev}/{urllib.parse.quote(path)}", local, token)
        if git_oid(local, lfs) != entry["oid"]:
            local.unlink()
            fail(f"{repo}@{rev}/{path}: the file does not match the git id Hugging Face lists ({entry['oid']})")
    found = {"sha256": sha256(local), "oid": entry["oid"]}
    if pin and (found["sha256"] != pin["sha256"] or found["oid"] != pin.get("oid", found["oid"])):
        fail(f"{repo}@{rev}/{path} is not the pinned file: {found}, pinned {pin}")
    return local, found


# ----------------------------------------------------------------------------------------------- archives
def pack(folder, top, out):
    """Packs every file under folder into out (.tar.xz), as top/…, the same way every time: sorted,
    one time, owner root, mode 755 for libraries and 644 for the rest. Returns {path under top: sha256}."""
    files = sorted(p for p in folder.rglob("*") if p.is_file())
    contents = {}
    raw = out.with_suffix("")
    with open(raw, "wb") as f, tarfile.open(fileobj=f, mode="w", format=tarfile.USTAR_FORMAT) as tar:
        for p in files:
            name = f"{top}/{p.relative_to(folder).as_posix()}"
            info = tarfile.TarInfo(name)
            info.size = p.stat().st_size
            info.mtime = MTIME
            info.mode = 0o755 if re.search(r"\.(so|dylib|dll)(\.|$)", p.name) else 0o644
            info.uid = info.gid = 0
            info.uname = info.gname = ""
            with open(p, "rb") as src:
                tar.addfile(info, src)
            contents[p.relative_to(folder).as_posix()] = sha256(p)
    with open(raw, "rb") as src, lzma.open(out, "wb", preset=6) as dst:
        shutil.copyfileobj(src, dst, 1 << 20)
    raw.unlink()
    if out.stat().st_size >= MAX_SIZE:
        fail(f"{out.name} is {out.stat().st_size} bytes, over GitHub's 2 GiB per file")
    return contents


def release_files(pins):
    """Name → sha256 of the files already in the release; None if the release does not exist yet."""
    rel = pins["release"]
    try:
        data = fetch_json(f"https://api.github.com/repos/{rel['repository']}/releases/tags/{rel['tag']}",
                          github_token(), accept="application/vnd.github+json")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise
    return {a["name"]: (a.get("digest") or "").removeprefix("sha256:") for a in data.get("assets", [])}


def free_name(base, taken):
    """base.tar.xz, or base-2.tar.xz, base-3.tar.xz… the first name nobody has used."""
    n = 1
    while True:
        name = f"{base}{'' if n == 1 else f'-{n}'}.tar.xz"
        if name not in taken:
            return name
        n += 1


# ----------------------------------------------------------------------------------------------- parts
def build_onnxruntime(src, cache, work):
    """ONNX Runtime for each system, from the NuGet package: [(key, base name, folder)]."""
    v = src["version"]
    pkg = src["nuget"]
    nupkg = cache / "nuget" / f"{pkg}.{v}.nupkg"
    if not (nupkg.exists() and src.get("sha256") and sha256(nupkg) == src["sha256"]):
        reg = fetch_json(f"https://api.nuget.org/v3/registration5-semver1/{pkg}/{v}.json")
        entry = fetch_json(reg["catalogEntry"])
        download(reg["packageContent"], nupkg)
        if entry.get("packageHashAlgorithm") != "SHA512" or base64.b64encode(sha512(nupkg)).decode() != entry.get("packageHash"):
            nupkg.unlink()
            fail(f"the NuGet package of ONNX Runtime {v} does not match the SHA-512 in NuGet's catalog")
    found = sha256(nupkg)
    if src.get("sha256") and found != src["sha256"]:
        fail(f"the NuGet package of ONNX Runtime {v} has sha256 {found}, pinned {src['sha256']}")
    src["sha256"] = found
    parts = []
    with zipfile.ZipFile(nupkg) as z:
        for key, (prefix, members) in ORT_SYSTEMS.items():
            base = f"{prefix}-{v}"
            folder = work / key
            for member, target in members + [("LICENSE", "LICENSE"), ("ThirdPartyNotices.txt", "ThirdPartyNotices.txt")]:
                out = folder / target.format(v=v)
                out.parent.mkdir(parents=True, exist_ok=True)
                with z.open(member) as s, open(out, "wb") as d:
                    shutil.copyfileobj(s, d, 1 << 20)
            parts.append((key, base, folder, {"library": members[0][1].format(v=v)}))
    return parts


def build_klein(src, cache, work):
    rev = src["revision"]
    folder = work / "klein"
    files = src.setdefault("files", {})
    for path in KLEIN_FILES:
        local, found = hf_file(src["repository"], rev, path, cache, files.get(path))
        files[path] = found
        out = folder / path.removeprefix("onnx/")
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(local, out)
    (folder / "NOTICE.txt").write_text(f"""Klein-TTS-X1.5-Pro, by Klein ML
https://huggingface.co/{src['repository']}, revision {rev}

encoder.onnx, decoder.onnx and model.json are the files of the onnx/ folder of that revision,
unchanged. Licence: Apache License 2.0, in LICENSE (the repository's own copy).

Kalliope (https://github.com/SANSEVIERIA-OU/kalliope) speaks with them as Giulia and Marco.
""")
    return [("klein", f"klein-tts-x1.5-pro-{rev[:7]}", folder, {})]


def kyutai_code(src, cache):
    """kyutai-labs/pocket-tts at its commit, from GitHub's archive, checked against the pinned digest of
    its files (recorded the first time a commit is used)."""
    commit = src["commit"]
    folder = cache / "github" / src["repository"] / commit
    if not (folder / "pocket_tts").is_dir():
        archive = cache / "github" / f"{src['repository'].replace('/', '-')}-{commit}.tar.gz"
        download(f"https://codeload.github.com/{src['repository']}/tar.gz/{commit}", archive)
        tmp = Path(tempfile.mkdtemp(dir=archive.parent))
        with tarfile.open(archive) as tar:
            tar.extractall(tmp, filter="data")
        (top,) = tmp.iterdir()
        if folder.exists():
            shutil.rmtree(folder)
        folder.parent.mkdir(parents=True, exist_ok=True)
        top.rename(folder)
        tmp.rmdir()
        archive.unlink()
    lines = []
    for p in sorted(q for q in folder.rglob("*") if q.is_file() and "__pycache__" not in q.parts):
        lines.append(f"{p.relative_to(folder).as_posix()}\0{sha256(p)}\n")
    digest = hashlib.sha256("".join(lines).encode()).hexdigest()
    if src.get("tree_sha256") and digest != src["tree_sha256"]:
        fail(f"{src['repository']} {commit} from GitHub is not the pinned tree ({digest}, pinned {src['tree_sha256']})")
    src["tree_sha256"] = digest
    return folder


def venv_python(venv):
    """The Python of the export's environment, made from requirements.txt if it does not exist yet."""
    python = venv / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if not python.exists():
        print(f"making the export's Python environment in {venv}", flush=True)
        subprocess.run([sys.executable, "-m", "venv", str(venv)], check=True)
    subprocess.run([str(python), "-m", "pip", "install", "-q", "--disable-pip-version-check", "-r",
                    str(EXPORT / "requirements.txt")], check=True)
    return python


def check_recording(src, cache):
    local, found = hf_file(src["repository"], src["revision"], src["path"], cache, src.get("sha256") and src)
    src.update(found)
    return local


def build_recording(src, cache, work):
    """The recording for tests, with its licence (CC0): the export's checks use it, and so do the tests
    of the installed packages, which prepare a voice from it."""
    local = check_recording(src, cache)
    folder = work / "recording"
    folder.mkdir()
    name = src["path"].rpartition("/")[2]
    shutil.copyfile(local, folder / name)
    (folder / "NOTICE.txt").write_text(f"""{name}: a voice given to Kyutai's Unmute Voice Donation Project, CC0 1.0
(README of the repository). https://huggingface.co/{src['repository']}, {src['path']}, revision {src['revision']}

Kalliope uses it only in tests: to check the Pocket TTS export against Kyutai's code
(tools/pocket_export/), and to prepare a voice with the installed packages
(packaging/linux/test-packages.sh). It is not part of Kalliope's packages.
""")
    stem = name.rpartition(".")[0].lower()
    return [("recording", f"test-recording-{stem}-{src['revision'][:7]}", folder, {})]


def build_pocket(src, recording_src, cache, work, venv, out):
    w, t, c, lic = src["weights"], src["tokenizer"], src["code"], src["licence"]
    weights, found = hf_file(w["repository"], w["revision"], w["path"], cache, w.get("sha256") and w, key=True)
    w.update(found)
    tokenizer, found = hf_file(t["repository"], t["revision"], t["path"], cache, t.get("sha256") and t)
    t.update(found)
    recording = check_recording(recording_src, cache)
    licence = cache / "creativecommons" / "by-4.0-legalcode.txt"
    if not (licence.exists() and sha256(licence) == lic["sha256"]):
        download(lic["url"], licence)
        if sha256(licence) != lic["sha256"]:
            fail(f"{lic['url']} is not the pinned text ({sha256(licence)})")
    code = kyutai_code(c, cache)
    folder = work / "pocket"
    subprocess.run([str(venv_python(venv)), "-I", str(EXPORT / "export.py"),
                    "--code", str(code), "--weights", str(weights), "--tokenizer", str(tokenizer),
                    "--recording", str(recording), "--out", str(folder), "--work", str(work / "pocket-export"),
                    "--model-revision", w["revision"], "--tokenizer-revision", t["revision"],
                    "--code-revision", c["commit"]], check=True)
    shutil.copyfile(licence, folder / "LICENSE")
    (folder / "NOTICE.txt").write_text(f"""Pocket TTS by Kyutai (https://kyutai.org), Italian model, CC BY 4.0;
converted to ONNX and quantized by Kalliope.

Source:
- weights: https://huggingface.co/{w['repository']}, {w['path']}, revision {w['revision']}
- tokenizer: https://huggingface.co/{t['repository']}, {t['path']}, revision {t['revision']}
Licence: Creative Commons Attribution 4.0 International (CC BY 4.0),
https://creativecommons.org/licenses/by/4.0/ ; the text is in LICENSE.

Changes made by Kalliope (https://github.com/SANSEVIERIA-OU/kalliope): the weights were exported to
ONNX with Kyutai's code (https://github.com/{c['repository']}, commit {c['commit']}, MIT) by
tools/pocket_export/ of Kalliope:
- flow_lm.onnx: one step of the flow language model, its weights quantized to 8 bits;
- mimi_decoder.onnx, mimi_encoder.onnx: the Mimi codec, as streaming steps with explicit state;
- pocket.json: sizes and generation settings, written by Kalliope;
- tokenizer.json: unchanged.
Kyutai provides the model as is, without warranties (section 5 of the licence).

Kyutai's terms for the model forbid imitating a voice without the explicit and lawful consent of its
owner. Kalliope asks the same of the people who use it: your own voice, or the voice of someone who has
given you explicit consent. This is information about Kyutai's terms, not a condition added to the
licence above.
""")
    missing = [f for f in POCKET_FILES if not (folder / f).is_file()]
    if missing:
        fail(f"the export did not make {', '.join(missing)}")
    # What the export's checks measured, against Kyutai's code; not uploaded.
    shutil.copyfile(work / "pocket-export" / "report.json", out / "pocket-export-report.json")
    shutil.rmtree(work / "pocket-export", ignore_errors=True)
    return [("pocket", f"pocket-tts-italian-{w['revision'][:7]}", folder, {})]


# ----------------------------------------------------------------------------------------------- build
def resolve(pins, a):
    """Moves the sources to the versions given as options (resolved to commits), and drops the hashes
    pinned for the old ones."""
    s = pins["sources"]
    changed = set()
    if a.onnxruntime and a.onnxruntime != s["onnxruntime"]["version"]:
        s["onnxruntime"] = {"version": a.onnxruntime, "nuget": s["onnxruntime"]["nuget"]}
        changed.add("onnxruntime")
    if a.klein:
        rev = hf_revision(s["klein"]["repository"], a.klein)
        if rev != s["klein"]["revision"]:
            s["klein"] = {"repository": s["klein"]["repository"], "revision": rev}
            changed.add("klein")
    p = s["pocket"]
    for opt, key in ((a.pocket_weights, "weights"), (a.pocket_tokenizer, "tokenizer")):
        if opt:
            rev = hf_revision(p[key]["repository"], opt)
            if rev != p[key]["revision"]:
                p[key] = {"repository": p[key]["repository"], "revision": rev, "path": p[key]["path"]}
                changed.add("pocket")
    if a.pocket_code:
        commit = fetch_json(f"https://api.github.com/repos/{p['code']['repository']}/commits/{a.pocket_code}",
                            github_token())["sha"]
        if commit != p["code"]["commit"]:
            p["code"] = {"repository": p["code"]["repository"], "commit": commit}
            changed.add("pocket")
    return changed


def build(a):
    pins = load_pins()
    out = Path(a.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    cache = Path(a.cache).resolve()
    changed = resolve(pins, a)
    files = pins.setdefault("files", {})
    wanted = {"onnxruntime": list(ORT_SYSTEMS), "klein": ["klein"], "pocket": ["pocket"], "recording": ["recording"]}
    rebuild = set(wanted) if a.rebuild == "all" else set(filter(None, (a.rebuild or "").split(",")))
    if rebuild - set(wanted):
        fail(f"--rebuild: unknown part {', '.join(sorted(rebuild - set(wanted)))} (onnxruntime, klein, pocket, recording, all)")
    todo = [part for part, keys in wanted.items()
            if part in changed or part in rebuild or any(k not in files for k in keys)]
    in_release = release_files(pins)
    if todo:
        build_parts(pins, todo, in_release, out, cache, a)
    else:
        print("Nothing to build: the pinned files are up to date (--rebuild NAME builds one again).")
    upload_command(pins, in_release, out)


def build_parts(pins, todo, in_release, out, cache, a):
    files = pins["files"]
    taken = set(in_release or {}) | {f["name"] for f in files.values()}
    work = Path(tempfile.mkdtemp(prefix="kalliope-assets-", dir=a.work))
    report = []
    try:
        parts = []
        if "onnxruntime" in todo:
            parts += build_onnxruntime(pins["sources"]["onnxruntime"], cache, work)
        if "klein" in todo:
            parts += build_klein(pins["sources"]["klein"], cache, work)
        if "pocket" in todo:
            parts += build_pocket(pins["sources"]["pocket"], pins["sources"]["recording"], cache, work,
                                  Path(a.venv).resolve(), out)
        if "recording" in todo:
            parts += build_recording(pins["sources"]["recording"], cache, work)
        for key, base, folder, extra in parts:
            old = files.get(key)
            top = old["folder"] if old and old["folder"].startswith(base) else base
            archive = work / f"{top}.tar.xz"
            contents = pack(folder, top, archive)
            if old and old["contents"] == contents and all(old.get(k) == v for k, v in extra.items()):
                # The same files as pinned: the pinned archive stays, whatever the bytes of this one.
                if sha256(archive) == old["sha256"]:
                    shutil.copyfile(archive, out / old["name"])
                    report.append((old["name"], "unchanged"))
                else:
                    report.append((old["name"], "unchanged (the new archive differs only in its compression: the pinned one stays)"))
                continue
            name = free_name(base, taken)
            if name.removesuffix(".tar.xz") != top:
                top = name.removesuffix(".tar.xz")
                contents = pack(folder, top, archive)
            taken.add(name)
            final = out / name
            shutil.move(archive, final)
            files[key] = {"name": name, "size": final.stat().st_size, "sha256": sha256(final), "folder": top,
                          **extra, "contents": contents}
            report.append((name, "new"))
    finally:
        shutil.rmtree(work, ignore_errors=True)
    save_pins(pins)
    print(f"\nPins written to {PINS.relative_to(ROOT)}. Files:")
    for name, state in report:
        f = next(v for v in files.values() if v["name"] == name)
        print(f"  {name}  {f['size']:>11,} B  sha256 {f['sha256']}  {state}")


def upload_command(pins, in_release, out):
    """Prints how the pinned files missing from the release get there; uploads nothing."""
    pending = [f for f in pins["files"].values() if f["name"] not in (in_release or {})]
    if not pending:
        print("\nNothing to upload: every pinned file is already in the release.")
        return
    ready = [f["name"] for f in pending if (out / f["name"]).is_file() and sha256(out / f["name"]) == f["sha256"]]
    lost = [f["name"] for f in pending if f["name"] not in ready]
    if lost:
        print(f"\nPinned, but neither in the release nor in {out}: {', '.join(lost)}. Make them again with --rebuild.")
    if not ready:
        return
    rel = pins["release"]
    paths = " ".join(str(out / n) for n in ready)
    print(f"\nIn {out}. Nothing has been uploaded. With the owner's permission, they go into the release with:")
    if in_release is not None:
        print(f"  gh release upload {rel['tag']} --repo {rel['repository']} {paths}")
    else:
        notes = out / "assets-release-notes.md"
        notes.write_text(RELEASE_NOTES)
        print(f"  gh release create {rel['tag']} --repo {rel['repository']} --target main --prerelease --latest=false \\\n"
              f"    --title 'Files that go inside Kalliope' --notes-file {notes} \\\n    {paths}")


RELEASE_NOTES = """Not a version of Kalliope: the files that go inside it, kept here so that building Kalliope never \
depends on anyone else's servers. Kalliope's packages already contain them; nobody needs to download them to use Kalliope.

- `onnxruntime-*.tar.xz`: ONNX Runtime by Microsoft (MIT), taken from its NuGet package `Microsoft.ML.OnnxRuntime`, with its \
`LICENSE` and `ThirdPartyNotices.txt`.
- `klein-tts-x1.5-pro-*.tar.xz`: Klein-TTS-X1.5-Pro by Klein ML (Apache-2.0), the voices Giulia and Marco, unchanged, with its licence.
- `pocket-tts-italian-*.tar.xz`: Pocket TTS by Kyutai (https://kyutai.org), Italian model, CC BY 4.0; converted to ONNX and \
quantized by Kalliope (what was changed is in its `NOTICE.txt`, the licence in its `LICENSE`).
- `test-recording-*.tar.xz`: a voice given to Kyutai's Unmute Voice Donation Project (CC0), used only by Kalliope's tests.

Each name carries its version; a file stays here as long as a version of Kalliope uses it. `tools/assets.json` in the \
repository pins each file with its SHA-256, and `tools/fetch_assets.py` checks it after downloading. See `docs/releasing.md`.
"""


# ----------------------------------------------------------------------------------------------- check
def version_key(v):
    return tuple(int(x) for x in re.findall(r"\d+", v))


def newer(pins, toolchain):
    """What upstream has that the pins do not: [(title, body)]."""
    s = pins["sources"]
    found = []
    # ONNX Runtime on NuGet: the newest stable version.
    pkg = s["onnxruntime"]["nuget"]
    versions = fetch_json(f"https://api.nuget.org/v3-flatcontainer/{pkg}/index.json")["versions"]
    stable = max((v for v in versions if "-" not in v), key=version_key)
    if version_key(stable) > version_key(s["onnxruntime"]["version"]):
        found.append((f"ONNX Runtime {stable} is out",
                      f"NuGet `Microsoft.ML.OnnxRuntime` has {stable}; Kalliope pins {s['onnxruntime']['version']}.\n\n"
                      f"`python3 tools/release_assets.py build OUT --onnxruntime {stable}`, then docs/releasing.md."))
    # Klein: the files Kalliope uses, at the head of the repository.
    k = s["klein"]
    head = hf_revision(k["repository"], "main")
    entries = {}
    for folder in sorted({p.rpartition("/")[0] for p in k["files"]}):
        entries.update(hf_entries(k["repository"], head, folder))
    moved = [p for p, pin in k["files"].items() if entries.get(p, {}).get("oid") != pin["oid"]]
    if moved:
        found.append((f"Klein-TTS-X1.5-Pro: new files at {head[:7]}",
                      f"In https://huggingface.co/{k['repository']} at {head}, these files differ from revision "
                      f"{k['revision'][:7]}: {', '.join(moved)}.\n\n"
                      f"`python3 tools/release_assets.py build OUT --klein {head}`, then docs/releasing.md."))
    # Pocket TTS: the weights with voice cloning (gated: the tree shows the git ids without a key) and the tokenizer.
    p = s["pocket"]
    for key, what in (("weights", "weights"), ("tokenizer", "tokenizer")):
        e = p[key]
        head = hf_revision(e["repository"], "main")
        entry = hf_entries(e["repository"], head, e["path"].rpartition("/")[0]).get(e["path"])
        if entry is None or entry["oid"] != e["oid"]:
            option = "--pocket-weights" if key == "weights" else "--pocket-tokenizer"
            found.append((f"Pocket TTS Italian {what}: new file at {head[:7]}",
                          f"`{e['path']}` in https://huggingface.co/{e['repository']} at {head} "
                          f"{'is gone' if entry is None else 'is not the pinned file'} (pinned: revision {e['revision'][:7]}).\n\n"
                          f"`python3 tools/release_assets.py build OUT {option} {head}`, then docs/releasing.md "
                          f"(the weights need the owner's key)."))
    # Kyutai's code: commits that touch the package the export uses.
    c = p["code"]
    gh = "https://api.github.com/repos/" + c["repository"]
    commits = fetch_json(f"{gh}/commits?sha=main&path=pocket_tts&per_page=1", github_token())
    if commits:
        last = commits[0]["sha"]
        status = fetch_json(f"{gh}/compare/{c['commit']}...{last}", github_token())["status"]
        if status in ("ahead", "diverged"):
            found.append((f"Pocket TTS code: pocket_tts/ changed at {last[:7]}",
                          f"https://github.com/{c['repository']}/compare/{c['commit'][:12]}...{last[:12]} changes `pocket_tts/`, "
                          f"which the export uses (pinned: {c['commit'][:7]}). Read what changed: the generation loop and "
                          f"the text preparation of crates/voice/src/pocket/ follow that code.\n\n"
                          f"`python3 tools/release_assets.py build OUT --pocket-code {last}`, then docs/releasing.md."))
    # Rust stable.
    channel = fetch("https://static.rust-lang.org/dist/channel-rust-stable.toml").decode()
    m = re.search(r'\[pkg\.rust\]\s*\nversion = "([0-9.]+)', channel)
    if not m:
        fail("channel-rust-stable.toml: no [pkg.rust] version")
    pinned = re.search(r'^channel\s*=\s*"([^"]+)"', Path(toolchain).read_text(), re.M).group(1)
    if version_key(m.group(1)) > version_key(pinned):
        found.append((f"Rust {m.group(1)} is out",
                      f"The stable channel has Rust {m.group(1)}; `rust-toolchain.toml` pins {pinned}. Move `channel` there "
                      f"and `rust-version` in Cargo.toml together, then run the checks of CONTRIBUTING.md."))
    return found


def existing_titles(repo, token):
    titles = set()
    for page in range(1, 11):
        batch = fetch_json(f"https://api.github.com/repos/{repo}/issues?state=all&per_page=100&page={page}",
                           token, accept="application/vnd.github+json")
        titles |= {i["title"] for i in batch}
        if len(batch) < 100:
            break
    return titles


def check(a):
    pins = load_pins(a.pins)
    found = newer(pins, a.toolchain)
    if not found:
        print("Nothing new: ONNX Runtime, Klein, Pocket TTS (weights, tokenizer, code) and Rust are at the pinned versions.")
        return
    for title, body in found:
        print(f"NEW: {title}\n     {body.splitlines()[0]}")
    if not a.open_issues:
        return
    token = os.environ.get("GITHUB_TOKEN")
    repo = os.environ.get("GITHUB_REPOSITORY") or pins["release"]["repository"]
    if not token:
        fail("--open-issues needs GITHUB_TOKEN")
    titles = existing_titles(repo, token)
    for title, body in found:
        if title in titles:
            print(f"issue already there: {title}")
            continue
        issue = fetch_json(f"https://api.github.com/repos/{repo}/issues", token, method="POST",
                           accept="application/vnd.github+json",
                           data={"title": title, "body": body + "\n\nOpened by the weekly check (.github/workflows/versions.yml)."})
        print(f"opened {issue['html_url']}")


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="command", required=True)
    b = sub.add_parser("build")
    b.add_argument("out")
    b.add_argument("--onnxruntime")
    b.add_argument("--klein")
    b.add_argument("--pocket-weights")
    b.add_argument("--pocket-tokenizer")
    b.add_argument("--pocket-code")
    b.add_argument("--rebuild")
    b.add_argument("--cache", default=str(CACHE))
    b.add_argument("--venv", default=str(CACHE / "venv"))
    b.add_argument("--work", default=None, help="where the temporary folder goes (default: the system's)")
    c = sub.add_parser("check")
    c.add_argument("--open-issues", action="store_true")
    c.add_argument("--pins", default=str(PINS))
    c.add_argument("--toolchain", default=str(ROOT / "rust-toolchain.toml"))
    a = ap.parse_args(argv)
    build(a) if a.command == "build" else check(a)


if __name__ == "__main__":
    main(sys.argv[1:])
