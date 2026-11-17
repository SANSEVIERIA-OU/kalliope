#!/usr/bin/env python3
"""Le righe di riepilogo (ok / NO / uscita) di ogni esito in esiti/. Uso: python3 riepilogo.py [filtro]"""
import pathlib, re, sys
E = pathlib.Path(__file__).resolve().parent.parent / "esiti"; filtro = sys.argv[1] if len(sys.argv) > 1 else ""
for f in sorted(E.glob("*.txt")):
    if filtro not in f.name or f.name.startswith("impronte"): continue
    righe = [r.rstrip() for r in f.read_text(encoding="utf-8").splitlines()]
    testa = righe[0][:70] if righe else ""
    riep = [r for r in righe if re.match(r"^(ok|NO|--)\s+\S+(:|\s)", r) and re.search(r"\d+ (controlli|casi|misure)", r)]
    uscita = next((r for r in reversed(righe) if r.startswith("# uscita")), "# uscita: ?")
    ultima = riep[-1] if riep else next((r for r in reversed(righe) if r.strip() and not r.startswith("#")), "")
    print(f"{f.stem:42s} {uscita[2:]:10s} {ultima[:150]}")
