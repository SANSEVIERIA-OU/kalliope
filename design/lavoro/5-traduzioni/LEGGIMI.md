# Traduzioni del sito e del programma (fase 5, 27/11/2026)

Decisione del proprietario del 27/11/2026: «il codice lo fai tu ma tutte le traduzioni le fai fare a codex». Il codice (catalogo
unico, `crates/i18n`, specchio da destra a sinistra, un carattere per scrittura, controlli) è di Claude; ogni traduzione è di
Codex. Le regole per chi traduce stanno in `docs/translating.md`; qui c'è come le ha fatte Codex, per rifarlo uguale.

- **Primo passaggio**, una sessione di Codex per lingua (`codex exec`, gpt-6.2-astra, sforzo alto, sette alla volta, circa
  10 minuti a lingua): `una-lingua.sh LINGUA` con `brief-codex.md`.
- **Seconda passata**, rilettura da madrelingua con le note di ogni testo breve della finestra e i fogli di foto della finestra
  in quella lingua alle tre misure (920×640, 360×320, testo al 175%) allegati: `rivedi-lingua.sh LINGUA` con
  `revisione-codex.md` davanti al primo brief. Le foto si fanno con `kalliope --demo SCENA` (scene in `docs/translating.md`).
- **Controlli di chi coordina**, oltre a `tools/translations.py check LINGUA --complete`: `controlla.py WORKTREE LINGUE…` (con un
  Python che abbia fontTools e brotli) dice che cosa è rimasto italiano per errore o tradotto per errore (le frasi che dice la
  voce italiana restano in italiano), le citazioni della finestra nel sito diverse dal programma, le etichette troppo lunghe,
  la scrittura, i segni invisibili di direzione e i glifi che mancano ai caratteri della finestra e del sito.
- **`note/`**: le note di ogni lingua scritte da Codex (forma di cortesia, variante, glossario, dubbi).

Gli script hanno i percorsi di questa macchina: sono il resoconto di com'è andata, da adattare per rifarlo.

## La voce del menu delle applicazioni (27/11/2026)

Richiesta del proprietario: «traduci anche la voce del menu applicazioni con codex». Le tre righe del file `.desktop` (genere,
descrizione, parole di ricerca) sono entrate nel catalogo unico come `programma.menu.*`, dal modello
`packaging/linux/io.github.sansevieria_ou.kalliope.desktop.in`; `tools/menu.py` scrive il file che i pacchetti installano
(`docs/translating.md`, «The entry in the applications menu»).

- **Traduzione**, tre sessioni di Codex in parallelo, una per gruppo di lingue (latine dell'ovest e del nord, latine dell'est e
  del sud, le altre scritture con l'indonesiano), 4–8 minuti: `menu-gruppo.sh` con `menu-brief-codex.md`. Le parole di ricerca
  non sono la traduzione della lista italiana ma le parole con cui si cerca in quella lingua.
- **Revisione** da madrelingua, tre sessioni nuove con il foglio delle foto del loro gruppo allegato: `menu-rivedi.sh` con
  `menu-revisione-codex.md`. Le foto (`menu-foto.sh`, `menu-fogli.sh`) mostrano la voce in un lanciatore vero, rofi, che legge il
  file come un menu: la ricerca «kalliope» con nome, genere e descrizione, e la ricerca con una parola chiave che non sta né nel
  genere né nella descrizione, quindi trovata solo dalla riga `Keywords`.
- **Controlli di chi coordina**: `menu-solo-menu.py` (Codex ha cambiato solo le tre voci), `check --complete`, `extract --check`,
  `desktop-file-validate`, e la prova di `tools/test_menu.py` che legge il file con GLib (GDesktopAppInfo, quello di GNOME) in
  ogni lingua. Le note di ogni lingua hanno in fondo la sezione `Applications menu`, con la revisione.
