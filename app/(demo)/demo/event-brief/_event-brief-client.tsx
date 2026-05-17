"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";

type VerticalId =
  | "tech"
  | "crypto"
  | "fintech"
  | "telecom"
  | "automotive"
  | "lifestyle"
  | "luxury"
  | "gaming";

type VerticalOption = {
  id: VerticalId;
  label: string;
  examples: string;
};

const VERTICALS: VerticalOption[] = [
  { id: "tech", label: "Tech & Hardware", examples: "Samsung · Sony · LG · Apple" },
  { id: "crypto", label: "Crypto & Web3", examples: "Coinbase · Binance · Kraken · OKX" },
  { id: "fintech", label: "Fintech & Payments", examples: "Stripe · Visa · Mastercard · Wise" },
  { id: "telecom", label: "Telecom & Mobile", examples: "Verizon · KT · NTT · Globe" },
  { id: "automotive", label: "Automotive", examples: "Tesla · Toyota · Hyundai" },
  { id: "lifestyle", label: "Lifestyle / Consumer", examples: "Nike · Red Bull · Heineken" },
  { id: "luxury", label: "Luxury & Premium", examples: "LVMH · Rolex · Hermès" },
  { id: "gaming", label: "Gaming & Esports", examples: "Riot · EA · Razer · Logitech" },
];

type TierFocus = "title" | "mid" | "volume";

const TIER_OPTIONS: Array<{
  value: TierFocus;
  label: string;
  blurb: string;
  benchmark: string;
}> = [
  {
    value: "title",
    label: "Title-led",
    blurb: "1–2 anchor sponsors, deepest entitlements, max revenue per deal.",
    benchmark: "Typical: $200K–$1M / deal",
  },
  {
    value: "mid",
    label: "Balanced mix",
    blurb: "1 Title + 3–5 Gold/Silver. Steady cash, broader brand mix.",
    benchmark: "Typical: $50K–$200K / deal",
  },
  {
    value: "volume",
    label: "Volume / expo",
    blurb: "Many booth-tier sponsors. Volume-driven, lower per-deal effort.",
    benchmark: "Typical: $4K–$30K / deal",
  },
];

const DECK_ITEMS: Array<{ title: string; detail: string }> = [
  {
    title: "Audience insights brief",
    detail:
      "Auto-pulled from your last 3 events + ALTR's cohort benchmarks. Demographics, decision power, geography, attendance trend.",
  },
  {
    title: "Sponsor tier comparison sheet",
    detail:
      "5-tier table with per-tier entitlements, pricing, and what each tier unlocks vs. the next.",
  },
  {
    title: "ROI projection per tier",
    detail:
      "Anchored to verified POE NFTs from comparable APAC events on ALTR. Includes EMV range, multiplier, attribution split.",
  },
  {
    title: "Brand-specific pitch decks",
    detail:
      "One deck per matched brand. Their past sponsorship history (where ALTR can see it), audience fit score, suggested package.",
  },
  {
    title: "Standard deal contract template",
    detail:
      "4-milestone escrow on XRPL, USDC-denominated, terms pre-filled with your event-specific dates and deliverables.",
  },
  {
    title: "Outreach email templates",
    detail:
      "3 variants per brand: cold intro · warm intro via mutual contact · direct partnership pitch. Reply-ready.",
  },
];

type BrandMatch = {
  id: string;
  name: string;
  match_verticals: VerticalId[];
  suggested_tier: "Title" | "Gold" | "Silver";
  signal: string;
  href: string;
};

const ALL_MATCHES: BrandMatch[] = [
  {
    id: "match_samsung",
    name: "Samsung",
    match_verticals: ["tech"],
    suggested_tier: "Title",
    signal: "Past sponsor · PBW 2026 Title · 7.4× ROI · high renewal probability",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Title&brand=samsung",
  },
  {
    id: "match_coinbase",
    name: "Coinbase",
    match_verticals: ["crypto", "fintech"],
    suggested_tier: "Title",
    signal: "Past sponsor of Token2049 SG, ETHDenver. 92nd-pct ROI on similar APAC conferences.",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Title&brand=coinbase",
  },
  {
    id: "match_stripe",
    name: "Stripe",
    match_verticals: ["fintech"],
    suggested_tier: "Gold",
    signal: "First APAC sponsorship push 2027. Fintech audience overlap 78%.",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Gold&brand=stripe",
  },
  {
    id: "match_kraken",
    name: "Kraken",
    match_verticals: ["crypto"],
    suggested_tier: "Gold",
    signal: "New APAC office Singapore Q1 2027. Looking for first regional sponsorship.",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Gold&brand=kraken",
  },
  {
    id: "match_lg",
    name: "LG",
    match_verticals: ["tech"],
    suggested_tier: "Gold",
    signal: "OLED division shifting into Web3 hardware. PBW fit confirmed.",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Gold&brand=lg",
  },
  {
    id: "match_riot",
    name: "Riot Games",
    match_verticals: ["gaming"],
    suggested_tier: "Silver",
    signal: "Web3 gaming experiment Q2. Looking for venue + audience.",
    href: "/demo/deals/new?event=evt_pbw_2026&tier=Silver&brand=riot",
  },
];

const DEFAULT_SELECTED: VerticalId[] = ["tech", "crypto", "fintech"];

export function EventBriefClient() {
  const [selected, setSelected] = useState<Set<VerticalId>>(
    () => new Set(DEFAULT_SELECTED),
  );
  const [tierFocus, setTierFocus] = useState<TierFocus>("title");

  function toggleVertical(id: VerticalId) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const matches = useMemo(() => {
    return ALL_MATCHES.filter((m) =>
      m.match_verticals.some((v) => selected.has(v)),
    ).slice(0, 4);
  }, [selected]);

  const verticalCount = selected.size;
  const matchCount = matches.length;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
      <Link
        href="/demo"
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to demo entry
      </Link>

      <header className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>Phase 01 · Discovery</Kbd>
          <Kbd tone="mute">Event-side intake</Kbd>
        </div>
        <h1 className="text-[26px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[34px]">
          Build your sponsor brief
        </h1>
        <p className="max-w-3xl text-[13.5px] text-altr-muteSoft">
          Tell ALTR who you want at your event. We match brands against your
          target, draft a deck per brand, and queue them straight into the deal
          flow. You stay in control of approve / counter / decline at every
          step.
        </p>
      </header>

      <section
        aria-label="Event basics"
        className="mt-8 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <Kbd>Your event</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Pre-filled from PBW 2026 history
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Event" value="Philippine Blockchain Week 2027" />
          <Field label="Vertical" value="Conference · Crypto / Web3" />
          <Field label="Dates" value="June 18–20, 2027" />
          <Field label="Expected attendees" value="18,000 (+20% YoY)" />
        </div>
      </section>

      <section
        aria-label="Target verticals"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Target verticals</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Which brand verticals do you want to attract?
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              Toggle as many as fit your audience. The match list below updates
              live.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {verticalCount} selected
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {VERTICALS.map((v) => {
            const active = selected.has(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggleVertical(v.id)}
                aria-pressed={active}
                className={cn(
                  "group flex h-full flex-col items-start gap-1 rounded-md border px-3.5 py-3 text-left transition-all",
                  active
                    ? "border-altr-lime/60 bg-altr-lime/10"
                    : "border-altr-line2 bg-altr-black hover:border-altr-mute",
                )}
              >
                <div className="flex w-full items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      active ? "text-altr-lime" : "text-altr-white",
                    )}
                  >
                    {v.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-sm border",
                      active
                        ? "border-altr-lime bg-altr-lime text-altr-black"
                        : "border-altr-line2 text-transparent",
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </div>
                <span className="font-mono text-[10.5px] leading-snug text-altr-mute">
                  {v.examples}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label="Tier focus"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4">
          <Kbd>Tier focus</Kbd>
          <h2 className="mt-2 text-h2 font-medium text-altr-white">
            What sponsor tier are you optimizing for?
          </h2>
          <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
            Drives ALTR&apos;s outreach order — Title-led starts with anchor
            sponsors first, volume opens parallel outreach to many.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {TIER_OPTIONS.map((opt) => {
            const active = tierFocus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTierFocus(opt.value)}
                aria-pressed={active}
                className={cn(
                  "flex h-full flex-col gap-2 rounded-md border px-4 py-4 text-left transition-all",
                  active
                    ? "border-altr-lime/60 bg-altr-lime/10"
                    : "border-altr-line2 bg-altr-black hover:border-altr-mute",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-[14px] font-medium",
                      active ? "text-altr-lime" : "text-altr-white",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      active
                        ? "border-altr-lime bg-altr-lime"
                        : "border-altr-line2",
                    )}
                  >
                    {active ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-altr-black" />
                    ) : null}
                  </span>
                </div>
                <p className="text-[12px] leading-snug text-altr-muteSoft">
                  {opt.blurb}
                </p>
                <p className="mt-auto font-mono text-[10.5px] uppercase tracking-[0.18em] text-altr-mute">
                  {opt.benchmark}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section
        aria-label="What ALTR generates"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Deck preparation</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              What ALTR auto-generates on submit
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              All six artifacts queue in your dashboard the moment you start
              outreach. Edit, regenerate, or send as-is.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            6 artifacts
          </span>
        </div>

        <ol className="grid gap-3 md:grid-cols-2">
          {DECK_ITEMS.map((d, i) => (
            <li
              key={d.title}
              className="flex gap-3 rounded-md border border-altr-line2 bg-altr-black p-4"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-altr-lime/40 bg-altr-lime/10 font-mono text-[11px] font-bold text-altr-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <div className="text-[13.5px] font-medium text-altr-white">
                  {d.title}
                </div>
                <p className="text-[11.5px] leading-snug text-altr-muteSoft">
                  {d.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-label="Suggested brand matches"
        className="mt-5 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-4 w-4 text-altr-lime"
                aria-hidden="true"
              />
              <Kbd>Suggested matches · live</Kbd>
            </div>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              {matchCount > 0
                ? `${matchCount} brand${matchCount === 1 ? "" : "s"} match your target`
                : "No matches — pick at least one vertical above"}
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              {matchCount > 0
                ? "Click any card to jump straight into the deal flow with that brand pre-selected."
                : "ALTR matches brands by vertical overlap + past sponsorship signal."}
            </p>
          </div>
          {matchCount > 0 ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
              tier focus · {tierFocus}
            </span>
          ) : null}
        </div>

        {matchCount > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {matches.map((m) => (
              <Link
                key={m.id}
                href={m.href}
                className="group flex flex-col gap-2 rounded-md border border-altr-line2 bg-altr-black p-4 transition-all hover:-translate-y-0.5 hover:border-altr-lime/60"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-medium text-altr-white">
                    {m.name}
                  </span>
                  <span className="rounded border border-altr-lime/40 bg-altr-lime/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
                    {m.suggested_tier}
                  </span>
                </div>
                <p className="text-[11.5px] leading-snug text-altr-muteSoft">
                  {m.signal}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-altr-muteSoft transition-colors group-hover:text-altr-lime">
                  Start deal with {m.name}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/demo"
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to demo entry
        </Link>
        <Link
          href="/demo/deals/new"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
        >
          Continue to Deal (Phase 02)
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <div className="mt-1 text-[13px] text-altr-white">{value}</div>
    </div>
  );
}
