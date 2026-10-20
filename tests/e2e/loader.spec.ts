import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = path.resolve(process.cwd(), 'test-results/loader-audit');

test.describe('VVE Gate 4: Cinematic Gilded Seal Logo Loader Suite (~5s & Reload Replay)', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(ARTIFACT_DIR)) {
      fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test.afterEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('Gilded Seal Loader: 5-second cinematic duration, golden particles, scroll locking, and clean unmount', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 15000 });

    // 1. Accessibility attributes
    expect(await loader.getAttribute('role')).toBe('status');
    expect(await loader.getAttribute('aria-live')).toBe('polite');

    // 2. Structural presence for Cinematic Gilded Seal & Particle Assembly
    const frameWrap = loader.locator('.vve-seal-reveal-wrap');
    await expect(frameWrap).toBeAttached();

    const frameImg = loader.locator('.vve-frame-base');
    await expect(frameImg).toBeAttached();

    const shimmer = loader.locator('.vve-shimmer-sweep');
    await expect(shimmer).toBeAttached();

    const particles = loader.locator('.vve-particle-constellation');
    await expect(particles).toBeAttached();

    // 3. Obsolete elements from legacy loaders must not exist
    const canvas = loader.locator('.vve-dust-canvas');
    expect(await canvas.count(), 'Canvas particle system must be removed in Concept 3/4').toBe(0);

    const shards = loader.locator('.vve-shard');
    expect(await shards.count(), 'Tile shards must not exist in Concept 3/4').toBe(0);

    // 4. Scroll locking while loader is active
    await expect(page.locator('html')).toHaveAttribute('data-loader-active', 'true', { timeout: 15000 });
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow, 'Body overflow must be hidden while loader is active').toBe('hidden');

    // 5. Hero branding hidden while loader is active to prevent duplication
    const heroBrand = page.locator('.hero-brand-lockup');
    if (await heroBrand.count() > 0) {
      const heroOpacity = await heroBrand.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(heroOpacity).toBe('0');
    }

    // 6. Wordmark verification
    const wordmark = loader.locator('.vve-wordmark');
    await expect(wordmark).toBeAttached();
    expect(await wordmark.textContent()).toContain('VINTAGE');
    expect(await wordmark.textContent()).toContain('VIBE');
    expect(await wordmark.textContent()).toContain('EVENTS');

    // 7. Tagline verification
    const tagline = loader.locator('.vve-tagline');
    await expect(tagline).toBeAttached();
    await expect(tagline).toContainText('Creating moments.');
    await expect(tagline).toContainText('Designing memories.');

    // 8. Wait for graceful exit and unmount from DOM (target ~5,000ms duration)
    await loader.waitFor({ state: 'detached', timeout: 15000 });

    const totalDuration = await page.evaluate(() => {
      const w = window as unknown as { __vve_loader_mount_time?: number; __vve_loader_unmount_time?: number };
      const start = w.__vve_loader_mount_time || 0;
      const end = w.__vve_loader_unmount_time || performance.now();
      return Math.round(end - start);
    });

    // Minimum display requirement >= 4,800ms
    expect(
      totalDuration,
      `Expected loader visible duration >= 4,800ms, but exited in ${totalDuration}ms`
    ).toBeGreaterThanOrEqual(4800);

    // Maximum failsafe detachment <= 6,800ms
    expect(
      totalDuration,
      `Expected loader detachment <= 6,800ms, but took ${totalDuration}ms`
    ).toBeLessThanOrEqual(6800);

    // 9. Scroll restored cleanly after exit
    await expect(page.locator('html')).not.toHaveAttribute('data-loader-active', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-loader-done', 'true');
    const restoredBodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(restoredBodyOverflow).not.toBe('hidden');

    // 10. Hero branding revealed
    if (await heroBrand.count() > 0) {
      await expect(heroBrand).toBeVisible();
    }

    expect(consoleErrors).toHaveLength(0);
  });

  test('Full-page reload replay: replays on every reload without session-once dismissal; ?loader=skip bypasses', async ({ page }) => {
    // 1. First visit: loader plays
    await page.goto('/');
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 10000 });
    await loader.waitFor({ state: 'detached', timeout: 15000 });

    // 2. Full-page reload: loader MUST replay on reload as explicitly requested
    await page.reload();
    const reloadLoader = page.locator('.vve-loader');
    await expect(reloadLoader).toBeVisible({ timeout: 10000 });
    await reloadLoader.waitFor({ state: 'detached', timeout: 15000 });

    // 3. Visiting with ?loader=skip skips immediately
    await page.goto('/?loader=skip');
    const skippedLoader = page.locator('.vve-loader');
    await expect(skippedLoader).toHaveCount(0, { timeout: 4000 });
  });

  test('Prefers-reduced-motion presents static logo and exits swiftly without unnecessary waiting', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/?reducedMotion=true', { waitUntil: 'domcontentloaded' });
    const loader = page.locator('.vve-loader');

    if (await loader.count() > 0) {
      await loader.waitFor({ state: 'detached', timeout: 10000 });
    }

    const loaderDuration = await page.evaluate(() => {
      const w = window as unknown as { __vve_loader_mount_time?: number; __vve_loader_unmount_time?: number };
      const start = w.__vve_loader_mount_time || 0;
      const end = w.__vve_loader_unmount_time || performance.now();
      return Math.round(end - start);
    });

    // Reduced motion must exit swiftly (< 1,500ms)
    expect(
      loaderDuration,
      `Expected reduced-motion loader exit swiftly (< 1,500ms), but took ${loaderDuration}ms`
    ).toBeLessThan(1500);

    // Verify scroll locking is cleanly released
    await expect(page.locator('html')).not.toHaveAttribute('data-loader-active', 'true', { timeout: 5000 });
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).not.toBe('hidden');
  });

  test('Visual frame capture at 1920x1080 and 390x844', async ({ page }) => {
    // Desktop frame capture
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 10000 });

    // Capture during active particle assembly & seal reveal (~1200ms)
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${ARTIFACT_DIR}/desktop-seal-reveal.png` });

    // Wait for exit and capture revealed homepage
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/desktop-revealed-home.png` });

    // Mobile frame capture
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const mobileLoader = page.locator('.vve-loader');
    await expect(mobileLoader).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${ARTIFACT_DIR}/mobile-seal-reveal.png` });

    await mobileLoader.waitFor({ state: 'detached', timeout: 15000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/mobile-revealed-home.png` });
  });

});
