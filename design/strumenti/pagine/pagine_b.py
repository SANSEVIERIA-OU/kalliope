# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
from layout import pagina, percorso, avanti, indice, REPO, BASE_URL
from comp import ascolto, stato_card, foto, comando, controllo, se_non_va, dettagli


def installa():
    P = '../'
    corpo = f'''<div class="pagina testo">
{percorso(P, 'installa')}
<h1>Installa Kalliope su Linux</h1>
<p>Cinque passi. Ogni passo dice come capire se è riuscito. Serve un computer Linux a 64 bit con PipeWire e curl, e internet una volta per la voce (53 MB).</p>
<div class="avviso avviso--attenzione" role="note">
<p><strong>Versione <span class="solo-prova">di prova </span>{{{{kalliope.version}}}}.</strong> Non è ancora provata in una riunione vera. <a href="{P}stato/">Stato e limiti</a></p>
</div>
<div class="avviso avviso--attenzione avviso--riga" data-banner-sistema hidden
 data-testo-windows="Questa guida non funziona su Windows: Kalliope oggi esiste solo per Linux."
 data-testo-macos="Questa guida non funziona su macOS: Kalliope oggi esiste solo per Linux."
 data-testo-telefono="Questa guida serve a un computer Linux.">
<div class="avviso__corpo"><span class="avviso__titolo" data-banner-testo></span> <a href="{P}non-ancora/">Perché, e novità</a></div>
<button type="button" class="btn btn--piccolo" data-banner-chiudi>Chiudi</button>
</div>
{indice([('passo-1', 'Passo 1: scarica'), ('passo-2', 'Passo 2: controlla il file'), ('passo-3', 'Passo 3: installa'), ('passo-4', 'Passo 4: apri e scarica la voce'), ('passo-5', 'Passo 5: controlla il microfono'), ('ripresa', 'Se ti sei fermato qui')])}
{dettagli('Requisiti in dettaglio', """<ul>
<li>Un computer Linux a 64 bit (x86_64): Debian 13 o Ubuntu 24.04 e successive; Fedora attuale; Arch; oppure un'altra distribuzione con l'archivio.</li>
<li>La libreria di sistema glibc 2.39 o più recente. Per controllare, scrivi in un terminale <code>ldd --version | head -n 1</code>: il numero in fondo alla riga deve essere almeno 2.39.</li>
<li>PipeWire con pipewire-pulse. È l'impostazione normale dei desktop recenti di Fedora, Ubuntu, Debian, Arch e openSUSE.</li>
<li>Il programma curl. I pacchetti lo richiedono; con l'archivio può mancare.</li>
<li>Internet, una volta sola, per scaricare la voce (53 MB).</li>
</ul>""")}

<ol class="passi">
<li class="passo" id="passo-1">
<h2>Scegli e scarica il file</h2>
<p>Scegli la tua distribuzione. Con JavaScript la scelta tiene in vista solo i suoi comandi; senza, restano tutte le sezioni.</p>
<nav class="scelta-sistema" aria-label="Scegli la distribuzione">
<ul class="scelta-sistema__indice">
<li><a href="#debian-ubuntu">Debian e Ubuntu</a></li>
<li><a href="#fedora">Fedora</a></li>
<li><a href="#arch">Arch</a></li>
<li><a href="#altre">Altre distribuzioni</a></li>
<li><button type="button" class="btn btn--piccolo" data-sistema-tutte hidden>Mostra tutte</button></li>
</ul>
</nav>
<section class="sistema" id="debian-ubuntu" data-sistema="debian-ubuntu" aria-labelledby="t-debian">
<h3 id="t-debian">Debian 13, Ubuntu 24.04 e successive</h3>
<p><a class="btn btn--primario" href="{{{{kalliope.deb.url}}}}">Scarica il file .deb<span class="btn__nota">{{{{kalliope.deb.size}}}}</span></a></p>
<dl><dt>Nome del file</dt><dd><code>{{{{kalliope.deb.name}}}}</code></dd>
<dt>Cosa si guadagna</dt><dd>Si installa e si toglie con il gestore dei pacchetti.</dd>
<dt>Cosa costa</dt><dd>Chiede la password di amministratore.</dd></dl>
</section>
<section class="sistema" id="fedora" data-sistema="fedora" aria-labelledby="t-fedora">
<h3 id="t-fedora">Fedora</h3>
<p><a class="btn btn--primario" href="{{{{kalliope.rpm.url}}}}">Scarica il file .rpm<span class="btn__nota">{{{{kalliope.rpm.size}}}}</span></a></p>
<dl><dt>Nome del file</dt><dd><code>{{{{kalliope.rpm.name}}}}</code></dd>
<dt>Cosa si guadagna</dt><dd>Si installa e si toglie con dnf.</dd>
<dt>Cosa costa</dt><dd>Chiede la password di amministratore. Il pacchetto non è firmato: dnf mostra un avviso e lo accetta dopo l'avviso. È previsto per questa versione.</dd></dl>
</section>
<section class="sistema" id="arch" data-sistema="arch" aria-labelledby="t-arch">
<h3 id="t-arch">Arch Linux</h3>
<p><a class="btn btn--primario" href="{{{{kalliope.aur.url}}}}">Scarica la ricetta (PKGBUILD)</a></p>
<dl><dt>Nome del file</dt><dd><code>kalliope-bin.PKGBUILD</code></dd>
<dt>Cosa si guadagna</dt><dd>Non compila nulla: la ricetta scarica l'archivio della versione e lo impacchetta. Si toglie con pacman.</dd>
<dt>Cosa costa</dt><dd>Non è ancora pubblicata su AUR: si usa il file della versione. Il passo 3 la scarica da solo: questo pulsante serve a leggerla prima.</dd></dl>
</section>
<section class="sistema" id="altre" data-sistema="altre" aria-labelledby="t-altre">
<h3 id="t-altre">Altre distribuzioni (archivio)</h3>
<p><a class="btn btn--primario" href="{{{{kalliope.tar.url}}}}">Scarica l'archivio .tar.gz<span class="btn__nota">{{{{kalliope.tar.size}}}}</span></a></p>
<dl><dt>Nome del file</dt><dd><code>{{{{kalliope.tar.name}}}}</code></dd>
<dt>Cosa si guadagna</dt><dd>Non chiede la password di amministratore: copia i file in <code>~/.local</code>, solo per te.</dd>
<dt>Cosa costa</dt><dd>Per aggiornare scarichi la versione nuova e lanci di nuovo <code>./install</code>.</dd></dl>
</section>
{controllo('Nella cartella dei download c\'è un file con il nome indicato sopra, della dimensione indicata sul pulsante.')}
{se_non_va('Scarica di nuovo. Se il browser dice che il file non esiste, la versione può essere cambiata: riparti da questa pagina.')}
</li>

<li class="passo" id="passo-2">
<h2>Controlla il file (consigliato)</h2>
<p>Serve a essere sicuri che il file sia quello pubblicato. Apri un terminale nella cartella dove hai scaricato il file (di solito Scaricati o Downloads).</p>
<div data-sistema="debian-ubuntu">
<h3>Debian e Ubuntu</h3>
<p>Scrivi questo comando:</p>
{comando('sha256sum {{kalliope.deb.name}}')}
<p>Il numero che compare deve essere uguale a questo:</p>
{comando('{{kalliope.sha256.deb}}', 'Copia il numero')}
</div>
<div data-sistema="fedora">
<h3>Fedora</h3>
<p>Scrivi questo comando:</p>
{comando('sha256sum {{kalliope.rpm.name}}')}
<p>Il numero che compare deve essere uguale a questo:</p>
{comando('{{kalliope.sha256.rpm}}', 'Copia il numero')}
</div>
<div data-sistema="arch">
<h3>Arch Linux</h3>
<p>Il controllo lo fa la ricetta. Non c'è nulla da scrivere.</p>
</div>
<div data-sistema="altre">
<h3>Altre distribuzioni</h3>
<p>Scrivi questo comando:</p>
{comando('sha256sum {{kalliope.tar.name}}')}
<p>Il numero che compare deve essere uguale a questo:</p>
{comando('{{kalliope.sha256.tar}}', 'Copia il numero')}
</div>
<p>Per controllare tutti i file insieme c'è <a href="{{{{kalliope.sums.url}}}}">SHA256SUMS</a>.</p>
<p class="solo-rc1">Questa versione non ha l'attestazione di provenienza (<code>gh attestation verify</code>): fu pubblicata quando il repository era ancora privato. Le versioni successive l'avranno.</p>
{controllo('Il numero scritto dal terminale è identico a quello della pagina, cifra per cifra.')}
{se_non_va('Non installare il file. Scaricalo di nuovo e rifai il controllo. Se il numero resta diverso, <a href="' + P + 'aiuto/#segnala">segnalalo</a>.')}
</li>

<li class="passo" id="passo-3">
<h2>Installa</h2>
<p>Scrivi i comandi nella stessa cartella. Per i pacchetti il computer chiede la password di amministratore.</p>
<div data-sistema="debian-ubuntu">
<h3>Debian e Ubuntu</h3>
{comando('sudo apt install ./{{kalliope.deb.name}}')}
</div>
<div data-sistema="fedora">
<h3>Fedora</h3>
{comando('sudo dnf install ./{{kalliope.rpm.name}}')}
</div>
<div data-sistema="arch">
<h3>Arch Linux</h3>
<p>Crea una cartella vuota, scarica la ricetta e costruisci il pacchetto:</p>
{comando('mkdir kalliope && cd kalliope')}
{comando('curl -L -o PKGBUILD {{kalliope.aur.url}}')}
{comando('makepkg -si')}
</div>
<div data-sistema="altre">
<h3>Altre distribuzioni</h3>
{comando('tar -xzf {{kalliope.tar.name}}')}
{comando('cd {{kalliope.tar.dir}}')}
{comando('./install')}
</div>
{controllo('Scrivi <code>kalliope --version</code>: il terminale risponde con il numero della versione. Se usi l\'archivio e il comando non si trova, scrivi <code>~/.local/bin/kalliope --version</code>: <code>~/.local/bin</code> può non essere nel percorso dei comandi.')}
{se_non_va('Se il gestore dei pacchetti dice che mancano dipendenze, controlla la distribuzione: serve glibc 2.39 o più recente (vedi «Requisiti in dettaglio»). Se il problema resta, <a href="' + P + 'aiuto/#segnala">segnalalo</a> con il messaggio intero.')}
{dettagli('Per togliere Kalliope', """<p>Togli il programma:</p>
<ul>
<li>Debian e Ubuntu: <code>sudo apt remove kalliope</code></li>
<li>Fedora: <code>sudo dnf remove kalliope</code></li>
<li>Arch: <code>sudo pacman -R kalliope-bin</code></li>
<li>Archivio: dalla cartella dell'archivio, <code>./install --remove</code></li>
</ul>
<p>Le tue preferenze e la voce scaricata restano: stanno nella tua cartella personale, che i gestori dei pacchetti e <code>./install --remove</code> non toccano mai. Per toglierle, cancella le due cartelle:</p>
<ul>
<li><code>~/.config/kalliope</code> (le preferenze)</li>
<li><code>~/.local/share/kalliope</code> (la voce, 53 MB)</li>
</ul>""")}
</li>

<li class="passo" id="passo-4">
<h2>Apri Kalliope e scarica la voce</h2>
<p>Apri Kalliope dal menu delle applicazioni. La prima volta la finestra dice che deve scaricare la voce. Premi «Scarica la voce» e aspetta: sono 53 MB, una volta sola.</p>
<p>Poi, a ogni avvio, la finestra dice «Preparo la voce…» per un po'. Il campo di testo si accende quando ha finito.</p>
{controllo('La riga in alto dice: «Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.»')}
{se_non_va('Cerca la frase che vedi nella <a href="' + P + 'aiuto/">pagina Aiuto</a>: ogni frase della finestra ha la sua spiegazione.')}
</li>

<li class="passo" id="passo-5">
<h2>Controlla che «Kalliope» sia un microfono</h2>
<p>Kalliope crea un microfono che esiste solo dentro il computer. Per vederlo, scrivi:</p>
{comando('pactl list short sources')}
<p>Se il comando <code>pactl</code> non c'è, salta questo passo: lo vedrai comunque nella <a href="{P}riunione/">pagina successiva</a>.</p>
{controllo('Fra le righe ce n\'è una che contiene la parola <code>kalliope</code>. Kalliope deve essere aperto.')}
{se_non_va('Se non c\'è, la finestra lo dice: «La voce è pronta, ma …». Vai alla <a href="' + P + 'aiuto/#f-senza-microfono">spiegazione di questa frase</a>.')}
</li>
</ol>

<h2 id="ripresa">Se ti sei fermato qui</h2>
<p>Il sito non salva nulla: questa lista dice da dove riprendere.</p>
<ul>
<li>Non trovi il file: riparti dal <a href="#passo-1">passo 1</a>.</li>
<li>Il numero non coincide: <a href="#passo-2">passo 2</a>.</li>
<li><code>kalliope --version</code> non risponde: <a href="#passo-3">passo 3</a>.</li>
<li>La finestra non dice «Pronta»: <a href="#passo-4">passo 4</a> e la <a href="{P}aiuto/">pagina Aiuto</a>.</li>
<li>«Kalliope» non è tra i microfoni: <a href="#passo-5">passo 5</a> e la <a href="{P}aiuto/#f-senza-microfono">pagina Aiuto</a>.</li>
<li>Tutto a posto: vai a <a href="{P}riunione/">Usalo in una riunione</a>.</li>
</ul>
<div class="condividi">
<label for="indirizzo-installa">Indirizzo di questa pagina, da inoltrare a chi installerà</label>
<div class="condividi__riga">
<input id="indirizzo-installa" type="text" readonly value="{BASE_URL}installa/">
<button type="button" class="btn" data-copia data-testo-ok="Copiato." data-testo-no="Non riesco a copiare da solo: seleziona l'indirizzo e copialo.">Copia l'indirizzo</button>
<span class="comando__stato" role="status"></span>
</div>
</div>
{avanti(P, ('stato', 'Stato e limiti'), ('riunione', 'Usalo in una riunione'))}
</div>'''
    return pagina('installa', 'Installa Kalliope su Linux: cinque passi con comandi da copiare',
                  'Come installare Kalliope su Debian, Ubuntu, Fedora, Arch e altre distribuzioni Linux: comandi da copiare, controllo dopo ogni passo e cosa fare se non va.',
                  corpo, corrente='installa')


def riunione():
    P = '../'
    corpo = f'''<div class="pagina testo">
{percorso(P, 'riunione')}
<h1>Usalo in una riunione</h1>
<p>Kalliope è un microfono. Nell'app della riunione lo scegli come scegli un microfono vero. Qui ci sono i passi e i modi per controllare che ti sentano.</p>
<div class="avviso avviso--attenzione" role="note">
<p class="avviso__titolo">Non ancora provato in una riunione vera</p>
<p>La voce arriva fino al microfono «Kalliope». Con Zoom, Teams o Meet su un computer di tutti i giorni non l'abbiamo ancora provata. Prima di una riunione importante fai una prova con una persona di fiducia. <a href="{P}stato/#provato-per-app">Vedi la tabella app per app</a>.</p>
</div>
<ol class="passi">
<li class="passo" id="passo-1">
<h2>Apri Kalliope e aspetta «Pronta»</h2>
<p>Apri Kalliope prima di entrare nella riunione. Aspetta che la riga in alto dica «Pronta».</p>
{foto(P, 'La finestra di Kalliope: la riga di stato in alto, il campo dove scrivi con «Parla» e «Ferma», in basso la voce e «Senti anche tu».', piccola=True)}
{controllo('La riga dice: «Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.»')}
{se_non_va('Se dice «La voce è pronta, ma …» o un\'altra frase, <a href="' + P + 'aiuto/">cercala nella pagina Aiuto</a>.')}
</li>
<li class="passo" id="passo-2">
<h2>Scegli «Kalliope» come microfono</h2>
<p>Apri le impostazioni audio dell'app della riunione e scegli «Kalliope» fra i microfoni.</p>
<p>In Zoom: Impostazioni, Audio, Microfono, «Kalliope».</p>
<p>Per le altre app non descriviamo i menu: ognuna è diversa e non le abbiamo provate. Cerca le impostazioni audio. In un browser, scegli il microfono nella richiesta del browser o nella pagina della riunione.</p>
<p>Kalliope diventa il microfono predefinito del computer solo se è l'unico. Altrimenti scegli «Kalliope» in ogni app.</p>
{controllo('«Kalliope» compare nell\'elenco, accanto ai microfoni veri, e resta scelto.')}
{se_non_va('Se «Kalliope» non compare: Kalliope deve essere aperto prima. Poi chiudi e riapri l\'elenco dei microfoni dell\'app. Se non basta, <a href="' + P + 'aiuto/#non-compare">leggi la spiegazione</a>.')}
</li>
<li class="passo" id="passo-3">
<h2>Controlla che ti sentano</h2>
<p>Hai tre modi. Il primo è il più semplice, il terzo il più sicuro.</p>
<h3>1. La finestra ti avvisa</h3>
<p><strong>Cosa fare.</strong> Togli la spunta da «Senti anche tu». Scrivi una frase e premi Invio.</p>
<p><strong>Come sai che è andata.</strong> Se compare «Nessuna chiamata sta usando il microfono «Kalliope»…», nessuna app ti ascolta. Se non compare, una app ti ascolta.</p>
<p>Così dice il programma. Non l'abbiamo provato in una riunione vera.</p>
<h3>2. La barra dell'app</h3>
<p><strong>Cosa fare.</strong> Apri la prova del microfono dell'app, se ce l'ha. Scrivi una frase.</p>
<p><strong>Come sai che è andata.</strong> La barra del livello si muove mentre Kalliope parla.</p>
<h3>3. Una prova con una persona</h3>
<p><strong>Cosa fare.</strong> Prima di una riunione importante, entra in una chiamata con una persona di fiducia. Scrivi una frase.</p>
<p><strong>Come sai che è andata.</strong> La persona ti dice cosa sente.</p>
<div class="avviso" role="note">
<p>«Senti anche tu» fa sentire la voce anche sulle casse del tuo computer. Serve a te per sapere cosa esce. Non vuol dire che l'app della riunione la riceva.</p>
</div>
{se_non_va('Segui le frasi della finestra nella <a href="' + P + 'aiuto/">pagina Aiuto</a>. Se vuoi, <a href="' + P + 'aiuto/#segnala">dicci come è andata</a>.')}
{dettagli('Da terminale, senza la finestra', """<p>Con la finestra chiusa, <code>kalliope --say "prova"</code> fa dire «prova» al microfono «Kalliope». Non l'abbiamo provato con la finestra aperta nello stesso momento.</p>""")}
</li>
<li class="passo" id="passo-4">
<h2>Scrivi e parla</h2>
<p>Scrivi nel campo e premi Invio, o premi «Parla». «Ferma» interrompe subito il suono e svuota la coda. Se scrivi mentre Kalliope parla, il nuovo testo si mette in coda.</p>
<p>Le frasi già dette restano in un elenco, la più recente in alto. Un clic su una frase la ripete. L'elenco sparisce quando chiudi la finestra.</p>
<p>La finestra di Kalliope e quella della riunione sono due finestre. Kalliope non ha scorciatoie da tastiera che funzionino fuori dalla sua finestra: per scrivere devi passare a quella di Kalliope. Per chi scrive con un solo interruttore o con lo sguardo non abbiamo provato come funziona in una riunione.</p>
<p>Come per un microfono vero, le frasi dette mentre nessuna app registra vengono scartate. Così una riunione non comincia con parole vecchie.</p>
</li>
</ol>
{avanti(P, ('installa', 'Installa'), ('aiuto', 'Aiuto'))}
</div>'''
    return pagina('riunione', 'Usare Kalliope in una riunione: scegli il microfono e controlla che ti sentano',
                  'Come scegliere «Kalliope» come microfono nell\'app della riunione e come controllare che gli altri ti sentano, anche quando qualcosa non va.',
                  corpo, corrente='riunione')


def scheda(id_, frase, significa, cosa_fare, extra='', parole=''):
    ex = f'\n{extra}' if extra else ''
    pw = f' data-parole="{parole}"' if parole else ''
    return f'''<article class="scheda-frase" id="{id_}"{pw}>
<h3><q class="frase-finestra">{frase}</q></h3>
<dl>
<dt>Cosa significa</dt><dd>{significa}</dd>
<dt>Cosa fare</dt><dd>{cosa_fare}</dd>
</dl>{ex}
</article>'''


FRASI_AIUTO = []


def aiuto():
    P = '../'
    S = [
        ('f-scarica', 'Per parlare, Kalliope deve scaricare la voce: 53 MB, una volta sola. Poi funziona senza internet.',
         'È la prima volta: la voce non è ancora sul computer. Il campo di testo è spento.', 'Premi «Scarica la voce» e aspetta. Serve internet solo adesso.', '', 'primo avvio scaricare voce'),
        ('f-scarico', 'Scarico la voce… N di 53 MB',
         'Lo scarico è in corso. Al posto di N vedi i megabyte già scaricati.', 'Aspetta. Puoi premere «Annulla». Se si ferma, cerca la frase che compare dopo.', '', 'scarico in corso barra'),
        ('f-annullato', 'Download annullato.',
         'Hai premuto «Annulla», oppure lo scarico si è interrotto.', 'Premi di nuovo «Scarica la voce». Lo scarico riparte da capo.', '', 'annulla interrotto'),
        ('f-curl', 'Per scaricare la voce serve il programma curl: …',
         'Sul computer manca il programma curl, che Kalliope usa per scaricare la voce.',
         'Installa curl, poi premi di nuovo «Scarica la voce». Scrivi il comando della tua distribuzione.<p><strong>Debian e Ubuntu</strong></p>' + comando('sudo apt install curl') + '<p><strong>Fedora</strong></p>' + comando('sudo dnf install curl') + '<p><strong>Arch</strong></p>' + comando('sudo pacman -S curl'), '', 'curl manca programma'),
        ('f-non-riuscito', 'Download non riuscito: …',
         'La rete non ha risposto o il server ha rifiutato. Dopo i due punti c\'è la causa, spesso in inglese.',
         'Controlla la connessione e premi di nuovo «Scarica la voce».',
         dettagli('Se si ripete', '<p>Segnalalo con la frase intera, compresa la causa dopo i due punti. Vedi <a href="#segnala">come segnalare</a>.</p>'), 'rete errore scarico'),
        ('f-impronta', 'Il file … scaricato non corrisponde all\'impronta attesa: l\'ho scartato.',
         'Il file scaricato era incompleto o diverso da quello previsto. Kalliope lo ha scartato per sicurezza.',
         'Premi di nuovo «Scarica la voce». Se succede ancora, <a href="#segnala">segnalalo</a>. Non cercare di aggirare il controllo.', '', 'impronta sha file scartato'),
        ('f-preparo', 'Preparo la voce…',
         'La voce si sta caricando in memoria. Succede a ogni avvio. Il campo di testo resta spento.', 'Aspetta. Non abbiamo misurato quanto dura.', '', 'caricamento avvio'),
        ('f-pronta', 'Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.',
         'Tutto a posto: Kalliope può parlare.', 'Nell\'app della riunione scegli «Kalliope» come microfono. <a href="' + P + 'riunione/">I passi sono nella pagina In riunione</a>.', '', 'tutto bene'),
        ('f-senza-microfono', 'La voce è pronta, ma …: per ora nessuno ti sentirà nelle chiamate.',
         'La voce funziona, ma il microfono «Kalliope» non si è creato. Al posto dei puntini c\'è la causa, spesso in inglese.',
         'Se la causa dice <code>PipeWire is not running</code>, avvia PipeWire con questo comando:' + comando('systemctl --user start pipewire pipewire-pulse wireplumber') + '<p>Se dice <code>PipeWire is not available</code>, manca la libreria: installa <code>pipewire</code> e <code>pipewire-pulse</code>. Se il computer usa solo PulseAudio, il microfono di Kalliope oggi non è disponibile.</p>',
         dettagli('Dopo aver sistemato', '<p>Chiudi e riapri Kalliope. Non abbiamo provato se serva, ma è il modo più semplice per cominciare da capo.</p>'), 'pipewire microfono non disponibile non risponde'),
        ('f-parlo', 'Sto parlando…',
         'Kalliope sta dicendo la frase.', '«Ferma» interrompe subito e svuota la coda. Il testo che scrivi nel frattempo si mette in coda.', '', 'parla coda ferma'),
        ('f-nessuna-chiamata', 'Nessuna chiamata sta usando il microfono «Kalliope»: sceglilo come microfono nell\'app della riunione.',
         'Nessuna app sta registrando dal microfono «Kalliope», quindi gli altri non ti sentono. Il suono viene scartato, come per un microfono vero. La frase compare solo se «Senti anche tu» è spento.',
         'Nell\'app della riunione scegli «Kalliope» come microfono. Se lo hai già scelto, controlla che nell\'app il microfono non sia disattivato. Kalliope è il microfono predefinito del computer solo se è l\'unico: altrimenti va scelto in ogni app.', '', 'chiamata nessuno ascolta senti anche tu'),
        ('f-errori', 'Non riesco a preparare la voce: …',
         'Qualcosa non va nel programma o nei file della voce. Lo stesso vale per «Errore della voce: …» e «Non riesco a cambiare voce: …».',
         'Chiudi e riapri Kalliope. Se la frase ricompare, <a href="#segnala">segnalala</a> intera, compreso ciò che segue i due punti. Non abbiamo una soluzione provata per questi errori.', '', 'errore voce cambiare non riesco'),
    ]
    indice = '\n'.join(f'<li><a href="#{i}">«{f}»</a></li>' for i, f, *_ in S)
    schede = '\n'.join(scheda(*x) for x in S)
    corpo = f'''<div class="pagina testo">
{percorso(P, 'aiuto')}
<h1>Aiuto: cerca la frase che vedi</h1>
<p>La finestra di Kalliope dice sempre cosa sta succedendo. Qui trovi ogni frase con la sua spiegazione.</p>
<div class="filtro" data-filtro data-testo-una="1 frase" data-testo-piu="frasi" data-testo-nessuna="Nessuna frase trovata. Prova una parola sola, per esempio «pronta» o «scarico». Oppure guarda i tre casi qui sotto, o segnala il problema." data-testo-tutte="Tutte le frasi.">
<label for="cerca-frase">Scrivi una parte della frase</label>
<input id="cerca-frase" type="search" autocomplete="off" spellcheck="false">
<p class="filtro__stato" role="status"></p>
</div>
<section data-gruppo-frasi aria-labelledby="frasi-titolo">
<h2 id="frasi-titolo">Le frasi della finestra</h2>
<ul class="indice-frasi">
{indice}
</ul>
{schede}
</section>
<h2 id="mia-frase">La mia frase non c'è</h2>
<article class="scheda-frase" id="non-compare">
<h3>«Kalliope» non compare fra i microfoni dell'app</h3>
<dl>
<dt>Cosa fare</dt><dd>Kalliope deve essere aperto, con la riga «Pronta» in alto. Poi scrivi in un terminale <code>pactl list short sources</code>: deve esserci una riga con <code>kalliope</code>. Se non c'è, vedi la frase «La voce è pronta, ma …». Se c'è ma l'app non lo mostra, chiudi e riapri l'elenco dei microfoni dell'app; non abbiamo provato se serva riavviare l'app.</dd>
</dl>
</article>
<article class="scheda-frase" id="non-mi-sentono">
<h3>Gli altri non mi sentono</h3>
<dl>
<dt>Cosa fare</dt><dd>Segui i tre controlli della <a href="{P}riunione/#passo-3">pagina In riunione</a>. Ricorda che «Senti anche tu» fa sentire la voce a te, non all'app.</dd>
</dl>
</article>
<article class="scheda-frase" id="a-scatti">
<h3>La voce va a scatti nella riunione</h3>
<dl>
<dt>Cosa fare</dt><dd>Prova ad abbassare la soppressione del rumore nelle impostazioni audio dell'app. Non l'abbiamo provato: se ti aiuta, o se non cambia nulla, <a href="#segnala">dicci come è andata</a>.</dd>
</dl>
</article>
<h2 id="segnala">Segnala un problema, o dicci come è andata</h2>
<p>Non c'è un indirizzo e-mail. Le segnalazioni passano dalle issue di GitHub, che richiedono un account GitHub.</p>
<p><a class="btn btn--primario" href="{REPO}/issues/new">Apri una segnalazione su GitHub</a></p>
<p>Una segnalazione utile dice:</p>
<ul>
<li>quale app di riunione usi, e quale versione;</li>
<li>la tua distribuzione Linux e la sua versione (<code>cat /etc/os-release</code>);</li>
<li>la versione di PipeWire (<code>pipewire --version</code>) e quella di Kalliope (<code>kalliope --version</code>);</li>
<li>la frase che la finestra di Kalliope mostrava, intera;</li>
<li>che cosa hai fatto, e che cosa è successo.</li>
</ul>
<div class="avviso avviso--attenzione" role="note">
<p class="avviso__titolo">Non incollare le frasi che hai detto</p>
<p>Sono private. Per una segnalazione bastano la frase della finestra e i passi che hai fatto.</p>
</div>
{avanti(P, ('riunione', 'Usalo in una riunione'), None)}
</div>'''
    return pagina('aiuto', 'Aiuto di Kalliope: cerca la frase che vedi nella finestra',
                  'Ogni frase che la finestra di Kalliope mostra, con cosa significa e cosa fare. Come scegliere il microfono, cosa controllare e come segnalare un problema.',
                  corpo, corrente='aiuto')


def non_ancora():
    P = '../'
    corpo = f'''<div class="pagina testo">
<span class="barre" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
<h1>Windows, macOS e telefono: non ancora</h1>
<p>Oggi Kalliope funziona solo su Linux, su computer a 64 bit con PipeWire. Se usi Windows, macOS o un telefono, per ora non puoi usarlo. Ti diciamo perché.</p>
{stato_card(True, P, 2)}
<h2>Perché non su Windows</h2>
<p>Kalliope parla in un microfono che esiste solo dentro il computer. Su Windows, per creare un microfono così serve un driver audio con una firma valida. Quel driver non c'è ancora.</p>
<h2>Perché non su macOS</h2>
<p>Su macOS serve un componente audio approvato da Apple. Anche questo non c'è ancora.</p>
<h2>Cosa c'è già</h2>
<ul>
<li>Il programma si costruisce e supera i test anche su Windows e macOS.</li>
<li>Manca il microfono: senza, nessuna app di riunione sente la voce.</li>
<li>Mancano anche i pacchetti da installare, uno per sistema, e la loro firma.</li>
</ul>
<h2>Telefono, tablet, altre lingue</h2>
<p>Kalliope non esiste per telefoni e tablet. Parla solo italiano.</p>
<h2>Come seguire le novità</h2>
<p>Non promettiamo date. Per sapere quando arriva una nuova versione puoi seguire le pubblicazioni su GitHub, senza account, con un lettore di feed: <a href="{REPO}/releases.atom">le versioni di Kalliope (feed)</a>. Oppure guarda la <a href="{REPO}/releases">pagina delle versioni</a>.</p>
<p>Non raccogliamo indirizzi e-mail e non abbiamo un elenco d'attesa.</p>
<h2>E nel frattempo?</h2>
<p>Non consigliamo altri prodotti: non li abbiamo provati. Se una persona vicina a te ha un computer Linux, Kalliope può essere installato lì: <a href="{P}installa/">leggi la pagina Installa</a>.</p>
<p><a class="collegamento-forte" href="{P}stato/">Leggi tutto lo stato e i limiti</a></p>
</div>'''
    return pagina('non-ancora', 'Kalliope per Windows e macOS: non ancora, e perché',
                  'Oggi Kalliope funziona solo su Linux. Perché non ancora su Windows, macOS e telefono, cosa manca e come seguire le novità senza lasciare dati.',
                  corpo)


def p404():
    corpo = '''<div class="pagina testo">
<span class="barre" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
<h1>Questa pagina non c'è</h1>
<p>L'indirizzo è sbagliato, oppure la pagina è stata spostata. Non è colpa tua.</p>
<p>Puoi andare a una di queste pagine:</p>
<ul>
<li><a href="./">La pagina iniziale</a></li>
<li><a href="ascolta/">Ascolta la voce</a></li>
<li><a href="stato/">Stato e limiti</a></li>
<li><a href="installa/">Installa su Linux</a></li>
<li><a href="riunione/">Usalo in una riunione</a></li>
<li><a href="aiuto/">Aiuto</a></li>
</ul>
</div>'''
    return pagina('404', 'Pagina non trovata: Kalliope',
                  'La pagina cercata non esiste o è stata spostata. Da qui si torna alla pagina iniziale e alle pagine principali di Kalliope.',
                  corpo, profondita=0, intestazione_minima=True, base_tag=True)
