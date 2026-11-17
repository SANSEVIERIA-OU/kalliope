# Giudizio 2-g · l'aspetto nelle altre lingue (commit `8c7fae1`)

Giudice: design-judge (Claude Opus), 17/11/2026. Non ho reso né costruito questo lavoro. Ho guardato prima di leggere
le note dell'autore; il confronto con le note sta in fondo.

**Su che cosa.** Copia del commit (`git archive 8c7fae1`) in `/tmp/lavoro-2g-radice`, con i nove cataloghi di prova
del commit (identici, controllato con `cmp`) aggiunti alla copia di `website/lingue/`; sito in `/tmp/lavoro-2g-sito`,
pseudo-lingue in `/tmp/lavoro-2g-sito-pseudo`; l'italiano di prima, `341a841`, in `/tmp/lavoro-2g-sito-341`. Pagine
servite dagli strumenti stessi su 8820–8829. Chromium senza finestra (Playwright 1.60), salvo dove detto.

**Foto.** `foto/…` sta in `design/lavoro/2-lingue-aspetto/giudizio/foto/`. Le serie complete (tutte le lingue, tutti gli
stati, le due misure) in `/tmp/lavoro-2g-foto/`, le sequenze con i video in `/tmp/lavoro-2g-seq/`.

---

## Problemi, in ordine di gravità

### Bloccante

**B1. La barra si rompe nelle lingue lunghe quando l'azione entra.** Dopo lo scorrimento «Scarica e installa» entra
nella barra e il menu scivola verso il marchio: in tedesco, greco e bulgaro, fra 960 e 1180 px, la prima voce esce dallo
schermo («…nhören», «Чуй» tagliati) e le voci finiscono sopra l'icona del marchio; in en-XA succede anche a 1280 e a
1440 («[Åšçöļţá» sotto l'icona). Controprova con la rotella vera, non solo con `scrollTo`: stesso risultato, la barra ha la
classe `stretta` (la parola del marchio sparisce) ma il menu non ci sta lo stesso.
- Misura (`barra-misura.mjs`, voci fuori dallo schermo / sopra l'icona): de rotta a 960, 1000, 1024, 1100; el a
  960–1100; bg a 960–1180; fi icona coperta a 960 e 1000; it, ar, ur, hi, bn, zh mai.
- Foto: `foto/barra-rotella.png` (en-XA 1440, de 1024, bg 1100), `foto/barre-azione-lingue.png`,
  `foto/barre-azione-enXA-fi.png`.
- Perché è bloccante: è il punto 3 dell'incarico («correggile perché reggano anche il tedesco e il finlandese»), dato per
  fatto nelle note e nel messaggio del commit; testo tagliato e sovrapposto al marchio a larghezze comuni (1024, 1100:
  portatili piccoli, tablet in orizzontale) nella navigazione principale. In italiano non succede.
- Correzione (che cosa): a ogni larghezza e in ogni lingua, con l'azione in barra, nessuna voce esce dallo schermo né
  copre il marchio; dove non ci stanno, la barra deve passare a una forma che ci sta (meno voci visibili, il pulsante
  «Menu», o l'azione che non entra), provata alle larghezze di mezzo, non solo a 1440 e 390.

### Importanti

**I1. La versione si legge al contrario in arabo e in urdu.** «0.1-rc.1» esce «rc.1-0.1» nello stato sotto il titolo
(primo schermo), nella chiusura e nel piede: la stringa non è isolata dal verso del testo (nessun `bdi` né `dir` nel
markup costruito). Foto `foto/ar-1440-stato-versione.png`, `foto/ur-1440x900-selettore.png` (in basso a destra).
Rispetto alla scelta del proprietario («pronto per le traduzioni, anche da destra a sinistra») è un fatto sbagliato sul
primo schermo, e la causa sta nei segnaposti della costruzione: tocca ogni lingua da destra a sinistra e ogni versione,
data o misura. Correzione: versioni, nomi di pacchetti, codici e misure scritti dalla costruzione restano nel loro verso
dentro qualunque testo.

**I2. «Tu · microfono "Kalliope"» va a capo sopra le barre della voce** al telefono in arabo e in greco (e in en-XA): la
seconda riga dell'etichetta sta sulle barre che mostrano chi parla, cioè sul segno principale della tessera di «Tu». La
correzione di en-XA (l'etichetta non esce più e non copre Paola) ha spostato il difetto dentro la tessera. Foto
`foto/ar-390-tessera-tu.png`, `foto/el-390-riposo.png`, `foto/ar-390x844-riposo.png`. Correzione: l'etichetta lunga non
copre le barre (la tessera fa posto, o l'etichetta si accorcia alla parte che conta).

**I3. La pagina della scelta della lingua è un frammento su un palco vuoto.** A 1440 la bolla con i nomi e la tessera di
«Tu» stanno in alto a sinistra, occupano un terzo dello schermo; sopra, sotto e a destra solo il fondo. Al telefono la
bolla galleggia a metà altezza. Non c'è una parola visibile oltre ai nomi e al piccolo marchio (il titolo è solo per i
lettori di schermo). L'idea è buona e dentro la direzione (i nomi sono la prima frase che dici, escono dal tuo riquadro),
ma la composizione è sbilanciata e sembra l'anteprima di un componente, non una pagina: è il primo indirizzo che vede
ogni persona nuova. Foto `foto/scelta-1440-it.png`, `foto/scelta-390-ar.png`, `foto/percorso/ar-1440-01-arrivo-principale.png`.
Correzione: una composizione che regga a tutto schermo nelle due misure, con la scena della riunione riconoscibile, e
che dica in che posto si è senza bisogno di traduzione (il nome del prodotto, la riunione).

**I4. La pagina italiana scarica cinque caratteri in più.** A riposo, senza scorrere, `/it/` chiede i sottoinsiemi
«nomi» di Readex, Noto Sans Bengali, Noto Nastaliq Urdu, Geologica e Noto Sans Devanagari (20 324 byte), perché il piede
mostra i nomi delle lingue e il piede è impaginato subito. L'incarico chiedeva «una pagina italiana non deve scaricare un
byte in più»; le note dicono «arrivano solo se si mostrano quei nomi»: in una costruzione normale arrivano sempre. Prova
`/tmp/lavoro-2g-foto/it-ar/registro.json` (chiave `fonti` di `it-1440x900-riposo`). Correzione: o la pagina italiana
non li scarica finché i nomi non servono, o il proprietario accetta i 20 KB come scelta dichiarata; non la frase falsa.

### Minori

- **M1. Titolo a cinque righe e righe sfilacciate in tedesco e in greco.** A 1440 de ed el vanno su cinque righe; al
  telefono in tedesco «anderen» resta solo su una riga, che le note danno per corretto (`text-wrap: balance`). Dipende
  anche dal testo, che verrà riscritto. Foto `foto/de-390-riposo.png`, `foto/de-1440-riposo.png`, `foto/el-1440x900-riposo.png`.
- **M2. Il collegamento «Non uso Linux…» va a capo con la freccia staccata** in greco al telefono (tre volte nella
  pagina): la freccia resta sospesa a destra fra le due righe. Foto `foto/el-390-collegamento.png`.
- **M3. Nella pagina urdu il nome «العربية» è disegnato in nastaliq** nel selettore del telefono; nelle altre pagine è in
  Readex Pro. Il nome di una lingua va nel disegno della sua scrittura. Foto `foto/nome-arabo-ur-ar-it.png`.
- **M4. Urdu: il titolo pesa meno degli altri** (nastaliq al 72%, a 700 resta più leggero di Lexend 700) e a 1440 la
  didascalia esce dal primo schermo. È la scelta giusta di scrittura, ma il blocco del titolo perde la massa che ha in
  italiano. Foto `foto/ur-1440-riposo.png`, `foto/ur-1440-titolo.png`, `foto/coppie/it-ur-1440-ab.jpg`.
- **M5. Arabo: la sottolineatura del collegamento fa uno scalino** fra la parte araba e «Linux» (due caratteri con la
  linea a quote diverse). Foto `foto/ar-390-collegamento.png`.
- **M6. Cinese: la virgola e il punto pieni lasciano un buco nel titolo** («开会时，平起平坐。»): la punteggiatura dei titoli
  non è compressa. Foto `foto/zh-390-riposo.png`.
- **M7. Se il carattere urdu non arriva, il ripiego rompe le lettere** su questa macchina (DejaVu, lettere staccate): la
  pila dell'urdu non nomina un nastaliq o un carattere urdu di sistema prima di `system-ui`. Foto
  `foto/senzacaratteri-ur-1440.png`. Su Windows e Android l'urdu di sistema c'è: da provare là.
- **M8. Nel catalogo l'esempio dello specchio usa testo italiano da destra a sinistra** e mostra virgolette rotte
  («La coda punta verso «Tu»): l'esempio insegna il difetto invece della regola. Foto `foto/catalogo-specchio.png`.

---

## Che cosa funziona e va tenuto

- **Lo specchio è giusto, anche in movimento.** In arabo e in urdu la griglia si gira, «Tu» sta in alto a destra, Paola,
  Luca e Anna guardano verso «Tu», le onde e la luce partono da «Tu», la coda della bolla punta a «Tu», l'azione entra
  dal bordo sinistro, la strada della voce va da destra a sinistra, il testo nel campo cresce verso sinistra, le parole
  di una frase si accendono da destra; il triangolo ▶ resta com'è, le frecce si girano. Visto nelle sequenze
  `foto/sequenze/arrivo-ar-*`, `arrivo-ur-*`, `scorri-ar-*`, `scorri-ur-*`, `frase-ar-1440x900-foglio.jpg`, e nella barra
  `foto/zoom-ur-390-barra-azione.png` accanto a `foto/zoom-it-390-barra-azione.png`.
- **I caratteri sono scelti bene e coprono tutto.** Readex Pro (la versione araba di Lexend) fa sembrare l'arabo la stessa
  pagina; il nastaliq per l'urdu è il disegno che un lettore urdu si aspetta; Noto Sans Devanagari e Bengali con le
  legature giuste (प्रोग्राम, इंस्टॉल, स्वाभाविक); Geologica per greco e bulgaro vicina a Lexend. Lettera per lettera, nessuna
  lettera di ar ur hi bn el bg disegnata dal sistema (`foto/copertura-caratteri.txt`); alfabeti-qa: solo il cinese dal
  sistema, per scelta (`foto/alfabeti-qa-esito.txt`). Pesi veri da 300 a 700 in ogni scrittura (`foto/pesi-ur-ar-hi-el.png`).
- **Interlinee e grandezze per scrittura come token**, niente spaziatura fra lettere unite; nessun valore a mano
  (`controlla-sorgenti` verde, 22 fogli; `css_logico.py` verde).
- **Il primo schermo italiano scelto dal proprietario non è peggiorato**: a 390 identico a `341a841`; a 1440 l'unica
  differenza è quella dichiarata (la voce «Italiano ↓», le voci 18 px a sinistra); sotto, il piede con i nomi delle
  lingue (`foto/it-1440-differenze-341.png`, `foto/it-piede-341-vs-8c7.png`).
- **Il selettore nella barra** è dentro la direzione (vetro scuro, nomi a pillola, la lingua di adesso piena) e funziona:
  da tastiera si raggiunge, Invio apre, Esc chiude e il fuoco torna; al telefono sta nel menu in due colonne
  (`foto/percorso/ar-1440-06-selettore-aperto.png`, `foto/percorso/percorso-hi-390.png`).
- **La scelta della lingua funziona come deve**: la lingua del browser per prima e accesa (ar-EG → العربية, hi-IN →
  हिन्दी), la scelta si ricorda, tornare a `/` porta alla lingua ricordata, senza JavaScript i nomi sono collegamenti
  che funzionano (`foto/senzajs-senzacaratteri-390.png`).
- Nessuno scorrimento orizzontale a nessuna larghezza provata, nessun errore nella console, in nessuna lingua.

---

## La scheda (la home nelle altre scritture)

**A. L'idea.** A1 «Una riunione in un mondo di un solo colore» tiene in ogni scrittura: stessa scena, stessi colori,
stessa coreografia, girata dove il verso conta (`foto/coppie/it-ar-1440-ab.jpg`, `it-ur-1440-ab.jpg`, `it-hi-390-ab.jpg`,
`it-zh-390-ab.jpg`). A2 Il momento che resta: la bolla che vola dalla tessera di «Tu», ora da destra in arabo e urdu
(`foto/sequenze/arrivo-ar-1440x900-foglio.jpg`, 6 s). A3 In arabo nei primi cinque secondi: che cos'è sì (titolo e
riunione al lavoro), per chi sì, che cosa fare sì (pulsante rosa); nella pagina della scelta: che cos'è no (solo i nomi e il
marchio piccolo). A4 Senza nome si riconosce: la sala bordeaux con le quattro tessere e la bolla. A5 Il prodotto si vede al
lavoro: interfaccia animata con la voce vera, in ogni lingua.

**B. Estetica** (prova: le coppie e le foto a riposo). B1 sì in ar, hi, zh; in parte in ur (titolo più leggero). B2 sì: le
scritture parlano con la stessa famiglia d'aspetto; la pagina della scelta no (sembra un componente staccato). B3 sì; in
urdu le righe alte allungano la pagina ma non la affollano. B4 sì. B5–B8 sì nella home (viva come in italiano); la scelta è
ferma e timida a riposo. B9–B11 sì, invariati. B12 sì nelle scritture; no dove la barra si rompe (B1) e dove l'etichetta
copre le barre (I2). B13 sì. B14 in parte: versione rovesciata, freccia staccata, scalino della sottolineatura, virgole
cinesi. B15 sì.

**C. Esperienza d'uso.** C1 sì nella home; in parte nella scelta. C2 sì (pulsante e selettore a portata, anche da tastiera).
C3 sì (selettore aperto e chiuso, lingua di adesso segnata). C4 sì. C5 sì: lo stesso «palco» girato per chi legge da destra
è raro nei siti di prodotto. C6 sì: freccia «indietro/avanti» girata, ▶ no, come vuole la convenzione. C7 contenuto
invariato; struttura e navigazione buone salvo B1; aspetto buono; funzionamento buono (nessun errore); interattività e
movimento integri in ogni lingua.

**D. Movimento.** D1 In arabo: il titolo entra riga per riga dal lato destro, la griglia si compone, la bolla appare, il
campo si scrive da destra, poi la bolla vola (`arrivo-ar-*`). D2 Scorrendo l'azione entra da sinistra; premendo una frase le
parole si accendono da destra (`scorri-ar-*`, `frase-ar-*`). D3 Gli stessi scopi dell'italiano. D4 Togliendoli si perderebbe
il racconto della voce che va agli altri: restano. D5 Uguale all'italiano (stesse durate; nastaliq e devanagari non
rallentano a vista su questa macchina; non provato su un dispositivo lento). D6 Sì, la bolla. D7 Sì: forma e movimento
seguono la scrittura.

**E. Stile di default.** E1 Pulsanti a pillola (nella home, nel selettore, nella scelta). E2 Vengono dalla direzione 2 scelta
dal proprietario e dai suoi componenti, non da questo lavoro: nessun tratto di default nuovo.

---

## Il confronto con i siti veri

Visitati con **Chromium senza finestra** (Playwright 1.60, nessun browser interattivo MCP in questa sessione), primo
schermo e pagina fino a sei schermi alle due misure, 17/11/2026 alle 02:20 circa UTC (`foto/riferimenti/*-primo.png` e
`*.json` con indirizzo finale, `lang`, `dir`, caratteri e misure dei titoli):

- **Apple EAU in arabo**, `https://www.apple.com/ae-ar/` (ar-AE, rtl): SF Pro AR, titoli 34/50 px (1,47); un avviso di
  paese in italiano copre la barra.
- **Careem**, `https://www.careem.com/ar-AE/` → `/ar-ae/` (ar-AE, rtl): Careem Sans; primo schermo quasi solo marchio, un
  avviso dei cookie in basso.
- **Tabby**, `https://tabby.ai/ar-AE` (ar, rtl): Tabby Sans Display/Text, titolo 60/76 px (1,27), testo 20/32.
- **WhatsApp in hindi**, `https://www.whatsapp.com/?lang=hi_IN` (hi, ltr): WhatsApp Sans Var, titolo 80/96 a 1440 e 44/52,8
  al telefono, peso 400.
- *BBC Urdu* (`https://www.bbc.com/urdu`): la finestra del consenso copriva tutto; letto solo che usa «BBC Reith Qalam» e il
  testo a 16/26. **Non conta come visita.**

Coppie nei due versi (`foto/coppie/*-ab.jpg` e `*-ba.jpg`):
- **Kalliope arabo e Tabby (1440)**: i titoli hanno lo stesso nero e interlinee simili (1,34 contro 1,27); Tabby ha un
  arabo disegnato su misura, più compatto e con più carattere; Readex è più geometrico e più «di famiglia» con il latino.
  La pagina di Kalliope è più viva (la riunione al lavoro). **Regge il confronto**; la risposta non cambia scambiando i lati.
- **Kalliope arabo e Apple (390)**: Apple ha più aria (1,47) e un arabo di sistema su misura; Kalliope più denso ma ordinato.
  Regge; stessa risposta nei due versi.
- **Kalliope hindi e WhatsApp (390 e 1440)**: WhatsApp usa un devanagari leggero e molto grande con tanta aria intorno;
  Kalliope un devanagari nero a 62 px, più fitto. Le legature sono giuste in entrambi. Regge come mestiere; WhatsApp è più
  arioso nel titolo. Stessa risposta nei due versi.
- **Con l'italiano (sei coppie)**: in arabo, hindi, cinese e greco è la stessa pagina, non un ripiego; in urdu è la stessa
  pagina con un titolo più leggero. Nessuna risposta cambia scambiando i lati.

In assoluto: fra pagine di prodotto curate in arabo e in hindi la home starebbe al suo posto; ciò che stona sono i
dettagli (B1, I1, I2), non l'impianto. Ciò che ha e gli altri non hanno: la scena del prodotto al lavoro girata per intero
nel verso della lettura, e l'urdu in nastaliq in una pagina di prodotto.

---

## Il percorso di una persona

- **Arabo, computer** (`foto/percorso/ar-1440-*`): all'indirizzo principale العربية è prima e accesa; primo Tab sul marchio
  (porta alla stessa pagina), secondo su العربية; un clic → `/ar/`, scelta ricordata; la home si legge fino in fondo; il
  selettore nella barra apre il pannello e porta a `/it/`; tornando a `/` si va a `/it/` (la scelta ricordata). Nessun
  errore. Dove inciampa: la pagina della scelta non dice niente di sé (I3); sul primo schermo la versione è rovesciata (I1).
- **Hindi, telefono** (`foto/percorso/percorso-hi-390.png`): हिन्दी prima e accesa; la home in devanagari si legge bene; il
  menu apre, la scelta della lingua sta in fondo al menu in due colonne. Nessun errore.
- **Tastiera**: selettore raggiungibile, Invio apre, Esc chiude, il fuoco torna (al telefono torna su «Menu»).
- **Senza JavaScript**: la scelta funziona (collegamenti), la home si legge in ar e hi.
- **Senza caratteri scaricati**: arabo, hindi e greco restano leggibili col sistema; l'urdu su questa macchina no (M7).

---

## Le note dell'autore, lette dopo

`progresso.md` del commit; le foto in `foto/` non sono nel commit (solo i JSON delle sequenze): le ho guardate nella
cartella di lavoro.

- **Dove affermano più di quanto ho visto.** (1) «a 1440 con l'azione in barra il menu finiva sul marchio → corretto»: in
  en-XA a 1440 il menu sta ancora sull'icona, e in de/el/bg si rompe fra 960 e 1180 (B1); il loro foglio en-XA a 1440 è
  troppo piccolo per vederlo, e le larghezze di mezzo sono dichiarate non provate. (2) «le etichette vanno a capo dentro il
  riquadro»: vero, ma sopra le barre della voce (I2). (3) «righe del titolo che lasciano una parola sola («anderen»): `text-wrap:
  balance`»: al telefono «anderen» resta sola (M1). (4) «Una pagina italiana non scarica un byte in più»: ne scarica 20 324
  (I4); la misura è stata fatta con la costruzione `--no-selector`, non con quella di tutti i giorni. (5) «`[lang]` … un nome
  rilegge la pila della sua scrittura»: «العربية» in nastaliq nella pagina urdu (M3).
- **Dove corrispondono.** La tabella dello specchio corrisponde a ciò che ho visto in movimento, punto per punto; i caratteri e
  i byte corrispondono; l'italiano identico salvo il selettore corrisponde (`confronta-scelta`); 0 errori corrisponde.
- **Non notato dall'autore:** la versione rovesciata da destra a sinistra (I1), lo scalino della sottolineatura (M5), il
  ripiego dell'urdu (M7), l'esempio del catalogo (M8). Le sequenze in urdu le ho registrate io (l'autore ha fatto arabo e
  hindi).

---

## Ordine, dal più forte al più debole

1. **Arabo**: stessa pagina, carattere della stessa famiglia, specchio giusto anche nel movimento; restano I1 e I2.
2. **Hindi e bengali**: stessa pagina, devanagari e bengali corretti e solidi; nessun difetto proprio trovato.
3. **Cinese**: stessa pagina con il carattere di sistema; solo la punteggiatura del titolo (M6).
4. **Urdu**: la scrittura giusta e lo specchio giusto; titolo più leggero, nome arabo in nastaliq, versione rovesciata.
5. **Greco e bulgaro**: Geologica vicina a Lexend; titolo a cinque righe, etichetta sulle barre, barra rotta fra 960 e 1180.
6. **Tedesco e finlandese**: Lexend com'è; barra rotta alle larghezze di mezzo, righe del titolo sfilacciate.
7. **La pagina della scelta della lingua**: l'idea c'è, la composizione no (I3).

**Che cosa deve correggere l'autore (ruolo di direzione dell'incarico 2) prima di mostrare:** B1. Poi, nello stesso giro,
I1, I2, I3; I4 corretto o deciso dal proprietario. I minori arrivano al proprietario come scelte.

---

## Non verificato

- Firefox e WebKit per le scritture nuove (solo Chromium); dispositivi veri; il cinese con PingFang o YaHei (qui Noto Sans
  CJK SC); il nastaliq su un dispositivo lento; testo al 200% e zoom; le larghezze di mezzo del telefono e del tablet (ho
  misurato solo la barra fra 960 e 1440); lettori di schermo; l'audio (nessuna uscita su questa macchina).
- bn, bg e fi guardati solo nella barra, nelle misure dei caratteri e nella copertura delle lettere, non stato per stato.
- I riferimenti visitati senza finestra e senza gesti oltre allo scorrimento; BBC Urdu non visitata (consenso).
- La qualità delle traduzioni di prova (fuori dal giudizio per incarico).

---

## Riassunto per il proprietario

### Problemi
- **Bloccante: la barra in alto si rompe in tedesco, greco e bulgaro** su schermi larghi fra 960 e 1180 pixel, dopo aver
  scorso: le voci escono dallo schermo e finiscono sopra il marchio. Era una delle cose da correggere.
- **Importante: in arabo e in urdu la versione si legge al contrario** («rc.1-0.1» invece di «0.1-rc.1»), anche sul primo
  schermo.
- **Importante: al telefono, in arabo e in greco, la scritta «Tu · microfono "Kalliope"» va a capo sopra le barre della voce.**
- **Importante: la pagina per scegliere la lingua è troppo vuota**: un gruppo di nomi in alto a sinistra, il resto fondo, e
  nessuna parola che dica dove sei.
- **Importante: la pagina italiana scarica 20 KB in più** (i nomi delle lingue in fondo); da correggere o da accettare.
- **Minori**, come scelte: titoli a cinque righe in tedesco e greco, una freccia staccata in greco, il nome arabo disegnato
  nello stile urdu nella pagina urdu, una sottolineatura a scalino in arabo, le virgole cinesi larghe nel titolo.

### Che cosa funziona
- **La home resta la stessa pagina in ogni scrittura**: arabo, urdu, hindi, cinese, greco, tedesco.
- **In arabo e in urdu tutto si gira nel verso giusto**, anche il movimento: la tua tessera a destra, gli sguardi, la
  bolla che vola, le parole che si accendono da destra. Il tasto ▶ resta com'è.
- **Un carattere vero per ogni scrittura**, della stessa famiglia d'aspetto di Lexend; l'urdu nel suo stile (nastaliq).
- **La tua home italiana è rimasta uguale**, salvo la voce «Italiano ↓» nella barra.
- La scelta della lingua mette prima quella del browser, si ricorda, funziona con la tastiera e senza JavaScript.

### Confronto e limiti
- Accanto a Tabby e Apple in arabo e a WhatsApp in hindi la home regge; loro hanno caratteri disegnati su misura e più aria.
- Provato solo in Chromium, senza dispositivi veri e senza audio.
