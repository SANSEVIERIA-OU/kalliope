# Progresso visita-2 (R04 Waymo Safety Hub, R05 LALAL.AI, R06 Through Sliding Doors)

Worker: design-visual (modello nativo dichiarato dall'host: Sonnet 5.5, non verificato a runtime). Avvio 12/11/2026 19:09, chiusura 20:05.
Strumento: `passo.mjs` posto `leggero` l2 (liberato), senza finestra, ogni comando con `env -u DISPLAY -u WAYLAND_DISPLAY`; nessun Chrome MCP in questo host; Firefox/WebKit non avviabili (capacita' misurata). Wrapper miei in `design/ricerca/strumenti/`: `visita2-passo.sh`, `visita2-testo.sh`, `visita2-senza-posto.mjs` (senza JS, rete lenta, stampa, albero, telefono 390x844), `visita2-fogli.py` (montaggi di foto gia' salvate). Registri integrali in `log/`, sorgenti delle osservazioni in `osservazioni-sorgente/` (scrivi.py).

## Stato
- R04 FATTO: `design/ricerca/schede/R04.md`, `osservazioni/R04.json` (--controlla: «Formato pulito», uscita 0), `movimento/R04.md`, `prove/R04/`.
- R05 FATTO: `schede/R05.md`, `osservazioni/R05.json` (uscita 0), `movimento/R05.md`, `prove/R05/`.
- R06 FATTO (con limite grave): `schede/R06.md`, `osservazioni/R06.json` (uscita 0), `movimento/R06.md`, `prove/R06/`. ⚠ LENTO 4-5 fps (WebGL in software): capitoli solo al telefono (3000 px su 21063), niente suono.
- Ultimo comando: `confronta-riferimenti.mjs --controlla` sui tre file.

## Problemi aperti / limiti
- Nessun Chrome MCP; telefono di passo.mjs = 430x932 (non 390x844): i 390x844 vengono dallo script senza posto (foto senza gesti).
- Moduli non inviati; nessun file caricato su LALAL.AI; nessun download; Quick exit e linee di aiuto di R06 non seguiti.
- Rete lenta: foto con nome = secondo bersaglio, non istante reale (vedi `riepilogo-senza-posto.json`); la prima prova `rete-lenta/` e' rada.
- Caratteristiche aggiunte al vocabolario (da segnalare al coordinatore): R05 «compromessi dichiarati nelle opzioni», «sovrapposizione di messaggi al primo arrivo»; R06 «avvertenza sui contenuti con uscita rapida», «scelta del suono prima di entrare»; R05 ambito «testo 200% · zoom».
- Da fare dal coordinatore: confronto `confronta-riferimenti.mjs` su tutte le osservazioni; matrice di copertura.
