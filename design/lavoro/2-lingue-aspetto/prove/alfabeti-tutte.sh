#!/bin/bash
# alfabeti-qa.mjs (skill) su ogni lingua di prova: la home della lingua, con le lettere della lingua (e l'inglese), una corsa per lingua.
# Uso: alfabeti-tutte.sh <sito costruito> <cartella di uscita> [lingue…]   (porta 8809; il server lo tiene su con-server.mjs dell'incarico 1)
set -uo pipefail
sito="${1:?sito}"; out="${2:?uscita}"; shift 2
lingue="${*:-it de fi el bg ar ur hi bn zh cs pl}"
SKILL=/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts
mkdir -p "$out"
for l in $lingue; do
  d="$out/$l"; mkdir -p "$d"
  cat > "$d/metodo.config.mjs" <<CFG
export default {
  base: process.env.ANTEPRIMA,
  pagine: [{nome: '$l', url: '$l/'}],
  lingue: ['$l'],
  alfabeti: {
    ar: 'ابتثجحخدذرزسشصضطظعغفقكلمنهويءآأؤإئةى٠١٢٣٤٥٦٧٨٩،؟',
    ur: 'ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہھءیے۔،؟',
    hi: 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञािीुूृेैोौंःँ्।',
    bn: 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎািীুূৃেৈোৌংঃঁ্০১২৩৪৫৬৭৮৯।',
    zh: '的一是不了人我在有他这中大来上国个到说们为子和你地出道也时年得就那要下以生会自着去之过家学对可她里后小么心多天而能好都然没日于起还发成事只作当想看文无开手十用主行方又如前所本见经头面公同三已老从动两长',
  },
  lingua: '$l',
  attesa: 2500,
};
CFG
  (cd "$d" && env -u DISPLAY -u WAYLAND_DISPLAY timeout 120 node /workspace/kalliope/design/lavoro/1-lingue-sito/prove/con-server.mjs "$sito" 8809 node $SKILL/alfabeti-qa.mjs > esito.txt 2>&1; echo "uscita $?" >> esito.txt)
  echo "== $l: $(tail -2 "$d/esito.txt" | tr '\n' ' ')"
done
