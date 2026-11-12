#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Controlla che ogni file citato in `evidenze` delle osservazioni esista sotto design/ricerca/. Uso: visita-3-prove-esistono.py R20 R21 R22
import json, os, sys
base = '/workspace/kalliope/design/ricerca/'
mancano = 0
for id_ in sys.argv[1:]:
    j = json.load(open(base + f'osservazioni/{id_}.json'))
    for r in j['riferimenti']:
        for ob in r['osservazioni']:
            for e in ob.get('evidenze', []):
                if not os.path.exists(base + e):
                    mancano += 1; print('MANCA', id_, ob['caratteristica'], '|', ob['ambito'], '->', e)
    print(id_, len(r['osservazioni']), 'osservazioni controllate')
print('file mancanti:', mancano)
