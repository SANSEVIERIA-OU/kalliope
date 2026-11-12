#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Affianca N foto in una sola immagine per la revisione (nessun browser). Uso: visita4-foglio.py <uscita.jpg> <foto1> <foto2> ...
import sys
from PIL import Image
ims = [Image.open(p).convert('RGB') for p in sys.argv[2:]]
h = max(i.height for i in ims); w = sum(i.width for i in ims) + 8 * (len(ims) - 1)
f = Image.new('RGB', (w, h), (120, 120, 120)); x = 0
for i in ims:
    f.paste(i, (x, 0)); x += i.width + 8
f.save(sys.argv[1], quality=85)
print(f.size)
