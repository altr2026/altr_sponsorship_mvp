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

const POST_RELEASE: PostReleaseStep[] = [
  {
    id: "pr_a",
    letter: "A",
    delay: 400,
    timepoint: "T+0.4s",
    title: "Release signed by Samsung",
    detail:
      "Sponsorship lead authorizes the release. Multi-sig threshold met instantly.",
  },
  {
    id: "pr_b",
    letter: "B",
    delay: 3500,
    timepoint: "T+3.5s",
    title: "Funds delivered to event wallet",
    detail:
      "$75,000 USDC arrives at the Philippine Blockchain Week receiving wallet on XRPL.",
  },
  {
    id: "pr_c",
    letter: "C",
    delay: 8000,
    timepoint: "T+8s",
    title: "Receipt anchored on XRPL",
    detail:
      "Payment plus memo recorded on the ledger as proof of delivery. Public, verifiable, immutable.",
  },
  {
    id: "pr_d",
    letter: "D",
    delay: 18000,
    timepoint: "T+18s",
    title: "Optional · off-ramp to USD or local fiat",
    detail:
      "Event can off-ramp USDC to USD (Circle redemption) or local fiat via banking partners. Default: hold USDC on-chain.",
  },
  {
    id: "pr_e",
    letter: "E",
    delay: 28000,
    timepoint: "T+28s",
    title: "Settlement complete",
    detail:
      "Escrow updated. M3 marked released. M4 unlocks when the post-event ROI report is signed.",
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

function formatUsd(amount: number) {
  return "$" + amount.toLocaleString("en-US");
}

function shortenHash(hash: string) {
  if (hash.length <= 14) return hash;
  return hash.slice(0, 8) + "…" + hash.slice(-6);
}

function shortenAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return addr.slice(0, 8) + "…" + addr.slice(-6);
}

export function SettlementClient({ deal }: { deal: Deal }) {
  const [released, setReleased] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [destination, setDestination] = useState<Destination>("USDC");

  useEffect(() => {
    if (!released) return;
    const timers = POST_RELEASE.map((item, index) =>
      setTimeout(() => setRevealedCount(index + 1), item.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [released]);

  const m3Amount = deal.milestones[2].amount;

  const conversionLabel = (() => {
    if (destination === "USDC")
      return `${formatUsd(m3Amount)} USDC · held on-chain`;
    if (destination === "XRP")
      return `swap via XRPL DEX (~${Math.round(m3Amount / 0.5).toLocaleString()} XRP at $0.50)`;
    return `${formatUsd(m3Amount)} → USD via Circle redemption`;
  })();

  const conversionNote = (() => {
    if (destination === "USDC")
      return "No additional fee. USDC sits on-chain in the PBW wallet, ready for any future move.";
    if (destination === "XRP")
      return "XRPL DEX spread typically under 0.3 percent. Crypto price exposure applies.";
    return "USD off-ramp via Circle redemption, or local fiat via banking partners. Usually settles same business day.";
  })();

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
                released
                  ? "border-altr-green/40 bg-altr-green/10 text-altr-green"
                  : "border-altr-lime/40 bg-altr-lime/10 text-altr-lime",
              )}
            >
              Milestone 3 · {released ? "released" : "awaiting release"}
            </span>
          </div>
        </header>

        <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <Kbd>Escrow transaction · XRPL testnet</Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Hash · {shortenHash(deal.xrpl_tx_hash)}
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
                Explorer
              </div>
              <a
                href={`https://testnet.xrpl.org/transactions/${deal.xrpl_tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
              >
                Open in explorer ↗
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <Kbd>
              Full deal timeline · {deal.brand_name} × {deal.event_name}
            </Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Day -60 → release → T+28s
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
              title={`M1 release · ${deal.milestones[0].trigger}`}
              detail={`${formatUsd(deal.milestones[0].amount)} ${deal.currency} released to PBW wallet on signing (${deal.milestones[0].percentage}% upfront).`}
              chain="on-chain"
            />
            <TimelineRow
              state="done"
              day="Day -30"
              title={`M2 release · ${deal.milestones[1].trigger}`}
              detail={`${formatUsd(deal.milestones[1].amount)} ${deal.currency} released to PBW wallet 30 days before the event (${deal.milestones[1].percentage}%).`}
              chain="on-chain"
            />

            <TimelineRow
              state={released ? "done" : "active"}
              day="Day 0 · today"
              title={`M3 ${released ? "released" : "awaiting"} · ${deal.milestones[2].trigger}`}
              detail={
                released
                  ? `${formatUsd(deal.milestones[2].amount)} ${deal.currency} released to PBW wallet on event-day delivery (${deal.milestones[2].percentage}%).`
                  : `${formatUsd(deal.milestones[2].amount)} ${deal.currency} pending event-day signature (${deal.milestones[2].percentage}%). Use the release button below.`
              }
              chain={released ? "on-chain" : undefined}
            />

            <li className="relative -ml-7">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1 transition-colors duration-700",
                    !released && "bg-altr-line2",
                    released &&
                      revealedCount < POST_RELEASE.length &&
                      "bg-altr-lime/40",
                    released &&
                      revealedCount >= POST_RELEASE.length &&
                      "bg-teal-500/40",
                  )}
                />
                <button
                  type="button"
                  onClick={() => !released && setReleased(true)}
                  disabled={released}
                  className={cn(
                    "rounded border-2 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all",
                    !released &&
                      "border-altr-lime bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
                    released &&
                      revealedCount < POST_RELEASE.length &&
                      "border-altr-lime bg-altr-lime/15 text-altr-lime",
                    released &&
                      revealedCount >= POST_RELEASE.length &&
                      "border-teal-500 bg-teal-600/15 text-teal-400",
                  )}
                  style={
                    released
                      ? undefined
                      : { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                  }
                >
                  {released ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      {revealedCount >= POST_RELEASE.length
                        ? "Settlement complete"
                        : "Release signed · settlement in progress"}
                    </span>
                  ) : (
                    "↓ Sign release & run settlement"
                  )}
                </button>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1 transition-colors duration-700",
                    !released && "bg-altr-line2",
                    released &&
                      revealedCount < POST_RELEASE.length &&
                      "bg-altr-lime/40",
                    released &&
                      revealedCount >= POST_RELEASE.length &&
                      "bg-teal-500/40",
                  )}
                />
              </div>
            </li>

            {POST_RELEASE.map((step, index) => {
              const revealed = released && revealedCount > index;
              const isLatest = revealed && revealedCount === index + 1;
              return (
                <li
                  key={step.id}
                  className={cn(
                    "relative transition-all duration-500",
                    isLatest && "animate-in fade-in-0 slide-in-from-left-2",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -left-[26px] top-0 grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] font-bold transition-all duration-500",
                      !revealed && "bg-altr-line2 text-altr-mute",
                      revealed && !isLatest && "bg-teal-600 text-white",
                      isLatest &&
                        "bg-altr-lime text-altr-black ring-4 ring-altr-lime/40",
                    )}
                  >
                    {revealed ? "✓" : step.letter}
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
            })}

            <TimelineRow
              state="locked"
              day="Day +14"
              title={`M4 locked · ${deal.milestones[3].trigger}`}
              detail={`${formatUsd(deal.milestones[3].amount)} ${deal.currency} stays in escrow until the post-event ROI report is signed (${deal.milestones[3].percentage}%).`}
            />
          </ol>
        </section>

        <section className="rounded-2xl border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
          <div className="mb-3 space-y-1">
            <Kbd>Event settles to</Kbd>
            <div className="text-[13px] text-altr-muteSoft">
              PBW picks where to receive the M3 release. Stages D and E in the
              timeline above reflect this choice.
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
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-altr-line2 bg-altr-panel p-4">
            <Kbd className="mb-2">Conversion result</Kbd>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <div className="font-mono text-[18px] font-medium text-altr-white">
                {formatUsd(m3Amount)} {deal.currency}
              </div>
              <span className="text-altr-mute">→</span>
              <div className="font-mono text-[16px] font-medium text-altr-lime">
                {conversionLabel}
              </div>
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
              Mint Proof of Engagement →
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
