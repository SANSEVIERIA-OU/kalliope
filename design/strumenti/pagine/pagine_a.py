# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
from layout import pagina, percorso, avanti, indice, REPO, BASE_URL
from comp import ascolto, stato_card, foto, comando, controllo, se_non_va, dettagli

# ------------------------------------------------------------------ HOME
def home():
    corpo = f'''<section class="apertura pagina" aria-labelledby="titolo-pagina">
<div class="apertura__griglia">
<div class="apertura__titolo">
<h1 id="titolo-pagina">Scrivi, e Kalliope parla per te nella riunione.</h1>
<p class="apertura__stato"><span class="solo-prova">Versione di prova: </span>solo per Linux, non ancora provata in una riunione vera.</p>
</div>
<div class="apertura__ascolto">
{ascolto(3, '', voci=('giulia',), livello=2, hero=True, id_='ascolta')}
<p class="apertura__altre"><a href="ascolta/">Altre frasi e la voce di Marco</a></p>
</div>
<p class="apertura__frase">Kalliope è un programma per il computer, per chi non può parlare o fa fatica a farlo. Scrivi una frase e premi Invio: una voce italiana la dice nel microfono delle app di riunione.</p>
<aside class="avviso avviso--attenzione avviso--riga apertura__avviso" data-banner-sistema hidden
 data-testo-windows="Kalliope oggi non funziona su Windows."
 data-testo-macos="Kalliope oggi non funziona su macOS."
 data-testo-telefono="Kalliope serve un computer Linux.">
<div class="avviso__corpo"><span class="avviso__titolo" data-banner-testo></span> <a href="non-ancora/">Perché, e novità</a></div>
<button type="button" class="btn btn--piccolo" data-banner-chiudi>Chiudi</button>
</aside>
<div class="apertura__stato-card">
{stato_card(True, '')}
</div>
<div class="apertura__azioni">
<div class="azioni">
<a class="btn btn--primario" href="installa/">Scarica e installa</a>
<a class="collegamento-forte" href="non-ancora/">Non uso Linux: cosa posso fare</a>
</div>
</div>
</div>
</section>
<section class="sezione sezione--carta-2" aria-labelledby="porte-titolo">
<div class="pagina testo">
<h2 id="porte-titolo">Da dove vuoi cominciare?</h2>
<ul class="porte">
<li><a href="stato/#per-chi">Scrivo per parlare: fa per me?</a></li>
<li><a href="stato/#detta-a-chi">Leggo per un'altra persona</a></li>
<li><a href="stato/#controllare">Devo controllare cosa fa</a></li>
<li><a href="installa/">Installo per un altro</a></li>
</ul>
</div>
</section>
<section class="sezione" aria-labelledby="serve-titolo">
<div class="pagina testo">
<div class="griglia-2">
<div>
<h2 id="serve-titolo">Cosa serve</h2>
<ul>
<li>Un computer Linux a 64 bit (x86_64) con PipeWire.</li>
<li>53 MB di spazio per la voce. Si scarica una volta sola, con internet. Poi Kalliope funziona senza.</li>
<li>Un'app di riunione che ti lasci scegliere il microfono.</li>
</ul>
<p>Il testo che scrivi resta sul tuo computer. Non c'è un account e non c'è un prezzo. L'uso personale è libero; <a href="stato/#controllare">le regole per un uso commerciale sono nella pagina Stato e limiti</a>.</p>
<p>Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.</p>
</div>
<div>
{foto('', 'La finestra di Kalliope, come si presenta con la voce pronta.', piccola=True)}
</div>
</div>
</div>
</section>
<div class="pagina">
{avanti('', None, ('installa', 'Scarica e installa'))}
</div>'''
    return pagina('', 'Kalliope: scrivi, e la voce parla per te nelle riunioni',
                  'Kalliope dà voce a chi non può parlare: scrivi, e una voce italiana parla nel microfono delle app di riunione. Versione di prova, per Linux.',
                  corpo)


def ascolta():
    P = '../'
    corpo = f'''<div class="pagina testo">
{percorso(P, 'ascolta')}
<h1>Ascolta la voce</h1>
<p>Vedi la frase scritta e la frase detta: le cifre sono lette come parole, e sono sottolineate.</p>
{ascolto(1, P, livello=2)}
<div class="avviso" role="note">
<p class="avviso__titolo">Se non puoi ascoltare</p>
<p>Leggi le due righe di ogni riquadro: sono lo stesso discorso. Kalliope non può far sentire chi non sente e non scrive i sottotitoli della riunione.</p>
</div>
{ascolto(2, P, livello=2)}
{ascolto(3, P, livello=2)}
<h2>Come sono state fatte queste registrazioni</h2>
{dettagli('Che cosa stai ascoltando', """<p>Sono l'uscita di Kalliope 0.1-rc.1, senza ritocchi, convertita in MP3 (64 kbit/s, mono, 24 kHz).</p>
<p>Un programma di riconoscimento del parlato, Whisper, le trascrive con circa una parola sbagliata su 45. È una misura del progetto sui sei campioni.</p>
<p>Non abbiamo misurato quanto si capiscano in una riunione vera, né quanto tempo passa fra il tasto Invio e il suono.</p>
<p>Il testo «scrivi» è quello che hai digitato. Il testo «dice» è quello che Kalliope prepara prima di parlare: cifre, date e orari diventano parole.</p>""")}
{avanti(P, ('', 'Pagina iniziale'), ('stato', 'Stato e limiti'))}
</div>'''
    return pagina('ascolta', 'Ascolta la voce di Kalliope: scritto e detto',
                  'Sei registrazioni vere di Kalliope, con la voce di Giulia e di Marco. Vedi la frase scritta e la stessa frase detta, con le cifre lette come parole.',
                  corpo, corrente='ascolta')


# ------------------------------------------------------------------ STATO E LIMITI
def stato():
    P = '../'
    corpo = f'''<div class="pagina testo">
{percorso(P, 'stato')}
<h1>Stato e limiti</h1>
<p>Qui c'è ciò che sappiamo e ciò che non sappiamo. Prima lo stato, poi le promesse.</p>
{stato_card(False, P)}
{indice([('per-chi', 'Per chi è, e per chi no'), ('provato-per-app', 'Provato, app per app'), ('detta-a-chi', 'La stessa cosa, detta a ciascuno'), ('controllare', 'Se devi controllare'), ('misure', 'Misure'), ('chi', 'Chi c\'è dietro')])}
<h2 id="per-chi">Per chi è, e per chi no</h2>
<h3>Fa per te se</h3>
<ul>
<li>scrivi con una tastiera o con un altro dispositivo che scrive per te;</li>
<li>vuoi intervenire in una riunione senza usare la tua voce;</li>
<li>hai un computer Linux a 64 bit con PipeWire.</li>
</ul>
<h3>Forse non fa per te se</h3>
<ul>
<li>scrivere è difficile per te. Per alcune persone con afasia Kalliope può non servire, o servire con un familiare. Non lo promettiamo: è da confermare con un logopedista.</li>
<li>usi Windows, macOS o un telefono: <a href="../non-ancora/">leggi perché non ancora</a>.</li>
<li>cerchi i sottotitoli della riunione: Kalliope non ascolta.</li>
<li>cerchi un servizio online: Kalliope è un programma sul tuo computer.</li>
</ul>
<p>Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.</p>

<h2 id="provato-per-app">Provato, app per app</h2>
<table class="tabella">
<caption>Versione <span class="solo-prova">di prova</span> <span class="nowrap">{{{{kalliope.version}}}}</span>, del {{{{kalliope.date}}}}</caption>
<thead><tr><th scope="col">App</th><th scope="col">In una riunione vera</th><th scope="col">Dove si sceglie il microfono</th></tr></thead>
<tbody>
<tr><th scope="row">Zoom</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Impostazioni, Audio, Microfono, «Kalliope».</td></tr>
<tr><th scope="row">Microsoft Teams</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Non descritto: non lo abbiamo provato.</td></tr>
<tr><th scope="row">Google Meet</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Non descritto: non lo abbiamo provato.</td></tr>
<tr><th scope="row">Webex</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Non descritto: non lo abbiamo provato.</td></tr>
<tr><th scope="row">Jitsi</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Non descritto: non lo abbiamo provato.</td></tr>
<tr><th scope="row">Browser (pagine di riunione)</th><td data-etichetta="In una riunione vera"><span class="segno">Non ancora provato</span></td><td data-etichetta="Dove si sceglie il microfono">Nella richiesta del browser o nella pagina della riunione.</td></tr>
</tbody>
</table>
<p>Nessuna app è stata provata in una riunione vera. Per Kalliope l'app di riunione è un'app qualunque che registra da un microfono. Funziona se l'app lascia scegliere il microfono, ma va provato app per app. Hai provato? <a href="../aiuto/#segnala">Dicci come è andata</a>.</p>

<h2 id="detta-a-chi">La stessa cosa, detta a ciascuno</h2>
<table class="tabella">
<caption>Le stesse informazioni, per chi legge con scopi diversi</caption>
<thead><tr><th scope="col">Domanda</th><th scope="col">Chi scrive per parlare</th><th scope="col">Chi legge per un altro</th><th scope="col">Chi installa</th><th scope="col">Chi controlla</th></tr></thead>
<tbody>
<tr><th scope="row">Cosa fa?</th><td data-etichetta="Chi scrive per parlare">Scrivi, e la tua frase la dice una voce nella riunione.</td><td data-etichetta="Chi legge per un altro">Come per chi scrive, più la sezione «per chi è e per chi no».</td><td data-etichetta="Chi installa">Un programma con un microfono virtuale PipeWire che le app vedono.</td><td data-etichetta="Chi controlla">Fa parlare un testo scritto; non ascolta e non trascrive.</td></tr>
<tr><th scope="row">Che fine fa il testo?</th><td data-etichetta="Chi scrive per parlare">Resta sul tuo computer.</td><td data-etichetta="Chi legge per un altro">Resta sul computer. Le frasi dette restano in un elenco nella finestra e spariscono quando la chiudi.</td><td data-etichetta="Chi installa">Dopo lo scarico della voce non serve rete.</td><td data-etichetta="Chi controlla">Nessun invio. L'unica connessione è lo scarico della voce (vedi «Se devi controllare»).</td></tr>
<tr><th scope="row">Quanto costa?</th><td data-etichetta="Chi scrive per parlare">Non c'è un prezzo. L'uso personale è libero.</td><td data-etichetta="Chi legge per un altro">Come per chi scrive.</td><td data-etichetta="Chi installa">Licenza SANSEVIERIA 1.0.</td><td data-etichetta="Chi controlla">Uso personale, di ricerca e interno aziendale: permesso senza compenso. Offerte commerciali: serve l'autorizzazione scritta di SANSEVIERIA OÜ.</td></tr>
<tr><th scope="row">Cosa serve oggi?</th><td data-etichetta="Chi scrive per parlare">Un computer Linux. Se non ce l'hai, <a href="../non-ancora/">te lo diciamo subito</a>.</td><td data-etichetta="Chi legge per un altro">Come per chi scrive, più qualcuno che lo installi.</td><td data-etichetta="Chi installa">Linux x86_64, glibc 2.39 o più recente, PipeWire con pipewire-pulse, curl.</td><td data-etichetta="Chi controlla">Debian 13, Ubuntu 24.04 o più recenti, Fedora attuale, Arch; altre con l'archivio.</td></tr>
<tr><th scope="row">È provato?</th><td data-etichetta="Chi scrive per parlare">Fino al microfono sì. In una riunione vera non ancora.</td><td data-etichetta="Chi legge per un altro">Come per chi scrive; dice che prima di una riunione importante conviene fare una prova.</td><td data-etichetta="Chi installa">L'installazione è provata da uno script su Ubuntu, Fedora e Arch.</td><td data-etichetta="Chi controlla">Misure su un solo computer (sotto).</td></tr>
<tr><th scope="row">Come si installa?</th><td data-etichetta="Chi scrive per parlare">Chiedi a chi ti aiuta di leggere la <a href="../installa/">pagina Installa</a>.</td><td data-etichetta="Chi legge per un altro">Passi con comandi da copiare: <a href="../installa/">pagina Installa</a>.</td><td data-etichetta="Chi installa">Comandi e impronte nella <a href="../installa/">pagina Installa</a>.</td><td data-etichetta="Chi controlla">Impronte e provenienza nella <a href="../installa/">pagina Installa</a>.</td></tr>
</tbody>
</table>

<h2 id="controllare">Se devi controllare</h2>
<p>Ogni affermazione rimanda a un file del repository. Dove non c'è una fonte lo scriviamo.</p>
<h3>Cosa esce dal computer</h3>
<ul>
<li>Il testo che scrivi: niente. Il testo non viene inviato e non viene salvato.</li>
<li>L'unica connessione dell'app è lo scarico della voce al primo avvio: con il programma curl, da huggingface.co, a una revisione fissata del modello, in tre file (53 MB in tutto). Kalliope controlla l'impronta SHA-256 di ciascun file e scarta quelli che non corrispondono. <span class="piccolo">Fonti: <code>crates/app/src/download.rs</code>, <code>catalog.rs</code>.</span></li>
<li>Nessun account. Kalliope non ha servizi in background né avvio automatico: è un solo programma. Quando chiudi la finestra si chiude del tutto, e il microfono «Kalliope» sparisce con lui.</li>
</ul>
<h3>Cosa viene salvato</h3>
<ul>
<li>Sul disco: la voce scelta e la scelta «Senti anche tu», in un file di preferenze. Poi la voce scaricata, in una cartella dell'utente.</li>
<li>Non viene salvato: il testo scritto e l'elenco delle frasi (resta in memoria, fino a 30 frasi).</li>
</ul>
<h3>Licenze</h3>
<ul>
<li>Kalliope: SANSEVIERIA 1.0, codice sorgente disponibile. Non è una licenza «open source» approvata dall'OSI.</li>
<li>Componenti di terzi: ONNX Runtime (MIT), il modello Klein-TTS-X1.5-Pro (Apache-2.0), Slint, il lessico di pronuncia da Wiktionary (CC BY-SA 4.0). L'elenco completo è nei file <code>NOTICE</code> e <code>THIRD_PARTY_NOTICES.md</code> del repository.</li>
</ul>
<h3>Impronte e provenienza</h3>
<ul>
<li>Le impronte dei file sono nella <a href="../installa/#passo-2">pagina Installa</a> e nel file <a href="{{{{kalliope.sums.url}}}}">SHA256SUMS</a> della versione.</li>
<li class="solo-rc1">Questa versione non ha l'attestazione di provenienza (<code>gh attestation verify</code>): fu pubblicata quando il repository era ancora privato. Le versioni successive l'avranno.</li>
<li>Non c'è un audit indipendente che possiamo citare.</li>
</ul>
<h3 id="misure">Misure</h3>
<p>Tutte le cifre sono misurate su un solo computer, un portatile con processore Ryzen 5 PRO 6650U. Su altri computer non le conosciamo.</p>
<div class="misura"><b>2,3% di parole sbagliate</b>Su 10 frasi di prova, trascritte da Whisper dalla voce registrata dal microfono «Kalliope», come la sentirebbe una riunione. Fonte: README, sezione «How it works».</div>
<div class="misura"><b>0,07 secondi di CPU per ogni secondo di voce</b>Con la voce Klein, un solo thread. Fonte: README.</div>
<div class="misura"><b>10,6 MB di memoria con la sola finestra; circa 117 MB con la voce caricata</b>Con 0% di CPU quando è ferma. Fonte: README.</div>
<div class="misura"><b>0% di CPU se nessuna app ascolta; circa 0,26% di un core mentre un'app registra</b>Ritardo del microfono circa 21 ms. Fonte: <code>docs/virtual-microphone.md</code>.</div>
<p>Non abbiamo misurato il tempo fra la pressione di Invio e il suono nella riunione, né quanto dura «Preparo la voce…» a ogni avvio.</p>
<h3 id="chi">Chi c'è dietro</h3>
<p>Kalliope è prodotto da SANSEVIERIA OÜ. Gli autori sono nominati nel file <code>NOTICE</code> del repository. Non c'è un indirizzo e-mail: le segnalazioni passano dalle <a href="{REPO}/issues">issue di GitHub</a>, che richiedono un account GitHub.</p>
{avanti(P, ('ascolta', 'Ascolta la voce'), ('installa', 'Installa'))}
</div>'''
    return pagina('stato', 'Stato e limiti di Kalliope: cosa è provato e cosa no',
                  'Cosa è provato, cosa non è ancora provato e cosa non esiste. Per chi è Kalliope, cosa fa del testo, licenze, misure e chi c\'è dietro.',
                  corpo, corrente='stato')
