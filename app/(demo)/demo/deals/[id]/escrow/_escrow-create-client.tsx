"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, ExternalLink, Loader2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type CreateState =
  | { kind: "idle" }
  | { kind: "creating" }
  | { kind: "error"; message: string }
  | {
      kind: "done";
      tx_hash: string;
      escrow_owner: string;
      escrow_sequence: number;
      destination: string;
      amount_xrp: number;
      amount_drops: string;
      finish_after_iso: string;
      cancel_after_iso: string;
      explorer_url: string;
    };

const DEMO_AMOUNT_XRP = 10;

function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function EscrowCreateClient({ deal }: { deal: Deal }) {
  const [state, setState] = useState<CreateState>({ kind: "idle" });

  async function create() {
    setState({ kind: "creating" });
    try {
      const response = await fetch("/api/demo/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id, amount_xrp: DEMO_AMOUNT_XRP }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setState({
          kind: "error",
          message: payload?.error ?? `EscrowCreate failed (HTTP ${response.status}).`,
        });
        return;
      }
      setState({ kind: "done", ...payload });
    } catch (caught) {
      setState({
        kind: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Network error contacting the escrow route.",
      });
    }
  }

  const isCreating = state.kind === "creating";
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
          <Kbd>Phase 03 · Settle</Kbd>
          <Kbd tone="mute">Step 08 · EscrowCreate</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[30px]">
          Create escrow on XRPL
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          Brand wallet signs an EscrowCreate. Funds lock on-chain immediately,
          unlock after the FinishAfter timestamp, and revert if not released
          before CancelAfter. ALTR never custodies the money — the brand pays
          the event directly through the ledger.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-altr-line2 bg-altr-panel/60 p-4 text-[11.5px] leading-snug text-altr-muteSoft">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
          Testnet demo · honest disclosure
        </span>
        <p className="mt-1.5">
          This flow escrows {DEMO_AMOUNT_XRP} testnet XRP as a stand-in for
          the {formatUsd(deal.total_amount)} {deal.currency} headline figure.
          The deal narrative still talks RLUSD; the on-chain demo uses XRP
          because EscrowCreate on the public testnet supports XRP natively.
          Production uses the TokenEscrow amendment to escrow RLUSD directly.
        </p>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3">
            <Kbd>Deal summary</Kbd>
          </div>
          <ul className="space-y-2 text-[12px]">
            <Row label="Brand" value={deal.brand_name} />
            <Row label="Event" value={deal.event_name} />
            <Row label="Tier" value={deal.tier} />
            <Row label="Total (headline)" value={`${formatUsd(deal.total_amount)} ${deal.currency}`} />
            <Row label="Network" value="XRPL testnet" />
          </ul>
        </article>

        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <Kbd>EscrowCreate parameters</Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Signed by hot wallet
            </span>
          </div>
          <ul className="space-y-2 text-[12px]">
            <Row label="Amount" value={`${DEMO_AMOUNT_XRP} XRP`} mono />
            <Row label="FinishAfter" value="now + 60s" mono />
            <Row label="CancelAfter" value="now + 30 days" mono />
            <Row label="Condition" value="(none — time-only release)" mono />
          </ul>
          <p className="mt-3 text-[11px] text-altr-mute">
            The hot wallet signs as the brand. Destination is the event wallet
            from <code className="font-mono">NEXT_PUBLIC_XRPL_TESTNET_ADDRESS</code>.
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <Kbd>Submit EscrowCreate</Kbd>
            <p className="text-[12.5px] text-altr-muteSoft">
              One transaction. submitAndWait blocks until the ledger validates
              — usually within 4 seconds on testnet.
            </p>
          </div>
          <button
            type="button"
            onClick={create}
            disabled={isCreating || isDone}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
              !isCreating && !isDone &&
                "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
              isCreating && "bg-altr-lime/30 text-altr-lime",
              isDone && "bg-teal-600/20 text-teal-400",
            )}
            style={
              !isCreating && !isDone
                ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                : undefined
            }
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : isDone ? (
              <>
                <Check className="h-4 w-4" />
                Escrow created
              </>
            ) : (
              <>
                Create escrow on XRPL
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {isError ? (
          <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
              EscrowCreate failed
            </div>
            <div className="mt-1 leading-snug">{state.message}</div>
          </div>
        ) : null}

        {isDone ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultCard label="XRPL tx hash" value={shorten(state.tx_hash, 10, 8)} link={state.explorer_url} linkLabel="Open in explorer" />
            <ResultCard label="Escrow owner" value={shorten(state.escrow_owner)} mono />
            <ResultCard label="Escrow sequence" value={String(state.escrow_sequence)} mono />
            <ResultCard label="Destination" value={shorten(state.destination)} mono />
            <ResultCard label="Amount locked" value={`${state.amount_xrp} XRP (${state.amount_drops} drops)`} mono />
            <ResultCard label="FinishAfter" value={new Date(state.finish_after_iso).toLocaleString()} />
            <ResultCard label="CancelAfter" value={new Date(state.cancel_after_iso).toLocaleString()} />
          </div>
        ) : null}
      </section>

      {isDone ? (
        <div className="mt-6 rounded-md border border-altr-line2 bg-altr-panel/60 p-4 text-[12px] leading-snug text-altr-muteSoft">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
            What&apos;s next
          </span>
          <p className="mt-1.5">
            After the FinishAfter timestamp passes, anyone can submit
            EscrowFinish with the owner + sequence to release the funds to the
            destination. That&apos;s Step 12 in the demo — coming next.
          </p>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/demo/deals/${deal.id}`}
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to settlement
        </Link>
        {isDone ? (
          <Link
            href={`/demo/deals/${deal.id}/poe`}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
          >
            Continue to Step 14 (POE mint)
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-altr-line2/60 pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </span>
      <span className={cn("text-right text-altr-white", mono && "font-mono text-[11px]")}>
        {value}
      </span>
    </li>
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
      <div className={cn("mt-1 break-all text-[11.5px] text-altr-white", mono && "font-mono")}>{value}</div>
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
