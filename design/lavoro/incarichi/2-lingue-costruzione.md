# Incarico 2-b · Lingue: completare senza ridisegnare

- **Attività**: `path-build` + `language` + `catalog` (skill `design-system-generator`), ruolo **design-build**.
- **Area tua**: `design/lavoro/2-lingue-aspetto/costruzione/` (`progresso.md` aggiornato a ogni unità finita, gli esiti
  delle prove mentre li trovi).
- **Punto di partenza**: commit `82823d5`. L'aspetto delle lingue l'ha reso il ruolo di direzione (commit `8c7fae1`), un
  giudice l'ha guardato (`design/lavoro/2-lingue-aspetto/giudizio/GIUDIZIO.md`), la direzione l'ha corretto (`82823d5`).

## Leggi prima

1. `CLAUDE.md`, `design/lavoro/STATO.md` (anche le decisioni di chi coordina del 17/11).
2. `design/lavoro/2-lingue-aspetto/progresso.md` per intero, soprattutto «Al ruolo di costruzione», «Correzione dopo il
   giudizio», «Non verificato», «Per la ripresa» (come costruire il sito di prova con 9 o 30 lingue e gli script già pronti
   in `prove/`); `docs/translating.md`; `design-system/caratteri/LEGGIMI.md`.
3. La skill (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/direzione.md` §6 punto 2, `references/prove.md`, `references/presidi.md` («Testo, lingue e dispositivi»),
   `references/catalogo.md`, `references/esecuzione.md`.

## Che cosa fare

1. **Una lingua sola** (decisione di chi coordina): finché la lingua pubblicata è una sola, il selettore della barra e
   l'elenco delle lingue nel piede non si mostrano e `/` manda a `/it/` come i vecchi indirizzi (stesso meccanismo); con la
   seconda lingua completa tornano da soli. Lo fa `tools/site.py`, con le sue prove in `tools/test_translations.py`. Prova
   le due costruzioni: quella vera (solo `it`) e quella con i cataloghi di prova.
2. **Il precarico del carattere**: ogni pagina di una lingua con una scrittura non latina precarica il file del suo
   carattere usato nel primo schermo (scritto dalla costruzione per lingua); la pagina italiana non cambia di un byte.
   Misura prima e dopo (quando compare il testo nel carattere giusto, a rete lenta).
3. **Stati, tastiera e lettori** del selettore nella barra e della pagina della scelta: ordine del fuoco uguale a ciò che
   si vede, Esc che chiude e il fuoco che torna al comando, clic fuori, scelta ricordata e ripresa, ritorno e ricarica,
   senza JavaScript, movimento ridotto (da registrare), il nome accessibile e la lingua di ogni voce.
4. **Larghezze e motori per le lingue**: le soglie di `scripts/soglie.mjs` e le larghezze di mezzo (761–1180) per ar, ur,
   hi, bn, zh, el, de, fi, en-XA, ar-XB in Chromium; ar, ur, hi, bn, zh in Firefox e WebKit a 390×844, 1440×900, 844×390,
   360×640. `esame-impaginazione.mjs` con gli stati che cambiano l'impaginazione (menu aperto, selettore aperto, ascolto).
   Le pillole in ogni lingua a ogni larghezza (la direzione le ha misurate solo in alcuni punti).
5. **Il catalogo**: oggi legge soltanto il primo blocco `:root` di `token.css`, e i token dei blocchi aggiunti (pagine
   interne, scritture, lingue) non compaiono nella sua tabella: correggilo perché li mostri tutti, con il loro blocco.
   Controlla che la sezione delle lingue si apra senza errori in tre motori (il secondo sguardo su «non ancora» ne aveva
   visto uno).

Non cambi colori, caratteri, composizione, curve o durate; non togli e non attenui movimento; nessun valore fuori da
`token.css`. Un difetto d'aspetto che non è tuo da decidere lo scrivi, con la foto. Le prove girano tutte sugli stessi
file finali: registra le impronte.

## Lavoro in parallelo

Un altro ruolo di costruzione (incarico 3a-r) lavora adesso sulla pagina «non ancora»: non toccare `website/non-ancora/`,
`website/cornice.js`, `pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`, `catalogo-pagine.*`. Sarà lui a
mettere il selettore nuovo nella barra di «non ancora»: il tuo punto 1 deve funzionare anche lì (stesso markup della home).
Nei file condivisi (`token.css`, `TOKEN.md`, `SISTEMA.md`, `metodo.config.mjs`, il catalogo, `tools/site.py`, `it.po`)
rileggi subito prima di ogni modifica, aggiungi senza riordinare, non annullare le modifiche altrui.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-2b-*`, porte tue dalla **8840** alla 8849. Le porte 8765 e 8766, `/tmp/kalliope-site` e
  `/tmp/kalliope-lingue` sono del proprietario; 8850–8859 dell'incarico 3a-r.
- Nessuna finestra sullo schermo. Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente
  cancellazioni fuori dalle tue cartelle in `/tmp`. **Non fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file toccati, gli esiti delle prove con i numeri (larghezze, motori, stati,
lingue), le impronte dei file provati, i difetti d'aspetto trovati e non tuoi (con la foto), ciò che non hai verificato.
