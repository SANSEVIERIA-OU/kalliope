# Incarico 2-s · Il secondo sguardo del giudice: le lingue e la rifinitura di «non ancora»

- **Attività**: `direction-judgment`, il secondo sguardo (skill `design-system-generator`, `references/giudizio.md`),
  ruolo **design-judge**. Non hai reso né costruito nulla di ciò che guardi.
- **Area tua**: `design/lavoro/2-lingue-aspetto/secondo-sguardo/` (`GIUDIZIO.md` scritto mentre procedi, e `progresso.md`).
- **Che cosa guardi**: il commit `22c56ab`, in due parti.
  1. **Le lingue** (incarico 2): rese dalla direzione (`8c7fae1`), giudicate (`2-lingue-aspetto/giudizio/GIUDIZIO.md`: B1,
     I1–I4, M1–M8), corrette (`82823d5`), completate dalla costruzione (`22c56ab`, note in
     `2-lingue-aspetto/costruzione/progresso.md`). Cioè: lo specchio da destra a sinistra, un carattere per scrittura, il
     selettore nella barra, la pagina della scelta (`/` con più lingue), la lingua sola (con il solo italiano il selettore
     non c'è e `/` manda a `/it/`), il precarico dei caratteri.
  2. **La rifinitura di «non ancora»** (incarico 3a-r, `22c56ab`, note in `3a-non-ancora/rifinitura/progresso.md`): i
     cinque minori del secondo sguardo su quella pagina (`3a-non-ancora/secondo-sguardo/GIUDIZIO.md`, N1–N5) e M3, il
     selettore nuovo nella barra, il piede in Firefox. La pagina, prima di questa rifinitura, era già stata giudicata pronta
     e mostrata al proprietario: guarda se la rifinitura la migliora senza rompere ciò che era pronto.

Dopo di te i due lavori vanno al proprietario.

## Il contesto

La direzione è la 2 «Alla pari, in riunione», scelta dal proprietario (`design/direzione-2/D2.md`); la home
(`website/index.html`) è il termine di confronto. Il sito deve poter ricevere 30 lingue (`CLAUDE.md`, «Pronti per le
traduzioni»), comprese arabo e urdu da destra a sinistra, hindi, bengali, cinese, greco e bulgaro. Le traduzioni del sito
di prova sono di prova (oneste, non riviste) e coprono solo la home: nelle altre pagine il testo resta in italiano, ed è
voluto. I testi verranno riscritti da capo: non giudicare la scrittura, ma sì se la pagina inventa funzioni, date o
promesse che il programma non ha (`design/progetto.md`).

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` (il secondo sguardo, «La pagina intera», il riassunto per il proprietario),
   `references/presidi.md` («Testo, lingue e dispositivi»).
2. **Guarda prima di leggere.** Costruisci da una copia del commit, non dalla cartella di lavoro:
   `mkdir -p /tmp/lavoro-2s-radice && git -C /workspace/kalliope archive 22c56ab | tar -x -C /tmp/lavoro-2s-radice`.
   - Il sito vero (solo italiano): `python3 -I /tmp/lavoro-2s-radice/tools/site.py --out /tmp/lavoro-2s-sito`.
   - Il sito a dieci lingue: copia `design/lavoro/2-lingue-aspetto/prova-lingue/*.po` della copia in
     `website/lingue/` della copia, poi costruisci in un'altra cartella. Per le 30 lingue e le pseudo-lingue (`--pseudo`)
     segui «Per la ripresa» in `2-lingue-aspetto/progresso.md`.
   - Servi ciascuno su una porta tua (**8860**–8869).
3. Registra da te (`scripts/sequenza.mjs`) e guarda a grandezza utile, anche accanto alla home (`scripts/affianca.mjs`):
   - la home e «non ancora» in arabo, urdu, hindi, bengali, cinese, greco e tedesco a 1440×900 e 390×844, e almeno una
     larghezza di mezzo (fra 761 e 1180) in arabo e tedesco;
   - il selettore nella barra aperto e chiuso con il mouse e con la tastiera, al computer e nel menu del telefono, e la
     pagina della scelta (`/`) a 1440×900, 390×844 e 844×390;
   - il sito vero: `/` che porta a `/it/`, nessun selettore;
   - «non ancora» in italiano: arrivo e gesto «Ascolta» a 390×844 e 1440×900, e mentre la voce suona sugli schermi bassi
     (844×390, 915×412, 326×326); «Copia» e l'elenco delle versioni che si apre.
4. Poi rileggi i due giudizi precedenti: per ogni problema (lingue: B1, I1–I4, M1–M8; «non ancora»: N1–N5 e M3) dì se è
   risolto, come lo vedi, con la foto. Guarda anche ciò che la correzione e le costruzioni hanno aggiunto o cambiato: un
   problema nuovo conta come gli altri.
5. Le questioni che le costruzioni hanno lasciato a chi giudica, da valutare una per una (che cosa fare, e se ora o dopo):
   - con 30 lingue la pagina della scelta scorre sugli schermi bassi;
   - in bengali «OSI-এর» va a capo dopo il trattino;
   - il file del carattere urdu pesa 234 KB;
   - due regole della barra stanno nel foglio delle lingue invece che in quello della barra;
   - a 326×326 in en-XA la bolla non sta mentre suona (276 px contro 254), in arabo manca 1,9 px;
   - nel selettore il nome «български» ha forme di lettere diverse da quelle russe: dì se sono le forme bulgare del
     carattere (giuste per il bulgaro) o un errore;
   - la riunione più bassa degli schermi bassi è calcolata sull'altezza della finestra: su un telefono vero con la barra
     del browser visibile potrebbe venire più alta del necessario.
6. Solo alla fine leggi le note di chi ha costruito (i due `progresso.md`) e dì se corrispondono a ciò che hai visto.

## Che cosa consegni

`GIUDIZIO.md`, con le due parti separate: lo stato di ogni problema dei giudizi precedenti; i problemi nuovi in ordine di
gravità (**bloccante**, **importante**, **minore**), con foto, dove stanno, perché e la correzione proposta (che cosa, non
come); le risposte al punto 5; se ciascuna delle due parti è pronta per il proprietario; il riassunto per il proprietario
(breve, in chiaro, in italiano semplice, senza nomi di file né sigle).

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-2s-*`; porte dalla **8860** alla 8869. Non toccare le porte 8765 e 8766 né
  `/tmp/kalliope-site` e `/tmp/kalliope-lingue` (del proprietario).
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo. Niente
  commit, niente push, niente comandi che chiedono conferma, nessun altro agente.
