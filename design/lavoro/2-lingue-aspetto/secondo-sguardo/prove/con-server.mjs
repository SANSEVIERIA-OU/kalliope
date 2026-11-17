// Serve una o più cartelle su porte fisse (8860–8869) e fa girare un comando; chiude i server quando il comando finisce.
// Uso: node con-server.mjs "8860=/cartella,8861=/altra" -- comando argomenti…
import {spawn} from 'node:child_process';
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
const i = process.argv.indexOf('--');
const coppie = process.argv[2].split(',').map(x => x.split('='));
const server = [];
for (const [porta, dir] of coppie) {
  if (+porta < 8860 || +porta > 8869) { console.error('porta fuori dal mio intervallo'); process.exit(2); }
  server.push(await servi(dir, {porta: +porta, fresco: true}));
}
const [cmd, ...args] = process.argv.slice(i + 1);
const figlio = spawn(cmd, args, {stdio: 'inherit', env: process.env});
figlio.on('exit', code => { for (const s of server) s.close(); process.exit(code ?? 1); });
