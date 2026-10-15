// Generates narration with Kokoro-82M (Apache-2.0 neural TTS, runs locally in Node via kokoro-js),
// one clip per subtitle line, then concatenates per chapter with ffmpeg and writes exact line timings
// to src/content/narration-timing.json. Chapter 1 gets a quiet synthetic room-tone bed under its lead-in.
// Honest status: synthesised speech, not a voice actor. Switch voices with NARRATION_VOICE=af_heart etc.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { KokoroTTS } from 'kokoro-js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const script = JSON.parse(readFileSync(path.join(root, 'src/content/narration.json'), 'utf8'));
const tmp = path.join(root, '.narration-tmp'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const out = path.join(root, 'public/audio'); mkdirSync(out, { recursive: true });
const voice = process.env.NARRATION_VOICE || 'bf_emma';
const speed = Number(process.env.NARRATION_SPEED || script.rate || 0.92);
const gap = script.gapSeconds ?? 0.55;
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'q8', device: 'cpu' });
if (!tts.voices[voice]) throw new Error(`unknown voice ${voice}; available: ${Object.keys(tts.voices).join(' ')}`);

const durationOf = (file) => { const m = execFileSync('afinfo', [file]).toString().match(/estimated duration: ([\d.]+) sec/); if (!m) throw new Error('no duration for ' + file); return parseFloat(m[1]); };
const trimmed = (f) => { const t = f.replace('.wav', '-t.wav'); execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', f, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse', t]); return t; };

const timing = { voice: `Kokoro-82M ${voice}`, speed, gapSeconds: gap, chapters: [] };
for (const ch of script.chapters) {
  const lead = ch.leadIn ?? 0.7;
  const parts = []; const lines = []; let t = lead;
  for (let i = 0; i < ch.lines.length; i++) {
    const text = ch.lines[i];
    const spoken = text.replace(/PathSense/g, 'Path Sense').replace(/café/g, 'cafe');
    const audio = await tts.generate(spoken, { voice, speed });
    const raw = path.join(tmp, `${ch.id}-${i}.wav`); await audio.save(raw);
    const f = trimmed(raw); const d = durationOf(f);
    lines.push({ text, start: +t.toFixed(2), end: +(t + d).toFixed(2) });
    parts.push({ f, d }); t += d + gap;
  }
  const total = t + 0.9;
  const args = ['-y', '-hide_banner', '-loglevel', 'error']; parts.forEach((p) => args.push('-i', p.f));
  let acc = lead; const delays = parts.map((p, i) => { const s = `[${i}:a]adelay=${Math.round(acc * 1000)}|${Math.round(acc * 1000)}[a${i}]`; acc += p.d + gap; return s; });
  let graph = delays.join(';') + ';' + parts.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${parts.length}:normalize=0:dropout_transition=0,apad=whole_dur=${total.toFixed(2)},loudnorm=I=-18:TP=-2:LRA=9[voice]`;
  const ambient = path.join(out, `ambient-${ch.id}.m4a`);
  if (existsSync(ambient)) { args.push('-i', ambient); graph += `;[${parts.length}:a]apad=whole_dur=${total.toFixed(2)},atrim=0:${total.toFixed(2)}[amb];[voice][amb]amix=inputs=2:normalize=0:dropout_transition=0[out]`; }
  else graph += ';[voice]anull[out]';
  args.push('-filter_complex', graph, '-map', '[out]', '-ar', '44100', '-ac', '1', '-c:a', 'aac', '-b:a', '112k', path.join(out, `${ch.id}.m4a`));
  execFileSync(ffmpeg, args, { stdio: 'inherit' });
  const final = durationOf(path.join(out, `${ch.id}.m4a`));
  timing.chapters.push({ id: ch.id, duration: +final.toFixed(2), lines });
  console.log(`${ch.id}: ${final.toFixed(1)}s (${ch.lines.length} lines)`);
}
writeFileSync(path.join(root, 'src/content/narration-timing.json'), JSON.stringify(timing, null, 2));
rmSync(tmp, { recursive: true, force: true });
console.log(`total narration: ${timing.chapters.reduce((a, c) => a + c.duration, 0).toFixed(1)}s, voice ${voice}, speed ${speed}`);
