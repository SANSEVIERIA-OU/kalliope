// Serve due cartelle sulle porte 8968 e 8969 (le porte dell'incarico L-3) e lancia un comando finché finisce: «{A}» e «{B}» negli argomenti diventano i due indirizzi.
// Uso: node con-due-server.mjs <cartella A> <cartella B> -- <programma> [argomenti…]
import {spawn} from 'node:child_process';
const {servi} = await import(process.env.SKILL + '/scripts/lib/servi.mjs');
const [a, b, sep, ...cmd] = process.argv.slice(2);
if (!a || !b || sep !== '--' || !cmd.length) { console.error('Uso: node con-due-server.mjs <cartella A> <cartella B> -- <programma> [argomenti…]'); process.exit(2); }
const sa = await servi(a, {porta: 8968, fresco: true}), sb = await servi(b, {porta: 8969, fresco: true});
const figlio = spawn(cmd[0], cmd.slice(1).map(x => x.replaceAll('{A}', 'http://127.0.0.1:8968/').replaceAll('{B}', 'http://127.0.0.1:8969/')), {stdio: 'inherit', env: process.env});
const codice = await new Promise(r => figlio.on('exit', c => r(c ?? 1)));
sa.close(); sb.close();
process.exit(codice);
