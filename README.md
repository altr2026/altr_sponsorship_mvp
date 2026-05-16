<div align="center">

# ALTR

### Sponsorship OS for APAC & GCC live events, settled on XRPL

Production MVP — submitted for the XRP Grant Program

[Demo](https://demo.altr.haus) · [Partners](https://altr.haus/events) · [Pitch](#pitch) · [Docs](#docs)

</div>

---

## What is ALTR

ALTR is a sponsorship platform connecting live events (music festivals, conferences, fashion shows, wellness events) with brand sponsors across APAC and GCC. It replaces cold emails, PDF decks, and SWIFT wires with a single operating system: **discover, deal, settle, and measure** — all in one place.

This MVP demonstrates the full vision: **brand-to-event deals settled on XRPL in 3 seconds with milestone-based escrow, multi-currency off-ramp, and on-chain reputation that unlocks sponsorship financing.**

---

## The problem

The global sponsorship market is **$100B+** and still runs on:

- **Cold emails and handshake deals** — no centralized discovery
- **PDF sponsorship decks** — no standardized pricing
- **SWIFT wires** — $5,000+ in fees, 5-day settlement for a $250K deal
- **One-shot payments** — events take all risk, brands take all leverage
- **No ROI measurement** — sponsors can't justify renewals

Anvara is solving this in the US for sports and OOH. **APAC and GCC are wide open**, growing at 12–14% CAGR, with no dominant platform.

---

## What we built

### The flow

A brand initiates a sponsorship deal with an event. ALTR routes the entire flow on XRPL:

```
Brand (KR) → ALTR Hub (XRPL escrow) → Event (Ultra Korea)
              ↓
         Smart contract milestones
         M1 Contract signed       20% release
         M2 Pre-event (T-30d)     40% release  
         M3 Event day delivered   30% release
         M4 Post-event ROI signed 10% release
```

Settlement: **3 seconds. $0.20 fee. RLUSD on XRPL.**
Versus SWIFT: 5 days, $5,000+, lump sum risk.

### Six core screens

1. **Discover** — Brands browse curated events (filter by vertical, geo, audience, budget)
2. **Deal flow** — Initiate a sponsorship, configure milestones, lock RLUSD in XRPL escrow
3. **Live tx** — Watch the actual XRPL transaction settle on testnet (link to explorer)
4. **Event dashboard** — Sponsor queue, audience insights, pricing benchmarks
5. **ROI dashboard** — Post-event measurement (impressions, EMV, conversions, ROI multiple)
6. **Financing layer** — On-chain reputation score unlocks BNPL (event gets sponsor money early)

### Why XRPL specifically

ALTR's profile — cross-border + multi-party + high-frequency + GCC focus — makes XRPL the optimal rail. We compared:

| | USDC (Base) | XRPL (RLUSD) | SWIFT |
|---|---|---|---|
| Per-tx fee | $0.01–0.15 | **$0.000012** | $25–50 |
| Settlement | 2–4 sec | **3–5 sec** | 1–5 days |
| GCC corridors | Maturing | **Strong** (Ripple's UAE/Saudi bank network) | Established |
| APAC corridors | Strong | **Strong** | Established |
| Native FX | No | **Yes** (XRPL DEX) | No |
| Smart contracts | EVM L2 | **Hooks + EVM sidechain** | None |

XRPL is the only rail that handles all four well for our use case. Long-term, ALTR runs a **dual-rail architecture** — XRPL for GCC and high-volume corridors, USDC on Base for US/EU brand familiarity. The MVP focuses on XRPL because it's where ALTR's unique value creates the biggest difference.

---

## Traction

This is not a thought experiment. ALTR has confirmed event partners across 4 verticals:

- **Ultra Music Festival** — global music IP
- **Wanderlust** — wellness events across SEA
- **Multiple Philippines conferences** — B2B and tech
- **Fashion show partners** — APAC and GCC

Plus an investor network in GCC (UAE, KSA) and access to local agencies in SEA.

Phase 0 of the actual rollout begins with these partners turning into ALTR's first deal flow.

---

## Business model

ALTR runs on a **two-track** structure that funds itself before VC capital is needed:

### Track A — Concierge service (today)

- Sponsorship matching commission: **10–15% per deal**
- Marketing consulting (decks, pitch, packaging): **$5K–$30K per project**
- Bundled influencer packages: **+30–50% on deal size**

### Track B — Tech platform (Phase 2 onwards)

- SaaS subscription for events (ROI dashboard): **$500–$5K/month**
- Marketplace take rate (escrow + settlement): **0.5–1% of GMV**
- Data/insights API for enterprise: **$10K–$100K/year**
- Sponsorship financing (Phase 4): **2–3% per 30 days BNPL** + insurance premiums

Track A funds Track B's R&D. Track A's deal data becomes Track B's moat.

---

## Roadmap

ALTR follows a 5-phase strategic plan. Each phase has a clear funding gate and proof point.

### Phase 0 — MVP / Market test
> _Now → Month 3 · "Community first, product later"_

**Goals**
- Waitlist 500+ (300 events, 200 brands)
- First paying deals 3–5 via anchors
- Tier 1 data schema (audience + pricing benchmarks)
- This MVP + investor pitch complete

**Build**
- `altr.haus` marketing + waitlist
- `demo.altr.haus` (XRPL testnet MVP — this repo)
- `altr.haus/events` partner pitch view
- Notion/Airtable deal CRM

**Revenue model:** Track A only (commission + consulting)
**Metrics:** $50–150K revenue · 2–3 team · bootstrapped

---

### Phase 1 — Consulting scale
> _Month 3 → 9 · "Track A scale, data asset accumulation"_

**Goals**
- SEA 5 countries (SG, MNL, BKK, JKT, SEL)
- 15–20 paying deals closed
- 3–5 case studies published
- Influencer bundled packages launched

**Build**
- Internal deal management (Retool)
- Pricing benchmark DB v1 (by vertical)
- Standard audience-data collection forms
- Auto-generated sponsorship deck templates
- Post-event ROI report templates

**Revenue model:** Commission 10–15% + Consulting $5–30K + Bundled deals +30–50% premium. Brands still free.
**Metrics:** $500K–1M ARR · 5–7 team · optional Pre-Seed $500K–1M

---

### Phase 2 — SaaS hybrid + GCC entry
> _Month 9 → 18 · "Productization begins + Seed funding"_

**Goals**
- SaaS MVP (ROI dashboard) launched
- First GCC deal closed (Dubai or Riyadh)
- SaaS beta: 10–15 events using the product
- Seed $2–5M raised (GCC + APAC VCs)
- Brand-side self-serve discovery beta

**Build**
- ROI Dashboard SaaS (real product, not Retool)
- Brand discovery portal (filter, search)
- **Stripe Connect + Bridge integration** (fiat on-ramp + USDC settlement)
- Audience matching engine v1 (basic ML)
- Multi-language UI (EN/KR/JP/AR)

**Revenue model:** Commission + Event SaaS $500–2K/mo + Brand premium $1–3K/mo + Bundled 12–18%
**Metrics:** $1.5–3M ARR · 12–18 team · Seed $2–5M

---

### Phase 3 — Marketplace + Payment hub
> _Month 18 → 30 · "Two-sided marketplace + Series A"_

**Goals**
- 100+ events listed, 50+ brand accounts
- All payments routed through ALTR escrow
- APAC 8 countries + GCC 4 countries
- Series A $15–30M
- White-label for agencies launched

**Build**
- Marketplace listing + inbound offer system
- **XRPL + USDC dual-rail escrow** (production)
- Milestone smart contract automation
- Multi-currency off-ramp (Nium, Ripple Payments)
- White-label dashboard for agencies
- Influencer marketplace integration

**Revenue model:** Marketplace take rate 0.5–1% of GMV + White-label $2–10K/mo + revshare + Float yield on USDC escrow (4%+ APY)
**Metrics:** $5–10M ARR · GMV $50–100M · 30–50 team

---

### Phase 4 — Sponsorship financing
> _Month 30+ · "The Stripe + Bloomberg of sponsorship"_

**Goals**
- $20M+ ARR
- Sponsorship financing products launched
- Data API enterprise licenses (5+)
- Series B or strategic exit
- Anvara partnership or acquisition

**Build**
- On-chain reputation scoring engine
- BNPL / Factoring (advance sponsor cash before deal closes)
- Performance insurance (with reinsurance partners)
- Data API for enterprise (Nielsen-style)
- Cross-border FX settlement product

**Revenue model:** BNPL 2–3% per 30 days + Insurance 1–3% of deal + Data API $10–100K/year + FX spread 0.3–0.5% + all prior revenue streams maintained
**Metrics:** $20M+ ARR · GMV $200M+ · 80–150 team

---

### Phase gates

| Transition | Required proof |
|---|---|
| Phase 0 → 1 | Waitlist 300+, paying deals 3+ |
| Phase 1 → 2 | ARR $500K + 3+ case studies |
| Phase 2 → 3 | First GCC deal + SaaS beta 10+ |
| Phase 3 → 4 | GMV $50M + take rate validated |

---

## Market

- **Sponsorship market globally:** $100B+
- **APAC sponsorship CAGR:** ~10% (fragmented, no dominant platform)
- **GCC event management:** $6.88B in 2025 → $9.11B by 2031, sponsorship segment growing at **12.3% CAGR**
- **Saudi Arabia alone:** 40% of GCC influencer market, Vision 2030 driving event boom
- **Anvara** (US incumbent) does not operate in APAC or GCC

The white space is real and the timing is now.

---

## Technical architecture

### Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Backend:** Next.js API routes + Supabase (Postgres, Auth, Realtime)
- **Blockchain:** XRPL testnet (`xrpl.js`) + RLUSD + XRPL EVM sidechain for Solidity contracts
- **Smart contracts:** Solidity (milestone escrow) on XRPL EVM sidechain
- **Payment orchestration:** Ripple Payments SDK (production path)
- **Analytics:** PostHog
- **Deploy:** Vercel + custom domain

### Repository structure

```
altr_sponsorship_demo/
├── apps/
│   ├── demo/              # demo.altr.haus — grant/investor view
│   ├── partners/          # altr.haus/events — event partner view
│   └── marketing/         # altr.haus — landing + waitlist
├── packages/
│   ├── ui/                # shared shadcn components
│   ├── design-system/     # tokens, themes
│   ├── xrpl-client/       # XRPL wrapper (wallet, escrow, tx tracking)
│   ├── contracts/         # Solidity milestone escrow
│   └── db/                # Supabase schema + types
├── content/
│   └── insights/          # MDX blog posts
└── docs/
    ├── architecture.md
    ├── pitch.md
    └── demo-script.md
```

### Smart contract flow

The milestone escrow contract holds RLUSD until predefined conditions trigger release. Each milestone is:

```solidity
struct Milestone {
    uint256 amount;        // RLUSD amount
    uint256 unlockTime;    // earliest release timestamp
    bool requiresApproval; // sponsor sign-off needed
    address arbiter;       // ALTR or 3rd party for disputes
    Status status;         // Pending | Released | Disputed
}
```

Brand funds → contract holds → milestone conditions met → ALTR (or smart contract directly) releases to event wallet → XRPL bridge swaps to local fiat off-ramp.

### Multi-currency / multi-rail

- **Primary:** RLUSD on XRPL (low fee, GCC corridors)
- **Secondary (Phase 2+):** USDC on Base (US/EU brand familiarity, Stripe Connect)
- **Off-ramp:** Local fiat via Ripple Payments partners (KRW, PHP, AED, SAR, IDR, SGD, JPY)
- **Auto-routing:** Pick optimal rail per deal based on corridor and amount

---

## Running locally

### Prerequisites

- Node.js 20+
- pnpm
- An XRPL testnet wallet ([faucet](https://xrpl.org/xrp-testnet-faucet.html))
- A Supabase project (free tier works)

### Setup

```bash
git clone https://github.com/altr2026/altr_sponsorship_demo.git
cd altr_sponsorship_demo

pnpm install
cp .env.example .env.local
# fill in XRPL_WALLET_SEED, SUPABASE_URL, SUPABASE_ANON_KEY

pnpm db:migrate
pnpm db:seed       # loads mock events, brands, deals

pnpm dev           # all apps
pnpm dev:demo      # demo only
pnpm dev:partners  # event partner view only
```

Open:
- Demo (grant submission): `http://localhost:3000`
- Event partners: `http://localhost:3001`
- Marketing site: `http://localhost:3002`

### Trying the demo flow

1. Open the demo at `localhost:3000`
2. Switch role to **Brand** (top-right toggle)
3. Browse events → select "Ultra Korea 2026"
4. Click **Initiate deal** → configure milestones → confirm
5. Watch the XRPL escrow transaction settle in ~3 seconds
6. Click the tx hash to view on XRPL testnet explorer
7. Switch role to **Event** → see the incoming deal + payout schedule
8. Click **Trigger M1 release** to simulate milestone completion

---

## MVP status

| | Status |
|---|---|
| End-to-end deal flow (brand → event) | ✅ Working |
| RLUSD escrow on XRPL testnet | ✅ Working |
| Milestone-based release | ✅ Working (4 milestones) |
| Live XRPL explorer integration | ✅ Working |
| ROI dashboard (mock data) | ✅ Working |
| On-chain reputation score | ✅ MVP (mock) |
| Sponsorship BNPL/financing | ✅ MVP (mock) |
| Event partner view | ✅ Working |
| Real auth + KYC | ❌ Out of scope for MVP |
| Production payment processing | ❌ Out of scope (testnet only) |
| Influencer marketplace | ❌ Out of scope (consulting only at this phase) |

---

## Audience notes

### For XRP Grant reviewers

The MVP at `demo.altr.haus` demonstrates the full vision. A 5-minute walkthrough is in [`docs/demo-script.md`](docs/demo-script.md). XRPL is not bolted on — it solves a real corridor + cost + smart-contract problem that ALTR's APAC/GCC focus uniquely benefits from. Specifically, Ripple's existing UAE/Saudi banking corridors are the single biggest reason ALTR's GCC strategy is feasible.

### For investors

ALTR has confirmed anchor partnerships (Ultra, Wanderlust, multiple conferences), a two-track business model that funds itself before VC capital is needed, and a credible path from concierge service to marketplace to financial infrastructure. See the pitch in [`docs/pitch.md`](docs/pitch.md). Currently exploring **Seed $2–5M** to enter Phase 2 (SaaS hybrid + GCC entry).

### For developer partners

We're open to contributions in:

- **XRPL Hooks** — native escrow logic (alternative to EVM sidechain)
- **Local fiat off-ramps** — additional APAC/GCC corridors via Ripple Payments
- **ROI measurement** — better integration with ticketing platforms and social listening
- **Multi-language UI** — Korean, Japanese, Bahasa, Arabic

Open an issue or DM. The codebase is intentionally clean and well-typed to make contribution easy.

---

<a name="pitch"></a>
## Pitch

Full pitch in [`docs/pitch.md`](docs/pitch.md). 10 slides, matches the 5-minute demo walkthrough.

---

<a name="docs"></a>
## Documentation

- [`docs/architecture.md`](docs/architecture.md) — full system design
- [`docs/demo-script.md`](docs/demo-script.md) — 5-min walkthrough
- [`docs/business-model.md`](docs/business-model.md) — two-track BM detail
- [`docs/roadmap.md`](docs/roadmap.md) — 5-phase plan in depth
- [`docs/market-analysis.md`](docs/market-analysis.md) — APAC/GCC sizing
- [`docs/xrpl-integration.md`](docs/xrpl-integration.md) — RLUSD, escrow, Ripple Payments

---

## Team

To be added.

---

## License

MIT — see [LICENSE](LICENSE)

---

## Contact

- Website: [altr.haus](https://altr.haus)
- Demo: [demo.altr.haus](https://demo.altr.haus)
- Email: hello@altr.haus
- GitHub: [@altr2026](https://github.com/altr2026)

Submitted to the XRP Grant Program.
