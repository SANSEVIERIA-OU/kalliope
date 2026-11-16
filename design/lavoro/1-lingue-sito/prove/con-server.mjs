// Serve una cartella su una porta e lancia un comando mentre il server c'è (nessun lavoro in background da aspettare).
// Uso: node con-server.mjs <cartella> <porta> <comando> [argomenti…]   — il comando trova ANTEPRIMA=http://127.0.0.1:<porta>/
import {spawn} from 'node:child_process';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const [cartella, porta, ...comando] = process.argv.slice(2);
const server = await servi(cartella, {porta: +porta, fresco: true});
const figlio = spawn(comando[0], comando.slice(1), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: `http://127.0.0.1:${server.address().port}/`}});
const codice = await new Promise(ok => figlio.on('exit', c => ok(c ?? 1)));
server.close();
process.exit(codice);
