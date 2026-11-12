#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Riassume l'uscita di passo.mjs (righe di avviso + JSON del gesto) in poche righe. Il JSON completo resta in <foto>.movimento.json.
import sys, json
t = sys.stdin.read()
j = None; testa = t
import re
for mm in re.finditer(r'\n\{', t):
    try:
        j, _ = json.JSONDecoder().raw_decode(t[mm.start()+1:])
        testa = t[:mm.start()]
        break
    except Exception:
        continue
print(testa.strip())
if j is None:
    print('(JSON non leggibile)'); sys.exit(0)
for k in ('url','titolo','scroll','finestra','canvas','video'):
    if k in j: print(f'{k}: {j[k]}')
print('titoli:', ' | '.join(j.get('titoli', [])[:14]))
print('comandi:', ' | '.join(j.get('comandi', [])[:20]))
print('testo:', (j.get('testo') or '')[:int(sys.argv[1]) if len(sys.argv)>1 else 300])
m = j.get('movimento')
if m:
    print('movimento: animazioni', m.get('animazioni'), 'gruppi', [ (g.get('tipo'),g.get('prop'),g.get('durata'),g.get('curva')) if isinstance(g,dict) else g for g in m.get('gruppi',[])][:10], 'gsap', len(m.get('gsap',[])), 'lenis', len(m.get('lenis',[])))
    for a in m.get('aFotogrammi', [])[:14]:
        c = a.get('campioni', [])
        print('  frame:', a.get('bersaglio'), a.get('prop'), 'cambi', a.get('cambi'), 'es.', (c[0].get('prima'), c[0].get('valori')) if c else '')
    for g in m.get('gsap', [])[:6]:
        print('  gsap:', json.dumps(g)[:300])
else:
    print('movimento: null')
