#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Costruisce design/direzione.json (e, con --md, design/direzione.md) da direzione_dati.py e confronto.json.
Uso: python3 -I design/strumenti/costruisci-direzione.py [--md]   (dalla cartella design/strumenti o con il percorso)
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import direzione_dati as dd

out = {
    'versione': 1,
    'concorrenti': dd.CONCORRENTI,
    'criteri': dd.CRITERI,
    'regole': dd.REGOLE,
    'regole_proposte': dd.REGOLE_PROPOSTE,
    'ambizione': dd.AMBIZIONE,
    'decisioni': dd.D,
}
json.dump(out, open('/workspace/kalliope/design/direzione.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('direzione.json:', len(dd.D), 'decisioni')
if '--md' in sys.argv:
    import direzione_md
    direzione_md.scrivi(out)
