#!/usr/bin/env python3
"""Il riepilogo di una batteria: per ogni file esiti/<prefisso>-*.txt, la riga che conta. Uso: riepilogo.py <prefisso> (J, L…)"""
import re, sys, pathlib
pre = sys.argv[1]
for f in sorted(pathlib.Path('esiti').glob(f'{pre}-*.txt')):
    t = f.read_text(encoding='utf-8', errors='replace').splitlines()
    chiave = [l.strip() for l in t if re.match(r'^(NO |NV |\d+/\d+ ok|# uscita|\d+ casi puliti|Tutto pulito|\d+ cose da guardare|ok:|COPERTO|FUORI|\d+ testi|\d+ misure|ok   |\s+larghezza)', l)]
    casi = sum(1 for l in t if re.match(r'^non-ancora', l)); pul = sum(1 for l in t if 'testo 100%: pulito' in l)
    ex = f'[{casi} casi, {pul} puliti] ' if casi else ''
    print(f'{f.stem}: {ex}' + ' | '.join(c[:150] for c in chiave[-4:]))
