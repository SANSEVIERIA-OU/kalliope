#!/bin/bash
# Una riga con il carico della macchina in questo momento (PSI della CPU, carico medio, memoria disponibile): va nell'intestazione di ogni esito, perché i difetti legati ai tempi
# (caratteri e «load» che arrivano dopo) cambiano con il carico (avviso di chi coordina, 20/11/2026).
psi=$(awk '/^some/{print $2" "$3}' /proc/pressure/cpu | tr '\n' ' ')
echo "carico: PSI CPU some ${psi}· $(awk '{print "load "$1" "$2" "$3}' /proc/loadavg) su $(nproc) CPU · memoria disponibile $(awk '/MemAvailable/{printf "%d MB", $2/1024}' /proc/meminfo)"
