import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Philippine Blockchain Week 2026 · Demo",
  description:
    "Blockchain in Action — DECODED: DEPLOYED. June 19-21, 2026 · SMX Convention Center Manila. 15,000 attendees, 250+ speakers, 80+ countries. 5 sponsor tiers from Title ($250K) to Bronze ($35K).",
  robots: { index: false, follow: false },
};

type Tier = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  perks: string[];
  highlight?: boolean;
  remaining?: string;
};

const SPONSOR_TIERS: Tier[] = [
  {
    id: "title",
    name: "Title",
    price: 250_000,
    tagline: "Presenting partner. Your name in front of every attendee.",
    highlight: true,
    remaining: "1 of 1 available",
    perks: [
      "Naming rights: \"PBW 2026 presented by [Brand]\"",
      "Opening + closing keynote slots",
      "Branded main stage backdrop (3 days)",
      "30 VIP all-access passes + private green room",
      "Hero placement: site, email, signage, post-event report",
      "Exclusive press-conference slot Day 1",
      "Premium 60 m² activation footprint",
      "Logo on lanyards (all 15,000 attendees)",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 150_000,
    tagline: "Stage owner. One track is yours to program.",
    remaining: "2 of 2 available",
    perks: [
      "Naming rights on a dedicated track (Builders / Capital / Enterprise)",
      "Keynote slot + 2 panel slots",
      "20 VIP passes",
      "36 m² activation footprint, premium hall location",
      "Logo on stage backdrop + agenda",
      "Branded lunch on chosen day",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 80_000,
    tagline: "Speaker tier with a real stage and a real booth.",
    remaining: "4 of 5 available",
    perks: [
      "Panel slot on a main track",
      "12 VIP passes",
      "24 m² activation footprint",
      "Logo on agenda + select signage",
      "Co-branded breakout session (45 min)",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 25_000,
    tagline: "Solid presence without the speaker price tag.",
    remaining: "6 of 8 available",
    perks: [
      "Workshop slot (45 min, side stage)",
      "6 VIP passes",
      "12 m² booth in the expo",
      "Logo on agenda",
      "Inclusion in sponsor email sequence (3 sends)",
    ],
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 35_000,
    tagline: "Entry tier — the cheapest seat at the sponsor table.",
    remaining: "Open allocation",
    perks: [
      "6 m² booth in the expo",
      "3 VIP passes",
      "Logo on website + sponsor wall",
      "Inclusion in sponsor email sequence (1 send)",
    ],
  },
];

const EXHIBITOR_TIERS: Tier[] = [
  {
    id: "cockpit",
    name: "Cockpit",
    price: 28_000,
    tagline: "Front-row hall position. Best foot traffic in the expo.",
    perks: [
      "30 m² island booth, front-of-hall placement",
      "6 exhibitor passes",
      "Power, wifi, basic furnishing",
      "Listing on expo map (featured)",
    ],
  },
  {
    id: "first",
    name: "First Class",
    price: 18_000,
    tagline: "Premium row, full-corner booth.",
    perks: [
      "18 m² corner booth",
      "4 exhibitor passes",
      "Power, wifi, basic furnishing",
      "Listing on expo map",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 12_000,
    tagline: "Standard 12 m² booth in main expo aisle.",
    perks: [
      "12 m² booth",
      "3 exhibitor passes",
      "Power, wifi, basic furnishing",
      "Listing on expo map",
    ],
  },
  {
    id: "premium-economy",
    name: "Premium Economy",
    price: 7_000,
    tagline: "Compact booth with sufficient demo space.",
    perks: [
      "6 m² booth",
      "2 exhibitor passes",
      "Power, wifi",
      "Listing in directory",
    ],
  },
  {
    id: "economy",
    name: "Economy",
    price: 4_000,
    tagline: "Pod booth — table + monitor space only.",
    perks: [
      "3 m² pod booth",
      "1 exhibitor pass",
      "Power, wifi",
      "Listing in directory",
    ],
  },
];

type ComparisonRow = {
  feature: string;
  bronze: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
  platinum: string | boolean;
  title: string | boolean;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Naming rights", bronze: false, silver: false, gold: false, platinum: "Track", title: "Event" },
  { feature: "Keynote slot", bronze: false, silver: false, gold: false, platinum: true, title: true },
  { feature: "Panel slot", bronze: false, silver: false, gold: true, platinum: "2x", title: "2x" },
  { feature: "Workshop / breakout", bronze: false, silver: true, gold: true, platinum: true, title: true },
  { feature: "Booth / activation", bronze: "6 m²", silver: "12 m²", gold: "24 m²", platinum: "36 m²", title: "60 m²" },
  { feature: "VIP passes", bronze: "3", silver: "6", gold: "12", platinum: "20", title: "30" },
  { feature: "Logo: agenda", bronze: false, silver: true, gold: true, platinum: true, title: true },
  { feature: "Logo: stage backdrop", bronze: false, silver: false, gold: false, platinum: true, title: true },
  { feature: "Logo: lanyards", bronze: false, silver: false, gold: false, platinum: false, title: true },
  { feature: "Press conference slot", bronze: false, silver: false, gold: false, platinum: false, title: true },
];

const A_LA_CARTE_CATEGORIES: Array<{
  label: string;
  items: Array<{ name: string; price: number }>;
}> = [
  {
    label: "Branding & Visibility",
    items: [
      { name: "Lanyards (15K printed)", price: 45_000 },
      { name: "Wifi naming rights", price: 25_000 },
      { name: "Conference tote bag", price: 22_000 },
      { name: "Hall banner (single)", price: 8_000 },
      { name: "Charging stations (5 units)", price: 12_000 },
      { name: "Welcome drink stand sponsor", price: 18_000 },
    ],
  },
  {
    label: "Hospitality",
    items: [
      { name: "VIP lounge naming (3 days)", price: 55_000 },
      { name: "Speakers' green room", price: 38_000 },
      { name: "Opening night gala host", price: 75_000 },
      { name: "Breakfast briefing slot", price: 16_000 },
      { name: "Press lunch host", price: 22_000 },
    ],
  },
  {
    label: "Activations",
    items: [
      { name: "Hackathon track sponsor", price: 50_000 },
      { name: "Demo zone naming", price: 28_000 },
      { name: "Investor matchmaking host", price: 35_000 },
      { name: "Workshop room (half-day)", price: 14_000 },
      { name: "After-party host (Day 2)", price: 60_000 },
      { name: "Roundtable host (closed-door)", price: 18_000 },
    ],
  },
];

const SCHEDULE_DAYS = [
  {
    day: "Day 1 — Jun 19",
    theme: "DECODED",
    blurb: "Foundations, regulation, capital markets. The keynote day.",
    blocks: [
      "09:00 — Opening keynote (Main Stage)",
      "10:30 — Capital track opens (VC / family offices / sovereigns)",
      "13:30 — Regulation panel (BSP, SEC, regional regulators)",
      "16:00 — Builders track opens",
      "19:00 — Welcome reception",
    ],
  },
  {
    day: "Day 2 — Jun 20",
    theme: "DEPLOYED",
    blurb: "Shipping day. Demos, hackathon, expo at full volume.",
    blocks: [
      "09:30 — Builder keynotes (Main Stage)",
      "10:30 — Hackathon kickoff (48 hrs)",
      "12:00 — Demo zone opens",
      "14:00 — Enterprise & GovTech track",
      "21:00 — Official after-party",
    ],
  },
  {
    day: "Day 3 — Jun 21",
    theme: "DIRECTION",
    blurb: "Where the next year goes. Summits, awards, closing call.",
    blocks: [
      "09:00 — Asia-Pacific summit (invite-only)",
      "11:00 — Founders fireside series",
      "14:00 — Hackathon demo day + awards",
      "17:00 — Closing keynote",
      "20:00 — Closing gala",
    ],
  },
];

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export default function PbwEventPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-8 px-6 py-10 md:px-10">
      <Link
        href="/demo/discover"
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to discover
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>Event</Kbd>
          <Kbd tone="mute">APAC</Kbd>
          <Kbd tone="mute">Conference</Kbd>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-altr-lime">
          Blockchain in Action — Decoded : Deployed
        </p>

        <h1 className="text-[32px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[44px]">
          Philippine Blockchain Week 2026
        </h1>

        <p className="font-mono text-[13px] text-altr-muteSoft">
          June 19–21, 2026 · SMX Convention Center, Manila
        </p>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="rounded border border-altr-green/40 bg-altr-green/10 px-2.5 py-1 text-altr-green">
            Accepting sponsors
          </span>
          <span className="rounded border border-altr-line2 px-2.5 py-1 text-altr-muteSoft">
            Vetted by ALTR
          </span>
          <span className="rounded border border-altr-line2 px-2.5 py-1 text-altr-muteSoft">
            48 days to event
          </span>
        </div>
      </header>

      <section
        aria-label="Event snapshot"
        className="grid gap-4 rounded-lg border border-altr-line bg-altr-panel p-5 sm:grid-cols-4 sm:p-6"
      >
        <Stat label="Attendees" value="15,000" sub="2.5× vs 2024" />
        <Stat label="Speakers" value="250+" sub="from 80+ countries" />
        <Stat label="Days" value="3" sub="2 stages · 4 tracks" />
        <Stat label="Expo floor" value="6,500 m²" sub="120+ exhibitors" />
      </section>

      <section
        aria-label="Audience insights"
        className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <Kbd>Audience insights</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Source: 2025 post-event survey (N=2,140)
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Breakdown
            label="Composition"
            rows={[
              ["Builders / Devs", "60%"],
              ["Capital (VC, FO)", "25%"],
              ["Enterprise / Govt", "15%"],
            ]}
          />
          <Breakdown
            label="Geography"
            rows={[
              ["Philippines", "42%"],
              ["Rest of SEA", "23%"],
              ["NE Asia", "18%"],
              ["RoW", "17%"],
            ]}
          />
          <Breakdown
            label="Decision power"
            rows={[
              ["Founder / C-suite", "38%"],
              ["VP / Director", "33%"],
              ["Senior IC", "29%"],
            ]}
          />
          <Breakdown
            label="Industries"
            rows={[
              ["Crypto-native", "44%"],
              ["Fintech", "21%"],
              ["Enterprise IT", "16%"],
              ["Gov / Policy", "9%"],
              ["Other", "10%"],
            ]}
          />
        </div>
      </section>

      <section
        aria-label="Sponsor tiers"
        className="space-y-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Sponsor tiers</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Pick the seat. Make the offer.
            </h2>
            <p className="mt-1 font-mono text-[12px] text-altr-muteSoft">
              5 tiers, same comparison axis. Click a tier to send a price-set offer.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            5 tiers
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {SPONSOR_TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} eventId="evt_pbw_2026" />
          ))}
        </div>

        <ComparisonTable rows={COMPARISON_ROWS} />
      </section>

      <section
        aria-label="Exhibitor tiers"
        className="space-y-4 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd tone="mute">Exhibitor tiers</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Just need a booth, not a stage?
            </h2>
            <p className="mt-1 font-mono text-[12px] text-altr-muteSoft">
              5 floor-only tiers. Pay for square meters, not naming rights.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            5 tiers
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {EXHIBITOR_TIERS.map((tier) => (
            <ExhibitorCard key={tier.id} tier={tier} eventId="evt_pbw_2026" />
          ))}
        </div>
      </section>

      <section
        aria-label="À la carte"
        className="space-y-4 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd tone="mute">À la carte</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Add-ons (mix and match)
            </h2>
            <p className="mt-1 font-mono text-[12px] text-altr-muteSoft">
              Stack onto any tier or buy à la carte. 30+ items across 3 categories.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            17 shown · 30+ total
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {A_LA_CARTE_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-lg border border-altr-line2 bg-altr-black p-4"
            >
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
                {cat.label}
              </div>
              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-3 border-b border-altr-line2/60 pb-2 text-[12px] last:border-0 last:pb-0"
                  >
                    <span className="text-altr-muteSoft">{item.name}</span>
                    <span className="shrink-0 font-mono tabular-nums text-altr-white">
                      {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Schedule"
        className="space-y-4 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd tone="mute">Schedule</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Three days, three modes
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Full agenda on PBW site
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {SCHEDULE_DAYS.map((day) => (
            <div
              key={day.day}
              className="rounded-lg border border-altr-line2 bg-altr-black p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                {day.day}
              </div>
              <div className="mt-2 font-mono text-[18px] font-bold tracking-[0.06em] text-altr-lime">
                {day.theme}
              </div>
              <p className="mt-2 text-[13px] text-altr-muteSoft">{day.blurb}</p>
              <ul className="mt-4 space-y-1.5 font-mono text-[11px] text-altr-muteSoft">
                {day.blocks.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-altr-line2"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          href="/demo/discover"
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to discover
        </Link>
        <Link
          href="/demo/deals/new?event=evt_pbw_2026&tier=Title"
          className="inline-flex h-11 items-center gap-1.5 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
        >
          Make an offer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <div className="mt-1 font-mono text-[22px] font-medium tabular-nums text-altr-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-0.5 font-mono text-[10px] text-altr-mute">{sub}</div>
      ) : null}
    </div>
  );
}

function Breakdown({
  label,
  rows,
}: {
  label: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <ul className="space-y-1.5">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="text-altr-muteSoft">{k}</span>
            <span className="font-mono tabular-nums text-altr-white">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TierCard({ tier, eventId }: { tier: Tier; eventId: string }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border bg-altr-black p-5",
        tier.highlight ? "border-altr-lime/50" : "border-altr-line2",
      )}
    >
      <div className="flex items-baseline justify-between">
        <Kbd tone={tier.highlight ? "yellow" : "mute"}>{tier.name}</Kbd>
        <span className="font-mono text-[18px] font-medium tabular-nums text-altr-white">
          {formatPrice(tier.price)}
        </span>
      </div>

      <p className="text-[12px] leading-snug text-altr-muteSoft">{tier.tagline}</p>

      {tier.remaining ? (
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-altr-mute">
          {tier.remaining}
        </div>
      ) : null}

      <ul className="flex flex-col gap-1.5 text-[12px] text-altr-muteSoft">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-altr-lime"
            />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/demo/deals/new?event=${eventId}&tier=${tier.name}`}
        className={cn(
          "mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all",
          tier.highlight
            ? "bg-altr-lime text-altr-black hover:brightness-110"
            : "border border-altr-line2 text-altr-muteSoft hover:border-altr-mute hover:text-altr-white",
        )}
      >
        Make an offer
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}

function ExhibitorCard({ tier, eventId }: { tier: Tier; eventId: string }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border border-altr-line2 bg-altr-black p-4">
      <div className="flex items-baseline justify-between">
        <Kbd tone="mute">{tier.name}</Kbd>
        <span className="font-mono text-[15px] font-medium tabular-nums text-altr-white">
          {formatPrice(tier.price)}
        </span>
      </div>
      <p className="text-[11.5px] leading-snug text-altr-muteSoft">{tier.tagline}</p>
      <ul className="flex flex-col gap-1.5 text-[11.5px] text-altr-muteSoft">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-altr-line2"
            />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/demo/deals/new?event=${eventId}&tier=${tier.name}`}
        className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-altr-line2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
      >
        Reserve
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </article>
  );
}

function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  const cols: Array<{ key: keyof Omit<ComparisonRow, "feature">; label: string }> = [
    { key: "bronze", label: "Bronze" },
    { key: "silver", label: "Silver" },
    { key: "gold", label: "Gold" },
    { key: "platinum", label: "Platinum" },
    { key: "title", label: "Title" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-altr-line2 bg-altr-black">
      <table className="w-full min-w-[640px] table-fixed font-mono text-[11.5px]">
        <thead>
          <tr className="border-b border-altr-line2">
            <th
              scope="col"
              className="w-[180px] px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-altr-mute"
            >
              What you get
            </th>
            {cols.map((c, i) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "px-3 py-3 text-center text-[10px] uppercase tracking-[0.18em]",
                  i === cols.length - 1 ? "text-altr-lime" : "text-altr-mute",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.feature}
              className={cn(
                "border-b border-altr-line2/60",
                idx === rows.length - 1 && "border-b-0",
              )}
            >
              <th
                scope="row"
                className="px-4 py-2.5 text-left text-altr-muteSoft"
              >
                {row.feature}
              </th>
              {cols.map((c, i) => {
                const val = row[c.key];
                const isLast = i === cols.length - 1;
                return (
                  <td
                    key={c.key}
                    className={cn(
                      "px-3 py-2.5 text-center tabular-nums",
                      isLast ? "text-altr-white" : "text-altr-muteSoft",
                    )}
                  >
                    {typeof val === "boolean" ? (
                      val ? (
                        <Check
                          className={cn(
                            "mx-auto h-3.5 w-3.5",
                            isLast ? "text-altr-lime" : "text-altr-muteSoft",
                          )}
                          aria-label="included"
                        />
                      ) : (
                        <Minus
                          className="mx-auto h-3 w-3 text-altr-line2"
                          aria-label="not included"
                        />
                      )
                    ) : (
                      val
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
