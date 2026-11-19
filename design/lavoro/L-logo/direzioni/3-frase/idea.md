# Direzione 3 · «La frase che si accende»

**L'idea.** La frase che hai scritto è la bolla: le parole si accendono mentre la voce le dice.

Della frase di Kalliope questa direzione prende il centro: una voce parla per te. Tiene la bolla, il segno del parlato che tutti
riconoscono, e **la ripensa, dichiarandolo**: dentro non c'è un simbolo della voce (le barre del logo di oggi, il nome di Grid), c'è
la frase mentre la voce la dice, come nella bolla della home (`design/direzione-2/D2.md`: «le parole della bolla passano dal 40% al
pieno al loro istante»). Dopo il giudizio la parte detta è piena, con le parole, e quella non ancora detta è il contorno tratteggiato,
il «non ancora» del sito. Il disegno fermo è un istante a metà frase; nella barra la frase si dice davvero.

**Come realizza il criterio di ambizione.** Nella barra il marchio è la bolla della home in piccolo e parla con lei: mentre la home
scrive, la bolla si svuota e resta tratteggiata (niente è ancora detto); quando la voce parla il fronte avanza nella stessa proporzione
delle parole già dette della bolla vera; finita la frase la bolla resta piena un momento e torna com'è. Fermo, nei menu, la bolla
detta a metà porta l'idea anche senza movimento.

## Dopo il giudizio (19/11/2026): la correzione

Il giudice (`../../giudizio/giudizio.md`) ha trovato un problema bloccante (fra le app di messaggi era una bolla fra le bolle, e la
simbolica era il simbolo «chat» di Material) e due importanti (la sagoma del logo di oggi in rosa; l'idea delle parole dette visibile
solo in movimento). Corretti dentro la stessa idea («la frase che hai scritto è la bolla: le parole si accendono mentre la voce le
dice»), dandole un tratto suo.

- **Adesso la bolla è detta a metà**: la parte già detta è piena, con le parole chiare dentro; il fronte della voce è curvo; **la parte
  non ancora detta è solo il contorno tratteggiato**, il segno che il sito usa per «non ancora» (`--tratteggio`, in «non ancora» e
  nella pagina «stato»). Ferma, a 32 e 48 px, nessuna app di messaggi ha una bolla per metà piena e per metà tratteggiata
  (`foto/fra-le-icone-2.png`, prime otto righe); non è più la sagoma piena del logo di oggi; e l'idea «detto / non ancora detto»
  arriva nei menu senza movimento.
- **Provate e scartate guardandole** (`/tmp/l1-schizzi/c1.png`–`c4.png`): la bolla divisa a metà vuota (si leggeva una «D»), la bolla
  riempita a quarto di cerchio dalla coda (somiglia al simbolo «cast»), la bolla divisa in pieno e chiaro con le parole (a 48 px
  sembrava una chat con i puntini «sta scrivendo»), la bolla larga come una striscia di sottotitoli (sempre una chat).
- Nella barra **il fronte avanza con le parole** della bolla vera (tutta la parte piena cresce, a 36 px si vede), e finita la frase la
  bolla resta piena un momento e torna a metà.
- La forma piena: la bolla su una piastrella rosa chiaro `#fab7c2`, che si vede sullo scuro e fa risaltare il tratteggio.

| Token | Valore | Fonte o motivo |
| --- | --- | --- |
| `--d3-detto`, `--d3-bordo` | `#e6396e` | la parte detta e il contorno (pieno o tratteggiato); oklch(62% 0.21 8), 3,9:1 su chiaro e scuro |
| `--d3-parola-detta` | `#ffedef` | le parole dette, chiare sul pieno (`--testo`) |
| `--d3-piastra` | `#fab7c2` | la forma piena: il rosa chiaro della direzione 2 |
| `--d3-fronte-inizio`, `--d3-fronte-fine` | `-60`, `62` | dove sta il fronte quando niente è detto e quando tutto è detto |
| `--d3-fronte-inseguimento`, `--d3-ritorno`, `--d3-passaggio` | `220 ms`, `1400 ms`, `900 ms` | il fronte insegue le parole; il ritorno a metà frase; il gesto del puntatore |

Geometria: la bolla (raggio 20, coda a punta in basso all'inizio della riga) con il contorno largo 12; il fronte è una curva che va da
x = 50 in alto e in basso a circa x = 68 a metà altezza; il tratteggio 14 pieno e 9 vuoto; due parole chiare alte 11. La piccola: il
contorno di un pixel, pieno fino a metà, tratteggiato dopo (due pixel pieni, uno vuoto), una parola. La simbolica: lo stesso, in un colore.

**Che cosa resta.** È ancora una bolla: chi cerca «messaggi» la guarderà. Il tratteggio può leggersi anche come «bozza» o «non
inviato». A 16 px il tratteggio si sfuma: resta una bolla piena a metà con il contorno chiaro. Non ci sono più le parole al 40% della
home dentro il disegno: la parte non detta è vuota.

## Dove sta che cosa

| Che cosa | File |
| --- | --- |
| I token | `token.css` |
| I modelli, con i colori per nome | `modelli/disegno.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg`, `barra.svg` |
| I file con i valori (da `../../strumenti/genera.py`) | `disegno.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg` |
| Il componente della barra | `marchio.css`, `marchio.js` |
| La pagina di prova | `prova.html` |
| Le foto | `foto/barra-2/` (dopo il giudizio), `foto/fra-le-icone-2.png`; prima: `foto/barra/`, `foto/prova-intera.png` |
| Le sequenze | dopo il giudizio in `sequenze-2/`; prima in `sequenze/`: `sequenze/barra-arrivo/` (lente 3× a 1440 e 390), `barra-puntatore/`, `barra-ridotto/`, `arrivo-pagina/` |
| I confronti | `../../confronti/3-frase/` |
| La copia del sito | dopo il giudizio `/tmp/l1-3-copia-4` → `/tmp/l1-sito-3-4` e `-pseudo` (la `-3` aveva il fronte che scorreva invece di crescere); prima `/tmp/l1-sito-3-2` |

## Le scelte e le fonti, prima del giudizio

> Questa sezione descrive il disegno di prima della correzione; i suoi file sono in `../../prima-del-giudizio/3-frase/`. I valori di adesso sono nella sezione «Dopo il giudizio».

**I tratti comuni del genere, adottati.** Marchio compatto a sinistra del nome, nel colore del mondo del sito. **La bolla** è il
segno che il genere dei programmi per comunicare condivide: Grid (R52, la bolla con il nome) e il logo di oggi di Kalliope
(`../../confronti/simili.png`); la bolla della home ne ha preso il profilo (raggio 22, coda a punta in basso all'inizio della
riga), e qui torna con lo stesso profilo, così marchio e bolla della pagina sono parenti.

**La peculiarità presa** (un tratto solo): la sfera di ElevenAgents (R03), il segno della voce che vive quando la voce parla; qui
vivono le parole della bolla. Non si prendono la sfera né il suo colore.

**La forma** (scelta progettuale, guardata resa in `/tmp/l1-schizzi/s1–s4.png` e nelle pagine di prova):
- la bolla di 108×80 su 128 con la coda di 16 px, un bordo di 10 px e dentro la bolla chiara con due righe di parole a forma di
  pillola (12 px, 1,5 px a 16 px): la prima riga detta, la seconda no;
- provate e scartate: la bolla fatta solo di righe di parole (a 32 px non si legge più come bolla), la bolla divisa in due metà chiara
  e scura (sul bianco la metà chiara sparisce con la coda), la bolla a contorno scritta da un tratto (troppo simile alle icone
  «messaggio» a filo), la bolla lucida a sfumatura radiale (sembra un'app di chat qualunque);
- una prima riga di tre parole aveva una parola di 10 px che diventava un'ellisse: ora due parole per riga, tutte pillole;
- niente ombre fuori dalla sagoma; il volume viene dalla sfumatura del bordo (GNOME: sfumature solo sulle superfici curve).

**I colori**

| Token | Valore | Fonte o motivo |
| --- | --- | --- |
| `--d3-bolla` | `#ffedef` | il chiaro della bolla della home (`--testo`) |
| `--d3-bordo-alto` → `--d3-bordo-basso` | `#ea3d71` → `#b51150` | oklch(63% 0.21 8) → oklch(50% 0.19 8): in alto regge sul chiaro e sullo scuro, in basso dà volume alla bolla e alla coda |
| `--d3-parola-detta` | `#5b0123` | il testo scuro della bolla (`--bordeaux`) |
| `--d3-parola-attesa` | `rgba(91, 1, 35, 0.4)` | le parole non ancora dette al 40%, come nella home |
| forma piena | `#ea3d71` → `#b51150` | il colore del bordo diventa il quadrato; la bolla chiara al centro |
| `--d3-bordo-acceso` | `#ff7ba3` | mentre la voce parla il bordo si schiarisce: l'azione al passaggio del sito (`--azione-sopra`) |
| simbolica | `#2e3436` | il colore dei simboli di Adwaita (`GNOME/adwaita-icon-theme`, master, commit `2066120e`, per esempio `Adwaita/symbolic/actions/open-menu-symbolic.svg`), scelto invece del `#222222` del modello ufficiale delle icone delle app (`Teams/Design/HIG-app-icons`, `template.svg`, commit `3535fe98`) perché è quello delle simboliche installate; GTK le ricolora comunque |

Sul chiaro passano a 3:1 il bordo e le parole (circa il 52% dell'area); sullo scuro la bolla chiara e la parte alta del bordo
(circa l'80%).

**La forma piena** (macOS): il quadrato ha il colore del bordo, la bolla chiara senza bordo al centro. Nel Dock è la più vivace delle
tre.

**La versione piccola** (16 e 24 px): bordo di un pixel, la bolla chiara, due tratti (la riga detta e quella no) sulla griglia di 16.
Le pillole delle parole a 16 px diventavano una macchia grigia (`#pixel` della prima pagina di prova).

**La simbolica**: la bolla piena con le due righe della frase scavate.

**Nella barra**: la bolla a 36 px (30 al telefono), con le misure e lo spazio del sito; sul bordeaux della barra la bolla chiara è
la cosa più luminosa della barra, come la bolla della home nella pagina.

**Il movimento** (solo nella barra):

| Quando | Che cosa | Valori e fonte |
| --- | --- | --- |
| la home scrive la frase | le quattro parole vanno al 40% | la frase non è ancora detta |
| la voce parla | le parole si accendono nella proporzione delle parole già dette della bolla vera; il bordo si schiarisce con l'inviluppo | 220 ms per parola, curva dolce, come la dissolvenza della bolla della home (D2); l'inviluppo inseguito in 160 ms |
| finita la frase | tutte accese per 1,4 s, poi il disegno torna com'è | — |
| puntatore e fuoco | la seconda riga si accende una parola dopo l'altra e torna | 6 × 220 ms, 70 ms fra le parole |
| «riduci movimento» | niente | `marchio.css`, `marchio.js` |

La prova della rimozione: senza il movimento il marchio è una bolla qualunque; con il movimento è la bolla di Kalliope (significato).

**Stile di default** (parte E): le parole sono pillole di testo finto, non pulsanti a pillola. Niente gradiente viola, niente schede
uguali.

## I difetti che vedevo prima del giudizio

- **È il più vicino ai segni che esistono**: fermo, a 48–96 px, si legge come «un'app di messaggi», come Grid e come mille icone di
  chat. La differenza (le parole dette e quelle no) si vede solo da vicino o in movimento.
- A 16 px le parole spariscono: resta una bolla con due tratti. Il ripensamento non arriva alla scheda del browser.
- Il bordo a 10 px su 128 a 32 px è poco più di un pixel: sul bianco la bolla sembra un contorno rosa con dentro qualcosa.
- Con la bolla nella barra e la bolla della home nello stesso schermo, il marchio può sembrare un pezzo della scena e non un marchio.
- Il movimento lo comanda `scena.js` con le chiamate aggiunte nella copia; nel sito vero le aggiungerebbe la costruzione.

## Come verrebbero ICO e ICNS

- **Windows (ICO)**: 16 e 24 da `piccola.svg`, 32, 48 e 256 da `disegno.svg`, PNG a 32 bit con trasparenza in un ICO; provato in
  `/tmp/l1-icone-prova-2/3-frase/kalliope.ico` (dopo il giudizio; prima `/tmp/l1-icone-prova/3-frase/kalliope.ico` (5 grandezze, canale alfa) con `strumenti/png.mjs` e ImageMagick 7.1.1-43 di questa
  macchina.
- **macOS (ICNS)**: da `piena.svg`, `.iconset` da 16 a 1024 con `@2x` e `iconutil -c icns` su macOS; o Icon Composer con due livelli
  (fondo e bolla). Non provato.
- **Linux**: `disegno.svg` in `hicolor/scalable/apps`, `simbolica.svg` in `hicolor/symbolic/apps`, PNG 48 e 256; 16 e 24 da
  `piccola.svg` se si installano PNG.

## Non verificato

- Fondi e misure delle ricostruzioni: GNOME e KDE verificati il 19/11/2026 nelle fonti ufficiali (`../contesti/piattaforme.css`); per la barra di Windows c'è il token di ripiego `SolidBackgroundFillColorBase`, perché Microsoft non pubblica il colore vero, e l'accento dell'indicatore è un'approssimazione non verificata; il Dock di macOS è inventato (Apple non pubblica il materiale).
- Solo Chromium senza finestra, senza suono.
