# Incarico: confronto, direzione e primo percorso completo (attività `comparison`, `direction`, `tokens`, `components`, `language`, `catalog`)

Leggi prima `design/incarichi/comune.md`. Ruolo: vibe-next:design-build. Lavori da solo su `design/` (file indicati sotto)
e su `site/`. Il coordinatore ha scritto `tools/site.py` e `.github/workflows/pages.yml`: non cambiarli; se ti serve
qualcosa da loro, scrivilo nel progresso.

Tre unità, in ordine. Dopo ciascuna aggiorna `design/incarichi/costruzione/progresso.md`: chi riprende deve poter
continuare da lì.

## Unità 1: confronto (`<skill>/references/confronto.md`)
- Fonti: `design/ricerca/osservazioni/*.json`, schede, movimento e prove dei 13 riferimenti visitati (R01-R06,
  R20-R22, R50-R53; se R50-R53 non sono ancora pronti quando arrivi qui, aspetta il loro `progresso.md` in
  `design/incarichi/visita-4/`), `design/ricerca/registro-italiano.md` (fonti di registro G01-G04).
- `node <skill>/scripts/confronta-riferimenti.mjs` → `design/confronto.json` e `design/confronto.md`: identici,
  varianti, peculiarità di ciascun sito, assenze verificate, non osservati.
- **Matrice di copertura** compito × riferimento (C1-C14 di `design/ricerca/piano.md` §1, stato osservato / assente /
  non osservato) in `design/copertura.md`. Se un compito resta sotto 3 riferimenti osservati, scrivilo come lacuna e
  dimmi quale riserva di `design/ricerca/selezione.md` lo coprirebbe; non fermarti ad aspettare.
- Lo storico della skill (`<skill>/storico/`) si legge solo dopo, come confronto temporale.

## Unità 2: direzione (`<skill>/references/direzione.md`)
- Prima il criterio di ambizione: che cosa il sito di Kalliope fa o mostra che nessun riferimento e nessun concorrente
  (R50-R53) mostra, per chi e dove.
- Ogni caratteristica comune e ogni peculiarità ha destinazione, adattamento e prova, oppure un'esclusione motivata
  da compito, vincolo o conflitto. Movimento ridotto, senza JavaScript, tastiera, testo grande e colori forzati chiedono
  un ripiego, non escludono.
- Se le evidenze ammettono alternative sostanziali, confronta direzioni diverse sugli stessi contenuti (non solo la
  palette) e scegline una, con il motivo.
- `design/direzione.json` + `design/direzione.md`; `node <skill>/scripts/controlla-direzione.mjs design/direzione.json
  --confronto design/confronto.json` deve passare.

## Unità 3: primo percorso completo (il cancello di `direzione.md` §5)
Il percorso principale, con contenuti, stati e movimento reali, in `site/`:
**arrivo (P1: cos'è, per chi, cosa serve) → ascolto della voce (P2) → stato onesto e limiti → scarica e installa per
la propria distribuzione (P4) → scegli «Kalliope» come microfono nell'app della riunione e controlla che ti sentano →
se non funziona, aiuto (P5/P9) → chi non può usarlo ancora, Windows e macOS (P6)**, più la pagina 404.
Prima di estendere ad altro aspetta: il coordinatore mostra questo percorso al proprietario.

Vincoli e materiale (`design/progetto.md` per il resto):
- HTML e CSS statici, nessun passo di build, nessuna dipendenza npm, nessuna richiesta a terzi (niente font remoti,
  CDN, statistiche, cookie, embed). JavaScript facoltativo e solo in aggiunta: tutto deve funzionare senza.
  Un carattere tipografico ospitato in `site/` è ammesso solo con licenza libera (OFL) e il suo file di licenza accanto.
- Fonte unica dei valori (token) in un foglio di stile del sito; componenti riusati, non ridefiniti pagina per pagina.
- Dati della release solo con i segnaposto di `tools/site.py` (elenco nel suo docstring): `{{kalliope.version}}`,
  `{{kalliope.deb.url}}`, `{{kalliope.deb.size}}` ecc. Mai versioni o nomi di pacchetto scritti a mano.
  Anteprima locale: `python3 -I tools/site.py --out /tmp/kalliope-site` e poi un server statico su quella cartella
  (per esempio `python3 -m http.server -d /tmp/kalliope-site 8765`, lanciato e chiuso dentro lo stesso comando o con
  `timeout`, mai lasciato in background). Il sito sarà servito sotto `/kalliope/`: usa percorsi relativi.
- Materiale vero: `site/voce/{giulia,marco}-{1,2,3}.mp3` e `site/immagini/kalliope-finestra.png` (foto della finestra
  pronta, rifatta il 12/11 con «Senti anche tu» acceso). Icona dell'app:
  `packaging/linux/io.github.sansevieria_ou.kalliope.svg` (copiala in `site/` se serve).
  Testi dei campioni, scritti così e pronunciati così (uscita del normalizzatore di Kalliope):
  1. «Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.» → uguale.
  2. «Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?» →
     «… del quattordici marzo … venerdì alle quindici e trenta?»
  3. «Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.» → «… di milleduecentocinquanta euro più IVA, valido
     fino al trentuno dicembre.»
  Sono l'uscita di Kalliope 0.1-rc.1 senza ritocchi, convertita in MP3 (64 kbit/s, mono, 24 kHz). Whisper le trascrive
  con circa 1 parola sbagliata su 45.
- Decisioni del coordinatore sui dubbi di `progetto.md` §12, in attesa di conferma del proprietario (scrivile nel
  catalogo come provvisorie):
  - A: nessun indirizzo e-mail per ora (non esiste): segnalazioni sulle issue di GitHub; il sito lo dice.
  - B: solo italiano, con `lang="it"` e una struttura che permetta altre lingue in seguito.
  - E: a chi ha Windows o macOS il sito dice con onestà «non ancora» e perché (serve un driver firmato su Windows e un
    componente audio approvato da Apple su macOS), e come seguire le novità (le release su GitHub). Nessun prodotto di
    terzi consigliato.
  - F: una frase breve: Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.
  - G: vedi i campioni sopra.
- Stato reale da dire: versione di prova (prerelease), solo Linux x86_64 con PipeWire; provata end-to-end con un
  PipeWire privato, **non ancora** con Zoom, Teams o Meet su un desktop reale. Misure in `README.md`.
- Comandi d'installazione veri per Debian/Ubuntu (.deb), Fedora (.rpm), Arch (PKGBUILD) e altre distribuzioni (.tar.gz
  con `./install`): ricavali da `packaging/linux/` e `packaging/aur/`, non inventarli. Impronte: `{{kalliope.sha256.*}}`
  e `{{kalliope.sums.url}}`.
- Il catalogo vivo (`<skill>/references/catalogo.md`) cresce con il percorso: per il cancello basta che mostri i token e i
  componenti usati, vivi, con stati e varianti, più ricerca, confronto e decisioni. Mettilo in `site/sistema/`, con lo
  stesso foglio di stile del sito (il footer può collegarlo: «Come è fatto questo sito»). Niente foto dei siti di
  riferimento nel sito pubblico (diritti d'autore): solo testo e collegamenti.

Controlli prima di consegnare (solo Chromium per ora, al computer 1440×900 e al telefono 390×844; la matrice completa
dei 15 dispositivi × 3 motori si lancia dopo l'approvazione): `esame-impaginazione.mjs`, `contrasto-qa.mjs`,
`link-spenti-qa.mjs` con un `metodo.config.mjs` in `design/`; prova senza JavaScript, movimento ridotto, testo 200%,
colori forzati, stampa. Guarda tu le foto, a grandezza utile.

## Risultati
`design/confronto.{json,md}`, `design/copertura.md`, `design/direzione.{json,md}`, `site/**` (percorso, 404, catalogo),
`design/metodo.config.mjs`, foto dei controlli in `design/prove-percorso/`, progresso in
`design/incarichi/costruzione/progresso.md`.
Risposta finale: al massimo 15 righe (ambizione, direzione scelta e alternative scartate, cosa c'è nel percorso, esiti
dei controlli, lacune, domande per il proprietario).
