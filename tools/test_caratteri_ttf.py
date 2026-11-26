# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""tools/caratteri_ttf.py: the TTF is the woff2's font, byte for byte the same every time, and a stale copy is caught."""
import pathlib
import shutil
import subprocess
import sys
import tempfile
import unittest

import caratteri_ttf

try:
    import brotli  # noqa: F401
    from fontTools.ttLib import TTFont
except ImportError:  # CI installs them for this check (python3 -m pip install fonttools brotli)
    TTFont = None

WOFF2 = caratteri_ttf.CARATTERI / "readex-pro" / "ReadexPro-wght.woff2"


@unittest.skipIf(TTFont is None, "fontTools and brotli are not installed")
class Derivation(unittest.TestCase):
    def test_same_glyphs_tables_and_bytes_every_time(self):
        first = caratteri_ttf.converti(WOFF2)
        self.assertEqual(first, caratteri_ttf.converti(WOFF2))
        import io
        ttf, woff = TTFont(io.BytesIO(first)), TTFont(WOFF2)
        self.assertIsNone(ttf.flavor)
        self.assertEqual(ttf.getGlyphOrder(), woff.getGlyphOrder())
        self.assertEqual(ttf.getBestCmap(), woff.getBestCmap())
        self.assertIn("GSUB", ttf)
        self.assertIn("fvar", ttf, "the weight axis stays")

    def test_the_check_passes_on_the_design_system_and_fails_on_a_stale_copy(self):
        self.assertEqual(caratteri_ttf.vecchi(), [])
        with tempfile.TemporaryDirectory() as tmp:
            old = pathlib.Path(tmp) / "caratteri"
            old.mkdir()
            shutil.copy(WOFF2, old / "F.woff2")
            (old / "F.ttf").write_bytes(b"not the font")
            real = caratteri_ttf.CARATTERI
            caratteri_ttf.CARATTERI = old
            try:
                self.assertEqual([p.name for p in caratteri_ttf.vecchi()], ["F.ttf"])
                (old / "F.ttf").write_bytes(caratteri_ttf.converti(old / "F.woff2"))
                self.assertEqual(caratteri_ttf.vecchi(), [])
            finally:
                caratteri_ttf.CARATTERI = real

    def test_the_command_writes_the_file_next_to_the_woff2(self):
        with tempfile.TemporaryDirectory() as tmp:
            shutil.copy(WOFF2, pathlib.Path(tmp) / "F.woff2")
            done = subprocess.run([sys.executable, "-I", str(pathlib.Path(__file__).with_name("caratteri_ttf.py")), str(pathlib.Path(tmp) / "F.woff2")], capture_output=True, text=True)
            self.assertEqual(done.returncode, 0, done.stderr)
            self.assertEqual((pathlib.Path(tmp) / "F.ttf").read_bytes(), caratteri_ttf.converti(WOFF2))


class Usage(unittest.TestCase):
    def test_no_arguments_and_wrong_files_are_errors(self):
        script = str(pathlib.Path(__file__).with_name("caratteri_ttf.py"))
        self.assertEqual(subprocess.run([sys.executable, "-I", script], capture_output=True).returncode, 2)
        self.assertEqual(subprocess.run([sys.executable, "-I", script, "nothing.txt"], capture_output=True).returncode, 2)


if __name__ == "__main__":
    unittest.main()
