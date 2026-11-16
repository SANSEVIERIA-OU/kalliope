#!/usr/bin/env python3 -I
"""Cerca nei fogli di stile ogni dichiarazione che ha un lato o un verso (sinistra/destra, orizzontale).
Uso: analisi-css.py <cartella design-system> [--json]
Segnala: proprietà fisiche; scorciatoie (padding, margin, border-radius, inset…) con lati diversi, risolvendo var();
         trasformazioni orizzontali, origini, posizioni di sfondo, sfumature orizzontali, ombre con scarto x, clip-path, mask…
"""
import json, re, sys, pathlib

root = pathlib.Path(sys.argv[1])
tokens = {}
for m in re.finditer(r'(--[a-z0-9-]+)\s*:\s*([^;]+);', (root / 'token.css').read_text()):
    tokens[m.group(1)] = m.group(2).strip()

def risolvi(v, prof=0):
    def sost(m):
        nome, fallback = m.group(1), m.group(2)
        if nome in tokens and prof < 12:
            return risolvi(tokens[nome], prof + 1)
        return fallback or m.group(0)
    return re.sub(r'var\((--[a-z0-9-]+)(?:\s*,\s*([^)]*))?\)', sost, v)

def dichiarazioni(testo):
    """(riga, selettore-contesto, proprietà, valore) di ogni dichiarazione"""
    out, pila, buf, riga, inizio = [], [], '', 1, 1
    sel = ''
    i, n = 0, len(testo)
    t = re.sub(r'/\*.*?\*/', lambda m: re.sub(r'[^\n]', ' ', m.group(0)), testo, flags=re.S)
    attuale = ''
    riga = 1
    cur_start = 1
    while i < n:
        c = t[i]
        if c == '\n': riga += 1
        if c == '{':
            pila.append((attuale.strip(), cur_start)); attuale = ''; cur_start = riga
        elif c == '}':
            if pila: pila.pop()
            attuale = ''; cur_start = riga
        elif c == ';':
            d = attuale.strip()
            if ':' in d and pila:
                p, v = d.split(':', 1)
                out.append((cur_start, ' | '.join(x[0] for x in pila), p.strip(), v.strip()))
            attuale = ''; cur_start = riga
        else:
            if not attuale.strip() and c.strip(): cur_start = riga
            attuale += c
        i += 1
    # ultima dichiarazione senza ;
    return out

def top(v):
    parti, d, cur = [], 0, ''
    for c in v:
        if c == '(': d += 1
        if c == ')': d -= 1
        if c == ' ' and d == 0:
            if cur: parti.append(cur); cur = ''
        else: cur += c
    if cur: parti.append(cur)
    return parti

def espandi(parti):
    if len(parti) == 1: return parti * 4
    if len(parti) == 2: return [parti[0], parti[1], parti[0], parti[1]]
    if len(parti) == 3: return [parti[0], parti[1], parti[2], parti[1]]
    return parti[:4]

FISICHE = re.compile(r'^(margin|padding|border|scroll-margin|scroll-padding)-(left|right)(-.*)?$|^(left|right)$|^border-(top|bottom)-(left|right)-radius$')
SCORCIATOIE = {'margin', 'padding', 'inset', 'border-width', 'border-color', 'border-style', 'scroll-margin', 'scroll-padding'}
trovati = []
for f in sorted(list(root.glob('*.css')) + list((root / 'componenti').glob('*.css')) + list((root / 'catalogo').glob('*.css'))):
    if f.name == 'token.css': continue
    for riga, ctx, p, v in dichiarazioni(f.read_text()):
        rv = risolvi(v)
        tipo = None
        if FISICHE.match(p): tipo = 'FISICA'
        elif p == 'text-align' and rv.strip() in ('left', 'right'): tipo = 'FISICA'
        elif p in SCORCIATOIE:
            q = espandi(top(rv))
            if len(q) == 4 and q[1] != q[3]: tipo = 'SCORCIATOIA ASIMMETRICA'
        elif p == 'border-radius':
            h = rv.split('/')[0]
            q = espandi(top(h))
            if len(q) == 4 and len({*q}) > 1: tipo = 'ANGOLI DIVERSI'
        elif p == 'float' or p == 'clear': tipo = 'FISICA'
        elif p in ('transform', 'translate', 'rotate', 'scale') and re.search(r'translate(X|3d)?\(|translate\(|scaleX|scale\(|rotate|skew|\bscale\b', rv): tipo = 'TRASFORMAZIONE'
        elif p == 'transform-origin': tipo = 'ORIGINE'
        elif p in ('background-position', 'background-position-x', 'object-position', 'mask-position', '-webkit-mask-position'): tipo = 'POSIZIONE'
        elif re.search(r'(linear-gradient|repeating-linear-gradient)\((to (left|right)|90deg|270deg|-90deg|[0-9.]+deg)', rv) and not re.search(r'\((180deg|0deg|360deg)', rv): tipo = 'SFUMATURA'
        elif p in ('box-shadow', 'text-shadow', 'filter') and re.search(r'drop-shadow|\d', rv):
            if p != 'filter':
                for ombra in re.split(r',(?![^(]*\))', rv):
                    q = top(ombra.strip())
                    nums = [x for x in q if re.match(r'^-?[0-9.]+(px|em|rem)?$', x) or x.startswith('calc')]
                    if nums and not re.match(r'^0(px)?$', nums[0]) and not q[0] == 'inset' or (len(q) > 1 and q[0] == 'inset' and not re.match(r'^0(px)?$', q[1])):
                        tipo = 'OMBRA CON SCARTO'; break
        elif p == 'clip-path' or p == '-webkit-clip-path': tipo = 'RITAGLIO'
        elif p in ('mask', '-webkit-mask', 'mask-image', 'mask-position') and 'gradient' in rv: tipo = 'MASCHERA'
        elif p in ('direction', 'unicode-bidi', 'writing-mode'): tipo = 'DIREZIONE'
        elif p in ('animation', 'animation-name') : tipo = None
        elif p in ('flex-direction',) and 'reverse' in rv: tipo = 'ORDINE'
        elif p in ('overflow-x', 'scroll-snap-type') : tipo = None
        if tipo:
            trovati.append({'file': str(f.relative_to(root)), 'riga': riga, 'tipo': tipo, 'proprieta': p, 'valore': v, 'risolto': rv if rv != v else None, 'contesto': ctx})
if '--json' in sys.argv:
    print(json.dumps(trovati, ensure_ascii=False, indent=1))
else:
    for t in trovati:
        print(f"{t['file']}:{t['riga']}  {t['tipo']:<24} {t['proprieta']}: {t['valore']}" + (f"   => {t['risolto']}" if t['risolto'] else ''))
    from collections import Counter
    print(Counter(t['tipo'] for t in trovati), file=sys.stderr)
