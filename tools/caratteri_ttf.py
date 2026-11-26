# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""TTF from the woff2 files of the design system: the faces the program embeds (Slint reads TTF, OTF and TTC, not WOFF).

    python3 -I tools/caratteri_ttf.py FILE.woff2 [...]   write FILE.ttf next to each (lossless: the same glyphs, tables and rules)
    python3 -I tools/caratteri_ttf.py --check            every X.ttf that sits next to an X.woff2 in design-system/caratteri/ is
                                                         what X.woff2 gives; exit 1 if one is stale

The rule: a script's face is made once, by the recipe in design-system/caratteri/LEGGIMI.md, as a woff2 subset; the window's
copy is derived from it by this tool and checked in CI, never copied by hand. A face already a TTF at its source (Lexend:
caratteri/lexend/Lexend-wght.ttf) has no woff2 of the same name and is used as it is. To add the face of a script to the window:
make its TTF with this tool, add one line `--app-carattere-NAME: url("caratteri/…/Face.ttf")` to token.css. Needs fontTools and brotli
(python3 -m pip install fonttools brotli; the versions are in materiali-locali/playwright/requirements.txt).
"""
import io
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CARATTERI = ROOT / "design-system" / "caratteri"


def converti(woff2):
    """The bytes of the TTF a woff2 file contains."""
    from fontTools.ttLib import TTFont
    # recalcTimestamp=False: the file keeps the date it has, so the same woff2 always gives the same bytes.
    font = TTFont(woff2, recalcTimestamp=False)
    font.flavor = None
    out = io.BytesIO()
    font.save(out)
    return out.getvalue()


def vecchi():
    """The TTF files that are derived from a woff2 and no longer equal to it."""
    return [ttf for ttf in sorted(CARATTERI.rglob("*.ttf")) if ttf.with_suffix(".woff2").exists() and ttf.read_bytes() != converti(ttf.with_suffix(".woff2"))]


def main(argv):
    if argv == ["--check"]:
        old = vecchi()
        for ttf in old:
            print(f"{ttf}: not what {ttf.with_suffix('.woff2').name} gives; run python3 -I tools/caratteri_ttf.py {ttf.with_suffix('.woff2')}")
        return 1 if old else 0
    if not argv or argv[0].startswith("-"):
        print(__doc__, file=sys.stderr)
        return 2
    for name in argv:
        woff2 = pathlib.Path(name)
        if woff2.suffix != ".woff2" or not woff2.is_file():
            print(f"{name} is not a woff2 file", file=sys.stderr)
            return 2
        woff2.with_suffix(".ttf").write_bytes(converti(woff2))
        print(woff2.with_suffix(".ttf"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
