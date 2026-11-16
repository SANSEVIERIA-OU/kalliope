# Incarico 2 · Lingue nel design system: da destra a sinistra, una tipografia per scrittura, la scelta della lingua

- **Attività**: `path-look` e `tokens` per le lingue (skill `design-system-generator`), ruolo **design-direction**.
- **Chi coordina**: la sessione principale; il proprietario non legge questo file.
- **Area tua**: `design/lavoro/2-lingue-aspetto/` (`progresso.md` aggiornato a ogni unità finita; lì anche piano,
  foto, sequenze, cataloghi di prova).

## Leggi prima

1. `CLAUDE.md` (tutto: «Pronti per le traduzioni», «Come si costruisce e si pubblica il sito»), `design/lavoro/STATO.md`.
2. `design/lavoro/ricerca/lingue.md` (i fatti con le fonti: non rifare la ricerca).
3. L'incarico 1, già fatto e salvato (commit `341a841`): `design/lavoro/incarichi/1-lingue-sito.md`,
   `design/lavoro/1-lingue-sito/progresso.md` e soprattutto **`design/lavoro/1-lingue-sito/versi.md`** (ogni punto con
   un verso, con file e riga, e ciò che si rompe nelle pseudo-lingue, con le foto in `foto/pseudo-en-XA/` e
   `foto/pseudo-ar-XB/`), `docs/translating.md`.
4. La direzione scelta: `design/direzione-2/D2.md`, `PIANO.md`; il sistema: `design-system/SISTEMA.md`, `TOKEN.md`,
   `token.css`, `componenti/`, il catalogo; la home viva `website/index.html`, `website/scena.js`.
5. La skill (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `SKILL.md`, `references/direzione.md` §6, `references/giudizio.md` parte D, `references/presidi.md` («Testo, lingue e
   dispositivi»), `references/esecuzione.md` (regole dei worker); `scripts/alfabeti-qa.mjs`.

## Lo scopo

Il sito deve essere pronto per le 30 lingue di `ricerca/lingue.md`. L'incarico 1 ha fatto la struttura senza cambiare
l'aspetto in italiano. Tu decidi e rendi **l'aspetto nelle altre lingue**, sopra il design system, perché la home
resti la stessa idea («una riunione in un mondo di un solo colore») in ogni scrittura:

1. **Da destra a sinistra (arabo, urdu).** Per ogni punto di `versi.md` decidi se si specchia, guardando: la coda della
   bolla, l'ordine dei riquadri e dove sta «Tu», gli sguardi di Paola, Luca e Anna, le onde che partono da «Tu», le
   luci, la strada della voce, le barre di avanzamento, le frecce, l'azione che entra nella barra. Regole di
   partenza in `ricerca/lingue.md` (si specchia ciò che ha un verso di lettura o di tempo; non si specchiano loghi,
   numeri, segni di spunta, comandi di riproduzione). Usa `--verso`; nessun valore a mano.
2. **Una tipografia per scrittura.** Lexend copre solo il latino. Scegli e porta i caratteri per greco e cirillico
   (bg), arabo, urdu (nastaliq, di solito), devanagari (hi), bengali (bn); per il cinese decidi fra carattere di
   sistema e un carattere scaricato, sapendo il peso (`ricerca/lingue.md`, «I caratteri»). Le famiglie Noto sono OFL:
   scaricale dalle fonti ufficiali (`github.com/google/fonts`, `ofl/<famiglia>/`), riducile ai caratteri della
   scrittura in `woff2` (`pyftsubset` e `brotli` sono installati), mettile in `design-system/caratteri/<famiglia>/`
   con la loro licenza accanto, e falle scaricare **solo dalle pagine della lingua che le usa** (una pagina italiana
   non deve scaricare un byte in più). Grandezze, interlinee e spaziature per scrittura diventano token con il loro
   ruolo, legati alla lingua (`:lang()`); in arabo e urdu niente spaziatura fra le lettere (il titolo oggi ha −0,015
   em); il corsivo dove la scrittura non l'ha. Il risultato deve sembrare la stessa pagina, non una pagina di ripiego.
3. **Il testo più lungo.** In `en-XA` (+40%) si rompono alcune cose (`versi.md`, in fondo: il marchio sotto «Ascolta» a
   1440 con l'azione in barra, «Tu · microfono "Kalliope"» che esce dalla tessera e copre Paola, nomi lunghi tagliati,
   le unità che non vanno a capo nella bolla). Correggile perché reggano anche il tedesco e il finlandese.
4. **La scelta della lingua.** Oggi l'indirizzo principale (`website/lingue.html`) è un elenco provvisorio e il
   selettore nella barra è una voce «Italiano» che porta all'elenco nel piede. Rendili nella direzione 2: la pagina per
   scegliere fra 30 lingue (ogni lingua scritta nel suo nome, con il suo `lang` e la sua direzione, niente bandiere, la
   lingua del browser per prima; la scelta si ricorda; funziona senza JavaScript) e il selettore nelle pagine, che
   porta alla stessa pagina nell'altra lingua. Componenti nuovi nel design system; nel catalogo.

## Le prove con lettere vere

Le pseudo-lingue non bastano: servono le scritture vere. Scrivi tu dei **cataloghi di prova** traducendo
`website/lingue/it.po` in **ar, ur, hi, bn, zh, el, bg, de, fi** (una traduzione onesta, ma solo per le prove: lo dice
l'intestazione di ogni file). Mettili in `design/lavoro/2-lingue-aspetto/prova-lingue/`, **mai** in `website/lingue/`
(un `.po` completo lì verrebbe pubblicato). Per costruire un sito di prova con quelle lingue copia la radice in
`/tmp/lavoro-2-radice/` (`website/`, `design-system/`, `tools/`), aggiungi i cataloghi alla copia di `website/lingue/` e
lancia `python3 -I /tmp/lavoro-2-radice/tools/site.py --out /tmp/lavoro-2-sito`.

Per ogni lingua di prova: foto della home a 390×844 e 1440×900, a riposo, dopo lo scorrimento, con l'ascolto aperto
e con il menu aperto al telefono; `alfabeti-qa.mjs` (ogni lettera disegnata dal carattere voluto, non da uno del
sistema per caso); registra arrivo e scorrimento in arabo e in hindi alle due misure (`scripts/sequenza.mjs`).
L'italiano deve restare identico a prima: confrontalo foto per foto con il commit `341a841` (come in
`1-lingue-sito/progresso.md`, «Italiano identico»); ogni differenza voluta si dichiara.

`controlla-sorgenti.mjs` (da `design-system/`) e `python3 -I tools/css_logico.py`, `tools/translations.py check`,
`tools/test_translations.py` verdi.

## Lavoro in parallelo: attenzione

Mentre lavori, un altro worker (ruolo di direzione, incarico 3a) potrebbe correggere la pagina **«non ancora»**
(`website/non-ancora/`, `website/cornice.js`, `design-system/componenti/pagina.css`, `riunione-ferma.css`,
`strada-ferma.css`, `versioni.css`). Non toccare quei file; se un tuo cambiamento a un componente condiviso (barra,
piede, pulsanti, bolla, riunione…) la riguarda, controlla che `/it/non-ancora/` resti giusta e scrivilo. In
`token.css`, `TOKEN.md`, `SISTEMA.md` e nel catalogo rileggi il file subito prima di ogni modifica, aggiungi senza
riordinare, non annullare mai le modifiche altrui.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-2-*`, porte tue dalla **8800** alla 8809. La porta 8765 e `/tmp/kalliope-site` sono
  del proprietario; 8780–8799 di altri worker.
- Nessuna finestra sullo schermo (browser senza `DISPLAY` né `WAYLAND_DISPLAY`). Niente comandi che chiedono
  conferma, niente lavori in background da aspettare, niente cancellazioni fuori dalle tue cartelle in `/tmp`. **Non
  fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: le decisioni per ogni punto di `versi.md` (si specchia / no, perché), i
caratteri scelti con fonte, licenza e peso in byte per lingua, i token e i componenti nuovi, la pagina della scelta
della lingua e il selettore, i percorsi delle foto e delle sequenze per lingua, gli esiti delle prove con i numeri, le
scelte senza fonte (dichiarate come progettuali), ciò che non hai verificato e ciò che resta al ruolo di costruzione.
