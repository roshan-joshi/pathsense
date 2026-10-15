import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const seek = (page: Page, t: number) => page.evaluate(async (x) => { await window.__pathsense!.seek(x); }, t);
const chapterStart = (page: Page, id: string) => page.evaluate((i) => window.__pathsense!.chapters.find((c) => c.id === i)!.start, id);
const wmOpacity = (page: Page) => page.evaluate(() => Number(getComputedStyle(document.querySelector('.wm')!).opacity));
const axe = (page: Page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();

async function renderMode(page: Page) {
  await page.goto('./?render=1');
  await page.waitForFunction(() => window.__pathsense?.ready);
  await page.evaluate(() => document.fonts.ready);
}

test.describe('E Multitech watermark', () => {
  test('is absent through the black opening (cinematic impact preserved)', async ({ page }) => {
    await renderMode(page);
    for (const t of [0, 3, 6, 9, 12, 15, 17]) {
      await seek(page, t);
      expect(await wmOpacity(page), `t=${t}`).toBe(0);
      await expect(page.locator('.wm')).toBeHidden();
    }
  });

  test('is decorative: aria-hidden, not focusable, never intercepts the pointer', async ({ page }) => {
    await renderMode(page);
    await seek(page, 100);
    const wm = page.locator('.wm');
    await expect(wm).toHaveAttribute('aria-hidden', 'true');
    expect(await wmOpacity(page)).toBeGreaterThan(0.25);
    expect(await wm.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
    expect(await wm.locator('img').getAttribute('alt')).toBe('');
    expect(await wm.evaluate((e) => e.querySelectorAll('a,button,input,[tabindex]').length)).toBe(0);
    // a click at the centre of the watermark lands on something else
    const hit = await wm.evaluate((e) => { const r = e.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!el && !e.contains(el); });
    expect(hit).toBe(true);
    // it is not in the accessibility tree
    expect(await page.getByRole('img', { name: 'E Multitech Solution' }).count()).toBe(0);
  });

  test('never overlaps captions or any visible story element, in any chapter', async ({ page }) => {
    await renderMode(page);
    const total = await page.evaluate(() => window.__pathsense!.total);
    const hits: string[] = [];
    for (let t = 18; t < total; t += 1.5) {
      await seek(page, t);
      const found = await page.evaluate(() => {
        const wm = document.querySelector('.wm') as HTMLElement; if (Number(getComputedStyle(wm).opacity) < 0.05) return [];
        const r = wm.getBoundingClientRect(); const out: string[] = [];
        const sel = '.captions p, .callout, .bubble, .chip, .phone, .roadmap, .step, .measure, .asks div, .home, .pill, .ribbon, .profile, .headline, .cine-caption, .contact-card, .logo, .next, .not, .core, .future-note, .privacy .chip, .kicker';
        document.querySelectorAll(`.stage ${sel}`).forEach((el) => {
          const cs = getComputedStyle(el as HTMLElement);
          let o = 1, n: HTMLElement | null = el as HTMLElement; while (n && n.id !== 'root') { o *= Number(getComputedStyle(n).opacity); if (getComputedStyle(n).visibility === 'hidden') { o = 0; break; } n = n.parentElement; }
          if (o < 0.2 || cs.display === 'none') return;
          const b = el.getBoundingClientRect(); if (b.width === 0 || b.height === 0) return;
          const ix = Math.min(r.right, b.right) - Math.max(r.left, b.left), iy = Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top);
          // ignore full-screen wrappers; flag only real content boxes overlapping by more than 2px each way
          if (ix > 2 && iy > 2 && b.width < r.width * 14) out.push(`${(el as HTMLElement).className.toString().slice(0, 40)} "${(el.textContent || '').trim().slice(0, 30)}"`);
        });
        return out;
      });
      if (found.length) hits.push(`t=${t}: ${found.join(' | ')}`);
    }
    expect(hits, hits.join('\n')).toEqual([]);
  });

  test('hands over to the contact card in the closing scene', async ({ page }) => {
    await renderMode(page);
    const s7 = await chapterStart(page, 'ch7');
    await seek(page, s7 + 20);
    expect(await wmOpacity(page)).toBeGreaterThan(0.3);
    await seek(page, s7 + 48);
    expect(await wmOpacity(page)).toBe(0);
    await expect(page.getByTestId('contact-card')).toBeVisible();
  });

  test('loads the logo from the same origin only', async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin; const external: string[] = []; const logo: number[] = [];
    page.on('request', (r) => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('response', (r) => { if (r.url().endsWith('emultitech-logo-white.webp')) logo.push(r.status()); });
    await renderMode(page);
    await page.waitForTimeout(600);
    expect(external).toEqual([]);
    expect(logo.length).toBeGreaterThan(0);
    expect(logo.every((s) => s === 200)).toBe(true);
    expect(await page.locator('.wm img').evaluate((i: HTMLImageElement) => [i.naturalWidth, i.naturalHeight])).toEqual([131, 42]);
  });

  test('adds no layout shift of its own while playing', async ({ page }) => {
    // The page has a small pre-existing layout shift (~0.023, from the grain overlay and the start dialog as the
    // controls appear; identical on the approved baseline). Branding must contribute none of it.
    await page.goto('./?autostart=1&narration=0');
    await page.evaluate(() => {
      const w = window as any; w.__brandShift = 0; w.__totalShift = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries() as any[]) { if (e.hadRecentInput) continue; w.__totalShift += e.value;
        for (const s of e.sources || []) if (s.node && (s.node.closest?.('.wm') || s.node.closest?.('.contact-layer'))) w.__brandShift += e.value; } }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.evaluate(() => window.__pathsense!.seek(15));
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.__pathsense!.seek(window.__pathsense!.total - 8));
    await page.waitForTimeout(6000);   // covers the watermark hand-over and the contact card fading in
    expect(await page.evaluate(() => (window as any).__brandShift)).toBe(0);
    expect(await page.evaluate(() => (window as any).__totalShift)).toBeLessThan(0.03);
  });

  test('respects reduced motion (no animation or transition on the signature)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await renderMode(page);
    await seek(page, 100);
    const cs = await page.locator('.wm').evaluate((e) => { const c = getComputedStyle(e); return [c.animationName, c.transitionDuration]; });
    expect(cs[0]).toBe('none'); expect(cs[1]).toBe('0s');
    expect(await wmOpacity(page)).toBeGreaterThan(0.25);
  });
});

test.describe('closing contact card', () => {
  test('shows the exact organisation details with working, keyboard-reachable links', async ({ page }) => {
    await renderMode(page);
    await seek(page, (await chapterStart(page, 'ch7')) + 48.5);
    const card = page.getByTestId('contact-card');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Presented by');
    await expect(card).toContainText('E Multitech Solution Pvt. Ltd.');
    const email = card.getByRole('link', { name: 'info@emultitechsolution.com' });
    const site = card.getByRole('link', { name: /www\.emultitechsolution\.com/ });
    await expect(email).toHaveAttribute('href', 'mailto:info@emultitechsolution.com');
    await expect(site).toHaveAttribute('href', 'https://www.emultitechsolution.com/');
    await expect(site).toHaveAttribute('target', '_blank');
    await expect(site).toHaveAttribute('rel', /noopener/);
    await expect(site).toContainText('opens in a new tab');
    await expect(card.getByRole('img', { name: 'E Multitech Solution' })).toBeVisible(); // meaningful logo has alt text
    // keyboard: the links are reachable and show a visible focus ring
    await email.focus();
    expect(await email.evaluate((e) => getComputedStyle(e).boxShadow)).not.toBe('none');
    await page.keyboard.press('Tab');
    await expect(site).toBeFocused();
    // text is selectable (real text, not an image)
    expect(await email.evaluate((e) => getComputedStyle(e).userSelect)).not.toBe('none');
    // no tracking or form was added
    expect(await page.locator('form, input[type=email]').count()).toBe(0);
  });

  test('is outside the role="img" art wrapper, so assistive technology can reach it; axe is clean', async ({ page }) => {
    await renderMode(page);
    await seek(page, (await chapterStart(page, 'ch7')) + 48.5);
    expect(await page.getByTestId('contact-card').evaluate((e) => !e.closest('[role="img"]'))).toBe(true);
    const r = await axe(page);
    expect(r.violations, JSON.stringify(r.violations, null, 2)).toEqual([]);
  });

  test('is hidden from everyone (not focusable) before the closing scene', async ({ page }) => {
    await renderMode(page);
    await seek(page, 100);
    await expect(page.getByTestId('contact-card')).toBeHidden();
    expect(await page.locator('.contact-layer a').evaluateAll((as) => as.every((a) => (a as HTMLElement).offsetParent === null || getComputedStyle(a.closest('.contact-layer')!).visibility === 'hidden'))).toBe(true);
  });

  test('is repeated, with working links, in the end panel and in reading mode; both pass axe', async ({ page }) => {
    await page.goto('./?autostart=1&narration=0');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    await page.evaluate(() => window.__pathsense!.seek(window.__pathsense!.total - 0.6));
    const panel = page.locator('.end-overlay');
    await expect(panel).toBeVisible({ timeout: 10_000 });
    await expect(panel.getByRole('link', { name: 'info@emultitechsolution.com' })).toHaveAttribute('href', 'mailto:info@emultitechsolution.com');
    await expect(panel).toContainText('E Multitech Solution Pvt. Ltd.');
    let r = await axe(page); expect(r.violations, JSON.stringify(r.violations, null, 2)).toEqual([]);
    await page.goto('./#/read');
    const rc = page.getByTestId('contact-card');
    await expect(rc.getByRole('link', { name: 'info@emultitechsolution.com' })).toHaveAttribute('href', 'mailto:info@emultitechsolution.com');
    await expect(page.getByRole('heading', { level: 3, name: 'Contact' })).toBeVisible();
    r = await axe(page); expect(r.violations, JSON.stringify(r.violations, null, 2)).toEqual([]);
  });

  test('does not imply any endorsement or partnership', async ({ page }) => {
    await page.goto('./#/read');
    const text = (await page.locator('main').innerText()).toLowerCase();
    expect(text).not.toMatch(/endorsed by|in partnership with e multitech|funded by e multitech|approved by/);
    expect(text).toContain('presented by e multitech solution pvt. ltd.');
  });
});

const viewports = [
  { name: '360', w: 360, h: 740 }, { name: '375', w: 375, h: 812 }, { name: '390', w: 390, h: 844 }, { name: '430', w: 430, h: 932 },
  { name: 'tablet', w: 768, h: 1024 }, { name: 'laptop', w: 1366, h: 768 }, { name: 'desktop', w: 1920, h: 1080 },
];
test.describe('responsive', () => {
  for (const v of viewports) {
    test(`${v.name} (${v.w}×${v.h}): watermark and card are inside the screen, legible and not clipped`, async ({ page }) => {
      await page.setViewportSize({ width: v.w, height: v.h });
      await renderMode(page);
      await seek(page, 100);
      await page.waitForTimeout(150);
      const wm = await page.locator('.wm').boundingBox();
      expect(wm).not.toBeNull();
      expect(wm!.x).toBeGreaterThanOrEqual(0); expect(wm!.y).toBeGreaterThanOrEqual(0);
      expect(wm!.x + wm!.width).toBeLessThanOrEqual(v.w + 0.5); expect(wm!.y + wm!.height).toBeLessThanOrEqual(v.h + 0.5);
      const logoW = (await page.locator('.wm img').boundingBox())!.width;
      if (v.w <= 430) expect(logoW, 'phone logo width').toBeGreaterThanOrEqual(60);
      expect(logoW, 'never absurdly large').toBeLessThanOrEqual(135 * 2.5);
      await seek(page, (await chapterStart(page, 'ch7')) + 48.5);
      const card = await page.getByTestId('contact-card').boundingBox();
      expect(card!.x).toBeGreaterThanOrEqual(0); expect(card!.x + card!.width).toBeLessThanOrEqual(v.w + 0.5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    });
    test(`${v.name}: the end panel shows a readable, unclipped contact card`, async ({ page }) => {
      await page.setViewportSize({ width: v.w, height: v.h });
      await page.goto('./?autostart=1&narration=0');
      await page.waitForFunction(() => window.__pathsense?.state().started);
      await page.evaluate(() => window.__pathsense!.seek(window.__pathsense!.total - 0.6));
      await expect(page.locator('.end-overlay')).toBeVisible({ timeout: 10_000 });
      const card = await page.locator('.end-overlay .contact-card').boundingBox();
      expect(card!.x).toBeGreaterThanOrEqual(0); expect(card!.x + card!.width).toBeLessThanOrEqual(v.w + 0.5);
      const link = await page.locator('.end-overlay .contact-links a').first().boundingBox();
      expect(link!.x + link!.width).toBeLessThanOrEqual(v.w + 0.5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    });
  }

  test('fullscreen: signature stays inside the screen, above the story and below the captions', async ({ page }) => {
    await page.goto('./?autostart=1&narration=0');
    await page.waitForFunction(() => window.__pathsense?.state().started);
    await page.evaluate(() => window.__pathsense!.seek(100));
    await page.keyboard.press('f'); await page.waitForTimeout(500);
    expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    await page.evaluate(() => window.__pathsense!.seek(100)); await page.waitForTimeout(200);
    const vp = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
    const wm = await page.locator('.wm').boundingBox();
    expect(wm!.x + wm!.width).toBeLessThanOrEqual(vp.w + 0.5); expect(wm!.y + wm!.height).toBeLessThanOrEqual(vp.h + 0.5);
    const z = await page.evaluate(() => [Number(getComputedStyle(document.querySelector('.wm')!).zIndex), Number(getComputedStyle(document.querySelector('.captions')!).zIndex)]);
    expect(z[0]).toBeLessThan(z[1]);
    await page.keyboard.press('f'); await page.waitForTimeout(300);
  });
});
