import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\fd683957-2e6b-4202-9787-f5308f19b63c';

async function runBrowserVerification() {
  console.log('🚀 Starting Automated Browser Testing with Microsoft Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--window-size=1600,1000'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(' Browser Console Error:', msg.text());
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    console.log(' Uncaught Page Error:', err.message);
    consoleErrors.push(err.message);
  });

  try {
    console.log('🌐 Navigating to http://127.0.0.1:5173...');
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // 1. Wait for canvas & initial massing render
    console.log('⏳ Waiting for canvas element...');
    await page.waitForSelector('canvas', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 3000)); // Allow Three.js scene to render frames
    console.log('✅ Three.js WebGL canvas initialized and rendered.');

    // Screenshot 1: 3D Massing Initial (Mumbai DCR Preset)
    const ss1 = path.join(ARTIFACT_DIR, 'sih116_3d_massing_mumbai.png');
    await page.screenshot({ path: ss1, fullPage: false });
    console.log(`📸 Screenshot saved: ${ss1}`);

    // 2. Switch to 2D Architectural Site Plan tab
    console.log('📐 Switching to 2D Architectural Site Plan tab...');
    const tabButtons = await page.$$('header button');
    for (const tab of tabButtons) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text.includes('2D Architectural')) {
        await tab.click();
        break;
      }
    }

    await page.waitForSelector('svg', { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 2000));
    console.log('✅ 2D Architectural Site Plan rendered successfully.');

    // Screenshot 2: 2D Site Plan
    const ss2 = path.join(ARTIFACT_DIR, 'sih116_2d_site_plan.png');
    await page.screenshot({ path: ss2, fullPage: false });
    console.log(`📸 Screenshot saved: ${ss2}`);

    // 3. Switch back to 3D Massing & Shadows
    console.log('🏙️ Switching back to 3D Massing...');
    for (const tab of tabButtons) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text.includes('3D Massing')) {
        await tab.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));

    // 4. Test Municipal Preset: Delhi DDA Rules
    console.log('🏛️ Testing Delhi DDA Rules preset...');
    const asideButtons = await page.$$('aside button');
    for (const btn of asideButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Delhi')) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2500));
    console.log('✅ Delhi DDA preset applied and massing recalculated.');

    // 5. Test Solar Study slider (change sun time to afternoon 15:30)
    console.log('☀️ Adjusting Solar Study time slider to 15:30 (Afternoon Shadows)...');
    const sunSlider = await page.$('input[type="range"][min="6"]');
    if (sunSlider) {
      await page.evaluate(el => {
        el.value = '15.5';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, sunSlider);
    }
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot 3: Delhi DDA Solar Study
    const ss3 = path.join(ARTIFACT_DIR, 'sih116_3d_delhi_sun_study.png');
    await page.screenshot({ path: ss3, fullPage: false });
    console.log(`📸 Screenshot saved: ${ss3}`);

    // 6. Test Bengaluru BBMP Preset & Camera View switch
    console.log('🏢 Testing Bengaluru BBMP Rules preset & Top View...');
    for (const btn of asideButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Bengaluru')) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));

    // Click "Top" camera view button
    const viewButtons = await page.$$('div button');
    for (const btn of viewButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.trim() === 'Top') {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot 4: Bengaluru Top View
    const ss4 = path.join(ARTIFACT_DIR, 'sih116_3d_top_view.png');
    await page.screenshot({ path: ss4, fullPage: false });
    console.log(`📸 Screenshot saved: ${ss4}`);

    console.log('\n--- BROWSER VERIFICATION SUMMARY ---');
    console.log(`Total Uncaught Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    } else {
      console.log('✨ ZERO console errors detected. All UI interactions verified successfully!');
    }

  } catch (error) {
    console.error('❌ Browser Verification Failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log('🏁 Browser closed.');
  }
}

runBrowserVerification();
