# Incarico 3b-g · Giudizio della pagina «stato»

- **Attività**: `direction-judgment` (skill `design-system-generator`), ruolo **design-judge**. Non hai reso né
  costruito questa pagina: giudichi il lavoro di un altro.
- **Area tua**: `design/lavoro/3b-stato/giudizio/` (scrivi lì `GIUDIZIO.md` mentre procedi, non solo alla fine, e
  `progresso.md`).

## Che cosa giudichi

La pagina «stato» al commit `b456308`: `website/stato/index.html` con `stato.js`, la cornice (`website/cornice.js`,
`design-system/componenti/pagina.css`) e i componenti nuovi `riunione-provata.css`, `catena.css`, `domande.css`,
`varco.css`, `inoltra.css`, resa dal ruolo di direzione. È la seconda pagina interna rifatta nella direzione 2 «Alla pari,
in riunione», scelta dal proprietario (`design/direzione-2/D2.md`, `PIANO.md`); la home (`website/index.html`) è ciò che
il proprietario ha scelto e il termine di confronto; «non ancora» (`website/non-ancora/`) è la prima pagina interna,
mostrata al proprietario, e ha fissato la cornice.

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` per intero (la scheda di giudizio, il giudizio a coppie, **«La pagina intera»**, il riassunto
   per il proprietario), `references/direzione.md` §6.
2. **Guarda prima di leggere le note di chi l'ha resa.** Costruisci da una copia del commit, non dalla cartella di lavoro
   (un altro ruolo sta cambiando file comuni): `mkdir -p /tmp/lavoro-3bg-radice && git -C /workspace/kalliope archive
   b456308 | tar -x -C /tmp/lavoro-3bg-radice`, poi `python3 -I /tmp/lavoro-3bg-radice/tools/site.py --out
   /tmp/lavoro-3bg-sito`, servito su una porta tua (**8880**–8889). Apri `/it/stato/`. Registra da te arrivo,
   scorrimento fino in fondo e i gesti della pagina (le domande, «Copia il messaggio») a 390×844 e 1440×900
   (`scripts/sequenza.mjs`), e guarda le foto a grandezza utile.
3. Mettila accanto alla home, a «non ancora» e ai riferimenti più forti, anche sotto il primo schermo
   (`/workspace/prova-design-abc/prova-2/riferimenti/`: `primi-schermi/`, `sequenze/`, `classifica.md`;
   `design/ricerca/schede/`), con `scripts/affianca.mjs` nei due versi.
4. Fai da te i percorsi delle persone di `design/progetto.md` §10 che arrivano qui: **P3** (un familiare o un logopedista
   che valuta per un'altra persona, spesso dal telefono: «È adatto? Cosa serve? Costa? Posso fidarmi?») e **P7** (chi deve
   controllare prima di fidarsi: dati, licenze, impronte), al telefono e al computer; e **P9** (dire come è andata).
5. Solo dopo, leggi le note di chi l'ha resa: `design/lavoro/3b-stato/PIANO.md`, `CONTENUTI.md`, `progresso.md`, le
   sequenze e i confronti; dì se corrispondono a ciò che hai visto. Chi l'ha resa dice deboli tre cose: la lunghezza
   (circa 7.400 px a 1440), il vuoto chiaro fra i passi del tratto «Il testo non esce dal computer», la catena fitta di
   testo per chi legge dal telefono: dì che cosa ne pensi.

Il proprietario ha deciso che **i testi verranno riscritti da capo**: non giudicare la scrittura, ma sì se la pagina
inventa funzioni, date o promesse che il programma non ha, o tace qualcosa che `progetto.md` vuole spiegato. Due
decisioni del 17/11 da tenere presenti: per il telefono non si dice «non ancora»; il programma parlerà con la voce di chi
lo usa, ma oggi non lo fa (la pagina non deve presentarlo come presente).

Già noti, non da ritrovare: in Chromium al telefono aprire e chiudere il menu fa salire la pagina (della cornice, in
correzione in parallelo, incarico 2-f); i difetti L1–L3 e P1 del secondo sguardo sulle lingue.

## Che cosa consegni

`GIUDIZIO.md` con: la scheda di giudizio compilata; i problemi in ordine di gravità (**bloccante**, **importante**,
**minore**), ciascuno con la foto o il fotogramma, dove sta, perché è un problema rispetto alla scelta del proprietario o
ai riferimenti, e la correzione che proponi (che cosa, non come scriverla); ciò che funziona e va tenuto; se la pagina è
pronta per la correzione o va rifatta in parte; il riassunto per il proprietario (breve, in chiaro, in italiano semplice,
senza nomi di file né sigle). Il giudizio è sul risultato, non sull'impegno.

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3bg-*`; porte dalla **8880** alla 8889. Non toccare le porte 8765 e 8766 né
  `/tmp/kalliope-site` e `/tmp/kalliope-lingue` (del proprietario), né le porte 8890–8899 (altro worker).
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo (browser
  senza `DISPLAY` né `WAYLAND_DISPLAY`). Niente commit, niente push, niente comandi che chiedono conferma, nessun altro
  agente.
