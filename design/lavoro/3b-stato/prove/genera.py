# Genera la prima stesura di website/stato/index.html dal modello (usato una volta; poi la pagina si modifica a mano).
import json, re, sys
radice = '/workspace/kalliope'
na = open(f'{radice}/website/non-ancora/index.html', encoding='utf-8').read()
barra = open('/tmp/lavoro-3b-dati/barra.html').read()
piede = open('/tmp/lavoro-3b-dati/piede.html').read()
fig = json.load(open('/tmp/lavoro-3b-dati/figure.json'))
mini = {}
for nome in ('paola', 'luca', 'anna'):
    m = re.search(r'<span class="mini %s">(<svg class="figura" width="92".*?</svg>)</span>' % nome, na, re.S)
    mini[nome] = m.group(1)
t = open(f'{radice}/design/lavoro/3b-stato/prove/pagina-modello.html', encoding='utf-8').read()
t = t.replace('{{BARRA}}', barra).replace('{{PIEDE}}', piede)
for nome in ('paola', 'luca', 'anna'):
    t = t.replace('{{FIG_%s}}' % nome.upper(), fig[nome]).replace('{{MINI_%s}}' % nome.upper(), mini[nome])
assert '{{FIG' not in t and '{{MINI' not in t and '{{BARRA' not in t
open(sys.argv[1], 'w', encoding='utf-8').write(t)
print('scritto', sys.argv[1], len(t))
