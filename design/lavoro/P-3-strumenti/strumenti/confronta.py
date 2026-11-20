#!/usr/bin/env python3
"""Confronta pixel per pixel due cartelle di foto (stessa struttura: <motore>/<nome>.png).
Uso: <venv>/bin/python -I confronta.py PRIMA DOPO [USCITA]
Per ogni foto: uguale byte per byte, uguale nei pixel, o quanti pixel cambiano (e di quanto), il riquadro delle differenze e,
se c'è USCITA, un'immagine con i pixel diversi in rosso su fondo chiaro. Una foto di altezza diversa si confronta fino alla più bassa."""
import hashlib, pathlib, sys
import numpy as np
from PIL import Image

a, b = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
out = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else None
righe = []
for fa in sorted(a.glob('*/*.png')):
    fb = b / fa.relative_to(a)
    nome = f'{fa.parent.name}/{fa.stem}'
    if not fb.exists():
        righe.append((nome, 'MANCA nel secondo')); continue
    if hashlib.sha256(fa.read_bytes()).digest() == hashlib.sha256(fb.read_bytes()).digest():
        righe.append((nome, 'uguale byte per byte')); continue
    ia, ib = np.asarray(Image.open(fa).convert('RGB')).astype(int), np.asarray(Image.open(fb).convert('RGB')).astype(int)
    nota = ''
    if ia.shape != ib.shape:
        nota = f'ALTEZZA {ia.shape[0]} → {ib.shape[0]} (larghezza {ia.shape[1]} → {ib.shape[1]}); '
        h, w = min(ia.shape[0], ib.shape[0]), min(ia.shape[1], ib.shape[1]); ia, ib = ia[:h, :w], ib[:h, :w]
    d = np.abs(ia - ib).max(axis=2)
    n = int((d > 0).sum())
    if n == 0:
        righe.append((nome, nota + 'uguale nei pixel (cambia la codifica del PNG)')); continue
    ys, xs = np.nonzero(d)
    riq = f'riquadro x {xs.min()}–{xs.max()}, y {ys.min()}–{ys.max()}'
    righe.append((nome, f'{nota}{n} pixel diversi ({100 * n / d.size:.3f}%), scarto massimo {int(d.max())}/255, {riq}'))
    if out:
        (out / fa.parent.name).mkdir(parents=True, exist_ok=True)
        img = np.full(d.shape + (3,), 255, np.uint8); img[d > 0] = (220, 30, 30)
        Image.fromarray(img).save(out / fa.parent.name / f'{fa.stem}-diff.png')
for nome, testo in righe:
    print(f'{nome:34} {testo}')
