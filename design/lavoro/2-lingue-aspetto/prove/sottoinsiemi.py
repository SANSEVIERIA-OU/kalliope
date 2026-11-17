#!/usr/bin/env python3
"""I caratteri delle scritture del sito, ridotti ai caratteri della scrittura, in woff2 (incarico 2, 17/11/2026).

    python3 sottoinsiemi.py <cartella dei file scaricati> <cartella design-system/caratteri>

I file di partenza sono quelli di github.com/google/fonts (ofl/<famiglia>/, licenza OFL 1.1), scaricati dal ramo main:
la commit e l'impronta di ognuno stanno in design-system/caratteri/LEGGIMI.md. Per ogni famiglia:
  · gli assi che il sistema non usa si fermano al valore predefinito (resta solo il peso, wght, variabile);
  · si tengono soltanto i caratteri della scrittura (le lettere latine, le cifre latine e la punteggiatura comune le
    disegna Lexend), con tutte le regole di composizione (forme legate, segni, forme locali come quelle bulgare);
  · (Lexend: il latino esteso, che il file «latino» del sistema non ha, in un file a parte; vedi sotto)
  · un secondo file, piccolissimo, ha soltanto le lettere dei nomi delle lingue (l'elenco delle lingue in ogni pagina e la
    pagina della scelta), così una pagina italiana che mostra «العربية» non scarica tutto l'arabo.
Serve fontTools con brotli (pyftsubset)."""
import json, pathlib, subprocess, sys, tempfile
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

src, dst = map(pathlib.Path, sys.argv[1:3])
NOMI = {l: v['nomeElenco'] for l, v in json.loads((pathlib.Path(__file__).resolve().parents[4] / 'tools/data/cldr.json').read_text())['lingue'].items()}
# famiglia: (file scaricato, cartella, nome del file, assi fermi, intervalli della scrittura, lingue dei nomi)
FAMIGLIE = {
    'readexpro': ('ReadexPro[HEXP,wght].ttf', 'readex-pro', 'ReadexPro-wght', {'HEXP': 0},
                  'U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+25CC', ['ar']),
    'notonastaliqurdu': ('NotoNastaliqUrdu[wght].ttf', 'noto-nastaliq-urdu', 'NotoNastaliqUrdu-wght', {},
                         'U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+25CC', ['ur']),
    'notosansdevanagari': ('NotoSansDevanagari[wdth,wght].ttf', 'noto-sans-devanagari', 'NotoSansDevanagari-wght', {'wdth': 100},
                           'U+0900-097F,U+1CD0-1CFF,U+A8E0-A8FF,U+200C-200D,U+20B9,U+25CC', ['hi']),
    'notosansbengali': ('NotoSansBengali[wdth,wght].ttf', 'noto-sans-bengali', 'NotoSansBengali-wght', {'wdth': 100},
                        'U+0980-09FF,U+0964-0965,U+200C-200D,U+25CC', ['bn']),
    'geologica': ('Geologica[CRSV,SHRP,slnt,wght].ttf', 'geologica', 'Geologica-wght', {'CRSV': 0, 'SHRP': 0, 'slnt': 0},
                  'U+0370-03FF,U+1F00-1FFF,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116', ['el', 'bg']),
}
# Lexend: il file del sistema (caratteri/lexend/Lexend-wght.ttf, già nel repository) ha il latino esteso che il sottoinsieme «latino» non
# ha (č š ž ł ő ų ș ț ħ…: cs sk pl hu lt lv ro hr sl mt et ga). Un secondo file per quelle lettere, che una pagina italiana non scarica,
# e un file piccolissimo con le sole lettere estese dei nomi delle lingue («Čeština», «lietuvių»…), per l'elenco delle lingue.
LEXEND = dst / 'lexend' / 'Lexend-wght.ttf'
LATINO_ESTESO = 'U+0100-024F,U+0259,U+02BB-02BC,U+02C7-02C8,U+02CC,U+02D8-02DD,U+0300-036F,U+1E00-1EFF'
latino = set(TTFont(dst / 'lexend' / 'Lexend-wght-latino.woff2').getBestCmap())
nomi_estesi = ''.join(sorted({c for l, n in NOMI.items() for c in n if ord(c) not in latino and (0x0100 <= ord(c) <= 0x024F or 0x1E00 <= ord(c) <= 0x1EFF)}))
comune_lexend = ['pyftsubset', str(LEXEND), '--flavor=woff2', '--layout-features=*', '--no-hinting', '--desubroutinize', '--name-IDs=0,1,2,3,4,5,6,13,14', '--notdef-outline']
subprocess.run(comune_lexend + [f'--unicodes={LATINO_ESTESO}', f'--output-file={dst / "lexend" / "Lexend-wght-latino-esteso.woff2"}'], check=True)
subprocess.run(comune_lexend + [f'--text={nomi_estesi}', f'--output-file={dst / "lexend" / "Lexend-wght-nomi.woff2"}'], check=True)
print(f'lexend: {(dst / "lexend" / "Lexend-wght-latino-esteso.woff2").stat().st_size} byte il latino esteso, {(dst / "lexend" / "Lexend-wght-nomi.woff2").stat().st_size} byte i nomi ({nomi_estesi})')
for fam, (file, cartella, nome, assi, intervalli, lingue) in FAMIGLIE.items():
    out = dst / cartella; out.mkdir(parents=True, exist_ok=True)
    f = TTFont(src / fam / file)
    if assi:
        f = instantiateVariableFont(f, assi)
    with tempfile.TemporaryDirectory() as t:
        fermo = pathlib.Path(t) / 'fermo.ttf'; f.save(fermo)
        comune = ['pyftsubset', str(fermo), '--flavor=woff2', '--layout-features=*', '--no-hinting', '--desubroutinize',
                  '--name-IDs=0,1,2,3,4,5,6,13,14', '--notdef-outline']
        subprocess.run(comune + [f'--unicodes={intervalli}', f'--output-file={out / (nome + ".woff2")}'], check=True)
        testo = ''.join(NOMI[l] for l in lingue)
        subprocess.run(comune + [f'--text={testo}', f'--output-file={out / (nome + "-nomi.woff2")}'], check=True)
    (out / 'OFL.txt').write_bytes((src / fam / 'OFL.txt').read_bytes())
    print(f'{cartella}: {(out / (nome + ".woff2")).stat().st_size} byte la scrittura, {(out / (nome + "-nomi.woff2")).stat().st_size} byte i nomi ({testo})')
