#!/bin/bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# Photos of Kalliope's menu entry in a real launcher (rofi, drun mode, which reads the localized desktop entry like a menu) in
# every language of the desktop file: the name with the kind and the description, then a search with one of the language's keywords.
# foto.sh DESKTOP OUT   (private Xvfb :163, never the user's display)
set -u
DESKTOP=$(realpath "$1"); OUT=$(realpath -m "$2")
R=/workspace/kalliope
mkdir -p "$OUT"
T=$(mktemp -d)
mkdir -p "$T/share/applications" "$T/share/icons/hicolor/scalable/apps" "$T/share/icons/hicolor/256x256/apps" "$T/bin" "$T/home"
cp "$DESKTOP" "$T/share/applications/"
cp /usr/share/icons/hicolor/index.theme "$T/share/icons/hicolor/"
ln -s /usr/share/mime "$T/share/mime"   # the image types, for the icon
cp "$R/packaging/linux/io.github.sansevieria_ou.kalliope.svg" "$T/share/icons/hicolor/scalable/apps/"
cp "$R/packaging/linux/io.github.sansevieria_ou.kalliope-256.png" "$T/share/icons/hicolor/256x256/apps/io.github.sansevieria_ou.kalliope.png"
printf '#!/bin/sh\n' > "$T/bin/kalliope"; chmod +x "$T/bin/kalliope"
unset WAYLAND_DISPLAY
Xvfb :163 -screen 0 1100x420x24 -nolisten tcp >/dev/null 2>&1 &
XPID=$!
sleep 1
export DISPLAY=:163
codici=$(grep -oP '^GenericName\[\K[^\]]+' "$DESKTOP")
for c in en $codici; do
  for vista in nome cerca; do
    if [ "$vista" = nome ]; then
      q=kalliope
    else
      # a keyword of the language that is neither in the kind nor in the description: only the Keywords line can find it
      q=$(python3 -I - "$DESKTOP" "$c" <<'PY'
import re, sys
t = open(sys.argv[1], encoding="utf-8").read()
c = sys.argv[2]
def campo(k):
    m = re.search(rf"^{k}=(.*)$" if c == "en" else rf"^{k}\[{re.escape(c)}\]=(.*)$", t, re.M)
    return m.group(1) if m else ""
altro = (campo("GenericName") + " " + campo("Comment")).casefold()
parole = [p for p in campo("Keywords").split(";") if p]
print(next((p for p in parole if p.casefold() not in altro), parole[0] if parole else "kalliope"))
PY
)
    fi
    # rofi stops when the locale is not installed: the C.UTF-8 locale and LANGUAGE, which GLib reads first for the desktop entry
    lang="$c"; [ "$c" = en ] && lang=ja   # a language without a line: the default, English
    env -i HOME="$T/home" PATH="$T/bin:/usr/bin:/bin" DISPLAY=:163 LC_ALL=C.UTF-8 LANGUAGE="$lang" \
      XDG_DATA_DIRS="$T/share" XDG_DATA_HOME="$T/home/.local/share" XDG_CONFIG_HOME="$T/home/.config" XDG_CACHE_HOME="$T/home/.cache" \
      rofi -show drun -filter "$q" -show-icons -icon-theme hicolor -no-lazy-grab -drun-match-fields name,generic,keywords,categories \
        -drun-display-format '{name} [<span weight="light">· {generic}</span>] [<span size="small"><i>{comment}</i></span>]' \
        -theme-str 'window {width: 1000px; location: north; y-offset: 20px;} * {font: "Noto Sans 15";} listview {lines: 3;} element-icon {size: 40px;}' \
        >/dev/null 2>"$OUT/$c-$vista.err" &
    P=$!
    sleep 1.2
    import -window root "$OUT/$c-$vista.png"
    kill "$P" 2>/dev/null; wait "$P" 2>/dev/null
  done
done
kill "$XPID"; wait "$XPID" 2>/dev/null
rm -rf "$T"
ls "$OUT"/*.png | wc -l
