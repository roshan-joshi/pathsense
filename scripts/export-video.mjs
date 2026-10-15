// Deterministic frame-by-frame MP4 render: seeks the timeline at a fixed frame rate, screenshots each frame,
// then muxes with the narration audio and burns captions (as a subtitle track) via ffmpeg.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { startStatic } from './lib-static-server.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FPS = Number(process.env.FPS || 24);
const CAPTIONS = process.env.CAPTIONS !== '0';
const outDir = path.join(root, 'exports/video'); mkdirSync(outDir, { recursive: true });
const frames = path.join(root, '.frames'); rmSync(frames, { recursive: true, force: true }); mkdirSync(frames);
const { url, close } = await startStatic(path.join(root, 'dist'), 4192);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${url}/?render=1&captions=${CAPTIONS ? 1 : 0}`);
await page.waitForFunction(() => window.__pathsense?.ready);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
const { total, chapters } = await page.evaluate(() => ({ total: window.__pathsense.total, chapters: window.__pathsense.chapters }));
const n = Math.ceil(total * FPS);
console.log(`rendering ${n} frames at ${FPS} fps (${total}s)`);
const stage = page.locator('.stage');
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  await page.evaluate((t) => window.__pathsense.seek(t), i / FPS);
  await stage.screenshot({ path: path.join(frames, `f${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
  if (i % (FPS * 10) === 0) process.stdout.write(`\r${i}/${n} frames (${((Date.now() - t0) / 1000).toFixed(0)}s)   `);
}
console.log('\nframes done');
await browser.close(); await close();
// Audio: concatenate chapter narration at chapter offsets
const timing = JSON.parse((await import('node:fs')).readFileSync(path.join(root, 'src/content/narration-timing.json'), 'utf8'));
const inputs = []; const filters = [];
chapters.forEach((c, i) => { inputs.push('-i', path.join(root, 'public/audio', `${c.id}.m4a`)); filters.push(`[${i + 1}:a]adelay=${Math.round(c.start * 1000)}|${Math.round(c.start * 1000)}[a${i}]`); });
const mix = chapters.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${chapters.length}:normalize=0:dropout_transition=0,apad=whole_dur=${total}[aout]`;
// Subtitles (SRT) from narration timing
const srt = []; let k = 1;
const ts = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60), ms = Math.round((s - Math.floor(s)) * 1000); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms).padStart(3, '0')}`; };
for (const c of chapters) { const t = timing.chapters.find((x) => x.id === c.id); for (const l of t.lines) srt.push(`${k++}\n${ts(c.start + l.start)} --> ${ts(c.start + l.end + 0.4)}\n${l.text}\n`); }
writeFileSync(path.join(outDir, 'PathSense-Home.srt'), srt.join('\n'));
const mp4 = path.join(outDir, 'PathSense-Home-1080p.mp4');
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.jpg'), ...inputs, '-filter_complex', filters.join(';') + ';' + mix, '-map', '0:v', '-map', '[aout]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
rmSync(frames, { recursive: true, force: true });
console.log(`MP4 -> ${mp4}`);
