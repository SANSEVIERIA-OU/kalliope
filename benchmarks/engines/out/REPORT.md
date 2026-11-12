# Benchmark TTS italiano — AMD Ryzen 5 PRO 6650U (6C/12T), ONNX Runtime CPU

*Wh per meeting-hour = J per audio-s × 300 s of synthesized speech / 3600.*

| config | thr | RTF | CPU-s per audio-s | % total CPU while speaking | first audio short / medium (ms) | RAM steady (MB) | RAM peak (MB) | model RAM excl. Python (MB) | package W while synth | J per audio-s | Wh per meeting-hour* |
|---|---|---|---|---|---|---|---|---|---|---|---|
| klein-giulia-t1 | 1 | 0.096 | 0.095 | 0.8% | 159 / 180 | 197 | 321 | 147 | 14.3 (idle 14.0) | 0.03 | 0.002 |
| klein-giulia-t2 | 2 | 0.057 | 0.103 | 0.9% | 103 / 113 | 195 | 320 | 145 | 14.1 (idle 14.2) | -0.00 | -0.000 |
| klein-giulia-t4 | 4 | 0.045 | 0.136 | 1.1% | 82 / 87 | 197 | 321 | 147 | 14.0 (idle 14.7) | -0.03 | -0.002 |
| klein-marco-t2 | 2 | 0.064 | 0.116 | 1.0% | 112 / 127 | 215 | 412 | 165 | 14.0 (idle 14.0) | -0.00 | -0.000 |
| kokoro-nicola-fp32-t2 | 2 | 0.679 | 1.205 | 10.0% | 949 / 1109 | 520 | 1137 | 470 | 14.1 (idle 13.7) | 0.25 | 0.021 |
| kokoro-sara-fp32-t1 | 1 | 1.011 | 1.003 | 8.4% | 1549 / 1889 | 518 | 1547 | 468 | 14.1 (idle 12.9) | 1.20 | 0.100 |
| kokoro-sara-fp32-t2 | 2 | 0.615 | 1.104 | 9.2% | 919 / 1032 | 589 | 1626 | 540 | 14.1 (idle 13.9) | 0.10 | 0.008 |
| kokoro-sara-fp32-t2-SPIN | 2 | 0.840 | 1.555 | 13.0% | 972 / 1154 | 493 | 1562 | 443 | 14.2 (idle 14.0) | 0.18 | 0.015 |
| kokoro-sara-fp32-t4 | 4 | 0.464 | 1.408 | 11.7% | 808 / 855 | 521 | 1560 | 471 | 14.0 (idle 13.7) | 0.16 | 0.013 |
| kokoro-sara-int8-t1 | 1 | 0.877 | 0.868 | 7.2% | 1297 / 1600 | 238 | 1779 | 188 | 14.0 (idle 14.3) | -0.25 | -0.021 |
| kokoro-sara-int8-t2 | 2 | 0.608 | 0.995 | 8.3% | 912 / 1011 | 238 | 1835 | 189 | 14.0 (idle 13.2) | 0.46 | 0.038 |
| kokoro-sara-int8-t4 | 4 | 0.515 | 1.304 | 10.9% | 675 / 834 | 240 | 1788 | 190 | 14.1 (idle 13.5) | 0.33 | 0.028 |
| piper-paola-med-t1 | 1 | 0.100 | 0.100 | 0.8% | 131 / 141 | 188 | 430 | 138 | 14.1 (idle 12.7) | 0.14 | 0.012 |
| piper-riccardo-xlow-t1 | 1 | 0.065 | 0.064 | 0.5% | 89 / 93 | 135 | 342 | 85 | 14.2 (idle 14.6) | -0.04 | -0.003 |
| piper-serena-high-t1 | 1 | 0.771 | 0.763 | 6.4% | 1271 / 952 | 215 | 478 | 165 | 14.0 (idle 12.7) | 1.03 | 0.085 |
| piper-serena-med-t1 | 1 | 0.109 | 0.108 | 0.9% | 146 / 123 | 186 | 437 | 137 | 14.1 (idle 13.6) | 0.05 | 0.004 |
| piper-serena-med-t2 | 2 | 0.072 | 0.128 | 1.1% | 123 / 82 | 232 | 441 | 182 | 14.1 (idle 13.4) | 0.06 | 0.005 |
| piper-serena-med-t4 | 4 | 0.054 | 0.161 | 1.3% | 71 / 64 | 195 | 430 | 145 | 14.1 (idle 11.5) | 0.14 | 0.012 |
| pocket-it-fp32-t1 | 1 | 0.716 | 0.854 | 7.1% | 472 / 482 | 1013 | 1311 | 963 | 14.0 (idle 12.8) | 0.84 | 0.070 |
| pocket-it-fp32-t2 | 2 | 0.661 | 1.077 | 9.0% | 306 / 337 | 829 | 1322 | 779 | 14.2 (idle 13.0) | 0.80 | 0.067 |
| pocket-it-fp32-t4 | 4 | 0.665 | 1.434 | 12.0% | 382 / 327 | 956 | 1312 | 906 | 14.0 (idle 14.2) | -0.10 | -0.008 |
| pocket-it-int8-t1 | 1 | 0.692 | 0.760 | 6.3% | 509 / 407 | 583 | 1031 | 533 | 14.7 (idle 12.7) | 1.38 | 0.115 |
| pocket-it-int8-t2 | 2 | 0.493 | 0.742 | 6.2% | 282 / 296 | 691 | 1036 | 641 | 14.0 (idle 13.8) | 0.11 | 0.009 |
| pocket-it-int8-t2-SPIN | 2 | 0.515 | 1.733 | 14.4% | 306 / 306 | 682 | 1043 | 632 | 14.1 (idle 14.2) | -0.05 | -0.005 |
| pocket-it-int8-t4 | 4 | 0.502 | 0.897 | 7.5% | 231 / 278 | 714 | 1024 | 664 | 14.0 (idle 13.6) | 0.21 | 0.017 |
| pocket-it24l-int8-t2 | 2 | 1.828 | 2.307 | 19.2% | 1083 / 1141 | 1423 | 1700 | 1373 | 14.1 (idle 13.5) | 1.08 | 0.090 |
| pocket-it24l-int8-t4 | 4 | 1.767 | 2.651 | 22.1% | 984 / 729 | 1540 | 1673 | 1490 | 14.1 (idle 14.0) | 0.14 | 0.012 |
| supertonic-F1-2step-t2 | 2 | 0.103 | 0.196 | 1.6% | 257 / 617 | 525 | 527 | 476 | 14.0 (idle 14.0) | 0.00 | 0.000 |
| supertonic-F1-5step-t1 | 1 | 0.331 | 0.325 | 2.7% | 724 / 1660 | 502 | 528 | 452 | 14.1 (idle 14.0) | 0.02 | 0.001 |
| supertonic-F1-5step-t2 | 2 | 0.185 | 0.353 | 2.9% | 484 / 985 | 533 | 535 | 483 | 14.1 (idle 14.3) | -0.03 | -0.002 |
| supertonic-F1-5step-t4 | 4 | 0.174 | 0.391 | 3.3% | 436 / 894 | 527 | 528 | 477 | 14.1 (idle 14.0) | 0.02 | 0.002 |
| supertonic-M1-5step-t2 | 2 | 0.208 | 0.395 | 3.3% | 464 / 1025 | 509 | 525 | 459 | 14.1 (idle 13.8) | 0.06 | 0.005 |

## WARNING about the energy columns
On this machine the APU package power (amdgpu PPT) sits at its firmware cap (~14 W, STAPM) because of
constant background load (load avg ~8, ~15 GB swap in use): extra TTS load lowers clocks instead of
adding watts, so "J per audio-s" is NOT valid here. Use "CPU-s per audio-s" as the energy proxy
(estimate: ~2–4 W per busy Zen 3+ core at ~3 GHz → J/audio-s ≈ CPU-s/audio-s × ~3).

## Intelligibility (Whisper small, Italian, WER on 10 sentences / 131 words) — see out/asr_report.json
piper-serena-med 3.8% · kokoro-sara 3.8% (fp32 = int8) · klein-marco 4.6% · klein-giulia 5.3% ·
supertonic-F1-5step 5.3% · piper-serena-high 5.3% · supertonic-M1 6.1% · pocket-24l-int8 10.7% ·
pocket-fp32 13.0% · piper-riccardo 15.3% · piper-paola 16.0% · pocket-int8 16.0% · supertonic-2step 38.9%
Common front-end errors (fixable by our own Italian normalizer): "1.250" read as "uno . duecentocinquanta",
"10:30" without "e", and "IVA" spelled as letters ("i vu a") inside a sentence. Re-checked 2026-11-12: espeak-ng reads
"IVA" as the word /ˈiva/ only when it stands alone, which made an earlier correction here wrong. àncora/ancora
get correct stress in context; they count as errors only because the ASR writes both as "ancora".
Pocket reference voice = synthetic Piper "serena" clip (built-in Italian voices need HF login).

## Engineering findings
- ORT thread spinning ON (onnxruntime default) burns CPU for nothing: Pocket int8 t2 CPU 0.74 → 1.73 s per audio-s, Kokoro 1.10 → 1.56.
- ORT CPU memory arena ON kept ~1 GB extra RSS on Pocket with no speed gain.
- Peak RSS at load can be 3–7× steady state (Kokoro int8: 1.8 GB peak vs 238 MB steady) → pre-optimize models offline.
