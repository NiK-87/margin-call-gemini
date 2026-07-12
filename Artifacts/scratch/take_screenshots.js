import puppeteer from 'puppeteer';
import path from 'path';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const artifactDir = 'C:/Users/nicko/.gemini/antigravity/brain/aafc1015-dd13-47de-9fd9-5574a6795b35';

  try {
    console.log('Navigating to game URL...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await delay(2000);

    // 1. Title Screen Screenshot
    console.log('Taking Title screen screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_title.png') });

    // 2. Choose deck and go to intro
    console.log('Selecting Balanced Ape Deck...');
    const buttons = await page.$$('.terminal-btn');
    // Find warning button (Balanced Ape)
    let selected = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('BALANCED APE')) {
        await btn.click();
        selected = true;
        break;
      }
    }
    await delay(1000);

    // 3. Office Intro Screen Screenshot
    console.log('Taking Office Intro screen screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_intro.png') });

    // Click ACCESS TRADING FLOOR
    const startBtn = await page.$('.terminal-btn');
    if (startBtn) {
      await startBtn.click();
    }
    await delay(1000);

    // 4. Daily Trade Screen Screenshot
    console.log('Taking Trading Floor screen screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_floor.png') });

    // 5. Open Debug Control Panel and screenshot it
    console.log('Opening Debug Control Panel...');
    const debugBtns = await page.$$('.terminal-btn');
    for (const btn of debugBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('DEBUG PANEL')) {
        await btn.click();
        break;
      }
    }
    await delay(800);
    console.log('Taking Debug Control Panel screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_debug.png') });

    // Force: Corner GME Float & Settle Week (Ready to Squeeze)
    console.log('Triggering Cheat: Corner GME Float & Settle Week...');
    const cheatBtns = await page.$$('.terminal-btn');
    for (const btn of cheatBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Corner GME Float & Settle Week')) {
        await btn.click();
        break;
      }
    }
    await delay(1000);

    // 6. Weekly Settle Screen (Ready to Squeeze) Screenshot
    console.log('Taking Weekly Settle Option Exercise screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_weekly_settle.png') });

    // Click INITIATE GME SHORT SQUEEZE
    console.log('Initiating Short Squeeze...');
    const sqBtns = await page.$$('.terminal-btn');
    for (const btn of sqBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('INITIATE GME SHORT SQUEEZE')) {
        await btn.click();
        break;
      }
    }
    await delay(1000);

    // 7. Squeeze War Screenshot
    console.log('Taking Squeeze War screen screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_squeeze.png') });

    // Click TRIGGER CASCADE RE-EVALUATION to complete squeeze
    console.log('Triggering short squeeze cascade evaluation...');
    const reevalBtn = await page.$('.terminal-btn.danger');
    if (reevalBtn) {
      await reevalBtn.click();
    }
    await delay(1000);

    // 8. Squeeze Victory / Game Over Screenshot
    console.log('Taking Ending screen screenshot...');
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_ending.png') });

  } catch (err) {
    console.error('Error during screen capture:', err);
  } finally {
    await browser.close();
    console.log('Finished capturing screenshots.');
  }
}

run();
