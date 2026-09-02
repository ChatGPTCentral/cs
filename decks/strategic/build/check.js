const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file:///home/claude/repo/AI-Central-Strategic-Deck.html');
  await page.emulateMedia({ media: 'print' });
  const results = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide'));
    return slides.map((s, i) => {
      const label = s.getAttribute('data-label') || `slide-${i+1}`;
      const overflowY = s.scrollHeight - s.clientHeight;
      const overflowX = s.scrollWidth - s.clientWidth;
      return { i: i+1, label, overflowY, overflowX, h: s.clientHeight, w: s.clientWidth, sh: s.scrollHeight, sw: s.scrollWidth };
    });
  });
  let bad = false;
  for (const r of results) {
    const flagY = r.overflowY > 2;
    const flagX = r.overflowX > 2;
    if (flagY || flagX) bad = true;
    console.log(`${flagY||flagX ? 'OVERFLOW' : 'ok      '}  #${r.i} ${r.label}  h:${r.h} sh:${r.sh} (Δ${r.overflowY})  w:${r.w} sw:${r.sw} (Δ${r.overflowX})`);
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
