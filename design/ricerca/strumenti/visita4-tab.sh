#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Percorso da tastiera (V13): quante pressioni di Tab dal caricamento al comando principale, con foto del focus.
# Uso: POSTO=l4:xxxx visita4-tab.sh <ID> <url> <espressione-regolare-del-testo-del-comando>
ID="$1"; URL="$2"; RE="$3"
V=/workspace/kalliope/design/ricerca/strumenti/visita4-p.sh
P=/workspace/kalliope/design/ricerca/prove/$ID
$V $ID avvia desktop $P/tastiera | tail -1
LUNGO=100 $V $ID vai "$URL" 3500 | grep FOTO
N=$($V $ID valuta "(()=>{const vis=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none'};const l=[...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex=\"-1\"])')].filter(e=>vis(e)&&!e.disabled);const i=l.findIndex(e=>/$RE/i.test((e.innerText||e.getAttribute('aria-label')||e.value||'').trim()));return i+1})()" | tail -1)
echo "Tab previsti (ordine del DOM) fino al comando: $N"
[ "$N" -gt 0 ] 2>/dev/null || exit 0
for i in $(seq 1 $((N-1))); do $V $ID tasto Tab 60 >/dev/null; done
LUNGO=100 $V $ID tasto Tab 300 | grep FOTO
$V $ID valuta "(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();const cs=getComputedStyle(a);return JSON.stringify({el:a.tagName+' '+(a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,40),box:[r.x,r.y,r.width,r.height].map(Math.round),outline:cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor,offset:cs.outlineOffset,boxShadow:cs.boxShadow.slice(0,90)})})()" | tail -1
