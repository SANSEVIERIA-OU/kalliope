# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of tools/fetch_assets.py and tools/release_assets.py. Standard library only, no network: the
release is a folder read through file:// URLs, and the upstream answers of `check` are canned.

    python3 -I -m unittest discover -s tools -p 'test_*.py'
"""
import contextlib
import hashlib
import io
import json
import os
import pathlib
import shutil
import sys
import tarfile
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import fetch_assets  # noqa: E402
import release_assets  # noqa: E402


def sha(data):
    return hashlib.sha256(data).hexdigest()


class Store(unittest.TestCase):
    """A release with one part, made by release_assets.pack and pinned as release_assets pins it."""

    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="kalliope-test-assets-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        no_wait = mock.patch.object(fetch_assets.time, "sleep")  # a failed download is tried three times
        no_wait.start()
        self.addCleanup(no_wait.stop)
        src = self.tmp / "src"
        (src / "lib").mkdir(parents=True)
        (src / "model.onnx").write_bytes(b"\x08\x01" * 1000)
        (src / "LICENSE").write_text("licence\n")
        (src / "lib" / "libonnxruntime.so.1.2.3").write_bytes(b"\x7fELF" + bytes(500))
        self.release = self.tmp / "release"
        self.release.mkdir()
        archive = self.release / "part-1.tar.xz"
        contents = release_assets.pack(src, "part-1", archive)
        self.entry = {"name": archive.name, "size": archive.stat().st_size, "sha256": release_assets.sha256(archive),
                      "folder": "part-1", "contents": contents}
        self.base = self.release.as_uri() + "/"
        self.dest = self.tmp / "dest"
        self.dest.mkdir()

    def test_pack_is_the_same_every_time_and_lists_its_files(self):
        again = self.tmp / "again.tar.xz"
        release_assets.pack(self.tmp / "src", "part-1", again)
        self.assertEqual(again.read_bytes(), (self.release / "part-1.tar.xz").read_bytes())
        self.assertEqual(sorted(self.entry["contents"]), ["LICENSE", "lib/libonnxruntime.so.1.2.3", "model.onnx"])
        self.assertEqual(self.entry["contents"]["LICENSE"], sha(b"licence\n"))
        with tarfile.open(again) as tar:
            modes = {m.name: (m.mode, m.uid, m.mtime) for m in tar.getmembers()}
        self.assertEqual(modes["part-1/lib/libonnxruntime.so.1.2.3"], (0o755, 0, release_assets.MTIME))
        self.assertEqual(modes["part-1/model.onnx"], (0o644, 0, release_assets.MTIME))

    def test_downloads_checks_and_unpacks(self):
        folder = fetch_assets.part(self.dest, self.entry, self.base)
        self.assertEqual(folder, self.dest / "part-1")
        self.assertEqual((folder / "LICENSE").read_text(), "licence\n")
        self.assertFalse((self.dest / "part-1.tar.xz").exists())

    def test_a_spoilt_download_fails_and_leaves_nothing(self):
        archive = self.release / "part-1.tar.xz"
        data = bytearray(archive.read_bytes())
        data[len(data) // 2] ^= 0xFF
        archive.write_bytes(bytes(data))
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as e:
            fetch_assets.part(self.dest, self.entry, self.base)
        self.assertIn("sha256", str(e.exception))
        self.assertEqual(list(self.dest.iterdir()), [])

    def test_an_archive_with_other_files_than_pinned_is_refused(self):
        entry = dict(self.entry, contents={**self.entry["contents"], "extra.txt": sha(b"")})
        with self.assertRaises(SystemExit) as e:
            fetch_assets.part(self.dest, entry, self.base)
        self.assertIn("does not hold the pinned files", str(e.exception))

    def test_a_folder_already_there_is_checked_and_kept_or_fetched_again(self):
        folder = fetch_assets.part(self.dest, self.entry, self.base)
        (self.release / "part-1.tar.xz").unlink()  # kept: nothing is downloaded
        self.assertEqual(fetch_assets.part(self.dest, self.entry, self.base), folder)
        (folder / "model.onnx").write_bytes(b"changed")  # spoilt: downloaded again, and the release is gone
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            fetch_assets.part(self.dest, self.entry, self.base)

    def test_the_command_prints_the_variables(self):
        pins = {"release": {"repository": "o/r", "tag": "assets"},
                "files": {"klein": self.entry, "pocket": self.entry, "recording": dict(self.entry)}}
        pins["files"]["recording"]["contents"] = {**self.entry["contents"]}
        path = self.tmp / "assets.json"
        path.write_text(json.dumps(pins))
        out = io.StringIO()
        with mock.patch.object(fetch_assets, "PINS", path), mock.patch.dict(os.environ, {"KALLIOPE_ASSETS_URL": self.base}), \
                contextlib.redirect_stdout(out):
            fetch_assets.main(["model", str(self.dest)])
            fetch_assets.main(["pocket", str(self.dest)])
        self.assertEqual(out.getvalue().splitlines(),
                         [f"KALLIOPE_MODEL_DIR={self.dest / 'part-1'}", f"KALLIOPE_POCKET_DIR={self.dest / 'part-1'}"])


class Names(unittest.TestCase):
    def test_a_new_file_never_takes_a_name_already_used(self):
        self.assertEqual(release_assets.free_name("pocket-tts-italian-3e82814", set()), "pocket-tts-italian-3e82814.tar.xz")
        taken = {"pocket-tts-italian-3e82814.tar.xz", "pocket-tts-italian-3e82814-2.tar.xz"}
        self.assertEqual(release_assets.free_name("pocket-tts-italian-3e82814", taken), "pocket-tts-italian-3e82814-3.tar.xz")

    def test_git_ids_as_hugging_face_lists_them(self):
        tmp = pathlib.Path(tempfile.mkdtemp(prefix="kalliope-test-oid-"))
        self.addCleanup(shutil.rmtree, tmp, True)
        f = tmp / "hello"
        f.write_bytes(b"hello\n")
        self.assertEqual(release_assets.git_oid(f, lfs=False), "ce013625030ba8dba906f756967f9e9ca394464a")  # git hash-object
        pointer = f"version https://git-lfs.github.com/spec/v1\noid sha256:{sha(b'hello' + bytes(1))}\nsize 6\n"
        f.write_bytes(b"hello" + bytes(1))
        self.assertEqual(release_assets.git_oid(f, lfs=True), release_assets.git_blob(pointer.encode()))


PINS = json.loads((pathlib.Path(__file__).resolve().parent / "assets.json").read_text())


def upstream(pins, ort="1.32.0", rust="1.100.0", klein_oid=None, weights_oid=None, code_status="behind"):
    """Canned answers of NuGet, Hugging Face, GitHub and Rust, as they were on 2026-11-19 unless changed."""
    s = pins["sources"]
    k, w, t = s["klein"], s["pocket"]["weights"], s["pocket"]["tokenizer"]

    def fetch_json(url, token=None, **kw):
        if "nuget" in url:
            return {"versions": ["1.31.1", "1.32.0", "1.33.0-dev"] + ([ort] if ort != "1.32.0" else [])}
        if "/revision/main" in url:
            return {"sha": "f" * 40}
        if "huggingface.co/api/models/" + k["repository"] in url:
            entries = [{"type": "file", "path": p, "oid": pin["oid"]} for p, pin in k["files"].items()]
            if klein_oid:
                entries[0]["oid"] = klein_oid
            return entries
        if "huggingface.co/api/models/" + w["repository"] + "/tree" in url:
            return [{"type": "file", "path": w["path"], "oid": weights_oid or w["oid"], "lfs": {"oid": "*" * 64}}]
        if "huggingface.co/api/models/" + t["repository"] in url:
            return [{"type": "file", "path": t["path"], "oid": t["oid"]}]
        if "/commits?" in url:
            return [{"sha": "1773f648" + "0" * 32}]
        if "/compare/" in url:
            return {"status": code_status}
        raise AssertionError(url)

    def fetch(url, token=None, **kw):
        assert "channel-rust-stable" in url, url
        return f'[pkg.rust]\nversion = "{rust} (0ef1bc386 2026-11-09)"\n'.encode()

    return mock.patch.multiple(release_assets, fetch_json=fetch_json, fetch=fetch)


class WeeklyCheck(unittest.TestCase):
    toolchain = str(pathlib.Path(__file__).resolve().parent.parent / "rust-toolchain.toml")

    def test_nothing_new_when_upstream_is_at_the_pins(self):
        with upstream(PINS):
            self.assertEqual(release_assets.newer(PINS, self.toolchain), [])

    def test_each_new_version_has_its_own_title(self):
        with upstream(PINS, ort="1.33.0", rust="1.101.0", klein_oid="a" * 40, weights_oid="b" * 40, code_status="ahead"):
            titles = [title for title, _ in release_assets.newer(PINS, self.toolchain)]
        self.assertEqual(titles, ["ONNX Runtime 1.33.0 is out", "Klein-TTS-X1.5-Pro: new files at fffffff",
                                  "Pocket TTS Italian weights: new file at fffffff",
                                  "Pocket TTS code: pocket_tts/ changed at 1773f64", "Rust 1.101.0 is out"])

    def test_an_issue_is_opened_once(self):
        args = mock.Mock(pins=str(pathlib.Path(__file__).resolve().parent / "assets.json"), toolchain=self.toolchain, open_issues=True)
        posted = []

        def fetch_json(url, token=None, method=None, data=None, **kw):
            if method == "POST":
                posted.append(data["title"])
                return {"html_url": "https://x/1"}
            return [{"title": "Rust 1.101.0 is out"}]

        with mock.patch.object(release_assets, "newer", return_value=[("Rust 1.101.0 is out", "b"), ("ONNX Runtime 1.33.0 is out", "b")]), \
                mock.patch.object(release_assets, "fetch_json", fetch_json), mock.patch.dict(os.environ, {"GITHUB_TOKEN": "t"}), \
                contextlib.redirect_stdout(io.StringIO()):
            release_assets.check(args)
        self.assertEqual(posted, ["ONNX Runtime 1.33.0 is out"])


if __name__ == "__main__":
    unittest.main()
