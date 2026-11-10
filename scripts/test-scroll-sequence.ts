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
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000');
  await waitForPageReady(page);
  await page.waitForTimeout(500);

  const brainDir = 'C:/Users/Tej/.gemini/antigravity/brain/46e802bd-3add-4684-a7a7-f20f29604116';

  const checkState = async (stepLabel: string) => {
    return await page.evaluate((label) => {
      const slots = Array.from(document.querySelectorAll('[data-stack-slot]')) as HTMLElement[];
      const info = slots.map((s, idx) => {
        const rect = s.getBoundingClientRect();
        const card = s.firstElementChild as HTMLElement | null;
        return {
          idx,
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          transform: card?.style.transform || 'none',
          dim: card?.style.getPropertyValue('--scroll-stack-dim') || '0'
        };
      });
      return { label, scrollY: Math.round(window.scrollY), info };
    }, stepLabel);
  };

  // Phase 1: Initial stack position (Card 0 pins at ~85px)
  await page.evaluate(() => {
    window.scrollTo({ top: 2200, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const state1 = await checkState('1. Initial Stack Position (Card 0 Pinned)');
  console.log(JSON.stringify(state1, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'stack-phase1-initial.png') });

  // Phase 2: Second card entering foreground and overlapping Card 0
  await page.evaluate(() => {
    window.scrollTo({ top: 3150, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const state2 = await checkState('2. Card 1 Enters Foreground Overlapping Card 0');
  console.log(JSON.stringify(state2, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'stack-phase2-card1.png') });

  // Phase 3: Middle of sequence (Card 2 / 3 in foreground, Cards 0 & 1 layered behind)
  await page.evaluate(() => {
    window.scrollTo({ top: 5050, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const state3 = await checkState('3. Middle Sequence (Cards Layered in 3D Stack)');
  console.log(JSON.stringify(state3, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'stack-phase3-middle.png') });

  // Phase 4: Final card (Card 5 - New Year Parties) entering foreground
  await page.evaluate(() => {
    window.scrollTo({ top: 6950, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const state4 = await checkState('4. Final Card 5 in Foreground');
  console.log(JSON.stringify(state4, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'stack-phase4-final.png') });

  // Phase 5: End of stack & release into next section
  await page.evaluate(() => {
    window.scrollTo({ top: 7800, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  const state5 = await checkState('5. End of Stack & Release into Next Section');
  console.log(JSON.stringify(state5, null, 2));
  await page.screenshot({ path: path.join(brainDir, 'stack-phase5-release.png') });

  await browser.close();
  console.log('Scroll sequence simulation complete!');
}

main().catch(console.error);
