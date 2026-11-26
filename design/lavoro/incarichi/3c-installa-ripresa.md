# Incarico 3c-b (ripresa) · La pagina «installa»: finire la costruzione dopo il riavvio

- **Attività**: `path-build` (skill `design-system-generator`), ruolo **design-build**. Completamento del percorso senza ridisegnare.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Perché una ripresa**: il costruttore di 3c-b (l'agente `a06de7db20b1f426b`) si è perso con il riavvio della sessione del 20/11/2026.
  Subentri tu, partendo dall'incarico, da `progresso.md` e dai file. Non puoi chiedergli niente.
- **Posto prenotato da chi coordina**: `3c-installa-ripresa` (build).
- **Area tua**: `design/lavoro/3c-installa/costruzione/`, come prima. Continua lo stesso `progresso.md`: aggiungi una sezione «Ripresa del
  20/11/2026» e aggiornala a ogni unità finita, con fatto, in corso, prossimo passo, ultimo comando e problemi aperti.

## Leggi prima

1. **L'incarico di 3c-b**, `design/lavoro/incarichi/3c-installa-costruzione.md`. Vale per intero: scopo, «Senza ridisegnare», prove,
   ambiente, divieti, consegna. Qui sotto c'è solo ciò che è nuovo.
2. **`design/lavoro/3c-installa/costruzione/progresso.md`**, per intero: come si prova, le unità finite, i difetti corretti (1–14),
   le controprove, le decisioni con la fonte, i difetti d'aspetto lasciati al giudice e al proprietario, ciò che non è verificato.
3. `CLAUDE.md` e `design/lavoro/STATO.md`.
4. **La skill, ora alla versione 0.52.0** (l'ultima, uscita il 20/11/2026):
   `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.52.0/skills/design-system-generator/`. Leggi `SKILL.md`, poi
   `references/direzione.md` §6 punto 2, `references/prove.md`, `references/presidi.md` ed `references/esecuzione.md`.
   - Chi coordina ha portato `SKILL` di `/workspace/kalliope/materiali-locali/playwright/env.sh` a 0.52.0.
   - Gli strumenti che le tue prove usano sono identici byte per byte a quelli della 0.49.0 con cui sono stati scritti gli esiti di H5:
     `esame-impaginazione.mjs`, `dispositivi-qa.mjs`, `soglie.mjs`, `dispositivi.mjs`, `confronta-scelta.mjs`, `controlla-sorgenti.mjs`
     e `lib/comune.mjs`. Gli esiti di H5 restano quindi confrontabili.
   - Fra le due versioni cambiano il Chrome della skill e i posti, il cancello, e arriva `controlla-valori.mjs`, che serve alla direzione.

## Che cosa è cambiato con il riavvio (verificato da chi coordina il 20/11/2026 alle 10:20)

- **`/tmp` è vuota.** Non ci sono più gli alberi e i siti H5, H5i, P e P2, i dati della versione (`/tmp/lavoro-3cb-dati/releases.json`),
  il pacchetto 0.1-rc.1 scaricato, `/tmp/lavoro-3cb-via-libera`, né i registri `/tmp/lavoro-3cb-H5-finale-*.txt`.
  - Rifai ciò che ti serve: i dati della versione offerta, v0.1-rc.1, come per il sito vero (`docs/releasing.md`, «Website»), e P
    (`548a6f2`) con `prove/costruisci.sh`.
  - Non c'è nessun processo di prova vivo e nessun server sulle porte 8890–8899.
  - Le librerie di Firefox e WebKit stanno in `/workspace/kalliope/materiali-locali/playwright/motori/` e restano dopo un riavvio. Prima di tutto lancia
    `motori-test.mjs` della skill, con `env.sh`. Se un motore non parte, scrivilo e fermati su quel motore: niente prove in silenzio
    nel solo Chromium (`references/esecuzione.md`, «Dopo un riavvio della macchina»).
- **Il giro finale su H5 si è interrotto a metà.** Le date dei file in `esiti/` dicono questo:
  - `finale-3.sh` (Firefox e WebKit) è finito.
  - `finale-1.sh` (catalogo e robustezza in Chromium) è finito.
  - `finale-2.sh` (gli esami in Chromium) è arrivato almeno fino a `H5-esame-altezze-844.txt`, alle 08:45.
  - Di `finale-4.sh` (lingue, primo schermo ai dispositivi, confronto con la scelta, foto delle lingue) e di `testo-confronto.sh` non c'è
    nessun esito.
  - Verificalo tu sui file, anche con `prove/riassunto.py`, prima di decidere che cosa rifare.
- **Un controllo è fallito**, in `esiti/robustezza-H5-firefox-390x844.txt`, riga 56:
  `NO /#indirizzo-installa e porta al punto giusto: «#inoltra h3» sotto la barra, nello schermo, opaco · {"titolo":-8,"bottom":18,"barra":56,"vh":844,…,"y":7087}`.
  Gli altri 13 esiti di robustezza su H5 sono tutti verdi.

## Che cosa fare

1. **L'ancora `#indirizzo-installa` in Firefox a 390×844.**
   - Prima ripeti il caso più volte, per sapere se fallisce sempre o a volte.
   - Trova la causa: può essere della stessa famiglia del difetto 12, la pagina che si accorcia dopo i caratteri senza che Firefox
     compensi, oppure un'altra.
   - Correggi alla causa, senza ridisegnare.
   - Guarda se lo stesso difetto tocca altre ancore, altre misure o altri motori, e correggi ogni caso.
   - La prova deve fallire su H5 e passare dopo la correzione; mettila nella tabella dei difetti e in quella delle controprove.
2. **Un nuovo albero congelato**, H6, con le impronte.
   - Rifai le prove che la correzione può toccare, nei motori in cui possono cambiare, e scrivi quali e perché.
   - Fai la parte del giro finale che non è stata fatta: `finale-4.sh`, `testo-confronto.sh` e ciò che manca di `finale-2.sh`.
   - Una prova che resta su H5 si può tenere se i file da cui dipende non sono cambiati fra H5 e H6: dichiaralo con le impronte.
     La matrice completa non si ripete.
3. **Il «Prossimo passo» di `progresso.md`.**
   - Il riassunto degli esiti.
   - `prove/ammesse.json`, con le differenze volute di «installa» nel confronto con la scelta.
   - Il testo grande: lo zoom sotto i 320 px. Se è un difetto d'aspetto, non sta a te deciderlo: lo scrivi fra quelli lasciati al giudice
     e al proprietario, con le foto, come gli altri.
   - Le foto in `foto/`, le impronte (`prove/impronte.sh`), i controlli statici dell'incarico tutti verdi.
   - La consegna.

## In più rispetto all'incarico di 3c-b

- **Ogni comando lungo va in primo piano, a pezzi sotto i 10 minuti**: un motore e una misura, o un gruppo di scenari, per volta.
  - Niente `finale-*.sh` lanciati insieme in sottofondo e niente attese di file con `until … sleep`.
  - Se Claude Code sposta un comando in background, conserva l'ID e raccogli la notifica.
  - **Non chiudere il turno finché la consegna non è fatta.** Il costruttore di prima ha chiuso il turno mentre il giro girava ed è
    andato perso con tutto ciò che sapeva.
- Le porte restano 8890–8899 e le cartelle `/tmp/lavoro-3cb-*`. Gli alberi hanno nomi nuovi (H6, P3…): `costruisci.sh` non cancella.
- La memoria è stretta: circa 5,8 GB disponibili e lo swap a metà. Un browser alla volta, e controlla `free -m` prima di ogni pezzo:
  sotto 1,5 GB disponibili, aspetta.
- Restano fuori dal tuo lavoro i commit, i push, le finestre, gli altri agenti e il file `design/STATO.md`.

## Consegna

Nella risposta finale e in `progresso.md`, in italiano:
- la causa del difetto dell'ancora, la correzione, la prova che fallisce prima e passa dopo, e gli altri casi trovati;
- quali prove sono state rifatte su H6 e quali restano su H5, e perché;
- gli esiti con i numeri, le impronte di H6 e i controlli statici;
- l'elenco aggiornato dei difetti d'aspetto lasciati al giudice e al proprietario, con le foto, compresa la decisione sul testo grande;
- ciò che non hai verificato;
- ciò che non sei riuscito a fare e perché.
