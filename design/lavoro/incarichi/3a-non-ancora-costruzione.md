# Incarico 3a-b · La pagina «non ancora»: completare senza ridisegnare

- **Attività**: `path-build` + `language` + `catalog` (skill `design-system-generator`), ruolo **design-build**.
- **Area tua**: `design/lavoro/3a-non-ancora/costruzione/` (`progresso.md` aggiornato a ogni unità finita; lì anche
  gli esiti delle prove mentre li trovi).

## Leggi prima

1. `CLAUDE.md`, `design/lavoro/STATO.md`.
2. La pagina e il suo lavoro: `website/non-ancora/index.html`, `non-ancora.js`, `website/cornice.js`,
   `design-system/componenti/pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`;
   `design/lavoro/3a-non-ancora/PIANO.md` (soprattutto «La cornice» e «Da completare a chi costruisce»),
   `CONTENUTI.md`, `progresso.md`; il giudizio `design/lavoro/3a-non-ancora/giudizio/GIUDIZIO.md`. Commit di
   partenza: `0cf5c64`.
3. Le lingue: `docs/translating.md`, `design/lavoro/1-lingue-sito/progresso.md` (convenzione `data-t`, controlli).
4. La skill (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/direzione.md` §6 punto 2 (che cosa fa e che cosa non fa il ruolo di costruzione), `references/prove.md`,
   `references/presidi.md`, `references/catalogo.md`, `references/esecuzione.md`.

## Che cosa fare

1. **Traducibile**: segna ogni testo della pagina e di `non-ancora.js`/`cornice.js` con la convenzione del sito
   (`data-t`, attributi, testi dello script nella pagina), rigenera i cataloghi (`tools/translations.py extract`),
   e fa' passare `translations.py check`, `test_translations.py`, `css_logico.py`. La pagina deve costruirsi in ogni
   lingua che ha un `.po` completo, come la home.
2. **Catalogo (giudizio I4)**: i quattro componenti nuovi entrano nel catalogo vivo (`design-system/catalogo/`) con
   varianti e stati, come gli altri (`references/catalogo.md`).
3. **I minori del giudizio assegnati alla costruzione**: M1, M2, M5, M6, M7 (`GIUDIZIO.md`).
4. **Stati, errori e recupero**: il suono che non parte (messaggio vicino al comando, la bolla non deve sembrare
   detta), l'audio che aspetta dati, la scheda in secondo piano durante l'ascolto e durante il tentativo d'apertura,
   la copia dell'indirizzo che riesce e non riesce, senza JavaScript, la tastiera (ordine del fuoco uguale a ciò che
   si vede), il movimento ridotto, lo scorrimento veloce, il ritorno e la ricarica.
5. **Tutte le larghezze**: quelle a cui la pagina cambia (`scripts/soglie.mjs`, compresa la soglia d'altezza di 500 px)
   e quelle dei dispositivi (`scripts/dispositivi.mjs`), in Chromium; le principali (390×844, 1440×900, 844×390,
   360×640) anche in Firefox e WebKit. `esame-impaginazione.mjs` e `dispositivi-qa.mjs` con gli stati che cambiano
   l'impaginazione (menu aperto, ascolto in corso, errore dell'audio, copia fatta) elencati nella configurazione.
6. **Pseudo-lingue**: costruisci con `--pseudo` e fotografa la pagina in `en-XA` e `ar-XB` a 390×844 e 1440×900;
   scrivi che cosa si rompe, con la foto, **senza ridisegnare** (lo decide il ruolo di direzione).

Non cambi colori, caratteri, composizione, curve o durate; non togli e non attenui movimento; nessun valore fuori da
`token.css`. Un difetto d'aspetto che non è tuo da decidere lo scrivi, con la foto. Le prove girano tutte sugli
stessi file finali: registra le impronte.

## Lavoro in parallelo: attenzione

L'**incarico 2** (ruolo di direzione) lavora adesso sull'aspetto nelle altre lingue: tocca la home, `scena.js`, i
componenti condivisi (barra, piede, pulsanti, bolla, riunione, strada…), `token.css`, `TOKEN.md`, `SISTEMA.md`, il
catalogo, `website/lingue.html`, e potrebbe aggiungere caratteri in `design-system/caratteri/`. Nei file condivisi
(soprattutto il catalogo e `token.css`) rileggi subito prima di ogni modifica, aggiungi senza riordinare, non
annullare mai le modifiche altrui; se il catalogo ha un modo per scoprire le aree per convenzione, usalo. Se una sua
modifica rompe «non ancora», scrivilo nella consegna con la foto: non correggerla nei suoi file.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3ab-*`, porte tue dalla **8810** alla 8819. La porta 8765 e `/tmp/kalliope-site` sono
  del proprietario; 8800–8809 dell'incarico 2.
- Nessuna finestra sullo schermo (browser senza `DISPLAY` né `WAYLAND_DISPLAY`). Niente comandi che chiedono
  conferma, niente lavori in background da aspettare, niente cancellazioni fuori dalle tue cartelle in `/tmp`. **Non
  fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file toccati, gli esiti delle prove con i numeri (larghezze, motori,
stati), le impronte dei file provati, ciò che si rompe nelle pseudo-lingue con le foto, i difetti d'aspetto trovati e
non tuoi, ciò che non hai verificato.
