#!/bin/bash
# Un sito di prova con tutte le 30 lingue: le 9 di prova vere più le altre 20 fatte dal catalogo italiano con la pseudo-lingua.
# Uso: costruisci30.sh <nome della corsa> [opzioni di site.py, per esempio --pseudo]
set -euo pipefail
nome="${1:?nome}"; shift || true; R=/workspace/kalliope; Q=$R/design/lavoro/2-lingue-aspetto/costruzione/prove
rad="/tmp/lavoro-2b-prova30-$nome"; out="/tmp/lavoro-2b-sito30-$nome"
python3 -I $R/design/lavoro/1-lingue-sito/prove/crea-lingue-prova.py "$rad" cs da en es et fr ga hr hu id lt lv mt nl pl pt ro sk sl sv >/dev/null
python3 -I "$Q/crea-cataloghi.py" "$rad/website" "$rad/website/lingue" >/dev/null
cp -r "$R/tools" "$rad/"
python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-2-rilascio.json --website "$rad/website" --system "$rad/design-system" "$@" | tail -1 | cut -c1-200
