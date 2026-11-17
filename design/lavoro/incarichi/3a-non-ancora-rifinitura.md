# Incarico 3a-r · «non ancora»: i difetti del secondo sguardo e il selettore della lingua

- **Attività**: `path-build` (skill `design-system-generator`), ruolo **design-build**.
- **Area tua**: `design/lavoro/3a-non-ancora/rifinitura/` (`progresso.md` aggiornato a ogni unità finita, gli esiti delle
  prove mentre li trovi).
- **Punto di partenza**: commit `82823d5`. La pagina è stata resa dalla direzione, completata dalla costruzione (commit
  `b9ba336`, note in `design/lavoro/3a-non-ancora/costruzione/progresso.md`) e guardata due volte dal giudice; il secondo
  sguardo (`design/lavoro/3a-non-ancora/secondo-sguardo/GIUDIZIO.md`) dice che è pronta, con cinque difetti minori. La
  pagina è stata mostrata al proprietario.

## Leggi prima

`CLAUDE.md`, `design/lavoro/STATO.md`; il secondo sguardo per intero, con le sue foto; `PIANO.md` («La cornice»),
`costruzione/progresso.md` e le prove già scritte in `costruzione/prove/` (riusale); la skill
(`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`): `references/direzione.md`
§6 punto 2, `references/prove.md`, `references/esecuzione.md`.

## Che cosa fare

1. **N5**: dopo «Copia» il posto tratteggiato deve accendersi nella pagina viva come nel catalogo (oggi una regola più
   specifica lo copre). Correggi la causa; la prova deve fallire sulla copia di prima.
2. **N1, gli schermi bassi mentre la voce suona** (decisione di chi coordina, sulla proposta del giudice): a quelle altezze
   (500 e 501 d'altezza, 844×390, 915×412, 326×326, 320×568) la riunione si fa più bassa, perché la bolla dove le parole
   si accendono e il comando «Pausa» stiano insieme nello schermo; con il messaggio d'errore, lo stesso per bolla e
   messaggio dove l'altezza lo consente. Le misure nuove sono token con il loro ruolo; la composizione non cambia altrove.
   Togli da `metodo.config.mjs` i limiti che non servono più, e scrivi in `PIANO.md` («La cornice») la regola completa:
   nel primo schermo vince il comando; quando un gesto apre qualcosa, vince ciò che il gesto ha aperto, e a quelle altezze
   la riunione si abbassa perché il comando resti.
3. **N2**: al telefono l'etichetta del pulsante dell'ascolto è sbilanciata fuori dal riposo («Pausa», «Riprendi»): deve
   restare centrata come a riposo, senza perdere la larghezza ferma (M2).
4. **N3**: mentre l'elenco delle versioni si apre, per meno di mezzo secondo il tratteggio attraversa la riga della
   versione: nessun fotogramma con il tratteggio sopra il testo, senza cambiare il movimento.
5. **N4**: la pagina dice che l'elenco si aggiorna da solo, ma la nota accanto alla versione («Versione di prova · solo
   Linux») è scritta a mano: deve venire dai dati della versione come numero e data (i segnaposto della costruzione,
   `tools/site.py`); se la home ha la stessa nota scritta a mano, vale anche lì.
6. **M3**: al telefono la didascalia della scena si riduce a una parola («Ricostruzione»): la frase che dice che cos'è la
   scena deve esserci anche al telefono, nello stesso posto.
7. **Il selettore della lingua nella barra**: la barra di «non ancora» ha ancora la voce di prima («Italiano» che porta al
   piede); prende la scelta nuova come la home (`<details class="lingua-scelta">`, il link a `lingue.css`, lo stesso
   markup, così che la costruzione la tolga quando la lingua è una sola). Controlla con il sito di prova a più lingue
   (`design/lavoro/2-lingue-aspetto/prove/costruisci.sh`) che porti alla stessa pagina nell'altra lingua.
8. **Il piede in Firefox**: a 390×844 con Tab «In riunione» e «Aiuto» restano 14 px sotto il bordo (lo aveva trovato la
   costruzione): il fuoco deve portare in vista ciò che tocca, in tre motori.

Poi rifai le prove che le modifiche toccano: l'italiano a riposo identico a `82823d5` dove non hai cambiato nulla di
voluto (dichiara ogni differenza voluta), gli stati, le altezze e i dispositivi di `costruzione/progresso.md` che i punti
1–8 riguardano, in Chromium, e le misure principali in Firefox e WebKit; `controlla-sorgenti.mjs`, `css_logico.py`,
`translations.py check`, `test_translations.py` verdi.

Non cambi colori, caratteri, curve o durate, e la composizione solo dove il punto 2 lo dice; nessun valore fuori da
`token.css`. Un difetto d'aspetto che non è tuo da decidere lo scrivi, con la foto.

## Lavoro in parallelo

Un altro ruolo di costruzione (incarico 2-b) lavora adesso sulle lingue: `tools/site.py` (una lingua sola, precarico),
`website/lingue.html`, `lingua.js`, `lingue.css`, il catalogo. Non toccare `lingue.html`, `lingua.js`, `lingue.css`,
`catalogo-lingue.*`. In `tools/site.py` (per N4), `token.css`, `TOKEN.md`, `SISTEMA.md`, `metodo.config.mjs`, `it.po`
rileggi subito prima di ogni modifica, aggiungi senza riordinare, non annullare le modifiche altrui.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3ar-*`, porte tue dalla **8850** alla 8859. Le porte 8765 e 8766, `/tmp/kalliope-site` e
  `/tmp/kalliope-lingue` sono del proprietario; 8840–8849 dell'incarico 2-b.
- Nessuna finestra sullo schermo. Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente
  cancellazioni fuori dalle tue cartelle in `/tmp`. **Non fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file toccati, per ogni punto che cosa hai cambiato con le foto prima e dopo,
gli esiti delle prove con i numeri, le impronte dei file provati, i difetti trovati e non tuoi, ciò che non hai verificato.
