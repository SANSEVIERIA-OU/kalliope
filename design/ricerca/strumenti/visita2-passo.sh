#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Strumento del worker visita-2: lancia un gesto di passo.mjs senza finestra, salva l'uscita completa in un registro
# (design/incarichi/visita-2/log) e stampa una sintesi (foto, titoli visibili, movimento rilevato in forma compatta).
# Uso: POSTO=<posto:segno> visita2-passo.sh <ID-prove> <comando passo...>
# Non apre finestre: ogni comando è lanciato senza DISPLAY né WAYLAND_DISPLAY.
SK=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts
export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs
ID="$1"; shift
LOG=/workspace/kalliope/design/incarichi/visita-2/log
mkdir -p "$LOG"
N=$(ls "$LOG" | wc -l); N=$(printf "%04d" $((N+1)))
OUT="$LOG/$N-$ID-$1.txt"
cd "$SK"
env -u DISPLAY -u WAYLAND_DISPLAY node passo.mjs "$POSTO" "$@" > "$OUT" 2>&1
echo "[log $N]"
grep -m1 '^FOTO ' "$OUT" | sed 's/  (le coordinate.*//'
grep -m3 '⚠' "$OUT"
sed -n '/^{/,$p' "$OUT" | python3 -c '
import sys,json
t=sys.stdin.read()
try:
    d=json.loads(t)
except Exception as e:
    print(t[:1500]); sys.exit()
print("scroll",d.get("scroll"),"| finestra",d.get("finestra"),"| canvas",d.get("canvas"),"video",d.get("video"))
for x in d.get("titoli",[])[:8]: print("  T",x)
m=d.get("movimento")
if m:
    print("movimento: %s animazioni" % m.get("animazioni"))
    for g in m.get("gruppi",[]):
        kf=g.get("keyframes") or []
        a=kf[0] if kf else {}; b=kf[-1] if kf else {}
        p=g.get("prop")
        def val(k):
            return {kk:vv for kk,vv in k.items() if kk not in ("offset","easing","composite","computedOffset")}
        print("  -",g.get("tipo"),p,"%sms"%g.get("durata"),"ritardo",g.get("ritardo"),g.get("curva"),"x%s"%g.get("quante"),"|",json.dumps(val(a),ensure_ascii=False)[:90],"->",json.dumps(val(b),ensure_ascii=False)[:90],"|",",".join(g.get("esempi",[])[:2]))
    for k in ("gsap","lenis","aFotogrammi","scrollLinked","mutazioni"):
        if m.get(k): print(" ",k,json.dumps(m[k],ensure_ascii=False)[:600])
else:
    print("movimento:",m)
'
