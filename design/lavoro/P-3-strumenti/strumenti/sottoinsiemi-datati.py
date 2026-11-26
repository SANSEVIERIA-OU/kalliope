#!/usr/bin/env python3
"""Rifà i sottoinsiemi dei caratteri con `2-lingue-aspetto/prove/sottoinsiemi.py` (lo script di sempre, intatto) con una data fissa per famiglia.

Perché: le cinque famiglie passano da instantiateVariableFont e da TTFont.save, che scrivono nella tavola `head` la data e l'ora della corsa
(head.modified, e di conseguenza checkSumAdjustment): due corse identiche danno file diversi. fontTools rispetta SOURCE_DATE_EPOCH: qui la si
mette uguale alla data scritta nel file di design-system/caratteri/ della stessa famiglia, e così il confronto byte per byte dice soltanto
se cambiano i caratteri, non l'orologio.

Uso: venv/bin/python -I sottoinsiemi-datati.py vecchio|nuovo <cartella dei file scaricati> <uscita>
  vecchio = fontTools 4.63.0 e brotli 1.2.0 (~/.local, quelli di prima); nuovo = il venv di /workspace/kalliope/materiali-locali/playwright (4.68.0, 1.2.1).
L'uscita è una copia di design-system/caratteri/ con i file rifatti al posto di quelli di prima (il repository non si tocca)."""
import calendar, os, pathlib, shutil, subprocess, sys, time
from fontTools.ttLib import TTFont
from fontTools.misc.timeTools import epoch_diff

quale, src, uscita = sys.argv[1], pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3])
REPO = pathlib.Path('/workspace/kalliope')
SCRIPT = REPO / 'design/lavoro/2-lingue-aspetto/prove/sottoinsiemi.py'
CARATTERI = REPO / 'design-system/caratteri'
VENV = pathlib.Path('/workspace/kalliope/materiali-locali/playwright/venv/bin')
FAMIGLIE = {'readex-pro': 'ReadexPro-wght', 'geologica': 'Geologica-wght', 'noto-nastaliq-urdu': 'NotoNastaliqUrdu-wght',
            'noto-sans-devanagari': 'NotoSansDevanagari-wght', 'noto-sans-bengali': 'NotoSansBengali-wght'}
if quale == 'vecchio':
    py, env = ['python3', '-P'], {**os.environ, 'PATH': f'{pathlib.Path.home()}/.local/bin:' + os.environ['PATH']}
elif quale == 'nuovo':
    py, env = [str(VENV / 'python'), '-I'], {**os.environ, 'PATH': f'{VENV}:' + os.environ['PATH']}
else:
    sys.exit('vecchio o nuovo')
versione = subprocess.run(py + ['-c', 'import fontTools, brotli; from importlib.metadata import version; print("fontTools", fontTools.version, "brotli", version("brotli"))'], capture_output=True, text=True, env=env, check=True).stdout.strip()
print(quale, '→', versione)
if uscita.exists(): sys.exit(f'{uscita} esiste già')
shutil.copytree(CARATTERI, uscita)
for cartella, nome in FAMIGLIE.items():
    modificato = TTFont(CARATTERI / cartella / f'{nome}.woff2')['head'].modified
    epoca = modificato + epoch_diff   # secondi dal 1970, UTC
    lavoro = uscita.parent / f'{uscita.name}-lavoro-{cartella}'
    shutil.copytree(CARATTERI, lavoro)
    subprocess.run(py + [str(SCRIPT), str(src), str(lavoro)], env={**env, 'SOURCE_DATE_EPOCH': str(epoca)}, check=True, capture_output=True, cwd='/tmp')
    for f in (CARATTERI / cartella).glob('*.woff2'):
        shutil.copy2(lavoro / cartella / f.name, uscita / cartella / f.name)
    shutil.rmtree(lavoro)
    print(f'{cartella}: data fissata a {time.strftime("%d/%m/%Y %H:%M:%S", time.gmtime(epoca))} UTC')
