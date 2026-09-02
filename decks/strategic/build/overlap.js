const { chromium } = require('playwright');

function rectsOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file:///home/claude/repo/AI-Central-Strategic-Deck.html');
  await page.emulateMedia({ media: 'print' });
  const results = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const out = [];
    for (const s of slides) {
      const label = s.getAttribute('data-label') || '';
      const chrome = Array.from(s.querySelectorAll('.foot, .badge'));
      const leaves = Array.from(s.querySelectorAll('*')).filter(el => {
        if (el.closest('.foot') || el.closest('.badge')) return false;
        if (el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]')) return false;
        if (el.children.length > 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      for (const c of chrome) {
        const cr = c.getBoundingClientRect();
        for (const l of leaves) {
          const lr = l.getBoundingClientRect();
          if (cr.width && lr.width &&
              !(lr.right <= cr.left || lr.left >= cr.right || lr.bottom <= cr.top || lr.top >= cr.bottom)) {
            out.push({ label, tag: l.tagName, text: (l.textContent||'').slice(0,40) });
          }
        }
      }
    }
    return out;
  });
  if (results.length) {
    console.log('OVERLAPS FOUND:');
    for (const r of results) console.log(`  ${r.label}: <${r.tag}> "${r.text}"`);
  } else {
    console.log('no chrome overlaps');
  }
  await browser.close();
  process.exit(results.length ? 1 : 0);
})();
