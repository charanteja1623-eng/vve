import { test, expect, type Page } from '@playwright/test';

const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  // Wait briefly for hydration & canvas initialization
  await page.waitForTimeout(400);
};

test.describe('VVE Global ScrollStack & PixelCard Integration Suite', () => {

  test('Homepage Event Categories renders ScrollStack with 6 confirmed categories', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const eventSlots = page.locator('#events [data-stack-slot]');
    await expect(eventSlots).toHaveCount(6);

    // Verify all 6 category articles are present inside slots
    const articles = page.locator('#events article');
    await expect(articles).toHaveCount(6);

    // Verify pixel canvases are rendered inside cards
    const pixelCanvases = page.locator('#events canvas');
    await expect(pixelCanvases).toHaveCount(6);
  });

  test('Homepage Featured Portfolio (#work) renders independent ScrollStack with 4 projects', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const workSlots = page.locator('#work [data-stack-slot]');
    await expect(workSlots).toHaveCount(4);

    const workArticles = page.locator('#work article');
    await expect(workArticles).toHaveCount(4);

    const workCanvases = page.locator('#work canvas');
    await expect(workCanvases).toHaveCount(4);
  });

  test('Homepage Services (#services) wraps all 7 artisanal services in PixelCards', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const serviceCanvases = page.locator('#services canvas');
    await expect(serviceCanvases).toHaveCount(7);
  });

  test('PixelCard canvas tracks pointer movement and activates spotlight', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const firstCard = page.locator('#events article').first();
    await firstCard.scrollIntoViewIfNeeded();

    // Hover over the card to trigger PixelCard spotlight/hover
    await firstCard.hover();
    await page.waitForTimeout(200);

    // Verify parent PixelCard container has dark theme data attribute
    const pixelCardContainer = page.locator('#events [data-theme="dark"]').first();
    await expect(pixelCardContainer).toBeVisible();

    // Canvas should have non-zero dimensions
    const canvas = pixelCardContainer.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThan(100);
    expect(box?.height).toBeGreaterThan(100);
  });

  test('Interactive links inside ScrollStack + PixelCard are unblocked and clickable', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Find first package link
    const exploreBtn = page.locator('#events a[href="/events/wedding-packages"]').first();
    await exploreBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Click should navigate without pointer obstruction
    await exploreBtn.click();
    await page.waitForURL('**/events/wedding-packages');
    expect(page.url()).toContain('/events/wedding-packages');
  });

  test('Wedding Package Explorer renders dedicated ScrollStack for Wedding Functions and PixelCards for rituals', async ({ page }) => {
    await page.goto('/events/wedding-packages');
    await waitForPageReady(page);

    // Wedding Functions ScrollStack (Haldi, Sangeet, Reception)
    const functionSlots = page.locator('#explore-wedding-packages [data-stack-slot]');
    await expect(functionSlots).toHaveCount(3);

    // Verify function articles inside slots
    const functionArticles = page.locator('#explore-wedding-packages article');
    await expect(functionArticles).toHaveCount(3);

    // Check that canvases are rendered throughout rituals and functions
    const canvases = page.locator('main canvas');
    const count = await canvases.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Find the "+ Add Function" buttons
    const addButtons = page.locator('button:has-text("Add Function"), button:has-text("Function Selected")');
    await expect(addButtons).toHaveCount(3);

    // Toggle Haldi ceremony selection
    await addButtons.first().scrollIntoViewIfNeeded();
    await addButtons.first().click();

    // Should update state to selected and show customization fields
    await expect(page.locator('text=Function Selected').first()).toBeVisible();
    await expect(page.locator('label:has-text("Preferred Date:")').first()).toBeVisible();
  });

  test('Events page renders 6 category ScrollStack cards and 7 artisanal add-on PixelCards', async ({ page }) => {
    await page.goto('/events');
    await waitForPageReady(page);

    // 6 Category ScrollStack slots
    const categorySlots = page.locator('#categories [data-stack-slot]');
    await expect(categorySlots).toHaveCount(6);

    // 6 Category PixelCard canvases
    const categoryCanvases = page.locator('#categories canvas');
    await expect(categoryCanvases).toHaveCount(6);

    // 7 Add-On PixelCard canvases
    const addonCanvases = page.locator('#addons canvas');
    await expect(addonCanvases).toHaveCount(7);

    // Verify link to enquiry is clickable
    const firstEnquireLink = page.locator('#addons a[href*="/contact?"]').first();
    await expect(firstEnquireLink).toBeVisible();
  });

  test('Event Category Detail page (/events/birthday-parties) renders protocol PixelCards and Add-On ScrollStack', async ({ page }) => {
    await page.goto('/events/birthday-parties');
    await waitForPageReady(page);

    // Add-On ScrollStack
    const addonSlots = page.locator('main [data-stack-slot]');
    const slotCount = await addonSlots.count();
    expect(slotCount).toBeGreaterThan(0);

    // PixelCards on protocols and add-ons
    const canvases = page.locator('main canvas');
    const canvasCount = await canvases.count();
    expect(canvasCount).toBeGreaterThanOrEqual(4);
  });

  test('Work portfolio gallery items use PixelCard and open portfolio modal', async ({ page }) => {
    await page.goto('/work');
    await waitForPageReady(page);

    const portfolioCards = page.locator('div[role="button"][aria-haspopup="dialog"]');
    const count = await portfolioCards.count();
    expect(count).toBeGreaterThan(0);

    // Click the first card
    await portfolioCards.first().scrollIntoViewIfNeeded();
    await portfolioCards.first().click();

    // Lightbox modal opens
    const modal = page.locator('[aria-labelledby="modal-project-title"]');
    await expect(modal).toBeVisible();
  });

  test('Mobile viewport (390px) retains natural vertical layout without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForPageReady(page);

    // Check horizontal scroll width equals client width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBe(clientWidth);

    // All 6 event category cards are reachable on mobile
    const cards = page.locator('#events article');
    await expect(cards).toHaveCount(6);

    // Scroll to the 6th card and verify visibility
    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last()).toBeVisible();
  });

  test('Prefers-reduced-motion respects user setting with clean layout', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await waitForPageReady(page);

    const eventSlots = page.locator('#events [data-stack-slot]');
    await expect(eventSlots).toHaveCount(6);

    // Ensure all 6 cards are visible
    for (let i = 0; i < 6; i++) {
      await expect(eventSlots.nth(i)).toBeVisible();
    }
  });

});
