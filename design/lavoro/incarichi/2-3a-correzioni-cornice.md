# Incarico 2-f · La cornice, le lingue e «non ancora»: i difetti del secondo sguardo

- **Attività**: `path-build` (skill `design-system-generator`), ruolo **design-build**.
- **Area tua**: `design/lavoro/2-3a-correzioni/` (`progresso.md` aggiornato a ogni unità finita, gli esiti delle prove
  mentre li trovi).
- **Punto di partenza**: commit `b456308`. Il secondo sguardo del giudice
  (`design/lavoro/2-lingue-aspetto/secondo-sguardo/GIUDIZIO.md`, con le sue foto e le sue prove in `prove/`) dice pronte
  le lingue e «non ancora», con un difetto importante che c'era già nella pagina approvata e alcuni minori.

## Leggi prima

`CLAUDE.md`, `design/lavoro/STATO.md`; il secondo sguardo per intero; `design/lavoro/3a-non-ancora/PIANO.md` («La
cornice»), `3a-non-ancora/rifinitura/progresso.md` e `2-lingue-aspetto/costruzione/progresso.md` (le prove già scritte:
riusale); la skill (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
`references/prove.md`, `references/presidi.md`, `references/esecuzione.md`.

## Che cosa fare

1. **Importante: il menu al telefono fa saltare la pagina.** In Chromium al telefono aprire e chiudere il menu fa salire
   la pagina fino a 461 px, nella home e in «non ancora» (Firefox non si muove). Trova la causa e correggila lì, per tutte
   le pagine che usano la barra (home, «non ancora», «stato», la pagina della scelta); la prova deve fallire sulla copia di
   prima e passare nei tre motori.
2. **Il pannello del menu in Firefox** lascia leggere la pagina dietro: verifica se succede anche con la scheda grafica
   (o spiega perché qui no) e, se è un difetto vero, correggilo senza cambiare l'aspetto negli altri motori.
3. **L1**: in urdu a 326×326, mentre la voce suona, «Pausa» finisce 23 px sotto il bordo (en-XA 14 px). Bolla e comando
   devono stare insieme come in italiano, con la regola di `PIANO.md` («La cornice»).
4. **L2**: in urdu a 844×390 l'etichetta nel riquadro di «Tu» tocca le barre della voce.
5. **L3**: nella pagina della scelta il nome «Kalliope» a riposo resta di un rosa spento, e la barra ha una fascia scura
   quando la pagina sta nello schermo e diventa trasparente quando scorre: deve comportarsi come la barra delle altre pagine.
6. **P1**: in «non ancora», dopo «Copia», il pannello delle versioni sale di circa 14 px: non deve muoversi.
7. **L'altezza della riunione bassa** (e degli altri token della riunione legati all'altezza dello schermo) si calcola
   sull'altezza della finestra: su un telefono vero con la barra del browser visibile viene più alta del necessario. Usa
   l'unità che tiene conto della barra del browser, dove serve, con il suo ripiego; dichiara che cosa hai potuto vedere e che
   cosa no.
8. **Pulizia**: le due regole della barra che stanno in `lingue.css` riguardano il menu: spostale in `barra.css`, senza
   cambiare l'aspetto.

Poi rifai le prove che le modifiche toccano: l'italiano a riposo identico a `b456308` dove non hai cambiato nulla di voluto
(home, «non ancora», «stato», scelta; dichiara ogni differenza voluta), il menu aperto e chiuso al telefono in tre motori,
le altezze basse mentre la voce suona in italiano, arabo, urdu ed en-XA; `controlla-sorgenti.mjs`, `css_logico.py`,
`translations.py extract --check` e `check`, `test_translations.py` verdi.

Non cambi colori, caratteri, curve, durate né composizione; nessun valore fuori da `token.css`. Un difetto d'aspetto che
non è tuo da decidere lo scrivi, con la foto.

## Lavoro in parallelo

Un giudice (incarico 3b-g) guarda la pagina «stato» al commit `b456308`: legge soltanto. Non toccare `website/stato/` né i
componenti di «stato» (`riunione-provata.css`, `catena.css`, `domande.css`, `varco.css`, `inoltra.css`): se la correzione
della cornice li riguarda, la cornice li corregge da sola; se no, scrivilo. Nei file condivisi (`token.css`, `TOKEN.md`,
`SISTEMA.md`, `metodo.config.mjs`, `pagina.css`, `cornice.js`, il catalogo) aggiungi senza riordinare.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Il sito a più lingue: `design/lavoro/2-lingue-aspetto/prova-lingue/*.po` copiati in `website/lingue/` di una copia
  dell'albero (le traduzioni di prova sono complete dal commit `22c56ab`).
- Cartelle tue sotto `/tmp/lavoro-2f-*`, porte tue dalla **8890** alla 8899. Le porte 8765 e 8766, `/tmp/kalliope-site` e
  `/tmp/kalliope-lingue` sono del proprietario; 8880–8889 del giudice 3b-g.
- Nessuna finestra sullo schermo. Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente
  cancellazioni fuori dalle tue cartelle in `/tmp`. **Non fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file toccati, per ogni punto che cosa hai cambiato con le foto prima e dopo,
gli esiti delle prove con i numeri, le impronte dei file provati, i difetti trovati e non tuoi, ciò che non hai verificato.
