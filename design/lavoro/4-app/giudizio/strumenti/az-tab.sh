W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
import -window root -crop 920x640+0+0 "$OUT/tab-00.png"
for i in 01 02 03 04 05 06 07 08 09 10 11 12; do xdotool key Tab; t 0.35; import -window root -crop 920x640+0+0 "$OUT/tab-$i.png"; done
xdotool key shift+Tab; t 0.35; import -window root -crop 920x640+0+0 "$OUT/tab-back.png"
