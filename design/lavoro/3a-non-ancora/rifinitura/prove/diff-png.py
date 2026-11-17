# Uso: python3 diff-png.py A.png B.png [uscita-differenze.png] — quanti pixel sono diversi e dove (riquadro), soglia di scarto 0
import sys
args = [x for x in sys.argv if not x.startswith('--soglia=')]
SOGLIA = next((int(x.split('=')[1]) for x in sys.argv if x.startswith('--soglia=')), 8)
sys.argv = args
from PIL import Image
import numpy as np
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')
if a.size != b.size:
    print(f'misure diverse: {a.size} contro {b.size}'); sys.exit(1)
x = np.asarray(a).astype(int); y = np.asarray(b).astype(int)
d = np.abs(x - y).max(axis=2)
n = int((d > 0).sum()); forte = int((d > SOGLIA).sum())
if n:
    ys, xs = np.where(d > 0)
    print(f'{n} pixel diversi ({forte} con scarto > {SOGLIA}) su {d.size}; riquadro x {xs.min()}-{xs.max()}, y {ys.min()}-{ys.max()}')
else:
    print('0 pixel diversi')
if len(sys.argv) > 3 and n:
    m = (d > 0)[..., None] * np.array([255, 0, 0]) + (d == 0)[..., None] * (x // 3)
    Image.fromarray(m.astype('uint8')).save(sys.argv[3])
sys.exit(0 if n == 0 else 3)
