# Registro dei difetti mentre si guarda (poi ordinato in design/revisione-visiva.md)

Foto in design/prove-percorso/revisione/<motore>-<misura>/NNN-gesto.jpg. Anteprima: /tmp/kalliope-rev costruita 12/11 21:42.

LIMITE DI PROVA (non è un difetto del sito): in Chromium senza finestra l'audio scorre a velocità enorme (play: 0 -> 9,29 s in pochi ms, prova u04); lo stato dell'interfaccia durante il suono è stato visto con un orologio simulato (/tmp/rev-lavoro/orologio.js, come in design/strumenti/prova-ascolto.mjs). Non ho ascoltato nulla: tempi e voce reali non verificati.

## Chromium 1440x900
- [C1] home, arrivo (chromium-1440/001-vai.jpg): ok la gerarchia; la foto della finestra mostra testo a ~11 px illeggibile e 2/3 dell'immagine vuoti (già dichiarato dal costruttore, minore).
- [C2] home, fondo (004-scorri): «Avanti: Ascolta la voce» ripete il comando principale e la sezione appena letta; dopo «Cosa serve» nessun invito a Installa. Importante (compito).
- [C3] /ascolta/ (011, 012, 016): in ogni riquadro-frase c'è una fascia vuota di ~60 px sopra il titolo «Frase N di 3». Si legge come qualcosa che manca. Importante (composizione).
- [C4] /ascolta/ frase 3 (012): «Giulia · 6,0 secondi» ma la posizione dice «0:00 / 0:05»; Marco 6,4 / 0:06. Due numeri diversi per la stessa durata. Minore ma per chi legge con fatica è un'incoerenza. Inoltre in frase 3 la posizione sta accanto alle barre, nelle frasi 1-2 sotto: layout diverso fra riquadri uguali.
- [C5] piede (004, 013, 026): nella terza colonna le voci a capo hanno distanze diverse (44 px poi 35 px). Minore.
- [C6] /stato/ (020-026): pagina di 5937 px con sei sezioni di scopo diverso; tabelle a 14 px; 5 colonne di paragrafi. «Non ancora provato» (cartellino) contro «Non provato» (tabella): due parole per lo stesso stato. Minore.
- [C7] /installa/ (027-037, 9348 px): «Scegli la distribuzione» sono quattro chip che portano a un'àncora (039-clic.jpg: la carta Fedora prende un bordo verde, nient'altro). I passi 2 e 3 ripetono comunque i tre-quattro blocchi (Debian, Fedora, Arch, Altre): chi sceglie Fedora scorre ~2000 px di altre distribuzioni. Il primo gesto (scaricare) sta a ~1700 px dall'inizio: sotto la piega, dopo cinque requisiti. Importante (compito F2/F4).
- [C8] /installa/ passo 2 (031): «Deve scrivere questo numero:» è terza persona, il resto è «tu» (RG8). «Numero» per un'impronta SHA-256 di 64 caratteri, senza «Copia». Minore.
- [C9] /installa/ fondo (036): il campo «Indirizzo di questa pagina» è largo ~480 px e taglia l'indirizzo a «…/kalliope/insta». Minore.
- [C10] /installa/ passo 3 Arch (034): la ricetta si scarica due volte (bottone al passo 1, `curl -L -o PKGBUILD` al passo 3). Minore (ambiguità).
- [C11] /riunione/ (042-047): la pagina finisce con la foto della finestra, 640x500 con ~2/3 vuoti, alta una schermata intera (046). Minore. Passo 3 «La finestra ti avvisa»: un solo paragrafo di sei righe e ~65 parole con una frase tra virgolette dentro: oltre RG8 (15-20 parole) per chi legge con fatica. Importante per afasia.
- [C12] /aiuto/ stato «nessun risultato» (062-scrivi.jpg): il messaggio dice «Leggi l'elenco qui sotto» ma l'elenco è vuoto, restano due titoli orfani («Le frasi della finestra», «La mia frase non c'è») e le tre carte di ripiego sotto «La mia frase non c'è» sono nascoste dal filtro (DOM: ARTICLE.scheda-frase hidden=true). L'unico recupero rimasto è il pulsante GitHub, che richiede un account. Contraddice D09. Importante (ostacolo al compito nel momento di bisogno).
- [C13] /aiuto/ con filtro «pronta» (060): stato «4 frasi» ma l'indice ne mostra 3 (la quarta è una carta di ripiego). Minore.
- [C14] /aiuto/ (051): i comandi di installazione di curl stanno dentro una frase («Debian e Ubuntu: sudo apt install curl. Fedora: …») senza blocco né «Copia», a differenza di Installa; il comando va a capo a metà. Minore.
- [C15] /installa/ e /aiuto/: la colonna di testo è 790 px su 1440: un terzo vuoto (conferma l'autovalutazione, non nuovo).
