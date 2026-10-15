# Test report

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
