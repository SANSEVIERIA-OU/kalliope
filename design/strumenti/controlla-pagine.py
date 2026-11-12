#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Controlli deterministici delle pagine di site/ (nessun browser): intestazione e piede uguali, collegamenti interni e ancore che esistono,
nessuna risorsa da terzi, un H1, lingua, alternative delle immagini, segnaposto al posto di versioni scritte a mano, token usati e definiti.
Uso: python3 -I design/strumenti/controlla-pagine.py     Uscita 1 se ci sono errori. Prova di controllo: --guasta applica un difetto a una copia in memoria e deve fallire."""
import re, sys, os, glob
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

SITE = '/workspace/kalliope/site/'
errori = []

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.risorse, self.h1, self.imgs, self.lang, self.stack = set(), [], [], 0, [], None, []
        self.testo_titolo = None
    def handle_starttag(self, t, a, ):
        a = dict(a)
        if t == 'html': self.lang = a.get('lang')
        if 'id' in a: self.ids.add(a['id'])
        if t == 'a' and 'href' in a: self.links.append(a['href'])
        if t == 'h1': self.h1 += 1
        if t == 'img': self.imgs.append(a)
        if t in ('script', 'img', 'source', 'iframe', 'audio', 'video') and a.get('src'): self.risorse.append(a['src'])
        if t == 'link' and a.get('href') and a.get('rel') in ('stylesheet', 'icon', 'preload'): self.risorse.append(a['href'])
        if t in ('iframe', 'embed', 'object'): self.risorse.append('EMBED:' + t)

def carica(pagine):
    out = {}
    for f in pagine:
        html = open(f, encoding='utf-8').read()
        p = P(); p.feed(html); out[f] = (html, p)
    return out

def sezione(html, tag):
    m = re.search(rf'<{tag}[ >].*?</{tag}>', html, re.S)
    return m.group(0) if m else ''

def normalizza(blocco, f):
    b = re.sub(r' aria-current="page"', '', blocco)
    return re.sub(r'(href|src)="(?:\.\./|\./)*(?!https?:|#|\{\{)', r'\1="@', b)

def controlla(pagine, guasta=None):
    dati = carica(pagine)
    errori.clear()
    if guasta:
        guasta(dati)
    ref_h = ref_f = None
    versioni = re.compile(r'(?<![\d.,])\d+\.\d+(?:-rc\.\d+)?(?![\d.,])')
    ok_versioni = {'2.39', '24.04', '4.0', '1.0', '1.6', '2.3', '1.5', '10.6', '0.07', '0.26', '2.2', '3.0', '0.1'}
    for f, (html, p) in dati.items():
        n = os.path.relpath(f, SITE)
        if p.lang != 'it': errori.append(f'{n}: lang diverso da it ({p.lang})')
        if p.h1 != 1 and n != 'sistema/ricerca/index.html' or (n == 'sistema/ricerca/index.html' and p.h1 != 1): errori.append(f'{n}: {p.h1} H1 invece di 1')
        for img in p.imgs:
            if 'alt' not in img: errori.append(f'{n}: immagine senza alt ({img.get("src")})')
            if not img.get('width') or not img.get('height'): errori.append(f'{n}: immagine senza dimensioni ({img.get("src")})')
        for r in p.risorse:
            if r.startswith('EMBED:') or urlparse(r).scheme in ('http', 'https') or r.startswith('//'): errori.append(f'{n}: risorsa da terzi o embed: {r}')
        if 'name="viewport"' in html and re.search(r'user-scalable\s*=\s*(no|0)|maximum-scale', html): errori.append(f'{n}: il viewport limita lo zoom')
        if re.search(r'style="[^"]*#[0-9a-fA-F]{3,6}', html): errori.append(f'{n}: colore scritto a mano in uno stile in linea')
        # intestazione e piede uguali (la 404 ha l'intestazione minima)
        if n != '404.html':
            h, ft = normalizza(sezione(html, 'header'), f), normalizza(sezione(html, 'footer'), f)
            if ref_h is None: ref_h, ref_f = h, ft
            if h != ref_h: errori.append(f'{n}: intestazione diversa dalle altre pagine')
            if ft != ref_f: errori.append(f'{n}: piede diverso dalle altre pagine')
        # collegamenti interni
        for l in p.links:
            u = urlparse(l)
            if u.scheme in ('http', 'https', 'mailto') or l.startswith('{{'): continue
            if n == '404.html' : base = SITE
            else: base = os.path.dirname(f) + '/'
            percorso = unquote(u.path)
            dest = os.path.normpath(os.path.join(base, percorso)) if percorso else f
            if os.path.isdir(dest): dest = os.path.join(dest, 'index.html')
            if percorso.endswith('questa-pagina-non-esiste/'): continue  # indirizzo che non esiste apposta: prova della 404
            if not os.path.exists(dest): errori.append(f'{n}: collegamento a un file che non esiste: {l}'); continue
            if u.fragment:
                altro = dati.get(dest) or (lambda h: (h, (lambda q: (q.feed(h), q)[1])(P())))(open(dest, encoding='utf-8').read())
                ids = altro[1].ids
                if u.fragment not in ids: errori.append(f'{n}: ancora inesistente {l}')
        # versioni scritte a mano (fuori dai segnaposto)
        testo = re.sub(r'<[^>]+>', ' ', re.sub(r'\{\{kalliope\.[a-z0-9.]+\}\}', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.S)))
        for m in re.finditer(r'[Vv]ersione (?:di prova )?\d+\.\d+', testo):
            errori.append(f'{n}: versione scritta a mano: «{m.group(0)}»')
        for m in re.finditer(r'0\.1-rc\.\d', testo):
            if n not in ('ascolta/index.html', 'sistema/index.html', 'sistema/ricerca/index.html'): errori.append(f'{n}: versione 0.1-rc.1 scritta a mano')
        for pat in ('kalliope-0.', '.deb', '.rpm'):
            pass
        for m in re.finditer(r'kalliope-\d[\w.~-]*(?:amd64\.deb|x86_64\.rpm|\.tar\.gz)', testo):
            errori.append(f'{n}: nome di pacchetto scritto a mano: {m.group(0)}')
    # un collegamento già visitato non cambia colore: un comando pieno resterebbe illeggibile (verde scuro su verde scuro)
    for css in glob.glob(SITE + 'stile/*.css'):
        if re.search(r':visited\s*\{[^}]*color', open(css, encoding='utf-8').read()):
            errori.append(f'{os.path.basename(css)}: regola :visited con un colore (rende illeggibili i bottoni già visitati)')
    # token: ogni var(--x) usata nei fogli di stile è definita in token.css
    token = open(SITE + 'stile/token.css', encoding='utf-8').read()
    definiti = set(re.findall(r'(--[\w-]+)\s*:', token))
    for css in glob.glob(SITE + 'stile/*.css'):
        t = open(css, encoding='utf-8').read()
        usati = set(re.findall(r'var\((--[\w-]+)', t))
        locali = set(re.findall(r'(--[\w-]+)\s*:', t)) if css.endswith('componenti.css') else set()
        for u in usati - definiti - locali: errori.append(f'{os.path.basename(css)}: var({u}) senza definizione')
        if not css.endswith('token.css'):
            for m in re.finditer(r'#[0-9a-fA-F]{3,8}\b', re.sub(r'/\*.*?\*/', '', t, flags=re.S)):
                errori.append(f'{os.path.basename(css)}: colore scritto a mano fuori dai token ({m.group(0)})')
    return list(errori)

if __name__ == '__main__':
    pagine = sorted(glob.glob(SITE + '**/*.html', recursive=True))
    e = controlla(pagine)
    for x in e: print('ERRORE', x)
    print(f'{len(pagine)} pagine controllate, {len(e)} errori')
    if '--guasta' in sys.argv:
        # il controllo deve riconoscere una copia guastata apposta: aggiungo un embed, tolgo un alt, rompo un'ancora e cambio il piede
        def guasto(dati):
            f = next(k for k in dati if k.endswith('stato/index.html'))
            html, p = dati[f]
            p.risorse.append('https://example.org/x.js'); p.imgs.append({'src': 'x.png'}); p.links.append('../aiuto/#non-esiste')
            dati[f] = (html.replace('Codice sorgente disponibile', 'Codice modificato'), p)
        g = controlla(pagine, guasto)
        riconosciuti = [x for x in g if any(k in x for k in ('terzi', 'senza alt', 'ancora inesistente', 'piede diverso'))]
        print('copia guastata: riconosciuti', len(riconosciuti), 'difetti su 4')
        sys.exit(0 if len(riconosciuti) >= 4 else 1)
    sys.exit(1 if e else 0)
