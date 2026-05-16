"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, ExternalLink, Loader2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type MintState =
  | { kind: "idle" }
  | { kind: "minting" }
  | { kind: "error"; message: string; ipfs_hash?: string; gateway_url?: string }
  | {
      kind: "done";
      ipfs_hash: string;
      gateway_url: string;
      tx_hash: string;
      nftoken_id?: string;
      explorer_url: string;
      issued_at: string;
    };

function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function PoeMintClient({ deal }: { deal: Deal }) {
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
        ipfs_hash: payload.ipfs_hash,
        gateway_url: payload.gateway_url,
        tx_hash: payload.tx_hash,
        nftoken_id: payload.nftoken_id,
        explorer_url: payload.explorer_url,
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

  const metadataPreview = {
    schema: "altr.poe.v1",
    name: `ALTR Proof of Engagement · ${deal.brand_name} × ${deal.event_name}`,
    description: `Cryptographic proof that ${deal.brand_name} sponsored ${deal.event_name} at the ${deal.tier} tier for ${formatUsd(deal.total_amount)} ${deal.currency}.`,
    deal: {
      id: deal.id,
      brand: deal.brand_name,
      event: deal.event_name,
      tier: deal.tier,
      total_amount_usd: deal.total_amount,
      currency: deal.currency,
      network: "xrpl-testnet",
    },
    milestones: deal.milestones.map((m) => ({
      label: m.label,
      trigger: m.trigger,
      amount_usd: m.amount,
      status: m.status,
    })),
  };

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
          <Kbd>Phase 05 · Measurement</Kbd>
          <Kbd tone="mute">Step 14 · NFTokenMint</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[30px]">
          Mint Proof of Engagement
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          Locks the {deal.brand_name} × {deal.event_name} sponsorship into a
          permanent record. Metadata is pinned to IPFS via Pinata, then an
          NFTokenMint transaction anchors the IPFS hash on XRPL. The token can
          only be minted once and never edited — POE history lives only inside
          ALTR.
        </p>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3">
            <Kbd>Deal summary</Kbd>
          </div>
          <ul className="space-y-2 text-[12px]">
            <Row label="Brand" value={deal.brand_name} />
            <Row label="Event" value={deal.event_name} />
            <Row label="Tier" value={deal.tier} />
            <Row label="Total settled" value={`${formatUsd(deal.total_amount)} ${deal.currency}`} />
            <Row label="Escrow" value={shorten(deal.escrow_address)} mono />
            <Row label="Escrow tx" value={shorten(deal.xrpl_tx_hash)} mono />
            <Row label="Milestones" value={`${deal.milestones.length} (4/4 settled)`} />
            <Row label="Settlement network" value="XRPL testnet" />
          </ul>
        </article>

        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <Kbd>Metadata preview</Kbd>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
              Pinned to IPFS as JSON
            </span>
          </div>
          <pre className="max-h-[280px] overflow-auto rounded-md border border-altr-line2 bg-altr-black p-3 font-mono text-[10.5px] leading-relaxed text-altr-muteSoft">
            {JSON.stringify(metadataPreview, null, 2)}
          </pre>
          <p className="mt-3 text-[11px] text-altr-mute">
            Server adds the issued_at timestamp, full attributes block, and the
            external_url back to this deal before pinning.
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <Kbd>Mint Proof of Engagement</Kbd>
            <p className="text-[12.5px] text-altr-muteSoft">
              One transaction. The hot wallet signs an NFTokenMint with URI =
              ipfs://&lt;hash&gt;, NFTokenTaxon 0, tfTransferable flag.
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
                Pinning + minting…
              </>
            ) : isDone ? (
              <>
                <Check className="h-4 w-4" />
                Minted
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultCard label="IPFS hash" value={state.ipfs_hash} link={state.gateway_url} linkLabel="Open gateway" />
            <ResultCard label="NFTokenID" value={state.nftoken_id ?? "—"} />
            <ResultCard label="XRPL tx hash" value={shorten(state.tx_hash, 10, 8)} link={state.explorer_url} linkLabel="Open in explorer" />
            <ResultCard label="Issued at" value={new Date(state.issued_at).toLocaleString()} />
          </div>
        ) : null}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/demo/deals/${deal.id}`}
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to settlement
        </Link>
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
}: {
  label: string;
  value: string;
  link?: string;
  linkLabel?: string;
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
      <div className="mt-1 break-all font-mono text-[11.5px] text-altr-white">{value}</div>
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
