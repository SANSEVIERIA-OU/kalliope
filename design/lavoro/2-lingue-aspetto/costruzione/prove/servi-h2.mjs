// Un server di prova più vicino a quello vero (GitHub Pages): HTTP/2 su TLS (certificato di prova, fatto con openssl in /tmp/lavoro-2b-cert) e testo
// compresso con gzip. Il server di libreria (lib/servi.mjs) è HTTP/1.1 e non comprime: i fogli di stile pesano cinque volte, e le misure di
// caricamento a rete lenta danno un peso sbagliato ai caratteri, che sono già compressi. Stesse regole di libreria: solo 127.0.0.1, non esce dalla cartella.
import http2 from 'node:http2';
import {readFileSync, existsSync, statSync, createReadStream} from 'node:fs';
import {extname, join, resolve, sep} from 'node:path';
import {gzipSync} from 'node:zlib';
const TIPI = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.opus': 'audio/ogg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'};
const COMPRESSI = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt']);
const cache = new Map();
export function servi(radice, {porta = 0} = {}) {
  radice = resolve(radice);
  const cert = {key: readFileSync('/tmp/lavoro-2b-cert/key.pem'), cert: readFileSync('/tmp/lavoro-2b-cert/cert.pem'), allowHTTP1: true};
  const s = http2.createSecureServer(cert, (req, res) => {
    let f;
    try { f = resolve(join(radice, decodeURIComponent(new URL(req.url, 'http://x').pathname))); } catch { res.writeHead(400).end(); return; }
    if (f !== radice && !f.startsWith(radice + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f)) { res.writeHead(404).end(); return; }
    const ext = extname(f).toLowerCase(), tipo = TIPI[ext] || 'application/octet-stream';
    const base = {'content-type': tipo, 'cache-control': 'no-store'};
    if (COMPRESSI.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      const chiave = f + statSync(f).mtimeMs;
      if (!cache.has(chiave)) cache.set(chiave, gzipSync(readFileSync(f), {level: 6}));
      const dati = cache.get(chiave);
      res.writeHead(200, {...base, 'content-encoding': 'gzip', 'content-length': dati.length}); res.end(dati);
    } else {
      res.writeHead(200, {...base, 'content-length': statSync(f).size}); createReadStream(f).pipe(res);
    }
  });
  return new Promise((ok, no) => { s.once('error', no); s.listen(porta, '127.0.0.1', () => ok(s)); });
}
