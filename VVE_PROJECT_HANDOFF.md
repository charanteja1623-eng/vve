# Vintage Vibe Events (VVE) --- Project Handoff

**Last consolidated:** 10 October 2026\
**Production project:** `F:\projects or code\VVE`\
**Google Stitch reference:**
`F:\projects or code\VVE\stitch_vintage_vibe_events_website`

> This file carries forward prior project decisions into Antigravity. It
> is not proof that a feature currently exists. Antigravity must verify
> all status claims against the actual repository before changing code.

## 1. Project purpose

Vintage Vibe Events is a real event-management business. Build the
**full production showcase and enquiry-generation website**, not an MVP.

### Goals

-   Present the brand and services professionally.
-   Make real event photography and portfolio work central.
-   Generate enquiries through a form, WhatsApp, phone, and email.
-   Serve visitors arriving from Instagram, WhatsApp, and direct links.
-   Provide a lightweight, protected admin interface for content and
    enquiry management.

### Explicit exclusions

-   No payments, checkout, ticketing, e-commerce, subscriptions, or
    customer accounts.
-   No full CRM; lightweight enquiry status tracking is enough.
-   Never invent years of experience, number of events, awards, ratings,
    "best" claims, testimonials, client names, or portfolio details.
-   Do not publish placeholders as real business information.

Primary CTA: **Enquire Now**. WhatsApp/call/email are secondary
channels, using verified details only.

## 2. Directory roles

### Production application

`F:\projects or code\VVE`

This is the canonical production codebase. All production implementation
must remain here. Do not replace it wholesale with generated Stitch
code.

### Stitch reference

`F:\projects or code\VVE\stitch_vintage_vibe_events_website`

Downloaded Google Stitch frontend. Keep it intact and treat it as a
**visual/reference implementation**, not as the technical source of
truth. Audit its framework, dependencies, routes, components, CSS,
fonts, assets, responsive behavior, navigation, hero, services,
portfolio, enquiry CTA, footer, and animations. Decide what to adapt
into Next.js; do not blindly copy the whole project or accidentally
expose it as production routes/assets.

### Earlier backup

Claude reported a backup at `F:\projects or code\_VVE_old_backup`.
Verify that it exists before relying on it; do not delete it without
approval.

## 3. Business content

### Event categories discussed

-   Wedding Packages
-   Birthday Parties
-   Surprise Parties
-   Indoor & Outdoor Events
-   School & College Events
-   New Year Parties
-   Baby Showers
-   Cradle Ceremonies
-   Anniversaries
-   Corporate Events

### Services/add-ons discussed

-   Catering
-   Decoration
-   Tent House
-   DJ & Screens
-   Photography & Videography
-   Customized Gifts
-   Resin & 3D Moulds
-   Corporate Gifting

These are candidate content items from prior discussions. Verify which
are currently offered before publishing them.

### Portfolio

Real event photography should dominate the visual experience. Do not
fabricate event images, event descriptions, client names, or results.
Clearly mark development placeholders and keep them out of
production-facing content until replaced.

### Enquiry statuses proposed

`New → Contacted → Qualified → Quoted → Won / Lost / Closed`

This is a proposed workflow, not confirmation that it has been
implemented.

### Contact information

The handle `vintage_vibe_events` was seen in extracted source material;
verify the official Instagram URL. WhatsApp number and business hours
were previously flagged as unconfirmed. Do not invent phone numbers,
email, address, hours, or WhatsApp links. Use explicit
TODO/configuration blockers until verified.

## 4. Brand and design direction

Desired feeling: **"a modern digital interpretation of a premium Indian
event invitation."**

Character: premium, elegant, vintage-inspired, Indian, warm, refined,
celebratory.

Palette previously reported in the P0 scaffold: - Deep burgundy:
`#3a0507` - Burgundy: `#671217` - Deep burgundy: `#210304` - Antique
gold: `#c9a15a` - Light gold: `#e3c985` - Warm ivory: `#f7f1e5` -
Supporting dark plum/charcoal

Typography: - Cormorant Garamond - Manrope - Cinzel Decorative Bold for
recreating the logo wordmark, where appropriate

Claude reported self-hosting Cormorant Garamond and Manrope with
`next/font`; verify the current repo before assuming this remains true.

Avoid generic wedding templates, SaaS styling, gaming/neon/nightclub
aesthetics, excessive glassmorphism, generic gradients, repetitive
cards, excessive ornamentation, random glowing particles, and
unsupported business claims.

Visual priority: **real event photography → typography/hierarchy → brand
→ composition/layout → purposeful motion → UI decoration.**

## 5. Mobile-first requirements

Design first for approximately **360--430 px** mobile viewports, then
progressively enhance for tablet, laptop, and desktop. Mobile visitors
may arrive from Instagram, WhatsApp, or direct social links.

-   Clear brand and primary CTA near the top.
-   Thumb-friendly navigation and contact actions.
-   Readable type, deliberate image crops, no horizontal overflow.
-   Portfolio remains visually compelling; do not simply squeeze a
    desktop masonry layout into mobile.
-   Keep animation and assets performant on lower-end phones.
-   Test mobile portrait and desktop breakpoints.
-   Desktop may use more whitespace, editorial/asymmetric layouts, and
    richer image compositions while preserving the same brand system.

## 6. Logo asset findings and decision

Do not treat the various logo files as interchangeable.

### Small original PNG

Reported as 230×192 px. Earlier code had a filename/path mismatch. P0
reportedly corrected the public file to
`public/vintage-vibe-events-logo.png`. This old asset should not
automatically remain canonical.

### First traced SVG

`vintage-vibe-events-logo.svg` was inspected and contains about 90
anonymous traced paths. It is an auto-trace of raster artwork, not clean
designer-authored geometry. It may support an emblem-shard animation,
but the paths do not correspond cleanly to letters, named flourishes, or
ring segments.

### `logo.svg`

Another file was inspected and found to be an SVG wrapper containing an
embedded PNG plus one path. It is not a clean editable vector source for
the whole logo.

### Canva PDF

The Canva PDF was identified as a genuine Canva export, but the artwork
is mixed: - "VINTAGE VIBE EVENTS" wordmark: vector text, font **Cinzel
Decorative Bold**, gold approximately `#9a6b06`. - Ornamental gold
frame: raster artwork with transparency, reported as 720×436 px. - The
complete logo is therefore not fully vector.

Claude reported extracting these assets losslessly: - Gold logo:
1104×680 transparent PNG - Navy variant: 1656×1019 transparent PNG -
Frame-only gold: 720×436 transparent PNG - Instagram QR code from page 3

Claude said the extracted files were saved in Downloads with `_vve_`
prefixes but had not yet been copied into `public/`. Verify exact
filenames and availability.

### Canonical decision confirmed by user

**The user is using the frame-only gold version.** This is the canonical
logo artwork/treatment.

-   Do not switch back to the old burgundy-circle version.
-   Do not redesign or combine logo treatments without approval.
-   If the loader includes the wordmark, compose the frame-only gold
    artwork with the wordmark in Cinzel Decorative Bold, preserving
    source proportions, color, spacing, and typography. Verify against
    the approved Canva source.
-   The extracted frame-only asset is frame-only; do not assume it
    contains the words.
-   Confirm how the frame-only artwork is used across the Stitch design
    before making a site-wide replacement.

## 7. Loading animation --- approved direction

The loader is being designed separately by Claude. Do not replace it
with an unrelated Stitch animation without review.

Approved direction: - Use the frame-only gold asset as the canonical
frame artwork. - Hybrid concept: fragment the actual frame artwork into
coherent plates/shards; animate/recreate the wordmark separately in
Cinzel Decorative Bold if it belongs in the approved final lockup. -
Premium, cinematic, elegant; around **2--3 seconds**. - No generic
spinner/loading bar, ambient random particles, or glowing dust. -
Mobile-first, performant, and respects `prefers-reduced-motion`. - Final
assembled state must match the approved final logo/lockup.

Technical limitation: the frame is raster, not clean vector geometry. A
real-pixel/plate shatter can use fragments derived from the image, but
should not be described as animating original frame vector paths. The
wordmark is vector text in the Canva PDF and can be recreated using the
correct font.

Last reported status: Claude had completed P0 and had not yet started P1
at the last checkpoint. The user later confirmed the frame-only gold
treatment. **Inspect the current code before assuming P1 is still
unimplemented.**

## 8. Stack and architecture

### P0 scaffold as previously reported

Claude reported: - Next.js 16 App Router - TypeScript - Tailwind CSS
v4 - Cormorant Garamond and Manrope via `next/font` - Tailwind v4
`@theme` brand tokens - Basic `SiteHeader` and `SiteFooter` skeletons -
Placeholder home page - `src/lib/site.ts` for site/contact
configuration - Focus-visible styling and a global reduced-motion
guard - Git initialized and first commit created - `npm run build`
passed; TypeScript clean; four static routes generated - `.env*` ignored
by Git; no secrets committed

These are reported historical facts. Re-check the current repo and
build.

### Proposed production stack

-   Next.js + TypeScript + Tailwind CSS
-   Supabase / PostgreSQL / Supabase Auth / Row-Level Security, if
    confirmed appropriate
-   Cloudinary or another selected managed image service
-   React Hook Form + Zod
-   CSS/SVG and/or Framer Motion/GSAP only where justified
-   Vercel deployment

Do not add services just because they are listed here. Inspect the
current code and validate choices before integration. Keep credentials
in environment variables, never in source control.

### Suggested data entities (not confirmed implemented)

-   `event_categories`
-   `services`
-   `portfolio_projects`
-   `portfolio_images`
-   `testimonials`
-   `enquiries`
-   admin/auth users

Admin should manage content and enquiries without becoming a full CRM.
Protect admin routes and private enquiries; apply RLS if using Supabase.

## 9. Documentation

Earlier work referenced: - `product-requirements.md` --- goals, target
users, scope, content, conversion, behavior. - `architecture.md` ---
stack, architecture, data models, security, media, deployment. -
`essentials.md` --- concise decisions, risks, unknowns, open questions.

Verify actual filenames and contents. Read existing docs; do not blindly
recreate or overwrite them. If docs, handoff, and code conflict, report
the conflict before making consequential choices.

## 10. Stitch integration workflow

1.  Audit production repo and Stitch folder read-only.
2.  Identify the strongest visual sections, assets, components,
    typography, and responsive patterns.
3.  Compare them against the brand and product requirements.
4.  Decide what should be recreated/adapted into Next.js rather than
    copied verbatim.
5.  Keep the Stitch project intact.
6.  Check that the nested folder will not create unintended routes,
    build inputs, or deployment files.
7.  Return a file-by-file integration plan.
8.  Wait for approval before major changes unless implementation is
    explicitly authorized.

Production architecture remains authoritative; Stitch is a visual
reference.

## 11. Quality requirements

### Accessibility

Semantic HTML, heading hierarchy, keyboard support, visible focus,
meaningful alt text, sufficient contrast, reduced-motion support,
touch-friendly targets, labelled forms, accessible validation/errors.

### Performance

Optimized responsive images, controlled JS and animation weight,
transforms/opacity where appropriate, no layout shifts or horizontal
overflow, mobile testing.

### Security and reliability

Server-side input validation; protected admin; private enquiry data;
least-privilege/RLS if applicable; no committed secrets; spam/rate-limit
protection for public forms as appropriate; useful
loading/success/error/empty states. Do not claim completion without
testing.

### SEO

Titles/descriptions, Open Graph/social metadata, clean URLs, accurate
business details only after verification, useful image alt text,
structured data only where supported by verified facts.

## 12. Unknowns/blockers to verify

-   Verified WhatsApp number and approved link.
-   Official phone, email, address/location, business hours.
-   Which categories/services should actually be published.
-   Real portfolio images and approved captions/details.
-   Approved testimonials and permission to publish.
-   Exact filenames/locations of extracted Canva assets.
-   Current implementation state of the loader.
-   Whether Supabase, Cloudinary, backend enquiry flow, admin, and
    deployment exist.
-   Whether the current repo builds and tests pass.
-   Whether the site-wide logo should be frame-only or whether the
    wordmark is a separate companion element in particular layouts. The
    user has confirmed frame-only gold as the logo treatment in use; do
    not silently change this.

## 13. Last reported progress (verify now)

  -----------------------------------------------------------------------
  Workstream              Last reported status    Next action
  ----------------------- ----------------------- -----------------------
  P0 foundation           Reported complete       Inspect files, Git
                                                  status, and rerun build

  P1 loader               Not started at last     Inspect current loader
                          checkpoint; logo        and continue from
                          decision came later     actual state

  P2 website UI           Not reported complete   Audit Stitch and
                                                  production UI

  P3 backend/enquiries    Not reported complete   Inspect code/docs; plan
                                                  secure enquiry flow

  P4 admin/content        Not reported complete   Inspect and scope
                                                  minimal protected admin

  P5 production readiness Not reported complete   Verify tests,
                                                  accessibility,
                                                  performance, SEO,
                                                  security, deployment
  -----------------------------------------------------------------------

## 14. Instructions for Antigravity

**Do not begin by rewriting the app. Establish the actual state first.**

1.  Confirm workspace: `F:\projects or code\VVE`.
2.  Inspect Git status and recent commits; preserve uncommitted user
    work.
3.  Read `product-requirements.md`, `architecture.md`, `essentials.md`,
    and related docs if present.
4.  Inspect `package.json`, Next config, `src/`, `app/` or `src/app/`,
    `public/`, Tailwind/CSS, routes, and components.
5.  Inspect the Stitch directory separately and leave it unchanged.
6.  Locate and verify the Canva-extracted frame-only asset.
7.  Inspect the loader and compare with the approved direction.
8.  Run available checks: build, lint, tests.
9.  Report facts under: implemented, partial, missing,
    broken/inconsistent, blocked.
10. Identify conflicts between docs, handoff, and code.
11. Propose a prioritized plan with exact files to change and risks.
12. **Stop after the audit and wait for approval before major code
    changes.**

Operating rules: - Production implementation stays in
`F:\projects or code\VVE`. - Preserve the Stitch reference and old
backup if present. - Do not overwrite the repo with generated code. - Do
not invent business details or publish placeholders as facts. - Do not
redesign the approved logo or replace the loader with a generic
animation. - Prefer small, reviewable changes and verify each
milestone. - Update this handoff as meaningful decisions/status change.

## 15. Prompt to start Antigravity

> Read `VVE_PROJECT_HANDOFF.md` completely. Audit the current workspace
> at `F:\projects or code\VVE`, including the documentation, Git state,
> Next.js implementation, logo assets, loader, and Stitch reference at
> `F:\projects or code\VVE\stitch_vintage_vibe_events_website`.
>
> Treat the handoff as project context, but verify every
> implementation/status claim against the actual files. Do not
> overwrite, delete, or regenerate the project. Do not make code changes
> yet.
>
> Return a factual audit of completed, partial, missing, broken, and
> blocked work. Identify contradictions between the handoff, docs, and
> code, then propose a prioritized, file-by-file next-step plan.
> Preserve all user work and stop for approval before major
> implementation.
