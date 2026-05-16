"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Minus,
  X,
} from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type DeliverableStatus = "delivered" | "partial" | "missed";

type DeliverableRow = {
  label: string;
  status: DeliverableStatus;
  note: string;
};

type PinnedProof = {
  ipfs_hash: string;
  gateway_url: string;
  pinned_at: string;
  total_count: number;
  delivered_count: number;
  partial_count: number;
  missed_count: number;
};

type PinState =
  | { kind: "idle" }
  | { kind: "pinning" }
  | { kind: "error"; message: string }
  | ({ kind: "done" } & PinnedProof);

type ActivationClientProps = {
  deal: Deal;
  deliverables: string[];
  eventLocation: string | null;
};

const STATUS_OPTIONS: Array<{
  value: DeliverableStatus;
  label: string;
  tone: "lime" | "amber" | "red";
}> = [
  { value: "delivered", label: "Delivered", tone: "lime" },
  { value: "partial", label: "Partial", tone: "amber" },
  { value: "missed", label: "Missed", tone: "red" },
];

function shorten(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function statusToneClasses(active: boolean, tone: "lime" | "amber" | "red") {
  if (!active) {
    return "border-altr-line2 text-altr-mute hover:border-altr-mute hover:text-altr-muteSoft";
  }
  if (tone === "lime") return "border-altr-lime bg-altr-lime/15 text-altr-lime";
  if (tone === "amber") return "border-amber-400 bg-amber-400/10 text-amber-300";
  return "border-red-400 bg-red-400/10 text-red-300";
}

function readPinFromParams(params: URLSearchParams): PinnedProof | null {
  const ipfs = params.get("proof_hash");
  const gateway = params.get("proof_gateway");
  const pinnedAt = params.get("proof_pinned");
  const totalRaw = params.get("proof_total");
  const deliveredRaw = params.get("proof_delivered");
  const partialRaw = params.get("proof_partial");
  const missedRaw = params.get("proof_missed");
  if (!ipfs || !gateway || !pinnedAt) return null;
  return {
    ipfs_hash: ipfs,
    gateway_url: gateway,
    pinned_at: pinnedAt,
    total_count: Number(totalRaw ?? "0"),
    delivered_count: Number(deliveredRaw ?? "0"),
    partial_count: Number(partialRaw ?? "0"),
    missed_count: Number(missedRaw ?? "0"),
  };
}

function buildPinParams(briefApproved: boolean, pin: PinnedProof | null): URLSearchParams {
  const p = new URLSearchParams();
  if (briefApproved) p.set("brief", "approved");
  if (pin) {
    p.set("proof_hash", pin.ipfs_hash);
    p.set("proof_gateway", pin.gateway_url);
    p.set("proof_pinned", pin.pinned_at);
    p.set("proof_total", String(pin.total_count));
    p.set("proof_delivered", String(pin.delivered_count));
    p.set("proof_partial", String(pin.partial_count));
    p.set("proof_missed", String(pin.missed_count));
  }
  return p;
}

export function ActivationClient({
  deal,
  deliverables,
  eventLocation,
}: ActivationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [briefApproved, setBriefApproved] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);
  const [rows, setRows] = useState<DeliverableRow[]>(() =>
    deliverables.map((label) => ({
      label,
      status: "delivered",
      note: "",
    })),
  );
  const [pinState, setPinState] = useState<PinState>({ kind: "idle" });
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (searchParams.get("brief") === "approved") {
      setBriefApproved(true);
      setApprovedAt((prev) => prev ?? new Date().toISOString());
    }
    const restored = readPinFromParams(searchParams);
    if (restored) {
      setPinState({ kind: "done", ...restored });
      setBriefApproved(true);
    }
  }, [searchParams]);

  const approveBrief = useCallback(() => {
    const ts = new Date().toISOString();
    setBriefApproved(true);
    setApprovedAt(ts);
    router.replace(
      `/demo/deals/${deal.id}/activation?${buildPinParams(true, null).toString()}`,
      { scroll: false },
    );
  }, [deal.id, router]);

  const updateRow = useCallback(
    (index: number, patch: Partial<DeliverableRow>) => {
      setRows((current) =>
        current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
      );
    },
    [],
  );

  const pinProof = useCallback(async () => {
    setPinState({ kind: "pinning" });
    try {
      const response = await fetch("/api/demo/activation/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          deliverables: rows.map((row) => ({
            label: row.label,
            status: row.status,
            note: row.note.trim() || undefined,
          })),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setPinState({
          kind: "error",
          message: payload?.error ?? `Pin failed (HTTP ${response.status}).`,
        });
        return;
      }
      const pinned: PinnedProof = {
        ipfs_hash: payload.ipfs_hash,
        gateway_url: payload.gateway_url,
        pinned_at: payload.pinned_at,
        total_count: payload.total_count,
        delivered_count: payload.delivered_count,
        partial_count: payload.partial_count,
        missed_count: payload.missed_count,
      };
      setPinState({ kind: "done", ...pinned });
      router.replace(
        `/demo/deals/${deal.id}/activation?${buildPinParams(true, pinned).toString()}`,
        { scroll: false },
      );
    } catch (caught) {
      setPinState({
        kind: "error",
        message:
          caught instanceof Error
            ? caught.message
            : "Network error contacting the proof route.",
      });
    }
  }, [deal.id, rows, router]);

  const pinning = pinState.kind === "pinning";
  const pinDone = pinState.kind === "done";
  const pinError = pinState.kind === "error";

  const briefCount = useMemo(
    () => ({
      total: rows.length,
    }),
    [rows],
  );

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
          <Kbd>Phase 04 · Activation</Kbd>
          <Kbd tone="mute">Step 10 · Brief</Kbd>
          <Kbd tone="mute">Step 11 · Proof of delivery</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[30px]">
          Activation brief &amp; delivery proof
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          The brand confirms the activation deliverables in advance, then the
          event captures proof of each one during and after the show. The
          proof bundle is pinned to IPFS so it cannot be tampered with — and
          it becomes the reference the Step 14 POE NFT anchors on-chain.
        </p>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3">
            <Kbd>Deal summary</Kbd>
          </div>
          <ul className="space-y-2 text-[12px]">
            <Row label="Brand" value={deal.brand_name} />
            <Row label="Event" value={deal.event_name} />
            <Row label="Tier" value={deal.tier} />
            {eventLocation ? <Row label="Location" value={eventLocation} /> : null}
            <Row label="Event date" value={new Date(deal.event_starts_at).toLocaleDateString()} />
            <Row label="Deliverables" value={`${briefCount.total} items (Title tier)`} />
          </ul>
        </article>

        <article className="rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
          <div className="mb-3">
            <Kbd>Why this exists</Kbd>
          </div>
          <p className="text-[12.5px] leading-relaxed text-altr-muteSoft">
            Sponsorship deals usually have no objective record of what was
            delivered. ALTR fixes that with a two-step ritual: the brand
            approves the brief (Step 10) so both sides agree on scope, then
            the event captures proof for each line item (Step 11). The proof
            bundle is pinned to IPFS and referenced by the POE NFT — a
            tamper-proof, machine-readable receipt the brand can show its
            CFO and the event can show its next sponsor.
          </p>
        </article>
      </section>

      <section
        className={cn(
          "mt-8 rounded-lg border p-5 sm:p-6",
          briefApproved
            ? "border-teal-500/30 bg-teal-600/5"
            : "border-altr-lime/30 bg-altr-lime/5",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <Kbd>Step 10 · Approve activation brief</Kbd>
            <p className="text-[12.5px] text-altr-muteSoft">
              {briefApproved
                ? "Brief is locked. The deliverable list below is what the event will be measured against."
                : "Sample brief based on the Title tier perks of the deal. Approve to lock scope before the event."}
            </p>
          </div>
          <button
            type="button"
            onClick={approveBrief}
            disabled={briefApproved}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
              !briefApproved &&
                "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
              briefApproved && "bg-teal-600/20 text-teal-400",
            )}
            style={
              !briefApproved
                ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                : undefined
            }
          >
            {briefApproved ? (
              <>
                <Check className="h-4 w-4" />
                Brief approved
              </>
            ) : (
              <>
                Approve brief
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <ol className="mt-5 space-y-2.5">
          {rows.map((row, index) => (
            <li
              key={row.label + index}
              className="flex items-baseline gap-3 rounded-md border border-altr-line2 bg-altr-black/40 px-3 py-2.5 text-[12.5px]"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-altr-line2 font-mono text-[10px] text-altr-mute">
                {index + 1}
              </span>
              <span className="flex-1 text-altr-white">{row.label}</span>
            </li>
          ))}
        </ol>
        {approvedAt ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Approved · {new Date(approvedAt).toLocaleString()}
          </p>
        ) : null}
      </section>

      {briefApproved ? (
        <section className="mt-6 rounded-lg border border-altr-lime/30 bg-altr-lime/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <Kbd>Step 11 · Capture proof of delivery</Kbd>
              <p className="text-[12.5px] text-altr-muteSoft">
                Mark each deliverable. Add a note when status is partial or
                missed so the brand sees context. The bundle pins to IPFS as
                <code className="ml-1 font-mono text-[11px] text-altr-muteSoft">altr.activation-proof.v1</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={pinProof}
              disabled={pinning || pinDone}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                !pinning && !pinDone &&
                  "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
                pinning && "bg-altr-lime/30 text-altr-lime",
                pinDone && "bg-teal-600/20 text-teal-400",
              )}
              style={
                !pinning && !pinDone
                  ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                  : undefined
              }
            >
              {pinning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pinning…
                </>
              ) : pinDone ? (
                <>
                  <Check className="h-4 w-4" />
                  Proof pinned
                </>
              ) : (
                <>
                  Pin proof to IPFS
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <ol className="mt-5 space-y-3">
            {rows.map((row, index) => (
              <li
                key={row.label + index}
                className="rounded-md border border-altr-line2 bg-altr-black/40 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-altr-line2 font-mono text-[10px] text-altr-mute">
                      {index + 1}
                    </span>
                    <span className="text-[13px] font-medium text-altr-white">
                      {row.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {STATUS_OPTIONS.map((opt) => {
                      const active = row.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateRow(index, { status: opt.value })}
                          disabled={pinDone}
                          aria-pressed={active}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                            statusToneClasses(active, opt.tone),
                            pinDone && "opacity-70",
                          )}
                        >
                          {opt.value === "delivered" ? (
                            <Check className="h-3 w-3" />
                          ) : opt.value === "partial" ? (
                            <Minus className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <textarea
                  value={row.note}
                  onChange={(event) => updateRow(index, { note: event.target.value })}
                  disabled={pinDone}
                  placeholder={
                    row.status === "delivered"
                      ? "Optional · context, photo description, witnesses"
                      : "Required · what fell short and why"
                  }
                  rows={2}
                  className="mt-3 w-full resize-none rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12px] text-altr-muteSoft placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30 disabled:opacity-60"
                />
              </li>
            ))}
          </ol>

          {pinError ? (
            <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
                Pin failed
              </div>
              <div className="mt-1 leading-snug">{pinState.message}</div>
            </div>
          ) : null}

          {pinDone ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ResultCard
                label="IPFS hash"
                value={pinState.ipfs_hash}
                link={pinState.gateway_url}
                linkLabel="Open gateway"
              />
              <ResultCard
                label="Pinned at"
                value={new Date(pinState.pinned_at).toLocaleString()}
              />
              <ResultCard
                label="Delivered / Total"
                value={`${pinState.delivered_count} / ${pinState.total_count}`}
                mono
              />
              <ResultCard
                label="Partial · Missed"
                value={`${pinState.partial_count} · ${pinState.missed_count}`}
                mono
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {pinDone ? (
        <div className="mt-6 rounded-md border border-altr-line2 bg-altr-panel/60 p-4 text-[12px] leading-snug text-altr-muteSoft">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
            What&apos;s next
          </span>
          <p className="mt-1.5">
            The proof bundle is permanent. Next: release the escrowed funds
            (Step 12 EscrowFinish) and mint the Proof of Engagement NFT
            (Step 14 NFTokenMint) — both wired against XRPL testnet.
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
        {pinDone ? (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/demo/deals/${deal.id}/escrow`}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-altr-line2 px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-muteSoft transition-all hover:border-altr-mute hover:text-altr-white"
            >
              Release escrow (Step 12)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/demo/deals/${deal.id}/poe`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
            >
              Mint POE (Step 14)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-altr-line2/60 pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </span>
      <span className="text-right text-altr-white">{value}</span>
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
      // ignore
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
      <div className={cn("mt-1 break-all text-[11.5px] text-altr-white", mono && "font-mono")}>
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
