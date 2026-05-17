"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";
import type { Event } from "@/lib/mock-data/events";
import type { RoiReport } from "@/lib/mock-data/roi-reports";

type RenewalClientProps = {
  deal: Deal;
  sourceEvent: Event | null;
  roi: RoiReport | null;
  expansionEvents: Event[];
};

type ProposalState = "pending" | "accepted" | "countered" | "declined";

function formatUsd(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  }
  return "$" + n.toLocaleString("en-US");
}

function renewalNextYearName(eventName: string): string {
  return eventName.replace(/2026/g, "2027");
}

function projectedRoiForEvent(event: Event, lastRoi: RoiReport | null): {
  multiplier: number;
  emv: number;
  rationale: string;
} {
  // Heuristic: 70% of last year's multiplier for new vertical, 85% for same vertical, scaled by event audience size.
  const sourceTitlePrice =
    event.sponsor_packages.find((p) => p.tier === "Title")?.price ?? 0;
  const lastMultiplier = lastRoi?.roi_multiplier ?? 4.5;

  let verticalDiscount = 0.7;
  let rationale = "different vertical · new audience";
  if (event.vertical === "Conference") {
    verticalDiscount = 0.92;
    rationale = "same vertical · proven format fit";
  } else if (event.region === "GCC" && lastRoi) {
    verticalDiscount = 0.78;
    rationale = "new region · audience profile aligned";
  } else if (event.vertical === "Music") {
    verticalDiscount = 0.72;
    rationale = "broader consumer audience";
  }

  const projectedMultiplier = lastMultiplier * verticalDiscount;
  const projectedEmv = sourceTitlePrice * projectedMultiplier;
  return {
    multiplier: Number(projectedMultiplier.toFixed(1)),
    emv: Math.round(projectedEmv),
    rationale,
  };
}

export function RenewalClient({
  deal,
  sourceEvent,
  roi,
  expansionEvents,
}: RenewalClientProps) {
  const [proposalState, setProposalState] = useState<ProposalState>("pending");

  const nextYearEventName = renewalNextYearName(deal.event_name);
  const basePriceUsd = 350_000;
  const renewalDiscountPct = 10;
  const renewalDiscountAmount = Math.round(basePriceUsd * (renewalDiscountPct / 100));
  const finalPriceUsd = basePriceUsd - renewalDiscountAmount;
  const yoyDeltaPct = Math.round(((finalPriceUsd - deal.total_amount) / deal.total_amount) * 100);
  const projectedEmvNextYear = roi
    ? Math.round(finalPriceUsd * roi.roi_multiplier * 0.9) // 90% of last year's multiplier (regression to mean)
    : finalPriceUsd * 5;
  const projectedMultiplierNextYear = roi
    ? Number((roi.roi_multiplier * 0.9).toFixed(1))
    : 5.0;

  const newPerks = [
    "All Title 2026 perks (4 items)",
    "Crypto Founder Lounge naming rights (new)",
    "Early-access keynote slot (Day 0 invite-only)",
    "Expanded 80 m² activation footprint (+33%)",
    "20 additional VIP all-access passes",
    "Year-round APAC investor matchmaking",
  ];

  const isAccepted = proposalState === "accepted";
  const isCountered = proposalState === "countered";
  const isDeclined = proposalState === "declined";
  const isPending = proposalState === "pending";

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
      <Link
        href={`/demo/deals/${deal.id}/poe`}
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to ROI report
      </Link>

      <header className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>Phase 05 · Renewal</Kbd>
          <Kbd tone="mute">Step 16 · Proposal</Kbd>
          <Kbd tone="mute">Step 17 · Negotiation</Kbd>
          <Kbd tone="mute">Step 18 · Expansion</Kbd>
        </div>
        <h1 className="text-[26px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[34px]">
          Renewal — anchored to verified ROI
        </h1>
        <p className="max-w-3xl font-mono text-[12px] text-altr-muteSoft">
          The POE NFT for {deal.brand_name} × {deal.event_name} is the only
          source of truth either side cites. No PDFs, no claim slides — last
          year&apos;s on-chain receipt drives this year&apos;s price.
        </p>
      </header>

      <section
        aria-label="Step 16 renewal proposal"
        className={cn(
          "mt-8 rounded-2xl border p-5 sm:p-7",
          isAccepted
            ? "border-teal-500/40 bg-teal-600/5"
            : isDeclined
              ? "border-altr-line bg-altr-panel/60"
              : "border-altr-lime/40 bg-altr-lime/5",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Kbd>Step 16 · Renewal proposal</Kbd>
            <h2 className="text-h2 font-medium text-altr-white">
              {nextYearEventName} · Title tier
            </h2>
            <p className="text-[13px] text-altr-muteSoft">
              Auto-generated from your POE history. Renewal pricing reflects
              the {roi ? `${roi.roi_multiplier.toFixed(1)}× ROI you delivered (${roi.benchmark_percentile}th percentile)` : "ROI you delivered last year"}.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
              Final price
            </div>
            <div className="mt-1 font-mono text-[36px] font-medium leading-none tabular-nums text-altr-lime sm:text-[44px]">
              {formatUsd(finalPriceUsd, { compact: true })}
            </div>
            <div className="mt-1 font-mono text-[11px] text-altr-mute">
              {yoyDeltaPct > 0 ? `+${yoyDeltaPct}%` : `${yoyDeltaPct}%`} vs {formatUsd(deal.total_amount, { compact: true })} last year
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <PricingRow
            label="Base 2027 Title"
            value={formatUsd(basePriceUsd, { compact: true })}
            note="published price for new sponsors"
          />
          <PricingRow
            label={`Renewal discount (${renewalDiscountPct}%)`}
            value={"−" + formatUsd(renewalDiscountAmount, { compact: true })}
            note="for verified past sponsors"
            tone="lime"
          />
          <PricingRow
            label="Final renewal price"
            value={formatUsd(finalPriceUsd, { compact: true })}
            note={`saves ${formatUsd(renewalDiscountAmount, { compact: true })} vs new-sponsor pricing`}
            tone="white"
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <article>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
              What you get
            </div>
            <ul className="mt-3 space-y-2">
              {newPerks.map((perk, i) => (
                <li
                  key={perk}
                  className="flex items-start gap-2 text-[12.5px] text-altr-muteSoft"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-altr-lime" aria-hidden="true" />
                  <span className={i === 0 ? "text-altr-mute" : "text-altr-muteSoft"}>
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-altr-line2 bg-altr-black p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
              Projected ROI · 2027
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-[24px] font-medium tabular-nums text-altr-white">
                {formatUsd(projectedEmvNextYear, { compact: true })}
              </span>
              <span className="font-mono text-[11px] text-altr-mute">EMV</span>
            </div>
            <div className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-altr-lime">
              {projectedMultiplierNextYear}× projected
            </div>
            <p className="mt-3 text-[11.5px] leading-snug text-altr-mute">
              Projection assumes 90% of last year&apos;s multiplier (typical
              regression to mean) applied to the new price. Audience growth
              and creator mix vary.
            </p>
          </article>
        </div>

        {!isDeclined ? (
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setProposalState("accepted")}
              disabled={!isPending && !isCountered}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                isPending && "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
                isCountered && "bg-altr-lime text-altr-black hover:brightness-110",
                isAccepted && "bg-teal-600/20 text-teal-400 cursor-default",
              )}
              style={
                (isPending || isCountered) && !isAccepted
                  ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                  : undefined
              }
            >
              {isAccepted ? (
                <>
                  <Check className="h-4 w-4" />
                  Accepted
                </>
              ) : (
                <>
                  Accept proposal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setProposalState(isCountered ? "pending" : "countered")}
              disabled={isAccepted}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md border px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                isCountered
                  ? "border-altr-lime text-altr-lime"
                  : "border-altr-line2 text-altr-muteSoft hover:border-altr-mute hover:text-altr-white",
                isAccepted && "opacity-50 cursor-not-allowed",
              )}
            >
              {isCountered ? "Counter sent" : "Counter"}
            </button>
            <button
              type="button"
              onClick={() => setProposalState("declined")}
              disabled={isAccepted}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-mute transition-all hover:border-red-500/40 hover:text-red-300",
                isAccepted && "opacity-50 cursor-not-allowed",
              )}
            >
              Decline
            </button>
          </div>
        ) : (
          <div className="mt-7 rounded-md border border-altr-line2 bg-altr-black p-4 text-[12px] text-altr-muteSoft">
            Proposal declined. We&apos;ll surface alternatives in Step 18 below.
            <button
              type="button"
              onClick={() => setProposalState("pending")}
              className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
            >
              Reset
            </button>
          </div>
        )}
      </section>

      <section
        aria-label="Step 17 negotiation"
        className="mt-8 rounded-2xl border border-altr-line bg-altr-panel p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Step 17 · Negotiation anchored to POE</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Both sides reference the same on-chain receipt.
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              The POE NFT is cited in every line. No PDF claim slides, no
              &quot;trust me&quot; — just the hash.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-altr-lime/40 bg-altr-lime/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-altr-lime">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            POE-anchored
          </span>
        </div>

        <ol className="mt-6 space-y-4">
          <ChatMessage
            party="ALTR"
            role="System · auto-drafted"
            tone="system"
            poeQuote={
              roi
                ? `POE NFT cited: ${roi.roi_multiplier.toFixed(1)}× ROI, ${roi.benchmark_percentile}th percentile of ${roi.benchmark_cohort_size} comparable ${roi.benchmark_cohort}.`
                : "POE NFT cited."
            }
          >
            Based on the on-chain POE for {deal.event_name}, recommended
            renewal package is {nextYearEventName} Title at{" "}
            {formatUsd(finalPriceUsd, { compact: true })} (renewal discount
            applied). Locked under the same multi-milestone escrow structure.
          </ChatMessage>

          <ChatMessage
            party={deal.brand_name}
            role="Brand · sponsorship lead"
            tone="brand"
          >
            Interested. We want to expand the booth and add a Day-2 founder
            roundtable. What does that cost on top?
          </ChatMessage>

          <ChatMessage
            party="PBW 2027 organiser"
            role="Event · partnerships"
            tone="event"
            poeQuote={
              roi
                ? `POE NFT shows 12,400 booth walkthroughs and 8,247 branded mentions in 2026 — repeatable.`
                : undefined
            }
          >
            Booth expansion to 80 m² adds $20K and unlocks Crypto Founder
            Lounge naming. Day-2 founder roundtable is +$8K. Both pull from
            the same milestone escrow.
          </ChatMessage>

          <ChatMessage
            party={deal.brand_name}
            role="Brand · sponsorship lead"
            tone="brand"
          >
            Done. Send the contract — same 4-milestone escrow structure as
            last year.
          </ChatMessage>

          <ChatMessage
            party="ALTR"
            role="System · contract drafted"
            tone="system"
          >
            Contract drafted. Final value: {formatUsd(finalPriceUsd + 28_000, { compact: true })}. Milestone schedule mirrors 2026 (20/40/30/10). Awaiting signature.
          </ChatMessage>
        </ol>
      </section>

      <section
        aria-label="Step 18 expansion"
        className="mt-8 rounded-2xl border border-altr-line bg-altr-panel p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Step 18 · Expansion · APAC / GCC</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              ALTR recommends three more events based on your ROI history.
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              Each card includes a projected EMV anchored to{" "}
              {roi ? `your verified ${roi.roi_multiplier.toFixed(1)}× multiplier` : "comparable past sponsorships"} and adjusted for audience overlap.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {expansionEvents.length} picks
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {expansionEvents.map((event) => {
            const projected = projectedRoiForEvent(event, roi);
            const titlePackage = event.sponsor_packages.find((p) => p.tier === "Title");
            return (
              <article
                key={event.id}
                className="flex h-full flex-col gap-3 rounded-lg border border-altr-line2 bg-altr-black p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <Kbd tone="mute">{event.region}</Kbd>
                  <Kbd tone="mute">{event.vertical}</Kbd>
                </div>
                <h3 className="text-[17px] font-medium leading-tight text-altr-white">
                  {event.name}
                </h3>
                <p className="font-mono text-[11px] text-altr-mute">
                  {event.location}, {event.country} · {event.date}
                </p>

                <div className="my-2 grid grid-cols-2 gap-3 border-y border-altr-line2/60 py-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                      Title tier
                    </div>
                    <div className="mt-1 font-mono text-[15px] font-medium tabular-nums text-altr-white">
                      {titlePackage ? formatUsd(titlePackage.price, { compact: true }) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                      Projected EMV
                    </div>
                    <div className="mt-1 font-mono text-[15px] font-medium tabular-nums text-altr-lime">
                      {formatUsd(projected.emv, { compact: true })}
                    </div>
                    <div className="font-mono text-[10px] text-altr-mute">
                      {projected.multiplier}× projected
                    </div>
                  </div>
                </div>

                <p className="text-[11.5px] leading-snug text-altr-muteSoft">
                  Rationale: {projected.rationale}.
                </p>

                <Link
                  href={`/demo/deals/new?event=${event.id}&tier=Title`}
                  className="mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-altr-line2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-lime/60 hover:text-altr-lime"
                >
                  Start a deal
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/demo/deals/${deal.id}`}
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to settlement
        </Link>
        <Link
          href="/demo/discover"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
        >
          Browse all events
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {sourceEvent ? (
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          Reference deal · {sourceEvent.name} · POE history retained inside ALTR
        </p>
      ) : null}
    </div>
  );
}

function PricingRow({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "lime" | "white";
}) {
  return (
    <div className="rounded-md border border-altr-line2 bg-altr-black p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <div
        className={cn(
          "mt-1.5 font-mono text-[18px] font-medium tabular-nums",
          tone === "lime"
            ? "text-altr-lime"
            : tone === "white"
              ? "text-altr-white"
              : "text-altr-muteSoft",
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] text-altr-mute">{note}</div>
    </div>
  );
}

function ChatMessage({
  party,
  role,
  tone,
  poeQuote,
  children,
}: {
  party: string;
  role: string;
  tone: "system" | "brand" | "event";
  poeQuote?: string;
  children: React.ReactNode;
}) {
  const dotClass =
    tone === "system"
      ? "bg-altr-lime"
      : tone === "brand"
        ? "bg-teal-400"
        : "bg-amber-400";

  return (
    <li className="relative pl-7">
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-2 h-2.5 w-2.5 rounded-full",
          dotClass,
        )}
      />
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-[13px] font-medium text-altr-white">{party}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {role}
        </span>
      </div>
      {poeQuote ? (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-altr-lime/30 bg-altr-lime/5 p-2.5">
          <MessageSquare
            className="mt-0.5 h-3 w-3 shrink-0 text-altr-lime"
            aria-hidden="true"
          />
          <span className="text-[11.5px] leading-snug text-altr-lime">
            {poeQuote}
          </span>
        </div>
      ) : null}
      <p className="mt-2 text-[13px] leading-relaxed text-altr-muteSoft">
        {children}
      </p>
    </li>
  );
}
