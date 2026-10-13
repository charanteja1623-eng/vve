import { test, expect } from '@playwright/test';

test.describe('VVE Cinematic Logo Loader (5-Second Sequence)', () => {

  test('Loader displays for at least 5,000ms and exits cleanly', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const startTime = Date.now();
    await page.goto('/?loader=always');

    const loader = page.locator('.vve-loader');

    // 1. Loader is immediately visible on first mount
    await expect(loader).toBeVisible();
    expect(await loader.getAttribute('role')).toBe('status');
    expect(await loader.getAttribute('aria-live')).toBe('polite');

    // 2. Official frame, shards, and wordmark components exist
    const baseFrame = loader.locator('.vve-frame-base');
    const shards = loader.locator('.vve-shard');
    const wordmark = loader.locator('.vve-wordmark');
    const shimmer = loader.locator('.vve-shimmer');
    const tagline = loader.locator('.vve-tagline');

    await expect(baseFrame).toBeAttached();
    expect(await shards.count()).toBe(33);
    await expect(wordmark).toBeAttached();
    await expect(shimmer).toBeAttached();
    await expect(tagline).toBeAttached();
    await expect(tagline).toContainText('Creating moments.');
    await expect(tagline).toContainText('Designing memories.');

    // 3. Ensure loader is visibly active during sequence
    await expect(loader).toBeVisible();

    // 4. Wait for graceful exit and detachment from DOM
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    const totalDuration = Date.now() - startTime;

    // 5. Empirical assertion: total visible duration >= 5,000ms
    expect(
      totalDuration,
      `Expected loader to stay visible >= 5,000ms, but exited in ${totalDuration}ms`,
    ).toBeGreaterThanOrEqual(5000);

    // 6. Zero unhandled JavaScript runtime exceptions
    expect(consoleErrors).toHaveLength(0);
  });

  test('Prefers-reduced-motion presents static logo and honors 5-second minimum duration', async ({ page }) => {
    // Emulate OS reduced-motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const startTime = Date.now();
    await page.goto('/?loader=always');

    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible();

    // In reduced motion, shards are skipped in favor of the canonical LogoMark and static tagline
    const staticTagline = loader.locator('.vve-tagline--static');
    await expect(staticTagline).toBeVisible();
    await expect(staticTagline).toContainText('Creating moments.');

    // Wait for exit
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    const totalDuration = Date.now() - startTime;

    expect(
      totalDuration,
      `Expected reduced-motion loader >= 5,000ms, but exited in ${totalDuration}ms`,
    ).toBeGreaterThanOrEqual(5000);
  });

  test('Visual frame capture across the 5-second cinematic sequence', async ({ page }) => {
    const artifactDir = 'C:/Users/DELL/.gemini/antigravity-ide/brain/c550ea91-8dff-4e16-a791-ddc1fea13f6a/loader-frames';
    await page.goto('/?loader=always');
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible();

    // Frame 1: ~1.2s - fragments actively converging
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${artifactDir}/frame-1-fragments.png` });

    // Frame 2: ~3.5s - assembled logo mark & light sweep
    await page.waitForTimeout(2300);
    await page.screenshot({ path: `${artifactDir}/frame-2-assembled-shimmer.png` });

    // Frame 3: ~4.5s - tagline reveal & holding state
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${artifactDir}/frame-3-tagline-hold.png` });

    // Frame 4: ~6.0s - post-dissolve homepage reveal
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    await page.screenshot({ path: `${artifactDir}/frame-4-homepage-revealed.png` });
  });
});
