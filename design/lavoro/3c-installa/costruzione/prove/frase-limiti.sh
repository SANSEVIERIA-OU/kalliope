#!/bin/bash
# L'esame dei soli stati della frase premuta (installa-frase, -microfono, -tolta) sull'albero indicato, a tutte le misure (soglie, dispositivi e finestre basse, altezze): serve a scrivere i limiti. Uso: bash frase-limiti.sh <albero> <porta>
set -uo pipefail
AQUI="$(cd "$(dirname "$0")/.." && pwd)"
NOME=$1; PORTA=$2
export RADICE=/tmp/lavoro-3cb-radice-$NOME; SITO=/tmp/lavoro-3cb-sito-$NOME
source /workspace/kalliope/materiali-locali/playwright/env.sh
export PAGINE=installa-frase,installa-frase-microfono,installa-frase-tolta
DISP="390x844,360x740,844x390,412x915,750x832,466x678,951x669,326x326,440x706,440x744,421x616,861x609,820x1180,1180x820,1440x900,1366x640,1280x720,1024x768,390x667,360x640,320x568,1920x1080"
node "$AQUI/prove/con-server.mjs" "$PORTA=$SITO" -- node "$SKILL/scripts/soglie.mjs" "http://127.0.0.1:$PORTA/" --pagina it/installa/index.html --altezza 900 > "$AQUI/esiti/$NOME-soglie.txt" 2>&1
SOGLIE=$(awk '/^Misure da provare/{getline; print; exit}' "$AQUI/esiti/$NOME-soglie.txt" | tr -d ' ')
RIGHE=5 bash "$AQUI/prove/corsa.sh" "$NOME-frasi-misure" $PORTA $SITO esame-impaginazione.mjs chromium normale installa "$DISP"
RIGHE=5 bash "$AQUI/prove/corsa.sh" "$NOME-frasi-soglie" $PORTA $SITO esame-impaginazione.mjs chromium normale installa "$SOGLIE"
for w in 390 844 1366 1440; do M=""; for h in 500 501 699 700 759 760 799 800 802 803 819 820; do M="$M,${w}x$h"; done
  RIGHE=5 bash "$AQUI/prove/corsa.sh" "$NOME-frasi-altezze-$w" $PORTA $SITO esame-impaginazione.mjs chromium normale installa "${M#,}"; done
python3 -I "$AQUI/prove/limiti-da-esito.py" "$AQUI"/esiti/$NOME-frasi-*.txt
