const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file:///home/claude/repo/AI-Central-Strategic-Deck.html');
  await page.emulateMedia({ media: 'print' });
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: `/home/claude/build/shots/slide-${String(i+1).padStart(2,'0')}.png` });
  }
  await browser.close();
})();
