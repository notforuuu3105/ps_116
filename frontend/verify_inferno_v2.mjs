import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACTS_DIR = 'C:/Users/Hp/.gemini/antigravity/brain/fd683957-2e6b-4202-9787-f5308f19b63c';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('🚀 Starting INFERNO Complete Verification & Screenshot Suite...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Listen for console logs and errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
    console.error('PAGE ERROR:', err.message);
  });

  try {
    // 1. Visit Home Page
    console.log('📸 1. Capturing Home Page...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_1_homepage.png'),
      fullPage: false
    });
    console.log('   Saved: inferno_v2_1_homepage.png');

    // 2. Open 6-Step New Project Wizard
    console.log('📸 2. Capturing New Project Wizard - Step 1...');
    // Click "Start a New Project" button on home page or header
    const startProjectBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes('Start a New Project') || b.textContent.includes('+ Start a New Project'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (startProjectBtn) {
      await sleep(1000);
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'inferno_v2_2_new_project_wizard_step1.png')
      });
      console.log('   Saved: inferno_v2_2_new_project_wizard_step1.png');

      // Click "Next Step" to reach Step 2
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.textContent.includes('Next') || b.textContent.includes('Continue'));
        if (nextBtn) nextBtn.click();
      });
      await sleep(600);

      // Click "Next Step" to reach Step 3 (Plot Geometry & SVG Preview)
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.textContent.includes('Next') || b.textContent.includes('Continue'));
        if (nextBtn) nextBtn.click();
      });
      await sleep(1000);
      console.log('📸 3. Capturing New Project Wizard - Step 3 (Plot Geometry with SVG)...');
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'inferno_v2_3_new_project_wizard_step3.png')
      });
      console.log('   Saved: inferno_v2_3_new_project_wizard_step3.png');

      // Close Wizard
      await page.evaluate(() => {
        const closeBtn = document.querySelector('button[title="Close Wizard"]') ||
                         Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cancel') || b.querySelector('svg.lucide-x'));
        if (closeBtn) closeBtn.click();
      });
      await sleep(800);
    }

    // 3. Enter CAD Design Workspace
    console.log('📸 4. Entering Design Workspace (3D Studio)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const studioBtn = btns.find(b => b.textContent.includes('Explore Design Studio') || b.textContent.includes('Launch 3D Studio') || b.textContent.includes('Design Studio'));
      if (studioBtn) studioBtn.click();
    });
    await sleep(2500); // Give Three.js time to render
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_4_workspace_3d_massing.png')
    });
    console.log('   Saved: inferno_v2_4_workspace_3d_massing.png');

    // 4. Switch to 2D Floor Plan Studio Tab
    console.log('📸 5. Switching to 2D Floor Plans...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const floorBtn = btns.find(b => b.textContent.includes('Floor Plans 2D') || b.textContent.includes('Floor Plans'));
      if (floorBtn) floorBtn.click();
    });
    await sleep(1500);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_5_workspace_2d_floor_plan.png')
    });
    console.log('   Saved: inferno_v2_5_workspace_2d_floor_plan.png');

    // 5. Switch to Courtyard & Landscape Tab
    console.log('📸 6. Switching to Courtyard & Landscape...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const courtBtn = btns.find(b => b.textContent.includes('Courtyard') || b.textContent.includes('Courtyard & Eco'));
      if (courtBtn) courtBtn.click();
    });
    await sleep(1200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_6_workspace_courtyard.png')
    });
    console.log('   Saved: inferno_v2_6_workspace_courtyard.png');

    // 6. Switch to Façade Designer Tab
    console.log('📸 7. Switching to Façade Designer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const facadeBtn = btns.find(b => b.textContent.includes('Façade') || b.textContent.includes('Facade'));
      if (facadeBtn) facadeBtn.click();
    });
    await sleep(1200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_7_workspace_facade.png')
    });
    console.log('   Saved: inferno_v2_7_workspace_facade.png');

    // 7. Switch to Performance Analytics Tab
    console.log('📸 8. Switching to Performance Analytics...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const analyticsBtn = btns.find(b => b.textContent.includes('Analytics') || b.textContent.includes('Performance'));
      if (analyticsBtn) analyticsBtn.click();
    });
    await sleep(1200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_8_workspace_analytics.png')
    });
    console.log('   Saved: inferno_v2_8_workspace_analytics.png');

    // 8. Switch to Design Optimizer Tab
    console.log('📸 9. Switching to Design Optimizer...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const optBtn = btns.find(b => b.textContent.includes('Optimizer') || b.textContent.includes('Design Optimizer'));
      if (optBtn) optBtn.click();
    });
    await sleep(1200);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_9_workspace_optimizer.png')
    });
    console.log('   Saved: inferno_v2_9_workspace_optimizer.png');

    // 9. Open My Projects Modal
    console.log('📸 10. Opening My Projects Modal...');
    // Go back to home or click project switcher
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const backBtn = btns.find(b => b.textContent.includes('Home') || b.textContent.includes('Back'));
      if (backBtn) backBtn.click();
    });
    await sleep(1200);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const projBtn = btns.find(b => b.textContent.includes('Projects / Gallery') || b.textContent.includes('My Projects') || b.textContent.includes('Projects ('));
      if (projBtn) projBtn.click();
    });
    await sleep(1000);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'inferno_v2_10_my_projects_modal.png')
    });
    console.log('   Saved: inferno_v2_10_my_projects_modal.png');

    console.log('✨ All screenshots captured successfully!');
    if (consoleErrors.length > 0) {
      console.warn(`⚠️ Warning: encountered ${consoleErrors.length} console errors:`, consoleErrors);
    } else {
      console.log('✅ Clean run: 0 console errors detected in browser execution.');
    }
  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
