# Technical stack

> Companion to the top-level [README](../README.md). This is the engineering-side reference: every dependency in this repo, what each one does, and how the stack evolved from the earlier creator-side demo (`altr2026/altrdemo`).

Verified against `main` on 2026-05-17.

---

## 1. Snapshot

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | `^14.2.32` |
| Language | TypeScript | `^5.5.0` (`strict: true`) |
| Runtime | Node.js | server routes pinned `runtime = "nodejs"` |
| UI | React | `^18.3.1` |
| Styles | Tailwind CSS | `^3.4.17` (custom `altr-*` palette) |
| Primitives | Radix UI | `dialog 1.1.15`, `slot 1.1.0`, `tabs 1.1.13` |
| Component config | shadcn/ui (`components.json`) | `rsc: true`, CSS variables |
| Ledger | XRPL | `xrpl@3.1.0` (testnet `wss://s.altnet.rippletest.net:51233`) |
| Wallet sign-in | Xaman (XUMM) | `xumm-sdk@1.11.2` |
| Auth + DB | Supabase | `@supabase/supabase-js@2.105.4` + `@supabase/ssr@0.10.3` |
| IPFS pinning | Pinata | `@pinata/sdk@2.1.0` |
| Analytics | PostHog | `posthog-js@1.373.5` |
| Hosting | Vercel | — |

Dependencies that ship in `package.json` but are **not yet wired** in this MVP — Stripe (`stripe@22.1.1`, `@stripe/stripe-js@9.5.0`), Anthropic (`@anthropic-ai/sdk@0.32.1`), Zustand (`zustand@5.0.13`). They are kept for the Phase 1 / Phase 2 work documented in `docs/PRD.md` and inherited from the earlier `altrdemo` codebase; see §7.

---

## 2. App Router layout

Four route groups under `app/`:

| Group | Purpose |
|---|---|
| `(marketing)` | Public site — `/`, `/about`, `/brands`, `/events`, `/insights`, `/manifesto`, `/pricing`, `/roadmap` |
| `(demo)/demo` | The 5-phase / 18-step backbone (see §3) |
| `(partners)/partners` | Partner portal entry |
| `auth/`, `connect/`, `api/auth/xumm/*` | Sign-in surfaces (Supabase OAuth callback, Xaman QR flow) |

There is intentionally **no `middleware.ts`**. Supabase session refresh runs through the SSR client per-request; the demo paths are unauthenticated by design so reviewers can step through the flow without an account.

Server endpoints under `app/api/demo/*` are pinned to `runtime = "nodejs"` because both `xrpl` and `@pinata/sdk` use Node-only APIs (no edge runtime).

---

## 3. The 18-step demo backbone

The `/demo` flow is the heart of the repo. Every XRPL-anchored step runs against testnet for real — no env vars required, because routes auto-fund a wallet from the faucet when secrets are absent (see §4).

| Phase | Route(s) | On-chain |
|---|---|---|
| **01 Discovery** | `/demo/discover` · `/demo/event-brief` · `/demo/events/[id]` · `/demo/events/evt_pbw_2026` | — |
| **02 Deal** | `/demo/deals/new` · `/demo/deals/[id]` (brand view) · `/demo/event-dashboard/[id]` (event-private vendor splits) | — |
| **03 Settlement** | `/demo/deals/[id]/escrow` (Step 8 EscrowCreate, Step 12 EscrowFinish) · `/demo/deals/[id]/activation` (Steps 10–11 brief + IPFS-pinned proof) | `EscrowCreate`, `EscrowFinish` |
| **04 Measurement** | `/demo/deals/[id]/poe` (Step 13 ROI report, Step 14 mint) · `/demo/dashboard/[brand_id]` (Step 15 portfolio) | `NFTokenMint` |
| **05 Renewal** | `/demo/deals/[id]/renewal` (Steps 16–18 proposal + POE-anchored negotiation + expansion picks) | — |

---

## 4. XRPL integration

Three native primitives, no Solidity, no Hooks. All transactions submit through `xrpl@3.1.0` on testnet.

### Client lifecycle — `lib/xrpl/client.ts`

- `getXrplNetwork()` reads `NEXT_PUBLIC_XRPL_NETWORK`; defaults to the Ripple testnet WS endpoint.
- `withXrplClient<T>(fn)` is a higher-order helper that connects, runs `fn(client)`, and guarantees disconnect — every API route uses it instead of holding a long-lived client.

### Auto-funded hot wallet — `lib/xrpl/auto-wallet.ts`

- Prefers `XRPL_HOT_WALLET_SEED`; if absent, calls `client.fundWallet()` on first request and caches the wallet in module scope for the lifetime of the Vercel Function container.
- Same logic for the destination address (`NEXT_PUBLIC_XRPL_TESTNET_ADDRESS` → faucet fallback).
- Trade-off acknowledged in the file header: cache resets on cold start, so `EscrowFinish` will fail if create + finish happen in separate container lifecycles when relying on the auto-funded path. For the demo this is acceptable; production sets the seed env var.

### Transactions

| Tx type | Route | Notes |
|---|---|---|
| `EscrowCreate` | `app/api/demo/escrow/create/route.ts` | Demo default 10 XRP with `FinishAfter` (Unix → Ripple epoch) + `CancelAfter` (30 days). Validates `amount > 0` and `owner ≠ destination` before submit. |
| `EscrowFinish` | `app/api/demo/escrow/finish/route.ts` | Accepts `(owner, OfferSequence)` from the prior create. Any account can finalize once `FinishAfter` elapses. |
| `NFTokenMint` | `app/api/demo/poe/mint/route.ts` | Flags: `tfTransferable`. URI is hex-encoded; resolves to Pinata `ipfs://…` when `PINATA_JWT` is set, otherwise to `{app_url}/api/demo/poe/metadata/{deal_id}`. Memos attach `deal_id` + `altr.poe.v1` schema marker. |

Every route returns the testnet explorer link (`https://testnet.xrpl.org/transactions/<hash>`) for inline verification.

### What's deliberately not used

- **Hooks / EVM sidechain** — out of scope for MVP; Hooks (native escrow logic) is called out as a follow-up for developer partners.
- **PaymentChannels / OfferCreate** — the milestone model is well-served by simple Escrow + Mint; PaymentChannels are a Phase 3 candidate for streaming sponsorships.

---

## 5. POE — Proof of Engagement NFT

POE is the on-chain reputation primitive. It's a transferable XRPL NFToken minted at deal completion, with metadata describing the deal, ROI report, and milestone breakdown.

### Metadata builder — `lib/poe/metadata.ts`

- Schema marker: `altr.poe.v1`.
- Built from the deal record + ROI report; includes brand, event, tier, amount, per-milestone status, issuer, and `external_url`.
- All fields rendered as OpenSea-style `attributes[]` with `trait_type` / `value` (and `display_type: "date" | "number"` where it matters).
- ROI report is optional — when missing, the description gracefully shortens.

### URI resolution — `app/api/demo/poe/mint/route.ts`

1. **Pinata path** — when `PINATA_JWT` is set, `lib/ipfs/pinata.ts` pins the JSON via `@pinata/sdk@2.1.0` and the mint URI becomes `ipfs://<hash>`. The Pinata client is lazily initialized, cached at module scope, and tagged with `deal_id` / `brand` / `event` keyvalues for later discovery.
2. **Self-served fallback** — when Pinata is unconfigured, the URI becomes `{app_url}/api/demo/poe/metadata/{deal_id}`. The endpoint deterministically rebuilds the same metadata from `lib/mock-data` and caches for 5 minutes.

Both paths produce byte-identical metadata, so the mint is reproducible regardless of provider availability.

---

## 6. Supabase

- **Clients** — `lib/supabase/server.ts` uses `createServerClient` (cookie-aware, for RSC and route handlers); `lib/supabase/client.ts` uses `createBrowserClient` (for inserts from client components).
- **Schema** — single table `waitlist`, declared in `lib/supabase/types.ts`. Persona-discriminated columns: `event_*` and `sponsor_target_budget` for event organizers, `company_name` / `target_vertical` / `region_focus` / `budget_tier` for brands, plus a `newsletter` persona.
- **Migrations** — `supabase/migrations/001_waitlist.sql` (initial), `supabase/migrations/002_newsletter_persona.sql` (adds the newsletter persona enum value).
- **OAuth** — Google / Apple / X providers are wired through the standard Supabase OAuth flow at `app/auth/callback`; the connect surface lives at `app/connect`.
- **RLS** — not configured at the repo level. The anon key can `insert` into `waitlist`; the unique constraint on `(email, persona)` is caught in the form as a soft "already on the list" message. Acceptable for the MVP's single-purpose table; production deployment should add an RLS policy before scaling persona surfaces.

---

## 7. Inherited dependencies — not yet wired

These ship in `package.json` because they bridge to Phase 1/2 work and migrated over from `altrdemo`. Listing them honestly so reviewers don't waste time grep-hunting:

| Dep | Status | Why kept |
|---|---|---|
| `stripe@22.1.1`, `@stripe/stripe-js@9.5.0` | declared, no imports | Phase 1 SaaS subscriptions ($500–2K/mo ROI dashboard) and Phase 2 Stripe Connect for USD off-ramp. The full checkout + webhook flow exists in `altrdemo` and will be ported. |
| `@anthropic-ai/sdk@0.32.1` | declared, no imports | Re-enters in Phase 1 for sponsor brief analysis (the equivalent of `altrdemo`'s DealRead). `altrdemo` runs `claude-sonnet-4-6` with an 18-second timeout and a deterministic mock fallback — that pattern will be reused. |
| `zustand@5.0.13` | declared, no imports | All component state in this MVP is local React state. `altrdemo` uses Zustand persist for its multi-step intake (`altr-intake-v2` localStorage key); when the brand-side intake grows past two steps, we'll bring that pattern in. |
| `lucide-react@0.453.0` | imported across components | All iconography. |

---

## 8. UI and content

- **Component layout** — `components/ui/` (shadcn-generated Button), `components/shared/` (TopNav, Hero, Footer, persona toggle, stat/feature cards, waitlist form, early-access dialog, PostHog provider), `components/demo/` (DemoHeader 5-phase stepper, DemoFooter, Kbd badge).
- **Tailwind tokens** — custom palette in `tailwind.config.ts`: `altr-black`, `altr-white`, `altr-lime`, `altr-line`, `altr-panel`, `altr-mute`, `altr-muteSoft`.
- **Content** — currently inlined in components and mock-data; no `content/copy.ts` and no i18n library. English only. The KR/JP/AR multi-language UI listed under Phase 1 milestones is intentionally deferred until the surfaces stabilize.

---

## 9. Mock data

Everything the demo renders is fixture-driven from `lib/mock-data/`:

| File | Entity |
|---|---|
| `events.ts` | Live anchor PBW 2026 (15K attendees, Manila, June 19–21) + placeholder events. Each event carries 4-tier sponsor packages (Title / Gold / Silver / Booth) with pricing and perks. |
| `brands.ts` | 8 brands across APAC + GCC (Samsung, Hyundai, Heineken, Lululemon, Aramco, Emirates, Stripe APAC, AWS APAC) — category, region focus, budget tier. |
| `deals.ts` | One live deal (Samsung × PBW 2026) plus two historical Samsung deals that populate the portfolio dashboard. Each deal carries the full 4-milestone breakdown, escrow detail, and settlement timeline. |
| `vendors.ts` | Event-private vendor splits (venue, stage AV, security, talent, marketing, catering, staffing, production, insurance, documentation). Renders inside `/demo/event-dashboard/[id]` only. |
| `roi-reports.ts` | ROI for the historical deals — reach, impressions, EMV, creator attribution, benchmarks. Feeds Step 13 and the POE metadata builder. |
| `disclaimer.ts`, `index.ts` | Legal copy + exports. |

No database lookups; all hard-coded in module scope so the demo runs identically without Supabase.

---

## 10. Local development

```bash
git clone https://github.com/altr2026/altr_sponsorship_mvp.git
cd altr_sponsorship_mvp
npm install --legacy-peer-deps   # required: radix peer-dep conflicts
cp .env.example .env.local
npm run dev
```

Every env var is optional. Graceful degradation is wired throughout:

| Missing | Behavior |
|---|---|
| `XRPL_HOT_WALLET_SEED` | Auto-fund via testnet faucet (acknowledged cold-start caveat in §4). |
| `NEXT_PUBLIC_XRPL_TESTNET_ADDRESS` | Second faucet wallet as destination. |
| `PINATA_JWT` | POE metadata served from `/api/demo/poe/metadata/[deal_id]` instead of IPFS. |
| `PINATA_GATEWAY` | Defaults to `gateway.pinata.cloud`. |
| `NEXT_PUBLIC_SUPABASE_URL` / `…_ANON_KEY` | Waitlist insert + OAuth callback become no-ops; pages still render. |
| `XUMM_API_KEY` / `XUMM_API_SECRET` | Xaman sign-in route returns 503 with a clear message; demo otherwise unaffected. |

Verification:

```bash
npx next build       # full type-check + production build
npm run lint
npm run type-check   # tsc --noEmit
```

---

## 11. Evolution from `altrdemo`

`altr2026/altrdemo` was the prior, **creator-side** demo (Sarah, K-Beauty contract audit — DealRead → Tracker → Settlement → Dashboard). The sponsorship MVP shares the same foundational stack but pivots the deal flow from *creator vs. brand contract negotiation* to *brand → event milestone-escrow*. Concrete deltas:

### Kept

- Next.js 14 App Router + React 18 + TypeScript strict.
- `xrpl@3.1.0`, testnet endpoint, the `withClient(fn)` lifecycle pattern.
- `@supabase/ssr@0.10.3` + `@supabase/supabase-js@2.105.4` with the SSR / browser client split.
- Tailwind + the `altr-*` color tokens.
- Same `lucide-react`, same Zustand pin (carried forward for the next intake expansion).

### Added in the sponsorship MVP

- **XRPL Escrow** (`EscrowCreate` + `EscrowFinish`) for milestone-based release. `altrdemo` only used `Payment + Memo` for receipts.
- **IPFS via Pinata** (`@pinata/sdk@2.1.0`) for tamper-evident POE metadata, with a deterministic self-served fallback at the same URL shape.
- **Xaman / XUMM** (`xumm-sdk@1.11.2`) wallet sign-in via QR — replaces `altrdemo`'s in-browser `Wallet.generate()` stub (`lib/xrpl/local-wallet.ts`, `lib/hooks/use-local-wallet.tsx`, `lib/web3auth.ts`).
- **Radix UI primitives + shadcn `components.json`** — formal UI primitive layer.
- **PostHog** product analytics.
- **Auto-funded hot wallet** (`lib/xrpl/auto-wallet.ts`) so the demo runs zero-config.
- **5-phase / 18-step backbone** — a single linear flow that any reviewer can walk end-to-end.

### Dropped or deferred

- **DealRead (Claude API contract analyzer)** — `altrdemo` runs `claude-sonnet-4-6` with an 18-second timeout, JSON extraction from text/code-fence, and a deterministic `DEAL_READ_MOCK` fallback. The Anthropic SDK ships in `package.json` and will return in Phase 1 for sponsor-side brief analysis.
- **Stripe checkout + webhook + paywall** — `altrdemo` has `lib/dealread-gate.ts` (free / starter / pro tiers, monthly usage counter), `lib/membership.ts` (`TIERS` with $0 / $49 / $149), `app/api/stripe/checkout`, and `app/api/stripe/webhook`. Will reappear when the SaaS ROI dashboard ships.
- **Bilingual `lib/i18n.ts`** — `altrdemo` had a 330-key `t(key, lang)` dictionary with EN canonical + KR partial override. Deferred until the surfaces stabilize.
- **Web3Auth wireframe** (`lib/web3auth.ts` + `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` env gate) — superseded by Xaman as the production XRPL on-ramp.
- **Multi-step intake with `altr-intake-v2` Zustand persist** — current brand-side intake is short enough to live in component state.
- **Legacy duplicated XRPL client** — `altrdemo` carries both `lib/xrpl-client.ts` (older, dual-wallet, with `@deprecated` JSDoc planned) and `lib/xrpl/*` (newer, modular). The MVP starts clean with only `lib/xrpl/*`.
- **`/app/legacy/intake/page.tsx`** — gone.
- **Sarah / K-Beauty persona fixtures** (`SARAH`, `BOT_AUDIT`, `MARKET_INDEX`, `NAS`, `COSRX_CONTRACT_PREVIEW`) — replaced by event + brand + vendor + ROI fixtures focused on APAC/GCC sponsorship.

### Reworked

- **Persona model** — single-creator (Sarah @sarahkbeauty, 812K followers, Florida, K-Beauty) → brand × event dyad anchored to real partners (Ultra Music Festival, Wanderlust 108, PBW 2026, Dubai Design Week 2026).
- **XRPL primitives** — `Payment + Memo` receipts and `NFTokenMint` proof-of-execution → milestone `Escrow` + transferable `NFTokenMint` POE that doubles as on-chain reputation.
- **Wallet model** — `altrdemo`'s dual COLD/HOT wallets (`XRPL_COLD_SEED` issuer for NFTokenMint, `XRPL_HOT_SEED` ops for Payment/DEX) → single auto-funded hot wallet for the demo, with the same secret-or-fallback pattern.
- **State** — Zustand persist (intake answers, wallet, progress flags) → local React state. The persist pattern will return when the sponsor intake grows past two steps.

---

## 12. Known gaps and follow-ups

- **Cold-start auto-funded wallet** — `EscrowFinish` requires the same owner as the earlier `EscrowCreate`. With the auto-funded path this works within one Vercel Function container but breaks across cold starts. Production deployments must set `XRPL_HOT_WALLET_SEED`.
- **Unwired dependencies** — Stripe, Anthropic, Zustand are declared but unused (see §7). Either wire them in their Phase 1 surfaces or trim from `package.json` before grant submission if scope tightens.
- **POE NFT URI immutability** — once minted, the URI is permanent. If the self-served metadata endpoint moves, NFTs minted via the fallback path will dangle. Phase 2 work should pin every mint to IPFS regardless.
- **No RLS** on the `waitlist` table (see §6).
- **No middleware-level session refresh** — fine for the demo because everything inside `/demo` is unauthenticated, but the `/connect` and `/dashboard` surfaces will need it.
- **No internationalization** — Korean / Japanese / Bahasa / Arabic are on the Phase 1 milestone list and will need a real i18n layer (the `altrdemo` `lib/i18n.ts` pattern is the obvious starting point).
- **No XRPL Hooks integration** — listed as a contributor ask; native escrow logic moves on-ledger.

---

## 13. References

- [README](../README.md) — product narrative, business model, roadmap
- [PRD](./PRD.md) — product requirements document
- Testnet explorer — https://testnet.xrpl.org
- XRPL docs — https://xrpl.org/docs.html
- `altr2026/altrdemo` — prior creator-side demo
