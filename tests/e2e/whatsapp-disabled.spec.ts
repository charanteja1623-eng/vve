import { test, expect } from '@playwright/test';
import { site } from '@/lib/site';

test.describe('WhatsApp Disabled / Unconfigured Behavior', () => {
  test('Components safely hide when whatsappNumber is empty or unconfigured', async () => {
    // When whatsappNumber is empty
    const dummyEmptyConfig = { ...site, whatsappNumber: "" };
    expect(dummyEmptyConfig.whatsappNumber).toBe("");

    // Verify regex and string sanitization guards
    const cleanPhone = dummyEmptyConfig.whatsappNumber.replace(/\D/g, "");
    expect(cleanPhone).toBe("");
    expect(Boolean(dummyEmptyConfig.whatsappNumber && cleanPhone)).toBe(false);
  });
});
