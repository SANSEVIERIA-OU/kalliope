# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Funzioni comuni per costruire design/direzione.json dalle righe di design/confronto.json (nessun dato scritto a mano)."""
import json, re

CONFRONTO = json.load(open('/workspace/kalliope/design/confronto.json', encoding='utf-8'))
RIGHE = CONFRONTO['confronti']


def F(car, amb=None, siti=None, rx=None, no=None):
    """Fonti: (riferimento, caratteristica, ambito) per ogni sito presente nelle righe che corrispondono.
    amb = ambito esatto; rx = espressione sull'ambito; siti = elenco ammesso; no = elenco di siti esclusi."""
    out = []
    for x in RIGHE:
        if x['caratteristica'] != car:
            continue
        if amb is not None and x['ambito'] != amb:
            continue
        if rx is not None and not re.search(rx, x['ambito']):
            continue
        for s in x['presenti']:
            if siti is not None and s not in siti:
                continue
            if no is not None and s in no:
                continue
            out.append({'riferimento': s, 'caratteristica': car, 'ambito': x['ambito']})
    return out


def FE(*coppie):
    """Effetti: coppie (sito, espressione sull'ambito)."""
    out = []
    for s, rx in coppie:
        trovate = [x for x in RIGHE if x['caratteristica'] == 'effetto o animazione' and s in x['presenti'] and re.search(rx, x['ambito'])]
        if not trovate:
            raise SystemExit(f'effetto non trovato: {s} {rx}')
        for x in trovate:
            out.append({'riferimento': s, 'caratteristica': 'effetto o animazione', 'ambito': x['ambito']})
    return out


def unisci(*liste):
    visti, out = set(), []
    for l in liste:
        for f in l:
            k = (f['riferimento'], f['caratteristica'], f['ambito'])
            if k not in visti:
                visti.add(k)
                out.append(f)
    return out
