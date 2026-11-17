#!/usr/bin/env python3
"""Ritagli della stessa zona da più foto, in griglia: ritaglio.py <uscita.png> <x,y,l,a> <colonne> <nome=foto> …"""
import sys
from PIL import Image, ImageDraw
out, box, col, *foto = sys.argv[1:]
x, y, l, a = map(int, box.split(',')); col = int(col)
voci = [f.split('=', 1) for f in foto]
ims = [(n, Image.open(p).convert('RGB').crop((x, y, x + l, y + a))) for n, p in voci]
righe = (len(ims) + col - 1) // col
fg = Image.new('RGB', (col * l + 8 * (col - 1), righe * (a + 22) + 8 * (righe - 1)), (40, 40, 40))
d = ImageDraw.Draw(fg)
for k, (n, i) in enumerate(ims):
    cx, cy = (k % col) * (l + 8), (k // col) * (a + 30)
    d.text((cx + 4, cy + 4), n, fill=(255, 255, 255)); fg.paste(i, (cx, cy + 22))
fg.save(out); print(out, fg.size)
