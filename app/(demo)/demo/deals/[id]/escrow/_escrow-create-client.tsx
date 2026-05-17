"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Copy, ExternalLink, Loader2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type CreatedEscrow = {
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

type CreateState =
  | { kind: "idle" }
  | { kind: "creating" }
  | { kind: "error"; message: string }
  | ({ kind: "done" } & CreatedEscrow);

type FinishState =
  | { kind: "idle" }
  | { kind: "finishing" }
  | { kind: "error"; message: string }
  | {
      kind: "done";
      tx_hash: string;
      explorer_url: string;
      executor: string;
      finished_at: string;
    };

const DEMO_AMOUNT_XRP = 10;

function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function readEscrowFromParams(
  params: URLSearchParams,
): CreatedEscrow | null {
  const tx = params.get("create_tx");
  const owner = params.get("owner");
  const sequenceRaw = params.get("sequence");
  const destination = params.get("destination");
  const amountXrpRaw = params.get("amount_xrp");
  const amountDrops = params.get("amount_drops");
  const finishAfter = params.get("finish_after");
  const cancelAfter = params.get("cancel_after");

  if (
    !tx ||
    !owner ||
    !sequenceRaw ||
    !destination ||
    !amountXrpRaw ||
    !amountDrops ||
    !finishAfter ||
    !cancelAfter
  ) {
    return null;
  }

  const sequence = Number(sequenceRaw);
  const amountXrp = Number(amountXrpRaw);
  if (!Number.isFinite(sequence) || !Number.isFinite(amountXrp)) return null;

  return {
    tx_hash: tx,
    escrow_owner: owner,
    escrow_sequence: sequence,
    destination,
    amount_xrp: amountXrp,
    amount_drops: amountDrops,
    finish_after_iso: finishAfter,
    cancel_after_iso: cancelAfter,
    explorer_url: `https://testnet.xrpl.org/transactions/${tx}`,
  };
}

function buildEscrowParams(e: CreatedEscrow): URLSearchParams {
  const p = new URLSearchParams();
  p.set("create_tx", e.tx_hash);
  p.set("owner", e.escrow_owner);
  p.set("sequence", String(e.escrow_sequence));
  p.set("destination", e.destination);
  p.set("amount_xrp", String(e.amount_xrp));
  p.set("amount_drops", e.amount_drops);
  p.set("finish_after", e.finish_after_iso);
  p.set("cancel_after", e.cancel_after_iso);
  return p;
}

export function EscrowCreateClient({ deal }: { deal: Deal }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [createState, setCreateState] = useState<CreateState>({ kind: "idle" });
  const [finishState, setFinishState] = useState<FinishState>({ kind: "idle" });
  const [now, setNow] = useState(() => Date.now());
  const hydratedRef = useRef(false);

  // Hydrate from URL on first render so reload / shared-URL works.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const restored = readEscrowFromParams(searchParams);
    if (restored) {
      setCreateState({ kind: "done", ...restored });
    }
  }, [searchParams]);

  // Tick every second so the countdown re-renders.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const create = useCallback(async () => {
    setCreateState({ kind: "creating" });
    setFinishState({ kind: "idle" });
    try {
      const response = await fetch("/api/demo/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id, amount_xrp: DEMO_AMOUNT_XRP }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setCreateState({
          kind: "error",
          message: payload?.error ?? `EscrowCreate failed (HTTP ${response.status}).`,
        });
        return;
      }
      const escrow: CreatedEscrow = {
        tx_hash: payload.tx_hash,
        escrow_owner: payload.escrow_owner,
        escrow_sequence: payload.escrow_sequence,
        destination: payload.destination,
        amount_xrp: payload.amount_xrp,
        amount_drops: payload.amount_drops,
        finish_after_iso: payload.finish_after_iso,
        cancel_after_iso: payload.cancel_after_iso,
        explorer_url: payload.explorer_url,
      };
      setCreateState({ kind: "done", ...escrow });
      router.replace(
        `/demo/deals/${deal.id}/escrow?${buildEscrowParams(escrow).toString()}`,
        { scroll: false },
      );
    } catch (caught) {
      setCreateState({
        kind: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Network error contacting the escrow route.",
      });
    }
  }, [deal.id, router]);

  const finish = useCallback(async () => {
    if (createState.kind !== "done") return;
    setFinishState({ kind: "finishing" });
    try {
      const response = await fetch("/api/demo/escrow/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: createState.escrow_owner,
          offer_sequence: createState.escrow_sequence,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setFinishState({
          kind: "error",
          message: payload?.error ?? `EscrowFinish failed (HTTP ${response.status}).`,
        });
        return;
      }
      setFinishState({
        kind: "done",
        tx_hash: payload.tx_hash,
        explorer_url: payload.explorer_url,
        executor: payload.executor,
        finished_at: payload.finished_at,
      });
    } catch (caught) {
      setFinishState({
        kind: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Network error contacting the finish route.",
      });
    }
  }, [createState]);

  const isCreating = createState.kind === "creating";
  const createDone = createState.kind === "done";
  const createError = createState.kind === "error";

  const finishAfterMs =
    createDone ? new Date(createState.finish_after_iso).getTime() : null;
  const secondsToFinish =
    finishAfterMs !== null ? Math.max(0, Math.ceil((finishAfterMs - now) / 1000)) : null;
  const finishReady = finishAfterMs !== null && finishAfterMs - now <= 0;

  const finishing = finishState.kind === "finishing";
  const finishDone = finishState.kind === "done";
  const finishError = finishState.kind === "error";

  const countdownLabel = useMemo(() => {
    if (secondsToFinish === null) return null;
    if (secondsToFinish <= 0) return "Ready to release";
    const m = Math.floor(secondsToFinish / 60);
    const s = secondsToFinish % 60;
    return `Releases in ${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsToFinish]);

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
          <Kbd>Phase 03 · Settlement</Kbd>
          <Kbd tone="mute">Step 08 · EscrowCreate</Kbd>
          <Kbd tone="mute">Step 12 · EscrowFinish</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[30px]">
          Escrow on XRPL · create then finish
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          Two transactions, one page. Brand wallet signs EscrowCreate to lock
          funds. After the FinishAfter timestamp passes, anyone can submit
          EscrowFinish — the funds release atomically to the event wallet.
          ALTR never custodies the money.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-altr-line2 bg-altr-panel/60 p-4 text-[11.5px] leading-snug text-altr-muteSoft">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
          Testnet demo · honest disclosure
        </span>
        <p className="mt-1.5">
          This flow escrows {DEMO_AMOUNT_XRP} testnet XRP as a stand-in for
          the {formatUsd(deal.total_amount)} {deal.currency} headline figure.
          Production uses the TokenEscrow amendment to escrow {deal.currency} directly.
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
            <Kbd>Step 1 · Submit EscrowCreate</Kbd>
            <p className="text-[12.5px] text-altr-muteSoft">
              One transaction. submitAndWait blocks until the ledger validates
              — usually within 4 seconds on testnet.
            </p>
          </div>
          <button
            type="button"
            onClick={create}
            disabled={isCreating || createDone}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
              !isCreating && !createDone &&
                "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
              isCreating && "bg-altr-lime/30 text-altr-lime",
              createDone && "bg-teal-600/20 text-teal-400",
            )}
            style={
              !isCreating && !createDone
                ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                : undefined
            }
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : createDone ? (
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

        {createError ? (
          <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
              EscrowCreate failed
            </div>
            <div className="mt-1 leading-snug">{createState.message}</div>
          </div>
        ) : null}

        {createDone ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultCard label="XRPL tx hash" value={shorten(createState.tx_hash, 10, 8)} link={createState.explorer_url} linkLabel="Open in explorer" />
            <ResultCard label="Escrow owner" value={shorten(createState.escrow_owner)} mono />
            <ResultCard label="Escrow sequence" value={String(createState.escrow_sequence)} mono />
            <ResultCard label="Destination" value={shorten(createState.destination)} mono />
            <ResultCard label="Amount locked" value={`${createState.amount_xrp} XRP (${createState.amount_drops} drops)`} mono />
            <ResultCard label="FinishAfter" value={new Date(createState.finish_after_iso).toLocaleString()} />
            <ResultCard label="CancelAfter" value={new Date(createState.cancel_after_iso).toLocaleString()} />
          </div>
        ) : null}
      </section>

      {createDone ? (
        <section
          className={cn(
            "mt-6 rounded-lg border p-5 sm:p-6",
            finishDone
              ? "border-teal-500/30 bg-teal-600/5"
              : "border-altr-lime/30 bg-altr-lime/5",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <Kbd>Step 2 · Submit EscrowFinish</Kbd>
              <p className="text-[12.5px] text-altr-muteSoft">
                Once the FinishAfter timestamp passes, anyone can release the
                funds. The hot wallet does it here for the demo; in production
                this is usually the destination wallet.
              </p>
              {countdownLabel ? (
                <p
                  className={cn(
                    "mt-2 font-mono text-[12px] uppercase tracking-[0.22em]",
                    finishReady ? "text-altr-lime" : "text-altr-muteSoft",
                  )}
                >
                  {finishReady ? "● " : "○ "}
                  {countdownLabel}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={finish}
              disabled={!finishReady || finishing || finishDone}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                !finishReady && !finishDone &&
                  "cursor-not-allowed border border-altr-line2 bg-altr-black/40 text-altr-mute",
                finishReady && !finishing && !finishDone &&
                  "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
                finishing && "bg-altr-lime/30 text-altr-lime",
                finishDone && "bg-teal-600/20 text-teal-400",
              )}
              style={
                finishReady && !finishing && !finishDone
                  ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                  : undefined
              }
            >
              {finishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Releasing…
                </>
              ) : finishDone ? (
                <>
                  <Check className="h-4 w-4" />
                  Released
                </>
              ) : (
                <>
                  Release escrow
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {finishError ? (
            <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
                EscrowFinish failed
              </div>
              <div className="mt-1 leading-snug">{finishState.message}</div>
            </div>
          ) : null}

          {finishDone ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ResultCard label="Finish tx hash" value={shorten(finishState.tx_hash, 10, 8)} link={finishState.explorer_url} linkLabel="Open in explorer" />
              <ResultCard label="Executor" value={shorten(finishState.executor)} mono />
              <ResultCard label="Released at" value={new Date(finishState.finished_at).toLocaleString()} />
            </div>
          ) : null}
        </section>
      ) : null}

      {finishDone ? (
        <div className="mt-6 rounded-md border border-altr-line2 bg-altr-panel/60 p-4 text-[12px] leading-snug text-altr-muteSoft">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
            What&apos;s next
          </span>
          <p className="mt-1.5">
            Funds are now on the event wallet. The next demo moment is Step 14
            — minting a permanent Proof of Engagement NFT that anchors the
            deal record on XRPL with metadata pinned to IPFS.
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
        {finishDone ? (
          <Link
            href={`/demo/deals/${deal.id}/poe`}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
          >
            Continue to Step 14 (POE mint)
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : createDone ? (
          <Link
            href={`/demo/deals/${deal.id}/poe`}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
          >
            Skip ahead to POE mint
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
