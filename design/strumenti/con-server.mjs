/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Serve una cartella costruita con un server statico (solo 127.0.0.1), lancia un comando con ANTEPRIMA=<indirizzo> e chiude il server
// quando il comando finisce: nessun server resta acceso. Come GitHub Pages: un indirizzo mancante dà 404.html con stato 404.
// Uso: node con-server.mjs /tmp/kalliope-anteprima/1 node altro-script.mjs ...   (la cartella contiene «kalliope/», il sito sotto /kalliope/)
import http from 'node:http';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {join, extname, normalize} from 'node:path';
const [radice, ...comando] = process.argv.slice(2);
const TIPI = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'};
function risolvi(p) {
  let f = normalize(join(radice, decodeURIComponent(p.split('?')[0].split('#')[0])));
  if (!f.startsWith(normalize(radice))) return null;
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  return existsSync(f) && statSync(f).isFile() ? f : null;
}
const server = http.createServer((req, res) => {
  const f = risolvi(req.url);
  if (f) {
    const dati = readFileSync(f);
    // Range per l'audio (come Pages): i browser lo chiedono per riprodurre e cercare
    const r = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
    if (r) {
      const da = +r[1], a = r[2] ? +r[2] : dati.length - 1;
      res.writeHead(206, {'content-type': TIPI[extname(f)] || 'application/octet-stream', 'content-range': `bytes ${da}-${a}/${dati.length}`, 'accept-ranges': 'bytes', 'content-length': a - da + 1});
      res.end(dati.subarray(da, a + 1));
    } else {
      res.writeHead(200, {'content-type': TIPI[extname(f)] || 'application/octet-stream', 'accept-ranges': 'bytes', 'content-length': dati.length});
      res.end(dati);
    }
  } else {
    const m = join(radice, 'kalliope', '404.html');
    res.writeHead(404, {'content-type': 'text/html; charset=utf-8'});
    res.end(existsSync(m) ? readFileSync(m) : 'non trovato');
  }
});
server.listen(0, '127.0.0.1', () => {
  const indirizzo = `http://127.0.0.1:${server.address().port}/kalliope/`;
  const figlio = spawn(comando[0], comando.slice(1), {stdio: 'inherit', env: {...process.env, ANTEPRIMA: indirizzo}});
  figlio.on('exit', codice => { server.close(); process.exit(codice ?? 1); });
});
