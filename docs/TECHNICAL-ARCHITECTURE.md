# Technical architecture

## Stack and why
- **Vite + React 18 + TypeScript** — small, fast, maintainable; no server. Next.js was not justified (there is no routing/SSR need and the offline double-click requirement favours a single bundle).
- **GSAP 3** (free) — deterministic, seekable timelines are the whole point: one global clock seeks per-chapter timelines, so playback, scrubbing and the MP4 renderer share one code path. Framer Motion was not added; CSS handles the few UI transitions.
- **Plain CSS with tokens** — no Tailwind runtime, no external stylesheet fetches.
- **Narration: Kokoro-82M via `kokoro-js`** (Apache-2.0 model, ONNX q8, CPU) generated offline at build time by `scripts/generate-narration.mjs`; the presentation itself ships only `.m4a` files and makes no runtime calls.
- **Fonts bundled from npm** (`@fontsource-variable/fraunces`, `@fontsource-variable/inter`) — no Google Fonts calls; offline-safe.
- **Build output**: single IIFE `assets/app.js` + `style.css` with relative paths and no `crossorigin` attributes, so `index.html` works from `file://` as well as any static server.

## Structure
```
src/
  app/        App (hash routes: #/ cinematic, #/read, #/presenter-view), Viewer (stage scaling, keys, hooks), EngineContext, useScene, useBroadcast
  timeline/   engine.ts (clock, transport, chapter state), fx.ts (motion vocabulary)
  audio/      narration.ts (per-chapter <audio>, autoplay fallback)
  scenes/     Chapter1..7.tsx — DOM + GSAP timeline builder per chapter
  components/ ui.tsx (design system), Controls (auto-hides while playing), Captions, StartScreen, PresenterView (second screen only), Simulation, ReadingMode
  content/    story.ts (chapters, notes, visuals), narration.json (script), narration-timing.json (generated), proposal.ts (Layer 2 facts), config.ts (contact, disclosure)
  styles/     tokens.css, global.css, scenes.css, reading.css
public/images, public/audio    generated assets (scripts/prepare-images.py, scripts/generate-narration.mjs)
scripts/      exports (offline, stills, pptx, pdf, video), static servers
tests/        unit (vitest), e2e (Playwright + axe)
docs/, exports/
```

## Engine contract
- `Engine.registerTimeline(id, tl)` — scenes register paused timelines; the engine seeks the active one each tick.
- Transport: `start`, `play`, `pause`, `toggle`, `restart`, `seek(t)`, `jumpTo(i)`, `next`, `prev`, `setNarration`, `setCaptions`.
- Automation: `window.__pathsense.{seek, state, total, chapters}` (used by tests and exporters). `?render=1` disables audio/rAF for frame-exact rendering; `?autostart=1&narration=0` for scripted runs; `?reduced=1` forces reduced motion; `?mode=presenter` opens notes.
- Second screen: `BroadcastChannel('pathsense-presenter')` mirrors state to `#/presenter-view` and accepts transport commands.

## Reliability choices
- No runtime network calls; all assets local (4.8 MB offline package).
- Images preloaded by being in the DOM from the start (hidden scenes), audio `preload=auto`.
- Audio is master clock only while actually playing; blocked autoplay degrades to the rAF clock with a toast.
- Deterministic durations: narration can never exceed its chapter (checked at module load and in tests).
- Memory: timelines are killed on unmount; one `<audio>` per chapter; no intervals.

## Exports
- `export-offline` → `exports/offline` (+ `serve.mjs`, `OPEN-ME.txt`)
- `export-stills` → 30 chapter stills (JPEG) + notes.json
- `export-pptx` → PPTX of stills with presenter notes (static)
- `export-pdf` → Chromium print of reading mode (text-based, A4)
- `export-video` → frame-by-frame 1080p24 MP4 with narration mixed at chapter offsets, plus an SRT subtitle file
