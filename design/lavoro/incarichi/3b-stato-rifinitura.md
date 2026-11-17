# Incarico 3b-r · «stato»: i difetti del secondo sguardo, prima del proprietario

- **Attività**: `path-build` (skill `design-system-generator`), ruolo **design-build**: lo stesso che ha costruito la pagina
  (incarico 3b-b).
- **Area tua**: `design/lavoro/3b-stato/rifinitura/` (`progresso.md` aggiornato a ogni unità finita; esiti e foto lì).
- **Punto di partenza**: commit `9348d35` (la costruzione è `61b6cec`).
- **Il giudizio**: `design/lavoro/3b-stato/secondo-sguardo/GIUDIZIO.md`, con le foto in `/tmp/lavoro-3bs-*`. Leggilo per
  intero. La pagina è giudicata pronta; questi difetti si correggono prima di mostrarla al proprietario.

## Che cosa correggere (decisioni di chi coordina)

1. **Il catalogo, importante**: nella sezione «Pagina «stato»», a 1440, tre esempi della tappa messi due per riga ricadono
   nell'impaginazione da computer dentro mezza colonna (una parola per riga per circa 1000 px, «docs/releasing.md» spezzato
   nella pillola; `stato-16.png`, `stato-21.png` in `/tmp/lavoro-3bs-catalogo/1440x900-chromium/`). Ogni esempio deve
   mostrarsi come nella pagina a quella larghezza, a tutte le larghezze del catalogo.
2. **Le risposte che non stanno a 844×390**: sono tre, non due («E se scrivere è difficile?», «Ha frasi pronte o simboli?»,
   «Chi c'è dietro?»). Quando la bolla della risposta è più alta dello spazio sotto la barra, non resta appiccicata: scorre
   con la pagina, così si legge intera. La scritta resta quella di oggi. Togli il limite dichiarato per 844×390 in
   `metodo.config.mjs`; quello a 326×326 (la domanda premuta sotto la barra) resta, confermato dal giudice.
3. **Le cifre con la virgola in arabo e urdu** («0,07 s» si legge «07 s,0»): la causa è in `tools/site.py`, dove la parte
   latina isolata non tiene la virgola fra due cifre. Correggila lì, con una prova in `tools/test_translations.py` che
   fallisce sul `site.py` di oggi (anche il punto delle migliaia e una virgola seguita da uno spazio, che invece separa).
4. **Le etichette del disco**: «la voce · 53 MB» esce dal riquadro «Sul disco» di 12–32 px in en-XA (a 326, 390, 800, 1000)
   e di 3 px in tutte le lingue a 326 (`/tmp/lavoro-3bs-schermi/xa-390/zoom-disco.png`): deve stare dentro in ogni lingua,
   senza cambiare l'aspetto in italiano alle misure dove oggi sta.
5. **L'anello del fuoco sulle fonti**: oggi è squadrato e taglia la pillola
   (`/tmp/lavoro-3bs-gesti/fonti-1440x900-chromium/fonti-stati.png`); deve seguire la forma della fonte, come il fuoco degli
   altri comandi del sistema, con i token che ci sono.

Restano **scelte per il proprietario**, da non toccare: il filo tratteggiato sopra le impronte che scendono, «Copiato…» che
al telefono spinge giù il collegamento di 44 px, le etichette dei pacchetti con lo zoom a 150–200%, l'indirizzo che va a
capo dopo «sansevieria-».

## Prove

Rifai le prove che riguardano ciò che cambi: il catalogo a tutte le sue larghezze nei tre motori; le domande a 844×390,
915×412, 390×844 e 1440×900 (lettura intera, nessuna bolla che resta appiccicata quando non ci sta, nessun salto); arabo e
urdu del sito di prova e ar-XB a 390×844 e 1440×900 (le cifre); il disco in it, en-XA, ar-XB, ur alle misure del giudizio; il
fuoco sulle fonti nei tre motori; i controlli (`controlla-sorgenti.mjs`, `css_logico.py`, `translations.py extract --check` e
`check`, `test_translations.py`); home e «non ancora» identiche a `9348d35` (`confronta-scelta.mjs`).

Il giudice ha trovato che le note della costruzione dicevano più di quanto si vedeva in cinque punti (catalogo «provato»,
«due» risposte, «in italiano sta», «nulla esce dal bordo» in en-XA, M8 «fatto»). Scrivi come chiuso solo ciò che hai
guardato in foto, e indica la foto.

## Ambiente e regole

Le stesse di `3b-stato-costruzione.md`: `PLAYWRIGHT` e Firefox come lì; cartelle tue sotto `/tmp/lavoro-3br-*`, porte
**8910–8919**; 8765, 8766 e 8767 e le loro cartelle sono del proprietario; 8900–8909 di una misura della voce che usa la CPU
in parallelo. Non cambi colori, caratteri, composizione, curve o durate; nessun valore fuori da `token.css`. Nessuna finestra
sullo schermo, niente comandi che chiedono conferma, niente lavori in background da aspettare. **Non fare commit né push.**
Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: per ogni punto che cosa hai cambiato, con le foto prima e dopo; i file toccati;
gli esiti delle prove con i numeri; le impronte dei file provati; ciò che non hai verificato.
