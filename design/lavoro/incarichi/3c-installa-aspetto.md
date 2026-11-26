# Incarico 3c · La pagina «installa» nella direzione 2: aspetto e movimento

- **Attività**: `path-look` (skill `design-system-generator`, `routing.json`), ruolo **design-direction**.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file. Le domande vanno a chi coordina, nella
  risposta finale.
- **Area tua**: `design/lavoro/3c-installa/`. Tieni lì `progresso.md`, aggiornato a ogni unità finita: fatto, in corso,
  prossimo passo, ultimo comando, problemi aperti. Lì vanno anche il piano, l'elenco dei contenuti, le foto e le sequenze.
- **Punto di partenza**: commit `1c6ba5a`. Il sito nuovo è in linea dal 20/11, con il logo nuovo su tutte le pagine.

## Leggi prima

1. `CLAUDE.md` (tutto) e `design/lavoro/STATO.md`: le decisioni dal 16 al 20/11/2026.
2. La direzione scelta dal proprietario, che è il termine di confronto:
   - `design/direzione-2/LEGGIMI.md`;
   - `D2.md`; la sua nota sul verde del logo è superata;
   - `PIANO.md`.
3. **Le pagine interne già rifatte, che fissano la cornice e il modo**:
   - «non ancora»: `website/non-ancora/`, `website/cornice.js`, `design-system/componenti/pagina.css`;
   - «stato»: `website/stato/`.

   Leggi anche i loro percorsi in `design/lavoro/3a-non-ancora/` e `design/lavoro/3b-stato/`: piano, contenuti, giudizi,
   secondi sguardi, rifiniture. Ciò che i giudici hanno chiesto lì vale anche qui: non rifare gli stessi errori.
4. **Il sistema su cui si costruisce**:
   - `design-system/SISTEMA.md`, `TOKEN.md`, `token.css`, `componenti/`;
   - il catalogo, `design-system/catalogo/`;
   - il logo, `design-system/marchio/`: la costruzione lo mette dove la pagina scrive `<svg data-marchio="barra">`.
5. **Le lingue**: `docs/translating.md` (i testi si segnano con `data-t`), `design-system/caratteri/LEGGIMI.md`.
6. **La skill**, versione 0.49.0, in `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`:
   - `SKILL.md`;
   - `references/direzione.md`, §6: il percorso nella direzione scelta;
   - `references/giudizio.md`, parte D e «La pagina intera»: è ciò su cui ti giudicheranno;
   - `references/movimento.md`, `references/scrittura.md`;
   - `references/esecuzione.md`: le regole dei worker.

## Lo scopo

Si rifanno le pagine del sito nella direzione 2, sopra il design system, una alla volta. Sono già fatte «non ancora» e
«stato», approvata dal proprietario il 19/11. Questa è la terza: **«installa»** (`website/installa/index.html`, oggi con
l'aspetto di prima). La pagina porta chi ha Linux, o chi installa per un altro, fino a Kalliope che dice «Pronta» e al
microfono «Kalliope» che compare nell'app della riunione, senza rompere nulla.

Il tuo lavoro è decidere e rendere **l'aspetto e il movimento della pagina intera** (`direzione.md` §6, punto 1). Dopo di te:
- il ruolo di costruzione completa senza ridisegnare: stati, errori, tutte le larghezze, tre motori, pseudo-lingue,
  catalogo;
- poi un giudice che non sei tu;
- poi il proprietario.

## Che cosa dice la pagina

- **Fonti**:
  - `design/progetto.md`: **P4**, «Installare su Linux», per intero, con azioni, regole, errori e recupero; le persone
    **F4**, **F2** e chi installa per un altro; F1 per il linguaggio; la tabella di §6 «Come si installa» e «Cosa serve
    oggi»;
  - la pagina di oggi, `website/installa/index.html`, e `README.md`.

  La pagina nuova porta i fatti della vecchia, riordinati per chi arriva.
- **I testi si rifanno da capo** (decisione del proprietario): non rifinirli e non chiedere contenuti.
- **Non inventare**: nessuna funzione che il programma non ha, nessuna data promessa, nessuna distribuzione non provata
  presentata come provata.
- **I comandi** si copiano come sono, e ogni comando ha il suo modo di copiarlo.
- **Versioni, nomi dei file, dimensioni, impronte e collegamenti** vengono dai segnaposto di `tools/site.py`
  (`{{kalliope.deb.name}}`, `{{kalliope.sha256.deb}}`, … e `data-release`): mai scritti a mano.
- **La versione offerta oggi è v0.1-rc.1** (di prova). Al primo avvio scarica la voce (53 MB), e per questo i pacchetti
  chiedono `curl`. Dalla prossima versione la voce sarà dentro il pacchetto e non si scaricherà niente: è già così nel
  programma, ma non ancora in una versione pubblicata.
  - La pagina dice com'è la versione offerta, cioè v0.1-rc.1.
  - Tieni le frasi che cambieranno (lo scaricamento della voce, i 53 MB, `curl`) raccolte in pochi punti segnati, così il
    cambio sarà piccolo.
  - In `CONTENUTI.md` segnale come «cambia con la prossima versione».
- **Il telefono**: il sito non dice «non ancora» per il telefono (decisione del 17/11). Chi non ha Linux va a «non ancora».
- **Prima di rendere**, scrivi `design/lavoro/3c-installa/CONTENUTI.md` (`direzione.md` §6, punto 0): una riga per voce, con
  dove sta nella pagina, oppure «lasciata fuori» e il motivo.

## I vincoli

- **Lo stesso mondo della home, di «non ancora» e di «stato»**:
  - un solo colore, la riunione, la bolla, i riquadri, le onde;
  - la stessa curva d'entrata e lo stesso linguaggio di movimento;
  - in ogni tratto qualcosa che accade perché serve a capire, a provare o a decidere;
  - fra un tratto e l'altro un cambio di scena, non una fascia vuota;
  - nessuna scheda uguale alle altre messa in fila (`giudizio.md`, parte D).

  Il rischio più grande qui è una pagina di istruzioni impilate, o quattro schede uguali per `.deb`, `.rpm`, tarball e
  Arch. Trova il modo in cui l'installazione si vede accadere: il prodotto al lavoro, fino a «Pronta» e al microfono nella
  riunione. Fallo senza decorare e senza una ricostruzione che dica più di quanto il programma fa.

  Prima guarda che cosa fanno i riferimenti sotto il primo schermo e nelle pagine interne:
  `/workspace/prova-design-abc/prova-2/riferimenti/` (`primi-schermi/`, `sequenze/`, `schede/`, `classifica.md`) e
  `design/ricerca/schede/R*.md`.
- **La cornice è quella di «non ancora» e di «stato»**: barra con il logo e il selettore della lingua, apertura, passaggi,
  piede, comportamento sugli schermi bassi. Riusala senza cambiare l'aspetto delle altre pagine. Se qualcosa deve cambiare,
  aggiungi e scrivi il motivo.
- **Sopra il design system**:
  - la pagina collega `design-system/token.css`, `base.css` e solo i componenti che usa;
  - ogni valore viene da `token.css`, e un valore nuovo entra lì con il suo ruolo;
  - un pezzo nuovo che altre pagine riuseranno, per esempio un comando da copiare o un elenco di passi, diventa un
    componente in `design-system/componenti/`;
  - `controlla-sorgenti.mjs` verde.
- **Pronta per le lingue**:
  - solo proprietà logiche (`tools/css_logico.py` verde);
  - ciò che ha un verso usa `--verso`;
  - i testi segnati con `data-t`;
  - i comandi e i nomi dei file non si traducono e, da destra a sinistra, restano leggibili da sinistra a destra;
  - il testo deve poter crescere del 40% senza rompere la composizione.
- **Movimento ridotto e pagina senza JavaScript**: un ripiego che mostra tutto, non un'esclusione. Senza JavaScript i
  comandi si possono comunque selezionare e copiare.

## Lavoro in parallelo

Nessun altro ruolo lavora sul sito. Non toccare:
- `website/non-ancora/` e `website/stato/`;
- `lingue.html`, `lingua.js`, `lingue.css`, `catalogo-lingue.*`;
- `design-system/marchio/`.

Nei file condivisi (`token.css`, `TOKEN.md`, `SISTEMA.md`, `metodo.config.mjs`, `pagina.css`, `cornice.js`, il catalogo,
`it.po`) aggiungi senza riordinare, e non cambiare ciò che usano le altre pagine.

## Le prove che fai tu

- **Le sequenze**:
  - registra arrivo, scorrimento e gesti a 390×844 e a 1440×900 (`scripts/sequenza.mjs`);
  - metti la pagina accanto agli scorrimenti dei tre riferimenti più forti, alla home, a «non ancora» e a «stato»
    (`scripts/affianca.mjs`).
- **I controlli**: `controlla-sorgenti.mjs` (da `design-system/`; aggiungi la pagina a `metodo.config.mjs`),
  `css_logico.py`, `translations.py extract --check` e `check`, `test_translations.py`, `marchio.py --check`, tutti verdi.
  Dopo i testi nuovi rigenera le lingue di prova (`design/lavoro/2-lingue-aspetto/prova-lingue/crea_cataloghi.py`).
- **Il piano dei tratti**, come `PIANO.md`: per ogni tratto che cosa è dentro l'idea, che cosa si muove e a che scopo, e
  la fonte o la motivazione. Poi l'elenco di ciò che lasci da completare al ruolo di costruzione.

## Ambiente

- `source /workspace/kalliope/materiali-locali/playwright/env.sh`: Playwright 1.65.1 con i tre motori. Firefox e WebKit si lanciano con
  `avvia()` della skill.
- **Cartelle e porte**:
  - le tue cartelle sono sotto `/tmp/lavoro-3c-*`;
  - le tue porte vanno dalla **8880** alla 8889;
  - le porte 8765–8767 sono del proprietario, la 8770 serve la pagina della scelta del logo.
- **Lo schermo**: nessuna finestra. Usa browser senza `DISPLAY` né `WAYLAND_DISPLAY`, perché sono lo schermo vero del
  proprietario. Niente `mostra.mjs`, niente `cancello.mjs --apri`.
- **Che cosa non fare**:
  - niente comandi che chiedono conferma, né lavori in background da aspettare;
  - niente cancellazioni fuori dalle tue cartelle in `/tmp`;
  - **niente commit e niente push**;
  - non creare altri agenti.
- **La memoria è stretta**: un browser alla volta, e controlla `free -m` (sotto 1,5 GB disponibili, aspetta).
- `design/STATO.md` è un file vecchio modificato da altri: non toccarlo.

## Consegna

Nella risposta finale e in `progresso.md`:
- i file creati e toccati: pagina, componenti, token nuovi con il ruolo;
- il piano dei tratti;
- i percorsi delle sequenze e dei confronti;
- `CONTENUTI.md`;
- l'elenco di ciò che resta al ruolo di costruzione;
- ciò che non hai verificato;
- le scelte fatte senza una fonte, dichiarate come progettuali.
