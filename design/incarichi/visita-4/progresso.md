# Progresso: visita-4 (R50 Text-to-Mic, R51 Proloquo, R52 Grid, R53 Voiceitt; fonti di registro G01-G04)

Worker: vibe-next:design-visual (attivita visit + site-analysis + motion), nessun agente annidato.
Incarico: design/incarichi/visita-4.md. Regole: design/incarichi/comune.md.
Strumento: passo.mjs posto leggero (l4:5db0249b, liberato), senza finestra; ogni comando con env -u DISPLAY -u WAYLAND_DISPLAY.
Chrome MCP: non presente in questo host (dichiarato nelle schede).
Modello: Sonnet 5.5 dichiarato dal prompt di sistema; non verificato dai metadati dell'host.

## Stato (12/11/2026)

| Unita | Stato | Dove |
|---|---|---|
| U0. Lettura regole, skill, piano, selezione, fonti C | fatta | |
| R50 Text-to-Mic | scheda, osservazioni (controllate, uscita 0), movimento, prove: fatti | schede/R50.md, osservazioni/R50.json, movimento/R50.md, prove/R50/ |
| R51 Proloquo | idem | schede/R51.md, osservazioni/R51.json, movimento/R51.md, prove/R51/ |
| R52 Grid (+ Smartbox Hub) | idem | schede/R52.md, osservazioni/R52.json, movimento/R52.md, prove/R52/ |
| R53 Voiceitt (+ FAQ) | idem | schede/R53.md, osservazioni/R53.json, movimento/R53.md, prove/R53/ |
| G01-G04 fonti di registro | foto computer e telefono, testi, statistiche, registro scritto | registro-italiano.md, prove/G01-G04, prove/registro-statistiche.jsonl |
| Script 390x844 / senza JS / rete lenta / stampa / rete / media bloccato | fatti per R50-R53; G01-G04 solo telefono e rete | strumenti/visita4-misure.mjs, prove/<ID>/script/ |

## Ultimo comando
node visita4-misure.mjs G04 … --solo=telefono,rete; poi python3 visita4-osservazioni.py + confronta-riferimenti.mjs --controlla (uscita 0).

## Prossimo passo
Nessuno per questo incarico. Il coordinatore può lanciare confronta-riferimenti.mjs sui quattro file e unire con R01-R22.

## Problemi aperti e limiti
- passo.mjs avvia mobile apre 430x932, non 390x844 (piano 7.3): il 390x844 è nello script (prove/<ID>/script/).
- R50: primo gesto con orologio 0.07x (⚠ OROLOGIO): durata della pulsazione del Play = keyframe, non tempo verificato.
- R51: riproduzione dei campioni di voce non osservabile (nessuna uscita audio).
- R53: foto di rete lenta a 1,5 s in timeout; con il consenso aperto il Tab al comando principale non è misurabile.
- Errore di percorso: foto 004-008 di prove/G02/telefono sono di G03 (copiate in prove/G03/telefono/001-005; vedi LEGGIMI-ERRORE.txt e G03/LEGGIMI.txt). Nessun file cancellato.
- Foto prove/R52/telefono/002-clic.jpg: clic fuori schermo per errore, senza effetto.
- Nuove caratteristiche (non nel vocabolario di §8, da segnalare al coordinatore): «testimonianze di utenti» (fiducia), «finestra del consenso ai cookie» (arrivo), «tema scelto dalla persona» (menu).
- Non verificati: lettore di schermo vero, Firefox e WebKit, uso reale dei prodotti, ascolto di voci e video.
- 390x844 di G01: il layout viewport risulta 398 px (scroll orizzontale di circa 8 px).
