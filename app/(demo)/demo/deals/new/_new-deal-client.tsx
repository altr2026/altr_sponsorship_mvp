"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Event, SponsorTier } from "@/lib/mock-data/events";

const TIER_ORDER: SponsorTier[] = [
  "Title",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Booth",
];

const DEFAULT_MILESTONES: Array<{
  id: string;
  label: string;
  trigger: string;
  percentage: number;
}> = [
  { id: "m1", label: "M1", trigger: "Contract signed", percentage: 20 },
  { id: "m2", label: "M2", trigger: "Pre-event (T-30d)", percentage: 40 },
  { id: "m3", label: "M3", trigger: "Event day delivered", percentage: 30 },
  { id: "m4", label: "M4", trigger: "Post-event ROI signed", percentage: 10 },
];

type Rail = "RLUSD" | "USDC";

const RAILS: Array<{ value: Rail; label: string; subtitle: string }> = [
  {
    value: "RLUSD",
    label: "RLUSD on XRPL",
    subtitle: "Recommended · 3s settlement · $0.000012 fee per release",
  },
  {
    value: "USDC",
    label: "USDC on Base",
    subtitle: "EVM L2 · 2-4s settlement · $0.01-0.15 fee per release",
  },
];

const ALTR_FEE_BPS = 50; // 0.5%

function formatUsd(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

type NewDealClientProps = {
  event: Event;
  initialTier: SponsorTier;
};

export function NewDealClient({ event, initialTier }: NewDealClientProps) {
  const router = useRouter();
  const [tier, setTier] = useState<SponsorTier>(initialTier);
  const [rail, setRail] = useState<Rail>("RLUSD");
  const [initiating, setInitiating] = useState(false);

  const tiersForEvent = useMemo(
    () =>
      [...event.sponsor_packages].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
      ),
    [event],
  );

  const selectedPackage =
    event.sponsor_packages.find((p) => p.tier === tier) ?? event.sponsor_packages[0];
  const total = selectedPackage.price;
  const fee = Math.round((total * ALTR_FEE_BPS) / 10_000);
  const net = total - fee;

  function handleInitiate() {
    setInitiating(true);
    // Pick the settlement deal that matches the chosen event so the demo
    // narrative stays coherent (Ultra deal -> Ultra settlement, not the
    // Samsung × PBW page). Falls back to PBW if the event has no mock deal.
    const DEAL_BY_EVENT: Record<string, string> = {
      evt_pbw_2026: "dl_pbw_samsung",
      evt_ultra_korea_2026: "dl_ultra_samsung",
      evt_soundstorm_2026: "dl_soundstorm_samsung",
      evt_dubai_design_week_2026: "dl_dubai_design_samsung",
    };
    const dealId = DEAL_BY_EVENT[event.id] ?? "dl_pbw_samsung";
    setTimeout(() => {
      router.push(`/demo/deals/${dealId}`);
    }, 900);
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 px-6 py-10 md:px-10">
      <Link
        href={`/demo/events/${event.id}`}
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to {event.name}
      </Link>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Kbd>New deal</Kbd>
          <Kbd tone="mute">{event.region}</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[28px]">
          Configure your offer for {event.name}
        </h1>
        <p className="font-mono text-[12px] text-altr-mute">
          {event.vertical} · {event.location}, {event.country} · {event.date}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Form */}
        <div className="space-y-5">
          <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <Kbd>Package</Kbd>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                {tiersForEvent.length} tiers available
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {tiersForEvent.map((pkg) => {
                const active = pkg.tier === tier;
                return (
                  <button
                    key={pkg.tier}
                    type="button"
                    onClick={() => setTier(pkg.tier)}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border bg-altr-black p-4 text-left transition-colors",
                      active
                        ? "border-altr-lime"
                        : "border-altr-line2 hover:border-altr-mute",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Kbd tone={active ? "yellow" : "mute"}>{pkg.tier}</Kbd>
                      <span className="font-mono text-body tabular-nums text-altr-white">
                        {formatUsd(pkg.price)}
                      </span>
                    </div>
                    <p className="text-[11px] leading-snug text-altr-mute">
                      {pkg.perks.slice(0, 2).join(" · ")}
                      {pkg.perks.length > 2 ? "…" : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <Kbd>Milestones</Kbd>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                4 stages · sums to 100%
              </span>
            </div>
            <ol className="space-y-2">
              {DEFAULT_MILESTONES.map((m) => {
                const amount = Math.round((total * m.percentage) / 100);
                return (
                  <li
                    key={m.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-altr-line2 bg-altr-black px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-altr-line2 font-mono text-[10px] font-bold text-altr-mute">
                        {m.label}
                      </span>
                      <div>
                        <div className="text-[13px] font-medium text-altr-white">
                          {m.trigger}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                          {m.percentage}% of total
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-body tabular-nums text-altr-white">
                      {formatUsd(amount)}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Edit triggers and splits coming soon · defaults shown
            </p>
          </section>

          <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
            <div className="mb-4">
              <Kbd>Settlement rail</Kbd>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {RAILS.map((option) => {
                const active = rail === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRail(option.value)}
                    className={cn(
                      "flex flex-col gap-1.5 rounded-lg border bg-altr-black p-4 text-left transition-colors",
                      active
                        ? "border-altr-lime"
                        : "border-altr-line2 hover:border-altr-mute",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium text-altr-white">
                        {option.label}
                      </span>
                      {option.value === "RLUSD" ? (
                        <Kbd tone={active ? "yellow" : "mute"}>Recommended</Kbd>
                      ) : null}
                    </div>
                    <span className="text-[11px] leading-snug text-altr-mute">
                      {option.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sticky preview */}
        <aside className="space-y-5">
          <section className="sticky top-6 space-y-4 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
            <Kbd>Deal preview</Kbd>
            <div className="space-y-3 font-mono text-[13px] tabular-nums">
              <PreviewRow label="Tier" value={tier} mono />
              <PreviewRow label="Rail" value={rail} mono />
              <PreviewRow label="Total" value={formatUsd(total)} mono />
              <PreviewRow
                label={`ALTR fee (${(ALTR_FEE_BPS / 100).toFixed(2)}%)`}
                value={`-${formatUsd(fee)}`}
                mono
              />
              <div className="my-1 h-px bg-altr-line2" />
              <PreviewRow
                label="Net to event"
                value={formatUsd(net)}
                emphasis
                mono
              />
            </div>

            <button
              type="button"
              onClick={handleInitiate}
              disabled={initiating}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-altr-lime px-5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-altr-black transition-all hover:brightness-110 disabled:opacity-70"
              style={{
                boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)",
              }}
            >
              {initiating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Initiating on XRPL…
                </>
              ) : (
                <>
                  Initiate deal
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>

            <p className="text-[10px] leading-snug text-altr-mute">
              Demo only · routes to a sample settlement screen after a brief simulated tx. No real funds move.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  emphasis,
  mono,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        className={cn(
          "text-[11px] uppercase tracking-[0.18em]",
          mono && "font-mono",
          emphasis ? "text-altr-white" : "text-altr-mute",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          mono && "font-mono",
          emphasis
            ? "text-[18px] font-medium text-altr-lime"
            : "text-altr-white",
        )}
      >
        {value}
      </span>
    </div>
  );
}
