W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
s(){ import -window root -crop 360x320+0+0 "$OUT/$1.png"; }
s 0
xdotool mousemove 180 200; for i in 1 2 3 4 5; do xdotool click 5; t 0.15; done; t 0.4; s 1-rotella
for i in 1 2 3 4 5 6 7 8; do xdotool key Tab; t 0.25; s tab-$i; done
