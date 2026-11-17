#!/usr/bin/env python3
"""Un foglio con più foto affiancate (prima e dopo) e un'etichetta sopra ognuna. Uso: coppia.py <uscita.png> [--righe] <etichetta> <foto> [<etichetta> <foto> …]
Con --righe le foto stanno una sopra l'altra invece che una accanto all'altra."""
import sys
from PIL import Image, ImageDraw, ImageFont
args = sys.argv[1:]
out = args.pop(0)
righe = '--righe' in args
if righe: args.remove('--righe')
coppie = [(args[i], Image.open(args[i + 1]).convert('RGB')) for i in range(0, len(args), 2)]
try: f = ImageFont.truetype('/usr/share/fonts/TTF/DejaVuSans.ttf', 20)
except Exception: f = ImageFont.load_default()
alt_et, m = 34, 10
if righe:
    W = max(i.width for _, i in coppie) + 2 * m; H = sum(i.height + alt_et + m for _, i in coppie) + m
else:
    W = sum(i.width + m for _, i in coppie) + m; H = max(i.height for _, i in coppie) + alt_et + 2 * m
foglio = Image.new('RGB', (W, H), (24, 24, 24)); d = ImageDraw.Draw(foglio)
x = y = m
for et, im in coppie:
    d.text((x, y), et, fill=(255, 255, 255), font=f)
    foglio.paste(im, (x, y + alt_et))
    if righe: y += im.height + alt_et + m
    else: x += im.width + m
foglio.save(out)
print(out, foglio.size)
