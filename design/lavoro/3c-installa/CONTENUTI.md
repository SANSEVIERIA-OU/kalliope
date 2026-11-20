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
| 19 | Arch: `kalliope-bin.PKGBUILD` salvato come `PKGBUILD`, poi `makepkg -si` | C (Arch): `mkdir kalliope && cd kalliope`, `curl -L -o PKGBUILD {{kalliope.aur.url}}`, `makepkg -si` (come la pagina di prima: la ricetta scarica da sé l'archivio; `progetto.md` dice «vicino al .tar.gz», la ricetta della 0.1-rc.1 lo scarica dal suo `source=`). A: per Arch la pillola apre la ricetta da leggere |
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
| 43 | `kalliope --version` risponde; con l'archivio, se il comando non si trova: `~/.local/bin/kalliope --version` (`~/.local/bin` può non essere nel percorso dei comandi) | pagina di prima; `install` della 0.1-rc.1 (lo dice anche lui) | C «Come sai che è andata bene». La 0.1-rc.1 risponde «kalliope 0.1» (la versione di Cargo, 0.1.0, senza «-rc.1»): la pagina non scrive il numero a mano, dice «una riga che comincia con kalliope e il numero della versione», e la scena mostra «kalliope» e il numero come riga del tuo computer. **Da chiedere** a chi coordina: un segnaposto per ciò che il programma risponde |
| 44 | `./install` scrive «Kalliope is installed in … Start it from the applications menu.» (in inglese) | `packaging/linux/install` a `v0.1-rc.1` | C, scena (variante archivio): la riga vera, in inglese, come la legge chi installa (P5: «il testo citato è quello che la persona legge davvero») |
| 45 | Per togliere: `sudo apt remove kalliope`, `sudo dnf remove kalliope`, `sudo pacman -R kalliope-bin`, `./install --remove` | pagina di prima | C, «Per togliere Kalliope» (a richiesta) |
| 46 | Preferenze e voce scaricata restano: `~/.config/kalliope`, `~/.local/share/kalliope` (la voce, 53 MB) **[cambia]** | pagina di prima; `install` a `v0.1-rc.1` («your settings and the downloaded voice stay») | C, «Per togliere Kalliope». **Discrepanza** con «stato» («se così si toglie anche la voce scaricata, non l'abbiamo verificato») e con `progetto.md` §7 («non verificato»): lo script dell'archivio lo dice; per i pacchetti è il modo in cui lavorano i gestori dei pacchetti, non una prova. Da chiedere a chi coordina quale delle due frasi tenere |
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
3. **C, «Per togliere Kalliope»**: «la voce scaricata» e `~/.local/share/kalliope (la voce, 53 MB)`.
4. **B, la nota sull'attestazione**: «questa versione non ce l'ha» (dalla prossima c'è: `releasing.md`).

Fuori da questi punti la pagina non nomina la voce da scaricare. «kalliope 0.1» (voce 43) non è scritto in pagina.
