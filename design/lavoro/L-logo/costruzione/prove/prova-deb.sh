#!/usr/bin/env bash
# Il .deb senza apt (su una macchina che non è Debian): lo si estrae in una cartella nuova, si controllano le quattro icone (presenti, non vuote, PNG veri della misura giusta, SVG)
# e si fa parlare il programma installato lì con ciò che il pacchetto porta (nessuna variabile KALLIOPE_*), come fa test-packages.sh per gli altri.
# Uso: prova-deb.sh <file.deb> <cartella nuova> <versione del programma>
set -euo pipefail
deb=$1 out=$2 app_version=$3
id=io.github.sansevieria_ou.kalliope
mkdir "$out" && dpkg-deb -x "$deb" "$out"
share=$out/usr/share
for f in scalable/apps/$id.svg symbolic/apps/$id-symbolic.svg 48x48/apps/$id.png 256x256/apps/$id.png; do
    test -s "$share/icons/hicolor/$f" || { echo "manca $f" >&2; exit 1; }
done
for size in 48 256; do
    f=$share/icons/hicolor/${size}x$size/apps/$id.png
    [ "$(head -c 8 "$f" | od -An -tx1 | tr -d ' \n')" = 89504e470d0a1a0a ] || { echo "$f non è un PNG" >&2; exit 1; }
    [ "$(od -An -tu1 -j19 -N1 "$f" | tr -d ' ')" = $((size % 256)) ] && [ "$(od -An -tu1 -j18 -N1 "$f" | tr -d ' ')" = $((size / 256)) ] || { echo "$f non è ${size}x$size" >&2; exit 1; }
done
grep -q '<svg' "$share/icons/hicolor/scalable/apps/$id.svg" && grep -q '<svg' "$share/icons/hicolor/symbolic/apps/$id-symbolic.svg"
# le icone del pacchetto sono quelle del repository
here=$(cd "$(dirname "$0")/../../../../.." && pwd)
for f in $id.svg $id-symbolic.svg; do cmp "$here/packaging/linux/$f" "$share/icons/hicolor/$( [ "$f" = "$id.svg" ] && echo scalable || echo symbolic)/apps/$f"; done
cmp "$here/packaging/linux/$id-48.png" "$share/icons/hicolor/48x48/apps/$id.png"
cmp "$here/packaging/linux/$id-256.png" "$share/icons/hicolor/256x256/apps/$id.png"
echo "icone del .deb: presenti, della misura giusta e uguali a quelle del repository"
bare() { env -u KALLIOPE_ORT_LIB -u KALLIOPE_MODEL_DIR -u KALLIOPE_POCKET_DIR -u KALLIOPE_VOICES_DIR "$@"; }
out_v=$(bare "$out/usr/bin/kalliope" --version); echo "$out_v"; grep -qF "$app_version" <<<"$out_v"
bare "$out/usr/bin/kalliope-cli" say -o "$out/giulia.wav" "Ciao a tutti, mi sentite?"
bytes=$(stat -c %s "$out/giulia.wav"); echo "$bytes byte di voce"; [ "$bytes" -gt 40000 ]
