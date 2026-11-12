#!/bin/sh
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Rigenera confronto, copertura e direzione dalle osservazioni correnti. Uso: sh design/strumenti/rigenera-confronto.sh
set -e
cd /workspace/kalliope/design
S=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator
env -u DISPLAY -u WAYLAND_DISPLAY python3 -I strumenti/unisci-osservazioni.py confronto-lavoro/ricerca-unita.json
env -u DISPLAY -u WAYLAND_DISPLAY node $S/scripts/confronta-riferimenti.mjs --controlla confronto-lavoro/ricerca-unita.json
env -u DISPLAY -u WAYLAND_DISPLAY node $S/scripts/confronta-riferimenti.mjs confronto-lavoro/ricerca-unita.json confronto.json
env -u DISPLAY -u WAYLAND_DISPLAY python3 -I strumenti/vista-confronto.py confronto.json confronto.md
env -u DISPLAY -u WAYLAND_DISPLAY python3 -I strumenti/copertura.py confronto.json --md copertura.md
env -u DISPLAY -u WAYLAND_DISPLAY python3 -I strumenti/costruisci-direzione.py --md
env -u DISPLAY -u WAYLAND_DISPLAY node $S/scripts/controlla-direzione.mjs direzione.json --confronto confronto.json
