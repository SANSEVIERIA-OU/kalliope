#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Riassume l'uscita di passo.mjs (righe di avviso + JSON del gesto) per il worker visita-4.
# Il JSON completo resta nel registro e accanto alla foto (<foto>.movimento.json).
import sys, json, re
t = sys.stdin.read()
lim = int(sys.argv[1]) if len(sys.argv) > 1 else 300
j = None; testa = t
for mm in re.finditer(r'\n\{', t):
    try:
        j, _ = json.JSONDecoder().raw_decode(t[mm.start()+1:])
        testa = t[:mm.start()]
        break
    except Exception:
        continue
print(testa.strip()[:1800])
if j is None:
    print('(JSON non leggibile)'); sys.exit(0)
for k in ('url', 'titolo', 'scroll', 'finestra', 'canvas', 'video'):
    if k in j: print(f'{k}: {j[k]}')
print('titoli:', ' | '.join(j.get('titoli', [])[:14]))
print('comandi:', ' | '.join(j.get('comandi', [])[:24]))
print('testo:', (j.get('testo') or '')[:lim].replace('\n', ' / '))
m = j.get('movimento')
if m:
    print('movimento: animazioni', m.get('animazioni'), '| gruppi', len(m.get('gruppi', [])), '| gsap', len(m.get('gsap', [])), '| lenis', len(m.get('lenis', [])), '| scrollLinked', bool(m.get('scrollLinked')))
    for g in m.get('gruppi', [])[:10]:
        print('  gruppo:', json.dumps(g, ensure_ascii=False)[:380])
    for a in m.get('aFotogrammi', [])[:10]:
        c = a.get('campioni', [])
        print('  frame:', a.get('bersaglio'), (a.get('prop') or '')[:80], 'cambi', a.get('cambi'), (c[0].get('valori') if c else ''))
else:
    print('movimento: null')
