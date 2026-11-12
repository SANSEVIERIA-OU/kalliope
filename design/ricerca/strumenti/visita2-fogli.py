#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Montaggi di confronto per il worker visita-2: affianca foto già salvate (non riacquisisce nulla).
# Uso: visita2-fogli.py <uscita.jpg> <altezza> <foto1> <foto2> ...
import sys
from PIL import Image
out, H = sys.argv[1], int(sys.argv[2])
ims = []
for f in sys.argv[3:]:
    i = Image.open(f).convert('RGB'); ims.append(i.resize((max(1, int(i.width * H / i.height)), H)))
W = sum(i.width for i in ims) + 10 * (len(ims) - 1)
s = Image.new('RGB', (W, H), (120, 120, 120)); x = 0
for i in ims: s.paste(i, (x, 0)); x += i.width + 10
s.save(out, quality=82)
