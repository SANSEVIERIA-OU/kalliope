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
