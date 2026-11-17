# Incarico 3a-s · «non ancora»: il secondo sguardo del giudice

- **Attività**: `direction-judgment`, il secondo sguardo (skill `design-system-generator`, `references/giudizio.md`),
  ruolo **design-judge**. Non hai reso né costruito questa pagina.
- **Area tua**: `design/lavoro/3a-non-ancora/secondo-sguardo/` (`GIUDIZIO.md` scritto mentre procedi, e `progresso.md`).
- **Che cosa guardi**: la pagina «non ancora» al commit `b9ba336`, dopo il primo giudizio
  (`design/lavoro/3a-non-ancora/giudizio/GIUDIZIO.md`), la correzione della direzione (commit `0cf5c64`) e il
  completamento della costruzione (commit `b9ba336`). Dopo di te la pagina va al proprietario.

## Il contesto

La pagina è la prima pagina interna rifatta nella direzione 2 «Alla pari, in riunione», scelta dal proprietario
(`design/direzione-2/D2.md`, `PIANO.md`); la home (`website/index.html`) è il termine di confronto, e la pagina fissa la
cornice che riprenderanno stato, installa, in riunione e 404. I testi verranno riscritti da capo: non giudicare la
scrittura, ma sì se la pagina inventa funzioni, date o promesse che il programma non ha (`design/progetto.md`).

Il lavoro sulle lingue (incarico 2) è in correzione in parallelo e toccherà ancora la barra e le pillole condivise per il
testo lungo e porterà il selettore della lingua nella barra di questa pagina: non è materia tua.

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` (il secondo sguardo, «La pagina intera», il riassunto per il proprietario).
2. **Guarda prima di leggere.** La cartella di lavoro cambia mentre lavori: costruisci da una copia del commit,
   `git -C /workspace/kalliope archive b9ba336 | tar -x -C /tmp/lavoro-3as-radice` (crea prima la cartella), poi
   `python3 -I /tmp/lavoro-3as-radice/tools/site.py --out /tmp/lavoro-3as-sito`, servito su una porta tua (**8830**–8839).
   Registra da te arrivo, scorrimento fino in fondo e il gesto «Ascolta» a 390×844 e 1440×900 (`scripts/sequenza.mjs`),
   e guarda la pagina intera a grandezza utile, anche accanto alla home (`scripts/affianca.mjs`).
3. Poi rileggi il primo giudizio: per ogni problema (I1–I6, M1–M8) dì se è risolto, come lo vedi, con la foto. Guarda
   anche ciò che la correzione e la costruzione hanno aggiunto: un problema nuovo conta come gli altri.
4. Rifai da te il percorso della persona P6 di `design/progetto.md` §10 (chi arriva con Windows o macOS: «Posso usarlo?
   Quando?»), al telefono e al computer, e uno stato di errore (il suono che non parte).
5. Una scelta che la costruzione ha lasciato alla direzione, e che chiedo a te di valutare: sugli schermi bassi (altezza
   500, telefono girato 844×390 e 915×412, 326×326), mentre la voce suona, vince la bolla dove le parole si accendono e il
   comando «Pausa» resta sotto il bordo; la regola della home e della cornice (`PIANO.md`, «La cornice») è invece che
   vinca il comando. Le foto delle due soluzioni sono in `design/lavoro/3a-non-ancora/costruzione/foto-difetti/`; le note
   in `costruzione/progresso.md` e in `design-system/metodo.config.mjs` (`limiti`). Dì quale tenere e perché.
6. Solo alla fine leggi le note di chi ha costruito (`costruzione/progresso.md`) e dì se corrispondono a ciò che hai visto.

## Che cosa consegni

`GIUDIZIO.md` con: lo stato di ogni problema del primo giudizio; i problemi nuovi in ordine di gravità (**bloccante**,
**importante**, **minore**), con foto, dove stanno, perché e la correzione proposta (che cosa, non come); la risposta sulla
scelta del punto 5; se la pagina è pronta per il proprietario; il riassunto per il proprietario (breve, in chiaro, in
italiano semplice, senza nomi di file né sigle).

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3as-*`; porte dalla **8830** alla 8839. Non toccare la porta 8765 né 8766 né
  `/tmp/kalliope-site` e `/tmp/kalliope-lingue` (del proprietario), né le porte 8800–8829 (altri worker).
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo. Niente
  commit, niente push, niente comandi che chiedono conferma, nessun altro agente.
