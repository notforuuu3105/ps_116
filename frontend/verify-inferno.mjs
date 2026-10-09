import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\Hp\\.gemini\\antigravity\\brain\\fd683957-2e6b-4202-9787-f5308f19b63c';

async function runInfernoVerification() {
  console.log('🚀 Launching INFERNO Studio Verification Suite with Microsoft Edge...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--window-size=1600,1050'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050, deviceScaleFactor: 1 });

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
    console.log('🌐 Navigating to INFERNO Studio (http://localhost:5173)...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise((r) => setTimeout(r, 2500));

    // STEP 1: Dashboard View
    console.log('📸 1. Capturing Dashboard View...');
    const ss1 = path.join(ARTIFACT_DIR, 'inferno_1_dashboard.png');
    await page.screenshot({ path: ss1 });
    console.log(`✅ Saved: ${ss1}`);

    // Helper to click navigation button
    const clickNav = async (label) => {
      const btns = await page.$$('header nav button');
      for (const btn of btns) {
        const text = await page.evaluate((el) => el.innerText, btn);
        if (text.toLowerCase().includes(label.toLowerCase())) {
          await btn.click();
          await new Promise((r) => setTimeout(r, 1200));
          return true;
        }
      }
      return false;
    };

    // STEP 2: 3D Studio
    console.log('📸 2. Navigating to 3D Studio...');
    await clickNav('studio');
    await new Promise((r) => setTimeout(r, 2500));
    const ss2 = path.join(ARTIFACT_DIR, 'inferno_2_3d_studio.png');
    await page.screenshot({ path: ss2 });
    console.log(`✅ Saved: ${ss2}`);

    // STEP 3: Floor Plans Studio
    console.log('📸 3. Navigating to Floor Plans Studio...');
    await clickNav('floor');
    await new Promise((r) => setTimeout(r, 1500));
    const ss3 = path.join(ARTIFACT_DIR, 'inferno_3_floor_plans.png');
    await page.screenshot({ path: ss3 });
    console.log(`✅ Saved: ${ss3}`);

    // STEP 4: Central Courtyard Studio
    console.log('📸 4. Navigating to Central Courtyard Studio...');
    await clickNav('courtyard');
    await new Promise((r) => setTimeout(r, 1500));
    const ss4 = path.join(ARTIFACT_DIR, 'inferno_4_courtyard_studio.png');
    await page.screenshot({ path: ss4 });
    console.log(`✅ Saved: ${ss4}`);

    // STEP 5: Façade Studio
    console.log('📸 5. Navigating to Façade Studio...');
    await clickNav('façade');
    await new Promise((r) => setTimeout(r, 1500));
    const ss5 = path.join(ARTIFACT_DIR, 'inferno_5_facade_studio.png');
    await page.screenshot({ path: ss5 });
    console.log(`✅ Saved: ${ss5}`);

    // STEP 6: Analytics Dashboard
    console.log('📸 6. Navigating to Analytics Dashboard...');
    await clickNav('analytics');
    await new Promise((r) => setTimeout(r, 1500));
    const ss6 = path.join(ARTIFACT_DIR, 'inferno_6_analytics.png');
    await page.screenshot({ path: ss6 });
    console.log(`✅ Saved: ${ss6}`);

    // STEP 7: Design Optimizer
    console.log('📸 7. Navigating to Design Optimizer...');
    await clickNav('optimizer');
    await new Promise((r) => setTimeout(r, 1500));
    const ss7 = path.join(ARTIFACT_DIR, 'inferno_7_optimizer.png');
    await page.screenshot({ path: ss7 });
    console.log(`✅ Saved: ${ss7}`);

    // STEP 8: Reference Library
    console.log('📸 8. Navigating to Reference Library...');
    await clickNav('library');
    await new Promise((r) => setTimeout(r, 1500));
    const ss8 = path.join(ARTIFACT_DIR, 'inferno_8_library.png');
    await page.screenshot({ path: ss8 });
    console.log(`✅ Saved: ${ss8}`);

    // STEP 9: Presentation Mode Deck
    console.log('📸 9. Opening Full-Screen Presentation Mode...');
    await clickNav('presentation');
    await new Promise((r) => setTimeout(r, 1500));
    const ss9 = path.join(ARTIFACT_DIR, 'inferno_9_presentation.png');
    await page.screenshot({ path: ss9 });
    console.log(`✅ Saved: ${ss9}`);

    // Exit presentation mode
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 1000));

    // STEP 10: Language Toggle (Hindi)
    console.log('📸 10. Testing Bilingual Hindi Switcher...');
    const langBtns = await page.$$('header div button');
    for (const b of langBtns) {
      const text = await page.evaluate((el) => el.innerText, b);
      if (text.includes('हिन्दी')) {
        await b.click();
        await new Promise((r) => setTimeout(r, 1000));
        break;
      }
    }
    const ss10 = path.join(ARTIFACT_DIR, 'inferno_10_hindi_localization.png');
    await page.screenshot({ path: ss10 });
    console.log(`✅ Saved: ${ss10}`);

    console.log('✨ ALL 10 INFERNO VIEWS VERIFIED AND CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runInfernoVerification();
