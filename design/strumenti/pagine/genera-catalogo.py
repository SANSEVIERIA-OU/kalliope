#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Genera il catalogo vivo del sito: site/sistema/index.html (token generati da site/stile/token.css, componenti vivi con i fogli di stile del sito)
e site/sistema/ricerca/index.html (riferimenti, matrice di copertura, decisioni: da design/confronto.json, copertura e direzione.json).
Uso: python3 -I design/strumenti/pagine/genera-catalogo.py
Nessun valore è scritto a mano nelle tabelle dei token, della matrice e delle decisioni: si rigenerano dalle fonti."""
import json, os, re, sys, html, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))  # copertura.py sta nella cartella sopra (messa in testa)
from layout import pagina, REPO, BASE_URL
from comp import ascolto, stato_card, foto, comando, controllo, se_non_va, dettagli

SITE = '/workspace/kalliope/site/'
DESIGN = '/workspace/kalliope/design/'
GH = REPO + '/blob/main/design/'
e = html.escape

confronto = json.load(open(DESIGN + 'confronto.json', encoding='utf-8'))
direzione = json.load(open(DESIGN + 'direzione.json', encoding='utf-8'))
import copertura as cop
ids, matr = cop.calcola(confronto)

# ------------------------------------------------------------------ token
def parse_token():
    css = open(SITE + 'stile/token.css', encoding='utf-8').read()
    scuro = re.search(r'@media \(prefers-color-scheme: dark\) \{(.*?)\n\}', css, re.S).group(1)
    base = css.split('@media')[0]
    rx = re.compile(r'^\s*(--[\w-]+):\s*([^;]+);\s*(?:/\*\s*(.*?)\s*\*/)?', re.M)
    chiari = {m.group(1): (m.group(2).strip(), m.group(3) or '') for m in rx.finditer(base)}
    scuri = {m.group(1): (m.group(2).strip(), m.group(3) or '') for m in rx.finditer(scuro)}
    return chiari, scuri

CHIARI, SCURI = parse_token()
GRUPPI = [
    ('t-colori', 'Colori e temi', lambda n: n in ('--carta', '--carta-2', '--bianco', '--inchiostro', '--inchiostro-2', '--linea', '--voce', '--voce-scura', '--voce-molto-scura', '--su-voce', '--voce-chiara', '--ambra', '--ambra-chiara', '--rosso', '--evidenza', '--focus', '--focus-alone')),
    ('t-tipografia', 'Tipografia', lambda n: n.startswith(('--font', '--t-', '--interlinea', '--misura', '--peso'))),
    ('t-spazi', 'Spazi e bersagli', lambda n: n.startswith(('--s-', '--pagina', '--bersaglio', '--distanza', '--larghezza', '--alto', '--badge', '--icona', '--px', '--campione', '--posizione'))),
    ('t-forme', 'Forme e motivo', lambda n: n.startswith(('--raggio', '--bordo', '--barra', '--focus-distanza'))),
    ('t-movimento', 'Movimento', lambda n: n.startswith(('--durata', '--curva'))),
]

def tabella_token():
    out = []
    for idg, titolo, filtro in GRUPPI:
        nomi = [n for n in CHIARI if filtro(n)]
        righe = []
        for n in nomi:
            v, c = CHIARI[n]
            s = SCURI.get(n)
            campione = ''
            if idg == 't-colori':
                campione = f'<span class="campione-token" style="background:var({n})" role="img" aria-label="campione di {n}"></span>'
            elif n.startswith('--raggio'):
                campione = f'<span class="campione-token" style="background:var(--voce-chiara);border-radius:var({n})" role="img" aria-label="campione di {n}"></span>'
            righe.append(f'<tr><th scope="row" data-etichetta="Nome"><code>{n}</code></th><td data-etichetta="Valore"><code>{e(v)}</code></td>'
                         f'<td data-etichetta="Valore nel tema scuro">{("<code>" + e(s[0]) + "</code>") if s else "uguale"}</td>'
                         f'<td data-etichetta="Ruolo">{e(c)}</td><td data-etichetta="Campione">{campione}</td></tr>')
        out.append(f'<h3 id="{idg}">{titolo}</h3>\n<table class="tabella-token" aria-label="{titolo}: nome, valore, valore nel tema scuro, ruolo">'
                   '<thead><tr><th scope="col">Nome</th><th scope="col">Valore</th><th scope="col">Scuro</th><th scope="col">Ruolo</th><th scope="col">Campione</th></tr></thead><tbody>\n'
                   + '\n'.join(righe) + '\n</tbody></table>')
    return '\n'.join(out)

# ------------------------------------------------------------------ schede
def dec(*ids_):
    return ', '.join(f'<a href="ricerca/#{i}">{i}</a>' for i in ids_)

VARIANTI = {
    'c-bottone': 'Primario, secondario, piccolo, collegamento forte; stati: riposo, sotto il puntatore, focus, premuto, disattivato.',
    'c-nav': 'Con la voce corrente; elenco «Da dove vuoi cominciare?» (<code>.porte</code>) nella pagina iniziale; a 390 px va a capo su due righe.',
    'c-percorso': 'Tappa corrente piena, altre con contorno; «Indietro» assente nella prima tappa, «Avanti» assente nell\'ultima.',
    'c-indice-pagina': 'Un elenco di chip che va a capo; una sola riga di testo per chip.',
    'c-apertura': 'A due colonne al computer; a una colonna sotto 56 rem, con la foto dopo i comandi.',
    'c-stato': 'Compatto (home) e completo (pagina Stato e limiti); colonne affiancate sopra 48 rem, impilate sotto; «di prova» e la versione compaiono solo per una prerelease.',
    'c-ascolto': 'Con una voce o con due; con frase senza cifre (nota «Kalliope dice esattamente ciò che scrivi»); frase di una o due frasi; con e senza JavaScript.',
    'c-passi': 'Con o senza «Copia»; «Come sai» e «Se non è andata» sempre presenti; frasi legate a una versione.',
    'c-scelta-sistema': 'Quattro sezioni: .deb, .rpm, PKGBUILD, archivio; ciascuna con file, scarica, guadagno e costo.',
    'c-filtro': 'Senza risultati, con uno, con più frasi; senza JavaScript il filtro non compare.',
    'c-disclosure': 'Chiuso, aperto, aperto all\'arrivo (attributo <code>open</code>).',
    'c-tabella': 'Tabella a colonne (computer) e a schede (sotto 40 rem); misura con cifra e fonte.',
    'c-avviso': 'Informativo e di attenzione.',
    'c-foto': 'Foto con didascalia; la stessa foto ricompare nella pagina In riunione.',
    'c-condividi': 'Con e senza il pulsante (JavaScript).',
    'c-piede': 'Tre colonne sopra 48 rem, una sotto; la riga di versione è nascosta per una versione stabile (<code>.solo-prova</code>).',
}


def scheda(idc, nome, ident, regola, persona, prov, prova, movimento, verifica):
    varianti = VARIANTI.get(idc, '—')
    return f'''<section class="catalogo-scheda" id="{idc}" aria-labelledby="{idc}-t">
<h3 id="{idc}-t">{nome}</h3>
<dl class="catalogo-dati">
<dt>Identificatore</dt><dd>{ident}</dd>
<dt>Regola e confini</dt><dd>{regola}</dd>
<dt>Persona e compito</dt><dd>{persona}</dd>
<dt>Provenienza</dt><dd>{prov}</dd>
<dt>Varianti</dt><dd>{varianti}</dd>
<dt>Movimento</dt><dd>{movimento}</dd>
<dt>Verifica e lacune</dt><dd>{verifica}</dd>
</dl>
<div class="catalogo-prova">
<p class="catalogo-prova__titolo">Prova viva</p>
{prova}
</div>
</section>'''

BARRE = '<span class="barre" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>'

def catalogo():
    P = '../'
    ID = direzione['ambizione']
    corpo = f'''<div class="pagina testo">
<h1>Come è fatto questo sito</h1>
<p>Questo è il catalogo del sistema di Kalliope. Usa gli stessi fogli di stile delle pagine del sito, quindi ciò che vedi qui è ciò che è nel sito. È il <strong>primo percorso completo</strong>: mostra i token e i componenti usati, con stati e varianti, più la ricerca, il confronto e le decisioni. Non è ancora il catalogo completo.</p>
<div class="avviso avviso--attenzione" role="note">
<p class="avviso__titolo">Direzione non ancora approvata</p>
<p>Il percorso è stato costruito per essere mostrato al proprietario. I token non sono congelati e la prova su tutti i dispositivi e tutti i motori parte dopo l'approvazione.</p>
</div>
<nav class="catalogo-indice" aria-label="Indice del catalogo">
<ul>
<li><a href="#identita">Identità e stato</a></li><li><a href="#persone">Persone e percorsi</a></li><li><a href="#anteprime">Anteprime</a></li>
<li><a href="#token">Token</a></li><li><a href="#componenti">Componenti</a></li><li><a href="#movimento">Movimento</a></li>
<li><a href="#accessibilita">Accessibilità</a></li><li><a href="#prestazioni">Prestazioni e canali</a></li>
<li><a href="#provenienza">Ricerca e decisioni</a></li><li><a href="#prove">Prove</a></li>
</ul>
</nav>

<h2 id="identita">Identità e stato</h2>
<p><strong>Scopo.</strong> Spiegare Kalliope a chi non lo conosce, far sentire la voce, dire con onestà cosa è provato, portare chi può installarlo fino a una voce che esce in una riunione, dare i fatti a chi controlla. Solo italiano (<code>lang="it"</code>).</p>
<p><strong>Direzione scelta: «Carta e voce».</strong> Carta calda e inchiostro verde scurissimo, il verde acqua dell'icona per comandi e barre, riquadri a bolla, cinque barre a capsula come unico motivo; ciò che si digita in carattere a spaziatura fissa, ciò che la voce dice nel carattere del corpo; un solo movimento espressivo, quello delle barre che seguono la voce. Tre direzioni sono state confrontate sugli stessi contenuti (una pagina narrata, un cammino a pagine per compito, porte per persona): {dec('T08')}. Il confronto è in <a href="{GH}direzione.md">design/direzione.md</a>.</p>
<h3>Criterio di ambizione</h3>
<ul>
{''.join(f"<li><strong>{a['id']}.</strong> {e(a['cosa'])}</li>" for a in ID)}
</ul>
<h3>Vincoli</h3>
<ul>
<li>HTML e CSS statici, nessun passo di build per pubblicare; JavaScript solo in aggiunta.</li>
<li>Nessuna richiesta a terzi, nessun cookie, nessuna statistica, nessun carattere remoto.</li>
<li>Dati della release solo con i segnaposto di <code>tools/site.py</code> (versione, nomi, dimensioni, impronte, collegamenti).</li>
<li>Nessun materiale di persone reali; nessuna foto dei siti di riferimento nel sito pubblico (solo testo e collegamenti).</li>
<li>Codebase, identità e meccanismi separati dalla sorella Kalipso.</li>
</ul>
<h3>Stato di adozione e superfici</h3>
<p>Il sito è la prima superficie progettata di Kalliope. La finestra dell'app usa elementi standard del suo toolkit: non adotta questo sistema e non è deciso che lo farà. Restano uguali i nomi (Kalliope, «Scarica la voce», «Parla», «Ferma», «Senti anche tu», «Già detto», Giulia, Marco) e le frasi di stato citate.</p>
<h3 id="provvisorie">Decisioni provvisorie, in attesa di conferma del proprietario</h3>
<ul>
<li><strong>A.</strong> Nessun indirizzo e-mail per ora: le segnalazioni passano dalle issue di GitHub.</li>
<li><strong>B.</strong> Solo italiano, con una struttura che permette altre lingue (i testi sono nell'HTML, mai nel CSS; gli script leggono i loro testi da attributi <code>data-*</code>).</li>
<li><strong>E.</strong> A chi ha Windows o macOS il sito dice «non ancora» e perché, e come seguire le novità; nessun prodotto di terzi consigliato.</li>
<li><strong>F.</strong> Una frase: Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.</li>
<li><strong>G.</strong> I sei campioni sono l'uscita di Kalliope 0.1-rc.1 senza ritocchi, in MP3; Whisper li trascrive con circa una parola sbagliata su 45.</li>
</ul>

<h2 id="persone">Persone e percorsi</h2>
<table class="tabella">
<caption>Chi usa il sito e dove lo incontra</caption>
<thead><tr><th scope="col">Chi</th><th scope="col">Cosa vuole</th><th scope="col">Dove nel sito</th></tr></thead>
<tbody>
<tr><th scope="row">F1 chi scrive per parlare</th><td data-etichetta="Cosa vuole">Intervenire in riunione senza dipendere da altri, con una voce accettabile.</td><td data-etichetta="Dove nel sito"><a href="{P}ascolta/">Ascolta</a>, <a href="{P}installa/">Installa</a>, <a href="{P}riunione/">In riunione</a>, <a href="{P}aiuto/">Aiuto</a></td></tr>
<tr><th scope="row">F2 familiare, logopedista</th><td data-etichetta="Cosa vuole">Capire se è adatto, fidarsi, inoltrare il collegamento.</td><td data-etichetta="Dove nel sito"><a href="{P}">Pagina iniziale</a>, <a href="{P}stato/#detta-a-chi">la stessa cosa detta a ciascuno</a></td></tr>
<tr><th scope="row">F3 chi controlla</th><td data-etichetta="Cosa vuole">Sapere cosa esce dal computer, cosa si installa, con quale licenza.</td><td data-etichetta="Dove nel sito"><a href="{P}stato/#controllare">Se devi controllare</a></td></tr>
<tr><th scope="row">F4 chi installa</th><td data-etichetta="Cosa vuole">Comandi esatti, requisiti, impronte.</td><td data-etichetta="Dove nel sito"><a href="{P}installa/">Installa</a></td></tr>
<tr><th scope="row">F5 chi guarda da fuori</th><td data-etichetta="Cosa vuole">Cos'è, a che punto è, cosa si può citare.</td><td data-etichetta="Dove nel sito"><a href="{P}stato/">Stato e limiti</a></td></tr>
<tr><th scope="row">F6 chi amministra</th><td data-etichetta="Cosa vuole">Un sito allineato alla release.</td><td data-etichetta="Dove nel sito">Segnaposto di <code>tools/site.py</code>; <a href="#c-passi">frasi che dipendono dalla versione</a></td></tr>
</tbody>
</table>
<p>Percorsi di <code>progetto.md</code> realizzati in questo primo percorso: P1 capire (pagina iniziale), P2 ascoltare, P3-P7 stato e limiti, P4 installare, P5 usare in riunione e aiuto, P6 chi non può ancora, P9 segnalare. P8 (contribuire) e il resto dei fatti per chi controlla arrivano dopo l'approvazione.</p>

<h2 id="anteprime">Anteprime: le schermate del percorso</h2>
<p>Le pagine reali, con contenuti veri, sono le anteprime. Le foto dei controlli sono in <code>design/prove-percorso/</code>.</p>
<ul>
<li><a href="{P}">Arrivo</a> (P1)</li><li><a href="{P}ascolta/">Ascolto della voce</a> (P2)</li><li><a href="{P}stato/">Stato e limiti</a> (P3, P7)</li>
<li><a href="{P}installa/">Installazione</a> (P4)</li><li><a href="{P}riunione/">Scegli «Kalliope» come microfono</a> (P5)</li><li><a href="{P}aiuto/">Aiuto</a> (P5, P9)</li>
<li><a href="{P}non-ancora/">Chi non può ancora</a> (P6)</li><li><a href="{P}questa-pagina-non-esiste/">Pagina 404</a></li>
</ul>

<h2 id="token">Token</h2>
<p>Le tabelle sono generate da <code>site/stile/token.css</code>, la fonte unica dei valori (<code>design/strumenti/pagine/genera-catalogo.py</code>). I campioni sono vivi: usano le variabili. Il tema scuro segue il sistema.</p>
{tabella_token()}
<h3 id="t-parole">Parole</h3>
<p>Frasi di 15-20 parole al massimo nei testi che chiedono un'azione; seconda persona nelle istruzioni; termine nuovo spiegato al primo uso con una frase sola. Le persone sono «persone»; mai «malato» o «paziente» per chi usa Kalliope ({dec('D31')}).</p>
<table class="tabella">
<caption>Parole usate nel sito</caption>
<thead><tr><th scope="col">Parola</th><th scope="col">Cosa vuol dire qui</th></tr></thead>
<tbody>
<tr><th scope="row">microfono virtuale</th><td data-etichetta="Cosa vuol dire qui">Un microfono che esiste solo dentro il computer. Si chiama «Kalliope» e le app di riunione lo elencano accanto ai microfoni veri.</td></tr>
<tr><th scope="row">PipeWire</th><td data-etichetta="Cosa vuol dire qui">Il sistema audio dei computer Linux recenti. Kalliope ne ha bisogno per creare il microfono.</td></tr>
<tr><th scope="row">versione di prova</th><td data-etichetta="Cosa vuol dire qui">Una versione che si può usare ma non è ancora provata ovunque. Lo stato dice cosa è provato.</td></tr>
<tr><th scope="row">impronta</th><td data-etichetta="Cosa vuol dire qui">Un numero (SHA-256) che dice se un file è proprio quello pubblicato.</td></tr>
<tr><th scope="row">tu scrivi / Kalliope dice</th><td data-etichetta="Cosa vuol dire qui">Il testo come lo digiti, e il testo come la voce lo pronuncia dopo che Kalliope ha scritto in parole cifre, date e orari.</td></tr>
</tbody>
</table>

<h2 id="componenti">Componenti</h2>
<p>Ogni scheda dice cosa è, quando si usa, per chi, da dove viene (con la decisione che lo motiva), come si presenta negli stati e nelle varianti, come si muove e come è stato verificato.</p>

{scheda('c-bottone', 'Bottone e collegamento forte', '<code>.btn</code>, <code>.btn--primario</code>, <code>.btn--piccolo</code>, <code>.collegamento-forte</code>',
 'Un comando che fa qualcosa o porta altrove. Un solo bottone primario per schermata. Bersaglio di almeno 44×44 px, etichetta con il verbo. Non si usa per navigare dentro la pagina corrente quando basta un collegamento nel testo.',
 'F1, F4: premere con puntamento impreciso, interruttore o tastiera (P1-P6).', dec('D03', 'D14', 'E14', 'T01', 'T04'),
 '''<div class="catalogo-righe">
<figure><a class="btn btn--primario" href="#c-bottone">Ascolta la voce</a><figcaption>primario, riposo</figcaption></figure>
<figure><a class="btn btn--primario sim-hover" href="#c-bottone">Ascolta la voce</a><figcaption>primario, sotto il puntatore (simulato)</figcaption></figure>
<figure><a class="btn btn--primario sim-focus" href="#c-bottone">Ascolta la voce</a><figcaption>primario, focus (simulato)</figcaption></figure>
<figure><a class="btn btn--primario sim-premuto" href="#c-bottone">Ascolta la voce</a><figcaption>primario, premuto (simulato)</figcaption></figure>
<figure><button class="btn btn--primario" type="button" disabled>Ascolta la voce</button><figcaption>primario, disattivato</figcaption></figure>
</div>
<div class="catalogo-righe">
<figure><a class="btn" href="#c-bottone">Scarica e installa</a><figcaption>secondario, riposo</figcaption></figure>
<figure><a class="btn sim-hover" href="#c-bottone">Scarica e installa</a><figcaption>secondario, sotto il puntatore</figcaption></figure>
<figure><a class="btn btn--piccolo" href="#c-bottone">Copia il comando</a><figcaption>piccolo</figcaption></figure>
<figure><a class="collegamento-forte" href="#c-bottone">Non uso Linux: cosa posso fare</a><figcaption>collegamento forte</figcaption></figure>
</div>
<p>Prova tu: premi Tab e guarda l'anello di focus; passa con il puntatore; premi. Gli stati marcati «simulato» usano le classi <code>.sim-*</code> solo per mostrarli fermi.</p>''',
 'Cambio di colore e bordo in 100 ms (<code>--durata-1</code>); istantaneo con movimento ridotto; il cambio non è mai l\'unica informazione (il focus ha l\'anello, il disattivato ha il bordo tratteggiato).',
 'Prova tastiera e foto degli stati in Chromium; contrasto del testo del bottone primario 9,0:1. Lacuna: Firefox e WebKit dopo l\'approvazione.')}

{scheda('c-nav', 'Navigazione principale', '<code>.nav</code> dentro <code>header.sito-intestazione</code>',
 'Cinque voci per compito sempre in vista, in un elenco di collegamenti; la voce corrente ha <code>aria-current="page"</code>, sottolineatura spessa e peso forte. Nessun menu a comparsa, nessuna barra fissa.',
 'F1-F5: sapere dove andare con poche scelte (P1-P6).', dec('D02', 'D04', 'D05', 'D43', 'E05'),
 '''<div class="catalogo-righe"><nav class="nav" aria-label="Esempio di navigazione"><ul>
<li><a href="#c-nav">Ascolta</a></li><li><a href="#c-nav" aria-current="page">Stato e limiti</a></li><li><a href="#c-nav">Installa</a></li><li><a href="#c-nav">In riunione</a></li><li><a href="#c-nav">Aiuto</a></li></ul></nav></div>
<p>Variante: la home aggiunge, sotto la proposta, quattro collegamenti con parole della persona (<code>.porte</code>):</p>
<ul class="porte"><li><a href="#c-nav">Scrivo per parlare: fa per me?</a></li><li><a href="#c-nav">Leggo per un'altra persona</a></li></ul>''',
 'Soltanto il bordo inferiore cambia colore al passaggio, in 100 ms; nessun movimento oltre a questo.',
 'Prova a testo 200% e a 390×844: va a capo senza scorrimento orizzontale. Prova senza JavaScript: identica.')}

{scheda('c-percorso', 'Percorso: «Passo N di 5» e «Avanti»', '<code>.percorso</code>, <code>.avanti</code>',
 'Una riga in cima alle pagine del cammino («Passo 2 di 5: Stato e limiti») e, in fondo, «Indietro» e «Avanti» come collegamenti grandi. Non ripete l\'elenco delle tappe: la barra principale ha già le stesse cinque voci (la revisione visiva ha misurato 318 px di doppia navigazione al telefono). È informazione fissa, senza transizioni.',
 'F1, F2: sapere dove sono e cosa viene dopo, anche arrivando da un collegamento inoltrato.', dec('D06', 'D07', 'E07'),
 '''<p class="percorso">Passo <b>2</b> di 5: <b>Stato e limiti</b></p>
<nav class="avanti" aria-label="Esempio indietro e avanti"><a href="#c-percorso"><small>Indietro</small>Ascolta la voce</a><a href="#c-percorso"><small>Avanti</small>Installa</a></nav>''',
 'Nessuno. L\'isola contestuale di R20 è attenuata a testo fisso (dichiarato in E07).',
 'Misura al telefono: la riga occupa meno di 40 px (primo-schermo.mjs). Prova tastiera e senza JavaScript. Lacuna: nessuna misura con persone che usano un interruttore.')}

{scheda('c-indice-pagina', 'Indice della pagina', '<code>.indice-pagina</code>',
 'Chip di collegamenti alle sezioni della stessa pagina, dentro un dettaglio chiuso («In questa pagina»), sotto l\'introduzione delle pagine lunghe: al telefono costa una riga, non tre. Non fisso.',
 'F1, F2, F4: raggiungere la sezione che serve senza scorrere (P3, P4, P7).', dec('D06', 'D10', 'T08'),
 '<nav class="indice-pagina" aria-label="Esempio di indice"><details class="dettagli"><summary>In questa pagina</summary><div class="dettagli__corpo"><ul><li><a href="#c-indice-pagina">Passo 1: scarica</a></li><li><a href="#c-indice-pagina">Passo 2: controlla il file</a></li><li><a href="#c-indice-pagina">Se ti sei fermato qui</a></li></ul></div></details></nav>',
 'Come i dettagli: dissolvenza di 120 ms all\'apertura, istantanea con movimento ridotto; lo scorrimento alla sezione è quello nativo.', 'Prova tastiera e senza JavaScript. In stampa è nascosto.')}

{scheda('c-apertura', 'Apertura (composizione della pagina iniziale)', '<code>.apertura</code>, <code>.apertura__griglia</code> (aree: titolo, ascolto, frase, avviso, stato, azioni)',
 'Titolo e riga di stato; il riquadro «Tu scrivi / Kalliope dice» con una voce e il comando d\'ascolto; la frase che dice cosa fa e per chi è; il cartellino; le azioni. Sul computer il riquadro sta a destra e il comando d\'ascolto è nel primo schermo; sul telefono l\'ordine è titolo, stato, riquadro, frase, cartellino, «Scarica e installa». Non si mette testo sopra immagini.',
 'F1, F2: capire in pochi secondi cosa fa, per chi è, cosa serve, e sentirlo (P1, P2).', dec('D01', 'D02', 'D03', 'D33', 'T08'),
 f'<p>La composizione è la <a href="{P}">pagina iniziale</a>. Le misure del primo schermo (comando d\'ascolto e riga di stato interi a 1440×900 e 390×844, anche con l\'avviso del sistema) sono nei controlli. Qui il suo cartellino di stato e il riquadro del primo schermo:</p>' + ascolto(3, P, voci=('giulia',), livello=4, hero=True),
 'Nessuno oltre a quello del riquadro (barre e frase evidenziata dopo il gesto).', 'Foto a 1440×900 e 390×844 in <code>design/prove-percorso/primo-schermo-*</code>. Limite: a 360×740 il comando d\'ascolto sta 10-60 px sotto la piega.')}

{scheda('c-stato', 'Cartellino di stato', '<code>.stato</code>, <code>.stato__col[data-tipo]</code>, <code>.stato__versione</code>',
 'Tre colonne: provato, non ancora provato, non esiste. Ogni colonna ha parola, simbolo e bordo diverso (pieno, tratteggiato, punteggiato): il colore non è l\'unica informazione. Sta prima di ogni promessa, nella stessa schermata, senza ritardo né chiusura. Il numero di versione e «di prova» vengono dai segnaposto e da <code>data-prerelease</code>.',
 'F1, F2, F3, F5: sapere cosa aspettarsi prima di decidere (P1, P3).', dec('D24', 'D25', 'D27', 'T01'),
 f'''{stato_card(True, P, 3)}
{stato_card(False, P, 3)}''',
 'Nessuno.',
 'Contrasto-qa in tema chiaro e scuro; prova con colori forzati. Lacuna: non è stato letto con persone con difficoltà di lettura.')}

{scheda('c-ascolto', 'Ascolto: scritto, detto, voce e barre', '<code>.ascolto</code>, <code>.scritto</code>, <code>.detto</code>, <code>.cambia</code>, <code>.frase</code>, <code>.voce</code>, <code>.barre</code>',
 'Una frase, una riga «Tu scrivi» (carattere a spaziatura fissa) e una «Kalliope dice» (carattere del corpo) con le cifre trasformate sottolineate; sotto, una riga per voce con pulsante (stessa larghezza in «Ascolta» e «Ferma»), barre e posizione («frase 1 di 2 · 0:00 / 0:09», durata arrotondata ai secondi come nel testo). Variante del primo schermo: una voce, titolo solo per i lettori di schermo. Un solo suono per volta, mai automatico, preload none, durata scritta. Senza JavaScript restano i controlli nativi dell\'audio e il collegamento al file.',
 'F1, F2, F3: capire come suona e se legge date, orari e importi (P2).', dec('D33', 'D34', 'D35', 'D37', 'E19', 'D44', 'T05'),
 ascolto(2, P, livello=4) + '''
<p>Stati fermi dell\'ascolto, per confronto (il terzo è la simulazione senza audio nel paragrafo «Movimento»):</p>
<div class="catalogo-righe">
<figure><span class="barre" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><figcaption>a riposo: la forma dell\'icona</figcaption></figure>
<figure><span class="barre" aria-hidden="true"><i style="--h:.2"></i><i style="--h:.85"></i><i style="--h:.5"></i><i style="--h:1"></i><i style="--h:.3"></i></span><figcaption>in riproduzione: le barre seguono la voce</figcaption></figure>
<figure><span class="scritto"><span class="frase in-corso">Sono d\'accordo con Paola.</span> <span class="frase">Però…</span></span><figcaption>frase in corso evidenziata (anche con movimento ridotto)</figcaption></figure>
</div>''',
 'Barre: sei campioni al secondo dell\'inviluppo misurato dell\'MP3 (60 ms), altezza da 14% a 100%, transizione di 100 ms lineare, solo mentre suona; frase evidenziata con cambio di sfondo in 100 ms. Interruzione: «Ferma» o un altro ascolto riportano le barre alla forma dell\'icona. Movimento ridotto: le barre restano ferme e piene, la frase in corso resta evidenziata e la posizione è scritta («frase 1 di 2 · 0:03 / 0:09»).',
 'Prova tastiera (Tab, Invio), senza JavaScript, movimento ridotto; riproduzione in Chromium. <strong>Lacune:</strong> Firefox e WebKit non provati (codec MP3 di sistema); nessuna prova con lettori di schermo veri.')}

{scheda('c-passi', 'Passi, comando e controllo', '<code>.passi</code>, <code>.passo</code>, <code>.comando</code>, <code>.controllo</code>, <code>.se-non-va</code>',
 'Ogni passo ha un numero, il comando in un blocco selezionabile con un clic, «Come sai che è andata bene» e «Se non è andata». Il pulsante «Copia» è un\'aggiunta con script. La ripresa è scritta a fine pagina perché il sito non salva nulla. Le frasi legate a una versione (<code>.solo-rc1</code>) si nascondono da sole quando la versione cambia.',
 'F2, F4, F1: installare e sapere se è riuscito (P4).', dec('D38', 'D39', 'D26', 'D10'),
 comando('sha256sum {{kalliope.deb.name}}') + controllo('Il numero scritto dal terminale è identico a quello della pagina.') + se_non_va('Non installare il file. Scaricalo di nuovo.'),
 'Il testo «Copiato.» compare senza movimento.', 'Comandi confrontati con <code>packaging/linux</code> e <code>docs/releasing.md</code>. Lacuna: i comandi non sono stati eseguiti su Fedora e Arch in questa sessione (provati dagli script di rilascio).')}

{scheda('c-scelta-sistema', 'Scelta della distribuzione', '<code>.scelta-sistema</code>, <code>.sistema</code>, attributo <code>data-sistema</code>',
 'Un indice di quattro collegamenti e quattro sezioni, ciascuna con cosa si guadagna e cosa costa. Con JavaScript scegliere una distribuzione tiene in vista solo i suoi blocchi nei passi 1-3 e compare «Mostra tutte»; la scelta non si salva sul dispositivo. Senza JavaScript sono tutte visibili. Con Windows, macOS o telefono compare un avviso compatto che manda alla pagina «Non ancora».',
 'F4, F2: trovare il proprio formato e non attraversare i comandi delle altre distribuzioni (P4).', dec('D26', 'D40', 'E09', 'E10'),
 '''<nav class="scelta-sistema" aria-label="Scegli la distribuzione"><ul class="scelta-sistema__indice"><li><a href="#c-scelta-sistema">Debian e Ubuntu</a></li><li><a href="#c-scelta-sistema">Fedora</a></li><li><a href="#c-scelta-sistema">Arch</a></li><li><a href="#c-scelta-sistema">Altre distribuzioni</a></li></ul></nav>
<section class="sistema"><h4>Fedora</h4><dl><dt>Cosa si guadagna</dt><dd>Si installa e si toglie con dnf.</dd><dt>Cosa costa</dt><dd>Chiede la password di amministratore. Il pacchetto non è firmato: dnf mostra un avviso.</dd></dl></section>
<p>La scelta vera, con i comandi, è nella <a href="../installa/">pagina Installa</a>.</p>''',
 'Il fondo dell\'indice cambia in 100 ms al passaggio; nessun contenuto si muove.', 'Prova con scelta e «Mostra tutte», senza JavaScript e con user agent Windows e macOS (prova-stati.mjs). Il banner usa <code>navigator</code>: non riconosce la distribuzione, e non lo fa apposta.')}

{scheda('c-filtro', 'Scheda-frase e filtro', '<code>.scheda-frase</code>, <code>.frase-finestra</code>, <code>.indice-frasi</code>, <code>.filtro</code>',
 'Per ogni frase della finestra: la frase vera (virgolettata), cosa significa, cosa fare. Un indice di soli collegamenti la raggiunge senza script; con script un campo restringe l\'elenco delle sole frasi della finestra e dice quante restano (lo stesso numero delle voci mostrate). I tre casi «La mia frase non c\'è» restano sempre in vista; senza risultati sparisce il gruppo e il messaggio rimanda a loro.',
 'F1, F2, F4: trovare la causa partendo da ciò che la finestra dice (P5).', dec('D09', 'E12', 'D30'),
 '''<div class="filtro" data-filtro data-testo-una="1 frase" data-testo-piu="frasi" data-testo-nessuna="Nessuna frase trovata. Prova una parola sola, per esempio «pronta» o «scarico». Oppure guarda i tre casi qui sotto, o segnala il problema." data-testo-tutte="Tutte le frasi."><label for="cerca-esempio">Scrivi una parte della frase (prova: «pipewire» o «curl»)</label><input id="cerca-esempio" type="search" autocomplete="off" spellcheck="false"><p class="filtro__stato" role="status"></p></div>
<section data-gruppo-frasi><ul class="indice-frasi"><li><a href="#esempio-curl">«Per scaricare la voce serve il programma curl: …»</a></li><li><a href="#esempio-pipewire">«La voce è pronta, ma …: per ora nessuno ti sentirà nelle chiamate.»</a></li></ul>
<article class="scheda-frase" id="esempio-curl"><h4><q class="frase-finestra">Per scaricare la voce serve il programma curl: …</q></h4><dl><dt>Cosa significa</dt><dd>Sul computer manca curl.</dd><dt>Cosa fare</dt><dd>Installa curl e premi di nuovo «Scarica la voce».</dd></dl></article>
<article class="scheda-frase" id="esempio-pipewire"><h4><q class="frase-finestra">La voce è pronta, ma …: per ora nessuno ti sentirà nelle chiamate.</q></h4><dl><dt>Cosa significa</dt><dd>Il microfono «Kalliope» non si è creato.</dd><dt>Cosa fare</dt><dd>Controlla PipeWire.</dd></dl></article></section>
<article class="scheda-frase" id="esempio-fisso"><h4>Caso fisso: «Kalliope» non compare fra i microfoni</h4><dl><dt>Cosa fare</dt><dd>Questo riquadro resta sempre visibile: sta fuori dal gruppo filtrato.</dd></dl></article>''',
 'Nessuno: l\'elenco si aggiorna di colpo. Il numero di frasi è annunciato (<code>role="status"</code>).', 'Prova con campo vuoto, parziale e senza risultati; prova senza JavaScript (il campo non compare, l\'elenco resta). Lacuna: lettore di schermo vero non disponibile.')}

{scheda('c-disclosure', 'Dettagli: corto subito, lungo a richiesta', '<code>.dettagli</code> su <code>&lt;details&gt;</code>',
 'La risposta corta è sempre in vista; il «perché» e i dettagli tecnici stanno dentro. Mai informazione essenziale solo dentro un dettaglio chiuso. Il simbolo cambia da + a − e l\'etichetta resta la stessa.',
 'F1, F2: leggere il corto e aprire il lungo quando serve (P1-P5).', dec('D30', 'E01', 'T07'),
 '''<div class="catalogo-controlli"><button type="button" class="btn btn--piccolo" data-sim-dettagli="dettagli-esempio" hidden>Apri o chiudi con un pulsante</button></div>
<details class="dettagli" id="dettagli-esempio"><summary>Che cosa stai ascoltando</summary><div class="dettagli__corpo"><p>Sono l\'uscita di Kalliope, senza ritocchi, convertita in MP3.</p></div></details>''',
 'Trigger: clic o Invio sull\'etichetta. Bersaglio: <code>.dettagli__corpo</code>. Proprietà: opacità 0→1, 120 ms (<code>--durata-2</code>), curva <code>--curva</code>, una volta, nessuna ripetizione. Interruzione: richiudere durante l\'apertura ferma l\'effetto. Movimento ridotto: durata 0, resta il cambio del simbolo.',
 'Prova tastiera, senza JavaScript, movimento ridotto (durata computata 0).')}

{scheda('c-tabella', 'Tabella e misura', '<code>.tabella</code>, <code>.misura</code>, <code>.segno</code>',
 'Per confrontare (provato / non provato, la stessa cosa detta a ciascuno) e per dire una cifra con la frase, il computer su cui è misurata e la fonte. Sotto 40 rem ogni riga diventa una scheda con le etichette. Nessun conteggio animato.',
 'F3, F5, F2: leggere fatti con il metodo accanto (P3, P7).', dec('D27', 'D29', 'E11', 'E13'),
 '''<table class="tabella"><caption>Esempio: provato, app per app</caption><thead><tr><th scope="col">App</th><th scope="col">In una riunione vera</th></tr></thead><tbody><tr><th scope="row">Zoom</th><td data-etichetta="In una riunione vera"><span class="segno">Non provato</span></td></tr><tr><th scope="row">Browser</th><td data-etichetta="In una riunione vera"><span class="segno">Non provato</span></td></tr></tbody></table>
<div class="misura"><b>2,3% di parole sbagliate</b>Su 10 frasi di prova, trascritte da Whisper. Fonte: README.</div>''',
 'Nessuno.', 'Prova a 390×844 (schede) e a testo 200%. Lacuna: nessuna lettura con persone.')}

{scheda('c-avviso', 'Avviso', '<code>.avviso</code>, <code>.avviso--attenzione</code>',
 'Una nota fuori dal flusso del testo: informativa (verde, bordo pieno) o di attenzione (ambra, bordo tratteggiato). Variante «riga» per l\'avviso del sistema: testo e collegamento a sinistra, «Chiudi» a destra, dentro la colonna del contenuto. Sempre testo; il bordo laterale e lo stile del bordo non sono il solo segno.',
 'F1, F2: non perdere una cosa importante.', dec('D24', 'D41'),
 '''<div class="avviso" role="note"><p class="avviso__titolo">Se non puoi ascoltare</p><p>Il testo qui sotto dice la stessa cosa.</p></div>
<div class="avviso avviso--attenzione" role="note"><p class="avviso__titolo">Non ancora provato in una riunione vera</p><p>Prima di una riunione importante fai una prova.</p></div>
<div class="avviso avviso--attenzione avviso--riga" role="note"><div class="avviso__corpo"><span class="avviso__titolo">Kalliope serve un computer Linux.</span> <a href="#c-avviso">Perché, e novità</a></div><button type="button" class="btn btn--piccolo">Chiudi</button></div>''',
 'Nessuno.', 'Contrasto-qa in tema chiaro e scuro.')}

{scheda('c-foto', 'Foto', '<code>.foto</code>',
 'Foto vera, mai simulata, con didascalia e testo alternativo che nomina i controlli. Dimensioni dichiarate (non sposta il testo). Variante piccola (24 rem): sotto «Cosa serve» nella pagina iniziale e al primo passo della pagina In riunione; non è più l\'immagine più grande del primo schermo.',
 'F1, F2, F3: vedere com\'è fatto il prodotto (P1, P5).', dec('D32', 'D12'),
 foto(P, piccola=True), 'Nessuno.', 'Alternativa controllata con l\'albero di accessibilità. Lacuna: manca la foto degli stati diversi dal caso felice (la finestra non li mostra in una sola schermata).')}

{scheda('c-condividi', 'Condividi', '<code>.condividi</code>',
 'Il campo con l\'indirizzo della pagina, selezionabile, e con script il pulsante «Copia l\'indirizzo». Nessuna icona di reti sociali.',
 'F2: inoltrare il collegamento a chi installerà (P3).', dec('E16', 'D11'),
 f'''<div class="condividi"><label for="indirizzo-esempio">Indirizzo di questa pagina</label><div class="condividi__riga"><input id="indirizzo-esempio" type="text" readonly value="{BASE_URL}sistema/"><button type="button" class="btn" data-copia data-testo-ok="Copiato." data-testo-no="Non riesco a copiare: seleziona l\'indirizzo e premi Ctrl+C.">Copia l\'indirizzo</button><span class="comando__stato" role="status"></span></div></div>''',
 'Nessuno.', 'Prova senza JavaScript (il pulsante non compare, il campo resta).')}

{scheda('c-piede', 'Piede del sito', '<code>.sito-piede</code>',
 'Chi c\'è dietro, la licenza («codice sorgente disponibile», non «open source»), la dichiarazione «nessun cookie, nessuna statistica, nulla da altri siti», i collegamenti al repository. Versione e data dai segnaposto.',
 'F3, F5: chi risponde e dove si verifica (P7).', dec('D23', 'D41', 'D21'),
 '<p>Il piede è quello di questa stessa pagina, in fondo.</p>', 'Nessuno.', 'Lettura; segnaposto sostituiti da <code>tools/site.py</code> (la costruzione fallisce se ne manca uno).')}

<h2 id="movimento">Movimento</h2>
<p>Inventario di ogni effetto del sito. Regola: nessun movimento che la persona non ha provocato; ogni movimento porta un'informazione e dura al più 240 ms, salvo quello legato al suono; con movimento ridotto è sostituito, non solo tolto ({dec('D44', 'T07')}). Gli effetti dei riferimenti non trasferiti sono nelle decisioni E02-E21 con il loro motivo.</p>
<div class="catalogo-controlli">
<button type="button" class="btn" data-attiva-ridotto aria-pressed="false" hidden>Simula il movimento ridotto</button>
<span data-stato-ridotto role="status"></span>
</div>
<section class="catalogo-scheda" id="c-movimento" aria-labelledby="c-movimento-t">
<h3 id="c-movimento-t">Barre e frase evidenziata (senza audio)</h3>
<div class="catalogo-prova" data-sim-barre>
<p class="catalogo-prova__titolo">Prova viva: riproduce l'inviluppo misurato di «Giulia, frase 2»</p>
<p class="scritto"><span class="frase" data-frase="1">Sono d'accordo con Paola.</span> <span class="frase" data-frase="2">Però la consegna del <span class="cambia">14/3</span> mi sembra stretta: possiamo sentirci venerdì alle <span class="cambia">15:30</span>?</span></p>
<div class="voce__controlli voce__controlli--sim">{BARRE}<span class="voce__posizione" data-sim-posizione>fermo</span></div>
<div class="catalogo-controlli"><button type="button" class="btn btn--piccolo" data-sim-avvia hidden>Riproduci</button><button type="button" class="btn btn--piccolo" data-sim-inverti hidden>Inverti</button><button type="button" class="btn btn--piccolo" data-sim-ferma hidden>Ferma</button></div>
</div>
<dl class="catalogo-dati">
<dt>Effetto</dt><dd>Barre dell'icona che seguono il livello della voce; frase in corso evidenziata (E19).</dd>
<dt>Trigger</dt><dd>Il pulsante «Ascolta» (gesto della persona). Mai al caricamento.</dd>
<dt>Bersagli e proprietà</dt><dd><code>.barre i</code>: <code>transform: scaleY(var(--h))</code>, <code>--h</code> da 0,14 a 1 aggiornato a ogni fotogramma; <code>.frase.in-corso</code>: sfondo e sottolineatura.</dd>
<dt>Tempi e curva</dt><dd>Transizione di 100 ms lineare sulle barre; 100 ms lineare sullo sfondo della frase; la durata complessiva è quella del suono. Coreografia: le cinque barre mostrano le ultime cinque misure (60 ms ciascuna): una piccola forma d'onda che scorre da sinistra a destra.</dd>
<dt>Ripetizione e interruzione</dt><dd>Nessuna ripetizione. «Ferma», la fine del suono o l'avvio di un altro ascolto riportano le barre alla forma dell'icona e tolgono l'evidenza.</dd>
<dt>Movimento ridotto</dt><dd>Sostituzione: le barre restano ferme e piene; la frase in corso resta evidenziata e la posizione è scritta («frase 1 di 2 · 3,0 s / 9,3 s»). Attiva il pulsante qui sopra e riproduci di nuovo per confrontare.</dd>
<dt>Fonte e differenze</dt><dd>R06 (barrette dell'interruttore del suono, la porta legata al titolo) per l'idea di legare il gesto al tema; il livello vero della voce, la frase in corso e la sostituzione sono scelte di Kalliope. Dichiarato in E19: la scenografia della porta è attenuata a una sola animazione.</dd>
</dl>
</section>
<section class="catalogo-scheda" aria-labelledby="mov2-t">
<h3 id="mov2-t">Altri effetti del sito</h3>
<table class="tabella"><caption>Gli effetti del sito oltre alle barre</caption>
<thead><tr><th scope="col">Effetto</th><th scope="col">Trigger</th><th scope="col">Proprietà e tempo</th><th scope="col">Ridotto</th><th scope="col">Fonte</th></tr></thead>
<tbody>
<tr><th scope="row">Apertura di un dettaglio</th><td data-etichetta="Trigger">Clic o Invio su <code>summary</code></td><td data-etichetta="Proprietà e tempo">opacità 0→1, 120 ms, <code>--curva</code></td><td data-etichetta="Ridotto">istantaneo, cambia il simbolo</td><td data-etichetta="Fonte">{dec('E01')}</td></tr>
<tr><th scope="row">Stato dei comandi</th><td data-etichetta="Trigger">Passaggio, focus, pressione</td><td data-etichetta="Proprietà e tempo">colore, sfondo e bordo, 100 ms</td><td data-etichetta="Ridotto">istantaneo; l'anello di focus resta</td><td data-etichetta="Fonte">{dec('E14')}</td></tr>
<tr><th scope="row">Evidenza della frase</th><td data-etichetta="Trigger">Il suono entra nella frase</td><td data-etichetta="Proprietà e tempo">sfondo, 100 ms lineare</td><td data-etichetta="Ridotto">invariata: porta l'informazione</td><td data-etichetta="Fonte">{dec('E19', 'D44')}</td></tr>
</tbody></table>
<p>Nessun altro movimento: niente comparse allo scorrimento, cicli infiniti, parallasse, carosello, contatori, intestazione che si trasforma ({dec('E02', 'E03', 'E04', 'E05', 'E09', 'E11')}). Controllo: nessuna animazione infinita nel sito.</p>
</section>

<h2 id="accessibilita">Accessibilità e interazioni</h2>
<section class="catalogo-scheda" id="c-focus" aria-labelledby="c-focus-t"><h3 id="c-focus-t">Focus e tastiera</h3>
<p>Primo Tab: «Vai al contenuto». Anello di focus: 3 px nel colore dell'inchiostro con alone chiaro, visibile su carta e sul verde ({dec('D13')}). Ordine di Tab uguale all'ordine visivo. Nessun comando dipende dal passaggio del mouse, dal tempo o da un gesto complesso. <a class="btn btn--piccolo sim-focus" href="#c-focus">Anello di focus (simulato)</a></p></section>
<section class="catalogo-scheda" id="c-semantica" aria-labelledby="c-semantica-t"><h3 id="c-semantica-t">Struttura per lettori di schermo</h3>
<p>Un H1 per pagina, titoli in ordine, punti di riferimento (intestazione, navigazione, contenuto principale, piè di pagina), foto con alternativa, audio con etichetta ({dec('D12')}). Verifica con l'albero di accessibilità (proxy). <strong>Lacuna:</strong> Orca, NVDA e VoiceOver non sono disponibili in questo ambiente.</p></section>
<section class="catalogo-scheda" id="c-senza-js" aria-labelledby="c-senza-js-t"><h3 id="c-senza-js-t">Senza JavaScript</h3>
<p>Ogni pagina è documento completo. Gli script aggiungono quattro cose, ognuna con il suo equivalente: ascolto con barre (controlli nativi dell'audio), filtro (elenco completo), «Copia» (testo selezionabile), avviso sul sistema (collegamento fisso «Non uso Linux») ({dec('D19')}).</p></section>
<section class="catalogo-scheda" id="c-forzati" aria-labelledby="c-forzati-t"><h3 id="c-forzati-t">Colori forzati e tema scuro</h3>
<p>Bordi reali su bottoni, cartellini e riquadri; le barre usano i colori di sistema; la variante scura mantiene i rapporti di contrasto ({dec('D18', 'D42', 'T02')}). Il tema segue il sistema: nessun interruttore.</p></section>

<h2 id="prestazioni">Prestazioni e canali</h2>
<section class="catalogo-scheda" id="c-prestazioni" aria-labelledby="c-prestazioni-t"><h3 id="c-prestazioni-t">Peso e dipendenze</h3>
<p>Budget: al più 200 kB di HTML, CSS e script per pagina, 0 domini esterni, audio escluso ({dec('D20', 'D21', 'D22')}). Carattere di sistema, nessuna immagine oltre alla foto della finestra e all'icona. L'audio si carica solo al gesto. I valori misurati sono nel paragrafo «Prove».</p></section>
<section class="catalogo-scheda" id="c-meta" aria-labelledby="c-meta-t"><h3 id="c-meta-t">Anteprima del collegamento e viewport</h3>
<p>Ogni pagina ha titolo, descrizione, Open Graph e indirizzo canonico ({dec('D11')}); il meta viewport non limita lo zoom ({dec('D17')}).</p></section>
<section class="catalogo-scheda" id="c-stampa" aria-labelledby="c-stampa-t"><h3 id="c-stampa-t">Stampa</h3>
<p>In stampa spariscono navigazione, tappe e pulsanti; i collegamenti mostrano l'indirizzo; i comandi restano con il bordo; colori a nero ({dec('D10')}).</p></section>
<section class="catalogo-scheda" id="c-404" aria-labelledby="c-404-t"><h3 id="c-404-t">Pagina 404</h3>
<p>Una frase senza colpa e sei collegamenti; senza ricerca perché il sito è piccolo ({dec('D08')}). Provala: <a href="{P}questa-pagina-non-esiste/">un indirizzo che non esiste</a> (il server di GitHub Pages mostra la 404 del sito).</p></section>
<p>Canali: il sito gira in qualsiasi browser; questo percorso è provato soltanto in Chromium senza finestra (simulato). Non è stato provato su dispositivi reali né in Firefox e WebKit; l'elenco di 15 dispositivi e la matrice per tre motori seguono l'approvazione.</p>

<h2 id="provenienza">Ricerca, confronto e decisioni</h2>
<p>Tredici riferimenti visitati (nove vincitori Webby e quattro prodotti affini), quattro pagine italiane di registro, 141 righe di confronto più gli effetti, nessuna caratteristica identica in tutti i riferimenti, 16 meccanismi comuni con varianti, 432 varianti con destinazione o esclusione. Tutto è generato dalle stesse osservazioni.</p>
<ul>
<li><a href="ricerca/">Riferimenti, matrice dei compiti e decisioni (vista completa)</a></li>
<li><a href="{GH}confronto.md">Confronto completo: identico, varianti, peculiarità (design/confronto.md)</a></li>
<li><a href="{GH}copertura.md">Copertura dei compiti (design/copertura.md)</a></li>
<li><a href="{GH}direzione.md">Direzione, alternative e regole (design/direzione.md)</a></li>
<li><a href="{GH}ricerca/schede/">Schede dei riferimenti</a> e <a href="{GH}ricerca/movimento/">inventari del movimento</a></li>
</ul>
<p>Il sito non mostra foto dei siti di riferimento (diritti d'autore): solo testo e collegamenti.</p>

<h2 id="prove">Prove</h2>
{PROVE}
</div>'''
    return pagina('sistema', 'Come è fatto questo sito: il catalogo di Kalliope',
                  'Il catalogo vivo del sito di Kalliope: token, componenti con stati e varianti, movimento, accessibilità, ricerca, confronto e decisioni.',
                  corpo, extra_head='<script src="../script/sistema.js" defer></script>\n')

# ------------------------------------------------------------------ prove (da design/prove-percorso/esiti.json, se c'è)
def prove():
    f = DESIGN + 'prove-percorso/esiti.json'
    if not os.path.exists(f):
        return '<p>Gli esiti dei controlli saranno qui, letti da <code>design/prove-percorso/esiti.json</code>: non ancora generati.</p>'
    d = json.load(open(f, encoding='utf-8'))
    righe = ''.join(f'<tr><th scope="row">{i + 1}</th><td data-etichetta="Controllo">{e(r["controllo"])}</td><td data-etichetta="Esito">{e(r["esito"])}</td><td data-etichetta="Dove">{e(r["dove"])}</td><td data-etichetta="Data">{e(r["data"])}</td></tr>' for i, r in enumerate(d['esiti']))
    lacune = ''.join(f'<li>{e(x)}</li>' for x in d.get('lacune', []))
    peso = ''
    if d.get('peso'):
        peso = '<table class="tabella"><caption>Peso delle pagine (Chromium, rete locale, senza audio)</caption><thead><tr><th scope="col">Pagina</th><th scope="col">Richieste</th><th scope="col">Byte (HTML, CSS, script, immagini)</th><th scope="col">Domini esterni</th></tr></thead><tbody>' + ''.join(
            f'<tr><th scope="row">{e(p["pagina"])}</th><td data-etichetta="Richieste">{p["richieste"]}</td><td data-etichetta="Byte">{p["byte"]}</td><td data-etichetta="Domini esterni">{p["esterni"]}</td></tr>' for p in d['peso']) + '</tbody></table>'
    aperti = ''.join(f'<li>{e(x)}</li>' for x in d.get('aperti', []))
    return (f'<p>Data: {e(d["data"])}. Motore: {e(d.get("motori", "Chromium senza finestra, 1440×900 e 390×844"))}. Una simulazione non è una prova su un dispositivo reale.</p>'
            f'<table class="tabella"><caption>Esiti dei controlli</caption><thead><tr><th scope="col">N.</th><th scope="col">Controllo</th><th scope="col">Esito</th><th scope="col">Dove sono le prove</th><th scope="col">Data</th></tr></thead><tbody>{righe}</tbody></table>'
            f'{peso}<h3>Difetti ancora aperti</h3><p>Dalla revisione visiva e dai controlli: non corretti in questo giro.</p><ul>{aperti}</ul><h3>Lacune dichiarate</h3><ul>{lacune}</ul>')

PROVE = prove()

# ------------------------------------------------------------------ ricerca
def ricerca():
    P = '../../'
    righe_rif = ''
    for r in confronto['riferimenti']:
        nome = e(r.get('nome', r['id'])).replace('|', '/')
        premio = e((r.get('premio') or 'prodotto affine, non Webby')[:160])
        righe_rif += (f'<tr><th scope="row">{r["id"]}</th><td data-etichetta="Riferimento"><a href="{e(r["url"])}">{nome}</a></td><td data-etichetta="Gruppo">{r.get("gruppo", "")}</td>'
                      f'<td data-etichetta="Premio o tipo">{premio}</td><td data-etichetta="Scheda"><a href="{GH}ricerca/schede/{r["id"]}.md">scheda</a></td></tr>')
    intest = ''.join(f'<th scope="col">{i}</th>' for i in ids)
    righe_m = ''
    for k, v in matr.items():
        righe_m += f'<tr><th scope="row">{k} {e(v["titolo"])}</th>' + ''.join(f'<td>{v["celle"][i][0]}</td>' for i in ids) + f'<td>{len(v["P"])}</td><td>{e(v["verdetto"].split(":")[0])}</td></tr>'
    righe_d = ''
    for x in direzione['decisioni']:
        siti = sorted({f['riferimento'] for f in x['fonti']})
        mot = x.get('motivo_dettaglio') or x.get('motivo', '')
        righe_d += (f'<tr id="{x["id"]}"><th scope="row" data-etichetta="Decisione">{x["id"]}<br><span class="piccolo">{x["esito"]}</span></th>'
                    f'<td data-etichetta="Destinazione">{e(x["destinazione"])}<br><span class="piccolo">Fonti: {", ".join(siti) or "progettuale"}</span></td>'
                    f'<td data-etichetta="Motivo">{e(mot)}</td>'
                    f'<td data-etichetta="Ripiego o adattamento">{e(x.get("ripiego") or x.get("adattamento") or "—")}</td></tr>')
    ass = ''.join(f'<li><strong>{a["id"]}.</strong> {e(a["cosa"])} <em>Come si riconosce:</em> {e(a["come_si_riconosce"])}</li>' for a in direzione['ambizione'])
    regole = ''.join(f'<li><strong>{r["id"]}</strong> {e(r["testo"])}</li>' for r in direzione['regole'])
    prop = ''.join(f'<li><strong>{r["id"]}</strong> {e(r["testo"])} <em>(proposta, non ancora accolta)</em></li>' for r in direzione['regole_proposte'])
    corpo = f'''<div class="pagina testo">
<h1>Ricerca, confronto e decisioni</h1>
<p>Questa pagina è generata da <code>design/confronto.json</code>, <code>design/direzione.json</code> e dalla matrice dei compiti, con <code>design/strumenti/pagine/genera-catalogo.py</code>. Non ricopia le osservazioni: ne mostra i riferimenti, la copertura e le decisioni. Il confronto completo e le schede sono nel repository.</p>
<p><a href="{P}sistema/">Torna al catalogo</a></p>
<nav class="catalogo-indice" aria-label="Indice"><ul><li><a href="#riferimenti">Riferimenti</a></li><li><a href="#copertura">Copertura dei compiti</a></li><li><a href="#ambizione">Ambizione</a></li><li><a href="#regole">Regole</a></li><li><a href="#decisioni">Decisioni</a></li></ul></nav>

<h2 id="riferimenti">Riferimenti visitati</h2>
<p>Solo testo e collegamenti: niente foto dei siti, per i diritti d'autore. Chrome MCP non c'era in questo ambiente: le visite sono con Chromium senza finestra.</p>
<table class="tabella"><caption>I tredici riferimenti</caption><thead><tr><th scope="col">ID</th><th scope="col">Riferimento</th><th scope="col">Gruppo</th><th scope="col">Premio o tipo</th><th scope="col">Scheda</th></tr></thead><tbody>{righe_rif}</tbody></table>
<p>Gruppo A: dal problema e dal meccanismo (Webby). B: dalle competenze (Webby). C: prodotti affini e concorrenti (non Webby). Le motivazioni ufficiali dei premi, dove disponibili, sono nelle schede; una frequenza nel campione non dimostra efficacia.</p>

<h2 id="copertura">Copertura dei compiti</h2>
<p>P = tratto presente nel nucleo del compito; A = assente verificato; · = non osservato. Regola: almeno tre riferimenti con tratto presente. Lacune e riserve: <a href="{GH}copertura.md">design/copertura.md</a>.</p>
<div class="matrice-scorri" tabindex="0" role="region" aria-label="Matrice dei compiti per riferimento">
<table class="matrice"><thead><tr><th scope="col">Compito</th>{intest}<th scope="col">P</th><th scope="col">Esito</th></tr></thead><tbody>{righe_m}</tbody></table>
</div>

<h2 id="ambizione">Criterio di ambizione</h2>
<ul>{ass}</ul>

<h2 id="regole">Regole</h2>
<ul>{regole}{prop}</ul>

<h2 id="decisioni">Decisioni</h2>
<p>{len(direzione["decisioni"])} decisioni. Ogni caratteristica comune, variante e peculiarità del confronto ha una destinazione o un'esclusione motivata (il controllo di metodo è nell'ultima sezione di <a href="{GH}direzione.md">design/direzione.md</a>). D** struttura e contenuto, E** effetti, T** token e composizione.</p>
<table class="tabella"><caption>Tutte le decisioni</caption><thead><tr><th scope="col">Decisione</th><th scope="col">Destinazione e fonti</th><th scope="col">Motivo</th><th scope="col">Ripiego o adattamento</th></tr></thead><tbody>{righe_d}</tbody></table>
</div>'''
    return pagina('sistema/ricerca', 'Ricerca, confronto e decisioni di Kalliope', 'I tredici riferimenti, la copertura dei compiti e le decisioni del sistema di Kalliope, generati dalle osservazioni.',
                  corpo, profondita=2)

if __name__ == '__main__':
    for nome, contenuto in (('sistema/index.html', catalogo()), ('sistema/ricerca/index.html', ricerca())):
        p = SITE + nome
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, 'w', encoding='utf-8').write(contenuto)
        print('scritto', nome, len(contenuto))
