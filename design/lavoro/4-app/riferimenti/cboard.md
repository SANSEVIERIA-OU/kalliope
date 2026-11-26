# Cboard (web app a codice aperto)

Legenda: **[O]** osservato in foto o video salvati · **[M]** misurato (`valori.js`, `movimento-visibile.mjs`, hook su `speechSynthesis`) · **[L]** letto · **[I]** interpretazione.

## 1. Scheda
- Cboard, tavole di comunicazione con simboli. Indirizzo: https://app.cboard.io/ (26/11/2026, ~17:05-17:20 UTC). **Usato davvero con mouse e tastiera** nel Chrome della skill, 1440×813 a densità 1, senza account («SKIP FOR NOW»).
- Percorso: schermata di benvenuto → tour («Welcome to Cboard!», «Close Tour») → tavola «Cboard Classic Home» → tocco su «yes» e «no» → clic sulla barra di uscita → cartella «quick chat» → Impostazioni (da indirizzo, vedi sotto) → Speech → Display → dimensione del carattere → tema scuro → Tab sulla tastiera.
- Misure: `valori/cboard-board-desktop.json`, `valori/cboard-impostazioni-desktop.json`; movimento in `video/cboard-*-mv/`.
- **Limiti:** (a) non si è riusciti a «sbloccare» con i tre clic (il conteggio dei clic dello strumento è più lento di quello che la pagina tollera; la pagina ripartiva da «3 clicks to unlock»: `foto/cboard-04-unlock.png`, `foto/cboard-05-unlocked.png`); le impostazioni si sono raggiunte dall'indirizzo /settings. (b) Il tema scuro dopo «SAVE» **non risulta applicato** al ritorno sulla tavola (`foto/cboard-12-tema-scuro.png`): il tasto ha ricaricato la pagina e il risultato resta non chiaro; non si dichiara se il tema scuro funzioni. (c) Nessuna tavola con campo di testo libero è stata aperta; **non si afferma che non esista**. (d) Voce di sistema «Google US English» del Chrome; l'audio non è stato ascoltato.

## 2. Premio
Nessuno (ricerca 26/11). Motivazione: non applicabile.

## 3. Chi lo usa
[L] «open-source app for children and adults with speech and language impairments». Simboli (Mulberry, ARASAAC con schema colori Fitzgerald) [O, tour]. Chi non scrive ancora o usa simboli. Meno vicino al compito di Kalliope (scrittura), ma è l'unico riferimento usabile dal vivo con mouse e tastiera.

## 4. Il percorso, passo per passo
1. [O] `foto/cboard-01-primo.png`: schermata di ingresso a gradiente viola-blu (`#3010ff` → `#8b5cff`, stima visiva) con il logo, pulsanti LOGIN / SIGN UP / Google / Facebook / Apple e, più piccolo e senza riquadro, «SKIP FOR NOW».
2. [O] `foto/cboard-02-board.png`: la tavola è dietro un **velo grigio** con una finestra di benvenuto («Choose a board to start»: «Cboard Classic Home» e «Universal Core 11x6», «Close Tour», «Next (Step 1 of 2)» viola).
3. [O] `foto/cboard-03-yes.png`: dopo «Close Tour» e un tocco su «yes» **la tessera compare nella barra bianca in alto** con la sua etichetta, e la tessera premuta prende **un bordo nero spesso** (circa 3 px, stima visiva).
4. [M] **Il tocco dice subito**: `speechSynthesis.speak` chiamato con il testo «no» (rate 1, pitch 1, volume 1, voce «Google US English», lang en-US) nello stesso istante del clic (`video/cboard-tile-speak.mp4`). Il cambiamento visibile è **un fotogramma solo, a 0,28 s: un cambio istantaneo**, sull'1% dello schermo (rettangolo 465×358, `video/cboard-tile-speak-mv/misure.json`).
5. [M] **Clic sulla barra di uscita**: viene chiamato `speak("   yes no")`, cioè **tutta la frase**; nello screencast (5 fotogrammi in 3,77 s, `video/cboard-output-speak-mv/misure.json`) lo schermo cambia solo in un tratto di 169 ms all'inizio (il rettangolo della barra, 13% dello schermo, già in corso all'avvio della registrazione) e poi non cambia più per tutta la frase: **nessuna evidenziazione che segua la voce** è stata vista.
6. [O] **La frase rimane**: dopo aver cambiato pagina e ricaricato, la barra mostrava ancora «yes no» (`foto/cboard-04-unlock.png` e `foto/cboard-09-quickchat.png`, `foto/cboard-12-tema-scuro.png`).
7. [O] `foto/cboard-09-quickchat.png`: la cartella «quick chat» è una tavola di tessere gialle con frasi («hello», «goodbye», «good», «bad», «I can't speak», «thank you», «please»). [M] Cambio di vista: **383 ms visibili**, 64% dello schermo cambia, **92% dei punti salta di colpo** (nessuna dissolvenza), nove decimi entro 217 ms (`video/cboard-folder-open-mv/misure.json`).
8. [O] Impostazioni (`foto/cboard-06-settings.png`): **«Welcome to the settings!»** (un altro tour), elenco in schede bianche su grigio `#f1f1f1`, barra superiore indaco `#3f51b5`: People (Guest, Subscribe), Language (Language, Speech), System (Export, Import, Symbols, **Display**, Scanning, Navigation and Buttons), Help (User Help, About, Donate, Feedback).
9. [O] **Speech** (`foto/cboard-07-speech.png`): **Voice** («Google US English»), **Pitch** e **Rate** con cursore rosa, **ElevenLabs** con campo «Enter your ElevenLabs API key» (`sk-…`) e occhio.
10. [O] **Display** (`foto/cboard-08-display.png`, `foto/cboard-11-fontsize-menu.png`): UI Size (Standard), Font family (Montserrat), **Font Size: Standard / Large / Extra Large** (tre gradini), «Hide the output bar», «Increase the size of action buttons on the output bar», «Label Position», «Enable dark theme». **Le modifiche si applicano solo con «SAVE» in alto a destra.**
11. [O] **Tema scuro**: l'interruttore scorre in 167 ms (4 fotogrammi); «SAVE» **ricarica l'intera pagina** (pagina vuota per un fotogramma) (`video/cboard-tema-scuro-mv/misure.json`: 83 ms visibili, 89% «coperto o spostato»).
12. [M] **Tastiera**: `Tab` passa in ordine da «Backspace» a «Clear» (pulsanti da 64×64 px), poi la barra di navigazione, poi le tessere; [O] il segno del fuoco è un **contorno sottile grigio-ardesia** sulla tessera (`foto/cboard-10-tab-focus.png`, tessera «body»); [O] la tessera «yes» **ha un bordo nero spesso fisso**. **Incoerenza dichiarata:** una lettura del DOM dopo il Tab dava `activeElement` «yes» mentre la foto mostra il contorno su «body»: non si conclude quale fosse davvero il fuoco.

## 5. Come guida la persona
- Una cosa per schermata (la tavola), ma 30 tessere visibili subito [O].
- Come sa dove si trova: titolo della tavola nella barra nera («CBOARD CLASSIC HOME», «QUICK CHAT»), freccia indietro che si accende solo dentro una cartella [O: `foto/cboard-09-quickchat.png` freccia bianca; `foto/cboard-03-yes.png` grigia].
- Spiega: tour a passi («Step 1 of 2») sul primo accesso e di nuovo sulle impostazioni [O].
- **Protezione delle impostazioni:** «3 clicks to unlock» con un messaggio in basso che conta («3 clicks», «2 clicks») [O]; [M] **non protegge**: l'indirizzo /settings le apre.
- Se sbaglia: «Backspace» e «Clear» nella barra, 64×64 px [M].

## 6. L'interfaccia al servizio del compito (misurato)
- Colore tavola [M `valori/cboard-board-desktop.json`]: fondo `#bbdefb` 64,6% (cartelle azzurre), `#ffffff` 20,8% (barra di uscita), `#fff176` 8,3% (tessere gialle), `#222222` 6,3% (barra nera); testo `#000000` 83%, `#ffffff` 17%. Il **colore è il codice del tipo di tessera** (giallo = frase da dire, azzurro = cartella, simboli ARASAAC con schema Fitzgerald).
- Colore impostazioni [M]: `#f1f1f1` 59%, `#ffffff` 34%, indaco `#3f51b5` 6%, testo nero all'87% e al 54%. Cursori rosa (`#f50057`, stima visiva).
- Tipografia [M]: **Montserrat** 100%; tavola 700/400 a 14 e 16 px (maiuscole 17%, spaziatura 0,56 px); impostazioni 400/500 a 12, 14, 18 px.
- Forme [M]: pulsante di testo raggio 4 px, altezza 33 px; tessere con angolo arrotondato ~12 px e ombra (stima visiva); cartelle con la linguetta [O].
- Movimento [M]: transizioni CSS di 150 ms (`cubic-bezier(.4,0,.2,1)`, colore/posizione/opacità), 200 ms (riempimento), 225-300 ms (ombra), 200 ms ease (altezza).
- Dimensione [M]: tessere da 226×204 px su 1440 px (circa 16% della larghezza), 6 per riga; barra di uscita alta circa 112 px [O, dalla foto].

## 7. Cosa insegna e cosa non prendere
- Chi deve parlare in una riunione potrebbe ricavarne: **la barra di uscita che tiene la frase anche dopo il ricaricamento**; **tre gradini di dimensione del carattere (Standard / Large / Extra Large)** invece di un cursore; **«Hide the output bar»**.
- Non prendere: **SAVE che ricarica la pagina** (tema o dimensione devono cambiare subito), **la finta protezione a tre clic**, **i tour modali a ogni schermata**, il velo grigio alla prima apertura, la mancanza di segno del fuoco evidente per le tessere.

## 8. Pubblico, livelli
Chi usa simboli; logopedisti e caregiver che configurano; l'app si apre anche senza account [O]. Accessi: tocco, scansione («Scanning» nelle impostazioni, non aperto).

## 9. Esperienza e sensazioni
Primi cinque secondi: un gradiente viola, cinque pulsanti di accesso, poi una finestra di tour; la tavola vera si vede al terzo gesto. Il controllo è dell'app (tour, finestra). Tre aggettivi: colorata, densa, da scuola. Tono: etichette in minuscolo, parole semplici («yes», «no», «quick chat»). Non piace a chi vuole un'interfaccia sobria.

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| risposta | barra bianca che accumula le tessere | in alto, sempre | tiene la frase | chiara | `foto/cboard-03-yes.png` |
| gesto | il tocco di una tessera la dice subito | tavola | rapidità | immediata | [M] hook |
| gesto | clic sulla barra dice tutta la frase | barra | ripete | semplice | [M] hook |
| colore | giallo = frase, azzurro = cartella | tavola | riconoscere il tipo | codice | `foto/cboard-02-board.png` |
| navigazione | titolo + freccia indietro in barra nera | sotto la barra di uscita | dove sei | stabile | `foto/cboard-09-quickchat.png` |
| risposta | messaggio in basso «3 clicks to unlock» | impostazioni | dice quanti clic mancano | scomodo | `foto/cboard-04-unlock.png` |
| dimensioni | font Standard/Large/Extra Large | Display | testo più grande | grossolano | `foto/cboard-11-fontsize-menu.png` |
| risposta | «SAVE» che ricarica | Display | applica | lento | `video/cboard-tema-scuro-mv/tratto-2.jpg` |
| movimento | cartella aperta: sostituzione a taglio | tavola | cambia vista | brusca | `video/cboard-folder-open-mv/tratto-1.jpg` |
| aiuto | tour a passi | primo accesso | spiega | invadente | `foto/cboard-02-board.png` |

## 11. Cosa serve al sistema
Cronologia/uscita persistente dopo il riavvio; stati di fuoco visibili (qui debole); dimensione del carattere: gradini; cambio di tema senza ricarica (qui **assente**). Misure per il catalogo: 150 ms (colore), 167 ms (interruttore), 383 ms visibili (cambio di vista, a taglio).

## 12. Video, suono
Nessun video proprio. Suono: voce sintetica del browser (non registrata). La voce parte nello stesso istante del clic [M].

## 13. Inventario del motion design

| ID | Effetto | Trigger | Proprietà / valori | Tempo [M] | Ciclo di vita | Prova |
|---|---|---|---|---|---|---|
| C1 | tessera premuta: bordo nero 3 px e comparsa nella barra | clic su tessera | contorno, voce nella barra | 1 fotogramma, cambio istantaneo (1% dello schermo) | resta fino al clic successivo [O] | `video/cboard-tile-speak-mv/tratto-1.jpg` |
| C2 | cambio di tavola (cartella aperta) | clic su cartella | sostituzione quasi a taglio (92% dei punti salta) | 383 ms visibili; metà del cambiamento a 0 ms; nove decimi entro 217 ms | nessuna uscita separata [O]; **ritorno e interruzione non provati** | `video/cboard-folder-open-mv/tratto-1.jpg` |
| C3 | interruttore del tema | clic | scorrimento del pomello | 167 ms (4 fotogrammi) | — | `video/cboard-tema-scuro-mv/tratto-1.jpg` |
| C4 | «SAVE» applica | clic | ricarica della pagina | 83 ms visibili (89% coperto) | — | `video/cboard-tema-scuro-mv/tratto-2.jpg` |
| C5 | transizioni CSS dichiarate | hover/focus | 150 ms `cubic-bezier(.4,0,.2,1)` su colore, posizione, opacità; 300 ms ombra | — | — | `valori/cboard-impostazioni-desktop.json` |
| C6 | messaggio «N clicks to unlock» | clic su lucchetto | comparsa in basso | non misurato | scompare da solo [O] | `foto/cboard-04-unlock.png` |
Varianti: movimento ridotto, tocco, telefono: **non provati**. Evidenziazione della voce che avanza: **assente** nel gesto provato (barra) — non si afferma assenza in altre tavole.

## 14. Le 21 dimensioni
impaginazione, colore, forme, dimensioni, tipografia, immagini (simboli), movimento, risposta, avanzamento (tour a passi), dati (frase persistente), aiuto (tour), accessibilita (tastiera, ingrandimento a 3 gradini), prestazioni (la tavola si apre in pochi fotogrammi): osservate. Suono: non registrato. Fiducia (nessun account, «Privacy Policy»): osservata. Persone: osservata. Parole: osservate. tecnologie: web, `speechSynthesis` [M].

## 15. Peculiarità
- **Si usa subito senza account** («SKIP FOR NOW»).
- **Ogni tessera dice la sua parola al tocco; la barra bianca mette insieme la frase e la dice con un solo clic.**
- **Colore come codice del tipo di tessera** (schema Fitzgerald).
- **Campo per la chiave ElevenLabs** nelle impostazioni di voce (la voce clonata si prende da un servizio esterno).
- Lucchetto «3 clicks to unlock».
