# Il sito di Kalliope (termine di paragone scelto dal proprietario: la fonte dell'identità)

Legenda: **[O]** osservato in foto/video salvati · **[M]** misurato (`valori.js`, `movimento-visibile.mjs`) · **[L]** letto nel codice o nei documenti del progetto · **[I]** interpretazione.
Non è un concorrente: la scheda segue lo stesso formato per poter mettere i valori accanto agli altri.

## 1. Scheda
- https://sansevieria-ou.github.io/kalliope/it/ (home) e `/it/riunione/` (visitate in Chrome il 26/11/2026, 1440×900 a densità 1, tema «scuro» e tema «chiaro» emulati). Foto: `foto/kal-01-home-scuro.png`, `foto/kal-02-home-chiaro.png`, `foto/kal-03-riunione.png`. Misure: `valori/kalliope-sito-home-scuro-desktop.json`, `valori/kalliope-sito-home-chiaro-desktop.json`, `valori/kalliope-sito-riunione-desktop.json`. Video della demo della home: `video/kalliope-demo-home.mp4`, misura `video/kalliope-demo-home-mv/` (zona 700,90,650×700).
- Non visto: telefono, le altre pagine (stato, installa, aiuto), la pagina `/it/in-riunione/` dà «Pagina non trovata» (l'indirizzo giusto è `/it/riunione/`; `foto/kal-03-in-riunione.png`). Nella foto di `/it/riunione/` la pagina era a metà dell'entrata animata.

## 2. Premio
Nessuno.

## 3. Chi lo usa
Chi non può parlare o fa fatica, in riunione [L: `README.md`, home: «Un programma per chi non può parlare o fa fatica. Scrivi una frase e premi Invio: una voce italiana naturale la dice nella riunione.»].

## 4. Il percorso della home (osservato)
1. [O] Barra in alto: logo (bolla rosa-magenta **metà piena e metà tratteggiata**) + «Kalliope»; voci «Ascolta», «Stato e limiti», «Installa», «In riunione», «Aiuto».
2. [O] Titolo grande in tre-quattro righe («In riunione, alla pari. Tu scrivi, gli altri ti sentono.»), una frase, un pulsante a pillola menta «**Scarica e installa**» e un collegamento «Non uso Linux: cosa posso fare →»; una riga «**Oggi:** versione 0.2, solo per Linux (x86_64 con PipeWire). Non ancora provata in una riunione vera con Zoom, Teams o Meet.»
3. [O] **Demo animata a destra**: una riunione video finta con 4 riquadri («**Tu · microfono «Kalliope»**» con una barra a equalizzatore, **Paola**, **Luca**, **Anna**) e, sotto, **la ricostruzione della finestra di Kalliope 0.1** («Ricostruzione della finestra di Kalliope 0.1 · la voce è la registrazione vera · scrittura accelerata, partecipanti di esempio») con una riga di stato, un campo «Scrivi qui e premi Invio per parlare», «Parla», «Ferma»; sotto un pulsante a pillola «**▶ Ascolta Giulia**».
4. [O] Sequenza della demo (`video/kalliope-demo-home-mv/tratto-3.jpg` e `tratto-4.jpg`): **a)** la frase compare nel campo in scrittura accelerata, lo stato dice «**Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.**» (striscia azzurra chiara), «Parla» è blu pieno, «Ferma» è spento; **b)** all'**Invio**: lo stato diventa «**Sto parlando…**» (striscia verde chiara), «Parla» si spegne in grigio, «Ferma» si accende, il campo si svuota; **c)** la frase vecchia (bolla grigio-menta spenta) lascia il posto a **una bolla bianca** con la frase nuova; **d)** «Tu» prende un **contorno menta**, le barre dell'equalizzatore salgono e scendono, **anelli concentrici menta si allargano dal riquadro di «Tu» fino agli altri tre**, che prendono un contorno menta quando l'anello passa; **e)** **le parole della bolla si scuriscono una dopo l'altra**: dette = quasi nero (`#171d1d`), da dire = grigio chiaro; **f)** a fine frase la bolla resta tutta scura, gli anelli si fermano, l'equalizzatore torna piccolo e lo stato torna a «Pronta».

## 5. Come guida la persona
Una promessa in alto (titolo), un solo comando evidenziato (verde menta, 56 px, a pillola), l'onestà sullo stato («Oggi: … non ancora provata»), poi la prova viva. Come sa dove si trova: la voce attiva del menu ha un fondo grigio in una pillola (`foto/kal-03-riunione.png`). Che risposta dà a ogni azione: la demo mostra i tre stati (pronta / parla / fatta).

## 6. L'interfaccia al servizio del compito (misurato)
- **Colore** [M home scura]: fondo `#1b2223` (graphite) 73%; testo `#f2f5f4` 70%; **azione `#91dfbd`** (menta) sul pulsante, con testo `#152c24`; la voce che suona `#b5e8d2`; bolla bianca `#f2f5f4` con testo `#171d1d`; riquadri dei partecipanti **`#3d4e62` (Luca), `#655147` (Paola), `#55465c` (Anna)** e `#263b35` («Tu»); bordo sottile `#b5dace` al 14% (`#b5dace24`) e al 40% (`#b5dace66`). Nella demo, la finestra imitata usa anche `#005fb8` (blu) per «Parla», `#c3c3c3`/`#fdfdfd`/`#eef3fb` (grigi e azzurro chiaro): **il blu non appartiene all'identità del sito**, è della ricostruzione della finestra 0.1.
- **Tema chiaro: assente.** [M] La home in emulazione «chiaro» è identica a quella «scuro» (`valori/kalliope-sito-home-chiaro-desktop.json` ha gli stessi fondi). [L] `grep prefers-color-scheme` in `design-system/token.css`, `base.css` e `componenti/` non trova nulla: **il sistema non ha un tema chiaro** (come dice `CLAUDE.md`: «il tema chiaro si aggiunge al sistema»).
- **Tipografia** [M]: **Lexend** 97% (pesi 700, 400, 500, 600; grandezze 62, 24, 20, 18, 17, 16, 15, 13 px; spaziatura −1,116 px sul titolo da 62 px, −0,22 e −0,12 sugli altri); e **«DejaVu Sans Kalliope»** 14 px per la finestra imitata (3-6%). [L] `--font-app: "DejaVu Sans Kalliope", "DejaVu Sans", sans-serif` e `--font-testo: "Lexend"…` in `token.css`; **un carattere per scrittura** (Geologica, Readex Pro, Noto Nastaliq Urdu, Noto Sans Bengali/Devanagari, per le lingue non latine; `design-system/caratteri/`).
- **Forme** [M]: pillole raggio 999 px, alte 56 px (il 50% dei pulsanti misurati); pulsanti piccoli della finestra imitata raggio 4 px, alti 32 px. Bolla con angolo ~24 px e una **coda** (stima visiva).
- **Dimensione della finestra** [L `token.css`]: `--app-native-width: 560px`, `--app-native-height: 460px`, minimo `360×320`.
- **Logo** [L `design-system/marchio/*.svg`]: `#e6396e` (magenta), `#ffedef`, `#fab7c2`, `#2e3436`; il logo **conserva i suoi colori** (CLAUDE.md, 26/11).
- **Movimento** [M `valori.js`]: opacità lineare 160 ms (17 volte), opacità + colore di fondo 240 ms ease (7), colore/sottolineatura 200 ms ease, ombra 220/320 ms ease, **trasformazioni 220, 240, 300, 460, 560 ms con `cubic-bezier(0.19, 1, 0.22, 1)`** (uscita rapida con coda lunga, «easeOutExpo»), animazione di opacità 350 ms lineare.

## 7. Cosa insegna e cosa non prendere
- Per l'app: l'**identità è: graphite, menta, bianco, Lexend, pillole, anelli, equalizzatore**. **Lo stato «Sto parlando…» e le parole che si scuriscono una dopo l'altra sono già disegnate e animate** (nel sito); l'app può **riusarli come stesso gesto**.
- Non prendere: la finestra imitata della 0.1 (DejaVu, blu `#005fb8`, bottoni a 4 px): è esattamente ciò che il proprietario ha detto di non volere («orripilante»); i riquadri della riunione (appartengono alla promessa, non al programma).

## 8. Il pubblico, con i livelli
Chi arriva da un invito a una riunione (poca dimestichezza), chi installa (Linux), chi vuole capire lo stato: la pagina «Oggi» lo dice.

## 9. Esperienza e sensazioni
Primi cinque secondi: la parola «riunione» e una scena viva; il controllo è della persona (la demo è «scrittura accelerata»). Tre aggettivi: notturna, calma, viva. Il tono: frasi corte in seconda persona («Tu scrivi, gli altri ti sentono»).

## 10. Scheda degli elementi

| Famiglia | Elemento | Dove e quando | Cosa fa | Sensazione | Foto |
|---|---|---|---|---|---|
| risposta | striscia di stato «Pronta…» / «Sto parlando…» | sopra il campo | dice cosa succede | onesta | `video/kalliope-demo-home-mv/tratto-3.jpg` |
| risposta | parole che si scuriscono una a una | bolla | segue la voce | viva | `video/kalliope-demo-home-mv/tratto-4.jpg` |
| movimento | anelli menta dal riquadro «Tu» agli altri | demo | mostra che gli altri sentono | emozionante | idem |
| forma | pulsante menta a pillola 56 px | titolo | l'unico comando | netto | `foto/kal-01-home-scuro.png` |
| colore | graphite + menta | tutto | identità | calma | idem |
| gesto | «Parla» / «Ferma» | finestra imitata | avvia, interrompe | funzionale, non bello | `video/kalliope-demo-home-mv/tratto-3.jpg` |
| navigazione | pillola grigia sulla voce attiva | barra | dove sei | discreta | `foto/kal-03-riunione.png` |

## 11. Cosa serve al sistema (e all'app)
Mancano nel sistema: **il tema chiaro**; **i componenti della finestra nuova** (campo di scrittura grande, striscia di stato, cronologia, registratore); **il carattere dell'app** (oggi `--font-app` è DejaVu, quello del 0.2). Presenti e riusabili: azione, voce, bolla, equalizzatore, anelli, pillola, durate e curve.

## 12. Immagini, video, suono
La demo è codice (HTML/CSS/JS), non un video; il pulsante «Ascolta Giulia» propone una voce [L dalla riga «la voce è la registrazione vera»]; **non l'ho premuto e non ho registrato il suono**. Se non si carica: il titolo e il pulsante bastano (la riga «Ricostruzione…» lo dichiara).

## 13. Inventario del motion design (demo della home, [M] dallo screencast, zona 700,90,650×700)

| ID | Effetto | Tempo visibile | Come cambia ciò che c'era | Ritmo |
|---|---|---|---|---|
| K1 | entrata della scena | tratto 2: 0,69→4,76 s, 4067 ms | sfuma 49%, salta 44% | metà a 749 ms, nove decimi a 2883 ms |
| K2 | cambio di bolla (la nuova sale, la vecchia si spegne) e inizio della voce | tratto 3: 5,09→7,32 s, 2232 ms | coperto/spostato 61% | metà a 400 ms, nove decimi a 1232 ms |
| K3 | **parole che si scuriscono in sequenza** | tratto 4: 7,74→13,83 s, **6085 ms** per una frase di 17 parole [I: ~0,36 s a parola] | **sfuma 71%** | metà a 3732 ms, nove decimi a 5275 ms |
| K4 | fine della frase, stato torna «Pronta» | tratto 5: 14,37→15,17 s, 801 ms | sfuma 66% | metà a 67 ms |
| K5 | impulso minimo | tratto 6: 16,07→16,47 s, 399 ms | salta 58% | metà a 33 ms |
Interruzione («Ferma»): **non provata**. Movimento ridotto: **non provato**. Costo: nessun calo di fotogrammi visto (399 fotogrammi in 32,6 s con grafica in software).

## 14. Le 21 dimensioni
impaginazione, navigazione, colore, forme, dimensioni, tipografia, movimento, risposta, parole, suono (demo con voce): osservate o misurate; tema chiaro: assente verificato nel codice; telefono: non visto; materiali (vetro/sfocatura: la barra compatta ha `--barra-piena`, nessuna sfocatura [L]), prestazioni: letti.

## 15. Peculiarità
- **Le parole che si scuriscono mentre la voce le dice** dentro una bolla bianca.
- **Gli anelli menta che partono da «Tu» e arrivano agli altri**: «mostrare che gli altri ti sentono» come immagine.
- **L'onestà sullo stato** («non ancora provata in una riunione vera»).
- Un solo accento (menta) per ciò che si preme.
