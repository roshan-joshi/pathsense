# PathSense Home — cinematic presentation

A five-minute (5:17), seven-chapter animated web presentation proposing **PathSense Home**: a personalised AI task-assistance platform to be co-designed with an Australian organisation supporting people who are blind or have low vision. *Independence, one meaningful task at a time.*

> **Illustrative story.** The main character, a former café owner, is **fictional**. Character and scenes are AI-generated representations inspired by real accessibility needs. They do not depict any real person. All product capabilities shown are proposed or simulated; nothing here is a validated product, and no pilot results exist.

This repository is for **collaborative review**. It is not deployed anywhere.

## Run it locally

Requirements: Node.js 20 or later (developed on 22) and npm.

```bash
npm install
npm run dev          # http://localhost:5173/
```

Click **Play the story** (a click is required so the browser allows sound). For a production-style run:

```bash
npm run build
npm run preview      # http://localhost:4173/
```

To make a self-contained folder that opens by double-click and works offline (writes to `exports/offline/`, which is git-ignored):

```bash
npm run export:offline
```

## Hosting on GitHub Pages

`.github/workflows/pages.yml` type-checks, unit-tests, builds with `VITE_BASE=/pathsense/` and publishes **only `dist/`** (the static site: HTML, JS, CSS, fonts, images, narration audio) to GitHub Pages at `https://roshan-joshi.github.io/pathsense/`. Source code, docs, tests, backups and exports are never published. The page carries `noindex` so search engines are asked not to list it.

One-time setup (repository owner): *Settings → Pages → Build and deployment → Source: GitHub Actions*. Pages is not enabled by pushing code.

Test the exact production layout locally (site served only under `/pathsense/`, root is 404):

```bash
npm run test:pages     # builds to dist-pages/ and runs all end-to-end tests under /pathsense/
```

The default `npm run build` uses relative paths, so the offline package still works from a double-click.

## Modes

| Mode | How to open | What it is |
| --- | --- | --- |
| **Cinematic auto-play** | default | All seven chapters end to end, narration and synchronised captions. Controls and cursor auto-hide after a few seconds while playing. |
| **Silent story** | untick "Narration" on the start screen, or press M | Every essential idea is on screen as text; captions optional (C). |
| **Accessible reading mode** | `#/read`, the Read button, or the skip link | Structured text: story, descriptions of the visuals, full transcript, proposed capabilities, safety and privacy commitments, partnership request, funding-appendix placeholders. No animation needed. |
| **Presenter second screen** | `#/presenter-view` in a separate window | Notes, timer and transport controls for the presenter's own screen. Notes are **never** shown in the audience-facing window. |

Keyboard: Space play/pause · ← → chapters · 1–7 jump · F fullscreen · M narration · C captions · T "Try the proposed experience" (clearly labelled simulation) · R restart · Esc close dialogs.

URL parameters for automation and review: `?autostart=1`, `?narration=0`, `?captions=0`, `?reduced=1`, `?render=1` (frame-exact timeline hook used by tests and exporters).

## The seven chapters

1. A life built around familiarity (opens from black, sound first)
2. Everyday home tasks that matter
3. PathSense helps find coffee (the central, simulated demonstration)
4. Three stages of PathSense: mobile camera → one room camera → multiple home cameras
5. Personalised assistance
6. How we prove it truly helps (co-design and evaluation, no results claimed)
7. One home, many futures (the partnership request)

## Accessibility

Target: WCAG 2.2 AA for applicable content.

- Keyboard operation, visible focus, a skip link to reading mode, native buttons with labels, `aria-pressed` / `aria-current` states.
- Timed captions plus a polite live region; a complete transcript and visual descriptions in reading mode.
- Reduced motion respected (`prefers-reduced-motion`): movement collapses to fades.
- Contrast: warm cream on charcoal; tested colour tokens are in `src/styles/tokens.css`.
- Automated: axe-core (WCAG 2A/AA/2.2 AA) reports 0 violations on the start screen and reading mode. **Not yet done:** manual VoiceOver / NVDA testing, Safari and Firefox testing. See `docs/ACCESSIBILITY-PLAN.md`.

## Honesty and safety

PathSense is a proposal. The coffee-finding flow, the interactive overlay, the co-design session and the final outcome are simulations or conceptual and are labelled on screen. Stage 2 and 3 cameras are future research. The presentation does not claim hazard detection, safe movement, gas or boiling-water supervision, or replacement of rehabilitation services. See `docs/CLAIMS-AND-EVIDENCE.md`.

## Editing content

- `src/content/narration.json`: spoken script (then `npm run narration` to regenerate audio and caption timings)
- `src/content/story.ts`: chapters, on-screen messages, notes, visual descriptions
- `src/content/proposal.ts`: product, roadmap, safety and partnership facts shown in reading mode
- `src/content/config.ts`: contact details (currently a placeholder) and disclosures

## Tests

```bash
npx tsc --noEmit                 # type check
npm test                         # unit tests (vitest)
npx playwright install chromium  # once
npm run test:e2e                 # interaction + accessibility tests (builds first via preview server)
```

Run `npm run build` before `npm run test:e2e`. There is no ESLint configuration; TypeScript strict mode is the static check.

## Regenerating assets (optional)

- `npm run narration` uses the Kokoro-82M neural text-to-speech model locally (Apache-2.0, downloaded on first run; needs `ffmpeg` and macOS `afinfo`). Pre-generated audio is included in `public/audio`. Choose another voice with `NARRATION_VOICE=af_heart npm run narration`. The narration is synthesised, not a voice actor.
- The processed images in `public/images` were cropped from seven AI-generated source images that are **not** included in this repository, so `npm run images` is for reference only.
- `npm run export:pdf`, `export:pptx`, `export:stills` and `export:video` create PDF, PowerPoint, still and MP4 outputs on demand. Their outputs are intentionally not committed.

## Stack

React 18, TypeScript, Vite, GSAP (deterministic timelines driven by one global clock), plain CSS tokens. Fonts are bundled locally; the built presentation makes no network requests. See `docs/TECHNICAL-ARCHITECTURE.md`.

## Documentation

`docs/` contains the story bible, storyboard, visual design system, narration script, timeline, accessibility plan, claims register, partnership brief, architecture, test report and delivery report.

## Licence and credits

No licence has been chosen yet; all rights reserved by the repository owner until one is added. Narration uses the Kokoro-82M model (Apache-2.0). Fonts: Fraunces and Inter via Fontsource (SIL OFL).
