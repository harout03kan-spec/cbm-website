// Dev-only: downloads CLEAN (background-removed) product photos from ASICMinerValue
// product pages into public/assets/products/. It only uses the main product image
// (alt ends with "ASIC miner" — never the branded share-card / logo). Reports per
// product. Run:  node scripts/fetch-product-images.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'assets', 'products');
fs.mkdirSync(OUT, { recursive: true });

// key (filename) | ASICMinerValue page path
const TARGETS = [
  ['antminer-l11', 'bitmain/antminer-l11-20gh'],
  ['antminer-s21e-hyd', 'bitmain/antminer-s21e-hyd-310th'],
  ['sealminer-a2-pro-hyd', 'bitdeer/sealminer-a2-pro-hyd'],
  ['sealminer-a2-pro-air', 'bitdeer/sealminer-a2-pro-air'],
  ['sealminer-a3-pro-hydro', 'bitdeer/sealminer-a3-pro-hydro'],
  ['whatsminer-m50s', 'microbt/whatsminer-m50s'],
  ['whatsminer-m60s', 'microbt/whatsminer-m60s'],
  ['whatsminer-m60s-plus', 'microbt/whatsminer-m60s-plus'],
  ['whatsminer-m60s-plus-plus', 'microbt/whatsminer-m60s-plus-plus'],
  ['whatsminer-m63s', 'microbt/whatsminer-m63s'],
  ['whatsminer-m63s-plus', 'microbt/whatsminer-m63s-plus'],
  ['whatsminer-m66', 'microbt/whatsminer-m66'],
  ['whatsminer-m66s-plus', 'microbt/whatsminer-m66s-plus'],
  ['iceriver-xp0', 'iceriver/xp0'],
  ['iceriver-al0', 'iceriver/alph-al0'],
  ['iceriver-al3', 'iceriver/alph-al3'],
  ['iceriver-ks7', 'iceriver/kas-ks7'],
  ['iceriver-ae2', 'iceriver/aleo-ae2'],
  ['iceriver-ae1-lite', 'iceriver/aleo-ae1-lite'],
  ['goldshell-lt6', 'goldshell/lt6'],
  ['elphapex-dg-home-1', 'elphapex/dg-home-1'],
  ['avalon-nano-3', 'canaan/avalon-nano-3'],
  ['avalon-nano-3s', 'canaan/avalon-nano-3S'],
  ['avalon-mini-3', 'canaan/avalon-mini-3'],
  ['avalon-a15', 'canaan/a15-194t'],
  ['volcminer-d1-mini', 'volcminer/volc-mini'],
  ['fluminer-l1-pro', 'fluminer/fluminer-l1-pro'],
  ['fluminer-l2', 'fluminer/fluminer-l2'],
  ['antminer-z15-pro', 'bitmain/antminer-z15-pro'],
  ['antminer-s21j-xp-hyd', 'bitmain/antminer-s21j-xp-hyd-495th'],
  ['fluminer-t3', 'fluminer/fluminer-t3'],
  ['pinecone-inibox', 'pinecone/inibox-850mh'],
  ['pinecone-inibox-pro', 'pinecone/inibox-pro-2-4gh'],
];

const b = await chromium.launch({ args: ['--ignore-certificate-errors'] });
const ctx = await b.newContext({ ignoreHTTPSErrors: true });
const pg = await ctx.newPage();
const results = [];

for (const [key, slug] of TARGETS) {
  const url = `https://www.asicminervalue.com/miners/${slug}`;
  try {
    const resp = await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!resp || resp.status() >= 400) { results.push([key, 'PAGE_' + (resp ? resp.status() : 'ERR')]); continue; }
    await pg.waitForTimeout(1500);
    const src = await pg.locator('img[alt$="ASIC miner"]').first().getAttribute('src').catch(() => null);
    const m = src && src.match(/upload\/([^?"']*\/)?v1\/([A-Za-z0-9_-]+)/);
    const id = m ? m[2] : null;
    if (!id || !/background_removal/.test(src || '')) { results.push([key, id ? 'NOT_CLEAN' : 'NO_IMG']); continue; }
    results.push([key, 'ID ' + id]);
  } catch (e) {
    results.push([key, 'ERR ' + (e.message || '').split('\n')[0].slice(0, 40)]);
  }
}
await b.close();
for (const [k, s] of results) console.log(k.padEnd(28), s);
console.log('DONE', results.filter(r => r[1].startsWith('OK')).length, '/', TARGETS.length);
