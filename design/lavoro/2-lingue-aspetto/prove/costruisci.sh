#!/bin/bash
# Costruisce un sito di prova con le lingue di prova. Uso: costruisci.sh <nome della corsa> [--pseudo]
# Copia website/, design-system/, tools/ in /tmp/lavoro-2-radice-<nome>/, aggiunge i cataloghi di prova (rifatti sul modello delle
# pagine di adesso) alla copia di website/lingue/ e costruisce in /tmp/lavoro-2-sito-<nome>/. Cartelle nuove a ogni corsa.
set -euo pipefail
nome="${1:?nome della corsa}"; shift || true
R="${R:-/workspace/kalliope}"; Q=/workspace/kalliope/design/lavoro/2-lingue-aspetto
rad="/tmp/lavoro-2-radice-$nome"; out="/tmp/lavoro-2-sito-$nome"
[ -e "$rad" ] && { echo "$rad esiste già: usa un altro nome"; exit 1; }
mkdir -p "$rad"
cp -r "$R/website" "$R/design-system" "$R/tools" "$rad/"
python3 -I "$Q/prova-lingue/crea_cataloghi.py" "$R/website" >/dev/null
cp "$Q"/prova-lingue/*.po "$rad/website/lingue/"
python3 -I "$rad/tools/translations.py" check --website "$rad/website" --complete
python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-2-rilascio.json "$@"
