#!/bin/bash
# Costruisce un sito di prova in dieci lingue (it più le nove di prova, 2-lingue-aspetto/prova-lingue/) in una cartella nuova.
# Come costruisci.sh di 2-lingue-aspetto, ma NON rigenera i cataloghi di prova (quello riscrive file del repository): usa quelli che ci sono,
# e `translations.py check --complete` dice se sono ancora al passo con le pagine.
# Uso: costruisci.sh <nome> [cartella dei caratteri nuovi]   → /tmp/p3-sito-<nome>
# La cartella dei caratteri nuovi (stessa struttura di design-system/caratteri/) sostituisce, nella copia, quella del sistema.
set -euo pipefail
nome="${1:?nome della corsa}"; nuovi="${2:-}"
R="${R:-/workspace/kalliope}"; Q=$R/design/lavoro
rad="/tmp/p3-radice-$nome"; out="/tmp/p3-sito-$nome"
[ -e "$rad" ] && { echo "$rad esiste già: usa un altro nome"; exit 1; }
mkdir -p "$rad"
cp -r "$R/website" "$R/design-system" "$R/tools" "$rad/"
cp "$Q"/2-lingue-aspetto/prova-lingue/*.po "$rad/website/lingue/"
if [ -n "$nuovi" ]; then cp -r "$nuovi"/. "$rad/design-system/caratteri/"; fi
python3 -I "$rad/tools/translations.py" check --website "$rad/website" --complete
python3 -I "$rad/tools/site.py" --out "$out" --release-json "$Q/P-3-strumenti/esiti/rilasci.json" --website "$rad/website" --system "$rad/design-system"
