// Serve una cartella su una porta e lancia un comando finché finisce, poi chiude il server (nessun lavoro in secondo piano).
// Uso: node con-server.mjs <porta>=<cartella> -- <programma> [argomenti…]     (l'indirizzo del sito arriva al programma in ANTEPRIMA)
import {spawn} from 'node:child_process';
const {servi} = await import(process.env.SKILL + '/scripts/lib/servi.mjs');
const [spec, sep, ...cmd] = process.argv.slice(2);
const [porta, cartella] = (spec || '').split('=');
if (!cartella || !porta || sep !== '--' || !cmd.length) { console.error('Uso: node con-server.mjs <porta>=<cartella> -- <programma> [argomenti…]'); process.exit(2); }
const server = await servi(cartella, {porta: +porta, fresco: true});
const figlio = spawn(cmd[0], cmd.slice(1), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: `http://127.0.0.1:${porta}/`}});
const codice = await new Promise(r => figlio.on('exit', c => r(c ?? 1)));
server.close();
process.exit(codice);
