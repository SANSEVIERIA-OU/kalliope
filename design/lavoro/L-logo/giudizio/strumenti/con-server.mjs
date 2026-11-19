// Serve una cartella su una porta 8950–8959 finché un comando finisce. Uso: node con-server.mjs <cartella> <porta> -- <programma> [argomenti…]  («{U}» = indirizzo)
import {spawn} from 'node:child_process';
const {servi} = await import(process.env.SKILL + '/scripts/lib/servi.mjs');
const [cartella, porta, sep, ...cmd] = process.argv.slice(2);
if (!cartella || sep !== '--' || !cmd.length || +porta < 8950 || +porta > 8959) { console.error('Uso: node con-server.mjs <cartella> <8950-8959> -- <comando>'); process.exit(2); }
const server = await servi(cartella, {porta: +porta, fresco: true});
const U = `http://127.0.0.1:${porta}/`;
const figlio = spawn(cmd[0], cmd.slice(1).map(a => a.replaceAll('{U}', U)), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: U}});
const codice = await new Promise(r => figlio.on('exit', c => r(c ?? 1)));
server.close(); process.exit(codice);
