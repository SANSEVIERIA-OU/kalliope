# TOKEN · i valori del design system di Kalliope, con il loro ruolo

Questo file è stato generato quando il sistema è stato ricavato dal foglio di stile della home, senza cambiare un valore: **717 token** (705 alla nascita; vedi sotto, «Specchio»), tutti in `token.css`. Non si rigenera da solo: quando un token cambia, questa pagina si aggiorna a mano.
Per ogni token: il valore, il ruolo e dove è usato (componente, selettore, proprietà, condizione). «Valori della pagina ricondotti»: il valore del token è il valore
scritto nella pagina, identico; un token riunisce tutti gli usi di quel valore **dentro lo stesso ruolo**. Dove due valori quasi uguali potrebbero essere lo stesso ruolo
restano due token: sono elencati in «Da decidere» (non li ho uniti, perché cambierebbe l'aspetto).

**Specchio (16/11/2026).** Per poter specchiare la pagina da destra a sinistra, i fogli usano proprietà logiche (`margin-inline-start`, `inset-inline-end`, `padding-block`…) e i token non dicono più «sinistra» o «destra»: `--f-cursore-margine-inizio`, `--impulso-margine-inizio`, `--luce-inizio`, `--luce-inizio-medio`, `--tratto-scena-notte-spazio-inizio` e `-fine` (prima `-sinistra` e `-destra`). Le 11 scorciatoie con il lato sinistro diverso dal destro (`padding: 0 24px 0 8px`) sono due token, uno per l'altezza e uno per la riga: `--pillola-spazio-interno-2-blocco` (alto e basso) e `--pillola-spazio-interno-2-inline` (inizio e fine, nell'ordine: `8px 24px`). `--verso` è nuovo. I valori sono quelli di prima: in italiano la pagina è identica, pixel per pixel. `tools/css_logico.py` controlla che nessuna proprietà fisica, nessuna scorciatoia asimmetrica e nessun testo scritto nel CSS rientri.

Come leggere i nomi: i colori, i materiali e i ruoli del movimento hanno un nome per ruolo (`--bordo-cornice`, `--luce-voce-centro`, `--durata-pillola`). Una misura che sta
in un solo componente ha il nome del componente e della proprietà (`--bolla-corpo-spazio-interno`; con un suffisso quando cambia con la larghezza: `-telefono`, `-medio`,
`-basso-802`…). Un valore uguale che compare in più componenti nella stessa famiglia (grandezze e interlinee del testo, raggi, spazi, misure) è un **gradino di scala**
numerato in ordine di valore (`--corpo-7`, `--spazio-12`): il numero è il posto nella scala, non il valore, e il ruolo sta nell'elenco degli usi qui sotto.


## Direzione di scrittura (1)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--verso` | `1` | 1 con la scrittura da sinistra a destra, −1 da destra a sinistra: la cambia `:root:dir(rtl)` (token.css), cioè `<html dir="rtl">`. Ciò che ha un verso la moltiplica; `scena.js` la legge con `Testi.verso()` | usato da `componenti/riunione-ferma.css` (pagine interne); `scena.js` la legge e per ora non la usa: l'elenco dei punti della home che hanno un verso è in `design/lavoro/1-lingue-sito/versi.md` |

## Colori e materiali (128)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--azione` | `#ff5c8d` | l'unico colore di ciò che si preme per scegliere | 0 usi:  |
| `--fondo` | `#420017` | la stanza: il fondo di tutta la pagina | 0 usi:  |
| `--scuro` | `#26060f` | testo scuro sul chiaro (bolla, occhi e bocca delle figure) | 0 usi:  |
| `--bordeaux` | `#5b0123` | testo e segni scuri sul chiaro; capelli di Paola | 1 uso: `.paola` capelli |
| `--magenta` | `#c50f56` | la voce dentro la bolla; cuffia di Luca; maglia di Anna | 2 usi: `.luca` cuffia; `.anna` corpo |
| `--rosa` | `#e3718a` | il bordo che risponde al passaggio sulle voci; maglia di Paola | 1 uso: `.paola` corpo |
| `--voce` | `#ffdbe1` | la voce che suona: contorni, barre di «Tu», tappe accese, maglia di Luca | 1 uso: `.luca` corpo |
| `--testo` | `#ffedef` | il testo e la voce chiara: bolla, pillola chiara, fine della scena chiara | 1 uso: `.scena-chiara` background |
| `--barra-piena` | `#2e0010` | la barra compatta e la fascia della riunione agganciata: piene, senza sfocatura | 5 usi in 2 componenti: `.barra.compatta` background; `.barra.compatta` box-shadow; `html:not(.js) .barra` background; +2 |
| `--bordo-barra` | `rgba(255, 219, 225, 0.1)` | il filo sotto la barra compatta e sotto la fascia agganciata | 3 usi in 2 componenti: `.barra.compatta` box-shadow; `html:not(.js) .barra` box-shadow; `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--pannello-menu` | `rgba(28, 3, 11, 0.94)` | il menu aperto | 1 uso: `.js .menu.aperto` background ((max-width: 959px)) |
| `--pannello-menu-fondo` | `rgba(28, 3, 11, 0.98)` | il velo sul fondo del menu che scorre | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--pannello-trasparente` | `rgba(28, 3, 11, 0)` | il pannello a zero: inizio del velo sul fondo del menu | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--velo-menu-premuto` | `rgba(255, 237, 239, 0.18)` | una voce del menu premuta | 1 uso: `.menu a:active` background |
| `--velo-menu-sopra` | `rgba(255, 237, 239, 0.1)` | una voce del menu al passaggio | 1 uso: `.menu a:hover` background |
| `--velo-scelto` | `rgba(255, 237, 239, 0.14)` | una frase attiva, «Menu» al passaggio | 2 usi in 2 componenti: `.pulsante-menu:hover` background; `.frase[aria-current="true"]` background |
| `--azione-sopra` | `#ff7ba3` | l'azione al passaggio | 1 uso: `.pillola.azione:hover` background |
| `--azione-testo` | `#33040f` | il testo sull'azione | 1 uso: `.pillola.azione` color |
| `--bianco` | `#fff` | il bianco: pillola chiara al passaggio, impulso, testo sui comandi della finestra | 5 usi in 4 componenti: `.pillola.voce-chiara:hover` background; `.f-parla` color; `.f-primario` color; +2 |
| `--bordo-comando-quieto` | `rgba(255, 219, 225, 0.35)` | il bordo di un comando secondario: «Chiudi», «Rivedi» | 2 usi: `.chiudi` border; `.rivedi` border |
| `--bordo-rivedi-chiaro` | `rgba(91, 1, 35, 0.35)` | il bordo di «Rivedi» sulla scena chiara | 1 uso: `.scena-chiara .rivedi` border-color |
| `--ombra-azione` | `rgba(255, 92, 141, 0.7)` | l'ombra dell'azione | 1 uso: `.pillola.azione` box-shadow |
| `--sottolineatura` | `rgba(255, 219, 225, 0.55)` | la sottolineatura dei collegamenti | 2 usi in 2 componenti: `.collegamento` text-decoration-color; `.scarica-file` text-decoration-color |
| `--bordo-evidente` | `rgba(255, 219, 225, 0.4)` | il bordo che si nota: la riga dello stato, il messaggio d'errore, l'alone di una frase in voce | 3 usi in 3 componenti: `.stato` border-inline-start; `.errore-ascolto` border; `.messaggio.in-voce .filo-bolla .bol…` box-shadow |
| `--testo-didascalia` | `rgba(255, 237, 239, 0.78)` | la didascalia e il titolo del microfono | 2 usi in 2 componenti: `.didascalia` color; `.microfono-titolo` color |
| `--testo-spiegazione` | `rgba(255, 237, 239, 0.88)` | la spiegazione sotto un titolo: stato, testo del tratto, esiti | 3 usi in 3 componenti: `.stato` color; `.esito p` color; `.tratto-testo p` color |
| `--ombra-bolla` | `rgba(20, 2, 8, 0.85)` | ombra della bolla | 3 usi in 2 componenti: `.bolla-corpo` box-shadow; `.messaggio.in-voce .filo-bolla .bol…` box-shadow; `.messaggio.in-pausa .filo-bolla .bo…` box-shadow |
| `--alone-tu` | `rgba(255, 219, 225, 0.8)` | l'alone di chi parla | 1 uso: `.alone` box-shadow |
| `--anna-capelli` | `#8a1a42` | Anna: capelli | 1 uso: `.anna` capelli |
| `--anna-corpo` | `var(--magenta)` | anna: corpo | 1 uso: `.anna` corpo |
| `--anna-fondo-alto` | `#a62a58` | Anna: fondo del riquadro, alto | 1 uso: `.anna` background |
| `--anna-fondo-basso` | `#701537` | Anna: fondo del riquadro, basso | 1 uso: `.anna` background |
| `--anna-ombra` | `#dc93a3` | Anna: collo e ombre | 1 uso: `.anna` ombra |
| `--anna-pelle` | `#efb4c0` | Anna: pelle | 1 uso: `.anna` pelle |
| `--barre-spente` | `#7e1840` | le barre della voce quando nessuno parla | 1 uso: `.barre i` background |
| `--bordo-cornice` | `rgba(255, 219, 225, 0.14)` | il bordo di una cornice della riunione e il filo sopra il piede | 4 usi in 2 componenti: `.chiamata` border; `.riunione-filo` border; `.tavolo-cornice` border; +1 |
| `--luca-capelli` | `#2c0612` | Luca: capelli | 1 uso: `.luca` capelli |
| `--luca-corpo` | `var(--voce)` | luca: corpo | 1 uso: `.luca` corpo |
| `--luca-cuffia` | `var(--magenta)` | luca: cuffia | 1 uso: `.luca` cuffia |
| `--luca-fondo-alto` | `#771838` | Luca: fondo del riquadro, alto | 1 uso: `.luca` background |
| `--luca-fondo-basso` | `#4f0a25` | Luca: fondo del riquadro, basso | 1 uso: `.luca` background |
| `--luca-ombra` | `#e6aab6` | Luca: collo e ombre | 1 uso: `.luca` ombra |
| `--luca-pelle` | `#f8d0d7` | Luca: pelle | 1 uso: `.luca` pelle |
| `--ombra-banda` | `rgba(0, 0, 0, 0.8)` | ombra della fascia agganciata | 1 uso: `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--ombra-cornice` | `rgba(10, 0, 4, 0.9)` | ombra di una cornice o di un pannello | 3 usi in 2 componenti: `.chiamata` box-shadow; `.tavolo-cornice` box-shadow; `.ascolto` box-shadow |
| `--ombra-nera` | `rgba(0, 0, 0, 0.9)` | ombra della riunione accanto al filo | 1 uso: `.riunione-filo` box-shadow |
| `--paola-capelli` | `var(--bordeaux)` | paola: capelli | 1 uso: `.paola` capelli |
| `--paola-corpo` | `var(--rosa)` | paola: corpo | 1 uso: `.paola` corpo |
| `--paola-fondo-alto` | `#902149` | Paola: fondo del riquadro, alto | 1 uso: `.paola` background |
| `--paola-fondo-basso` | `#5f0f2d` | Paola: fondo del riquadro, basso | 1 uso: `.paola` background |
| `--paola-ombra` | `#e2a1ae` | Paola: collo e ombre | 1 uso: `.paola` ombra |
| `--paola-pelle` | `#f4c2cb` | Paola: pelle | 1 uso: `.paola` pelle |
| `--tu-fondo-alto` | `#3a0816` | il riquadro «Tu»: parte alta del fondo | 1 uso: `.riquadro.tu` background |
| `--tu-fondo-basso` | `#24040d` | il riquadro «Tu»: parte bassa del fondo | 1 uso: `.riquadro.tu` background |
| `--vetro-cornice` | `rgba(18, 2, 7, 0.42)` | la cornice della riunione | 2 usi: `.chiamata` background; `.tavolo-cornice` background |
| `--vetro-nome` | `rgba(20, 2, 8, 0.52)` | l'etichetta di un riquadro | 1 uso: `.nome` background |
| `--vetro-riunione-filo` | `rgba(18, 2, 7, 0.6)` | la riunione accanto al filo | 1 uso: `.riunione-filo` background |
| `--app-accento` | `#005fb8` | l'accento della finestra: «Parla», riga attiva, barra di avanzamento | 4 usi: `.f-campo.fuoco` border-bottom; `.f-parla.attivo` background; `.f-barra i` background; +1 |
| `--app-accento-premuto` | `#004c94` | l'accento premuto | 1 uso: `.f-primario.premuto` background |
| `--app-barra-vuota` | `#e2e2e2` | la barra di avanzamento vuota | 1 uso: `.f-barra` background |
| `--app-bordo-attivo` | `#d0d0d0` | il bordo dei comandi chiari attivi | 2 usi: `.f-ferma.attivo, .f-ferma:enabled` border-color; `.f-annulla` border-color |
| `--app-bordo-forte` | `#c9c9c9` | il bordo basso del campo e di «Ferma» spento | 2 usi: `.f-campo` border-bottom-color; `.f-ferma` border-color |
| `--app-campo` | `#fdfdfd` | il campo di testo e i comandi chiari | 3 usi: `.f-campo` background; `.f-ferma.attivo, .f-ferma:enabled` background; `.f-annulla` background |
| `--app-campo-bordo` | `#e3e3e3` | il bordo del campo di testo | 1 uso: `.f-campo` border |
| `--app-ferma-fondo` | `#f9f9f9` | «Ferma» spento: fondo | 1 uso: `.f-ferma` background |
| `--app-ferma-sopra` | `#f3f3f3` | «Ferma» al passaggio | 1 uso: `button.f-ferma:enabled:hover` background |
| `--app-ferma-testo` | `#a0a0a0` | «Ferma» spento: testo | 1 uso: `.f-ferma` color |
| `--app-fondo` | `#fafafa` | la finestra di Kalliope: fondo | 1 uso: `.finestra` background |
| `--app-nota` | `#555` | la nota nella finestra del primo avvio | 1 uso: `.avvio .f-nota` color |
| `--app-parla-spento` | `#c3c3c3` | «Parla» non disponibile | 1 uso: `.f-parla` background |
| `--app-segnaposto` | `#656565` | il testo suggerito del campo | 1 uso: `.f-segnaposto` color |
| `--app-stato` | `#eef3fb` | la riga di stato della finestra | 1 uso: `.f-stato` background |
| `--app-stato-allarme` | `#fff4e5` | la riga di stato in allarme (variante definita, non usata dalla pagina) | 1 uso: `.f-stato.allarme` background |
| `--app-stato-parla` | `#e8f5e9` | la riga di stato mentre parla | 1 uso: `.f-stato.parla` background |
| `--app-testo` | `#1d1d1f` | la finestra di Kalliope: testo e cursore | 4 usi: `.finestra` color; `.f-cursore` background; `.f-ferma.attivo, .f-ferma:enabled` color; +1 |
| `--finestra-anello` | `rgba(0, 0, 0, 0.06)` | il filo intorno alla finestra di Kalliope | 1 uso: `.finestra` box-shadow |
| `--finestra-chiara-anello` | `rgba(91, 1, 35, 0.08)` | il filo intorno alla finestra sulla scena chiara | 1 uso: `.scena-chiara .finestra` box-shadow |
| `--ombra-finestra` | `rgba(10, 0, 4, 0.85)` | ombra della finestra di Kalliope | 1 uso: `.finestra` box-shadow |
| `--ombra-finestra-chiara` | `rgba(91, 1, 35, 0.5)` | ombra della finestra sulla scena chiara | 1 uso: `.scena-chiara .finestra` box-shadow |
| `--testo-nota-chiara` | `rgba(38, 6, 15, 0.66)` | la nota sulla scena chiara | 1 uso: `.nota-ricostruzione` color |
| `--bordo-pannello` | `rgba(255, 219, 225, 0.2)` | il bordo di un pannello: scheda, menu aperto, computer, microfono | 4 usi in 4 componenti: `.microfono` border; `.ascolto` border; `.computer` border; +1 |
| `--bordo-sezione` | `rgba(255, 219, 225, 0.12)` | il filo che divide: tra «Non esiste» e la strada, intorno alla riunione ricostruita | 2 usi in 2 componenti: `.riunione-app` border; `.non-esiste` border-top |
| `--ombra-riunione-app` | `rgba(70, 0, 25, 0.75)` | ombra della riunione ricostruita | 1 uso: `.riunione-app` box-shadow |
| `--riquadro-scuro` | `#2a0510` | il nodo della strada e la finestra della riunione ricostruita | 3 usi in 2 componenti: `.riunione-app` background; `.nodo` background; `.js .tappa.fatta:not(.acceso) .nodo` background |
| `--velo-comando` | `rgba(255, 237, 239, 0.08)` | il fondo di un comando: voce, «Menu», microfono | 2 usi in 2 componenti: `.microfono` background; `.pulsante-menu` background ((max-width: 959px)) |
| `--velo-puntata` | `rgba(255, 237, 239, 0.2)` | la scelta del microfono puntata | 1 uso: `.scelta.puntata` background |
| `--alone-forte` | `rgba(255, 219, 225, 0.7)` | un alone netto: impulso, voce scelta, tratteggio dei «forse» | 3 usi in 2 componenti: `.voce[aria-pressed="true"]` box-shadow; `.impulso` box-shadow; `.esito-forse h3::before` background |
| `--bordo-frase` | `rgba(255, 219, 225, 0.22)` | il bordo di una frase | 1 uso: `.frase` border |
| `--bordo-voce` | `rgba(255, 219, 225, 0.34)` | il bordo di una voce a riposo | 1 uso: `.voce` border |
| `--frase-punto` | `rgba(255, 219, 225, 0.45)` | il punto di una frase non ancora suonata | 1 uso: `.frase::before` background |
| `--pannello-ascolto` | `rgba(28, 3, 11, 0.72)` | la scheda dell'ascolto | 1 uso: `.ascolto` background |
| `--tratteggio` | `rgba(255, 219, 225, 0.6)` | il tratteggio di «non ancora» (linea e pulsazione) | 2 usi in 2 componenti: `@keyframes pulsa 0%, 100%` box-shadow; `.linea-forse` background ((max-width: 760px)) |
| `--velo-sopra` | `rgba(255, 237, 239, 0.06)` | una voce al passaggio | 1 uso: `.voce:hover, .voce:focus-visible` background |
| `--voce-trasparente` | `rgba(255, 219, 225, 0)` | la voce a zero: fine di un alone che si spegne | 1 uso: `@keyframes pulsa 50%` box-shadow |
| `--pannello-errore` | `rgba(28, 3, 11, 0.78)` | il messaggio d'errore (fuori dalla scheda) | 1 uso: `.errore-ascolto` background |
| `--fondo-trasparente` | `rgba(66, 0, 23, 0)` | il fondo a zero: fine di ogni luce che sfuma | 6 usi in 2 componenti: `.ascolto-voce .luce-filo` background; `.luce` background; `.luce-voce` background; +3 |
| `--luce-filo-bordo` | `rgba(197, 15, 86, 0.16)` | la luce del filo: a metà | 1 uso: `.ascolto-voce .luce-filo` background |
| `--luce-filo-centro` | `rgba(255, 92, 141, 0.42)` | la luce del filo: centro | 1 uso: `.ascolto-voce .luce-filo` background |
| `--testo-durata` | `rgba(255, 237, 239, 0.7)` | la durata di una frase | 1 uso: `.durata` color |
| `--testo-nota` | `rgba(255, 237, 239, 0.82)` | una nota sotto una frase e il testo di «Non esiste» | 2 usi in 2 componenti: `.detto-riga` color; `.non-esiste p` color |
| `--tratto-lieve` | `rgba(255, 219, 225, 0.5)` | sottolineatura di «altra voce» e alone della linea fatta | 2 usi in 2 componenti: `.altra-voce` text-decoration-color; `.linea-fatta` box-shadow |
| `--bordo-comando` | `rgba(255, 219, 225, 0.3)` | il bordo di un comando: «Menu», nodo della strada | 3 usi in 2 componenti: `.nodo` border; `.js .tappa.fatta:not(.acceso) .nodo` border-color; `.pulsante-menu` border ((max-width: 959px)) |
| `--bordo-tappa-forse` | `rgba(255, 219, 225, 0.42)` | la tappa «forse»: bordo tratteggiato, e l'alone della tappa accesa | 2 usi: `.tappa.forse .nodo` border-color; `.tappa.fatta.acceso .nodo` box-shadow |
| `--bordo-tappa-raggiunta` | `rgba(255, 219, 225, 0.75)` | la tappa «forse» quando la voce ci arriva | 1 uso: `.tappa.forse.raggiunta .nodo` border-color |
| `--bordo-voce-vecchio` | `rgba(255, 219, 225, 0.28)` | il bordo di una voce (primo disegno; la pagina ora usa quello sotto) | 1 uso: `.impulso` box-shadow |
| `--riquadro-scuro-forse` | `rgba(42, 5, 16, 0.6)` | il nodo «forse» | 1 uso: `.tappa.forse .nodo` background |
| `--testo-forte` | `rgba(255, 237, 239, 0.9)` | la riga sulla riservatezza | 1 uso: `.riservato` color |
| `--testo-secondario` | `rgba(255, 237, 239, 0.8)` | testo di sostegno: piede, nome del computer, tappa «forse» | 3 usi in 2 componenti: `.computer-nome` color; `.tappa.forse .tappa-nome` color; `.piede p` color |
| `--testo-spento` | `rgba(255, 237, 239, 0.6)` | il segno di una tappa non accesa | 2 usi: `.nodo` color; `.js .tappa.fatta:not(.acceso) .nodo` color |
| `--velo-computer` | `rgba(255, 237, 239, 0.035)` | il computer della strada | 1 uso: `.computer` background |
| `--bianco-trasparente` | `rgba(255, 255, 255, 0)` | il bianco a zero: fine della luce della scena chiara | 1 uso: `.scena-chiara .luce-tratto` background |
| `--chiara-fondo-basso` | `#fcdce2` | la scena chiara: parte bassa del fondo | 1 uso: `.scena-chiara` background |
| `--luce-chiara-bordo` | `rgba(255, 255, 255, 0.3)` | la luce della scena chiara: a metà | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-chiara-centro` | `rgba(255, 255, 255, 0.85)` | la luce della scena chiara: centro | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-chiusa-bordo` | `rgba(197, 15, 86, 0.2)` | la luce della chiusura: a metà | 1 uso: `.chiusura .luce-chiusa` background |
| `--luce-chiusa-centro` | `rgba(255, 92, 141, 0.5)` | la luce della chiusura: centro | 1 uso: `.chiusura .luce-chiusa` background |
| `--luce-stanza-bordo` | `rgba(137, 26, 62, 0.3)` | la luce della stanza: a metà | 2 usi: `.luce` background; `.chiusura .luce-tratto` background |
| `--luce-stanza-centro` | `rgba(197, 15, 86, 0.62)` | la luce della stanza: centro | 2 usi: `.luce` background; `.chiusura .luce-tratto` background |
| `--luce-tratto-bordo` | `rgba(137, 26, 62, 0.15)` | la luce di un tratto: a metà | 1 uso: `.luce-tratto` background |
| `--luce-tratto-centro` | `rgba(197, 15, 86, 0.36)` | la luce di un tratto: centro | 1 uso: `.luce-tratto` background |
| `--luce-voce-bordo` | `rgba(197, 15, 86, 0.22)` | la luce che segue la voce: a metà | 1 uso: `.luce-voce` background |
| `--luce-voce-centro` | `rgba(255, 92, 141, 0.55)` | la luce che segue la voce: centro | 1 uso: `.luce-voce` background |
| `--notte` | `#24040e` | la scena «notte» (il filo) e il piede | 1 uso: `.scena-notte` background |
| `--requisito-traccia` | `rgba(91, 1, 35, 0.16)` | la traccia di un requisito | 1 uso: `.requisiti li::before` background |
| `--testo-avvertenza` | `rgba(255, 237, 239, 0.72)` | l'avvertenza | 1 uso: `.avvertenza` color |
| `--testo-avvertenza-chiusura` | `rgba(255, 237, 239, 0.66)` | l'avvertenza della chiusura | 1 uso: `.chiusura .avvertenza` color |
| `--testo-dettaglio` | `rgba(255, 237, 239, 0.86)` | il dettaglio che chiude (i fatti) | 1 uso: `.fatti` color |
| `--testo-requisiti-chiara` | `rgba(38, 6, 15, 0.86)` | i requisiti sulla scena chiara | 1 uso: `.requisiti li` color |

## Caratteri (2)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--font-testo` | `"Lexend", "Lexend riserva", system-ui, sans-serif` | il carattere di tutta la pagina, con il suo ripiego di larghezza | 1 uso: `body` font-family |
| `--font-app` | `"DejaVu Sans Kalliope", "DejaVu Sans", sans-serif` | il carattere della finestra di Kalliope ricostruita | 1 uso: `.finestra` font-family |

## Pesi (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--peso-forte` | `600` | comandi e parole che contano | 17 usi in 11 componenti: `.salta` font-weight; `.pillola` font-weight; `.chiudi` font-weight; +14 |
| `--peso-testo` | `400` | il testo corrente | 1 uso: `body` font-weight |
| `--peso-medio` | `500` | testo con un po' di peso: menu, bolla, nome | 6 usi in 6 componenti: `.menu a` font-weight; `.collegamento` font-weight; `.bolla-testo` font-weight; +3 |
| `--peso-titolo` | `700` | titoli | 4 usi in 4 componenti: `.marchio` font-weight; `h1` font-weight; `.esito h3` font-weight; +1 |

## Scala del testo (55)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--corpo-1` | `10px` | gradino di scala (corpo): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo .nome` font-size ((max-width: 760px)); `.tavolo .nome` font-size ((max-width: 760px)); `.app-griglia .nome` font-size ((max-width: 760px)) |
| `--corpo-2` | `11px` | gradino di scala (corpo): lo stesso valore in più componenti | 2 usi in 2 componenti: `.nome` font-size ((max-width: 760px)); `.sotto .finestra` font-size ((max-width: 760px)) |
| `--corpo-3` | `12px` | gradino di scala (corpo): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riunione-filo .nome` font-size; `.app-griglia .nome` font-size; `.didascalia` font-size ((max-width: 760px)); +1 |
| `--corpo-4` | `13px` | gradino di scala (corpo): lo stesso valore in più componenti | 12 usi in 6 componenti: `.didascalia` font-size; `.nome` font-size; `.avvio .f-nota` font-size; +9 |
| `--corpo-5` | `14px` | gradino di scala (corpo): lo stesso valore in più componenti | 10 usi in 6 componenti: `.finestra` font-size; `.frase` font-size; `.palco.compatta .ascolto .riprova` font-size; +7 |
| `--corpo-6` | `15px` | gradino di scala (corpo): lo stesso valore in più componenti | 16 usi in 10 componenti: `.barra .barra-azione` font-size; `.chiudi` font-size; `.rivedi` font-size; +13 |
| `--corpo-7` | `16px` | gradino di scala (corpo): lo stesso valore in più componenti | 9 usi in 6 componenti: `.menu a` font-size; `.voce` font-size; `.messaggio-sotto .pillola` font-size; +6 |
| `--corpo-8` | `17px` | gradino di scala (corpo): lo stesso valore in più componenti | 7 usi in 5 componenti: `.collegamento` font-size; `.tappa-nome` font-size; `.esito p` font-size; +4 |
| `--corpo-9` | `18px` | gradino di scala (corpo): lo stesso valore in più componenti | 7 usi in 5 componenti: `.pillola` font-size; `.non-esiste p` font-size; `.riservato` font-size; +4 |
| `--corpo-10` | `20px` | gradino di scala (corpo): lo stesso valore in più componenti | 6 usi in 5 componenti: `.presentazione` font-size; `.tratto-testo p` font-size; `.requisiti li` font-size; +3 |
| `--corpo-11` | `22px` | gradino di scala (corpo): lo stesso valore in più componenti | 5 usi in 4 componenti: `.marchio` font-size; `.bolla-chiusa .bolla-testo` font-size; `.filo-bolla .bolla-testo` font-size; +2 |
| `--corpo-12` | `25px` | gradino di scala (corpo): lo stesso valore in più componenti | 1 uso: `h1` font-size ((min-width: 350px) and (max-wi) |
| `--interlinea-1` | `13px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo .nome` line-height ((max-width: 760px)); `.tavolo .nome` line-height ((max-width: 760px)); `.app-griglia .nome` line-height ((max-width: 760px)) |
| `--interlinea-2` | `16px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .nome` line-height; `.app-griglia .nome` line-height |
| `--interlinea-3` | `18px` | gradino di scala (interlinea): lo stesso valore in più componenti | 4 usi in 3 componenti: `.nome` line-height; `.palco.compatta .ascolto-dentro > .…` line-height; `.stato` line-height ((max-width: 760px)); +1 |
| `--interlinea-4` | `19px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.didascalia` line-height; `.nota-ricostruzione` line-height |
| `--interlinea-5` | `21px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.chiusura .avvertenza` line-height; `.bolla-testo` line-height ((max-width: 760px)) |
| `--interlinea-6` | `22px` | gradino di scala (interlinea): lo stesso valore in più componenti | 5 usi in 4 componenti: `.stato` line-height; `.errore-ascolto` line-height; `.piede p` line-height; +2 |
| `--interlinea-7` | `24px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.detto-riga` line-height; `.filo-bolla .bolla-testo` line-height ((max-width: 760px)); `.riservato` line-height ((max-width: 760px)) |
| `--interlinea-8` | `26px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.esito p` line-height; `.fatti` line-height |
| `--interlinea-9` | `27px` | gradino di scala (interlinea): lo stesso valore in più componenti | 5 usi in 4 componenti: `.non-esiste p` line-height; `.riservato` line-height; `.presentazione` line-height ((min-width: 1000px) and (max-w); +2 |
| `--interlinea-10` | `28px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 3 componenti: `.esito h3` line-height; `.bolla-testo` line-height ((min-width: 761px) and (max-he); `.messaggio[data-frase="3"] .filo-bo…` line-height ((max-width: 760px)) |
| `--interlinea-11` | `29px` | gradino di scala (interlinea): lo stesso valore in più componenti | 1 uso: `h1` line-height ((min-width: 350px) and (max-wi) |
| `--interlinea-12` | `30px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.presentazione` line-height; `.tratto-testo p` line-height; `.requisiti li` line-height |
| `--interlinea-13` | `31px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.bolla-chiusa .bolla-testo` line-height; `.filo-bolla .bolla-testo` line-height; `.messaggio[data-frase="3"] .filo-bo…` line-height ((min-width: 761px) and (max-wi) |
| `--interlinea-14` | `37px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.messaggio[data-frase="3"] .filo-bo…` line-height; `.tratto h2` line-height ((max-width: 760px)) |
| `--spaziatura-marchio` | `-0.01em` | misura del componente «Barra e menu» | 1 uso: `.marchio` letter-spacing |
| `--didascalia-interlinea-telefono` | `17px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` line-height ((max-width: 760px)) |
| `--h1-grandezza` | `62px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size |
| `--h1-grandezza-medio` | `48px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size ((min-width: 1000px) and (max-w) |
| `--h1-grandezza-telefono` | `30px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size ((max-width: 760px)) |
| `--h1-interlinea` | `64px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height |
| `--h1-interlinea-medio` | `51px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height ((min-width: 1000px) and (max-w) |
| `--h1-interlinea-telefono` | `33px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height ((max-width: 760px)) |
| `--spaziatura-h1` | `-0.018em` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` letter-spacing |
| `--stato-grandezza-telefono` | `12.5px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` font-size ((max-width: 760px)) |
| `--bolla-testo-grandezza` | `24px` | misura del componente «La bolla» | 1 uso: `.bolla-testo` font-size |
| `--bolla-testo-interlinea` | `34px` | misura del componente «La bolla» | 1 uso: `.bolla-testo` line-height |
| `--spaziatura-bolla-testo` | `-0.005em` | misura del componente «La bolla» | 1 uso: `.bolla-testo` letter-spacing |
| `--nome-interlinea-telefono` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` line-height ((max-width: 760px)) |
| `--f-stato-interlinea` | `1.32` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-stato` line-height |
| `--microfono-grandezza-telefono` | `11.5px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` font-size ((max-width: 760px)) |
| `--filo-bolla-bolla-testo-grandezza-2` | `27px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio[data-frase="3"] .filo-bo…` font-size |
| `--filo-bolla-bolla-testo-grandezza-tavoletta-filo` | `19px` | misura del componente «Le frasi del filo» | 1 uso: `.filo-bolla .bolla-testo` font-size ((min-width: 761px) and (max-wi) |
| `--spaziatura-computer-nome` | `0.01em` | misura del componente «La strada della voce» | 1 uso: `.computer-nome` letter-spacing |
| `--tappa-nome-interlinea` | `23px` | misura del componente «La strada della voce» | 1 uso: `.tappa-nome` line-height |
| `--chiusura-grandezza` | `64px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` font-size |
| `--chiusura-grandezza-telefono` | `38px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` font-size ((max-width: 760px)) |
| `--chiusura-interlinea` | `68px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` line-height |
| `--chiusura-interlinea-telefono` | `42px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` line-height ((max-width: 760px)) |
| `--spaziatura-tratto` | `-0.018em` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` letter-spacing |
| `--tratto-grandezza` | `52px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` font-size |
| `--tratto-grandezza-telefono` | `33px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` font-size ((max-width: 760px)) |
| `--tratto-interlinea` | `56px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` line-height |
| `--tratto-testo-interlinea-telefono` | `25px` | misura del componente «Tratti e scene» | 1 uso: `.tratto-testo p` line-height ((max-width: 760px)) |

## Spazi (scala a gradini) (12)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--spazi-1` | `0 10px` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.f-campo` padding; `.palco.compatta .ascolto .frase` padding; `.ascolto .frase` padding ((min-width: 761px) and (max-he) |
| `--spazi-2` | `0 14px` | gradino di scala (spazi): lo stesso valore in più componenti | 4 usi in 3 componenti: `.f-primario` padding; `.frase` padding; `.barra .barra-azione` padding ((max-width: 760px)); +1 |
| `--spazi-3` | `0 18px` | gradino di scala (spazi): lo stesso valore in più componenti | 5 usi in 3 componenti: `.chiudi` padding; `.rivedi` padding; `.palco.compatta .ascolto .riprova` padding; +2 |
| `--spazi-4` | `0 20px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra .barra-azione` padding; `.riprova` padding |
| `--spazi-5` | `0 4px` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.collegamento` padding; `.palco.compatta .ascolto-dentro > .…` padding; `.ascolto-dentro > .errore-ascolto` padding ((min-width: 761px) and (max-he) |
| `--spazi-6` | `1px 6px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.riunione-filo .nome` padding ((max-width: 760px)); `.tavolo .nome` padding ((max-width: 760px)) |
| `--spazi-7` | `2px 16px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.palco.compatta .ascolto-dentro > .…` gap; `.ascolto-dentro > .errore-ascolto .…` gap ((min-width: 761px) and (max-he) |
| `--spazi-8` | `3px 9px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .nome` padding; `.app-griglia .nome` padding |
| `--spazi-9` | `6px 7px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.palco.compatta .ascolto-dentro` padding; `.ascolto-dentro` padding ((min-width: 761px) and (max-he) |
| `--spazi-10` | `18px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.nota-ricostruzione` margin; `.avvio-piede .nota-ricostruzione` margin; `.tratto-testo p` margin |
| `--spazi-11` | `26px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.didascalia` margin; `.riservato` margin ((max-width: 760px)) |
| `--spazi-12` | `30px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.requisiti` margin; `.fatti` margin |

## Misure (265)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--margine` | `80px` |  | 0 usi:  |
| `--raggio-scena` | `48px` |  | 0 usi:  |
| `--sovrap` | `40vh` |  | 0 usi:  |
| `--misura-1` | `1px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.solo-lettori` width; `.solo-lettori` height; `.f-cursore` width |
| `--misura-2` | `4px` | gradino di scala (misura): lo stesso valore in più componenti | 8 usi in 3 componenti: `.linea` height; `.esito h3::before` height; `.requisiti li::before, .requisiti l…` width; +5 |
| `--misura-3` | `7px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi in 2 componenti: `.app-griglia .barre i` width; `.palco.compatta .ascolto .frase::be…` width; `.palco.compatta .ascolto .frase::be…` height; +2 |
| `--misura-4` | `8px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.f-barra` height; `.frase::before` width; `.frase::before` height |
| `--misura-5` | `10px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.tavolo .barre i` width; `.frase.carica::before` width; `.frase.carica::before` height |
| `--misura-6` | `12px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.suona .voce-tondo::before` width; `.suona-frase.suona .tondo::before` width |
| `--misura-7` | `14px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.suona .voce-tondo::before` height; `.suona-frase.suona .tondo::before` height |
| `--misura-8` | `16px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.collegamento .freccia` width; `.collegamento .freccia` height |
| `--misura-9` | `18px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 3 componenti: `.f-cursore` height; `.impulso` width; `.impulso` height; +1 |
| `--misura-10` | `22px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.app-icona` width ((max-width: 760px)); `.app-icona` height ((max-width: 760px)) |
| `--misura-11` | `24px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.bolla .coda` height; `.bolla .coda` width ((max-width: 760px)) |
| `--misura-12` | `26px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.riunione-filo .barre` height ((max-width: 760px)); `.tavolo .barre` height ((max-width: 760px)) |
| `--misura-13` | `28px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.app-icona` width; `.app-icona` height |
| `--misura-14` | `30px` | gradino di scala (misura): lo stesso valore in più componenti | 6 usi in 4 componenti: `.esito h3::before` width; `.marchio svg` width ((max-width: 760px)); `.marchio svg` height ((max-width: 760px)); +3 |
| `--misura-15` | `32px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.bolla .coda` width; `.f-campo` height; `.f-pulsante` height |
| `--misura-16` | `34px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.voce-tondo` width; `.voce-tondo` height |
| `--misura-17` | `36px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 2 componenti: `.marchio svg` width; `.marchio svg` height; `.palco.compatta .ascolto .frase` min-height; +1 |
| `--misura-18` | `38px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 2 componenti: `.messaggio-sotto .tondo` width; `.messaggio-sotto .tondo` height; `.tondo` width ((max-width: 760px)); +1 |
| `--misura-19` | `40px` | gradino di scala (misura): lo stesso valore in più componenti | 12 usi in 5 componenti: `.tondo` width; `.tondo` height; `.palco.compatta .ascolto .chiudi` min-height; +9 |
| `--misura-20` | `42px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi: `.frase` min-height; `.palco.compatta .ascolto .voce` min-height; `.ascolto .voce` min-height ((min-width: 761px) and (max-he) |
| `--misura-21` | `44px` | gradino di scala (misura): lo stesso valore in più componenti | 11 usi in 6 componenti: `.barra .barra-azione` min-height; `.marchio` min-height; `.menu a` min-height; +8 |
| `--misura-22` | `48px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi in 4 componenti: `.collegamento` min-height; `.messaggio-sotto .pillola` min-height; `.pillola.voce-chiara` min-height ((max-width: 760px)); +2 |
| `--misura-23` | `56px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.pillola` min-height; `.barra` height ((max-width: 760px)) |
| `--misura-24` | `58px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .barre` height; `.app-comandi` height |
| `--misura-25` | `76px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi: `.nodo` width ((max-width: 760px)); `.nodo` height ((max-width: 760px)); `.nodo-altri` width ((max-width: 760px)); +1 |
| `--misura-26` | `80px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi: `.nodo` width; `.nodo` height; `.scoppio` width; +2 |
| `--misura-27` | `108px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.posto-bolla` height ((max-width: 760px)); `.posto-bolla-chiusa` height ((max-width: 760px)) |
| `--misura-28` | `124px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.posto-bolla-chiusa` height; `.posto-bolla` height ((min-width: 761px) and (max-he) |
| `--misura-29` | `470px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi: `.finestra` width; `.nota-ricostruzione` max-width; `.avvio-piede .nota-ricostruzione` max-width |
| `--misura-30` | `520px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 4 componenti: `.presentazione` max-width; `.errore-ascolto` max-width; `.esito p` max-width; +1 |
| `--misura-31` | `620px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.finestra.avvio` max-width ((min-width: 761px) and (max-wi); `.ascolto-voce .tratto-testo > p` max-width ((min-width: 761px) and (max-wi) |
| `--misura-32` | `640px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.fatti` max-width; `.chiusura .avvertenza` max-width |
| `--misura-33` | `760px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riservato` max-width; `.palco` max-width ((min-width: 761px) and (max-wi); `.luce, .luce-voce` width ((max-width: 760px)); +1 |
| `--misura-34` | `1250px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.luce, .luce-voce` width; `.chiusura .luce-tratto` width |
| `--misura-35` | `1440px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra, .scena, .campioni, .oggi, .…` max-width; `.tratto` max-width |
| `--spazio-meno-3` | `-4px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.pausa .voce-tondo::after` inset; `.suona-frase.pausa .tondo::after` inset |
| `--spazio-meno-2` | `-5px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.voce.suona .voce-tondo::after` inset; `.voce.carica .voce-tondo::after` inset; `.suona-frase.carica .tondo::after` inset; +1 |
| `--spazio-meno-1` | `-22px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra .barra-azione` margin-top; `.riunione-app` margin-top |
| `--spazio-1` | `2px` | gradino di scala (spazio): lo stesso valore in più componenti | 6 usi in 3 componenti: `.menu ul` gap; `.microfono-scelte` gap; `.ascolto-dentro > .errore-ascolto` margin-top; +3 |
| `--spazio-2` | `3px` | gradino di scala (spazio): lo stesso valore in più componenti | 6 usi in 4 componenti: `.requisiti li::before, .requisiti l…` top; `.requisiti li::before, .requisiti l…` bottom; `.riunione-filo .barre` gap ((max-width: 760px)); +3 |
| `--spazio-3` | `4px` | gradino di scala (spazio): lo stesso valore in più componenti | 13 usi in 8 componenti: `.ascolto-dentro > .errore-ascolto .…` margin-top; `.scarica-file` text-underline-offset; `.messaggio-sotto` padding-inline-start; +10 |
| `--spazio-4` | `5px` | gradino di scala (spazio): lo stesso valore in più componenti | 12 usi in 2 componenti: `.app-griglia .barre` gap; `.chiamata` padding ((max-width: 760px)); `.griglia` gap ((max-width: 760px)); +9 |
| `--spazio-5` | `6px` | gradino di scala (spazio): lo stesso valore in più componenti | 19 usi in 6 componenti: `.collegamento` text-underline-offset; `.riunione-filo` padding; `.riunione-filo .griglia` gap; +16 |
| `--spazio-6` | `7px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.tavolo .barre` gap; `.riunione-app` padding; `.app-griglia .nome` inset-inline-start; +2 |
| `--spazio-7` | `8px` | gradino di scala (spazio): lo stesso valore in più componenti | 20 usi in 7 componenti: `.collegamento` gap; `.chiamata` padding; `.griglia` gap; +17 |
| `--spazio-8` | `10px` | gradino di scala (spazio): lo stesso valore in più componenti | 15 usi in 8 componenti: `.rivedi` margin-top; `.nome` inset-inline-start; `.nome` top; +12 |
| `--spazio-9` | `11px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.voce.suona .voce-tondo::before` left; `.messaggio-sotto .tondo::before` top; `.tondo::before` top ((max-width: 760px)) |
| `--spazio-10` | `12px` | gradino di scala (spazio): lo stesso valore in più componenti | 16 usi in 10 componenti: `.salta:focus` top; `.marchio` gap; `.pillola` gap; +13 |
| `--spazio-11` | `13px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce-tondo::before` left; `.suona-frase.suona .tondo::before` left |
| `--spazio-12` | `14px` | gradino di scala (spazio): lo stesso valore in più componenti | 12 usi in 7 componenti: `.stato` padding-inline-start; `.ascolto-dentro > .errore-ascolto` scroll-margin-bottom; `.ascolto` scroll-margin-bottom; +9 |
| `--spazio-13` | `15px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.tondo::before` left; `.bolla-vecchia` top |
| `--spazio-14` | `16px` | gradino di scala (spazio): lo stesso valore in più componenti | 10 usi in 7 componenti: `.salta` inset-inline-start; `.barra` gap; `.didascalia` padding-inline-start; +7 |
| `--spazio-15` | `18px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.bolla` bottom; `.computer-nome` top; `.messaggio:nth-child(2)` margin-inline-start ((max-width: 760px)); +2 |
| `--spazio-16` | `20px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi: `.apertura` padding-top ((min-width: 761px) and (max-wi); `.apertura .stato` margin-top ((min-width: 761px) and (max-he) |
| `--spazio-17` | `22px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 5 componenti: `.bolla-vecchia` inset-inline-start ((min-width: 1000px) and (max-w); `.computer-nome` inset-inline-start; `.requisiti` gap; +2 |
| `--spazio-18` | `24px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.messaggio:nth-child(2)` margin-inline-start ((min-width: 761px) and (max-wi); `.tappe` row-gap ((max-width: 760px)) |
| `--spazio-19` | `26px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.messaggio-sotto` margin-top; `.requisiti li` padding-inline-start; `.bolla .coda` inset-inline-start ((max-width: 760px)); +2 |
| `--spazio-20` | `30px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riunione-filo` margin-top; `.voci-filo` margin-top; `.non-esiste` padding-top; +1 |
| `--spazio-21` | `34px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.tavolo` margin-bottom ((max-width: 760px)); `.filo` row-gap ((max-width: 760px)); `.ascolto-voce, .serve` gap ((max-width: 760px)) |
| `--spazio-22` | `36px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.chiusura .comandi` margin-top; `.banda-riunione` margin-top ((min-width: 761px) and (max-wi); `.ascolto-voce` column-gap ((min-width: 761px) and (max-wi); +2 |
| `--spazio-23` | `38px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi: `.scoppio` inset-inline-start ((max-width: 760px)); `.scoppio` top ((max-width: 760px)) |
| `--spazio-24` | `40px` | gradino di scala (spazio): lo stesso valore in più componenti | 7 usi in 4 componenti: `.apertura` padding-top; `.bolla .coda` inset-inline-start; `.messaggi` gap; +4 |
| `--spazio-25` | `44px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.filo` column-gap; `.esiti` margin-top; `.non-esiste` margin-top ((max-width: 760px)) |
| `--spazio-26` | `48px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 3 componenti: `.esito-forse` padding-inline-start; `.chiamata .riquadro.tu .barre` top ((min-width: 761px) and (max-he); `.ascolto-voce, .serve` row-gap ((min-width: 761px) and (max-wi); +1 |
| `--spazio-27` | `54px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi: `.linea` inset-inline-start ((max-width: 760px)); `.linea-fatta` inset-inline-start ((max-width: 760px)); `.linea-forse` inset-inline-start ((max-width: 760px)) |
| `--spazio-28` | `56px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 5 componenti: `.messaggio:nth-child(2)` margin-inline-start; `.piede.scena-notte` padding-top; `.js .menu.aperto` top ((max-width: 760px)); +2 |
| `--spazio-29` | `60px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.scena` column-gap; `.strada` margin-top |
| `--spazio-30` | `80px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.ascolto-voce` column-gap; `.serve` column-gap |
| `--spazio-31` | `88px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `html` scroll-padding-top; `.linea` top ((max-width: 760px)) |
| `--spazio-32` | `100px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.ascolto-voce .tratto-testo` top; `.linea` top; `.banda-riunione` top ((min-width: 761px) and (max-wi) |
| `--fuoco-scarto` | `3px` | quanto il contorno del fuoco sta staccato dal comando | 1 uso: `:focus-visible` outline-offset |
| `--salta-sopra` | `-80px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` top |
| `--salta-spazio-interno` | `12px 18px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` padding |
| `--solo-lettori-margine` | `-1px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.solo-lettori` margin |
| `--barra-altezza` | `72px` | misura del componente «Barra e menu» | 1 uso: `.barra` height |
| `--barra-azione-largo-menu-base` | `92px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` inset-inline-end ((max-width: 959px)) |
| `--barra-azione-margine-sopra-telefono` | `-20px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` margin-top ((max-width: 760px)) |
| `--barra-azione-sposta-x` | `12px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transform |
| `--barra-compatto-ritaglio` | `inset(0 -100vmax -1px)` | misura del componente «Barra e menu» | 1 uso: `.barra.compatta` clip-path |
| `--barra-intervallo` | `0 24px` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` animation-range (@supports (animation-timeline:) |
| `--barra-menu-posto-azione-base` | `235px` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .menu` transform |
| `--barra-ritaglio` | `inset(0 -100vmax -1px)` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` clip-path |
| `--marchio-larghezza-massima` | `160px` | misura del componente «Barra e menu» | 1 uso: `.marchio span` max-width |
| `--menu-aperto-altezza-massima` | `calc(100vh - 84px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` max-height ((max-width: 959px)) |
| `--menu-aperto-altezza-massima-menu-chiuso` | `calc(100dvh - 84px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` max-height ((max-width: 959px)) |
| `--menu-aperto-altezza-minima` | `52px` | misura del componente «Barra e menu» | 1 uso: `.menu.aperto a` min-height ((max-width: 959px)) |
| `--menu-aperto-dopo-intervallo` | `0% calc(100% - 12px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` animation-range (@supports (animation-timeline:) |
| `--menu-aperto-dopo-margine-sopra` | `-40px` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` margin-top (@supports (animation-timeline:) |
| `--menu-aperto-larghezza` | `min(340px, calc(100vw - 2 * var(--margine)))` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` width ((min-width: 761px) and (max-wi) |
| `--menu-aperto-sfocatura` | `blur(18px)` | misura del componente «Barra e menu» | 2 usi: `.js .menu.aperto` -webkit-backdrop-filter ((max-width: 959px)); `.js .menu.aperto` backdrop-filter ((max-width: 959px)) |
| `--menu-aperto-sopra-tavoletta-stretta` | `calc(100% + 4px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` top ((min-width: 761px) and (max-wi) |
| `--menu-spazio-interno` | `0 16px` | misura del componente «Barra e menu» | 1 uso: `.menu a` padding |
| `--collegamento-freccia-sopra-sposta-x` | `4px` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento:hover .freccia, .coll…` transform |
| `--collegamento-sottolineatura-spessore` | `1.5px` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` text-decoration-thickness |
| `--pillola-spazio-interno` | `0 30px` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola` padding |
| `--pillola-spazio-interno-2-blocco` | `0` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.voce-chiara` padding-block |
| `--pillola-spazio-interno-2-inline` | `8px 24px` | misura del componente «Pulsanti e pillole», inizio e fine | 1 uso: `.pillola.voce-chiara` padding-inline |
| `--pillola-spazio-interno-telefono-blocco` | `0` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.voce-chiara` padding-block ((max-width: 760px)) |
| `--pillola-spazio-interno-telefono-inline` | `5px 20px` | misura del componente «Pulsanti e pillole», inizio e fine | 1 uso: `.pillola.voce-chiara` padding-inline ((max-width: 760px)) |
| `--tondo-prima-triangolo` | `14px` | misura del componente «Pulsanti e pillole» | 1 uso: `.tondo::before` border-left |
| `--tondo-prima-triangolo-2` | `8px` | misura del componente «Pulsanti e pillole» | 2 usi: `.tondo::before` border-top; `.tondo::before` border-bottom |
| `--comandi-distanza` | `10px 22px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi` gap |
| `--comandi-margine-sopra` | `32px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi` margin-top |
| `--didascalia-larghezza-massima` | `480px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` max-width |
| `--didascalia-margine-telefono` | `14px 0 6px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` margin ((max-width: 760px)) |
| `--presentazione-margine` | `24px 0 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` margin |
| `--scena-colonne` | `minmax(0, 560px) minmax(0, 1fr)` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` grid-template-columns |
| `--scena-spazio-interno` | `30px var(--margine) 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` padding |
| `--scena-spazio-interno-telefono` | `14px var(--margine) 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` padding ((max-width: 760px)) |
| `--stato-larghezza-massima` | `500px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` max-width |
| `--stato-margine` | `28px 0 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` margin |
| `--bolla-chiusa-larghezza-massima` | `min(600px, 100%)` | misura del componente «La bolla» | 1 uso: `.bolla-chiusa` max-width |
| `--bolla-coda-sopra` | `calc(100% - 1px)` | misura del componente «La bolla» | 1 uso: `.bolla .coda` top |
| `--bolla-corpo-spazio-interno` | `15px 22px 17px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding |
| `--bolla-corpo-spazio-interno-basso-699` | `12px 20px 14px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding ((min-width: 761px) and (max-he) |
| `--bolla-corpo-spazio-interno-telefono` | `10px 14px 12px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding ((max-width: 760px)) |
| `--posto-bolla-altezza` | `150px` | misura del componente «La bolla» | 1 uso: `.posto-bolla` height |
| `--anna-occhi-sposta-x` | `-3px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .occhi` transform |
| `--anna-occhi-sposta-y` | `-2.5px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .occhi` transform |
| `--anna-testa-sposta-x` | `-2px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--anna-testa-sposta-y` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--annuisce-25-sposta-y` | `3px` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes annuisce 25%` transform |
| `--annuisce-72-sposta-y` | `2px` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes annuisce 72%` transform |
| `--banda-riunione-margine` | `10px -20px 0` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` margin ((max-width: 760px)) |
| `--banda-riunione-spazio-interno` | `8px 20px 10px` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` padding ((max-width: 760px)) |
| `--barre-altezza` | `100px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre` height |
| `--barre-larghezza` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` width |
| `--barre-larghezza-telefono` | `6px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` width ((max-width: 760px)) |
| `--chiamata-altezza` | `362px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height |
| `--chiamata-altezza-basso-699` | `clamp(200px, calc(100vh - 336px), 362px)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((min-width: 761px) and (max-he) |
| `--chiamata-altezza-computer` | `clamp(190px, calc(100vh - 441px), 362px)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((min-width: 761px)) |
| `--chiamata-altezza-telefono` | `176px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((max-width: 760px)) |
| `--chiamata-nome-spazio-interno` | `4px 9px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata .nome` padding ((min-width: 1181px) and (max-w) |
| `--luca-occhi-sposta-x` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .occhi` transform |
| `--luca-occhi-sposta-y` | `-3px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .occhi` transform |
| `--luca-testa-sposta-y` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .testa` transform |
| `--nome-spazio-interno` | `4px 11px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` padding |
| `--nome-spazio-interno-telefono` | `2px 8px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` padding ((max-width: 760px)) |
| `--paola-occhi-sposta-x` | `-3.5px` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .occhi` transform |
| `--paola-testa-sposta-x` | `-2px` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .testa` transform |
| `--riquadro-barre-altezza` | `min(100px, 60%)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata .riquadro.tu .barre` height ((min-width: 761px)) |
| `--riunione-filo-altezza` | `248px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` height |
| `--riunione-filo-altezza-tavoletta-filo` | `clamp(214px, 26vw, 262px)` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` height ((min-width: 761px) and (max-wi) |
| `--riunione-filo-barre-larghezza` | `9px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .barre i` width |
| `--riunione-filo-griglia-righe` | `66px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .griglia` grid-template-rows ((max-width: 760px)) |
| `--tavolo-barre-altezza` | `64px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo .barre` height |
| `--tavolo-cornice-altezza` | `172px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` height |
| `--tavolo-cornice-altezza-telefono` | `78px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` height ((max-width: 760px)) |
| `--tavolo-larghezza` | `min(820px, 100%)` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo` width |
| `--tavolo-margine` | `0 0 52px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo` margin |
| `--avvio-piede-larghezza` | `calc(100% - 520px)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.avvio-piede` width ((min-width: 791px)) |
| `--f-cursore-margine-inizio` | `1px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-cursore` margin-inline-start |
| `--f-nota-margine` | `10px 0 2px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.avvio .f-nota` margin |
| `--f-pulsante-spazio-interno` | `0 12px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-pulsante` padding |
| `--f-stato-spazio-interno` | `9px 10px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-stato` padding |
| `--finestra-larghezza-2` | `min(470px, 100%)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra.avvio` width |
| `--nota-ricostruzione-margine-telefono` | `16px 0 0` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.nota-ricostruzione` margin ((max-width: 760px)) |
| `--sotto-f-campo-spazio-interno` | `0 8px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto .f-campo` padding ((max-width: 760px)) |
| `--sotto-f-pulsante-spazio-interno` | `0 7px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto .f-pulsante` padding ((max-width: 760px)) |
| `--sotto-margine-sopra` | `-14px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` margin-top |
| `--sotto-margine-sopra-telefono` | `-16px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` margin-top ((max-width: 760px)) |
| `--app-comandi-spazio-interno` | `8px 0 4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-comandi` padding ((max-width: 420px)) |
| `--app-griglia-barre-larghezza-telefono` | `5px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .barre i` width ((max-width: 760px)) |
| `--app-griglia-nome-spazio-interno-telefono` | `2px 7px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .nome` padding ((max-width: 760px)) |
| `--app-griglia-righe` | `104px 104px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia` grid-template-rows |
| `--app-griglia-righe-telefono` | `78px 78px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia` grid-template-rows ((max-width: 760px)) |
| `--microfono-spazio-interno-blocco` | `4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` padding-block |
| `--microfono-spazio-interno-inline` | `6px 4px` | misura del componente «La riunione ricostruita, con il microfono», inizio e fine | 1 uso: `.microfono` padding-inline |
| `--microfono-spazio-interno-telefono-blocco` | `3px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` padding-block ((max-width: 760px)) |
| `--microfono-spazio-interno-telefono-inline` | `4px 3px` | misura del componente «La riunione ricostruita, con il microfono», inizio e fine | 1 uso: `.microfono` padding-inline ((max-width: 760px)) |
| `--microfono-titolo-spazio-interno` | `2px 4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono-titolo` padding ((max-width: 420px)) |
| `--riunione-app-larghezza` | `min(480px, 100%)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` width |
| `--riunione-app-larghezza-telefono` | `calc(100% - 28px)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` width ((max-width: 760px)) |
| `--scelta-spazio-interno` | `7px 13px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` padding |
| `--scelta-spazio-interno-telefono` | `6px 9px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` padding ((max-width: 760px)) |
| `--ascolto-dentro-errore-ascolto-spazio-interno` | `0 6px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto-dentro > .errore-ascolto` padding |
| `--ascolto-dentro-spazio-interno` | `8px 10px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto-dentro` padding |
| `--ascolto-sfocatura` | `blur(18px)` | misura del componente «La scheda dell'ascolto» | 2 usi: `.ascolto` -webkit-backdrop-filter; `.ascolto` backdrop-filter |
| `--fila-ascolto-altezza-minima` | `112px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto` min-height |
| `--frase-spazio-interno-telefono` | `0 11px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase` padding ((max-width: 760px)) |
| `--voce-altezza-minima` | `46px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` min-height |
| `--voce-spazio-interno-blocco` | `0` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` padding-block |
| `--voce-spazio-interno-inline` | `6px 18px` | misura del componente «La scheda dell'ascolto», inizio e fine | 1 uso: `.voce` padding-inline |
| `--voce-tondo-prima-triangolo` | `12px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce-tondo::before` border-left |
| `--voce-tondo-prima-triangolo-2` | `7px` | misura del componente «La scheda dell'ascolto» | 2 usi: `.voce-tondo::before` border-top; `.voce-tondo::before` border-bottom |
| `--errore-ascolto-spazio-interno` | `14px 18px 16px` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-ascolto` padding |
| `--errore-azioni-distanza` | `6px 20px` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-azioni` gap |
| `--ascolto-voce-colonne` | `440px minmax(0, 1fr)` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce` grid-template-columns |
| `--ascolto-voce-colonne-tavoletta-filo` | `clamp(280px, 36vw, 360px) minmax(0, 1fr)` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce` grid-template-columns ((min-width: 761px) and (max-wi) |
| `--ascolto-voce-dopo-altezza` | `110px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce::after` height ((max-width: 760px)) |
| `--ascolto-voce-margine-sopra` | `78px` | misura del componente «Le frasi del filo» | 1 uso: `.tratto.ascolto-voce` margin-top |
| `--ascolto-voce-messaggio-scorrimento-margine` | `168px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .messaggio, .ascolto-…` scroll-margin-top ((max-width: 760px)) |
| `--ascolto-voce-spazio-sotto` | `calc(var(--sovrap) - 26px)` | misura del componente «Le frasi del filo» | 1 uso: `.tratto.ascolto-voce.scena-notte` padding-bottom ((max-width: 760px)) |
| `--ascolto-voce-voci-filo-margine-sopra` | `28px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .voci-filo` margin-top |
| `--detto-riga-larghezza-massima` | `560px` | misura del componente «Le frasi del filo» | 1 uso: `.detto-riga` max-width |
| `--detto-riga-margine-blocco` | `14px 0` | misura del componente «Le frasi del filo» | 1 uso: `.detto-riga` margin-block |
| `--detto-riga-margine-inline` | `4px 0` | misura del componente «Le frasi del filo», inizio e fine | 1 uso: `.detto-riga` margin-inline |
| `--filo-colonne` | `minmax(0, 1fr) 118px` | misura del componente «Le frasi del filo» | 1 uso: `.filo` grid-template-columns |
| `--messaggio-larghezza-massima` | `360px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio audio` max-width |
| `--messaggio-sotto-distanza` | `10px 16px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio-sotto` gap |
| `--messaggio-sotto-pillola-spazio-interno-blocco` | `0` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio-sotto .pillola` padding-block |
| `--messaggio-sotto-pillola-spazio-interno-inline` | `5px 20px` | misura del componente «Le frasi del filo», inizio e fine | 1 uso: `.messaggio-sotto .pillola` padding-inline |
| `--computer-altezza` | `236px` | misura del componente «La strada della voce» | 1 uso: `.computer` height |
| `--computer-altezza-telefono` | `352px` | misura del componente «La strada della voce» | 1 uso: `.computer` height ((max-width: 760px)) |
| `--esito-margine` | `0 0 10px` | misura del componente «La strada della voce» | 1 uso: `.esito h3` margin |
| `--esito-spazio-interno-blocco` | `0` | misura del componente «La strada della voce» | 1 uso: `.esito` padding-block |
| `--esito-spazio-interno-inline` | `22px 34px` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.esito` padding-inline |
| `--impulso-margine-inizio` | `-9px` | misura del componente «La strada della voce» | 1 uso: `.impulso` margin-inline-start ((max-width: 760px)) |
| `--impulso-sopra` | `93px` | misura del componente «La strada della voce» | 1 uso: `.impulso` top |
| `--impulso-sopra-telefono` | `79px` | misura del componente «La strada della voce» | 1 uso: `.impulso` top ((max-width: 760px)) |
| `--linea-altezza-telefono` | `200px` | misura del componente «La strada della voce» | 1 uso: `.linea` height ((max-width: 760px)) |
| `--linea-forse-sopra` | `288px` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` top ((max-width: 760px)) |
| `--nodo-altri-larghezza` | `128px` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri` width |
| `--non-esiste-distanza` | `10px 26px` | misura del componente «La strada della voce» | 1 uso: `.non-esiste` gap |
| `--non-esiste-margine-sopra` | `64px` | misura del componente «La strada della voce» | 1 uso: `.non-esiste` margin-top |
| `--riservato-margine-blocco` | `34px 0` | misura del componente «La strada della voce» | 1 uso: `.riservato` margin-block |
| `--riservato-margine-inline` | `22px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.riservato` margin-inline |
| `--scoppio-margine-blocco` | `-40px 0` | misura del componente «La strada della voce» | 1 uso: `.scoppio` margin-block |
| `--scoppio-margine-inline` | `-40px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.scoppio` margin-inline |
| `--strada-esito-sposta-y` | `14px` | misura del componente «La strada della voce» | 1 uso: `.js .strada:not(.fatto) .esito` transform |
| `--strada-riservato-sposta-y` | `14px` | misura del componente «La strada della voce» | 1 uso: `.js .strada:not(.fatto) .riservato` transform |
| `--tappa-nome-larghezza-massima` | `170px` | misura del componente «La strada della voce» | 1 uso: `.tappa-nome` max-width |
| `--tappe-spazio-interno` | `62px 0 0` | misura del componente «La strada della voce» | 1 uso: `.tappe` padding |
| `--tappe-spazio-interno-telefono-blocco` | `50px 0` | misura del componente «La strada della voce» | 1 uso: `.tappe` padding-block ((max-width: 760px)) |
| `--tappe-spazio-interno-telefono-inline` | `18px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.tappe` padding-inline ((max-width: 760px)) |
| `--chiusura-avvertenza-margine` | `14px 0 0` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .avvertenza` margin |
| `--chiusura-luce-tratto-altezza` | `1000px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-tratto` height |
| `--chiusura-spazio-sopra` | `104px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-top |
| `--chiusura-spazio-sopra-telefono` | `72px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-top ((max-width: 760px)) |
| `--chiusura-spazio-sotto` | `130px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-bottom |
| `--chiusura-spazio-sotto-2` | `calc(128px + var(--raggio-scena))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura.scena-stanza` padding-bottom |
| `--chiusura-spazio-sotto-telefono` | `84px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura` padding-bottom ((max-width: 760px)) |
| `--chiusura-spazio-sotto-telefono-2` | `calc(84px + var(--raggio-scena))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura.scena-stanza` padding-bottom ((max-width: 760px)) |
| `--entra-finestra-sposta-y` | `16px` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra` transform |
| `--entra-titolo-sposta-y` | `20px` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-titolo` transform |
| `--luce-altezza` | `1150px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` height |
| `--luce-inizio` | `calc(50% + 310px)` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` left (fisico: in coppia con translate(-50%, -50%); elenco dei versi) |
| `--luce-inizio-medio` | `calc(50% + 230px)` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` left (fisico: in coppia con translate(-50%, -50%); elenco dei versi) ((min-width: 1000px) and (max-w) |
| `--luce-sopra` | `470px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top |
| `--luce-sopra-tavoletta` | `860px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top ((min-width: 761px) and (max-wi) |
| `--luce-sopra-telefono` | `520px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top ((max-width: 760px)) |
| `--luce-tratto-altezza` | `950px` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` height |
| `--luce-tratto-larghezza` | `1100px` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` width |
| `--mondo-altezza-minima` | `100vh` | misura del componente «Tratti e scene» | 1 uso: `.mondo` min-height |
| `--scena-entra-da-ritaglio` | `inset(0 min(4.5vw, 64px, calc(var(--margine) - 2px)) round calc(var(--raggio-scena) * 1…` | misura del componente «Tratti e scene» | 1 uso: `@keyframes scena-entra from` clip-path |
| `--serve-colonne` | `minmax(0, 1fr) 400px` | misura del componente «Tratti e scene» | 1 uso: `.serve` grid-template-columns |
| `--tratto-scena-notte-spazio-fine` | `max(var(--margine), calc(50% - 720px + var(--margine)))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-inline-end |
| `--tratto-scena-notte-spazio-inizio` | `max(var(--margine), calc(50% - 720px + var(--margine)))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-inline-start |
| `--tratto-scena-notte-spazio-sopra` | `112px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-top |
| `--tratto-scena-notte-spazio-sopra-telefono` | `76px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-top ((max-width: 760px)) |
| `--tratto-scena-notte-spazio-sotto` | `calc(128px + var(--sovrap))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-bottom |
| `--tratto-scena-notte-spazio-sotto-telefono` | `calc(84px + var(--sovrap))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-bottom ((max-width: 760px)) |
| `--tratto-spazio-interno` | `150px var(--margine) 0` | misura del componente «Tratti e scene» | 1 uso: `.tratto` padding |
| `--tratto-spazio-interno-telefono` | `96px var(--margine) 0` | misura del componente «Tratti e scene» | 1 uso: `.tratto` padding ((max-width: 760px)) |
| `--tratto-testo-larghezza-massima` | `460px` | misura del componente «Tratti e scene» | 1 uso: `.tratto-testo p` max-width |
| `--piede-distanza` | `4px 20px` | misura del componente «Il piede» | 1 uso: `.piede ul` gap |
| `--piede-larghezza-massima` | `820px` | misura del componente «Il piede» | 1 uso: `.piede p` max-width |
| `--piede-margine` | `0 0 16px` | misura del componente «Il piede» | 1 uso: `.piede ul` margin |
| `--piede-spazio-interno` | `40px var(--margine) 56px` | misura del componente «Il piede» | 1 uso: `.piede` padding |
| `--entra-da-sposta-y` | `18px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes entra from` transform |
| `--sale-da-sposta-y` | `20px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes sale from` transform |
| `--sale12-da-sposta-y` | `12px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes sale12 from` transform |

## Raggi (22)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--raggio-1` | `2px` | gradino di scala (raggio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.linea` border-radius; `.esito h3::before` border-radius; `.requisiti li::before, .requisiti l…` border-radius; +2 |
| `--raggio-2` | `4px` | gradino di scala (raggio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.f-campo` border-radius; `.f-pulsante` border-radius; `.f-barra` border-radius; +1 |
| `--raggio-3` | `5px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.riunione-filo .barre i` border-radius; `.tavolo .barre i` border-radius |
| `--raggio-4` | `6px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.f-stato` border-radius; `.nodo-altri .mini` border-radius ((max-width: 760px)) |
| `--raggio-5` | `11px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.riunione-filo .riquadro` border-radius ((max-width: 760px)); `.tavolo .riquadro` border-radius ((max-width: 760px)) |
| `--raggio-6` | `12px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.marchio` border-radius; `.riquadro` border-radius ((max-width: 760px)) |
| `--raggio-7` | `16px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo` border-radius ((max-width: 760px)); `.riunione-filo .onde-filo` border-radius ((max-width: 760px)); `.microfono` border-radius ((max-width: 420px)) |
| `--raggio-8` | `17px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riquadro` border-radius; `.tavolo .riquadro` border-radius; `.bolla-corpo` border-radius ((max-width: 760px)) |
| `--raggio-9` | `18px` | gradino di scala (raggio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.errore-ascolto` border-radius; `.chiamata` border-radius ((max-width: 760px)); `.tavolo-cornice` border-radius ((max-width: 760px)); +1 |
| `--raggio-10` | `20px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-app` border-radius; `.js .menu.aperto` border-radius ((max-width: 959px)) |
| `--raggio-11` | `22px` | gradino di scala (raggio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.bolla-corpo` border-radius; `.riunione-filo` border-radius; `.riunione-filo .onde-filo` border-radius; +2 |
| `--raggio-12` | `24px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.nodo` border-radius; `.computer` border-radius ((max-width: 760px)) |
| `--raggio-13` | `26px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi: `.chiamata` border-radius; `.onde` border-radius; `.tavolo-cornice` border-radius |
| `--raggio-pillola` | `999px` | la pillola: ogni comando tondeggiante | 12 usi in 7 componenti: `.salta` border-radius; `.menu a` border-radius; `.pillola` border-radius; +9 |
| `--menu-aperto-dopo-raggio` | `0 0 12px 12px` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` border-radius (@supports (animation-timeline:) |
| `--barre-raggio` | `7px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` border-radius |
| `--barre-raggio-telefono` | `3px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` border-radius ((max-width: 760px)) |
| `--riunione-filo-riquadro-raggio` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .riquadro` border-radius |
| `--finestra-raggio` | `8px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra` border-radius |
| `--app-griglia-riquadro-raggio` | `13px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .riquadro` border-radius |
| `--computer-raggio` | `30px` | misura del componente «La strada della voce» | 1 uso: `.computer` border-radius |
| `--nodo-altri-mini-raggio` | `9px` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` border-radius |

## Filetti (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--filetto-forte` | `3px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 2 usi in 2 componenti: `:focus-visible` outline; `.scoppio` border |
| `--filetto-comando` | `1.5px` | misura del componente «Pulsanti e pillole» | 6 usi in 4 componenti: `.chiudi` border; `.rivedi` border; `.frase` border; +3 |
| `--filetto-medio` | `2px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 11 usi in 5 componenti: `.stato` border-inline-start; `.f-campo.fuoco` border-bottom; `.voce.suona .voce-tondo::after` border; +8 |
| `--filetto-sottile` | `1px` | misura del componente «I riquadri della riunione» | 12 usi in 7 componenti: `.chiamata` border; `.riunione-filo` border; `.tavolo-cornice` border; +9 |

## Ombre (24)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--barra-compatto-ombra` | `0 0 0 100vmax var(--barra-piena), 0 1px 0 100vmax var(--bordo-barra)` | misura del componente «Barra e menu» | 1 uso: `.barra.compatta` box-shadow |
| `--barra-ombra` | `0 0 0 100vmax var(--barra-piena), 0 1px 0 100vmax var(--bordo-barra)` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` box-shadow |
| `--barra-piena-da-ombra` | `0 0 0 100vmax transparent, 0 1px 0 100vmax transparent` | misura del componente «Barra e menu» | 1 uso: `@keyframes barra-piena from` box-shadow (@supports (animation-timeline:) |
| `--pillola-ombra` | `0 14px 30px -14px var(--ombra-azione)` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.azione` box-shadow |
| `--bolla-corpo-ombra` | `0 24px 50px -22px var(--ombra-bolla)` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` box-shadow |
| `--alone-ombra` | `0 0 30px 6px var(--alone-tu)` | misura del componente «I riquadri della riunione» | 1 uso: `.alone` box-shadow |
| `--banda-riunione-ombra` | `0 1px 0 var(--bordo-barra), 0 16px 22px -12px var(--ombra-banda)` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--bordo-ombra` | `inset 0 0 0 3px var(--voce)` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` box-shadow |
| `--chiamata-ombra` | `0 40px 80px -40px var(--ombra-cornice)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` box-shadow |
| `--lume-ombra` | `inset 0 0 0 2.5px var(--voce)` | misura del componente «I riquadri della riunione» | 1 uso: `.lume` box-shadow |
| `--riunione-filo-ombra` | `0 40px 80px -40px var(--ombra-nera)` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` box-shadow |
| `--tavolo-cornice-ombra` | `0 40px 80px -40px var(--ombra-cornice)` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` box-shadow |
| `--finestra-ombra` | `0 26px 50px -20px var(--ombra-finestra), 0 0 0 1px var(--finestra-anello)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra` box-shadow |
| `--finestra-ombra-2` | `0 30px 56px -26px var(--ombra-finestra-chiara), 0 0 0 1px var(--finestra-chiara-anello)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.scena-chiara .finestra` box-shadow |
| `--riunione-app-ombra` | `0 34px 60px -30px var(--ombra-riunione-app)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` box-shadow |
| `--ascolto-ombra` | `0 30px 60px -30px var(--ombra-cornice)` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto` box-shadow |
| `--pulsa-0-100-ombra` | `0 0 0 0 var(--tratteggio)` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 0%, 100%` box-shadow |
| `--pulsa-50-ombra` | `0 0 0 5px var(--voce-trasparente)` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 50%` box-shadow |
| `--voce-scelta-ombra` | `0 12px 26px -14px var(--alone-forte)` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce[aria-pressed="true"]` box-shadow |
| `--filo-bolla-bolla-corpo-ombra` | `0 0 0 3px var(--voce), 0 0 34px 4px var(--bordo-evidente), 0 24px 50px -22px var(--ombr…` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio.in-voce .filo-bolla .bol…` box-shadow |
| `--filo-bolla-bolla-corpo-ombra-2` | `0 0 0 3px var(--voce), 0 24px 50px -22px var(--ombra-bolla)` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio.in-pausa .filo-bolla .bo…` box-shadow |
| `--impulso-ombra` | `0 0 0 6px var(--bordo-voce-vecchio), 0 0 26px 8px var(--alone-forte)` | misura del componente «La strada della voce» | 1 uso: `.impulso` box-shadow |
| `--linea-fatta-ombra` | `0 0 14px var(--tratto-lieve)` | misura del componente «La strada della voce» | 1 uso: `.linea-fatta` box-shadow |
| `--tappa-nodo-ombra` | `0 0 34px 4px var(--bordo-tappa-forse)` | misura del componente «La strada della voce» | 1 uso: `.tappa.fatta.acceso .nodo` box-shadow |

## Fondi, gradienti e maschere (20)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--menu-aperto-dopo-fondo` | `linear-gradient(var(--pannello-trasparente), var(--pannello-menu-fondo))` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--collegamento-freccia-maschera` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3…` | misura del componente «Pulsanti e pillole» | 2 usi: `.collegamento .freccia` -webkit-mask; `.collegamento .freccia` mask |
| `--anna-fondo` | `linear-gradient(160deg, var(--anna-fondo-alto), var(--anna-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.anna` background |
| `--luca-fondo` | `linear-gradient(160deg, var(--luca-fondo-alto), var(--luca-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.luca` background |
| `--paola-fondo` | `linear-gradient(160deg, var(--paola-fondo-alto), var(--paola-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.paola` background |
| `--riquadro-fondo` | `linear-gradient(160deg, var(--tu-fondo-alto), var(--tu-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.tu` background |
| `--app-icona-prima-maschera` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3…` | misura del componente «La riunione ricostruita, con il microfono» | 2 usi: `.app-icona::before` -webkit-mask; `.app-icona::before` mask |
| `--voce-tondo-prima-fondo` | `linear-gradient(90deg, var(--bordeaux) 0 4px, transparent 4px 8px, var(--bordeaux) 8px …` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.suona .voce-tondo::before` background |
| `--ascolto-voce-luce-filo-fondo` | `radial-gradient(closest-side, var(--luce-filo-centro), var(--luce-filo-bordo) 50%, var(…` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .luce-filo` background |
| `--suona-frase-tondo-prima-fondo` | `linear-gradient(90deg, var(--testo) 0 4px, transparent 4px 8px, var(--testo) 8px 12px)` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.suona .tondo::before` background |
| `--esito-forse-prima-fondo` | `repeating-linear-gradient(90deg, var(--alone-forte) 0 7px, transparent 7px 12px)` | misura del componente «La strada della voce» | 1 uso: `.esito-forse h3::before` background |
| `--linea-forse-fondo` | `repeating-linear-gradient(90deg, var(--tratteggio) 0 12px, transparent 12px 24px)` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` background |
| `--linea-forse-fondo-telefono` | `repeating-linear-gradient(180deg, var(--tratteggio) 0 12px, transparent 12px 24px)` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` background ((max-width: 760px)) |
| `--chiusura-luce-chiusa-fondo` | `radial-gradient(closest-side, var(--luce-chiusa-centro), var(--luce-chiusa-bordo) 45%, …` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-chiusa` background |
| `--chiusura-luce-tratto-fondo` | `radial-gradient(closest-side, var(--luce-stanza-centro), var(--luce-stanza-bordo) 52%, …` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-tratto` background |
| `--luce-fondo` | `radial-gradient(closest-side, var(--luce-stanza-centro), var(--luce-stanza-bordo) 52%, …` | misura del componente «Tratti e scene» | 1 uso: `.luce` background |
| `--luce-tratto-fondo` | `radial-gradient(closest-side, var(--luce-tratto-centro), var(--luce-tratto-bordo) 55%, …` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` background |
| `--luce-tratto-fondo-2` | `radial-gradient(closest-side, var(--luce-chiara-centro), var(--luce-chiara-bordo) 55%, …` | misura del componente «Tratti e scene» | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-voce-fondo` | `radial-gradient(closest-side, var(--luce-voce-centro), var(--luce-voce-bordo) 45%, var(…` | misura del componente «Tratti e scene» | 1 uso: `.luce-voce` background |
| `--scena-chiara-fondo` | `linear-gradient(180deg, var(--testo) 0%, var(--chiara-fondo-basso) 100%)` | misura del componente «Tratti e scene» | 1 uso: `.scena-chiara` background |

## Livelli (24)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--livello-salta` | `50` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` z-index |
| `--livello-barra` | `30` | misura del componente «Barra e menu» | 1 uso: `.barra` z-index |
| `--livello-menu-aperto` | `20` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` z-index ((max-width: 959px)) |
| `--livello-scena` | `2` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` z-index |
| `--livello-posto-bolla` | `7` | misura del componente «La bolla» | 1 uso: `.posto-bolla` z-index |
| `--livello-alone` | `-1` | misura del componente «I riquadri della riunione» | 1 uso: `.alone` z-index |
| `--livello-banda-riunione` | `5` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` z-index ((max-width: 760px)) |
| `--livello-barre` | `1` | misura del componente «I riquadri della riunione» | 1 uso: `.barre` z-index |
| `--livello-bordo` | `4` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` z-index |
| `--livello-lume` | `2` | misura del componente «I riquadri della riunione» | 1 uso: `.lume` z-index |
| `--livello-nome` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` z-index |
| `--livello-onde` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.onde` z-index |
| `--livello-riunione-filo-onde-filo` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .onde-filo` z-index |
| `--livello-finestra` | `1` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra.avvio` z-index |
| `--livello-sotto` | `5` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` z-index |
| `--livello-riunione-app` | `2` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` z-index |
| `--livello-ascolto` | `6` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto` z-index |
| `--livello-impulso` | `3` | misura del componente «La strada della voce» | 1 uso: `.impulso` z-index |
| `--livello-linea` | `1` | misura del componente «La strada della voce» | 1 uso: `.linea` z-index |
| `--livello-tappe` | `2` | misura del componente «La strada della voce» | 1 uso: `.tappe` z-index |
| `--livello-luce` | `0` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` z-index |
| `--livello-luce-tratto` | `-1` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` z-index |
| `--livello-tratto` | `1` | misura del componente «Tratti e scene» | 1 uso: `.tratto` z-index |
| `--livello-piede` | `1` | misura del componente «Il piede» | 2 usi: `.piede` z-index; `.piede.scena-notte` z-index |

## Movimento · curve (6)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--entra` | `cubic-bezier(0.19, 1, 0.22, 1)` |  | 0 usi:  |
| `--curva-dolce` | `ease` | misura del componente «Barra e menu» | 33 usi in 11 componenti: `.barra` transition; `.barra .barra-azione` transition; `.barra.con-azione .barra-azione` transition ((max-width: 440px)); +30 |
| `--curva-lineare` | `linear` | misura del componente «Barra e menu» | 13 usi in 5 componenti: `.barra .barra-azione` transition; `.bolla .p` transition; `.voce.carica .voce-tondo::after` animation; +10 |
| `--curva-dolce-doppia` | `ease-in-out` | misura del componente «I riquadri della riunione» | 2 usi in 2 componenti: `.annuisce .cenno` animation; `.frase.suona::before` animation |
| `--curva-a-scatti` | `steps(1)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-campo.fuoco .f-cursore` animation |
| `--curva-uscita` | `ease-out` | misura del componente «La riunione ricostruita, con il microfono» | 3 usi in 3 componenti: `.riunione-app.vivo .tu .bordo` animation; `.voce.suona .voce-tondo::after` animation; `.suona-frase.suona .tondo::after` animation |

## Movimento · durate (78)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--durata-movimento-ridotto` | `1ms` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 2 usi: `*, *::before, *::after` animation-duration ((prefers-reduced-motion: reduc); `*, *::before, *::after` transition-duration ((prefers-reduced-motion: reduc) |
| `--durata-barra` | `320ms` | misura del componente «Barra e menu» | 1 uso: `.barra` transition |
| `--durata-barra-azione-opacita` | `120ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--durata-barra-azione-opacita-2` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--durata-barra-azione-opacita-stretto` | `220ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--durata-barra-azione-trasforma` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--durata-barra-azione-trasforma-2` | `320ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--durata-barra-azione-trasforma-stretto` | `300ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--durata-barra-marchio` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio span` transition ((max-width: 440px)) |
| `--durata-marchio` | `160ms` | misura del componente «Barra e menu» | 1 uso: `.marchio span` transition |
| `--durata-menu` | `300ms` | misura del componente «Barra e menu» | 1 uso: `.menu` transition |
| `--durata-menu-2` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.menu a` transition |
| `--durata-voce-bordo` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-voce-sfondo` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-voce-trasforma` | `220ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-collegamento-freccia` | `240ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento .freccia` transition |
| `--durata-collegamento-sottolineatura` | `200ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` transition |
| `--durata-collegamento-trasforma` | `220ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` transition |
| `--durata-pillola` | `220ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola` transition |
| `--durata-comandi` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > *` animation |
| `--durata-didascalia` | `500ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` animation |
| `--durata-presentazione` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` animation |
| `--durata-riga` | `380ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga` animation |
| `--durata-stato` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` animation |
| `--durata-bolla` | `420ms` | misura del componente «La bolla» | 1 uso: `.bolla` transition |
| `--durata-bolla-2` | `160ms` | misura del componente «La bolla» | 1 uso: `.bolla .p` transition |
| `--durata-posto-bolla` | `480ms` | misura del componente «La bolla» | 1 uso: `.posto-bolla` animation |
| `--durata-anna-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.anna .occhi ellipse` animation |
| `--durata-annuisce-cenno` | `820ms` | misura del componente «I riquadri della riunione» | 1 uso: `.annuisce .cenno` animation |
| `--durata-banda-riunione` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` transition ((max-width: 760px)) |
| `--durata-barre` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` transition |
| `--durata-bordo` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` transition |
| `--durata-chiamata` | `500ms` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` animation |
| `--durata-figura-occhi` | `460ms` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .occhi` transition |
| `--durata-figura-testa` | `560ms` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .testa` transition |
| `--durata-luca-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.luca .occhi ellipse` animation |
| `--durata-paola-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.paola .occhi ellipse` animation |
| `--durata-riquadro` | `520ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro` animation |
| `--durata-tavolo-riquadro` | `520ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro, .js .r…` animation |
| `--durata-f-campo-f-cursore` | `1s` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-campo.fuoco .f-cursore` animation |
| `--durata-f-primario` | `140ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-primario` transition |
| `--durata-f-pulsante` | `160ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-pulsante` transition |
| `--durata-f-stato` | `240ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-stato` transition |
| `--durata-sotto` | `360ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` animation |
| `--durata-riunione-app-bordo` | `900ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app.vivo .tu .bordo` animation |
| `--durata-scelta-sfondo` | `280ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-scelta-testo` | `280ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-scelta-trasforma` | `160ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-fila-ascolto-pillola` | `360ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto > .pillola` animation |
| `--durata-frase-prima` | `200ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase::before` transition |
| `--durata-frase-prima-2` | `900ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase.suona::before` animation |
| `--durata-frase-prima-3` | `1.1s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase.carica::before` animation |
| `--durata-voce` | `240ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` transition |
| `--durata-voce-tondo-dopo` | `1.2s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.suona .voce-tondo::after` animation |
| `--durata-voce-tondo-dopo-2` | `1.1s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.carica .voce-tondo::after` animation |
| `--durata-errore-ascolto` | `420ms` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-ascolto` animation |
| `--durata-filo-bolla-bolla-corpo` | `300ms` | misura del componente «Le frasi del filo» | 1 uso: `.filo-bolla .bolla-corpo` transition |
| `--durata-messaggio-filo-bolla-opacita` | `200ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .filo-bolla` transition |
| `--durata-messaggio-filo-bolla-trasforma` | `520ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .filo-bolla` transition |
| `--durata-messaggio-sotto` | `400ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .messagg…` transition |
| `--durata-suona-frase-tondo-dopo` | `1.1s` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.carica .tondo::after` animation |
| `--durata-suona-frase-tondo-dopo-2` | `1.2s` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.suona .tondo::after` animation |
| `--durata-esito-opacita` | `480ms` | misura del componente «La strada della voce» | 1 uso: `.esito` transition |
| `--durata-esito-trasforma` | `620ms` | misura del componente «La strada della voce» | 1 uso: `.esito` transition |
| `--durata-nodo-altri-mini` | `500ms` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` transition |
| `--durata-nodo-bordo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-ombra` | `500ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-sfondo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-testo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-trasforma` | `420ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-riservato-opacita` | `480ms` | misura del componente «La strada della voce» | 1 uso: `.riservato` transition |
| `--durata-riservato-trasforma` | `620ms` | misura del componente «La strada della voce» | 1 uso: `.riservato` transition |
| `--durata-entra-finestra-opacita` | `300ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra.visto` transition |
| `--durata-entra-finestra-trasforma` | `460ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra.visto` transition |
| `--durata-entra-titolo` | `380ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-titolo.visto` transition |
| `--durata-luce` | `1400ms` | misura del componente «Tratti e scene» | 1 uso: `.luce` animation |
| `--durata-requisiti` | `360ms` | misura del componente «Tratti e scene» | 1 uso: `.requisiti li` transition |
| `--durata-requisiti-dopo-base` | `900ms` | misura del componente «Tratti e scene» | 1 uso: `.js .requisiti.in-scena li.attivo::…` transition |

## Movimento · ritardi (36)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--ritardo-barra-azione-opacita` | `90ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--ritardo-barra-azione-opacita-stretto` | `150ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--ritardo-barra-azione-trasforma` | `90ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--ritardo-barra-azione-trasforma-stretto` | `150ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--ritardo-barra-azione-visibilita` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--ritardo-barra-marchio` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio` transition ((max-width: 440px)) |
| `--ritardo-barra-marchio-larghezza` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio span` transition ((max-width: 440px)) |
| `--ritardo-marchio-opacita` | `120ms` | misura del componente «Barra e menu» | 1 uso: `.marchio span` transition |
| `--ritardo-menu` | `130ms` | misura del componente «Barra e menu» | 1 uso: `.menu` transition |
| `--ritardo-comandi-1` | `640ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > :nth-child(1)` animation-delay |
| `--ritardo-comandi-2` | `720ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > :nth-child(2)` animation-delay |
| `--ritardo-didascalia` | `900ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` animation |
| `--ritardo-presentazione` | `520ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` animation |
| `--ritardo-riga-1` | `100ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(1)` animation-delay |
| `--ritardo-riga-2` | `180ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(2)` animation-delay |
| `--ritardo-riga-3` | `260ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(3)` animation-delay |
| `--ritardo-riga-4` | `340ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(4)` animation-delay |
| `--ritardo-stato` | `800ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` animation |
| `--ritardo-posto-bolla` | `1500ms` | misura del componente «La bolla» | 1 uso: `.posto-bolla` animation |
| `--ritardo-anna-occhi` | `3.3s` | misura del componente «I riquadri della riunione» | 1 uso: `.anna .occhi ellipse` animation |
| `--ritardo-chiamata` | `700ms` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` animation |
| `--ritardo-luca-occhi` | `4.1s` | misura del componente «I riquadri della riunione» | 1 uso: `.luca .occhi ellipse` animation |
| `--ritardo-paola-occhi` | `2.7s` | misura del componente «I riquadri della riunione» | 1 uso: `.paola .occhi ellipse` animation |
| `--ritardo-riquadro` | `1280ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.tu` animation-delay |
| `--ritardo-riquadro-anna` | `1120ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.anna` animation-delay |
| `--ritardo-riquadro-luca` | `1000ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.luca` animation-delay |
| `--ritardo-riquadro-paola` | `880ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.paola` animation-delay |
| `--ritardo-tavolo-riquadro` | `400ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro.tu, .js…` animation-delay |
| `--ritardo-tavolo-riquadro-3` | `120ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro:nth-chi…` animation-delay |
| `--ritardo-tavolo-riquadro-4` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro:nth-chi…` animation-delay |
| `--ritardo-sotto` | `1700ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` animation |
| `--riunione-app-entra-finestra-ritardo` | `260ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.js .riunione-app.entra-finestra` ritardo |
| `--ritardo-fila-ascolto-pillola` | `1950ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto > .pillola` animation |
| `--ritardo-sotto-aperto` | `460ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.palco:has(.fila-ascolto.aperta:not…` transition ((min-width: 761px) and (max-he) |
| `--ritardo-sotto-compatto-aperto` | `460ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.palco.compatta:has(.fila-ascolto.a…` transition |
| `--ritardo-messaggio-sotto-in-piu` | `260ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .messagg…` transition |

## Opacità e filtri (11)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--opacita-spento` | `0.5` | un comando non disponibile | 3 usi in 3 componenti: `.voce:disabled, .frase:disabled, .c…` opacity; `.voce.pausa .voce-tondo::after` opacity; `.nodo-altri .mini` opacity |
| `--opacita-bolla` | `0.72` | misura del componente «La bolla» | 1 uso: `.bolla.detta` opacity |
| `--opacita-bolla-2` | `0.38` | misura del componente «La bolla» | 1 uso: `.bolla .p.attesa` opacity |
| `--opacita-figura-bocca` | `0.8` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .bocca` opacity |
| `--opacita-f-campo` | `0.55` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-campo.spento` opacity |
| `--opacita-lampo-100` | `0.55` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `@keyframes lampo 100%` opacity |
| `--opacita-suona-frase-tondo-dopo` | `0.45` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.pausa .tondo::after` opacity |
| `--nodo-altri-mini-filtro` | `saturate(0.6)` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` filter |
| `--opacita-tappa-altri-mini` | `0.68` | misura del componente «La strada della voce» | 1 uso: `.tappa-altri.raggiunta .mini` opacity |
| `--tappa-altri-mini-filtro` | `saturate(0.8)` | misura del componente «La strada della voce» | 1 uso: `.tappa-altri.raggiunta .mini` filter |
| `--opacita-requisiti` | `0.45` | misura del componente «Tratti e scene» | 1 uso: `.js .requisiti.in-scena li:not(.att…` opacity |

## Pose · scale (18)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--barra-azione-scala` | `0.94` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transform |
| `--collegamento-premuto-scala` | `0.97` | misura del componente «Barra e menu» | 1 uso: `.collegamento:active, .marchio:acti…` transform |
| `--voce-premuto-scala` | `0.97` | misura del componente «Barra e menu» | 1 uso: `.voce:active, .frase:active, .chiud…` transform |
| `--pillola-premuto-scala` | `0.97` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola:active` transform |
| `--barre-1-scala-y` | `0.34` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(1)` transform |
| `--barre-2-scala-y` | `0.7` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(2)` transform |
| `--barre-4-scala-y` | `0.63` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(4)` transform |
| `--barre-5-scala-y` | `0.41` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(5)` transform |
| `--batte-50-scala-y` | `0.12` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes batte 50%` transform |
| `--f-primario-scala` | `0.96` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-primario.premuto` transform |
| `--scelta-scala` | `0.94` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta.premuta` transform |
| `--anello-a-scala` | `1.25` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes anello to` transform |
| `--anello-da-scala` | `0.9` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes anello from` transform |
| `--pulsa-50-scala` | `1.25` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 50%` transform |
| `--messaggio-filo-bolla-scala` | `0.6` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra .filo-bolla` transform |
| `--tappa-nodo-scala` | `1.04` | misura del componente «La strada della voce» | 1 uso: `.tappa.fatta.acceso .nodo` transform |
| `--entra-finestra-scala` | `0.96` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra` transform |
| `--entra-da-scala` | `0.97` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes entra from` transform |

## Pose · angoli (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--anna-testa-rotazione` | `-7deg` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--luca-testa-rotazione` | `-4deg` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .testa` transform |
| `--paola-testa-rotazione` | `-8deg` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .testa` transform |
| `--gira-a-rotazione` | `360deg` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes gira to` transform |

## Pose · origini (3)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--bolla-chiusa-origine` | `40px 100%` | misura del componente «La bolla» | 1 uso: `.bolla-chiusa` transform-origin |
| `--bolla-filo-bolla-origine` | `30px 100%` | misura del componente «La bolla» | 1 uso: `.bolla.filo-bolla` transform-origin |
| `--messaggio-filo-bolla-origine` | `30px 100%` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra .filo-bolla` transform-origin |

## Soglie delle larghezze (@media e @container)

Non si possono scrivere in una variabile (le domande sui media non leggono `var()`): sono **23 soglie**, elencate qui e in `metodo.config.mjs` (voce `sorgenti.soglie`).

`349px` · `350px` · `360px` · `374px` · `420px` · `440px` · `699px` · `759px` · `760px` · `761px` · `790px` · `791px` · `799px` · `802px` · `819px` · `840px` · `959px` · `999px` · `1000px` · `1010px` · `1180px` · `1181px` · `1209px`

## Da decidere

Tutto ciò che segue sono **valori distinti nella pagina che potrebbero essere lo stesso ruolo**. Non li ho uniti: unirli cambierebbe l'aspetto (anche di poco). Decide chi sceglie l'aspetto; se si unisce, si cambia il valore in `token.css` e si rifà il confronto a vista e pixel per pixel con la pagina di prima.

### Colori con lo stesso colore di base e opacità quasi uguali (33 coppie)

| Un token | L'altro | Differenza | Ruoli |
|---|---|---|---|
| `--bordo-barra` 0.1 | `--bordo-sezione` 0.12 | rgb(255,219,225) · differenza di opacità 0.02 | il filo sotto la barra compatta e sotto la fascia  / il filo che divide: tra «Non esiste» e la strada,  |
| `--bordo-sezione` 0.12 | `--bordo-cornice` 0.14 | rgb(255,219,225) · differenza di opacità 0.02 | il filo che divide: tra «Non esiste» e la strada,  / il bordo di una cornice della riunione e il filo s |
| `--bordo-cornice` 0.14 | `--bordo-pannello` 0.2 | rgb(255,219,225) · differenza di opacità 0.06 | il bordo di una cornice della riunione e il filo s / il bordo di un pannello: scheda, menu aperto, comp |
| `--bordo-pannello` 0.2 | `--bordo-frase` 0.22 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo di un pannello: scheda, menu aperto, comp / il bordo di una frase |
| `--bordo-voce-vecchio` 0.28 | `--bordo-comando` 0.3 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo di una voce (primo disegno; la pagina ora / il bordo di un comando: «Menu», nodo della strada |
| `--bordo-comando` 0.3 | `--bordo-voce` 0.34 | rgb(255,219,225) · differenza di opacità 0.04 | il bordo di un comando: «Menu», nodo della strada / il bordo di una voce a riposo |
| `--bordo-voce` 0.34 | `--bordo-comando-quieto` 0.35 | rgb(255,219,225) · differenza di opacità 0.01 | il bordo di una voce a riposo / il bordo di un comando secondario: «Chiudi», «Rive |
| `--bordo-comando-quieto` 0.35 | `--bordo-evidente` 0.4 | rgb(255,219,225) · differenza di opacità 0.05 | il bordo di un comando secondario: «Chiudi», «Rive / il bordo che si nota: la riga dello stato, il mess |
| `--bordo-evidente` 0.4 | `--bordo-tappa-forse` 0.42 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo che si nota: la riga dello stato, il mess / la tappa «forse»: bordo tratteggiato, e l'alone de |
| `--bordo-tappa-forse` 0.42 | `--frase-punto` 0.45 | rgb(255,219,225) · differenza di opacità 0.03 | la tappa «forse»: bordo tratteggiato, e l'alone de / il punto di una frase non ancora suonata |
| `--frase-punto` 0.45 | `--tratto-lieve` 0.5 | rgb(255,219,225) · differenza di opacità 0.05 | il punto di una frase non ancora suonata / sottolineatura di «altra voce» e alone della linea |
| `--tratto-lieve` 0.5 | `--sottolineatura` 0.55 | rgb(255,219,225) · differenza di opacità 0.05 | sottolineatura di «altra voce» e alone della linea / la sottolineatura dei collegamenti |
| `--sottolineatura` 0.55 | `--tratteggio` 0.6 | rgb(255,219,225) · differenza di opacità 0.05 | la sottolineatura dei collegamenti / il tratteggio di «non ancora» (linea e pulsazione) |
| `--alone-forte` 0.7 | `--bordo-tappa-raggiunta` 0.75 | rgb(255,219,225) · differenza di opacità 0.05 | un alone netto: impulso, voce scelta, tratteggio d / la tappa «forse» quando la voce ci arriva |
| `--bordo-tappa-raggiunta` 0.75 | `--alone-tu` 0.8 | rgb(255,219,225) · differenza di opacità 0.05 | la tappa «forse» quando la voce ci arriva / l'alone di chi parla |
| `--velo-computer` 0.035 | `--velo-sopra` 0.06 | rgb(255,237,239) · differenza di opacità 0.02 | il computer della strada / una voce al passaggio |
| `--velo-sopra` 0.06 | `--velo-comando` 0.08 | rgb(255,237,239) · differenza di opacità 0.02 | una voce al passaggio / il fondo di un comando: voce, «Menu», microfono |
| `--velo-comando` 0.08 | `--velo-menu-sopra` 0.1 | rgb(255,237,239) · differenza di opacità 0.02 | il fondo di un comando: voce, «Menu», microfono / una voce del menu al passaggio |
| `--velo-menu-sopra` 0.1 | `--velo-scelto` 0.14 | rgb(255,237,239) · differenza di opacità 0.04 | una voce del menu al passaggio / una frase attiva, «Menu» al passaggio |
| `--velo-scelto` 0.14 | `--velo-menu-premuto` 0.18 | rgb(255,237,239) · differenza di opacità 0.04 | una frase attiva, «Menu» al passaggio / una voce del menu premuta |
| `--velo-menu-premuto` 0.18 | `--velo-puntata` 0.2 | rgb(255,237,239) · differenza di opacità 0.02 | una voce del menu premuta / la scelta del microfono puntata |
| `--testo-avvertenza-chiusura` 0.66 | `--testo-durata` 0.7 | rgb(255,237,239) · differenza di opacità 0.04 | l'avvertenza della chiusura / la durata di una frase |
| `--testo-durata` 0.7 | `--testo-avvertenza` 0.72 | rgb(255,237,239) · differenza di opacità 0.02 | la durata di una frase / l'avvertenza |
| `--testo-didascalia` 0.78 | `--testo-secondario` 0.8 | rgb(255,237,239) · differenza di opacità 0.02 | la didascalia e il titolo del microfono / testo di sostegno: piede, nome del computer, tappa |
| `--testo-secondario` 0.8 | `--testo-nota` 0.82 | rgb(255,237,239) · differenza di opacità 0.02 | testo di sostegno: piede, nome del computer, tappa / una nota sotto una frase e il testo di «Non esiste |
| `--testo-nota` 0.82 | `--testo-dettaglio` 0.86 | rgb(255,237,239) · differenza di opacità 0.04 | una nota sotto una frase e il testo di «Non esiste / il dettaglio che chiude (i fatti) |
| `--testo-dettaglio` 0.86 | `--testo-spiegazione` 0.88 | rgb(255,237,239) · differenza di opacità 0.02 | il dettaglio che chiude (i fatti) / la spiegazione sotto un titolo: stato, testo del t |
| `--testo-spiegazione` 0.88 | `--testo-forte` 0.9 | rgb(255,237,239) · differenza di opacità 0.02 | la spiegazione sotto un titolo: stato, testo del t / la riga sulla riservatezza |
| `--luce-chiusa-centro` 0.5 | `--luce-voce-centro` 0.55 | rgb(255,92,141) · differenza di opacità 0.05 | la luce della chiusura: centro / la luce che segue la voce: centro |
| `--ombra-finestra` 0.85 | `--ombra-cornice` 0.9 | rgb(10,0,4) · differenza di opacità 0.05 | ombra della finestra di Kalliope / ombra di una cornice o di un pannello |
| `--pannello-menu` 0.94 | `--pannello-menu-fondo` 0.98 | rgb(28,3,11) · differenza di opacità 0.04 | il menu aperto / il velo sul fondo del menu che scorre |
| `--luce-filo-bordo` 0.16 | `--luce-chiusa-bordo` 0.2 | rgb(197,15,86) · differenza di opacità 0.04 | la luce del filo: a metà / la luce della chiusura: a metà |
| `--luce-chiusa-bordo` 0.2 | `--luce-voce-bordo` 0.22 | rgb(197,15,86) · differenza di opacità 0.02 | la luce della chiusura: a metà / la luce che segue la voce: a metà |

### Gradini di «corpo» che differiscono di 1 px o meno (8 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--corpo-1` 10px | `--corpo-2` 11px | 1 px | 3 e 2 usi |
| `--corpo-2` 11px | `--corpo-3` 12px | 1 px | 2 e 4 usi |
| `--corpo-3` 12px | `--corpo-4` 13px | 1 px | 4 e 12 usi |
| `--corpo-4` 13px | `--corpo-5` 14px | 1 px | 12 e 10 usi |
| `--corpo-5` 14px | `--corpo-6` 15px | 1 px | 10 e 17 usi |
| `--corpo-6` 15px | `--corpo-7` 16px | 1 px | 17 e 10 usi |
| `--corpo-7` 16px | `--corpo-8` 17px | 1 px | 10 e 7 usi |
| `--corpo-8` 17px | `--corpo-9` 18px | 1 px | 7 e 8 usi |

### Gradini di «interlinea» che differiscono di 1 px o meno (7 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--interlinea-3` 18px | `--interlinea-4` 19px | 1 px | 4 e 2 usi |
| `--interlinea-5` 21px | `--interlinea-6` 22px | 1 px | 2 e 5 usi |
| `--interlinea-8` 26px | `--interlinea-9` 27px | 1 px | 2 e 5 usi |
| `--interlinea-9` 27px | `--interlinea-10` 28px | 1 px | 5 e 4 usi |
| `--interlinea-10` 28px | `--interlinea-11` 29px | 1 px | 4 e 2 usi |
| `--interlinea-11` 29px | `--interlinea-12` 30px | 1 px | 2 e 3 usi |
| `--interlinea-12` 30px | `--interlinea-13` 31px | 1 px | 3 e 3 usi |

### Gradini di «raggio» che differiscono di 1 px o meno (5 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--raggio-2` 4px | `--raggio-3` 5px | 1 px | 4 e 2 usi |
| `--raggio-3` 5px | `--raggio-4` 6px | 1 px | 2 e 2 usi |
| `--raggio-5` 11px | `--raggio-6` 12px | 1 px | 2 e 2 usi |
| `--raggio-7` 16px | `--raggio-8` 17px | 1 px | 3 e 3 usi |
| `--raggio-8` 17px | `--raggio-9` 18px | 1 px | 3 e 4 usi |

### Gradini di «spazio» che differiscono di 1 px o meno (13 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--spazio-meno-2` -5px | `--spazio-meno-3` -4px | 1 px | 4 e 2 usi |
| `--spazio-1` 2px | `--spazio-2` 3px | 1 px | 6 e 6 usi |
| `--spazio-2` 3px | `--spazio-3` 4px | 1 px | 6 e 13 usi |
| `--spazio-3` 4px | `--spazio-4` 5px | 1 px | 13 e 12 usi |
| `--spazio-4` 5px | `--spazio-5` 6px | 1 px | 12 e 19 usi |
| `--spazio-5` 6px | `--spazio-6` 7px | 1 px | 19 e 5 usi |
| `--spazio-6` 7px | `--spazio-7` 8px | 1 px | 5 e 21 usi |
| `--spazio-8` 10px | `--spazio-9` 11px | 1 px | 15 e 3 usi |
| `--spazio-9` 11px | `--spazio-10` 12px | 1 px | 3 e 16 usi |
| `--spazio-10` 12px | `--spazio-11` 13px | 1 px | 16 e 2 usi |
| `--spazio-11` 13px | `--spazio-12` 14px | 1 px | 2 e 12 usi |
| `--spazio-12` 14px | `--spazio-13` 15px | 1 px | 12 e 2 usi |
| `--spazio-13` 15px | `--spazio-14` 16px | 1 px | 2 e 10 usi |

### Gradini di «misura» che differiscono di 1 px o meno (1 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--misura-3` 7px | `--misura-4` 8px | 1 px | 5 e 3 usi |

### Gradini di «spazi» che differiscono di 1 px o meno (0 coppie)

_nessuna_

### Gradini di «misure» che differiscono di 1 px o meno (0 coppie)

_nessuna_

### Durate che differiscono di 40 ms o meno (17 coppie)

| Una durata | L'altra | Differenza | Esempi |
|---|---|---|---|
| 120 ms (1 token) | 140 ms (2 token) | 20 ms | `--durata-barra-azione-opacita` / `--durata-f-primario` `--durata-barra-marchio` |
| 140 ms (2 token) | 160 ms (4 token) | 20 ms | `--durata-f-primario` `--durata-barra-marchio` / `--durata-marchio` `--durata-bolla-2` |
| 160 ms (4 token) | 200 ms (9 token) | 40 ms | `--durata-marchio` `--durata-bolla-2` / `--durata-barra-azione-trasforma` `--durata-menu-2` |
| 200 ms (9 token) | 220 ms (4 token) | 20 ms | `--durata-barra-azione-trasforma` `--durata-menu-2` / `--durata-voce-trasforma` `--durata-pillola` |
| 220 ms (4 token) | 240 ms (8 token) | 20 ms | `--durata-voce-trasforma` `--durata-pillola` / `--durata-barra-azione-opacita-2` `--durata-voce-bordo` |
| 240 ms (8 token) | 280 ms (2 token) | 40 ms | `--durata-barra-azione-opacita-2` `--durata-voce-bordo` / `--durata-scelta-sfondo` `--durata-scelta-testo` |
| 280 ms (2 token) | 300 ms (4 token) | 20 ms | `--durata-scelta-sfondo` `--durata-scelta-testo` / `--durata-menu` `--durata-filo-bolla-bolla-corpo` |
| 300 ms (4 token) | 320 ms (2 token) | 20 ms | `--durata-menu` `--durata-filo-bolla-bolla-corpo` / `--durata-barra` `--durata-barra-azione-trasforma-2` |
| 320 ms (2 token) | 360 ms (6 token) | 40 ms | `--durata-barra` `--durata-barra-azione-trasforma-2` / `--durata-sotto` `--durata-fila-ascolto-pillola` |
| 360 ms (6 token) | 380 ms (2 token) | 20 ms | `--durata-sotto` `--durata-fila-ascolto-pillola` / `--durata-riga` `--durata-entra-titolo` |
| 380 ms (2 token) | 400 ms (1 token) | 20 ms | `--durata-riga` `--durata-entra-titolo` / `--durata-messaggio-sotto` |
| 400 ms (1 token) | 420 ms (6 token) | 20 ms | `--durata-messaggio-sotto` / `--durata-presentazione` `--durata-comandi` |
| 420 ms (6 token) | 460 ms (2 token) | 40 ms | `--durata-presentazione` `--durata-comandi` / `--durata-figura-occhi` `--durata-entra-finestra-trasforma` |
| 460 ms (2 token) | 480 ms (3 token) | 20 ms | `--durata-figura-occhi` `--durata-entra-finestra-trasforma` / `--durata-posto-bolla` `--durata-esito-opacita` |
| 480 ms (3 token) | 500 ms (4 token) | 20 ms | `--durata-posto-bolla` `--durata-esito-opacita` / `--durata-didascalia` `--durata-chiamata` |
| 500 ms (4 token) | 520 ms (3 token) | 20 ms | `--durata-didascalia` `--durata-chiamata` / `--durata-riquadro` `--durata-tavolo-riquadro` |
| 520 ms (3 token) | 560 ms (1 token) | 40 ms | `--durata-riquadro` `--durata-tavolo-riquadro` / `--durata-figura-testa` |

### Altro da decidere
- **Gradini a numero**: le scale (`--corpo-N`, `--spazio-N`…) hanno nomi ordinali perché lo stesso valore serve ruoli diversi; dare a ogni gradino un nome di ruolo è una scelta di progetto.
- **Testo in px**: tutte le grandezze del testo sono in px come nella pagina (non crescono con la grandezza del testo del sistema). Passarle a rem cambia la pagina per chi ha cambiato la grandezza di base.
- **`.f-stato.allarme`** (`--app-stato-allarme`): la riga di stato in allarme della finestra è definita ma nessun elemento e nessuno script la usa; si tiene perché è uno stato della finestra ricostruita.
- **Colori nell'HTML**: il marchio (`#2fb39a`, `#16806f`, bianco) e `theme-color` (`#420017`) stanno nell'HTML, non nel CSS; non sono tokenizzati.
- **Valori in `scena.js`**: curve, durate, colori delle onde e ritardi dell'arrivo scritti nello script (`ENTRA`, `rgba(255,219,225,…)` nel disegno delle onde, durate di 360/520/820/1100 ms…) non passano ancora dai token.

## Dichiarazioni scritte e mai in uso (36): non portate

Stesso selettore, stesse condizioni, stessa proprietà: la pagina le sovrascrive più giù nello stesso foglio. Non cambia nulla toglierle; i loro valori restano qui.

| Componente | Selettore | Proprietà | Valore scritto | Sovrascritta da |
|---|---|---|---|---|
| pulsanti | `.collegamento` | transition | `text-decoration-color 200ms` | `text-decoration-color 200ms, transform 220ms var(--entra)` |
| apertura | `.scena` | z-index | `1` | `2` |
| apertura | `.palco` @ (max-width: 760px) | margin-top | `14px` | `0` |
| apertura | `.didascalia` @ (max-width: 760px) | order | `-1` | `3` |
| apertura | `.didascalia` @ (max-width: 760px) | font-size | `12px` | `12px` |
| apertura | `.didascalia` @ (max-width: 760px) | line-height | `17px` | `17px` |
| apertura | `.didascalia` @ (max-width: 760px) | margin | `0 0 6px` | `14px 0 6px` |
| riunione | `.riunione-filo` @ (min-width: 761px) and (max-width: 1010px) | max-width | `440px` | `none` |
| riunione | `.riunione-filo` @ (max-width: 760px) | margin-top | `4px` | `0` |
| finestra | `.primo-avvio` @ (max-width: 760px) | grid-template-columns | `minmax(0, 1fr)` | `minmax(0, 1fr)` |
| finestra | `.finestra.avvio` @ (max-width: 760px) | width | `100%` | `100%` |
| finestra | `.finestra.avvio` @ (max-width: 760px) | font-size | `13px` | `13px` |
| ascolto | `.voce` | background | `rgba(255, 237, 239, 0.08)` | `transparent` |
| ascolto | `.voce` | border | `1.5px solid rgba(255, 219, 225, 0.28)` | `1.5px solid rgba(255, 219, 225, 0.34)` |
| ascolto | `.voce:hover, .voce:focus-visible` | border-color | `var(--rosa)` | `var(--testo)` |
| ascolto | `.voce[aria-pressed="true"]` | background | `rgba(255, 237, 239, 0.16)` | `var(--testo)` |
| ascolto | `.voce[aria-pressed="true"]` | border-color | `var(--voce)` | `var(--testo)` |
| filo | `.ascolto-voce` | grid-template-columns | `420px minmax(0, 1fr)` | `440px minmax(0, 1fr)` |
| filo | `.ascolto-voce` | column-gap | `80px` | `80px` |
| filo | `.ascolto-voce .luce-tratto` | left | `68%` | `62%` |
| filo | `.ascolto-voce .luce-tratto` | top | `55%` | `50%` |
| filo | `.ascolto-voce .tratto-testo` | top | `130px` | `100px` |
| filo | `.filo` | display | `grid` | `block` |
| filo | `.ascolto-voce .tratto-testo` @ (min-width: 761px) and (max-width: 1180px) | position | `static` | `static` |
| filo | `.ascolto-voce` @ (max-width: 760px) | gap | `34px` | `0` |
| filo | `.ascolto-voce` @ (min-width: 761px) and (max-width: 1010px) | grid-template-columns | `minmax(0, 1fr)` | `clamp(280px, 36vw, 360px) minmax(0, 1fr)` |
| filo | `.ascolto-voce` @ (min-width: 761px) and (max-width: 1010px) | row-gap | `48px` | `0` |
| filo | `.ascolto-voce .voci-filo` @ (max-width: 760px) | margin-top | `20px` | `22px` |
| strada | `.nodo` | border-radius | `50%` | `24px` |
| strada | `.tappa.fatta.acceso .nodo` | transform | `scale(1.06)` | `scale(1.04)` |
| strada | `.non-esiste` | gap | `14px 22px` | `10px 26px` |
| tratti | `.requisiti strong` | color | `var(--testo)` | `var(--bordeaux)` |
| tratti | `.chiusura .luce-tratto` | left | `50%` | `50%` |
| tratti | `.chiusura .luce-tratto` | top | `45%` | `36%` |
| tratti | `.requisiti li` @ (max-width: 760px) | font-size | `18px` | `18px` |
| tratti | `.requisiti li` @ (max-width: 760px) | line-height | `27px` | `27px` |

## Regole senza elemento (45): non portate

Nessun elemento di `index.html` né di `scena.js` ha queste classi (sezioni di una versione precedente: «campioni», «oggi», il lettore, gli ascoltatori). Restano nel foglio di stile di partenza, che non è in questo repository.

`.campioni` · `.campioni-capo` · `.campioni h2, .oggi h2` · `.campioni-capo p` · `.campioni-elenco` · `.campione` · `.campione-scritto` · `.campione-detto` · `.campione-detto span` · `.campione audio` · `.lettore` · `.lettore .pillola` · `.lettore .tondo` · `.lettore .suona .tondo::before` · `.lettore-tempo` · `.campione-altra` · `.campione-altra a` · `.oggi` · `.oggi-colonne` · `.oggi-colonne > div` · `.oggi-colonne > div:nth-child(2)` · `.oggi-colonne > div:nth-child(3)` · `.oggi h3` · `.oggi p` · `.oggi-fatti` · `.oggi-fatti strong` · `.campioni, .oggi` · `.campioni-elenco, .oggi-colonne` · `.ascoltatori` · `.ascoltatore` · `.ascoltatore .figura` · `.ascoltatore .lume` · `.ascoltatore .nome` · `.ascoltatori .guarda .testa` · `.ascoltatori .guarda .occhi`

## Pagine interne: la cornice e «non ancora» (incarico 3a, 16/11/2026)

Valori aggiunti per la prima pagina interna rifatta nella direzione 2 (`../website/non-ancora/`), in un blocco a parte in
fondo a `token.css`. Dove il ruolo è lo stesso di un valore della home il token lo richiama (`var(--…)`), così le due
pagine si muovono allo stesso modo. Componenti nuovi: `componenti/pagina.css` (la cornice delle pagine interne),
`riunione-ferma.css` (la riunione in cui la tua voce non arriva), `strada-ferma.css` (la strada che si ferma a una tappa
vuota), `versioni.css` (l'elenco delle versioni con il posto della prossima).

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--pagina-scena-spazio-sotto` | `96px` | aria sotto il primo schermo di una pagina interna | `pagina.css` `.scena-pagina` |
| `--pagina-primo-tratto-margine` | `0px` | la prima scena comincia subito sotto il primo schermo | `pagina.css` |
| `--coppia-colonne` | `minmax(0, 1fr) minmax(0, 480px)` | un tratto con il testo e un oggetto della scena | `pagina.css` `.tratto.coppia` |
| `--testo-spiegazione-chiara` | `var(--testo-requisiti-chiara)` | la spiegazione sotto un titolo sulla scena chiara | `pagina.css` |
| `--chiamata-ferma-altezza` | `clamp(200px, calc(100vh - 380px), 362px)` | i riquadri sopra la barra del microfono, interi a 1366×640 | `riunione-ferma.css` |
| `--chiamata-ferma-altezza-telefono` | `176px` | i riquadri al telefono | `riunione-ferma.css` |
| `--chiamata-ferma-barra-spazio-interno` | `6px 0 4px` | la barra del microfono nella cornice | `riunione-ferma.css` |
| `--barre-ferme-scala-y` | `0.14` | la voce piatta nel posto vuoto | `riunione-ferma.css` |
| `--bolla-nasce-scala` | `var(--messaggio-filo-bolla-scala)` | la bolla nasce dalla coda | `riunione-ferma.css`, `non-ancora.js` |
| `--durata-bolla-nasce` | `var(--durata-messaggio-filo-bolla-trasforma)` | idem | idem |
| `--ritardo-bolla-ferma` | `1900ms` | la bolla nasce dopo l'ultimo riquadro | `riunione-ferma.css` |
| `--durata-cerca`, `--ritardo-cerca` | `1300ms`, `2500ms` | il puntatore resta sul posto vuoto di «Kalliope» | `riunione-ferma.css` |
| `--durata-urto`, `--ritardo-urto` | `900ms`, `2780ms` | l'onda tratteggiata del posto vuoto (la durata delle onde della home) | `riunione-ferma.css`, `strada-ferma.css`, `non-ancora.js` |
| `--urto-scala` | `1.18` | fin dove si allarga l'onda del posto vuoto | idem |
| `--durata-mancante-nota`, `--ritardo-mancante-nota` | `var(--durata-scelta-testo)`, `2900ms` | «non c'è» accanto a «Kalliope» | `riunione-ferma.css` |
| `--opacita-tappa-spenta` | `0.42` | le tappe che la voce non raggiunge | `strada-ferma.css` |
| `--versioni-titolo-margine` | `2px 4px 10px` | il titolo dell'elenco delle versioni | `versioni.css` |
| `--versione-spazio-interno` | `12px 16px 13px` | una riga dell'elenco | `versioni.css` |
| `--durata-respira`, `--ritardo-respira`, `--respira-scala` | `1400ms`, `520ms`, `1.015` | il posto della prossima versione respira una volta | `versioni.css` |

Non ancora nei token (come in `scena.js` per la home, «Da decidere» in `SISTEMA.md`): i tempi della strada e i parametri
delle onde dentro `../website/non-ancora/non-ancora.js` (gli stessi numeri di `scena.js`). Il catalogo non mostra ancora i
quattro componenti nuovi: lo farà il ruolo di costruzione (durante l'incarico 3a il catalogo era in lavorazione dall'incarico 1).

### Correzioni dopo il giudizio (incarico 3a, giro di correzioni)

Nel blocco «Pagine interne» di `token.css` non esistono più `--durata-cerca`, `--ritardo-cerca`, `--ritardo-urto`,
`--ritardo-mancante-nota`, `--durata-respira`, `--ritardo-respira`, `--respira-scala` (il tentativo sul posto di «Kalliope» e
il respiro della prossima versione non si vedevano: sono stati rifatti). `--chiamata-ferma-altezza-telefono` passa da `176px`
a `152px`. Nuovi:

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--didascalia-margine-pagina-telefono` | `8px 0 0` | al telefono la didascalia sta subito sotto la scena | `pagina.css` |
| `--ritardo-segno` | `2400ms` | il segno della scelta parte verso «Kalliope» (dall'arrivo sulla pagina) | `non-ancora.js` |
| `--durata-segno-va`, `--attesa-segno`, `--durata-segno-torna` | `420ms`, `900ms`, `520ms` | va sul posto vuoto, resta svuotato, torna al microfono del computer | `non-ancora.js` |
| `--opacita-segno-vuoto` | `0.16` | il segno sul posto vuoto: non c'è niente da scegliere | `non-ancora.js` |
| `--urto-scelta-scala` | `1.32` | l'onda tratteggiata del posto vuoto nella barra del microfono | `riunione-ferma.css` |
| `--versioni-piede-spazio-interno` | `12px 2px 2px` | sotto l'elenco: il comando per tenerne l'indirizzo | `versioni.css` |
| `--versione-nuova-ombra` | `0 0 0 2px var(--voce), 0 0 26px 4px var(--bordo-evidente)` | l'ultima versione appena arrivata in cima | `versioni.css` |
| `--durata-arriva-in-cima`, `--ritardo-arriva-in-cima` | `1900ms`, `250ms` | l'ultima versione compare in cima, resta, scende; poi si apre il posto tratteggiato | `versioni.css` |
| `--durata-posto-testo`, `--ritardo-posto-testo` | `360ms`, `2050ms` | «Windows e macOS · compariranno qui» si scrive nel posto aperto | `versioni.css` |

`--durata-urto` vale ora anche per il posto della prossima versione che si accende una volta quando si copia l'indirizzo
(`versioni.css`, `.ricordata`). La soglia d'altezza `500px` (telefono girato) è dichiarata in `metodo.config.mjs`.
