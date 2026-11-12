# Incarico: revisione visiva del primo percorso (attività `visual-qa`, cancello di `direzione.md` §5)

Leggi prima `design/incarichi/comune.md` (anche la riga su `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`).
Ruolo: vibe-next:design-visual. **Non modificare `site/`**: scrivi i difetti; li corregge il ruolo di costruzione.

## Scopo
Giudicare il primo percorso completo del sito di Kalliope prima che il coordinatore lo mostri al proprietario:
qualità e riconoscibilità (le domande di `<skill>/references/direzione.md` §5), composizione, contenuti, e i
comportamenti del percorso. Leggi `design/direzione.md` (ambizione A1-A5, direzione «Carta e voce»), `design/progetto.md`
(persone e percorsi P1-P6, P9) e l'autovalutazione `design/prove-percorso/revisione-qualita.md`: confermala o smentiscila
con le tue foto, non ripeterla.

## Come
- Anteprima: `python3 -I tools/site.py --out /tmp/kalliope-rev --release-json /tmp/sitetest/releases.json`, poi servi
  `/tmp/srv-rev/kalliope` → `/tmp/kalliope-rev` (link simbolico) con `python3 -m http.server --bind 127.0.0.1 PORTA`
  dentro lo stesso comando con `timeout` (mai lasciato in background). Il sito vive sotto `/kalliope/`.
- `passo.mjs` (posto `leggero`, senza finestra) per i gesti: arrivo → Ascolta (avvia una voce, cambia voce, ferma) →
  Stato → Installa (scegli la distribuzione, copia un comando, «Se ti sei fermato qui») → In riunione → Aiuto (filtra,
  nessun risultato) → Non ancora → 404. Tastiera da sola per tutto il percorso almeno una volta.
- Computer 1440×900 e telefono 390×844 in Chromium; poi lo stesso giro, più veloce, in **Firefox** e **WebKit**
  (ora si avviano: è la prima volta che il sito li vede). Movimento ridotto, testo 200%, colori forzati, tema scuro,
  senza JavaScript almeno sulle pagine Ascolta e Installa.
- Guarda ogni foto a grandezza utile. Cerca perdita di contenuto, ambiguità, ostacoli al compito, incoerenze con la
  direzione, gerarchia debole, testi poco chiari per chi legge con fatica (afasia) o da telefono.

## Risultati
`design/revisione-visiva.md`: giudizio d'insieme (riconoscibilità: si capisce che è Kalliope e non un sito qualunque?),
poi i difetti in ordine di gravità, ciascuno con pagina, motore, misura del viewport, foto (in
`design/prove-percorso/revisione/`), cosa si vede, perché è un problema e per chi, proposta di correzione. Separa ciò che
blocca la presentazione al proprietario da ciò che può aspettare. Progresso: `design/incarichi/revisione-percorso/progresso.md`.
Risposta finale: al massimo 12 righe.
