// Captures one 1920x1080 still per chapter key moment from the deterministic timeline (used by the PPTX export).
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { startStatic } from './lib-static-server.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'exports/stills'); mkdirSync(out, { recursive: true });
const MOMENTS = [
  ['ch1', 'A life built around cooking', [2.5, 10, 19, 32]],
  ['ch2', 'The tasks that matter', [14, 21, 33, 38]],
  ['ch3', 'The first solution: find the coffee', [4.5, 14, 20.5, 26, 30, 42, 52]],
  ['ch4', 'A home that can provide useful information', [3, 9.5, 28, 41]],
  ['ch5', 'Personal to every individual', [8, 20, 31]],
  ['ch6', 'Does it truly work?', [4, 16, 29, 36]],
  ['ch7', 'One home. Many futures.', [4, 19, 34, 48]],
];
const { url, close } = await startStatic(path.join(root, 'dist'), 4190);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${url}/?render=1`);
await page.waitForFunction(() => window.__pathsense?.ready);
await page.evaluate(() => document.fonts.ready);
const chapters = await page.evaluate(() => window.__pathsense.chapters);
const index = [];
for (const [id, title, locals] of MOMENTS) {
  const ch = chapters.find((c) => c.id === id);
  for (const local of locals) {
    await page.evaluate((t) => window.__pathsense.seek(t), ch.start + local);
    await page.waitForTimeout(120);
    const file = `${id}-${String(local).replace('.', '_')}.jpg`;
    await page.locator('.stage').screenshot({ path: path.join(out, file), type: 'jpeg', quality: 90 });
    index.push({ id, title, local, file });
  }
}
writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 2));
writeFileSync(path.join(out, 'notes.json'), JSON.stringify(chapters, null, 2));
await browser.close(); await close();
console.log(`${index.length} stills -> ${out}`);
