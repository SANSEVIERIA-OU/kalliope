# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Checks that the window's .slint files carry no colour, length, duration or typeface of their own.

    python3 -I tools/slint_valori.py [DIR]     check DIR (default crates/app/ui/); exit 1 on a defect

Every value of the window comes from design-system/token.css through the generated global `Token` (crates/tokens,
design-system/TOKEN.md, «La finestra del programma»). A .slint file under DIR is a defect where it has, in code
(not in a comment or a string):

  COLORE     a colour: #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(), hsv(), Colors.name
  LUNGHEZZA  a length other than zero: 12px, 1phx, 0.5rem, 10pt
  DURATA     a duration other than zero: 200ms, 1.5s
  CARATTERE  a font family as a string, or a number as a font weight

A value that is right stays, with `// fisso: the reason` on the same line (a hairline that must be one device
pixel, say). The generated file (its first line says «Generated from design-system/token.css») is not checked.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
UI = ROOT / "crates" / "app" / "ui"

NUMERO = r"(?:\d+(?:\.\d+)?|\.\d+)"
CONTROLLI = [
    ("COLORE", re.compile(r"#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsv)\s*\(|\bColors\s*\.\s*[A-Za-z]+")),
    ("LUNGHEZZA", re.compile(r"(?<![\w#.-])(" + NUMERO + r")(?:px|phx|rem|em|pt|cm|mm|in)\b")),
    ("DURATA", re.compile(r"(?<![\w#.-])(" + NUMERO + r")(?:ms|s)\b")),
    ("CARATTERE", re.compile(r"\bfont-family\s*:\s*\"|\bfont-weight\s*:\s*\d")),
]
MARCA = re.compile(r"//\s*fisso:\s*\S")


def codice(testo):
    """The text with comments and the inside of strings blanked out, line numbers intact. A font-family string
    keeps its opening quote, so that the CARATTERE check sees it."""
    out, i, n = [], 0, len(testo)
    while i < n:
        c = testo[i]
        if c == "/" and testo[i + 1:i + 2] == "/":
            j = testo.find("\n", i)
            j = n if j < 0 else j
            out.append(" " * (j - i))
            i = j
        elif c == "/" and testo[i + 1:i + 2] == "*":
            j = testo.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append(re.sub(r"[^\n]", " ", testo[i:j]))
            i = j
        elif c == '"':
            j = i + 1
            while j < n and testo[j] != '"':
                j += 2 if testo[j] == "\\" else 1
            out.append('"' + re.sub(r"[^\n]", " ", testo[i + 1:j]) + '"')
            i = j + 1
        else:
            out.append(c)
            i += 1
    return "".join(out)


def controlla_file(path):
    testo = path.read_text(encoding="utf-8")
    if testo.startswith("// Generated from design-system/token.css"):
        return []
    righe = testo.split("\n")
    difetti = []
    for numero, riga in enumerate(codice(testo).split("\n"), 1):
        if MARCA.search(righe[numero - 1]):
            continue
        for tipo, regola in CONTROLLI:
            for m in regola.finditer(riga):
                if tipo in ("LUNGHEZZA", "DURATA") and float(m.group(1)) == 0:
                    continue
                difetti.append((path, numero, tipo, m.group(0).strip(), righe[numero - 1].strip()))
    return difetti


def controlla(cartella):
    difetti = []
    for path in sorted(pathlib.Path(cartella).rglob("*.slint")):
        difetti += controlla_file(path)
    return difetti


def main(argv):
    cartella = pathlib.Path(argv[0]) if argv else UI
    if not cartella.is_dir():
        print(f"slint_valori.py: {cartella} is not a folder", file=sys.stderr)
        return 2
    difetti = controlla(cartella)
    for path, riga, tipo, valore, testo in difetti:
        print(f"{path}:{riga}: {tipo} {valore}  ({testo})")
    if difetti:
        print(
            f"\n{len(difetti)} value(s) written by hand in .slint files: take each from design-system/token.css "
            "(add an --app-* role there if it is missing) and use Token.<name>.",
            file=sys.stderr,
        )
        return 1
    print(f"{cartella}: no colour, length, duration or typeface written by hand")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
