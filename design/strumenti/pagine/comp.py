# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
import json
TEMPI = json.load(open('/workspace/kalliope/site/voce/tempi.json'))['file']

FRASI = {
    1: dict(titolo='Frase 1 di 3: un saluto',
            scritto=['Buongiorno a tutti!', 'Scrivo invece di parlare, ma vi seguo benissimo.'],
            detto=['Buongiorno a tutti!', 'Scrivo invece di parlare, ma vi seguo benissimo.'], uguale=True),
    2: dict(titolo='Frase 2 di 3: una data e un orario',
            scritto=["Sono d'accordo con Paola.", 'Però la consegna del <span class="cambia">14/3</span> mi sembra stretta: possiamo sentirci venerdì alle <span class="cambia">15:30</span>?'],
            detto=["Sono d'accordo con Paola.", 'Però la consegna del <span class="cambia">quattordici marzo</span> mi sembra stretta: possiamo sentirci venerdì alle <span class="cambia">quindici e trenta</span>?'], uguale=False),
    3: dict(titolo='Frase 3 di 3: un importo',
            scritto=['Il preventivo è di <span class="cambia">1.250 € + IVA</span>, valido fino al <span class="cambia">31 dicembre</span>.'],
            detto=['Il preventivo è di <span class="cambia">milleduecentocinquanta euro più IVA</span>, valido fino al <span class="cambia">trentuno dicembre</span>.'], uguale=False),
}
VOCI = [('giulia', 'Giulia'), ('marco', 'Marco')]


def secondi(x):
    return f'{round(x)} secondi'


def righe(lista):
    return ' '.join(f'<span class="frase" data-frase="{i+1}">{t}</span>' for i, t in enumerate(lista))


def ascolto(n, P, voci=('giulia', 'marco'), livello=3, hero=False, id_=None):
    """Riquadro «Tu scrivi / Kalliope dice» con le voci. hero=True: variante del primo schermo (senza titolo visibile, una voce)."""
    f = FRASI[n]
    h = f'h{livello}'
    idt = f'a{n}-titolo{"-hero" if hero else ""}'
    blocchi = []
    for v, nome in VOCI:
        if v not in voci:
            continue
        file = f'{v}-{n}'
        d = TEMPI[file]['durata_s']
        blocchi.append(f'''<div class="voce" data-file="{file}" data-nome="{nome}" data-testo-avvia="Ascolta" data-testo-ferma="Ferma" data-testo-frase="frase" data-testo-di="di" data-testo-errore="Questo browser non riproduce il file. Usa il collegamento «Scarica il file» qui sotto.">
<p class="voce__nome">{nome} · {secondi(d)}</p>
<div class="voce__controlli"></div>
<audio controls preload="none" aria-label="{nome}, {f['titolo'].split(':')[0].lower()}, {secondi(d)}"><source src="{P}voce/{file}.opus" type="audio/ogg; codecs=opus"><source src="{P}voce/{file}.mp3" type="audio/mpeg">Il tuo browser non riproduce l'audio. <a href="{P}voce/{file}.mp3">Scarica il file MP3</a>.</audio>
<p class="voce__file"><a href="{P}voce/{file}.mp3" download>Scarica il file (MP3, {secondi(d)})</a></p>
</div>''')
    nota = '<p class="nota-uguale">Qui Kalliope dice esattamente ciò che scrivi: nessuna cifra da trasformare.</p>' if f['uguale'] else ''
    classe = 'ascolto ascolto--hero' if hero else 'ascolto'
    idattr = f' id="{id_}"' if id_ else ''
    titolo = (f'<{h} id="{idt}" class="solo-lettore" data-qa-salta>{f["titolo"]}</{h}>' if hero else f'<{h} id="{idt}">{f["titolo"]}</{h}>')
    return f'''<article class="{classe}"{idattr} aria-labelledby="{idt}">
{titolo}
<div class="riga-testo">
<span class="riga-testo__etichetta">Tu scrivi</span>
<span class="scritto">{righe(f['scritto'])}</span>
</div>
<div class="riga-testo">
<span class="riga-testo__etichetta">Kalliope dice</span>
<span class="detto">{righe(f['detto'])}</span>
</div>
{nota}<div class="voci">
{chr(10).join(blocchi)}
</div>
</article>'''


def stato_card(compatto, P, titolo_livello=2):
    h = f'h{titolo_livello}'
    hc = f'h{titolo_livello + 1}'
    if compatto:
        col1 = '<p>La voce arriva al microfono «Kalliope». L\'installazione è provata da uno script su Ubuntu, Fedora e Arch.</p>'
        col2 = '<p>Una riunione vera con Zoom, Teams o Meet su un computer di tutti i giorni.</p>'
        col3 = '<p>Windows, macOS e telefono. Altre lingue oltre all\'italiano.</p>'
        piede = f'<p class="stato__piede"><a href="{P}stato/">Leggi tutto lo stato e i limiti</a></p>'
        idt = 'stato-titolo-breve'
    else:
        col1 = '''<ul>
<li>La voce arriva al microfono «Kalliope», con un sistema audio PipeWire preparato per la prova.</li>
<li>L'installazione è provata da uno script su Ubuntu 24.04, Fedora e Arch.</li>
<li>Parole sbagliate secondo Whisper sulla voce registrata dal microfono: 2,3% su 10 frasi di prova; circa una parola su 45 sui sei campioni di questo sito.</li>
</ul>'''
        col2 = '''<ul>
<li>Una riunione vera con Zoom, Teams o Meet su un computer di tutti i giorni.</li>
<li>Il tempo fra il tasto Invio e il suono nella riunione.</li>
<li>Lettori di schermo, puntamento oculare e interruttori.</li>
<li>Computer diversi da quello su cui abbiamo fatto le misure.</li>
</ul>'''
        col3 = '''<ul>
<li>Windows, macOS, telefono e tablet.</li>
<li>Una voce clonata dalla tua. Oggi non c'è; se arriverà, sarà solo con il tuo consenso.</li>
<li>Altre lingue oltre all'italiano.</li>
<li>Frasi già pronte, pittogrammi e suggerimenti mentre scrivi.</li>
<li>Sottotitoli della riunione: Kalliope non ascolta e non trascrive.</li>
</ul>'''
        piede = ''
        idt = 'stato-titolo'
    return f'''<section class="stato" aria-labelledby="{idt}">
<div class="stato__testa">
{'<span class="barre barre--piccole" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>'}
<{h} id="{idt}">Com'è messo Kalliope oggi</{h}>
<span class="stato__versione solo-prova">Versione di prova {{{{kalliope.version}}}}</span>
</div>
<div class="stato__colonne">
<div class="stato__col" data-tipo="provato">
<{hc}><span class="stato__segno" aria-hidden="true">✓</span>Provato</{hc}>
{col1}
</div>
<div class="stato__col" data-tipo="non-provato">
<{hc}><span class="stato__segno" aria-hidden="true">?</span>Non ancora provato</{hc}>
{col2}
</div>
<div class="stato__col" data-tipo="non-esiste">
<{hc}><span class="stato__segno" aria-hidden="true">×</span>Non esiste</{hc}>
{col3}
</div>
</div>
{piede}
</section>'''


ALT_FINESTRA = ("La finestra di Kalliope. In alto una riga di stato: «Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.» "
                "Sotto, un campo con la scritta «Scrivi qui e premi Invio per parlare» e i pulsanti Parla e Ferma. "
                "In basso la scelta della voce (Giulia), la casella «Senti anche tu» spuntata e il pulsante Informazioni.")


def foto(P, didascalia='La finestra di Kalliope, come si presenta con la voce pronta.', piccola=False):
    return f'''<figure class="foto{' foto--piccola' if piccola else ''}">
<img src="{P}immagini/kalliope-finestra.png" width="640" height="500" alt="{ALT_FINESTRA}">
<figcaption>{didascalia}</figcaption>
</figure>'''


def comando(testo, etichetta='Copia il comando'):
    t = testo.replace('&', '&amp;').replace('<', '&lt;')
    return f'''<div class="comando">
<pre><code>{t}</code></pre>
<div class="comando__barra"><button type="button" class="btn btn--piccolo" data-copia data-testo-ok="Copiato." data-testo-no="Non riesco a copiare da solo: seleziona il testo e copialo.">{etichetta}</button><span class="comando__stato" role="status"></span></div>
</div>'''


def controllo(testo):
    return f'<div class="controllo"><span class="controllo__titolo">Come sai che è andata bene</span>{testo}</div>'


def se_non_va(testo):
    return f'<div class="se-non-va"><span class="se-non-va__titolo">Se non è andata</span>{testo}</div>'


def dettagli(titolo, corpo, aperto=False):
    return f'<details class="dettagli"{" open" if aperto else ""}><summary>{titolo}</summary><div class="dettagli__corpo">\n{corpo}\n</div></details>'
