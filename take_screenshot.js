import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    
    // Take a screenshot
    await page.screenshot({ path: 'd:\\AI\\Margin Call\\Artifacts\\runtime_screenshot.png' });
    
    await browser.close();
  } catch (error) {
    console.error('SCRIPT ERROR:', error);
  }
})();
