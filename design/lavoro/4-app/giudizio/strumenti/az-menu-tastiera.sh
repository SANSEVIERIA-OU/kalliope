W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
s(){ import -window root -crop 920x640+0+0 "$OUT/$1.png"; }
xdotool key Tab; t 0.3; s 1-focus-voce
xdotool key space; t 0.5; s 2-spazio
xdotool key Down; t 0.3; s 3-giu
xdotool key Down; t 0.3; s 4-giu2
xdotool key Return; t 0.5; s 5-invio
xdotool key Escape; t 0.5; s 6-esc
xdotool key Tab; t 0.3; s 7-tab
xdotool keydown Shift; xdotool key Tab; xdotool keyup Shift; t 0.3; s 8-shifttab
