#!/usr/bin/env python3
"""Affianca due o più foto con un titolo per ognuna: python3 -I affianca.py <uscita.png> <titolo1>=<foto1> <titolo2>=<foto2> … [--scala=1]"""
import sys
from PIL import Image, ImageDraw, ImageFont
args = [a for a in sys.argv[2:] if not a.startswith('--')]; scala = float(next((a.split('=')[1] for a in sys.argv[2:] if a.startswith('--scala=')), 1))
voci = [(a.split('=', 1)[0], Image.open(a.split('=', 1)[1]).convert('RGB')) for a in args]
if scala != 1: voci = [(t, i.resize((int(i.width * scala), int(i.height * scala)))) for t, i in voci]
try: f = ImageFont.truetype('/usr/share/fonts/TTF/DejaVuSans.ttf', 16)
except Exception: f = ImageFont.load_default()
H = max(i.height for _, i in voci) + 28; W = sum(i.width for _, i in voci) + 10 * (len(voci) - 1)
w = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(w); x = 0
for t, i in voci:
    d.text((x + 4, 4), t, fill='black', font=f); w.paste(i, (x, 28)); x += i.width + 10
w.save(sys.argv[1]); print(sys.argv[1], w.size)
