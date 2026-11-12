# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Aiuti per scrivere le osservazioni di R20, R21, R22 (worker visita-3). Genera osservazioni/<ID>.json; poi si controlla con confronta-riferimenti.mjs --controlla.
import json
def o(car, amb, stato, valore=None, desc=None, ev=None, nm=None, motivo=None):
    d = {'caratteristica': car, 'ambito': amb, 'stato': stato}
    if valore is not None: d['valore'] = valore
    if nm: d['non_misurati'] = nm
    if desc: d['descrizione'] = desc
    if motivo: d['motivo'] = motivo
    d['evidenze'] = ev or []
    return d
def scrivi(percorso, rif):
    json.dump({'riferimenti': [rif]}, open(percorso, 'w'), ensure_ascii=False, indent=1)
