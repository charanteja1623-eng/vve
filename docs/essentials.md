# Vintage Vibe Events — Essentials

> Short project reference. Read this before `architecture.md`.

## 1. Product

**Vintage Vibe Events = full production showcase + enquiry website.**

The website’s purpose is to:

**Show what VVE does → prove the quality → explain the benefits →
generate enquiries.**

This is **not an MVP**.

------------------------------------------------------------------------

## 2. Important Scope Decision

There will be:

- No payments.
- No checkout.
- No ticketing.
- No customer accounts.
- No e-commerce.
- No online transactions.

The website ends at:

``` text
Visitor
 ↓
Portfolio / Services
 ↓
Enquiry
 ↓
WhatsApp / Call / Email
 ↓
VVE team follows up
```

------------------------------------------------------------------------

## 3. Users

### Customers

People planning:

Weddings • Birthdays • Surprise Parties • Baby Showers • Cradle
Ceremonies • Anniversaries • Indoor/Outdoor Events • School/College
Events • New Year Events • Corporate Events

### VVE Team

Manages:

Portfolio • Services • Event Categories • Testimonials • Enquiries

------------------------------------------------------------------------

## 4. Brand

### Visual identity

``` text
Deep Burgundy
      +
Antique Gold
      +
Warm Ivory
      +
Classic Serif
      +
Indian Ornament
```

Brand feeling:

**Vintage + Indian + Premium + Elegant + Celebratory**

The supplied VVE logo is the source of truth.

Do not redesign it.

------------------------------------------------------------------------

## 5. Main Website Flow

``` text
LOADER
  ↓
HERO
  ↓
EVENTS WE ORGANIZE
  ↓
FEATURED WORK
  ↓
SERVICES
  ↓
WHY VINTAGE VIBE
  ↓
PROCESS
  ↓
PORTFOLIO
  ↓
TESTIMONIALS
  ↓
INSTAGRAM
  ↓
ENQUIRY
  ↓
FOOTER
```

Primary CTA:

**PLAN YOUR EVENT / SEND ENQUIRY**

Secondary:

**WHATSAPP / CALL**

------------------------------------------------------------------------

## 6. Signature Loader

Use the actual VVE logo.

Animation:

``` text
Gold fragments
      ↓
Fragments assemble
      ↓
VVE logo appears
      ↓
CREATING MOMENTS
      ↓
Progress
      ↓
Homepage reveal
```

The polygon/deer reference only defines the **fragment assembly
technique**.

Do not copy its futuristic/neon style.

------------------------------------------------------------------------

## 7. Stack

``` text
Next.js
TypeScript
Tailwind CSS
Supabase
PostgreSQL
Supabase Auth
RLS
Cloudinary
Zod
React Hook Form
Vercel
```

Animation:

**CSS/SVG first → Framer Motion/GSAP when justified.**

------------------------------------------------------------------------

## 8. Core Data

``` text
event_categories
services
portfolio_projects
portfolio_images
testimonials
enquiries
admin/auth users
```

Core relationship:

``` text
Event Category
      ↓
Portfolio Project
      ↓
Portfolio Images
```

Enquiries are separate leads.

------------------------------------------------------------------------

## 9. Public Pages

``` text
/
 /events
 /events/[slug]
 /services
 /services/[slug]
 /work
 /work/[slug]
 /about
 /contact
```

Legal pages as required.

------------------------------------------------------------------------

## 10. Admin

``` text
/admin

Dashboard
Portfolio
Events
Services
Testimonials
Enquiries
Site Content
```

Admin should be able to manage content without changing code.

Do not turn it into a full CRM.

------------------------------------------------------------------------

# 11. What Is Working in the Plan?

### Strong brand identity

The logo and visiting card give us a consistent burgundy + antique-gold
foundation.

### Strong visual product

The company’s event work is naturally suited to a portfolio-first
website.

### Clear business conversion

There is no need to force e-commerce. Enquiry → human follow-up matches
the business model.

### Useful backend

Supabase provides enough database/auth/security capability without a
separate backend server.

### Scalable content

Every new event can become a structured portfolio project.

------------------------------------------------------------------------

# 12. What Is Weak / What Could Break?

### Loader risk

If it takes too long, it hurts the actual business goal.

**Keep it short.**

### Branding risk

Too much gold and ornamentation can make the website look outdated.

**Use ornament selectively and let photography dominate.**

### Image quality risk

The visual design cannot compensate for bad source images.

**Get original high-resolution photos.**

### Portfolio risk

A collection of random photos does not tell a convincing story.

**Organize work by event/category and use project context.**

### Content credibility risk

Do not invent:

- Number of events.
- Years of experience.
- Ratings.
- Client counts.
- Awards.
- Service guarantees.

Only use facts confirmed by VVE.

### Lead-management risk

Enquiries can disappear if they only arrive through email.

**Store enquiries and track simple statuses.**

### Scope risk

Adding payments, CRM, AI, accounts, or ticketing would solve problems
the current website does not have.

**Keep the product focused on showcase + enquiry.**

------------------------------------------------------------------------

# 13. What We Still Need From the Client

## Brand

- Original logo, preferably SVG.
- Official brand colors if available.
- Brand guidelines if they exist.

## Business

- Exact service areas.
- Official phone numbers.
- WhatsApp number.
- Email.
- Business hours.
- Any verified company facts.

## Content

- High-resolution event photographs.
- Project names.
- Event categories.
- Service descriptions.
- Real testimonials.
- Company story.
- Team information if they want it public.

## Operations

- Who receives enquiries?
- Who follows up?
- Who manages the admin?
- Should enquiry notifications be sent by email?
- Should WhatsApp be the primary conversion channel?

## Product decisions

- Is bilingual English/Telugu content needed?
- Is a downloadable brochure needed?
- Should Instagram content be embedded or manually selected?
- Do corporate enquiries need different fields?
- What analytics should be tracked?

------------------------------------------------------------------------

# 14. Final Product Principle

``` text
                    BRAND
                      ↓
                 SHOWCASE
                      ↓
                   PROOF
                      ↓
                  BENEFITS
                      ↓
                   TRUST
                      ↓
                  ENQUIRY
                      ↓
              HUMAN CONVERSION
```

Build the complete website around this flow.

**Do not optimize for feature count. Optimize for how clearly and
convincingly Vintage Vibe Events presents its work and turns interest
into enquiries.**
