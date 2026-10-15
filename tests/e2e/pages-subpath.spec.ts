import { test, expect } from '@playwright/test';

// Meant for playwright.pages.config.ts (served under /pathsense/). Skipped on the root-served config.
test.skip(({ baseURL }) => !baseURL?.endsWith('/pathsense/'), 'only meaningful when served under /pathsense/');

test.describe('GitHub Pages subpath', () => {
  test('every asset loads from /pathsense/ with no failures, and nothing is requested outside it', async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const seen: { url: string; status: number }[] = [];
    const failed: string[] = [];
    page.on('response', (r) => { if (r.url().startsWith(origin)) seen.push({ url: new URL(r.url()).pathname, status: r.status() }); });
    page.on('requestfailed', (r) => failed.push(r.url()));
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto('./?autostart=1&narration=1');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    // walk through every chapter so lazily-requested images / audio are all fetched
    for (let i = 1; i <= 7; i++) { await page.keyboard.press(String(i)); await page.waitForTimeout(500); }
    await page.evaluate(async () => { await document.fonts.ready; });

    const outside = seen.filter((s) => !s.url.startsWith('/pathsense/'));
    expect(outside, 'requests outside the base path').toEqual([]);
    expect(seen.filter((s) => s.status >= 400), 'non-OK responses').toEqual([]);
    expect(failed, 'failed requests').toEqual([]);
    expect(errors).toEqual([]);

    const kinds = (ext: string) => seen.filter((s) => s.url.endsWith(ext)).length;
    expect(kinds('.m4a')).toBeGreaterThanOrEqual(7);   // narration for every chapter
    expect(kinds('.woff2')).toBeGreaterThanOrEqual(2); // fonts
    expect(kinds('.webp') + kinds('.jpg')).toBeGreaterThanOrEqual(15); // images
    expect(seen.some((s) => s.url === '/pathsense/assets/app.js' && s.status === 200)).toBe(true);
    expect(seen.some((s) => s.url === '/pathsense/assets/style.css' && s.status === 200)).toBe(true);
    console.log(`subpath asset check: ${seen.length} same-origin responses, all under /pathsense/, ${kinds('.m4a')} audio, ${kinds('.woff2')} fonts, ${kinds('.webp') + kinds('.jpg')} images`);
  });

  test('the server really is strict: the site root is 404', async ({ request, baseURL }) => {
    const root = new URL('/', baseURL!).toString();
    expect((await request.get(root)).status()).toBe(404);
    expect((await request.get(new URL('images/ch1-kitchen-hero.jpg', baseURL!).toString())).status()).toBe(200);
  });

  test('fonts from the subpath are applied', async ({ page }) => {
    await page.goto('./?render=1');
    await page.waitForFunction(() => window.__pathsense?.ready);
    const loaded = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family); });
    expect(loaded.join(' ')).toMatch(/Fraunces/);
    expect(loaded.join(' ')).toMatch(/Inter/);
  });

  test('narration audio plays after a click and drives the clock', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Play the story' }).click();
    await page.waitForTimeout(3500);
    const s = await page.evaluate(() => window.__pathsense!.state());
    expect(s.playing).toBe(true);
    expect(s.audioBlocked).toBe(false);
    expect(s.time).toBeGreaterThan(2.5);
  });

  test('captions, keyboard, fullscreen and the coffee simulation all work', async ({ page }) => {
    await page.goto('./?autostart=1&narration=0');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    // captions: jump to chapter 3 mid-line and read them
    await page.evaluate(() => { const c = window.__pathsense!.chapters.find((x) => x.id === 'ch3')!; return window.__pathsense!.seek(c.start + 4.4); });
    await expect(page.locator('.captions p')).toContainText(/PathSense, help me find the coffee/i);
    await page.keyboard.press('c');
    await expect(page.locator('.captions.is-hidden')).toHaveCount(1);
    await page.keyboard.press('c');
    // keyboard: space pauses, arrows move chapters, digits jump
    await page.keyboard.press(' ');
    expect((await page.evaluate(() => window.__pathsense!.state())).playing).toBe(false);
    await page.keyboard.press(' ');
    await page.keyboard.press('5');
    expect((await page.evaluate(() => window.__pathsense!.state())).chapterIndex).toBe(4);
    await page.keyboard.press('ArrowLeft');
    expect((await page.evaluate(() => window.__pathsense!.state())).chapterIndex).toBe(3);
    // fullscreen
    await page.keyboard.press('f');
    await page.waitForTimeout(400);
    const fs = await page.evaluate(() => !!document.fullscreenElement);
    expect(fs).toBe(true);
    await page.keyboard.press('f');
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    // simulation: through to the verified outcome, images inside it load
    await page.keyboard.press('t');
    const dlg = page.getByRole('dialog', { name: 'Try the proposed experience' });
    await expect(dlg).toBeVisible();
    for (const b of ['Open the camera', 'Look for a match', 'Describe its position', 'I have checked it', 'Yes — that is the coffee']) await dlg.getByRole('button', { name: b }).click();
    await expect(dlg.getByText('Coffee found · confirmed by user')).toBeVisible();
    const imgOk = await dlg.locator('img').first().evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0);
    expect(imgOk).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
  });

  test('reading mode and deep link work under the subpath', async ({ page }) => {
    await page.goto('./#/read');
    await expect(page.getByRole('heading', { level: 1, name: 'PathSense Home' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { level: 2, name: /transcript/i })).toBeVisible();
  });
});
