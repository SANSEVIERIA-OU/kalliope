#!/usr/bin/env python3
"""Un foglio di foto in griglia, con il nome sopra ciascuna: foglio.py <uscita.png> <larghezza di ogni foto> <colonne> <foto> [<foto> …]
Una foto può essere «nome=percorso» per scrivere un nome diverso dal file."""
import sys, pathlib
from PIL import Image, ImageDraw
out, w, col, *foto = sys.argv[1:]
w, col = int(w), int(col)
voci = [(f.split('=', 1) if '=' in f else (pathlib.Path(f).stem, f)) for f in foto]
ims = [(n, Image.open(p).convert('RGB')) for n, p in voci]
ims = [(n, i.resize((w, round(i.height * w / i.width)))) for n, i in ims]
righe = [ims[k:k + col] for k in range(0, len(ims), col)]
alt = [max(i.height for _, i in r) + 22 for r in righe]
fg = Image.new('RGB', (w * min(col, len(ims)) + 8 * (min(col, len(ims)) - 1), sum(alt) + 8 * (len(righe) - 1)), (40, 40, 40))
d = ImageDraw.Draw(fg); y = 0
for r, a in zip(righe, alt):
    x = 0
    for n, i in r:
        d.text((x + 4, y + 4), n, fill=(255, 255, 255)); fg.paste(i, (x, y + 22)); x += w + 8
    y += a + 8
fg.save(out)
print(out, fg.size)
