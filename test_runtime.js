import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Catch console messages
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
    
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    
    await browser.close();
  } catch (error) {
    console.error('SCRIPT ERROR:', error);
  }
})();
