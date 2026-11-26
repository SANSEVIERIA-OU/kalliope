# Incarico 3b-b · La pagina «stato»: completare senza ridisegnare

- **Attività**: `path-build` + `language` + `catalog` (skill `design-system-generator`), ruolo **design-build**.
- **Area tua**: `design/lavoro/3b-stato/costruzione/` (`progresso.md` aggiornato a ogni unità finita; lì anche gli esiti
  delle prove mentre li trovi).
- **Punto di partenza**: commit `c8d2aa3`.

## Leggi prima

1. `CLAUDE.md`, `design/lavoro/STATO.md` (anche le decisioni di chi coordina sulle righe 3b, 3b-g, 3b-c).
2. La pagina e il suo lavoro: `website/stato/index.html`, `stato.js`, `website/cornice.js`,
   `design-system/componenti/pagina.css`, `riunione-provata.css`, `catena.css`, `domande.css`, `varco.css`, `inoltra.css`;
   `design/lavoro/3b-stato/PIANO.md` (soprattutto l'elenco per la costruzione), `CONTENUTI.md`, `progresso.md` (anche
   «Correzione dopo il giudizio»); il giudizio `3b-stato/giudizio/GIUDIZIO.md`.
3. Come è stata completata «non ancora», da riprendere e non da rifare: `3a-non-ancora/costruzione/progresso.md`,
   `3a-non-ancora/rifinitura/progresso.md`, `2-3a-correzioni/progresso.md` e le loro prove in `prove/`.
4. Le lingue: `docs/translating.md`; il sito a più lingue con le traduzioni di prova (`STATO.md`, «Ambiente delle prove»:
   dopo testi nuovi, `crea_cataloghi.py`).
5. La skill (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/direzione.md` §6 punto 2, `references/prove.md`, `references/presidi.md`, `references/catalogo.md`,
   `references/esecuzione.md`.

## Che cosa fare

1. **Catalogo (I5)**: i cinque componenti di «stato» entrano nel catalogo vivo con varianti e stati, compresi i dettagli
   a richiesta e la parentesi «non misurato» che segue i nodi; la sezione si apre senza errori in tre motori.
2. **Dati, non scritti a mano**: l'indirizzo mostrato nella bolla del messaggio e quello copiato sono lo stesso e vengono
   dai dati del sito (M5), come il `canonical`; i moltiplicatori della discesa dei file in `stato.js` vanno nei token.
3. **Le fonti si aprono (M7, deciso da chi coordina)**: ogni fonte citata accanto a una cifra o a un fatto è un
   collegamento al file nel repository pubblico (`https://github.com/SANSEVIERIA-OU/kalliope`) **alla versione mostrata
   dalla pagina**, preso dai dati della versione di `tools/site.py`, mai scritto a mano; verifica che ogni collegamento
   porti a un file che esiste a quella versione (una prova nella costruzione o in `test_translations.py`, come per i
   collegamenti interni).
4. **M11**: senza i caratteri del sito l'etichetta di «Tu» va su due righe: deve stare su una, senza cambiare l'aspetto
   con i caratteri del sito.
5. **I3 riprovato su «stato»** dopo la correzione della cornice (senza `cornice.js` tutto si vede), in tre motori.
6. **Stati, errori e recupero**: le domande (tastiera, ordine del fuoco, annuncio della risposta per i lettori di
   schermo), «Copia il messaggio» che riesce e non riesce, i dettagli a richiesta quando si passa da telefono a computer e
   ritorno (la scelta della persona non si perde), senza JavaScript, il movimento ridotto, lo scorrimento veloce (la
   catena non deve restare indietro), il ritorno in su, la scheda in secondo piano, il ritorno e la ricarica.
7. **Tutte le larghezze**: le soglie della pagina (`scripts/soglie.mjs`, comprese quelle d'altezza) e i dispositivi
   (`scripts/dispositivi.mjs`) in Chromium; 390×844, 1440×900, 844×390, 360×640 anche in Firefox e WebKit;
   `esame-impaginazione.mjs` e `dispositivi-qa.mjs` con gli stati che cambiano l'impaginazione (menu aperto, una domanda
   aperta, dettagli aperti, copia fatta) nella configurazione. Le 40 segnalazioni che l'esame dà oggi su «stato»
   (`2-3a-correzioni/progresso.md`) vanno lette una per una: correggi le tue, scrivi le altre.
8. **Lingue**: la pagina si costruisce in ogni lingua con un `.po` completo; rigenera le traduzioni di prova se aggiungi
   testi; fotografa en-XA e ar-XB (`--pseudo`) e arabo e urdu del sito di prova a 390×844 e 1440×900, e scrivi che cosa si
   rompe con la foto, **senza ridisegnare**.

Non cambi colori, caratteri, composizione, curve o durate; non togli e non attenui movimento; nessun valore fuori da
`token.css`. Un difetto d'aspetto che non è tuo da decidere lo scrivi, con la foto. Le prove girano tutte sugli stessi file
finali: registra le impronte. Home e «non ancora» restano identiche a `c8d2aa3` (`confronta-scelta.mjs`).

## Lavoro in parallelo

Nessun altro ruolo lavora adesso sul sito. Una misura (incarico V-m) lavora in `benchmarks/voce-propria/` e in
`/workspace/kalliope/materiali-locali/prove-voce/bench/`: non riguarda il sito, ma usa la CPU; misura i tempi delle sequenze con questo in mente.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3bb-*`, porte tue dalla **8910** alla 8919. Le porte 8765 e 8766, `/tmp/kalliope-site` e
  `/tmp/kalliope-lingue` sono del proprietario; 8900–8909 dell'incarico V-m.
- Nessuna finestra sullo schermo. Niente comandi che chiedono conferma, niente lavori in background da aspettare (niente
  `&`), niente cancellazioni fuori dalle tue cartelle in `/tmp`. **Non fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file toccati, gli esiti delle prove con i numeri (larghezze, motori, stati,
lingue), le impronte dei file provati, ciò che si rompe nelle lingue con le foto, i difetti d'aspetto trovati e non tuoi,
ciò che non hai verificato.
