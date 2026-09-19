import http from 'node:http';
import { watch } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';

let built = await build();
let timer;
let building = false;
let pending = false;
async function rebuild() {
  if (building) { pending = true; return; }
  building = true;
  try { built = await build(); console.log('Rebuilt. Refresh the page to see changes.'); }
  catch (error) { console.error(error.message); }
  finally { building = false; if (pending) { pending = false; await rebuild(); } }
}
const watcher = watch(path.join(root, 'src'), { recursive: true }, () => {
  clearTimeout(timer); timer = setTimeout(rebuild, 80);
});
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535.');
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname !== '/' && pathname !== '/index.html') { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(request.method === 'HEAD' ? undefined : built.html);
});
server.listen(port, host, () => console.log(`The Last Light: http://${host}:${port}`));
server.on('error', error => { watcher.close(); console.error(error.message); process.exitCode = 1; });
process.on('SIGINT', () => { watcher.close(); server.close(); });
