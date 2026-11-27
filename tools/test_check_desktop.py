# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The appearance check of tools/check_desktop.py on Linux: a dark window passes as dark and fails as light, and the other way."""
import pathlib
import shutil
import subprocess
import tempfile
import unittest

import check_desktop

HAS_CONVERT = shutil.which("convert") is not None


def picture(folder, name, colour):
    path = pathlib.Path(folder) / name
    subprocess.run(["convert", "-size", "40x30", f"xc:{colour}", str(path)], check=True)
    return path


@unittest.skipUnless(HAS_CONVERT, "ImageMagick is not installed")
class Appearance(unittest.TestCase):
    def test_a_dark_window_is_dark_and_a_light_one_is_light(self):
        with tempfile.TemporaryDirectory() as tmp:
            check_desktop.check_appearance(picture(tmp, "desktop-window-dark.png", "#1c1c1c"))
            check_desktop.check_appearance(picture(tmp, "desktop-window-light.png", "#f3f3f3"))

    def test_the_wrong_appearance_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(RuntimeError, "should be dark"):
                check_desktop.check_appearance(picture(tmp, "desktop-window-dark.png", "#f3f3f3"))
            with self.assertRaisesRegex(RuntimeError, "should be light"):
                check_desktop.check_appearance(picture(tmp, "desktop-window-light.png", "#1c1c1c"))

    def test_a_picture_with_another_name_is_not_judged(self):
        with tempfile.TemporaryDirectory() as tmp:
            check_desktop.check_appearance(picture(tmp, "desktop-window.png", "#808080"))


class WorkArea(unittest.TestCase):
    def test_a_window_inside_the_work_area_passes(self):
        self.assertEqual(check_desktop.outside((50, 30, 970, 718), (0, 0, 1024, 720)), 0)

    def test_the_foot_under_the_taskbar_is_measured(self):
        # the Windows runner of issue #23: a 1024 × 768 screen with a 48 px taskbar, the window's foot under it
        self.assertEqual(check_desktop.outside((52, 52, 988, 740), (0, 0, 1024, 720)), 20)
        self.assertEqual(check_desktop.outside((-8, 0, 900, 700), (0, 0, 1024, 720)), 8)


if __name__ == "__main__":
    unittest.main()
