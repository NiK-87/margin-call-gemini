import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    
    // Catch console errors during interaction
    page.on('console', msg => { if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text()); });
    page.on('pageerror', err => console.error('BROWSER EXCEPTION:', err.toString()));
    
    // Find and click the button containing "BALANCED APE"
    const [button] = await page.$x("//button[contains(., 'BALANCED APE')]");
    if (button) {
      await button.click();
      await new Promise(r => setTimeout(r, 1000)); // wait for transition
      await page.screenshot({ path: 'd:\\AI\\Margin Call\\Artifacts\\runtime_screenshot2.png' });
      
      // Click Proceed button if on intro screen
      const [proceedBtn] = await page.$x("//button[contains(., 'ACKNOWLEDGE')]");
      if (proceedBtn) {
        await proceedBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: 'd:\\AI\\Margin Call\\Artifacts\\runtime_screenshot3.png' });
      }
    } else {
      console.log('Could not find BALANCED APE button');
    }
    
    await browser.close();
  } catch (error) {
    console.error('SCRIPT ERROR:', error);
  }
})();
