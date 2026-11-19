# Incarico L-1 · Il logo: tre direzioni rese al loro posto

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Il ruolo**: direzione (`vibe-next:design-direction`) della skill `design-system-generator`, versione 0.49.0
  (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`). Leggi `SKILL.md`,
  `references/direzione.md` (§1–§3 e §5) e `references/giudizio.md` (parte E, lo stile di default).
- **La decisione del proprietario** (19/11/2026): «rifarei il logo perché con il nuovo sito c'entra poco». Il modo e l'ordine
  li ha lasciati a chi coordina («fai quello che reputi più giusto per il successo del progetto»). **La scelta fra le tre
  direzioni resta del proprietario.**

## Da leggere prima

1. `CLAUDE.md`, che comanda per tutto il repository.
2. `design/progetto.md`: che cosa fa Kalliope e per chi.
3. `design/direzione-2/D2.md` e `LEGGIMI.md`: la direzione del sito nuovo, «Alla pari, in riunione».
4. `design-system/SISTEMA.md` e `design-system/token.css`: il sistema di oggi.
5. `design/lavoro/ricerca/logo.md`: le regole ufficiali delle icone di Linux, Windows, macOS e dei browser, raccolte oggi,
   e che cosa ne viene per il logo. **Sono requisiti, non suggerimenti.**
6. I riferimenti della direzione 2: `/workspace/prova-design-abc/prova-2/riferimenti/` (primi schermi in `primi-schermi/`;
   R01, R03 e R51 sono le fonti di D2) e le schede in `design/ricerca/schede/`.

## Il logo di oggi e perché si rifà

- **Com'è**: una bolla verde acqua (`#2fb39a` → `#16806f`) con cinque barre bianche del suono.
- **Dove sta**:
  - `website/immagini/icona.svg`, l'icona della scheda;
  - `packaging/linux/io.github.sansevieria_ou.kalliope.svg`, l'icona del programma;
  - scritto a mano dentro ogni pagina, nella barra, a 36 px (30 px al telefono).
- **Perché non va**: viene dal sito di prima. Nella direzione 2 il suo verde è l'unica eccezione a un mondo di un solo
  colore, il bordeaux. La bolla delle pagine ne ha preso il profilo (raggio 22 e coda a punta).
- **Che cosa rifare**: il proprietario vuole un logo nuovo, non questo ricolorato. Una direzione può tenere la bolla come
  idea solo se la ripensa davvero, e lo dichiara.

Un fatto utile: il nome viene dal greco Καλλιόπη, «dalla bella voce», la musa dell'eloquenza.

## Che cosa rendere

**Tre direzioni.**
- Ognuna ha un'idea sola, detta in una frase e legata a ciò che Kalliope fa: chi non può parlare scrive, e una voce parla
  per lui nella riunione, alla pari.
- Sono davvero diverse: in metafora, forma, uso del colore e modo di vivere nella barra. Tre colori sullo stesso segno non
  sono tre direzioni.
- Prima delle direzioni scrivi il criterio di ambizione (`direzione.md` §1): che cosa questo logo fa che i loghi dei
  riferimenti e dei programmi simili non fanno.

**Ogni direzione si rende, non si descrive.** In `design/lavoro/L-logo/direzioni/<n>-<nome>/`:

1. **Il disegno.**
   - **Il disegno principale** in SVG, su una tela di 128, con la forma libera su fondo trasparente.
   - **La forma piena**, che regge dentro il quadrato arrotondato di macOS.
   - **La versione simbolica** di un colore solo, 16×16, come chiede GNOME.

   Nessuna lettera, nessuna ombra fuori dalla sagoma, nessuna linea sottile che a 16 px sparisce (`ricerca/logo.md`).
2. **I suoi token**: i colori, ed eventuali tempi e curve, stanno in un solo file di token della direzione, con nomi per
   ruolo. I colori nascono dal mondo della direzione 2; un colore nuovo si motiva. Il nome «Kalliope» accanto al disegno
   usa il carattere e i token del sito.
3. **Al suo posto, alle grandezze vere**, in una pagina di prova:
   - **la barra vera del sito** con il logo nuovo al posto di quello di oggi:
     - home a 1440×900 e a 390×844;
     - la barra con l'azione, dove resta solo il disegno;
     - una pagina da destra a sinistra (pseudo-lingua `ar-XB`), dove il disegno non si specchia;
   - **la scheda del browser** a 16 e 32 px, su una barra delle schede chiara e su una scura;
   - **il computer**: il menu delle applicazioni di GNOME (fondo scuro) e di KDE (fondo chiaro), la barra delle applicazioni
     a 32 e 48 px, la scheda nel negozio dei programmi a 64 e 128 px, il Dock di macOS con la forma piena. Sono
     ricostruzioni: dillo nella pagina, e prendi misure e fondi dalle fonti ufficiali o da foto ufficiali;
   - **la scala** a 16, 24, 32, 48, 64, 128 e 256, su chiaro, su scuro e sul bordeaux del sito.
4. **In movimento**, se l'idea lo chiede: come vive il logo nella barra, per esempio alla pressione, al passaggio del
   puntatore o quando la voce della home parla. Piccolo e mai fine a sé stesso, con il ripiego per il movimento ridotto.
   Le icone del programma restano ferme.
5. **Le prove**:
   - le foto di ogni contesto;
   - per la barra e il movimento, `sequenza.mjs` (fogli per chi giudica, video per chi decide);
   - prima di consegnare, guarda ogni direzione accanto ai primi schermi di R01, R03 e R51 e alle icone di programmi
     simili. Correggi ciò che stona.
6. **Le note**:
   - `idea.md`, con l'idea, le scelte e le fonti di ogni valore, o la motivazione progettuale;
   - i difetti che vedi tu;
   - come ne verrebbero l'icona per Windows (ICO) e per macOS (ICNS).

Una pagina sola, `design/lavoro/L-logo/direzioni/index.html`, mette le tre direzioni una accanto all'altra negli stessi
contesti.

## Regole

- **Non toccare** `website/`, `design-system/`, `packaging/`, `crates/`.
  - Per la barra vera lavora su una copia: copia `website/` e `design-system/` in una cartella `/tmp/l1-*` e cambia lì il
    logo.
  - Costruisci con `python3 -I tools/site.py --website COPIA --system COPIA --out /tmp/l1-sito-<n>`; aggiungi `--pseudo`
    per `ar-XB`. Per non dipendere dalla rete, `--release-json /tmp/lavoro-3ab-releases.json` è una risposta salvata
    dell'API delle release.
  - Il sistema vero si cambia solo dopo la scelta del proprietario, e non lo fai tu.
- **Sotto `design/`** scrivi solo in `design/lavoro/L-logo/`.
  - Aggiorna `design/lavoro/L-logo/progresso.md` a ogni unità finita.
  - Le foto PNG non vanno nel repository (`.gitignore`); restano nella cartella.
- **Nessun commit e nessun push.** Nessun altro agente. Niente account, niente pubblicazioni.
- **I caratteri e le dipendenze**:
  - usa quelli già nel progetto (`design-system/caratteri/`);
  - se ti serve uno strumento nuovo, prendi l'ultima versione di oggi, verificata nelle fonti ufficiali, e scrivilo;
  - Playwright è quello del progetto, o della variabile `PLAYWRIGHT`.
- **La memoria è stretta.** Gira in parallelo un altro lavoro pesante (compilazioni e pacchetti), e la macchina ha circa
  7 GB liberi per programmi che non sono di Kalliope.
  - Un browser alla volta.
  - Prima di aprirne uno controlla `free -m`: se la memoria disponibile è sotto 1,5 GB, aspetta.
  - Niente cicli di attesa in background.
- **Lo schermo**: niente finestre su `DISPLAY :0` o `wayland-1`, lo schermo vero del proprietario. Solo browser senza
  finestra.
- **Porte**: 8765, 8766 e 8767 sono del proprietario, 8930–8939 dell'altro lavoro. Le tue sono 8940–8949.
- WCAG non è un obiettivo né una soglia (`CLAUDE.md`). Il contrasto si guarda reso, con le regole delle piattaforme scritte
  in `ricerca/logo.md`.

## Consegna

Nella risposta finale e in `progresso.md`:
- il criterio di ambizione e le tre idee, una frase ciascuna;
- per ogni direzione: dove stanno disegno, token, pagina, foto e video, e i suoi difetti;
- come le hai guardate accanto ai riferimenti, e che cosa hai corretto;
- ciò che non hai potuto rendere o verificare.
