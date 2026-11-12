#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Avvia una variante (opzioni di passo.mjs avvia) in una sottocartella e fa i primi gesti comuni.
# Uso: POSTO=... visita1-variante.sh <ID> <nome-variante> <desktop|mobile> <url> <attesa-ms> [opzioni avvia...]
ID=$1; NOME=$2; MODO=$3; URL=$4; ATT=$5; shift 5
SK=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
D=/workspace/kalliope/design/ricerca/prove/$ID/varianti/$NOME
mkdir -p "$D"
cd "$SK" && env -u DISPLAY -u WAYLAND_DISPLAY node passo.mjs "$POSTO" avvia "$MODO" "$D" "$@" 2>&1 | head -3
export LOGDIR="$D/log"
V=/workspace/kalliope/design/ricerca/strumenti/visita1-p.sh
$V vai "$URL" "$ATT" | grep -E '^(FOTO|⚠|url|finestra|scroll)'
