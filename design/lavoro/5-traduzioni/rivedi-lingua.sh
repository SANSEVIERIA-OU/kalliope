#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# One Codex session reviewing one language, with the contact sheets of the window in that language attached.
set -u
L="$1"
D=/workspace/kalliope/materiali-locali/codex-traduzioni
W=/workspace/kalliope/materiali-locali/traduzioni-codex
F=/workspace/kalliope/materiali-locali/verifica-04/fogli-revisione
IMG=(); for f in $F/${L}_*.png; do [ -f "$f" ] && IMG+=(-i "$f"); done
start=$(date +%s)
echo "$(date +%H:%M:%S) start review $L (${#IMG[@]} args of photos)" >> "$D/log/revisione.log"
{ cat "$D/revisione.md"; cat "$D/brief.md"; printf '\n\nLANG = %s\n' "$L"; } | \
  /home/dev/.npm-global/bin/codex exec -C "$W" -s workspace-write -c approval_policy='"never"' \
    -m gpt-6.2-astra -c model_reasoning_effort='"high"' --color never "${IMG[@]}" \
    -o "$D/log/$L.revisione.md" - > "$D/log/$L.revisione.log" 2>&1
rc=$?
echo "$(date +%H:%M:%S) end review $L rc=$rc $(( ($(date +%s)-start)/60 )) min" >> "$D/log/revisione.log"
