# Visual design system

## Palette (`src/styles/tokens.css`)
| Token | Value | Use |
| --- | --- | --- |
| --bg | #15130f | Dark charcoal stage |
| --ink | #f4ece0 | Warm white text |
| --ink-2 / --ink-3 | #d9cfbf / #a99e8d | Secondary / tertiary text |
| --amber / --amber-2 | #c9a054 / #e2bb6a | Muted amber, soft gold: emphasis, markers, AI vocabulary |
| --ok | #8fc29a | Verified state |
| --warn | #e0b36a | Uncertain state |
| --wood | #7a5a3a | Natural wood accents |

Contrast: body text on the stage is ≥ 7:1; tertiary text is ≥ 4.5:1 against the card backgrounds.

## Typography
- Display: **Fraunces** (variable, bundled locally) — headlines, logo, chapter titles. Weight 500; italics in amber for emphasis.
- UI: **Inter** (variable, bundled locally) — captions, chips, cards, controls.
- Stage sizes: headline xxl 112 px, xl 80 px, lg 58 px; cinematic caption 30 px; subtitles 32 px; chips 19 px.

## Components (`src/components/ui.tsx`)
Headline · Caption · Kicker · Callout + marker · CommandBubble (user / AI) · StateChip (verified / uncertain / active / off / neutral) · ProcessStrip (six-step loop) · RoadmapPanel · Ribbon (simulation / conceptual labels) · Phone mock-up · Logo · Veil (light transitions) · Img (webp + jpg).

## AI vocabulary
- Amber dashed outline = candidate (uncertain). Solid green = verified by the person.
- Amber ring = the object the story is following (object-to-object transitions).
- The six-step loop (Understand → Acquire → Assist → Verify → Continue → Confirm) is the only "process" graphic; it lights step by step.
- No holograms, no glowing dashboards, no flashing.

## Motion vocabulary (`src/timeline/fx.ts`)
reveal (fade + 24 px rise) · hide · push (slow push-in, ease none) · draw (SVG stroke) · lightIn / lightOut (veil). Easing `power3.out` for entrances. Reduced motion collapses movement to opacity.

## Image handling
All seven references are 1672×941 PNGs with baked typography. `scripts/prepare-images.py` crops text-free regions, inpaints small baked icons/headline remnants with blurred neighbouring pixels, and writes JPEG + WebP (1.2 MB total). The asset audit is in CLAIMS-AND-EVIDENCE.md.
