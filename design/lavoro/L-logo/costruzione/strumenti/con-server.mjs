// Serve una cartella su una porta (8960–8969, quelle dell'incarico L-3) e lancia un comando finché finisce, poi chiude il server: nessun lavoro in
// secondo piano. Uso: node con-server.mjs <cartella> <porta> -- <programma> [argomenti…]
// L'indirizzo arriva al programma in ANTEPRIMA (es. http://127.0.0.1:8940/); «{U}» negli argomenti diventa l'indirizzo.
import {spawn} from 'node:child_process';
const {servi} = await import(process.env.SKILL + '/scripts/lib/servi.mjs');
const [cartella, porta, sep, ...cmd] = process.argv.slice(2);
if (!cartella || !porta || sep !== '--' || !cmd.length) { console.error('Uso: node con-server.mjs <cartella> <porta> -- <programma> [argomenti…]'); process.exit(2); }
if (+porta < 8960 || +porta > 8969) { console.error('Porte dell\'incarico: 8960–8969'); process.exit(2); }
const server = await servi(cartella, {porta: +porta, fresco: true});
const U = `http://127.0.0.1:${porta}/`;
const figlio = spawn(cmd[0], cmd.slice(1).map(a => a.replaceAll('{U}', U)), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: U}});
const codice = await new Promise(r => figlio.on('exit', c => r(c ?? 1)));
server.close();
process.exit(codice);
