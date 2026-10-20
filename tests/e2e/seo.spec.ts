import { test, expect } from '@playwright/test';

test.describe('Brand Visibility & Technical SEO Verification', () => {
  const CANONICAL_BASE = 'https://vintagevibeevents.in';

  test('Homepage title, description, and canonical link match specifications', async ({ page }) => {
    await page.goto('/');

    // A. Title check
    await expect(page).toHaveTitle('Vintage Vibe Events | Wedding & Event Planners');

    // A. Meta description check
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute(
      'content',
      'Vintage Vibe Events is a premier wedding and event planning company in Hyderabad, specializing in luxury weddings, milestone birthdays, surprise parties, and bespoke celebrations across Telangana and Andhra Pradesh.'
    );

    // C. Canonical link check
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://vintagevibeevents.in');

    // A. OpenGraph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Vintage Vibe Events | Wedding & Event Planners'
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Vintage Vibe Events'
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://vintagevibeevents.in'
    );

    // Visible H1 heading contains brand name
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Vintage Vibe Events');
  });

  test('Homepage outputs valid WebSite structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/');

    // Retrieve all application/ld+json scripts
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    let foundWebSiteSchema = false;

    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).textContent();
      if (!text) continue;
      const parsed = JSON.parse(text);

      if (parsed['@type'] === 'WebSite') {
        expect(parsed['@context']).toBe('https://schema.org');
        expect(parsed.name).toBe('Vintage Vibe Events');
        expect(parsed.alternateName).toBe('Vintage Vibe');
        expect(parsed.url).toBe('https://vintagevibeevents.in/');
        foundWebSiteSchema = true;
      }
    }

    expect(foundWebSiteSchema).toBe(true);
  });

  test('robots.txt endpoint is accessible, crawlable, and references sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();

    expect(body).toContain('User-Agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('Disallow: /prototype/');
    expect(body).toContain('Sitemap: https://vintagevibeevents.in/sitemap.xml');
  });

  test('sitemap.xml endpoint is accessible and contains all canonical routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();

    expect(body).toContain('<loc>https://vintagevibeevents.in/</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/work</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/contact</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/wedding-packages</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/birthday-parties</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/surprise-parties</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/indoor-outdoor-events</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/school-college-events</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/events/new-year-parties</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/legal/privacy</loc>');
    expect(body).toContain('<loc>https://vintagevibeevents.in/legal/terms</loc>');

    // Internal / prototype / redirect routes must NOT be in sitemap
    expect(body).not.toContain('/prototype');
    expect(body).not.toContain('/api/');
    expect(body).not.toContain('<loc>https://vintagevibeevents.in/about</loc>');
    expect(body).not.toContain('<loc>https://vintagevibeevents.in/services</loc>');
  });

  test('Internal prototype page is marked noindex, nofollow', async ({ page }) => {
    await page.goto('/prototype/3d');
    const robotsMeta = page.locator('meta[name="robots"]');
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
  });
});
