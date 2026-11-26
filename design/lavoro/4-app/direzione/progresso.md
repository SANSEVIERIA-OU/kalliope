# Direzione della finestra — progresso

Ruolo: direzione (design-system-generator). Inizio 26/11/2026 ~17:45; consegna ~19:40. Worktree
/workspace/kalliope/materiali-locali/direzione-finestra (ramo direzione-finestra, sopra main c44508a dopo il rebase chiesto
dal coordinatore). Target /workspace/kalliope/materiali-locali/target-direzione. Display Xvfb :154, PipeWire privato
/tmp/kmic-run-direzione (script in materiali-locali/direzione-finestra-prove/: banco.sh, app.sh, foto.sh, registra.sh,
catalogo.sh, finestra-di.sh).

## Fatto
- visione.json (parole del proprietario), base.json (base misurata + visione), tre abbozzi, scelto A.
- Token --app-* scuri e chiari in token.css (100 nuovi nel blocco della direzione, 31 valori chiari); vecchi --app-* del disegno 0.1
  del sito rinominati --ricostruita-* (sito invariato); TOKEN.md, sezione «La finestra: direzione …».
- Componenti Slint in crates/app/ui/kalliope/ (aspetto, forme, stato, bolla, scrittura, voce-propria, finestra, catalogo); app.slint li usa.
- Rust minimo e separato: session.rs Status::situation (+ test), main.rs (mod vista, set_situazione, vista::collega, --catalogo, --demo),
  vista.rs (parole/prefisso + test, modalità riunione, catalogo, scene demo), build.rs (tabella del catalogo generata da token.css).
- Prove sul motore vero (pronta, scrive, parla non sentita e sentita, cronologia, manca il microfono, la voce non parte, tastiera),
  demo per ciò che non è collegato, scuro e chiaro, 920 × 640 e 360 × 320, catalogo nei due temi; video e misure; coppie con i riferimenti.
- Controlli: tools/slint_valori.py verde; cargo test -p kalliope-app (29) e -p kalliope-tokens verdi; css_logico.py verde;
  controlla-valori.mjs uscita 0.
- Commit: 425ee10, 4cda39e, 4bf4438, 6f38131 (+ il commit dei documenti).

## Aperto
- Un processo mio rimasto senza finestra: `kalliope --demo parla`, pid 170360 (il primo avvio, prima che gli avvii avessero una durata);
  non l'ho fermato perché il ruolo non può usare kill: va chiuso dal coordinatore (`pkill -x` lo chiuderebbe insieme agli altri kalliope).
- Ciò che non è collegato e ciò che resta debole: direzione.md, ultime due sezioni.

## Ultimo comando
- MODELLI=/tmp/nessun-modello foto.sh dark v-problema 5 (la voce non parte, motore vero).

## Giro di correzioni dopo il giudizio (inizio 19:38)
- Letto ../giudizio/giudizio.md per intero (B1, B2, I1-I7, minori).
- Fatto nei componenti: proporzioni a quote (scrittura 2, cronologia 1, minimo in righe), impianto raccolto sotto 440 px × testo,
  bolla fuori dallo scorrimento, bolla su una riga che scorre (riunione e finestra minima), barra stabile con «Altro» e A− % A+ a destra,
  Menu da tastiera (menu.slint), cronologia che scorre a Invio, segnaposto che segue lo stato e «Come si risolve», passo 1 della voce con
  gerarchia, cerchio dei 12 s, Giulia con la tinta di Anna, «Di'» spento leggibile, sfumatura in cima alla cronologia.
- Token: quota-scrittura, quota-storia, righe-scrittura(-raccolta), interlinea, corpo-scrittura-raccolta, soglia-bassa; tolti
  scrittura-altezza(-minima). controlla-valori: uscita 0.
- In corso: matrice di foto (matrice.sh → foto2/), video e misure del giro.
- 20:05 matrice finita (67 foto in foto2/, copiate come foto/c-*); video c-invio-passaggio, c-compatta-parla, c-testo, c-voce-registra,
  c-menu-tastiera; misure in misure/c-*. Invio: 1933 ms, 39% spostato (prima 166 ms, 100% a salto).
- Commit dbf1d63 (correzioni) e successivo (documenti, conto alla rovescia, etichetta del catalogo).
- Aperto: il clic fuori da un menu lo chiude senza arrivare sotto; la stima delle parole; il pallino della voce propria poco visibile sulla
  barra scura; il processo orfano pid 170360 (kalliope --demo parla) da chiudere per pid.
