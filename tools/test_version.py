# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of tools/version.py: when a push to main releases a version, which tags the Release workflow takes,
and marking a version released. Standard library only; every test works on a copy of the files version.py
reads, never on the repository's own.

    python3 -I -m unittest discover -s tools -p 'test_*.py'
"""
import contextlib
import io
import pathlib
import shutil
import sys
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import version  # noqa: E402

CARGO = '''[workspace]
members = ["crates/app"]

[workspace.package]
version = "0.1.0"
edition = "2024"
rust-version = "1.100"
'''
LOCK = '''version = 4

[[package]]
name = "kalliope"
version = "0.1.0"

[[package]]
name = "serde"
version = "1.0.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
'''
METAINFO = '''<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <releases>
    <release version="0.1" date="2026-11-12" type="development">
      <description>
        <p>The first version.</p>
      </description>
    </release>
  </releases>
</component>
'''
PKGBUILD = "pkgname=kalliope-bin\npkgver=0.1\npkgrel=1\n"
CHANGELOG = '''# Changes

Kalliope's versions go up one step at a time.

## 0.1 — not yet released

The first version, for Linux.

- **The window.** Type, press Enter, and Kalliope
  speaks.
'''
TOOLCHAIN = '[toolchain]\nchannel = "1.100.0"\n'


class Tree(unittest.TestCase):
    """A copy of the files version.py keeps in step, with version 0.1 not yet released."""

    def setUp(self):
        self.root = pathlib.Path(tempfile.mkdtemp(prefix="kalliope-test-version-"))
        self.addCleanup(shutil.rmtree, self.root, True)
        files = {
            "CARGO": ("Cargo.toml", CARGO),
            "LOCK": ("Cargo.lock", LOCK),
            "METAINFO": ("packaging/linux/io.github.sansevieria_ou.kalliope.metainfo.xml", METAINFO),
            "PKGBUILD": ("packaging/aur/PKGBUILD", PKGBUILD),
            "CHANGELOG": ("CHANGELOG.md", CHANGELOG),
            "TOOLCHAIN": ("rust-toolchain.toml", TOOLCHAIN),
        }
        patches = {"ROOT": self.root}
        for name, (path, text) in files.items():
            file = self.root / path
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(text, encoding="utf-8")
            patches[name] = file
        for name, value in patches.items():
            patcher = mock.patch.object(version, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def run_version(self, *args):
        """Runs version.py ARGS; returns (output as a dict of key=value lines, other output, stderr)."""
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            version.main(list(args))
        pairs = dict(line.split("=", 1) for line in out.getvalue().splitlines() if "=" in line)
        return pairs, out.getvalue(), err.getvalue()

    def fails(self, *args):
        """Runs version.py ARGS, which must fail; returns its message."""
        with self.assertRaises(SystemExit) as stop, contextlib.redirect_stdout(io.StringIO()), \
                contextlib.redirect_stderr(io.StringIO()):
            version.main(list(args))
        return str(stop.exception.code)

    def read(self, name):
        return getattr(version, name).read_text(encoding="utf-8")


class Due(Tree):
    """`due`: does a push of this tree to main release a version?"""

    def test_a_version_not_yet_released_releases_nothing(self):
        found, _, err = self.run_version("due", "v0.1-rc.1", "assets")
        self.assertEqual(found, {"tag": "v0.1", "release": "false"})
        self.assertIn("not yet released", err)

    def test_a_version_marked_released_without_a_tag_is_released(self):
        self.run_version("release", "2026-11-21")
        # The old test version's tag is another tag: it does not count as v0.1.
        found, _, err = self.run_version("due", "v0.1-rc.1", "assets")
        self.assertEqual(found, {"tag": "v0.1", "release": "true"})
        self.assertIn("releases v0.1", err)

    def test_a_version_already_tagged_releases_nothing(self):
        self.run_version("release", "2026-11-21")
        # As `git ls-remote --tags` lists them, with or without --refs, and as plain names.
        for tags in (["v0.1"], ["refs/tags/v0.1"], ["refs/tags/v0.1-rc.1", "refs/tags/v0.1^{}"]):
            with self.subTest(tags=tags):
                found, _, err = self.run_version("due", *tags)
                self.assertEqual(found, {"tag": "v0.1", "release": "false"})
                self.assertIn("already tagged", err)

    def test_no_tags_at_all(self):
        self.run_version("release", "2026-11-21")
        self.assertEqual(self.run_version("due")[0]["release"], "true")

    def test_a_marked_version_with_a_todo_is_due_and_then_refused(self):
        # `due` says yes (the push means to release it); `tag` stops the release before anything is built.
        self.run_version("release", "2026-11-21")
        version.CHANGELOG.write_text(self.read("CHANGELOG") + "- TODO: one more line.\n", encoding="utf-8")
        self.assertEqual(self.run_version("due")[0]["release"], "true")
        self.assertIn("TODO", self.fails("tag", "v0.1"))


class Tag(Tree):
    """`tag`: the tags the Release workflow takes."""

    def test_no_test_versions(self):
        self.run_version("release", "2026-11-21")
        for tag in ("v0.1-rc.1", "v0.1-rc.2", "v0.2-beta.1", "v1.0-test.1"):
            with self.subTest(tag=tag):
                self.assertIn("no test versions", self.fails("tag", tag))
                self.assertIn("is not a release tag", self.fails("notes", tag))

    def test_not_a_tag(self):
        for tag in ("0.1", "v0.1.0", "v1", "release-0.1", "assets"):
            with self.subTest(tag=tag):
                self.assertIn("is not a release tag", self.fails("tag", tag))

    def test_a_tag_of_the_workflow_is_a_prerelease_and_skips_the_checks(self):
        found, _, _ = self.run_version("tag", "v0.0-test.4")
        self.assertEqual(found, {"version": "0.0-test.4", "package_version": "0.0~test.4", "prerelease": "true",
                                 "test": "true"})
        _, out, _ = self.run_version("notes", "v0.0-test.4")
        self.assertIn("A test of the release workflow", out)

    def test_a_version_is_final_once_marked_released(self):
        self.assertIn("not yet released", self.fails("tag", "v0.1"))
        self.run_version("release", "2026-11-21")
        found, _, _ = self.run_version("tag", "v0.1")
        self.assertEqual(found, {"version": "0.1", "package_version": "0.1", "prerelease": "false", "test": "false"})

    def test_the_tag_must_be_the_version_of_the_tree(self):
        self.run_version("release", "2026-11-21")
        self.assertIn("does not match", self.fails("tag", "v0.2"))

    def test_appstream_must_be_marked_too(self):
        self.run_version("release", "2026-11-21")
        version.METAINFO.write_text(METAINFO, encoding="utf-8")
        self.assertIn("development release", self.fails("tag", "v0.1"))

    def test_the_files_must_agree(self):
        self.run_version("release", "2026-11-21")
        version.PKGBUILD.write_text(PKGBUILD.replace("pkgver=0.1", "pkgver=0.0"), encoding="utf-8")
        self.fails("tag", "v0.1")

    def test_notes_are_the_changelog_section_unwrapped(self):
        _, out, _ = self.run_version("notes", "v0.1")
        self.assertIn("- **The window.** Type, press Enter, and Kalliope speaks.", out)
        self.assertNotIn("## 0.1", out)


class Release(Tree):
    """`release DATE` marks the version released, and run again moves the date."""

    def test_marks_changelog_and_appstream(self):
        _, out, _ = self.run_version("release", "2026-11-21")
        self.assertIn("## 0.1 — 21 November 2026\n", self.read("CHANGELOG"))
        self.assertIn('<release version="0.1" date="2026-11-21">', self.read("METAINFO"))
        self.assertNotIn("development", self.read("METAINFO"))
        self.assertIn("push", out)

    def test_run_again_changes_the_date(self):
        self.run_version("release", "2026-11-21")
        self.run_version("release", "2026-12-03")
        changelog, metainfo = self.read("CHANGELOG"), self.read("METAINFO")
        self.assertIn("## 0.1 — 3 December 2026\n", changelog)
        self.assertNotIn("21 November", changelog)
        self.assertEqual(metainfo.count("<release "), 1)
        self.assertIn('<release version="0.1" date="2026-12-03">', metainfo)
        self.assertEqual(self.run_version("tag", "v0.1")[0]["prerelease"], "false")

    def test_not_a_date(self):
        self.assertIn("is not a date", self.fails("release", "21/11/2026"))

    def test_the_next_version_starts_unreleased(self):
        self.run_version("release", "2026-11-21")
        self.run_version("set", "0.2")
        found, _, _ = self.run_version("due", "v0.1")
        self.assertEqual(found, {"tag": "v0.2", "release": "false"})
        self.assertIn("## 0.2 — not yet released", self.read("CHANGELOG"))
        self.assertIn("- TODO: what this version brings.", self.read("CHANGELOG"))
        self.assertEqual(self.run_version()[1].strip(), "0.2")


if __name__ == "__main__":
    unittest.main()
