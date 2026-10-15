import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.json': 'application/json' };
export function startStatic(dir, port) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent((req.url || '/').split('?')[0]); if (p.endsWith('/')) p += 'index.html';
        const data = await readFile(path.join(dir, p));
        res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); res.end(data);
      } catch { res.writeHead(404); res.end(); }
    }).listen(port, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) }));
  });
}
