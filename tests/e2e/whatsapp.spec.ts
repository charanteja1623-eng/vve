import { test, expect } from '@playwright/test';

test.describe('WhatsApp Click-to-Chat Integration', () => {
  const CANONICAL_WA_PREFIX = 'https://wa.me/919652961775';

  test('Global FAB is visible, styled, and links to canonical WhatsApp with encoded message', async ({ page }) => {
    await page.goto('/');
    
    // WhatsApp FAB container
    const fabContainer = page.locator('aside[aria-label="Quick contact"]');
    await expect(fabContainer).toBeVisible();

    // WhatsApp FAB anchor
    const fabLink = fabContainer.locator('a[aria-label*="WhatsApp"]');
    await expect(fabLink).toBeVisible();
    await expect(fabLink).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));
    await expect(fabLink).toHaveAttribute('target', '_blank');
    await expect(fabLink).toHaveAttribute('rel', 'noopener noreferrer');

    const href = await fabLink.getAttribute('href');
    expect(href).toContain('text=');
    expect(href).toContain(encodeURIComponent("Hello, I'd like to enquire about your event services."));
  });

  test('Homepage has WhatsApp CTA and keeps phone tel: links separate', async ({ page }) => {
    await page.goto('/');
    
    // Check WhatsApp CTA in consultation section
    const waCta = page.locator('a[href*="wa.me"]').filter({ hasText: 'WhatsApp Direct' });
    await expect(waCta).toBeVisible();
    await expect(waCta).toHaveAttribute('target', '_blank');
    await expect(waCta).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(waCta).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));

    // Check separate phone call links exist
    const tel1 = page.locator('a[href="tel:8886882608"]');
    const tel2 = page.locator('a[href="tel:+919652961775"]');
    expect(await tel1.count()).toBeGreaterThan(0);
    expect(await tel2.count()).toBeGreaterThan(0);
  });

  test('Contact page displays dedicated WhatsApp chat button alongside phones and email', async ({ page }) => {
    await page.goto('/contact');

    // WhatsApp direct contact button in Direct Contact card
    const contactWa = page.locator('a[aria-label*="WhatsApp"]').filter({ hasText: 'Chat on WhatsApp' });
    await expect(contactWa).toBeVisible();
    await expect(contactWa).toHaveAttribute('target', '_blank');
    await expect(contactWa).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(contactWa).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));

    // Separate phone numbers remain visible and functional
    await expect(page.locator('a[href="tel:8886882608"]').first()).toBeVisible();
    await expect(page.locator('a[href="tel:+919652961775"]').first()).toBeVisible();
    // Email link remains intact
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  });

  test('Footer displays WhatsApp contact link with target="_blank" and rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/');

    const footerWa = page.locator('footer a[aria-label*="WhatsApp"]');
    await expect(footerWa).toBeVisible();
    await expect(footerWa).toHaveAttribute('target', '_blank');
    await expect(footerWa).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(footerWa).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));
  });

  test('Events page and Category detail pages offer enquiry WhatsApp links', async ({ page }) => {
    await page.goto('/events');
    const eventsWaLinks = page.locator('a[href*="wa.me"]');
    expect(await eventsWaLinks.count()).toBeGreaterThan(2);

    await page.goto('/events/wedding-packages');
    const weddingWa = page.locator('a[href*="wa.me"]').filter({ hasText: 'WhatsApp Atelier' });
    await expect(weddingWa).toBeVisible();
    await expect(weddingWa).toHaveAttribute('target', '_blank');
    await expect(weddingWa).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(weddingWa).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));
  });

  test('Mobile action bar includes WhatsApp button on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const actionBar = page.locator('nav[aria-label="Mobile quick actions"]');
    await expect(actionBar).toBeVisible();

    const waAction = actionBar.locator('a[aria-label*="WhatsApp"]');
    await expect(waAction).toBeVisible();
    await expect(waAction).toHaveAttribute('target', '_blank');
    await expect(waAction).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(waAction).toHaveAttribute('href', new RegExp(`^${CANONICAL_WA_PREFIX.replace(/\+/g, '\\+')}`));

    // Phone call action is also present and separate
    const callAction = actionBar.locator('a[href^="tel:"]');
    await expect(callAction).toBeVisible();
  });
});
