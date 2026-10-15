// Builds a PPTX from scene stills + presenter notes. Static: it does not reproduce web animation or interaction.
import pptxgen from 'pptxgenjs';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const stills = JSON.parse(readFileSync(path.join(root, 'exports/stills/index.json'), 'utf8'));
const timing = JSON.parse(readFileSync(path.join(root, 'src/content/narration-timing.json'), 'utf8'));
// Presenter notes live in src/content/story.ts (TypeScript). Extract them with a light regex-free approach: evaluate the built notes JSON instead.
const notes = JSON.parse(readFileSync(path.join(root, 'exports/stills/notes.json'), 'utf8'));
mkdirSync(path.join(root, 'exports/pptx'), { recursive: true });
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; pptx.title = 'PathSense Home — proposal'; pptx.author = 'PathSense Home';
const title = pptx.addSlide(); title.background = { color: '15130F' };
title.addText('PathSense Home', { x: 0.6, y: 1.6, w: 8.8, h: 1, fontSize: 44, color: 'F4ECE0', fontFace: 'Georgia' });
title.addText('Independence, one meaningful task at a time.', { x: 0.6, y: 2.6, w: 8.8, h: 0.6, fontSize: 20, color: 'C9A054' });
title.addText('Static export of the cinematic presentation. Illustrative story. Character and scenes are fictional representations inspired by real accessibility needs. Proposed capabilities are conceptual unless otherwise identified.', { x: 0.6, y: 4.3, w: 8.8, h: 0.8, fontSize: 11, color: 'A99E8D' });
title.addNotes('This PPTX is a still-image export. The animated web version (exports/offline/index.html) is the primary presentation. Chapter notes follow on each slide.');
let lastId = null;
for (const s of stills) {
  const slide = pptx.addSlide(); slide.background = { color: '000000' };
  slide.addImage({ path: path.join(root, 'exports/stills', s.file), x: 0, y: 0, w: 10, h: 5.625 });
  const ch = notes.find((n) => n.id === s.id);
  const t = timing.chapters.find((c) => c.id === s.id);
  const line = t.lines.find((l) => s.local >= l.start - 0.2 && s.local < l.end + 0.6);
  const noteText = (s.id !== lastId ? `${ch.number} · ${ch.title}\n\n${ch.notes.join('\n')}\n\n` : '') + (line ? `Narration at this moment: ${line.text}` : '');
  slide.addNotes(noteText);
  lastId = s.id;
}
const end = pptx.addSlide(); end.background = { color: '15130F' };
end.addText('Partner with us to validate the first real-world prototype.', { x: 0.6, y: 2.2, w: 8.8, h: 1, fontSize: 26, color: 'F4ECE0', fontFace: 'Georgia' });
end.addText('Co-design · Accessibility and rehabilitation expertise · Feasibility prototype testing · Funding or funding-partner support', { x: 0.6, y: 3.3, w: 8.8, h: 0.8, fontSize: 14, color: 'C9A054' });
await pptx.writeFile({ fileName: path.join(root, 'exports/pptx/PathSense-Home-Presentation.pptx') });
console.log('PPTX -> exports/pptx/PathSense-Home-Presentation.pptx');
