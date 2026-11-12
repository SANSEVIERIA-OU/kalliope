#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Raccoglie gli effetti misurati (CSS/WAAPI) da tutti i file *.movimento.json di un riferimento in una tabella: un effetto per riga.
# Uso: visita4-effetti.py <ID> [sottocartelle...]   → prove/<ID>/effetti-misurati.tsv
import sys, json, glob, os
ID = sys.argv[1]; base = f'/workspace/kalliope/design/ricerca/prove/{ID}'
righe = {}
for f in sorted(glob.glob(base + '/*/*.movimento.json')):
    sub = os.path.basename(os.path.dirname(f)); nome = os.path.basename(f).replace('.movimento.json', '')
    try: d = json.load(open(f))
    except Exception: continue
    gesto = d.get('gesto'); orol = (d.get('orologio') or {}).get('paginaAttendibile')
    for v in d.get('voci') or []:
        kf = v.get('keyframes') or []
        def val(k): return json.dumps({a: b for a, b in k.items() if a not in ('offset', 'easing', 'composite', 'computedOffset')}, ensure_ascii=False)[:90]
        chiave = (sub, v.get('tipo'), v.get('prop'), v.get('durata') and round(v['durata']), v.get('ritardo'), v.get('curva'), str(v.get('ripetizioni')), v.get('bersaglio'))
        r = righe.setdefault(chiave, {'n': 0, 'da': val(kf[0]) if kf else '', 'a': val(kf[-1]) if kf else '', 'file': f'{sub}/{nome}', 'gesto': gesto, 'orologio_ok': orol})
        r['n'] += 1
with open(base + '/effetti-misurati.tsv', 'w', encoding='utf8') as o:
    o.write('sessione\ttipo\tproprieta\tdurata_ms\tritardo_ms\tcurva\tripetizioni\tbersaglio\tvalore_iniziale\tvalore_finale\tfile_primo\tgesto\tvolte\torologio_attendibile\n')
    for c, r in righe.items():
        o.write('\t'.join(str(x) for x in [*c, r['da'], r['a'], r['file'], r['gesto'], r['n'], r['orologio_ok']]) + '\n')
print(len(righe), 'effetti ->', base + '/effetti-misurati.tsv')
