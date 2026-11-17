#!/bin/bash
# La copia di lavoro: un'istantanea dell'albero vivo (website, design-system, tools, docs) in una cartella nuova, su cui girano le prove (nessuna
# prova gira su file che cambiano mentre girano). Fino al commit 8c7fae1 (17/11 01:39) l'incarico 2 cambiava gli stessi file e la copia era la base
# 0cf5c64 più i soli file di questo incarico; dopo, l'istantanea è l'albero intero.
# Uso: bash sincronizza.sh [cartella]   (di norma /tmp/lavoro-3ar-lavoro/radice-F)  → poi: python3 -I <cartella>/tools/site.py --out … la costruisce
set -euo pipefail
VIVO=/workspace/kalliope
R=${1:-/tmp/lavoro-3ar-lavoro/radice-F}
mkdir -p "$R"
for d in website design-system tools docs; do mkdir -p "$R/$d"; cp -a "$VIVO/$d/." "$R/$d/"; done
find "$R" -name __pycache__ -type d -prune -o -name '*.pyc' -print >/dev/null
(cd "$R" && python3 -I tools/translations.py extract | tail -1 && python3 -I tools/translations.py check | tail -1)
echo "istantanea pronta: $R"
