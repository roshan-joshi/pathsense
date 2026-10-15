# Test report

## Phone number addition to the contact card (local, not committed or deployed)

Added `+61 406 806 984` (`tel:+61406806984`) to the closing contact card, end panel and reading mode. Email and website links are unchanged. Backup taken first (`PATHSENSE-PRE-PHONE-CONTACT-BACKUP-20261016-043844`, 374 files verified by SHA-256 plus a git bundle).

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass |
| `npm test` | **29 / 29** (phone shown and dialled consistently by digits; exactly one distinct phone number; no street address) |
| `npx playwright test` (root-served) | **36 passed**, 6 skipped (subpath-only tests, by design) |
| strict `/pathsense/` layout suite | **42 passed**, 0 skipped |
| Offline `file://` | pass, no errors |
| Phone layouts (360 and 390 px) | inspected visually: every value on its own line, number intact, no mid-word breaks |

New and updated browser assertions: the card lists Email, Phone, Website in order; the phone link is `tel:+61406806984`; keyboard order is email, phone, website with a visible focus ring on each; the card never collides with the caption or disclosure while the closing line plays (every 0.5 s); on all seven viewports every link and the one-line number stay inside the screen; the phone link appears in the end panel and reading mode; axe (WCAG 2A/AA/2.2 AA) stays clean.

A first mobile layout let the email and website break mid-word. It was fixed (stacked label and value under 520 px) before testing was completed. One new unit test also had a flaw (it counted the displayed number and its `tel:` form as two numbers); the test was corrected, not the data.

Not re-run for this change: the 5-minute real-time playthrough (nothing in the story, audio or timeline changed; the earlier full playthrough result stands).


## E Multitech branding revision (local review build, not committed or deployed)

Run on 2026-10-15 against the branded build. The approved baseline was verified first: a build restored from the backup bundle is byte-identical to the live site.

| Check | Command | Result |
| --- | --- | --- |
| Type check | `npx tsc --noEmit` | pass |
| Unit tests | `npm test` | **28 / 28** (11 story and claims, 17 brand: exact contact strings, no invented phone or address, logo SHA-256 unchanged, watermark absent through the opening, never above 0.5, smooth at 24 fps, dips at all six chapter transitions, contact timing, small-screen boost) |
| Build | `npx vite build` | pass |
| End-to-end, root-served | `npx playwright test` | **35 passed**, 6 skipped (the six GitHub Pages subpath tests skip on a root-served site by design) |
| End-to-end, strict `/pathsense/` layout | `npm run test:pages` equivalent | **41 passed**, 0 skipped: every asset under `/pathsense/`, fonts, narration audio, captions, keyboard, fullscreen, coffee simulation, reading mode |
| Offline `file://` | headless Chromium, network blocked, scratch copy | pass: plays, narration audio loads, no broken images, no console errors, reaches the end |
| Real-time playthrough | full story with narration on, headless Chromium | 320 s wall time for 317 s of story; all 7 chapters visited; narration never blocked; captions present; watermark exactly 0 during the blackout and peak 0.46; end panel shown with both contact links; **0 errors** |

Branding-specific browser tests (27): watermark absent through the opening at seven sample times; decorative semantics (aria-hidden, empty alt, no focusable descendants, pointer-events none, click passes through); no overlap with captions or any visible story element at 1.5 s intervals across the whole story; watermark-to-card hand-over; logo loaded from the same origin only with 200 status and native size 131 × 42; zero layout shift attributable to branding; reduced motion; exact contact details and `mailto:` / website links with `noopener`; links outside the `role="img"` wrapper, keyboard focus ring; axe (WCAG 2A/AA/2.2 AA) clean on the closing scene, end panel and reading mode; no endorsement language; seven viewports (360, 375, 390, 430, tablet 768, laptop 1366, desktop 1920) for watermark, card and end panel (inside the screen, no horizontal overflow, phone logo at least 60 px); fullscreen (inside the screen, below the captions in stacking order).

Findings during testing (all reported, none hidden):
1. My own overlap test first flagged the closing scene's full-screen centring wrapper (a test selector error, fixed). No real overlap exists.
2. A layout-shift check first failed at 0.023. Measured on the approved baseline it is the same 0.0234 in every run, from pre-existing elements (grain overlay and start dialog). Branding adds none. The test now asserts branding contributes zero.
3. The three opening sound cues overlap visually around 12 s. This is pre-existing and was deliberately not changed.

Not tested: sound through real speakers or a non-Chromium browser; Safari and Firefox; manual VoiceOver or NVDA; 4K rendering on a physical 4K display (the 131 px logo is expected to look slightly soft there).

# Earlier results (approved baseline)

All results were produced locally; nothing is assumed.

## Automated and scripted checks (revision v3)
- `npm test`: 11 / 11 passed (includes a check that the fictional café owner is present, no diagnosis, age or invented numbers appear, and the simulation is labelled).
- `npm run test:e2e`: 8 / 8 passed on the v2 build (axe: 0 violations in both modes; presenter notes confirmed absent from the audience UI).
- Offline file:// run with network blocked: passes; new Kokoro narration plays after the click.
- Headless frame review of the opening (0–46 s) and recoloured chapters at 1920×1080.



## Not tested (disclosed)
- Sound output inside one embedded browser pane was reported blocked after a click; headless Chromium played audio after the click. Confirm sound on the presenting laptop.
- Manual VoiceOver and NVDA walkthroughs were not performed. Reading mode uses native semantics only.
- Safari and Firefox were not tested.
- No user testing of any kind has occurred and none is claimed.
