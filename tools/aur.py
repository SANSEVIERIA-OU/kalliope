#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Writes kalliope-bin for AUR: packaging/aur/PKGBUILD with a published version, the SHA-256 of its tarball and
the pkgrel that follows what AUR already has, and the licence of the recipe. Used by .github/workflows/aur.yml;
standard library only. See docs/releasing.md, "Arch Linux (AUR)".

    aur.py write VERSION SHA256 OUT [--current DIR]

VERSION is a published version (0.1; never a test of the workflow). DIR is a clone of the AUR package as it is
now (empty for a package not yet on AUR). OUT gets PKGBUILD and LICENSE; .SRCINFO is then written from the
PKGBUILD by makepkg, on Arch. Prints pkgver=, pkgrel= and changed=true|false (false when AUR already has
exactly these files: nothing to publish).

pkgrel is 1 for a version that AUR does not have yet. When AUR has this version with other files (the recipe
changed, or the tarball was published again), it is one more than AUR's, so that pacman offers the new build to
whoever installed the earlier one. A version older than AUR's is refused.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "packaging/aur/PKGBUILD"
# The recipe is under the licence its SPDX line names (LicenseRef-SANSEVIERIA-1.1); AUR asks every package for
# the licence of its sources (ArchWiki, AUR submission guidelines).
LICENSE = ROOT / "LICENSE"
VERSION = re.compile(r"\d+\.\d+")
SHA256 = re.compile(r"[0-9a-f]{64}")


def fail(message):
    sys.exit(f"aur.py: {message}")


def value(text, key):
    match = re.search(rf"^{key}=(\S+)$", text, re.M)
    return match.group(1) if match else None


def fill(template, version, sha256, pkgrel):
    """The template with this version, checksum and pkgrel; fails if a line to fill is missing."""
    text = template
    for key, new in (("pkgver", version), ("pkgrel", str(pkgrel)), ("sha256sums", f"('{sha256}')")):
        text, found = re.subn(rf"^{key}=.*$", f"{key}={new}", text, count=1, flags=re.M)
        if not found:
            fail(f"{TEMPLATE.relative_to(ROOT)} has no {key}= line")
    return text


def number(version):
    return tuple(int(n) for n in version.split("."))


def plan(template, licence, version, sha256, current, current_licence):
    """(PKGBUILD text, pkgrel, changed) for VERSION, given AUR's PKGBUILD and LICENSE (None when absent)."""
    if not VERSION.fullmatch(version):
        fail(f"{version!r} is not a published version like 0.1")
    if not SHA256.fullmatch(sha256):
        fail(f"{sha256!r} is not a SHA-256")
    if not current:
        return fill(template, version, sha256, 1), 1, True
    aur_version, aur_rel = value(current, "pkgver"), value(current, "pkgrel")
    if not (aur_version and VERSION.fullmatch(aur_version) and aur_rel and aur_rel.isdigit()):
        fail(f"AUR's PKGBUILD has pkgver={aur_version} pkgrel={aur_rel}, not a version of Kalliope")
    if number(aur_version) > number(version):
        fail(f"AUR has {aur_version}, newer than {version}: not going back")
    if aur_version != version:
        return fill(template, version, sha256, 1), 1, True
    same = fill(template, version, sha256, int(aur_rel))
    if same == current and licence == current_licence:
        return same, int(aur_rel), False
    return fill(template, version, sha256, int(aur_rel) + 1), int(aur_rel) + 1, True


def write(version, sha256, out, current_dir=None):
    def maybe(path):
        return path.read_text(encoding="utf-8") if path and path.is_file() else None

    current_dir = pathlib.Path(current_dir) if current_dir else None
    licence = LICENSE.read_text(encoding="utf-8")
    text, pkgrel, changed = plan(TEMPLATE.read_text(encoding="utf-8"), licence, version, sha256,
                                 maybe(current_dir and current_dir / "PKGBUILD"),
                                 maybe(current_dir and current_dir / "LICENSE"))
    out = pathlib.Path(out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "PKGBUILD").write_text(text, encoding="utf-8")
    (out / "LICENSE").write_text(licence, encoding="utf-8")
    print(f"pkgver={version}")
    print(f"pkgrel={pkgrel}")
    print(f"changed={'true' if changed else 'false'}")


def main(args):
    if len(args) in (4, 6) and args[0] == "write" and (len(args) == 4 or args[4] == "--current"):
        write(args[1], args[2], args[3], args[5] if len(args) == 6 else None)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
