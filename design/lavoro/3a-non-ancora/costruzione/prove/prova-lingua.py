# La pagina «non ancora» in una lingua con un .po completo: si avvia un catalogo (translations.py new), lo si riempie con una «traduzione» che
# cambia il testo (il testo italiano preceduto dal codice della lingua: i tag e i segnaposto restano com'erano), lo si controlla con --complete e si
# costruisce il sito. Dice se la pagina c'è in quella lingua e se tutti i testi sono cambiati (nessuno è rimasto italiano).
# Uso: python3 -I prova-lingua.py <radice-di-lavoro> <uscita-del-sito> <codice[,codice…]>
import pathlib, shutil, subprocess, sys, re
radice, uscita, codici = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3].split(',')
copia = pathlib.Path('/tmp/lavoro-3ab-lavoro/radice-lingue')
if copia.exists():
    shutil.copytree(radice, copia / '_', dirs_exist_ok=True) if False else None
else:
    shutil.copytree(radice, copia)
for sub in ('website', 'design-system', 'tools'):   # la copia segue la radice (ai file di questo incarico, e agli altri della base)
    shutil.copytree(radice / sub, copia / sub, dirs_exist_ok=True)
sys.path.insert(0, str(copia / 'tools'))
from i18n import po
def run(*a):
    r = subprocess.run([sys.executable, '-I', str(copia / 'tools' / a[0]), *a[1:]], capture_output=True, text=True, cwd=copia)
    return r.returncode, (r.stdout + r.stderr).strip()
for c in codici:
    f = copia / 'website' / 'lingue' / f'{c}.po'
    if f.exists(): f.unlink()
    print(run('translations.py', 'new', c)[1])
    cat = po.leggi(f.read_text(encoding='utf-8'))
    for v in cat.voci:
        if v.obsoleta: continue
        if v.id_plurale is not None:
            v.str = [f'[{c}] {v.id if k == 0 else v.id_plurale}' for k in range(len(v.str) or 1)]
        else:
            v.str = [f'[{c}] ' + v.id]
    f.write_text(po.scrivi(cat), encoding='utf-8')
    rc, out = run('translations.py', 'check', c, '--complete'); print(f'check {c} --complete: exit {rc} · {out.splitlines()[-1] if out else ""}')
rc, out = run('site.py', '--out', str(uscita), '--release-json', '/tmp/lavoro-3ab-releases.json')
print(out.splitlines()[-1])
for c in codici:
    p = uscita / c / 'non-ancora' / 'index.html'
    if not p.exists(): print(f'NO: manca {p}'); continue
    h = p.read_text(encoding='utf-8')
    ancora = [m for m in re.findall(r'>([^<>]{12,})<', h) if not m.startswith(f'[{c}]') and re.search(r'[a-zàèéìòù]{4}', m) and not m.startswith('{') and 'Giulia' not in m and 'Kalliope' not in m and 'Italiano' not in m]
    print(f'{c}: la pagina c\'è, lang={re.search(r"<html[^>]*lang=\"([^\"]+)\"", h).group(1)}, dir={re.search(r"dir=\"([^\"]+)\"", h).group(1) if "dir=" in h.split(">",3)[2] or True else ""}; testi non cambiati: {len(ancora)}')
    for m in ancora[:8]: print('   ancora in italiano:', m[:90])
