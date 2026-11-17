# Incarico 3b · «stato» nella direzione 2 · progresso

Ruolo design-direction. Incarico: `design/lavoro/incarichi/3b-stato-aspetto.md`. Partenza `e429a28` (HEAD `7ad19c0`).
Porte 8870–8879, cartelle `/tmp/lavoro-3b-*`. Nessun commit, nessun push, nessuna finestra, nessun altro agente.
**Stato: resa consegnata (17/11/2026).** Prossimo: giudice → correzione → costruzione → proprietario.

## Fatto
- Letture: CLAUDE.md, STATO.md, direzione 2 (LEGGIMI, D2, PIANO), «non ancora» (pagina, cornice, PIANO, CONTENUTI, due giudizi,
  rifinitura), sistema (SISTEMA, token, componenti), skill (SKILL, direzione §6, giudizio, movimento, scrittura, esecuzione), `progetto.md`
  per intero, riferimenti (classifica, scorrimenti R03 R05 R50 R51 R52 R53; scheda R04 Waymo Safety Hub con le foto 007, 040, 044).
- `CONTENUTI.md` (61 voci, scritto prima di rendere). `PIANO.md` (idea, alternative, tratti, cornice, stile di default, scelte progettuali,
  ciò che resta alla costruzione, non verificato).
- La pagina: `website/stato/index.html` (rifatta al posto della vecchia, che resta nel repository a `7ad19c0`), `website/stato/stato.js`.
- Componenti nuovi: `design-system/componenti/riunione-provata.css`, `catena.css`, `domande.css`, `varco.css`, `inoltra.css`.
- File condivisi, solo aggiunte: `token.css` (blocco «La pagina «stato»» in fondo, più una domanda sui media per la riga delle parole),
  `TOKEN.md` (sezione in fondo), `SISTEMA.md` (sezione prima di «Come si usa per un'altra pagina»), `componenti/pagina.css` (una regola in
  fondo: titolo di quattro righe sugli schermi bassi), `metodo.config.mjs` (stati di «stato», pagina e script nei sorgenti),
  `website/lingue/site.pot` e `it.po` (rigenerati: chiavi `st.*` nuove, nessuna voce esistente cambiata, solo i riferimenti).
- Prove: `sequenze/` (arrivo, scorri, domanda, copia senza appunti, copia riuscita, arrivo-basso a 1366×640, 390×667, 844×390), `foto/`
  (schermi bassi, ridotto, senza JavaScript, tratti a grandezza vera, `lingue/` en-XA e ar-XB), `confronti/` (16 coppie nei due versi: primo
  schermo con R01, R03, home, «non ancora»; scorrimento con R03, R05, R50, home, «non ancora», R03 al telefono; catena con R04 e R50;
  domande con R04; varco con R51 e R03), `esiti/confronta-scelta-*.txt` (home e «non ancora» uguali alla costruzione di partenza, 0%).
- Controlli verdi: `controlla-sorgenti.mjs` (28 fogli, valori solo nei token), `css_logico.py`, `translations.py extract --check` e
  `check` (254/254), `test_translations.py` e gli altri test degli strumenti (72, OK).
- Correzioni fatte guardando: il segno del confine stretto fra i riquadri → onda tratteggiata; l'anello del microfono che al telefono usciva
  dallo schermo → anello senza scala; la porta del varco invisibile → filo da «huggingface.co» e file in fila che non si sovrappongono alle
  etichette; i file che ricomparivano a metà discesa; la frase della bolla grigia anche con la voce; «e‑mail» spezzato a capo; il pulsante
  di copia sbilanciato (era la pillola chiara con il tondo) → pillola d'azione; al telefono il passo del varco sotto il computer agganciato;
  cifre e varco più grandi dopo il confronto con R04 e R51; titolo di quattro righe a 1366×640.

## In corso
- Niente.

## Prossimo passo
- Giudizio della pagina intera (ruolo design-judge), poi le correzioni, poi la costruzione (elenco in `PIANO.md`).

## Ultimo comando
- `node $SKILL/scripts/sequenza.mjs /tmp/lavoro-3b-sito-11 sequenze/domanda --pagina it/stato/index.html --gesto 'premi:#d-voce .domanda-bottone'`
  (ambiente: `source prove/env.sh`; costruzione: `python3 -I tools/site.py --out /tmp/lavoro-3b-sito-11 --release-json /tmp/lavoro-3b-dati/releases.json`).

## Problemi aperti
- Da chiedere a chi coordina: il dubbio F («non è un dispositivo medico…», nella home e qui) e «non lascia un servizio acceso» ([I] in
  `progetto.md` §7). Vedi `CONTENUTI.md`.
- Pseudo-lingue: in en-XA l'etichetta di «Tu» al telefono si taglia, il titolo a 1440 va su sei righe (alla costruzione).
- Catalogo non toccato (alla costruzione). Solo Chromium.

## Correzione dopo il giudizio (incarico 3b-c, 17/11/2026)

Incarico: `design/lavoro/incarichi/3b-stato-correzione.md`; giudizio: `giudizio/GIUDIZIO.md`. Copia di partenza (commit `b456308`):
`/tmp/lavoro-3b-copia-prima-correzione/`, costruita in `/tmp/lavoro-3b-sito-prima/`. In parallelo l'incarico 2-f cambia la cornice
(`pagina.css`, `barra.css`, `cornice.js`, `componenti.js`, `lingue.css`, `riunione.css`, `versioni.css`, `token.css`, `website/non-ancora/`).

**Stato: correzione consegnata.** Per ogni punto, che cosa è cambiato e la prova: `PIANO.md`, «Correzione dopo il giudizio».

- **Fatto**: I1, I2, I4, I6, M1, M2, M3, M4, M6, M8, M9, M10, M12. Nessun minore lasciato come scelta fra quelli dati alla direzione.
- **File toccati**: `website/stato/index.html`, `website/stato/stato.js`; `design-system/componenti/catena.css`, `domande.css`, `varco.css`,
  `inoltra.css` (regole in fondo, e pochi valori ripuntati sui token nuovi); `design-system/token.css` (16 token in fondo al blocco di
  «stato», nessuno cambiato); `design-system/componenti/barra.css` (una regola in fondo, M1); `design-system/TOKEN.md`, `SISTEMA.md` (aggiunte);
  `website/lingue/site.pot`, `it.po` (rigenerati: 7 chiavi nuove, una tolta); `design/lavoro/3b-stato/CONTENUTI.md`, `PIANO.md`;
  `design/lavoro/3a-non-ancora/PIANO.md` («La cornice», la regola di M1). Non toccati: `pagina.css`, `cornice.js`, `componenti.js`,
  `lingue.css`, `riunione.css`, `versioni.css`, `website/non-ancora/` («non ancora» non ha una voce nel menu: niente attributo da mettere).
- **Prove**: `sequenze-correzioni/` (arrivo, scorri, domanda a 1440 e 390; dettagli e salto al messaggio al telefono; copia riuscita),
  `foto-correzioni/` (prima e dopo, punto per punto; varco e catena a 1366×640), `confronti-correzioni/` (con home e «non ancora», alle due
  misure; il telefono prima e dopo), `esiti/` (sonde I1 e I2, altezze, testo fuori dalla tappa, confronta-scelta).
- **Controlli**: `controlla-sorgenti.mjs` verde (28 fogli), `css_logico.py` verde, `translations.py extract --check` e `check` (260/260),
  72 prove degli strumenti OK; sull'albero vivo e sulla copia con i soli file della correzione.
- **Home e «non ancora»**: identiche a `b456308` con i soli file della correzione (0%).
- **Ultimo comando**: `node prove/stati.mjs … 1366x640` sulla copia `/tmp/lavoro-3b-sito-mia` (costruita da `/tmp/lavoro-3b-copia-mia/`).
- **Aperto per la costruzione**: elenco in `PIANO.md` («Dal giudizio» e il resto). Le traduzioni di prova vanno rigenerate.
