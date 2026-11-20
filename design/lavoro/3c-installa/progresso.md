# Incarico 3c · «installa» nella direzione 2 · progresso

Ruolo design-direction. Incarico: `design/lavoro/incarichi/3c-installa-aspetto.md`. Partenza `1c6ba5a`.
Porte 8880–8889 (solo 8880, aperta e chiusa da `prove/con-server.mjs` a ogni comando), cartelle `/tmp/lavoro-3c-*`. Nessun commit, nessun push,
nessuna finestra, nessun altro agente. Copia di partenza della pagina vecchia: `/tmp/lavoro-3c-partenza/installa/` (e nel repository a `1c6ba5a`).
**Stato: resa consegnata (20/11/2026).** Prossimo: costruzione → giudice → correzione → proprietario.

## Fatto
- Letture: CLAUDE.md, STATO.md, direzione 2 (LEGGIMI, D2, PIANO), «non ancora» e «stato» (pagine, cornice, PIANO, giudizi e secondi sguardi),
  sistema (SISTEMA, token, componenti), skill 0.49.0 (SKILL, direzione §6, giudizio, movimento, scrittura, esecuzione), `progetto.md` per intero,
  i file della versione offerta (`git show v0.1-rc.1:` install, PKGBUILD, build-packages.sh, main.rs, download.rs), riferimenti (classifica;
  scorrimenti R01, R03, R05, R50; foto R50 003/004/007 e R05 014/015).
- `CONTENUTI.md`: 65 voci, scritto prima di rendere; quattro punti «cambia con la prossima versione», segnati in pagina con
  `data-cambia="voce-nel-pacchetto"` e un commento.
- La pagina: `website/installa/index.html` (rifatta al posto della vecchia), `website/installa/installa.js`.
- Componenti nuovi: `design-system/componenti/scelta-sistema.css`, `comando.css`, `terminale.css`, `installazione.css`.
- File condivisi, solo aggiunte: `token.css` (blocco «La pagina «installa»» in fondo, 89 token), `TOKEN.md` (sezione in fondo), `SISTEMA.md`
  (sezione prima del marchio), `metodo.config.mjs` (7 stati di «installa», pagina e script nei sorgenti), `website/lingue/site.pot` e `it.po`
  (rigenerati: chiavi `in.*` nuove; nessuna voce esistente cambiata, solo i riferimenti), cataloghi di prova di `2-lingue-aspetto/prova-lingue/`
  rigenerati.
- `PIANO.md`: idea, riferimenti sotto il primo schermo, alternative, tratti, ripieghi, cornice, stile di default, scelte progettuali, ciò che resta
  alla costruzione, non verificato.
- Prove: `sequenze/` (arrivo, scorri, sistema, frase, copia, alle due misure, con i video), `foto/` (primo schermo a 1440×900, 1366×640, 1280×720,
  390×844, 390×667, 844×390; ridotto; senza JavaScript con la pagina intera; `stati/`; `pagina/` con la pagina intera; `medio/` 1024×768; `lingue/`
  en-XA e ar-XB), `confronti/` (scorrimento nei due versi con R01, R03, R05, R50, home, «non ancora», «stato»; al telefono con R03, home, «non
  ancora», «stato»), `esiti/confronta-scelta-*.txt` (home, «non ancora», «stato» identiche alla partenza: 0%).
- Controlli verdi: `controlla-sorgenti.mjs` (35 fogli, valori solo nei token), `css_logico.py`, `translations.py extract --check` e `check`
  (361/361), `test_translations.py` (86 OK), `marchio.py --check`.
- Corretti guardando: colonna sinistra del primo schermo troppo alta (stato e didascalia fuori), «Non uso Linux» a capo da solo, pulsante del file
  che spariva per 0,6 s cambiando distribuzione, riga del comando che cresceva mentre si scriveva (la scena saltava al telefono), terminale vuoto
  senza cursore, indirizzo invisibile nella bolla, finestra fuori dallo schermo al telefono, ordine al telefono di «file» e «apri», tratti C e D a
  lati alterni, testo delle frasi enorme senza script, titolo sugli schermi bassi, «Altre» a capo sul tablet, `.deb` a capo da solo.

## In corso
- Niente.

## Prossimo passo
- Costruzione (elenco in `PIANO.md`, «Da completare»), poi il giudice.

## Ultimo comando
- Controlli finali: `test_translations.py`, `marchio.py --check`, `translations.py extract --check` e `check`, `css_logico.py`,
  `controlla-sorgenti.mjs` (da `design-system/`), tutti verdi. Sito costruito: `python3 -I tools/site.py --out /tmp/lavoro-3c-sito-11
  --release-json /tmp/lavoro-3c-dati/releases.json` (dati della release salvati il 17/11, v0.1-rc.1).

## Problemi aperti (per chi coordina)
- `kalliope --version` della 0.1-rc.1 risponde «kalliope 0.1» (versione di Cargo 0.1.0, senza «-rc.1»): la pagina non scrive il numero; serve un
  segnaposto se lo si vuole mostrare (`CONTENUTI.md`, voce 43).
- Preferenze e voce scaricata dopo la rimozione: la pagina di prima e lo script dell'archivio dicono che restano; «stato» e `progetto.md` §7 dicono
  «non verificato». Quale frase tenere (`CONTENUTI.md`, voce 46).
- La ricetta per Arch: `progetto.md` dice «salvare il PKGBUILD vicino al .tar.gz»; la pagina segue la pagina di prima (la ricetta scarica da sé
  l'archivio, come fa il suo `source=`).
- Il telefono girato (844×390): il comando sta nel primo schermo, lo stato «Oggi:» no.
- Solo Chromium; catalogo non toccato (alla costruzione).
