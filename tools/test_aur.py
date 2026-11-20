# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Tests of tools/aur.py: the kalliope-bin recipe for AUR and its pkgrel. Standard library only, no network.

    python3 -I -m unittest discover -s tools -p 'test_*.py'
"""
import contextlib
import io
import pathlib
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import aur  # noqa: E402

SHA = "a" * 64
OTHER = "b" * 64


class Recipe(unittest.TestCase):
    def setUp(self):
        self.tmp = pathlib.Path(tempfile.mkdtemp(prefix="kalliope-test-aur-"))
        self.addCleanup(shutil.rmtree, self.tmp, True)
        self.aur = self.tmp / "aur"
        self.aur.mkdir()

    def write(self, version="0.1", sha=SHA):
        out = self.tmp / "out"
        shutil.rmtree(out, ignore_errors=True)
        printed = io.StringIO()
        with contextlib.redirect_stdout(printed):
            aur.write(version, sha, out, self.aur)
        found = dict(line.split("=", 1) for line in printed.getvalue().splitlines())
        return found, (out / "PKGBUILD").read_text(encoding="utf-8")

    def publish(self, out_text):
        """What AUR has after a push of OUT."""
        (self.aur / "PKGBUILD").write_text(out_text, encoding="utf-8")
        shutil.copy(self.tmp / "out" / "LICENSE", self.aur / "LICENSE")

    def test_the_repository_recipe_is_filled(self):
        found, text = self.write()
        self.assertEqual(found, {"pkgver": "0.1", "pkgrel": "1", "changed": "true"})
        self.assertIn("\npkgver=0.1\n", text)
        self.assertIn("\npkgrel=1\n", text)
        self.assertIn(f"\nsha256sums=('{SHA}')\n", text)
        self.assertNotIn("SKIP", text)
        # The rest is the repository's recipe, line for line.
        template = aur.TEMPLATE.read_text(encoding="utf-8")
        self.assertEqual(len(text.splitlines()), len(template.splitlines()))
        self.assertIn("pkgname=kalliope-bin", text)
        self.assertEqual((self.tmp / "out" / "LICENSE").read_bytes(), aur.LICENSE.read_bytes())

    def test_the_same_files_again_publish_nothing(self):
        _, text = self.write()
        self.publish(text)
        found, again = self.write()
        self.assertEqual(found, {"pkgver": "0.1", "pkgrel": "1", "changed": "false"})
        self.assertEqual(again, text)

    def test_the_same_version_with_other_files_takes_one_more_pkgrel(self):
        _, text = self.write()
        self.publish(text)
        found, again = self.write(sha=OTHER)
        self.assertEqual(found, {"pkgver": "0.1", "pkgrel": "2", "changed": "true"})
        self.assertIn("\npkgrel=2\n", again)
        self.publish(again)
        # A changed recipe (here: AUR's copy differs in a comment) also counts.
        (self.aur / "PKGBUILD").write_text(again.replace("# Maintainer", "# Old maintainer"), encoding="utf-8")
        self.assertEqual(self.write(sha=OTHER)[0]["pkgrel"], "3")

    def test_a_missing_licence_on_aur_takes_one_more_pkgrel(self):
        _, text = self.write()
        self.publish(text)
        (self.aur / "LICENSE").unlink()
        self.assertEqual(self.write()[0], {"pkgver": "0.1", "pkgrel": "2", "changed": "true"})

    def test_a_new_version_starts_again_at_one(self):
        _, text = self.write()
        self.publish(text)
        self.publish(self.write(sha=OTHER)[1])
        found, _ = self.write("0.2")
        self.assertEqual(found, {"pkgver": "0.2", "pkgrel": "1", "changed": "true"})
        # 0.10 comes after 0.9.
        (self.aur / "PKGBUILD").write_text(text.replace("pkgver=0.1", "pkgver=0.9"), encoding="utf-8")
        self.assertEqual(self.write("0.10")[0]["pkgrel"], "1")

    def test_never_back_to_an_older_version(self):
        _, text = self.write("0.2")
        self.publish(text)
        with self.assertRaises(SystemExit) as stop:
            self.write("0.1")
        self.assertIn("newer", str(stop.exception))

    def test_only_published_versions(self):
        for version in ("0.1-rc.1", "0.0-test.1", "0.1.0", "v0.1", ""):
            with self.subTest(version=version), self.assertRaises(SystemExit):
                self.write(version)
        with self.assertRaises(SystemExit):
            self.write(sha="SKIP")

    def test_a_strange_recipe_on_aur_stops(self):
        (self.aur / "PKGBUILD").write_text("pkgname=kalliope-bin\npkgver=0.1_rc.1\npkgrel=1\n", encoding="utf-8")
        with self.assertRaises(SystemExit):
            self.write()


if __name__ == "__main__":
    unittest.main()
