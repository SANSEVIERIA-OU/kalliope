#!/usr/bin/env python3
"""Riassume una corsa di coda.mjs (cartella con i .log e i .esito.json) dei lavori finali: per gruppo di lavori quanti casi, quanti puliti, quante segnalazioni.
Uso: python3 -I riassumi.py <cartella della corsa>"""
import json, pathlib, re, sys, collections
d = pathlib.Path(sys.argv[1])
gruppi = collections.OrderedDict()
def g(nome): return gruppi.setdefault(nome, collections.Counter())
segn = collections.defaultdict(list)
for f in sorted(d.glob('*.log')):
    id = f.stem; t = f.read_text(encoding='utf-8', errors='replace')
    esito = json.loads((d / f'{id}.esito.json').read_text()) if (d / f'{id}.esito.json').exists() else {'codice': None}
    k = id.split('-')[0]
    if esito['codice'] is None:   # ancora in corso
        g('in corso')[id] += 1; continue
    if k == 'B':
        motore = id.split('-')[1]
        c = g(f'B esame {motore}')
        c['lavori'] += 1; c['rossi'] += esito['codice'] != 0
        righe = [r for r in t.splitlines() if ' · ' in r and 'testo' in r]
        c['pagine'] += len(righe); c['pulite'] += sum(1 for r in righe if r.rstrip().endswith('pulito')); c['stato assente'] += sum(1 for r in righe if "non c'è a questa misura" in r)
        for r in t.splitlines():
            if re.match(r'^  [A-ZÀ]', r): segn[f'B esame {motore}'].append(f'{id}: {r.strip()[:150]}')
    elif k == 'C':
        motore = [m for m in ('chromium', 'firefox', 'webkit') if m in id][0]
        c = g(f'C pillole {motore}'); c['lavori'] += 1; c['rossi'] += esito['codice'] != 0
        m = re.search(r'(\d+) pillole viste.*?: (\d+) fuori posto', t)
        if m: c['pillole'] += int(m.group(1)); c['fuori posto'] += int(m.group(2))
        for r in t.splitlines():
            if re.match(r'^  \S', r) and 'fuori posto' not in r and 'Skipping' not in r: segn[f'C pillole {motore}'].append(f'{id}: {r.strip()[:170]}')
    elif k == 'A':
        c = g('A barra'); c['lavori'] += 1; c['rossi'] += esito['codice'] != 0
        m = re.search(r'in tutto (\d+) prove, (\d+) rotte', t)
        if m: c['prove'] += int(m.group(1)); c['rotte'] += int(m.group(2))
        if esito['codice'] != 0: segn['A barra'].append(f'{id}: ' + ' | '.join(r.strip()[:140] for r in t.splitlines() if 'rotte' in r)[:300])
    elif k in 'DEFGH':
        c = g({'D': 'D selettore nella barra', 'E': 'E pagina della scelta', 'F': 'F nomi e ruoli', 'G': 'G catalogo', 'H': 'H radice con una lingua sola'}[k])
        c['lavori'] += 1; c['rossi'] += esito['codice'] != 0
        c['controlli ok'] += len(re.findall(r'^  ok ', t, re.M)); c['controlli rossi'] += len(re.findall(r'^  ROSSO', t, re.M))
        for r in t.splitlines():
            if r.startswith('  ROSSO'): segn[k].append(f'{id}: {r.strip()[:200]}')
for nome, c in gruppi.items(): print(f'{nome}: ' + ', '.join(f'{k} {v}' for k, v in c.items()))
for nome, l in segn.items():
    print(f'\n{nome}: {len(l)} segnalazioni')
    for r in l[:25]: print('  ' + r)
