# Le foto che provano gli stati: dalle cartelle delle corse (in /tmp) a costruzione/foto/, in JPEG (qualità 84) per non pesare.
# Uso: python3 raccogli-foto.py
import glob, os, sys
from PIL import Image
D = '/workspace/kalliope/design/lavoro/3a-non-ancora/costruzione/foto'
os.makedirs(D, exist_ok=True)
elenco = []
for m in ('chromium-1440x900', 'chromium-390x844'):
    for n in ('ascolto-0-riposo', 'ascolto-2-suona', 'ascolto-3-pausa', 'ascolto-4-fine', 'errore-1-messaggio', 'errore-2-riprova', 'lento-0-carica', 'lento-1-messaggio', 'attesa-1-aspetta-dati',
              'nascosto-1-in-pausa', 'copia-1', 'copia-no-1', 'tentativo-1-va', 'tentativo-2-sul-posto', 'tentativo-3-fine', 'tentativo-ridimensiona-1-interrotto'):
        elenco.append((f'/tmp/lavoro-3ab-F-stati/{n}-{m}.png', f'stati-{n}-{m}.jpg'))
for m in ('chromium-1440x900', 'chromium-390x844', 'chromium-390x667', 'chromium-844x390', 'chromium-360x640'):
    for n in ('tastiera-fine', 'senzajs-alto', 'senzajs-chiusura', 'senza-stili', 'senza-token', 'scorri-fondo', 'scorri-ancora', 'ritorno', 'ridotto-ascolto'):
        elenco.append((f'/tmp/lavoro-3ab-F-rob/{n}-{m}.png', f'robustezza-{n}-{m}.jpg'))
for k in range(1, 6):
    elenco.append((f'/tmp/lavoro-3ab-F-catalogo/scheda-{k}-chromium-1440x900.png', f'catalogo-scheda-{k}-chromium-1440x900.jpg'))
n = 0
for src, dst in elenco:
    if os.path.exists(src):
        Image.open(src).convert('RGB').save(f'{D}/{dst}', quality=84); n += 1
print(f'{n} foto su {len(elenco)} in {D}')
