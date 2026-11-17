#!/bin/bash
# Un sito di prova con tutte le 30 lingue (per la pagina della scelta e l'elenco): le 9 lingue di prova vere (prova-lingue/) più le altre
# 20 fatte dal catalogo italiano con la pseudo-lingua (lo script dell'incarico 1). Uso: costruisci30.sh <nome della corsa>
set -euo pipefail
nome="${1:?nome}"; R=/workspace/kalliope; Q=$R/design/lavoro/2-lingue-aspetto
rad="/tmp/lavoro-2-prova30-$nome"; out="/tmp/lavoro-2-sito30-$nome"
python3 -I $R/design/lavoro/1-lingue-sito/prove/crea-lingue-prova.py "$rad" cs da en es et fr ga hr hu id lt lv mt nl pl pt ro sk sl sv >/dev/null
python3 -I "$Q/prova-lingue/crea_cataloghi.py" "$R/website" >/dev/null
cp "$Q"/prova-lingue/*.po "$rad/website/lingue/"
cp -r "$R/tools" "$rad/"
python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-2-rilascio.json --website "$rad/website" --system "$rad/design-system" | tail -1 | cut -c1-90
