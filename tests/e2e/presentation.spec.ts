import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('cinematic mode', () => {
  test('start screen is accessible and starts playback', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('dialog')).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
    await page.getByRole('button', { name: 'Play the story' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
    await page.waitForTimeout(1500);
    const t = await page.evaluate(() => window.__pathsense!.state().time);
    expect(t).toBeGreaterThan(0.5);
  });

  test('timeline is deterministic and runs ~5 minutes across 7 chapters', async ({ page }) => {
    await page.goto('./?render=1');
    await page.waitForFunction(() => window.__pathsense?.ready);
    const info = await page.evaluate(() => ({ total: window.__pathsense!.total, chapters: window.__pathsense!.chapters }));
    expect(info.chapters).toHaveLength(7);
    expect(info.total).toBeGreaterThanOrEqual(285);
    expect(info.total).toBeLessThanOrEqual(320);
    for (const ch of info.chapters) {
      await page.evaluate((t) => window.__pathsense!.seek(t), ch.start + 2);
      const s = await page.evaluate(() => window.__pathsense!.state());
      expect(s.chapterIndex).toBe(info.chapters.indexOf(ch));
      await expect(page.locator(`.scene.${ch.id}.is-active`)).toBeVisible();
    }
  });

  test('keyboard presenter controls work', async ({ page }) => {
    await page.goto('./?autostart=1&narration=0');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    await page.keyboard.press('3');
    expect((await page.evaluate(() => window.__pathsense!.state())).chapterIndex).toBe(2);
    await page.keyboard.press('ArrowRight');
    expect((await page.evaluate(() => window.__pathsense!.state())).chapterIndex).toBe(3);
    await page.keyboard.press(' ');
    expect((await page.evaluate(() => window.__pathsense!.state())).playing).toBe(false);
    await expect(page.getByText('Notes', { exact: true })).toHaveCount(0);
    await page.keyboard.press('t');
    await expect(page.getByRole('dialog', { name: 'Try the proposed experience' })).toBeVisible();
    await page.getByRole('button', { name: 'Open the camera' }).click();
    await expect(page.getByText('Camera: pantry')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.keyboard.press('r');
    expect((await page.evaluate(() => window.__pathsense!.state())).time).toBeLessThan(2);
  });

  test('ends cleanly with a replay option', async ({ page }) => {
    await page.goto('./?autostart=1&narration=0');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    await page.evaluate(() => window.__pathsense!.seek(window.__pathsense!.total - 1.5));
    await expect(page.getByRole('button', { name: 'Watch again' })).toBeVisible({ timeout: 10_000 });
  });

  test('has no console errors while scrubbing every chapter', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('./?render=1');
    await page.waitForFunction(() => window.__pathsense?.ready);
    for (let t = 0; t < 306; t += 7) await page.evaluate((x) => window.__pathsense!.seek(x), t);
    expect(errors).toEqual([]);
  });
});

test.describe('reading mode', () => {
  test('is structured, keyboard reachable and passes axe', async ({ page }) => {
    await page.goto('./#/read');
    await expect(page.getByRole('heading', { level: 1, name: 'PathSense Home' })).toBeVisible();
    const h2 = await page.getByRole('heading', { level: 2 }).allTextContents();
    expect(h2.length).toBeGreaterThanOrEqual(8);
    expect(h2.join(' ')).toMatch(/partnership/i);
    await expect(page.getByRole('heading', { level: 2, name: /transcript/i })).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
    expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
  test('skip link reaches reading mode from the cinematic page', async ({ page }) => {
    await page.goto('./');
    // The start dialog focuses its primary action; Shift+Tab walks back through the dialog's options to the skip link,
    // which is the first focusable element in the document.
    const skip = page.getByRole('link', { name: 'Skip to accessible reading mode' });
    for (let i = 0; i < 6 && !(await skip.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Shift+Tab');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: 'PathSense Home' })).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./?render=1');
    await page.waitForFunction(() => window.__pathsense?.ready);
    expect((await page.evaluate(() => window.__pathsense!.state())).reducedMotion).toBe(true);
  });
});
