# Vintage Vibe Events — Full Website Architecture

## 1. Architecture Position

Vintage Vibe Events is a **production showcase + enquiry website**.

It is not an MVP and it is not an e-commerce/ticketing application.

The architecture should therefore be complete enough for production
while remaining deliberately simple.

### Core system

``` text
Next.js
   ↓
Supabase
   ├── PostgreSQL
   ├── Auth
   └── Row Level Security
   ↓
Cloudinary
   ↓
Media delivery

External conversion:
WhatsApp / Phone / Email
```

------------------------------------------------------------------------

## 2. Recommended Stack

| Layer             | Technology                                | Purpose                        |
|-------------------|-------------------------------------------|--------------------------------|
| Frontend          | Next.js + TypeScript                      | Production website             |
| Styling           | Tailwind CSS                              | Design system/responsive UI    |
| Animation         | CSS + Framer Motion / GSAP when justified | Branded motion                 |
| Backend           | Supabase                                  | Application backend services   |
| Database          | PostgreSQL                                | Content + enquiry data         |
| Authentication    | Supabase Auth                             | Admin access                   |
| Database security | PostgreSQL RLS                            | Public/admin separation        |
| Media             | Cloudinary                                | Image/video optimization       |
| Validation        | Zod                                       | Form/server validation         |
| Forms             | React Hook Form                           | Enquiry UX                     |
| Hosting           | Vercel                                    | Deployment                     |
| Maps              | Google Maps                               | Venue/location links           |
| Communication     | WhatsApp + phone + email                  | Enquiry conversion             |
| Analytics         | Google Analytics/other agreed tool        | Traffic/conversion measurement |

### Important

No payment gateway is required.

No checkout backend is required.

No ticketing system is required.

No customer account system is required.

------------------------------------------------------------------------

## 3. High-Level Architecture

``` text
                         VISITORS
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
          Instagram       Google       Referral/Direct
             └──────────────┼──────────────┘
                            ↓
                     NEXT.JS WEBSITE
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
       UI/Pages        Server Logic       SEO/Metadata
                            │
                            ↓
                         SUPABASE
                 ┌──────────┼──────────┐
                 ↓          ↓          ↓
             PostgreSQL    Auth        RLS
                 │
        ┌────────┼─────────┬─────────────┐
        ↓        ↓         ↓             ↓
     Events   Services  Portfolio     Enquiries
        │                  │
        │                  ↓
        │            Portfolio Images
        │
        └──────── Testimonials

                      CLOUDINARY
                           │
                     Images / Video
                           ↓
                  Optimized delivery

                    CONVERSION CHANNELS
                ┌──────────┼──────────┐
                ↓          ↓          ↓
             WhatsApp    Phone      Email
```

------------------------------------------------------------------------

## 4. Public Site Architecture

### `/`

Full homepage:

- Loader.
- Hero.
- Events.
- Featured work.
- Services.
- Benefits.
- Process.
- Portfolio preview.
- Testimonials.
- Social proof.
- Enquiry CTA.

### `/events`

All event types.

### `/events/[slug]`

Detailed event category page where enough content exists.

Example:

`/events/weddings`

### `/services`

All services.

### `/services/[slug]`

Detailed service page where useful.

Example:

`/services/decoration`

### `/work`

Portfolio.

### `/work/[slug]`

Individual project/case-study page.

### `/about`

Company story and positioning.

### `/contact`

Enquiry/contact page.

### `/legal/privacy`

Privacy policy.

### `/legal/terms`

Terms.

### `/legal/refund-policy`

Only needed if a refund/payment relationship is introduced; not required
for the current enquiry-only model unless legal counsel/client
requirements say otherwise.

------------------------------------------------------------------------

## 5. Admin Architecture

Protected route:

`/admin`

Suggested areas:

``` text
Dashboard
├── Overview
├── Portfolio
│   ├── Projects
│   └── Images
├── Events
├── Services
├── Testimonials
├── Enquiries
└── Site Content
```

### Admin capabilities

- Create/update/delete portfolio projects.
- Upload/manage project images.
- Assign event categories.
- Mark projects as featured.
- Publish/unpublish content.
- Create/update services.
- Manage testimonials.
- View enquiries.
- Update enquiry status.

Do not build a complex CRM unless the client asks for one.

------------------------------------------------------------------------

## 6. Data Model

### `event_categories`

``` text
id UUID PK
name TEXT
slug TEXT UNIQUE
description TEXT
cover_image_url TEXT
is_active BOOLEAN
sort_order INTEGER
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Examples:

- Weddings
- Birthdays
- Baby Showers
- Cradle Ceremonies
- Anniversaries
- Corporate Events
- College Events

------------------------------------------------------------------------

### `services`

``` text
id UUID PK
name TEXT
slug TEXT UNIQUE
description TEXT
category TEXT
image_url TEXT
is_active BOOLEAN
sort_order INTEGER
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Examples:

- Decoration
- Catering
- Photography & Videography
- DJ & Screens
- Tent House
- Customized Gifts
- Resin & 3D Moulds

------------------------------------------------------------------------

### `portfolio_projects`

``` text
id UUID PK
title TEXT
slug TEXT UNIQUE
description TEXT
event_category_id UUID FK
location TEXT NULL
event_date DATE NULL
cover_image_url TEXT
featured BOOLEAN
published BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

A project represents one real event/setup or a curated work item.

------------------------------------------------------------------------

### `portfolio_images`

``` text
id UUID PK
project_id UUID FK
image_url TEXT
cloudinary_public_id TEXT
alt_text TEXT
sort_order INTEGER
created_at TIMESTAMPTZ
```

Relationship:

``` text
portfolio_project
       │
       ├── image
       ├── image
       ├── image
       └── image
```

------------------------------------------------------------------------

### `testimonials`

``` text
id UUID PK
customer_name TEXT
event_type TEXT
content TEXT
rating INTEGER NULL
image_url TEXT NULL
published BOOLEAN
created_at TIMESTAMPTZ
```

Only verified/approved customer feedback should be displayed.

------------------------------------------------------------------------

### `enquiries`

``` text
id UUID PK
name TEXT
phone TEXT
email TEXT NULL
event_type TEXT
event_date DATE NULL
location TEXT NULL
budget_range TEXT NULL
message TEXT
status TEXT
source TEXT NULL
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Recommended status:

``` text
new
contacted
qualified
quoted
won
lost
closed
```

Recommended source:

``` text
website
instagram
google
whatsapp
referral
other
```

------------------------------------------------------------------------

### `admins`

Use Supabase Auth for identity.

Optional profile table:

``` text
id UUID PK
auth_user_id UUID UNIQUE
display_name TEXT
role TEXT
created_at TIMESTAMPTZ
```

Initial roles:

``` text
admin
editor
```

------------------------------------------------------------------------

## 7. Relationships

``` text
event_categories
       │
       └──────────< portfolio_projects
                         │
                         └──────────< portfolio_images

services
   └── independent catalogue

portfolio_projects
   └── featured → homepage

testimonials
   └── published → public site

enquiries
   └── managed by admin
```

------------------------------------------------------------------------

## 8. Security Model

### Public read

Public users may read:

- Active event categories.
- Active services.
- Published portfolio projects.
- Published portfolio images.
- Published testimonials.

### Public write

Public users may create an enquiry.

### Public restrictions

Public users must not:

- Modify content.
- Delete content.
- Read admin records.
- Read private enquiries.
- Modify existing enquiries.

### Admin

Authenticated admins/editors can perform permitted content operations.

Use:

- Supabase Auth.
- RLS.
- Server-side authorization.
- Zod validation.
- Secure environment variables.

------------------------------------------------------------------------

## 9. Media Architecture

Event photography is one of the most important assets in this product.

Do not store raw image binaries inside PostgreSQL.

Use Cloudinary for:

- Portfolio photographs.
- Hero media.
- Gallery images.
- Short videos where required.

Store references in Supabase.

``` text
Original media
      ↓
Cloudinary
      ↓
Responsive transformations
      ↓
Optimized URL
      ↓
Next.js image rendering
```

Use appropriate:

- Width transformations.
- WebP/AVIF.
- Thumbnails.
- Lazy loading.
- Quality settings.

------------------------------------------------------------------------

## 10. Loading Screen

The loading screen is a branded presentation component.

``` text
Page opens
    ↓
Dark burgundy background
    ↓
Gold fragments appear
    ↓
Fragments assemble
    ↓
Actual VVE logo is revealed
    ↓
CREATING MOMENTS
    ↓
Progress indicator
    ↓
Loader exits
    ↓
Homepage
```

### Rules

- Use the actual client logo.
- Do not regenerate the logo.
- Fragmentation is an animation technique.
- Keep the loader short.
- Do not block the application unnecessarily.
- Respect `prefers-reduced-motion`.
- Prefer CSS/SVG for lightweight effects.
- Use GSAP/Framer Motion only when it materially improves the result.

------------------------------------------------------------------------

## 11. Enquiry Architecture

There is no online transaction.

The enquiry system is:

``` text
Visitor
   ↓
Enquiry Form
   ↓
Client-side validation
   ↓
Server-side validation
   ↓
Supabase `enquiries`
   ↓
Admin dashboard
   ↓
VVE team
   ↓
WhatsApp / Phone / Email
```

WhatsApp buttons can also initiate direct conversations without storing
the message in the website.

The enquiry form should support source tracking when possible.

------------------------------------------------------------------------

## 12. SEO Architecture

The site should be built as a real business website, not only a visual
portfolio.

Include:

- Unique title/meta per page.
- Open Graph metadata.
- Semantic headings.
- Descriptive image alt text.
- Sitemap.
- Robots configuration.
- Canonical URLs.
- Local-business structured data where accurate.
- Service/event-specific pages where enough content exists.
- Fast mobile rendering.

Do not create thin SEO pages simply to increase URL count.

------------------------------------------------------------------------

## 13. Performance Architecture

Priority order:

``` text
Real content
    ↓
Image optimization
    ↓
Fast page rendering
    ↓
Accessible UI
    ↓
Animation
```

Animation must not compromise:

- LCP.
- Mobile performance.
- Accessibility.
- Navigation.

Use:

- Next.js image optimization.
- Cloudinary transformations.
- Lazy loading.
- Dynamic loading for non-critical interactive elements.
- CSS transforms/opacity for animation.

------------------------------------------------------------------------

## 14. Accessibility

Required:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Appropriate contrast.
- Alt text.
- Form labels/errors.
- Reduced-motion support.
- Accessible buttons/links.
- No essential information conveyed only through animation.

------------------------------------------------------------------------

## 15. Deployment

``` text
Git Repository
      ↓
Vercel
      ↓
Next.js Production
      │
      ├──────── Supabase
      │          ├── PostgreSQL
      │          ├── Auth
      │          └── RLS
      │
      └──────── Cloudinary
                 └── Media
```

Use separate development and production environments.

Never commit:

- Database secrets.
- Supabase service-role key.
- Cloudinary secrets.
- API keys.
- Email credentials.

------------------------------------------------------------------------

## 16. What We Are NOT Building

Explicitly excluded:

``` text
Payments
Checkout
Ticketing
Cart
Customer accounts
Subscriptions
Online invoices
E-commerce
```

The website ends at:

**Enquiry → Human follow-up.**

------------------------------------------------------------------------

## 17. What Could Break / Risks

### 1. Loader becomes a gimmick

A long loader hurts conversion.

**Control:** 2.5–3.5 seconds maximum and easy dev bypass.

### 2. Too much burgundy/gold

The site can become visually heavy.

**Control:** use ivory/neutral space and let real photography carry
color.

### 3. Poor source images

Low-resolution images will undermine the premium design.

**Control:** request original assets from the client.

### 4. Portfolio becomes a dump

Random images do not communicate capability well.

**Control:** categorize projects and provide context.

### 5. Unsupported business claims

Numbers or claims invented by the design team can create
credibility/legal problems.

**Control:** only publish client-confirmed facts.

### 6. Enquiries get lost

A simple email-only form is easy to overlook.

**Control:** store enquiries and give the team a status workflow.

### 7. Overbuilt admin

A full CRM is unnecessary for the current scope.

**Control:** start with content management + enquiry tracking.

------------------------------------------------------------------------

## 18. Architecture Principles

1.  Build the complete website within the agreed showcase/enquiry scope.
2.  Do not call the project an MVP.
3.  Do not add payments or ticketing.
4.  Use actual brand assets.
5.  Make real portfolio work the primary proof.
6.  Keep content structured and editable.
7.  Keep media optimized and outside PostgreSQL.
8.  Optimize for qualified enquiries.
9.  Keep admin functionality proportional to the business.
10. Prefer simple architecture over unnecessary services.
