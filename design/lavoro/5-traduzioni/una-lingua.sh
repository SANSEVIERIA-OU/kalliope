#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# One Codex session translating one language in the traduzioni-codex worktree.
set -u
L="$1"
D=/workspace/kalliope/materiali-locali/codex-traduzioni
W=/workspace/kalliope/materiali-locali/traduzioni-codex
start=$(date +%s)
echo "$(date +%H:%M:%S) start $L" >> "$D/log/coda.log"
{ cat "$D/brief.md"; printf '\n\nLANG = %s\n' "$L"; } | \
  /home/dev/.npm-global/bin/codex exec -C "$W" -s workspace-write -c approval_policy='"never"' \
    -m gpt-6.2-astra -c model_reasoning_effort='"high"' --color never \
    -o "$D/log/$L.ultimo.md" - > "$D/log/$L.log" 2>&1
rc=$?
echo "$(date +%H:%M:%S) end $L rc=$rc $(( ($(date +%s)-start)/60 )) min" >> "$D/log/coda.log"
