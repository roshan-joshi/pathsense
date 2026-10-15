# Accessibility plan and status (target WCAG 2.2 AA)

## Principle
The cinematic layer is visual storytelling. The same information is available, independently, in **reading mode** (`#/read`): full story, visual descriptions, transcript, proposed capabilities, research and safety commitments, partnership request and funding appendix. Nothing depends on watching the animation.

## Implemented
| Area | Implementation |
| --- | --- |
| Skip link | First focusable element on the cinematic page: "Skip to accessible reading mode" |
| Semantic structure | Reading mode uses `main`, `nav`, `header`, `section`/`article` with labelled headings (h1 → h2 → h3), lists, `dl`, a data table with row/column headers |
| Controls | Native `<button>`s with text or `aria-label`; `aria-pressed` for toggles; `aria-current` for the active chapter; a visually hidden range input for position; keyboard shortcuts documented on the start screen and README; presenter notes exist only in the separate second-screen view |
| Keyboard | Space, arrows, 1–7, R, F, M, C, T, Esc; focus visible everywhere (`:focus-visible` gold ring); the start dialog focuses its primary action; the simulation is a modal dialog with Escape |
| Captions | Timed subtitles (32 px, high contrast on a dark panel) and a polite `aria-live` region announcing each line |
| Live stage | The stage is `role="img"` with a label naming the current chapter and pointing to reading mode; decorative images use empty `alt` |
| Reduced motion | `prefers-reduced-motion` (or `?reduced=1`): push-ins, parallax and drifts collapse to fades; grain overlay removed; CSS waveform/scan animations off |
| Pause / stop | Play/pause, restart, chapter jumps; audio pauses with the clock; nothing auto-plays before a user gesture |
| Contrast | Warm white on charcoal ≥ 7:1; chips and tertiary text ≥ 4.5:1 on their backgrounds |
| Text size | Reading mode is fluid and zoomable; stage text is large (≥ 17 px at 1920 design width, mostly 20–112 px) |

## Tested (automated)
- axe-core (WCAG 2A/2AA/2.2AA rule tags) on the start screen and on reading mode: **0 violations** (`tests/e2e/presentation.spec.ts`).
- Keyboard-only navigation of the presenter controls, simulation dialog and skip link: pass.
- Reduced-motion detection: pass.

## Not yet tested (honest gaps)
- Manual VoiceOver and NVDA walkthroughs have **not** been performed in this session. Reading mode uses only native semantics, so it is expected to behave, but it should be checked by a screen-reader user before the meeting.
- Colour-vision simulation and 400 % zoom reflow of reading mode were not checked.
- The cinematic stage uses fixed design pixels; it is intentionally not reflowable (reading mode is the reflowable alternative).
