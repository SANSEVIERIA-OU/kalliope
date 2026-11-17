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
