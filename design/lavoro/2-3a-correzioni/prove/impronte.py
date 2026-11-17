#!/usr/bin/env python3 -I
"""Le impronte (primi 16 caratteri di sha256) dei file di questo incarico in un albero di prova e dell'albero intero (website, design-system, tools) e del sito costruito.
Uso: python3 -I impronte.py <radice> [<sito costruito>]"""
import hashlib, pathlib, sys
FILE = ["design-system/token.css", "design-system/componenti/barra.css", "design-system/componenti/lingue.css", "design-system/componenti/riunione.css", "design-system/componenti/versioni.css",
        "design-system/catalogo/catalogo-pagine.js", "website/componenti.js", "website/lingue.html", "website/non-ancora/non-ancora.js", "website/non-ancora/index.html", "website/stato/index.html"]
def h(p): return hashlib.sha256(p.read_bytes()).hexdigest()[:16]
def albero(base, sotto):
    d = hashlib.sha256()
    for p in sorted(x for s in sotto for x in (base / s).rglob("*") if x.is_file() and "__pycache__" not in x.parts):
        d.update(str(p.relative_to(base)).encode()); d.update(p.read_bytes())
    return d.hexdigest()[:32]
r = pathlib.Path(sys.argv[1])
for f in FILE:
    print(f"{f:55s} {h(r / f) if (r / f).exists() else '(manca)'}")
print(f"{'albero (website, design-system, tools)':55s} {albero(r, ['website', 'design-system', 'tools'])}")
if len(sys.argv) > 2: print(f"{'sito costruito ' + sys.argv[2]:55s} {albero(pathlib.Path(sys.argv[2]), ['.'])}")
