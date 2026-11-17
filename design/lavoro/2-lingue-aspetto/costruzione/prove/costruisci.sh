#!/bin/bash
# Un sito di prova con le 9 lingue di prova (de fi el bg ar ur hi bn zh), e con --pseudo anche en-XA e ar-XB.
# Uso: costruisci.sh <nome della corsa> [opzioni di site.py]. Copia website/, design-system/, tools/ in /tmp/lavoro-2b-radice-<nome>/,
# aggiunge i cataloghi di prova e costruisce in /tmp/lavoro-2b-sito-<nome>/. Cartelle nuove a ogni corsa.
set -euo pipefail
nome="${1:?nome della corsa}"; shift || true
R="${R:-/workspace/kalliope}"; Q=$R/design/lavoro/2-lingue-aspetto/costruzione/prove
rad="/tmp/lavoro-2b-radice-$nome"; out="/tmp/lavoro-2b-sito-$nome"
[ -e "$rad" ] && { echo "$rad esiste già: usa un altro nome"; exit 1; }
mkdir -p "$rad"
cp -r "$R/website" "$R/design-system" "$R/tools" "$rad/"
python3 -I "$Q/crea-cataloghi.py" "$rad/website" "$rad/website/lingue" >/dev/null
python3 -I "$rad/tools/translations.py" check --website "$rad/website" --complete
python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-2-rilascio.json --website "$rad/website" --system "$rad/design-system" "$@" | tail -2 | cut -c1-400
