#!/bin/bash
# Costruisce un sito di prova da un albero. Cartelle nuove a ogni corsa (nessuna cancellazione).
# Uso: costruisci.sh <nome> <it|10> <sorgente: "mio", "vivo" o un commit> [opzioni di site.py, es. --pseudo]
#   mio  = b456308 + i soli file di questo incarico (mentre il ruolo di direzione di «stato» lavora sugli stessi alberi: i suoi cambi in corso non entrano nelle mie prove).
#          barra.css si taglia dopo la mia sezione; i due HTML hanno la sola riga della rete di sicurezza; gli altri file sono quelli vivi (solo miei).
#   it  = solo italiano (come il sito vero oggi)      10 = italiano + le nove lingue di prova (prova-lingue/*.po, rigenerati il 17/11 con 254 voci) + opzioni
# L'albero: "vivo" = /workspace/kalliope (website, design-system, tools) copiato; un commit = git archive. Il sito va in /tmp/lavoro-2f-sito-<nome>.
set -euo pipefail
nome="${1:?nome}"; tipo="${2:?it|10}"; src="${3:?vivo|commit}"; shift 3 || true
R=/workspace/kalliope; rad="/tmp/lavoro-2f-radice-$nome"; out="/tmp/lavoro-2f-sito-$nome"
[ -e "$rad" ] && { echo "$rad esiste già: usa un altro nome"; exit 1; }
[ -e "$out" ] && { echo "$out esiste già: usa un altro nome"; exit 1; }
mkdir -p "$rad"
if [ "$src" = vivo ]; then cp -a "$R/website" "$R/design-system" "$R/tools" "$rad/"
elif [ "$src" = mio ]; then
  (cd "$R" && git archive b456308 website design-system tools | tar -x -C "$rad")
  for f in design-system/token.css design-system/componenti/lingue.css design-system/componenti/riunione.css design-system/componenti/versioni.css design-system/catalogo/catalogo-pagine.js website/componenti.js website/lingue.html website/non-ancora/non-ancora.js; do cp "$R/$f" "$rad/$f"; done
  python3 -I - "$R" "$rad" <<'PY'
import sys, pathlib
R, rad = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
b = (R / "design-system/componenti/barra.css").read_text(encoding="utf-8"); fine = "  .js .menu.aperto, .js .barra.raccolta .menu.aperto { background: var(--pannello-menu-pieno); }\n}\n"   # la fine della mia sezione (dopo c'è ciò che aggiunge il ruolo di direzione di «stato»)
assert fine in b; (rad / "design-system/componenti/barra.css").write_text(b[:b.index(fine) + len(fine)], encoding="utf-8")
for f in ("website/non-ancora/index.html", "website/stato/index.html"):
    t = (rad / f).read_text(encoding="utf-8"); a = "if(!window.__pagina)document"; assert t.count(a) == 1
    (rad / f).write_text(t.replace(a, "if(!window.__pagina||!window.Cornice)document"), encoding="utf-8")
PY
else (cd "$R" && git archive "$src" website design-system tools | tar -x -C "$rad"); fi
find "$rad" -name __pycache__ -type d -prune -exec true \; >/dev/null
if [ "$tipo" = 10 ]; then cp "$R"/design/lavoro/2-lingue-aspetto/prova-lingue/*.po "$rad/website/lingue/"; python3 -I "$rad/tools/translations.py" check --website "$rad/website" --complete | tail -2; fi
python3 -I "$rad/tools/site.py" --out "$out" --release-json /tmp/lavoro-2f-lavoro/rilascio.json --website "$rad/website" --system "$rad/design-system" "$@" | tail -2 | cut -c1-300
echo "sito: $out (albero: $rad)"
