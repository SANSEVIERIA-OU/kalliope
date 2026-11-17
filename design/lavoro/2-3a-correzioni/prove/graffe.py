#!/usr/bin/env python3 -I
"""Le graffe di ogni foglio di stile tornano (senza i commenti e le stringhe): una graffa dimenticata inghiotte tutto ciò che segue,
senza un errore. Uso: python3 -I graffe.py <cartella> [...]   (esce 1 se un foglio non torna)"""
import pathlib, re, sys
male = 0
for c in sys.argv[1:]:
    for f in sorted(pathlib.Path(c).rglob("*.css")):
        t = re.sub(r"/\*.*?\*/", "", f.read_text(encoding="utf-8"), flags=re.S)
        t = re.sub(r'"(?:\\.|[^"\\])*"', '""', t)
        prof, ok = 0, True
        for ch in t:
            prof += ch == "{"
            prof -= ch == "}"
            if prof < 0: ok = False; break
        if prof != 0 or not ok:
            print(f"NO   {f}: graffe che non tornano (profondità finale {prof})"); male += 1
print(f"{'ok  ' if not male else 'NO  '} fogli controllati, {male} con le graffe che non tornano")
sys.exit(1 if male else 0)
