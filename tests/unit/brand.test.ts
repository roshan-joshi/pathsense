import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { watermarkOpacity, contactOpacity, watermarkBoost, CONTACT_CARD_AT, LOGO } from '../../src/content/brand';
import { chapterStart, totalDuration } from '../../src/content/story';
import { config } from '../../src/content/config';

const logoPath = new URL('../../public/brand/emultitech-logo-white.webp', import.meta.url);

describe('E Multitech contact details (exact)', () => {
  it('uses the exact legal name, email and website', () => {
    expect(config.contact.name).toBe('E Multitech Solution Pvt. Ltd.');
    expect(config.contact.email).toBe('info@emultitechsolution.com');
    expect(config.contact.website).toBe('https://www.emultitechsolution.com/');
  });
  it('invents no phone number or address', () => {
    expect(config.contact.phone).toBe('');
    expect(JSON.stringify(config.contact)).not.toMatch(/\+\d|\d{4,}|street|road|kupondol/i);
  });
});

describe('official logo asset', () => {
  it('is the unaltered website logo (size and SHA-256 as retrieved)', () => {
    expect(statSync(logoPath).size).toBe(776);
    expect(createHash('sha256').update(readFileSync(logoPath)).digest('hex')).toBe('398a003c569aaa9fc271356999b19c4824d4c94260695b29598819fc359aad87');
  });
  it('is loaded locally, never from the company website', () => {
    expect(LOGO.file).toBe('brand/emultitech-logo-white.webp');
    expect(LOGO.file).not.toMatch(/^https?:/);
    expect([LOGO.width, LOGO.height]).toEqual([131, 42]);
  });
});

describe('watermark opacity: cinematic art direction', () => {
  it('is completely absent through the black opening and the emergence of the home', () => {
    for (let t = 0; t <= 17.4; t += 0.5) expect(watermarkOpacity(t)).toBe(0);
  });
  it('is gone at the very end and never negative', () => {
    expect(watermarkOpacity(totalDuration)).toBe(0);
    for (let t = 0; t <= totalDuration; t += 0.25) expect(watermarkOpacity(t)).toBeGreaterThanOrEqual(0);
  });
  it('stays restrained: never brighter than 0.5', () => {
    let max = 0; for (let t = 0; t <= totalDuration; t += 0.25) max = Math.max(max, watermarkOpacity(t));
    expect(max).toBeLessThanOrEqual(0.5);
    expect(max).toBeGreaterThan(0.35); // but identifiable
  });
  it('is quieter during chapter 1 story lines, and quietest in the coffee demonstration', () => {
    expect(watermarkOpacity(30)).toBeLessThan(0.35);
    const ch3 = watermarkOpacity(chapterStart(2) + 30);
    expect(ch3).toBeLessThan(watermarkOpacity(chapterStart(1) + 20));
  });
  it('dips at every chapter transition, in step with the scene veils', () => {
    for (let i = 1; i < 7; i++) {
      const at = watermarkOpacity(chapterStart(i));
      const before = watermarkOpacity(chapterStart(i) - 2.5), after = watermarkOpacity(chapterStart(i) + 3);
      expect(at).toBeLessThan(Math.min(before, after) * 0.6);
    }
  });
  it('is smooth: no frame-to-frame jump larger than 0.03 at 24 fps', () => {
    let prev = watermarkOpacity(0);
    for (let t = 1 / 24; t <= totalDuration; t += 1 / 24) { const v = watermarkOpacity(t); expect(Math.abs(v - prev)).toBeLessThan(0.03); prev = v; }
  });
  it('is deterministic (same input, same output)', () => { expect(watermarkOpacity(123.456)).toBe(watermarkOpacity(123.456)); });
});

describe('closing contact card timing', () => {
  it('is invisible before the closing line and fully visible by the end', () => {
    expect(contactOpacity(0)).toBe(0);
    expect(contactOpacity(CONTACT_CARD_AT - 0.1)).toBe(0);
    expect(contactOpacity(totalDuration - 1)).toBe(1);
  });
  it('hands over from the watermark: watermark is gone once the card is fully shown', () => {
    for (let t = CONTACT_CARD_AT + 1.4; t <= totalDuration; t += 0.25) expect(watermarkOpacity(t)).toBe(0);
  });
  it('appears while narration is still speaking the final line (chapter 7)', () => {
    expect(CONTACT_CARD_AT).toBeGreaterThan(chapterStart(6) + 38);
    expect(CONTACT_CARD_AT).toBeLessThan(chapterStart(6) + 47);
  });
});

describe('small-screen boost', () => {
  it('does not enlarge the logo on large screens', () => { expect(watermarkBoost(1)).toBe(1); expect(watermarkBoost(2)).toBe(1); });
  it('keeps the logo at least 64 CSS px wide on phones, capped', () => {
    for (const w of [360, 375, 390, 430]) {
      const scale = w / 1920; const b = watermarkBoost(scale);
      expect(b).toBeGreaterThan(1); expect(b).toBeLessThanOrEqual(3);
      if (b < 3) expect(LOGO.width * scale * b).toBeGreaterThanOrEqual(63.9);
    }
  });
  it('is safe with bad input', () => { expect(watermarkBoost(0)).toBe(1); expect(watermarkBoost(NaN)).toBe(1); });
});
