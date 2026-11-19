# Il logo · le regole ufficiali delle icone

Ricerca del 19/11/2026 (ruolo research, tre raccolte: Linux, Windows e macOS, browser). Serve al logo nuovo (fase L di
`design/lavoro/STATO.md`). Qui ci sono i fatti con le fonti. Le scelte le fanno la direzione e chi coordina.

## Windows e macOS

### Windows (Microsoft Learn, pagine aggiornate nel 2026)

- **Griglia e forma**: griglia di 48×48; raggio 2 px sulle curve esterne, 1 px su quelle interne, misurati a 48 px.
  «Icons should not include typography as part of the design». I dettagli vanno solo sul livello più in vista.
  https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-design (aggiornata il 14/07/2026)
- **Dimensioni**:
  - minime: 16, 24, 32, 48 e 256;
  - per scala e superficie: barra delle applicazioni 24–96, Start 32–256, barra del titolo e tray 16–64;
  - per l'elenco delle app: 16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96 e 256, ciascuna con le varianti
    `_altform-unplated` (tema scuro) e `_altform-lightunplated` (tema chiaro).

  «If you do not provide these files, your icon will appear on a system icon plate». Il fondo trasparente è preferito, ma
  una piastra è ammessa. https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-construction
  (aggiornata il 05/08/2026)
- **Contrasto e stile**: Windows 11 non chiede più le icone a contrasto elevato. Chiede invece: «Make sure at least half of
  your icon passes a 3.0:1 contrast ratio on light and dark theme». È una regola di Microsoft per le icone, non WCAG, ed è
  una regola della piattaforma: chi coordina la tratta come tale. Gradienti leggeri, di uno o due passi. Ombre interne per
  separare i livelli.
- **`.ico` per Win32**: 16, 32, 48 e 256, a 32 bit con trasparenza.
  https://learn.microsoft.com/en-us/windows/win32/menurc/about-icons

### macOS (Human Interface Guidelines, cambiata il 28/10/2026)

- **Forma**: «icons are square, and the system applies masking to produce rounded corners». Si consegnano livelli quadrati
  di 1024×1024, senza maschera, con il contenuto al centro. Il sistema aggiunge da sé riflessi, ombre e bordi: non vanno
  disegnati.
- **Formato**: PNG non a livelli, oppure un file di Icon Composer (`.icon`) con le varianti default, dark e mono, da cui
  vengono clear e tinted. Il sistema genera le varianti che mancano.
  https://developer.apple.com/design/human-interface-guidelines/app-icons.md
- **Le icone di forma irregolare**: «Irregularly shaped icons receive a system-provided background». La forma la decide
  macOS: un'icona che non è un quadrato pieno finisce su un fondo del sistema.
  https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass.md
- **`.icns`**: Apple lo documenta solo in pagine d'archivio (2012–2018): una cartella `.iconset` con PNG da 16 a 512 e `@2x`,
  poi `iconutil -c icns`, che gira su macOS. Le pagine Apple presentano come attuali macOS 27 e Xcode 27, senza data.

### Slint e winit (le versioni del programma: Slint 1.19.0, winit 0.30.13, le ultime stabili)

- Slint ha `Window.icon` di tipo `image`, che accetta SVG, PNG e JPEG
  (https://docs.slint.dev/latest/docs/slint/reference/property-types/images/). Il backend winit la passa a winit a 64×64
  logici: lo si legge nel codice di Slint su master, non nella documentazione.
- winit `set_window_icon` funziona su Windows e X11 ed è «Unsupported» su Wayland e macOS
  (https://docs.rs/winit/latest/winit/window/struct.Window.html). Su Linux con Wayland l'icona viene dal file `.desktop` e
  dal tema di icone. Su macOS viene dal pacchetto `.app`.

### Che cosa vale per tutti e due

- **Niente testo nell'icona.** Microsoft: «Letters and words on your icon should be avoided». Apple: «Text in icons doesn't
  support accessibility or localization».
- Niente linee sottilissime o dettagli fini alle grandezze piccole; poche forme, al massimo due metafore.
- **Le ombre**: Windows le vuole disegnate, Apple no, perché le mette il sistema. Un disegno unico va tenuto piatto e
  aggiunge le ombre solo nella versione per Windows, se serve.
- **La forma**: macOS impone il quadrato arrotondato. Windows e Linux accettano una forma libera su fondo trasparente.
- **Un disegno unico funziona** se:
  - il soggetto sta al centro e regge su un quadrato pieno, per macOS;
  - regge anche senza quadrato, su chiaro e su scuro, per Windows e Linux.

## Linux

Le pagine di GNOME, KDE e Flathub non portano una data; le specifiche di freedesktop sì. Citazioni lette con uno strumento
che riassume: da ricontrollare sulla pagina prima di citarle in pubblico.

- **Icon Theme Specification** (freedesktop.org, versione 0.13, 2013):
  - formati PNG e SVG; XPM no per i temi nuovi;
  - il tema `hicolor` c'è sempre, e chi cerca un'icona ci guarda se il tema in uso non ce l'ha;
  - «Minimally you should install a 48x48 icon in the hicolor theme»;
  - nessun elenco ufficiale di dimensioni.

  http://specifications.freedesktop.org/icon-theme/latest/
- **Il nome dell'icona**: solo minuscole, cifre, `_`, `-` e `.` (Icon Naming Specification 0.8.90). Il file `.desktop` usa l'ID
  a dominio rovesciato (Desktop Entry 1.5). Kalliope usa già `io.github.sansevieria_ou.kalliope` per entrambi.
- **GNOME HIG, «App Icons»** (https://developer.gnome.org/hig/guidelines/app-icons.html, senza data):
  - **Grandezze**: si disegna su 128×128 senza riempirlo, con una griglia di 2 px; si vede di solito a 64 e scende a 32.
  - **Stile**: semplice e geometrico ma «not "flat"», con un piccolo spessore frontale (al massimo 4 px). Colori piatti
    sulle superfici dritte, gradienti solo su quelle curve.
  - **Ombre**: da evitare, e mai fuori dalla sagoma.
  - **Palette**: la palette GNOME come base (https://developer.gnome.org/hig/reference/palette.html), nove famiglie di
    cinque tinte.
  - **Contenuto**: niente mascotte o personaggi; «avoid using logos which rely on a specific visual style»; ogni icona è unica
    e ha una metafora semplice legata al nome o alla funzione.
  - **Versione simbolica, obbligatoria**: «Each app should have an additional symbolic version of its app icon», monocroma,
    16×16, nello stesso SVG.
  - **Prove**: una versione distinta per le build di prova. Strumento consigliato: App Icon Preview.
- **KDE HIG**:
  - le icone delle app sono colorate, con base a 48 px;
  - «Don't make your icon flat»;
  - un'ombra netta di 1 px su ogni icona colorata e margini di 4 px;
  - le icone monocrome solo a 16 e 22 px.

  https://develop.kde.org/hig/icons/colorful/ e .../colorful/application/, senza data. La pagina «Icon Design» non si è
  aperta.
- **AppStream 1.2**: nel metainfo `<icon>` può essere `stock`, cioè un nome senza estensione, `local` o `remote`. I
  distributori mettono in cache le icone a 64×64, e a 128×128 se c'è; 64×64 è l'unica garantita.
  https://www.freedesktop.org/software/appstream/docs/chap-Metadata.html,
  https://www.freedesktop.org/software/appstream/docs/sect-AppStream-IconCache.html
- **Flathub, linee guida di qualità**: sono consigli, non requisiti per l'ingresso, ma sono le regole più precise.
  - **Formato**: SVG, o PNG di almeno 256×256; quadrata.
  - **Spazio**: non riempire la tela e non toccare i bordi.
  - **Contrasto**: buono su fondi chiari e scuri, e niente colori scuri vicino ai bordi.
  - **Forme**: niente forme sottili, e niente simbolo piatto di un solo colore («too simple»); niente dettagli minuti o testo
    piccolo; riconoscibile in piccolo.
  - **Ombre**: «should not have any baked-in shadows or glows», perché gli store ne aggiungono una.

  https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines/quality-guidelines
- **Software center**: GNOME Software usa l'icona a 64 px, e 128 px per le app in evidenza, raddoppiate sugli schermi densi
  (dai commit di GNOME del 2021–2022). Per Discover nessuna fonte ufficiale. Lo sfondo su cui le mostrano non è documentato.
- **Il tema scuro**: nessuna specifica prevede una variante scura per l'icona a colori di un'app. Si ricolorano solo le icone
  simboliche e monocrome. Per questo l'icona a colori deve reggere da sola su chiaro e su scuro.
- **Conflitti**:
  - l'ombra: KDE la chiede, Flathub la vieta, GNOME la sconsiglia. Scelta prudente: nessuna ombra disegnata fuori dalla
    sagoma;
  - la profondità: GNOME e KDE chiedono di non essere piatti; Flathub vieta il simbolo piatto di un colore solo.

## Il sito e i browser

- **L'icona della scheda in SVG** (`<link rel="icon" href="…svg" type="image/svg+xml">`) funziona in Chrome ed Edge dalla 80,
  in Firefox dalla 41 e in Safari dalla 26.0 (WebKit, 15/09/2025: «SVG file format for icons everyplace there are icons»).
  https://webkit.org/blog/17333/webkit-features-in-safari-26-0/, https://caniuse.com/link-icon-svg
- **Serve ancora una riserva in ICO o PNG**, per due motivi:
  - Safari prima della 26 non legge l'SVG;
  - Google Search non accetta l'SVG come icona. Accetta BMP, GIF, ICO, PNG, JPEG, PPM e TIFF; l'icona dev'essere quadrata,
    di almeno 8×8, e meglio se più grande di 48×48.

  https://developers.google.com/search/docs/appearance/favicon-in-search. web.dev consiglia l'ICO con `sizes="any"` più
  l'SVG. Un ICO 16, 32 e 48 è una pratica comune, non una regola ufficiale.
- **Il tema chiaro o scuro dentro l'SVG** (`prefers-color-scheme`) funziona in Firefox e nei browser Chromium, non in Safari:
  bug WebKit 309949, aperto, verificato su Safari 26.3. La versione base deve reggere su schede chiare e scure.
- **Da rinviare** (il sito è solo per il computer: decisione del 17/11):
  - `apple-touch-icon` (180×180, fondo pieno) e il manifesto con le icone 192 e 512;
  - `mask-icon` di Safari, di cui non si è trovato lo stato attuale.
- **L'anteprima quando si condivide un indirizzo** (`og:image`): Facebook chiede almeno 1200×630, rapporto 1,91:1, al
  massimo 8 MB; LinkedIn 1200×627 e al massimo 5 MB. X non ha documentazione leggibile oggi; la vecchia diceva 2:1 e niente
  SVG. Si fa in PNG o JPG con `og:image:width`, `:height` e `:alt`. È un passo a sé, dopo il logo.
- **Il logo nella barra**:
  - in linea risparmia una richiesta; in un file a parte va in cache ma non si può colorare per parti (web.dev, W3C);
  - un logo dentro un collegamento con il nome scritto accanto: il nome sta sul collegamento e l'SVG è `aria-hidden`, come fa
    già la barra di oggi (MDN, WAI).
- **Da destra a sinistra**: «Don't flip logos or universal signs and marks… Always display a logo in its original form»
  (Apple, https://developer.apple.com/design/human-interface-guidelines/right-to-left). Il W3C non dice niente sui loghi.
  Il sistema non specchia già il marchio (`design-system/SISTEMA.md`).

## Che cosa ne viene per il logo di Kalliope

Questa è la lettura di chi coordina, non una scelta di disegno.

- **Un disegno senza lettere**, con una metafora semplice legata a ciò che fa Kalliope. Niente mascotte. Il nome «Kalliope»
  sta accanto, nella barra, scritto con il carattere della pagina e traducibile.
- **Grandezze in cui deve reggere**:
  - si disegna a 128 o 1024 e si guarda a 64, 48, 32 e 16;
  - a 16 restano la sagoma e uno o due segni, niente linee sottili.
- **Su chiaro e su scuro**: deve reggere su tutti e due senza varianti, perché né Linux né Safari le cambiano. Niente colori
  scuri sul bordo esterno.
- **Due forme dallo stesso disegno**:
  - una piena, che regge dentro il quadrato arrotondato di macOS;
  - una libera su fondo trasparente, per Linux, Windows e il sito.
- **Ombre**: niente ombre o bagliori disegnati fuori dalla sagoma. Un po' di profondità dentro la sagoma, perché GNOME e KDE
  la chiedono e Flathub vieta il simbolo piatto di un colore solo.
- **Una versione simbolica** di un colore solo, 16×16, nello stesso disegno (GNOME).
- **I file**:
  - il sito: SVG più ICO o PNG di riserva;
  - Linux: SVG in `hicolor/scalable/apps` più un PNG 48 (e 256);
  - Windows e macOS: PNG o ICO e ICNS ricavati dallo stesso disegno, quando ci saranno quei pacchetti.
- **Da destra a sinistra non si specchia.**
- **I colori del sito nuovo**, il bordeaux della direzione 2, vanno guardati resi:
  - su un desktop scuro un bordeaux molto scuro sparisce sul bordo;
  - su una scheda chiara un rosa chiaro sparisce.

## I fondi delle piattaforme, per le ricostruzioni (verificati il 19/11/2026)

- **GNOME**:
  - libadwaita 1.10.0, `src/stylesheet/_colors.scss`: fondo della finestra `#fafafb` (chiaro) e `#222226` (scuro); schede
    `#ffffff` (chiaro) e `rgb(255 255 255 / 8%)` (scuro); testo `rgb(0 0 6 / 80%)`;
  - GNOME Shell 51.1: la panoramica e la griglia delle applicazioni sono sempre scure, `#222226`. Le icone vanno a 96 px al
    massimo e scendono a 64, 48 o 32 se la pagina non ci sta (`js/ui/iconGrid.js`).
- **KDE Breeze chiaro** (v6.8.3, `colors/BreezeLight.colors`, invariato da Plasma 6.0): finestra `#eff0f1`, viste `#ffffff`,
  testo `#232629`, fuoco `#3daee9`.
- **Windows 11**: il colore della barra delle applicazioni e i numeri dell'accento predefinito non sono pubblicati; li
  genera la shell. `#f3f3f3` e `#202020` sono `SolidBackgroundFillColorBase`, il ripiego di Mica per le app
  (`microsoft-ui-xaml`, `Common_themeresources_any.xaml`).
- **macOS**: Apple non pubblica valori per il materiale del Dock.
- **Le simboliche GNOME**:
  - `#2e3436` nei simboli di Adwaita (`adwaita-icon-theme`);
  - `#222222` nel modello ufficiale delle icone delle app (`Teams/Design/HIG-app-icons`);
  - i simboli del formato nuovo sono neri e GTK li ricolora.
