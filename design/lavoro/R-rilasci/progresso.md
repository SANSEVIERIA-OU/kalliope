# R-1 · Release automatiche, AUR e preparazione della 0.1 · progresso

Incarico: `design/lavoro/incarichi/R-1-rilasci.md`. Partenza: `main` a `02a2d57`. Data: 20/11/2026.

## Unità

| # | Unità | Stato |
|---|---|---|
| 1 | Release automatiche, niente versioni di prova, AUR, attestazione, documentazione | fatta (prove su `prova-rilasci`: sotto) |
| 2 | La 0.1 pronta su `rilascio-0.1` (changelog, AppStream, frasi del sito) | fatta, ramo spinto, senza merge |

**In corso**: niente. **Prossimo passo** (di chi coordina, con il proprietario): la chiave pubblica nel profilo AUR, la data, poi il
push su `main` di `rilascio-0.1` (sezione «Al push su main»). **Problemi aperti**: «Ciò che non è verificato», in fondo.

## Rami

- `rilascio-0.1` (spinto, da consegnare): `cdc9d06` e `b8bc1cd` sono l'unità 1, `05c34e3` è l'unità 2, l'ultimo commit è questo file.
  Parte da `main` a `02a2d57`: se `main` non si è mosso, va in avanti veloce.
- `prova-rilasci` (spinto, solo per le prove, da non unire): l'unità 1 più commit `TEMPORARY` che fanno girare la decisione sui push
  di quel ramo (senza mai pubblicare) e fingono un tag `v0.1`. Si può cancellare: `git push origin --delete prova-rilasci`.

## Diario

### 20/11 · unità 1

- **Versioni verificate oggi** (API di GitHub, release e tag): actionlint 1.7.12 (30/3/2026, l'ultima; scaricato e controllato con
  lo SHA-256 del rilascio), shellcheck 0.11.0 (l'ultima, per actionlint); `actions/checkout` v7.0.1, `upload-artifact` v7.0.2,
  `download-artifact` v8.0.2, `attest` v4.2.2, `cache` v6.1.0, `configure-pages` v6.0.0, `upload-pages-artifact` v5.0.0,
  `deploy-pages` v5.0.1, `Swatinem/rust-cache` v2.9.3: i workflow usano già l'ultima maggiore di ognuna. `archlinux:base-devel` è
  un'immagine che segue Arch (si aggiorna da sola).
- **actionlint 1.7.12 non conosce l'etichetta `ubuntu-26.04`** (la sua lista è di marzo; i runner esistono e la CI ci gira). Nelle
  prove si ignora solo quel messaggio con `-ignore`, senza file di configurazione nel repository.
- **GITHUB_TOKEN** (documentazione di GitHub, sorgente `github/docs`, `data/reusables/actions/actions-do-not-trigger-workflows.md`,
  letto oggi): gli eventi creati con il token del workflow non avviano altri workflow, «with the following exceptions:
  `workflow_dispatch` and `repository_dispatch` events always create workflow runs». La documentazione propone un token di una
  GitHub App o personale per il resto; non serve: la release fa tutto nella stessa esecuzione e avvia il sito con `gh workflow run`
  (permesso `actions: write`, da `fine-grained-pat-permissions.json` della documentazione).
- **Attestazione** (README di `actions/attest` v4.2.2 e «Generating build provenance for binaries» della documentazione): senza
  predicato fa la provenienza SLSA; input `subject-path`; permessi `id-token: write`, `contents: read`, `attestations: write`.
- **Impronta di AUR confermata oggi** da tre parti: la pagina principale di aur.archlinux.org (aurweb v6.5.1) elenca
  «Ed25519: SHA256:RFzBCUItH9LZS0cKB5UE6ceAYhBD5C8GeOBip8Z11+4»; la notizia di Arch del 2020 dice la stessa; `ssh-keyscan` da qui
  dà la stessa.
- **Regole di AUR lette oggi** (ArchWiki, «AUR submission guidelines», modificata il 27/10/2026, aperta con un User-Agent da
  browser): «add a package source license» con PKGBUILD e `.SRCINFO` («Add a LICENSE file and/or a REUSE.toml file to your
  repository. You are encouraged to … license your submission under the 0BSD license»); solo il ramo `master`; `-bin` per i pacchetti
  già costruiti; «Automated PKGBUILD updates are used at your own risk». Un nome che AUR non ha si clona vuoto (provato qui con
  `kalliope-bin`): il primo push crea il pacchetto.
- **Commit `cdc9d06`** («Release every version from main by itself, and publish kalliope-bin on AUR») e **`b8bc1cd`** (correzione
  trovata dalla prova su GitHub, sotto). File per file in «Che cosa è cambiato».
- **Prove locali**: 179 prove degli strumenti verdi (una saltata come prima: cairosvg); 17 nuove per `version.py`
  (`tools/test_version.py`), 8 per `aur.py` (`tools/test_aur.py`); `version.py check`; actionlint 1.7.12 con shellcheck 0.11.0 verde
  sui tre workflow toccati (in `ci.yml`, non toccato, restano due note di stile SC2129 di prima). Il passo «What to release» estratto
  dal YAML e fatto girare qui: push su main con 0.1 non segnata (niente), segnata e senza tag (rilascia v0.1, AUR publish), segnata con
  v0.1 già esistente (niente), avvio a mano su un ramo (costruisce e prova, AUR try), tag v0.1 (rilascia), tag v0.0-test.2
  (prerelease, niente AUR), tag v0.1-rc.2 (rifiutato: «no test versions»). `tools/aur.py` con lo stesso SHA dà byte per byte il
  `kalliope-bin.PKGBUILD` che scrive `build-packages.sh`.
- **Prove su GitHub, ramo `prova-rilasci`** (lì un commit `TEMPORARY` fa partire la release anche ai push di quel ramo; un ramo che non
  è `main` non pubblica mai, e questa è una regola anche del workflow vero):
  - A, 0.1 non segnata: https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44795817981 — «CHANGELOG.md says 0.1 is not yet
    released: nothing to release», pacchetti, pubblicazione e AUR saltati.
  - B, 0.1 segnata, nessun tag: https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44795990295 — «this releases v0.1», pacchetti
    costruiti e provati (tarball, `.deb`, `.rpm` in Fedora, PKGBUILD in Arch: ognuno parla con Giulia 2 225 ms e con la voce preparata
    1 920 ms), Publish saltato. **AUR try rosso**: PKGBUILD, `.SRCINFO`, `makepkg` e `kalliope --version` («kalliope 0.1») giusti, poi
    `test -e` sul collegamento della licenza è fallito: nell'immagine Arch il file a cui punta non c'è (lo stesso motivo per cui
    `test-packages.sh` controlla il collegamento con `test -L`, commit `5eab67d`). Corretto alla causa in `b8bc1cd` (si controlla il
    collegamento, con un messaggio).
  - C, 0.1 segnata e un tag `v0.1` finto aggiunto all'elenco: https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44798327192 —
    «v0.1 is already tagged: nothing to release», tutto il resto saltato.
  - B di nuovo, con la correzione: https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44798655088 — verde: pacchetti costruiti e provati, AUR try verde
    (PKGBUILD con `pkgrel=1`, `.SRCINFO`, `makepkg`, installato, «kalliope 0.1», tolto). Un commit `TEMPORARY` stampa il `pacman.conf`
    dell'immagine: `NoExtract = usr/share/gtk-doc/html/* usr/share/doc/*`. La causa è confermata.
  - CI del ramo: https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44795990106 (verde).
- **Un mio errore, corretto**: il primo push di `prova-rilasci` (commit `8dc5f91`) conteneva per sbaglio la modifica non mia di
  `design/STATO.md` che c'era nell'albero di lavoro (`git commit -a`). Tolta subito: commit rifatto senza quel file e ramo
  ripubblicato con `--force-with-lease`; `design/STATO.md` è di nuovo soltanto modificato nell'albero, come l'ho trovato. Il commit
  `8dc5f91` è rimasto qualche secondo su `origin` (GitHub lo conserva per SHA).
- **Il sito in linea si è ripubblicato uguale** dopo ogni esecuzione della release sui rami di prova: il `pages.yml` di `main` ha
  ancora `workflow_run` su «Release», che scatta per le release di qualunque ramo (il nome cambiato sul ramo di prova non basta).
  Ricostruisce il sito di `main` con la release di oggi: lo stesso sito (controllato alle 19:20: in linea c'è ancora la 0.1-rc.1). È
  successo anche dopo la release a mano su `rilascio-0.1`. Il `pages.yml` nuovo non ha più `workflow_run`.

### 20/11 · unità 2

- **Il secondo motore oggi** (letto nel codice): `kalliope-cli voice REGISTRAZIONE.wav -o VOCE.safetensors` (primi 12 s; consenso
  esplicito, `crates/cli/src/main.rs`); la finestra elenca le voci in `~/.local/share/kalliope/voices/*.safetensors`
  (`catalog.rs`, `voices_dir`) accanto a Giulia e Marco, solo se c'è il modello Pocket; non registra e non prepara. Il salvataggio non
  crea la cartella (`save_voice`), quindi il changelog dice `mkdir -p`.
- **Dimensioni vere** dalla costruzione della 0.1 su `prova-rilasci` (esecuzione B): `.deb` 187 108 644 B, `.rpm` 205 140 066 B,
  tarball 204 953 426 B; installato circa 320 MB (misura di P-2 del 19/11, gli stessi file). Nel changelog: 187, 205, 205 MB.
- **Date**: `version.py release 2026-11-20`. Per cambiarla il giorno della pubblicazione: `python3 tools/version.py release
  AAAA-MM-GG`, poi commit (cambia l'intestazione del changelog e la data AppStream; provato due volte di fila nelle prove).
- **Frasi del sito**: tutte le `data-cambia="voce-nel-pacchetto"` di «installa» rese vere e tolto l'attributo; in più quelle dell'elenco
  di P-2 nella home e in «stato», «Slint 1.18» → 1.19 (`Cargo.lock`), Pocket TTS fra le licenze (CC BY 4.0 chiede l'attribuzione),
  «Non è ancora su AUR» in «installa», le schede dello scarico nella vecchia pagina «aiuto», e la prova delle fonti senza più
  l'eccezione per `download.rs`. Le pagine vecchie (aiuto, ascolta, riunione, 404) nascondono già da sole «Versione di prova …» quando
  la release non è di prova (`body[data-prerelease="false"] .solo-prova`, `website/stile/base.css`): verificato nel sito costruito.
- **La composizione non cambia**; nel racconto del primo avvio (home e «installa») si toglie solo il tratto dello scarico che nella 0.1
  non esiste: la finestra dice «Preparo la voce…» e poi «Pronta». Home: stessi tempi di prima per «Preparo» e per la scelta del
  microfono, tolti i 2,54 s dello scarico. «installa»: «Preparo la voce…» dura quanto prima (da `--avvio-prepara` a `--avvio-pronta`,
  900 ms), dai token.
- **Prove**: 179 prove degli strumenti, `translations.py extract --check` e `check` (353 voci), `css_logico.py`, `marchio.py --check`,
  `controlla-sorgenti.mjs` (36 fogli, valori solo nei token), `version.py check`, `version.py tag v0.1`, `version.py due` (rilascia
  v0.1); cataloghi di prova rigenerati (`crea_cataloghi.py`, 9 lingue, `serve.2` tradotta di nuovo in ognuna, tolte le 4 voci dello
  scarico).
- **Sito costruito con una release 0.1 finta** (`--release-json`, dimensioni e impronte della costruzione vera): una release finta con le dimensioni e le impronte della costruzione a mano su `rilascio-0.1` (`.deb`
  187 073 012 B, `6bfe9f87…`; `.rpm` 205 141 189 B; tarball 204 954 952 B). Il sito dice «versione 0.1» (`data-release="stabile"`,
  nessun «di prova» visibile nelle pagine rifatte; nelle vecchie la riga è nascosta), «Scarica il .deb 187,1 MB», l'impronta intera,
  «kalliope 0.1», i collegamenti alla release `v0.1`. Le fonti non sono controllate (fuori linea e senza tag locale: la costruzione lo
  dice); con il tag vero le controlla da sé.
- **Foto** (Chromium, 1440 e 390, guardate): 28 foto, in `/tmp/r1-sim/foto/` (non restano dopo un riavvio). Home: arrivo; primo avvio all'inizio
  («Preparo la voce…», campo spento) e alla fine («Pronta», «Kalliope» scelto, tre requisiti fatti); pagina intera. «installa»: arrivo
  («Scarica il .deb 187,1 MB», «versione 0.1»); il file (le voci nel file, l'impronta, l'attestazione); la finestra all'inizio e alla
  fine; «Manca la voce» premuta (stato d'errore) e ripremuta («Pronta»); i comandi di Arch con la nota di AUR; pagina intera. «stato»:
  arrivo («versione 0.1»); il varco (github.com, «le voci, dal pacchetto», «Nessuna connessione»), le licenze con Pocket TTS e Slint
  1.19; pagina intera. A 1440 e a 390, nessun errore nella console. Nelle foto di una sezione la barra del sito, che resta in cima
  mentre si scorre, copre la parte alta: è la barra, non un difetto.
- **Release a mano su `rilascio-0.1`** (costruisce, prova, AUR try, non pubblica): https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44798760227 — verde. «A push of this commit to main: 0.1 is
  marked released and v0.1 does not exist yet: this releases v0.1», poi «Build and test only…». AppStream validato con la descrizione
  nuova («Validation was successful»). Pacchetti costruiti e provati sui quattro sistemi (Giulia 2 225 ms, voce preparata 1 920 ms).
  Publish saltato. AUR try verde: `pkgrel=1`, `.SRCINFO` con `pkgver = 0.1` e lo SHA dell'archivio, `makepkg`, installato, «kalliope
  0.1», tolto; push saltato; artefatto `aur-kalliope-bin`.
- **CI a mano su `rilascio-0.1`** (Linux, Windows, macOS): https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44798765448 — Linux, Windows e macOS verdi. CI del push:
  https://github.com/SANSEVIERIA-OU/kalliope/actions/runs/44798747656, verde.

## Consegna

### Che cosa è cambiato, file per file

**Unità 1** (`cdc9d06`, `b8bc1cd`)
- `tools/version.py`: niente più `vX.Y-rc.N` (un tag così è rifiutato: «Kalliope has no test versions, every step is final»); restano
  `vX.Y` e i tag di prova del workflow `v0.0-test.N` (sempre prerelease, senza controlli di versione). Nuovo `due [TAG…]`: con i tag che
  il repository ha, dice se un push su `main` rilascia (`release=true` quando la versione non ha tag e il changelog la segna uscita).
  `tag` per una versione controlla tutto (file d'accordo, changelog con la data, AppStream non più «development», nessun TODO).
  `release DATA` si può ripetere per cambiare la data.
- `tools/test_version.py` (nuovo, 17 prove), `tools/aur.py` (nuovo: PKGBUILD di AUR dalla ricetta del repository, con versione,
  SHA-256 dell'archivio pubblicato, `pkgrel` che segue AUR, `LICENSE`), `tools/test_aur.py` (nuovo, 8 prove).
- `.github/workflows/release.yml`: parte anche a ogni push su `main`. Primo job «What to release»: `version.py due` con
  `git ls-remote --tags`, poi `version.py tag`; un push senza versione da rilasciare finisce lì. Pacchetti come prima (su Ubuntu 24.04).
  «Publish»: `actions/attest@v4` (prima `attest-build-provenance@v4`), `gh release create … --latest`, che crea il tag sul commit del
  push (`--target`; con un tag spinto a mano `--verify-tag`), poi `gh workflow run pages.yml` (permesso `actions: write`). Job «AUR»
  che chiama `aur.yml`: pubblica dopo la release di una versione; in un avvio a mano prova soltanto, e la chiave non gli arriva. Una
  sola release alla volta, mai interrotta. L'avvio a mano su un ramo costruisce e prova soltanto, e scrive che cosa farebbe un push.
- `.github/workflows/aur.yml` (nuovo): chiamato dalla release o avviato a mano (versione, «publish» da spuntare, non spuntato all'inizio). Scrive
  PKGBUILD e `LICENSE` (`tools/aur.py`, con lo SHA dell'archivio da `SHA256SUMS` della release, o dall'artefatto nella prova),
  `.SRCINFO` con `makepkg --printsrcinfo` in `archlinux:base-devel`, costruisce e installa il pacchetto lì, `kalliope --version`
  deve dire `kalliope X.Y`, lo toglie; artefatto `aur-kalliope-bin`; poi il push su `ssh://aur@aur.archlinux.org/kalliope-bin.git`,
  ramo `master`, con `AUR_SSH_KEY` e l'impronta Ed25519 fissata. Senza il segreto: un avviso, verde. AUR con gli stessi file: niente
  push.
- `.github/workflows/pages.yml`: tolto `workflow_run` (le release fatte dal workflow lo avviano a mano); nuovo job «Is a release on its
  way»: un push che porta una versione da rilasciare non pubblica il sito, così le pagine della 0.1 non vanno in linea prima dei
  pacchetti della 0.1.
- `packaging/aur/PKGBUILD`, `packaging/linux/build-packages.sh`, `packaging/linux/test-packages.sh`: commenti (niente `-rc`; AUR).
  `packaging/release-notes.md`: Arch con `kalliope-bin` su AUR.
- `docs/releasing.md`: le decisioni del 20/11 (con «ogni passo è finale»), come si fa una versione, che cosa fa la release, il
  token del workflow con la citazione della documentazione, l'attestazione, AUR (ricetta, prova su Arch, push, impronta, ripubblicare
  a mano, la chiave: dove sta e come si cambia con `ssh-keygen` e `gh secret set AUR_SSH_KEY`), il sito che aspetta la release, i
  costi. `CONTRIBUTING.md`: un paragrafo sulle versioni.

**Unità 2** (`05c34e3`)
- `CHANGELOG.md`, sezione 0.1 con la data: le voci dentro il pacchetto, la voce imitata da una registrazione (come si prepara da
  `kalliope-cli`, che cosa la finestra fa e non fa, il consenso), il logo nuovo, le dimensioni vere, una riga per chi aveva la
  0.1-rc.1 (la cartella della voce scaricata si può cancellare). Tolto «Still being finished» e i 53 MB.
- `packaging/linux/io.github.sansevieria_ou.kalliope.metainfo.xml`: la descrizione della release 0.1, segnata uscita.
- `README.md`: «Status» e «Releases» per la 0.1, AUR.
- `website/installa/index.html`, `installa.js`: le frasi `data-cambia` vere (voci nel file, attestazione presente, che cosa resta
  dopo aver tolto il programma, come lo sappiamo, la finestra senza scarico, «Manca la voce» al posto dei tre errori dello scarico),
  la nota di Arch con AUR; nello script tolto lo scarico dal primo avvio.
- `website/index.html`, `website/scena.js`: il primo avvio senza scarico («Preparo la voce…», poi «Pronta»), il requisito «Niente da
  scaricare per la voce».
- `website/stato/index.html`: chi lo installa, il varco (github.com, «le voci, dal pacchetto»), «Nessuna connessione: tutto arriva
  con il pacchetto» con le fonti `tools/assets.json` e `catalog.rs`, che cosa scrive sul disco, come si toglie, Pocket TTS fra le
  licenze, Slint 1.19.
- `website/aiuto/index.html` (pagina vecchia): le sei schede dello scarico sostituite da quella di «Manca la voce».
- `website/lingue/site.pot`, `it.po`: rigenerati. `tools/test_translations.py`: la prova delle fonti senza l'eccezione di
  `download.rs`; la prova dei numeri di «installa» vuole che `data-mb` non ci sia più.
- `design/lavoro/2-lingue-aspetto/prova-lingue/`: `testi_europa.py` e `testi_mondo.py` (nuova `serve.2`, tolte le voci dello
  scarico) e i nove cataloghi di prova rigenerati.

### Al push su `main` di `rilascio-0.1`, passo per passo

Prima, chi coordina con il proprietario: la chiave pubblica nel profilo AUR (sotto), la data (`python3 tools/version.py release
AAAA-MM-GG` e commit, se non è il 20/11), e il permesso di push. Se `main` si è mosso, `rilascio-0.1` va prima rimesso sopra.

1. Il push porta su `main` i tre commit. Partono tre workflow, ognuno con il file del commit spinto:
   - **CI**: Linux, poi Windows e macOS (sullo stesso commit sono già verdi a mano, sotto).
   - **Website** (`website/` è cambiato): il job «Is a release on its way» chiede i tag a GitHub, trova che `v0.1` non c'è e che la 0.1 è
     segnata uscita: **il sito non si ripubblica**. In linea resta il sito di adesso, con la 0.1-rc.1.
   - **Release**: «What to release» dice «0.1 is marked released and v0.1 does not exist yet: this releases v0.1» e controlla la
     versione (`version.py tag v0.1`).
2. **Linux packages** (Ubuntu 24.04, circa 13 minuti): costruisce da zero, scarica ONNX Runtime e i modelli dalla release `assets`,
   fa `.deb`, `.rpm`, tarball e `kalliope-bin.PKGBUILD`, li installa, li fa parlare e li toglie (tarball, apt, Fedora, Arch), scrive
   `SHA256SUMS` e le note (la sezione 0.1 del changelog, poi «Which file»).
3. **Publish**: attesta ogni file (`actions/attest@v4`), crea la release **«Kalliope 0.1», tag `v0.1` sul commit spinto, segnata
   latest**, con i cinque file. Il tag e la release, fatti con il token del workflow, non avviano altri workflow (niente seconda
   release, niente evento per il sito). Poi avvia **Website** a mano.
4. **Website** (avviato dalla release, su `main`): `site.py` prende la release più nuova che non è di prova, la v0.1: numero 0.1,
   data, dimensioni e impronte vere, le parole `data-release="stabile"` («versione 0.1» invece di «versione di prova»), e pubblica.
   Da qui il sito in linea è quello della 0.1. Circa un minuto.
5. **AUR** (in parallelo al sito): legge lo SHA dell'archivio da `SHA256SUMS` della release, clona `kalliope-bin` da AUR (vuoto: il
   pacchetto non esiste), scrive PKGBUILD (`pkgver=0.1`, `pkgrel=1`), `LICENSE` e `.SRCINFO`, costruisce in Arch scaricando l'archivio
   dalla release, installa, `kalliope --version` = «kalliope 0.1», toglie; poi controlla l'impronta di aur.archlinux.org e fa il
   push con la chiave. **Il primo push crea `kalliope-bin` su AUR**, a nome dell'account del proprietario.
   - Se la chiave pubblica non è nel profilo: il clone via SSH fallisce, il job è rosso con «AUR did not let this key in: is its public
     half in the AUR profile?»; release e sito restano giusti. Rimedio: la chiave nel profilo, poi **Actions → AUR → Run workflow**
     con `0.1` e «publish».
   - Senza il segreto: un avviso, nessun push.
6. Dopo: ogni altro push su `main` con la versione 0.1 non fa niente (la release dice «v0.1 is already tagged»). La prossima versione
   comincia con `python3 tools/version.py set 0.2` in un ramo.

Se un passo fallisce prima della release: niente tag, niente release, sito com'era; si rilanciano i job falliti. La release già
pubblicata non si tocca se fallisce solo AUR.

### Che cosa deve fare il proprietario prima

- **La chiave pubblica nel profilo AUR**: la parte pubblica della chiave che sta in `AUR_SSH_KEY` (la privata ne ha una copia nel suo
  `.env`; la pubblica si ricava, se non ce l'ha già, con `ssh-keygen -y -f FILE_DELLA_CHIAVE_PRIVATA`). In aur.archlinux.org: My
  Account → SSH Public Key, una riga in più (le sue chiavi restano). Nessuno qui l'ha letta né vista.
- Il permesso per il push su `main` (e, se il giorno non è il 20/11, la data da scrivere).

### Ciò che non è verificato

- **La pubblicazione vera**, perché non si poteva fare: `gh release create --target` che crea il tag, `actions/attest@v4` in
  esecuzione, `gh workflow run pages.yml` dalla release, il sito che si ripubblica con la v0.1, il job del sito che salta il push
  (provata la logica, `version.py due`, non il job su `main`), lo scaricamento di `SHA256SUMS` e dell'archivio dalla release nel job
  AUR, il push su AUR con la chiave e se AUR accetta i tre file. Si vedranno al primo push.
- La chiave stessa: che `AUR_SSH_KEY` contenga una chiave valida, e che la sua parte pubblica sia nel profilo.
- Le dimensioni del changelog vengono dalla costruzione della 0.1 su `prova-rilasci`; quella vera cambia di pochi byte (contiene il
  changelog nuovo). «Circa 320 MB installato» è la misura di P-2 del 19/11, non rifatta. «0,07 s di processore per secondo di voce»
  è la misura di prima, non rifatta.
- Il catalogo del design system (`design-system/catalogo/catalogo-installa.js`, `catalogo.js`) mostra ancora gli stati dello
  scarico della finestra («Scarica la voce», «Scarico la voce… 20 di 53 MB»): sono prove del componente, non frasi del sito; vanno
  tolte con la prossima pagina, non in questo incarico.
- La finestra «Informazioni» non nomina Pocket TTS (CC BY 4.0): l'attribuzione è nei pacchetti (`share/doc/kalliope/pocket-tts/`) e
  ora anche in «stato»; cambiare l'applicazione era fuori dall'incarico.
- La licenza della ricetta su AUR: va con `LICENSE` (SANSEVIERIA 1.1, come la riga SPDX del PKGBUILD). ArchWiki incoraggia 0BSD;
  sceglierla è del proprietario.
- Il sito che si ripubblica uguale dopo le release dei rami di prova (sopra): succede finché su `main` c'è il `pages.yml` di adesso.
