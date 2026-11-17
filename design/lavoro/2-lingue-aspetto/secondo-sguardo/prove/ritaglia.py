# Uso: python3 -I ritaglia.py <foto> <uscita> x y w h [scala]
import sys
from PIL import Image
f, out, x, y, w, h = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7])
s = float(sys.argv[7]) if len(sys.argv) > 7 else 2
im = Image.open(f).crop((x, y, x + w, y + h))
im = im.resize((int(w * s), int(h * s)), Image.LANCZOS)
im.save(out)
