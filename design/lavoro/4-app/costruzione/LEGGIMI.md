# Costruzione della finestra «La frase che si accende» (26/11/2026)

Ruolo di costruzione (design-system-generator, `references/direzione.md` §6): la direzione approvata dal proprietario il 26/11/2026 («per me va tutto bene») collegata al motore vero e completata in ogni stato,
senza ridisegnarla. Ramo `direzione-finestra`, commit `89bf1a5`, `684ab0e` e il successivo. Prove (foto, video, log, misure, script) in
`materiali-locali/costruzione-prove/` (ignorata da git); le personas in `materiali-locali/costruzione-personas.md`; il diario in `materiali-locali/costruzione-progresso.md`.
La cartella `direzione/` non è stata toccata: è il termine di confronto.

## Che cosa è collegato

| Parte | Come | Dove |
|---|---|---|
| Parole accese dai pezzi veri | `Status.sounding` (span, durata, esatto) distribuisce il tempo del pezzo sulle sue parole per lunghezza, con la pausa di fine clausola (2) e di fine frase (10); dopo Ferma restano scuri i pezzi detti e la parte sentita del pezzo tagliato (`Status.interrupted`). Sostituisce il «0,36 s a parola» | `crates/app/src/avanzamento.rs` (puro, 9 test), `collega.rs` |
| Stati del motore | pronta, prepara, parla, nessuno ti sente, manca il microfono, la voce non parte; ogni problema ha «Come si risolve» (in raccolta «Aiuto») | `session.rs` (`Status::situation`), `finestra.slint` |
| «Come si risolve» | l'indirizzo è costruito dalla situazione, da una sola base: `riunione/#non-mi-sentono`, `riunione/#non-compare`, `installa/#installa`, `riunione/#f-errori` (contratto del coordinatore; i quattro punti esistono sul sito pubblicato) | `crates/app/src/guida.rs` (2 test) |
| Cronologia | letta all'avvio, aggiornata a ogni frase, «Svuota la cronologia» in «Altro» con domanda («Annulla» ha il fuoco, `Esc` annulla) | `collega.rs`, `modali.slint` (`Conferma`) |
| Testo regolabile | A−/A+, `Ctrl+più` (anche `Ctrl+=`), `Ctrl+meno`, `Ctrl+0`; salvato; in modalità riunione la finestra cresce con il testo (400 × 320 × scala) | `finestra.slint`, `vista.rs`, `settings.rs` |
| Modalità riunione | ricordata fra un avvio e l'altro; `always-on-top: root.compatta`; sotto Wayland (`WAYLAND_DISPLAY`, a meno di X11 forzato) il consiglio «Alt+Spazio, poi «Sempre in primo piano»» si mostra una volta e «Ho capito» lo ricorda (`hint_seen`); il fuoco va alla scrittura quando si entra e si esce | `collega.rs` (`primo_piano_negato`, 2 test), `settings.rs` |
| «Crea la tua voce» | registra (microfono scelto se ce n'è più d'uno, livello vivo, cerchio dei dodici secondi dai secondi di voce, fermare, annullare, suggerimenti se non si sente la voce o è troppo forte), importa da file, tratti candidati con «Ascolta», controllo del nome (Giulia/Marco → «Tieni questo nome», già usato → «Sostituisci la voce», vuoto), permesso, creazione con avanzamento e «Annulla», la voce nuova si sceglie da sola e la riga di stato la annuncia | `crea.rs` (puro, 13 test), `collega.rs`, `creazione.slint` (global), `voce-propria.slint`, `avvisi.slint` |
| Scelta del file | finestra del sistema: portale XDG su Linux (`rfd` 0.18.0 carica libdbus a run time), zenity se il portale non c'è, finestre standard su Windows e macOS; filtro audio e video (anche `.opus .oga .m4a .mp4 .webm`, anche in maiuscolo) e «Tutti i file»; la finestra madre è la nostra; su un thread a parte; se torna subito senza niente non si è aperta e lo dice | `collega.rs` (`choose_file`, `extensions`) |
| «Informazioni» | versione, la frase sulla riservatezza, «Il sito di Kalliope», i riconoscimenti (Klein Apache-2.0, ONNX Runtime MIT, Wiktionary CC BY-SA 4.0, Pocket TTS di Kyutai CC BY 4.0 con il percorso del NOTICE, Skia BSD-3-Clause, symphonia MPL-2.0, libopus BSD-3-Clause) e **`AboutSlint`** (licenza di Slint §2, decisione del proprietario, #21); `Tab` gira dentro, `Esc` e il clic fuori chiudono, le frecce e `PagInGiù` scorrono, il fuoco torna su «Altro» | `modali.slint` |
| Testi | ogni stringa nuova dei `.slint` è `@tr(...)`; non tradotti | tutti i `.slint` |

## Scelta del file: `rfd` 0.18.0 contro `ashpd` 0.14.3 (verificate oggi su crates.io: 7/11 e 21/11)

| | `rfd` 0.18.0 | `ashpd` 0.14.3 |
|---|---|---|
| Sistemi | Linux (portale o zenity), Windows, macOS: una sola API per la nostra finestra unica | solo Linux |
| Peso | 3 pacchetti nuovi in `Cargo.lock` (`rfd`, `pollster`, uno di macOS): l'albero di Slint ha già Wayland | 54 pacchetti, di cui 31 già nostri: circa 23 nuovi, più un runtime asincrono (`tokio`) |
| Portale assente | zenity (provato sul binario: `zenity --file-selection` con i nostri filtri) | un errore, e il ripiego sarebbe da scrivere |
| Finestra madre | `set_parent` con l'handle di Slint (feature `raw-window-handle-06`): il portale riceve `x11:200003` (provato) | `WindowIdentifier::from_raw_handle` |
Scelta: `rfd`. La prova è sul binario: il portale finto (`tools/portale_finto.py --scegli`) ha ricevuto la chiamata vera (`log/portale-opus.json`), il file è entrato e la voce è nata; senza portale è partito zenity.
Cautele: il filtro del portale confronta i nomi come scritti (si offrono minuscole e maiuscole); `FileDialog` va su un thread suo perché la chiamata del portale blocca.

## Differenze volute dalla direzione approvata, una per una

| Differenza | Perché |
|---|---|
| Il fuoco entra da solo sulla prima scelta di ogni passo, con il suo anello | chi usa la sola tastiera (persona 1) non deve cercarlo; coerente con la scrittura, che ha il fuoco all'apertura |
| Il tondo «registra» ha l'anello del fuoco **fuori**, non cambiando il bordo | altrimenti nascondeva l'arco dei dodici secondi (stesso verde acqua) |
| Passo «Registra»: «Annulla» mentre si registra; scelta del microfono solo se ce n'è più d'uno; riga di consiglio se non si sente la voce | senza, una registrazione sbagliata non ha uscita; il resto è verità sul microfono |
| Passo «Ascolta e dai un nome»: elenco di tratti quando sono più d'uno; il pulsante spento dice perché; «Ascolta» attivo anche se da quel tratto non si può creare la voce | la ricerca di #16 dà fino a tre tratti; un grigio senza motivo non aiuta chi sbaglia |
| «Crea la voce» ha avanzamento e «Annulla»; la voce nuova si sceglie e la riga di stato dice «Voce nuova» per dieci secondi al posto del consiglio | il lavoro dura alcuni secondi; la notizia non toglie altezza alla cronologia |
| «Informazioni» non è più una finestra a comparsa di Slint ma un pannello dentro la finestra, con velo (stesso aspetto), riconoscimenti che scorrono e il sito | la finestra a comparsa non teneva `Esc` e `Tab`; serve il widget di Slint e un elenco più lungo |
| Domanda prima di svuotare la cronologia | un gesto che non si disfa |
| Il consiglio «Alt+Spazio» solo sotto Wayland, una volta | su X11, Windows e macOS la finestra chiede al sistema di restare sopra |
| La finestra della riunione cresce con il testo | a 150% in 400 × 320 non ci stava (punto debole della direzione) |
| La riga della frase, a riposo in raccolta, mostra l'inizio | scorreva fino alla fine anche a frase finita |
| «Aiuto» al posto di «Come si risolve» in raccolta | «Intera» era tagliata a 400 px |
| A Invio la bolla vecchia si sfuma sul posto (ritardo della nuova: `--app-ritardo-bolla` 110 ms) | punto debole della direzione: il cambio in un fotogramma |
| «Nessuno ti sente» ecc. non cambiano; le parole accese seguono i pezzi, non una stima | la frase vera |

Confronto con le foto approvate (`direzione-finestra-prove/foto2/`, 920 × 640, tolleranza 6%): vuota, scrive, cronologia, microfono, problema: 0–0,02% di pixel diversi (il cursore);
parla e nessuno: 0,2–0,3% (la sfumatura della parola); i passi della voce: cambiano solo ciò che sta sopra (anello del fuoco, testo dei formati, «Annulla»).

## Misure (binario di rilascio `target-direzione`, Xvfb senza GPU, 12 core)

| | Costruzione | Riferimento |
|---|---|---|
| Binario | 24,07 MB | 21,29 MB (direzione) |
| RAM a riposo, demo (senza modelli) | 28 MB | 23 MB (`finestra-unica-prove`, skia-software) |
| RAM a riposo, motore vero con i modelli | 136 MB (Pss 121 MB), 13 thread | — (il motore non c'era) |
| CPU a riposo, 20 s, finestra con il fuoco | demo 0,2% di un core, vero 0,3% | 0,15% (skia-software, senza fuoco), 0,9–1,0% (skia GPU) |
| CPU mentre parla la voce vera, 14 s | 9,1% di un core: voce 5,9%, finestra (barre e bolla) 3,1% | — |
| CPU della sola animazione (barre, anello, `--demo parla`), 20 s | 3,35% di un core | 8,1% (animazione continua, skia-software, finestra unica) |
| Picco di RAM parlando | 261 MB, a riposo di nuovo 143 MB | — |
| Avvio fino alla finestra | circa 0,1–0,5 s con dbus e portale finto dentro (la misura comprende circa 300 ms di banco) | 137 ms (finestra unica) |
Misure grezze in `costruzione-prove/misure/*.txt`.

Sincronia delle parole con la voce (`strumenti/sync2.py`: il log dell'app e l'audio di «kalliope» con l'orologio di sistema, le parole di Whisper):
- Giulia, frase mai usata per tarare i pesi: inizio previsto di ogni parola **sbaglia in media 0,10 s** (massimo 0,25 s, scarto medio +0,001 s); con i pesi di prima (pausa di 2 lettere ovunque) sbagliava 0,23 s (massimo 0,51).
- Dall'annuncio del pezzo al fotogramma in cui la prima parola è più scura che chiara: 0,125–0,143 s (la sfumatura dura 0,2 s: metà più un fotogramma).
- **Voce propria (Pocket TTS): scarto da −0,64 a +0,74 s** (due prove con frasi diverse: −0,37 s e +0,2 s in media). Il motore annuncia il primo pezzo di una voce che trasmette *quando comincia a sintetizzare*, non quando il suono arriva
  (la prima parola è sentita da 0,3 s dopo a 0,3 s prima dell'annuncio, a seconda della prova) e la durata è prima una stima, poi esatta. Una costante di compenso non regge (provata e tolta). **Da correggere nel motore** (annunciare al primo suono riprodotto): lo scrivo al coordinatore.

Movimenti toccati (`movimento-visibile.mjs`, video del gesto, zona della cronologia e della bolla):
- Passaggio a Invio (finestra intera, motore vero): prima 1800 ms visibili, 37% «salta di colpo», 56% coperto o spostato, metà del cambiamento entro 67 ms; dopo (la vecchia si sfuma sul posto, la nuova nasce 110 ms dopo)
  700–1300 ms visibili secondo la frase, salta di colpo 36–50%, metà entro 134 ms. **La misura non migliora quanto l'occhio**: la bolla vecchia non sparisce più in un fotogramma, ma quando la frase nuova ha un'altezza diversa la riga di stato sale in un fotogramma
  (`foto/ig-*.png`). Resta debole, ed è detto.
- «Informazioni» si apre e si chiude con il velo che sfuma e il pannello che scende di poco: 233 ms visibili in apertura, 200 in chiusura (`misure/info-apri-chiudi`).
- Parole accese: sfumatura di 200 ms per parola, aggiornata a un fotogramma (16 ms); a riposo nessun lavoro.
- Passi della voce, avanzamento: la barra riempie in 200 ms (`durata-scurisce`); nessun altro movimento nuovo.
- Cambio di modalità: istantaneo (la finestra cambia misura per il sistema).

## Che cosa non è provato, e che cosa resta aperto

- **Voce propria**: parole accese ±0,4–0,7 s rispetto al suono (motore, sopra).
- **Sempre in primo piano**: la proprietà è impostata ma non verificata (qui nessun gestore delle finestre; Wayland non ha il protocollo, verificato il consiglio su un weston con socket mio).
- **Posizione della finestra** (#17): non si ricorda; senza la geometria dello schermo una posizione salvata fuori da un monitor staccato perde la finestra.
- Windows e macOS non provati (finestre di scelta del file, `always-on-top`): lo dirà la CI.
- Ripiego zenity provato su Xvfb senza gestore delle finestre (il dialogo non è figlio della nostra finestra).
- Con tre tratti a 920 × 640 «Crea la voce» sta sotto la piega; con la tastiera `Tab` la porta in vista; con il mouse serve la rotella. Proposta: il pulsante fisso in fondo quando il passo trabocca.
- Nelle liste a scelta (microfoni, tratti) le frecce non spostano la scelta (si va con `Tab` e `Spazio`).
- Messaggio «Questo file non è un audio…» troppo lungo per chi legge piano (`crates/sample`, condiviso con la riga di comando).
- Il clic fuori da un menu lo chiude e non passa sotto (direzione).
- Provato dal binario ma non da una persona: tutto ciò che sta in `costruzione-personas.md`; il proprietario vede la finestra finita prima del rilascio.
- Test e strumenti aggiunti: `KALLIOPE_AVANZAMENTO=1` (traccia con l'orologio di sistema), `KALLIOPE_SENZA_PRIMO_PIANO=1` (si comporta come sotto Wayland), `KALLIOPE_DEMO_FOTO=file.ppm` (la finestra di prova si fotografa da sola),
  `tools/portale_finto.py --scegli FILE|@CONTROLLO --annulla --ritardo --registro` (risponde a `FileChooser.OpenFile`, 5 test).

## Impronte e verifiche sugli stessi file finali

- Ramo `direzione-finestra`, commit `6639bef` (sopra `c57d0cd`, 4 commit di costruzione). Albero `crates/ design-system/ tools/ Cargo.toml Cargo.lock`: sha256 `a2dd666f49770fa4…`. Binario di rilascio `target-direzione/release/kalliope`: sha256 `c3c746345701deae…`.
- `cargo fmt --all -- --check` pulito; `cargo clippy --workspace --all-targets -- -D warnings` pulito; `cargo test --workspace` con i modelli: verde (73 test nell'app, 11 in `kalliope-mic`, 14+9 nei token, 19+2+3 nella voce, 6+5 in `kalliope-sample`, e gli altri);
  `python3 -I -m unittest discover -s tools -p 'test_*.py'`: 214 test, verde; `tools/slint_valori.py`: nessun valore scritto a mano.
- Misure rifatte sul binario finale (`costruzione-prove/misure/finale-*.txt`): demo a riposo 28 MB e 0,25% di un core; motore vero a riposo 135 MB e 0,4%; parlando per 20 s 6,8% di un core (voce 4,4%, finestra 2,4%), picco 247 MB, a riposo di nuovo 136 MB.
  (Le prove con la tastiera e le foto sono state fatte sui binari intermedi, di cui l'ultimo cambia dal finale solo per le correzioni descritte nei commit `684ab0e` e successivo, ripetute a mano sul binario rapido: fuoco dopo «Riunione», «Aiuto», scorrimento dei riconoscimenti, «ne mancano» a capo.)
- Test che falliscono sulla copia di prima: `a_name_of_only_spaces…` (nome valido, vedi `crea.rs`), `a_missing_or_forbidden_file_is_explained_without_the_system_s_english`, `what_a_killed_kalliope_left_goes_at_the_next_start_and_what_runs_stays`,
  `the_extensions_offered_to_the_chooser_cover_the_formats_in_both_cases`, `only_a_wayland_session_leaves_staying_on_top_to_the_person`, i nove di `avanzamento.rs`, i tredici di `crea.rs`, i due di `guida.rs`, i cinque di `tools/test_portale_finto.py`.

## Dove sono le prove (in `materiali-locali/costruzione-prove/`, ignorata da git)

- Video: `video/crea-voce-tastiera.mp4` (tutta la creazione della voce con la sola tastiera, 52 s), `video/e2e1-parla.mp4` (frase detta con le parole accese), `video/giulia2-sync.mkv` e `video/propria2-sync.mkv` (schermo con l'orologio di sistema),
  `video/invio-prima.mp4` e `invio-dopo*.mp4` (il passaggio a Invio), `video/info-apri-chiudi.mp4`; misure in `misure/`.
- Foto: `foto/m-SCENA-MISURA-TESTO-TEMA.png` (84 scene demo: 920 × 640 chiaro e scuro; 360 × 320, 1600 × 1000, 150% e 175% per le scene principali), `foto/aff/` (accanto alle approvate), e le foto dei giri con il motore vero (`k*`, `rec-*`, `n*`, `c*`, `imp-*`, `zen1-*`, `p7*`, `mic2-*`, `comp1/2-*`, `info1-*`, `guida-*`).
- Strumenti: `strumenti/` (`banco.sh`, `app.sh`, `foto.sh`, `matrice.sh`, `sync2.py`, `adatta-pesi.py`, `misura.sh`, `crea-gui.sh`, `crea-import.sh`, `wayland.sh`…).
- Scene demo (`kalliope --demo SCENA`): vuota, prepara, scrive, parla, cronologia, nessuno, microfono, problema, compatta, compatta-parla, notizia, info, conferma, voce-1, voce-mic, voce-2, voce-suggerimento, voce-3, voce-tratti, voce-nome, voce-crea, voce-errore, voce-importa, grande.
- Rimasti i testi del programma scritti in Rust (riga di stato, controlli del nome, consigli della registrazione): sono italiano scritto nel codice, non passano da `@tr`; per le traduzioni servirà un passo suo.

## Giro di correzioni dopo il giudizio della costruzione (27/11/2026)

Giudizio: `design/lavoro/4-app/giudizio/giudizio-costruzione.md` (nessun difetto bloccante; il primo schermo è identico alla scelta). Un giro, alla causa, con prove. Non si è toccato `engine.rs`
(l'annuncio dei pezzi è del ramo `sincronia`). Prove in `materiali-locali/costruzione-prove/` (`foto/n-*`: la matrice rifatta alle stesse misure e agli stessi temi; `video/`, `misure/`, `log/`).

| Punto del giudizio | Causa | Correzione | Prova |
|---|---|---|---|
| **I-1** la cronologia taglia le frasi | l'elenco scorreva «in fondo» con un legame (`content-y: …`) che si perde alla prima mossa (la rotella, un Tab che passa sopra una frase: `ensure-visible`); in più la cronologia, più bassa di una bolla, ne mostrava un pezzo | l'elenco torna in fondo **a mano** quando cambiano le frasi o lo spazio e quando il fuoco torna alla scrittura; l'altezza della frase più recente si misura su una copia mai vista e, dove la finestra è alta abbastanza, la cronologia tiene lo spazio di quella frase intera; dove non c'è posto per una bolla intera l'elenco non si mostra; il contorno della bolla vuota si mostra intero o per niente | `foto/ri1-1`…`ri1-6` (tre frasi di due righe, `Maiusc+Tab`, ripeti, 640 × 480, 800 × 520), `foto/n-cronologia-lunga-*`, `foto/vz-vuota-*` |
| **I-2** a testo grande un clic in basso nella scrittura si perde | il riquadro prendeva il clic solo nel campo di testo e nei comandi; i margini e la striscia dei comandi non facevano niente | un `TouchArea` sotto tutto il resto dà il fuoco al campo da tutto il riquadro tratteggiato | `foto/clic1-0`…`clic1-4` (100, 125, 150, 175, 200%: il testo battuto compare); `tools/controlla_finestra.py`: fallisce sul binario del giudizio, passa sul corretto |
| **I-3** «Crea la voce» sotto la piega | il pulsante stava in fondo ai pezzi che scorrono | un piede: il pulsante, il perché è spento e l'errore dell'ultimo gesto stanno sotto i pezzi quando entrano, e fissi in fondo alla finestra, sopra un filo e un bordo che sfuma, quando non entrano; la misura è fatta senza il piede, così non può cambiare la propria causa; «Rifai» sta accanto alla frase; i tre passi a testo grande passano a «3 di 3 · …» più presto | `foto/f2-voce-tratti-1.5.png`, `foto/n-voce-tratti-*`; il passo con un tratto è tornato uguale all'approvato (0,27% di pixel diversi, solo l'anello del fuoco) |
| M-1 la prima frase fa cadere la scrittura di 62 px in un fotogramma | il posto della bolla si apriva di colpo (e la riga di stato cambiava altezza di colpo) | il posto della bolla cresce con la frase (520 ms, dopo 110 ms) e la riga di stato cambia altezza con la stessa curva; non all'avvio | `strumenti/salto.py`: **prima 62 px in 1 fotogramma; dopo 9 px al massimo per fotogramma, in 17 fotogrammi (560 ms)**; `video/salto-prima.mp4`, `salto-dopo4.mp4` |
| M-2 a 200% il riquadro tocca il fondo | la somma delle parti non entrava in una finestra bassa; la bolla di tre righe e lo stato su cinque righe (640 px di larghezza) | a 200% la frase va su una riga in una finestra non alta; la riga di stato va «impilata» (titolo sopra, parole sotto) fino a 840 px di larghezza; sotto 640 px la frase è su una riga un quinto prima | `tools/controlla_finestra.py`: margine ≥ 12 px a 640/800/920 × 420–580 e a 200%; `foto/sw3-nessuno-*` |
| M-3 dopo «Svuota la cronologia» lo stato parla ancora di «la frase» | il testo del motore nomina la frase | senza frasi nella finestra la riga dice «Nessuna app sta usando il microfono «Kalliope». Sceglilo come microfono nell'app della riunione.» (`Status::text_without_phrase`, test) | `foto/m34-2-dopo-svuota.png` |
| M-4 ↑ mette il cursore all'inizio | — | il cursore va in fondo (`set-selection-offsets`) | `foto/m34-1-su-cursore-in-fondo.png` («Buongiorno a tuttiX») |
| M-5 le frecce nelle liste a scelta | — | ↑ ↓ spostano il fuoco e la scelta nei microfoni e nei tratti (dove si può creare la voce) | `foto/fr1-1`…`fr1-5` |
| M-6 modelli mancanti: percorsi e nomi di file | — | «Non trovo i file della voce, e senza non posso parlare. Reinstalla Kalliope dal pacchetto.»; la cartella e i nomi vanno su stderr (test) | `foto/m6-senza-modelli.png`, `log/m6.log` |
| M-7 dopo un giro di Tab la cronologia resta sulla frase vecchia | come I-1 | come I-1 | `foto/ri1-4-tab-fuori.png` |
| M-8 «Intera» non dice che cosa fa | — | un segno (una finestra che si apre) davanti alla parola | `foto/f-compatta-nessuno.png` |
| Chiusura di «Crea la tua voce»: i testi delle due schermate si sovrappongono | dissolvenza incrociata di due schermate piene | in sequenza: la prima metà sfuma l'una, la seconda entra l'altra; i testi non sono mai insieme | `video/crea-chiude2.mp4` (fotogrammi 35–37: prima solo la creazione sfumata, poi solo la scrittura) |
| Messaggio «non è un audio» troppo lungo | elenco dei formati | «Questo file non è un audio. Prova con un messaggio vocale, un video o una registrazione.» (14 parole; la riga di comando dice lo stesso; test) | `foto/p7-rumore-a.png` rifatta nella matrice |
| M-9 posizione della finestra | — | resta non fatta, per il motivo dichiarato (nessuna geometria dello schermo in Slint) | — |
| M-10 «Informazioni» dice 0.2 | la riga viene da `CARGO_PKG_VERSION` | nessuna riga a mano: `tools/version.py` cambia la versione del Cargo e la finestra la legge | — |

Non toccato per ordine del coordinatore: `Speaker::say`, `Line::play`, l'araldo e `Line::exact` in `engine.rs` (I-4, le parole della voce propria: ramo `sincronia`).
