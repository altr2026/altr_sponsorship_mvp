# ALTR Sponsorship MVP — Product Requirements Document

> **For Claude Code · Project: altr_sponsorship_mvp**
> **Reference repo:** `../altrdemo` (Next.js 14, xrpl, Supabase, Stripe, shadcn)
> **Design inspiration:** anvara.com (flat, minimal, sentence case)

---

## 0. Context

**ALTR** is a sponsorship platform for APAC + GCC live events, settled on XRPL. This MVP serves three audiences:

- **XRP Grant reviewers** — need to see XRPL working end-to-end
- **Investors** — need to see traction + roadmap + business model
- **Event partners** — need to see the operational value of joining

**Domain plan:**
- `altr.haus` — marketing + waitlist (Phase 0 launch)
- `demo.altr.haus` — interactive XRPL demo (Phase 3-4 vision)
- `altr.haus/events` — event partner pitch page

**One codebase, route-based separation.** No separate apps.

---

## 1. Tech stack (already scaffolded)

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** + **shadcn/ui** (Button installed)
- **Supabase** (waitlist already wired)
- **xrpl@3.1.0** (from altrdemo, to be integrated in /demo)
- **Zustand** (state)
- **Stripe** (for future Phase 2+)
- **@anthropic-ai/sdk** (matching engine, later)

---

## 2. Design system (already built — verify before building pages)

### Tokens

```css
/* Primary brand */
--teal-600: #1D9E75   /* CTAs, accents */
--teal-50:  #E1F5EE   /* surfaces */
--teal-800: #085041   /* text on teal */

/* XRPL / blockchain / financing */
--purple-600: #534AB7   /* settlement, financing */
--purple-50:  #EEEDFE   /* surfaces */
--purple-800: #3C3489   /* text on purple */

/* Neutrals */
--gray-900: #2C2C2A   /* primary text */
--gray-700: #5F5E5A   /* secondary text */
--gray-400: #888780   /* tertiary text */
--gray-200: #D3D1C7   /* borders */
--gray-50:  #F1EFE8   /* surfaces */
--white:    #FFFFFF   /* primary surface */
```

### Type scale

- **font-sans:** matches altrdemo (verify `../altrdemo/app/layout.tsx`)
- **Weights:** 400 regular, 500 medium only — never 600/700
- **h1:** 36px / 500 / line-height 1.2
- **h2:** 24px / 500 / line-height 1.3
- **h3:** 18px / 500
- **Body:** 15px / 400 / line-height 1.6
- **Caption:** 12px / 400
- **Sentence case everywhere.** No Title Case. No ALL CAPS.

### Layout rules

- **Borders:** 0.5px solid gray-200 (default)
- **Radius:** 8px (md), 12px (lg cards)
- **No gradients. No shadows. No emojis.**
- **Spacing:** 4px base unit. Vertical rhythm in rem (1, 1.5, 2). Component gaps in px (8, 12, 16).
- **Hairline borders:** 0.5px on retina. If reviewer flags missing borders on legacy displays, bump to 1px.

### Shared components (already built — verify)

In `components/shared/`:
1. `TopNav` — logo left, links center, "Get early access" CTA right, sticky 64px
2. `Footer` — logo, routes, social, "Built on XRPL" badge, bg gray-50
3. `Hero` — h1 (≤8 words), sub (≤20 words), CTA + secondary, trust line
4. `SectionHeading` — eyebrow caption, h2, optional sub
5. `FeatureCard` — Lucide icon (top, teal), h3, 2-3 line copy
6. `StatCard` — caption, 32px number, 12px context, bg gray-50, no border
7. `PersonaToggle` — segmented control (Brand/Event/Admin), only in /demo
8. `WaitlistForm` — persona toggle, conditional fields, Supabase insert ✓

---

## 3. Information architecture — all pages

### Phase 0 (build now — marketing + waitlist)

| Route | Audience | Purpose | Status |
|---|---|---|---|
| `/` | All | Hero + 3 paths + traction + waitlist | 🔨 Build |
| `/events` | Event organizers | "Get sponsored faster" pitch | 🔨 Build |
| `/brands` | Sponsor brands | "Curated discovery" pitch | 🔨 Build |
| `/insights` | All | Blog + market data + newsletter signup | 🔨 Build (minimal) |
| `/about` | All | Vision + manifesto + team placeholder | 🔨 Build |

### Phase 2-4 (build after marketing pages — /demo subsection)

| Route | Audience | Purpose |
|---|---|---|
| `/demo` | Grant reviewer | Demo entry + role toggle |
| `/demo/discover` | Brand role | Browse events marketplace |
| `/demo/events/[id]` | Brand role | Event detail + sponsor packages |
| `/demo/deals/new` | Brand role | Initiate deal + configure milestones |
| `/demo/deals/[id]` | Both | Live deal tracker + XRPL tx |
| `/demo/dashboard/brand` | Brand role | Portfolio + ROI summary |
| `/demo/dashboard/event` | Event role | Sponsor queue + payouts + insights |
| `/demo/financing` | Event role | BNPL + credit score (P4 kicker) |

### Phase 2+ (later)

| Route | Audience | Purpose |
|---|---|---|
| `/agencies` | Marketing agencies | White-label preview |

---

## 4. Page-by-page spec

### 4.1 `/` — Home (altr.haus)

**Goal:** In 30 seconds, visitor understands what ALTR is and joins waitlist.

**Sections (top to bottom):**

1. **Hero**
   - Eyebrow: "Sponsorship OS for APAC + GCC"
   - h1: "Sponsorship that pays for itself"
   - Sub: "Discover events, deal directly with brands, settle on XRPL — and measure ROI in one place."
   - Primary CTA: "Get early access" → scroll to waitlist
   - Secondary link: "See how it works" → scroll to How section
   - Trust line: "Trusted by Ultra · Wanderlust · 12+ partners"

2. **Anchor logo strip**
   - 5-8 partner logos, grayscale, 50% opacity
   - Placeholder: Ultra · Wanderlust · "Coming soon" boxes if logos unavailable

3. **Three paths** (Anvara-style card grid)
   - Card 1: "For Events" — icon, "List once, match with brands" → `/events`
   - Card 2: "For Brands" — icon, "Every sponsorship in one place" → `/brands`
   - Card 3: "For Agencies" — icon, "White-label for your clients" → coming soon badge

4. **How it works** (3-step horizontal)
   - Step 1: List → Step 2: Match → Step 3: Settle & measure
   - Each step: Lucide icon, h3, 2-line description

5. **Manifesto / Why we exist** (editorial)
   - h2: "Sponsorship is broken. We're fixing it."
   - Body copy: 2 short paragraphs on PDF decks, SWIFT wires, no ROI
   - "Built on XRPL because..." paragraph

6. **Featured insights** (3 cards)
   - Pull from `/insights` — placeholder posts for now
   - "GCC sponsorship grows 12.3% CAGR" etc.

7. **Waitlist form** (the conversion goal)
   - Persona toggle: Event / Brand
   - Conditional fields based on persona
   - Submit → success modal

8. **Footer**

**Hero variant:**
If `?role=event` query param, swap hero to event-focused copy automatically.

---

### 4.2 `/events` — For Events

**Goal:** Event organizer reads this and lists their event.

**Sections:**

1. **Hero**
   - Eyebrow: "For event organizers"
   - h1: "Your sponsorship desk, simplified"
   - Sub: "List once. Match with vetted brands. Get paid faster."
   - CTA: "List your event" → waitlist form (pre-toggled to Event)

2. **Stat row** (3 cards)
   - "21 days" / "Avg time to first deal"
   - "+47%" / "Avg sponsor uplift"
   - "12+" / "Events already on the list"

3. **How it works** (event-specific, 3 step)
   - List your event (30 min onboarding)
   - Match with curated brands (we bring them)
   - Settle on milestones (no more lump-sum risk)

4. **What you get** (4 feature cards)
   - Pricing intelligence (benchmark from similar events)
   - Audience insights (your data, visualized)
   - Sponsor matching (vetted brands actively looking)
   - Payment automation (milestone-based, fast)

5. **Pricing intelligence preview** (the killer feature)
   - Faux table showing "Title sponsor: $25-40K · Gold: $10-18K"
   - "Based on 12+ similar events" caption
   - "Available after listing" CTA

6. **FAQ** (5 questions)
   - Pricing, time commitment, who sees data, contracts, payouts

7. **Waitlist form** (pre-toggled to Event)

8. **Footer**

---

### 4.3 `/brands` — For Brands

**Goal:** Marketing director from a brand joins to get early access.

**Sections:**

1. **Hero**
   - Eyebrow: "For sponsor brands"
   - h1: "Every sponsorship in one place"
   - Sub: "Transparent pricing. Audience data. ROI you can prove."
   - CTA: "Get early access" → waitlist (pre-toggled to Brand)

2. **Vertical × Geography matrix** (ALTR-unique)
   - 4 rows (Music / Conf / Fashion / Wellness) × 3 cols (SEA / KR-JP / GCC)
   - Each cell shows event count + price range
   - Mock data is fine — make it credible

3. **What you get** (4 feature cards)
   - Curated events (100+ across APAC + GCC)
   - Transparent pricing (no more PDF decks)
   - ROI measurement (built-in dashboard)
   - Verified audience data (real numbers)

4. **Featured events** (6-card grid)
   - Mock events with image, vertical, audience size, price tier
   - "Login to see details" CTA

5. **Why ALTR vs the alternative** (comparison)
   - "Old way" vs "ALTR" two columns
   - 4-5 rows of pain points and solutions

6. **Waitlist form** (pre-toggled to Brand)

7. **Footer**

---

### 4.4 `/insights` — Blog / Newsletter

**Goal:** SEO + thought leadership + newsletter signup.

**Phase 0 minimal version:**

1. **Hero**
   - h1: "The state of APAC + GCC sponsorship"
   - Sub: "Monthly data, pricing benchmarks, market analysis."

2. **Featured post** (large card)
   - Mock: "GCC sponsorship market hits $6.88B in 2025"
   - Date, read time, excerpt

3. **Post grid** (3-4 mock posts)
   - "Music festival pricing benchmark"
   - "Why Saudi Arabia is the next sponsorship frontier"
   - "Influencer × event: the bundled deal economics"

4. **Newsletter signup**
   - Simple email-only form (Supabase insert with persona='newsletter')

5. **Footer**

**Posts can be MDX files in `content/insights/`** but for Phase 0, render mock cards. Real posts come later.

---

### 4.5 `/about` — About

**Goal:** Establish credibility, vision, team.

**Sections:**

1. **Hero**
   - h1: "Building the sponsorship OS for APAC + GCC"
   - Sub: "We believe sponsorship deserves better than cold emails and PDF decks."

2. **Manifesto** (editorial copy, 3-4 paragraphs)
   - The problem
   - Why now (XRPL, GCC growth, APAC fragmentation)
   - Our approach (two-track: service + platform)

3. **Roadmap teaser** (5 phase cards, horizontal scroll)
   - Phase 0 → Phase 4 brief titles
   - Link to full roadmap in README

4. **Team** (placeholder)
   - "To be announced" — leave space for 2-4 founders

5. **Investors / supporters** (placeholder)
   - "In conversation with..." or just leave hidden until ready

6. **Contact**
   - Email + Twitter handles

7. **Footer**

---

## 5. /demo subsection (Phase 3-4 vision)

**Don't build yet.** Build marketing pages first. When ready, follow this spec.

### 5.1 Common patterns for /demo

- **Persona toggle** at top-right: Brand / Event / Admin
- **Demo mode banner** at top: "This is a demo with real XRPL testnet transactions"
- **Demo data disclaimer** (required on every demo page, verbatim from `DEMO_DATA_DISCLAIMER`): "Demo data based on real events for illustration. ALTR partnership status varies." See Section 7.
- **Anchor partner badge** — render only when an event has `is_anchor_partner: true`. No event qualifies until partnerships are formally confirmed; current mock events all render generically.
- **Purple accent** on all XRPL-related UI
- **Mock data** from `lib/mock-data/` — 6 events, 8 brands, 4 deals

### 5.2 `/demo` — Entry

- Hero: "ALTR sponsorship platform — live demo"
- Role selection cards: I'm a brand / I'm an event / I'm reviewing
- Quick start: "Try the deal flow" → /demo/discover

### 5.3 `/demo/discover`

- Top filter bar: vertical / geo / audience / budget
- Event card grid (6 events)
- Each card: image, name, vertical badge, audience size, price tier, "View" CTA

### 5.4 `/demo/events/[id]`

- Event hero (image, name, date, venue)
- Audience insights section (charts)
- Sponsorship packages (Title / Gold / Silver / Booth) with prices
- "Make an offer" CTA → /demo/deals/new

### 5.5 `/demo/deals/new`

- Form: select package, configure milestones (4 stages default)
- Side preview: "Total $250,000 · ALTR fee $1,250 · Net to event $248,750"
- Settlement rail selector: RLUSD (recommended) / USDC
- "Initiate deal" → triggers XRPL testnet tx → /demo/deals/[id]

### 5.6 `/demo/deals/[id]` (★ the money screen)

- **Live XRPL tx widget** at top: hash, status, time, fee, "Open in explorer" link
- **Milestone progress** (4-stage horizontal stepper)
  - M1 Contract: 20% / $50K / status
  - M2 Pre-event: 40% / $100K
  - M3 Event day: 30% / $75K
  - M4 Post-ROI: 10% / $25K
- **"Trigger M1 release" button** (for demo purposes — simulates approval)
- Deal details sidebar

### 5.7 `/demo/dashboard/brand`

- Portfolio overview (3 active deals)
- Metrics: total spend, impressions, EMV, ROI multiple
- ROI chart (Recharts)
- Deal list with status

### 5.8 `/demo/dashboard/event`

- Event identity card (Ultra Korea 2026)
- Sponsor queue: list of interested brands with status
- Payout schedule
- Audience insights (demographics)
- "Pricing intelligence" preview (benchmarks)

### 5.9 `/demo/financing` (P4 kicker)

- On-chain reputation gauge (87/100)
- Available credit display ($200K)
- BNPL rate (2% per 30 days)
- "Request advance" CTA
- Explainer copy: "How sponsorship financing works"

---

## 6. XRPL integration spec

### Stack
- `xrpl@3.1.0` (verify from `../altrdemo/package.json`)
- XRPL testnet
- RLUSD as primary settlement asset
- XRPL EVM sidechain for milestone escrow (Solidity)

### Where it goes

- `lib/xrpl/client.ts` — connection wrapper
- `lib/xrpl/escrow.ts` — milestone escrow logic
- `lib/xrpl/tx.ts` — transaction helpers + explorer URL builders

### Demo flow

1. User clicks "Initiate deal" on `/demo/deals/new`
2. Frontend calls API route `POST /api/deals/initiate`
3. API creates Supabase deal record + submits XRPL testnet tx
4. Returns tx hash + deal id
5. Frontend redirects to `/demo/deals/[id]`
6. That page polls XRPL for tx status (or uses realtime subscription)
7. Shows status updates with explorer link

**Don't over-engineer.** Testnet only. No real money. Mock signing if needed — but at minimum, submit one real testnet tx so reviewers can verify on explorer.

---

## 7. Mock data

In `lib/mock-data/`:

### Schema

```typescript
{
  id, name, slug, vertical, location, country, date,
  attendees, audience: { age, gender, income },
  sponsor_packages: [{ tier, price, perks }],
  image_url,
  is_real_event: boolean,      // true when the underlying event is real
  is_anchor_partner: boolean   // true only for confirmed ALTR partners
}
```

### `events.ts` — 6 real events

All entries correspond to real-world events. Every entry sets `is_real_event: true`. None currently qualify for `is_anchor_partner: true` — all render generically until partnerships are formally confirmed.

1. **Philippine Blockchain Week 2026** — Conference, Manila, Philippines, June 19-21, 2026, ~15,000 attendees
2. **Ultra Korea 2026** — Music, Seoul, South Korea, June 2026
3. **Dubai Design Week 2026** — Fashion, Dubai, UAE, November 2026
4. **Soundstorm 2026** — Music, Riyadh, Saudi Arabia, December 2026
5. **Wanderlust 108 Bali** — Wellness, Bali, Indonesia
6. **BeautyWorld Japan 2026** — Wellness, Tokyo, Japan

### Demo data disclaimer (required)

Every `/demo` page must render the following copy somewhere prominent (top banner, footer note, or near event listings):

> Demo data based on real events for illustration. ALTR partnership status varies.

The exact string is exported from `lib/mock-data/disclaimer.ts` as `DEMO_DATA_DISCLAIMER`. Do not paraphrase.

### Anchor partner badge

Render the "Anchor partner" badge **only** when an event has `is_anchor_partner: true`. No event has confirmed anchor status yet — every current mock event renders generically. Update the data flag (not the badge component) when a partnership is confirmed.

### `brands.ts` — 8 brands
Hyundai, Samsung, Heineken, Lululemon, Aramco, Emirates, Stripe APAC, AWS APAC

### `deals.ts` — 4 deals in different states
- Pending signature
- M1 paid, M2 upcoming
- All milestones complete (for ROI showcase)
- Disputed (edge case)

---

## 8. Build order (priority)

### Now (verify already done)
- [x] Scaffold
- [x] Design system
- [x] Shared components
- [x] Waitlist form + Supabase

### Step 1 — Marketing pages (build next)
1. `/` Home — full content
2. `/events` — full content
3. `/brands` — full content
4. `/insights` — minimal, mock posts
5. `/about` — manifesto + roadmap teaser

### Step 2 — Polish + ready to launch
- Fonts (match altrdemo via next/font)
- SEO meta tags (per-page)
- OG images (basic)
- Sitemap.xml
- robots.txt
- Analytics (PostHog or Plausible)

### Step 3 — Demo entry
- `/demo` entry + role toggle
- Mock data files

### Step 4 — Demo flows
- `/demo/discover` + `/demo/events/[id]`
- `/demo/deals/new` → `/demo/deals/[id]` with **real XRPL testnet tx**

### Step 5 — Demo dashboards + financing
- `/demo/dashboard/brand` + `/demo/dashboard/event`
- `/demo/financing` with credit score gauge

### Step 6 — Final
- E2E test of demo flow (record video for grant submission)
- Deploy demo.altr.haus subdomain
- Cross-browser check (Safari, Chrome, mobile)

---

## 9. Non-goals (out of scope)

- ❌ Real authentication / KYC — demo uses role toggle, prod waitlist is email-only
- ❌ Real payment processing — XRPL testnet only
- ❌ Influencer marketplace — mention as "available via consulting" only
- ❌ Multi-language — English only for MVP
- ❌ Mobile app — responsive web only
- ❌ Resend integration — manual emails for first 100 signups

---

## 10. Acceptance criteria

Before marking each step complete:

**For marketing pages:**
- [ ] All copy is sentence case, no Title Case
- [ ] No gradients, no shadows, no emojis used
- [ ] All borders 0.5px solid gray-200 (or appropriate variant)
- [ ] All CTAs use teal-600 background
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] Page loads in <1.5s on Lighthouse
- [ ] All internal links work
- [ ] Waitlist form validates and submits

**For /demo pages:**
- [ ] Persona toggle preserves role across navigation
- [ ] At least one real XRPL testnet tx submittable
- [ ] tx hash links to working explorer URL
- [ ] All mock data renders consistently
- [ ] Purple accent only on XRPL-related elements
- [ ] No mock data leakage between roles
- [ ] `DEMO_DATA_DISCLAIMER` rendered on every demo page
- [ ] "Anchor partner" badge appears only when `is_anchor_partner: true`

---

## 11. Reference

- **altrdemo repo:** `../altrdemo` — reuse: Supabase patterns, XRPL client, Stripe setup, font stack
- **Anvara:** https://anvara.com — reference for: layout patterns, "Discover → Deal → Pay → Measure" flow, audience routes, anchor logo strip
- **README:** `/README.md` — full business context, roadmap, market data
- **Design philosophy:** Flat, minimal, sentence case, no decoration. Should feel like Stripe or Linear — utility-first, not flashy.

---

## Start with

**Step 1 — `/` Home page first.** Build the home page completely (hero through footer) with real copy from the spec. Use existing shared components. Don't create new components unless absolutely necessary.

When `/` is done, show me a preview and we'll decide whether to:
- Polish `/` more
- Move to `/events`
- Adjust the design system

**Ask before:**
- Adding new dependencies
- Creating new shared components
- Deviating from the design tokens
- Building anything in `/demo` (that comes later)
