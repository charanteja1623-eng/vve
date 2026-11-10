---
phase: 1
plan: 1
wave: 1
gap_closure: false
---

# Plan 1.1: Restore Playwright and Establish Browser Verification

## Objective
Diagnose and resolve the browser testing failure, configure Playwright for the Vintage Vibe Events Next.js project using available local browsers, and execute deterministic browser smoke tests across desktop (1440x900), tablet (768x1024), and mobile (390x844) viewports without touching the logo loader or introducing untrusted binaries.

## Context
- `package.json`
- `docs/tooling-audit.md`
- `src/app/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/about/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/forms/EnquiryForm.tsx`

## Tasks

<task type="auto">
  <name>Configure Playwright in the Next.js project</name>
  <files>
    package.json
    playwright.config.ts
  </files>
  <action>
    1. Install `@playwright/test` as a devDependency using `npm install --save-dev @playwright/test`.
    2. Add `"test:e2e": "playwright test"` to `package.json` scripts.
    3. Create `playwright.config.ts` configured for:
       - Base URL: `http://localhost:3000`
       - Projects configured for Desktop (1440x900), Tablet (768x1024), and Mobile (390x844) viewports.
       - Use channel 'chrome' (or Chromium) utilizing the verified installed local browser executables.
       - WebServer config or reuse existing running server on port 3000.
    AVOID: Downloading untrusted browser binaries or modifying application code.
    USE: Existing verified browser binaries and standard Playwright runner.
  </action>
  <verify>
    npx playwright --version
  </verify>
  <done>
    Playwright CLI is operational and configured to target local browser installations.
  </done>
</task>

<task type="auto">
  <name>Create deterministic browser smoke test suite</name>
  <files>
    tests/e2e/smoke.spec.ts
  </files>
  <action>
    1. Create `tests/e2e/smoke.spec.ts` with tests for:
       - Homepage rendering: Check header, hero, footer, and verify no horizontal scrollbar/overflow (scrollWidth <= clientWidth).
       - Public page navigation: Verify `/about`, `/contact` routes load with status 200 and required landmark elements.
       - Mobile/Tablet navigation: Verify hamburger menu toggle, menu items visibility, and keyboard accessibility.
       - Contact / Enquiry form client-side validation: Test submitting empty or invalid data, verify client-side validation messages appear without triggering an actual backend submission.
       - Console error monitoring: Track and report console errors and network request failures during navigation.
    AVOID: Submitting mock data to backend or expecting live Supabase credentials.
    AVOID: Modifying loader components or animation CSS.
    USE: Deterministic assertions on DOM structure and client-side validation.
  </action>
  <verify>
    npx playwright test
  </verify>
  <done>
    All smoke tests execute across Desktop, Tablet, and Mobile viewports with clear pass/fail output.
  </done>
</task>

<task type="auto">
  <name>Execute verification, lint, build, and diff audit</name>
  <files>
    tests/e2e/smoke.spec.ts
    playwright.config.ts
    package.json
  </files>
  <action>
    1. Run `npx playwright test` and record test results per viewport (Desktop, Tablet, Mobile).
    2. Run `npm run lint` and verify clean code standards.
    3. Run `npm run build` to ensure production compilation succeeds.
    4. Perform manual git diff review to guarantee no application, loader, or credential files were altered.
  </action>
  <verify>
    npm run lint && npm run build
  </verify>
  <done>
    Lint passes, build passes, browser tests execute and report per-viewport results, git diff is clean of app regressions.
  </done>
</task>

## Must-Haves
- [ ] Root cause of original browser testing failure isolated and documented
- [ ] Playwright runnable via npm script / npx CLI
- [ ] Smoke tests execute against desktop (1440x900), tablet (768x1024), and mobile (390x844) viewports
- [ ] No changes to `src/components/loader/LogoLoader.tsx`, `logoShards.ts`, or loader styles in `globals.css`
- [ ] `npm run lint` and `npm run build` pass
- [ ] No commits or pushes made

## Success Criteria
- [ ] All tasks executed with explicit command outputs
- [ ] Acceptance criteria satisfied
