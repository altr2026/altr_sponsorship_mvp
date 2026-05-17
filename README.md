<div align="center">

# ALTR

### Sponsorship OS for APAC & GCC live events, settled on XRPL

Production MVP — submitted for the XRP Grant Program

[Demo](https://altr-sponsorship-mvp.vercel.app/demo) · [Partners](https://altr.haus/events) · [Pitch](#what-we-built) · [Docs](#technical-architecture)

</div>

---

## What is ALTR

ALTR is a sponsorship platform connecting live events (music festivals, conferences, fashion shows, wellness events) with brand sponsors across APAC and GCC. It replaces cold emails, PDF decks, and SWIFT wires with a single operating system: **discover, deal, settle, and measure** — all in one place.

This MVP demonstrates the full vision: **brand-to-event deals settled on XRPL in 3 seconds with milestone-based escrow, multi-currency off-ramp, and on-chain reputation that unlocks sponsorship financing.**

---

## The problem

The global sponsorship market is **$100B+** and still runs on:

- Cold emails and handshake deals — no centralized discovery
- PDF sponsorship decks — no standardized pricing
- SWIFT wires — $5,000+ in fees, 5-day settlement for a $250K deal
- One-shot payments — both sides take risk, no recourse
- No ROI measurement — sponsors can't justify renewals

Anvara is solving this in the US for sports and OOH. APAC and GCC are wide open, growing at 12-14% CAGR, with no dominant platform.

---

## What we built

### The flow

```
Brand → ALTR Hub (XRPL escrow) → Event
              ↓
         Delivery-gated milestone releases
         M1 Booking confirmed · contract on-chain          20%
         M2 Stage construction + artist lineup confirmed   40%
         M3 Day 1 doors open · attendance verified         30%
         M4 Post-event ROI report + audience verified      10%
```

Settlement: **~5 seconds. $0.000012 XRP per tx. USDC (or RLUSD) on XRPL.**
Versus SWIFT: 5 days, $5,000+, lump sum risk, no recourse.

### The demo backbone — 5 phases / 18 steps

The live demo at `/demo` walks the full sponsorship lifecycle end-to-end on XRPL testnet:

| Phase | Route(s) | On-chain |
|---|---|---|
| 01 Discovery | `/demo/discover` · `/demo/event-brief` (event-side intake) · `/demo/events/[id]` | — |
| 02 Deal | `/demo/deals/new` | — |
| 03 Settlement | `/demo/deals/[id]` (brand view) · `/demo/event-dashboard/[id]` (event-private vendor splits) · `/demo/deals/[id]/escrow` (Step 8 EscrowCreate + Step 12 EscrowFinish) · `/demo/deals/[id]/activation` (Steps 10-11 brief + proof to IPFS) | EscrowCreate · EscrowFinish |
| 04 Measurement | `/demo/deals/[id]/poe` (Step 13 ROI report + Step 14 NFTokenMint) · `/demo/dashboard/[brand_id]` (Step 15 sponsor portfolio) | NFTokenMint |
| 05 Renewal | `/demo/deals/[id]/renewal` (Steps 16-18 proposal + POE-anchored negotiation + expansion picks) | — |

Each XRPL transaction settles for real on testnet — no setup needed. When `XRPL_HOT_WALLET_SEED` is unset, the routes auto-fund a wallet via the testnet faucet. When `PINATA_JWT` is unset, POE metadata is served from `/api/demo/poe/metadata/[deal_id]` instead of IPFS.

### Why XRPL

| | USDC (Base) | XRPL (RLUSD) | SWIFT |
|---|---|---|---|
| Per-tx fee | $0.01–0.15 | **$0.000012** | $25–50 |
| Settlement | 2–4 sec | **3–5 sec** | 1–5 days |
| GCC corridors | Maturing | **Strong** (Ripple's UAE/Saudi bank network) | Established |
| APAC corridors | Strong | **Strong** | Established |
| Native FX | No | **Yes** (XRPL DEX) | No |
| Smart contracts | EVM L2 | **Hooks + EVM sidechain** | None |

Long-term, ALTR runs a **dual-rail architecture** — XRPL for GCC and high-volume corridors, USDC on Base for US/EU brand familiarity. The MVP focuses on XRPL because it's where ALTR's unique value creates the biggest difference.

---

## Traction

- **Ultra Music Festival** — global music IP
- **Wanderlust 108** — wellness events across SEA
- **Philippine Blockchain Week 2026** — 15,000+ attendees, SMX Manila, June 19-21
- **Dubai Design Week 2026** — November 2026
- Investor network across UAE, KSA, and Korea

---

## Business model — Services-led SaaS

ALTR runs on a services-led SaaS model. Track A (matching/concierge) and Track B (SaaS product) operate in parallel from Phase 1 onwards. Track A's deal data feeds Track B's product learning in real-time — no 18-month lag between data collection and product evolution.

### Phase 0–1 Revenue (Services-heavy)

- **Sponsorship matching commission:** 15–25% per deal
  - Sourcing 5–8% + Negotiation 3–5% + Execution 5–8% + ROI reporting 2–4%
- **Marketing consulting:** $5–30K per project
- **SaaS beta (ROI dashboard):** $500–2K/month (from M9)
- **Brand premium tier:** $1–3K/month (from M12)
- **Bundled influencer packages:** +30–50% premium on deal size

### Phase 2+ Revenue (Platform-heavy)

- Marketplace take rate: 0.5–1% of GMV
- SaaS subscription: $500–5K/month
- White-label for agencies: $2–10K/month + revshare
- Float yield on USDC escrow: 4.1% APY
- Data/insights API: $10–100K/year (Phase 3)
- Sponsorship financing: 2–3% per 30 days BNPL (Phase 3)

---

## Roadmap

4-phase plan with funded gates.

### Phase 0 — MVP / Market test
> _Now → Month 3 · "Community first, anchor 확보"_

**Goals**
- Waitlist 500+ (300 events, 200 brands)
- First paying deals 3–5 via anchors
- This MVP + investor pitch complete

**Build**
- altr.haus marketing + waitlist
- demo.altr.haus (XRPL testnet MVP — this repo)
- altr.haus/events partner pitch view

**Revenue:** Commission 15–25% + Consulting
**Metrics:** $50–150K revenue · 2–3 team · bootstrapped

---

### Phase 1 — Dual Track Scale (★ merged)
> _Month 3 → 18 · "매칭이 데이터를 만들고, 데이터가 product를 만든다"_

Track A (Matching) and Track B (SaaS) run in parallel. The deal data from Track A becomes Track B's training input, eliminating the typical services-to-product data lag.

**Track A · Concierge Matching**
- SEA 5 countries (SG, MNL, BKK, JKT, SEL)
- GCC entry (Dubai first, leveraging investor network)
- 30–50 paying deals closed
- Influencer bundled packages
- 5–8 case studies published

**Track B · SaaS development (parallel)**
- Pricing intelligence DB v1 → v2 (evolving with Track A data)
- ROI Dashboard SaaS MVP (M9 launch)
- Audience matching engine v1
- Brand discovery portal beta
- Stripe Connect + Bridge integration (M12+)
- Multi-language UI (EN/KR/JP/AR)

**Critical milestones**
- M9: SaaS MVP first paying customer (transition from Track A)
- M12: GCC first deal + Stripe Connect integrated
- M15: Seed $2–5M raised (GCC + APAC VCs)
- M18: ARR $1.5–3M, SaaS active users 20+

**Revenue (staircase)**
- M3–9: Commission 15–25% + Consulting
- M9–12: + SaaS beta $500–2K/month
- M12–18: + Brand premium $1–3K/month, Bundled 15–25%

**Metrics:** $1.5–3M ARR · 5–7 → 12–18 team · Seed $2–5M

---

### Phase 2 — Marketplace + Payment Hub
> _Month 18 → 30 · "양면 마켓플레이스 + Series A"_

**Goals**
- 100+ events listed, 50+ brand accounts
- All payments routed through ALTR escrow
- APAC 8 countries + GCC 4 countries
- Series A $15–30M
- White-label for agencies launched

**Build**
- Marketplace listing + inbound offer system
- XRPL + USDC dual-rail escrow (production)
- Milestone smart contract automation
- Multi-currency off-ramp (Nium, Ripple Payments)
- White-label dashboard for agencies
- Influencer marketplace integration

**Revenue model:** Marketplace take rate 0.5–1% of GMV + White-label + Float yield. Commission retained only for enterprise deals.

**Metrics:** $5–10M ARR · GMV $50–100M · 30–50 team

---

### Phase 3 — Sponsorship financing
> _Month 30+ · "The Stripe + Bloomberg of sponsorship"_

**Goals**
- $20M+ ARR
- Sponsorship financing products launched
- Data API enterprise licenses (5+)
- Series B or strategic exit

**Build**
- On-chain reputation scoring engine
- BNPL / Factoring (advance sponsor cash)
- Performance insurance
- Data API for enterprise (Nielsen-style)
- Cross-border FX settlement product

**Revenue model:** BNPL 2–3% per 30 days + Insurance 1–3% + Data API $10–100K/year + FX 0.3–0.5% spread + all prior revenue streams maintained.

**Metrics:** $20M+ ARR · GMV $200M+ · 80–150 team

---

### Phase gates

| Transition | Required proof |
|---|---|
| Phase 0 → 1 | Waitlist 300+, paying deals 3+ |
| Phase 1 → 2 | ARR $1.5M + SaaS active users 20+ + GCC first deal |
| Phase 2 → 3 | GMV $50M + take rate validated + GCC 4 countries |

### Why merging Phase 1+2 works

**Data synergy** — Deal data from Track A immediately feeds Track B's pricing benchmark DB, matching engine, and ROI metrics. No 18-month lag.

**Capital efficiency** — Track A's revenue funds Track B's R&D. Bootstrapped runway extends, Seed closes at higher valuation due to traction.

**VC narrative** — "Services-led SaaS" is a proven model (Palantir, Scale AI). Day-1 revenue + data moat = strong Seed positioning.

---

## Market

- **Global sponsorship:** $100B+
- **APAC sponsorship CAGR:** ~10% (fragmented, no dominant platform)
- **GCC event management:** $6.88B in 2025 → $9.11B by 2031, 12.3% CAGR
- **Saudi Arabia:** 40% of GCC influencer market, Vision 2030 driving event boom
- **Anvara** (US incumbent) does not operate in APAC or GCC

---

## Technical architecture

> Full engineering reference (every dependency, the 18-step on-chain flow, what's wired vs. inherited from `altrdemo`, and known gaps) lives in [docs/TECH_STACK.md](./docs/TECH_STACK.md).

### Stack
- Next.js 14 (App Router) + TypeScript + Tailwind + selective shadcn/ui primitives
- Supabase (Postgres, Auth via `@supabase/ssr`, Realtime)
- `xrpl@3.1.0` — native EscrowCreate / EscrowFinish / NFTokenMint (no Solidity)
- `@pinata/sdk@2.1.0` — IPFS pinning (optional; falls back to ALTR-served metadata)
- Xaman (XUMM) SDK for wallet authentication
- Ripple Payments SDK (production path, not yet integrated)
- Vercel hosting

### Repository structure

```
altr_sponsorship_mvp/
├── app/
│   ├── (marketing)/                # Public marketing site
│   │   ├── page.tsx                # Landing /
│   │   ├── events/                 # For events
│   │   ├── brands/                 # For brands
│   │   ├── insights/               # /insights
│   │   ├── about/                  # /about
│   │   ├── manifesto/              # /manifesto
│   │   ├── roadmap/                # /roadmap
│   │   └── pricing/                # /pricing (anvara-style tiers)
│   ├── (demo)/demo/                # Live 18-step demo backbone
│   │   ├── discover/               # Phase 01 — sponsor-side event browse
│   │   ├── event-brief/            # Phase 01 — event-side sponsor intake
│   │   ├── events/[id]/            # Generic + PBW-specific event page
│   │   ├── deals/new/              # Phase 02 — create deal
│   │   ├── deals/[id]/             # Phase 03 — settlement hub (brand view)
│   │   │   ├── escrow/             # Step 8 EscrowCreate + Step 12 EscrowFinish
│   │   │   ├── activation/         # Steps 10-11 brief + proof to IPFS
│   │   │   ├── poe/                # Step 13 ROI report + Step 14 POE NFT
│   │   │   └── renewal/            # Steps 16-18
│   │   ├── event-dashboard/[id]/   # Phase 03 — event-private vendor payouts
│   │   └── dashboard/[brand_id]/   # Step 15 — sponsor portfolio
│   ├── api/demo/                   # Server routes
│   │   ├── escrow/{create,finish}/ # XRPL escrow tx
│   │   ├── poe/{mint,metadata}/    # POE NFTokenMint + fallback metadata GET
│   │   └── activation/proof/       # Activation proof IPFS pin
│   ├── api/auth/xumm/              # Xaman wallet auth
│   ├── auth/callback/              # Supabase OAuth callback
│   └── connect/                    # Sign-in (Google / Apple / X / email)
├── components/
│   ├── shared/                     # TopNav (with About dropdown), Footer, Hero, etc.
│   └── demo/                       # DemoHeader (5-phase stepper), DemoFooter, Kbd
├── lib/
│   ├── mock-data/                  # events, deals, roi-reports, vendors
│   ├── xrpl/                       # client + auto-funded wallet helper
│   ├── ipfs/                       # Pinata helper
│   ├── poe/                        # POE metadata builder (shared by mint + GET)
│   └── supabase/                   # SSR client + server
├── content/                        # Typed copy.ts (no hardcoded strings in components)
├── supabase/migrations/            # SQL migrations
└── public/                         # Logos, favicons
```

### Multi-currency / multi-rail

- **Primary:** RLUSD on XRPL (low fee, GCC corridors)
- **Secondary (Phase 1 late / Phase 2):** USDC on Base via Stripe Connect
- **Off-ramp:** Local fiat via Ripple Payments partners
- **Auto-routing:** Optimal rail per deal based on corridor and amount

---

## Running locally

```bash
git clone https://github.com/altr2026/altr_sponsorship_mvp.git
cd altr_sponsorship_mvp

# Project uses radix peer deps that npm flags; legacy-peer-deps is required.
npm install --legacy-peer-deps

cp .env.example .env.local
# Every env var below is OPTIONAL — the demo degrades gracefully when missing:
#   XRPL_HOT_WALLET_SEED              -> falls back to testnet faucet auto-fund
#   NEXT_PUBLIC_XRPL_TESTNET_ADDRESS  -> falls back to a second faucet wallet
#   PINATA_JWT                        -> falls back to ALTR-served metadata
#   NEXT_PUBLIC_SUPABASE_URL          -> waitlist + OAuth become no-ops
#   NEXT_PUBLIC_SUPABASE_ANON_KEY     -> ditto
#   XUMM_API_KEY + XUMM_API_SECRET    -> Xaman wallet sign-in disabled
#   PINATA_GATEWAY                    -> defaults to gateway.pinata.cloud

# Optional: run Supabase migrations from supabase/migrations/*.sql in your project's SQL editor
# (only needed if you want waitlist + persona persistence to actually write).

npm run dev
```

Build verification:

```bash
npx next build       # full type-check + production build
npm run lint         # eslint
```

---

## MVP status

| | Status |
|---|---|
| 5-phase / 18-step demo backbone | ✅ Complete |
| End-to-end deal flow | ✅ Working |
| Real XRPL EscrowCreate (Step 8) on testnet | ✅ Working — no env vars required (auto-fund via faucet) |
| Real XRPL EscrowFinish (Step 12) with 60s countdown | ✅ Working |
| Real XRPL NFTokenMint POE (Step 14) | ✅ Working — IPFS via Pinata when configured, else ALTR-served metadata |
| Live testnet.xrpl.org explorer integration | ✅ Working |
| Milestone-based escrow (4 milestones, delivery-triggered copy) | ✅ Working |
| Activation brief + IPFS-pinned proof of delivery (Steps 10-11) | ✅ Working |
| ROI report dashboard with creator attribution + benchmarks (Step 13) | ✅ Working |
| Sponsor portfolio dashboard with all-time POE history (Step 15) | ✅ Working |
| Renewal flow (Steps 16-18): auto-proposal, POE-anchored chat, expansion picks | ✅ Working |
| Event-side private vendor-payout dashboard | ✅ Working |
| Multi-provider OAuth (Google + Apple + X) via Supabase | ✅ Working (needs provider config) |
| Xaman (XUMM) wallet sign-in | ✅ Wired (needs XUMM API keys) |
| Public marketing site + pricing + manifesto + roadmap pages | ✅ Working |
| On-chain reputation score | ✅ MVP — POE history aggregated per brand |
| Sponsorship BNPL / financing | ❌ Phase 3 design only |
| Real KYC | ❌ Out of scope for MVP |
| Production payment processing | ❌ Testnet only |

---

## Audience notes

### For XRP Grant reviewers

The MVP at `demo.altr.haus` demonstrates the full vision. XRPL is not bolted on — it solves a real corridor + cost + smart-contract problem that ALTR's APAC/GCC focus uniquely benefits from. Ripple's existing UAE/Saudi banking corridors are the single biggest reason ALTR's GCC strategy is feasible.

### For investors

ALTR has confirmed anchor partnerships, a services-led SaaS model with built-in data moat, and a 4-phase path from concierge to marketplace to financial infrastructure. Currently exploring **Seed $2–5M** during Phase 1 (Dual Track Scale).

### For developer partners

Contributions welcome in:
- XRPL Hooks (native escrow logic)
- Local fiat off-ramps (additional APAC/GCC corridors)
- ROI measurement integrations
- Multi-language UI (Korean, Japanese, Bahasa, Arabic)

---

## Team

To be added.

## License

MIT — see [LICENSE](LICENSE)

## Contact

- Website: [altr.haus](https://altr.haus)
- Demo: [demo.altr.haus](https://demo.altr.haus)
- Email: hello@altr.haus
- GitHub: [@altr2026](https://github.com/altr2026)

Submitted to the XRP Grant Program.
