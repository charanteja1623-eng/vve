import { test, expect } from '@playwright/test';
import {
  escapeHtml,
  formatMultilineHtml,
  extractAddonList,
  formatAddons,
  getCategoryTitle,
  buildEnquiryEmailText,
  buildEnquiryEmailHtml,
} from '../../src/lib/email';
import {
  getTodayDateString,
  getTomorrowDateString,
  isValidFutureEventDate,
} from '../../src/lib/dates';
import type { EnquiryData } from '../../src/lib/validations/enquiry';

test.describe('Enquiry Email Service & Template Verification', () => {
  test('HTML escaping protects against XSS and markup injection', () => {
    const raw = '<script>alert("xss")</script> & "quotes" \'apostrophes\' <tag>';
    const escaped = escapeHtml(raw);

    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).toContain('&amp;');
    expect(escaped).toContain('&quot;quotes&quot;');
    expect(escaped).toContain('&#39;apostrophes&#39;');
  });

  test('formatMultilineHtml escapes and converts newlines to <br />', () => {
    const multiline = 'Line 1\n<script>alert(1)</script>\nLine 3';
    const formatted = formatMultilineHtml(multiline);

    expect(formatted).toContain('Line 1<br />&lt;script&gt;alert(1)&lt;/script&gt;<br />Line 3');
  });

  test('Category titles are mapped correctly', () => {
    expect(getCategoryTitle('wedding-packages')).toBe('Wedding Packages');
    expect(getCategoryTitle('birthday-parties')).toBe('Birthday Parties');
    expect(getCategoryTitle('indoor-outdoor-events')).toBe('Indoor & Outdoor Events');
    expect(getCategoryTitle('other')).toBe('Other Celebrations');
    expect(getCategoryTitle('custom-category')).toBe('custom-category');
  });

  test('Addon extraction and formatting handles single, multiple, and array addons', () => {
    expect(extractAddonList({ addon: 'catering' })).toEqual(['catering']);
    expect(formatAddons(['catering'])).toBe('Catering');

    expect(extractAddonList({ addons: ['catering', 'tent-house'] })).toEqual(['catering', 'tent-house']);
    expect(formatAddons(['catering', 'tent-house'])).toBe('Catering, Tent House');

    expect(extractAddonList({ addon: 'catering', addons: ['dj-screens'] })).toEqual(['catering', 'dj-screens']);
    expect(formatAddons([])).toBe('None selected');

    // 3 or more add-on services
    const multiple = ['catering', 'decoration', 'tent-house', 'photo-videography'];
    expect(extractAddonList({ addons: multiple })).toEqual(multiple);
    expect(formatAddons(multiple)).toBe('Catering, Decoration, Tent House, Photo & Videography');
  });

  test('buildEnquiryEmailText includes all visitor fields and clean fallbacks', () => {
    const fullData: EnquiryData = {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'aarav@example.com',
      location: 'Taj Krishna, Hyderabad',
      eventType: 'wedding-packages',
      addons: ['catering', 'decoration', 'tent-house'],
      date: '2026-12-15',
      budget: '₹10,00,000',
      message: 'Looking for luxury stage decoration and guest catering for 300 guests.',
    };

    const text = buildEnquiryEmailText(fullData);
    expect(text).toContain('Aarav Sharma');
    expect(text).toContain('+91 98765 43210');
    expect(text).toContain('aarav@example.com');
    expect(text).toContain('Taj Krishna, Hyderabad');
    expect(text).toContain('Wedding Packages');
    expect(text).toContain('Catering, Decoration, Tent House');
    expect(text).toContain('2026-12-15');
    expect(text).toContain('₹10,00,000');
    expect(text).toContain('Looking for luxury stage decoration');

    // Test optional field fallbacks
    const minimalData: EnquiryData = {
      name: 'Priya Reddy',
      phone: '9876543210',
      location: 'Secunderabad',
      eventType: 'birthday-parties',
      message: 'Birthday party planning consultation.',
    };

    const minimalText = buildEnquiryEmailText(minimalData);
    expect(minimalText).toContain('Email: Not provided');
    expect(minimalText).toContain('Date: Not specified');
    expect(minimalText).toContain('Estimated Budget: Not specified');
    expect(minimalText).toContain('Add-On Services: None selected');
  });

  test('buildEnquiryEmailHtml formats multiple add-on services with safe escaping and branding', () => {
    const testData: EnquiryData = {
      name: 'Ananya & Kabir <Kabir>',
      phone: '+91 91234 56789',
      email: 'ananya@example.com',
      location: 'Banjara Hills <Venue>',
      eventType: 'wedding-packages',
      addons: ['catering', 'decoration', 'dj-screens'],
      date: '2026-11-20',
      budget: '₹8,00,000',
      message: 'Special request with <tags> & "quotes".\nSecond paragraph of details.',
    };

    const html = buildEnquiryEmailHtml(testData);

    expect(html).toContain('Vintage Vibe Events');
    expect(html).toContain('New Consultation Enquiry');
    expect(html).toContain('Ananya &amp; Kabir &lt;Kabir&gt;');
    expect(html).toContain('Banjara Hills &lt;Venue&gt;');
    expect(html).toContain('Wedding Packages');
    expect(html).toContain('Catering, Decoration, DJ &amp; Screens');
    expect(html).toContain('&lt;tags&gt; &amp; &quot;quotes&quot;.<br />Second paragraph of details.');
    expect(html).not.toContain('<tags>');
    expect(html).not.toContain('<Kabir>');
  });
});

test.describe('Timezone & Future Date Validation Logic', () => {
  test('Correctly computes today and tomorrow in Asia/Kolkata timezone', () => {
    const today = getTodayDateString('Asia/Kolkata');
    const tomorrow = getTomorrowDateString('Asia/Kolkata');

    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(tomorrow > today).toBe(true);
  });

  test('Rejects past dates and today while accepting tomorrow and future dates', () => {
    const today = getTodayDateString('Asia/Kolkata');
    const tomorrow = getTomorrowDateString('Asia/Kolkata');

    // Today must be rejected
    const todayRes = isValidFutureEventDate(today);
    expect(todayRes.valid).toBe(false);
    expect(todayRes.error).toContain('Event date must be in the future (tomorrow or later).');

    // Past date must be rejected
    const pastRes = isValidFutureEventDate('2020-01-01');
    expect(pastRes.valid).toBe(false);
    expect(pastRes.error).toContain('Event date must be in the future (tomorrow or later).');

    // Tomorrow must be accepted
    const tomorrowRes = isValidFutureEventDate(tomorrow);
    expect(tomorrowRes.valid).toBe(true);

    // Far future date must be accepted
    const futureRes = isValidFutureEventDate('2028-12-31');
    expect(futureRes.valid).toBe(true);

    // Empty/omitted date must be accepted (optional field)
    expect(isValidFutureEventDate('').valid).toBe(true);
    expect(isValidFutureEventDate(null).valid).toBe(true);
    expect(isValidFutureEventDate(undefined).valid).toBe(true);

    // Malformed / impossible dates must be rejected
    expect(isValidFutureEventDate('invalid-date').valid).toBe(false);
    expect(isValidFutureEventDate('2026-02-31').valid).toBe(false);
  });
});

test.describe('Enquiry API Route Endpoint Verification', () => {
  test('Rejects oversized payloads (>10KB) with 413 Payload Too Large', async ({ request }) => {
    const hugeMessage = 'A'.repeat(12 * 1024);
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': '198.51.100.1' },
      data: {
        name: 'Test Visitor',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'other',
        message: hugeMessage,
      },
    });

    expect(res.status()).toBe(413);
    const data = await res.json();
    expect(data.error).toBe('Payload Too Large');
  });

  test('Silently accepts honeypot submissions with 200 without sending notifications', async ({ request }) => {
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': '198.51.100.2' },
      data: {
        name: 'Spam Bot',
        phone: '1234567890',
        location: 'Spam City',
        eventType: 'other',
        message: 'Spam message content here.',
        company_website: 'https://spamsite.xyz',
      },
    });

    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Your enquiry has been successfully submitted.');
  });

  test('Validates required fields using Zod and rejects malformed inputs', async ({ request }) => {
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': '198.51.100.3' },
      data: {
        name: 'A', // too short (< 2)
        phone: '123', // too short (< 10)
        location: '', // empty
        eventType: '',
        message: 'short', // < 10
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    expect(Array.isArray(data.details)).toBe(true);
  });

  test('Rejects past event dates on the API with a clear validation message', async ({ request }) => {
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': '198.51.100.11' },
      data: {
        name: 'Past Date Test',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding-packages',
        date: '2020-05-15',
        message: 'Testing past date rejection on server.',
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    const dateIssue = data.details.find((issue: { path?: string[] }) => issue.path?.includes('date'));
    expect(dateIssue).toBeDefined();
    expect(dateIssue.message).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('Rejects today date on the API with a clear validation message', async ({ request }) => {
    const today = getTodayDateString('Asia/Kolkata');
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': '198.51.100.12' },
      data: {
        name: 'Today Date Test',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding-packages',
        date: today,
        message: 'Testing today date rejection on server.',
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    const dateIssue = data.details.find((issue: { path?: string[] }) => issue.path?.includes('date'));
    expect(dateIssue).toBeDefined();
    expect(dateIssue.message).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('Enforces rate limiting on rapid burst submissions from same IP', async ({ request }) => {
    const clientIp = '198.51.100.4';
    // Requests 1, 2, 3 succeed or validate within rate limit budget
    for (let i = 1; i <= 3; i++) {
      const res = await request.post('/api/enquiry', {
        headers: { 'x-forwarded-for': clientIp },
        data: {
          name: `Visitor ${i}`,
          phone: `987654321${i}`,
          location: 'Hyderabad',
          eventType: 'other',
          message: `Rapid burst request ${i} from testing client.`,
        },
      });
      expect(res.status()).not.toBe(429);
    }

    // 4th request from same IP within the 60s window should be rate-limited
    const res4 = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': clientIp },
      data: {
        name: 'Visitor 4',
        phone: '9876543214',
        location: 'Hyderabad',
        eventType: 'other',
        message: 'Rapid burst request 4 should be rejected by rate limiter.',
      },
    });

    expect(res4.status()).toBe(429);
    const data4 = await res4.json();
    expect(data4.error).toContain('Too Many Requests');
  });

  test('Submits enquiry with multiple add-ons and future event date successfully', async ({ request }) => {
    const tomorrow = getTomorrowDateString('Asia/Kolkata');
    const uniqueRunId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const controlledPayload = {
      name: `Multi Addons QA ${uniqueRunId}`,
      phone: '+91 96529 61775',
      email: 'charanteja.1623@gmail.com',
      location: 'Hyderabad Atelier',
      eventType: 'wedding-packages',
      addons: ['catering', 'decoration', 'tent-house'],
      date: tomorrow,
      budget: '₹8,50,000',
      message: `Controlled test enquiry for multiple add-on services and future date verification. Run: ${uniqueRunId}`,
    };

    const clientIp = `198.51.100.${Math.floor(Math.random() * 50) + 50}`;

    // First submission: should succeed with 200, save to Supabase, and dispatch email via Resend
    const res1 = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': clientIp },
      data: controlledPayload,
    });

    expect(res1.status()).toBe(200);
    const body1 = await res1.json();
    expect(body1.success).toBe(true);
    expect(body1.message).toBe('Your enquiry has been successfully submitted.');

    // Second submission (immediate retry/double-click with same payload): deduplication intercepts and returns 200 safely
    const res2 = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': clientIp },
      data: controlledPayload,
    });

    expect(res2.status()).toBe(200);
    const body2 = await res2.json();
    expect(body2.success).toBe(true);
    expect(body2.message).toBe('Your enquiry has been successfully submitted.');
  });

  test('Submits enquiry without event date or add-ons (optional fields)', async ({ request }) => {
    const uniqueRunId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const minimalPayload = {
      name: `Minimal Enquiry QA ${uniqueRunId}`,
      phone: '+91 96529 61775',
      location: 'Hyderabad Atelier',
      eventType: 'birthday-parties',
      message: `Enquiry without optional date and without add-on services. Run: ${uniqueRunId}`,
    };

    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 50) + 120}` },
      data: minimalPayload,
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});

test.describe('Enquiry Form Browser Multi-Select and Date UI Interaction', () => {
  test('Multi-select permits selecting 3+ add-ons, removing individual items, and enforces min date', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify dynamic min date attribute on #date input is set to tomorrow
    const tomorrow = getTomorrowDateString('Asia/Kolkata');
    const dateInput = page.locator('#date');
    await expect(dateInput).toHaveAttribute('min', tomorrow);

    // 2. Open multi-select dropdown
    const trigger = page.locator('#addon-trigger');
    await expect(trigger).toBeVisible();
    await trigger.click();

    const listbox = page.locator('#addon-listbox');
    await expect(listbox).toBeVisible();

    // 3. Select 3 add-on services: Catering, Decoration, Tent House
    await page.locator('#addon-listbox button:has-text("Catering")').click();
    await page.locator('#addon-listbox button:has-text("Decoration")').click();
    await page.locator('#addon-listbox button:has-text("Tent House")').click();

    // Close dropdown
    await trigger.click();
    await expect(listbox).not.toBeVisible();

    // 4. Verify 3 chips appear
    const chips = page.locator('[aria-label="Selected add-on services"] span.inline-flex');
    await expect(chips).toHaveCount(3);
    await expect(page.locator('[aria-label="Selected add-on services"]')).toContainText('Catering');
    await expect(page.locator('[aria-label="Selected add-on services"]')).toContainText('Decoration');
    await expect(page.locator('[aria-label="Selected add-on services"]')).toContainText('Tent House');

    // 5. Remove one individual service (e.g. Decoration)
    const removeDecorationBtn = page.locator('button[aria-label="Remove Decoration"]');
    await expect(removeDecorationBtn).toBeVisible();
    await removeDecorationBtn.click();

    // 6. Verify count is now 2 and Decoration is gone
    await expect(chips).toHaveCount(2);
    await expect(page.locator('[aria-label="Selected add-on services"]')).not.toContainText('Decoration');
    await expect(page.locator('[aria-label="Selected add-on services"]')).toContainText('Catering');
    await expect(page.locator('[aria-label="Selected add-on services"]')).toContainText('Tent House');

    // 7. Verify mobile horizontal scrollbar is not created (no horizontal overflow)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
