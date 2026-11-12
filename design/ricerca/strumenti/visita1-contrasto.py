# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Rapporto di contrasto WCAG fra due colori sRGB «r,g,b». Uso: python3 -I visita1-contrasto.py "nome|r,g,b|r,g,b" ...
# I colori vengono da stili calcolati (getComputedStyle) o da un pixel della foto salvata: lo dice il nome nel documento.
import sys
def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
def L(rgb): r, g, b = rgb; return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
def cr(a, b):
    la, lb = L(a), L(b)
    if la < lb: la, lb = lb, la
    return round((la + 0.05) / (lb + 0.05), 2)
for x in sys.argv[1:]:
    name, a, b = x.split('|')
    A = tuple(int(v) for v in a.split(',')); B = tuple(int(v) for v in b.split(','))
    print(name, A, B, cr(A, B))
