# Palette stimata dai pixel di una schermata (STIMA VISIVA, non misura del DOM): ritaglia l'area dell'app,
# riduce a N colori con mediancut e scrive quota e colore. Uso: python3 -I palette.py <immagine> x,y,l,a <uscita.json> [N]
import json, sys
from PIL import Image
src, box, out = sys.argv[1], [int(v) for v in sys.argv[2].split(',')], sys.argv[3]
n = int(sys.argv[4]) if len(sys.argv) > 4 else 10
im = Image.open(src).convert('RGB')
x, y, w, h = box
im = im.crop((x, y, x + w, y + h))
q = im.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
pal = q.getpalette()[:n * 3]
conta = sorted(q.getcolors(), reverse=True)
tot = sum(c for c, _ in conta)
voci = [{"valore": '#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]), "quota": round(c / tot, 3)} for c, i in conta]
json.dump({"fonte": src, "ritaglio": box, "metodo": "stima da pixel (mediancut), non misura del DOM", "colori": voci}, open(out, 'w'), indent=1)
print(out, [(v['valore'], v['quota']) for v in voci[:6]])
