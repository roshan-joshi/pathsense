# E Multitech Solution branding revision (local review build)

Scope: company branding only. The story, opening, seven chapters, narration, audio timing, captions, coffee simulation, roadmap, playback controls, palette and animation engine are unchanged. Nothing here has been committed, pushed or deployed.

## Brand identity used
| Item | Value | Source |
| --- | --- | --- |
| Legal display name | E Multitech Solution Pvt. Ltd. | Supplied by the owner; matches the website's structured data (`legalName`) |
| Email | info@emultitechsolution.com | Supplied by the owner |
| Website | https://www.emultitechsolution.com/ | Supplied by the owner |
| Logo | White wordmark, unaltered | https://www.emultitechsolution.com/images/logo.webp (see `BRAND-ASSETS.md`) |
| Phone | +61 406 806 984 (dialled as `tel:+61406806984`) | Supplied by the owner |
| Address / titles | none | Not supplied, none invented |

Hierarchy: **PathSense Home** is the product and presentation identity; **E Multitech Solution Pvt. Ltd.** appears as "Presented by" (the presenting and contact organisation). Nothing states or implies partnership, endorsement, funding or approval by any other organisation, and a test guards that.

## Watermark: three options evaluated
Measured first: brightness behind the candidate corners across 106 sampled frames of the approved build (every 3 s). The bottom-right corner is dark in every frame (average luminance 0.14, brightest 0.30, no pixel above 0.55). The top-right reaches 0.39 in chapter 1 (window and shelf light) and competes with callouts.

| Option | Verdict |
| --- | --- |
| **A. Minimal floating logo** (bare logo, ~50% opacity) | Rejected. The only official wordmark is a 131 × 42 px raster with thin letterforms; bare, it would be fragile over photography and shelves, and unevenly legible. |
| **B. Frosted-glass signature** | **Chosen.** A nearly transparent warm-tinted glass pill (12 px blur, slight darkening, hairline edge, soft inner highlight) gives the logo a consistent surface on every scene without a visible panel. |
| **C. Luminance-adaptive** (white or charcoal variant) | Rejected as unnecessary. The measurements show no bright background at the watermark position in any chapter, so a charcoal variant would never be used. Only the white official variant ships. |

Final treatment: **B with context-sensitive opacity** (a restrained hybrid that takes the sensible part of C without sensing the picture).

## How the watermark behaves
Position: bottom-right of the 1920 × 1080 stage (balances the disclosure note at bottom-left; clear of captions, callouts and all chapter content, verified by an overlap test at 1.5-second intervals across the whole story).

Opacity is a pure function of presentation time (`src/content/brand.ts`), so it is deterministic under seek, pause, restart and frame-exact rendering. No timers, no CSS transitions, no shimmer, no pulse, no movement.

| Moment | Opacity |
| --- | --- |
| Black opening and emergence of the home (0 to 17.5 s) | 0, fully absent |
| Chapter 1 story lines (from 17.5 s, rising over 4 s) | 0.30 |
| After the PATHSENSE HOME title begins (37.5 s) | 0.46 |
| Chapters 2, 4, 5, 6 | 0.46 |
| Chapter 3, the coffee demonstration | 0.40 (lowest: the story needs full attention) |
| Chapter 7 | 0.42, then fades out at 42.4 to 44.0 s |
| Every chapter boundary (±0.9 s) | dips by 55%, in step with the scene veils |
| Closing scene | gone; the contact card takes over |

Layering: above the scenes and veils (z 13), below captions (15) and every overlay (the simulation and end panel). `pointer-events: none`, `aria-hidden`, empty alt text, not focusable. Hidden entirely (`visibility: hidden`) whenever opacity is near zero. Reduced motion is respected: there is no movement to remove.

Small screens: the stage is a scaled 16:9 canvas, so on phones the logo would shrink to an unreadable ~25 px. It is scaled up inversely to a minimum of 64 CSS px wide (capped at 3×) and stays inside the screen. It is never enlarged on large screens.

## Closing contact card
Shown in the final scene from 43.0 s of chapter 7, fading in as the closing line is spoken, and repeated in the end panel and in reading mode.
- Content: "Presented by" / **E Multitech Solution Pvt. Ltd.** / a labelled list: **Email** `info@emultitechsolution.com` (`mailto:`), **Phone** `+61 406 806 984` (`tel:+61406806984`, kept on one line with non-breaking spaces), **Website** `www.emultitechsolution.com` (opens in a new tab).
- Layout: the stage card keeps its side-by-side glass design (logo, divider, text) and sits at y 676 so the taller card stays clear of the captions and the disclosure note (tested every 0.5 s). On screens up to 520 px wide, the responsive end panel and reading mode stack the logo above the text and each label above its value, so nothing breaks mid-word.
- Real text, selectable, underlined links, visible focus ring, "(opens in a new tab)" for assistive technology, meaningful logo with alt text "E Multitech Solution".
- Placed **outside** the `role="img"` art wrapper (the stage was restructured into an art layer plus overlay layers) so assistive technology can reach the links. The visual result is unchanged.
- No form, analytics, tracking, subscription or backend was added.

## Files changed
See the handoff report. New: `public/brand/emultitech-logo-white.webp`, `src/content/brand.ts`, `src/components/Brand.tsx`, `src/styles/brand.css`, `docs/BRAND-ASSETS.md`, this file, `tests/unit/brand.test.ts`, `tests/e2e/branding.spec.ts`. Edited: `src/content/config.ts`, `src/app/Viewer.tsx`, `src/scenes/Chapter7.tsx`, `src/components/ReadingMode.tsx`, `src/styles/global.css`, `src/styles/scenes.css`, `src/main.tsx`.

## Known limitations and observations
1. **Logo resolution.** The website publishes the wordmark only as a 131 × 42 px raster (WebP and PNG); there is no SVG or 2× file. It is used unaltered, so it looks slightly soft on 4K displays. Supplying a vector or 2× wordmark would fix this: replace the one file in `public/brand/` (and update the checksum in `tests/unit/brand.test.ts`).
2. **Phones.** The cinematic stage is a scaled 16:9 canvas (existing behaviour, out of scope), so on a portrait phone the contact card inside the stage is small. The end panel and reading mode carry a fully legible, responsive version of the contact details, including a tappable phone number.
3. **Pre-existing layout shift (not caused by branding).** The page has a cumulative layout shift of about 0.023 on both the approved baseline and this build, from the grain overlay and the start dialog as controls appear. Branding contributes zero (asserted by a test).
4. **Pre-existing opening detail, left untouched on purpose.** Around 12 s the three opening sound cues ("a kettle", "a fridge door", "a room known by heart") overlap on screen because their windows overlap. It is in the approved live build and outside this scope; flagged for the owner's decision.
5. The start screen carries no company mark (outside the requested scope); it could be added if wanted.
