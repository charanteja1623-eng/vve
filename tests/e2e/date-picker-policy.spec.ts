import { test, expect } from '@playwright/test';
import {
  getTodayDateString,
  getTomorrowDateString,
  isValidFutureEventDate,
  EVENT_TIMEZONE,
} from '../../src/lib/dates';

test.describe('Global Date Policy — Logic & Timezone Boundaries', () => {
  test('1. Blocks yesterday across timezones', () => {
    const now = new Date('2026-10-21T14:30:00Z'); // 20:00 IST on 2026-10-21
    const yesterday = '2026-10-20';
    const result = isValidFutureEventDate(yesterday, EVENT_TIMEZONE, now);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('2. Blocks today strictly in destination timezone', () => {
    const now = new Date('2026-10-21T14:30:00Z'); // 20:00 IST on 2026-10-21
    const todayStr = getTodayDateString(EVENT_TIMEZONE, now);
    expect(todayStr).toBe('2026-10-21');

    const result = isValidFutureEventDate(todayStr, EVENT_TIMEZONE, now);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('3. Accepts tomorrow as the earliest selectable date', () => {
    const now = new Date('2026-10-21T14:30:00Z');
    const tomorrowStr = getTomorrowDateString(EVENT_TIMEZONE, now);
    expect(tomorrowStr).toBe('2026-10-22');

    const result = isValidFutureEventDate(tomorrowStr, EVENT_TIMEZONE, now);
    expect(result.valid).toBe(true);
    expect(result.normalizedDate).toBe('2026-10-22');
  });

  test('4. Accepts dates further in the future', () => {
    const now = new Date('2026-10-21T14:30:00Z');
    const futureDate = '2026-12-31';
    const result = isValidFutureEventDate(futureDate, EVENT_TIMEZONE, now);
    expect(result.valid).toBe(true);
    expect(result.normalizedDate).toBe('2026-12-31');
  });

  test('8. Rejects impossible or malformed calendar dates', () => {
    // Non-existent calendar date
    const feb31 = isValidFutureEventDate('2027-02-31');
    expect(feb31.valid).toBe(false);
    expect(feb31.error).toContain('The provided date does not exist on the calendar.');

    // Malformed string
    const malformed = isValidFutureEventDate('not-a-real-date');
    expect(malformed.valid).toBe(false);
    expect(malformed.error).toContain('Please enter a valid date');
  });

  test('10. Remains correct across midnight boundaries and international client offsets', () => {
    // Exactly 23:59:59 IST (18:29:59 UTC)
    const lateNight = new Date('2026-10-21T18:29:59Z');
    expect(getTodayDateString(EVENT_TIMEZONE, lateNight)).toBe('2026-10-21');
    expect(getTomorrowDateString(EVENT_TIMEZONE, lateNight)).toBe('2026-10-22');

    // 1 second later: 00:00:00 IST (18:30:00 UTC) -> flips to 2026-10-22
    const postMidnight = new Date('2026-10-21T18:30:00Z');
    expect(getTodayDateString(EVENT_TIMEZONE, postMidnight)).toBe('2026-10-22');
    expect(getTomorrowDateString(EVENT_TIMEZONE, postMidnight)).toBe('2026-10-23');

    // Client browser located in New York (EDT, UTC-4): when it is 19:00 UTC (00:30 IST next day),
    // Kolkata is already in the next day, so min date must strictly reflect Kolkata's calendar.
    const usClientOffset = new Date('2026-10-21T19:00:00Z');
    expect(getTodayDateString(EVENT_TIMEZONE, usClientOffset)).toBe('2026-10-22');
    expect(getTomorrowDateString(EVENT_TIMEZONE, usClientOffset)).toBe('2026-10-23');
  });
});

test.describe('Global Date Policy — Server API Rejection & Acceptance', () => {
  test('API rejects yesterday date with 400', async ({ request }) => {
    const ip = `198.51.100.${Math.floor(Math.random() * 50) + 100}`;
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': ip },
      data: {
        name: 'Yesterday Rejection Test',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding-packages',
        date: '2026-10-20',
        message: 'Attempting to book yesterday date.',
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    const dateIssue = data.details.find((d: { path?: string[] }) => d.path?.includes('date'));
    expect(dateIssue).toBeDefined();
    expect(dateIssue.message).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('API rejects today date with 400', async ({ request }) => {
    const today = getTodayDateString();
    const ip = `198.51.100.${Math.floor(Math.random() * 50) + 150}`;
    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': ip },
      data: {
        name: 'Today Rejection Test',
        phone: '9876543210',
        location: 'Hyderabad',
        eventType: 'wedding-packages',
        date: today,
        message: 'Attempting to book today date.',
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Validation failed');
    const dateIssue = data.details.find((d: { path?: string[] }) => d.path?.includes('date'));
    expect(dateIssue).toBeDefined();
    expect(dateIssue.message).toContain('Event date must be in the future (tomorrow or later).');
  });

  test('API accepts tomorrow date and future date with 200', async ({ request }) => {
    const tomorrow = getTomorrowDateString();
    const uniqueRunId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const res = await request.post('/api/enquiry', {
      headers: { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 40) + 10}` },
      data: {
        name: `Tomorrow Date Test ${uniqueRunId}`,
        phone: '9652961775',
        location: 'Hyderabad Atelier',
        eventType: 'wedding-packages',
        date: tomorrow,
        message: `Testing tomorrow date acceptance: ${uniqueRunId}`,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});

test.describe('Global Date Policy — Contact Form Browser Interaction', () => {
  test('Contact date picker: min date enforcement, selecting, modifying, clearing, and submitting', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#enquiry-form[data-hydrated="true"]');

    const tomorrow = getTomorrowDateString();
    const dateInput = page.locator('#date');
    await expect(dateInput).toBeVisible();
    await dateInput.scrollIntoViewIfNeeded();

    // 1. Min attribute is tomorrow
    await expect(dateInput).toHaveAttribute('min', tomorrow);

    // 2. Select tomorrow date
    await dateInput.fill(tomorrow);
    await expect(dateInput).toHaveValue(tomorrow);

    // 3. Clear button appears and clearing resets value
    const clearBtn = page.locator('button[aria-label="Clear selected date"]');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(dateInput).toHaveValue('');
    await expect(clearBtn).not.toBeVisible();

    // 4. Selecting and modifying date: select a future date, then change to another date
    const futureDate1 = '2026-11-15';
    const futureDate2 = '2026-12-25';

    await dateInput.fill(futureDate1);
    await expect(dateInput).toHaveValue(futureDate1);

    // Re-fill / change date
    await dateInput.fill(futureDate2);
    await expect(dateInput).toHaveValue(futureDate2);

    // 5. Submit form with modified date and verify payload
    await page.fill('#name', 'Priya & Rahul Date Mod Test');
    await page.fill('#phone', '9876543210');
    await page.fill('#location', 'Taj Falaknuma, Hyderabad');
    await page.selectOption('#eventType', 'wedding-packages');
    await page.fill('#message', 'Detailed wedding consultation request with modified date.');

    let capturedPayload: Record<string, unknown> | null = null;
    await page.route('/api/enquiry', async (route) => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Your enquiry has been successfully submitted.' }),
      });
    });

    await page.click('button[type="submit"]');

    await expect(page.locator('#enquiry-form [role="alert"]')).toContainText('successfully submitted');
    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload!['date']).toBe(futureDate2);
  });
});

test.describe('Global Date Policy — Wedding Packages Explorer (Haldi, Sangeet, Reception, Home Events, Bride & Groom)', () => {
  test('Haldi, Sangeet, Reception, Home Events & Pujas, and Bride & Groom all enforce min future date, allow modification and clearing', async ({ page }) => {
    await page.goto('/events/wedding-packages');
    await page.waitForLoadState('domcontentloaded');

    const tomorrow = getTomorrowDateString();

    // --- HALDI CEREMONY ---
    // Click "+ Add Function" on Haldi Ceremony card
    const haldiAddBtn = page.locator('button:has-text("+ Add Function")').first();
    await haldiAddBtn.click();

    // Haldi Date Picker appears
    const haldiDateInput = page.locator('#date-haldi');
    await expect(haldiDateInput).toBeVisible();
    await expect(haldiDateInput).toHaveAttribute('min', tomorrow);

    // Select a future date for Haldi
    await haldiDateInput.fill('2026-11-10');
    await expect(haldiDateInput).toHaveValue('2026-11-10');

    // Change the date to another future date (verifies editing/modification works seamlessly)
    await haldiDateInput.fill('2026-11-12');
    await expect(haldiDateInput).toHaveValue('2026-11-12');

    // Test clear button on Haldi
    const haldiClearBtn = page.locator('div:has(#date-haldi) button[aria-label="Clear selected date"]');
    await expect(haldiClearBtn).toBeVisible();
    await haldiClearBtn.click();
    await expect(haldiDateInput).toHaveValue('');

    // Re-fill Haldi with final date
    await haldiDateInput.fill('2026-11-15');

    // --- SANGEET NIGHT ---
    const sangeetAddBtn = page.locator('button:has-text("+ Add Function")').first();
    await sangeetAddBtn.click();
    const sangeetDateInput = page.locator('#date-sangeet');
    await expect(sangeetDateInput).toBeVisible();
    await expect(sangeetDateInput).toHaveAttribute('min', tomorrow);
    await sangeetDateInput.fill('2026-11-16');
    await expect(sangeetDateInput).toHaveValue('2026-11-16');

    // --- RECEPTION ---
    const receptionAddBtn = page.locator('button:has-text("+ Add Function")').first();
    await receptionAddBtn.click();
    const receptionDateInput = page.locator('#date-reception');
    await expect(receptionDateInput).toBeVisible();
    await expect(receptionDateInput).toHaveAttribute('min', tomorrow);
    await receptionDateInput.fill('2026-11-18');
    await expect(receptionDateInput).toHaveValue('2026-11-18');

    // --- HOME EVENTS & PUJAS ---
    const homeDateInput = page.locator('#date-home-events');
    await expect(homeDateInput).toBeVisible();
    await expect(homeDateInput).toHaveAttribute('min', tomorrow);
    await homeDateInput.fill('2026-11-08');
    await expect(homeDateInput).toHaveValue('2026-11-08');

    // --- BRIDE & GROOM SERVICES ---
    const brideGroomDateInput = page.locator('#date-bride-groom');
    await expect(brideGroomDateInput).toBeVisible();
    await expect(brideGroomDateInput).toHaveAttribute('min', tomorrow);
    await brideGroomDateInput.fill('2026-11-09');
    await expect(brideGroomDateInput).toHaveValue('2026-11-09');

    // Click "Enquire with Selected Services"
    const proceedBtn = page.locator('button:has-text("Enquire with Selected Services")');
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();

    // Verify navigation to contact page
    await page.waitForURL(/\/contact/);
    await expect(page).toHaveURL(/\/contact.*eventType=wedding-packages/);
    await page.waitForSelector('#enquiry-form[data-hydrated="true"]');

    // Verify the primary wedding function date was carried over to the Contact form's date field
    const contactDateInput = page.locator('#date');
    await expect(contactDateInput).toHaveValue('2026-11-15');

    // Verify the message textarea includes the customized dates for Haldi, Sangeet, and Reception
    const messageInput = page.locator('#message');
    const messageValue = await messageInput.inputValue();
    expect(messageValue).toContain('Date: 2026-11-15');
    expect(messageValue).toContain('Date: 2026-11-16');
    expect(messageValue).toContain('Date: 2026-11-18');
  });
});
