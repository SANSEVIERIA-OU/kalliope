#!/usr/bin/env python3
"""Un foglio di foto affiancate: foglio.py <uscita.png> <larghezza di ogni foto> <foto> [<foto> …]"""
import sys
from PIL import Image
out, w, *foto = sys.argv[1:]
w = int(w)
ims = [Image.open(f).convert('RGB') for f in foto]
ims = [i.resize((w, round(i.height * w / i.width))) for i in ims]
H = max(i.height for i in ims)
fg = Image.new('RGB', (w * len(ims) + 8 * (len(ims) - 1), H), (255, 255, 255))
x = 0
for i in ims:
    fg.paste(i, (x, 0)); x += w + 8
fg.save(out)
print(out, fg.size)
