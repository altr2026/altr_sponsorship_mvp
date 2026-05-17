import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import { getDealsByBrandId, type Deal } from "@/lib/mock-data/deals";
import {
  getRoiReportByDealId,
  type RoiReport,
} from "@/lib/mock-data/roi-reports";

type PageProps = {
  params: { brand_id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deals = getDealsByBrandId(params.brand_id);
  const brandName = deals[0]?.brand_name ?? "Brand";
  return {
    title: `${brandName} · Sponsor portfolio`,
    description: `Cumulative sponsor dashboard for ${brandName}. All-time POE history, cross-event ROI trends, and creator performance index across every ALTR-anchored deal.`,
    robots: { index: false, follow: false },
  };
}

type EnrichedDeal = {
  deal: Deal;
  roi: RoiReport | null;
};

type CreatorAggregate = {
  creator_id: string;
  creator_name: string;
  channel: string;
  appearances: number;
  weighted_emv: number; // EMV slice attributable to this creator across all deals
  weighted_pct_avg: number; // simple average contribution_pct across deals it appeared in
};

function aggregateCreators(enriched: EnrichedDeal[]): CreatorAggregate[] {
  const map = new Map<string, CreatorAggregate>();

  for (const { deal: _deal, roi } of enriched) {
    if (!roi) continue;
    for (const c of roi.creator_attribution) {
      const existing = map.get(c.creator_id);
      const slice = (roi.emv_usd * c.contribution_pct) / 100;
      if (existing) {
        existing.appearances += 1;
        existing.weighted_emv += slice;
        existing.weighted_pct_avg =
          (existing.weighted_pct_avg * (existing.appearances - 1) +
            c.contribution_pct) /
          existing.appearances;
      } else {
        map.set(c.creator_id, {
          creator_id: c.creator_id,
          creator_name: c.creator_name,
          channel: c.channel,
          appearances: 1,
          weighted_emv: slice,
          weighted_pct_avg: c.contribution_pct,
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => b.weighted_emv - a.weighted_emv);
}

function formatUsd(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  }
  return "$" + n.toLocaleString("en-US");
}

function formatNumber(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  }
  return n.toLocaleString("en-US");
}

export default function PortfolioDashboardPage({ params }: PageProps) {
  const deals = getDealsByBrandId(params.brand_id);
  if (deals.length === 0) notFound();

  const brandName = deals[0]?.brand_name ?? "Brand";

  // Sort newest deal first (chronological reverse order matches dashboard reading flow).
  const sortedDeals = [...deals].sort(
    (a, b) =>
      new Date(b.event_starts_at).getTime() -
      new Date(a.event_starts_at).getTime(),
  );

  const enriched: EnrichedDeal[] = sortedDeals.map((d) => ({
    deal: d,
    roi: getRoiReportByDealId(d.id) ?? null,
  }));

  const dealsWithRoi = enriched.filter((e): e is { deal: Deal; roi: RoiReport } =>
    Boolean(e.roi),
  );

  const totalDeals = enriched.length;
  const totalSpend = enriched.reduce((sum, e) => sum + e.deal.total_amount, 0);
  const totalEmv = dealsWithRoi.reduce((sum, e) => sum + e.roi.emv_usd, 0);
  const totalReach = dealsWithRoi.reduce((sum, e) => sum + e.roi.total_reach, 0);
  const avgRoi =
    dealsWithRoi.length > 0
      ? dealsWithRoi.reduce((sum, e) => sum + e.roi.roi_multiplier, 0) /
        dealsWithRoi.length
      : 0;

  const creators = aggregateCreators(enriched).slice(0, 6);
  const maxCreatorEmv = creators[0]?.weighted_emv ?? 1;

  // For the ROI trend bars, anchor to the max multiplier in the set so the
  // bars are comparable across deals.
  const maxMultiplier = Math.max(
    ...dealsWithRoi.map((e) => e.roi.roi_multiplier),
    1,
  );

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
          <Kbd>Phase 05 · Measurement</Kbd>
          <Kbd tone="mute">Step 15 · Sponsor portfolio</Kbd>
        </div>
        <h1 className="text-[26px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[34px]">
          {brandName} · Sponsor portfolio
        </h1>
        <p className="max-w-3xl font-mono text-[12px] text-altr-muteSoft">
          All-time POE history across every ALTR-anchored deal. Each row is a
          minted POE NFT — the immutable, machine-readable record this dashboard
          aggregates from.
        </p>
      </header>

      <section
        aria-label="Headline totals"
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <BigStat
          label="Deals settled"
          value={String(totalDeals)}
          sub={`${dealsWithRoi.length} with ROI reports`}
        />
        <BigStat
          label="Cumulative spend"
          value={formatUsd(totalSpend, { compact: true })}
          sub={`across ${totalDeals} deals`}
        />
        <BigStat
          label="Cumulative EMV"
          value={formatUsd(totalEmv, { compact: true })}
          sub={`vs ${formatUsd(totalSpend, { compact: true })} spend`}
          accent="lime"
        />
        <BigStat
          label="Avg ROI multiplier"
          value={`${avgRoi.toFixed(1)}×`}
          sub={`total reach ${formatNumber(totalReach, { compact: true })}`}
          accent="lime"
        />
      </section>

      <section
        aria-label="POE history"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>POE history</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              All-time POE NFTs
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              Each row anchors to one minted POE. Click through to see the
              full ROI report for that deal.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {totalDeals} deals · sorted newest first
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-altr-line2 text-altr-mute">
                <Th>Event</Th>
                <Th>Year</Th>
                <Th>Tier</Th>
                <Th className="text-right">Spend</Th>
                <Th className="text-right">EMV</Th>
                <Th className="text-right">ROI</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {enriched.map(({ deal, roi }, idx) => {
                const year = new Date(deal.event_starts_at).getUTCFullYear();
                return (
                  <tr
                    key={deal.id}
                    className={cn(
                      "border-b border-altr-line2/60 last:border-0",
                      idx === 0 && "bg-altr-lime/[0.04]",
                    )}
                  >
                    <Td>
                      <span className="font-medium text-altr-white">
                        {deal.event_name}
                      </span>
                      {idx === 0 ? (
                        <span className="ml-2 rounded border border-altr-lime/40 bg-altr-lime/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-lime">
                          Latest
                        </span>
                      ) : null}
                    </Td>
                    <Td mono>{year}</Td>
                    <Td mono>{deal.tier}</Td>
                    <Td mono className="text-right">
                      {formatUsd(deal.total_amount, { compact: true })}
                    </Td>
                    <Td mono className="text-right">
                      {roi ? formatUsd(roi.emv_usd, { compact: true }) : "—"}
                    </Td>
                    <Td mono className={cn("text-right", roi && "text-altr-lime")}>
                      {roi ? `${roi.roi_multiplier.toFixed(1)}×` : "—"}
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/demo/deals/${deal.id}/poe`}
                        className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
                      >
                        Open POE
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-label="ROI trend"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>ROI trend</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Cross-event multiplier over time
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              Bars normalized to the highest multiplier in the portfolio. Older
              deals on the left, newest on the right.
            </p>
          </div>
        </div>

        <ol className="space-y-4">
          {[...dealsWithRoi]
            .sort(
              (a, b) =>
                new Date(a.deal.event_starts_at).getTime() -
                new Date(b.deal.event_starts_at).getTime(),
            )
            .map((e) => {
              const year = new Date(e.deal.event_starts_at).getUTCFullYear();
              const widthPct = Math.max(
                4,
                (e.roi.roi_multiplier / maxMultiplier) * 100,
              );
              return (
                <li key={e.deal.id} className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12px]">
                    <div>
                      <span className="font-medium text-altr-white">
                        {e.deal.event_name}
                      </span>
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                        {e.deal.tier} · {year}
                      </span>
                    </div>
                    <span className="font-mono text-[14px] font-medium tabular-nums text-altr-lime">
                      {e.roi.roi_multiplier.toFixed(1)}×
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-altr-line2/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-altr-lime/70 to-altr-lime"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[10.5px] text-altr-mute">
                    <span>
                      {formatUsd(e.deal.total_amount, { compact: true })} spend →{" "}
                      {formatUsd(e.roi.emv_usd, { compact: true })} EMV
                    </span>
                    <span>{e.roi.benchmark_percentile}th pct vs cohort</span>
                  </div>
                </li>
              );
            })}
        </ol>
      </section>

      <section
        aria-label="Creator performance index"
        className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Kbd>Creator performance index</Kbd>
            <h2 className="mt-2 text-h2 font-medium text-altr-white">
              Who has driven the most attributable value
            </h2>
            <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
              Aggregated across every POE in the portfolio. Ranked by total
              weighted EMV slice.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Top {creators.length} of {countAllCreators(enriched)} contributors
          </span>
        </div>

        <ol className="space-y-3.5">
          {creators.map((c, i) => {
            const widthPct = Math.max(4, (c.weighted_emv / maxCreatorEmv) * 100);
            return (
              <li key={c.creator_id} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-medium text-altr-white">
                      {c.creator_name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                      {c.channel}
                    </span>
                    <span className="rounded border border-altr-line2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-muteSoft">
                      {c.appearances}× appearance{c.appearances === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[13.5px] font-medium tabular-nums text-altr-lime">
                      {formatUsd(c.weighted_emv, { compact: true })}
                    </div>
                    <div className="font-mono text-[10px] text-altr-mute">
                      avg {c.weighted_pct_avg.toFixed(0)}% / deal
                    </div>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-altr-line2/60">
                  <div
                    className="h-full rounded-full bg-altr-lime/80"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/demo"
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to demo entry
        </Link>
        <Link
          href={`/demo/deals/${sortedDeals[0].id}/renewal`}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
        >
          Continue to Step 16 (Renewal)
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function countAllCreators(enriched: EnrichedDeal[]): number {
  const set = new Set<string>();
  for (const e of enriched) {
    if (!e.roi) continue;
    for (const c of e.roi.creator_attribution) set.add(c.creator_id);
  }
  return set.size;
}

function BigStat({
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
          "mt-2 font-mono text-[30px] font-medium leading-none tracking-tight tabular-nums sm:text-[34px]",
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

function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-3 py-3 align-middle text-altr-muteSoft",
        mono && "font-mono tabular-nums text-altr-white",
        className,
      )}
    >
      {children}
    </td>
  );
}

