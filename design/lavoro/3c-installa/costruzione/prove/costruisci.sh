#!/bin/bash
# Costruisce un sito di prova da un albero. Cartelle nuove a ogni corsa (nessuna cancellazione).
# Uso: costruisci.sh <nome> <it|10> <vivo|commit> [opzioni di site.py, es. --pseudo]
#   it  = solo italiano (come il sito vero oggi)
#   10  = italiano + le nove lingue di prova (design/lavoro/2-lingue-aspetto/prova-lingue/*.po: vanno rigenerate se i testi cambiano) + opzioni
#   vivo = /workspace/kalliope (website, design-system, tools, docs) copiato in una cartella nuova; altrimenti un commit (git archive)
# L'albero va in /tmp/lavoro-3cb-radice-<nome>, il sito in /tmp/lavoro-3cb-sito-<nome>. I dati della versione: /tmp/lavoro-3cb-dati/releases.json.
set -euo pipefail
nome="${1:?nome}"; tipo="${2:?it|10}"; src="${3:?vivo|commit}"; shift 3 || true
R=/workspace/kalliope; rad="/tmp/lavoro-3cb-radice-$nome"; out="/tmp/lavoro-3cb-sito-$nome"
[ -e "$rad" ] && { echo "$rad esiste già: usa un altro nome"; exit 1; }
[ -e "$out" ] && { echo "$out esiste già: usa un altro nome"; exit 1; }
mkdir -p "$rad"
if [ "$src" = vivo ]; then for d in website design-system tools docs; do mkdir -p "$rad/$d"; cp -a "$R/$d/." "$rad/$d/"; done
else (cd "$R" && git archive "$src" website design-system tools docs | tar -x -C "$rad"); fi
find "$rad" -name __pycache__ -type d -prune -exec true \; >/dev/null
if [ "$tipo" = 10 ]; then cp "$R"/design/lavoro/2-lingue-aspetto/prova-lingue/*.po "$rad/website/lingue/"; python3 -I "$rad/tools/translations.py" check --website "$rad/website" --complete | tail -2; fi
GIT_DIR="$R/.git" python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-3cb-dati/releases.json --website "$rad/website" --system "$rad/design-system" "$@" | tail -3 | cut -c1-400
echo "sito: $out (albero: $rad)"
