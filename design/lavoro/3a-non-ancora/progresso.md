# Incarico 3a · progresso

Aggiornato: 16/11/2026, notte. **Stato: consegnato** (aspetto e movimento della pagina intera; il resto al ruolo di costruzione).

## Fatto
- Letture; home costruita e guardata a 1440×900 e 390×844; riferimenti sotto il primo schermo (R01, R03, R05, R50, R51,
  R53, R06). Feed `releases.atom` verificato (200, una voce, note in inglese).
- `CONTENUTI.md` (prima di rendere), `PIANO.md` (piano dei tratti, cornice per le pagine interne, scelte progettuali,
  da completare, non verificato).
- Pagina: `website/non-ancora/index.html` (sostituisce quella vecchia, che resta in HEAD), `website/non-ancora/non-ancora.js`,
  `website/cornice.js` (cornice comune delle pagine interne).
- Sistema: componenti nuovi `design-system/componenti/pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`;
  token nuovi in un blocco in fondo a `design-system/token.css` (24 nomi, ognuno con il ruolo), documentati in fondo a
  `design-system/TOKEN.md`; pagina e script aggiunti a `design-system/metodo.config.mjs`. Nessun componente esistente toccato.
- `controlla-sorgenti.mjs` (da `design-system/`): verde, «20 fogli di stile, valori solo nei token».
- Prove: `sequenze/` (arrivo, scorri, ascolta a 1440×900 e 390×844; arrivo a 1366×640: fogli, video, json); `foto/` (primi
  schermi, ascolto in corso, riduci movimento, senza JavaScript, prova da destra a sinistra, 820×1180, 1180×820, menu);
  `confronti/` (primo schermo con la home a 1440 e 390, con R01, R03, R05; scorrimento con R01, R03, R05, la home; telefono
  con R03). Testo +40% (pseudo-lingua): nulla esce dal bordo. Ascolto: premi, pausa, riprendi, fine provati.

## In corso
- Niente.

## Prossimo passo
- Giudice, poi ruolo di costruzione (elenco in `PIANO.md`, «Da completare a chi costruisce»).

## Ultimo comando
- `python3 -I tools/site.py --out /tmp/lavoro-3a-sito-9` (site.py dell'incarico 1: la pagina sta in `it/non-ancora/`);
  `/tmp/lavoro-3a-strumenti/mira.mjs` per le foto finali (primo schermo uguale a quello delle sequenze, 0 pixel diversi a
  1440 e 390).

## Problemi aperti
- La convenzione `data-t` non è scritta nel `progresso.md` dell'incarico 1: la pagina ha testo semplice.
- Domande per il proprietario in `CONTENUTI.md` (macOS «account Apple» o «componente approvato»; la propria voce qui; dubbio E;
  feed in inglese).
- Il catalogo non mostra ancora i quattro componenti nuovi (l'incarico 1 ci lavorava).
