# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The fake portal's command line: the theme, and the file chooser that «Usa vecchie registrazioni» is tested against."""
import importlib.util
import pathlib
import unittest

SPEC = importlib.util.spec_from_file_location("portale_finto", pathlib.Path(__file__).with_name("portale_finto.py"))
portale = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(portale)


class CommandLine(unittest.TestCase):
    def test_the_theme_alone_serves_no_chooser(self):
        scheme, flip, command, chooser = portale.parse(["dark", "--", "kalliope", "--demo"])
        self.assertEqual((scheme, flip, command), ("dark", None, ["kalliope", "--demo"]))
        self.assertIsNone(chooser["file"])
        self.assertFalse(chooser["cancel"])

    def test_a_file_a_delay_and_a_log_for_the_chooser(self):
        _, _, _, chooser = portale.parse(
            ["light", "--scegli", "/tmp/voce.opus", "--ritardo", "0.1", "--registro", "/tmp/chiamata.json", "--", "x"]
        )
        self.assertEqual(chooser["file"], "/tmp/voce.opus")
        self.assertEqual(chooser["delay"], 0.1)
        self.assertEqual(chooser["log"], "/tmp/chiamata.json")

    def test_a_control_file_lets_one_run_answer_different_files(self):
        _, _, _, chooser = portale.parse(["dark", "--scegli", "@/tmp/scelta.txt"])
        self.assertTrue(chooser["file"].startswith("@"))

    def test_cancel_and_flip_together(self):
        scheme, flip, _, chooser = portale.parse(["none", "--annulla", "--flip-after", "2", "dark"])
        self.assertEqual((scheme, flip), ("none", (2.0, "dark")))
        self.assertTrue(chooser["cancel"])

    def test_an_unknown_option_is_refused(self):
        with self.assertRaises(SystemExit):
            portale.parse(["dark", "--scegli"])
        with self.assertRaises(SystemExit):
            portale.parse(["dark", "--boh"])
        with self.assertRaises(SystemExit):
            portale.parse(["viola"])


if __name__ == "__main__":
    unittest.main()
