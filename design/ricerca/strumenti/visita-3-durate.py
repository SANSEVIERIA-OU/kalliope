#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Riassume i campioni di mutazione di un <gesto>.movimento.json: per ogni bersaglio+proprietà, t iniziale e finale (ms di pagina
# dal primo campione del gesto), numero di campioni, valore prima/dopo. Sono campioni di mutazioni, non una misura delle curve.
import json, sys
f = sys.argv[1]
j = json.load(open(f))
fr = j.get('fotogrammi', [])
t0 = min((c['t'] for a in fr for c in a['campioni']), default=0)
righe = []
for a in fr:
    c = a['campioni']
    ts = [x['t'] for x in c]
    righe.append((min(ts) - t0, max(ts) - t0, a['bersaglio'], a['prop'], a['cambi'], str(c[0]['prima'])[:50], str(c[-1]['valori'])[:60]))
righe.sort()
print(f'{f}: {len(righe)} bersagli, gesto {j["gesto"]} {j["argomenti"]}, orologio {j["orologio"]}, macchina {j["macchina"]}, fps {j["fps"]}')
for r in righe[:int(sys.argv[2]) if len(sys.argv) > 2 else 25]:
    print(f'  {r[0]:7.0f} → {r[1]:7.0f} ms (Δ{r[1]-r[0]:6.0f})  {r[2][:30]:30s} {r[3]:14s} cambi {r[4]:3d}  {r[5]}  =>  {r[6]}')
