# Incarico 2-c · Lingue: la correzione dopo il giudizio

- **Ruolo**: design-direction, lo stesso worker dell'incarico 2 (`incarichi/2-lingue-aspetto.md`). Area:
  `design/lavoro/2-lingue-aspetto/` (aggiorna `progresso.md` con una sezione «Correzione dopo il giudizio»).
- **Punto di partenza**: il tuo lavoro è salvato nel commit `8c7fae1`. Il giudizio di un altro ruolo è in
  `design/lavoro/2-lingue-aspetto/giudizio/GIUDIZIO.md`, con le foto in `giudizio/foto/`: leggilo per intero e guarda le
  foto prima di correggere. Chi coordina ha rivisto la foto di B1 (`barre-azione-lingue.png`) e conferma il difetto.

## Che cosa correggere (una volta sola, alla causa)

- **B1 (bloccante)**: la barra con l'azione dopo lo scorrimento, nelle lingue lunghe, da 960 a 1440 px (de, el, bg, fi,
  en-XA): nessuna voce fuori dallo schermo o sopra il marchio, a ogni larghezza fra 761 e 1440, non solo alle misure
  provate prima. Il punto 3 dell'incarico lo chiedeva: prova la barra su tutte le larghezze (per esempio ogni 10 px) e in
  tutte le lingue di prova, dopo lo scorrimento vero.
- **I1**: la versione al contrario in arabo e urdu (stato, chiusura, piede). Correggi la causa per ogni stringa che mescola
  cifre, punti e lettere latine dentro un testo da destra a sinistra, non solo la versione.
- **I2**: «Tu · microfono "Kalliope"» al telefono che va a capo sopra le barre della voce.
- **I3**: la pagina della scelta della lingua come frammento su un palco vuoto: renderla una pagina intera nella direzione
  2, tenendo l'idea (la bolla che nasce dalla tua tessera).
- **I4**: la pagina italiana non deve scaricare un byte in più a riposo, neanche per i nomi delle lingue nel piede e nel
  selettore: lo chiedeva l'incarico. Misuralo con il selettore e con più lingue pubblicate (la costruzione con i cataloghi
  di prova), non con `--no-selector`.
- **I minori**: M1, M2, M3, M5, M6 e M8 nello stesso giro. M4 e M7: correggili, oppure scrivi perché no (è una tua decisione
  di direzione, con la foto).

## Decisioni di chi coordina, per sapere (non sono lavoro tuo)

Finché la lingua pubblicata è una sola, il selettore non si mostrerà e `/` manderà a `/it/`; la barra di «non ancora»
prenderà il selettore nuovo. Lo farà il ruolo di costruzione dopo di te, con il precarico dei caratteri, la tastiera, gli
stati, le larghezze di mezzo e gli altri motori. Le tue prove continuano a costruire con più lingue.

## Prove dopo la correzione

Rifai le prove che le correzioni toccano, sugli stessi file finali, e registra le impronte: l'italiano identico a
`8c7fae1` (con «riduci movimento» e `--no-selector`, Chromium alle misure dell'incarico, Firefox e WebKit a 1440 e 390);
la barra in tutte le lingue di prova a ogni larghezza fra 761 e 1440 dopo lo scorrimento; arabo e urdu a 1440 e 390
(versione, tessera); la pagina della scelta a 390×844, 1440×900, 844×390 e 1366×640, con e senza JavaScript, con la sua
sequenza d'arrivo; i byte scaricati dalla pagina italiana. `controlla-sorgenti.mjs`, `css_logico.py`, `translations.py
check`, `test_translations.py` verdi.

## Lavoro in parallelo

Il ruolo di costruzione dell'incarico 3a-b sta finendo «non ancora»: non toccare `website/non-ancora/`, `website/cornice.js`,
`pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`, `errori.css`, `design-system/metodo.config.mjs`,
`catalogo-pagine.*`. `website/lingue/site.pot` e `it.po` hanno adesso voci sue non salvate (153 in tutto): se aggiungi testi,
`translations.py extract` li unisce; non annullare le voci altrui. Nei file condivisi (`token.css`, `TOKEN.md`, `SISTEMA.md`,
catalogo) rileggi subito prima di ogni modifica e aggiungi senza riordinare. Se una tua modifica a un componente condiviso
riguarda «non ancora», controlla che `/it/non-ancora/` resti giusta e scrivilo.

Ambiente come prima: porte 8800–8809, cartelle `/tmp/lavoro-2-*`, nessuna finestra, niente commit né push, nessun altro
agente.

## Consegna

Nella risposta finale e in `progresso.md`: per ogni punto del giudizio che cosa hai cambiato (file) o perché no, gli esiti
delle prove con i numeri, le impronte, le foto prima e dopo, ciò che non hai verificato.
