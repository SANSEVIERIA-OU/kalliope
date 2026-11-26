#!/bin/bash
# Il giro finale, parte 1, sui file H: il catalogo nei tre motori e la robustezza in Chromium. Esiti in esiti/.
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
until [ -f /tmp/lavoro-3cb-via-libera ]; do sleep 20; done
NOME=$(cat /tmp/lavoro-3cb-via-libera)   # l'albero finale da provare (una cartella /tmp/lavoro-3cb-radice-<NOME>)
source /workspace/kalliope/materiali-locali/playwright/env.sh
H=/tmp/lavoro-3cb-sito-$NOME
cat_() { # motore misura
  local f="$AQUI/esiti/catalogo-$NOME-$1-$2.txt"
  { echo "# catalogo · $NOME · $1 $2 · $(date '+%d/%m/%Y %H:%M')"; PORTA=8896 node "$AQUI/prove/catalogo.mjs" $H /tmp/lavoro-3cb-foto-catalogo-$NOME $1 $2 2>&1 | grep -v "Skipping host"; echo "# uscita: ${PIPESTATUS[0]}"; } > "$f"
  echo "catalogo $1 $2: $(tail -3 "$f" | head -1)"
}
cat_ chromium 1440x900; cat_ chromium 390x844; cat_ firefox 1440x900; cat_ webkit 1440x900
bash "$AQUI/prove/giro.sh" $NOME 8896 chromium:1440x900:tutti chromium:390x844:tutti chromium:1366x501:primo,stabile chromium:1280x520:primo,stabile chromium:1366x640:primo,stabile,frasi,sistema chromium:1024x768:primo,stabile,frasi,sistema,copia chromium:844x390:primo,stabile,sistema,ancore,tastiera-veloce,frasi,copia,senza-js,senza-stili,senza-token,ridotto,scorrimento,secondo-piano,ritorno,ricarica,a-meta chromium:360x640:primo,sistema,ancore,tastiera-veloce,frasi,copia,senza-js,senza-stili,senza-token,ridotto,scorrimento,secondo-piano,ritorno,ricarica,a-meta
echo fine
