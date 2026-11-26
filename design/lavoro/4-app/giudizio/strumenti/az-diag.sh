xdotool search --name . 2>/dev/null | while read w; do echo "$w $(xdotool getwindowname $w 2>/dev/null) $(xdotool getwindowgeometry $w 2>/dev/null | tr '\n' ' ')"; done
echo focus: $(xdotool getwindowfocus 2>&1)
W=$(xdotool search --name Kalliope | head -1); echo W=$W
xdotool windowfocus --sync $W 2>&1; echo focus2: $(xdotool getwindowfocus 2>&1)
xdotool mousemove 460 470 click 1
python3 -c 'import time; time.sleep(0.3)'
xdotool type --delay 40 "prova uno"
python3 -c 'import time; time.sleep(0.3)'
import -window root -crop 920x640+0+0 "$OUT/a.png"
xdotool key --window $W a b c
python3 -c 'import time; time.sleep(0.3)'
import -window root -crop 920x640+0+0 "$OUT/b.png"
