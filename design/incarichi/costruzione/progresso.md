# Progresso: costruzione (confronto, direzione, primo percorso completo)

Worker: design-build (Sonnet 5.5, dichiarato dal prompt di sistema, non verificato dai metadati dell'host), nessun agente annidato.
Incarico: `design/incarichi/costruzione.md`. Regole: `design/incarichi/comune.md`. Ogni comando con `env -u DISPLAY -u WAYLAND_DISPLAY`.
Nessun commit, nessun lavoro lasciato in background (due esami lunghi sono stati spostati in coda dall'host e sono terminati).

## Giro di correzioni (12/11/2026, sera): fatto

Fonti: `design/revisione-visiva.md` (B1-B2, I1-I9, minori economici), richiesta di riconoscibilità, `design/incarichi/correzioni-fatti.md`, nuovo `tools/site.py`.
- **B1** Aiuto senza risultato: il filtro riguarda solo le frasi della finestra (gruppo `data-gruppo-frasi`); i tre casi «La mia frase non c'è» restano sempre in vista; a zero risultati sparisce il gruppo (nessun titolo orfano) e il messaggio rimanda ai tre casi; il numero detto è quello delle voci mostrate.
- **B2** Telefono: avviso su una riga, dentro la colonna, dopo il riquadro (non più 249 px in cima); riga di stato sotto il titolo; ordine titolo, stato, riquadro d'ascolto, frase, cartellino, «Scarica e installa». Comando d'ascolto intero a 390×844 anche con l'avviso.
- **Riconoscibilità**: la coppia «Tu scrivi / Kalliope dice» (frase dell'importo, voce di Giulia) con «Ascolta Giulia» sta nel primo schermo, computer e telefono; la foto della finestra è piccola e sta sotto «Cosa serve» e al primo passo di In riunione. `direzione.md` aggiornato (A1 «dove», D01-D03, D06, D09, D32, D33, D40, E07, T08; regole e controllo invariati, uscita 0).
- **Importanti**: I1 riquadro senza fascia vuota; I2 Ascolta con intro di una frase e comando entro il primo schermo; I3 sopra; I4 il percorso diventa «Passo N di 5» (una riga); I5 scelta della distribuzione vera con JavaScript («Mostra tutte», senza memoria), «Scarica» prima dei requisiti, indice a dettaglio chiuso; I6 passo 3 di Riunione in tre sottopassi, impronte con «Copia il numero», comandi di Aiuto nel componente; I7 collegamenti isolati alti 44 px; I8 la home finisce con «Avanti: Scarica e installa»; I9 avviso dentro la colonna.
- **Minori fatti**: M1 durate arrotondate uguali, M4 indirizzo su una riga, M5 foto piccola, M6 `a:visited` tolto (rendeva illeggibili i bottoni già visitati) e href della 404, M7 colori forzati (primario con riempimento di sistema), M8 messaggio di copia senza «Ctrl+C», M9 niente sillabazione, M10 pulsante di larghezza fissa, M11 iPad. **Aperti** (elencati nel catalogo, «Difetti ancora aperti»): M2, M3, M7 (foto in tema scuro), posizione dopo «Ferma», Arch due volte, «31 dicembre» a capo a 360 px, comando a 360×740 sotto la piega, MP3 in Firefox senza decoder (proposta: secondo formato Ogg/Opus), iPad non verificabile.
- **Fatti** (correzioni-fatti.md): disinstallazione con certezza e le due cartelle da cancellare; archivio con `cd {{kalliope.tar.dir}}`; programma che si chiude del tutto, senza servizi né avvio automatico. **Date**: lo spazio non separabile di `tools/site.py` funziona (nessun «12 novembre» a capo nelle pagine del percorso).
- **Esiti** (`design/prove-percorso/esiti.json`, catalogo «Prove»): primo schermo 23/23 in Chromium, Firefox e WebKit; ascolto 24/24, 23/24 (Firefox: l'MP3 non si decodifica in questo ambiente, messaggio e file funzionano) e 22/22 (WebKit, senza riproduzione vera); stati 42/42, 40/40, 40/40; contrasto tutto sopra 7:1 (percorso, ricerca, catalogo); impaginazione 148 su 210 pulite, nessuna sporgenza né testo fuori finestra; peso fino a 185 kB (catalogo); `controlla-pagine`, `controlla-sorgenti`, `link-spenti-qa` puliti; controprove su copie guastate: falliscono.
- Limite dichiarato: WebKit di questo ambiente si blocca con qualsiasi `<audio>` che abbia una sorgente (non un difetto del sito): in WebKit si toglie `src` prima di caricare.
- Slip: un comando `rm -rf /dev/null` digitato per errore in una riga di shell non ha avuto effetto (`/dev/null` è intatto); non ho cancellato altro.

## Stato (12/11/2026, 21:55; prima del giro di correzioni)

| Unità | Stato | Risultato |
|---|---|---|
| U1 confronto | **fatta** | `design/confronto.{json,md}`, `design/copertura.md`: 13 riferimenti (R01-R06, R20-R22, R50-R53), 0 caratteristiche identiche in tutti, 16 meccanismi comuni, 432 varianti; rigenerato dopo la consegna di R50-R53 (progresso visita-4: «nessun passo»). Osservazioni unite: «Formato pulito» |
| U2 direzione | **fatta** | `design/direzione.{json,md}`: ambizione A1-A5, tre direzioni confrontate (scelta: cammino a pagine per compito, «Carta e voce»), 73 decisioni (adattata 43, esclusa 20, progettuale 9, trasferita 1), regole RG1-RG14 e proposte RG15, RG16; `controlla-direzione.mjs --confronto`: uscita 0, nessun «da rivedere», copertura 432/432 |
| U3 percorso | **fatta, da rivedere dal ruolo visivo** | `site/`: 8 pagine (arrivo, Ascolta, Stato e limiti, Installa, In riunione, Aiuto, Non ancora, 404) + catalogo `site/sistema/` e `site/sistema/ricerca/`, 3 fogli di stile, 2 script, `voce/tempi.json`. Esiti in `design/prove-percorso/esiti.json` (letti dal catalogo) e `revisione-qualita.md` |

## Strumenti e fonti (tutti in `design/strumenti/`)
- U1-U2: `unisci-osservazioni.py`, `vista-confronto.py`, `copertura.py`, `direzione_lib.py`, `direzione_dati.py`, `direzione_md.py`, `costruisci-direzione.py`, `rigenera-confronto.sh` (rilancia tutto).
- U3: `pagine/{layout,comp,pagine_a,pagine_b,crea,genera-catalogo}.py` **generano le pagine di `site/`** (intestazione e piede comuni, catalogo con token e matrice letti dalle fonti): per cambiare il piede o un componente si modifica lì e si rilancia
  `python3 -I design/strumenti/pagine/crea.py && python3 -I design/strumenti/pagine/genera-catalogo.py`. I fogli di stile, gli script e `voce/` si modificano direttamente.
- Prove (ora per motore con `MOTORE=firefox|webkit`): `primo-schermo.mjs`, `con-server.mjs` (server locale chiuso a fine comando), `anteprima.sh NOME` (usa `tools/site.py --release-json /tmp/kalliope-lavoro/releases.json`, cartella nuova a ogni giro), `foto-pagine.mjs`, `prova-ascolto.mjs`, `prova-stati.mjs`, `misura-pagine.mjs`, `controlla-pagine.py`, `analizza-voci.mjs` (scrive `site/voce/tempi.json`).
- `design/metodo.config.mjs` per le prove della skill (`esame-impaginazione`, `contrasto-qa`, `link-spenti-qa`, `controlla-sorgenti`).

## Esiti dei controlli (Chromium senza finestra; dettagli in `esiti.json` e nel catalogo)
- Contrasto: tutti i testi sopra 7:1 (4,5:1 per il grande) in tema chiaro e scuro, 390×844 e 1440×900, su tutte le pagine. Dopo il primo giro ho scurito il verde del testo (#0a5347), l'ambra e il rosso: i primi valori davano 6,6:1.
- Impaginazione: 210 combinazioni (360×760, 820×1180, 1440×900; testo 100-200%, zoom 125-200%), 151 pulite nell'ultimo giro completo; a testo 100-125% restano 5 a capo di date o di «31 dicembre» a 360 px; nessuna pagina scorre di lato a 360 px con testo 200%
  (difetti trovati e corretti: codice lungo, titoli e riassunti senza a capo); a 150-200% su 360 px restano parole lunghe spezzate e colonne strette.
- Ascolto 24/24, stati e ripieghi 28/28 (tastiera, ridotto, stampa, colori forzati, filtro, 404, avviso sul sistema, copia, rete); controprove su copie guastate: falliscono 7 e 7 controlli. Pagine statiche: 0 errori, la copia guastata è riconosciuta 4 su 4.
- Fonte unica dei valori (`controlla-sorgenti.mjs`): in ordine. Peso: al più 161 kB per pagina senza audio, 0 domini esterni, nessun cookie, nessuna animazione infinita.

## Lacune e problemi aperti
- Solo Chromium; Firefox, WebKit, i 15 dispositivi e hardware reale dopo l'approvazione. MP3 in Firefox/WebKit da verificare. Orologio audio di Chromium senza finestra più veloce del reale: tempo dell'interfaccia provato con orologio simulato, riproduzione vera provata a parte.
- Nessun lettore di schermo, puntamento oculare o interruttore veri. 404 non provata su GitHub Pages (server locale che la imita).
- Revisione di qualità: autovalutazione del costruttore, importanti: nel primo schermo nulla dice che la voce si vede; il primo gesto di Installa è sotto la piega; le pagine di testo lasciano vuoto un terzo del computer. Va rifatta dal ruolo visivo.
- **Per il coordinatore:** (1) `{{kalliope.date}}` può andare a capo fra giorno e mese: emettere «12 novembre 2026» con spazio non separabile nel segnaposto di `tools/site.py`; (2) C4 installazione guidata ha 2 presenti su 3 (riserva Human In The Loop, adattamento dubbio) e C2 voce con testo accanto solo R03 (riserva Predictable): `copertura.md`;
  (3) R04, R05, R06 non avevano righe «effetto o animazione» nelle osservazioni: aggiunte da me dai loro `movimento/*.md` (solo il trigger); (4) accogliere o respingere RG15 e RG16 (`direzione.json` → `regole_proposte`); (5) `crates/app/ui/app.slint` risulta modificato nel working tree: non da me.
- **Domande per il proprietario** (da `progetto.md` §12, adottate come provvisorie e scritte nel catalogo): A nessuna e-mail (solo issue di GitHub, serve un account); B solo italiano; E «non ancora» per Windows e macOS senza consigliare altri prodotti; F la frase sul dispositivo medico; G campioni non ritoccati. In più: persone disposte a provare con ausili veri (interruttore, sguardo, lettore di schermo).

## Ultimo comando
`node design/strumenti/con-server.mjs /tmp/kalliope-anteprima/21 node design/strumenti/prova-stati.mjs …` (28 OK) e `sh design/strumenti/rigenera-confronto.sh` (uscita 0).

## Prossimo passo
Il ruolo visivo rivede il percorso corretto (il resto aperto è nel catalogo e in `esiti.json`); poi il coordinatore mostra il percorso al proprietario con il criterio di ambizione accanto (`direzione.md` §1). Fino alla sua approvazione non si estendono le regole, non si congelano i token e non parte la matrice dei 15 dispositivi per tre motori.
