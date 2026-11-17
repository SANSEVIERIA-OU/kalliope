// Serve una o più cartelle su porte fisse (8890–8899) e fa girare un comando finché finisce; poi chiude i server (nessun lavoro in secondo piano).
// Uso: node con-server.mjs "8890=/cartella,8891=/altra" -- comando argomenti…   Nel comando: SERVER1, SERVER2… = http://127.0.0.1:<porta>/
import {spawn} from 'node:child_process';
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
const i = process.argv.indexOf('--');
const coppie = process.argv[2].split(',').map(x => x.split('='));
const server = [], env = {...process.env};
for (const [n, [porta, dir]] of coppie.entries()) {
  if (+porta < 8890 || +porta > 8899) { console.error('porta fuori dal mio intervallo'); process.exit(2); }
  server.push(await servi(dir, {porta: +porta, fresco: true}));
  env[`SERVER${n + 1}`] = `http://127.0.0.1:${porta}/`; if (!n) env.ANTEPRIMA = env.SERVER1;   // il primo sito è anche l'indirizzo per gli strumenti della skill (ANTEPRIMA)
}
const [cmd, ...args] = process.argv.slice(i + 1);
const figlio = spawn(cmd, args, {stdio: 'inherit', env});
figlio.on('exit', code => { for (const s of server) s.close(); process.exit(code ?? 1); });
