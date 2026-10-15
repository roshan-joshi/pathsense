// Serves a built folder ONLY under a URL prefix, like GitHub Pages project sites do.
// Everything outside the prefix is a 404, so any asset URL that ignores the base path fails loudly.
// Usage: node scripts/serve-pages-preview.mjs dist-pages /pathsense/ 4180
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const dir = path.resolve(process.argv[2] || 'dist-pages');
const prefix = (process.argv[3] || '/pathsense/').replace(/\/?$/, '/');
const port = Number(process.argv[4] || 4180);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.json': 'application/json' };
createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === prefix.slice(0, -1)) { res.writeHead(301, { Location: prefix }); return res.end(); }
  if (!url.startsWith(prefix)) { res.writeHead(404); return res.end('Not found (outside base path)'); }
  let rel = url.slice(prefix.length); if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  try {
    const file = path.join(dir, rel); if (!file.startsWith(dir)) throw new Error('forbidden');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': data.length, 'Accept-Ranges': 'none' }); res.end(data);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`serving ${dir} at http://127.0.0.1:${port}${prefix}`));
