# Incarico 3a-g · Giudizio della pagina «non ancora»

- **Attività**: `direction-judgment` (skill `design-system-generator`), ruolo **design-judge**. Non hai reso né
  costruito questa pagina: giudichi il lavoro di un altro.
- **Area tua**: `design/lavoro/3a-non-ancora/giudizio/` (scrivi lì `GIUDIZIO.md` mentre procedi, non solo alla fine,
  e `progresso.md`).

## Che cosa giudichi

La pagina `website/non-ancora/index.html` (con `non-ancora.js`, `website/cornice.js` e i componenti nuovi
`design-system/componenti/pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`), resa dal ruolo di
direzione. È la prima pagina interna rifatta nella direzione 2 «Alla pari, in riunione», scelta dal proprietario
(`design/direzione-2/D2.md`, `PIANO.md`); la home (`website/index.html`) è ciò che il proprietario ha scelto e il
termine di confronto. Questa pagina fissa anche la cornice che riprenderanno stato, installa, in riunione e 404.

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` per intero (la scheda di giudizio, il giudizio a coppie, **«La pagina intera»**, il
   riassunto per il proprietario), `references/direzione.md` §6.
2. **Guarda prima di leggere le note di chi l'ha resa.** Costruisci il sito
   (`python3 -I tools/site.py --out /tmp/lavoro-3ag-sito`; se non funziona perché un altro worker sta cambiando
   `tools/site.py`, usa il trucco della sezione «Lavoro in parallelo» di `design/lavoro/incarichi/3a-non-ancora-aspetto.md`
   con le cartelle `/tmp/lavoro-3ag-*`), servilo su una porta tua (**8790** in su) e apri la pagina (`/it/non-ancora/`
   o `/non-ancora/`, secondo la costruzione). Registra da te arrivo, scorrimento e il gesto «Ascolta» a 390×844 e
   1440×900 (`scripts/sequenza.mjs`), e guarda le foto a grandezza utile.
3. Mettila accanto alla home e ai riferimenti più forti, anche sotto il primo schermo
   (`/workspace/prova-design-abc/prova-2/riferimenti/`: `primi-schermi/`, `sequenze/`, `classifica.md`;
   `design/ricerca/schede/`), con `scripts/affianca.mjs` nei due versi.
4. Fai da te il percorso della persona di `design/progetto.md` §10 **P6** (chi arriva con Windows o macOS: «Posso
   usarlo? Quando?»), al telefono e al computer.
5. Solo dopo, leggi le note di chi l'ha resa: `design/lavoro/3a-non-ancora/PIANO.md`, `CONTENUTI.md`, `progresso.md`
   e le sue sequenze in `sequenze/` e `confronti/`; dì se le note corrispondono a ciò che hai visto.

Il proprietario ha deciso che **i testi verranno riscritti da capo**: non giudicare la scrittura, ma sì se la pagina
inventa funzioni, date o promesse che il programma non ha, o tace qualcosa che `progetto.md` vuole spiegato.

## Che cosa consegni

`GIUDIZIO.md` con: la scheda di giudizio compilata; i problemi in ordine di gravità (**bloccante**, **importante**,
**minore**), ciascuno con la foto o il fotogramma, dove sta, perché è un problema rispetto alla scelta del proprietario
o ai riferimenti, e la correzione che proponi (che cosa, non come scriverla); ciò che funziona e va tenuto; il
riassunto per il proprietario (breve, in chiaro). Il giudizio è sul risultato, non sull'impegno.

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3ag-*`; porte dalla 8790. Non toccare la porta 8765 né `/tmp/kalliope-site` (del
  proprietario), né le porte 8770–8789 (altri worker).
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo (browser
  senza `DISPLAY` né `WAYLAND_DISPLAY`). Niente commit, niente push, niente comandi che chiedono conferma, nessun altro
  agente.
