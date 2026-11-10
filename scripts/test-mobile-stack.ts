import { chromium, type Page } from '@playwright/test';
import * as path from 'path';

async function waitForPageReady(page: Page) {
  const loader = page.locator('.vve-loader');
  if (await loader.count() > 0) {
    await loader.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
    await page.locator('html[data-loader-done="true"]').waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
  }
}

async function main() {
  const browser = await chromium.launch();
  const brainDir = 'C:/Users/Tej/.gemini/antigravity/brain/46e802bd-3add-4684-a7a7-f20f29604116';

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const page = await mobileContext.newPage();

  console.log('Testing mobile stack...');
  await page.goto('http://localhost:3000');
  await waitForPageReady(page);
  await page.waitForTimeout(500);

  // Scroll to events on mobile
  await page.evaluate(() => {
    const el = document.querySelector('#events');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(brainDir, 'stack-mobile-card0.png') });

  // Scroll down by 550px on mobile
  await page.evaluate(() => {
    window.scrollBy({ top: 550, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(brainDir, 'stack-mobile-card1.png') });

  // Check horizontal overflow on mobile
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });
  console.log('Mobile overflow check:', overflow);

  await browser.close();
  console.log('Mobile stack test complete!');
}

main().catch(console.error);

