# Incarico 3a · progresso

Aggiornato: 17/11/2026, notte. **Stato: giro di correzioni dopo il giudizio consegnato.** Il lavoro di prima è nel commit
7cb9e65; la copia di partenza di questo giro è in `/tmp/lavoro-3a-copia-prima-correzioni/`.

## Fatto (primo giro, 16/11)
- Pagina resa, `CONTENUTI.md`, `PIANO.md`, sequenze, foto, confronti (vedi commit 7cb9e65).

## Fatto (giro di correzioni, 17/11; giudizio in `giudizio/GIUDIZIO.md`)
- **I1** stato vero nella riga «Oggi:» (non ancora provata in una riunione vera con Zoom, Teams o Meet); tappe dopo il
  microfono tratteggiate come «non provate». `website/non-ancora/index.html`.
- **I2** «non è un servizio online né un'estensione del browser» detto come confine; «non ancora» solo per telefono e
  tablet e altre lingue. `index.html`.
- **macOS** account sviluppatore Apple per firmare il componente audio. **Propria voce** tolta. **Dubbio E**: tolti il
  consiglio di installarlo su un Linux vicino e «non consigliamo altri prodotti». `index.html`.
- **I3** comando pieno «Copia l'indirizzo di questa pagina» (l'elenco si aggiorna da solo a ogni release; senza script:
  preferiti); il feed in una nota che dice che cos'è, che segnala ogni versione e che è in inglese. `index.html`,
  `non-ancora.js`, `versioni.css`, `pagina.css` (`.nota`, `.coppia-oggetto`, `.coppia-nota`).
- **I5** regola della cornice «quando l'altezza manca, vince il comando»: telefono basso (sotto 760 px d'altezza) comandi
  subito dopo la frase; telefono girato (fino a 500 px d'altezza) titolo e frase alla misura del telefono, scena dopo;
  `cornice.js` tiene il fuoco nell'ordine visto; riquadri del telefono a 152 px perché lo stato stia intero a 375×812.
  `pagina.css`, `cornice.js`, token. Scritta in `PIANO.md`, «La cornice».
- **I6** il momento del tratto: l'ultima versione compare in cima, resta, scende; il posto tratteggiato di Windows e macOS
  si apre e resta; copiato l'indirizzo, il posto si accende. `versioni.css`, `index.html`, `non-ancora.js`.
- **Ciò che il giudice non vedeva**: il tentativo su «Kalliope» rifatto e ora visibile (la pillola della scelta va, si
  svuota, onda tratteggiata, torna); il respiro della prossima versione tolto e sostituito dal momento dell'I6.
  `non-ancora.js`, `riunione-ferma.css`, `index.html` (`.segno-scelta`).
- Token: tolti 7 miei che non servivano più, aggiunti 13, uno cambiato (`token.css`, solo il mio blocco); documentati in
  fondo a `TOKEN.md` (solo aggiunte). Soglia d'altezza `500px` dichiarata in `metodo.config.mjs`.
- `controlla-sorgenti.mjs` verde («20 fogli di stile, valori solo nei token»).
- Prove nuove: `sequenze-correzioni/` (arrivo, scorri, quando, ascolta a 1440×900 e 390×844; arrivo a 390×667, 360×640,
  844×390, 1366×640), `foto-correzioni/`; copia provata con e senza permesso degli appunti; movimento ridotto, senza
  JavaScript, prova da destra a sinistra del tentativo.
- `PIANO.md` e `CONTENUTI.md` aggiornati.

## In corso
- Niente.

## Prossimo passo
- Secondo sguardo del giudice; poi il ruolo di costruzione (I4 catalogo, M1, M2, M5, M6, M7 e l'elenco in `PIANO.md`).

## Ultimo comando
- `python3 -I tools/site.py --out /tmp/lavoro-3a-c8-sito`, sequenze in `/tmp/lavoro-3a-c8-seq/` (copiate in
  `sequenze-correzioni/`), `controlla-sorgenti.mjs` da `design-system/`.

## Problemi aperti
- Catalogo non toccato (I4, ruolo di costruzione; ora ci lavora anche l'incarico 2).
- `confronta-scelta.mjs` sulla home non rifatto: in questo giro nessun file della home o condiviso è stato toccato.
- La convenzione `data-t`: testo ancora semplice.
