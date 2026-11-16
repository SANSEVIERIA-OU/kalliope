# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Checks that the style sheets of the design system can be mirrored for a right-to-left page.

    python3 -I tools/css_logico.py [DIR]            check DIR (default design-system/); exit 1 on a defect
    python3 -I tools/css_logico.py [DIR] --versi    list every declaration that has a direction of its own (markdown)

A defect is, in base.css, componenti/*.css and catalogo/*.css:
  FISICA       a left/right property (margin-left, padding-right, left, right, border-left…, text-align: left, float) where a
               logical one exists (margin-inline-start, inset-inline-end, text-align: start…). A physical one that is right
               stays, with `/* fisico: the reason */` on the same line: a drawing that does not mirror (the play triangle),
               a centring that is symmetric.
  ASIMMETRICA  a shorthand (padding, margin, inset, border-width…) whose left and right differ, once the tokens are resolved:
               it cannot be mirrored; write padding-block and padding-inline (start end).
  TESTO        a visible word written in CSS (`content: "text"`): text is translated in the page, not in the style sheet.
  NOME         a token whose name says left or right (sinistra, destra): name it for start and end (inizio, fine).

`--versi` lists what a mirror does not change by itself and a person must decide: horizontal transforms, transform origins,
horizontal gradients, clip paths, masks, background positions, and the physical declarations kept on purpose.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FISICHE = re.compile(r"^(margin|padding|border|scroll-margin|scroll-padding)-(left|right)(-.*)?$|^(left|right)$|^border-(top|bottom)-(left|right)-radius$|^(float|clear)$")
SCORCIATOIE = {"margin", "padding", "inset", "border-width", "border-color", "border-style", "scroll-margin", "scroll-padding"}


def token(dir_):
    out = {}
    for m in re.finditer(r"(--[a-z0-9-]+)\s*:\s*([^;]+);", (dir_ / "token.css").read_text(encoding="utf-8")):
        out[m.group(1)] = m.group(2).strip()
    return out


def risolvi(v, tokens, prof=0):
    def sost(m):
        nome, ripiego = m.group(1), m.group(2)
        if nome in tokens and prof < 12:
            return risolvi(tokens[nome], tokens, prof + 1)
        return ripiego or m.group(0)
    return re.sub(r"var\((--[a-z0-9-]+)(?:\s*,\s*([^)]*))?\)", sost, v)


def dichiarazioni(testo):
    """(riga, selettore, proprietà, valore, riga di testo) di ogni dichiarazione."""
    righe = testo.split("\n")
    pulito = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), testo, flags=re.S)
    out, pila, attuale, riga, inizio = [], [], "", 1, 1
    for c in pulito:
        if c == "\n":
            riga += 1
        if c == "{":
            pila.append((attuale.strip(), inizio)); attuale = ""; inizio = riga
        elif c == "}":
            if pila:
                pila.pop()
            attuale = ""; inizio = riga
        elif c == ";":
            d = attuale.strip()
            if ":" in d and pila:
                p, v = d.split(":", 1)
                out.append((inizio, " | ".join(x[0] for x in pila), p.strip(), v.strip()))
            attuale = ""; inizio = riga
        else:
            if not attuale.strip() and c.strip():
                inizio = riga
            attuale += c
    return out, righe


def alto(v):
    parti, d, cur = [], 0, ""
    for c in v:
        d += (c == "(") - (c == ")")
        if c == " " and d == 0:
            if cur:
                parti.append(cur); cur = ""
        else:
            cur += c
    if cur:
        parti.append(cur)
    return parti


def espandi(p):
    if len(p) == 1:
        return p * 4
    if len(p) == 2:
        return [p[0], p[1], p[0], p[1]]
    if len(p) == 3:
        return [p[0], p[1], p[2], p[1]]
    return p[:4]


def fogli(dir_):
    return sorted([*dir_.glob("*.css"), *(dir_ / "componenti").glob("*.css"), *(dir_ / "catalogo").glob("*.css")])


def esamina(dir_):
    """(difetti, versi): liste di (file, riga, tipo, testo)."""
    tokens = token(dir_)
    difetti, versi = [], []
    for nome in tokens:
        if re.search(r"sinistra|destra|(?<![a-z])(left|right)(?![a-z])", nome):
            difetti.append(("token.css", 0, "NOME", f"{nome}: names a side, not a direction"))
    for f in fogli(dir_):
        if f.name == "token.css":
            continue
        decl, righe = dichiarazioni(f.read_text(encoding="utf-8"))
        rel = f.relative_to(dir_).as_posix()
        for riga, ctx, p, v in decl:
            rv = risolvi(re.sub(r"\s*!important\s*$", "", v), tokens)
            testo_riga = righe[riga - 1]
            annotata = "/* fisico" in testo_riga
            if FISICHE.match(p) or (p == "text-align" and rv.strip() in ("left", "right")):
                (versi if annotata else difetti).append((rel, riga, "FISICA" if not annotata else "FISICO VOLUTO", f"{p}: {v}  [{ctx.split(' | ')[-1]}]"))
                continue
            if p in SCORCIATOIE:
                q = espandi(alto(rv))
                if len(q) == 4 and q[1] != q[3]:
                    difetti.append((rel, riga, "ASIMMETRICA", f"{p}: {v} → {rv}  [{ctx.split(' | ')[-1]}]"))
            if p == "border-radius":
                q = espandi(alto(rv.split("/")[0]))
                if len(q) == 4 and (q[0] != q[1] or q[2] != q[3]):
                    difetti.append((rel, riga, "ASIMMETRICA", f"border-radius: {v} → {rv}  [{ctx.split(' | ')[-1]}]"))
            if p == "content" and re.search(r'["\'][^"\']*[A-Za-zÀ-ÿ0-9][^"\']*["\']', rv) and "attr(" not in rv and "\\A" not in rv:
                difetti.append((rel, riga, "TESTO", f"content: {v}  [{ctx.split(' | ')[-1]}]"))
            # ciò che ha un verso e che lo specchio non cambia da solo
            if p in ("transform", "translate") and re.search(r"translate(X|3d)?\(|translate\(|scaleX|skew|rotate|\btranslate\b", rv) and not re.fullmatch(r"\s*translateY\([^)]*\)\s*(scale\([^)]*\))?\s*", rv):
                if re.search(r"translateX|translate\(|scaleX|rotate|skew", rv):
                    versi.append((rel, riga, "TRASFORMAZIONE", f"{p}: {v} → {rv}  [{ctx.split(' | ')[-1]}]"))
            elif p == "transform-origin" and not re.fullmatch(r"50% (0|50%|100%)|50% 50%", rv.strip()):
                versi.append((rel, riga, "ORIGINE", f"transform-origin: {v} → {rv}  [{ctx.split(' | ')[-1]}]"))
            elif re.search(r"(repeating-)?linear-gradient\((to (left|right)|90deg|270deg|-90deg)", rv):
                versi.append((rel, riga, "SFUMATURA", f"{p}: {v}  [{ctx.split(' | ')[-1]}]"))
            elif p in ("clip-path", "-webkit-clip-path") and (re.search(r"inset\(", rv)) and "inset(50%)" not in rv and "inset(0)" not in rv.replace(" ", ""):
                versi.append((rel, riga, "RITAGLIO", f"{p}: {v} → {rv}  [{ctx.split(' | ')[-1]}]"))
            elif p in ("mask", "-webkit-mask", "mask-image") and "url(" in rv:
                versi.append((rel, riga, "MASCHERA", f"{p}: {v[:70]}  [{ctx.split(' | ')[-1]}]"))
            elif p in ("background-position", "object-position", "mask-position", "-webkit-mask-position") or (p == "transition" and False):
                versi.append((rel, riga, "POSIZIONE", f"{p}: {v}  [{ctx.split(' | ')[-1]}]"))
    return difetti, versi


def main(argv):
    dir_ = ROOT / "design-system"
    for a in argv:
        if not a.startswith("--"):
            dir_ = pathlib.Path(a).resolve()
    difetti, versi = esamina(dir_)
    if "--versi" in argv:
        for rel, riga, tipo, testo in versi:
            print(f"| `{rel}:{riga}` | {tipo} | `{testo}` |")
        return 0
    for rel, riga, tipo, testo in difetti:
        print(f"{rel}:{riga}: {tipo}: {testo}")
    if difetti:
        print(f"css_logico.py: {len(difetti)} defect(s) in {dir_}", file=sys.stderr)
        return 1
    print(f"css_logico.py: ok, no physical left/right, no asymmetric shorthand, no text in CSS ({len(fogli(dir_))} style sheets; "
          f"{len([v for v in versi if v[2] == 'FISICO VOLUTO'])} physical declarations kept on purpose)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
