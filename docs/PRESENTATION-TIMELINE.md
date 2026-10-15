# Presentation timeline

Total: **306 s (5:06)**. Narration audio: 280 s. Each chapter's narration is shorter than its visual duration; the clock continues on silence for the tail.

| # | Chapter | Start | Duration | Narration | Narration lines |
| --- | --- | --- | --- | --- | --- |
| 1 | A life built around cooking | 0:00 | 35 s | 31.9 s | 6 |
| 2 | The tasks that matter | 0:35 | 40 s | 36.3 s | 7 |
| 3 | The first solution: find the coffee | 1:15 | 60 s | 53.3 s | 10 |
| 4 | A home that can provide useful information | 2:15 | 44 s | 41.7 s | 7 |
| 5 | Personal to every individual | 2:59 | 35 s | 31.9 s | 5 |
| 6 | Does it truly work? | 3:34 | 42 s | 37.7 s | 5 |
| 7 | One home. Many futures. | 4:16 | 50 s | 47.5 s | 5 |

## Clock model
- One global clock (`src/timeline/engine.ts`). Each chapter owns a paused GSAP timeline that is *seeked* every frame, so pause, resume, scrub, chapter jumps and the frame-by-frame MP4 render are all the same code path.
- With narration on, the chapter's `<audio>` element is the master clock while it is playing (no drift between voice and picture). When it ends, or when the browser blocks audio, `requestAnimationFrame` drives time.
- Subtitles are looked up from `narration-timing.json` by chapter-local time and shown ~0.15 s early and 0.6 s late for readability.

## Timing guarantees enforced by tests
`tests/unit/story.test.ts`: total between 285 and 320 s; narration ≤ chapter duration; subtitle lines ordered and non-overlapping.
