import { defineConfig } from '@playwright/test';
// Runs the whole suite against a production build served ONLY under /pathsense/ (GitHub Pages layout).
//   VITE_BASE=/pathsense/ npx vite build --outDir dist-pages && npx playwright test -c playwright.pages.config.ts
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4180/pathsense/', viewport: { width: 1600, height: 960 }, video: 'off' },
  webServer: { command: 'node scripts/serve-pages-preview.mjs dist-pages /pathsense/ 4180', url: 'http://127.0.0.1:4180/pathsense/', reuseExistingServer: false, timeout: 30_000 },
});
