# La finestra di Kalliope · direzione «La frase che si accende»

Proposta del 26/11/2026 per la finestra del programma (issue #13; personas in #20). **Non è approvata**: il giudizio spetta al
ruolo di giudice, la scelta al proprietario. Ramo `direzione-finestra` (worktree `materiali-locali/direzione-finestra`), commit
425ee10, 4cda39e, 4bf4438, 6f38131 sopra `main` c44508a (il motore). Prove: `foto/`, `video/`, `misure/`, `affiancati/`,
`abbozzi/` in questa cartella (immagini e video ignorati da git).

## Correzioni dopo il giudizio (26/11/2026, un giro)

Giudizio: `../giudizio/giudizio.md`. Ogni correzione è alla causa, nei token e nei componenti; il catalogo è aggiornato. Prove del giro in
`foto/c-*` (dalla cartella `materiali-locali/direzione-finestra-prove/foto2/`), video `video/c-*`, misure `misure/c-*`.

| Punto | Che cosa ho cambiato | Dove si vede |
|---|---|---|
| **B1** la scrittura non cresceva | Niente più fascia di 200 px: la scrittura prende **due parti** dello spazio che avanza e la cronologia **una** (`--app-quota-scrittura`, `--app-quota-storia`); il minimo è un numero di righe (3 nella finestra intera, 1 nell'impianto raccolto), non un'altezza. A 920 × 640 la scrittura passa da 200 a circa 265 px e la cronologia scorre; a 1600 × 1000 la scrittura prende più della metà della finestra. Il token falso «cresce con la finestra» è tolto | `foto/c-cronologia-920x640-1-*`, `foto/c-cronologia-1600x1000-1-*` |
| **B2** la voce non si sceglieva da tastiera | Un componente `Menu` (`kalliope/menu.slint`): all'apertura il fuoco entra sulla voce in uso; ↑ ↓ spostano l'evidenziazione (anello della voce), Invio o Spazio scelgono, Esc chiude; dopo la scelta o Esc il fuoco torna sul pulsante della voce | `foto/c-menu-tastiera.png`, `video/c-menu-tastiera.mp4` |
| **I1** la frase detta finiva tagliata | La bolla della frase detta sta fuori dalla cronologia che scorre, sempre intera fra la cronologia e lo stato; con il testo grande in una finestra bassa va a capo con parole più piccole (`corpo-detta`) | `foto/c-cronologia-920x640-1.5-dark.png`, `-1.75-` |
| **I2** i comandi si spostavano con A+ | La barra ha gli stessi comandi a ogni grandezza: voce, «Riunione», «Altro», e **A− % A+ al bordo destro**, così il secondo clic trova A+ sotto il puntatore; «Crea la tua voce» e «Informazioni» stanno sempre in «Altro» (con «Riunione» quando la finestra è stretta) | `foto/c-*-1.5-*`, `foto/c-*-1.75-*` |
| **I3** in riunione non si vedeva la frase | Nella modalità riunione la frase detta c'è, su **una riga che scorre** e tiene in vista la parola che la voce sta dicendo; lo stato è una parola; il consiglio «Alt+Spazio» si mostra solo dove lascia posto alla scrittura; il segnaposto è corto («Scrivi qui.») e non si taglia a 150% | `foto/c-compatta-parla-*` |
| **I4** a Invio la cronologia saltava | La cronologia scorre in su di quanto è cresciuta (520 ms, curva dolce) e la bolla nuova sale dalla scrittura mentre cresce dalla coda. Misura nella zona di cronologia e bolla: **1933 ms visibili**, 39% «coperto o spostato», metà del cambiamento entro 267 ms (prima, misura del giudice: 166 ms, 100% a salto); sito: 2232 ms, 61% spostato, metà entro 400 ms | `video/c-invio-passaggio.mp4`, `misure/c-invio-passaggio/` |
| **I5** 360 × 320 peggio della compatta | Sotto 440 px × testo la finestra si **raccoglie** da sola: niente cronologia, la frase su una riga, lo stato in una parola, la scrittura a 24 px; il testo del passo 2 della voce va a capo | `foto/c-*-360x320-*` |
| **I6** stati che mentivano | Il segnaposto segue lo stato («Puoi già scrivere: la voce arriva fra poco», «La voce non parte: guarda qui sopra»); «Invio la dice» compare solo quando la voce può prendere la frase; la bolla vuota non promette niente quando la voce non parte; accanto a «Nessuno ti sente», «Manca il microfono» e «La voce non parte» c'è **«Come si risolve»**, che apre la pagina della guida (riunione o installa) nel browser (`vista.rs`, `xdg-open`/`open`/`start`) | `foto/c-problema-*`, `foto/c-prepara-*`, `foto/c-nessuno-*` |
| **I7** due schede uguali e mezze vuote | Una scelta con gerarchia, per le due personas: grande «Registrala adesso» («Se hai ancora la voce», con il tondo «registra» vero) e sotto, come seconda strada, «Usa vecchie registrazioni» («Se la voce non c'è più»); mentre si registra il **cerchio si riempie fino a 12 s** e il testo dice quanti secondi mancano; al passo 3 la riga di punti è diventata la forma della registrazione | `foto/c-voce-1-*`, `foto/c-voce-2-*`, `foto/c-voce-3-*` |
| minore: Giulia e l'avviso | Giulia ha la tinta di Anna; un'altra voce propria il grigio verde delle barre spente; la tinta di Paola resta solo all'avviso | menu della voce, catalogo |
| minore: «Di'» spento nel chiaro | Un comando pieno spento ha il fondo del velo e il testo spento, leggibile nei due temi | `foto/c-*-light.png` |
| minore: il bordo alto della cronologia | La frase più vecchia sfuma sotto la barra | `foto/c-cronologia-*` |

## L'idea, in una frase

**La finestra è la bolla del logo: scrivi nella bolla tratteggiata del non ancora detto, Invio la manda nella bolla dove la voce
la dice, una parola dopo l'altra, e la frase detta resta lì, piena, da ripetere con un gesto.**

Il logo scelto il 19/11 si chiama proprio «La frase che si accende» (bolla metà piena, detto, e metà tratteggiata, non ancora
detto). La finestra lo apre in due luoghi: in basso la scrittura, grande, con il contorno tratteggiato del logo (tratto 3 px,
trattini 14/10 come i 14/9 del disegno); sopra la conversazione, con la bolla chiara della home dove le parole si scuriscono
mentre la voce le dice, e le frasi già dette che restano da ripetere.

## Il criterio di ambizione

| | |
|---|---|
| **Che cosa** | La finestra mostra **dove sta la frase**: non ancora detta (tratteggio), detta adesso (la bolla con le parole che si scuriscono e l'anello della voce), detta (piena, in cronologia), e **se qualcuno la sente**: quando nessuna app ascolta il microfono «Kalliope» l'anello della bolla e la riga di stato diventano caldi, con la frase che dice che cosa fare. Nessuno degli 11 riferimenti mostra «nessuno ti ascolta» o «microfono assente» (0/11, `riferimenti/confronto.md` §3.1). |
| **Per chi** | Chi parla in riunione e deve intervenire in fretta; chi ha poca energia e usa solo la tastiera (SLA); chi ha un'afasia (Lexend, frasi brevi, un solo comando pieno); chi crea la voce propria o la crea per un'altra persona. |
| **Dove** | Il primo schermo della finestra, alla misura d'apertura (920 × 640) e nella modalità riunione (400 × 320) accanto a Zoom o Meet; la creazione della voce. |
| **Come si riconosce** | Il tratteggio verde acqua attorno a ciò che si scrive e il momento in cui, a Invio, la frase nasce nella bolla e si scurisce parola per parola: è la demo della home diventata il programma vero. Coprendo il nome, la si riconosce dal tratteggio del logo e dalla bolla. |

## I tre abbozzi (interni, non vanno al proprietario)

`abbozzi/tre.png` (a, b, c), fermi, 900 × 620, sulla stessa base:
- **A · La bolla che si riempie** (scelto): una colonna, conversazione sopra, scrittura grande tratteggiata sotto, stato fra le due.
- **B · Il tuo riquadro**: la finestra come il riquadro «Tu» della riunione del sito, con le barre e la frase dentro, cronologia a colonna come Proloquo4Text per Mac. Scartato: il campo di scrittura torna piccolo (il difetto della 0.2) e la frase compare due volte.
- **C · Il copione**: testo enorme come Kalipso, la parte detta che si attenua nello stesso campo. Scartato: non si può scrivere la frase seguente mentre la voce dice quella di prima (il compito di chi è in riunione), e impianto e gerarchia sono quelli di Kalipso (copia d'identità).

A tiene insieme le due cose che la visione chiede di più (scrivere in grande, sapere sempre la verità) e porta l'identità dal
logo e dalla home invece che da un riferimento.

## Tratti comuni e peculiarità

Intersezione dei riferimenti: una sola caratteristica, il carattere senza grazie (11/11): adottata (Lexend). Il resto
(`confronto.md` §3-4), con la decisione:

| Tratto (fonte) | Decisione | Perché |
|---|---|---|
| Area di scrittura che domina (Proloquo4Text per Mac) | **adottato** | il primo difetto della 0.2 per il proprietario; 30 px, fino al 40% dell'altezza |
| Invio che parla (Apple Mac [L], demo del sito) | **adottato**, senza a capo | visione: «ha poco senso andare a capo»; anche Maiusc+Invio parla; «Di'» pieno resta per il mouse |
| Parte detta piena e da dire attenuata (Apple, sito: 17 parole in 6085 ms) | **adottato** dalla home | è l'identità: stesso gesto della demo, una parola ogni 0,36 s, 200 ms ciascuna |
| Parola su sfondo verde (Proloquo4Text) | escluso (conflitto) | la bolla della home fa lo stesso lavoro con l'identità di Kalliope |
| Stato scritto in parole (sito, Kalipso) | **adottato** e portato a sette stati veri | visione: lo stato dice sempre la verità |
| Pausa/arresto (Proloquo4Text, Apple, sito) | **adottato**: «Ferma» compare mentre parla, Esc | dopo Ferma le parole non dette restano tenui |
| Cronologia con ripetizione a un tocco (Proloquo4Text, Predictable) | **adottata** come conversazione sopra la scrittura; ↑ nel campo vuoto riporta l'ultima frase | un gesto solo anche da tastiera |
| Frasi salvate (5/11) | rinviate | decisione del proprietario |
| Tema chiaro e scuro (Proloquo4Text, Kalipso) | **adottato**, segue il sistema | visione; aggiunto al sistema con i suoi ruoli |
| Testo regolabile che fa crescere tutto (Kalipso 150/200%) | **adottato**: 100-200% a gradini di 25 | A− A+ nella barra (nel menu della voce quando la finestra è stretta) |
| Finestra stretta con la stessa gerarchia (Kalipso) | **adottato** nella modalità riunione | solo stato, scrittura, Ferma |
| Pannello sopra la chiamata (Apple Live Speech) | adattato | su Wayland l'app non può imporsi sopra: la modalità riunione lo dice e insegna Alt+Spazio → «Sempre in primo piano» |
| Impostazioni nello stesso pannello con effetto immediato (Kalipso) | adottato nel menu della voce | scelta della voce e «Senti anche tu» hanno effetto subito |
| Passi con tre stati (ElevenLabs IVC) | **adottato** nella voce propria | fatto, ora, poi |
| Una frase per schermata, grande (Apple Personal Voice) | **adottato**: un testo da leggere a 34 px | si legge a un braccio dallo schermo |
| Riascolto della registrazione (Acapela) e anteprima (ElevenLabs) | adottati: «Ascolta la registrazione», «Rifai» | entrambi servono a chi registra per la prima volta |
| Consenso esplicito (ElevenLabs) | **adottato**, una frase sola | anche per chi crea la voce per un'altra persona |
| Importare un file (ElevenLabs, SpeakUnique) | **adottato** come seconda strada | la persona che ha già perso la voce usa vecchie registrazioni |
| Quadrante con percentuale (Acapela) | escluso (conflitto) | 12 secondi bastano: il contatore in secondi dice tutto |
| Calibrazione contando 1-6 (Acapela) | escluso per ora | il livello vivo e «Ne bastano dodici secondi» fanno lo stesso lavoro; da riconsiderare con le prove vere |
| Anelli da «Tu» agli altri (sito) | adattato: l'anello sta sulla bolla che parla | nella finestra non ci sono riquadri da raggiungere |
| Barre di «Tu» (sito) | **adottate** nello stato «Sto parlando» e nel livello del microfono | |
| Pillole (sito R01/R03, Webby) | **adottate** | tratto di default (parte E), giustificato dai vincitori citati in D2 |
| Tre pulsanti in alto a destra, blu d'azione (Kalipso) | esclusi | l'identità viene dal sito; il blu era della 0.2 |

## Scelte progettuali dichiarate

Tutte sulla loro riga di `design-system/token.css` (`/* scelta: … */`); le principali:
- **Finestra 920 × 640** (prima 560 × 460): la scrittura grande chiede spazio; sta intera su un portatile 1366 × 768.
- **Scrittura 30 px**, **testo da leggere 34 px**, **titolo dei passi 28 px**.
- **Tratteggio verde acqua al 50%** (pieno al fuoco): nella finestra il rosa resta del logo e del solo «registra».
- **La bolla che parla è sempre il contrario della stanza**: chiara sullo scuro, grafite sul chiaro.
- **Il solo colore caldo** è la tinta dei partecipanti approvata (Paola): per dire che la voce non arriva. Nel chiaro `#8f4f36` (scurita):
  `controlla-valori.mjs` la segnala come «terracotta» dello stile di default; viene dalla palette approvata, va guardata dal giudice.
- **Le voci come partecipanti**: Giulia ha la tinta di Paola, Marco di Luca, la voce propria quella di «Tu», un'altra voce propria quella di Anna.
- **Il tondo «registra»** ha il rosa della bolla del logo: la voce propria nasce con il colore del marchio.
- **Soglie**: 900 px × testo (la barra lascia nel menu «Crea la tua voce» e «Informazioni»), 560 px × testo (anche il testo regolabile va nel menu, lo stato va su due righe, la voce propria impila le sue strade).

## Che cosa fa il movimento

| Movimento | Che cosa | Tempi | Misura (`movimento-visibile.mjs`) | Riferimento accanto |
|---|---|---|---|---|
| Invio → la frase nasce | la bolla cresce dalla coda (0,6 → 1) e appare | 520 ms, curva d'entrata del sito | con le parole: 4700 ms visibili, sfuma 56%, metà entro 133 ms (`misure/vero-invio`) | sito, cambio di bolla 2232 ms (61% coperto) e parole 6085 ms (sfuma 71%) |
| Le parole si scuriscono | una ogni 0,36 s, ciascuna sfuma in 200 ms | stima (vedi sotto) | dentro il tratto sopra | sito 6085 ms per 17 parole |
| Fine della frase | l'anello della voce si spegne | 520 ms ease | 467 ms visibili (`misure/fine-frase`) | sito, fine frase 801 ms |
| Mentre parla | le barre respirano | 460 ms | continuo | barre di «Tu» del sito |
| Mentre la voce si prepara | il tratteggio cammina, il punto respira | 1,4 s | arrivo: 667 ms (il motore è pronto subito, `misure/arrivo`) | — |
| Menu della voce | entra scendendo di 12 px e sfumando, esce sfumando | 300 ms entrata (curva d'entrata), 240 ms uscita (ease) | 267 ms / 233 ms visibili, sfuma 58% / 54% (`misure/menu-voce`) | Cboard, cartella: 383 ms, 92% salta di colpo |
| Crea la tua voce | entra da destra di 48 px e sfuma, esce sfumando | 300 / 240 ms | 167 / 234 ms visibili, sfuma 46% / 62% (`misure/crea-voce`) | Cboard 383 ms a taglio |
| Registra ↔ ferma | il tondo diventa quadrato | 300 ms | nel flusso (`misure/voce-flusso`) | Apple: stop rosso tondo (foto ferma) |
| Riunione ↔ finestra intera, testo più grande | **cambio istantaneo** | — | un fotogramma (`misure/riunione`, `misure/c-testo`); dopo la correzione A+ resta sotto il puntatore a 125, 150 e 175% (`foto/c-testo-125/150/175.png`) | Cboard: tema con ricaricamento |
| Invio, dopo la correzione | la cronologia scorre in su, la bolla sale dalla scrittura | 520 ms | 1933 ms visibili, 39% spostato, metà entro 267 ms (`misure/c-invio-passaggio`) | sito 2232 ms, 61% spostato |
| Menu da tastiera | apre, l'evidenziazione passa da una voce all'altra, chiude | 300 / 240 ms; le frecce istantanee | apertura 167 ms, chiusure 200-234 ms, sfumano 34-53% (`misure/c-menu-tastiera`) | — |
| Riunione che parla | la riga della frase scorre e le parole si scuriscono | 200 ms per lo scorrimento | 4200 ms visibili, 55% spostato, 30% sfuma (`misure/c-compatta-parla`) | sito, parole 6085 ms |

Nessun riferimento ha un'uscita di pannello fluida registrata (`confronto.md` §3.5): le uscite della finestra sono un po' più brevi delle entrate e
sfumano, come vuole la convenzione. Il cambio di misura della modalità riunione lo fa il sistema delle finestre (l'app chiede la misura); il testo
regolabile cambia di colpo come in Kalipso. **La sensazione a velocità vera è da guardare per il proprietario nei video.**

## Ciò che è vero e ciò che è stimato (la frase detta)

Il motore dice quando una frase comincia (`Speaking`/`NotHeard`), se qualcuno la sente (`Heard`/`NotHeard`) e quando finisce (`Idle`),
non dove sta ogni parola. La bolla quindi **stima**: una parola ogni 0,36 s (il ritmo misurato della home), ferma sull'ultima parola finché
la voce non ha finito; alla fine tutte le parole sono piene; dopo «Ferma» restano tenui quelle non ancora dette secondo la stima. Per
renderla vera serve dal motore un evento per pezzo detto (il motore dice già la frase pezzo per pezzo, c44508a): con l'indice del pezzo
e la sua durata, la bolla saprebbe esattamente fin dove è arrivata. Lo lascio al ruolo di costruzione.

## I ripieghi

- **Tastiera** (provata sul motore vero, `foto/23-tastiera-esc-su-tab-invio-scuro.png`, `video/10-…`): il fuoco parte nella scrittura;
  Invio dice, Esc ferma, ↑ nel campo vuoto riporta l'ultima frase, Maiusc+Tab porta all'ultima frase detta e Invio o Spazio la ripete;
  ogni comando ha il fuoco visibile (l'anello della voce, 3 px) e Spazio/Invio; il menu della voce si apre con Spazio, Invio o ↓, il fuoco entra sulla voce in uso, ↑ ↓ spostano, Invio o Spazio scelgono, Esc chiude e il fuoco torna sul pulsante (provato: `foto/c-menu-tastiera.png`).
- **Testo grande**: 100-200% a gradini, tutto cresce insieme; la barra lascia i comandi al menu quando non ci stanno; a 150% nella
  finestra più piccola (360 × 320) non ci sta tutto: a quella misura il testo grande chiede una finestra più grande (limite dichiarato).
- **Movimento ridotto**: `Aspetto.movimento-ridotto` ferma il tratteggio e le barre (alte nel mezzo), la bolla compare senza crescere,
  i pannelli senza scorrere; le parole si scuriscono comunque (sono informazione). **Non è collegato al sistema**: Slint 1.19 non legge la
  preferenza; per ora si prova dal catalogo.
- **Lexend senza Lexend nel sistema**: `fc-list | grep -i lexend` qui è vuoto; la finestra ha `default-font-family: Token.font-testo` e le
  foto mostrano le forme di Lexend (il file è incorporato dal ponte dei token).

## Che cosa non è ancora collegato (schermate vere in Slint, stato di dimostrazione)

`kalliope --demo SCENA` (scene: vuota, prepara, scrive, parla, cronologia, nessuno, microfono, problema, compatta, compatta-parla, voce-1,
voce-2, voce-3, grande; `KALLIOPE_DEMO_MISURA=360x320` per un'altra misura). Nel demo la voce è simulata e niente arriva al microfono.
- **Creare la voce propria**: registrazione dal microfono, livello vero, riascolto, importazione (`importa-voce`, `crea-voce` stampano
  «non ancora collegato»); il livello del microfono nel demo è un'animazione.
- **La cronologia salvata fra un avvio e l'altro**: oggi resta in memoria (la frase vuota non lo promette più).
- **Il tema chiaro** segue il sistema davvero (provato con il portale finto); il pulsante «Tema» c'è solo nel catalogo.
- **La modalità riunione** è vera (Slint e `vista.rs` chiedono 400 × 320 e ridanno la misura di prima); il suggerimento «Alt+Spazio»
  non ricorda «Ho capito» fra un avvio e l'altro.
- **Il testo regolabile** è vero ma non salvato; mancano le scorciatoie Ctrl+più e Ctrl+meno.
- **Il movimento ridotto** non segue il sistema.
- **Lo stato vero è collegato**: `Status::situation()` (session.rs, con test) mappa le bandiere del motore sui sette stati; provati sul motore
  vero: pronta, sta parlando (sentita, con `parecord` sul microfono «Kalliope»), nessuno ti sente, manca il microfono (PipeWire spento),
  la voce non parte (modelli mancanti). «Preparo la voce» dura meno di un secondo: fotografato dal demo.

## Dove ho seguito la visione e dove la ricerca ha portato altrove

- Seguita: scrittura grande con Invio che parla; stato sempre vero; cronologia con un gesto; scelta della voce; voce propria nell'app
  (registra o importa, testo da leggere, livello, riascolto, rifai, nome, consenso); modalità riunione; testo regolabile; identità dal sito
  (grafite, verde acqua, tinte dei partecipanti, Lexend, il logo); tema chiaro aggiunto al sistema.
- La ricerca ha aggiunto: i passi con tre stati e il consenso da ElevenLabs; il testo da leggere grande da Apple; «nessuno ti sente» e
  «manca il microfono» non esistono in nessun riferimento: sono un'invenzione dichiarata, legata alla visione.
- Contrasto da portare al proprietario: la visione chiede una modalità compatta «accanto a Zoom o Meet»; su Wayland l'app non può
  restare sopra le altre (`ricerca/tecnica.md`): la finestra lo dice e insegna il menu del sistema. Il rosa del logo nella finestra
  resta soltanto nel logo e nel «registra»: l'accento della finestra è il verde acqua approvato.

## Dove mi sono allontanato dall'incarico

- I vecchi `--app-*` (disegno della finestra 0.1 sul sito) sono diventati `--ricostruita-*`: il tema chiaro li avrebbe obbligati a un
  valore chiaro che il sito non usa. Il sito non cambia (stessi valori).
- `crates/app/build.rs` genera anche la tabella dei token del catalogo (`catalogo_dati.slint`): il catalogo non tiene copie a mano.
- Il catalogo vivo è una finestra Slint (`kalliope --catalogo`), non una pagina HTML: la superficie è Slint.
- Chrome MCP non si applica a una finestra nativa: prove con Xvfb :154, xdotool, ffmpeg x11grab e `movimento-visibile.mjs`.
- La soglia di Slint `focus-on-tab-navigation` e l'ordine TouchArea/FocusScope sono stati corretti dopo averli visti fallire.

## Che cosa resta debole (dopo il giro di correzioni)

- La stima delle parole: può anticipare o ritardare la voce vera (serve dal motore un evento per pezzo detto).
- Il passaggio a Invio scorre, ma all'inizio c'è ancora un salto: la bolla di prima lascia il posto a quella nuova in un fotogramma, mentre
  la frase di prima entra nella cronologia scorrendo. Il sito impiega 2232 ms, con il 61% «coperto o spostato»: misura accanto sotto.
- Il clic fuori da un menu aperto lo chiude e non arriva al comando sotto (come i menu di sistema).
- A 175% in una finestra bassa la frase detta va a capo con parole più piccole (17 px × testo) per lasciare la quota alla scrittura.
- Cambio di modalità e testo regolabile restano istantanei; i comandi non si spostano più sotto il puntatore.
- Il pallino della voce propria («Tu», `#263b35`) si vede poco sulla barra scura.
- `xdotool type` perde le lettere accentate (limite dello strumento di prova, non della finestra).
- Il catalogo usa la `ScrollView` di Slint (stile fluent) per scorrere.
- «Come si risolve» apre la pagina della guida nel browser: provato che il comando parte, non che la pagina si apra (nella sandbox non c'è un
  browser predefinito).

## Le prove (percorsi)

- **Giro di correzioni**: `foto/c-<scena>-<misura>-<testo>-<tema>.png` (13 scene a 920 × 640 nei due temi; parla, cronologia, riunione che parla, nessuno, i tre passi della voce a 360 × 320, 1600 × 1000, 150% e 175% scuri; parla, cronologia e voce anche chiari a 360 × 320, 1600 × 1000 e 175%), `foto/c-menu-tastiera.png`, `foto/c-testo-125/150/175.png`, `foto/c-voce-registra-6s/13s.png`; video `video/c-*.mp4`; misure `misure/c-*`. Le foto e i video senza `c-` sono del primo giro.

- Motore vero: `foto/01…07-vero-*` (pronta, scrive, parla con nessuno che sente, parla sentita, cronologia, manca il microfono, la voce
  non parte in scuro e chiaro), `video/01-vero-invio-parla-nessuno-ti-sente.mp4`, `video/02-vero-invio-parla-sentita.mp4`,
  `video/10-tastiera-esc-su-tab-invio.mp4`; la registrazione del microfono «Kalliope» durante la seconda frase ha voce (RMS 0,076,
  `materiali-locali/direzione-finestra-prove/log/voce-2.wav`).
- Demo, scuro e chiaro, 920 × 640: `foto/1x-demo-*`, `foto/2x-riunione-*`, `foto/3x-demo-voce-*`, `foto/4x-demo-testo-150-*`;
  gesti: `foto/20…23`, `foto/30-31`, `foto/40-41`.
- Finestra più piccola 360 × 320: `foto/50-minima-*`.
- Catalogo: `foto/60-catalogo-dark-01…14.png`, `foto/60-catalogo-light-*.png`, fogli `foto/90-foglio-catalogo-*`.
- Video dei gesti: `video/03…09`; misure e strisce: `misure/*/misure.json`, `misure/*/tratto-*.jpg`.
- Coppie con i riferimenti: `affiancati/` (Kalipso, sito, Proloquo4Text per Mac, Apple Personal Voice, modalità riunione e Kalipso).
- Valori: `controlla-valori.txt` (uscita 0: 65 tracciati, 0 senza fonte), `base.json` (base misurata con la visione), `../visione.json`.
