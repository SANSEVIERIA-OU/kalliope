# Incarico 1 · Lingue nel sito: struttura e specchio, senza cambiare l'aspetto

- **Attività**: `language` + `integration` (skill `design-system-generator`, `routing.json`), ruolo **design-build**.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file: le domande vanno a chi coordina,
  nella risposta finale.
- **Area tua**: `design/lavoro/1-lingue-sito/` (tieni lì `progresso.md`, aggiornato a ogni unità finita: fatto, in
  corso, prossimo passo, ultimo comando, problemi aperti; e i risultati delle prove mentre li trovi).

## Leggi prima

1. `CLAUDE.md` (tutto; in particolare «Pronti per le traduzioni», «Come si costruisce e si pubblica il sito», «Come si
   lavora»).
2. `design/lavoro/STATO.md` (decisioni del 16/11/2026) e `design/lavoro/ricerca/lingue.md` (i fatti e le fonti su cui
   si basano le scelte qui sotto: non rifare la ricerca, usala).
3. `design-system/SISTEMA.md`, `design-system/TOKEN.md`, `docs/releasing.md` («Website»), `tools/site.py`.
4. La skill: `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/` —
   `SKILL.md`, `references/presidi.md` («Testo, lingue e dispositivi»), `references/prove.md`,
   `references/lavoro-incrementale.md`.

## Lo scopo

Il proprietario vuole sito e applicazione **predisposti** per essere tradotti nelle 30 lingue di `ricerca/lingue.md`.
I testi di oggi verranno riscritti: non correggerli, non migliorarli, non chiedere contenuti. Il criterio di riuscita
di questo incarico: **aggiungere una lingua al sito vuol dire aggiungere un file `.po`, e basta** (nessuna pagina,
nessuno script, nessun foglio di stile da toccare), e una pagina da destra a sinistra si dispone correttamente come
struttura. **L'aspetto in italiano non cambia di un pixel.** L'aspetto da destra a sinistra e nelle altre scritture
lo decide l'incarico 2 (ruolo di direzione): qui si prepara la struttura su cui lavorerà.

Solo la home (`website/index.html`, `website/scena.js`) è nella direzione 2. Le pagine vecchie (`installa/`, `stato/`,
`ascolta/`, `riunione/`, `aiuto/`, `non-ancora/`, `404.html`, con `website/stile/`, `script/`, `sistema/`) verranno
rifatte nella fase 3: **non estrarre i loro testi e non convertirne il CSS**; devono solo continuare a funzionare dove
la home le collega, nella nuova disposizione degli indirizzi.

## Che cosa fare

1. **Il formato**: gettext `.po`, lo stesso che userà l'applicazione (Slint traduce solo da `.po`). Lingua di partenza
   l'italiano. Le pagine in `website/` restano leggibili in italiano: il testo da tradurre si segna nell'HTML (proponi
   tu la convenzione, per esempio un attributo con una chiave stabile) e uno strumento in `tools/` lo estrae in un
   modello `.pot` e nel catalogo italiano; le traduzioni stanno in un file per lingua. Chiavi stabili (`msgctxt`), così
   cambiare il testo italiano non cancella le traduzioni senza dirlo. Si traduce **tutto ciò che si vede o si sente
   leggere**: testo, attributi (`alt`, `aria-label`, `title`, `placeholder`), `<title>`, `meta description` e simili,
   i testi che usa `scena.js` (oggi scritti dentro lo script: escono e arrivano allo script dalla pagina), i testi del
   catalogo **no** (resta in italiano, è uno strumento interno). Testi con markup dentro (collegamenti, grassetti):
   il traduttore deve poter spostare le parole senza poter rompere il markup; il controllo lo verifica.
2. **Plurali e formati**: plurali con `Plural-Forms` del `.po` (forme CLDR di `ricerca/lingue.md`); date, grandezze dei
   file (oggi «14,1 MB», «12 novembre 2026» scritti all'italiana da `tools/site.py`) e numeri nella lingua della
   pagina, da dati CLDR e non da tabelle scritte a mano. Vincolo di `tools/site.py`: solo libreria standard di Python;
   se servono dati CLDR, proponi come portarli (un file di dati generato e versionato, con la sua fonte) e dillo nella
   consegna. Nel browser, `Intl` per ciò che calcola lo script.
3. **Gli indirizzi**: una cartella per lingua (`/it/`, `/en/`, …), le pagine con lo stesso nome in ogni lingua.
   L'indirizzo principale `/` diventa la pagina di scelta della lingua (`x-default`): ogni lingua scritta nel suo nome
   con il suo `lang`, niente bandiere, la lingua del browser messa per prima, nessuno spostamento automatico;
   la scelta fatta si ricorda e alla visita dopo porta lì. Qui basta che funzioni e usi token e componenti esistenti:
   il suo aspetto lo decide l'incarico 2. I vecchi indirizzi (`/installa/`, `/ascolta/`, … e i file `voce/`) devono
   continuare a portare nel posto giusto (pagine di rimando statiche: GitHub Pages non ha un server).
4. **Ogni pagina costruita**: `<html lang dir>`; `hreflang` verso tutte le lingue costruite più `x-default`; il
   selettore della lingua nella barra della home che porta alla stessa pagina nell'altra lingua (funzionante, fatto con
   ciò che il design system ha già; l'aspetto definitivo è dell'incarico 2). `{{kalliope.*}}` continua a funzionare.
   La pubblicazione (`.github/workflows/pages.yml`) costruisce solo le lingue che hanno un file completo; una lingua
   con traduzioni mancanti non si pubblica, e la costruzione lo dice (decidi tu la regola esatta e scrivila).
5. **Le pseudo-lingue per le prove**, generate dal catalogo italiano, mai pubblicate e mai nei `hreflang` del sito
   pubblicato: `en-XA` (testo allungato del 40%, lettere accentate, delimitatori) e `ar-XB` (da destra a sinistra,
   `dir="rtl"`). Si costruiscono con un'opzione di `tools/site.py`.
6. **Lo specchio nel design system, a parità d'aspetto**: in `design-system/base.css`, `componenti/*.css`,
   `catalogo/*.css` e negli stili dentro `website/index.html` le proprietà fisiche sinistra/destra (oggi circa 95:
   `margin-left`, `left:`, `padding-right`, `text-align: left`, angoli `border-*-left-radius`…) diventano logiche
   (`margin-inline-start`, `inset-inline-start`, `border-start-start-radius`, `text-align: start`…), e i 6 token con
   `sinistra`/`destra` nel nome diventano `inizio`/`fine` (aggiorna `TOKEN.md`). Gli spostamenti orizzontali
   (`translateX`, posizioni calcolate da `scena.js`, gradienti orizzontali, animazioni che vanno da un lato) **non si
   decidono qui**: prepara un meccanismo unico per sapere la direzione (un token o una variabile che vale 1 o −1 secondo
   `:dir(rtl)`, letta anche da `scena.js`) e fai l'elenco di ogni punto che ha un verso, con file e riga, per l'incarico
   2. Nessun valore scritto a mano fuori da `token.css`.
7. **Documenta**: `docs/translating.md` (in inglese, come gli altri documenti di `docs/`): come si aggiunge una lingua,
   come si aggiorna il modello quando cambia un testo, come si costruiscono le pseudo-lingue, il controllo. Aggiorna
   `docs/releasing.md` («Website») e la docstring di `tools/site.py`.

## Le prove (guardano ciò che vede la persona)

- **Italiano identico**: il sito costruito prima e dopo, confrontato foto per foto, con «riduci movimento», a riposo e a
  ogni schermata dello scorrimento, a 1440×900, 390×844, 820×1180, 1366×640, più gli stati aperti a 390×844 (menu,
  ascolto, errore dell'audio): 0 pixel diversi atteso, come in `SISTEMA.md` («Che cosa è provato»). Le differenze si
  spiegano una per una. La home vecchia è a `/`, quella nuova a `/it/`: confronta le due.
- **`controlla-sorgenti.mjs`** verde dal design system (aggiorna `design-system/metodo.config.mjs` alla nuova
  disposizione degli indirizzi).
- **Controllo delle traduzioni** in `tools/` (eseguibile dalla CI): ogni chiave c'è, i segnaposto e il markup sono
  intatti, i plurali hanno le forme della lingua; deve riconoscere una copia guastata apposta (una chiave tolta, un
  tag rotto, un segnaposto cambiato).
- **Pseudo-lingue**: costruisci `en-XA` e `ar-XB`, fotografa la home a 390×844 e 1440×900 (riposo e scorrimento) e
  scrivi che cosa si rompe (testo tagliato o sovrapposto, testi rimasti in italiano = segnati male). **Non correggere
  l'aspetto**: annota, con la foto, per l'incarico 2. Correggi solo i testi non segnati.
- Tre motori: Chromium sempre; Firefox e WebKit per il confronto dell'italiano almeno a 390×844 e 1440×900.
- Il sito funziona senza JavaScript come prima (la scelta della lingua e il selettore inclusi, con collegamenti).

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Costruisci in cartelle tue sotto `/tmp/lavoro-1-*` e servile su porte tue dalla **8770** in su. La porta 8765 è del
  proprietario: non toccarla, e non toccare `/tmp/kalliope-site`.
- Nessuna finestra sullo schermo: i browser senza `DISPLAY` né `WAYLAND_DISPLAY` (sono lo schermo vero del
  proprietario). Niente `mostra.mjs`, niente `cancello.mjs --apri`.
- Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente cancellazioni fuori dalle tue
  cartelle in `/tmp`. **Non fare commit e non fare push**: li fa chi coordina dopo aver verificato.
- Non creare altri agenti.

## Consegna

Nella risposta finale, e in `progresso.md`: che cosa hai fatto (file toccati), le scelte che hai preso con il perché
(convenzione di segnatura, chiavi, dati CLDR, regola di pubblicazione), gli esiti delle prove con i numeri, l'elenco
dei punti con un verso per l'incarico 2, che cosa si rompe nelle pseudo-lingue (con i percorsi delle foto), ciò che
non hai verificato. Se una scelta qui sopra si rivela sbagliata o impossibile, fermati su quel punto, scrivilo e
continua con il resto.
