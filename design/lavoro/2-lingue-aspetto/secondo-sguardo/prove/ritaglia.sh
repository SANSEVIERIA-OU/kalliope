#!/bin/bash
# Uso: ritaglia.sh <foto> <uscita> x y w h [scala%]
set -e
magick "$1" -crop "${5}x${6}+${3}+${4}" +repage -resize "${7:-200}%" "$2"
