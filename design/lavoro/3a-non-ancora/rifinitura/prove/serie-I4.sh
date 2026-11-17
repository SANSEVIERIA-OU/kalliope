#!/bin/bash
# Il confronto con ciò che il proprietario ha visto (82823d5) sulla copia finale I: la pagina a riposo, il resto della pagina, la home.
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI/.."
source prove/env.sh; S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts; BASE=/tmp/lavoro-3ar-base/sito-ns; NUOVO=/tmp/lavoro-3ar-sito-I; U=/tmp/lavoro-3ar-qa/cs-I
{ echo "# confronta-scelta · 82823d5 (costruito senza selettore, come l'italiano di oggi con una lingua sola) contro adesso (copia I) · $(date '+%d/%m/%Y %H:%M')"
  echo "## «non ancora», primo schermo, con «riduci movimento»"
  timeout 280 node $S/confronta-scelta.mjs $BASE $NUOVO $U/na --pagina it/non-ancora/index.html --misure 1440x900,1366x640,1280x720,1180x820,844x390,390x844,360x640 --ridotto --attesa 3000 --ammesse prove/ammesse.json 2>&1 | grep -E "^CONFRONTO|^Uguale|^Il confronto|DICHIARAZIONE|^  (SPOSTAT|MISURA|MANCA|IN PI|COLORE|CARATTERE|FONDO)"
  echo "## «non ancora» sotto il primo schermo a 1440×900 (perche 820, quando 1853, chiusura 2519, piede 2705)"
  for y in 820 1853 2519 2705; do echo "-- y=$y"; timeout 120 node $S/confronta-scelta.mjs $BASE $NUOVO $U/na-y$y --pagina it/non-ancora/index.html --misure 1440x900 --ridotto --attesa 2500 --y $y --ammesse prove/ammesse-sotto.json 2>&1 | grep -E "^CONFRONTO|^  (SPOSTAT|MISURA|MANCA|IN PI|COLORE|CARATTERE|FONDO)"; done
  echo "## 390×844 sotto il primo schermo: ogni sezione alla propria posizione (la didascalia di M3 sposta tutto di 17 px)"
  timeout 200 node prove/confronta17.mjs $BASE $NUOVO $U/17 390x844 0 2>&1 | grep -v Skipping
  echo "## la home, in cima e in fondo, con «riduci movimento»"
  for y in 0 99999; do echo "-- y=$y"; timeout 200 node $S/confronta-scelta.mjs $BASE $NUOVO $U/home-y$y --pagina it/index.html --misure 1440x900,390x844 --ridotto --attesa 3000 --y $y --ammesse prove/ammesse-home.json 2>&1 | grep -E "^CONFRONTO|^Uguale|^Il confronto|^  (SPOSTAT|MISURA|MANCA|IN PI|COLORE|CARATTERE|FONDO)"; done
} > esiti/I-confronta-scelta.txt 2>&1; cat esiti/I-confronta-scelta.txt | cut -c1-200
