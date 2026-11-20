# Conta i casi di un esito dell'esame o dei dispositivi: casi, puliti, con segnalazioni, limiti dichiarati. Uso: python3 -I conta.py file…
import re, sys
for f in sys.argv[1:]:
    casi = puliti = limiti = saltati = assenti = 0; segn = {}
    cur = None
    for riga in open(f, encoding='utf-8'):
        if re.match(r'^\S+ · \d+×\d+ · .+:', riga):
            casi += 1; cur = riga
            if riga.rstrip().endswith('pulito'): puliti += 1
            elif riga.rstrip().endswith('lo stato non c\'è a questa misura'): assenti += 1
            continue
        d = re.match(r'^(\d+) casi puliti', riga)   # l'ultima riga di dispositivi-qa.mjs: i casi del giro, tutti puliti
        if d and not casi: casi = puliti = int(d.group(1)); continue
        m = re.match(r'^  (LIMITE DICHIARATO|SALTATO|[A-ZÀÈÌÒÙ ]+?) ', riga)
        if m:
            if m.group(1).startswith('LIMITE'): limiti += 1
            elif m.group(1).startswith('SALTATO'): saltati += 1
            else: segn[m.group(1)] = segn.get(m.group(1), 0) + 1
    print(f'{f.split("/")[-1]}: {casi} casi, {puliti} puliti, segnalazioni {segn or "nessuna"}, limiti dichiarati {limiti}, saltati {saltati}, stato assente a quella misura {assenti}')
