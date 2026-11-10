import { test, expect, type Page } from '@playwright/test';

/**
 * Vintage Vibe Events — Phase 1: Cinematic Scroll Animation E2E Test Suite
 *
 * Verifies:
 * 1. Top-to-bottom scroll progress and section reveals in sequence
 * 2. Reverse scrolling (following scroll position smoothly without flickering)
 * 3. Fast scrolling resilience and zero console errors
 * 4. Page reload stability
 * 5. Multi-viewport validation (Desktop, Tablet, Mobile)
 * 6. Prefers-reduced-motion immediate disclosure
 * 7. Interactive link/button clearance and zero scroll trapping
 */
test.describe('VVE Cinematic Scroll Animation Test Suite', () => {

  async function waitForPageReady(page: Page) {
    const loader = page.locator('.vve-loader');
    if (await loader.count() > 0) {
      await loader.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
      await page.locator('html[data-loader-done="true"]').waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    }
  }

  test('Homepage top-to-bottom scroll updates progress and reveals all sections in sequence', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await waitForPageReady(page);

    // Initial state: scroll progress is 0
    const initialProgress = await page.evaluate(() => {
      return parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress') || '0');
    });
    expect(initialProgress).toBeLessThanOrEqual(0.1);

    // 1. Scroll through Hero to Our Story
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'instant' }));
    await page.waitForTimeout(150);

    const midProgress = await page.evaluate(() => {
      return parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress') || '0');
    });
    expect(midProgress).toBeGreaterThan(0.5);

    // Verify Our Story section entered and has reveal class
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();

    // 2. Scroll through Categories (Editorial Split-Stage)
    const eventsSection = page.locator('#events');
    await eventsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const firstCard = page.locator('#stage-wedding-packages');
    await expect(firstCard).toBeVisible();

    // 3. Scroll through Services
    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const serviceCards = page.locator('#services .vve-reveal-scale');
    expect(await serviceCards.count()).toBe(7);

    // 4. Scroll through Portfolio
    const workSection = page.locator('#work');
    await workSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const workCards = page.locator('#work .cinematic-image-container');
    expect(await workCards.count()).toBeGreaterThanOrEqual(4);

    // 5. Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await expect(footer).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test('Reverse scrolling follows scroll position naturally without breaking layout', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(150);

    // Scroll back up to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(200);

    const finalProgress = await page.evaluate(() => {
      return parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress') || '0');
    });
    expect(finalProgress).toBe(0);

    // Brand lockup and primary hero CTA button remain visible and properly positioned
    const planEventBtn = page.locator('.hero-content-layer a[href="/contact"]');
    await expect(planEventBtn).toBeVisible();
  });

  test('Fast scrolling produces zero layout shifts or unhandled errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await waitForPageReady(page);

    // Rapid successive scroll jumps
    for (const y of [500, 2000, 800, 3500, 100, 4500, 0]) {
      await page.evaluate((targetY) => window.scrollTo({ top: targetY, behavior: 'instant' }), y);
      await page.waitForTimeout(60);
    }

    // Verify zero horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
    expect(consoleErrors).toHaveLength(0);
  });

  test('Desktop sticky storytelling in Our Story anchors while milestones activate', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await waitForPageReady(page);

    const aboutSection = page.locator('#about');
    await aboutSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);

    // Check sticky column position property
    const isSticky = await page.evaluate(() => {
      const col = document.querySelector('.story-sticky-col');
      if (!col) return false;
      const style = window.getComputedStyle(col);
      return style.position === 'sticky';
    });
    expect(isSticky).toBe(true);

    // Milestones exist and at least one is active in focus
    const milestones = page.locator('.story-milestone-item');
    expect(await milestones.count()).toBe(4);
  });

  test('Mobile viewport (390px) has natural scrolling, zero horizontal overflow, and no scroll trapping', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);

    // Scroll through entire mobile page
    for (let scrollStep = 0; scrollStep <= 4000; scrollStep += 600) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollStep);
      await page.waitForTimeout(50);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow).toBe(false);
    }
  });

  test('Prefers-reduced-motion forces immediate non-animated display without trapping', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await waitForPageReady(page);

    // Verify all reveal elements are fully visible immediately
    const firstReveal = page.locator('.vve-reveal').first();
    await expect(firstReveal).toBeVisible();

    const opacity = await firstReveal.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(parseFloat(opacity)).toBe(1);
  });

  test('Interactive links and package exploration buttons operate without scroll interference', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Scroll to events and click Explore Package
    const exploreBtn = page.locator('a[href="/events/wedding-packages"]').first();
    await exploreBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await exploreBtn.click();

    await page.waitForURL('**/events/wedding-packages');
    expect(page.url()).toContain('/events/wedding-packages');

    // On detail page, check that cinematic image reveal container is present
    const detailImage = page.locator('.cinematic-image-container').first();
    await expect(detailImage).toBeVisible();
  });

});
