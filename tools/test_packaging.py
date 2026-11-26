# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The Linux packages ask for what the program links or loads, and for nothing else (issue #11).

Without a binary, the packaging files are checked for what must not be there (Qt, GTK, libadwaita, Python). With KALLIOPE_BINARY, the
libraries the program is linked with (readelf: NEEDED) and the ones it loads while running (dlopen, found as names in the binary) must
each be accounted for by the packages: this table says which package brings each one on Arch, Debian and Fedora. A new library in the binary
fails here until a person decides whether the packages need it."""
import os
import pathlib
import re
import shutil
import subprocess
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
PKGBUILD = (ROOT / "packaging/aur/PKGBUILD").read_text(encoding="utf-8")
BUILD = (ROOT / "packaging/linux/build-packages.sh").read_text(encoding="utf-8")
SPEC = (ROOT / "packaging/linux/kalliope.spec").read_text(encoding="utf-8")

# What the window must never ask the person to install.
FORBIDDEN = re.compile(r"qt6?|qt5|python|gobject|adwaita|gir1\.2|gtk", re.I)

# Linked at build time (readelf NEEDED): the base system, fontconfig and FreeType (Skia's), which the package manager resolves by itself
# (dpkg-shlibdeps, rpm).
LINKED = {
    "libc.so.6", "libm.so.6", "libgcc_s.so.1", "libstdc++.so.6", "libdl.so.2", "libpthread.so.0", "librt.so.1", "ld-linux-x86-64.so.2",
    "libfontconfig.so.1", "libfreetype.so.6",
}
# Loaded while running, with the package of each on Arch, Debian and Fedora and whether the packages require it (True) or only recommend it.
# libonnxruntime comes inside the package; libpipewire is the virtual microphone.
LOADED = {
    "libxkbcommon.so.0": ("libxkbcommon", "libxkbcommon0", "libxkbcommon", True),
    "libxkbcommon-x11.so.0": ("libxkbcommon-x11", "libxkbcommon-x11-0", "libxkbcommon-x11", False),
    "libwayland-client.so.0": ("wayland", "libwayland-client0", "libwayland-client", False),
    "libX11.so.6": ("libx11", "libx11-6", "libX11", False),
    "libX11-xcb.so.1": ("libx11", "libx11-xcb1", "libX11-xcb", False),
    "libXcursor.so.1": ("libxcursor", "libxcursor1", "libXcursor", False),
    "libXi.so.6": ("libxi", "libxi6", "libXi", False),
    "libpipewire-0.3.so.0": ("libpipewire", "libpipewire-0.3-0", "pipewire-libs", False),
    "libonnxruntime.so.1": None,  # in the package, next to the program
    "libXrender.so.1": None,  # opened on X11 as a dependency of libXcursor: the package manager brings it
}
# Names the program carries without ever opening them in the window it draws (the Skia CPU surface needs no OpenGL: checked with
# LD_DEBUG=libs on X11, and by /proc/PID/maps on Wayland, in finestra-unica-prove/).
NOT_OPENED = {"libEGL.so.1", "libwayland-egl.so.1"}


def depends_lines():
    pkgbuild = re.findall(r"^(?:depends|optdepends)=\(.*?\)", PKGBUILD, re.S | re.M)
    deb = [line for line in BUILD.splitlines() if re.match(r"(Depends|Recommends):", line)]
    rpm = [line for line in SPEC.splitlines() if re.match(r"(Requires|Recommends):", line)]
    return "\n".join(pkgbuild), "\n".join(deb), "\n".join(rpm)


class PackagingFiles(unittest.TestCase):
    def test_no_toolkit_and_no_python_in_the_dependencies(self):
        for name, lines in zip(("PKGBUILD", "build-packages.sh (deb)", "kalliope.spec (rpm)"), depends_lines()):
            self.assertTrue(lines.strip(), f"no dependency lines found in {name}")
            self.assertIsNone(FORBIDDEN.search(lines), f"{name} asks for a toolkit or Python:\n{lines}")

    def test_the_pkgbuild_comment_says_what_the_program_loads(self):
        comment = "\n".join(line for line in PKGBUILD.splitlines() if line.startswith("#") and "Linked:" in line or line.startswith("# the") or line.startswith("# Loaded"))
        head = PKGBUILD.split("depends=")[0]
        self.assertIsNone(FORBIDDEN.search(head), "the PKGBUILD comment still talks about a toolkit")
        for word in ("fontconfig", "libxkbcommon", "libpipewire", "wayland", "X11"):
            self.assertIn(word, head, f"the PKGBUILD comment does not mention {word}")

    def test_skia_notice_travels_with_the_program(self):
        # Skia is compiled into the binary: BSD-3-Clause asks for its notice in a binary distribution.
        notice = ROOT / "packaging/linux/third-party/Skia-LICENSE"
        self.assertIn("Copyright (c) 2011 Google Inc.", notice.read_text(encoding="utf-8"))
        self.assertIn("share/doc/kalliope/skia/LICENSE", BUILD)
        self.assertIn("/usr/share/doc/kalliope/skia/", SPEC)

    def test_every_library_the_program_loads_is_in_the_packages(self):
        arch, deb, rpm = depends_lines()
        for soname, package in LOADED.items():
            if package is None:
                continue
            a, d, r, required = package
            self.assertRegex(arch, rf"'{re.escape(a)}[':]", f"{soname}: {a} is not in the PKGBUILD")
            self.assertIn(d, deb, f"{soname}: {d} is not in the deb")
            self.assertIn(r, rpm, f"{soname}: {r} is not in the rpm")


@unittest.skipUnless(os.environ.get("KALLIOPE_BINARY"), "set KALLIOPE_BINARY to the built program")
class Binary(unittest.TestCase):
    def setUp(self):
        self.binary = pathlib.Path(os.environ["KALLIOPE_BINARY"])
        self.assertTrue(self.binary.is_file(), self.binary)

    def test_linked_libraries_are_the_declared_ones(self):
        out = subprocess.check_output(["readelf", "-d", str(self.binary)], text=True)
        needed = set(re.findall(r"\(NEEDED\)\s+Shared library: \[(.*?)\]", out))
        self.assertTrue(needed, "readelf found no NEEDED entries")
        extra = needed - LINKED
        self.assertFalse(extra, f"the program is linked with {sorted(extra)}: decide what the packages need and add it to LINKED")

    def test_no_toolkit_is_linked(self):
        ldd = subprocess.check_output(["ldd", str(self.binary)], text=True)
        self.assertIsNone(FORBIDDEN.search(ldd), ldd)

    def test_loaded_libraries_are_the_declared_ones(self):
        strings = shutil.which("strings")
        self.assertTrue(strings, "needs binutils")
        out = subprocess.check_output([strings, "-a", str(self.binary)], text=True)
        # A library the program opens is a name ending in .so.N (the X11 symbol tables around them are not).
        names = set(re.findall(r"lib[A-Za-z0-9_+-]+?\.so\.[0-9]+(?:\.[0-9]+)*", out))
        loaded = {n for n in names if n not in LINKED}
        unknown = {n for n in loaded if n not in LOADED and n not in NOT_OPENED}
        self.assertFalse(unknown, f"the program names {sorted(unknown)}: decide what the packages need and add them to LOADED")
        self.assertIsNone(FORBIDDEN.search(" ".join(sorted(names))), names)


if __name__ == "__main__":
    unittest.main()
