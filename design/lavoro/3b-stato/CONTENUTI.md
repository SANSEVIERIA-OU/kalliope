# Che cosa dice la pagina «stato», e che cosa lascia fuori (incarico 3b · direzione.md §6, punto 0)

Scritto prima di rendere. Fonti lette per intero: `design/progetto.md` (12/11/2026, con le decisioni del 16 e del 17/11/2026 che chi
coordina vi ha aggiunto) §0, §1.2, §1.4, §2.1, §2.3, §4.3, §7, §8, §9, §10 P3, P5, P7, P8, P9, §12; la pagina di oggi
`website/stato/index.html` (HEAD `7ad19c0`); per i fatti del programma `README.md` («How it works»), `docs/virtual-microphone.md`,
`docs/releasing.md` (punti 6 e 8, «Not done yet»), `NOTICE`, `THIRD_PARTY_NOTICES.md`, `packaging/linux/` (nessun file di avvio
automatico); le decisioni del proprietario in `design/lavoro/STATO.md` e `CLAUDE.md`. I testi verranno riscritti da capo
(decisione del 16/11): qui conta **dove sta** ogni voce, non la frase. La pagina non inventa funzioni, non promette date e non
consiglia alternative di terzi.

Legenda delle fonti: **P** proprietario · **R** file del programma · **G** release · **M** misura del progetto (un solo computer,
Ryzen 5 PRO 6650U) · **C** coordinatore · **I** inferenza da confermare · **L** nessun dato.
Colonna «Decisione»: **c'è** · **rimandata a** (la voce è di un'altra pagina) · **lasciata fuori** (chi e perché) · **chiedere**.

I tratti della pagina (piano in `PIANO.md`): **A** primo schermo · **B** «Fin dove è provato» (la strada vista da vicino, con le
cifre dove sono state misurate) · **C** «Per chi è, e per chi no» (le domande di chi valuta, la risposta nella bolla) · **D** «Se
devi controllare» (il computer: che cosa ne esce, che cosa ci entra, che cosa resta) · **E** chiusura «Da inoltrare» · **F** piede.

## Lo stato e le prove

| Voce | Fonte | Dove sta nella pagina | Decisione |
|---|---|---|---|
| Versione di prova {{kalliope.version}}, solo Linux x86_64 con PipeWire | §0 P R; §9 «Stato onesto» | A, riga «Oggi:» (frase con le due varianti `data-release`, come «non ancora»); E, nel messaggio da inoltrare | c'è (dati della versione, mai a mano) |
| Provato fino al microfono «Kalliope», con un PipeWire preparato per la prova | §0 P R README; §4.3 «È provato?» | A, il titolo («Provato fino al microfono. In riunione, non ancora.») e la scena (il microfono si accende «provato fin qui»); B, la tappa del microfono, piena | c'è |
| Non ancora provato in una riunione vera con Zoom, Teams o Meet | §0; §7 «Promesse»; §9 | A, titolo, scena (dopo il microfono tutto tratteggiato) e riga «Oggi:»; B, tappa «le app di riunione» tratteggiata | c'è |
| L'installazione è provata da uno script, su Ubuntu 24.04 (apt), Fedora (dnf, in un contenitore), Arch (makepkg) e con l'archivio; per ognuno: si apre, pronuncia una frase con la voce | R `docs/releasing.md` punto 6 | B, nella cornice «Su un solo computer», accanto alla prima tappa: «L'installazione è provata da uno script…» | c'è. La pagina vecchia diceva «Ubuntu 24.04, Fedora e Arch»: corretto con il file (anche l'archivio, e che cosa fa la prova) |
| Parole sbagliate secondo Whisper sulla voce registrata dal microfono, come la sentirebbe una riunione: 2,3% su 10 frasi | R README; §2.3 | B, sotto la tappa del microfono (è lì che è registrata), con la barra «una parola su 43» e la fonte | c'è |
| Circa una parola sbagliata su 45 sui sei campioni del sito | C §2.3 | B, stessa tappa, misura a parte («due misure diverse: non si fondono») | c'è, separata dalla prima |
| Le differenze che restano sono di scrittura («10 e 30» per «10:30», «ancora» per «àncora») | R README | B, nota della stessa tappa | c'è |
| Non misurato: il tempo fra Invio e il suono nella riunione | §2.3 L; §7 «In tempo reale» | B, la parentesi tratteggiata sopra tutta la strada: «dal tasto Invio al suono nella riunione: non misurato» | c'è |
| Nel banco di prova dei motori il primo suono arriva in meno di 160 ms (strumento in Python, non l'app) | R `benchmarks/engines/README.md` | B, nota della tappa «la voce nasce»: detta come misura di uno strumento di prova, non dell'app | c'è, con il limite accanto |
| La voce parte dopo la prima frase; mentre una suona si prepara la successiva | R engine.rs §2.3 | B, tappa «la voce nasce» | c'è |
| Non misurato: quanto dura «Preparo la voce…» a ogni avvio | §2.3 L | B, tappa «la voce nasce», tra ciò che non è misurato | c'è |
| Tutte le cifre su un solo computer (Ryzen 5 PRO 6650U); su altri non sono note | §2.3 M L | B, la cornice delle tappe provate dice «Misurato su un solo computer: un portatile con Ryzen 5 PRO 6650U» (dove la home dice «Sul tuo computer») | c'è |
| Non ancora provato: computer diversi da quello delle misure | pagina vecchia | B, stessa cornice | c'è |
| Non ancora provato: lettori di schermo, puntamento oculare, interruttori | §7 «Promesse»; pagina vecchia | B, prima della prima tappa, tratteggiati: i modi di scrivere non ancora provati (la strada ha un confine anche all'inizio) | c'è |
| La tabella «provato / non provato» per app: Zoom, Teams, Meet, Webex, Jitsi, il browser: tutte «non ancora provata in una riunione vera» | P5 «Regole»; pagina vecchia | B, la tappa tratteggiata delle app ne dice i sei nomi, ognuno «non ancora provato»; una sola frase, non sei righe uguali | c'è |
| Per Kalliope l'app è un microfono qualunque: va provato app per app | §1.4 R docs | B, nota della tappa delle app | c'è |
| Dove si sceglie il microfono in ogni app (documentato solo per Zoom) | P5 | — | **rimandata a** `riunione/` (la pagina «in riunione», con l'aiuto): è l'uso, non lo stato |
| Il suono arriva solo se un'app registra dal microfono; ciò che si dice mentre nessuno ascolta si scarta | §1.4 R docs | B, nota della tappa del microfono | c'è |
| Microfono: 0% di CPU se nessuna app ascolta; circa 0,26% di un core mentre registra; ritardo circa 21 ms | M `docs/virtual-microphone.md` | B, tappa del microfono, con la fonte | c'è |
| Voce: circa 0,07 s di CPU per ogni secondo di voce, un thread | M README | B, tappa «la voce nasce», con la barra «0,07 s su 1 s» | c'è |
| Normalizzatore: circa 11 µs a frase; numeri, date, orari, importi, sigle scritti in parole | M R README, CHANGELOG | B, tappa «scrivi la frase», con l'esempio vero «cmq ci vediamo dmn alle 10:30» | c'è |
| Pronuncia: regole e un lessico di 7.920 parole | R README | B, tappa «la voce nasce» | c'è |
| Finestra: 10,6 MB con la sola finestra, circa 117 MB con la voce caricata, 0% di CPU a riposo | M README | B, la cornice del computer (il programma intero) | c'è |
| Hai provato in una riunione vera? Dillo: app e versione, distribuzione, versione di PipeWire, che cosa è successo, la frase che la finestra mostrava; non incollare le frasi dette; canale: le segnalazioni su GitHub, con un account | P9; pagina vecchia | B, sotto la strada: «Lo stato «non ancora» cambia solo con prove vere» e il collegamento alle segnalazioni, con che cosa scrivere | c'è. Il canale senza account (dubbio A) non esiste: detto |
| Questa tabella si aggiorna quando arrivano segnalazioni | P5 «Regole» | B, stessa nota, senza date | c'è come regola, senza promettere quando |

## Per chi è, e per chi no (P3)

| Voce | Fonte | Dove sta | Decisione |
|---|---|---|---|
| Fa per te se scrivi con una tastiera (o un altro dispositivo che scrive per te: non ancora provato), vuoi intervenire senza la tua voce, hai un computer Linux a 64 bit con PipeWire | pagina vecchia; §4.1 F1 | C, domanda «È adatto a chi non può parlare?» (la prima, già aperta) | c'è |
| Per alcune persone con afasia scrivere è difficile: può non servire, o servire con un familiare. Non lo promettiamo; da confermare con un logopedista | §4.2 I | C, domanda «E se scrivere è difficile?» | c'è, detta come «non lo sappiamo» |
| Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista | pagina vecchia; home (chiusura); §12 dubbio F | C, nella stessa risposta | c'è, **come nella home**. Il dubbio F (avvertenza concordata con il proprietario) è ancora aperto in `progetto.md` §12: **chiedere** a chi coordina se resta |
| Che cosa serve oggi: Linux x86_64, glibc 2.39 o più recente, PipeWire con pipewire-pulse, curl; Debian 13, Ubuntu 24.04 o più recenti, Fedora, Arch, altre con l'archivio | §4.3; R releasing.md | C, domanda «Che cosa serve?» (in breve) e rimando a `installa/` | c'è; i comandi **rimandati a** `installa/` |
| Quanto costa: nessun prezzo; l'uso personale è libero | §4.3; R LICENSE | C, domanda «Quanto costa?» | c'è |
| È difficile? Chi installa: una persona che usa il terminale; i passi con i comandi da copiare | P3; §4.3 «Come si installa» | C, domanda «Chi lo installa?» con il rimando a `installa/` | c'è (nessuna promessa di facilità) |
| Windows e macOS: non ancora | §9; P6 | C, domanda «Funziona su Windows, Mac o telefono?» → rimando a `non-ancora/` | c'è |
| Telefono: per ora è solo per il computer (confine, non «non ancora») | §1.4 P (17/11/2026) | C, stessa risposta | c'è, **senza «non ancora»** |
| Sottotitoli: Kalliope non ascolta e non trascrive; i sottotitoli dipendono dall'app della riunione | §1.4 R I | C, domanda «Fa i sottotitoli?» | c'è |
| La voce: oggi parla con Giulia o Marco, non con la voce di chi lo usa | §1.4 P (17/11/2026); §7 | C, domanda «Parla con la sua voce?»: «Oggi no: con Giulia o con Marco» | c'è, **senza promessa e senza data** (decisione del 17/11) |
| Altre lingue: per ora solo italiano | §1.4 R; §9 | C, domanda «In che lingua parla?» | c'è |
| Niente pittogrammi, predizione del testo, frasi preimpostate; solo le frasi già dette nella sessione; non è un sistema completo di CAA | §1.4 R I | C, domanda «Ha frasi pronte o simboli?» | c'è («non è un sistema completo di comunicazione aumentativa» detto come confine) |
| Non è un servizio online né un'estensione del browser | §1.4 R | C, domanda «È un servizio online?»; D (tutto sul computer) | c'è, come confine |
| Chi c'è dietro: SANSEVIERIA OÜ; gli autori nominati in `NOTICE`; nessun indirizzo e-mail, segnalazioni su GitHub con un account | P3, P7; pagina vecchia | C, domanda «Chi c'è dietro?»; D, in fondo | c'è (l'autore originale è nominato in `NOTICE`: la pagina rimanda lì, come la pagina vecchia) |
| Assistenza telefonica, certificazioni: non esistono | P3 «Errore e recupero» | C, nella risposta «Chi c'è dietro?» («nessuna assistenza telefonica, nessuna certificazione») | c'è |
| Inoltrare il link o salvare la pagina per chi installerà | P3 «Azioni», «Esito» | E, il messaggio da inoltrare nella bolla, «Copia il messaggio» | c'è (scelta progettuale: il gesto con cui P3 finisce) |
| «La stessa cosa, detta a ciascuno» (tabella a cinque colonne) | §4.3; pagina vecchia | C: le domande sono quelle di chi valuta per un altro; le risposte per chi installa stanno in `installa/`, quelle per chi controlla in D | c'è, **distribuita** (non come tabella) |

## Se devi controllare (P7)

| Voce | Fonte | Dove sta | Decisione |
|---|---|---|---|
| Il testo che scrivi: nessun invio, non viene salvato | §7 R main.rs | D, prima scena del computer: il testo resta dentro | c'è |
| L'unica connessione: lo scarico della voce al primo avvio, con curl, da huggingface.co, a una revisione fissata, tre file, 53 MB (52.974.546 byte); impronta SHA-256 di ogni file, un file diverso si scarta | §7 R download.rs, catalog.rs | D, seconda scena: i tre file entrano dal bordo, una volta, e passano il controllo dell'impronta; fonti accanto | c'è |
| Poi funziona senza internet | §2.3 R | D, stessa scena: il bordo si richiude | c'è |
| Nessun account | §7 | D | c'è |
| Non si avvia da solo e non lascia servizi accesi; quando chiudi la finestra si chiude, e il microfono «Kalliope» sparisce | §7 I (da confermare); `packaging/linux/` senza avvio automatico; pagina vecchia | D, quarta scena: si chiude la finestra, il microfono sparisce dall'elenco | c'è, con la fonte che c'è (nessun file d'avvio nei pacchetti). La parte «nessun servizio dopo la chiusura» resta [I]: **chiedere** conferma a chi coordina |
| Non usa il microfono vero: nessuna richiesta di accesso | §7 R | D, prima scena | c'è |
| Che cosa resta sul disco: voce scelta e «Senti anche tu» in `settings.conf`; la voce in `~/.local/share/kalliope/models/…` | §7 R settings.rs, paths.rs, catalog.rs | D, terza scena: ciò che resta | c'è |
| Che cosa non si salva: il testo e l'elenco delle frasi (in memoria, fino a 30; sparisce chiudendo) | §1.2 §7 R | D, terza scena: l'elenco «Già detto» sparisce con la finestra | c'è |
| Cosa si modifica: nulla fuori dalle sue cartelle; `.deb`/`.rpm` con i permessi di amministratore; l'archivio in `~/.local` | §7 R releasing.md | D, nota della terza scena | c'è in breve; i dettagli **rimandati a** `installa/` |
| Reversibile: `./install --remove` o la rimozione del pacchetto; se toglie anche la voce scaricata: non verificato | §7 L | D, stessa nota («non verificato» detto) | c'è |
| Licenza: SANSEVIERIA 1.0, codice sorgente disponibile, non «open source» nel senso dell'OSI | §7; NOTICE | D, «Licenze»; piede | c'è |
| Uso personale, di ricerca e interno aziendale senza compenso; offerte commerciali con autorizzazione scritta di SANSEVIERIA OÜ; chi distribuisce o offre uso in rete fornisce il sorgente | R LICENSE §2 §4 §5 §7 | D, «Licenze» | c'è |
| Componenti di terzi: ONNX Runtime (MIT), Klein-TTS-X1.5-Pro (Apache-2.0), Slint 1.18 (Slint Royalty-free License 2.0), il lessico da Wiktionary (CC BY-SA 4.0); elenco in `NOTICE` e `THIRD_PARTY_NOTICES.md` | R THIRD_PARTY_NOTICES.md | D, «Licenze»: ogni componente accanto alla parte della strada in cui lavora | c'è (la licenza di Slint presa dal file: la pagina vecchia non la diceva) |
| Impronte dei file nella pagina Installa e in `SHA256SUMS` della versione ({{kalliope.sums.url}}) | G; pagina vecchia | D, «Impronte e provenienza» | c'è (segnaposto) |
| Attestazione di provenienza (`gh attestation verify`): le versioni pubblicate da quando il repository è pubblico; la 0.1-rc.1 no, pubblicata quando era privato | P7; R releasing.md | D, stessa voce, detta in modo che resti vera dopo la prossima versione | c'è. La pagina vecchia aveva «Le versioni successive l'avranno» con una classe `solo-rc1` che `tools/site.py` non gestisce: tolta la promessa |
| Nessun audit indipendente | P7 L | D | c'è |
| Codice sorgente, istruzioni di compilazione, cronologia (`CHANGELOG.md`), come contribuire (`CONTRIBUTING.md`, assenso di licenza): sul repository, in inglese | P7, P8 | D, in fondo: i collegamenti al repository | c'è |
| Hosting del sito: GitHub Pages registra le richieste come ogni host; niente cookie né statistiche | §7 | piede (come la home) | c'è |
| Ogni affermazione rimanda a un file; dove non c'è una fonte lo si scrive | P7 «Regole» | B e D: ogni fatto ha accanto il file o il comando | c'è |

## Dalle pagine già fatte

| Voce | Fonte | Dove sta | Decisione |
|---|---|---|---|
| Che cos'è Kalliope in una frase (chi arriva dal README o da un collegamento non ha visto la home) | P7 «Ingresso» | A, presentazione | c'è |
| Rimando da «non ancora» («Che cosa è provato e che cosa no, anche su Linux») | `non-ancora/` chiusura | questa pagina; il primo schermo risponde | c'è |
| Pittogrammi, sottotitoli, «non ascolta e non trascrive», rimandati qui da «non ancora» | `3a-non-ancora/CONTENUTI.md` | C e D | c'è |
| Il percorso a passi della pagina vecchia («Passo 2 di 5») e «Indietro / Avanti» | pagina vecchia | — | **lasciata fuori**: il sito nuovo non ha un percorso a passi (barra e menu della cornice) |
| L'indice «In questa pagina» | pagina vecchia | — | **lasciata fuori**: i due comandi del primo schermo portano ai tratti di chi valuta e di chi controlla; la pagina è corta abbastanza da scorrere |
| Nessuna funzione inventata, nessuna data, nessuna alternativa di terzi | P6, P7, decisioni del 16 e 17/11 | tutta la pagina | rispettata |

In tutto 61 voci: 55 ci sono, 4 rimandate (`riunione/` 1, `installa/` 3 in parte), 2 lasciate fuori (percorso a passi, indice).

## Da chiedere (tramite chi coordina)
- **Dubbio F**: «non è un dispositivo medico e non sostituisce la valutazione di un logopedista» è nella home e nella pagina vecchia,
  ma `progetto.md` §12 dice che va concordata con il proprietario. Resta così?
- **«Nessun servizio acceso dopo la chiusura»**: `progetto.md` §7 lo segna [I]; i pacchetti non hanno un avvio automatico (verificato),
  il resto non è verificato da me sul programma acceso.
