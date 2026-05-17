"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  TrendingUp,
} from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";
import type { RoiReport } from "@/lib/mock-data/roi-reports";

type MetadataSource = "pinata" | "altr-fallback";

type MintState =
  | { kind: "idle" }
  | { kind: "minting" }
  | { kind: "error"; message: string; ipfs_hash?: string | null; gateway_url?: string | null }
  | {
      kind: "done";
      metadata_source: MetadataSource;
      metadata_url: string;
      ipfs_hash: string | null;
      gateway_url: string | null;
      tx_hash: string;
      nftoken_id?: string;
      explorer_url: string;
      issuer_address: string;
      wallet_auto_funded: boolean;
      issued_at: string;
    };

function formatUsd(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  }
  return "$" + n.toLocaleString("en-US");
}

function formatNumber(n: number, opts: { compact?: boolean } = {}) {
  if (opts.compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toLocaleString("en-US");
}

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function PoeMintClient({
  deal,
  roi,
}: {
  deal: Deal;
  roi: RoiReport | null;
}) {
  const [state, setState] = useState<MintState>({ kind: "idle" });

  async function mint() {
    setState({ kind: "minting" });
    try {
      const response = await fetch("/api/demo/poe/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setState({
          kind: "error",
          message: payload?.error ?? `Mint failed (HTTP ${response.status}).`,
          ipfs_hash: payload?.ipfs_hash,
          gateway_url: payload?.gateway_url,
        });
        return;
      }
      setState({
        kind: "done",
        metadata_source: payload.metadata_source ?? "altr-fallback",
        metadata_url: payload.metadata_url,
        ipfs_hash: payload.ipfs_hash ?? null,
        gateway_url: payload.gateway_url ?? null,
        tx_hash: payload.tx_hash,
        nftoken_id: payload.nftoken_id,
        explorer_url: payload.explorer_url,
        issuer_address: payload.issuer_address ?? "",
        wallet_auto_funded: Boolean(payload.wallet_auto_funded),
        issued_at: payload.issued_at,
      });
    } catch (caught) {
      setState({
        kind: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Network error contacting the mint route.",
      });
    }
  }

  const isMinting = state.kind === "minting";
  const isDone = state.kind === "done";
  const isError = state.kind === "error";

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-10 md:py-10">
      <Link
        href={`/demo/deals/${deal.id}`}
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute transition-colors hover:text-altr-white"
      >
        ← Back to settlement
      </Link>

      <header className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>Phase 04 · Measurement</Kbd>
          <Kbd tone="mute">Step 13 · ROI report</Kbd>
          <Kbd tone="mute">Step 14 · POE NFT</Kbd>
        </div>
        <h1 className="text-[26px] font-medium leading-[1.1] tracking-tight text-altr-white sm:text-[34px]">
          Post-event ROI report
        </h1>
        <p className="font-mono text-[12px] text-altr-muteSoft">
          {deal.brand_name} × {deal.event_name} ·{" "}
          {roi
            ? new Date(roi.period_start).toLocaleDateString() +
              " → " +
              new Date(roi.period_end).toLocaleDateString()
            : new Date(deal.event_starts_at).toLocaleDateString()}
        </p>
      </header>

      {roi ? (
        <>
          <section
            aria-label="Headline ROI metrics"
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <BigStat
              label="Total reach"
              value={formatNumber(roi.total_reach, { compact: true })}
              sub="unique people exposed"
            />
            <BigStat
              label="Total impressions"
              value={formatNumber(roi.total_impressions, { compact: true })}
              sub="across all channels"
            />
            <BigStat
              label="EMV"
              value={formatUsd(roi.emv_usd, { compact: true })}
              sub={`Equivalent Media Value · vs ${formatUsd(roi.spend_usd, { compact: true })} spend`}
              accent="lime"
            />
            <BigStat
              label="ROI multiplier"
              value={`${roi.roi_multiplier.toFixed(1)}×`}
              sub={`${roi.benchmark_percentile}th pct · cohort median ${roi.benchmark_median_roi_multiplier}×`}
              accent="lime"
            />
          </section>

          <section
            aria-label="Performance summary"
            className="mt-5 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <TrendingUp
                className="mt-0.5 h-5 w-5 shrink-0 text-altr-lime"
                aria-hidden="true"
              />
              <div className="space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-lime">
                  Summary
                </div>
                <p className="text-[13.5px] leading-relaxed text-altr-white">
                  {roi.ai_summary}
                </p>
              </div>
            </div>
          </section>

          <section
            aria-label="Creator attribution"
            className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <Kbd>Creator attribution</Kbd>
                <h2 className="mt-2 text-h2 font-medium text-altr-white">
                  Where the reach came from
                </h2>
                <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
                  Per-creator share of attributable reach. UTM + on-site
                  intercept + survey-weighted.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                {roi.creator_attribution.length} contributors
              </span>
            </div>

            <ul className="space-y-3.5">
              {roi.creator_attribution.map((c) => (
                <li key={c.creator_id} className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="text-[13px] font-medium text-altr-white">
                        {c.creator_name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                        {c.channel}
                      </span>
                    </div>
                    <span className="font-mono text-[14px] font-medium tabular-nums text-altr-lime">
                      {c.contribution_pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-altr-line2/60">
                    <div
                      className="h-full rounded-full bg-altr-lime/80"
                      style={{ width: `${Math.min(100, c.contribution_pct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Channel breakdown"
            className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <Kbd>Channel breakdown</Kbd>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Source data · activation telemetry
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {roi.channel_breakdown.map((c) => (
                <article
                  key={c.channel}
                  className="rounded-md border border-altr-line2 bg-altr-black p-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                    {c.channel}
                  </div>
                  <div className="mt-1.5 font-mono text-[16px] font-medium text-altr-white">
                    {c.metric}
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-altr-muteSoft">
                    {c.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-label="Benchmark"
            className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
          >
            <div className="mb-4">
              <Kbd>Benchmark vs similar events</Kbd>
              <h2 className="mt-2 text-h2 font-medium text-altr-white">
                {roi.benchmark_percentile}th percentile vs the cohort
              </h2>
              <p className="mt-1 font-mono text-[11.5px] text-altr-mute">
                Cohort: {roi.benchmark_cohort} ·{" "}
                {roi.benchmark_cohort_size} comparable deals · last 18 months
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <BenchRow
                label="EMV"
                deal={formatUsd(roi.emv_usd, { compact: true })}
                cohort={formatUsd(roi.benchmark_median_emv_usd, { compact: true })}
                delta={`+${Math.round(((roi.emv_usd - roi.benchmark_median_emv_usd) / roi.benchmark_median_emv_usd) * 100)}%`}
                positive
              />
              <BenchRow
                label="ROI multiplier"
                deal={`${roi.roi_multiplier.toFixed(1)}×`}
                cohort={`${roi.benchmark_median_roi_multiplier.toFixed(1)}×`}
                delta={`+${(roi.roi_multiplier - roi.benchmark_median_roi_multiplier).toFixed(1)}×`}
                positive
              />
              <BenchRow
                label="Percentile rank"
                deal={`${roi.benchmark_percentile}th`}
                cohort="50th"
                delta={`+${roi.benchmark_percentile - 50} pts`}
                positive
              />
            </div>
          </section>
        </>
      ) : (
        <section className="mt-8 rounded-lg border border-amber-400/30 bg-amber-400/5 p-5 sm:p-6 text-[12px] text-altr-muteSoft">
          <Kbd tone="mute">ROI report not available</Kbd>
          <p className="mt-2">
            No ROI report has been generated for this deal yet. The Step 14
            POE mint below will still anchor the deal record on-chain, but
            without the ROI metrics block.
          </p>
        </section>
      )}

      <section
        aria-label="Anchor on chain"
        className={cn(
          "mt-8 rounded-lg border p-5 sm:p-6",
          isDone
            ? "border-teal-500/30 bg-teal-600/5"
            : "border-altr-line bg-altr-panel",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <Kbd>Step 14 · Lock this report permanently</Kbd>
            <h2 className="text-h2 font-medium text-altr-white">
              Lock this report. Build your track record.
            </h2>
            <p className="text-[12.5px] text-altr-muteSoft">
              Saves the full report — headline reach, creator credit, channel
              breakdown, benchmarks, milestones — as a permanent receipt
              neither side can edit. Each report you bank here grows your
              event&apos;s verified track record: sponsors use it to price
              renewals, and ALTR uses it to recommend larger packages next
              year.
            </p>
          </div>
          <button
            type="button"
            onClick={mint}
            disabled={isMinting || isDone}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
              !isMinting && !isDone &&
                "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
              isMinting && "bg-altr-lime/30 text-altr-lime",
              isDone && "bg-teal-600/20 text-teal-400",
            )}
            style={
              !isMinting && !isDone
                ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                : undefined
            }
          >
            {isMinting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving report…
              </>
            ) : isDone ? (
              <>
                <Check className="h-4 w-4" />
                Locked
              </>
            ) : (
              <>
                Mint POE NFT
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {isError ? (
          <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
              Mint failed
            </div>
            <div className="mt-1 leading-snug">{state.message}</div>
            {state.ipfs_hash ? (
              <div className="mt-2 font-mono text-[10.5px] text-red-300/80">
                Metadata was pinned: ipfs://{shorten(state.ipfs_hash)}
              </div>
            ) : null}
          </div>
        ) : null}

        {isDone ? (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
              {state.metadata_source === "pinata" ? (
                <span className="rounded border border-altr-lime/40 bg-altr-lime/10 px-2 py-0.5 text-altr-lime">
                  Metadata pinned to IPFS (Pinata)
                </span>
              ) : (
                <span className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-amber-300">
                  Metadata served from ALTR · set PINATA_JWT for real IPFS pin
                </span>
              )}
              {state.wallet_auto_funded ? (
                <span className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-amber-300">
                  Auto-funded testnet wallet · set XRPL_HOT_WALLET_SEED for persistence
                </span>
              ) : (
                <span className="rounded border border-altr-lime/40 bg-altr-lime/10 px-2 py-0.5 text-altr-lime">
                  Signed by configured XRPL_HOT_WALLET_SEED
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ResultCard
                label={state.metadata_source === "pinata" ? "IPFS hash" : "Metadata URI"}
                value={state.metadata_source === "pinata" ? (state.ipfs_hash ?? "—") : state.metadata_url}
                link={state.gateway_url ?? (state.metadata_source === "altr-fallback" ? state.metadata_url : undefined)}
                linkLabel={state.metadata_source === "pinata" ? "Open gateway" : "Open metadata"}
              />
              <ResultCard
                label="NFTokenID"
                value={state.nftoken_id ?? "—"}
                mono
              />
              <ResultCard
                label="XRPL tx hash"
                value={shorten(state.tx_hash, 10, 8)}
                link={state.explorer_url}
                linkLabel="Open in explorer"
                mono
              />
              <ResultCard
                label="Anchored at"
                value={new Date(state.issued_at).toLocaleString()}
              />
            </div>
          </>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/demo/deals/${deal.id}`}
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to settlement
        </Link>
        <Link
          href={`/demo/dashboard/${deal.brand_id}`}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
        >
          View {deal.brand_name} portfolio (Step 15)
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
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
        accent === "lime"
          ? "border-altr-lime/40"
          : "border-altr-line",
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
        {label}
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-[32px] font-medium leading-none tracking-tight tabular-nums sm:text-[36px]",
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

function BenchRow({
  label,
  deal,
  cohort,
  delta,
  positive,
}: {
  label: string;
  deal: string;
  cohort: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-md border border-altr-line2 bg-altr-black p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono text-[20px] font-medium tabular-nums text-altr-white">
          {deal}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-altr-mute">
          vs {cohort}
        </span>
      </div>
      <div
        className={cn(
          "mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em]",
          positive ? "text-altr-lime" : "text-red-300",
        )}
      >
        {delta}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  link,
  linkLabel,
  mono,
}: {
  label: string;
  value: string;
  link?: string;
  linkLabel?: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard unavailable in some sandboxes; ignore.
    }
  }

  return (
    <div className="rounded-md border border-altr-line2 bg-altr-black p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-muteSoft transition-colors hover:text-altr-lime"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className={cn(
          "mt-1 break-all text-[11.5px] text-altr-white",
          mono && "font-mono",
        )}
      >
        {value}
      </div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
        >
          {linkLabel ?? "Open"}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
    </div>
  );
}
