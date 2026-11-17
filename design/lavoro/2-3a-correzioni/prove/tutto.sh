#!/bin/bash
# Tutta la batteria di 2-f su un motore (uno dopo l'altro: usano la stessa porta). Uso: bash tutto.sh <motore> [parti…]   (senza parti: tutte quelle che il motore può fare)
AQUI="$(cd "$(dirname "$0")" && pwd)"; cd "$AQUI"; M=$1; shift
PARTI=${@:-"salto cornice scelta copia altezza vetro tu suona"}
for P in $PARTI; do
  case "$P" in
    salto|cornice|scelta|copia) bash serie.sh $M $P prima; bash serie.sh $M $P dopo ;;
    vetro) bash serie.sh $M vetro prima; bash serie.sh $M vetro dopo ;;
    altezza) bash serie.sh $M altezza dopo ;;
    tu|suona) bash serie.sh $M $P dopo ;;
    errore) bash serie.sh $M errore prima; bash serie.sh $M errore dopo ;;
  esac
done
echo "== fine batteria $M: $PARTI"
