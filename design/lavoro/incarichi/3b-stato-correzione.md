# Incarico 3b-c · «stato»: la correzione dopo il giudizio

- **Attività**: `path-look`, la correzione (skill `design-system-generator`, `references/direzione.md` §6), ruolo
  **design-direction**: lo stesso che ha reso la pagina.
- **Area tua**: `design/lavoro/3b-stato/` (aggiorna `progresso.md` con una sezione «Correzione dopo il giudizio»; foto e
  sequenze nuove in `sequenze-correzioni/` e `foto-correzioni/`).
- **Punto di partenza**: commit `b456308` per la pagina; il giudizio è `design/lavoro/3b-stato/giudizio/GIUDIZIO.md` (con le
  sue prove in `/tmp/lavoro-3bg-*`): pronta per la correzione, da non rifare.

## Che cosa correggere

Leggi il giudizio per intero, poi:

1. **I1**: le tappe della strada non devono far aspettare chi arriva a metà: la tappa che sta nello schermo si legge
   subito; il movimento resta, ma non come attesa.
2. **I2**: le risposte alle domande non lampeggiano: nessun fotogramma con il testo nuovo pieno prima della sua entrata.
3. **I4**: al telefono la pagina è lunga e fitta (9.674 px; strada e tratto per chi controlla circa 3.500 px ciascuno): chi
   valuta per un altro deve arrivare al messaggio da inoltrare senza attraversare quattro schermate di dettagli che non
   cerca. Decidi tu come (che cosa si apre a richiesta, che cosa si accorcia, l'ordine), senza togliere i fatti che il
   progetto vuole detti.
4. **I6**: i tre fatti che mancano e che `CONTENUTI.md` dà per presenti: che cosa modifica l'installazione e con quali
   permessi, chi ospita il sito, le differenze di lettura che la voce ancora fa. Prendili da `design/progetto.md` e dalle
   fonti che cita, senza inventare; correggi `CONTENUTI.md` dove descrive ciò che la pagina non ha.
5. **M1**: la barra delle pagine interne segna la pagina in cui sei. È una decisione d'aspetto della cornice: rendila con
   una regola **aggiunta** in `design-system/componenti/barra.css` (un altro ruolo sta lavorando sullo stesso file,
   incarico 2-f: rileggilo subito prima di toccarlo, aggiungi in fondo, non cambiare le regole esistenti), e applicala
   anche a «non ancora» con il solo attributo nel markup della sua barra; scrivi la regola in `3a-non-ancora/PIANO.md`, «La
   cornice».
6. **I minori d'aspetto** che sono tuoi: la punta della bolla delle risposte al telefono, la colonna di «non misurato» con
   una sola linea, «alle 10:30» che va a capo nel mezzo e la fonte che esce dalla cornice a 320 px, «Copiato» lontano dal
   pulsante al telefono, le impronte troppo piccole che a metà corsa coprono «Sul disco», i vuoti lunghi nel tratto chiaro
   al computer, le righe di circa 95 caratteri nel riquadro «Hai provato Kalliope in una riunione vera?». Per ciascuno:
   correggi, oppure scrivi perché lo lasci come scelta per il proprietario.

Non sono tuoi, e vanno nella costruzione dopo di te: I3 (la cornice che nasconde pezzi se il suo script non si carica: lo
corregge l'incarico 2-f), I5 (i componenti nel catalogo), l'indirizzo della bolla diverso da quello copiato e le fonti che
non si aprono (dati e collegamenti), l'etichetta di «Tu» senza i caratteri del sito. Scrivili nell'elenco per la
costruzione in `PIANO.md`.

Poi rifai le sequenze di arrivo, scorrimento e gesti a 390×844 e 1440×900, i confronti con la home e «non ancora», e i
controlli (`controlla-sorgenti.mjs`, `css_logico.py`, `translations.py extract --check` e `check`, `test_translations.py`);
home e «non ancora» identiche a `b456308` salvo M1 (dichiaralo).

## Lavoro in parallelo

L'incarico 2-f (ruolo di costruzione) sta correggendo adesso la cornice e le lingue: `pagina.css`, `barra.css`,
`cornice.js`, `componenti.js`, `lingue.css`, `riunione.css`, `versioni.css`, `token.css`, `website/non-ancora/`. Non
toccare quei file salvo la regola di M1 in `barra.css` e l'attributo di M1 nella barra di «non ancora»; in `token.css`
aggiungi soltanto, in fondo al blocco di «stato», rileggendo il file subito prima. Costruisci da una copia dell'albero se
quello vivo non si costruisce perché 2-f è a metà di una modifica.

Un'altra misura (incarico V-m) lavora in `benchmarks/voce-propria/`: non riguarda il sito.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3b-*`, porte tue dalla **8870** alla 8879. Le porte 8765 e 8766 e le loro cartelle sono
  del proprietario; 8890–8899 dell'incarico 2-f; 8900–8909 dell'incarico V-m.
- Nessuna finestra sullo schermo. Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente
  cancellazioni fuori dalle tue cartelle in `/tmp`. **Non fare commit né push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: per ogni punto che cosa hai cambiato, con le foto o i fotogrammi prima e dopo; i
file toccati; i minori lasciati come scelta, con il motivo; l'elenco aggiornato per la costruzione; ciò che non hai
verificato.
