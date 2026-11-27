# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""tools/slint_valori.py must pass the real window and catch every kind of value written by hand."""
import pathlib
import subprocess
import sys
import tempfile
import unittest

import slint_valori

TOOLS = pathlib.Path(__file__).resolve().parent
REAL = slint_valori.UI


def run(*args):
    return subprocess.run([sys.executable, "-I", str(TOOLS / "slint_valori.py"), *args], capture_output=True, text=True)


class RealWindow(unittest.TestCase):
    def test_the_window_has_no_value_of_its_own(self):
        self.assertEqual(slint_valori.controlla(REAL), [])
        done = run()
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)

    def test_the_window_uses_the_generated_global(self):
        self.assertTrue(list(REAL.glob("*.slint")), "no .slint file under crates/app/ui")
        self.assertIn("Token.", (REAL / "app.slint").read_text(encoding="utf-8"))


class Catches(unittest.TestCase):
    def broken(self, line, name="app.slint"):
        """A copy of the real window with one line added; returns the defects."""
        with tempfile.TemporaryDirectory() as tmp:
            copy = pathlib.Path(tmp) / name
            copy.write_text((REAL / "app.slint").read_text(encoding="utf-8") + "\n" + line + "\n", encoding="utf-8")
            return slint_valori.controlla(tmp), run(tmp)

    def test_every_kind_of_hand_written_value(self):
        for line, kind in [
            ("component A { Rectangle { background: #fff; } }", "COLORE"),
            ("component A { Rectangle { background: #1b2223; } }", "COLORE"),
            ("component A { Rectangle { background: #1b222380; } }", "COLORE"),
            ("component A { Rectangle { background: rgb(27, 34, 35); } }", "COLORE"),
            ("component A { Rectangle { background: rgba(27, 34, 35, 0.5); } }", "COLORE"),
            ("component A { Rectangle { background: Colors.red; } }", "COLORE"),
            ("component A { Rectangle { background: @linear-gradient(90deg, #000 0%, Token.a 100%); } }", "COLORE"),
            ("component A { Rectangle { width: 12px; } }", "LUNGHEZZA"),
            ("component A { Rectangle { width: 1.5px; } }", "LUNGHEZZA"),
            ("component A { Rectangle { width: 1phx; } }", "LUNGHEZZA"),
            ("component A { Rectangle { width: 0.5rem; } }", "LUNGHEZZA"),
            ("component A { Rectangle { width: 10pt; } }", "LUNGHEZZA"),
            ("component A { Rectangle { font-size: 16px; } }", "LUNGHEZZA"),
            ("component A { Rectangle { animate x { duration: 200ms; } } }", "DURATA"),
            ("component A { Rectangle { animate x { duration: 1.5s; } } }", "DURATA"),
            ('component A { Rectangle { font-family: "Lexend"; } }', "CARATTERE"),
            ("component A { Rectangle { font-weight: 600; } }", "CARATTERE"),
        ]:
            with self.subTest(line=line):
                defects, process = self.broken(line)
                self.assertEqual([d[2] for d in defects], [kind], line)
                self.assertEqual(process.returncode, 1, line)
                self.assertIn(kind, process.stdout)

    def test_a_hand_written_value_in_another_file_of_the_folder(self):
        defects, process = self.broken("component B { Rectangle { height: 40px; } }", "altro.slint")
        self.assertEqual(len(defects), 1)
        self.assertEqual(process.returncode, 1)


class Allows(unittest.TestCase):
    def check(self, text, name="x.slint"):
        with tempfile.TemporaryDirectory() as tmp:
            (pathlib.Path(tmp) / name).write_text(text, encoding="utf-8")
            return slint_valori.controlla(tmp)

    def test_zero_values_tokens_numbers_comments_and_strings(self):
        self.assertEqual(
            self.check(
                """// a colour #fff and 12px in a comment
                /* 200ms
                   and rgb(1,2,3) */
                component A {
                    padding: 0px;
                    spacing: 0.0px;
                    animate x { duration: 0ms; }
                    width: Token.native-width / 2;
                    height: 2 * Token.spazio-controlli;
                    vertical-stretch: 1;
                    opacity: 0.5;
                    text: "Costa 12px, dura 200ms, colore #fff, font-family: \\"x\\"";
                    font-family: Token.font-testo;
                    font-weight: Token.peso-forte;
                    background: Token.fondo;
                    icon: @image-url("../a-12px.svg");
                }"""
            ),
            [],
        )

    def test_the_fixed_marker_and_the_generated_file(self):
        self.assertEqual(self.check("component A { width: 1px; // fisso: a hairline of one device pixel\n}"), [])
        self.assertEqual(self.check("component A { width: 1px; // fisso:\n}")[0][2], "LUNGHEZZA")
        self.assertEqual(self.check("// Generated from design-system/token.css by crates/tokens; do not edit.\nexport global Token { out property <length> a: 12px; }"), [])

    def test_a_missing_folder_is_an_error_not_a_pass(self):
        self.assertEqual(run("/nonexistent-folder-for-slint-valori").returncode, 2)


if __name__ == "__main__":
    unittest.main()
