"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type PostReleaseStep = {
  id: string;
  letter: string;
  delay: number;
  timepoint: string;
  title: string;
  detail: string;
};

// M3 = event-day release (the 30% tranche that lands when doors open).
// Reframed terminal step: "Settlement complete" used to live here but that
// was confusing — settlement isn't complete until M4 also releases.
const POST_RELEASE_M3: PostReleaseStep[] = [
  {
    id: "pr_m3_a",
    letter: "A",
    delay: 400,
    timepoint: "T+0.4s",
    title: "Release signed by Samsung",
    detail:
      "Sponsorship lead authorizes the release. Multi-sig threshold met instantly.",
  },
  {
    id: "pr_m3_b",
    letter: "B",
    delay: 3500,
    timepoint: "T+3.5s",
    title: "Funds delivered to event wallet",
    detail:
      "$75,000 USDC arrives at the Philippine Blockchain Week receiving wallet on XRPL.",
  },
  {
    id: "pr_m3_c",
    letter: "C",
    delay: 8000,
    timepoint: "T+8s",
    title: "Receipt anchored on XRPL",
    detail:
      "Payment plus memo recorded on the ledger as proof of delivery. Public, verifiable, immutable.",
  },
  {
    id: "pr_m3_d",
    letter: "D",
    delay: 18000,
    timepoint: "T+18s",
    title: "Optional · off-ramp to USD or local fiat",
    detail:
      "Event can off-ramp USDC to USD (Circle redemption) or local fiat via banking partners. Default: hold USDC on-chain.",
  },
  {
    id: "pr_m3_e",
    letter: "E",
    delay: 28000,
    timepoint: "T+28s",
    title: "Event-day release complete · 90% delivered",
    detail:
      "M1 + M2 + M3 settled to PBW wallet. The final 10% (M4) stays in escrow until the post-event ROI report is co-signed.",
  },
];

// M4 = post-event final tranche. Shorter animation since it's the same
// XRPL Payment shape; the meaningful gating is the ROI report co-signing.
const POST_RELEASE_M4: PostReleaseStep[] = [
  {
    id: "pr_m4_a",
    letter: "A",
    delay: 400,
    timepoint: "T+0.4s",
    title: "ROI report co-signed by Samsung + PBW",
    detail:
      "Post-event reach, EMV, and audience-verified attribution are signed off by both sides. Multi-sig threshold met.",
  },
  {
    id: "pr_m4_b",
    letter: "B",
    delay: 2500,
    timepoint: "T+2.5s",
    title: "M4 funds delivered to event wallet",
    detail:
      "$25,000 USDC arrives at the PBW receiving wallet on XRPL. Receipt anchored on-chain.",
  },
  {
    id: "pr_m4_c",
    letter: "C",
    delay: 5000,
    timepoint: "T+5s",
    title: "Final settlement complete · 100% released",
    detail:
      "All four milestones cleared. The deal is closed; the on-chain payment history becomes Samsung's verified case study for the next deal.",
  },
];

type Destination = "USDC" | "XRP" | "FIAT";

const DESTINATIONS: Array<{
  value: Destination;
  label: string;
  subtitle: string;
}> = [
  {
    value: "USDC",
    label: "USDC",
    subtitle: "Stablecoin · hold on-chain",
  },
  {
    value: "XRP",
    label: "XRP",
    subtitle: "Crypto exposure · XRPL DEX swap",
  },
  {
    value: "FIAT",
    label: "USD / Fiat",
    subtitle: "USD redemption · local bank cash-out",
  },
];

// Hardcoded XRP price for the demo conversion preview. Real flow would
// pull a quote from the XRPL DEX or a CEX oracle.
const XRP_PRICE_USD = 0.5;

function formatUsd(amount: number) {
  return "$" + amount.toLocaleString("en-US");
}

function balanceForDestination(usdAmount: number, dest: Destination): string {
  if (dest === "USDC") return `${formatUsd(usdAmount)} USDC`;
  if (dest === "XRP")
    return `~${Math.round(usdAmount / XRP_PRICE_USD).toLocaleString()} XRP`;
  return `${formatUsd(usdAmount)} USD`;
}

function shortenAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return addr.slice(0, 8) + "…" + addr.slice(-6);
}

export function SettlementClient({ deal }: { deal: Deal }) {
  const [m3Released, setM3Released] = useState(false);
  const [m3RevealedCount, setM3RevealedCount] = useState(0);
  const [m4Released, setM4Released] = useState(false);
  const [m4RevealedCount, setM4RevealedCount] = useState(0);
  const [destination, setDestination] = useState<Destination>("USDC");

  useEffect(() => {
    if (!m3Released) return;
    const timers = POST_RELEASE_M3.map((item, index) =>
      setTimeout(() => setM3RevealedCount(index + 1), item.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [m3Released]);

  useEffect(() => {
    if (!m4Released) return;
    const timers = POST_RELEASE_M4.map((item, index) =>
      setTimeout(() => setM4RevealedCount(index + 1), item.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [m4Released]);

  const m3Complete = m3Released && m3RevealedCount >= POST_RELEASE_M3.length;
  const m4Complete = m4Released && m4RevealedCount >= POST_RELEASE_M4.length;

  // Cumulative amount that has actually landed in PBW's wallet so far.
  // M1 + M2 are always done in the mock data; M3 + M4 are demo-interactive.
  const cumulativeReleased =
    deal.milestones[0].amount +
    deal.milestones[1].amount +
    (m3Released ? deal.milestones[2].amount : 0) +
    (m4Released ? deal.milestones[3].amount : 0);

  const totalPercent = Math.round(
    (cumulativeReleased / deal.total_amount) * 100,
  );

  const conversionNote = (() => {
    if (destination === "USDC")
      return "No additional fee. USDC sits on-chain in the PBW wallet, ready for any future move.";
    if (destination === "XRP")
      return "XRPL DEX spread typically under 0.3 percent. Crypto price exposure applies.";
    return "USD off-ramp via Circle redemption, or local fiat via banking partners. Usually settles same business day.";
  })();

  // Header pill follows whichever milestone is currently the focus.
  const milestoneStatusLabel = m4Complete
    ? "All milestones · settled"
    : m3Complete
      ? "Milestone 4 · awaiting ROI report"
      : m3Released
        ? "Milestone 3 · releasing"
        : "Milestone 3 · awaiting release";
  const milestoneStatusGreen = m3Released || m4Complete;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
      <div className="space-y-5">
        <header className="space-y-3">
          <div className="space-y-2">
            <Kbd>Settlement</Kbd>
            <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[28px]">
              {deal.brand_name} × {deal.event_name} ·{" "}
              {formatUsd(deal.total_amount)}
            </h1>
            <p className="text-[12px] text-altr-mute">
              {deal.tier} sponsorship · {deal.currency} on XRPL · 4-milestone
              escrow. We never touch the funds. The brand pays the event
              directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            <span className="rounded border border-altr-green/40 bg-altr-green/10 px-2.5 py-1 text-altr-green">
              XRPL Testnet
            </span>
            <span className="rounded border border-altr-green/40 bg-altr-green/10 px-2.5 py-1 text-altr-green">
              Escrow active
            </span>
            <span
              className={cn(
                "rounded border px-2.5 py-1",
                milestoneStatusGreen
                  ? "border-altr-green/40 bg-altr-green/10 text-altr-green"
                  : "border-altr-lime/40 bg-altr-lime/10 text-altr-lime",
              )}
            >
              {milestoneStatusLabel}
            </span>
          </div>
        </header>

        <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <Kbd>Escrow transaction · XRPL testnet</Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Demo summary · run the real testnet escrow to see a verifiable hash
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Escrow address
              </div>
              <div className="mt-1 font-mono text-[12px] text-altr-white">
                {shortenAddress(deal.escrow_address)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Total locked
              </div>
              <div className="mt-1 font-mono text-[12px] text-altr-white">
                {formatUsd(deal.total_amount)} {deal.currency}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Fee per release
              </div>
              <div className="mt-1 font-mono text-[12px] text-altr-white">
                0.000012 XRP
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Verify on-chain
              </div>
              <Link
                href={`/demo/deals/${deal.id}/escrow`}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
              >
                Run real testnet tx →
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <Kbd>
              Full deal timeline · {deal.brand_name} × {deal.event_name}
            </Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Day -60 → release → final at Day +14
            </span>
          </div>

          <ol className="relative space-y-5 pl-7">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-[11px] top-2 w-px bg-altr-line2"
            />

            <TimelineRow
              state="done"
              day="Day -60"
              title="Contract signed"
              detail={`${deal.brand_name} commits to ${deal.tier} sponsorship of ${deal.event_name}. Escrow terms agreed: 4 milestones, ${deal.currency} on XRPL.`}
            />
            <TimelineRow
              state="done"
              day="Day -60"
              title="Brand fiat deposit"
              detail={`${deal.brand_name} wires ${formatUsd(deal.total_amount)} USD to a compliant on-ramp partner (Bridge / Brale / Circle Mint). ALTR never custodies the funds.`}
            />
            <TimelineRow
              state="done"
              day="Day -59"
              title={`Conversion · ${deal.currency} minted`}
              detail={`${formatUsd(deal.total_amount)} USD converted to ${deal.currency} on XRPL and routed to the escrow address.`}
            />
            <TimelineRow
              state="done"
              day="Day -59"
              title={`${deal.currency} locked in on-chain escrow`}
              detail={`${formatUsd(deal.total_amount)} ${deal.currency} sits in escrow at ${shortenAddress(deal.escrow_address)} until milestone signatures release each tranche.`}
              chain="on-chain"
            />

            <TimelineRow
              state="done"
              day="Day -59"
              title={`M1 released · ${deal.milestones[0].trigger}`}
              detail={`${formatUsd(deal.milestones[0].amount)} ${deal.currency} released to PBW wallet on signing (${deal.milestones[0].percentage}% upfront).`}
              chain="on-chain"
            />
            <TimelineRow
              state="done"
              day="Day -30"
              title={`M2 released · ${deal.milestones[1].trigger}`}
              detail={`${formatUsd(deal.milestones[1].amount)} ${deal.currency} released to PBW wallet 30 days before the event (${deal.milestones[1].percentage}%).`}
              chain="on-chain"
            />

            {/* M3 row — interactive when not yet released */}
            <TimelineRow
              state={m3Released ? "done" : "active"}
              day="Day 0 · today"
              title={`M3 ${m3Released ? "released" : "awaiting trigger"} · ${deal.milestones[2].trigger}`}
              detail={
                m3Released
                  ? `${formatUsd(deal.milestones[2].amount)} ${deal.currency} released to PBW wallet on event-day delivery (${deal.milestones[2].percentage}%).`
                  : `${formatUsd(deal.milestones[2].amount)} ${deal.currency} pending event-day signature (${deal.milestones[2].percentage}%). Trigger: PBW + Samsung co-sign once attendance is verified.`
              }
              chain={m3Released ? "on-chain" : undefined}
            />

            {!m3Released ? (
              <InlineReleaseTrigger
                onClick={() => setM3Released(true)}
                label="↓ Release M3 · event-day tranche"
              />
            ) : null}

            {m3Released
              ? POST_RELEASE_M3.map((step, index) => (
                  <PostReleaseRow
                    key={step.id}
                    step={step}
                    revealed={m3RevealedCount > index}
                    isLatest={m3RevealedCount === index + 1}
                    finalTone={
                      m3Complete && index === POST_RELEASE_M3.length - 1
                    }
                  />
                ))
              : null}

            {m3Complete ? <PreEventCallout amount={cumulativeReleased} /> : null}

            {/* M4 row — locked until M3 done, then triggerable */}
            <TimelineRow
              state={m4Released ? "done" : m3Complete ? "active" : "locked"}
              day="Day +14"
              title={
                m4Released
                  ? `M4 released · ${deal.milestones[3].trigger}`
                  : m3Complete
                    ? `M4 ready to trigger · ${deal.milestones[3].trigger}`
                    : `M4 locked · ${deal.milestones[3].trigger}`
              }
              detail={
                m4Released
                  ? `${formatUsd(deal.milestones[3].amount)} ${deal.currency} released as the final tranche (${deal.milestones[3].percentage}%). Deal is now fully settled.`
                  : m3Complete
                    ? `${formatUsd(deal.milestones[3].amount)} ${deal.currency} will release as soon as Samsung + PBW co-sign the post-event ROI report (${deal.milestones[3].percentage}%).`
                    : `${formatUsd(deal.milestones[3].amount)} ${deal.currency} stays in escrow until the post-event ROI report is signed (${deal.milestones[3].percentage}%).`
              }
              chain={m4Released ? "on-chain" : undefined}
            />

            {m3Complete && !m4Released ? (
              <InlineReleaseTrigger
                onClick={() => setM4Released(true)}
                label="↓ Co-sign ROI report · trigger M4"
              />
            ) : null}

            {m4Released
              ? POST_RELEASE_M4.map((step, index) => (
                  <PostReleaseRow
                    key={step.id}
                    step={step}
                    revealed={m4RevealedCount > index}
                    isLatest={m4RevealedCount === index + 1}
                    finalTone={
                      m4Complete && index === POST_RELEASE_M4.length - 1
                    }
                  />
                ))
              : null}

            {m4Complete ? (
              <FinalSettlementCallout total={deal.total_amount} />
            ) : null}
          </ol>
        </section>

        <section className="rounded-2xl border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
          <div className="mb-3 space-y-1">
            <Kbd>Event balance · currency choice</Kbd>
            <div className="text-[13px] text-altr-muteSoft">
              PBW chooses how to hold every release. The balance below is the
              cumulative amount delivered to the PBW wallet so far —{" "}
              {totalPercent}% of the {formatUsd(deal.total_amount)} deal.
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {DESTINATIONS.map((opt) => {
              const active = destination === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDestination(opt.value)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-altr-lime bg-altr-lime/15"
                      : "border-altr-line2 hover:border-altr-mute",
                  )}
                >
                  <div className="text-[14px] font-medium tracking-tight text-altr-white">
                    {opt.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-altr-mute">
                    {opt.subtitle}
                  </div>
                  <div
                    className={cn(
                      "mt-2 font-mono text-[12.5px] tabular-nums",
                      active ? "text-altr-lime" : "text-altr-white",
                    )}
                  >
                    {balanceForDestination(cumulativeReleased, opt.value)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-altr-line2 bg-altr-panel p-4">
            <Kbd className="mb-2">Cumulative balance · selected currency</Kbd>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <div className="font-mono text-[18px] font-medium text-altr-white">
                {formatUsd(cumulativeReleased)} {deal.currency}
              </div>
              <span className="text-altr-mute">→</span>
              <div className="font-mono text-[16px] font-medium text-altr-lime">
                {balanceForDestination(cumulativeReleased, destination)}
              </div>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                {totalPercent}% of {formatUsd(deal.total_amount)} delivered
              </span>
            </div>
            <div className="mt-2 text-[11px] leading-snug text-altr-mute">
              {conversionNote}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            href="/demo"
            className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
          >
            ← Back to demo entry
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/demo/deals/${deal.id}/activation`}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
            >
              Activation brief & proof →
            </Link>
            <Link
              href={`/demo/deals/${deal.id}/escrow`}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
            >
              Create real escrow →
            </Link>
            <Link
              href={`/demo/deals/${deal.id}/poe`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
            >
              View post-event report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type TimelineRowProps = {
  state: "done" | "active" | "locked";
  day: string;
  title: string;
  detail: string;
  chain?: string;
};

function TimelineRow({ state, day, title, detail, chain }: TimelineRowProps) {
  const badgeClass = cn(
    "absolute -left-[26px] top-0 grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] font-bold transition-all",
    state === "done" && "bg-altr-green text-altr-black",
    state === "active" &&
      "bg-altr-lime text-altr-black ring-4 ring-altr-lime/25 animate-pulse",
    state === "locked" && "bg-altr-line2 text-altr-mute",
  );

  const badgeContent =
    state === "done" ? "✓" : state === "active" ? "●" : "◯";

  const titleColor =
    state === "locked" ? "text-altr-muteSoft" : "text-altr-white";

  return (
    <li className="relative">
      <span className={badgeClass}>{badgeContent}</span>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="min-w-[80px] font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {day}
          </span>
          <span
            className={cn(
              "text-[13.5px] font-medium tracking-tight",
              titleColor,
            )}
          >
            {title}
          </span>
        </div>
        {chain ? (
          <span className="font-mono text-[10px] text-altr-mute">{chain}</span>
        ) : null}
      </div>
      <div className="mt-1 text-[11.5px] leading-snug text-altr-muteSoft">
        {detail}
      </div>
    </li>
  );
}

function InlineReleaseTrigger({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <li className="relative -ml-7">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px flex-1 bg-altr-line2" />
        <button
          type="button"
          onClick={onClick}
          className="rounded border-2 border-altr-lime bg-altr-lime px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-altr-black transition-all hover:brightness-110 active:translate-y-[1px]"
          style={{ boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }}
        >
          {label}
        </button>
        <span aria-hidden="true" className="h-px flex-1 bg-altr-line2" />
      </div>
    </li>
  );
}

function PostReleaseRow({
  step,
  revealed,
  isLatest,
  finalTone,
}: {
  step: PostReleaseStep;
  revealed: boolean;
  isLatest: boolean;
  finalTone: boolean;
}) {
  return (
    <li
      className={cn(
        "relative transition-all duration-500",
        isLatest && "animate-in fade-in-0 slide-in-from-left-2",
      )}
    >
      <span
        className={cn(
          "absolute -left-[26px] top-0 grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] font-bold transition-all duration-500",
          !revealed && "bg-altr-line2 text-altr-mute",
          revealed && !isLatest && finalTone
            ? "bg-teal-600 text-white"
            : revealed && !isLatest
              ? "bg-teal-600 text-white"
              : "",
          isLatest && "bg-altr-lime text-altr-black ring-4 ring-altr-lime/40",
        )}
      >
        {revealed ? <Check className="h-3 w-3" /> : step.letter}
      </span>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span
            className={cn(
              "min-w-[50px] font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
              isLatest && "text-altr-lime",
              revealed && !isLatest && "text-teal-400",
              !revealed && "text-altr-mute",
            )}
          >
            {step.timepoint}
          </span>
          <span
            className={cn(
              "text-[13.5px] font-medium tracking-tight transition-colors duration-300",
              revealed ? "text-altr-white" : "text-altr-muteSoft",
            )}
          >
            {step.title}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "mt-1 text-[11.5px] leading-snug transition-colors duration-300",
          revealed ? "text-altr-muteSoft" : "text-altr-mute",
        )}
      >
        {step.detail}
      </div>
    </li>
  );
}

function PreEventCallout({ amount }: { amount: number }) {
  return (
    <li className="relative -ml-7 list-none">
      <div className="rounded-lg border border-altr-lime/40 bg-altr-lime/10 px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-altr-lime" aria-hidden="true" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-altr-lime">
              90% released by event end
            </span>
          </div>
          <span className="font-mono text-[12px] font-medium tabular-nums text-altr-white">
            {formatUsd(amount)} USDC in PBW wallet
          </span>
        </div>
        <p className="mt-1 text-[11.5px] leading-snug text-altr-muteSoft">
          M1 (20% on signing) + M2 (40% pre-event) + M3 (30% event-day) lands
          in the PBW wallet by the close of Day 1. The remaining 10% (M4)
          holds in escrow until the ROI report is co-signed.
        </p>
      </div>
    </li>
  );
}

function FinalSettlementCallout({ total }: { total: number }) {
  return (
    <li className="relative -ml-7 list-none">
      <div className="rounded-lg border border-teal-500/40 bg-teal-600/10 px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-teal-400" aria-hidden="true" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-teal-400">
              Final settlement complete · 100%
            </span>
          </div>
          <span className="font-mono text-[12px] font-medium tabular-nums text-altr-white">
            {formatUsd(total)} USDC delivered over 4 milestones
          </span>
        </div>
        <p className="mt-1 text-[11.5px] leading-snug text-altr-muteSoft">
          The deal is closed. Every milestone payment is publicly verifiable
          on XRPL — Samsung now has a signed, on-chain case study to present
          for the next sponsorship.
        </p>
      </div>
    </li>
  );
}
