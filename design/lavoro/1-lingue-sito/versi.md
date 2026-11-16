# I punti che hanno un verso (per l'incarico 2)

Stato del 16/11/2026, dopo l'incarico 1. In italiano (da sinistra a destra) la pagina è identica a prima, pixel per pixel
(`progresso.md`, «Italiano identico»). Qui sta ciò che lo **specchio non fa da solo** e che l'incarico 2 deve decidere guardando,
con la foto di ciò che si rompe (cartelle in fondo).

## Che cosa c'è già

- Tutte le proprietà fisiche sinistra/destra dei fogli sono logiche (`margin-inline-start`, `inset-inline-end`, `padding-block`,
  `text-align: start`…): `griglie`, `flex` e le posizioni si specchiano da sole con `<html dir="rtl">`.
- **`--verso`** (`design-system/token.css`): `1`, e `-1` sotto `:root:dir(rtl)`. Un valore con un verso la moltiplica:
  `translateX(calc(var(--barra-azione-sposta-x) * var(--verso)))`, `transform-origin: calc(50% - 50% * var(--verso)) 50%`.
  `scena.js` la legge con `Testi.verso()` (`const verso`, riga 21). Provata: `/it/` dà 1, `/ar/` dà −1, nei tre motori
  (`prove/prova-lingue.mjs`). L'incarico 3a (`riunione-ferma.css`) la usa già.
- `tools/css_logico.py` fallisce se rientra una proprietà fisica non motivata, una scorciatoia con lati diversi o un testo nel CSS;
  `tools/css_logico.py --versi` ristampa la tabella qui sotto dai fogli di adesso.
- Le righe fisiche tenute apposta portano `/* fisico: motivo */`: sono nella sezione «Fisico voluto».

## 1. Spostamenti e crescite orizzontali (nei fogli)

Da decidere uno per uno: «in una pagina specchiata va dall'altra parte?».

| Dove | Che cosa è | Verso che ha |
| --- | --- | --- |
| `componenti/barra.css:34` | `.barra-azione`: l'azione entra nella barra con `translateX(12px)` | entra dal margine finale: con `dir=rtl` arriva dalla parte sbagliata |
| `componenti/barra.css:43` | `.barra.con-azione .menu`: il menu scivola a sinistra di `--posto-azione` per far posto all'azione | in RTL l'azione sta a sinistra: il menu deve scivolare a destra (con `* var(--verso)`). **Si vede**: a 1440×900 in `ar-XB` l'azione copre «Installa» (`foto/pseudo-ar-XB/foglio-1440-b.png`) |
| `componenti/pulsanti.css:49` | `.collegamento:hover .freccia`: la freccia si sposta di 4 px | nel verso della lettura |
| `componenti/pulsanti.css:46-47` (+ `token.css` `--collegamento-freccia-maschera`) | la freccia `→` è una maschera (immagine) | punta a destra: in RTL deve puntare a sinistra (`scale: var(--verso) 1`) e stare dopo il testo |
| `componenti/riunione.css:55-60` | `.guarda`: Paola, Luca e Anna girano testa e occhi verso «Tu» (`translateX(-2px)`, `translate(-1px, …)`, `rotate(-8deg)`…) | «Tu» è in alto a sinistra: in RTL è a destra; spostamenti e rotazioni cambiano segno |
| `componenti/finestra.css:100` | `.f-barra i`: barra di avanzamento che cresce da sinistra (`transform-origin: 0 50%`, `scaleX(0)` e `scaleX(q)` in `scena.js:902` e `:916`) | la barra del tempo che passa si specchia: cresce da destra |
| `componenti/strada.css:65` e `:109` | `.linea`: la strada della voce cresce da sinistra (`transform-origin: 0 50%`, `scaleX(0)`; `scena.js:854` sceglie l'asse `scaleX`/`scaleY`) | in RTL il computer è a destra: la linea deve crescere da destra |
| `componenti/strada.css:68`, `:95` · `strada-ferma.css:20` · `token.css` `--linea-forse-fondo`, `--esito-forse-prima-fondo` | tratteggio con `repeating-linear-gradient(90deg, …)` | la fase del tratteggio parte dall'inizio: in RTL parte dal lato sbagliato (si nota solo se i tratti non sono simmetrici) |
| `componenti/bolla.css:15`, `:59`, `:65` · `filo.css:117` · `ascolto.css:12` · `riunione-app.css:72` · `tratti.css:186` | `transform-origin` della bolla, della scheda e delle finestre che entrano (`0 0`, `30px 100%`, `40px 100%`, `100% 0`) | l'angolo da cui crescono è quello di partenza (sinistra): in RTL è la destra. `riunione-ferma.css:51` fa già così con `--verso` |
| `componenti/barra.css:18`, `:116` · `tratti.css:140-141` | `clip-path: inset(0 X …)` | simmetrici a destra e sinistra: **nessun verso**, solo da guardare |
| `componenti/ascolto.css:54` · `filo.css:40` (`--voce-tondo-prima-fondo`, `--suona-frase-tondo-prima-fondo`) | le due barre della pausa disegnate con `linear-gradient(90deg, …)` | simmetriche: **nessun verso** |
| `componenti/ascolto.css:98` | `gira`: il cerchio che gira (`rotate(360deg)`) | un caricamento che gira si lascia com'è |
| `componenti/riunione.css:90-92`, `:255` | `.barre`: centrate con `left: 50%` e `translate(-50%, -50%)` | centratura: simmetrica, giusta in entrambe le direzioni |

## 2. Luci: posizione e traslazione in coppia

La posizione è fisica perché la traslazione `translate(-50%, -50%)` che la accompagna lo è: la pagina specchiata ha la stanza e la
riunione dall'altra parte, ma la luce resta dov'era (`ar-XB`: la luce rosa sta dietro il titolo, non dietro la riunione;
`foto/pseudo-ar-XB/foglio-1440-a.png`). Per specchiarle: `inset-inline-start` al posto di `left` **e** `translate(calc(-50% * var(--verso)), -50%)`.
`--luce-inizio` e `--luce-inizio-medio` hanno già il nome giusto.

| Dove | Luce |
| --- | --- |
| `componenti/tratti.css:9` (`--luce-inizio`), `:22` (`--luce-inizio-medio`), `:25`, `:28` (`50%`) e `:13` (traslazione) | `.luce` e `.luce-voce` dietro la riunione del primo schermo |
| `componenti/tratti.css:53` (traslazione), `:60` (`34%`) | `.serve .luce-tratto` |
| `componenti/tratti.css:167` (`50%`) | `.chiusura .luce-tratto` (centrata) |
| `componenti/filo.css:106` (`62%`) | `.ascolto-voce .luce-tratto` |
| `componenti/strada.css:7` (`40%`) | `.strada-voce .luce-tratto` |

## 3. Disegni e HTML

| Dove | Che cosa |
| --- | --- |
| `website/index.html:81`, `:237`, `:246`, `:255`, `:405` | `<svg class="coda">`, la coda della bolla: il disegno `M0 0h31L7.6 21.6A3.5 3.5 0 0 1 2 18.8V0z` punta in basso a sinistra, verso «Tu» che sta a sinistra. In RTL va specchiato (`scale: var(--verso) 1`) e `bolla.css:35` (`.coda` a 40 px dall'inizio) già si sposta |
| `website/index.html:279-282` (icone della strada) | disegni da 40×40: il campo con il cursore (`Scrivi la frase`) ha il testo a sinistra; da guardare se si specchia |
| `website/index.html` figure di Paola, Luca e Anna | quasi simmetriche (i capelli di Paola scendono dietro a destra: `capelli-dietro`); da guardare |
| `design-system/componenti/ascolto.css:42-49`, `:135` · `pulsanti.css:56-58`, `:77` · `filo.css:33-35` | il triangolo ▶ dei comandi di riproduzione: tenuto fisico, non si specchia (comandi audio e video: Mozilla, Material) |

## 4. Lo script (`website/scena.js`)

| Riga | Che cosa | Verso |
| --- | --- | --- |
| `:233`, `:332` | `misura()`: le geometrie delle onde e dei bersagli (`r.left - rc.left`) | misure assolute dal bordo sinistro: funzionano in entrambe le direzioni (le onde sono cerchi) |
| `:296-301` | il volo della bolla dal campo di Kalliope: `translate(dx, dy)` con `dx = rcm.left - rb.left` | calcolato dalle posizioni vere: giusto in entrambe le direzioni |
| `:431` | `p.geo.destra` (taglia le onde a destra di «Tu»): mai impostato | codice che non si usa |
| `:679-680` | il testo che si scrive nel campo scorre verso l'inizio: `translateX(${-sposta}px)` | in RTL il testo è allineato a destra e scorre a destra: `* verso()` |
| `:738` | `morph(da, a)`: la scheda nasce dalla pillola (`translate` dalle posizioni vere) | giusto in entrambe le direzioni |
| `:854-859` | la strada della voce: l'asse (`scaleX`) e i centri dei nodi (`translate`) | i centri sono posizioni vere; l'asse `scaleX` cresce dall'origine CSS (sezione 1) |
| `:902`, `:916` | la barra «Scarico la voce»: `scaleX(0)` … `scaleX(q)` | cresce dall'origine di `.f-barra i` (sezione 1) |

Il testo che si scrive nel campo (`:679`) e il cursore con testo bidirezionale sono un limite noto di Slint nell'applicazione, non
del sito. Le parole della frase si dividono agli spazi, e con `Intl.Segmenter` per il cinese (`paroleDi`).

## Foto e prove

- Pseudo-lingue: `/tmp/lavoro-1-foto/pseudo-en-XA/` e `/tmp/lavoro-1-foto/pseudo-ar-XB/` (1440×900 e 390×844, riposo, schermate dello
  scorrimento, menu e ascolto aperti) e i fogli `foglio-*.png`; copiate in `design/lavoro/1-lingue-sito/foto/`.
- Che cosa si rompe in `en-XA` (testo del 40% più lungo) e in `ar-XB`: `progresso.md`, «Pseudo-lingue».
