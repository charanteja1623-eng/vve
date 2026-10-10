---
phase: 2
plan: 1
wave: 1
gap_closure: false
---

# Plan 2.1: Publish VVE Project to GitHub

## Objective
Safely publish the complete, verified Vintage Vibe Events project to GitHub under `charanteja1623-eng`, preserving all legitimate source code, configs, tests, documentation, and migrations while strictly excluding secrets, local build caches, and test artifacts.

## Context
- `package.json`
- `playwright.config.ts`
- `tests/e2e/smoke.spec.ts`
- `supabase/migrations/20261010000000_create_enquiries.sql`
- `.gitignore`
- `.env.example`

## Tasks

<task type="auto">
  <name>Security audit and .gitignore hardening</name>
  <files>
    .gitignore
  </files>
  <action>
    1. Update `.gitignore` to explicitly exclude test artifacts (`playwright-report/`, `test-results/`) and local IDE metadata (`.gemini/`).
    2. Audit untracked files and working directory to ensure no credentials, tokens, or private secrets exist.
    AVOID: Blindly force-adding ignored files or committing test run screenshots/traces.
    USE: Safe exclusion rules that protect sensitive and generated data.
  </action>
  <verify>
    git status --short
  </verify>
  <done>
    Generated test artifacts and local IDE caches are ignored; working tree contains only publishable source files and configs.
  </done>
</task>

<task type="checkpoint:decision">
  <name>Destination repository resolution and account authorization</name>
  <files>
    .git/config
  </files>
  <action>
    1. Confirm the destination repository name (e.g., `vintage-vibe-events`) and visibility (Private or Public).
    2. Resolve GitHub CLI / Git credential authentication for the `charanteja1623-eng` account (active CLI session is currently `24211a6682-source`).
    3. Verify remote repository URL and ensure no existing history will be overwritten destructively.
  </action>
  <verify>
    git remote -v
  </verify>
  <done>
    Remote repository exists and is accessible for push under the confirmed account.
  </done>
</task>

<task type="auto">
  <name>Stage, review, commit, and push</name>
  <files>
    .gitignore
    playwright.config.ts
    tests/e2e/smoke.spec.ts
    src/app/about/page.tsx
    package.json
    package-lock.json
    docs/
  </files>
  <action>
    1. Stage verified project source files, tests, and configurations.
    2. Manually review staged diff via `git diff --cached --stat` to verify no secrets or extraneous files are staged.
    3. Commit the changes with a descriptive message.
    4. Push the branch (`master`) to the confirmed GitHub remote repository.
    5. Verify the remote branch state.
  </action>
  <verify>
    git status --short; git log -n 1 --oneline
  </verify>
  <done>
    Commit pushed successfully and verified on GitHub without any remaining uncommitted or unpublished project files.
  </done>
</task>

## Must-Haves
- [ ] No secrets or `.env.local` files committed
- [ ] `playwright-report/` and `test-results/` ignored
- [ ] All legitimate application source, configs, migrations, tests, and documentation included
- [ ] Explicit confirmation of repository name, visibility, and authentication before push
- [ ] Working tree clean post-commit and push verified by remote
