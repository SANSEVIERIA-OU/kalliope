W=$(xdotool search --name . | tail -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
xdotool getwindowgeometry $W > "$OUT/geom.txt"
import -window root "$OUT/c-00.png"
xdotool mousemove 600 500
for i in 01 02 03 04 05 06 07 08; do for j in 1 2 3 4 5 6 7 8; do xdotool click 5; done; t 0.5; import -window root "$OUT/c-$i.png"; done
