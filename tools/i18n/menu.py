# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The entry of the applications menu (packaging/linux/<id>.desktop.in): its messages for the one catalogue, and the desktop file
written from it in every language (tools/menu.py, docs/translating.md, «The program»).

    GenericName=@tr("programma.menu.genere" => "Voce per le videochiamate")

is a message with the key `programma.menu.genere` and the Italian text; `# TRANSLATORS: …` on the line above goes to the
translators. The desktop file has `GenericName=` in English (the default of the Desktop Entry Specification), `GenericName[it]=`
in Italian and `GenericName[xx]=` in every language whose entry is translated and not fuzzy, one line per language, in the order
of the codes. A language is written with its code alone (`pt`, `zh`): the desktop matches `pt_BR` and `zh_TW` to it, as the program
does. Only the Python standard library.
"""
import pathlib
import re

from . import app

CARTELLA = pathlib.Path("packaging") / "linux"   # relativa alla radice del repository
RIGA = re.compile(r'^([A-Za-z0-9-]+)=@tr\(\s*"([^"]*)"\s*=>\s*"([^"]*)"\s*\)\s*$')
NOTA = re.compile(r"^#\s*TRANSLATORS:\s*(.*)$")
INGLESE = "en"
SORGENTE = "it"
# Desktop Entry Specification, «Possible value types»: \s \n \t \r \\ are escapes, and in a list «;» separates; a translation
# writes none of them, nor any other control character
VIETATI = re.compile(r"[\\\x00-\x1f\x7f]")


class ErroreMenu(Exception):
    pass


def modelli(radice):
    """I modelli della voce del menu sotto `radice` (la radice del repository): packaging/linux/*.desktop.in."""
    cartella = pathlib.Path(radice) / CARTELLA
    return sorted(cartella.glob("*.desktop.in")) if cartella.is_dir() else []


def leggi(testo, nome):
    """([riga: str | (campo, chiave)], {chiave: MessaggioApp}, errori) di un modello."""
    righe, messaggi, errori, nota = [], {}, [], None
    for n, riga in enumerate(testo.splitlines(), 1):
        m = NOTA.match(riga)
        if m:
            nota = m.group(1).strip()
            righe.append(riga)
            continue
        m = RIGA.match(riga)
        if m:
            campo, chiave, italiano = m.groups()
            if not app.CHIAVE.match(chiave) or not chiave.startswith("programma.menu."):
                errori.append(f"{nome}:{n}: the key «{chiave}» must start with programma.menu.")
            elif chiave in messaggi:
                errori.append(f"{nome}:{n}: the key «{chiave}» is there twice")
            else:
                if app.segnaposto(italiano):
                    errori.append(f"{nome}:{n}: «{italiano}» has placeholders: the menu has no arguments")
                if VIETATI.search(italiano):
                    errori.append(f"{nome}:{n}: «{italiano}» has a backslash or a control character")
                messaggi[chiave] = app.MessaggioApp(chiave=chiave, testo=italiano, pagina=nome, riga=n, nota=nota, formato="desktop",
                                                    usi={nome})
                righe.append((campo, chiave))
            nota = None
            continue
        if "@tr" in riga and not riga.startswith("#"):
            errori.append(f"{nome}:{n}: a line with @tr that is not «Key=@tr(\"programma.menu.KEY\" => \"text\")»")
        if riga.strip() and not riga.startswith("#"):
            nota = None
        righe.append(riga)
    return righe, messaggi, errori


def raccogli(radice):
    """({chiave: MessaggioApp}, errori) dei modelli sotto `radice`, con il nome del file relativo alla radice."""
    tutti, errori = {}, []
    for f in modelli(radice):
        nome = f.relative_to(radice).as_posix()
        _, msgs, err = leggi(f.read_text(encoding="utf-8"), nome)
        errori.extend(err)
        for chiave, m in msgs.items():
            if chiave in tutti:
                errori.append(f"{nome}:{m.riga}: the key «{chiave}» is in {tutti[chiave].pagina} too")
            else:
                tutti[chiave] = m
    return tutti, errori


def lista(testo):
    """Un valore di tipo lista (Keywords) finisce con «;» e non ha voci vuote."""
    return testo.endswith(";")


def controlla_testo(voce, tradotto):
    """Gli errori di una traduzione di una riga del menu (una voce del modello con il flag kalliope-desktop)."""
    out = []
    if VIETATI.search(tradotto):
        out.append(f"{voce.ctx}: a backslash, a line break or a control character: the desktop file cannot hold it")
    if app.segnaposto(tradotto):
        out.append(f"{voce.ctx}: placeholders the original does not have: the menu has no arguments")
    if tradotto != tradotto.strip():
        out.append(f"{voce.ctx}: spaces at the start or at the end")
    if lista(voce.id):
        parti = tradotto[:-1].split(";") if tradotto.endswith(";") else None
        if parti is None:
            out.append(f"{voce.ctx}: a list of words ends with «;», as the original does")
        elif any(not p.strip() for p in parti):
            out.append(f"{voce.ctx}: an empty word in the list («;;», or «;» at the start)")
        elif any(p != p.strip() for p in parti):
            out.append(f"{voce.ctx}: spaces around «;»")
    elif ";" in tradotto:
        out.append(f"{voce.ctx}: «;» in a text that is not a list")
    return out


def scrivi(modello, nome, traduzioni):
    """Il file .desktop dal testo del modello `nome` e da `traduzioni` = {lingua: {chiave: testo pronto}} (l'italiano escluso):
    le righe dei messaggi diventano Key= (inglese, o l'italiano dove l'inglese manca), Key[it]= e Key[xx]=."""
    righe, messaggi, errori = leggi(modello, nome)
    if errori:
        raise ErroreMenu("\n".join(errori))
    out = ["# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1",
           f"# Written by tools/menu.py from {pathlib.PurePosixPath(nome).name} and the catalogue (website/lingue): do not edit by hand."]
    intestazione = True
    for riga in righe:
        if isinstance(riga, str):
            # i commenti del modello prima di [Desktop Entry] dicono come si scrive il modello, i TRANSLATORS sono per il catalogo
            if riga.startswith("#"):
                continue
            intestazione = intestazione and not riga.startswith("[")
            if not intestazione:
                out.append(riga)
            continue
        campo, chiave = riga
        italiano = messaggi[chiave].testo
        out.append(f"{campo}={traduzioni.get(INGLESE, {}).get(chiave, italiano)}")
        lingue = {SORGENTE: italiano} | {c: t[chiave] for c, t in traduzioni.items() if c != INGLESE and chiave in t}
        out.extend(f"{campo}[{c}]={lingue[c]}" for c in sorted(lingue))
    return "\n".join(out) + "\n"
