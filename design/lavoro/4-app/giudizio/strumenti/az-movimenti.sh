W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
t(){ python3 -c "import time; time.sleep($1)"; }
ffmpeg -loglevel error -y -f x11grab -framerate 30 -video_size 920x640 -i :155+0,0 -t 11 -c:v libx264 -preset ultrafast -pix_fmt yuv420p "$OUT/movimenti.mp4" &
F=$!
t 1.0
xdotool mousemove 698 28 click 1      # entra in crea voce  ~1.0s
t 2.0
xdotool mousemove 110 40 click 1      # torna a scrivere   ~3.0s
t 2.0
xdotool mousemove 325 28 click 1      # apre menu voce     ~5.0s
t 1.5
xdotool mousemove 325 28 click 1      # chiude menu voce   ~6.5s
t 1.5
xdotool mousemove 490 28 click 1      # A+                 ~8.0s
t 1.5
wait $F
