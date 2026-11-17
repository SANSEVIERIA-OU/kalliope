import sys,json
for l in sys.stdin:
    try: r=json.loads(l)
    except Exception: print(l.strip()[:200]); continue
    n=r.get('nota')
    print(f"{r['misura']:>9} {r['stato']:<6} cornice {r['altezzaCornice']:>3} bolla {r['bolla']['top']:>6}..{r['bolla']['bottom']:<6} comando {r['comando']['top']:>6}..{r['comando']['bottom']:<6} nota {('%s..%s'%(n['top'],n['bottom'])) if n else '-':<10} richiesto {r['richiesto']:>6} disponibile {r['disponibile']:>4} {'INSIEME' if r['insieme'] else 'NO'}{' · messaggio in vista' if r.get('notaInVista') and r['stato']=='errore' else ''} · {r['etichetta']}")
