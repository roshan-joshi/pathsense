import { chapters, chapterStart, totalDuration } from './story';

/** Local copy of the official E Multitech Solution wordmark (white variant). See docs/BRAND-ASSETS.md. */
export const LOGO = { file: 'brand/emultitech-logo-white.webp', width: 131, height: 42, alt: 'E Multitech Solution' };

/* ------------------------------------------------------------------------------------------------
   Glass watermark: a pure function of presentation time, so it is deterministic under seeking,
   pausing and frame-exact rendering (no CSS transitions or timers involved).

   Art direction
   - Hidden through the black opening and the first emergence of the home; it arrives quietly after
     the kitchen has sharpened and the first story line has landed.
   - Low in chapter 1's emotional lines, a little stronger once PATHSENSE HOME has been revealed.
   - Lowest during the coffee demonstration, where the story needs full attention.
   - Dips briefly at every chapter boundary, in step with the scene veils.
   - Fades away as the contact card takes over in the closing scene.
-------------------------------------------------------------------------------------------------- */
const smooth = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

function lerpKeys(t: number, keys: [number, number][]): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]; const [t0, v0] = keys[i - 1];
    if (t <= t1) return v0 + (v1 - v0) * smooth((t - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
}

/** Resting opacity per chapter (index 0 = chapter 1). */
const LEVEL = [0.46, 0.46, 0.4, 0.46, 0.46, 0.46, 0.42];
const FADE_IN_AT = 17.5;      // s: kitchen has sharpened, the person is on screen
const CH1_QUIET = 0.30;       // s 21.5 → 37.5, during the opening story lines
const CH1_TITLE_AT = 37.5;    // PATHSENSE HOME title reveal begins
const BOUNDARY_DIP = 0.55;    // fraction removed at the heart of a chapter transition
const BOUNDARY_HALF = 0.9;    // seconds either side
const FINAL_FADE_OUT: [number, number] = [42.4, 44.0]; // chapter-7 local seconds
const CONTACT_FADE_IN: [number, number] = [43.0, 44.4];

export const CONTACT_CARD_AT = chapterStart(6) + CONTACT_FADE_IN[0];

export function watermarkOpacity(t: number): number {
  if (t >= totalDuration) return 0;
  const keys: [number, number][] = [[0, 0], [FADE_IN_AT, 0], [FADE_IN_AT + 4, CH1_QUIET], [CH1_TITLE_AT, CH1_QUIET], [CH1_TITLE_AT + 4, LEVEL[0]]];
  for (let i = 1; i < chapters.length; i++) { const s = chapterStart(i); keys.push([s, LEVEL[i - 1]], [s + 1.4, LEVEL[i]]); }
  const s7 = chapterStart(6);
  keys.push([s7 + FINAL_FADE_OUT[0], LEVEL[6]], [s7 + FINAL_FADE_OUT[1], 0]);
  keys.sort((a, b) => a[0] - b[0]);
  let v = lerpKeys(t, keys);
  let dip = 0;
  for (let i = 1; i < chapters.length; i++) dip = Math.max(dip, smooth(1 - Math.abs(t - chapterStart(i)) / BOUNDARY_HALF));
  v *= 1 - BOUNDARY_DIP * dip;
  return Math.round(v * 1000) / 1000;
}

/** Closing-scene contact card: fades in with the final line and stays until the end. */
export function contactOpacity(t: number): number {
  const s7 = chapterStart(6);
  return Math.round(smooth((t - (s7 + CONTACT_FADE_IN[0])) / (CONTACT_FADE_IN[1] - CONTACT_FADE_IN[0])) * 1000) / 1000;
}

/** Keep the watermark legible on very small screens without letting it grow on large ones:
 *  returns the stage-space scale factor so the logo is at least `minDevicePx` wide on screen. */
export function watermarkBoost(stageScale: number, minDevicePx = 64, max = 3): number {
  if (!isFinite(stageScale) || stageScale <= 0) return 1;
  return Math.min(max, Math.max(1, minDevicePx / (LOGO.width * stageScale)));
}
