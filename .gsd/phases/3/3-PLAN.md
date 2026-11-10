---
phase: 3
plan: 1
wave: 1
gap_closure: false
---

# Plan 3.1: Safely Integrate Supabase with Existing Enquiry System

## Objective
Safely configure and integrate the Supabase project (`https://ackhkkdlpohzdxclnrkf.supabase.co`) with the VVE Next.js enquiry API, ensuring strict server-side credential handling, robust RLS database policies, accurate error reporting, and zero secret leakage.

## Context
- `src/app/api/enquiry/route.ts`
- `src/components/forms/EnquiryForm.tsx`
- `src/lib/validations/enquiry.ts`
- `supabase/migrations/20261010000000_create_enquiries.sql`
- `.env.example`
- `.gitignore`
- `playwright.config.ts`
- `tests/e2e/smoke.spec.ts`

## Tasks

<task type="auto">
  <name>Align environment variables and update .env.example</name>
  <files>
    src/app/api/enquiry/route.ts
    .env.example
  </files>
  <action>
    1. Update `src/app/api/enquiry/route.ts` to read:
       - `process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL`
       - `process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY`
    2. Update `.env.example` using placeholder values only:
       - `SUPABASE_URL=https://your-project-ref.supabase.co`
       - `SUPABASE_SECRET_KEY=your-supabase-secret-key`
       - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key` (optional client-side)
    3. Verify `.gitignore` continues to ignore `.env*` (except `.env.example`).
    AVOID: Exposing secret keys with `NEXT_PUBLIC_` prefixes or fabricating keys.
    USE: Safe server-side variables and placeholder documentation.
  </action>
  <verify>
    git diff src/app/api/enquiry/route.ts .env.example
  </verify>
  <done>
    Route correctly queries server-side Supabase variables; .env.example provides clean placeholder documentation.
  </done>
</task>

<task type="auto">
  <name>Review and verify API security controls</name>
  <files>
    src/app/api/enquiry/route.ts
    supabase/migrations/20261010000000_create_enquiries.sql
  </files>
  <action>
    1. Review `src/app/api/enquiry/route.ts`:
       - Server-side Zod validation with `enquirySchema`.
       - Payload size limit (10KB).
       - Honeypot check (`company_website`).
       - Rate limiting state (in-memory, document serverless cold-start limitations).
       - Error handling: return honest 503 when credentials missing, 500 when insert fails, never false success.
       - No PII or credentials logged in console.
    2. Review `supabase/migrations/20261010000000_create_enquiries.sql`:
       - Table `public.enquiries` with schema, timestamps, and trigger.
       - RLS enabled; no public anon select/update/delete policies.
  </action>
  <verify>
    npm run lint
  </verify>
  <done>
    API route conforms to security and error reporting standards without lint warnings or errors.
  </done>
</task>

<task type="auto">
  <name>Execute verification checks and document Supabase migration steps</name>
  <files>
    tests/e2e/smoke.spec.ts
  </files>
  <action>
    1. Run `npm run lint` and verify 0 errors.
    2. Run `npm run build` to ensure production compilation succeeds.
    3. Run `npx playwright test` across Desktop, Tablet, and Mobile viewports.
    4. Document exact instructions for the user to apply the migration in Supabase SQL Editor and enter `SUPABASE_SECRET_KEY` in `.env.local`.
    5. Clearly report live database persistence status as BLOCKED / NOT VERIFIED until secret key is provided.
  </action>
  <verify>
    npm run test:e2e
  </verify>
  <done>
    Lint, build, and browser tests pass cleanly; live persistence status accurately reported.
  </done>
</task>

## Must-Haves
- [ ] No secrets or publishable keys printed in reports or files
- [ ] `SUPABASE_URL` and `SUPABASE_SECRET_KEY` supported in `route.ts`
- [ ] `.env.example` updated with placeholders only
- [ ] No commits or pushes made
- [ ] Existing Playwright test suite passes intact
- [ ] Clear instructions for user to supply secret key locally and run migration

## Success Criteria
- [ ] All verification checks pass
- [ ] Security audit complete
- [ ] Honest status reporting
