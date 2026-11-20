# Scrive in design-system/metodo.config.mjs i limiti della frase premuta (uno per stato) dalle segnalazioni FUORI VISTA dell'esame sull'albero provato.
# Uso: python3 -I scrivi-limiti.py <file di esito dell'esame>… (stessi file di limiti-da-esito.py). Riscrive il blocco fra «limiti di installa» e «fine dei limiti di installa».
import pathlib, re, subprocess, sys
RADICE = pathlib.Path(__file__).resolve().parents[5]
qui = pathlib.Path(__file__).resolve().parent
uscita = subprocess.run([sys.executable, '-I', str(qui / 'limiti-da-esito.py'), *sys.argv[1:]], capture_output=True, text=True, check=True).stdout
voci = {}
for riga in uscita.splitlines():
    m = re.match(r'^(\S+)\s+FUORI VISTA\s+button\.frase-bottone\s+\d+ misure: (.+)$', riga)
    if m: voci[m.group(1)] = m.group(2).replace(',', ', ').replace(',  ', ', ')
perche = ("la frase premuta cambia la finestra: la finestra sta nello schermo, sotto la barra, e la frase premuta con lei dove ci stanno insieme; dove insieme non ci stanno vince ciò che il gesto "
          "ha aperto, cioè la finestra (regola della cornice, 3a-non-ancora/PIANO.md «La cornice», punto 2). Scritto dalla costruzione 3c-b, da confermare alla direzione, con le foto in 3c-installa/costruzione/foto/difetti/")
blocco = ["    // limiti di installa (3c-b): la frase premuta sotto il bordo dove con la finestra non ci sta (misure lette dall'esame, una voce per stato)"]
for stato in ('installa-frase', 'installa-frase-microfono', 'installa-frase-tolta'):
    if stato in voci:
        blocco.append(f"    {{pagina: '{stato}', misure: '{voci[stato]}', che: 'FUORI VISTA', cosa: 'button.frase-bottone',\n      perche: '{perche}'}},")
blocco.append("    // fine dei limiti di installa")
p = RADICE / 'design-system' / 'metodo.config.mjs'
t = p.read_text(encoding='utf-8')
if '// limiti di installa' in t:
    i = t.index('    // limiti di installa'); j = t.index('    // fine dei limiti di installa') + len('    // fine dei limiti di installa')
    t = t[:i] + '\n'.join(blocco) + t[j:]
else:
    # in coda all'elenco dei limiti: prima della sua chiusura «  ],» che segue l'ultimo limite di «stato»
    a = "  ],\n  // il testo che si legge e non si vede"
    assert t.count(a) == 1, 'non trovo la fine dei limiti'
    t = t.replace(a, '\n'.join(blocco) + '\n' + a)
p.write_text(t, encoding='utf-8')
print('\n'.join(blocco)[:600])
