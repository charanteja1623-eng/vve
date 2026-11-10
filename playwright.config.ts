import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for Vintage Vibe Events (VVE).
 * Cross-viewport testing: Desktop (1440x900), Tablet (768x1024), Mobile (390x844).
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-1440x900',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'tablet-768x1024',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'mobile-390x844',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-webkit-390x844',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
