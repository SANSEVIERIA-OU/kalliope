#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Salva per intero un testo letto dalla pagina con "valuta" (che taglia a 6000 caratteri): lo chiede a pezzi di 5500.
# Uso: POSTO=l4:xxxx visita4-testo.py <destinazione.txt> "<espressione JS che dà una stringa>"
import sys, json, subprocess, os
SK = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts'
env = {k: v for k, v in os.environ.items() if k not in ('DISPLAY', 'WAYLAND_DISPLAY')}
env['PLAYWRIGHT'] = '/workspace/test-playwright/node_modules/playwright/index.mjs'
dest, expr = sys.argv[1], sys.argv[2]
def valuta(e):
    r = subprocess.run(['node', 'passo.mjs', os.environ['POSTO'], 'valuta', e], cwd=SK, env=env, capture_output=True, text=True, timeout=120)
    o = r.stdout.strip()
    return json.JSONDecoder().raw_decode(o[o.find('"'):] if o.startswith('"') else o)[0]
n = valuta(f'(()=>{{window.__v4=String({expr});return window.__v4.length}})()')
out = ''
for i in range(0, int(n), 5500):
    out += valuta(f'window.__v4.slice({i},{i+5500})')
open(dest, 'w', encoding='utf8').write(out)
print(len(out), 'caratteri ->', dest)
