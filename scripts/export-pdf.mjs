// Renders the accessible reading mode to a tagged-ish, text-based PDF via Chromium.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { startStatic } from './lib-static-server.mjs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
mkdirSync(path.join(root, 'exports/pdf'), { recursive: true });
const { url, close } = await startStatic(path.join(root, 'dist'), 4191);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: 'print', colorScheme: 'light' });
await page.goto(`${url}/#/read`);
await page.waitForSelector('h1');
await page.addStyleTag({ content: `body{background:#fff!important;color:#111!important} .reading{color:#111!important;max-width:none!important;padding:0!important;font-size:13.5px!important;line-height:1.45!important} .reading header .kicker{display:none} .reading h1{font-size:34px!important} .reading h2{font-size:22px!important;margin:22px 0 8px!important;padding-top:12px!important} .reading h3{font-size:16px!important;margin:14px 0 4px!important} .reading .lede{font-size:16px!important} .reading ul,.reading ol{margin:4px 0!important} .reading li{margin:0!important} .reading h1{color:#111!important} .reading h2{color:#5a4215!important;border-color:#ddd!important;break-after:avoid} .reading h3{break-after:avoid} .reading .lede,.reading dd,.reading li,.reading p{color:#222!important} .reading .fine,.reading .muted{color:#555!important} .reading a{color:#5a4215!important} .reading-nav{display:none!important} .reading th,.reading td{border-color:#ccc!important} h2,h3{break-after:avoid} .btn{display:none!important}` });
await page.pdf({ path: path.join(root, 'exports/pdf/PathSense-Home-Proposal.pdf'), format: 'A4', margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' }, printBackground: false, displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: '<div style="font-size:9px;color:#777;width:100%;text-align:center;font-family:sans-serif">PathSense Home — proposal · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
await browser.close(); await close();
console.log('PDF -> exports/pdf/PathSense-Home-Proposal.pdf');
