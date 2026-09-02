const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.goto('file:///home/claude/repo/AI-Central-Strategic-Deck.html', { waitUntil: 'networkidle' });
  // Print layout makes every slide visible, which pulls in font weights the
  // cover alone never used. Wait for ALL faces to decode before printing,
  // otherwise Chromium prints body text during the font-block period -> blank.
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    const weights = ['300', '400', '500', '700'];
    await Promise.all(weights.map(w => document.fonts.load(`${w} 16px Inter`)));
    await document.fonts.ready;
  });
  await page.waitForTimeout(800);
  const loaded = await page.evaluate(() =>
    [...document.fonts].map(f => `${f.weight}:${f.status}`).join(' '));
  console.log('fonts:', loaded);
  await page.pdf({
    path: '/home/claude/repo/AI-Central-Strategic-Deck.pdf',
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  await browser.close();
})();
