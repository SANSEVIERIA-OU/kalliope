#!/usr/bin/env python3 -I
"""Il sito di prova con le nove lingue VERE dell'incarico 2 (de fi el bg ar ur hi bn zh: traduzioni di prova di design/lavoro/2-lingue-aspetto/prova-lingue/), per provare il
selettore della lingua nella barra di «non ancora» con i nomi e le scritture vere. Le due frasi nuove della home (la variante «non di prova»: apertura.stato-stabile,
chiusura.fatti-stabile) mancano a quelle traduzioni: qui si ricavano, SOLO PER LA PROVA, togliendo da ogni frase la parola «di prova» (testi di prova, non rivisti).
Lavora in /tmp (copia di prova-lingue e dell'albero): non tocca prova-lingue/. Uso: python3 -I costruisci-lingue-vere.py <nome della corsa>"""
import pathlib, re, shutil, subprocess, sys
nome = sys.argv[1]
VIVO = pathlib.Path("/workspace/kalliope"); Q = VIVO / "design/lavoro/2-lingue-aspetto/prova-lingue"
base = pathlib.Path(f"/tmp/lavoro-3ar-vere-{nome}"); rad = base / "radice"; out = pathlib.Path(f"/tmp/lavoro-3ar-sito-V-{nome}")
if base.exists() or out.exists(): sys.exit(f"{base} o {out} esiste già: usa un altro nome")
qd = base / "x/y/z/prova-lingue"; shutil.copytree(Q, qd, ignore=shutil.ignore_patterns("__pycache__"))
for d in ("website", "design-system", "tools", "docs"): shutil.copytree(VIVO / d, rad / d, ignore=shutil.ignore_patterns("__pycache__"))
shutil.copytree(rad / "tools", base / "tools")   # crea_cataloghi.py cerca tools/ tre cartelle sopra di sé
# le parole «di prova» (prima del numero) di ogni lingua, tolte per ricavare la variante «non di prova»
TOGLI = {"de": [("Testversion", "Version")], "fi": [("testiversio", "versio"), ("Testiversio", "Versio")], "el": [("δοκιμαστική έκδοση", "έκδοση"), ("Δοκιμαστική έκδοση", "Έκδοση")],
         "bg": [("пробна версия", "версия"), ("Пробна версия", "Версия")], "ar": [("نسخة تجريبية", "نسخة")], "ur": [("آزمائشی ورژن", "ورژن"), ("آزمائشی ورژن", "ورژن")],
         "hi": [("परीक्षण संस्करण", "संस्करण")], "bn": [("পরীক্ষামূলক সংস্করণ", "সংস্করণ")], "zh": [("测试版", "版本")]}
for f in ("testi_europa.py", "testi_mondo.py"):
    t = (qd / f).read_text(encoding="utf-8")
    righe = t.split("\n"); nuove = []; lingua = None
    for r in righe:
        nuove.append(r)
        m = re.match(r"^([A-Z]{2}) = \{", r)
        if m: lingua = m.group(1).lower()
        k = re.match(r'^(\s*)"(apertura\.stato|chiusura\.fatti)": "(.*)",$', r)
        if k and lingua in TOGLI:
            v = k.group(3)
            for a, b in TOGLI[lingua]: v = v.replace(a, b)
            nuove.append(f'{k.group(1)}"{k.group(2)}-stabile": "{v}",')
    (qd / f).write_text("\n".join(nuove), encoding="utf-8")
subprocess.run([sys.executable, "-I", "crea_cataloghi.py", str(rad / "website")], cwd=qd, check=True)
for po in qd.glob("*.po"): shutil.copy(po, rad / "website/lingue" / po.name)
subprocess.run([sys.executable, "-I", str(rad / "tools/translations.py"), "check", "--website", str(rad / "website"), "--complete"], check=True)
r = subprocess.run([sys.executable, "-I", str(rad / "tools/site.py"), "--out", str(out), "--release-json", "/tmp/lavoro-3ar-releases.json"], capture_output=True, text=True)
print(r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[-400:]); sys.exit(r.returncode)
