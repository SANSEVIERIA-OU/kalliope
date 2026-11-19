# Direzione 2 · «Il tuo posto, alla pari»

**L'idea.** Il tuo riquadro nella riunione, da cui la voce si allarga a tutti alla stessa distanza.

Della frase di Kalliope questa direzione prende la seconda metà: nella riunione, alla pari. Al centro c'è il tuo riquadro a camera
spenta, buio come quello di «Tu» nella home; intorno, tre riquadri uno dentro l'altro a passi uguali, sempre più chiari: la voce che
esce da te e arriva a tutti alla stessa distanza. È un'immagine sola (riquadro e voce sono la stessa forma), senza lettere, senza
bolla e senza barre: il segno più lontano dai marchi della voce che si vedono nei riferimenti.

**Come realizza il criterio di ambizione.** Nella barra il disegno resta a colori e diventa la riunione della home in piccolo:
quando la voce della pagina parla, il tuo riquadro prende il bordo di chi parla (lo stesso bordo `--voce` che prende «Tu») e a ogni
picco una luce passa dalle fasce vicine a quelle lontane, come l'anello che parte da «Tu» e accende il bordo degli altri. Fermo, nei
menu, è un oggetto pieno con un centro: si trova al primo sguardo fra le icone, su chiaro e su scuro.

## Dove sta che cosa

| Che cosa | File |
| --- | --- |
| I token | `token.css` |
| I modelli, con i colori per nome | `modelli/disegno.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg`, `barra.svg` |
| I file con i valori (da `../../strumenti/genera.py`) | `disegno.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg` |
| Il componente della barra | `marchio.css`, `marchio.js` |
| La pagina di prova | `prova.html` |
| Le foto | `foto/barra/`, `foto/prova-intera.png` |
| Le sequenze | `sequenze/barra-arrivo/` (lente 3× a 1440 e 390), `barra-puntatore/`, `barra-ridotto/`, `arrivo-pagina/` |
| I confronti | `../../confronti/2-posto/` |
| La copia del sito | `/tmp/l1-2-copia-2` costruita in `/tmp/l1-sito-2-2` e `-pseudo` |

## Le scelte e le fonti

**I tratti comuni del genere, adottati.** Marchio a sinistra del nome, compatto, a colori del mondo del sito, come la piastrella di
ElevenAgents (R03) e il quadrato di LALAL.AI (R05), che hanno un segno pieno dentro un riquadro
(`../../foto/riferimenti/loghi-dei-riferimenti.png`). Qui il riquadro non contiene il segno: è il segno.

**La peculiarità presa** (un tratto solo): la sfera di ElevenAgents (R03), il segno della voce che vive quando la voce parla
(`design/ricerca/prove/R03/fogli/widget-apertura.jpg`); qui il marchio della barra si accende con la voce della home. Non si
prendono la sfera né il suo colore.

**La forma** (scelta progettuale, guardata resa in `/tmp/l1-schizzi/s1–s4.png` e nelle pagine di prova):
- quattro riquadri concentrici a passi uguali di 14 px su 128 (112, 84, 56, 28), con raggi in proporzione (0,3 della larghezza):
  «alla pari» detto con la geometria, la stessa distanza da tutti i lati, e il disegno non si specchia da sé;
- provate e scartate: i quattro riquadri della riunione affiancati 2×2 (a 16 px sembrano il logo di Windows), il riquadro grande con
  tre piccoli accanto (sembra un'impaginazione), il riquadro con il solo bordo di chi parla (a 36 px sembra una cornice);
- uno spessore frontale di 4 px sotto il riquadro esterno (GNOME), niente ombre fuori; il disegno non riempie la tela.

**I colori**: quattro gradini di luce della tinta del sito (8 in OKLCH) a luminosità 23, 42, 62 e 80%, passi uguali di circa 19
punti; il calcolo è mio, guardato reso su chiaro, scuro e bordeaux.

| Token | Valore | Fonte o motivo |
| --- | --- | --- |
| `--d2-nucleo` | `#3a0817` | il fondo di «Tu» nella home (`--tu-fondo-alto` `#3a0816`), oklch(23% 0.08 8) |
| `--d2-fascia-vicina` | `#90053c` | nuovo, oklch(42% 0.165 8): il gradino fra il riquadro e il colore di mezzo |
| `--d2-fascia-media` | `#e6396e` | nuovo, oklch(62% 0.21 8): 3,9:1 sia sul chiaro sia sullo scuro (regola di Windows) |
| `--d2-fascia-lontana` | `#f3a4b2` | nuovo, oklch(80% 0.095 8), fra `--rosa` e `--voce`: il bordo è chiaro, mai scuro (Flathub) |
| `--d2-spessore` | `#e6768e` | oklch(70% 0.14 8): lo spessore del riquadro esterno |
| `--d2-luce`, `--d2-anello` | `#ffdbe1` | la voce del sito (`--voce`): gli anelli e il bordo di «Tu» nella home |
| simbolica | `#2e3436` | il colore dei simboli di Adwaita (`GNOME/adwaita-icon-theme`, master, commit `2066120e`, per esempio `Adwaita/symbolic/actions/open-menu-symbolic.svg`), scelto invece del `#222222` del modello ufficiale delle icone delle app (`Teams/Design/HIG-app-icons`, `template.svg`, commit `3535fe98`) perché è quello delle simboliche installate; GTK le ricolora comunque |

Sul chiaro passano a 3:1 le tre fasce interne (circa il 56% dell'area); sullo scuro le due esterne (circa il 75%). Con le
quattro tinte non è «un simbolo piatto di un colore solo» (Flathub).

**La forma piena** (macOS): il quadrato è la fascia lontana, gli altri riquadri al centro, nessun colore cambia. È la forma che
nasce più naturale delle tre: il quadrato arrotondato di macOS è già un riquadro della riunione.

**La versione piccola** (16 e 24 px): senza spessore, le fasce di 2 px sulla griglia dei pixel, il tuo posto di 4 px.

**La simbolica**: quattro livelli alternati pieno e vuoto (riquadro esterno, spazio, riquadro di mezzo, il tuo posto vuoto con un
punto). La prima prova, un contorno con un quadrato pieno dentro, a 16 px sembrava una casella di spunta a metà
(`/tmp/l1-schizzi/simb2.png`, «d-attuale»).

**Nella barra**: il disegno a colori a 36 px (30 al telefono), con le misure e lo spazio del sito; il nome resta quello del sito.

**Il movimento** (solo nella barra):

| Quando | Che cosa | Valori e fonte |
| --- | --- | --- |
| la voce parla | il tuo riquadro prende il bordo di chi parla, che segue l'inviluppo | `--d2-anello` (`--voce`), come il bordo di «Tu» nella home; insegue l'inviluppo in 160 ms |
| a ogni picco della voce | una luce passa dalla fascia vicina alla lontana | 380 ms per fascia, 90 ms fra l'una e l'altra, fino al 70%, curva `--entra` (R03); i picchi sono quelli che lanciano gli anelli di «Tu» |
| puntatore e fuoco | la stessa luce, una volta | gli stessi valori |
| la home scrive | niente: questa direzione parla della riunione, non della scrittura | — |
| «riduci movimento» | niente | `marchio.css`, `marchio.js` |

La prova della rimozione: senza il movimento si perde il legame fra il tuo riquadro nel marchio e «Tu» nella riunione (significato).

**Stile di default** (parte E): nessuno. Niente pillole, niente gradiente, niente schede uguali (i riquadri sono uno dentro l'altro,
di grandezze diverse).

## I difetti che vedo

- **È il più astratto dei tre**: senza la home non dice «voce» né «scrittura». Coperto il nome, si riconosce come un segno, non come
  un programma per parlare. Chi lo vede per la prima volta in un menu può leggerlo come un pulsante «registra» o «ferma», o come un
  bersaglio.
- A 36 px nella barra, accanto al pulsante d'azione rosa, le sue tinte calde gli fanno concorrenza: ha più colore della barra intorno.
- La luce che passa a ogni picco, nei fotogrammi, si nota meno del bordo di chi parla; si vede bene solo nel video.
- La simbolica a 16 px è fitta: quattro livelli in 16 pixel; a 1× il punto centrale si confonde.
- Il movimento lo comanda `scena.js` con le chiamate aggiunte nella copia; nel sito vero le aggiungerebbe la costruzione.

## Come verrebbero ICO e ICNS

- **Windows (ICO)**: 16 e 24 da `piccola.svg`, 32, 48 e 256 da `disegno.svg`, PNG a 32 bit con trasparenza in un ICO; provato in
  `/tmp/l1-icone-prova/2-posto/kalliope.ico` (5 grandezze, canale alfa) con `strumenti/png.mjs` e ImageMagick 7.1.1-43 di questa
  macchina. Le varianti chiara e scura dell'elenco delle app possono restare lo stesso disegno.
- **macOS (ICNS)**: da `piena.svg`, `.iconset` da 16 a 1024 con `@2x` e `iconutil -c icns` su macOS; o Icon Composer con quattro
  livelli (le fasce), che il vetro di macOS separerebbe bene. Non provato (niente macOS qui).
- **Linux**: `disegno.svg` in `hicolor/scalable/apps`, `simbolica.svg` in `hicolor/symbolic/apps`, PNG 48 e 256; 16 e 24 da
  `piccola.svg` se si installano PNG.

## Non verificato

- Fondi e misure delle ricostruzioni: GNOME e KDE verificati il 19/11/2026 nelle fonti ufficiali (`../contesti/piattaforme.css`); per la barra di Windows c'è il token di ripiego `SolidBackgroundFillColorBase`, perché Microsoft non pubblica il colore vero, e l'accento dell'indicatore è un'approssimazione non verificata; il Dock di macOS è inventato (Apple non pubblica il materiale).
- Solo Chromium senza finestra, senza suono.
