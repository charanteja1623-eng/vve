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

  // Desktop
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Capturing Homepage #events ScrollStack...');
  await page.goto('http://localhost:3000');
  await waitForPageReady(page);

  const events = page.locator('#events');
  await events.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const firstCard = page.locator('#events article').first();
  await firstCard.hover();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(brainDir, 'global-stack-home-events.png')
  });

  console.log('2. Capturing Homepage #work Featured Portfolio ScrollStack...');
  const work = page.locator('#work');
  await work.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Scroll slightly into work stack to trigger depth scaling
  await page.mouse.wheel(0, 450);
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(brainDir, 'global-stack-home-work.png')
  });

  console.log('3. Capturing Wedding Functions ScrollStack (/events/wedding-packages)...');
  await page.goto('http://localhost:3000/events/wedding-packages');
  await waitForPageReady(page);

  const weddingFunctions = page.locator('#explore-wedding-packages [data-stack-slot]').first();
  await weddingFunctions.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(brainDir, 'global-stack-wedding-functions.png')
  });

  console.log('4. Capturing Events Overview Add-Ons (/events#addons)...');
  await page.goto('http://localhost:3000/events#addons');
  await waitForPageReady(page);

  const addonsSection = page.locator('#addons');
  await addonsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const firstAddon = page.locator('#addons article').first();
  await firstAddon.hover();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(brainDir, 'global-pixelcard-services.png')
  });

  console.log('5. Capturing Mobile Stacking Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await waitForPageReady(mobilePage);

  const mobileEvents = mobilePage.locator('#events');
  await mobileEvents.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);

  await mobilePage.screenshot({
    path: path.join(brainDir, 'global-stack-mobile.png')
  });

  await browser.close();
  console.log('All visual screenshots successfully captured.');
}

main().catch(console.error);
