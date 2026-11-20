# Incarico 3c-b · La pagina «installa»: completare senza ridisegnare

- **Attività**: `path-build` + `language` + `catalog` (skill `design-system-generator`), ruolo **design-build**.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Area tua**: `design/lavoro/3c-installa/costruzione/`. Tieni `progresso.md` aggiornato a ogni unità finita; lì vanno anche
  gli esiti delle prove, mentre li trovi.
- **Punto di partenza**: commit `548a6f2`.

## Leggi prima

1. `CLAUDE.md` e `design/lavoro/STATO.md`.
2. **La pagina e il suo lavoro**:
   - `website/installa/index.html`, `installa.js`, `website/cornice.js`;
   - i componenti nuovi `design-system/componenti/scelta-sistema.css`, `comando.css`, `terminale.css`, `installazione.css`;
   - `design/lavoro/3c-installa/PIANO.md`, soprattutto «Da completare»;
   - `CONTENUTI.md`, `progresso.md`, le sequenze e le foto.
3. **Come sono state completate «non ancora» e «stato»**: le riprendi, non le rifai.
   - `3a-non-ancora/costruzione/progresso.md`, `3b-stato/costruzione/progresso.md`, `3b-stato/rifinitura/progresso.md`;
   - le loro prove in `prove/`.
4. **Le lingue**: `docs/translating.md`. Il sito a più lingue si costruisce con le traduzioni di prova (`STATO.md`, «Ambiente
   delle prove»); dopo testi nuovi lancia `crea_cataloghi.py`.
5. **La skill**, versione 0.49.0, in `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`:
   `references/direzione.md` §6 punto 2, `references/prove.md`, `references/presidi.md`, `references/catalogo.md`,
   `references/esecuzione.md`.

## Le risposte di chi coordina alle domande della direzione

1. **`kalliope --version`.** Il programma risponde con la versione senza la parte di prova: la 0.1-rc.1 dice «kalliope 0.1».
   - La pagina non scrive il numero a mano. Aggiungi in `tools/site.py` un segnaposto per la versione come la dice il
     programma, ricavata dal tag della versione offerta, con la sua prova in `test_translations.py`.
   - Prima verifica che cosa stampa davvero il programma, nel codice e nel pacchetto della 0.1-rc.1, se lo hai.
2. **Che cosa resta togliendo Kalliope.** La pagina dice ciò che fanno davvero lo script dell'archivio e i pacchetti.
   Leggili (`packaging/linux/install`, la rimozione del `.deb` e del `.rpm`) e leggi dove il programma tiene le sue cose
   (`crates/app/src/paths.rs`, alla versione offerta).
   - I pacchetti non toccano le cartelle di casa: preferenze e voce scaricata restano, e la pagina dice dove sono e come
     toglierle a mano.
   - Se una cosa non è verificabile dal codice, si dice «non verificato», come fa «stato».
   - Riporta la frase scelta e la fonte in `CONTENUTI.md`.
3. **Arch.** Si segue ciò che fa davvero il PKGBUILD della versione offerta (`kalliope-bin.PKGBUILD` nella release v0.1-rc.1,
   o `packaging/aur/PKGBUILD` a quel tag). Se scarica da sé l'archivio, la pagina dice così. Correggi la riga di
   `design/progetto.md` §P4 solo se è sbagliata, con la fonte.

## Che cosa fare

1. **Il catalogo vivo**: i quattro componenti nuovi, cioè la scelta del sistema, il comando da copiare, il terminale e
   l'installazione, entrano nel catalogo, in un suo file `catalogo-installa.*`, con varianti e stati. La sezione si apre
   senza errori in tre motori.
2. **I vecchi indirizzi**: le ancore della pagina di prima (`#fedora`, `#passo-1`, …, l'elenco è in `PIANO.md`) portano al
   punto giusto della pagina nuova.
3. **Stati, errori e recupero**:
   - la scelta della distribuzione con tastiera, mouse, tocco e senza JavaScript; la scelta resta tornando indietro e
     ricaricando;
   - «Copia» che riesce e che non riesce, nei tre motori e senza permesso agli appunti;
   - le frasi della finestra con tastiera e lettori di schermo: ordine del fuoco e annuncio;
   - movimento ridotto, scorrimento veloce, ritorno in su, scheda in secondo piano.
4. **Tutte le larghezze**:
   - le soglie della pagina (`scripts/soglie.mjs`, comprese quelle d'altezza) e i dispositivi (`scripts/dispositivi.mjs`)
     in Chromium;
   - 390×844, 1440×900, 844×390 e 360×640 anche in Firefox e WebKit;
   - `esame-impaginazione.mjs` e `dispositivi-qa.mjs` con gli stati che cambiano l'impaginazione: distribuzione scelta, una
     frase della finestra aperta, copia fatta, menu aperto.

   I difetti che la direzione ha già visto si risolvono senza ridisegnare: il pulsante del file che esce dallo schermo in
   en-XA a 1366×640, lo stato «Oggi:» a 844×390, la ripetizione dell'entrata senza JavaScript.
5. **Le lingue**:
   - la pagina si costruisce in ogni lingua con un `.po` completo;
   - rigenera le traduzioni di prova;
   - fotografa en-XA e ar-XB (`--pseudo`), l'arabo e l'urdu del sito di prova, a 390×844 e a 1440×900;
   - comandi e nomi dei file restano leggibili da sinistra a destra anche da destra a sinistra;
   - scrivi che cosa si rompe, con la foto, senza ridisegnare.

**Senza ridisegnare.**
- Non cambi colori, caratteri, composizione, curve o durate. Non togli e non attenui movimento. Nessun valore fuori da
  `token.css`.
- Un difetto d'aspetto che non è tuo da decidere lo scrivi, con la foto.
- Le prove girano tutte sugli stessi file finali: registra le impronte.
- Home, «non ancora» e «stato» restano identiche al punto di partenza (`confronta-scelta.mjs`).

## Le prove

- **I controlli**: `controlla-sorgenti.mjs` (da `design-system/`), `css_logico.py`, `translations.py extract --check` e
  `check`, i test degli strumenti (`python3 -I -m unittest discover -s tools -p 'test_*.py'`), `marchio.py --check`, tutti
  verdi.
- **Le costruzioni**: il sito vero e il sito in dieci lingue, il secondo da una copia, con `--pseudo`.
- **Le pagine costruite**: 0 errori in console e 0 richieste fallite, a tutte le larghezze provate.

## Ambiente

- `source /workspace/kalliope-playwright/env.sh`: Playwright 1.65.1 con i tre motori. Firefox e WebKit si lanciano con
  `avvia()` della skill.
- **Cartelle e porte**:
  - le tue cartelle sono `/tmp/lavoro-3cb-*`;
  - le tue porte vanno dalla **8890** alla 8899;
  - le porte 8765–8767 sono del proprietario, la 8770 serve la pagina della scelta del logo.
- **Lo schermo**: nessuna finestra. Usa browser senza `DISPLAY` né `WAYLAND_DISPLAY`. Niente `mostra.mjs`, niente
  `cancello.mjs --apri`.
- **Che cosa non fare**:
  - niente comandi che chiedono conferma, né lavori in background da aspettare;
  - **niente commit e niente push**;
  - non creare altri agenti.
- **La memoria è stretta**: un browser alla volta, e controlla `free -m` (sotto 1,5 GB disponibili, aspetta).
- `design/STATO.md` è un file vecchio modificato da altri: non toccarlo.

## Consegna

Nella risposta finale e in `progresso.md`:
- che cosa hai completato;
- le risposte alle tre domande, con le fonti;
- gli esiti delle prove con i numeri e le impronte;
- i difetti d'aspetto che lasci al giudice o al proprietario, con le foto;
- ciò che non hai verificato.
