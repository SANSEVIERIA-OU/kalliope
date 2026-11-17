# Secondo sguardo · la pagina «non ancora» (incarico 3a-s)

Giudice: ruolo design-judge, che non ha reso né costruito la pagina. Data: 17/11/2026. Scritto mentre guardavo; le note
di chi ha corretto e costruito le ho lette solo alla fine (ultima sezione).

**Che cosa ho guardato.** Il commit `b9ba336`, estratto in una copia (`git archive` in `/tmp/lavoro-3as-radice`) e
costruito con `tools/site.py` in `/tmp/lavoro-3as-sito`, pagina `/it/non-ancora/`; come termine di confronto la home
dello stesso commit. Tutte le prove sono mie, registrate da capo: nessuna foto di chi ha corretto o costruito. I nomi
sotto sono relativi a questa cartella.

- Sequenze (`sequenza.mjs`, Chromium): arrivo, scorrimento intero (12 s), gesto «Ascolta Giulia», a 1440×900 e
  390×844, con video: `sequenze/arrivo/`, `sequenze/scorri/`, `sequenze/ascolta/`.
- Pagina intera dopo averla scorsa, e la home accanto: `foto/`.

## Prime impressioni, prima di rileggere il primo giudizio

- L'arrivo è quello di prima: titolo a righe a 0,25–0,5 s, riquadri a 1–1,5 s, la bolla a 2–3 s, «Kalliope · non c'è»
  a 3 s, poi fermo (`sequenze/arrivo/arrivo-1440x900-foglio.jpg`, `arrivo-390x844-foglio.jpg`). La riga «Oggi:» ora
  dice anche «Non ancora provata in una riunione vera con Zoom, Teams o Meet» (`sequenze/arrivo/fotogrammi/arrivo-1440x900-f09.jpg`).
- La strada: dopo il microfono tratteggiato, «Zoom, Teams, Meet» e «Gli altri ti sentono» sono spenti e tratteggiati,
  fuori dal riquadro «Su Windows e macOS, oggi» (`sequenze/scorri/fotogrammi/scorri-1440x900-f05.jpg`).
- Il tratto chiaro: la pillola ora è «Copia l'indirizzo di questa pagina»; il feed è sceso in una nota che dice che
  cos'è, che segnala anche le versioni per Linux e che è in inglese. Nel pannello compare prima la riga della versione,
  poi sopra di lei si apre la riga tratteggiata «Windows e macOS · compariranno qui, in cima · nessuna data»
  (`sequenze/scorri/fotogrammi/scorri-1440x900-f08.jpg` → `f09.jpg`; il dettaglio in I6).
- La chiusura non invita più a installarlo sul Linux di un altro; resta l'ascolto, «Tutte le frasi, anche con Marco» e
  «stato e limiti» (`sequenze/scorri/fotogrammi/scorri-1440x900-f12.jpg`).
- L'ascolto in Chromium: «Carico…» a 0 s, «Pausa» da 0,25 s, la bolla si accende parola per parola, barre e archi
  passano sui riquadri, fine a circa 5,5 s e ritorno a «Ascolta Giulia» (`sequenze/ascolta/ascolta-1440x900-foglio.jpg`).
- Nessun errore nella pagina e nessuno scorrimento di lato a 1440 e 390 (`foto/`, misure nel registro).

Altre prove mie, tutte su questo commit (nomi relativi a questa cartella):

- Arrivo fitto della barra del microfono (2,2–4,6 s): `sequenze/arrivo-fitto/barra-microfono-fitto.jpg`.
- Il comando principale premuto davvero, fino al pannello delle versioni: `sequenze/quando/` (1440×900),
  `sequenze/quando-telefono/` (390×844).
- Schermi bassi, primo schermo e ascolto in corso (390×667, 360×640, 320×568, 844×390, 915×412, 326×326, 1440×500,
  1280×500, 1024×600): `bassi/`; le due soluzioni della scelta del punto 5, rifatte da me: `bassi/scelta/`.
- Griglia del primo schermo: 63 misure da telefono (320–760 × 700–844) e 48 da computer (761–1440 × 500–768): il comando
  principale è nello schermo in tutte (registro in `/tmp/lavoro-3as-qa/`).
- Esame dell'impaginazione (`esame-impaginazione.mjs`, Chromium, testo al 100%) alle 27 larghezze delle soglie
  (`soglie.mjs`: 320–1920), con la pagina a riposo e cinque stati (menu, ascolto, errore del suono, copia riuscita, copia
  non riuscita): 152 casi puliti, nessun difetto.
- Il suono che non parte (richiesta interrotta, file rotto) e «Riprova»: `errori/`. Larghezza del pulsante negli stati:
  misurata (sotto, M2).
- Percorso con la tastiera e al telefono, copia dell'indirizzo con gli appunti veri: `percorso/`.
- Senza JavaScript, senza fogli di stile, senza gli script della pagina, senza caratteri, movimento ridotto:
  `robustezza/`. Firefox e WebKit a 1440×900 e 390×844: `motori/`. Pseudo-lingue `en-XA` e `ar-XB`: `pseudo/`.
- Il catalogo aperto e provato (37 pulsanti della sezione delle pagine interne, 33 premuti, nessun errore): `catalogo/`.
- `confronta-scelta.mjs` sulla home: prima e dopo la correzione (`1c8b645` → `0cf5c64`) e prima e dopo la costruzione
  (`b140dcd` → `b9ba336`), in cima e a 1800 px, 1440×900 e 390×844: uguale (`scelta/correzione-*`,
  `scelta/costruzione-*`). Sulla pagina, direzione corretta contro costruzione a 1440×900, 390×844, 390×667, 844×390:
  uguale, 0% di pixel diversi (`scelta/na-direzione-contro-costruzione/`). `controlla-sorgenti.mjs`: verde (23 fogli).
- Coppie nei due versi: primo schermo con R01, R03, R05 a 1440 e 390; il tratto «Non promettiamo date» con R05 (Apps &
  Plugins), R03 (Get started) e con «Che cosa serve» della home: `coppie/`.

---

## Lo stato dei problemi del primo giudizio

Con la stessa prova con cui erano stati trovati, rifatta da me.

| | Problema | Stato | Come lo vedo, con la prova |
|---|---|---|---|
| **I1** | Manca «non ancora provata in una riunione vera» | **chiuso** | La riga «Oggi:» lo dice nel primo schermo, alle due misure (`sequenze/arrivo/fotogrammi/arrivo-1440x900-f09.jpg`, `arrivo-390x844-f09.jpg`); nella strada «Zoom, Teams, Meet» e «Gli altri ti sentono» sono spenti, tratteggiati e fuori dal riquadro «oggi» (`sequenze/scorri/fotogrammi/scorri-1440x900-f05.jpg`); l'invito a installarlo sul Linux di un altro non c'è più (`f12.jpg`). |
| **I2** | «non ancora» per ciò che il prodotto non è | **chiuso** | «Kalliope è un programma per il computer: non è un servizio online né un'estensione del browser» (`scorri-1440x900-f05.jpg`, in basso). Resta «Non esiste ancora per telefono e tablet»: è quello che dicono la home e il progetto al §9 («Esclusi per ora») e in P6, mentre il §1.4 mette il telefono fra ciò che Kalliope non è. Non è un'invenzione della pagina; se il proprietario vuole il telefono come confine, cambia una parola qui e nella home. |
| **I3** | La decisione finisce in un file XML | **chiuso** | «Come saperlo quando arriva» porta al tratto chiaro, dove il comando è «Copia l'indirizzo di questa pagina» e funziona con gli appunti veri (al computer con la tastiera e al telefono con il tocco: `percorso/copia-1440x900.png`, `percorso/telefono-percorso.jpg`); senza JavaScript al suo posto c'è «Salva questa pagina tra i preferiti» (`robustezza/`). Il feed è sceso in una nota che dice che cos'è, che segnala anche le versioni per Linux e che è in inglese, accanto alla pagina delle versioni su GitHub. Il percorso di P6 (`progetto.md`: avvisata senza account e senza lasciare dati, nessuna lista d'attesa) è rispettato. |
| **I4** | Il catalogo non mostra ciò che la pagina ha aggiunto | **chiuso** | Sezione «Pagine interne: la cornice e i pezzi della pagina «non ancora»»: cornice con il primo schermo vivo a sei misure e la tabella delle posizioni misurate, riunione ferma, strada ferma con le varianti, elenco delle versioni con la copia riuscita, non riuscita, senza JavaScript e con più versioni, ascolto con riposo, carica, suona, pausa, sopra, fuoco, premuto, i tre messaggi d'errore, la bolla non detta, accesa e detta, il ripiego senza JavaScript (`catalogo/cat-panoramica-1.jpg` … `-5.jpg`). 33 pulsanti premuti, nessun errore (`catalogo/catalogo-dopo-3.png`). |
| **I5** | Sugli schermi bassi il primo schermo non ha comandi | **chiuso** | A 390×667, 360×640, 320×568 e 844×390 i comandi vengono prima della scena e stanno nello schermo (`bassi/primo-telefoni-bassi.jpg`, `bassi/primo-844x390.png`, `bassi/bassi.json`); a 326×326 la pillola sta intera, il collegamento sotto il bordo. Nella griglia di 111 misure il comando principale è sempre nel primo schermo. A 844×390 la scena esce tutta dal primo schermo: è la regola «vince il comando», accettata. |
| **I6** | Il tratto della decisione è fermo e generico | **chiuso** | Ora il pannello racconta: l'ultima versione arriva in cima con un alone, resta, scende; si apre il posto tratteggiato e vi si scrive «Windows e macOS · compariranno qui, in cima · nessuna data» (`sequenze/quando/quando-1440x900-foglio.jpg`, 0,3–2,4 s; `sequenze/quando-telefono/quando-390x844-foglio.jpg`). La prova della rimozione toglie significato («comparirà in cima» detto dal movimento). Resta il tratto più quieto della pagina come composizione (colonna di testo e pannello scuro, molto vuoto in mezzo a 1440), ma non più senza un momento. La seconda metà della proposta (il posto che risponde al comando) non si vede: N5. Vedi anche N3 per un fotogramma goffo. |
| **M1** | Quando l'audio non si carica la scena non lo dice | **chiuso** | Richiesta interrotta e file rotto: sotto il comando compare il messaggio nella lingua della pagina, con «Riprova» e il file da scaricare; la bolla resta grigia, nessuna parola accesa; «Riprova» con il file buono fa partire la voce (`errori/errore-interrotta-1440x900.png`, `errori/errore-rotto-390x844.png`, `*-riprova.png`). In Firefox, senza uscita audio su questa macchina, compare «La registrazione si è interrotta» (`motori/firefox-1440-quattro.jpg`). |
| **M2** | Il pulsante dell'ascolto cambia larghezza | **chiuso** | 211 px in riposo, carica, suona e pausa a 1440; il collegamento accanto resta a x 691. Al telefono 350 px fermi. La correzione ha però un effetto al telefono: N2. |
| **M3** | Al telefono la didascalia si riduce a «Ricostruzione» | **chiuso in parte** | Ora sta subito sotto la scena che descrive, non sopra; resta una parola sola, e la frase che spiega la scena al telefono non c'è (`sequenze/arrivo/fotogrammi/arrivo-390x844-f09.jpg`). |
| **M4** | La frase della bolla nel primo schermo è poco leggibile | **aperto (scelta del proprietario)** | Uguale: grigio su rosa pallido (`arrivo-1440x900-f09.jpg`). È voluto; resta da mostrargli. |
| **M5** | Premendo subito il suono parte mentre la scena entra | **chiuso** | Al clic la riunione arriva subito intera: a 0 s si vedono i quattro riquadri e «Carico…» (`sequenze/ascolta/fotogrammi/ascolta-1440x900-f01.jpg`, `ascolta-390x844-f01.jpg`). |
| **M6** | Senza fogli di stile le figure diventano enormi | **chiuso** | Senza CSS la pagina è alta 2.906 px a 1440 (era 19.555), figure in misura, nessun errore dello script (`robustezza/senza-css-1440-meta.jpg`). Resta solo che in quello stato il pulsante dell'ascolto legge tutte le sue etichette di seguito («Ascolta GiuliaCarico…PausaRiprendi»): uno stato quasi impossibile, non lo conto. |
| **M7** | Con `dir=rtl` la freccia non si gira | **chiuso** | In `ar-XB` la freccia di «Intanto, senti la voce» punta a sinistra, alle due misure (`pseudo/ar-XB/primo-1440x900.png`, `primo-390x844.png`). |
| **M8** | «Installa sul Linux di una persona vicina», «Non consigliamo altri prodotti» | **chiuso** | Tolte, secondo la decisione di chi coordina sul dubbio E («non ancora», nessun consiglio né alternativa, `STATO.md` 16/11). |

---

## Problemi nuovi, in ordine di gravità

Nessun problema bloccante, nessuno importante. Cinque minori, in quest'ordine: N5, N1, N2, N3, N4 (N5 l'ho trovato per
ultimo, controllando una nota di chi ha corretto, e l'ho messo in cima: è una correzione dichiarata che sulla pagina non
accade).

### Minori

**N5 · Dopo «Copia» il posto tratteggiato non si accende: lo fa solo nel catalogo.**
- Dove: il pannello delle versioni nella pagina viva. Premendo «Copia l'indirizzo di questa pagina» la riga «Windows e
  macOS» prende la classe del ricordo, ma il suo tratteggio resta com'è: prima, a 0,15 s e a 1,6 s il movimento attivo
  sul tratteggio resta quello dell'apertura e il colore non cambia (`percorso/copia-posto/copia-posto-foglio.jpg`,
  sei istanti da 0,1 a 2,5 s, tutti uguali). Nel catalogo, nella prova «il posto che si accende quando si copia», il
  tratteggio si accende davvero (lì il pannello non ha le classi della pagina viva). La causa che si legge: la regola
  dell'apertura del posto, più specifica, copre quella del ricordo.
- Perché: è la metà del momento dell'I6 che collega il comando al pannello («lo troverai qui»), dichiarata fatta da chi
  ha corretto; e il catalogo mostra uno stato che la pagina non mostra mai. La conferma scritta «Copiato: …» c'è, quindi
  alla persona non manca niente di essenziale.
- Correzione: dopo la copia il posto si accende nella pagina viva come nel catalogo, provato nella pagina e non solo nel
  catalogo.

**N1 · Sugli schermi bassi, mentre la voce suona, «Pausa» esce dallo schermo sotto il dito.**
- Dove: 844×390 e 915×412 (telefono girato): premendo «Ascolta Giulia» la pagina scorre da sé per mettere la bolla
  sotto la barra e il comando, appena premuto, finisce 58 px sotto il bordo (`bassi/scelta/844x390-prima-A-B.jpg`, primo e
  secondo riquadro; `bassi/ascolto-844x390.png`). A 326×326 manca per 2 px (`bassi/ascolto-telefoni-bassi.jpg`, quarto).
- Perché: chi ha premuto si vede portar via il comando; per fermare la voce deve scorrere. La frase però dura circa 5 s
  e finisce da sola, e prima di premere la bolla era già sotto la barra: è la scelta del punto 5, sotto.
- Correzione (ruolo di direzione): a queste altezze la riunione più bassa, così che bolla, riquadri e «Pausa» stiano
  insieme (a 844×390 mancano circa 50 px; i riquadri sono alti 172 px, come al computer, mentre al telefono dritto sono
  78); a 326×326 basta lo spazio: la differenza la fanno i due margini di 8 px sopra e sotto.

**N2 · Al telefono, fuori dal riposo, l'etichetta del pulsante dell'ascolto non è più al centro.**
- Dove: 390×844 e i telefoni bassi, stati «Carico…», «Pausa», «Riprendi»: con «Pausa» il tondo e la parola stanno a
  84 px dal bordo sinistro e a 165 dal destro di una pillola larga 350 (`bassi/ascolto-telefoni-bassi.jpg`;
  `sequenze/ascolta/fotogrammi/ascolta-390x844-f05.jpg`). Al computer lo stesso spazio fermo resta tutto a destra di
  «Pausa» (95 px vuoti, `sequenze/ascolta/fotogrammi/ascolta-1440x900-f07.jpg`), meno visibile.
- Perché: nasce dalla correzione di M2 (la larghezza ferma è quella dell'etichetta più lunga); al telefono, dove la
  pillola è larga quanto lo schermo, si vede come uno sbilanciamento.
- Correzione: al telefono l'etichetta centrata nella pillola in ogni stato, senza che la pillola cambi misura.

**N3 · Nel pannello delle versioni, per un istante, il tratteggio attraversa la riga della versione.**
- Dove: circa 1,8 s dopo che il pannello entra, mentre «Kalliope 0.1-rc.1» scende e il posto tratteggiato si apre, la
  linea tratteggiata passa sopra il nome e la data (`sequenze/quando/fotogrammi/quando-1440x900-f07.jpg`; al telefono
  `percorso/telefono-percorso.jpg`, al centro). Dura meno di mezzo secondo.
- Perché: è l'unico fotogramma goffo di un movimento altrimenti pulito; si vede proprio nel momento che la pagina vuole
  far notare.
- Correzione: il posto tratteggiato si disegna sotto la riga che scende, o comincia ad aprirsi quando la riga è passata.

**N4 · «L'elenco si aggiorna da solo», ma accanto al numero che si aggiorna la nota è scritta a mano.**
- Dove: il pannello delle versioni: «Kalliope {versione}» e la data vengono dalla pubblicazione (si ricostruisce il sito
  dopo ogni versione, `.github/workflows/pages.yml`), «Versione di prova · solo Linux» no.
- Perché: la pagina promette che l'elenco si aggiorna da solo; alla prima versione che non è di prova la riga direbbe
  «Kalliope 0.1 · Versione di prova» finché qualcuno non la corregge. La home ha la stessa forma («versione di prova
  0.1-rc.1») e `progetto.md` P10 chiede a chi pubblica di rileggere le frasi di stato: è una questione del sistema, non di
  questa pagina sola.
- Correzione: la nota segue il dato della pubblicazione (di prova o no), o la frase dice che cosa si aggiorna.

### Osservazioni che non sono di questa pagina (al lavoro sulle lingue, in correzione)

- La riga di stato del catalogo dice «Lingue: lingue: Cannot read properties of null (reading 'classList')»: c'era già al
  commit `b140dcd`, prima della costruzione di questa pagina. La sezione delle pagine interne non ne risente.
- La barra mostra «Italiano» anche con una sola lingua pubblicata, contro la decisione di chi coordina del 17/11; e in
  `en-XA` al telefono il testo della pillola principale arriva ai bordi della pillola (`pseudo/en-XA/telefono-en-XA.jpg`):
  barra e pillole per il testo lungo sono già nella correzione delle lingue.

---

## Che cosa la correzione e la costruzione hanno aggiunto, guardato come la prima volta

- **Il tentativo su «Kalliope» nell'arrivo.** Prima era un lampo; ora è un gesto che si legge: a 2,6 s il segno della
  scelta scivola da «Microfono del computer» a «Kalliope», a 3,0 s si svuota in un anello tratteggiato con un'onda che si
  allarga e non arriva a nessuno, compare «non c'è», a 3,8–4,0 s il segno torna indietro
  (`sequenze/arrivo-fitto/barra-microfono-fitto.jpg`). Breve, una volta sola, dice la causa con il movimento. È il
  miglioramento più bello della correzione. A 3,8 s il segno semitrasparente passa sopra le due etichette: un istante.
- **I comandi prima della scena sui telefoni bassi.** La scelta giusta; il primo schermo resta pulito, con la bolla e
  l'inizio della riunione che invitano a scorrere (`bassi/primo-telefoni-bassi.jpg`). A 844×390 la scena sparisce del
  tutto dal primo schermo: si perde l'idea «si capisce senza leggere», ma restano risposta, comando e stato.
- **Il pannello che racconta «in cima».** Vedi I6. Funziona alle due misure e anche premendo il comando del primo schermo
  (la pagina scorre al tratto e il racconto parte lì).
- **Il messaggio quando il suono non parte.** Dentro il mondo della pagina (riquadro scuro con bordo, «Riprova» a pillola
  chiara, il file come collegamento), vicino al comando che l'ha causato (`errori/`).
- **Il ripiego senza JavaScript** del tratto delle versioni: la frase dei preferiti al posto del pulsante. Pulito.
- **Larghezze di mezzo e altezze.** Nessun difetto alle soglie né nella griglia; nessuno scorrimento di lato; tre
  motori senza errori della pagina (`motori/`).

---

## Il giudizio a coppie

Fogli in `coppie/`, ognuno nei due versi. Il primo schermo è quello giudicato la prima volta con in più la riga dello
stato e il tentativo visibile: i confronti di allora reggono e li ho rifatti per controllo. Ho rifatto quello che non
reggeva: il tratto della decisione.

| Contro | Estetica | Esperienza | Movimento | Cambia scambiando i lati? |
|---|---|---|---|---|
| **R01 Signs**, primo schermo (`na-R01-1440-*`, `na-R01-390-*`) | Non regge in impatto: una parola gigante e una figura sola, più memorabile | Meglio: risposta, causa e comando in un colpo d'occhio | Non regge in spettacolo; regge in significato, e il tentativo su «Kalliope» ora è un gesto | No |
| **R03 ElevenAgents**, primo schermo (`na-R03-*`) | Regge: R03 più rifinito con le foto vere, ma generico; questa riconoscibile | Regge | Meglio: R03 si limita a caricare | Sul mestiere la differenza resta piccola: al proprietario |
| **R05 LALAL.AI**, primo schermo (`na-R05-*`) | Meglio | Regge (R05 ha lo strumento vero nel primo schermo) | Meglio | No |
| **R05**, tratto «Apps & Plugins» contro «Non promettiamo date» (`sotto-quando-R05-1440-*`) | Meglio: R05 è un titolo centrato e un pulsante giallo su nero, piatto | Meglio: qui si capisce dove arriverà la notizia e si tiene l'indirizzo; R05 rimanda altrove | Meglio: R05 è fermo | No |
| **R03**, tratto «Get started» (`sotto-quando-R03-1440-*`) | Regge: R03 ordinato a tre colonne, generico; questo ha un oggetto che racconta | Regge | Meglio | No |
| **La home**, «Che cosa serve» (`sotto-quando-home-1440-*`) | Non regge del tutto: la home sovrappone la finestra di Kalliope alla riunione, più ricca; qui una colonna di testo e un pannello con molto vuoto in mezzo | Regge: un comando solo, chiaro | Regge: il racconto del pannello vale l'animazione della home | No |

**In assoluto.** Fra i vincitori della categoria starebbe al suo posto come pagina interna di un prodotto curato, e
dice «non ancora» meglio di tutti quelli che ho visto: dentro la scena del prodotto, con un movimento che mostra la causa.
Goffo: il pulsante dell'ascolto sbilanciato al telefono fuori dal riposo (N2), il tratteggio che taglia la riga per un
istante (N3). Generico: le figure della riunione (vengono dalla home). Sbilanciato: appena, il tratto chiaro a 1440 con il
vuoto fra testo e pannello. Datato o rumoroso: niente. Non è la versione ricolorata di un riferimento: impianto, colori e
forme vengono dalla home scelta.

---

## La scheda, dove è cambiata rispetto al primo giudizio

- **A3** che cosa fare dopo: sì a ogni misura provata (prima no sugli schermi bassi).
- **B7** non più piatto il tratto della decisione: in parte → sì. **B14** in parte (N2, N3, M3).
- **C2** sì anche a 390×667, 360×640, 320×568, 844×390 e nella griglia. **C3** sì: anche l'errore si vede (M1).
  **C4** sì: la decisione è un gesto che una persona qualunque sa fare (copiare o salvare l'indirizzo).
- **D1** in più, a 2,6–4,0 s, il segno che va su «Kalliope», si svuota e torna. **D4** l'entrata del pannello delle
  versioni ora fa perdere significato se tolta. **D6** sì, due momenti: la voce che si ferma al microfono e il tentativo
  su «Kalliope».
- **E** invariata: pillole giustificate da R01, R03 e dalla home; dissolvenza dei titoli all'entrata, la sola cosa uguale
  in ogni tratto, ma ogni tratto ha poi un movimento suo.

---

## La pagina intera

- **L'idea tiene fino al piede?** Sì: la riunione ferma con il tentativo che fallisce → la voce che si ferma al microfono
  → il posto che si apre in cima all'elenco → la stessa frase, detta (`sequenze/scorri/scorri-1440x900-foglio.jpg`).
- **Ogni tratto è vivo per un motivo?** Sì, ora anche il tratto delle versioni. Niente si muove senza motivo; niente in
  ciclo continuo, salvo gli occhi delle figure che battono ogni tanto.
- **Il primo schermo scelto è rimasto uguale?** Sì: la home è identica prima e dopo la correzione e prima e dopo la
  costruzione, in cima e a 1800 px, alle due misure (`scelta/`).
- **Schermo basso?** Sì per il primo schermo (I5). Durante l'ascolto, sugli schermi bassi girati, vince la bolla (N1 e
  punto 5).
- **Il percorso di P6, rifatto da me.**
  - *Al computer (1440×900, tastiera).* Arrivo: la risposta a 0,5 s, la causa a 3–4 s nella barra del microfono. Tab:
    salto al contenuto, marchio, sei voci, poi «Come saperlo quando arriva» con il contorno chiaro visibile
    (`percorso/fuoco-comando-1440x900.png`); Invio porta al tratto chiaro, il racconto del pannello parte, Tab va su
    «Copia l'indirizzo di questa pagina», Invio copia l'indirizzo vero e lo dice sotto
    (`percorso/fuoco-dopo-invio-tab-1440x900.png`, `percorso/copia-1440x900.png`). Poi i due collegamenti del feed con il
    contorno scuro su chiaro, «Ascolta Giulia» con Spazio (Pausa, Riprendi), il piede. Nessun errore.
  - *Al telefono (390×844, tocchi).* «Menu» apre il pannello delle sezioni, Esc lo chiude; il comando porta al tratto
    con il titolo a 164 px; «Copia» copia e lo dice (`percorso/telefono-percorso.jpg`).
  - *Senza JavaScript.* Tutto visibile, comandi dopo la scena, il lettore del browser al posto del pulsante dell'ascolto,
    la frase dei preferiti al posto della copia (`robustezza/telefono-js-script-caratteri-ridotto.jpg`, primo).
  - *Quando qualcosa non si carica.* Script della pagina: come senza JavaScript. Caratteri: ripiego leggibile. Fogli di
    stile: pagina leggibile in ordine, figure in misura. Il suono: il messaggio con «Riprova» e il file (`errori/`).
  - *La risposta a «Posso usarlo? Quando?»* Oggi no (titolo); perché (driver firmato, account Apple); che cosa c'è e che
    cosa manca (strada, «C'è già», «Manca il microfono»); quando: nessuna data, ripassa da qui; nessun dato lasciato.
    Corrisponde a `progetto.md` P6.
- **Ciò che un simbolo promette accade?** Frecce, play e pausa, copia: sì.
- **Il sistema c'è?** Sì: token e componenti (`controlla-sorgenti.mjs` verde) e il catalogo con ogni stato (I4).
- **La pagina dice ciò che il progetto deve dire?** Sì per P6 e per i confini; nessuna funzione inventata, nessuna data.
  Le sole frasi da guardare sono N4 e il telefono (I2).
- **Stile di default sotto il primo schermo?** Solo la dissolvenza dei titoli; il resto ha movimenti suoi.

---

## La scelta lasciata alla direzione: sugli schermi bassi, mentre la voce suona

**Le due soluzioni, rifatte da me** a 844×390 (`bassi/scelta/844x390-prima-A-B.jpg`: in alto la pagina prima di
premere, con il comando in fondo allo schermo come quando ci si arriva scorrendo; al centro A, com'è: vince la bolla; in
basso B: vince il comando) e a 915×412 (`bassi/scelta/915x412-prima-A-B.jpg`).

- **Con B (vince il comando)** la bolla resta sotto la barra: se ne vede solo l'ultima riga, «seguo benissimo.», e non si
  vede nessuna parola accendersi. Ma è proprio quello che il gesto apre: la frase rimasta muta in apertura che qui
  diventa detta, parola per parola. Con B chi preme sente la voce e guarda i riquadri, e il momento che chiude l'arco
  della pagina si perde. E prima di premere la bolla era già nascosta (primo riquadro): B la lascia nascosta.
- **Con A (vince la bolla)** la frase si accende sotto gli occhi e Paola, Luca e Anna la ricevono; il comando appena
  premuto scivola via sotto il bordo (N1). Il costo è piccolo: la frase dura circa 5 s e finisce da sola, la pagina non
  resta mai con una voce che non si può fermare a lungo, e alla fine il comando torna «Ascolta Giulia».
- **La regola della home** («dove le due cose non stanno insieme vince la scheda: i comandi») vale per uno strumento che
  si usa più volte di seguito (scegliere la voce, premere frasi diverse); qui c'è una frase sola e un gesto solo. E la
  costruzione stessa, per l'errore, fa vincere ciò che il gesto ha aperto (il messaggio), non il comando.

**Che cosa tenere: A, la bolla**, come eccezione dichiarata nella cornice, e la regola della cornice scritta meglio:
quando l'altezza manca vince ciò che il gesto ha aperto (la bolla che parla, il messaggio d'errore, la risposta della
copia); nel primo schermo vince il comando. **Ma la soluzione migliore non è nessuna delle due**: a queste altezze la
riunione può essere più bassa e far stare tutto insieme (N1: a 844×390 mancano circa 50 px con riquadri alti 172; a
326×326 basta togliere i due margini di 8 px). È lavoro della direzione e minore: non ferma la pagina.

---

## Che cosa non ho verificato

- Il suono ascoltato davvero: su questa macchina non c'è uscita audio (Chromium e WebKit suonano su un'uscita finta,
  Firefox va nell'errore). Il proprietario deve sentirlo dal suo browser.
- Lettori di schermo veri (ho visto solo che il messaggio d'errore e l'annuncio esistono nella pagina), testo grande e
  zoom, colori forzati, telefoni veri, la matrice dei 15 dispositivi nei tre motori (Firefox e WebKit solo a 1440×900 e
  390×844).
- Il catalogo in Firefox e WebKit; il feed `releases.atom` (nessuna richiesta esterna da qui).
- Le pagine in una lingua vera da destra a sinistra: solo la pseudo-lingua `ar-XB`.

---

## Le note di chi ha corretto e costruito

Lette dopo aver scritto tutto quanto sopra: `3a-non-ancora/progresso.md` (giro di correzioni), `PIANO.md` («La
cornice»), `costruzione/progresso.md`, `design-system/metodo.config.mjs` (`limiti`), le foto in
`costruzione/foto-difetti/`.

**Dove corrispondono a ciò che ho visto.** I1, I2, I3, I5, I6 come li descrive la direzione; il tentativo su «Kalliope»
esattamente come scritto («la pillola della scelta va, si svuota, onda tratteggiata, torna»); la regola della cornice
del primo schermo con le stesse posizioni del comando (246–294 a 390×667, 238–286 a 360×640, 242–298 a 844×390) che
ho misurato io. La costruzione: italiano a riposo identico alla direzione (lo confermo, 0% a quattro misure), M1, M2
(211 px, x 691: gli stessi numeri), M5, M6 (2.906 px: lo stesso numero), M7, catalogo, stati della copia, ripiego senza
JavaScript, nessun errore nei tre motori. Le sue pseudo-lingue (pillole che escono dal fondo in `en-XA` al telefono) le
ho viste anch'io.

**Dove affermano più di quanto ho visto.**
- La direzione: «copiato l'indirizzo, il posto si accende». Nella pagina viva non si accende; si accende solo nel
  catalogo (N5). La costruzione ha messo in catalogo lo stato «ricordata» senza accorgersi che la pagina non lo mostra.
- La costruzione, fra i difetti corretti: «il comando «Ascolta» che spariva sotto il bordo premendo sugli schermi bassi».
  È corretto a 390×667, 360×640, 320×568, 1440×500, 1280×500, 1024×600 (`bassi/bassi.json`); a 844×390, 915×412 e 326×326
  resta, dichiarato come limite nella stessa consegna. Le due frasi vanno lette insieme.
- La regola della cornice in `PIANO.md` dice «vince il comando» senza eccezioni; la costruzione ne ha fatta una
  (l'ascolto) e l'ha scritta solo nei limiti: la regola va riscritta dove la leggeranno le altre pagine (sotto).
- Nessuna nota parla del fotogramma in cui il tratteggio attraversa la riga della versione (N3), dello sbilanciamento
  del pulsante al telefono (N2) né della nota scritta a mano accanto al numero che si aggiorna (N4).

**Sulle scelte lasciate.** Gli schermi bassi durante l'ascolto: la bolla, con la regola scritta come «vince ciò che il
gesto ha aperto», e meglio ancora una riunione più bassa a quelle altezze (sezione sopra). «Account Apple» per macOS,
dubbio E e propria voce: decisi da chi coordina il 16/11, la pagina li segue. Resta al proprietario il telefono come
«non ancora» o come confine (I2) e la frase grigia della bolla (M4).

---

## L'ordine e che cosa va corretto prima di mostrarla

**Dal più forte al più debole**, per una pagina «non disponibile» di un prodotto: R01 per impatto e momento; poi questa
pagina, che ora regge anche sotto il primo schermo e ha due momenti che restano (il tentativo su «Kalliope», la voce che
si ferma al microfono), alla pari con R03, più rifinito e generico (la differenza resta piccola: la decide il
proprietario); poi R05. Rispetto alla home scelta: stesso mondo, primo schermo all'altezza, il tratto della decisione
ancora il più quieto della pagina ma non più vuoto.

**Bloccanti:** nessuno. **Importanti:** nessuno.

**La pagina è pronta per il proprietario.** I cinque minori gli arrivano come scelte, con la foto: nessuno chiede un
altro giro prima di mostrargliela. Se si correggono, a chi tocca:
- Ruolo di direzione: N1 (la riunione più bassa sugli schermi bassi, e la regola della cornice riscritta), N3 (il
  tratteggio che attraversa la riga), N2 (l'etichetta centrata al telefono).
- Ruolo di costruzione: N5 (il posto che si accende dopo la copia, nella pagina viva), N4 (la nota che segue il dato
  della pubblicazione, con chi coordina perché vale anche per la home).

---

## Riassunto per il proprietario

### Problemi
- **Nessun problema bloccante né importante.** Quelli del primo giudizio sono chiusi; uno lo è in parte (al telefono la
  didascalia della scena è una parola sola) e uno resta una tua scelta (la frase grigia nella bolla in alto).
- **Minore: dopo «Copia» il posto di Windows e macOS non si accende.** Doveva farlo; lo fa solo nel catalogo. La scritta
  «Copiato» c'è.
- **Minore: sul telefono girato, mentre la voce suona, «Pausa» esce dallo schermo.** La pagina mostra le parole che si
  accendono; la frase dura 5 secondi e si ferma da sola.
- **Minore: al telefono il pulsante dell'ascolto è sbilanciato** quando dice «Pausa» o «Riprendi».
- **Minore: per mezzo secondo una linea tratteggiata passa sopra la riga della versione**, mentre l'elenco si apre.
- **Minore: «l'elenco si aggiorna da solo»** vale per numero e data, non per la nota «versione di prova» accanto.

### Che cosa funziona
- **Su telefoni piccoli e girati il comando ora è sempre nel primo schermo**: provato su più di cento misure.
- **Nell'apertura si vede il tentativo**: la scelta va su «Kalliope», trova il posto vuoto e torna indietro.
- **Il tratto «Non promettiamo date» ora racconta**: l'ultima versione arriva in cima e lascia sopra di sé il posto per
  Windows e macOS.
- **Per sapere quando arriva basta copiare l'indirizzo della pagina**; il feed resta per chi lo usa, spiegato.
- **Quando il suono non parte la pagina lo dice**, con «Riprova» e il file da scaricare, e la frase resta muta.
- **Dice la verità**: non ancora provata in una riunione vera, non è un servizio online né un'estensione, nessuna data.
- **La home che hai scelto non è cambiata.** Il catalogo mostra tutti i pezzi nuovi con i loro stati.

### Accanto ai riferimenti
- **Meno spettacolare di Signs**, più chiara; **alla pari con ElevenAgents**, differenza piccola, la decidi tu;
  **meglio di LALAL.AI**, anche nel tratto della decisione.

### Da decidere tu
- Il telefono come «non ancora» (come nella home) o come «non è un'app per telefono».
- Sul telefono girato, mentre suona: tenere le parole che si accendono (consigliato) o il comando «Pausa».

### Non verificato
- **Il suono ascoltato davvero** (qui non c'è uscita audio): ascoltalo dal tuo browser. Lettori di schermo, testo
  grande, telefoni veri.
