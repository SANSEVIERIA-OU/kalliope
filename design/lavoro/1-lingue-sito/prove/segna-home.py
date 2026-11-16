#!/usr/bin/env python3 -I
"""Segna nella home i testi da tradurre (convenzione data-t, tools/i18n/pagina.py). Una volta sola, sulla home com'era in HEAD.
Ogni sostituzione dice quante volte deve trovare il testo: se il numero non torna, si ferma."""
import pathlib, sys
p = pathlib.Path(sys.argv[1]); s = p.read_text(encoding='utf-8')
def R(vecchio, nuovo, volte=1):
    global s
    n = s.count(vecchio)
    if n != volte:
        sys.exit(f"{n} occorrenze invece di {volte}: {vecchio[:90]!r}")
    s = s.replace(vecchio, nuovo)

# ---------- head ----------
R('<html lang="it">', '<html lang="it">')
R('<title>Kalliope · In riunione, alla pari</title>', '<title data-t="pagina.titolo">Kalliope · In riunione, alla pari</title>')
R('<meta name="description" content="Kalliope è un programma per il computer, per chi non può parlare o fa fatica: scrivi una frase, premi Invio, e nella riunione gli altri la sentono con una voce italiana naturale.">',
  '<meta name="description" content="Kalliope è un programma per il computer, per chi non può parlare o fa fatica: scrivi una frase, premi Invio, e nella riunione gli altri la sentono con una voce italiana naturale." data-t-content="pagina.descrizione">')
R('<script>document.documentElement.classList.add(\'js\');', '<script src="lingua.js" defer></script>\n<script>document.documentElement.classList.add(\'js\');')

# ---------- barra ----------
R('<a class="salta" href="#contenuto">Vai al contenuto</a>', '<a class="salta" href="#contenuto" data-t="salta">Vai al contenuto</a>')
R('<a class="marchio" href="./" aria-label="Kalliope, pagina iniziale">', '<a class="marchio" href="./" aria-label="Kalliope, pagina iniziale" data-t-aria-label="barra.marchio">')
R('      <span>Kalliope</span>\n    </a>', '      <span data-t="marchio.nome">Kalliope</span>\n    </a>')
R('<nav class="menu" id="menu" aria-label="Sezioni del sito">', '<nav class="menu" id="menu" aria-label="Sezioni del sito" data-t-aria-label="barra.sezioni">')
for chiave, testo, href in (('menu.ascolta', 'Ascolta', 'ascolta/'), ('menu.stato', 'Stato e limiti', 'stato/'), ('menu.installa', 'Installa', 'installa/'),
                            ('menu.riunione', 'In riunione', 'riunione/'), ('menu.aiuto', 'Aiuto', 'aiuto/')):
    R(f'<li><a href="{href}">{testo}</a></li>', f'<li><a href="{href}" data-t="{chiave}">{testo}</a></li>', 2)
R('        <li><a href="aiuto/" data-t="menu.aiuto">Aiuto</a></li>\n      </ul>\n    </nav>\n    <a class="pillola azione barra-azione"',
  '        <li><a href="aiuto/" data-t="menu.aiuto">Aiuto</a></li>\n        <li><a href="#lingue" data-lingua-corrente data-t-title="barra.lingua" title="Cambia lingua">Italiano</a></li>\n      </ul>\n    </nav>\n    <a class="pillola azione barra-azione"')
R('<a class="pillola azione barra-azione" href="installa/">Scarica e installa</a>', '<a class="pillola azione barra-azione" href="installa/" data-t="cta.scarica">Scarica e installa</a>')
R('<a class="pulsante-menu" href="#piede-sezioni" aria-controls="menu">Menu</a>', '<a class="pulsante-menu" href="#piede-sezioni" aria-controls="menu" data-t="barra.menu">Menu</a>')

# ---------- primo schermo ----------
R('<h1 id="titolo">', '<h1 id="titolo" data-t="apertura.titolo" data-t-nota="Quattro righe, una sotto l\'altra: le parole si possono spostare da una riga all\'altra, ma le righe restano quattro.">')
R('<p class="presentazione">', '<p class="presentazione" data-t="apertura.presentazione">')
R('<a class="pillola azione" href="installa/">Scarica e installa</a>', '<a class="pillola azione" href="installa/" data-t="cta.scarica">Scarica e installa</a>', 2)
R('<a class="collegamento" href="non-ancora/">Non uso Linux: cosa posso fare<span class="freccia" aria-hidden="true"></span></a>',
  '<a class="collegamento" href="non-ancora/" data-t="cta.non-linux">Non uso Linux: cosa posso fare<span class="freccia" aria-hidden="true"></span></a>', 3)
R('<p class="stato"><strong>Oggi:</strong>', '<p class="stato" data-t="apertura.stato"><strong>Oggi:</strong>')
R('<p class="didascalia">Ricostruzione', '<p class="didascalia" data-t="apertura.didascalia">Ricostruzione')
R('<section class="palco" aria-label="Kalliope al lavoro in una riunione: ricostruzione">', '<section class="palco" aria-label="Kalliope al lavoro in una riunione: ricostruzione" data-t-aria-label="palco.etichetta">')

# ---------- le frasi: la stessa struttura ovunque ----------
F1 = 'Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.'
F3_VECCHIA = 'Il preventivo è di <span class="unita">1.250 € +</span> IVA, valido fino al <span class="unita">31 dicembre.</span>'
F3 = 'Il preventivo è di <span class="unita" data-g="1">1.250 € +</span> IVA, valido fino al <span class="unita"><span data-g="2">31</span> dicembre.</span>'
F2_VECCHIA = 'Sono d\'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì <span class="unita">alle 15:30?</span>'
F2 = 'Sono d\'accordo con <span data-chi="paola">Paola.</span> Però la consegna del <span data-len="17">14/3</span> mi sembra stretta: possiamo sentirci venerdì <span class="unita">alle <span data-len="18">15:30?</span></span>'
R(f'<p class="bolla-testo">{F3_VECCHIA}</p>', f'<p class="bolla-testo" data-t="frase.3">{F3}</p>', 2)
R(f'<p class="bolla-testo">{F2_VECCHIA}</p>', f'<p class="bolla-testo" data-t="frase.2">{F2}</p>', 1)
R(f'<p class="bolla-testo">{F1}</p>', f'<p class="bolla-testo" data-t="frase.1">{F1}</p>', 2)
R('<li class="messaggio entra" data-frase="1">', '<li class="messaggio entra" data-frase="1" data-annuisce="paola">')
R('<li class="messaggio entra" data-frase="2">', '<li class="messaggio entra" data-frase="2" data-annuisce="luca">')
R('<li class="messaggio entra" data-frase="3">', '<li class="messaggio entra" data-frase="3" data-annuisce="anna">')

# ---------- i riquadri della riunione ----------
R('<span class="nome">Tu<span class="nome-lungo"> · microfono «Kalliope»</span></span>', '<span class="nome" data-t="riunione.tu-lungo">Tu<span class="nome-lungo"> · microfono «Kalliope»</span></span>')
R('<span class="nome nome-tu">Tu</span>', '<span class="nome nome-tu" data-t="riunione.tu" data-lungo="· microfono «Kalliope»" data-t-data-lungo="riunione.tu-microfono">Tu</span>')
R('<div class="riquadro tu"><span class="bordo"></span><span class="barre"><i></i><i></i><i></i><i></i><i></i></span><span class="nome">Tu</span></div>',
  '<div class="riquadro tu"><span class="bordo"></span><span class="barre"><i></i><i></i><i></i><i></i><i></i></span><span class="nome" data-t="riunione.tu" data-lungo="· microfono «Kalliope»" data-t-data-lungo="riunione.tu-microfono">Tu</span></div>')
R('<span class="nome">Tu</span>', '<span class="nome" data-t="riunione.tu">Tu</span>')
for chiave, nome in (('persona.paola', 'Paola'), ('persona.luca', 'Luca'), ('persona.anna', 'Anna')):
    R(f'<span class="nome">{nome}</span>', f'<span class="nome" data-t="{chiave}">{nome}</span>', 4)

# ---------- la finestra di Kalliope ----------
R('<div class="finestra" aria-label="Ricostruzione della finestra di Kalliope 0.1">', '<div class="finestra" aria-label="Ricostruzione della finestra di Kalliope 0.1" data-t-aria-label="finestra.etichetta">')
PRONTA = 'Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.'
R(f'<div class="f-stato" role="status">{PRONTA}</div>', f'<div class="f-stato" role="status" data-t="finestra.pronta">{PRONTA}</div>')
R('<span class="f-segnaposto">Scrivi qui e premi Invio per parlare</span>', '<span class="f-segnaposto" data-t="finestra.segnaposto">Scrivi qui e premi Invio per parlare</span>', 2)
R('<span class="f-pulsante f-parla" aria-hidden="true">Parla</span>', '<span class="f-pulsante f-parla" aria-hidden="true" data-t="finestra.parla">Parla</span>', 2)
R('<button class="f-pulsante f-ferma" type="button" disabled>Ferma</button>', '<button class="f-pulsante f-ferma" type="button" disabled data-t="finestra.ferma">Ferma</button>')
R('<span class="f-pulsante f-ferma">Ferma</span>', '<span class="f-pulsante f-ferma" data-t="finestra.ferma">Ferma</span>')

# ---------- l'ascolto ----------
R('<a class="pillola voce-chiara" href="#campioni" id="ascolta-link"><span class="tondo" aria-hidden="true"></span>Ascolta Giulia</a>',
  '<a class="pillola voce-chiara" href="#campioni" id="ascolta-link" data-t="ascolto.pillola"><span class="tondo" aria-hidden="true"></span>Ascolta Giulia</a>')
R('<button class="pillola voce-chiara" type="button" id="ascolta" hidden aria-expanded="false" aria-controls="ascolto"><span class="tondo" aria-hidden="true"></span>Ascolta Giulia</button>',
  '<button class="pillola voce-chiara" type="button" id="ascolta" hidden aria-expanded="false" aria-controls="ascolto" data-t="ascolto.pillola"><span class="tondo" aria-hidden="true"></span>Ascolta Giulia</button>')
R('role="group" aria-label="Ascolto della voce vera">', 'role="group" aria-label="Ascolto della voce vera" data-t-aria-label="ascolto.etichetta">')
R('<div class="voci" role="group" aria-label="Voce">', '<div class="voci" role="group" aria-label="Voce" data-t-aria-label="ascolto.voce">')
R('aria-pressed="true"><span class="voce-tondo" aria-hidden="true"></span>Giulia</button>', 'aria-pressed="true" data-t="voce.giulia"><span class="voce-tondo" aria-hidden="true"></span>Giulia</button>', 2)
R('aria-pressed="false"><span class="voce-tondo" aria-hidden="true"></span>Marco</button>', 'aria-pressed="false" data-t="voce.marco"><span class="voce-tondo" aria-hidden="true"></span>Marco</button>', 2)
R('<button class="chiudi" type="button" id="chiudi">Chiudi</button>', '<button class="chiudi" type="button" id="chiudi" data-t="ascolto.chiudi">Chiudi</button>')
R('<div class="frasi" role="group" aria-label="Frasi da ascoltare">', '<div class="frasi" role="group" aria-label="Frasi da ascoltare" data-t-aria-label="ascolto.frasi">')
import re
for n, breve in (('3', '«Il preventivo…»'), ('2', '«Sono d\'accordo…»'), ('1', '«Buongiorno…»')):
    s, k = re.subn(rf'<button class="frase" type="button" data-frase="{n}" aria-label="[^"]*">{re.escape(breve)}</button>',
                   f'<button class="frase" type="button" data-frase="{n}" data-t="ascolto.frase.{n}">{breve}</button>', s)
    assert k == 1, n

# ---------- «Senti come suona» ----------
R('<h2 id="campioni-titolo" class="entra entra-titolo">', '<h2 id="campioni-titolo" class="entra entra-titolo" data-t="campioni.titolo">')
R('<p class="entra">Le frasi sono tue,', '<p class="entra" data-t="campioni.testo">Le frasi sono tue,')
R('<div class="voci voci-filo entra" role="group" aria-label="Voce delle frasi" hidden>', '<div class="voci voci-filo entra" role="group" aria-label="Voce delle frasi" data-t-aria-label="campioni.voce" hidden>')
s, k = re.subn(r'(<button class="pillola voce-chiara suona-frase" type="button" data-frase="\d" hidden) aria-label="[^"]*">(<span class="tondo" aria-hidden="true"></span>)<span class="etichetta-suona">Ascolta</span></button>',
               r'\1>\2<span class="etichetta-suona" data-t="ascolto.verbo.fermo">Ascolta</span></button>', s)
assert k == 3, k
for n in '123':
    R(f'<a href="voce/giulia-{n}.mp3">Scarica l\'audio (Giulia)</a></audio>', f'<a href="voce/giulia-{n}.mp3" data-t="campioni.scarica-audio">Scarica l\'audio (Giulia)</a></audio>')
    R(f'<a class="altra-voce" href="voce/marco-{n}.mp3">La stessa frase con Marco</a>', f'<a class="altra-voce" href="voce/marco-{n}.mp3" data-t="campioni.altra-voce">La stessa frase con Marco</a>')
R('<p class="detto-riga"><span>Detto:</span>', '<p class="detto-riga" data-t="frase.3.detto-riga"><span>Detto:</span>')

# ---------- la strada ----------
R('<h2 id="oggi-titolo" class="entra entra-titolo">', '<h2 id="oggi-titolo" class="entra entra-titolo" data-t="oggi.titolo">')
R('<p class="entra">Detto chiaro, prima di scaricare', '<p class="entra" data-t="oggi.testo">Detto chiaro, prima di scaricare')
R('<span class="computer-nome">Sul tuo computer</span>', '<span class="computer-nome" data-t="strada.computer">Sul tuo computer</span>')
for n, testo in (('1', 'Scrivi la frase'), ('2', 'La voce nasce qui'), ('3', 'Microfono «Kalliope»'), ('4', 'Zoom, Teams, Meet'), ('5', 'Gli altri ti sentono')):
    R(f'<span class="tappa-nome">{testo}</span>', f'<span class="tappa-nome" data-t="strada.tappa.{n}">{testo}</span>')
R('<h3>Provato</h3><p>', '<h3 data-t="strada.provato.titolo">Provato</h3><p data-t="strada.provato.testo">')
R('<h3>Non ancora provato</h3><p>', '<h3 data-t="strada.nonprovato.titolo">Non ancora provato</h3><p data-t="strada.nonprovato.testo">')
R('<p class="riservato">', '<p class="riservato" data-t="strada.riservato">')
R('<p><strong>Non esiste ancora</strong> per Windows', '<p data-t="strada.non-esiste"><strong>Non esiste ancora</strong> per Windows')

# ---------- che cosa serve ----------
R('role="group" tabindex="-1" aria-label="Ricostruzione del primo avvio di Kalliope 0.1">', 'role="group" tabindex="-1" aria-label="Ricostruzione del primo avvio di Kalliope 0.1" data-t-aria-label="avvio.etichetta">')
R('<div class="f-stato">Per parlare, Kalliope deve scaricare la voce', '<div class="f-stato" data-t="avvio.primo">Per parlare, Kalliope deve scaricare la voce')
R('<span class="f-pulsante f-primario">Scarica la voce</span>', '<span class="f-pulsante f-primario" data-t="avvio.scarica">Scarica la voce</span>')
R('<p class="f-nota">', '<p class="f-nota" data-t="avvio.nota">')
R('<div class="riunione-app entra entra-finestra" role="img" aria-label="Ricostruzione: nell\'app della riunione si sceglie «Kalliope» come microfono">',
  '<div class="riunione-app entra entra-finestra" role="img" aria-label="Ricostruzione: nell\'app della riunione si sceglie «Kalliope» come microfono" data-t-aria-label="app.etichetta">')
R('<span class="microfono-titolo"><span class="app-icona"></span>Microfono</span>', '<span class="microfono-titolo" data-t="app.microfono"><span class="app-icona"></span>Microfono</span>')
R('<li class="scelta scelto">Microfono del computer</li>', '<li class="scelta scelto" data-t="app.scelta.computer">Microfono del computer</li>')
R('<li class="scelta">Kalliope</li>', '<li class="scelta" data-t="app.scelta.kalliope">Kalliope</li>')
R('<p class="nota-ricostruzione">', '<p class="nota-ricostruzione" data-t="avvio.ricostruzione">')
R('<button class="rivedi" type="button" hidden>Rivedi il primo avvio</button>', '<button class="rivedi" type="button" hidden data-t="avvio.rivedi">Rivedi il primo avvio</button>')
R('<h2 id="serve-titolo" class="entra entra-titolo">', '<h2 id="serve-titolo" class="entra entra-titolo" data-t="serve.titolo">')
R('<li><strong>Un computer Linux a 64 bit</strong> con PipeWire.</li>', '<li data-t="serve.1"><strong>Un computer Linux a 64 bit</strong> con PipeWire.</li>')
R('<li><strong>53 MB per la voce</strong>', '<li data-t="serve.2"><strong>53 MB per la voce</strong>')
R('<li><strong>Un\'app di riunione</strong>', '<li data-t="serve.3"><strong>Un\'app di riunione</strong>')

# ---------- chiusura e piede ----------
R('<h2 id="chiusura-titolo" class="entra entra-titolo">', '<h2 id="chiusura-titolo" class="entra entra-titolo" data-t="chiusura.titolo">')
R('<p class="fatti entra">', '<p class="fatti entra" data-t="chiusura.fatti">')
R('<p class="avvertenza entra">', '<p class="avvertenza entra" data-t="chiusura.avvertenza">')
R('<nav aria-label="Sezioni del sito, in fondo" id="piede-sezioni">', '<nav aria-label="Sezioni del sito, in fondo" id="piede-sezioni" data-t-aria-label="piede.sezioni">')
R('        <li><a href="aiuto/" data-t="menu.aiuto">Aiuto</a></li>\n      </ul>\n    </nav>\n    <p>Versione',
  '        <li><a href="aiuto/" data-t="menu.aiuto">Aiuto</a></li>\n      </ul>\n    </nav>\n    <nav class="lingue" id="lingue" aria-label="Lingue" data-t-aria-label="piede.lingue">\n      <ul data-lingue="elenco">\n        <li><a data-lingua href="#">Italiano</a></li>\n      </ul>\n    </nav>\n    <p>Versione')
R('    <p>Versione {{kalliope.version}} del {{kalliope.date}}.', '    <p data-t="piede.testo">Versione {{kalliope.version}} del {{kalliope.date}}.')

# ---------- i testi che usa soltanto lo script ----------
TESTI = '''
<template id="testi-scena">
  <p data-t="finestra.parlando" data-t-nota="Dice che la voce sta parlando; compare nella finestra di Kalliope mentre suona una frase.">Sto parlando…</p>
  <p data-t="annuncio.pausa" data-t-nota="Lo leggono i lettori di schermo quando l'ascolto va in pausa.">In pausa.</p>
  <p data-t="errore.caricamento">Non riesco a caricare la registrazione. Controlla la connessione e riprova, oppure scaricala.</p>
  <p data-t="errore.interrotta">La registrazione si è interrotta. Riprova, oppure scaricala.</p>
  <p data-t="errore.permesso">Il browser non ha fatto partire il suono. Premi «Riprova»: il suono parte solo con un tuo gesto.</p>
  <p data-t="errore.lento">Il caricamento è lento. Puoi aspettare, riprovare o scaricare la registrazione.</p>
  <p data-t="errore.riprova">Riprova</p>
  <p data-t="errore.scarica" data-t-nota="{voce} è il nome della voce (Giulia o Marco), scritto come nei pulsanti delle voci.">Scarica la registrazione ({voce}, mp3)</p>
  <p data-t="annuncio.voce-frase" data-t-nota="Lo leggono i lettori di schermo quando si sceglie una voce mentre una frase suona. {n} è il numero della frase (1, 2 o 3).">Voce scelta: {voce}. Sto leggendo la frase {n}.</p>
  <p data-t="annuncio.frase" data-t-nota="Lo leggono i lettori di schermo quando parte una frase. {n} è il numero della frase (1, 2 o 3).">Sto leggendo la frase {n}, voce di {voce}.</p>
  <p data-t="annuncio.voce">Voce scelta: {voce}.</p>
  <p data-t="ascolto.verbo.carica" data-t-nota="Il testo breve del pulsante di una frase mentre carica.">Carico…</p>
  <p data-t="ascolto.verbo.suona" data-t-nota="Il testo breve del pulsante di una frase mentre suona: premerlo mette in pausa.">Pausa</p>
  <p data-t="ascolto.verbo.pausa" data-t-nota="Il testo breve del pulsante di una frase in pausa: premerlo riprende.">Riprendi</p>
  <p data-t="ascolto.verbo.fatto" data-t-nota="Il testo breve del pulsante di una frase già ascoltata.">Riascolta</p>
  <p data-t="ascolto.azione.fermo" data-t-nota="Ciò che dice ai lettori di schermo il pulsante di una frase, prima dei due punti e della frase.">Ascolta</p>
  <p data-t="ascolto.azione.carica">Carico la registrazione, premi per annullare</p>
  <p data-t="ascolto.azione.suona">Metti in pausa</p>
  <p data-t="ascolto.azione.pausa">Riprendi</p>
  <p data-t="ascolto.azione.fatto">Riascolta</p>
  <p data-t="ascolto.azione.formato" data-t-nota="Unisce l'azione e la frase: «Ascolta: Il preventivo…». {azione} è una delle azioni qui sopra, {frase} il testo della frase.">{azione}: {frase}</p>
  <p data-t="avvio.scarico" data-t-nota="Il racconto del primo avvio: {mb} sale da 0 a 53, in megabyte.">Scarico la voce… {mb} di 53 MB</p>
  <p data-t="avvio.preparo">Preparo la voce…</p>
  <p data-t="avvio.annulla">Annulla</p>
  <p data-t="frase.3.detto.1" data-t-nota="Come si dice «1.250 € +» a voce, parola per parola: tre parole per tre segni.">milleduecentocinquanta euro più</p>
  <p data-t="frase.3.detto.2" data-t-nota="Come si dice «31» a voce.">trentuno</p>
</template>
'''
R('\n<script src="voce/tempi-riserva.js"></script>', TESTI + '\n<script src="voce/tempi-riserva.js"></script>')

p.write_text(s, encoding='utf-8')
print('home segnata')
