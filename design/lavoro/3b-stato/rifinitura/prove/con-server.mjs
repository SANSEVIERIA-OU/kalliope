// Serve una o più cartelle su porte fisse (8910–8919) e fa girare un comando finché finisce; poi chiude i server (nessun lavoro in secondo piano).
// Uso: node con-server.mjs "8910=/cartella,8911=/altra" -- comando argomenti…   Nel comando: SERVER1, SERVER2… = http://127.0.0.1:<porta>/ ; ANTEPRIMA = SERVER1
import {spawn} from 'node:child_process';
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
const i = process.argv.indexOf('--');
const coppie = process.argv[2].split(',').map(x => x.split('='));
const server = [], env = {...process.env};
for (const [n, [porta, dir]] of coppie.entries()) {
  if (+porta < 8910 || +porta > 8919) { console.error('porta fuori dal mio intervallo (8910-8919)'); process.exit(2); }
  server.push(await servi(dir, {porta: +porta, fresco: true}));
  env[`SERVER${n + 1}`] = `http://127.0.0.1:${porta}/`; if (!n) env.ANTEPRIMA = env.SERVER1;
}
const [cmd, ...args] = process.argv.slice(i + 1);
const figlio = spawn(cmd, args, {stdio: 'inherit', env});
figlio.on('exit', code => { for (const s of server) s.close(); process.exit(code ?? 1); });
