# Riassume gli esiti dell'albero finale in una tabella di numeri (da incollare in progresso.md): robustezza, catalogo, esami, dispositivi, lingue.
# Uso: python3 -I riassunto.py <nome albero, es. H4>
import pathlib, re, subprocess, sys
nome = sys.argv[1]
qui = pathlib.Path(__file__).resolve().parent
esiti = qui.parent / 'esiti'
def righe(f): return pathlib.Path(f).read_text(encoding='utf-8').splitlines()
out = []
out.append('### Robustezza (`prove/robustezza.mjs`)\n\n| Motore | Misura | Scenari | ok | NO |\n|---|---|---|---|---|')
for f in sorted(esiti.glob(f'robustezza-{nome}-*.txt')):
    r = righe(f); intest = r[0]
    ok = sum(1 for x in r if x.startswith('ok')); no = sum(1 for x in r if x.startswith('NO'))
    m = re.match(r'# robustezza · \S+ · (.+?) · (.+)', intest)
    sc = {x[3:].split(' · ')[0] for x in r if x.startswith('== ')}
    scenari = sorted({re.match(r'== (\S+) ·', x).group(1) for x in r if x.startswith('== ')})
    out.append(f'| {f.stem.replace(f"robustezza-{nome}-", "")} | | {", ".join(scenari)} | {ok} | {no} |')
out.append('\n### Catalogo\n')
for f in sorted(esiti.glob(f'catalogo-{nome}-*.txt')):
    r = righe(f); res = [x for x in r if re.match(r'\d+/\d+ ok', x)]
    out.append(f'- {f.stem.replace(f"catalogo-{nome}-", "")}: {res[-1] if res else "nessun esito"}')
out.append('\n### Esami dell\'impaginazione e dispositivi (casi, puliti, segnalazioni)\n')
for f in sorted(esiti.glob(f'{nome}-*esame*.txt')) + sorted(esiti.glob(f'{nome}-dispositivi*.txt')) + sorted(esiti.glob(f'{nome}-lingue-*.txt')):
    out.append('- ' + subprocess.run([sys.executable, '-I', str(qui / 'conta-casi.py'), str(f)], capture_output=True, text=True).stdout.strip())
print('\n'.join(out))
