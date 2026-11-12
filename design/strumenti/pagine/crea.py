# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pagine_a, pagine_b
SITE = '/workspace/kalliope/site/'
pagine = {
    'index.html': pagine_a.home(),
    'ascolta/index.html': pagine_a.ascolta(),
    'stato/index.html': pagine_a.stato(),
    'installa/index.html': pagine_b.installa(),
    'riunione/index.html': pagine_b.riunione(),
    'aiuto/index.html': pagine_b.aiuto(),
    'non-ancora/index.html': pagine_b.non_ancora(),
    '404.html': pagine_b.p404(),
}
for nome, html in pagine.items():
    p = SITE + nome
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(html)
    print('scritto', nome, len(html))
