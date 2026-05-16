<div align="center">

# ALTR

### Sponsorship OS for APAC & GCC live events, settled on XRPL

Built for the XRP Hackathon 2026

[Demo](https://demo.altr.haus) · [Partners](https://altr.haus/events) · [Pitch deck](#pitch) · [Docs](#docs)

</div>

---

## What is ALTR

ALTR is a sponsorship platform connecting live events (music festivals, conferences, fashion shows, wellness events) with brand sponsors across APAC and GCC. It replaces cold emails, PDF decks, and SWIFT wires with a single operating system: **discover, deal, settle, and measure** — all in one place.

The hackathon prototype demonstrates the full vision (Phase 4): **brand-to-event deals settled on XRPL in 3 seconds with milestone-based escrow, multi-currency off-ramp, and on-chain reputation that unlocks sponsorship financing.**

---

## The problem

The global sponsorship market is **$100B+** and still runs on:

- **Cold emails and handshake deals** — no centralized discovery
- **PDF sponsorship decks** — no standardized pricing
- **SWIFT wires** — $5,000+ in fees, 5-day settlement for a $250K deal
- **One-shot payments** — events take all risk, brands take all leverage
- **No ROI measurement** — sponsors can't justify renewals

Anvara is solving this in the US for sports and OOH. **APAC and GCC are wide open**, growing at 12-14% CAGR, with no dominant platform.

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

We considered USDC on Base, Stripe Connect, and traditional rails. XRPL won for our specific use case:

| | USDC (Base) | XRPL (RLUSD) | SWIFT |
|---|---|---|---|
| Per-tx fee | $0.01–0.15 | **$0.000012** | $25–50 |
| Settlement | 2–4 sec | **3–5 sec** | 1–5 days |
| GCC corridors | Maturing | **Strong** (Ripple's UAE/Saudi bank network) | Established |
| APAC corridors | Strong | **Strong** | Established |
| Native FX | No | **Yes** (XRPL DEX) | No |
| Smart contracts | EVM L2 | **Hooks + EVM sidechain** | None |

For ALTR's profile — cross-border + multi-party + high-frequency + GCC focus — XRPL is the only rail that handles all four well.

---

## Traction

This is not a thought experiment. ALTR has confirmed event partners across 4 verticals:

- **Ultra Music Festival** — global music IP
- **Wanderlust** — wellness events across SEA
- **Multiple Philippines conferences** — B2B and tech
- **Fashion show partners** — APAC and GCC

Plus an investor network in GCC (UAE, KSA) and access to local agencies in SEA.

The hackathon demo uses these as anchors. Phase 0 of the actual rollout begins with these partners turning into ALTR's first deal flow.

---

## Business model

ALTR runs on a **two-track** structure:

### Track A — Concierge service (today)

- Sponsorship matching commission: **10–15% per deal**
- Marketing consulting (decks, pitch, packaging): **$5K–$30K per project**
- Bundled influencer packages: **+30–50% on deal size**

### Track B — Tech platform (Phase 2 onwards)

- SaaS subscription for events (ROI dashboard): **$500–$5K/month**
- Marketplace take rate (escrow + settlement): **0.5–1% of GMV**
- Data/insights API for enterprise: **$10K–$100K/year**
- Sponsorship financing (Phase 4): **2% per 30 days BNPL** + insurance premiums

Track A funds Track B's R&D. Track A's deal data becomes Track B's moat.

---

## Roadmap

| Phase | Timeline | Focus | Revenue model |
|---|---|---|---|
| **0 — MVP** | Now → M3 | Demo, waitlist, anchor deals | Track A only |
| **1 — Consulting scale** | M3 → M9 | SEA 5 countries, influencer bundles | Track A |
| **2 — SaaS hybrid** | M9 → M18 | ROI dashboard MVP, GCC entry, Seed $2–5M | Track A + SaaS |
| **3 — Marketplace + Payment hub** | M18 → M30 | All payments via ALTR escrow on XRPL, Series A $15–30M | + Take rate |
| **4 — Sponsorship financing** | M30+ | BNPL, performance insurance, on-chain credit, Data API | Full stack |

The hackathon demo previews **Phase 3–4**. The actual product roadmap starts at Phase 0.

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
altr_sponsorship/
├── apps/
│   ├── demo/              # demo.altr.haus — Hackathon view
│   ├── partners/          # altr.haus/events — Event partner view
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
- **Secondary:** USDC on Base (US/EU brand familiarity)
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
git clone https://github.com/altr-haus/altr_sponsorship.git
cd altr_sponsorship

pnpm install
cp .env.example .env.local
# fill in XRPL_WALLET_SEED, SUPABASE_URL, SUPABASE_ANON_KEY

pnpm db:migrate
pnpm db:seed       # loads mock events, brands, deals

pnpm dev           # all apps
pnpm dev:demo      # hackathon demo only
pnpm dev:partners  # event partner view only
```

Open:
- Hackathon demo: `http://localhost:3000`
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

## What's in this hackathon submission

| | Status |
|---|---|
| End-to-end deal flow (brand → event) | ✅ Working |
| RLUSD escrow on XRPL testnet | ✅ Working |
| Milestone-based release | ✅ Working (4 milestones) |
| Live XRPL explorer integration | ✅ Working |
| ROI dashboard (mock data) | ✅ Working |
| On-chain reputation score | ✅ Demo (mock) |
| Sponsorship BNPL/financing | ✅ Demo (mock) |
| Event partner view | ✅ Working |
| Real auth + KYC | ❌ Out of scope |
| Production payment processing | ❌ Out of scope (testnet only) |
| Influencer marketplace | ❌ Out of scope (consulting only at this phase) |

---

## Audience notes

### For hackathon judges

The demo at `demo.altr.haus` is the full Phase 4 vision. Five-minute walkthrough script in [`docs/demo-script.md`](docs/demo-script.md). XRPL is not bolted on — it solves a real corridor + cost + smart-contract problem that ALTR's APAC/GCC focus uniquely benefits from.

### For investors

ALTR has confirmed anchor partnerships (Ultra, Wanderlust, multiple conferences), a clear two-track business model that funds itself before VC capital is needed, and a credible path from concierge service to marketplace to financial infrastructure. See the pitch deck in [`docs/pitch.md`](docs/pitch.md). Looking for **Seed $2–5M** to enter Phase 2 (SaaS hybrid + GCC entry).

### For developer partners

We're open to contributions in:

- **XRPL Hooks** — native escrow logic (alternative to EVM sidechain)
- **Local fiat off-ramps** — additional APAC/GCC corridors via Ripple Payments
- **ROI measurement** — better integration with ticketing platforms and social listening
- **Multi-language UI** — Korean, Japanese, Bahasa, Arabic

Open an issue or DM. The codebase is intentionally clean and well-typed to make contribution easy.

---

<a name="pitch"></a>
## Pitch deck

Live pitch deck: [`docs/pitch.md`](docs/pitch.md)

10 slides, matches the 5-minute demo walkthrough.

---

<a name="docs"></a>
## Documentation

- [`docs/architecture.md`](docs/architecture.md) — full system design
- [`docs/demo-script.md`](docs/demo-script.md) — 5-min walkthrough
- [`docs/business-model.md`](docs/business-model.md) — two-track BM detail
- [`docs/roadmap.md`](docs/roadmap.md) — 5-phase plan
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
- Twitter: [@altr_haus](https://twitter.com/altr_haus)

Built with care for the XRP Hackathon 2026.
