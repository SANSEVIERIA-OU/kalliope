#!/bin/bash
# Le controprove: gli stessi controlli di robustezza.mjs sulla copia di partenza (548a6f2, siti P e P2 con --pseudo): ciò che la costruzione ha corretto deve FALLIRE lì.
# Uso: bash controprove.sh   (scrive esiti/controprova-*.txt: ognuno comincia con la riga che dice che cosa si prova)
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
source /workspace/kalliope-playwright/env.sh
R() { # nome, sito, motore, misura, scenari, [opzioni…]
  local nome=$1 sito=$2 motore=$3 misura=$4 scenari=$5; shift 5
  local file="$AQUI/esiti/controprova-$nome.txt"
  { echo "# controprova · $nome · sito $sito (548a6f2) · $motore $misura · $scenari $* · $(date '+%d/%m/%Y %H:%M')"; PORTA=8895 timeout 900 node "$AQUI/prove/robustezza.mjs" /tmp/lavoro-3cb-sito-$sito /tmp/lavoro-3cb-rob-controprova "$motore" "$misura" "$scenari" "$@" 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$file"
  echo "$nome: $(grep -c '^ok' "$file") ok, $(grep -c '^NO' "$file") NO"
}
mkdir -p /tmp/lavoro-3cb-rob-controprova "$AQUI/esiti"
R primo-844x390 P2 chromium 844x390 primo                                   # il pulsante esce dallo schermo (la regola dell'«installa» scavalcava quella della cornice)
R primo-enXA-1366x640 P2 chromium 1366x640 primo --lingua=en-XA             # il pulsante esce dallo schermo con il testo più lungo del 40%
R primo-arXB-1024x768 P2 chromium 1024x768 primo --lingua=ar-XB
R frasi-1024x768 P2 chromium 1024x768 frasi                                 # la finestra sta sopra il titolo e non si vede cambiare
R frasi-844x390 P2 chromium 844x390 frasi
R frasi-390x667 P2 chromium 390x667 frasi
R senza-js-1440x900 P2 chromium 1440x900 senza-js                           # l'entrata si ripete a ogni scelta; la versione non c'è
R ridotto-1440x900 P2 chromium 1440x900 ridotto                             # i file arrivano con l'attesa delle transizioni
R ancore-1440x900 P2 chromium 1440x900 ancore                               # gli indirizzi vecchi portano in cima
R ancore-390x844 P2 chromium 390x844 ancore
R copia-844x390 P2 chromium 844x390 copia                                   # la risposta dell'indirizzo sotto il bordo; l'errore non annunciato
R ricarica-chromium P2 chromium 1440x900 ricarica                           # la scelta si perde ricaricando
R ricarica-webkit P2 webkit 1440x900 ricarica
