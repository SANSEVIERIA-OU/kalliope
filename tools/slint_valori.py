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
  SPECCHIO   a Text or TextInput without `horizontal-alignment` (Slint lays «start» out as left: Aspetto.inizio is the side of the
             language) or without `line-height-factor` (Aspetto.interlinea: the distance between lines each script asks for), or a Text, TextInput or Image without `transform-scale-x: Token.verso`: the window mirrors from right to left by turning
             round as a whole (ui/app.slint), so every text, field and picture turns itself back; none of them may be the root of
             a component, where Slint ignores the property

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
    # SPECCHIO is not a pattern: see specchio()
]
ELEMENTI_CHE_SI_LEGGONO = ("Text", "TextInput", "Image")
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


def specchio(path, testo, nomi):
    """The elements that are read (a Text, a TextInput, an Image, and the components of this file that inherit one of them) that do not
    turn themselves back: [(riga, nome)]. A component whose root is one of them cannot: Slint ignores a transform on a root."""
    pulito = codice(testo)
    letti = set(ELEMENTI_CHE_SI_LEGGONO)
    letti_con_lato = {"Text", "TextInput"}
    out = []
    # the components of this file that are a Text, TextInput or Image: the property must be where they are used
    for m in re.finditer(r"\bcomponent\s+([A-Za-z][\w-]*)\s+inherits\s+(Text|TextInput|Image)\b", pulito):
        letti.add(m.group(1))
        if m.group(2) != "Image":
            # the side is asked for once, in the definition (a root property other than a transform is fine)
            inizio, depth = m.end(), 0
            j = pulito.index("{", inizio)
            k = j
            while k < len(pulito):
                depth += {"{": 1, "}": -1}.get(pulito[k], 0)
                k += 1
                if depth == 0:
                    break
            if not re.search(r"\bhorizontal-alignment\s*:", testo[j:k]):
                out.append((testo.count("\n", 0, m.start()) + 1, m.group(1) + " without horizontal-alignment"))
            elif not re.search(r"\bline-height-factor\s*:", testo[j:k]):
                out.append((testo.count("\n", 0, m.start()) + 1, m.group(1) + " without line-height-factor"))
    for m in re.finditer(r"(?<![\w-])(" + "|".join(sorted(letti)) + r")\s*\{", pulito):
        if re.search(r"\binherits\s+$", pulito[max(0, m.start() - 12):m.start()]):
            continue   # `component X inherits Text {`: the definition, not a use
        # the body of the element, up to the brace that closes it
        depth, i = 1, m.end()
        while i < len(pulito) and depth:
            depth += {"{": 1, "}": -1}.get(pulito[i], 0)
            i += 1
        corpo = testo[m.end():i - 1]
        riga = testo.count("\n", 0, m.start()) + 1
        if not re.search(r"transform-scale-x:\s*Token\.verso\s*;", corpo):
            out.append((riga, m.group(1)))
        # a text is laid out from the left unless it asks for its side (Slint's «start» is left): a Text or a TextInput says
        # `horizontal-alignment` (Aspetto.inizio, or its own: centre)
        elif m.group(1) != "Image" and m.group(1) in letti_con_lato and not re.search(r"\bhorizontal-alignment\s*:", corpo):
            out.append((riga, m.group(1) + " without horizontal-alignment"))
        elif m.group(1) != "Image" and m.group(1) in letti_con_lato and not re.search(r"\bline-height-factor\s*:", corpo):
            out.append((riga, m.group(1) + " without line-height-factor"))
    return out


def controlla_file(path):
    testo = path.read_text(encoding="utf-8")
    if testo.startswith("// Generated from design-system/token.css"):
        return []
    righe = testo.split("\n")
    difetti = []
    for numero, nome in specchio(path, testo, ELEMENTI_CHE_SI_LEGGONO):
        if not MARCA.search(righe[numero - 1]):
            difetti.append((path, numero, "SPECCHIO", nome, righe[numero - 1].strip()))
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
