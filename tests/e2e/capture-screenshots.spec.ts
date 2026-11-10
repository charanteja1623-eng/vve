import { test, type Page } from '@playwright/test';

test.describe('Capture Visual Verification Screenshots', () => {
  const artifactDir = 'C:/Users/Tej/.gemini/antigravity/brain/46e802bd-3add-4684-a7a7-f20f29604116/screenshots';

  async function waitForPageReady(page: Page) {
    const loader = page.locator('.vve-loader');
    if (await loader.count() > 0) {
      await loader.waitFor({ state: 'detached', timeout: 15000 }).catch(() => { });
      await page.locator('html[data-loader-done="true"]').waitFor({ state: 'attached', timeout: 15000 }).catch(() => { });
    }
  }

  test('Capture animated sections on Desktop (1440x900)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await waitForPageReady(page);

    // 1. Hero
    await page.screenshot({ path: `${artifactDir}/01-hero-desktop.png` });

    // 2. Our Story (Sticky Storytelling Stage)
    const about = page.locator('#about');
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/02-story-sticky-desktop.png` });

    // 3. Editorial Split-Stage (Event Categories ScrollStack + PixelCard)
    const events = page.locator('#events');
    await events.scrollIntoViewIfNeeded();
    const firstCategory = page.locator('#events article').first();
    await firstCategory.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/03-categories-desktop.png` });

    // 4. Artisanal Services (PixelCard grid)
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/04-services-desktop.png` });

    // 5. Featured Portfolio ScrollStack (#work)
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${artifactDir}/05-portfolio-scrollstack-desktop.png` });

    // 6. Wedding Package Explorer (Haldi, Sangeet, Reception ScrollStack)
    await page.goto('/events/wedding-packages');
    await waitForPageReady(page);
    const functionsSection = page.locator('#explore-wedding-packages');
    await functionsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${artifactDir}/06-wedding-functions-scrollstack-desktop.png` });

    // 7. Full Portfolio Gallery with PixelCards
    await page.goto('/work');
    await waitForPageReady(page);
    const firstProject = page.locator('div[role="button"][aria-haspopup="dialog"]').first();
    await firstProject.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/07-portfolio-gallery-desktop.png` });
  });

  test('Capture animated sections on Mobile (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);

    await page.screenshot({ path: `${artifactDir}/08-hero-mobile.png` });

    const events = page.locator('#events');
    await events.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/09-categories-mobile.png` });

    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/10-portfolio-mobile.png` });
  });
});
