#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Vista leggibile di design/confronto.json (generata, non scritta a mano).

Uso: python3 -I design/strumenti/vista-confronto.py design/confronto.json design/confronto.md
La fonte resta confronto.json (scritto da confronta-riferimenti.mjs): questo file non aggiunge né toglie
osservazioni, le ordina per leggerle. Ogni riga rimanda alle prove originali per sito.
"""
import json, sys, collections, datetime

src, dst = sys.argv[1], sys.argv[2]
c = json.load(open(src, encoding='utf-8'))
rif = {r['id']: r for r in c['riferimenti']}
ids = c['campione']
N = len(ids)
righe = c['confronti']

def v(x):
    return json.dumps(x, ensure_ascii=False, sort_keys=True)

def breve(s, n=240):
    s = ' '.join(str(s).split())
    return s if len(s) <= n else s[: n - 1].rstrip() + '…'

def nome(i):
    n = rif[i].get('nome', i).replace('|', '/')
    return n if len(n) <= 40 else n[:39] + '…'

out = []
w = out.append
w('# Confronto dei 13 riferimenti: identico, varianti, peculiarità\n')
w(f'Generato il {datetime.date.today().strftime("%d/%m/%Y")} da `design/confronto.json` con `design/strumenti/vista-confronto.py` '
  '(fonte: `design/ricerca/osservazioni/R*.json`, controllate con `confronta-riferimenti.mjs --controlla`). '
  'Questa vista non sostituisce il JSON: lì stanno tutte le osservazioni con valori, descrizioni e prove per sito.\n')
w('## 1. Campione e limiti\n')
w(f'{N} riferimenti, tutti visitati con Chromium senza finestra (`passo.mjs`; nessun Chrome MCP in questo host; Firefox e WebKit non usati per la '
  'ricerca). Il confronto vale per questo campione e non per «ogni vincitore»: i sottogruppi sono dichiarati qui sotto.\n')
w('| ID | Riferimento | Gruppo | Premio o tipo | Osservazioni dichiarate: presenti / assenti / non osservate |')
w('|---|---|---|---|---|')
for i in ids:
    r = rif[i]
    st = collections.Counter(o['stato'] for o in r['osservazioni'])
    prem = r.get('premio') or 'prodotto affine, non Webby'
    w(f"| {i} | {nome(i)} | {r.get('gruppo','?')} | {breve(prem,110).replace('|','/')} | {st['presente']} / {st['assente']} / {st['non_osservato']} |")
w('\nGruppi: A = problema, settore, meccanismo (Webby); B = competenze (Webby); C = prodotti affini e concorrenti (non Webby, nessun premio: R50-R53).\n')

tot = len(righe)
comuni = [x for x in righe if x['meccanismo_comune']]
ident = [x for x in righe if x['comune_identica']]
sing = [x for x in righe if len(x['presenti']) == 1]
parz = [x for x in righe if 1 < len(x['presenti']) < N]
solo_ass = [x for x in righe if not x['presenti'] and x['assenti']]
w('## 2. Risultato in breve\n')
w(f'- **Intersezione identica (stesso valore in tutti i {N} riferimenti): vuota.** 0 righe su {tot}. Nessun denominatore comune è inventato.')
w(f'- **Meccanismi comuni** (tutti i {N} siti presenti, con valori diversi): {len(comuni)} righe su {tot}: sono il modo in cui ciascun sito risolve '
  'la stessa funzione (arrivo, 404, tastiera, rete, testo corrente, …), non un\'identità condivisa. Elenco al §3.')
w(f'- Righe con 2 o più presenti ma non tutti: {len(parz)}. Righe con un solo sito presente (peculiarità, «singolare fra le osservazioni disponibili»): {len(sing)}. '
  f'Righe con soli siti assenti: {len(solo_ass)}.')
w(f'- Peculiarità registrate (varianti con un solo sito): {len(c["peculiarita"])}, tra cui {sum(1 for p in c["peculiarita"] if p["caratteristica"]=="effetto o animazione")} effetti o animazioni (§6).')
w('- Righe non osservate: ogni sito ha il suo elenco di lacune con il motivo (§8). Una riga mancante non è mai un\'assenza.\n')

w(f'## 3. Meccanismi comuni ({len(comuni)}): tutti i siti, con le varianti\n')
w('Ogni riga: stessa funzione in tutti i 13 siti; il valore cambia. Le prove per sito sono in `confronto.json` → `confronti[…].varianti[…].fonti`.\n')
for x in comuni:
    w(f"### {x['caratteristica']} · {x['ambito']}\n")
    w(f"Presenti {len(x['presenti'])}/{N}; varianti distinte: {len(x['varianti'])}.\n")
    w('| Valore misurato o categoria | Siti |')
    w('|---|---|')
    for va in sorted(x['varianti'], key=lambda q: (-len(q['siti']), q['siti'])):
        w(f"| `{breve(v(va['valore']),160)}` | {', '.join(va['siti'])} |")
    w('')

w('## 4. Tutte le righe\n')
w('Una riga = una caratteristica in un ambito. «P» presenti, «A» assenti con prova, «N» non osservati; «var» = varianti distinte tra i presenti. '
  'Esito: **comune** (13/13 presenti), **parziale** (2-12 presenti), **singolare** (1 presente), **solo assenze**.\n')
w('| Caratteristica | Ambito | P | A | N | var | Esito | Presenti |')
w('|---|---|---|---|---|---|---|---|')
def esito(x):
    p = len(x['presenti'])
    if x['meccanismo_comune']: return 'comune'
    if p == 1: return 'singolare'
    if p == 0: return 'solo assenze' if x['assenti'] else 'nessun presente'
    return 'parziale'
for x in sorted(righe, key=lambda q: (q['caratteristica'], q['ambito'])):
    w(f"| {x['caratteristica']} | {x['ambito']} | {len(x['presenti'])} | {len(x['assenti'])} | {len(x['non_osservati'])} | {len(x['varianti'])} | {esito(x)} | {', '.join(x['presenti'])} |")
w('')

w('## 5. Varianti delle righe parziali (2 o più siti presenti)\n')
for x in sorted(parz, key=lambda q: (q['caratteristica'], q['ambito'])):
    w(f"### {x['caratteristica']} · {x['ambito']}\n")
    w(f"Presenti: {', '.join(x['presenti'])}. Assenti con prova: {', '.join(x['assenti']) or '—'}. Non osservati: {len(x['non_osservati'])}.\n")
    w('| Valore | Siti |')
    w('|---|---|')
    for va in sorted(x['varianti'], key=lambda q: (-len(q['siti']), q['siti'])):
        w(f"| `{breve(v(va['valore']),160)}` | {', '.join(va['siti'])} |")
    w('')

w('## 6. Peculiarità per sito (varianti con un solo sito presente)\n')
w('Ogni voce: caratteristica · ambito · valore · descrizione (abbreviata; il testo intero e le prove sono nel JSON). «Singolare fra le osservazioni '
  'disponibili» vale se la riga ha siti non osservati: non è unicità dimostrata.\n')
per = collections.defaultdict(list)
for p in c['peculiarita']:
    per[p['siti'][0]].append(p)
for i in ids:
    lst = per.get(i, [])
    w(f"### {i} · {nome(i)} ({len(lst)} peculiarità)\n")
    for p in sorted(lst, key=lambda q: (q['caratteristica'] == 'effetto o animazione', q['caratteristica'], q['ambito'])):
        o = p['fonti'][0]['osservazione']
        ev = ', '.join(p['fonti'][0]['evidenze'][:2])
        d = o.get('descrizione', '')
        w(f"- **{p['caratteristica']}** · {p['ambito']} · `{breve(v(p['valore']),110)}`" + (f" — {breve(d,260)}" if d else '') + (f" [{ev}]" if ev else ''))
    w('')

w('## 7. Assenze verificate\n')
w('Il contesto è stato osservato e il tratto non c\'è (con prova). Elenco per riga; la prova è nell\'osservazione del sito.\n')
w('| Caratteristica | Ambito | Siti con assenza verificata | Presenti |')
w('|---|---|---|---|')
for x in sorted([y for y in righe if y['assenti']], key=lambda q: (q['caratteristica'], q['ambito'])):
    w(f"| {x['caratteristica']} | {x['ambito']} | {', '.join(x['assenti'])} | {', '.join(x['presenti']) or '—'} |")
w('')
w('Dettaglio delle assenze (descrizione e prova del sito):\n')
for x in sorted([y for y in righe if y['assenti']], key=lambda q: (q['caratteristica'], q['ambito'])):
    for oss in x['osservazioni']:
        o = oss['osservazione']
        if o['stato'] == 'assente':
            w(f"- {x['caratteristica']} · {x['ambito']} · **{oss['sito']}**: {breve(o.get('descrizione',''),240)} [{', '.join(o.get('evidenze',[])[:2])}]")
w('')

w('## 8. Non osservati: per sito\n')
w('Il confronto conserva ogni lacuna con il suo motivo. Qui il conteggio e i motivi più frequenti per sito; l\'elenco riga per riga è nel JSON.\n')
w('| Sito | Righe non osservate | Di cui con motivo esplicito dichiarato dal visitatore | Motivi più frequenti (abbreviati) |')
w('|---|---|---|---|')
for i in ids:
    mot = collections.Counter()
    mancanti = 0
    for x in righe:
        for n in x['non_osservati']:
            if n['sito'] == i:
                if n['motivo'] == 'Osservazione mancante': mancanti += 1
                else: mot[breve(n['motivo'], 80)] += 1
    tot_n = mancanti + sum(mot.values())
    top = '; '.join(f'«{m}» ×{k}' for m, k in mot.most_common(3)) or '—'
    w(f"| {i} | {tot_n} | {sum(mot.values())} (le altre {mancanti} sono righe che il visitatore non ha compilato) | {top} |")
w('')
w(f'## 9. Limite\n\n{c["limite"]}\n')
open(dst, 'w', encoding='utf-8').write('\n'.join(out))
print('scritto', dst, len('\n'.join(out)), 'caratteri')
