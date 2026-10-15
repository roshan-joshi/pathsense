// Builds the site and copies it to exports/offline with an OPEN-ME note. No network calls at runtime.
import { execSync } from 'node:child_process';
import { cpSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
execSync('npm run build', { cwd: root, stdio: 'inherit' });
const out = path.join(root, 'exports/offline');
rmSync(out, { recursive: true, force: true });
cpSync(path.join(root, 'dist'), out, { recursive: true });
cpSync(path.join(root, 'scripts/serve-offline.mjs'), path.join(out, 'serve.mjs'));
writeFileSync(path.join(out, 'OPEN-ME.txt'), `PathSense Home — offline presentation

Option 1 (simplest): double-click index.html. It opens in your default browser and works with Wi-Fi off.
Option 2 (recommended for Chrome/Edge/Firefox with strict file settings): open a terminal in this folder and run
    node serve.mjs . 8080
then visit http://127.0.0.1:8080/

Keys: Space play/pause · ← → chapters · 1–7 jump · F fullscreen · P presenter notes · M narration · C captions · T try the simulation · R restart
Reading mode: add #/read to the address.  Second-screen presenter view: add #/presenter-view in a second window.
`);
let total = 0; const walk = (d) => readdirSync(d).forEach((f) => { const p = path.join(d, f); statSync(p).isDirectory() ? walk(p) : (total += statSync(p).size); }); walk(out);
console.log(`offline package: ${out} (${(total / 1024 / 1024).toFixed(1)} MB)`);
