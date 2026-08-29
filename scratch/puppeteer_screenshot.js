const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log("Launching Puppeteer with Edge...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false,
    args: ['--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  console.log("Navigating to Gemini share link...");
  await page.goto("https://gemini.google.com/share/7ef73b6f8dce?skid=2519aeca-0eb6-4430-b61e-1ae5eccb0b86", {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log("Waiting for Continue button...");
  await new Promise(r => setTimeout(r, 4000));

  // Click any button containing 'Continue' or '繼續' or click the continue-button selector
  try {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
      const target = btns.find(b => b.innerText && (b.innerText.includes('Continue') || b.innerText.includes('繼續')));
      if (target) {
        target.click();
        return target.innerText;
      }
      return null;
    });
    console.log("Clicked continue button:", clicked);
  } catch (e) {
    console.log("Error clicking continue:", e.message);
  }

  console.log("Waiting 8 seconds for shared conversation content to render...");
  await new Promise(r => setTimeout(r, 8000));

  const text = await page.evaluate(() => document.body.innerText);
  console.log("Body innerText length after continue:", text.length);
  fs.writeFileSync('scratch/gemini_innerText_continued.txt', text, 'utf-8');

  const screenshotPath = path.resolve(__dirname, 'gemini_share_continued.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log("Full page screenshot saved to:", screenshotPath);

  await browser.close();
}

run().catch(err => {
  console.error("Puppeteer script error:", err);
  process.exit(1);
});
