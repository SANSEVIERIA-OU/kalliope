# Confronto dei riferimenti per la finestra dell'applicazione di Kalliope

Data: 26/11/2026. Questo file segue `references/confronto.md` del metodo: **intersezione** (ciò che è identico in tutti) e **unione** (tutto ciò che si è osservato, con varianti e peculiarità), con i denominatori. **Non contiene medie, mediane né tendenze.** Non decide niente: non disegna.
Dati eseguibili: `osservazioni.json` (24 caratteristiche × 11 riferimenti; controllato con `confronta-riferimenti.mjs --controlla`: «Formato pulito») e `confronto.json` (uscita dello strumento, con le prove di ogni variante). Generatore: `strumenti/osservazioni.py`. Schede: una per riferimento, nella stessa cartella.
Etichette: **[O]** osservato · **[M]** misurato · **[L]** letto nel testo ufficiale · **[I]** interpretazione.

## 1. Il campione e come è stato guardato

Denominatore: **11 riferimenti** = 8 della lista dell'incarico (uno, Apple, vale per due funzioni: Live Speech e Personal Voice; i flussi di voce sono due: ElevenLabs e Acapela) + i 2 termini di paragone del proprietario + Speechify. Non è un campione di vincitori di premi: è un campione **scelto per compito** (scrivere e parlare; creare la propria voce), nel quale i premi sono pochi (Vocable: Webby 2021; Speechify: ADA 2025). Ogni conclusione vale solo per questi 11.

| Riferimento | Come l'ho guardato | Interattivo | Movimento osservato | Misure dal DOM |
|---|---|---|---|---|
| Proloquo4Text | pagina + video 44 s (interfaccia del 2013) + 14 schermate dello store (iPad, iPhone, **Mac**), v5.7.1 | no | solo il video del 2013 | no |
| Predictable | pagina + 10 schermate iPad/iPhone, v8.0.4 + video «Predictable 8 in 5 minutes» (4:09, playlist ufficiale; il video della ricerca è «removed by the uploader») | no | video di dimostrazione a tagli, **non misurato** | no |
| Apple Live Speech / Personal Voice | pagine di supporto 105018 e 104993 + 3 immagini ufficiali (iPhone, 2023) | no | **nessuno** | no |
| Vocable | pagina + 4 immagini + 2 video Vimeo (102 s e 46 s) | no | nei video, non misurato | no |
| **Cboard** | **web app usata con mouse e tastiera** | **sì** | tre gesti misurati (tocco, cartella, interruttore del tema) | **sì** (2 stati) |
| Grid 3 | 2 pagine + 4 immagini | no | **nessuno** | no |
| ElevenLabs IVC | documentazione + 2 immagini | no | **nessuno** | no |
| Acapela My Own Voice | FAQ + 6 schermate del registratore (2018) | no | **nessuno** | no |
| Speechify | pagina Mac + 1 immagine della finestra | no | **nessuno** | no |
| **Sito di Kalliope** | home (e `/it/riunione/`) dal vivo, tema scuro e «chiaro» | sì (pagina) | demo della home misurata | **sì** (3 stati) |
| Kalipso | foto locali di prova | no | **nessuno** | no (palette stimata) |

**Limite grosso, da dire per primo:** nove su undici **non sono l'app in uso**: sono schermate e filmati ufficiali di marketing (otto) o foto di prova (Kalipso). Di tutto ciò che è *movimento* (dissolvenze, uscite, il modo in cui avanza l'evidenziazione) ho prove solo da Cboard e dal sito di Kalliope. Un video della ricerca (Predictable) non esiste più; ne ho guardato un altro ufficiale, a tagli e non misurabile. Il suono non è stato registrato.

## 2. L'intersezione: ciò che è identico in tutti gli 11

**Una sola caratteristica**, e banale:

| Caratteristica | Ambito | Valore | Denominatore | Prove |
|---|---|---|---|---|
| classe di carattere del testo dell'interfaccia | tipografia | **sans-serif senza grazie** | **11/11** | misurata con `valori.js` in Cboard (Montserrat) e nel sito di Kalliope (Lexend); **classificata a vista** negli altri nove (`osservazioni.json`). Nel registratore di Acapela il logo ha le grazie, il testo no. |

**Tutto il resto non è identico in tutti.** Le caratteristiche funzionali (tasto di voce, evidenziazione, pausa, cronologia, frasi salvate, tema, dimensione del testo, scelta della voce) hanno copertura **da 2 a 9 riferimenti su 11** perché gli altri non hanno quel compito (per esempio i flussi di voce non scrivono) o perché non l'ho visto; nessuna ha un valore unico. L'intersezione degli aspetti concreti (colore, forma, tempo) è **vuota**: nessun colore, nessuna misura, nessuna durata è uguale in tutti.
Nota sulla base estetica: lo strumento dà «2 colori in tutti i riferimenti» per `#f2f5f4` e `#222222` sui **due riferimenti misurati** (`base-misurata.json`), ma è un effetto della soglia di 0,035 in OKLab che unisce **grigi quasi uguali di ruolo diverso** (`#f1f1f1` fondo delle impostazioni di Cboard, 59%, con `#f2f5f4` testo del sito, 71%; `#222222` barra nera di Cboard, 6%, con la grafite `#1b2223` del sito). Non sono lo stesso colore. Con le palette stimate aggiunte (`base-con-stime.json`, 7 riferimenti) lo strumento dà `#f2f5f4` «in 6» per lo stesso motivo: **da non usare come identità**.

## 3. L'unione: meccanismi con varianti (ogni riga con il suo denominatore)

Notazione: presenti / assenti / non osservati su 11. «Non osservato» include «non pertinente» (il motivo è in `osservazioni.json`).

### 3.1 Scrivere e parlare

**Area di scrittura che domina la finestra.** 4 presenti con valori diversi, 0 assenti, 7 non osservati.
- Domina [I, stima visiva]: **Proloquo4Text, versione Mac**, colonna centrale circa 69% della larghezza della finestra, tre colonne (sinistra: conversazioni/cronologia; destra: frasi pronte) — `fonti/p4t-mac/sheet-1-4.png`.
- Non domina: **Predictable** su iPad (la tastiera a schermo prende circa metà dell'altezza), **Grid 3** (circa 40% dell'altezza), **sito di Kalliope** (nella demo il campo è una riga).
- Contesto: la tastiera a schermo costringe a un campo piccolo; su un computer con tastiera fisica, come per Kalliope, solo Proloquo4Text per Mac mostra la soluzione.

**Tasto dedicato per dire la frase.** 6 presenti, 1 assente (Cboard), 4 non pertinenti.
- Tondo, blu, sotto il testo, al centro: Proloquo4Text.
- Quadrato in una colonna a destra del testo: Predictable (giallo su chiaro; tondo con anello ciano su scuro), Vocable (ciano, in basso a destra della tastiera).
- Il tasto Invio della tastiera, rinominato «send» e spento mentre parla: Apple (iPhone). [L] Sul Mac: «Speak» **oppure Invio**.
- Icona con etichetta sotto, accanto a «Clear», «Fix», «Undo»: Grid 3.
- «Parla» e «Ferma» come pulsanti rettangolari + **Invio**: sito di Kalliope (finestra 0.1 ricostruita).
- Assente: Cboard (si parla toccando le tessere; un clic sulla barra dice tutta la frase).
- Nessun riferimento mostra Invio come **l'unico** gesto di voce senza un tasto: l'Invio che parla è documentato [L] per Apple Mac e [O] nella demo del sito.

**Evidenziazione di ciò che si sta dicendo.** 3 presenti, 1 assente (Cboard, [M]), 7 non osservati.
- Parola con **sfondo verde acceso** (schermo intero, testo nero grande), con pausa, indietro, volume: Proloquo4Text, `fonti/p4t/sheet-ipad-5-7.png`.
- **Parte già detta piena, parte da dire attenuata** nello stesso campo di scrittura, con la **pausa rossa tonda accanto**: Apple Live Speech, `fonti/apple/sheet-livespeech.png` (immagine ferma).
- **Parole che si scuriscono una dopo l'altra** nella bolla bianca (dette `#171d1d`, da dire grigio chiaro): sito di Kalliope, **17 parole in 6085 ms visibili** (circa 0,36 s a parola, [I]), con metà del cambiamento a 3732 ms, `video/kalliope-demo-home-mv/tratto-4.jpg`. È lo stesso meccanismo di Apple (dette in evidenza, da dire tenui), con valori diversi.
- Verso opposto, **contesto diverso**: Kalipso attenua ciò che è **già letto** e lascia piena la parte **da leggere**: chi legge è la persona, non la voce (`fonti/kalipso/sheet-1.png`). La direzione dell'attenuazione dipende da chi parla.
- Assente (misurato): Cboard, dove il clic sulla barra non cambia lo schermo per tutta la frase (5 fotogrammi in 3,77 s).

**Pausa o arresto della voce.** 3 presenti, 0 assenti, 8 non osservati: «pausa» blu in schermo intero (Proloquo4Text), tondo rosso accanto alla frase (Apple), «Ferma» che si accende mentre parla (sito di Kalliope). [L] Proloquo4Text permette di dire **tutto insieme, una frase alla volta o un paragrafo alla volta, con arresto dopo ciascuno** e «Play» per la parte seguente, e un «Speech Indicator» di cui si regolano quando appare, colore e parte evidenziata (parola o frase) (`proloquo4text.md`, sezione 4 bis). L'interruzione vera non è stata provata in nessuno.

**Cronologia delle frasi già dette.** 3 presenti, 0 assenti, 8 non osservati.
- Colonna a sinistra, «Last 15 minutes», un menu a tendina che la scambia con «Conversations» e «Sentence Prediction»: Proloquo4Text.
- Striscia sopra il testo, tre voci («History 1 | 2 | 3» nel tema scuro; «How are you? | Thanks | Yes | No» nel chiaro) + linguette «Notes» per testi preparati: Predictable.
- Elenco per giorni con ora a sinistra e la chip «Dictated in/Listened in <app>»: Speechify (cronologia di dettatura e di ascolto, **non** di frasi dette da chi non parla).

**Frasi salvate o preferite.** 5 presenti, 0 assenti: griglia di due colonne «Quick Talk» a destra (Proloquo4Text); griglia per categorie e linguette «Notes» (Predictable); chip «Phrases» nel pannello (Apple); icona fumetto «My Sayings» con avviso «**Saved to My Sayings**» (Vocable); tavola «quick chat» di tessere gialle (Cboard). Il proprietario ha **rinviato** le frasi pronte.

**Stato scritto in parole nella schermata di uso.** 2 presenti, **5 assenti**, 4 non osservati.
- Presente: **sito di Kalliope** (striscia sopra il campo: «Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.» → «Sto parlando…»), **Kalipso** (riga sotto i comandi: «Manual · Microphone off»).
- Assente nelle schermate osservate: Proloquo4Text, Predictable, Apple Live Speech, Cboard, Grid 3.
- Nessun riferimento mostra «nessuno ti sta ascoltando» né «microfono assente»: **non osservati in tutti e 11**.

### 3.2 Aspetto della finestra

**Temi di colore.** 9 osservati, quattro varianti: **chiaro e scuro** (Proloquo4Text, Kalipso); chiaro, scuro, alto contrasto e bassa visione come **modelli** con anteprima (Predictable); **solo scuro** (Vocable; sito di Kalliope, dove il tema chiaro è **assente verificato**: nessun `prefers-color-scheme` in `design-system/token.css`, `base.css`, `componenti/`, e la home «chiara» emulata è identica alla scura); **solo chiaro** (Cboard, ElevenLabs, Acapela, Speechify). Cboard ha l'opzione «Enable dark theme» ma dopo «SAVE» il tema scuro **non risultava applicato** (esito non chiaro).

**Dimensione del testo regolabile.** 4 osservati: **tre gradini** «Standard / Large / Extra Large» con effetto dopo «SAVE» (Cboard, [O] `foto/cboard-11-fontsize-menu.png`); «Smaller / Larger» con prove a 150% e 200% in cui **cresce tutta la finestra** (Kalipso); impostazione di font, colore e dimensione [L] (Proloquo4Text, Predictable, senza gradini noti).

**Famiglia di carattere (misurata dal DOM, 2 su 11).** Cboard: Montserrat 700/400 a 14 e 16 px (tavola), 400/500 a 12, 14, 18 px (impostazioni). Sito di Kalliope: **Lexend** 97% del testo, pesi 700/400/500/600, titolo 62 px con interlettera −1,116 px; la finestra ricostruita usa «DejaVu Sans Kalliope» a 14 px (3-6%). [L] `--font-app` del sistema è oggi DejaVu.

**Colore del comando principale** (stima visiva, non una misura; tutti diversi): blu saturo (Proloquo4Text, Kalipso), giallo con anello ciano (Predictable), blu per «send» e rosso per ciò che ferma (Apple), **verde acido per ciò che è scelto, ciano per il tasto di voce, arancione per il puntatore** (Vocable), giallo e azzurro come codice del tipo di tessera (Cboard), nero (ElevenLabs), rosso per «registra» e turchese per l'avanzamento (Acapela), blu (Speechify), **menta `#91dfbd`** [M] (sito di Kalliope). Nessuna coppia coincide.

### 3.3 Scelta della voce

4 osservati: pagina intera con **filtri** (ragazzo, ragazza, uomo, donna), **MB per voce** e **elenco di scaricamenti con barra** e «Pause All / Cancel All» (Proloquo4Text); **motore di voce** (Standard, Acapela, ModelTalker, SpeakUnique, The Voice Keeper) + tono + velocità + «Speak button behaviour» (Predictable); «dozens of system voices» + «Voice Settings» [L] (Apple); «Voice», «Pitch», «Rate» e un campo per la chiave ElevenLabs (Cboard).

### 3.4 Creare la propria voce (3 flussi: Apple Personal Voice, ElevenLabs IVC, Acapela)

Denominatore 3 per ogni riga (gli altri 8 non hanno il compito); ogni riga ha 1-3 presenti.

| Aspetto | Apple Personal Voice | ElevenLabs IVC | Acapela My Own Voice |
|---|---|---|---|
| Che cosa si legge | **una frase per schermata**, grande e in grassetto, «1 of 150» nel 2023 (oggi 10, dalla ricerca) [O] | niente di indicato: «upload or record» [L]; schermata non vista | **tre frasi** (prima attenuata, ora piena con puntino rosso, dopo attenuata); 50 frasi [O, L] |
| Avanzamento | contatore «n of N» con frecce | elenco di **3 passi** con stati: fatto (puntino verde), ora (grassetto), poi (grigio) | **quadrante tondo** «24%» con «359/1501» (unità non spiegata) |
| Riascolto della registrazione | non visto | non visto | **tasto tondo dedicato** (cuffia con microfono) |
| Anteprima della voce creata | non vista | «**Preview voice**» accanto al nome, prima di salvare | non vista |
| Controllo del microfono | non visto | consigli in dB nella documentazione, nessun controllo visto | **calibrazione contando da 1 a 6**, tasti spenti tranne «avanti», a ogni seduta |
| Indicatore mentre si registra | onda verde «**Listening…**» e **stop rosso tondo** (immagine ferma) | non visto | tasto «registra» che diventa rosso, bip [L]; cursore del volume di ingresso |
| Sedute | «**Done**» salva, «**Continue Recording**» riprende [L] | non visto | più sedute [L] |
| Consenso | nessuna casella; codice del dispositivo [L] | **casella con il testo legale intero** [O] | nessuno [L, ricerca] |
| Nome della voce | non visto | campo «Name» con esempio in grigio, più etichette e descrizione | non visto |
| Elaborazione | sul dispositivo, notifica a fine lavoro [L] | immediata [L] | pacchetto da scaricare [L] |
| Consigli di qualità | non visti | numeri in documentazione: 1-2 minuti, oltre 3 peggiora, −23…−18 dB RMS | stanza silenziosa, microfono a cuffia, stessa distanza, no Bluetooth [L] |

**Nessuna riga è identica nei tre.** I tre non hanno nemmeno lo stesso gesto di inizio. Il **riascolto di ciò che si è registrato** è visto in **1 di 3** (Acapela), l'**anteprima della voce finale** in **1 di 3** (ElevenLabs): non sono lo stesso passo.
Proloquo4Text e Predictable **non creano la voce dentro l'app**: la importano da fornitori (Acapela, ModelTalker, SpeakUnique, The Voice Keeper) o da Apple Personal Voice [L; non verificato con l'uso].

### 3.5 Movimento (solo ciò che è misurato)

Solo **Cboard** e il **sito di Kalliope** hanno misure. Nessun confronto fra gesti uguali è possibile con gli altri nove.

| Gesto | Cboard [M] | Sito di Kalliope [M, demo della home] |
|---|---|---|
| Tocco/invio di una frase | **un fotogramma**: cambio istantaneo (1% dello schermo) | la frase compare in scrittura accelerata, poi Invio: la bolla nuova **sale** (tratto 3: **2232 ms visibili**, coperto o spostato 61%, metà a 400 ms) |
| Voce in corso | nessuna variazione dello schermo | **6085 ms**, sfuma 71% (parole che si scuriscono), metà a 3732 ms, nove decimi a 5275 ms |
| Cambio di vista | cartella aperta: **383 ms visibili**, **92% dei punti salta di colpo**, nove decimi entro 217 ms | non osservato (home unica) |
| Interruttore (tema) | **167 ms**; «SAVE» **ricarica la pagina** (83 ms, 89% coperto) | non osservato |
| Durate dichiarate nel CSS | 150 ms `cubic-bezier(.4,0,.2,1)` (colore, posizione, opacità), 200 ms ease (altezza), 225-300 ms (ombra) | 160 ms lineare (opacità), 200-240 ms ease (colore), **220-560 ms** `cubic-bezier(.19,1,.22,1)` (trasformazioni), 350 ms lineare (opacità) |

Campo delle durate misurate dal DOM (`base-misurata.json`, `campoDurate`): Cboard [150, 300] ms; sito di Kalliope [160, 1400] ms. **Nessuna uscita di pannello né cambio di tema fluido è stata registrata in nessun riferimento**: Cboard cambia vista a taglio e il tema con un ricaricamento.

## 4. Le peculiarità (ognuna con origine, valore e contesto)

«Singolare fra le osservazioni disponibili» non vuol dire unica: dove le fonti non sono osservate, la rarità non è dimostrata.

**Proloquo4Text** (`proloquo4text.md`)
- *Parola in corso con sfondo verde su schermo intero, con pausa e salto indietro*: pensato per mostrare il testo a chi sta di fronte in un ambiente rumoroso (titolo ufficiale dell'immagine). Valore: verde acceso `#01f401` (stima dai pixel di `valori-da-schermate/proloquo4text-ipad-schermo-intero.json`), testo nero grande.
- *«Speak-as-you-type»*: la voce segue la scrittura parola per parola, come scelta [L].
- *Riproduzione per frasi o per paragrafi con arresto dopo ciascuno*, utile «for presentations, or to provide better control over conversation speed» [L, supporto ufficiale].
- *Indicatore di voce configurabile* (quando appare, colore, parola o frase) e **tasti Play/Pausa e Cancella spostabili** [L].
- *Più conversazioni con testi separati senza perdere niente* [L, O].
- *Voci scaricabili con pausa e annullamento di tutti gli scaricamenti insieme.*

**Predictable** (`predictable.md`)
- *Modelli di aspetto interi* (Dark, High Contrast, Low vision) con anteprima.
- *Il comportamento del tasto di voce è configurabile* («Speak button behaviour»).
- *Accessi alternativi come prima pagina* (testa, occhi, interruttore, scansione costruibile).
- *Tema scuro con contorni turchesi su nero* (tasto altoparlante con anello, tessere con contorno): [O] dal video, `video/predictable-frames/quattro.png` (stima visiva del turchese; non misurato).
- *Voice banking di quattro fornitori scelti nelle impostazioni di voce.*

**Apple** (`apple-live-speech-personal-voice.md`)
- *Il pannello di scrittura lascia vedere la chiamata sotto* (vetro scuro).
- *La registrazione si salva da sola e riprende* («Done» / «Continue Recording»).
- *Notifica quando la voce è pronta*: non si aspetta davanti allo schermo.
- *Il tasto di invio si spegne mentre parla.*

**Vocable** (`vocable.md`)
- *Una frase che dice cosa fare come titolo* («Select something below to speak»).
- *Un accento verde solo per ciò che è scelto; ciano solo per il tasto di voce; arancione solo per il puntatore.*
- *La conferma dice dove è finita la frase* («Saved to My Sayings»).
- *«Listening Mode»*: la domanda dell'altro compare in verde in alto, con le risposte come tasti grandi.

**Cboard** (`cboard.md`)
- *Si usa subito, senza account* («SKIP FOR NOW»).
- *La barra bianca tiene la frase fino al ritorno* (la frase «yes no» era ancora lì dopo il ricaricamento) [O].
- *Il colore è il codice del tipo di tessera* (giallo = frase, azzurro = cartella).
- *Lucchetto «3 clicks to unlock»* che **non protegge** (le impostazioni si aprono da `/settings`).

**Grid 3** (`grid3.md`)
- *«Fix» (correzione assistita) accanto a «Speak»*; «Chat switcher» fisso accanto al messaggio; cinque metodi di accesso (sguardo, tocco con protezione, interruttore, puntatore, voce) come prima pagina.

**ElevenLabs IVC** (`elevenlabs-ivc.md`)
- *L'ultimo passo riunisce nome, anteprima e consenso*; elenco di passi a sinistra con tre stati.
- *Consigli con numeri precisi* e la frase «How the audio was recorded is more important than the total length».

**Acapela** (`acapela-my-own-voice.md`)
- *Quadrante tondo di avanzamento con percentuale dentro un cerchio turchese.*
- *Calibrazione detta a parole nel pannello* («count 1, 2, 3, 4, 5, 6 in a normal voice»).
- *«Auto Mode»* (la frase seguente arriva da sola) e *«Always Say the Example»* (la voce guida), per le sedute lunghe.
- *Fino a 300 frasi proprie* registrate dopo le 50.

**Speechify** (`speechify.md`)
- *Scorciatoie globali di sistema* (`fn`, `⌥ A`) scritte come tasti; cronologia che dice dove è stata usata.

**Sito di Kalliope** (`sito-kalliope.md`)
- *Parole che si scuriscono mentre la voce le dice*; *anelli menta che partono da «Tu» e arrivano agli altri riquadri*; *onestà sullo stato* («Oggi: … non ancora provata in una riunione vera»).
- La demo imita la **finestra 0.1** (DejaVu 14 px, blu `#005fb8` per «Parla», pulsanti da 4 px): **l'identità del sito e quella della finestra mostrata nel sito non coincidono.**

**Kalipso** (`finestra-kalipso.md`)
- *Testo di lettura grande, parte letta attenuata*, **un solo pulsante pieno**, riga di stato in chiaro, contatore «4 / 27».
- *Impostazioni nello stesso pannello con effetto immediato, e una frase che lo dice* («Changes appear immediately · This session only»).
- *Il pannello stretto ha la stessa gerarchia del largo.*

## 5. Le osservazioni che contano di più per una finestra «scrivi e parla con Invio»

1. **Invio che fa parlare: 2 su 7 osservati** (Apple sul Mac [L]: «Speak» oppure Invio; demo del sito di Kalliope [O]); gli altri non descrivono la tastiera fisica. **Finestra compatta: 2 su 8** (pannello di Live Speech sopra la chiamata FaceTime, [O] `fonti/apple/sheet-livespeech.png`; pannello stretto di Kalipso, `fonti/kalipso/sheet-2.png`); **che resti sopra le altre finestre non è stato verificato in nessuno**, e la finestra Live Speech del Mac non si è vista.
2. **Il campo di scrittura domina solo in Proloquo4Text per Mac** (stima 69% della larghezza; `fonti/p4t-mac/sheet-1-4.png`); dove c'è una tastiera a schermo (Predictable, Vocable, Grid) il campo si riduce.
3. **L'evidenziazione di ciò che si sta dicendo ha tre forme già viste**: sfondo verde sulla parola (Proloquo4Text), parte detta piena e da dire attenuata (Apple, sito di Kalliope), parole che si scuriscono una a una in 6085 ms (sito di Kalliope, misurato). Cboard non ne ha ([M]). Il sito di Kalliope ha già disegnato e animato quella di Kalliope (`video/kalliope-demo-home-mv/tratto-4.jpg`).
4. **Lo stato scritto in parole c'è in 2 su 7 osservati** (sito di Kalliope, Kalipso); «nessuno ti ascolta» e «microfono assente» in **0 su 11**.
5. **La cronologia ha due forme**: colonna di lato con un'etichetta di tempo (Proloquo4Text) e striscia sopra il testo (Predictable); con **ridire a un tocco** in entrambe.
6. **Il tema chiaro manca al sistema di Kalliope** (verificato nel codice e nella home); gli altri riferimenti che lo hanno: Proloquo4Text, Predictable, Kalipso; **solo scuro**: Vocable.
7. **La dimensione del testo si cambia per gradini (Cboard, 3) o con prove a 150% e 200% in cui cresce tutta la finestra (Kalipso)**; in Cboard serve «SAVE» e la pagina si ricarica: l'effetto non è immediato.
8. **Creare la voce: tre flussi, nessuno uguale.** I passi che compaiono in **un solo** flusso e che il compito di Kalliope sembra richiedere: **riascolto della registrazione** (Acapela), **anteprima della voce finale** (ElevenLabs), **ripresa in più sedute con salvataggio** (Apple, Acapela [L]), **consenso esplicito** (ElevenLabs), **calibrazione del microfono detta a parole** (Acapela), **avviso a fine elaborazione** (Apple).
9. **L'avanzamento della creazione ha tre forme**: contatore «n of N» (Apple), elenco di tre passi con tre stati (ElevenLabs), quadrante tondo con percentuale (Acapela).
10. **Movimento: nessuna uscita o cambio di tema fluido è stato registrato** in nessun riferimento; Cboard cambia vista quasi a taglio (92% dei punti salta) in 383 ms e il tema con un ricaricamento.

## 6. Lacune dichiarate

- Predictable: video della ricerca rimosso; video alternativo guardato ma montato a tagli (nessun gesto isolato misurato). Apple: nessuna immagine della finestra del Mac, nessun video di Live Speech. Grid 3: nessun video, GIF «Fix» non guardata. ElevenLabs: schermata di registrazione e di caricamento non pubblica (serve un account, non creato). Acapela: registratore in uso non provato (serve un accesso concesso); stato verde/giallo/rosso per frase solo dalla ricerca; unità «359/1501» non spiegata.
- Cboard: tre clic di sblocco non riusciti con i clic dello strumento; tema scuro dopo «SAVE» non applicato (esito non chiaro); tastiera: letture del fuoco incoerenti (`activeElement` «yes» e contorno visibile su «body»); nessuna tavola con testo libero aperta.
- Nessun suono registrato in nessun riferimento; nessun test con movimento ridotto, con il telefono, con lo zoom del testo (salvo le foto di Kalipso).
- Le **palette** degli otto riferimenti non misurati sono **stime dai pixel di schermate** (`valori-da-schermate/`, `base-con-stime.json`): da trattare come stime visive. Due ritagli non sono affidabili (Grid 3, Apple) e non sono stati usati.
- Prima di dichiarare comune o rara una caratteristica: la «frequenza descrive il campione e non dimostra efficacia».

## 7. Cosa non è stato deciso qui
Questo file non dice che cosa fare. La riga di trasferimento (fonti → compito → destinazione nel sistema → valori → prova viva → verifica) spetta alla direzione, `references/confronto.md` («Dal confronto al sistema»). Ciò che il sistema di Kalliope non ha e le schede mostrano necessario: tema chiaro; componenti della finestra (campo di scrittura grande, striscia di stato, cronologia, registratore con riascolto e avanzamento); un carattere per l'app diverso da DejaVu; stati «nessuno ti ascolta» e «microfono assente» (non visti in nessun riferimento).
