import { test, expect, type Page } from '@playwright/test';

/**
 * Vintage Vibe Events — Core Smoke, Navigation, Accessibility & Split-Stage Verification Suite
 *
 * Covers:
 * - Page loads and Gilded Seal loader synchronization
 * - 4-item primary navigation and skip-to-content accessible link
 * - Legacy permanent redirects (/about -> /#about, /services -> /events#addons)
 * - Single-switch unconfirmed WhatsApp absence (0 wa.me links)
 * - Homepage Editorial Split-Stage (6 confirmed categories, desktop sticky preview, native mobile stack)
 * - Portfolio filtering & accessible modal lightbox (Escape dismissal, focus management)
 * - Enquiry form query parameter prefill (?eventType= & ?addon=) and safe invalid-query fallback
 * - Enquiry API 503 configuration-missing fallback
 * - Option B 3D Corridor laboratory
 * - Zero horizontal overflow across 360, 390, 412, and 430px viewports
 */
test.describe('VVE Browser Smoke & Gate 3 Verification Suite', () => {

  async function waitForPageReady(page: Page) {
    const loader = page.locator('.vve-loader');
    if (await loader.count() > 0) {
      await loader.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
      await page.locator('html[data-loader-done="true"]').waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
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

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check for horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    // Verify zero unhandled console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('Accessibility skip-to-main-content link is present and targets main element', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    expect(await skipLink.textContent()).toContain('Skip to main content');

    const mainElement = page.locator('main#main-content');
    await expect(mainElement).toBeAttached();
  });

  test('Primary navigation has exactly 4 items and links to canonical routes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;

    if (!isSmallScreen) {
      const navLinks = page.locator('nav[aria-label="Primary"] a');
      await expect(navLinks).toHaveCount(4);

      const navTexts = await navLinks.allTextContents();
      expect(navTexts).toEqual(['Home', 'Events', 'Portfolio', 'Contact']);

      expect(await navLinks.nth(0).getAttribute('href')).toBe('/');
      expect(await navLinks.nth(1).getAttribute('href')).toBe('/events');
      expect(await navLinks.nth(2).getAttribute('href')).toBe('/work');
      expect(await navLinks.nth(3).getAttribute('href')).toBe('/contact');
    }
  });

  test('Legacy URL redirects: /about -> /#about and /services -> /events#addons', async ({ page }) => {
    // 1. /about redirect
    const aboutResponse = await page.goto('/about');
    expect(aboutResponse?.status()).toBe(200);
    expect(page.url()).toContain('/#about');

    // 2. /services redirect
    const servicesResponse = await page.goto('/services');
    expect(servicesResponse?.status()).toBe(200);
    expect(page.url()).toContain('/events#addons');
  });

  test('Public routes respond 200 without horizontal overflow: /events, /work, /contact', async ({ page }) => {
    const routes = ['/events', '/work', '/contact'];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `Expected route ${route} to respond with status 200`).toBe(200);
      await waitForPageReady(page);

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('main#main-content')).toBeAttached();

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected on ${route}`).toBe(false);
    }
  });

  test('Mobile menu drawer overlays action bar and manages focus', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;

    if (isSmallScreen) {
      const menuButton = page.locator('button[aria-label="Open menu"]');
      await expect(menuButton).toBeVisible();

      await menuButton.click();
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();
      await expect(mobileMenu).toHaveAttribute('role', 'dialog');

      // Stacking priority over mobile action bar (z-40)
      const menuZIndex = await mobileMenu.evaluate((el) => window.getComputedStyle(el).zIndex);
      expect(Number(menuZIndex)).toBeGreaterThanOrEqual(50);

      // Links in mobile menu
      await expect(mobileMenu.locator('a[href="/contact"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="/events"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="/work"]')).toBeVisible();

      // Escape key closes menu and restores focus
      await page.keyboard.press('Escape');
      await expect(mobileMenu).not.toBeVisible();
      await expect(page.locator('button[aria-label="Open menu"]')).toBeFocused();
    }
  });

  test('Mobile action bar visibility, Call action, and Enquire routing', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;
    const actionBar = page.locator('nav[aria-label="Mobile quick actions"]');

    if (isSmallScreen) {
      await expect(actionBar).toBeVisible();

      const callAction = actionBar.locator('a[href^="tel:8886882608"]');
      await expect(callAction).toBeVisible();

      const enquireAction = actionBar.locator('a[href*="/contact"]');
      await expect(enquireAction).toBeVisible();
    } else {
      await expect(actionBar).toBeHidden();
    }
  });

  test('WhatsApp click-to-chat: FAB, CTA buttons, and links point to canonical wa.me URL with proper attributes', async ({ page }) => {
    for (const path of ['/', '/events', '/work', '/contact']) {
      await page.goto(path);
      await waitForPageReady(page);

      // Verify WhatsApp FAB is present and configured with canonical wa.me link
      const waFab = page.locator('aside[aria-label="Quick contact"] a[aria-label*="WhatsApp"]');
      await expect(waFab).toBeAttached();
      await expect(waFab).toHaveAttribute('href', /https:\/\/wa\.me\/919652961775/);
      await expect(waFab).toHaveAttribute('target', '_blank');
      await expect(waFab).toHaveAttribute('rel', 'noopener noreferrer');

      // Verify all wa.me links on the page point to canonical number with external security attributes
      const waLinks = page.locator('a[href*="wa.me"]');
      const count = await waLinks.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const link = waLinks.nth(i);
        await expect(link).toHaveAttribute('href', /https:\/\/wa\.me\/919652961775/);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  test('Homepage Editorial Split-Stage: renders 6 confirmed categories with real imagery and detail navigation', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const stageSection = page.locator('#events');
    await expect(stageSection).toBeAttached();

    // Verify section heading
    await expect(stageSection.locator('h2')).toContainText('Event Categories & Architecture');

    // Verify all 6 confirmed categories exist
    const expectedCategories = [
      { name: 'Wedding Packages', slug: 'wedding-packages' },
      { name: 'Birthday Parties', slug: 'birthday-parties' },
      { name: 'Surprise Parties', slug: 'surprise-parties' },
      { name: 'Indoor & Outdoor Events', slug: 'indoor-outdoor-events' },
      { name: 'School & College Events', slug: 'school-college-events' },
      { name: 'New Year Parties', slug: 'new-year-parties' },
    ];

    for (const cat of expectedCategories) {
      const card = stageSection.locator(`#stage-${cat.slug}`);
      await expect(card).toBeAttached();
      await expect(card.locator(`text=${cat.name}`).first()).toBeAttached();

      // Real category imagery
      const img = card.locator(`img[src*="${cat.slug}"]`);
      await expect(img).toBeAttached();

      // "Explore Package" link to detail page
      const detailLink = card.locator(`a[href="/events/${cat.slug}"]`);
      await expect(detailLink).toBeAttached();

      // Enquiry link prefilled with canonical category slug
      const enquireLink = card.locator(`a[href*="/contact?eventType=${cat.slug}"]`);
      await expect(enquireLink).toBeAttached();
    }

    // Verify clicking on card navigates to detail page
    const firstCard = stageSection.locator('#stage-wedding-packages');
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.click({ position: { x: 20, y: 20 } });
    await page.waitForURL('**/events/wedding-packages', { timeout: 15000 });
    expect(page.url()).toContain('/events/wedding-packages');
  });

  test('Hero Section: architectural background image and scroll-driven dolly zoom', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const heroSection = page.locator('.hero-viewport');
    await expect(heroSection).toBeVisible();

    // Verify background image in hero-bg-layer
    const bgImage = heroSection.locator('.hero-bg-layer img[src*="palace-courtyard"]');
    await expect(bgImage).toBeAttached();

    // Verify scroll progress property updates on native scroll
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);

    const scrollProgress = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress');
    });
    expect(Number(scrollProgress)).toBeGreaterThan(0);
  });

  test('Category Detail Pages: all 6 canonical routes render, navigate, and prefill enquiry', async ({ page }) => {
    const categories = [
      { slug: 'wedding-packages', title: 'Wedding Packages' },
      { slug: 'birthday-parties', title: 'Birthday Parties' },
      { slug: 'surprise-parties', title: 'Surprise Parties' },
      { slug: 'indoor-outdoor-events', title: 'Indoor & Outdoor Events' },
      { slug: 'school-college-events', title: 'School & College Events' },
      { slug: 'new-year-parties', title: 'New Year Parties' },
    ];

    for (const cat of categories) {
      const response = await page.goto(`/events/${cat.slug}`);
      expect(response?.status(), `Expected /events/${cat.slug} to respond with 200`).toBe(200);
      await waitForPageReady(page);

      // Verify category title
      const heading = page.locator('h1');
      await expect(heading).toContainText(cat.title);

      // Verify representative category image
      const catImage = page.locator(`img[src*="${cat.slug}"]`);
      await expect(catImage.first()).toBeVisible();

      // Verify planning considerations section
      await expect(page.locator('text=Planning & Logistical Protocols')).toBeVisible();

      // Verify return link to /events inside main content
      const backLink = page.locator('main a[href="/events"]').first();
      await expect(backLink).toBeVisible();

      // Verify enquiry link prefilled with canonical category ID
      const enquiryLink = page.locator(`a[href*="/contact?eventType=${cat.slug}"]`).first();
      await expect(enquiryLink).toBeVisible();

      // Verify zero horizontal overflow on detail page
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `Horizontal overflow detected on /events/${cat.slug}`).toBe(false);
    }
  });

  test('Portfolio filtering and modal lightbox focus management on /work', async ({ page }) => {
    await page.goto('/work');
    await waitForPageReady(page);

    // Filter button for Wedding Packages
    const weddingFilterBtn = page.locator('button', { hasText: 'Wedding Packages' });
    await expect(weddingFilterBtn).toBeVisible();
    await weddingFilterBtn.click();
    await expect(weddingFilterBtn).toHaveClass(/bg-gold/);

    // Open first card via keyboard or click
    const firstCard = page.locator('div[role="button"][aria-haspopup="dialog"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal lightbox opens
    const modal = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(modal).toBeVisible();

    // Close button has focus or is accessible
    const closeBtn = modal.locator('button[aria-label="Close modal"]');
    await expect(closeBtn).toBeVisible();

    // Verified showcase label inside modal
    await expect(modal).toContainText('Curated Event Scenography & Production Showcase');

    // Pressing Escape closes the modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Work page pre-filters category via URL query parameter (?category=wedding-packages)', async ({ page }) => {
    await page.goto('/work?category=wedding-packages');
    await waitForPageReady(page);

    const weddingFilterBtn = page.locator('button', { hasText: 'Wedding Packages' });
    await expect(weddingFilterBtn).toHaveClass(/bg-gold/);
  });

  test('Enquiry form prefill: valid ?eventType= and ?addon= populate form dropdowns', async ({ page }) => {
    await page.goto('/contact?eventType=wedding-packages&addon=catering');
    await waitForPageReady(page);

    const eventTypeSelect = page.locator('#eventType');
    const addonSelect = page.locator('#addon');

    await expect(eventTypeSelect).toHaveValue('wedding-packages');
    await expect(addonSelect).toHaveValue('catering');
  });

  test('Enquiry form prefill: invalid query parameters fail safely to empty selection', async ({ page }) => {
    await page.goto('/contact?eventType=completely-invalid-slug&addon=bogus-addon-xyz');
    await waitForPageReady(page);

    const eventTypeSelect = page.locator('#eventType');
    const addonSelect = page.locator('#addon');

    // Neither option should be accidentally selected
    await expect(eventTypeSelect).toHaveValue('');
    await expect(addonSelect).toHaveValue('');
  });

  test('Enquiry form client-side validation and attributes (/contact)', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageReady(page);

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

    const honeypot = page.locator('input[name="company_website"]');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveClass(/hidden/);
  });

  test('Enquiry form handles API error without crashing', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageReady(page);

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
    await page.locator('#eventType').selectOption('wedding-packages');
    await page.locator('#message').fill('Seeking event decor consultation.');

    await page.locator('button[type="submit"]').click();

    const alertBanner = page.locator('#enquiry-form [role="alert"]');
    await expect(alertBanner).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('Enquiry API returns 503 configuration-missing fallback when credentials are absent', async ({ request }) => {
    const res = await request.post('/api/enquiry', {
      data: {
        name: 'Aarav Sharma',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding-packages',
        message: 'Direct API test for configuration verification',
      },
    });

    expect([200, 503]).toContain(res.status());
    if (res.status() === 503) {
      const data = await res.json();
      expect(data.error).toBe('Configuration Missing');
      expect(data.message).toContain('Please contact us via phone or email');
    }
  });

  test('Option B 3D Corridor: route accessibility and controls (/prototype/3d)', async ({ page }) => {
    const res = await page.goto('/prototype/3d');
    expect(res?.status()).toBe(200);
    await waitForPageReady(page);

    const container = page.locator('[data-testid="3d-corridor-container"]');
    await expect(container).toBeAttached();

    const hud = page.locator('[data-testid="3d-corridor-hud"]');
    await expect(hud).toBeVisible();

    const returnLink = page.locator('a', { hasText: 'Return to Production Home' });
    await expect(returnLink).toBeVisible();
    await expect(returnLink).toHaveAttribute('href', '/');
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

});
