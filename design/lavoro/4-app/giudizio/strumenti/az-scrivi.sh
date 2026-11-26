# scrive una frase, Invio, aspetta che la voce finisca; registra tutto
W=$(xdotool search --name Kalliope | head -1); xdotool windowfocus --sync $W
ffmpeg -loglevel error -y -f x11grab -framerate 30 -video_size 920x640 -i :155+0,0 -t 15 -c:v libx264 -preset ultrafast -pix_fmt yuv420p "$OUT/scrivi.mp4" &
F=$!
t(){ python3 -c "import time; time.sleep($1)"; }
t 1.0
xdotool type --delay 45 "Possiamo spostare la riunione a giovedì mattina?"
import -window root -crop 920x640+0+0 "$OUT/1-scritto.png"
t 0.8
xdotool key Return
t 0.15; import -window root -crop 920x640+0+0 "$OUT/2-invio-150ms.png"
t 0.5;  import -window root -crop 920x640+0+0 "$OUT/3-invio-700ms.png"
t 0.8;  import -window root -crop 920x640+0+0 "$OUT/4-invio-1500ms.png"
t 1.0;  import -window root -crop 920x640+0+0 "$OUT/5-invio-2500ms.png"
t 2.5;  import -window root -crop 920x640+0+0 "$OUT/6-invio-5s.png"
xdotool key Up
t 0.6;  import -window root -crop 920x640+0+0 "$OUT/7-su.png"
wait $F
