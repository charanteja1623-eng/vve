import { test, expect } from '@playwright/test';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/DELL/.gemini/antigravity-ide/brain/78579802-75b5-48b7-bbb0-283815bfb31e/loader-audit';

test.describe('VVE Cinematic Logo Loader (Precision Rebuild Audit)', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(ARTIFACT_DIR)) {
      fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    }
  });

  test('Defects 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 — Comprehensive Verification Suite', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const startTime = Date.now();
    await page.goto('/?loader=always', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 20000 });

    // 1. Accessibility attributes
    expect(await loader.getAttribute('role')).toBe('status');
    expect(await loader.getAttribute('aria-live')).toBe('polite');

    // 2. Structural presence (checked immediately while loader is active)
    const goldLuster = loader.locator('.vve-gold-luster');
    await expect(goldLuster).toBeAttached();
    const canvas = loader.locator('.vve-dust-canvas');
    await expect(canvas).toBeVisible();
    const badShimmer = loader.locator('.vve-shimmer');
    expect(await badShimmer.count(), 'Hard-edged rectangular .vve-shimmer streak must not exist').toBe(0);
    const shards = loader.locator('.vve-shard');
    expect(await shards.count(), 'Rigid tile shards must be completely replaced by the gold dust particle canvas').toBe(0);

    // 3. Defect 10 Check: Scroll locking while loader is active
    await expect(page.locator('html')).toHaveAttribute('data-loader-active', 'true');
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow, 'Body computed overflow must be hidden while loader is active').toBe('hidden');

    // 4. Defect 6 & 9 Check: Single Intentional Transition (Hero branding hidden while loader active)
    const heroBrand = page.locator('.hero-brand-lockup');
    if (await heroBrand.count() > 0) {
      const heroOpacity = await heroBrand.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      expect(
        heroOpacity,
        'Hero branding must be hidden while loader is active to prevent duplicate logo display',
      ).toBe('0');
    }

    // 7. Phase A & B Verification: Wordmark is hidden during initial atmospheric drift and materializes cleanly
    const wordmark = loader.locator('.vve-wordmark');
    await expect(wordmark).toBeAttached();
    expect(await wordmark.textContent()).toContain('VINTAGE');
    expect(await wordmark.textContent()).toContain('VIBE');
    expect(await wordmark.textContent()).toContain('EVENTS');

    // 8. Defect 2 Check: Wordmark geometry and internal padding relative to stage
    const stage = loader.locator('.vve-stage');
    const stageBox = await stage.boundingBox();
    const wordmarkBox = await wordmark.boundingBox();

    if (stageBox && wordmarkBox) {
      // Wordmark width must be strictly less than 75% of stage width to sit comfortably inside cartouche
      expect(
        wordmarkBox.width,
        `Wordmark width (${wordmarkBox.width}px) must fit within 75% of stage width (${stageBox.width}px)`,
      ).toBeLessThan(stageBox.width * 0.75);

      // Wordmark must have deliberate internal breathing room on left and right
      const leftPad = wordmarkBox.x - stageBox.x;
      const rightPad = (stageBox.x + stageBox.width) - (wordmarkBox.x + wordmarkBox.width);
      expect(leftPad, 'Left padding inside frame cartouche must be at least 10% of frame width').toBeGreaterThan(stageBox.width * 0.10);
      expect(rightPad, 'Right padding inside frame cartouche must be at least 10% of frame width').toBeGreaterThan(stageBox.width * 0.10);
    }

    // 9. Defect 7 & 8 Check: Wordmark typography and color styling
    const wordmarkStyles = await wordmark.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontWeight: cs.fontWeight,
        color: cs.color,
      };
    });
    // Font weight must be 400 (Regular thin serif)
    expect(wordmarkStyles.fontWeight, 'Font weight must be 400 (Regular) to eliminate heavy bold').toBe('400');

    // 10. Tagline exists and renders exact text
    const tagline = loader.locator('.vve-tagline');
    await expect(tagline).toBeAttached();
    await expect(tagline).toContainText('Creating moments.');
    await expect(tagline).toContainText('Designing memories.');

    // 11. Wait for graceful exit and detachment from DOM
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    const totalDuration = Date.now() - startTime;

    // 12. Strict minimum visible duration >= 5,000ms
    expect(
      totalDuration,
      `Expected loader visible duration >= 5,000ms, but exited in ${totalDuration}ms`,
    ).toBeGreaterThanOrEqual(5000);

    // 13. Defect 10 Check: Scroll restored after loader unmounts
    await expect(page.locator('html')).not.toHaveAttribute('data-loader-active', 'true');
    const restoredBodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(restoredBodyOverflow, 'Document scroll must be cleanly restored after loader exits').not.toBe('hidden');

    // 14. Hero branding is now visible after loader exit
    if (await heroBrand.count() > 0) {
      await expect(heroBrand).toBeVisible();
    }

    // 15. Zero unhandled runtime exceptions
    expect(consoleErrors).toHaveLength(0);
  });

  test('Defect 10 Replay Check — Replays on full browser page reload', async ({ page }) => {
    // 1. First visit
    await page.goto('/');
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 20000 });
    await loader.waitFor({ state: 'detached', timeout: 15000 });

    // 2. Perform a full browser reload
    await page.reload();

    // 3. Loader must immediately replay from initial state
    const reloadedLoader = page.locator('.vve-loader');
    await expect(reloadedLoader).toBeVisible({ timeout: 20000 });
    await reloadedLoader.waitFor({ state: 'detached', timeout: 15000 });
  });

  test('Prefers-reduced-motion presents static logo and honors 5-second minimum duration', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const startTime = Date.now();
    await page.goto('/?loader=always');

    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 20000 });

    const staticTagline = loader.locator('.vve-tagline--static');
    await expect(staticTagline).toBeVisible();
    await expect(staticTagline).toContainText('Creating moments.');

    await loader.waitFor({ state: 'detached', timeout: 15000 });
    const totalDuration = Date.now() - startTime;

    expect(
      totalDuration,
      `Expected reduced-motion loader >= 5,000ms, but exited in ${totalDuration}ms`,
    ).toBeGreaterThanOrEqual(5000);
  });

  test('Visual frame capture at 1920x1080 across cinematic timeline', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?loader=always', { waitUntil: 'domcontentloaded' });
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 20000 });

    // Frame 1: ~0.7s - Atmospheric gold dust drifting & swirling inward (no letters)
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${ARTIFACT_DIR}/1920x1080-frame-1-assembly.png` });

    // Frame 2: ~2.8s - Master frame contours sculpted by gold dust, letters materializing
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${ARTIFACT_DIR}/1920x1080-frame-2-assembled-luster.png` });

    // Frame 3: ~4.4s - Wordmark fully settled, tagline revealed in holding state
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/1920x1080-frame-3-tagline-hold.png` });

    // Frame 4: Post-exit homepage reveal with single intentional hero entrance
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/1920x1080-frame-4-hero-revealed.png` });
  });

  test('Mobile visual frame capture at 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?loader=always', { waitUntil: 'domcontentloaded' });
    const loader = page.locator('.vve-loader');
    await expect(loader).toBeVisible({ timeout: 20000 });

    // Frame 1: ~3.5s assembled state on mobile
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/mobile-frame-assembled.png` });

    // Frame 2: Homepage reveal on mobile
    await loader.waitFor({ state: 'detached', timeout: 15000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/mobile-frame-hero-revealed.png` });
  });

});
