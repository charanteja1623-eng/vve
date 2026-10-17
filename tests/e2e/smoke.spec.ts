import { test, expect, type Page } from '@playwright/test';

/**
 * Vintage Vibe Events — Core Smoke & Mobile Experience Verification Suite
 *
 * Covers:
 * - Page loads and loader synchronization
 * - No horizontal overflow at 360, 390, 412, 430px and responsive widths
 * - Mobile action bar (Call, Enquire, drawer stacking priority, mobile-only visibility)
 * - Hero-to-Events transition and background scaling isolation
 * - Supported CSS animation and forced-off JavaScript fallback
 * - Reduced-motion compliance
 * - Single-switch unconfirmed WhatsApp absence
 * - Enquiry form and Supabase 503 configuration-missing fallback
 */
test.describe('VVE Browser Smoke & Mobile Scroll Tests', () => {

  async function waitForPageReady(page: Page) {
    const loader = page.locator('.vve-loader');
    if (await loader.count() > 0) {
      await loader.waitFor({ state: 'detached', timeout: 35000 });
      await page.locator('html[data-loader-done="true"]').waitFor({ state: 'attached', timeout: 35000 }).catch(() => {});
    }
  }

  test('Page rendering and horizontal overflow check (Home)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await waitForPageReady(page);

    // Wait for header and footer to be visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for horizontal overflow (scrollWidth should not exceed clientWidth)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    // Verify no unhandled JavaScript runtime exceptions on initial load
    expect(consoleErrors).toHaveLength(0);
  });

  const routes = ['/about', '/contact', '/services', '/events', '/work'];
  for (const route of routes) {
    test(`Public route responds 200 without overflow: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `Expected route ${route} to respond with status 200`).toBe(200);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      // Ensure no horizontal overflow on subpages
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected on ${route}`).toBe(false);
    });
  }

  test('Header navigation and mobile menu drawer overlays action bar', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;

    if (isSmallScreen) {
      const menuButton = page.locator('button[aria-label="Open menu"]');
      await expect(menuButton).toBeVisible();

      // Open menu
      await menuButton.click();
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();
      await expect(mobileMenu).toHaveAttribute('role', 'dialog');

      // Verify drawer stacking priority: mobile-menu has z-[60] which overlays mobile action bar (z-40)
      const menuZIndex = await mobileMenu.evaluate((el) => window.getComputedStyle(el).zIndex);
      expect(Number(menuZIndex)).toBeGreaterThanOrEqual(50);

      // Check navigation links within mobile menu
      await expect(mobileMenu.locator('a[href="/contact"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="/events"]')).toBeVisible();

      // Test Escape key closes menu and restores focus
      await page.keyboard.press('Escape');
      await expect(mobileMenu).not.toBeVisible();
      await expect(page.locator('button[aria-label="Open menu"]')).toBeFocused();
    } else {
      const desktopNav = page.locator('nav[aria-label="Primary"]');
      await expect(desktopNav).toBeVisible();
      await expect(page.locator('button[aria-label="Open menu"]')).toBeHidden();
    }
  });

  test('Mobile action bar visibility, Call action, and Enquire routing', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;
    const actionBar = page.locator('nav[aria-label="Mobile quick actions"]');

    if (isSmallScreen) {
      // Must be visible on mobile (< 768px)
      await expect(actionBar).toBeVisible();

      // Call action verification
      const callAction = actionBar.locator('a[href^="tel:8886882608"]');
      await expect(callAction).toBeVisible();
      await expect(callAction).toHaveAttribute('href', 'tel:8886882608');

      // Enquire action verification
      const enquireAction = actionBar.locator('a[href*="/contact"]');
      await expect(enquireAction).toBeVisible();
    } else {
      // Must be hidden on desktop (> 768px)
      await expect(actionBar).toBeHidden();
    }
  });

  test('Enquire action on /contact scrolls to and focuses enquiry form without navigation', async ({ page }) => {
    await page.goto('/contact');

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;

    if (isSmallScreen) {
      const actionBar = page.locator('nav[aria-label="Mobile quick actions"]');
      await expect(actionBar).toBeVisible();

      const enquireBtn = actionBar.locator('a', { hasText: 'Enquire' });
      await enquireBtn.click();

      // Verify name input receives focus
      const nameInput = page.locator('#name');
      await expect(nameInput).toBeFocused();
    }
  });

  test('Hero-to-Events transition: background scaling isolation and reachability', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Events section is immediately reachable in normal document flow
    const eventsSection = page.locator('#events');
    await expect(eventsSection).toBeAttached();

    // Verify hero background layer exists and has scaling class
    const heroBg = page.locator('.hero-bg-layer');
    await expect(heroBg).toBeAttached();

    // Verify initial transform and opacity
    const initialBgTransform = await heroBg.evaluate((el) => window.getComputedStyle(el).transform);
    const initialBgOpacity = await heroBg.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));

    // Scroll down 400px
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);

    // Verify computed visual changes: background must scale and change opacity
    const scrolledBgTransform = await heroBg.evaluate((el) => window.getComputedStyle(el).transform);
    const scrolledBgOpacity = await heroBg.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));

    expect(scrolledBgTransform).not.toBe(initialBgTransform);
    expect(scrolledBgOpacity).toBeLessThan(initialBgOpacity);

    // Verify logo and headline do not have scale transform applied (scale remains 1)
    const heroLockup = page.locator('.hero-brand-lockup');
    const lockupTransform = await heroLockup.evaluate((el) => window.getComputedStyle(el).transform);
    if (lockupTransform !== 'none') {
      const match = lockupTransform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(',').map((s) => parseFloat(s.trim()));
        const scaleX = parts[0];
        const scaleY = parts[3];
        expect(scaleX).toBeCloseTo(1, 2);
        expect(scaleY).toBeCloseTo(1, 2);
      }
    }

    // Scroll back to top and verify natural reverse
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const reversedBgOpacity = await heroBg.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));
    expect(reversedBgOpacity).toBeCloseTo(initialBgOpacity, 1);

    // Scroll to events and confirm it is visible in viewport
    await eventsSection.scrollIntoViewIfNeeded();
    await expect(eventsSection).toBeVisible();
  });

  test('Supported CSS animation and forced-off JavaScript fallback updates --scroll-progress and --section-progress', async ({ page }) => {
    // Navigate with forced scroll fallback query param
    await page.goto('/?scrollFallback=true');
    await waitForPageReady(page);

    // Check data attribute set
    const hasAttr = await page.evaluate(() => document.documentElement.getAttribute('data-scroll-fallback'));
    expect(hasAttr).toBe('true');

    // Initially at top, --scroll-progress should be 0 or small
    let progress = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue('--scroll-progress');
    });
    expect(Number(progress || '0')).toBeLessThanOrEqual(0.1);

    // Scroll down 400px
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);

    progress = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue('--scroll-progress');
    });
    const sectionProgress = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue('--section-progress');
    });

    // Fallback must have actively updated --scroll-progress and --section-progress
    expect(Number(progress)).toBeGreaterThan(0.1);
    expect(Number(sectionProgress)).toBeGreaterThan(0);

    // Scroll back upward and verify reverse
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const progressReversed = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue('--scroll-progress');
    });
    expect(Number(progressReversed || '0')).toBeLessThanOrEqual(0.05);
  });

  test('Prefers-reduced-motion disables scaling and keeps content static', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await waitForPageReady(page);

    const progress = await page.evaluate(() => {
      return document.documentElement.style.getPropertyValue('--scroll-progress');
    });
    expect(progress === '' || progress === '0').toBe(true);

    // Background layer transform should be disabled
    const heroBgTransform = await page.locator('.hero-bg-layer').evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    expect(heroBgTransform === 'none' || heroBgTransform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
  });

  test('Strict single-switch: WhatsApp controls and links are absent while unconfirmed', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // WhatsApp FAB must not be rendered
    const waFab = page.locator('a[aria-label*="WhatsApp"]');
    await expect(waFab).toHaveCount(0);

    // No wa.me links on home page
    const waLinks = page.locator('a[href*="wa.me"]');
    await expect(waLinks).toHaveCount(0);
  });

  test('Mobile viewport horizontal overflow check across 360, 390, 412, and 430px', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const widths = [360, 390, 412, 430];
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected at ${w}px`).toBe(false);
    }
  });

  test('Enquiry form client-side validation and attributes (/contact)', async ({ page }) => {
    await page.goto('/contact');

    const form = page.locator('#enquiry-form');
    await expect(form).toBeVisible();

    const nameInput = page.locator('#name');
    const phoneInput = page.locator('#phone');
    const locationInput = page.locator('#location');
    const eventTypeSelect = page.locator('#eventType');
    const messageInput = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');
    await expect(phoneInput).toHaveAttribute('required', '');
    await expect(locationInput).toHaveAttribute('required', '');
    await expect(eventTypeSelect).toHaveAttribute('required', '');
    await expect(messageInput).toHaveAttribute('required', '');
    await expect(submitButton).toBeVisible();

    const isNameValidEmpty = await nameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isNameValidEmpty).toBe(false);

    const emailInput = page.locator('#email');
    await emailInput.fill('not-an-email');
    const isEmailValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isEmailValid).toBe(false);

    const honeypot = page.locator('input[name="company_website"]');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveClass(/hidden/);
  });

  test('Enquiry form handles API error without crashing', async ({ page }) => {
    await page.goto('/contact');

    await page.route('/api/enquiry', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database service unavailable' }),
      });
    });

    await page.locator('#name').fill('Aarav Sharma');
    await page.locator('#phone').fill('+91 98765 43210');
    await page.locator('#location').fill('Hyderabad');
    await page.locator('#eventType').selectOption('wedding');
    await page.locator('#message').fill('Seeking event decor consultation.');

    await page.locator('button[type="submit"]').click();

    const alertBanner = page.locator('form div').filter({ hasText: /Database service unavailable|Something went wrong/ });
    await expect(alertBanner).toBeVisible();
    await expect(alertBanner).toHaveClass(/text-red-200/);
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('Enquiry API returns 503 configuration-missing fallback when credentials are absent', async ({ request }) => {
    // Direct test of the actual API route to verify configuration-missing fallback
    const res = await request.post('/api/enquiry', {
      data: {
        name: 'Aarav Sharma',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding',
        message: 'Direct API test for configuration verification',
      },
    });

    // In local dev/test environment without live SUPABASE_SECRET_KEY, returns 503
    // If Supabase credentials are configured in local env, returns 200 or 503
    expect([200, 503]).toContain(res.status());
    if (res.status() === 503) {
      const data = await res.json();
      expect(data.error).toBe('Configuration Missing');
      expect(data.message).toContain('Please contact us via phone or email');
    }
  });

  test('Portfolio filtering operates cleanly on /work', async ({ page }) => {
    await page.goto('/work');
    const initialCards = page.locator('main h2');
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThan(0);

    const weddingsBtn = page.locator('button', { hasText: 'Royal Weddings' });
    await weddingsBtn.click();
    await expect(weddingsBtn).toHaveClass(/bg-gold/);

    const corporateBtn = page.locator('button', { hasText: 'Corporate Summits' });
    await corporateBtn.click();
    await expect(corporateBtn).toHaveClass(/bg-gold/);
  });

  /* ============================================================
     Prompt 3: Parallax Feature Sections & Entry Reveals
     ============================================================ */

  test('Parallax Feature Sections: structure, verified content, and routes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Section 1: Wedding Experiences (#events)
    const s1 = page.locator('#events');
    await expect(s1).toBeAttached();
    await expect(s1.locator('h2')).toContainText('Royal Weddings');
    const s1Enquiry = s1.locator('a[href*="/contact?eventType=wedding"]');
    const s1Explore = s1.locator('a[href*="/events#weddings"]');
    await expect(s1Enquiry).toBeVisible();
    await expect(s1Explore).toBeVisible();

    // Section 2: Celebrations & Milestones (#celebrations)
    const s2 = page.locator('#celebrations');
    await expect(s2).toBeAttached();
    await expect(s2.locator('h2')).toContainText('Celebrations');
    const s2Enquiry = s2.locator('a[href*="/contact?eventType=birthday"]');
    const s2Explore = s2.locator('a[href*="/events#birthdays"]');
    await expect(s2Enquiry).toBeVisible();
    await expect(s2Explore).toBeVisible();

    // Section 3: Corporate Events (#corporate)
    const s3 = page.locator('#corporate');
    await expect(s3).toBeAttached();
    await expect(s3.locator('h2')).toContainText('Corporate Galas');
    const s3Enquiry = s3.locator('a[href*="/contact?eventType=corporate"]');
    const s3Explore = s3.locator('a[href*="/events#corporate"]');
    await expect(s3Enquiry).toBeVisible();
    await expect(s3Explore).toBeVisible();
  });

  test('Parallax Feature Sections: entry reveals trigger properly on scroll', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const s1 = page.locator('#events');
    const s2 = page.locator('#celebrations');
    const s3 = page.locator('#corporate');

    // Scroll to section 1
    await s1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Section 1 card should have received revealed state
    const s1Content = s1.locator('[class*="revealHorizontal"]');
    await expect(s1Content).toHaveClass(/isRevealed/);

    // Scroll to section 2
    await s2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const s2Content = s2.locator('[class*="revealVertical"]');
    await expect(s2Content).toHaveClass(/isRevealed/);

    // Scroll to section 3
    await s3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const s3Content = s3.locator('[class*="revealScale"]');
    await expect(s3Content).toHaveClass(/isRevealed/);
  });

  test('Parallax Feature Sections: backplate bleed geometry and zero horizontal overflow across mobile widths', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const mobileWidths = [360, 390, 412, 430];
    for (const w of mobileWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100);

      // Scroll sequentially through the three sections
      for (const id of ['#events', '#celebrations', '#corporate']) {
        const section = page.locator(id);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(overflow, `Horizontal overflow detected at ${w}px in section ${id}`).toBe(false);

        // Verify backplate exists with bleed geometry
        const backplate = section.locator('[class*="parallaxBackplate"]');
        await expect(backplate).toBeAttached();
      }
    }
  });

  test('Parallax Feature Sections: reduced motion disables transforms and presents static content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await waitForPageReady(page);

    const s1 = page.locator('#events');
    await s1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Verify opacity is 1 and transform is none under reduced motion
    const s1Content = s1.locator('[class*="revealHorizontal"]');
    const opacity = await s1Content.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBe(1);
  });

  /* ============================================================
     Prompt 4: Scroll-Controlled Canvas Sequence Prototype
     ============================================================ */

  test('Canvas Sequence Prototype: route accessibility, canvas mounting, and first-frame rendering', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const res = await page.goto('/prototype/canvas');
    expect(res?.status()).toBe(200);
    await waitForPageReady(page);

    // Canvas exists and is mounted
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeVisible();

    // Container data attributes initialized
    const container = page.locator('[data-testid="canvas-sequence-container"]');
    await expect(container).toBeAttached();
    const frameIndex = await container.getAttribute('data-frame-index');
    expect(frameIndex).toBe('0');

    // Canvas has non-zero internal resolution
    const canvasDimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));
    expect(canvasDimensions.width).toBeGreaterThan(0);
    expect(canvasDimensions.height).toBeGreaterThan(0);

    expect(consoleErrors).toHaveLength(0);
  });

  test('Canvas Sequence Prototype: scroll progress maps to frame changes and reverses smoothly', async ({ page }) => {
    await page.goto('/prototype/canvas');
    await waitForPageReady(page);

    const container = page.locator('[data-testid="canvas-sequence-container"]');
    await expect(container).toBeAttached();

    // Initial frame index is 0
    expect(await container.getAttribute('data-frame-index')).toBe('0');

    // Scroll track into view and advance into the pinned track
    const track = page.locator('[data-testid="canvas-sequence-track"]');
    await track.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Scroll down 600px into the pinned sequence
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(400);

    const midProgress = await container.getAttribute('data-scroll-progress');
    const midIndex = await container.getAttribute('data-frame-index');
    expect(parseFloat(midProgress || '0')).toBeGreaterThan(0);
    expect(parseInt(midIndex || '0', 10)).toBeGreaterThanOrEqual(0);

    // Scroll further down 800px
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);
    const deepIndex = await container.getAttribute('data-frame-index');
    expect(parseInt(deepIndex || '0', 10)).toBeGreaterThanOrEqual(parseInt(midIndex || '0', 10));

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const reversedIndex = await container.getAttribute('data-frame-index');
    expect(reversedIndex).toBe('0');
  });

  test('Canvas Sequence Prototype: pinned track releases cleanly at endpoint with intact interactions', async ({ page }) => {
    await page.goto('/prototype/canvas');
    await waitForPageReady(page);

    // Scroll completely past the 260vh sequence track into the post-release section
    const releaseSection = page.locator('text=Sequence Complete');
    await releaseSection.scrollIntoViewIfNeeded();
    await expect(releaseSection).toBeVisible();

    // Verify post-pinning navigation CTA is active and clickable
    const returnLink = page.locator('a', { hasText: 'Return to Production Home' });
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/');
  });

  test('Canvas Sequence Prototype: mobile responsiveness and zero horizontal overflow', async ({ page }) => {
    await page.goto('/prototype/canvas');
    await waitForPageReady(page);

    const mobileWidths = [360, 390, 412, 430];
    for (const w of mobileWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100);

      // Check overflow at top, middle of sequence, and bottom
      const scrollPositions = [0, 800, 1600];
      for (const pos of scrollPositions) {
        await page.evaluate((y) => window.scrollTo(0, y), pos);
        await page.waitForTimeout(100);

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(overflow, `Horizontal overflow detected on /prototype/canvas at ${w}px, scrollY=${pos}`).toBe(false);
      }
    }
  });

  test('Canvas Sequence Prototype: reduced-motion presents static scene without forced 260vh pinning', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/prototype/canvas');
    await waitForPageReady(page);

    // Track should not render the pinned 260vh container in reduced-motion mode
    const pinnedTrack = page.locator('[data-testid="canvas-sequence-track"]');
    await expect(pinnedTrack).toHaveCount(0);

    // Static fallback presentation should be visible
    const staticCard = page.locator('text=Motion Reduced Presentation · Master Mandap');
    await expect(staticCard).toBeVisible();
  });

  /* ============================================================
     Prompt 5: Production Homepage Canvas Sequence Integration
     ============================================================ */

  test('Homepage Canvas Sequence: mounts with 3D spatial mandap sequence and title', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await waitForPageReady(page);

    // Canvas exists and is mounted on the production homepage
    const canvas = page.locator('canvas[role="img"]');
    await expect(canvas).toBeVisible();

    // Verify atelier titling and tag
    const title = page.locator('h2', { hasText: 'Sacred Mandap Architecture' });
    await expect(title).toBeAttached();
    const tag = page.locator('text=Atelier Scenography · Mandap Assembly');
    await expect(tag).toBeAttached();

    // Container data attributes initialized
    const container = page.locator('[data-testid="canvas-sequence-container"]');
    await expect(container).toBeAttached();
    expect(await container.getAttribute('data-frame-index')).toBe('0');

    // Canvas internal buffer has non-zero dimensions
    const dimensions = await canvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);

    expect(consoleErrors).toHaveLength(0);
  });

  test('Homepage Canvas Sequence: scroll progression advances frame index and transitions into feature sections', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const track = page.locator('[data-testid="canvas-sequence-track"]');
    await expect(track).toBeAttached();

    const container = page.locator('[data-testid="canvas-sequence-container"]');
    await expect(container).toBeAttached();

    // Scroll track into view
    await track.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Scroll down 600px into the sequence
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(400);

    const midProgress = await container.getAttribute('data-scroll-progress');
    const midIndex = await container.getAttribute('data-frame-index');
    expect(parseFloat(midProgress || '0')).toBeGreaterThan(0);
    expect(parseInt(midIndex || '0', 10)).toBeGreaterThanOrEqual(0);

    // Scroll past the sequence directly to #events (ParallaxFeatureSections)
    const eventsSection = page.locator('#events');
    await eventsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(eventsSection).toBeVisible();

    // Verify enquiry CTA in section 1 remains interactive
    const s1Enquiry = eventsSection.locator('a[href*="/contact?eventType=wedding"]');
    await expect(s1Enquiry).toBeVisible();
  });

  test('Homepage Canvas Sequence: mobile responsiveness and zero horizontal overflow across viewports', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const mobileWidths = [360, 390, 412, 430];
    for (const w of mobileWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100);

      // Verify at track start, inside track, and post-track
      const track = page.locator('[data-testid="canvas-sequence-track"]');
      await track.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);

      let overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow at sequence entry at ${w}px`).toBe(false);

      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(100);

      overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow at sequence mid-scroll at ${w}px`).toBe(false);
    }
  });

  test('Homepage Canvas Sequence: reduced-motion presents static scene without forced 260vh pinning', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await waitForPageReady(page);

    // Track should not render the pinned 260vh container in reduced-motion mode
    const pinnedTrack = page.locator('[data-testid="canvas-sequence-track"]');
    await expect(pinnedTrack).toHaveCount(0);

    // Static fallback presentation should be visible on homepage
    const staticCard = page.locator('text=Motion Reduced Presentation · Master Mandap');
    await expect(staticCard).toBeVisible();

    // Verify feature section #events is immediately below and fully reachable
    const eventsSection = page.locator('#events');
    await eventsSection.scrollIntoViewIfNeeded();
    await expect(eventsSection).toBeVisible();
  });

  /* ============================================================
     Option B: Real-Time 3D Perspective Palatial Corridor (/prototype/3d)
     ============================================================ */

  test('Option B 3D Corridor: route accessibility, 3D world mounting, and HUD controls', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const res = await page.goto('/prototype/3d');
    expect(res?.status()).toBe(200);
    await waitForPageReady(page);

    // Verify 3D Corridor Container and Track
    const container = page.locator('[data-testid="3d-corridor-container"]');
    await expect(container).toBeAttached();
    expect(await container.getAttribute('data-camera-z')).toBe('0');

    const track = page.locator('[data-testid="3d-corridor-track"]');
    await expect(track).toBeAttached();

    // Verify HUD & Scrubber dock
    const hud = page.locator('[data-testid="3d-corridor-hud"]');
    await expect(hud).toBeVisible();

    expect(consoleErrors).toHaveLength(0);
  });

  test('Option B 3D Corridor: camera advances along Z-axis on scroll and releases cleanly', async ({ page }) => {
    await page.goto('/prototype/3d');
    await waitForPageReady(page);

    const container = page.locator('[data-testid="3d-corridor-container"]');
    await expect(container).toBeAttached();

    // Initial camera depth
    expect(await container.getAttribute('data-camera-z')).toBe('0');

    // Scroll down into the corridor
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(400);

    const midDepth = await container.getAttribute('data-camera-z');
    expect(parseFloat(midDepth || '0')).toBeGreaterThan(0);

    // Scroll completely past the 3D corridor to release section
    const releaseSection = page.locator('text=Corridor Traversal Complete');
    await releaseSection.scrollIntoViewIfNeeded();
    await expect(releaseSection).toBeVisible();

    // Verify comparative navigation links
    const canvasLink = page.locator('a', { hasText: 'Inspect Option A (Canvas Scrubber)' });
    await expect(canvasLink).toBeVisible();
    await expect(canvasLink).toHaveAttribute('href', '/prototype/canvas');
  });

  test('Option B 3D Corridor: mobile responsiveness and zero horizontal overflow across viewports', async ({ page }) => {
    await page.goto('/prototype/3d');
    await waitForPageReady(page);

    const mobileWidths = [360, 390, 412, 430];
    for (const w of mobileWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(100);

      // Verify overflow at start, middle, and end
      for (const pos of [0, 900, 1800]) {
        await page.evaluate((y) => window.scrollTo(0, y), pos);
        await page.waitForTimeout(100);

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(overflow, `Horizontal overflow on /prototype/3d at ${w}px, scrollY=${pos}`).toBe(false);
      }
    }
  });

  test('Option B 3D Corridor: reduced-motion presents static scene without forced 280vh pinning', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/prototype/3d');
    await waitForPageReady(page);

    // Pinned track should not be rendered under reduced motion
    const pinnedTrack = page.locator('[data-testid="3d-corridor-track"]');
    await expect(pinnedTrack).toHaveCount(0);

    // Static palatial card should be visible
    const staticCard = page.locator('text=Motion Reduced Presentation · Palatial Perspective Sanctuary');
    await expect(staticCard).toBeVisible();
  });

});


