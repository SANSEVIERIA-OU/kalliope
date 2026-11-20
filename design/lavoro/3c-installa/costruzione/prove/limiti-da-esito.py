# Legge gli esiti dell'esame (esiti/*-esame-*.txt, *-frasi-*.txt) e raggruppa le segnalazioni: (stato, etichetta, cosa) -> misure: la base per i «limiti» di metodo.config.mjs.
# Uso: python3 -I limiti-da-esito.py file…
import re, sys, collections
ETICHETTE = ['COPERTO DOPO IL GESTO', 'FUORI VISTA', 'A CAPO NEL MEZZO', 'UNA PAROLA PER RIGA', 'NON APERTO', 'ERRORE IN VISTA', 'TAGLIATO SOTTO', 'TASTI SOPRA', 'SCORRE DI LATO', 'FERMO A METÀ',
             'LIMITE DICHIARATO', 'COMPOSIZIONE', 'TAGLIATO', 'SPEZZATA', 'COPERTO', 'STRETTO', 'FUORI', 'ESCE', 'SOPRA']
raggr = collections.defaultdict(set)
for f in sys.argv[1:]:
    pagina = misura = None
    for riga in open(f, encoding='utf-8'):
        m = re.match(r'^(\S+) · (\d+)×(\d+) · (.+?):', riga)
        if m: pagina, misura = m.group(1), f'{m.group(2)}x{m.group(3)}'; continue
        if pagina and riga.startswith('  '):
            r = riga.strip()
            che = next((e for e in ETICHETTE if r == e or r.startswith(e + ' ')), None)
            if che: raggr[(pagina, che, r[len(che):].strip().split(':')[0][:60])].add(misura)
for (pagina, che, cosa), mis in sorted(raggr.items()):
    ordine = sorted(mis, key=lambda s: tuple(map(int, s.split('x'))))
    print(f'{pagina:28} {che:20} {cosa:34} {len(ordine):3} misure: {", ".join(ordine)}')
