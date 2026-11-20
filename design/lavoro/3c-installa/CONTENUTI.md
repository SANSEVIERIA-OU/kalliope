# «installa» · che cosa dice la pagina (incarico 3c, 20/11/2026)

Scritto prima di rendere (`direzione.md` §6, punto 0), dal documento di progetto (`design/progetto.md`: **P4** per intero, F4, F2 e chi
installa per un altro, F1 per il linguaggio, §4.3 «Come si installa» e «Cosa serve oggi», §6, §2.4, §7), dalla pagina di prima
(`website/installa/index.html` a `1c6ba5a`, scritta per la 0.1-rc.1), da `README.md`, `docs/releasing.md` e dai file della versione
offerta (`git show v0.1-rc.1:…`: `packaging/linux/install`, `packaging/aur/PKGBUILD`, `crates/app/src/main.rs`, `download.rs`).
I testi si rifanno da capo (decisione del 16/11): qui conta che ogni voce abbia il suo posto, non la forma della frase.

**La versione che la pagina descrive è la 0.1-rc.1** (quella che si scarica oggi). Versioni, nomi dei file, dimensioni, impronte e
collegamenti vengono dai segnaposto di `tools/site.py`. Le voci segnate **[cambia]** cambiano con la prossima versione (la voce dentro il
pacchetto, nulla da scaricare): nella pagina stanno in **quattro punti segnati** con `data-cambia="voce-nel-pacchetto"` e un commento
`<!-- cambia con la prossima versione -->` (elenco in fondo).

I tratti: **A** apertura (primo schermo) · **B** «Il file giusto, e uguale» (notte) · **C** «Installa» (stanza) · **D** «Apri Kalliope»
(chiara) · **E** chiusura ««Kalliope» fra i microfoni» (stanza) · piede (cornice).

## P4 · Installare su Linux (`progetto.md` §10), voce per voce

| # | Voce | Dove sta nella pagina, con le parole |
|---|---|---|
| 1 | Persona: chi ha un computer Linux, o il familiare tecnico che lo installa per un altro (F4, F2) | A, presentazione: «per un computer Linux a 64 bit con PipeWire, anche se lo installi per un'altra persona» |
| 2 | Bisogno: «metterlo sul computer e farlo funzionare, senza rompere nulla» | A titolo (ogni passo si vede riuscire); C: dove va e con quali permessi, nulla fuori dalle sue cartelle; «Per togliere Kalliope» |
| 3 | Ingresso: «Scarica» da P1 o P3, README, pagina della release | la pagina è la destinazione di «Scarica e installa» (home) e «Come si installa» (stato); nulla da dire in pagina |
| 4 | Controlla i requisiti: distribuzione | A: la scelta della distribuzione, quattro voci con le versioni (Debian 13 e Ubuntu 24.04 o successive · Fedora · Arch · altre distribuzioni) |
| 5 | Requisito: x86_64 (64 bit) | A presentazione; B «Che cosa serve» |
| 6 | Requisito: PipeWire (con pipewire-pulse; non PulseAudio da solo) | A presentazione; B «Che cosa serve»: «PipeWire con pipewire-pulse, come nei desktop recenti di Fedora, Ubuntu, Debian, Arch e openSUSE» |
| 7 | Requisito: glibc 2.39 o più recente | B «Che cosa serve», con il comando `ldd --version \| head -n 1` e la regola (il numero in fondo alla riga, almeno 2.39); C «Se non è andata» |
| 8 | Sceglie il file | A: la pillola «Scarica …» diventa quella della distribuzione scelta (nome e dimensione dai segnaposto); B: il file, il suo nome, la sua dimensione |
| 9 | Copia il comando (come è, senza modificarlo) | ogni comando ha il suo «Copia»; B: «I comandi contengono il nome esatto del file: copiali come sono» |
| 10 | Installa | C, con i comandi della distribuzione scelta |
| 11 | Apre Kalliope | D: «dal menu delle applicazioni» |
| 12 | «Scarica la voce» (53 MB) **[cambia]** | D, nella finestra ricostruita, con le frasi vere della 0.1-rc.1 |
| 13 | Controlla che sia «Pronta» | D: la frase intera della finestra; E la riprende |
| 14 | Esito: «Kalliope» compare fra i microfoni | E: `pactl list short sources` e la riunione con «Kalliope» nella barra del microfono; scena del primo schermo |
| 15 | Dati vivi (versione, nomi, link, dimensioni) inseriti al deploy | segnaposto ovunque: `{{kalliope.deb.name}}`, `.size`, `.url`, `{{kalliope.sha256.*}}`, `{{kalliope.tar.dir}}`, `{{kalliope.aur.url}}`, `{{kalliope.sums.url}}`, `{{kalliope.version}}`, `data-release` |
| 16 | `.deb`: `sudo apt install ./kalliope-<versione>-amd64.deb` | C (Debian e Ubuntu) |
| 17 | `.rpm`: `sudo dnf install ./kalliope-<versione>-x86_64.rpm` | C (Fedora) |
| 18 | `.tar.gz`: decomprimere, `./install` in `~/.local` senza amministratore; `./install --remove` | C (altre distribuzioni): `tar -xzf`, `cd`, `./install`; «Per togliere Kalliope» |
| 19 | Arch: `kalliope-bin.PKGBUILD` salvato come `PKGBUILD`, poi `makepkg -si` | C (Arch): `mkdir kalliope && cd kalliope`, `curl -L -o PKGBUILD {{kalliope.aur.url}}`, `makepkg -si`. **Risposta di chi coordina e verifica (costruzione 3c-b, 20/11/2026)**: il `PKGBUILD` della release v0.1-rc.1 (scaricato, sha256 `08fd87cf…9786`) ha `source=("$url/releases/download/v$_version/kalliope-$_version-linux-x86_64.tar.gz")` e `sha256sums` con la somma vera dell'archivio (`21718a38…f1b4`, uguale a quella della release): **scarica da sé l'archivio e lo controlla**, quindi la pagina dice così (C, Arch: «la ricetta scarica l'archivio della versione, controlla l'impronta e ne fa un pacchetto, senza compilare»; B, Arch: «il controllo lo fa la ricetta»). Non ha `install=`: nessuno script. `progetto.md` §P4 («salvare `kalliope-bin.PKGBUILD` come `PKGBUILD` vicino al `.tar.gz`») **non è sbagliata** (è il modo di chi ha già scaricato l'archivio: makepkg usa un file con quel nome che trovi accanto, comportamento di makepkg non provato qui perché su questa macchina non c'è) e **non è stata toccata**; la pagina segue ciò che fa il `PKGBUILD`. Non provato: `makepkg -si` su un Arch vero |
| 20 | Controllo: `sha256sum -c SHA256SUMS --ignore-missing` | B: il controllo di un file (`sha256sum <file>` e il numero atteso, come la pagina di prima) e, per tutti i file insieme, il file SHA256SUMS con questo comando |
| 21 | Regola: dichiarare «versione di prova» | A, stato «Oggi:» (`data-release="prova"` / `"stabile"`) |
| 22 | Regola: `.deb` e `.rpm` non sono firmati, `dnf` avvisa | C (Fedora): «il pacchetto non è firmato: dnf mostra un avviso e lo installa dopo l'avviso»; (Debian e Ubuntu): «non è firmato» |
| 23 | Regola: `curl` serve allo scarico della voce; i pacchetti lo chiedono **[cambia]** | B «Che cosa serve» (con l'archivio può mancare); D, l'errore «Per scaricare la voce serve il programma curl» |
| 24 | Regola: i comandi si copiano come sono | come 9 |
| 25 | Esito: Kalliope si apre, ha la voce, dice «Pronta», «Kalliope» fra i microfoni | D ed E; il primo schermo lo mostra in breve (ricostruzione, tempi accelerati) |
| 26 | Errore: distribuzione o glibc troppo vecchie | C «Se non è andata»: «mancano dipendenze» o un messaggio su GLIBC → controlla glibc (comando di B) |
| 27 | Errore: PipeWire assente o solo PulseAudio | D: la frase «La voce è pronta, ma …: per ora nessuno ti sentirà nelle chiamate.» (la causa compare in inglese) → spiegazione nella pagina Aiuto (`../aiuto/#f-senza-microfono`); E: «Kalliope» non compare fra le righe → la stessa spiegazione |
| 28 | Errore: `curl` assente **[cambia]** | D: la frase della finestra e l'azione (installare curl con il gestore dei pacchetti, poi di nuovo «Scarica la voce») |
| 29 | Errore: rete assente o interrotta (lo scarico si ripete da capo) **[cambia]** | D: «Download non riuscito: …» → di nuovo «Scarica la voce», riparte da capo |
| 30 | Errore: impronta non corrispondente (file scartato, si riprova) **[cambia]** | D: «Il file … scaricato non corrisponde all'impronta attesa: l'ho scartato.» → di nuovo «Scarica la voce» |
| 31 | Errore: avviso di `dnf` sulla firma | C (Fedora), come 22: è previsto, non è un errore |
| 32 | Ultima via: la segnalazione (P9) | E: «Se un passo non va» con le segnalazioni su GitHub (serve un account), che cosa scrivere (distribuzione, versione di PipeWire, che cosa è successo, la frase della finestra) e di non incollare le frasi dette; B, C: «segnalalo» nei loro «Se non è andata» |
| 33 | Perché serve: è il punto in cui si perde chi non è tecnico | ogni passo dice come sai che è andata bene e che cosa fare se no; la ripresa in E |

## Dalla pagina di prima (fatti della 0.1-rc.1), e dagli altri punti del documento

| # | Voce | Fonte | Dove sta |
|---|---|---|---|
| 34 | Il file scaricato: nome e dimensione come sul pulsante | pagina di prima, passo 1 | B «Come sai che è andata bene» |
| 35 | Se il file non esiste più: la versione può essere cambiata, riparti da questa pagina | pagina di prima | B «Se non è andata» |
| 36 | Il controllo serve a essere sicuri che il file sia quello pubblicato; apri il terminale nella cartella dei download | pagina di prima, passo 2 | B |
| 37 | Il numero diverso: non installare, riscarica, rifai il controllo; se resta diverso, segnalalo | pagina di prima | B «Se non è andata» |
| 38 | Arch: il controllo lo fa la ricetta | pagina di prima | B (variante Arch) |
| 39 | Questa versione non ha l'attestazione di provenienza (`gh attestation verify`): pubblicata quando il repository era privato; le successive l'avranno **[cambia]** | pagina di prima; `releasing.md`; P7 | B, nota sotto il controllo; rimando a «Stato e limiti» per la provenienza |
| 40 | Per i pacchetti il computer chiede la password di amministratore; l'archivio no | pagina di prima; `progetto.md` §7 «Cosa si modifica» | C, «dove va»: con il pacchetto in `/usr`, con la password; con l'archivio in `~/.local`, solo per te, senza |
| 41 | Nulla fuori dalle sue cartelle | `progetto.md` §7 | C |
| 42 | AUR: non ancora pubblicata, si usa la ricetta della versione | pagina di prima; `releasing.md` | C (Arch) |
| 43 | `kalliope --version` risponde; con l'archivio, se il comando non si trova: `~/.local/bin/kalliope --version` | pagina di prima; `install` della 0.1-rc.1 | C «Come sai che è andata bene». **Risolta (3c-b)**: il programma risponde `kalliope X.Y` (`crates/app/src/main.rs`, `version()`: la versione di Cargo senza il «.0» finale; 0.1.0 → «0.1»); **provato sul pacchetto vero** della 0.1-rc.1 (sha256 uguale a quello della release): `bin/kalliope --version` → `kalliope 0.1`. La pagina non scrive il numero a mano: `{{kalliope.program.version}}` (`tools/site.py`, dal tag della versione offerta: vX.Y o vX.Y-prova → X.Y), con la prova in `tools/test_translations.py` (classe `VersioneDelProgramma`, che controlla anche che il sorgente del programma dica ancora la versione a quel modo). La riga del terminale e «Riuscito se» dicono `kalliope 0.1` |
| 44 | `./install` scrive «Kalliope is installed in … Start it from the applications menu.» (in inglese) | `packaging/linux/install` a `v0.1-rc.1` | C, scena (variante archivio): la riga vera, in inglese, come la legge chi installa. **Corretta (3c-b)**: lo script scrive il percorso vero (`$prefix`, cioè `/home/…/.local`) e, se `~/.local/bin` non è in `PATH`, una seconda riga: provato in una casa di prova. Nella scena la cartella di casa è una pillola sbiadita (dipende dal computer di chi installa, come le altre righe sbiadite) e dopo c'è `/.local`; la seconda riga non c'è (dipende dal computer): ciò che serve lo dice il testo («Se il comando non si trova…») |
| 45 | Per togliere: `sudo apt remove kalliope`, `sudo dnf remove kalliope`, `sudo pacman -R kalliope-bin`, `./install --remove` | pagina di prima | C, «Per togliere Kalliope» (a richiesta) |
| 46 | Preferenze e voce scaricata restano: `~/.config/kalliope`, `~/.local/share/kalliope` (la voce, 53 MB) **[cambia]** | pagina di prima; `install` a `v0.1-rc.1` («your settings and the downloaded voice stay») | C, «Per togliere Kalliope». **Risolta (3c-b), frase scelta**: «Nella tua cartella personale restano le preferenze, `~/.config/kalliope`, e la voce scaricata, `~/.local/share/kalliope` (53 MB): né il gestore dei pacchetti né `./install --remove` le toccano. Per toglierle, cancella le due cartelle.» e, sotto: «Come lo sappiamo: i pacchetti hanno soltanto file in /usr e nessuno script, e `./install --remove` cancella soltanto i file messi da `./install` (provato in una cartella di prova). Togliere il pacchetto con apt, dnf o pacman su un computer vero non l'abbiamo provato.» **Fonti, tutte sui file pubblicati della 0.1-rc.1** (scaricati, sha256 uguali a quelli della release): (1) `.deb`: `DEBIAN/` ha solo `control` e `md5sums` (nessuno script), 13 file tutti sotto `usr/`; (2) `.rpm`: letta l'intestazione (`leggi-rpm.py`): nessuno script (prein, postin, preun, postun, pretrans, posttrans: nessuno) e 17 voci tutte sotto `/usr`; (3) `PKGBUILD`: nessun `install=`, installa solo in `$pkgdir/usr`; (4) archivio: `./install --remove` provato con `HOME` in una cartella di prova con preferenze e voce finte: cancella `bin/kalliope`, `bin/kalliope-cli`, `lib/kalliope`, il `.desktop`, l'icona, il `metainfo`, `share/doc/kalliope`; **restano** `~/.config/kalliope/settings.conf` e `~/.local/share/kalliope/models/…` (più le cartelle vuote); (5) dove il programma scrive: `crates/app/src/paths.rs`, `catalog.rs` (`data_dir()/models/klein-tts-x1.5-pro`, la voce) e `settings.rs` (`config_dir()/settings.conf`); non scrive altrove (`create_dir_all` e `fs::write` solo in `download.rs` e `settings.rs`). **Non verificato**: togliere il pacchetto con `apt`, `dnf` o `pacman` (servono i permessi di amministratore: la frase lo dice). **Lasciato fuori dalla pagina**: se `XDG_DATA_HOME` o `XDG_CONFIG_HOME` sono impostate le due cartelle stanno altrove (`paths.rs`); il file scaricato e la cartella dell'archivio o di makepkg restano dove la persona li ha messi |
| 47 | La finestra dice «Preparo la voce…» a ogni avvio; il campo si accende quando ha finito | pagina di prima; `progetto.md` §2.4, §7 «Attese» | D (la durata non è misurata: non si dice) |
| 48 | Ogni frase della finestra ha la sua spiegazione nella pagina Aiuto | pagina di prima | D: «Se la finestra dice altro» → `../aiuto/` (la pagina Aiuto non è ancora rifatta) |
| 49 | `pactl list short sources`: fra le righe una contiene `kalliope`; Kalliope deve essere aperto | pagina di prima, passo 5; il nome del nodo è «kalliope» (`crates/mic`) | E |
| 50 | Se `pactl` non c'è, salta: lo vedrai nell'app della riunione | pagina di prima | E |
| 51 | Ripresa: «Il sito non salva nulla: da dove riprendere» (file, numero, `--version`, «Pronta», microfono, tutto a posto) | pagina di prima | E, «Se ti sei fermato»: la strada dei cinque passi, ognuno con il suo segno e il suo collegamento |
| 52 | Indirizzo della pagina da inoltrare a chi installerà | pagina di prima; `progetto.md` §4.3 («fornire loro la pagina»), F2 | A, secondo comando («Lo installa un'altra persona?») → E, «Copia l'indirizzo» con le sue due risposte |
| 53 | Avanti: «Usalo in una riunione»; indietro: «Stato e limiti» | pagina di prima | E: «Usalo in una riunione» è il comando della chiusura; «Stato e limiti» dallo stato «Oggi:» del primo schermo e dal menu |
| 54 | Chi non ha Linux (Windows, macOS) | pagina di prima (avviso per sistema); `progetto.md` §4.3 «se non ce l'hai, dillo subito» | A, accanto alla scelta: «Non uso Linux» → `../non-ancora/` |
| 55 | Il telefono | decisione del 17/11 | **lasciata fuori**: la pagina non dice «non ancora» per il telefono (decisione del proprietario); chi legge dal telefono trova il comando per mandare la pagina a chi installa (52) |
| 56 | Ogni pacchetto è provato da uno script: si installa, Kalliope dice una frase con la voce, si toglie | `releasing.md`; «stato» | C, una riga sotto i comandi, con il rimando a «Stato e limiti» |
| 57 | Non ancora provata in una riunione vera | P1, §9; stato di ogni pagina | A, stato «Oggi:» |
| 58 | Wayland o X11 | `progetto.md` §6 | B «Che cosa serve», in breve |
| 59 | Il nome del microfono è «Kalliope», identico | `progetto.md` §5 | ovunque |
| 60 | Le frasi della finestra citate come sono | `progetto.md` §5, §2.4 | D, E, scena: testi di `main.rs` e `download.rs` a `v0.1-rc.1` |
| 61 | `kalliope --say TESTO` parla nel microfono senza finestra | `progetto.md` §1.2 | **rimandata a** «In riunione» (serve con la prova del microfono dell'app: senza un'app che ascolta il suono si perde, §1.4) |
| 62 | Scegliere «Kalliope» nell'app della riunione (Zoom → Impostazioni → Audio → Microfono; le altre app non documentate) | P5 | **rimandata a** «In riunione»; qui solo la riunione ricostruita con la scelta nella barra del microfono, dichiarata come ricostruzione |
| 63 | «Nessuna chiamata sta usando il microfono «Kalliope»…» | §2.4 | **rimandata a** «In riunione» e «Aiuto» (è uno stato dell'uso, non dell'installazione) |
| 64 | Licenze, impronte e provenienza per chi controlla | P7 | in breve qui (impronte in B, attestazione 39); il resto **rimandato a** «Stato e limiti» |
| 65 | Il dubbio F («non è un dispositivo medico…») | §12 | **lasciata fuori** da questa pagina: non riguarda l'installazione (è nella home) |

## [cambia] · i quattro punti da cambiare con la prossima versione

1. **B, «Che cosa serve»**: le righe «Il programma curl» e «Internet, una volta sola, per scaricare la voce (53 MB)». Con la voce nel
   pacchetto: via tutte e due (e con loro l'eccezione «con l'archivio può mancare»).
2. **D, il primo avvio**: lo stato «Per parlare, Kalliope deve scaricare la voce: 53 MB…», «Scarica la voce», «Scarico la voce… N di 53 MB»
   con «Annulla», e i quattro errori dello scarico (curl, non riuscito, annullato, impronta). Con la voce nel pacchetto resta «Preparo la
   voce…» → «Pronta»; il tratto resta, più corto. Nella scena del primo schermo non c'è nulla da cambiare.
3. **C, «Per togliere Kalliope»**: i due paragrafi «Nella tua cartella personale restano… la voce scaricata, `~/.local/share/kalliope` (53 MB)» e «Come lo sappiamo…» (che i pacchetti non toccano la cartella personale vale per i pacchetti della 0.1-rc.1: con la voce dentro il pacchetto va riscritto e riverificato).
4. **B, la nota sull'attestazione**: «questa versione non ce l'ha» (dalla prossima c'è: `releasing.md`).

Fuori da questi punti la pagina non nomina la voce da scaricare. «kalliope 0.1» (voce 43) lo scrive la costruzione (`{{kalliope.program.version}}`).
