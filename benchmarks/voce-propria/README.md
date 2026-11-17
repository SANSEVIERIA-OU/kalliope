# La voce di chi usa Kalliope: misura delle tre strade (17/11/2026)

Incarico V-m (`design/lavoro/incarichi/V-misure-voce.md`), con il via del proprietario del 17/11/2026 per **misurare**,
non per costruire: il programma (`crates/`) non è stato toccato. Qui i fatti; nessuna raccomandazione.

Le tre strade per far parlare Kalliope con la voce della persona:

1. **Un secondo motore che imita la voce**: Pocket TTS, che clona dalla registrazione (pacchetti `italian_24l` e `italian`).
2. **La voce di oggi più un convertitore del timbro**: Klein (Giulia per le donne, Marco per gli uomini, come oggi nel
   programma) seguito da MeanVC2 o da OpenVoice V2.
3. **Cercare la voce dentro quella di oggi**: modificare i 256 numeri di una voce di Klein finché un misuratore del parlante
   dice che assomiglia alla registrazione, sul modello di KVoiceWalk, con un tetto di un'ora di CPU per persona.

La pagina d'ascolto per il proprietario è in `/workspace/nomedadefinire/bench/voce-propria/ascolto/index.html`
(statica, solo HTML e `<audio>`; si può servire da sola, per esempio `python3 -m http.server 8900` in quella cartella).

## I fatti in breve

Scala della somiglianza (ECAPA, contro i brani veri tenuti da parte): un brano vero della stessa persona fa 0,80–0,85,
un'altra persona dello stesso sesso 0,12–0,22, la voce di oggi (Giulia o Marco) 0,16–0,21. Medie sulle quattro persone
F1, F2, M1, M2; parole sbagliate su 256 parole (Klein oggi: 1,6%).

| Strada | Somiglianza ECAPA | WeSpeaker (terzo giudice) | Parole sbagliate | Riferimento rovinato (F1, M2): ECAPA · parole | CPU s per s di parlato (2 thread) | Memoria parlando | Primo suono | Preparare la voce, una volta |
|---|---|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,18 | 0,26 | 1,6% | — | 0,12 | 293 MB¹ | 0,15–0,19 s | — |
| 1 · Pocket TTS `italian_24l` | **0,58** | 0,59 | 8,2% | 0,47 · 8,6% | 2,85 | 2,2 GB | 0,83–0,86 s | 22 CPU-s, **5 GB** |
| 1 · Pocket TTS `italian` | 0,56 | 0,60 | 11,3% | 0,38 · 18,8% | 0,98 | 844 MB | 0,24–0,33 s | 23 CPU-s, 4,6 GB |
| 2 · Klein + MeanVC2 | 0,51 | **0,60** | 5,5% | 0,42 · 5,5% | 0,45 | 526 MB | 0,14–0,21 s | 25 CPU-s, 1,9 GB |
| 2 · Klein + OpenVoice V2 | 0,43 | 0,46 | **0,8%** | 0,20 · 3,9% | 1,31 | 1,3 GB | 1,4–1,8 s | 0,3 CPU-s, 0,8 GB |
| 3 · ricerca dentro Klein (Resemblyzer, 1 h) | 0,30 | 0,41 | 1,6% | 0,27 · 0,8% | come oggi | come oggi | come oggi | 1 h di CPU (83–94 min), 0,7 GB |

¹ Klein in Python con l'interprete; il programma in Rust sta a 95–117 MB.

- **Somiglianza**: Pocket TTS (24 strati) e Klein + MeanVC2 sono le strade che si avvicinano di più alla persona
  (0,51–0,58 con ECAPA, 0,59–0,60 con WeSpeaker), a metà strada fra la voce di oggi (0,18) e la persona vera (0,80–0,85).
  OpenVoice sta sotto (0,43). La ricerca dentro Klein porta la voce da 0,18 a 0,30 (da 0,24 a 0,36 secondo la persona).
- **Parole**: OpenVoice e la ricerca restano al livello di Klein (0,8% e 1,6%), perché parla sempre Klein. MeanVC2 cambia
  qualche vocale (5,5%). **Pocket TTS perde o storpia la prima parola in metà delle frasi** (14 su 30 con 24 strati, 15 su
  30 con 6; Klein 0) e arriva all'8–11% di parole sbagliate; il pacchetto a 6 strati salta anche pezzi di frase.
- **Riferimento rovinato** (telefono, rumore, MP3 a 16 kbit/s): tutte le strade perdono somiglianza. Pocket copia anche il
  canale: la voce generata è a sua volta «al telefono» e rumorosa. Klein + MeanVC2 tiene meglio le parole (5,5%) e una parte
  della somiglianza (0,42); OpenVoice crolla (0,20).
- **Costo mentre parla** (a 2 thread su questa macchina carica): MeanVC2 aggiunge circa 0,33 CPU-s per secondo a Klein
  (×4 il costo di oggi), Pocket `italian` ×8, OpenVoice in PyTorch ×11, Pocket `italian_24l` ×24 e **più lento del tempo
  reale** (2,3 s d'orologio per secondo di parlato) con 2,2 GB di memoria. La voce trovata dalla ricerca costa come la voce
  di oggi (0,175 contro 0,168 CPU-s per s, misurate insieme).
- **Costo una volta sola**: OpenVoice 0,3 s; Pocket e MeanVC2 20–25 s di CPU, ma Pocket arriva a 4,6–5 GB di memoria per
  codificare 25 s di riferimento e MeanVC2 a 1,9 GB (il codificatore del parlante WavLM-Large, 387 MB in int8, CC BY-SA 3.0);
  la ricerca un'ora di CPU.
- **La ricerca impara il giudice più che la voce**: il punteggio di Resemblyzer sale fino a 0,76–0,86 (la persona contro sé
  stessa fa 0,91–0,93), mentre ECAPA sui brani tenuti da parte resta a 0,24–0,36 (0,18 per M2 con il riferimento rovinato,
  sotto la voce di oggi) e spesso tocca il massimo nei primi 2–10 minuti per poi scendere. Giudicata da ECAPA (esperimento
  di 30 minuti), F1 sale a 0,42 sia con ECAPA sia con WeSpeaker; M1 a 0,40 con ECAPA ma solo 0,25 con WeSpeaker, con una
  voce a 210 Hz contro i 155 della persona: ogni giudice si lascia ingannare a modo suo.
- **MeanVC2 int8** (la variante leggera predefinita dell'esportazione) è rotta con ONNX Runtime 1.31.1: tono fisso a circa
  4 kHz, 25% di parole sbagliate; la causa è il DiT int8.

## Risultati

### Somiglianza (ECAPA) e parole sbagliate (Whisper), per strada e per persona

| Strada | F1 | F1d | F2 | M1 | M2 | M2d | media F1–M2 |
|---|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,16 · 1,6% | 0,16 · 1,6% | 0,16 · 1,6% | 0,18 · 1,6% | 0,21 · 1,6% | 0,21 · 1,6% | 0,18 · 1,6% |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,29 · 1,6% | 0,21 · 1,6% | 0,34 · 1,6% | 0,27 · 0,0% | 0,17 · 1,6% | 0,15 · 1,6% | 0,27 · 1,2% |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,28 · 1,6% | 0,35 · 1,6% | 0,30 · 1,6% | 0,36 · 1,6% | 0,24 · 1,6% | 0,18 · 0,0% | 0,30 · 1,6% |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,42 · 3,1% | — | — | 0,40 · 3,1% | — | — | 0,41 · 3,1% |
| 1 · Pocket TTS `italian_24l` | 0,64 · 3,1% | 0,47 · 6,2% | 0,53 · 9,4% | 0,57 · 10,9% | 0,57 · 9,4% | 0,46 · 10,9% | 0,58 · 8,2% |
| 1 · Pocket TTS `italian` | 0,64 · 6,2% | 0,37 · 20,3% | 0,48 · 15,6% | 0,59 · 10,9% | 0,54 · 12,5% | 0,38 · 17,2% | 0,56 · 11,3% |
| 2 · Klein + MeanVC2 | 0,66 · 4,7% | 0,52 · 6,2% | 0,50 · 4,7% | 0,43 · 7,8% | 0,44 · 4,7% | 0,32 · 4,7% | 0,51 · 5,5% |
| 2 · Klein + OpenVoice V2 | 0,32 · 0,0% | 0,25 · 1,6% | 0,51 · 1,6% | 0,46 · 1,6% | 0,44 · 0,0% | 0,15 · 6,2% | 0,43 · 0,8% |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,57 · 14,1% | 0,50 · 14,1% | 0,39 · 12,5% | 0,27 · 29,7% | 0,25 · 45,3% | 0,20 · 43,8% | 0,37 · 25,4% |

Ogni cella: somiglianza media sulle cinque frasi · parole sbagliate sul totale delle cinque frasi.

### Punti di riferimento (ECAPA contro gli stessi brani tenuti da parte)

| Persona | sé stessa (5 brani veri) | altre persone dello stesso sesso | voce di oggi | il suo riferimento | riferimento rovinato |
|---|---|---|---|---|---|
| F1 | 0,80 (da 0,77 a 0,84) | 0,13 | 0,16 | 0,86 | 0,66 |
| F2 | 0,84 (da 0,81 a 0,88) | 0,12 | 0,16 | 0,91 | — |
| M1 | 0,85 (da 0,74 a 0,90) | 0,22 | 0,18 | 0,88 | — |
| M2 | 0,85 (da 0,79 a 0,90) | 0,18 | 0,21 | 0,81 | 0,58 |

### WeSpeaker ResNet34 (terzo giudice: non lo usa nessuna strada)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,28 | 0,28 | 0,24 | 0,21 | 0,32 | 0,32 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,33 | 0,34 | 0,37 | 0,35 | 0,30 | 0,27 |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,40 | 0,39 | 0,43 | 0,44 | 0,38 | 0,24 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,44 | — | — | 0,25 | — | — |
| 1 · Pocket TTS `italian_24l` | 0,69 | 0,38 | 0,50 | 0,59 | 0,60 | 0,42 |
| 1 · Pocket TTS `italian` | 0,69 | 0,31 | 0,50 | 0,57 | 0,62 | 0,43 |
| 2 · Klein + MeanVC2 | 0,67 | 0,45 | 0,58 | 0,56 | 0,57 | 0,42 |
| 2 · Klein + OpenVoice V2 | 0,46 | 0,16 | 0,46 | 0,49 | 0,42 | 0,21 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,43 | 0,37 | 0,26 | 0,27 | 0,18 | 0,14 |
| persona contro sé stessa | 0,86 | 0,86 | 0,85 | 0,89 | 0,88 | 0,88 |
| altre persone dello stesso sesso | 0,20 | 0,20 | 0,10 | 0,32 | 0,30 | 0,30 |

### Resemblyzer (il giudice della ricerca: favorisce la strada 3)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,67 | 0,67 | 0,64 | 0,60 | 0,54 | 0,54 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,71 | 0,68 | 0,71 | 0,67 | 0,58 | 0,59 |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,75 | 0,73 | 0,79 | 0,75 | 0,65 | 0,63 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,66 | — | — | 0,65 | — | — |
| 1 · Pocket TTS `italian_24l` | 0,85 | 0,65 | 0,82 | 0,82 | 0,80 | 0,67 |
| 1 · Pocket TTS `italian` | 0,84 | 0,62 | 0,81 | 0,81 | 0,79 | 0,68 |
| 2 · Klein + MeanVC2 | 0,84 | 0,76 | 0,81 | 0,76 | 0,64 | 0,63 |
| 2 · Klein + OpenVoice V2 | 0,79 | 0,62 | 0,79 | 0,82 | 0,73 | 0,63 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,72 | 0,71 | 0,71 | 0,60 | 0,44 | 0,45 |
| persona contro sé stessa | 0,91 | 0,91 | 0,91 | 0,93 | 0,93 | 0,93 |
| altre persone dello stesso sesso | 0,62 | 0,62 | 0,60 | 0,57 | 0,56 | 0,56 |

### Altezza della voce (mediana F0, Hz) e variazione (deviazione standard in semitoni)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| persona (brani veri) | 166 · 3,1 | 166 · 3,1 | 175 · 3,3 | 155 · 2,2 | 104 · 3,4 | 104 · 3,4 |
| Voce di oggi (Klein) | 230 · 2,5 | 230 · 2,5 | 230 · 2,5 | 100 · 4,0 | 100 · 4,0 | 100 · 4,0 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 207 · 2,6 | 203 · 3,2 | 196 · 2,3 | 136 · 4,2 | 140 · 3,4 | 133 · 3,5 |
| 3 · ricerca dentro Klein, 1 h di CPU | 197 · 2,5 | 188 · 2,5 | 153 · 2,1 | 155 · 3,5 | 137 · 3,6 | 104 · 1,7 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 196 · 2,5 | — | — | 210 · 3,8 | — | — |
| 1 · Pocket TTS `italian_24l` | 186 · 2,1 | 188 · 5,1 | 179 · 3,3 | 162 · 3,5 | 103 · 3,0 | 110 · 3,5 |
| 1 · Pocket TTS `italian` | 198 · 2,7 | 215 · 4,3 | 175 · 4,0 | 140 · 4,3 | 109 · 3,4 | 115 · 4,0 |
| 2 · Klein + MeanVC2 | 194 · 2,9 | 193 · 2,6 | 182 · 2,6 | 110 · 3,7 | 105 · 2,5 | 117 · 2,4 |
| 2 · Klein + OpenVoice V2 | 185 · 1,8 | 197 · 2,9 | 175 · 2,1 | 163 · 3,2 | 117 · 1,8 | 129 · 1,3 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 220 · 1,9 | 242 · 2,2 | 256 · 1,6 | 248 · 1,9 | 259 · 1,4 | 260 · 2,1 |

### Costo (2 thread, una prova alla volta, processi separati)

| Strada | CPU s per s di parlato | orologio s per s | memoria massima parlando | primo suono, frase 1 / frase 4 | carico medio (1 min) |
|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,117 | 0,065 | 293 MB | 151 / 191 ms | 8,0 |
| 1 · Pocket TTS `italian_24l` | 2,852 | 2,299 | 2189 MB | 855 / 828 ms | 10,4 |
| 1 · Pocket TTS `italian` | 0,981 | 0,681 | 844 MB | 237 / 331 ms | 12,6 |
| 2 · Klein + MeanVC2 | 0,453 | 0,281 | 526 MB | 140 / 210 ms | 10,9 |
| 2 · Klein + OpenVoice V2 | 1,309 | 0,681 | 1264 MB | 1357 / 1819 ms | 9,4 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,347 | 0,228 | 378 MB | 190 / 239 ms | 9,9 |

La voce trovata dalla ricerca contro la voce di oggi, misurate più tardi nella stessa finestra (carico più alto):

| Strada | CPU s per s di parlato | orologio s per s | memoria massima | primo suono, frase 1 / frase 4 | carico medio (1 min) |
|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,168 | 0,116 | 291 MB | 222 / 374 ms | 28,2 |
| 3 · voce trovata dalla ricerca | 0,175 | 0,124 | 295 MB | 209 / 327 ms | 28,6 |

### Costo una volta sola (preparare la voce della persona)

| Strada | CPU s | orologio s | memoria massima | che cosa |
|---|---|---|---|---|
| 1 · Pocket TTS `italian_24l` | 21,5 | 18,4 | 4995 MB | codifica Mimi del riferimento |
| 1 · Pocket TTS `italian` | 23,1 | 18,6 | 4634 MB | codifica Mimi del riferimento |
| 2 · Klein + MeanVC2 | 24,9 | 16,5 | 1910 MB | codificatore del parlante WavLM-Large + ECAPA (int8, 387 MB) |
| 2 · Klein + OpenVoice V2 | 0,3 | 0,2 | 839 MB | codificatore del timbro sul riferimento |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 25,6 | 15,1 | 1743 MB | come sopra |
| 3 · ricerca dentro Klein (Resemblyzer) | 3600–3602 | 4896–5651 | 724 MB | 6 ricerche, 1831–2801 passi ciascuna |
| 3 · ricerca giudicata da ECAPA (esperimento) | 1800–1808 | 2649–2824 | 1027 MB | 2 ricerche, 643–727 passi ciascuna |

### Strada 3: le ricerche

| Ricerca | giudice | CPU s | orologio | passi | controlli (respinti) | memoria massima | carico all'inizio → alla fine | partenza |
|---|---|---|---|---|---|---|---|---|
| F1 | ecapa | 1800 | 47 min | 727 | 14 (3) | 978 MB | 43 → 41 | ½ Giulia + ½ Mateo |
| M1 | ecapa | 1808 | 44 min | 643 | 12 (4) | 1027 MB | 41 → 36 | ½ Maya + ½ Giulia |
| F1 | resemblyzer | 3601 | 83 min | 2563 | 17 (7) | 702 MB | 9 → 27 | ½ Lyra + ½ Giulia |
| F1d | resemblyzer | 3602 | 94 min | 2489 | 22 (0) | 702 MB | 16 → 50 | ¾ Giulia + ¼ Mateo |
| F2 | resemblyzer | 3600 | 91 min | 1831 | 35 (25) | 699 MB | 25 → 42 | ¾ Camille + ¼ Ivy |
| M1 | resemblyzer | 3600 | 83 min | 2653 | 22 (7) | 698 MB | 9 → 27 | ¾ Mateo + ¼ Edmund |
| M2 | resemblyzer | 3600 | 91 min | 2410 | 20 (12) | 699 MB | 25 → 42 | ½ Diego + ½ Owen |
| M2d | resemblyzer | 3601 | 82 min | 2801 | 23 (9) | 724 MB | 42 → 36 | ½ Mateo + ½ Diego |

### Strada 3: somiglianza nel tempo

| Ricerca | giudice | partenza | 0 min | 2 min | 5 min | 10 min | 20 min | 40 min | fine |
|---|---|---|---|---|---|---|---|---|---|
| F1 | resemblyzer | ½ Lyra + ½ Giulia | 0,29 / 0,32 (0,67) | 0,37 / 0,43 (0,75) | 0,35 / 0,45 (0,79) | 0,26 / 0,36 (0,83) | 0,25 / 0,38 (0,84) | 0,27 / 0,39 (0,85) | 0,27 / 0,39 (0,85) |
| M1 | resemblyzer | ¾ Mateo + ¼ Edmund | 0,27 / 0,35 (0,73) | 0,31 / 0,39 (0,78) | 0,32 / 0,45 (0,79) | 0,37 / 0,43 (0,80) | 0,36 / 0,42 (0,83) | 0,38 / 0,44 (0,83) | 0,37 / 0,43 (0,83) |
| F1d | resemblyzer | ¾ Giulia + ¼ Mateo | 0,21 / 0,34 (0,66) | 0,26 / 0,35 (0,75) | 0,22 / 0,29 (0,76) | 0,32 / 0,38 (0,78) | 0,34 / 0,36 (0,79) | 0,37 / 0,39 (0,80) | 0,35 / 0,38 (0,81) |
| F1_ecapa | ecapa | ½ Giulia + ½ Mateo | 0,19 / 0,35 (0,29) | 0,28 / 0,35 (0,44) | 0,40 / 0,41 (0,50) | 0,42 / 0,42 (0,54) | 0,48 / 0,47 (0,59) | — | 0,41 / 0,43 (0,62) |
| F2 | resemblyzer | ¾ Camille + ¼ Ivy | 0,34 / 0,37 (0,75) | 0,30 / 0,43 (0,77) | 0,33 / 0,46 (0,81) | 0,34 / 0,49 (0,82) | 0,31 / 0,45 (0,85) | 0,30 / 0,44 (0,86) | 0,30 / 0,44 (0,86) |
| M2 | resemblyzer | ½ Diego + ½ Owen | 0,17 / 0,30 (0,67) | 0,17 / 0,30 (0,67) | 0,23 / 0,35 (0,74) | 0,23 / 0,35 (0,74) | 0,24 / 0,39 (0,75) | 0,25 / 0,36 (0,76) | 0,24 / 0,37 (0,76) |
| M1_ecapa | ecapa | ½ Maya + ½ Giulia | 0,29 / 0,19 (0,30) | 0,31 / 0,16 (0,35) | 0,34 / 0,19 (0,38) | 0,38 / 0,22 (0,45) | 0,39 / 0,23 (0,45) | — | 0,40 / 0,25 (0,46) |
| M2d | resemblyzer | ½ Mateo + ½ Diego | 0,15 / 0,28 (0,64) | 0,21 / 0,36 (0,69) | 0,21 / 0,36 (0,69) | 0,17 / 0,26 (0,72) | 0,16 / 0,26 (0,73) | 0,15 / 0,24 (0,75) | 0,18 / 0,23 (0,75) |

Ogni cella: ECAPA / WeSpeaker sulle cinque frasi di prova contro i brani tenuti da parte (tra parentesi il punteggio del giudice della ricerca sulle due frasi di ricerca contro il riferimento). Minuti di CPU del cammino dopo la partenza (la scelta fra le 17 voci e le miscele costa 1,5–2,5 minuti); «fine»: la voce finale.

## Che cosa si vede al posto dell'ascolto

Qui non c'è uscita audio: quanto segue viene da spettrogrammi messi a confronto (`scripts/spettri.py`), dalle
trascrizioni di Whisper frase per frase, dalle durate e dall'altezza della voce. È ciò che un orecchio dovrebbe
controllare per primo sulla pagina d'ascolto, non un giudizio d'orecchio.

- **Voce di oggi** (Giulia 230 Hz, Marco 100 Hz di mediana): pulita, silenzio vero fra le frasi, ritmo regolare. Le
  persone stanno a 166 e 175 Hz (F1, F2) e a 155 e 104 Hz (M1, M2): Giulia è molto più acuta delle due donne, Marco è
  lontano da M1.
- **Pocket TTS** ha un ritmo e pause suoi, presi in parte dal riferimento: con M1, che legge svelto, le frasi durano il
  20–25% meno di Klein; l'altezza segue la persona (F1 186 Hz, M2 103 Hz). Copia anche il **canale** della registrazione:
  il fondo di rumore del riferimento si vede in tutte le frasi, e con il riferimento rovinato la voce generata è essa
  stessa al telefono (niente sopra 4 kHz, rumore): suona come la vecchia registrazione. **Perde o storpia la prima parola
  in metà delle frasi** (14 su 30 con 24 strati, 15 su 30 con 6; Klein 0 su 30): «Sono d'accordo» diventa «d'accordo»,
  «ad accordo», «un accordo», «carta»; «Che bella notizia» diventa «bella notizia» o «È bella notizia»; «Scusate»
  diventa «Cos'attemi» o «Posate»; «Il preventivo» diventa «Preventivo». Altre parole storpiate qua e là («consenia»,
  «dicendo», «venervi»). Il pacchetto a 6 strati salta anche pezzi di frase: «Buongiorno a tutti. Scrivo benissimo,
  benissimo» (F2), «scrivo un verissimo benissimo» (F1 rovinato).
- **Klein + MeanVC2** tiene esattamente tempi e pause di Klein (stesse durate, ±0,1 s): la melodia della frase resta
  quella di Klein, cambia il timbro. Esce a 16 kHz: niente sopra 8 kHz, quindi più ovattata delle altre. L'altezza si
  avvicina alla persona per le donne (F1 194, F2 182 Hz) ma non per M1 (110 Hz contro 155). Qualche vocale cambiata
  («stritta», «estreta» per «stretta»; «Il preventivo di» senza «è»; «comprimente»). La variante int8 dell'esportazione
  (ASR, DiT e Vocos int8, quella predefinita) ha un **tono fisso a circa 4 kHz** per tutta la frase, l'altezza salta a
  circa 250 Hz per tutti e le parole si storpiano (13–45% sbagliate); la causa è il DiT int8 (con il solo ASR int8 la frase
  di prova esce perfetta).
- **Klein + OpenVoice V2** tiene anch'esso tempi e pause di Klein; il timbro si sposta verso la persona, ma l'intonazione
  si **appiattisce**: 1,3–2,1 semitoni di variazione contro 2,2–3,4 delle persone e 2,5–4,0 di Klein. Quasi nessuna parola
  sbagliata. Con il riferimento rovinato è la strada che perde più somiglianza (0,25 e 0,15).
- **Ricerca dentro Klein**: è sempre Klein, con la sua pulizia e il suo ritmo; cambiano timbro, altezza e un poco la
  velocità (M1 a 155 Hz come la persona). La partenza è spesso una miscela con voci straniere (M1: ¾ Mateo, spagnolo, e ¼
  Edmund, inglese; F1 rovinato: ¾ Giulia e ¼ Mateo): l'eventuale accento straniero va ascoltato, Whisper non lo segna (0–1
  parole sbagliate su 64).

## Metodo

### Macchina e versioni

- AMD Ryzen 5 PRO 6650U (6 core, 12 thread), 14 GB, Linux 7.2.15 (Arch), **condivisa** con altri lavori (prove del sito nel
  browser): carico medio fra 15 e 19 durante tutta la misura, memoria disponibile fra 1,7 e 4 GB. Per questo il costo è dato
  in **secondi di CPU**, non solo d'orologio, e il carico è scritto accanto a ogni misura.
- Python 3.13.5, ONNX Runtime 1.31.1 (le impostazioni di Kalliope: niente spinning, niente arena, niente memory pattern),
  PyTorch 2.15.0 CPU (solo OpenVoice e i misuratori), SpeechBrain 1.1.2, faster-whisper 1.2.1, librosa 1.0.1.
- La voce di oggi è fatta dal programma vero: `kalliope-cli say` ricostruito dallo stesso sorgente di `main` in una cartella
  temporanea (`/tmp/voce-m-target`), con `--threads 1` come il programma. La strada 3 parla anch'essa con `kalliope-cli`,
  su una cartella del modello che ha una voce in più in `model.json` (encoder e decoder sono collegamenti agli originali).

### Le persone

Voci italiane vere a licenza libera, lettori volontari di LibriVox (tutte le registrazioni LibriVox sono nel pubblico
dominio; su archive.org le quattro hanno il Public Domain Mark 1.0). File originali MP3 dei capitoli 1 e 2.

| | Lettore | Opera (archive.org) | Note |
|---|---|---|---|
| F1 | Enrica Giampieretti | Grazia Deledda, *Canne al vento* (`canne_al_vento_1609_librivox`) | registrazione molto pulita, F0 ~160 Hz |
| F2 | Claudia Caldi | Scipio Sighele, *La crisi dell'infanzia e la delinquenza dei minorenni* (`lacrisidellinfanzi_2405_librivox`) | fondo a −63 dB, F0 ~160 Hz |
| M1 | Riccardo Fasol | Luigi Pirandello, *Il fu Mattia Pascal* (`mattia_pascal_1012_librivox`) | voce maschile chiara, F0 ~150 Hz |
| M2 | Renzo Clerico | Niccolò Machiavelli, *Il Principe* (`il_principe_1711_librivox`) | voce maschile profonda, F0 ~90 Hz |

Per ogni persona (`scripts/prepara_persone.py`, tagli nelle pause, `esiti/persone.json`):

- **riferimento**: 25–27 s consecutivi dal capitolo 1, dal terzo minuto in poi (dopo il preambolo di LibriVox). È l'unico
  audio che le strade sentono.
- **brani tenuti da parte**: quattro brani di 6–11 s dal capitolo 2 (un'altra sessione), mai dati alle strade: sono il
  bersaglio di tutte le somiglianze.
- **brani di controllo**: cinque brani di 3–6,5 s (lunghi come le frasi di prova) dal capitolo 2, diversi dai precedenti,
  per il punto di riferimento «la persona contro sé stessa».
- **riferimento rovinato** (F1 e M2): lo stesso riferimento con rumore rosa a 20 dB di SNR, banda del telefono 300–3400 Hz
  a 8 kHz e MP3 a 16 kbit/s, riportato a 24 kHz («F1d», «M2d»). Per i due casi rovinati le strade vedono solo il
  riferimento rovinato; la somiglianza si misura sempre contro i brani veri e puliti.

I campioni restano su questo computer (`/workspace/nomedadefinire/bench/voce-propria/`), fuori dal repository.

### Le frasi

Le tre frasi dei campioni del sito (`design/progetto.md`, «Testi dei campioni») più una domanda e un'esclamazione:

1. Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.
2. Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?
3. Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.
4. Scusate, mi sentite bene adesso? Posso condividere lo schermo?
5. Che bella notizia, complimenti a tutta la squadra!

Tutte passano dal normalizzatore di Kalliope (`kalliope-cli phonemes`, `esiti/frasi.json`): Klein riceve i fonemi del
fonetizzatore di Kalliope, come nel programma; Pocket TTS il testo normalizzato con la maiuscola a inizio frase; i
convertitori ricevono l'audio di Klein.

### Le strade, i modelli e le licenze

| Strada | Che cosa gira | Licenza | Da dove |
|---|---|---|---|
| oggi | Klein-TTS X1.5 Pro, 13 M parametri, 24 kHz | Apache-2.0 | `klein-ml/Klein-TTS-X1.5-Pro` (già sul disco dal 12/11) |
| 1 | Pocket TTS, pacchetti `italian_24l` (24 strati, solo int8) e `italian` (6 strati, int8), clonazione dal file del riferimento, temperatura 0,7, 1 passo LSD | pesi CC-BY-4.0, codice MIT; il modello ufficiale `kyutai/pocket-tts` è «gated» (serve un account che accetti le condizioni): **non usato**; usata l'esportazione ONNX di terzi `xennonf4/pocket-tts-onnx` (CC-BY-4.0, già sul disco dal 12/11) | |
| 2 | Klein + **MeanVC2** (120 ms + 40 ms, fp32, 2 passi mean-flow come `runtime/run_rt.py`), 16 kHz | grafi di conversione Apache-2.0 (pesi `ASLP-lab/MeanVC2` Apache-2.0); **codificatore del parlante CC BY-SA 3.0** (WavLM-Large + ECAPA di microsoft/UniSpeech); le pagine del progetto parlano di uso di ricerca non commerciale; scheda: lingue en, zh | esportazione ONNX di terzi `kiarina/MeanVC2-ONNX` rev `2db97430` (somme SHA-256 verificate), ciclo di streaming `tool/onnx_stream.py` di `kiarina/meanvc2_onnx` (Apache-2.0) |
| 2 | Klein + **OpenVoice V2** (convertitore del timbro, `tau` 0,3, 22,05 kHz), timbro di partenza ricavato da 25 s di Giulia o Marco | codice e pesi MIT (l'articolo è CC BY-NC-SA); filigrana WavMark del codice ufficiale **spenta** | `myshell-ai/OpenVoiceV2` rev `f36e7edf`, codice `myshell-ai/OpenVoice` (solo i moduli del convertitore) |
| 3 | Klein con una riga di 256 numeri trovata dalla ricerca | Apache-2.0 (Klein); il metodo è di KVoiceWalk (Apache-2.0), codice nostro | |

Nessun codice GPL o non commerciale gira nelle strade. Fanno eccezione, da segnare: il codificatore del parlante di MeanVC2
(CC BY-SA 3.0, condivisione allo stesso modo) e le pagine «non commerciali» di MeanVC2, che contrastano con la licenza
Apache-2.0 dei pesi (già nella ricerca `2-…`, §4).

### La ricerca della strada 3 (`scripts/strada3_ricerca.py`)

- Klein dice due frasi di ricerca (mai le frasi di prova): «Oggi il cielo è sereno e il treno parte alle nove.» e
  «Vorrei sapere se domani la sala delle riunioni è libera.».
- **Punteggio**: somiglianza Resemblyzer (Apache-2.0, il misuratore di KVoiceWalk) delle due frasi con il riferimento, meno
  ciò che manca alla somiglianza fra le due frasi per arrivare a 0,80 (una voce che cambia da frase a frase non è una voce).
  La ricerca non vede mai ECAPA né i brani tenuti da parte: ECAPA sui brani tenuti è un controllo indipendente.
- **Partenza**: le 17 voci di `model.json` (anche le straniere, che dicono fonemi italiani), poi le miscele delle cinque più
  vicine (pesi ¼, ½, ¾); si parte dalla migliore che supera il controllo.
- **Cammino**: la migliore più un passo casuale (σ volte la deviazione standard delle 17 voci, numero per numero; σ da 0,30,
  cresce del 5% a ogni miglioramento e cala del 30% dopo 150 passi senza); ogni numero resta nell'intervallo delle 17 voci
  allargato del 25%. Il rumore del decodificatore è fisso, così il punteggio cambia solo con la voce.
- **Controllo che la voce resti comprensibile**: Whisper base (int8) deve capire le due frasi con al più il 15% di parole
  sbagliate e la loro durata deve restare fra 0,6 e 1,6 volte quella della voce di oggi. Si controlla la partenza; durante il
  cammino la migliore al più una volta per minuto di CPU (Whisper small costa 6 s di CPU per frase su un thread); se non
  passa, il cammino torna all'ultima migliore che passava. Si controlla anche la voce finale.
- **Tetto**: 3600 s di CPU del processo per persona, un thread per tutto; la curva della somiglianza nel tempo è in
  `esiti/curva.json` (ECAPA e WeSpeaker sulle cinque frasi di prova, a 0, 1, 2, 5, 10, 15, 20, 30, 40, 50, 60 minuti di CPU).
- **Esperimento in più**, deciso a lavoro avviato quando si è visto che ECAPA non seguiva Resemblyzer: lo stesso cammino
  giudicato da ECAPA sul riferimento (soglia di coerenza 0,75: due frasi della stessa voce di Klein fanno 0,82–0,86), 1800 s
  di CPU per F1 e M1. Lì ECAPA non è più un controllo indipendente; conta WeSpeaker.
- La voce finale parla con il programma vero (`kalliope-cli`); la curva usa la copia in Python di Klein (stesso modello,
  rumore del decodificatore diverso).

### Che cosa si misura

- **Somiglianza alla persona** (`scripts/misure.py`, `scripts/valuta.py`): ECAPA-TDNN di SpeechBrain
  (`speechbrain/spkrec-ecapa-voxceleb`, Apache-2.0, rev `0f99f2d0`), coseno fra l'audio e il centroide dei quattro brani
  tenuti da parte, media sulle cinque frasi. Accanto, un terzo giudice che nessuna strada usa, WeSpeaker ResNet34
  (`Wespeaker/wespeaker-voxceleb-resnet34`, Apache-2.0, ONNX), e Resemblyzer, che è il giudice della ricerca e quindi la
  favorisce.
- **Parole sbagliate**: Whisper small int8, beam 5, italiano, come `benchmarks/engines/scripts/asr_check.py`; la frase e la
  trascrizione passano entrambe dal normalizzatore di Kalliope prima del conteggio («14 marzo» e «quattordici marzo»
  sono le stesse parole). Totale degli errori sul totale delle parole delle cinque frasi.
- **Costo** (`scripts/costo.py`): 2 thread per tutti, una prova alla volta, ogni misura in un processo nuovo, con le ricerche
  della strada 3 ferme (SIGSTOP) durante la misura. Secondi di CPU per secondo di parlato (le cinque frasi due volte, dopo un
  riscaldamento), secondi d'orologio per secondo, memoria massima del processo (`ru_maxrss`) mentre parla, tempo al primo
  suono (mediana di tre) per la frase 1 e la frase 4. Per Klein + convertitore il costo comprende Klein.
- **Costo una volta sola**: preparare la voce della persona in un processo a sé (modelli caricati più codifica del
  riferimento), e per la strada 3 la ricerca.
- **Ascolto**: qui non c'è uscita audio, quindi non ho potuto ascoltare. Al posto dell'orecchio: spettrogrammi messi a
  confronto (`scripts/spettri.py`), le trascrizioni di Whisper frase per frase, durata, altezza (mediana di F0 con pYIN) e
  variazione dell'intonazione in semitoni. Che cosa se ne ricava è più sotto; il giudizio d'orecchio resta al proprietario,
  sulla pagina d'ascolto.

## Limiti della prova

- **Non ho potuto ascoltare**: su questa macchina non c'è uscita audio. Ciò che «si sente» è ricavato da spettrogrammi,
  trascrizioni, altezza e durate; il giudizio d'orecchio resta al proprietario.
- **Pochi dati per cella**: quattro persone, cinque frasi, 64 parole per cella; una parola sbagliata vale 1,6 punti di WER.
  Differenze di una o due parole sono rumore.
- **Le persone sono lettori allenati** che leggono un libro con un microfono discreto. Chi perde la parola può avere solo
  vecchie registrazioni o una voce già alterata: il riferimento rovinato copre il canale (telefono, rumore, compressione),
  non la voce alterata (disartria), che qui non è stata provata.
- **Un solo riferimento di 25–27 s per persona**: nessuna prova con riferimenti più corti (5–10 s).
- **Il canale conta**: i brani tenuti da parte vengono dallo stesso audiolibro (stesso microfono e stanza) del riferimento.
  Pocket TTS copia anche il canale della registrazione (con il riferimento rovinato parla con la banda del telefono e il
  rumore, vedi sotto), i convertitori no: una parte della somiglianza di Pocket con i brani veri può essere somiglianza di
  canale, non di voce.
- **I misuratori del parlante** (ECAPA, WeSpeaker, Resemblyzer) dicono se il timbro è della stessa persona; non giudicano
  naturalezza, accento o intonazione. Whisper è robusto all'accento: le parole sbagliate colgono parole perse o storpiate,
  non un accento straniero.
- **Macchina condivisa**, carico medio da 8 a 39 durante la misura. Il tempo di CPU è la misura, ma con la contesa anche il
  tempo di CPU cresce (cache, SMT): i costi sono confrontabili fra loro (misurati nella stessa finestra, una prova alla volta)
  ma più alti che a macchina scarica (Klein in Python: 0,117 CPU-s per s qui, circa 0,1 il 12/11). Per la stessa ragione le
  ricerche della strada 3 partite con il carico più alto hanno fatto meno passi nella stessa ora di CPU (vedi la tabella).
- **Costi misurati in Python** (ONNX Runtime 1.31.1; OpenVoice in PyTorch): la memoria comprende l'interprete (circa
  50–100 MB) e, per OpenVoice, PyTorch; il programma in Rust con Klein sta a 95–117 MB (12/11). OpenVoice in ONNX potrebbe
  costare meno; la memoria di Pocket dipende dall'esportazione di terzi (stato di 1000 passi per 24 strati) e dall'arena spenta.
- **Esportazioni di terzi**: Pocket TTS e MeanVC2 sono girati da esportazioni ONNX non ufficiali (MeanVC2 verificata dal suo
  autore contro il codice originale, Pocket no); il modello ufficiale di Pocket (con account) e il PyTorch originale di
  MeanVC2 non sono stati provati. Le impostazioni non sono state ritoccate (Pocket temperatura 0,7 e 1 passo; MeanVC2 2 passi;
  OpenVoice `tau` 0,3).
- **Strada 3**: un solo cammino per persona (seme 0) e un solo giudice, come KVoiceWalk; il controllo con Whisper base ha
  respinto miglioramenti anche per errori minimi («e» al posto di «è», parole fuse), 7 controlli su 17–22 per F1 e M1; il
  passo σ è arrivato al minimo (0,03) dopo circa 20 minuti, e il resto dell'ora è andato in passi piccoli. La variante
  giudicata da ECAPA è un esperimento di 30 minuti su F1 e M1 soltanto.
- Nessuna misura di energia (i contatori RAPL non si leggono qui): il tempo di CPU fa da indicatore.
- Una somiglianza di 0,6 non vuol dire «simile al 60%»: la scala si legge con i punti di riferimento (sé stessa 0,80–0,85,
  un'altra persona 0,12–0,22).

## Come rifare

```sh
B=/workspace/nomedadefinire/bench/voce-propria      # dati pesanti, fuori dal repository
S=benchmarks/voce-propria/scripts
cargo build --release -p kalliope-cli --target-dir /tmp/voce-m-target
python3 -m venv $B/.venv
$B/.venv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
$B/.venv/bin/pip install onnxruntime==1.31.1 numpy scipy soundfile faster-whisper sentencepiece safetensors \
    huggingface_hub speechbrain av psutil librosa matplotlib webrtcvad-wheels
$B/.venv/bin/pip install --no-deps resemblyzer==0.1.4
# scaricare in cartelle proprie: i capitoli LibriVox (tabella sopra) in $B/scaricati/librivox-<item>/,
# kiarina/MeanVC2-ONNX in $B/modelli/meanvc2-onnx, myshell-ai/OpenVoiceV2 in $B/modelli/openvoice-v2,
# speechbrain/spkrec-ecapa-voxceleb, Wespeaker/wespeaker-voxceleb-resnet34 e Systran/faster-whisper-base in $B/modelli/,
# il codice di kiarina/meanvc2_onnx e myshell-ai/OpenVoice in $B/codice/dl-*/
P="$B/.venv/bin/python -I"
$P $S/prepara_persone.py && $P $S/oggi.py
for s in pocket24 pocket6 meanvc2 meanvc2-int8 openvoice; do $P $S/genera.py $s; done
for r in F1 F2 M1 M2 F1d M2d; do $P $S/strada3_ricerca.py $r --budget 3600; done
for r in F1 M1; do $P $S/strada3_ricerca.py $r --budget 1800 --giudice ecapa; done
$P $S/curva.py && $P $S/curva.py F1 M1 --giudice ecapa
$P $S/genera.py ricerca && $P $S/genera.py ricerca-ecapa F1 M1
$P $S/valuta.py                       # ECAPA, WeSpeaker, Resemblyzer, Whisper; risultati in esiti/qualita.json
# costo: con le ricerche ferme, una prova alla volta
$P $S/costo.py --strade oggi,pocket24,pocket6,meanvc2,meanvc2-int8,openvoice --rif F1,M1
$P $S/costo.py --strade oggi,ricerca --modi parla --rif F1,M1
$P $S/pagina.py && $P $S/resoconto.py
```

## File

| Percorso | Contenuto |
|---|---|
| `scripts/comune.py` | percorsi, frasi, impostazioni di ONNX Runtime |
| `scripts/prepara_persone.py` | tagli delle persone, riferimento rovinato |
| `scripts/oggi.py` | la voce di oggi con `kalliope-cli` |
| `scripts/klein.py` | Klein in Python con una riga di stile qualsiasi (per la ricerca), cartella del modello con voci in più |
| `scripts/strade.py` | le strade dietro un'interfaccia sola |
| `scripts/genera.py` | l'audio di una strada per tutti i riferimenti |
| `scripts/strada3_ricerca.py`, `scripts/curva.py` | la ricerca e la sua curva |
| `scripts/misure.py`, `scripts/valuta.py` | ECAPA, WeSpeaker, Resemblyzer, Whisper |
| `scripts/costo.py` | il costo, una prova alla volta |
| `scripts/spettri.py` | spettrogrammi a confronto |
| `scripts/pagina.py` | la pagina d'ascolto |
| `scripts/resoconto.py` | le tabelle di questo file |
| `esiti/` | `persone.json`, `frasi.json`, `qualita.json` (con `qualita_cache.json`, per file), `costo.jsonl`, `curva.json`, `ricerca/*.json`, `genera_*.json` |
| `progresso.md` | il diario del lavoro |
