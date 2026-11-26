W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
xdotool mousemove 690 28 click 1; t 0.7; import -window root -crop 920x640+0+0 "$OUT/menu.png"
