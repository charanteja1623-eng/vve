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

    // 3. Editorial Split-Stage: Initial state (pristine, inactive)
    const events = page.locator('#events');
    await events.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/03-categories-initial-desktop.png` });

    // 4. Click to activate first PixelCard
    const firstCategory = page.locator('#events article').first();
    await firstCategory.click();
    await page.waitForTimeout(700); // Allow 600ms reveal to complete
    await page.screenshot({ path: `${artifactDir}/03-categories-activated-desktop.png` });

    // 5. Scroll down to advance to card 2 in ScrollStack
    await page.mouse.wheel(0, 520);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${artifactDir}/04-categories-scrolled-desktop.png` });

    // 6. Artisanal Services (PixelCard grid)
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/05-services-desktop.png` });

    // 7. Featured Portfolio ScrollStack (#work)
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 480);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${artifactDir}/06-portfolio-scrollstack-desktop.png` });

    // 8. Wedding Package Explorer (Haldi, Sangeet, Reception ScrollStack)
    await page.goto('/events/wedding-packages');
    await waitForPageReady(page);
    const functionsSection = page.locator('#explore-wedding-packages');
    await functionsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${artifactDir}/07-wedding-functions-scrollstack-desktop.png` });

    // 9. Full Portfolio Gallery with PixelCards
    await page.goto('/work');
    await waitForPageReady(page);
    const firstProject = page.locator('div[role="button"][aria-haspopup="dialog"]').first();
    await firstProject.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/08-portfolio-gallery-desktop.png` });
  });

  test('Capture animated sections on Mobile (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);

    await page.screenshot({ path: `${artifactDir}/09-hero-mobile.png` });

    const events = page.locator('#events');
    await events.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/10-categories-mobile-initial.png` });

    // Tap first card to activate
    const firstCategory = page.locator('#events article').first();
    await firstCategory.click({ force: true });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${artifactDir}/11-categories-mobile-activated.png` });

    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/12-portfolio-mobile.png` });
  });
});
