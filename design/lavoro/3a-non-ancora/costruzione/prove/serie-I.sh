#!/bin/bash
# Serie I: il catalogo vivo in tre motori; la pagina contro la scelta della direzione (confronta-scelta.mjs)
AQUI="$(cd "$(dirname "$0")" && pwd)"; SITO=/tmp/lavoro-3ab-sito-G
S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts
cd "$AQUI/.."
for mo in chromium webkit firefox; do LIMITE=200 bash prove/registra.sh F-catalogo-$mo node prove/catalogo.mjs $SITO /tmp/lavoro-3ab-F-catalogo $mo 1440x900; done
LIMITE=120 bash prove/registra.sh F-catalogo-chromium-390 node prove/catalogo.mjs $SITO /tmp/lavoro-3ab-F-catalogo chromium 390x844
# la pagina contro quella che la direzione ha reso (commit 0cf5c64): a riposo, in 5 misure
export PLAYWRIGHT=${PLAYWRIGHT:-/workspace/test-playwright/node_modules/playwright/index.mjs}
{ echo "# confronta-scelta · «non ancora» come l'ha resa la direzione (0cf5c64) contro adesso · $(date '+%d/%m/%Y %H:%M')"
  timeout 200 node $S/confronta-scelta.mjs /tmp/lavoro-3ab-sito-base $SITO /tmp/lavoro-3ab-F-confronto-ridotto --pagina it/non-ancora/index.html --misure 1440x900,390x844,1366x640,844x390,360x640 --ridotto --attesa 1500 2>&1; echo "# uscita $?"; } > esiti/F-confronta-scelta-ridotto.txt
tail -8 esiti/F-confronta-scelta-ridotto.txt | cut -c1-200
