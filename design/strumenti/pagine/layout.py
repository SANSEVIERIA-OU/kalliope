# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Struttura comune delle pagine: intestazione, piede, meta. Una tantum: le pagine in site/ sono poi la fonte."""
BASE_URL = 'https://sansevieria-ou.github.io/kalliope/'
REPO = 'https://github.com/SANSEVIERIA-OU/kalliope'

VOCI = [('ascolta', 'Ascolta'), ('stato', 'Stato e limiti'), ('installa', 'Installa'), ('riunione', 'In riunione'), ('aiuto', 'Aiuto')]
TAPPE = [('ascolta', 'Ascolta'), ('stato', 'Stato e limiti'), ('installa', 'Installa'), ('riunione', 'In riunione'), ('aiuto', 'Aiuto')]


def percorso(P, corrente):
    """Una sola riga: «Passo N di 5: titolo». La navigazione principale resta quella in cima (non si ripete l'elenco)."""
    n = [slug for slug, _ in TAPPE].index(corrente) + 1
    nome = dict(TAPPE)[corrente]
    return f'<p class="percorso">Passo <b>{n}</b> di {len(TAPPE)}: <b>{nome}</b></p>'


def avanti(P, indietro, avanti_):
    """indietro / avanti_: (slug, nome) oppure None; slug '' = pagina iniziale."""
    parti = []
    if indietro:
        parti.append(f'<a href="{P}{indietro[0]}{"/" if indietro[0] else ""}"><small>Indietro</small>{indietro[1]}</a>')
    else:
        parti.append('<span></span>')
    if avanti_:
        parti.append(f'<a href="{P}{avanti_[0]}{"/" if avanti_[0] else ""}"><small>Avanti</small>{avanti_[1]}</a>')
    return '<nav class="avanti" aria-label="Indietro e avanti">\n' + '\n'.join(parti) + '\n</nav>'


import re as _re


def tipografia(testo):
    """Sistemazioni di scrittura che evitano a capo nel mezzo: numero e unità legati, «e-mail» e sigle intere. Non tocca i tag."""
    def sistema(parte):
        parte = _re.sub(r'(?<=\d) (?=(?:secondi|minuti|MB|kB|ms|px|kbit/s|byte|bit)\b)', '\u00a0', parte)
        parte = parte.replace('e-mail', '<span class="nowrap">e-mail</span>').replace('CC BY-SA 4.0', '<span class="nowrap">CC BY-SA 4.0</span>')
        return parte
    # solo il testo fuori dai tag
    pezzi = _re.split(r'(<[^>]*>)', testo)
    out, dentro_code = [], False
    for p in pezzi:
        if p.startswith('<'):
            out.append(p)
            continue
        out.append(sistema(p))
    return ''.join(out)


def pagina(slug, titolo, descrizione, corpo, corrente=None, extra_head='', profondita=None, intestazione_minima=False, base_tag=None, h1_og=None):
    """slug: '' per la home, altrimenti 'ascolta'. profondita: 0 per la home, 1 per le altre."""
    prof = 0 if slug == '' else (profondita if profondita is not None else 1)
    P = '' if prof == 0 else '../' * prof
    Pn = './' if prof == 0 else P
    url = BASE_URL + ('404.html' if slug == '404' else (slug + '/' if slug else ''))
    nav = ''.join(
        f'<li><a href="{Pn}{s}/"' + (' aria-current="page"' if s == corrente else '') + f'>{n}</a></li>' for s, n in VOCI)
    corpo = tipografia(corpo)
    base = f'<base href="/kalliope/">\n' if base_tag else ''
    if intestazione_minima:
        testata = f'''<header class="sito-intestazione">
<div class="pagina">
<a class="marca" href="{Pn}" aria-label="Kalliope, pagina iniziale"><img src="{P}immagini/icona.svg" alt="" width="40" height="40"><span>Kalliope</span></a>
</div>
</header>'''
        salta = ''
    else:
        salta = '<a class="salta" href="#contenuto">Vai al contenuto</a>\n'
        testata = f'''<header class="sito-intestazione">
<div class="pagina">
<a class="marca" href="{Pn}" aria-label="Kalliope, pagina iniziale"><img src="{P}immagini/icona.svg" alt="" width="40" height="40"><span>Kalliope</span></a>
<nav class="nav" aria-label="Principale">
<ul>
{nav}
</ul>
</nav>
</div>
</header>'''
    return f'''<!DOCTYPE html>
<!-- SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 -->
<html lang="it">
<head>
<meta charset="utf-8">
{base}<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="text-scale" content="scale">
<title>{titolo}</title>
<meta name="description" content="{descrizione}">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="Kalliope">
<meta property="og:title" content="{titolo}">
<meta property="og:description" content="{descrizione}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE_URL}immagini/kalliope-finestra.png">
<meta property="og:image:alt" content="La finestra di Kalliope: un campo dove scrivere, i pulsanti Parla e Ferma, la scelta della voce.">
<link rel="canonical" href="{url}">
<link rel="icon" href="{P}immagini/icona.svg" type="image/svg+xml">
<link rel="stylesheet" href="{P}stile/token.css">
<link rel="stylesheet" href="{P}stile/base.css">
<link rel="stylesheet" href="{P}stile/componenti.css">
{extra_head}<script src="{P}script/kalliope.js" defer></script>
</head>
<body data-prerelease="{{{{kalliope.prerelease}}}}" data-versione="{{{{kalliope.version}}}}">
{salta}{testata}
<main id="contenuto" tabindex="-1">
{corpo}
</main>
{piede(Pn)}
</body>
</html>
'''


def piede(Pn):
    return f'''<footer class="sito-piede">
<div class="pagina">
<div>
<h2>Kalliope</h2>
<p>Un programma per scrivere e farsi sentire nelle riunioni. <span class="solo-prova">Versione di prova {{{{kalliope.version}}}}, pubblicata il {{{{kalliope.date}}}}.</span></p>
<p>Codice sorgente disponibile, licenza SANSEVIERIA 1.0. Non è software «open source» nel senso dell'OSI. Prodotto da SANSEVIERIA OÜ.</p>
<p>Questo sito non usa cookie, non ha statistiche e non carica nulla da altri siti. I file li serve GitHub Pages, che registra le richieste come ogni host.</p>
</div>
<div>
<h2>Nel sito</h2>
<ul>
<li><a href="{Pn}non-ancora/">Windows e macOS: non ancora</a></li>
<li><a href="{Pn}sistema/">Come è fatto questo sito</a></li>
<li><a href="{Pn}aiuto/#segnala">Segnala un problema</a></li>
</ul>
</div>
<div>
<h2>Fuori da questo sito</h2>
<ul>
<li><a href="{REPO}">Codice sorgente su GitHub</a></li>
<li><a href="{{{{kalliope.release.url}}}}">Pagina della versione {{{{kalliope.version}}}}</a></li>
<li><a href="{REPO}/issues">Segnalazioni su GitHub (serve un account)</a></li>
</ul>
</div>
</div>
</footer>'''


def barre(piccole=False):
    return f'<span class="barre{" barre--piccole" if piccole else ""}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>'


def indice(voci, titolo='In questa pagina'):
    """voci: elenco di (ancora, testo). Chip di collegamenti alle sezioni della stessa pagina, in un dettaglio chiuso (poco spazio sul telefono)."""
    li = '\n'.join(f'<li><a href="#{a}">{t}</a></li>' for a, t in voci)
    return f'<nav class="indice-pagina" aria-label="{titolo}">\n<details class="dettagli"><summary>{titolo}</summary><div class="dettagli__corpo">\n<ul>\n{li}\n</ul>\n</div></details>\n</nav>'
