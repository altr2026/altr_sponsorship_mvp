import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import { getDealById } from "@/lib/mock-data/deals";
import {
  getVendorPayoutsByMilestone,
  getVendorPayoutsByDealId,
  serviceLabel,
  type VendorPaymentStatus,
} from "@/lib/mock-data/vendors";

type PageProps = { params: { deal_id: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.deal_id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `Event ops · ${deal.event_name}`,
    description: `Private vendor-payout dashboard for ${deal.event_name}. Internal to the event team — sponsor does not see this view.`,
    robots: { index: false, follow: false },
  };
}

function formatUsd(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  }
  return "$" + n.toLocaleString("en-US");
}

const STATUS_TONE: Record<VendorPaymentStatus, string> = {
  released: "text-altr-lime",
  scheduled: "text-altr-muteSoft",
  withheld: "text-amber-300",
  disputed: "text-red-300",
};

export default function EventDashboardPage({ params }: PageProps) {
  const deal = getDealById(params.deal_id);
  if (!deal) notFound();

  const allPayouts = getVendorPayoutsByDealId(deal.id);
  const releasedToVendors = allPayouts
    .filter((p) => p.status === "released")
    .reduce((sum, p) => sum + p.amount_usd, 0);
  const scheduledToVendors = allPayouts
    .filter((p) => p.status === "scheduled")
    .reduce((sum, p) => sum + p.amount_usd, 0);
  const totalAllocated = releasedToVendors + scheduledToVendors;
  const unallocated = deal.total_amount - totalAllocated;
  const uniqueVendors = new Set(allPayouts.map((p) => p.vendor_id)).size;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
      <Link
        href={`/demo/deals/${deal.id}`}
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to settlement
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-md border border-amber-400/40 bg-amber-400/5 px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber-300">
        <Lock className="h-3 w-3" aria-hidden="true" />
        Internal · event team only · sponsor does not see this view
      </div>

      <header className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>Event ops dashboard</Kbd>
          <Kbd tone="mute">Private</Kbd>
        </div>
        <h1 className="text-[26px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[34px]">
          {deal.event_name} · event wallet
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          {deal.brand_name}&apos;s {formatUsd(deal.total_amount)} {deal.currency} sponsorship
          unlocks to your wallet per milestone. Track the balance, what came
          in from the brand, and what went out to vendors. The brand only
          sees delivery proof — not these line items.
        </p>
      </header>

      <WalletSummary deal={deal} releasedToVendors={releasedToVendors} scheduledToVendors={scheduledToVendors} uniqueVendors={uniqueVendors} unallocated={unallocated} />

      <InflowsTable deal={deal} />

      <section className="mt-5 space-y-5">
        {deal.milestones.map((milestone, idx) => {
          const payouts = getVendorPayoutsByMilestone(deal.id, milestone.id);
          const allocated = payouts.reduce((s, p) => s + p.amount_usd, 0);
          const remaining = milestone.amount - allocated;

          const milestoneBadge =
            milestone.status === "released"
              ? "border-altr-green/40 bg-altr-green/10 text-altr-green"
              : milestone.status === "pending"
                ? "border-altr-lime/40 bg-altr-lime/10 text-altr-lime"
                : "border-altr-line2 text-altr-muteSoft";

          return (
            <article
              key={milestone.id}
              className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Kbd>{milestone.label} · escrow release</Kbd>
                    <span className={cn("rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]", milestoneBadge)}>
                      {milestone.status}
                    </span>
                  </div>
                  <h2 className="text-h2 font-medium text-altr-white">
                    {milestone.trigger}
                  </h2>
                  <p className="font-mono text-[11px] text-altr-mute">
                    {formatUsd(milestone.amount)} unlocks · {payouts.length} vendor{payouts.length === 1 ? "" : "s"} ·{" "}
                    {milestone.released_at
                      ? `released ${new Date(milestone.released_at).toLocaleDateString()}`
                      : "release pending"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
                    Allocated
                  </div>
                  <div className="mt-1 font-mono text-[22px] font-medium tabular-nums text-altr-white">
                    {formatUsd(allocated, { compact: true })}
                  </div>
                  <div className="font-mono text-[10px] text-altr-mute">
                    of {formatUsd(milestone.amount, { compact: true })} · {remaining === 0 ? "fully allocated" : `${formatUsd(remaining)} buffer`}
                  </div>
                </div>
              </div>

              {payouts.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-altr-line2">
                  <table className="w-full min-w-[640px] text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-altr-line2 bg-altr-black/40">
                        <th scope="col" className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Vendor</th>
                        <th scope="col" className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Service</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Amount</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Status</th>
                        <th scope="col" className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((p) => (
                        <tr key={p.id} className="border-b border-altr-line2/60 last:border-0">
                          <td className="px-3 py-3 text-altr-white">{p.vendor_name}</td>
                          <td className="px-3 py-3 font-mono text-[11px] text-altr-muteSoft">{serviceLabel(p.service)}</td>
                          <td className="px-3 py-3 text-right font-mono tabular-nums text-altr-white">{formatUsd(p.amount_usd)}</td>
                          <td className={cn("px-3 py-3 text-right font-mono text-[10.5px] uppercase tracking-[0.18em]", STATUS_TONE[p.status])}>
                            {p.status}
                          </td>
                          <td className="px-3 py-3 text-[11.5px] leading-snug text-altr-mute">{p.note ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-md border border-altr-line2 bg-altr-black/40 px-4 py-3 text-[12px] text-altr-mute">
                  No vendor allocations configured for this milestone yet.
                </p>
              )}
            </article>
          );
        })}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/demo"
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to demo entry
        </Link>
        <Link
          href={`/demo/deals/${deal.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
        >
          See brand-facing settlement view
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function WalletSummary({
  deal,
  releasedToVendors,
  scheduledToVendors,
  uniqueVendors,
  unallocated,
}: {
  deal: ReturnType<typeof getDealById> & {};
  releasedToVendors: number;
  scheduledToVendors: number;
  uniqueVendors: number;
  unallocated: number;
}) {
  const releasedMilestones = deal.milestones.filter((m) => m.status === "released");
  const totalReceived = releasedMilestones.reduce((s, m) => s + m.amount, 0);
  const balance = totalReceived - releasedToVendors;

  return (
    <section
      aria-label="Event wallet"
      className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Stat
        label="Wallet balance"
        value={formatUsd(balance, { compact: true })}
        sub={`${deal.currency} on XRPL · received − paid out`}
        accent="lime"
      />
      <Stat
        label="Received from brand"
        value={formatUsd(totalReceived, { compact: true })}
        sub={`${releasedMilestones.length} of ${deal.milestones.length} milestones released`}
      />
      <Stat
        label="Paid out to vendors"
        value={formatUsd(releasedToVendors, { compact: true })}
        sub={`${uniqueVendors} unique vendors`}
      />
      <Stat
        label="Outstanding to vendors"
        value={formatUsd(scheduledToVendors, { compact: true })}
        sub={`+ ${formatUsd(Math.max(0, unallocated), { compact: true })} unallocated buffer`}
      />
    </section>
  );
}

function InflowsTable({ deal }: { deal: ReturnType<typeof getDealById> & {} }) {
  return (
    <section
      aria-label="Inflows"
      className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <ArrowDownLeft className="h-4 w-4 text-altr-lime" aria-hidden="true" />
          <Kbd>Inflows · escrow releases</Kbd>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {deal.milestones.filter((m) => m.status === "released").length} of {deal.milestones.length} released
        </span>
      </div>
      <div className="overflow-x-auto rounded-md border border-altr-line2">
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-altr-line2 bg-altr-black/40">
              <th className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Milestone</th>
              <th className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Trigger</th>
              <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Amount</th>
              <th className="px-3 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Status</th>
              <th className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">Released</th>
            </tr>
          </thead>
          <tbody>
            {deal.milestones.map((m) => {
              const tone =
                m.status === "released"
                  ? "text-altr-lime"
                  : m.status === "pending"
                    ? "text-altr-muteSoft"
                    : "text-altr-mute";
              return (
                <tr key={m.id} className="border-b border-altr-line2/60 last:border-0">
                  <td className="px-3 py-3 font-mono text-altr-white">{m.label}</td>
                  <td className="px-3 py-3 text-altr-muteSoft">{m.trigger}</td>
                  <td className={cn("px-3 py-3 text-right font-mono tabular-nums", m.status === "released" ? "text-altr-lime" : "text-altr-white")}>
                    + {formatUsd(m.amount)}
                  </td>
                  <td className={cn("px-3 py-3 text-right font-mono text-[10.5px] uppercase tracking-[0.18em]", tone)}>
                    {m.status}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-altr-mute">
                    {m.released_at ? new Date(m.released_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        Outflows to vendors broken down per milestone below
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "lime";
}) {
  return (
    <article
      className={cn(
        "rounded-lg border bg-altr-panel p-5",
        accent === "lime" ? "border-altr-lime/40" : "border-altr-line",
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
        {label}
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-[26px] font-medium leading-none tracking-tight tabular-nums",
          accent === "lime" ? "text-altr-lime" : "text-altr-white",
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-[11.5px] leading-snug text-altr-muteSoft">
        {sub}
      </div>
    </article>
  );
}
