#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Wrapper del worker visita-1: lancia passo.mjs con il posto in $POSTO, salva l'uscita completa in $LOGDIR
# e stampa solo la parte utile (testo prima del JSON, JSON senza il dettaglio "movimento", riassunto del movimento).
# Uso: POSTO=l3:xxxx LOGDIR=/percorso/log visita1-p.sh <comando passo...>
SK=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
mkdir -p "$LOGDIR"
N=$(ls "$LOGDIR" 2>/dev/null | wc -l)
F="$LOGDIR/$(printf '%03d' $((N+1))).txt"
cd "$SK" && env -u DISPLAY -u WAYLAND_DISPLAY node passo.mjs "$POSTO" "$@" > "$F" 2>&1
RC=$?
python3 -I - "$F" <<'PY'
import sys,json
t=open(sys.argv[1],encoding='utf8',errors='replace').read()
i=t.find('\n{\n')
if i<0:
    print(t if t.lstrip()[:1] in '{["' else t[:3000]); sys.exit(0)
print(t[:i])
try:
    j,end=json.JSONDecoder().raw_decode(t[i+1:])
except Exception as e:
    print('(JSON non leggibile:',e,')'); print(t[i:i+1500]); sys.exit(0)
tail=t[i+1+end:].strip()
m=j.pop('movimento',None)
for k,v in j.items():
    s=json.dumps(v,ensure_ascii=False)
    print('%s: %s'%(k,s[:900]))
if m is not None:
    print('--movimento: animazioni=%s gruppi=%d gsap=%d lenis=%d aFotogrammi=%d'%(m.get('animazioni',0),len(m.get('gruppi',[])),len(m.get('gsap',[])),len(m.get('lenis',[])),len(m.get('aFotogrammi',[]))))
    for g in m.get('gruppi',[])[:14]: print('  gruppo:',json.dumps(g,ensure_ascii=False)[:420])
    for g in m.get('gsap',[])[:6]: print('  gsap:',json.dumps(g,ensure_ascii=False)[:420])
    for a in m.get('aFotogrammi',[])[:10]: print('  frame:',a.get('bersaglio'),(a.get('prop') or '')[:90],'cambi=',a.get('cambi'))
if tail: print(tail[:1500])
PY
exit $RC
