#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Unisce design/ricerca/osservazioni/R*.json in un solo file per confronta-riferimenti.mjs.

Uso: python3 -I design/strumenti/unisci-osservazioni.py design/confronto-lavoro/ricerca-unita.json
In piu, per i riferimenti i cui JSON non hanno righe «effetto o animazione» ma il cui inventario del movimento esiste
(design/ricerca/movimento/R0x.md, scritto dal visitatore), aggiunge una riga per effetto Mxx estratta da quel file
(solo il trigger e letto dal testo; durate, curve e proprieta restano nel file del visitatore e sono dichiarate non misurate qui). Le righe aggiunte portano
`origine: movimento/<ID>.md` per non confonderle con quelle compilate dal visitatore.
"""
import json, glob, os, re, sys

BASE = '/workspace/kalliope/design/ricerca'
dst = sys.argv[1]
out = []
for f in sorted(glob.glob(f'{BASE}/osservazioni/R*.json')):
    for r in json.load(open(f, encoding='utf-8'))['riferimenti']:
        out.append(r)

def ambito_di(nome, trigger):
    n = (nome + ' ' + trigger).lower()
    if 'telefono' in n and ('menu' in n or 'pannello' in n): return 'menu telefono'
    if 'telefono' in n: return 'arrivo telefono'
    if any(k in n for k in ('menu', 'tendina', 'voci di intestazione', 'ricerca')): return 'menu computer'
    if any(k in n for k in ('cookie', 'soglia', 'scheletri', 'spinner', 'attesa')): return 'arrivo computer'
    if any(k in n for k in ('scorrimento', 'intestazione', 'reveal', 'entrata', 'conteggio', 'indicatore', 'pulsante di scarico')): return 'scorrimento computer'
    return 'percorso principale'

def trigger_di(t):
    t = t.lower()
    for k, v in (('clic', 'clic'), ('tocco', 'tocco'), ('passaggio', 'passaggio'), ('hover', 'passaggio'), ('scorr', 'scorrimento'),
                 ('focus', 'focus da tastiera'), ('arrivo', 'caricamento'), ('caricamento', 'caricamento'), ('ingresso', 'scorrimento')):
        if k in t: return v
    return 'non indicato'

def effetti(rid):
    p = f'{BASE}/movimento/{rid}.md'
    txt = open(p, encoding='utf-8').read()
    blocchi = re.split(r'\n(?=### M\d+\.)', txt)
    righe = []
    for b in blocchi:
        m = re.match(r'### (M\d+)\. (.+)', b)
        if not m: continue
        mid, nome = m.group(1), m.group(2).strip()
        trig = re.search(r'\*\*Trigger\*\*:?\s*([^\n]+)', b)
        fun = re.search(r'\*\*Funzione\*\*:?\s*([^\n]+)', b)
        val = re.search(r'\*\*Valori[^\n]*', b)
        trigger = trigger_di(trig.group(1) if trig else (val.group(0) if val else ''))
        # Le durate non si estraggono: una prima cifra letta nel testo non e la durata dell'effetto. Restano nel file del visitatore.
        valore = {'trigger': trigger}
        non_mis = ['durata_ms', 'curva', 'proprieta']
        desc = ' '.join((fun.group(1) if fun else nome).split())
        righe.append({
            'caratteristica': 'effetto o animazione',
            'ambito': f'{ambito_di(nome, '')} · {mid} {nome}',
            'stato': 'presente', 'valore': valore, 'non_misurati': non_mis,
            'descrizione': f'{nome}. {desc}'[:400],
            'evidenze': [f'ricerca/movimento/{rid}.md#{mid}'],
            'origine': f'movimento/{rid}.md (riga estratta dal worker di costruzione: l\'osservazione {rid}.json non aveva righe «effetto o animazione»)',
        })
    return righe

aggiunte = {}
for r in out:
    if not any(o['caratteristica'] == 'effetto o animazione' for o in r['osservazioni']) and os.path.exists(f'{BASE}/movimento/{r["id"]}.md'):
        nuove = effetti(r['id'])
        r['osservazioni'].extend(nuove)
        aggiunte[r['id']] = len(nuove)
json.dump({'riferimenti': out}, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('riferimenti', len(out), 'righe effetto aggiunte', aggiunte)
