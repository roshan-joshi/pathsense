import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Offline-first build: relative asset paths by default, a single IIFE bundle (no ES module
// script tag) so the built index.html also opens directly from the file system.
// GitHub Pages sets VITE_BASE=/pathsense/ (see .github/workflows/pages.yml).
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'strip-module-type',
      transformIndexHtml(html) {
        return html
          .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
          .replace(/ crossorigin(?=[ >])/g, '');
      },
    },
  ],
  base: process.env.VITE_BASE || './',
  build: {
    target: 'es2019',
    modulePreload: false,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'assets/app.js', assetFileNames: 'assets/[name][extname]' } },
  },
  server: { port: 5173, strictPort: true },
  test: { environment: 'node', include: ['tests/unit/**/*.test.ts'] },
});
