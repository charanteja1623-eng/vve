---
phase: 5
plan: 1
wave: 1
gap_closure: false
---

# Plan 5.1: Authentic Content & Media Integration

## Objective
Elevate the Vintage Vibe Events application from placeholder wireframes into a regal, high-fidelity luxury showcase by integrating curated Indian event photography, artisanal service descriptions, comprehensive event disciplines, interactive portfolio filters, and a persistent WhatsApp click-to-chat action adapted from the Google Stitch reference design system.

## Context
- `next.config.ts`
- `src/lib/site.ts`
- `src/app/page.tsx`
- `src/app/events/page.tsx`
- `src/app/services/page.tsx`
- `src/app/work/page.tsx`
- `src/components/layout/WhatsAppFab.tsx`
- `stitch_vintage_vibe_events_website/`
- `tests/e2e/smoke.spec.ts`

## Tasks

<task type="auto">
  <name>Configure remote image patterns and WhatsApp site config</name>
  <files>
    next.config.ts
    src/lib/site.ts
    src/components/layout/WhatsAppFab.tsx
    src/app/layout.tsx
  </files>
  <action>
    1. Update `next.config.ts` to allow `lh3.googleusercontent.com` in `images.remotePatterns`.
    2. Update `src/lib/site.ts`:
       - Add `whatsappNumber`: `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918886882608"` (configurable with verified default).
       - Add structured data for event disciplines, artisanal services, and portfolio projects with real photography and descriptions adapted from Stitch.
    3. Create `src/components/layout/WhatsAppFab.tsx`:
       - Floating action button in bottom right corner with official WhatsApp green `#25D366`, gold hover ring, SVG WhatsApp icon, tooltip/badge ("Chat with Atelier"), and direct link to `https://wa.me/...`.
       - Accessible attributes (`aria-label="Chat on WhatsApp"`, `target="_blank"`, `rel="noopener noreferrer"`).
    4. Include `WhatsAppFab` in `src/app/layout.tsx` so it appears globally across all routes.
    AVOID: Unoptimized images or unconfigured remote domains.
    USE: Next.js `<Image>` with explicit width/height/sizes or `fill` with `object-cover`.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    `next.config.ts` compiles with remote pattern, `WhatsAppFab` renders in layout, site config provides structured event and service data.
  </done>
</task>

<task type="auto">
  <name>Revamp Homepage with authentic photography and royal copy</name>
  <files>
    src/app/page.tsx
  </files>
  <action>
    1. Replace hero background placeholder with high-resolution palatial ballroom / floral mandap imagery.
    2. Update "Signature Offerings / Curated Event Disciplines" with real images (Weddings, Birthday Parties, Surprise Parties, Corporate Events, College Galas, Indoor/Outdoor).
    3. Update "Artisanal Services" grid with evocative titles and descriptions (Shahi Catering, Grand Tent House, Nizam Scenography, etc.).
    4. Update "Recent Work / Portfolio" preview bento grid with real photos and event titles.
    5. Maintain existing performance, zero horizontal overflow, and loader integration intact.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    Homepage displays rich luxury Indian event photography and copy with zero placeholder blocks.
  </done>
</task>

<task type="auto">
  <name>Revamp Events page with 6 comprehensive event disciplines</name>
  <files>
    src/app/events/page.tsx
  </files>
  <action>
    1. Update `/events` to render 6 detailed disciplines:
       - Royal Weddings & Mandaps
       - Milestone Birthdays & Thematic Soirées
       - Romantic Proposals & Surprise Parties
       - Executive Corporate Galas & Summits
       - Grand Campus & Concert Productions
       - Palatial Courtyard & Lawn Gatherings
    2. Add real high-resolution event imagery for each discipline.
    3. Add feature highlights (e.g. Bespoke scenography, 3D floorplans, acoustic engineering) and replace placeholder text.
    4. Provide direct CTA links to `/contact` prefilled with event type.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    Events page displays complete, authentic descriptions and photography for all 6 disciplines.
  </done>
</task>

<task type="auto">
  <name>Revamp Services page with 8 artisanal add-on offerings</name>
  <files>
    src/app/services/page.tsx
  </files>
  <action>
    1. Update `/services` to showcase 8 artisanal services:
       - 01. Royal Live Catering & Gastronomic Curation (Shahi Dastarkhwan, Live Chettinad, Halwa boutique)
       - 02. Couture Decoration & Floral Architecture (Nizami marigold arches, imported orchids, brass chafers)
       - 03. German Hangar & Luxury Tent House (Waterproof German hangars, crystal chandeliers, pleated ceilings)
       - 04. Concert Audio & Curved LED Screens (P2.5 LED walls, line-array audio, cold-pyro sparklers)
       - 05. Heirloom Photography & Cinematic Film (4K drone, candid portraits, teaser reels)
       - 06. Bespoke Welcome Favors & Customized Gifts (Hand-poured candle boxes, artisanal dry-fruit hampers)
       - 07. Preservation Resin & 3D Memorial Moulds (Varmala bridal bouquet preservation, gold leaf casting)
       - 08. Executive Corporate Gifting (Leather folios, luxury sweets, custom branding)
    2. Include real photography and bulleted signature inclusions for each service.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    Services page displays rich artisanal descriptions, photography, and package inclusions.
  </done>
</task>

<task type="auto">
  <name>Revamp Work / Portfolio page with interactive category filters</name>
  <files>
    src/app/work/page.tsx
  </files>
  <action>
    1. Turn `/work` into an interactive client component with category filters: All, Weddings, Birthdays & Surprises, Corporate, Add-ons.
    2. Display gallery items with real photography, project names, venues in Hyderabad (e.g., Falaknuma Palace, Banjara Hills, HICC, Jubilee Hills), and tags.
    3. Include modal lightbox or expanded card view for viewing event details.
    4. Ensure smooth responsive grid layout on desktop, tablet, and mobile.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    Work page renders filterable gallery with real photography and metadata without placeholder boxes.
  </done>
</task>

<task type="auto">
  <name>Execute verification checks and update testing suite</name>
  <files>
    tests/e2e/smoke.spec.ts
    docs/PROJECT_STATUS.md
    .gsd/STATE.md
  </files>
  <action>
    1. Update `tests/e2e/smoke.spec.ts` to verify the new WhatsApp FAB button visibility and interaction.
    2. Run `npm run lint` and verify 0 errors.
    3. Run `npm run build` and verify Turbopack production compilation succeeds.
    4. Run `npm run test:e2e` across Desktop, Tablet, and Mobile viewports.
    5. Update `docs/PROJECT_STATUS.md` and `.gsd/STATE.md` with verified Phase 5 progress.
  </action>
  <verify>
    npm run test:e2e
  </verify>
  <done>
    Lint, build, and all Playwright tests pass 100% across all viewports.
  </done>
</task>

## Must-Haves
- [ ] No changes to approved logo loader or animation mechanics
- [ ] Next.js `<Image>` configured with `lh3.googleusercontent.com`
- [ ] All 4 pages (`/`, `/events`, `/services`, `/work`) free of placeholder boxes and bracketed text
- [ ] Global WhatsApp FAB with direct wa.me link
- [ ] Production build and Playwright tests pass 100%
- [ ] Zero horizontal overflow on any viewport

## Success Criteria
- [ ] All 6 tasks executed cleanly
- [ ] Rich, authentic visual experience across the site
