"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import { DEMO_DATA_DISCLAIMER } from "@/lib/mock-data";
import type { Event } from "@/lib/mock-data/events";

type VerticalFilter = "All" | Event["vertical"];
type RegionFilter = "All" | Event["region"];

type AudienceBucket = {
  id: string;
  label: string;
  match: (attendees: number) => boolean;
};

type BudgetBucket = {
  id: string;
  label: string;
  match: (titlePrice: number) => boolean;
};

const VERTICALS: VerticalFilter[] = [
  "All",
  "Music",
  "Conference",
  "Fashion",
  "Wellness",
];

const REGIONS: RegionFilter[] = ["All", "APAC", "GCC"];

const AUDIENCE_BUCKETS: AudienceBucket[] = [
  { id: "audience_all", label: "Any size", match: () => true },
  { id: "audience_sm", label: "Under 10K", match: (n) => n < 10_000 },
  {
    id: "audience_md",
    label: "10K – 100K",
    match: (n) => n >= 10_000 && n < 100_000,
  },
  { id: "audience_lg", label: "100K+", match: (n) => n >= 100_000 },
];

const BUDGET_BUCKETS: BudgetBucket[] = [
  { id: "budget_all", label: "Any tier", match: () => true },
  { id: "budget_sm", label: "Title under $250K", match: (p) => p < 250_000 },
  {
    id: "budget_md",
    label: "$250K – $1M",
    match: (p) => p >= 250_000 && p < 1_000_000,
  },
  { id: "budget_lg", label: "$1M+", match: (p) => p >= 1_000_000 },
];

function formatAttendees(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

type DiscoverClientProps = {
  events: Event[];
};

export function DiscoverClient({ events }: DiscoverClientProps) {
  const [vertical, setVertical] = useState<VerticalFilter>("All");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [audience, setAudience] = useState<string>(AUDIENCE_BUCKETS[0].id);
  const [budget, setBudget] = useState<string>(BUDGET_BUCKETS[0].id);

  const audienceBucket =
    AUDIENCE_BUCKETS.find((b) => b.id === audience) ?? AUDIENCE_BUCKETS[0];
  const budgetBucket =
    BUDGET_BUCKETS.find((b) => b.id === budget) ?? BUDGET_BUCKETS[0];

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (vertical !== "All" && event.vertical !== vertical) return false;
      if (region !== "All" && event.region !== region) return false;
      if (!audienceBucket.match(event.attendees)) return false;
      const titlePrice =
        event.sponsor_packages.find((p) => p.tier === "Title")?.price ?? 0;
      if (!budgetBucket.match(titlePrice)) return false;
      return true;
    });
  }, [events, vertical, region, audienceBucket, budgetBucket]);

  const hasFilters =
    vertical !== "All" ||
    region !== "All" ||
    audience !== AUDIENCE_BUCKETS[0].id ||
    budget !== BUDGET_BUCKETS[0].id;

  function clearFilters() {
    setVertical("All");
    setRegion("All");
    setAudience(AUDIENCE_BUCKETS[0].id);
    setBudget(BUDGET_BUCKETS[0].id);
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 px-6 py-10 md:px-10">
      <header className="space-y-3">
        <Kbd>Discover</Kbd>
        <h1 className="text-[28px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[34px]">
          Browse events accepting sponsors.
        </h1>
        <p className="text-[13px] text-altr-mute">{DEMO_DATA_DISCLAIMER}</p>
      </header>

      <section
        aria-label="Filters"
        className="rounded-lg border border-altr-line bg-altr-panel p-4 sm:p-5"
      >
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <Kbd>Filters</Kbd>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute hover:text-altr-white"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear
            </button>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FilterGroup label="Vertical">
            {VERTICALS.map((option) => (
              <Pill
                key={option}
                active={vertical === option}
                onClick={() => setVertical(option)}
                label={option}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Region">
            {REGIONS.map((option) => (
              <Pill
                key={option}
                active={region === option}
                onClick={() => setRegion(option)}
                label={option}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Audience">
            {AUDIENCE_BUCKETS.map((option) => (
              <Pill
                key={option.id}
                active={audience === option.id}
                onClick={() => setAudience(option.id)}
                label={option.label}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="Budget">
            {BUDGET_BUCKETS.map((option) => (
              <Pill
                key={option.id}
                active={budget === option.id}
                onClick={() => setBudget(option.id)}
                label={option.label}
              />
            ))}
          </FilterGroup>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <Kbd tone="mute">
            {filtered.length} of {events.length} events
          </Kbd>
          <Link
            href="/demo"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute hover:text-altr-white"
          >
            Back to demo entry
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-altr-line2 bg-altr-panel p-12 text-center">
            <p className="text-body text-altr-muteSoft">
              No events match these filters yet.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-altr-lime bg-altr-lime/10 text-altr-lime"
          : "border-altr-line2 text-altr-muteSoft hover:border-altr-mute hover:text-altr-white",
      )}
    >
      {label}
    </button>
  );
}

function EventCard({ event }: { event: Event }) {
  const titlePackage = event.sponsor_packages.find((p) => p.tier === "Title");
  const goldPackage = event.sponsor_packages.find((p) => p.tier === "Gold");

  return (
    <Link
      href={`/demo/events/${event.id}`}
      className="group flex h-full flex-col gap-3 rounded-lg border border-altr-line2 bg-altr-panel p-5 transition-colors hover:border-altr-mute focus:outline-none focus-visible:border-altr-lime"
    >
      <div
        aria-hidden="true"
        className="flex h-32 items-center justify-center rounded-md border border-altr-line2 bg-altr-black"
      >
        <Kbd tone="mute">{event.vertical}</Kbd>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Kbd tone="yellow">{event.vertical}</Kbd>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {event.region}
        </span>
      </div>
      <div>
        <h3 className="text-[16px] font-medium tracking-tight text-altr-white">
          {event.name}
        </h3>
        <p className="mt-1 font-mono text-caption text-altr-mute">
          {event.location}, {event.country} · {event.date}
        </p>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-altr-line2 pt-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
            Audience
          </div>
          <div className="font-mono text-body tabular-nums text-altr-white">
            {formatAttendees(event.attendees)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
            Title
          </div>
          <div className="font-mono text-body tabular-nums text-altr-white">
            {titlePackage ? formatPrice(titlePackage.price) : "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
            Gold
          </div>
          <div className="font-mono text-body tabular-nums text-altr-white">
            {goldPackage ? formatPrice(goldPackage.price) : "—"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          View
        </span>
        <ArrowRight
          className="h-4 w-4 text-altr-lime transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
