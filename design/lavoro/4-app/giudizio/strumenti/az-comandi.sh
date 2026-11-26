W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
s(){ import -window root -crop 920x640+0+0 "$OUT/$1.png"; }
xdotool mousemove 325 28 click 1; t 0.6; s 1-menu-voce
xdotool key Down; t 0.3; s 1b-menu-giu
xdotool key Escape; t 0.4; s 2-menu-esc
xdotool mousemove 490 28 click 1; t 0.5; s 3-a-piu-1
xdotool click 1; t 0.5; s 4-a-piu-2
xdotool getwindowgeometry $W > "$OUT/geom.txt"
xdotool key ctrl+minus; t 0.3
xdotool mousemove 843 28 click 1; t 0.8; s 5-informazioni
xdotool key Escape; t 0.5; s 6-info-esc
