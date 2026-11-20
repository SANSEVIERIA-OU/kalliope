"""Confronta le foto del segno dei tre motori (prove/motori.mjs) con quelle di Chromium: pixel diversi per ogni posizione del fronte. Uso: python3 -I motori-diff.py <cartella>"""
import json, pathlib, sys
cart = pathlib.Path(sys.argv[1])
info = json.loads((cart / "motori.json").read_text())
# Pillow serve soltanto a questo confronto di foto (non è una dipendenza del repository); senza «-I» si vede
from PIL import Image
def carica(f):
    return Image.open(f).convert("RGB")
ok = True
for nome in ("firefox", "webkit"):
    if "errore" in info.get(nome, {}):
        print(nome, "non si è potuto provare:", info[nome]["errore"]); continue
    for x in (0, 31, 62):
        a, b = carica(cart / f"chromium-fronte{x}.png"), carica(cart / f"{nome}-fronte{x}.png")
        if a.size != b.size:
            print(nome, "fronte", x, "misura diversa", a.size, b.size); ok = False; continue
        da, db = a.tobytes(), b.tobytes()
        diversi = sum(1 for i in range(0, len(da), 3) if max(abs(da[i + k] - db[i + k]) for k in range(3)) > 24)
        forti = sum(1 for i in range(0, len(da), 3) if max(abs(da[i + k] - db[i + k]) for k in range(3)) > 96)
        print(f"{nome} fronte {x:2d}: {diversi} pixel diversi (>24/255), {forti} molto diversi (>96) su {len(da) // 3}")
        if forti > 40: ok = False
sys.exit(0 if ok else 1)
