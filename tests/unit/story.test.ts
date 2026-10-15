import { describe, it, expect } from 'vitest';
import { chapters, totalDuration, chapterStart } from '../../src/content/story';
import timing from '../../src/content/narration-timing.json';
import { proposal } from '../../src/content/proposal';
import { existsSync, readFileSync } from 'node:fs';

describe('story structure', () => {
  it('has seven chapters in order', () => {
    expect(chapters.map((c) => c.id)).toEqual(['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7']);
  });
  it('runs for approximately five minutes (285-320s)', () => {
    expect(totalDuration).toBeGreaterThanOrEqual(285);
    expect(totalDuration).toBeLessThanOrEqual(320);
  });
  it('never lets narration run past its chapter', () => {
    for (const ch of chapters) {
      const t = timing.chapters.find((c) => c.id === ch.id)!;
      expect(t.duration).toBeLessThanOrEqual(ch.duration);
      for (const l of ch.subtitles) { expect(l.start).toBeGreaterThanOrEqual(0); expect(l.end).toBeLessThanOrEqual(ch.duration); }
    }
  });
  it('keeps subtitles ordered and non-overlapping', () => {
    for (const ch of chapters) {
      for (let i = 1; i < ch.subtitles.length; i++) expect(ch.subtitles[i].start).toBeGreaterThanOrEqual(ch.subtitles[i - 1].end);
    }
  });
  it('computes chapter offsets', () => {
    expect(chapterStart(0)).toBe(0);
    expect(chapterStart(1)).toBe(chapters[0].duration);
    expect(chapterStart(7)).toBe(totalDuration);
  });
  it('gives every chapter notes, key messages and a visual description', () => {
    for (const ch of chapters) { expect(ch.notes.length).toBeGreaterThan(0); expect(ch.keyMessages.length).toBeGreaterThan(0); expect(ch.visual.length).toBeGreaterThan(80); }
  });
});

describe('claims discipline', () => {
  const allText = JSON.stringify({ chapters: chapters.map((c) => [c.keyMessages, c.notes, c.visual, c.subtitles.map((s) => s.text)]), proposal });
  it('contains no fabricated pilot percentages or scores', () => {
    expect(allText).not.toMatch(/\d+\s?%/);
    expect(allText).not.toMatch(/\$\s?\d/);
  });
  it('does not add an invented diagnosis, age or cause', () => {
    expect(allText).not.toMatch(/diabet|glaucoma|retinitis|macular|aged \d|years old|\bage \d/i);
  });
  it('uses the fictional café owner and keeps real-person details out', () => {
    expect(allText).toMatch(/café owner/i);
    expect(allText).toMatch(/fictional/i);
    // Optional privacy guard: terms that must never appear are kept in a git-ignored local file
    // (tests/private-terms.local.json: { "terms": ["..."] }) so the list itself is never published.
    const f = new URL('../private-terms.local.json', import.meta.url);
    if (existsSync(f)) for (const t of JSON.parse(readFileSync(f, 'utf8')).terms as string[]) expect(allText).not.toMatch(new RegExp(t, 'i'));
  });
  it('labels the demonstration as simulated', () => {
    expect(allText).toMatch(/simulat/i);
    expect(allText).toMatch(/not a recording of a real trial|not a recorded trial/i);
  });
  it('does not claim hazard, gas or boiling-water supervision', () => {
    expect(allText).not.toMatch(/detects (all|every) hazard/i);
    expect(proposal.safety.notClaimed.join(' ')).toMatch(/gas ignition/i);
  });
});
