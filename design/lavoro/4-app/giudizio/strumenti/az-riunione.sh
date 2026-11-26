W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
ffmpeg -loglevel error -y -f x11grab -framerate 30 -video_size 920x640 -i :155+0,0 -t 9 -c:v libx264 -preset ultrafast -pix_fmt yuv420p "$OUT/riunione.mp4" &
F=$!
t 1.0
xdotool mousemove 569 28; t 0.5; import -window root -crop 920x640+0+0 "$OUT/0-hover-riunione.png"
xdotool click 1
t 1.5; import -window root -crop 920x640+0+0 "$OUT/1-compatta.png"
xdotool getwindowgeometry $W > "$OUT/geom-compatta.txt"
t 2.5
wait $F
