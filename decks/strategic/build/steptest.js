const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file:///home/claude/repo/AI-Central-Strategic-Deck.html#3', { waitUntil: 'networkidle' });

  const state = () => page.evaluate(() => {
    const s = document.querySelector('.slide.on');
    const steps = [...s.querySelectorAll('[data-step]')];
    const grp = new Set(steps.map(e => e.dataset.step));
    const rev = new Set(steps.filter(e => e.classList.contains('rev')).map(e => e.dataset.step));
    const vis = steps.length ? getComputedStyle(steps[0]).opacity : 'n/a';
    return { label: s.dataset.label, groups: grp.size, revealed: rev.size, firstOpacity: vis };
  });

  console.log('initial slide 3:', JSON.stringify(await state()));
  for (let k = 1; k <= 4; k++) {
    await page.mouse.click(1700, 900);
    await page.waitForTimeout(120);
    console.log('after click', k, ':', JSON.stringify(await state()));
  }
  await page.mouse.click(1700, 900); // 5th click should advance to slide 4
  await page.waitForTimeout(120);
  console.log('after click 5:', JSON.stringify(await state()));
  await page.mouse.click(200, 900);  // left click: un-reveal or go back
  await page.waitForTimeout(120);
  console.log('after back:', JSON.stringify(await state()));

  // per-slide group counts
  const counts = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
    const g = new Set([...s.querySelectorAll('[data-step]')].map(e => e.dataset.step));
    return `${i + 1}:${g.size}`;
  }).join(' '));
  console.log('groups per slide:', counts);
  await browser.close();
})();
