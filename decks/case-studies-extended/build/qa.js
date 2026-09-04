// Generic QA for any deck: overflow per slide + footer collisions, in print layout.
// Usage: DECK=/abs/path.html [SHOTS=/dir] [PDF=/abs/out.pdf] node qa.js
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const deck = process.env.DECK;
  if (!deck) throw new Error('DECK env var required');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + deck, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await Promise.all(['300','400','500','700'].map(w => document.fonts.load(w + ' 16px Inter')));
    await document.fonts.ready;
  });
  await page.waitForTimeout(500);

  const report = await page.evaluate(() => {
    const out = [];
    for (const [i, s] of [...document.querySelectorAll('.slide')].entries()) {
      const label = s.getAttribute('data-label') || '';
      const dy = s.scrollHeight - s.clientHeight, dx = s.scrollWidth - s.clientWidth;
      const chrome = [...s.querySelectorAll('.foot, .badge')];
      const leaves = [...s.querySelectorAll('*')].filter(el =>
        !el.closest('.foot') && !el.closest('.badge') &&
        !el.closest('[aria-hidden="true"]') && el.children.length === 0);
      const hits = [];
      for (const c of chrome) {
        const cr = c.getBoundingClientRect();
        for (const l of leaves) {
          const lr = l.getBoundingClientRect();
          if (cr.width && lr.width && !(lr.right <= cr.left || lr.left >= cr.right || lr.bottom <= cr.top || lr.top >= cr.bottom))
            hits.push((l.textContent || l.tagName).slice(0, 40));
        }
      }
      out.push({ i: i + 1, label, dy, dx, hits });
    }
    return out;
  });
  let bad = false;
  for (const r of report) {
    const flag = r.dy > 2 || r.dx > 2 || r.hits.length;
    if (flag) bad = true;
    console.log(`${flag ? 'FAIL' : 'ok  '} #${String(r.i).padStart(2)} ${r.label.padEnd(28)} dy:${r.dy} dx:${r.dx}${r.hits.length ? '  overlaps: ' + r.hits.join(' | ') : ''}`);
  }

  if (process.env.SHOTS) {
    fs.mkdirSync(process.env.SHOTS, { recursive: true });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++)
      await slides[i].screenshot({ path: `${process.env.SHOTS}/slide-${String(i + 1).padStart(2, '0')}.png` });
    console.log('screenshots ->', process.env.SHOTS);
  }
  if (process.env.PDF) {
    await page.pdf({ path: process.env.PDF, width: '1920px', height: '1080px', printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 } });
    console.log('pdf ->', process.env.PDF);
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
