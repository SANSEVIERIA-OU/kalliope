// Serve una cartella su una porta e lancia un comando finché finisce, poi chiude il server (nessun lavoro in secondo piano).
// Uso: node con-server.mjs <cartella> <porta> -- <programma> [argomenti…]
// L'indirizzo del sito arriva al programma in ANTEPRIMA (es. http://127.0.0.1:8810/).
import {spawn} from 'node:child_process';
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
const [cartella, porta, sep, ...cmd] = process.argv.slice(2);
if (!cartella || !porta || sep !== '--' || !cmd.length) { console.error('Uso: node con-server.mjs <cartella> <porta> -- <programma> [argomenti…]'); process.exit(2); }
const server = await servi(cartella, {porta: +porta, fresco: true});
const figlio = spawn(cmd[0], cmd.slice(1), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: `http://127.0.0.1:${porta}/`}});
const codice = await new Promise(r => figlio.on('exit', c => r(c ?? 1)));
server.close();
process.exit(codice);
