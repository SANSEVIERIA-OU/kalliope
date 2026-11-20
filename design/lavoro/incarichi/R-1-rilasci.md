# Incarico R-1 · Release automatiche, AUR e preparazione della 0.1

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Area tua**: `design/lavoro/R-rilasci/`. Tieni `progresso.md` aggiornato a ogni unità finita: fatto, in corso, prossimo passo,
  ultimo comando, problemi aperti. Gli esiti delle prove vanno lì mentre li trovi.
- **Tempo**: il proprietario conta il tempo. Stima: circa 2 ore per l'unità 1 e circa 1 ora e mezza per l'unità 2. Se una cosa
  allarga il lavoro oltre l'incarico, scrivila nel progresso e non farla.

## Leggi prima

1. `CLAUDE.md`, per intero. Le decisioni del 20/11/2026 sono nel punto «Rilasci e AUR»; da lì vengono la regola dell'ultima
   versione di ogni dipendenza e le regole su push e pubblicazione.
2. `design/lavoro/ricerca/rilasci.md`: i fatti con le fonti su GitHub Actions, AUR e strumenti.
3. `docs/releasing.md`, `CONTRIBUTING.md`, `tools/version.py`, `tools/release_assets.py`, `tools/fetch_assets.py`,
   `tools/assets.json`, `.github/workflows/` (tutti), `packaging/aur/PKGBUILD`, `packaging/release-notes.md`, `CHANGELOG.md`,
   `packaging/linux/` (metadati AppStream).
4. `design/lavoro/P-2-modelli/progresso.md`: i modelli dentro i pacchetti, la release `assets`, e l'elenco delle frasi del sito da
   cambiare quando si offrirà la prossima versione (`data-cambia="voce-nel-pacchetto"`).
5. Kalipso fa già release automatiche e AUR: `/workspace/kalipso/docs/releasing.md`, `/workspace/kalipso/.github/workflows/release.yml`,
   `aur.yml`. **Si leggono per capire, non si copiano**: le due codebase restano separate, e in Kalliope si scrive il suo codice.

## Unità 1: release automatiche e AUR

1. **La release parte da sola.**
   - Un push su `main` la avvia quando la versione di `Cargo.toml` non ha ancora un tag e la sua sezione del changelog è segnata
     come uscita (`version.py release`, senza TODO).
   - La release fa le stesse cose di oggi: costruisce, prova, pubblica e attesta. È marcata latest e non è una versione di prova.
   - Un push con una versione già rilasciata non fa niente. Il tag a mano e l'avvio a mano restano possibili, e l'avvio a mano senza
     tag continua a costruire e provare soltanto.
   - Attenzione: un tag creato con `GITHUB_TOKEN` non avvia altri workflow. Verifica nelle fonti ufficiali come lo risolve la
     documentazione di GitHub, e controlla che il sito si ripubblichi dopo la release (`pages.yml`) con la versione nuova.
2. **Niente più versioni di prova** («ogni passo è finale»). `version.py`, il workflow e la documentazione non offrono più
   `vX.Y-rc.N` come strada normale. I tag di prova del workflow (`v0.0-test.N`), se servono a provarlo, restano, ma non diventano
   mai latest e non vanno mai su AUR. Il sito sceglie già le parole giuste da solo con `data-release`: verificalo.
3. **AUR**, nello stesso flusso della release, solo per una versione finale:
   - `kalliope-bin` dal `packaging/aur/PKGBUILD`, con `pkgver` e somma dell'archivio pubblicato;
   - `.SRCINFO` scritto da `makepkg --printsrcinfo` in un contenitore Arch;
   - prima di pubblicare, una prova del pacchetto nel contenitore Arch (`makepkg`, installazione, `kalliope --version`), se sta nei
     tempi del job;
   - push su `ssh://aur@aur.archlinux.org/kalliope-bin.git` con la chiave del secret `AUR_SSH_KEY`, che esiste già;
   - l'impronta del server fissata: `SHA256:RFzBCUItH9LZS0cKB5UE6ceAYhBD5C8GeOBip8Z11+4`, annunciata da Arch nel 2020. Prova a
     confermarla oggi da una fonte ufficiale;
   - se AUR ha già quella `pkgver`, una `pkgrel` in più;
   - un avvio a mano per ripubblicare una versione già uscita.
   - Senza il secret, il job avvisa e non fallisce.
4. **Attestazione**: `actions/attest-build-provenance@v4` diventa `actions/attest@v4`, con gli input della sua documentazione.
   Controlla che ogni action usata sia all'ultima versione maggiore di oggi.
5. **`docs/releasing.md`** dice il flusso nuovo, le decisioni del 20/11/2026 con le parole del proprietario (`CLAUDE.md`), AUR, dove
   sta la chiave e come si cambia (chiave nuova, profilo AUR, `gh secret set AUR_SSH_KEY`). Aggiorna anche `CONTRIBUTING.md` dove
   parla di versioni.

**Prove dell'unità 1**
- `actionlint` all'ultima versione, `python3 -I -m unittest discover -s tools -p 'test_*.py'`, `version.py check`, prove nuove per
  ciò che cambi in `version.py`.
- I workflow si provano su un ramo di prova, `prova-rilasci`, spinto su `origin`. Fai girare in prova (dry run) tutto ciò che si può
  senza pubblicare:
  - la decisione «c'è da rilasciare?» su una versione già rilasciata e su una no;
  - la costruzione dei pacchetti;
  - il PKGBUILD, il `.SRCINFO` e la prova del pacchetto nel contenitore Arch, senza push su AUR.
- **Non crei tag, non crei release e non spingi su AUR né su `main`.**

## Unità 2: la 0.1 pronta da pubblicare (senza pubblicarla)

1. Su un ramo `rilascio-0.1`, partito da `main` con l'unità 1 dentro, segna la 0.1 come uscita (`version.py release`, la data la
   scrive chi coordina al momento della pubblicazione: lascia un modo semplice per cambiarla).
2. **Il changelog della 0.1** dice il vero di oggi, per chi usa Kalliope, nello stile del file:
   - la voce dentro il pacchetto, niente più scaricamento al primo avvio;
   - il secondo motore che imita la voce di chi usa Kalliope da una registrazione. Oggi si prepara da `kalliope-cli`: controlla nel
     codice come si usa, e non promettere ciò che la finestra non fa;
   - il logo nuovo;
   - le dimensioni vere dei pacchetti.
   - Vale anche per la descrizione AppStream della release.
3. **Le frasi del sito segnate `data-cambia="voce-nel-pacchetto"`** (l'elenco è in `P-2-modelli/progresso.md`) diventano vere per
   la 0.1. Nelle pagine rifatte cambi soltanto il testo, senza toccare la composizione, e aggiorni `translations.py extract`, i
   cataloghi e le traduzioni di prova (`crea_cataloghi.py`).
   - Verifica come il sito costruito con i dati di una release 0.1 finta (`--release-json`) mostra versione, dimensioni, impronte e
     parole di una versione non di prova.
   - Cerca anche le altre frasi che diventano false con la 0.1: «Slint 1.18» in «stato», `download.rs` saltato dalla prova delle
     fonti, i 53 MB.
4. Le prove: controlli del sito (`marchio.py --check`, traduzioni, `css_logico.py`, i test degli strumenti, `controlla-sorgenti.mjs`
   con `source /workspace/kalliope-playwright/env.sh`), il sito costruito con la release finta, e le foto di home, «installa» e
   «stato» a 1440 e 390, guardate.
5. Consegna il ramo spinto su `origin`, senza merge.

## Regole

- Ultima versione di ogni dipendenza e di ogni strumento, verificata oggi nelle fonti ufficiali. Se l'ultima non si può avere,
  scrivilo subito nel progresso.
- Nessun segreto nei file, nei log o nei messaggi. Il `.env` non si legge e non si stampa.
- Commit sui rami di prova sì, con i messaggi in inglese come nel repository. Nessun push su `main`, nessun tag, nessuna release,
  nessun push su AUR.
- La memoria della macchina è stretta: controlla `free -m` prima di compilare (sotto 1,5 GB disponibili, aspetta) e un lavoro pesante
  alla volta.
- Lavora in primo piano. Non chiudere il turno finché la consegna non è fatta. Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`, in italiano:
- che cosa è cambiato, file per file;
- gli esiti delle prove con i link alle esecuzioni su GitHub;
- che cosa succederà esattamente al push su `main` del ramo `rilascio-0.1`, passo per passo, compreso AUR e il sito;
- ciò che il proprietario deve fare prima, cioè la chiave pubblica nel suo profilo AUR;
- ciò che non è verificato.
