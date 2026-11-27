#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# One Codex session for a group of languages: rivedi.sh BRIEF NAME "de fr …" IMAGE
set -u
B="$1"; N="$2"; LANGS="$3"; IMG="$4"
D=/workspace/kalliope/materiali-locali/codex-menu
W=/workspace/kalliope/materiali-locali/menu-codex
start=$(date +%s)
echo "$(date +%H:%M:%S) start $N ($LANGS)" >> "$D/log/coda.log"
{ cat "$B"; printf '\n\nLANGS = %s\n' "$LANGS"; } | \
  /home/dev/.npm-global/bin/codex exec -C "$W" -s workspace-write -c approval_policy='"never"' \
    -m gpt-6.2-astra -c model_reasoning_effort='"high"' --color never \
    -i "$IMG" -o "$D/log/$N.ultimo.md" - > "$D/log/$N.log" 2>&1
rc=$?
echo "$(date +%H:%M:%S) end $N rc=$rc $(( ($(date +%s)-start)/60 )) min" >> "$D/log/coda.log"
