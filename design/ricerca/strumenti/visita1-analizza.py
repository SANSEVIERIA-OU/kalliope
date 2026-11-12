# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Riassume un file NNN-gesto.movimento.json di passo.mjs: per ogni bersaglio campionato dalle mutazioni, proprieta',
# numero di campioni, durata fra primo e ultimo campione, primo e ultimo valore. Uso: python3 -I visita1-analizza.py file [max-voci]
import json, sys
j = json.load(open(sys.argv[1]))
mx = int(sys.argv[2]) if len(sys.argv) > 2 else 12
print('gesto', j.get('gesto'), j.get('argomenti'), 'pagina', j.get('pagina'), 'viewport', j.get('viewport'), 'emul', j.get('emulazione'), 'fps', j.get('fps'), 'orologio', j.get('orologio'), 'macchina', j.get('macchina'))
print('voci(WAAPI/CSS):', len(j.get('voci') or []), 'gsap:', len(j.get('gsap') or []), 'eventi:', len(j.get('eventi') or []), 'sequenza:', len(j.get('sequenza') or []))
for v in (j.get('voci') or [])[:mx]:
    print('  voce', json.dumps(v, ensure_ascii=False)[:500])
for g in (j.get('gsap') or [])[:4]:
    print('  gsap', json.dumps(g, ensure_ascii=False)[:500])
for e in (j.get('eventi') or [])[:6]:
    print('  evento', json.dumps(e, ensure_ascii=False)[:300])
fr = j.get('fotogrammi') or []
for a in fr[:mx]:
    c = a['campioni']; t0, t1 = c[0]['t'], c[-1]['t']
    # ultima/prima valore per proprieta'
    first = {}; last = {}
    for s in c:
        for k, v in s['valori'].items():
            first.setdefault(k, v); last[k] = v
    keys = [k for k in first if first[k] != last[k]] or list(first)[:3]
    print(f"  {a['bersaglio']} cambi={a['cambi']} durata_campioni={round(t1-t0)}ms")
    for k in keys[:5]:
        print(f"      {k}: {str(first[k])[:70]} -> {str(last[k])[:70]}")
