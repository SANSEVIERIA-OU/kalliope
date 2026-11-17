# Incarico 3b · La pagina «stato» nella direzione 2: aspetto e movimento

- **Attività**: `path-look` (skill `design-system-generator`, `routing.json`), ruolo **design-direction**.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file; le domande vanno a chi coordina,
  nella risposta finale.
- **Area tua**: `design/lavoro/3b-stato/` (tieni lì `progresso.md` aggiornato a ogni unità finita: fatto, in corso,
  prossimo passo, ultimo comando, problemi aperti; lì vanno anche piano, elenco dei contenuti, foto e sequenze).
- **Punto di partenza**: commit `e429a28`.

## Leggi prima

1. `CLAUDE.md` (tutto) e `design/lavoro/STATO.md` (le decisioni del 16 e del 17/11/2026).
2. La direzione scelta dal proprietario, che è il termine di confronto: `design/direzione-2/LEGGIMI.md`, `D2.md`,
   `PIANO.md` (la home intera, tratto per tratto).
3. **La prima pagina interna, che fissa la cornice**: «non ancora» (`website/non-ancora/`, `website/cornice.js`,
   `design-system/componenti/pagina.css`) e il suo percorso: `design/lavoro/3a-non-ancora/PIANO.md` (soprattutto «La
   cornice»), `CONTENUTI.md`, i due giudizi (`giudizio/GIUDIZIO.md`, `secondo-sguardo/GIUDIZIO.md`) e
   `rifinitura/progresso.md`. Ciò che i giudici hanno chiesto lì vale anche qui: non rifare gli stessi errori.
4. Il sistema su cui si costruisce: `design-system/SISTEMA.md`, `TOKEN.md`, `token.css`, `componenti/`, il catalogo
   (`design-system/catalogo/`). La home viva: `website/index.html`, `website/scena.js`.
5. Le lingue: `docs/translating.md` (come si segnano i testi con `data-t`), `design-system/caratteri/LEGGIMI.md`,
   `design/lavoro/2-lingue-aspetto/progresso.md` («Al ruolo di costruzione»).
6. La skill: `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/` —
   `SKILL.md`, `references/direzione.md` (§6, il percorso nella direzione scelta), `references/giudizio.md` (parte D e
   «La pagina intera»: è ciò su cui ti giudicheranno), `references/movimento.md`, `references/scrittura.md`,
   `references/esecuzione.md` (regole dei worker).

## Lo scopo

Il proprietario ha chiesto di rifare le pagine del sito nella direzione 2, sopra il design system, una alla volta.
«non ancora» è fatta e mostrata. Questa è la seconda: **«stato»** (oggi «Stato e limiti», `website/stato/index.html`):
com'è messo Kalliope oggi, per chi è e per chi no, che cosa è stato provato e che cosa no, e i fatti per chi deve
controllare prima di fidarsi.

Il tuo lavoro è decidere e rendere **l'aspetto e il movimento della pagina intera** (direzione.md §6, punto 1). Il
completamento (stati, errori, tutte le larghezze, tre motori, pseudo-lingue, catalogo) lo farà dopo il ruolo di
costruzione, senza ridisegnare; poi un giudice che non sei tu; poi il proprietario.

## Che cosa dice la pagina

- Fonti: `design/progetto.md` §10, le persone che arrivano qui — **P3** (valutare per un'altra persona), **P7**
  (controllare prima di fidarsi), la parte di **P8** sulle misure, la tabella «provato / non provato» di **P5** e **P9**
  (dire come è andata) —, §1.4 e §9 per ciò che è escluso e va detto, e la pagina di oggi `website/stato/index.html`.
  La pagina nuova porta i fatti della vecchia, riordinati per chi arriva.
- Il proprietario ha deciso che **i testi verranno riscritti da capo**: non rifinirli, non chiedere contenuti. Ma non
  inventare: nessuna funzione che il programma non ha, nessuna data promessa, nessuna alternativa di terzi; ogni cifra
  dice dove è stata misurata (P8, «Regole»); ogni affermazione per chi controlla ha la sua fonte (P7, «Regole»). Due
  decisioni del 17/11 da rispettare: per il telefono non si dice «non ancora» (per ora è solo per il computer); il
  programma parlerà con la voce di chi lo usa, ma **oggi non lo fa**: la pagina non lo presenta come presente e non lo
  promette con una data.
- Le versioni, le date e le note «di prova» vengono dai dati della versione (segnaposto di `tools/site.py`,
  `data-release`): mai scritte a mano.
- Prima di rendere, scrivi in `design/lavoro/3b-stato/CONTENUTI.md` (direzione.md §6, punto 0) una riga per voce: dove sta
  nella pagina, oppure «lasciata fuori» con il motivo.

## I vincoli

- **Lo stesso mondo della home e di «non ancora»**: un solo colore, la riunione, la bolla, i riquadri, le onde, la
  stessa curva d'entrata e lo stesso linguaggio di movimento. In ogni tratto qualcosa che accade perché serve a capire, a
  provare o a decidere; fra un tratto e l'altro un cambio di scena, non una fascia vuota; nessuna scheda uguale alle altre
  messa in fila (giudizio.md, parte D). Una pagina di fatti e di tabelle è il rischio più grande: trova il modo in cui i
  fatti si vedono accadere, senza decorarli. Prima guarda che cosa fanno i riferimenti sotto il primo schermo e nelle
  pagine interne: `/workspace/prova-design-abc/prova-2/riferimenti/` (`primi-schermi/`, `sequenze/`, `schede/`,
  `classifica.md`) e `design/ricerca/schede/R*.md`.
- **La cornice è quella di «non ancora»** (barra con il selettore della lingua, apertura, passaggi, piede, comportamento
  sugli schermi bassi). Riusala; se per questa pagina qualcosa della cornice deve cambiare, aggiungi senza cambiare
  l'aspetto di «non ancora» e dillo con il motivo.
- **Sopra il design system**: la pagina collega `design-system/token.css`, `base.css` e solo i componenti che usa
  (`SISTEMA.md`, «Come si usa per un'altra pagina»). Ogni valore viene da `token.css`; un valore nuovo entra lì con il
  suo ruolo; un pezzo nuovo che le altre pagine riuseranno diventa un componente nuovo in `design-system/componenti/`.
  Nessun valore scritto a mano nella pagina, nessun secondo sistema; `controlla-sorgenti.mjs` verde.
- **Pronta per le lingue**: solo proprietà logiche (mai sinistra/destra; `tools/css_logico.py` verde); ciò che ha un
  verso usa `--verso`; i testi segnati con `data-t` come in «non ancora»; il testo deve poter crescere del 40% senza
  rompere la composizione.
- **Movimento ridotto e senza JavaScript**: un ripiego che mostra tutto, non un'esclusione.
- **Una lingua sola**: con il solo italiano il selettore non si mostra (lo toglie la costruzione); provalo anche con il
  sito a più lingue (`design/lavoro/2-lingue-aspetto/prova-lingue/`, «Per la ripresa» in `2-lingue-aspetto/progresso.md`).

## Lavoro in parallelo

Un giudice (incarico 2-s) sta guardando le lingue e «non ancora» al commit `22c56ab`: legge soltanto, ma i suoi difetti
potranno portare correzioni alla cornice dopo di te. Non c'è nessun altro ruolo di costruzione al lavoro sul sito. Non
toccare `website/non-ancora/`, `lingue.html`, `lingua.js`, `lingue.css`, `catalogo-lingue.*`. Nei file condivisi
(`token.css`, `TOKEN.md`, `SISTEMA.md`, `metodo.config.mjs`, `pagina.css`, `cornice.js`, il catalogo, `it.po`) aggiungi
senza riordinare e non cambiare ciò che usa «non ancora».

## Le prove che fai tu

- Registra arrivo, scorrimento e i gesti alle due misure 390×844 e 1440×900 (`scripts/sequenza.mjs`); metti la pagina
  accanto agli scorrimenti dei tre riferimenti più forti, accanto alla home e accanto a «non ancora»
  (`scripts/affianca.mjs`).
- `controlla-sorgenti.mjs` (da `design-system/`; aggiungi la pagina a `metodo.config.mjs`), `css_logico.py`,
  `translations.py extract --check` e `check`, `test_translations.py` verdi.
- Scrivi il piano dei tratti (come `PIANO.md`: per ogni tratto che cosa è dentro l'idea, che cosa si muove e a che
  scopo, la fonte o la motivazione) e l'elenco di ciò che lasci da completare al ruolo di costruzione.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3b-*`, porte tue dalla **8870** alla 8879. Le porte 8765 e 8766, `/tmp/kalliope-site` e
  `/tmp/kalliope-lingue` sono del proprietario; 8860–8869 del giudice 2-s.
- Nessuna finestra sullo schermo (browser senza `DISPLAY` né `WAYLAND_DISPLAY`: sono lo schermo vero del proprietario).
  Niente `mostra.mjs`, niente `cancello.mjs --apri`.
- Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente cancellazioni fuori dalle tue
  cartelle in `/tmp`. **Non fare commit e non fare push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file creati e toccati (pagina, componenti, token nuovi con il ruolo), il
piano dei tratti, i percorsi delle sequenze e dei confronti, `CONTENUTI.md`, l'elenco di ciò che resta al ruolo di
costruzione, ciò che non hai verificato e le scelte che hai fatto senza una fonte (dichiarate come progettuali).
