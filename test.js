const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Wait for the page to render
  await page.waitForTimeout(2000);
  
  // Find what element is at the center of the screen
  const targetElement = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return {
      tagName: el ? el.tagName : 'NONE',
      className: el ? el.className : 'NONE',
      id: el ? el.id : 'NONE'
    };
  });
  
  console.log('Element at center blocking clicks:', targetElement);
  
  // Find what element is over the "Continue with Microsoft" button
  const micButton = await page.evaluate(() => {
    // Find button containing "Continue with Microsoft"
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Microsoft'));
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    const elOver = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return {
      tagName: elOver ? elOver.tagName : 'NONE',
      className: elOver ? elOver.className : 'NONE',
      btnText: btn.textContent
    };
  });
  
  console.log('Element over Microsoft button:', micButton);
  
  await browser.close();
})();
