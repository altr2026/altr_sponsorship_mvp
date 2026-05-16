import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { getEventById } from "@/lib/mock-data/events";
import { cn } from "@/lib/utils";

type PageProps = { params: { id: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const event = getEventById(params.id);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.name} · Demo`,
    description: `${event.vertical} · ${event.location}, ${event.country} · ${event.date}. Sponsorship packages from ${event.sponsor_packages[event.sponsor_packages.length - 1]?.tier ?? "Booth"} to Title.`,
    robots: { index: false, follow: false },
  };
}

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

const TIER_ORDER: Record<string, number> = {
  Title: 0,
  Gold: 1,
  Silver: 2,
  Booth: 3,
};

export default function EventDetailPage({ params }: PageProps) {
  const event = getEventById(params.id);
  if (!event) notFound();

  const packages = [...event.sponsor_packages].sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99),
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-6 py-10 md:px-10">
      <Link
        href="/demo/discover"
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to discover
      </Link>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Kbd>Event</Kbd>
          <Kbd tone="mute">{event.region}</Kbd>
        </div>
        <h1 className="text-[28px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[34px]">
          {event.name}
        </h1>
        <p className="font-mono text-[13px] text-altr-mute">
          {event.vertical} · {event.location}, {event.country} · {event.date}
        </p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="rounded border border-altr-green/40 bg-altr-green/10 px-2.5 py-1 text-altr-green">
            Accepting sponsors
          </span>
          <span className="rounded border border-altr-line2 px-2.5 py-1 text-altr-muteSoft">
            Vetted by ALTR
          </span>
          {event.is_anchor_partner ? (
            <span className="rounded border border-altr-lime/40 bg-altr-lime/10 px-2.5 py-1 text-altr-lime">
              Anchor partner
            </span>
          ) : null}
        </div>
      </header>

      <section
        aria-label="Event snapshot"
        className="grid gap-4 rounded-lg border border-altr-line bg-altr-panel p-5 sm:grid-cols-4 sm:p-6"
      >
        <Stat label="Attendees" value={formatAttendees(event.attendees)} />
        <Stat label="Vertical" value={event.vertical} />
        <Stat label="Region" value={event.region} />
        <Stat
          label="Title tier"
          value={
            formatPrice(
              event.sponsor_packages.find((p) => p.tier === "Title")?.price ?? 0,
            )
          }
        />
      </section>

      <section
        aria-label="Audience insights"
        className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4 flex items-baseline justify-between gap-2">
          <Kbd>Audience insights</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Self-reported · last updated 30d
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Age range" value={event.audience.age} />
          <Stat label="Gender split" value={event.audience.gender} />
          <Stat label="Income" value={event.audience.income} />
        </div>
      </section>

      <section
        aria-label="Sponsorship packages"
        className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-5 flex items-baseline justify-between gap-2">
          <Kbd>Sponsorship packages</Kbd>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {packages.length} tiers
          </span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {packages.map((pkg) => (
            <article
              key={pkg.tier}
              className={cn(
                "flex h-full flex-col gap-3 rounded-lg border bg-altr-black p-5",
                pkg.tier === "Title"
                  ? "border-altr-lime/50"
                  : "border-altr-line2",
              )}
            >
              <div className="flex items-baseline justify-between">
                <Kbd tone={pkg.tier === "Title" ? "yellow" : "mute"}>
                  {pkg.tier}
                </Kbd>
                <span className="font-mono text-[18px] font-medium tabular-nums text-altr-white">
                  {formatPrice(pkg.price)}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5 text-[12px] text-altr-muteSoft">
                {pkg.perks.map((perk) => (
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
                href={`/demo/deals/new?event=${event.id}&tier=${pkg.tier}`}
                className={cn(
                  "mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all",
                  pkg.tier === "Title"
                    ? "bg-altr-lime text-altr-black hover:brightness-110"
                    : "border border-altr-line2 text-altr-muteSoft hover:border-altr-mute hover:text-altr-white",
                )}
              >
                Make an offer
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/demo/discover"
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to discover
        </Link>
        <Link
          href={`/demo/deals/new?event=${event.id}&tier=Title`}
          className="inline-flex h-11 items-center gap-1.5 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
        >
          Make an offer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <div className="mt-1 font-mono text-body text-altr-white">{value}</div>
    </div>
  );
}
