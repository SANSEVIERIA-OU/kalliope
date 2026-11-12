# Progresso: visita-1 (R01 Signs, R02 Touch: Beyond Vision, R03 ElevenAgents)

Worker: vibe-next:design-visual (attivita `visit` + `site-analysis` + `motion`), nessun agente annidato.
Incarico: `design/incarichi/visita-1.md`. Regole: `design/incarichi/comune.md`.
Strumento: `passo.mjs` posto `leggero` (senza finestra, ogni comando con `env -u DISPLAY -u WAYLAND_DISPLAY`).
Chrome MCP: non presente in questo host.

## Stato

| Unita | Stato | Note |
|---|---|---|
| U0. Lettura regole, skill, piano §7-§8, selezione, fonti A | fatta | |
| R01 Signs | FATTO: scheda, osservazioni (controllate, uscita 0), movimento, prove, misure (senza JS, rete lenta, stampa, 390x844) | schede/R01.md, osservazioni/R01.json, movimento/R01.md, prove/R01/ |
| R02 Touch: Beyond Vision | FATTO: scheda, osservazioni (controllate, uscita 0), movimento, prove, misure | schede/R02.md, osservazioni/R02.json, movimento/R02.md, prove/R02/ |
| R03 ElevenAgents | FATTO: scheda, osservazioni (controllate, uscita 0), movimento, prove, misure | schede/R03.md, osservazioni/R03.json, movimento/R03.md, prove/R03/ |

## Ultimo comando
`python3 -I design/ricerca/strumenti/visita1-osservazioni.py` poi `node <skill>/scripts/confronta-riferimenti.mjs --controlla osservazioni/R0N.json` (R01, R02, R03: «Formato pulito», uscita 0).

## Prossimo passo
Nessuno: tre riferimenti completi. Posti passo.mjs: liberati (`stato` senza posti miei). Il coordinatore può lanciare il confronto (`confronta-riferimenti.mjs`) sulle tre osservazioni.

## Problemi aperti
- `passo.mjs avvia mobile` apre un viewport 430x932 (codice: `[430, 932]`), non 390x844 del piano §7.3: la misura
  effettiva si verifica con `valuta`; il 390x844 si prende con uno script mio dopo aver liberato il posto.
- Prima metà del lavoro: ricerca con passo.mjs (posto l3), liberato; per il ridotto di R02/R03 ho preso e liberato un secondo posto (l1).
- Strumenti miei in `design/ricerca/strumenti/`: visita1-p.sh, visita1-variante.sh, visita1-analizza.py, visita1-lettura.js, visita1-bersagli.js, visita1-misure.mjs, visita1-primo-schermo.mjs, visita1-nojs.mjs, visita1-contrasto.py, visita1-osservazioni.py.
- Ho aggiunto tre caratteristiche non presenti in piano.md §8, da segnalare al coordinatore: «zoom al 200%» (ambito «testo 200%»), «tenuta con colori forzati» (ambito «arrivo computer»), «zoom della pagina consentito dal meta viewport» (ambito «arrivo telefono»).
- Misure con la macchina carica (carico fino a 15 su 12 CPU, altri worker): tempi di caricamento e tween in JS vanno letti con prudenza.
