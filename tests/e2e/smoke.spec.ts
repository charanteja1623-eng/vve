import { test, expect } from '@playwright/test';

test.describe('VVE Browser Smoke Tests', () => {

  test('Page rendering and horizontal overflow check (Home)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

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

  test('Header navigation and mobile menu behavior', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isSmallScreen = (viewport?.width ?? 1440) < 768;

    if (isSmallScreen) {
      // Mobile viewport: desktop nav is hidden, hamburger button is visible
      const menuButton = page.locator('button[aria-label="Open menu"]');
      await expect(menuButton).toBeVisible();

      // Open menu
      await menuButton.click();
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();
      await expect(mobileMenu).toHaveAttribute('role', 'dialog');

      // Check navigation links within mobile menu
      await expect(mobileMenu.locator('a[href="/contact"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="/events"]')).toBeVisible();

      // Test Escape key closes menu and restores focus
      await page.keyboard.press('Escape');
      await expect(mobileMenu).not.toBeVisible();
      await expect(page.locator('button[aria-label="Open menu"]')).toBeFocused();

      // Re-open and close via toggle button
      await menuButton.click();
      await expect(mobileMenu).toBeVisible();
      const closeButton = page.locator('button[aria-label="Close menu"]');
      await expect(closeButton).toBeVisible();
      await closeButton.click();
      await expect(mobileMenu).not.toBeVisible();
    } else {
      // Desktop / Tablet (>= 768px): Primary nav is visible
      const desktopNav = page.locator('nav[aria-label="Primary"]');
      await expect(desktopNav).toBeVisible();
      await expect(desktopNav.locator('a[href="/contact"]')).toBeVisible();
      await expect(desktopNav.locator('a[href="/events"]')).toBeVisible();

      // Mobile hamburger button is hidden on desktop/tablet
      await expect(page.locator('button[aria-label="Open menu"]')).toBeHidden();
    }
  });

  test('Enquiry form client-side validation and attributes (/contact)', async ({ page }) => {
    await page.goto('/contact');

    // Locate the form
    const form = page.locator('form');
    await expect(form).toBeVisible();

    // Verify form controls have associated labels and required attributes
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

    // Verify client-side validity check: empty form must be invalid
    const isNameValidEmpty = await nameInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isNameValidEmpty).toBe(false);

    // Fill invalid email format
    const emailInput = page.locator('#email');
    await emailInput.fill('not-an-email');
    const isEmailValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isEmailValid).toBe(false);

    // Verify honeypot field is hidden from assistive tech and visual display
    const honeypot = page.locator('input[name="company_website"]');
    await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveClass(/hidden/);
  });

  test('Enquiry form handles API error without crashing', async ({ page }) => {
    await page.goto('/contact');

    // Mock API failure to test client UI error handling safely without live Supabase credentials
    await page.route('/api/enquiry', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database service unavailable' }),
      });
    });

    // Fill valid form fields
    await page.locator('#name').fill('Aarav Sharma');
    await page.locator('#phone').fill('+91 98765 43210');
    await page.locator('#location').fill('Hyderabad');
    await page.locator('#eventType').selectOption('wedding');
    await page.locator('#message').fill('Seeking event decor consultation.');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Expect error notification banner
    const alertBanner = page.locator('form div').filter({ hasText: /Database service unavailable|Something went wrong/ });
    await expect(alertBanner).toBeVisible();
    await expect(alertBanner).toHaveClass(/text-red-200/);

    // Form submit button returns to active state
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

});
