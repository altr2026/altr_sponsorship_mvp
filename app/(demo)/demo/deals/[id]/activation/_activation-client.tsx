"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data/deals";

type ConfirmedRow = {
  label: string;
  confirmed: boolean;
};

type SavedSummary = {
  total: number;
  delivered: number;
  skipped_labels: string[];
  saved_at: string;
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "error"; message: string }
  | ({ kind: "done" } & SavedSummary);

type ActivationClientProps = {
  deal: Deal;
  deliverables: string[];
  eventLocation: string | null;
};

function readSummaryFromParams(params: URLSearchParams): SavedSummary | null {
  const savedAt = params.get("confirmed_at");
  const totalRaw = params.get("c_total");
  const deliveredRaw = params.get("c_delivered");
  const skipped = params.get("c_skipped");
  if (!savedAt || !totalRaw || !deliveredRaw) return null;
  return {
    saved_at: savedAt,
    total: Number(totalRaw),
    delivered: Number(deliveredRaw),
    skipped_labels: skipped ? skipped.split("|").filter(Boolean) : [],
  };
}

function buildParams(briefApproved: boolean, summary: SavedSummary | null): URLSearchParams {
  const p = new URLSearchParams();
  if (briefApproved) p.set("brief", "approved");
  if (summary) {
    p.set("confirmed_at", summary.saved_at);
    p.set("c_total", String(summary.total));
    p.set("c_delivered", String(summary.delivered));
    if (summary.skipped_labels.length > 0) {
      p.set("c_skipped", summary.skipped_labels.join("|"));
    }
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
  const [rows, setRows] = useState<ConfirmedRow[]>(() =>
    deliverables.map((label) => ({ label, confirmed: false })),
  );
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (searchParams.get("brief") === "approved") {
      setBriefApproved(true);
      setApprovedAt((prev) => prev ?? new Date().toISOString());
    }
    const restored = readSummaryFromParams(searchParams);
    if (restored) {
      setSaveState({ kind: "done", ...restored });
      setBriefApproved(true);
      const skipped = new Set(restored.skipped_labels);
      setRows((current) =>
        current.map((row) => ({ ...row, confirmed: !skipped.has(row.label) })),
      );
    }
  }, [searchParams]);

  const approveBrief = useCallback(() => {
    const ts = new Date().toISOString();
    setBriefApproved(true);
    setApprovedAt(ts);
    router.replace(
      `/demo/deals/${deal.id}/activation?${buildParams(true, null).toString()}`,
      { scroll: false },
    );
  }, [deal.id, router]);

  const toggleRow = useCallback((index: number) => {
    setRows((current) =>
      current.map((row, i) =>
        i === index ? { ...row, confirmed: !row.confirmed } : row,
      ),
    );
  }, []);

  const markAllConfirmed = useCallback(() => {
    setRows((current) => current.map((row) => ({ ...row, confirmed: true })));
  }, []);

  const confirmedCount = useMemo(
    () => rows.filter((r) => r.confirmed).length,
    [rows],
  );
  const noneConfirmed = confirmedCount === 0;

  const submitConfirmation = useCallback(async () => {
    setSaveState({ kind: "saving" });
    try {
      const response = await fetch("/api/demo/activation/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          deliverables: rows.map((row) => ({
            label: row.label,
            status: row.confirmed ? "delivered" : "missed",
            note:
              !row.confirmed && notes.trim().length > 0
                ? notes.trim()
                : undefined,
          })),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setSaveState({
          kind: "error",
          message: payload?.error ?? `Save failed (HTTP ${response.status}).`,
        });
        return;
      }
      const summary: SavedSummary = {
        total: rows.length,
        delivered: confirmedCount,
        skipped_labels: rows.filter((r) => !r.confirmed).map((r) => r.label),
        saved_at: payload.pinned_at ?? new Date().toISOString(),
      };
      setSaveState({ kind: "done", ...summary });
      router.replace(
        `/demo/deals/${deal.id}/activation?${buildParams(true, summary).toString()}`,
        { scroll: false },
      );
    } catch (caught) {
      setSaveState({
        kind: "error",
        message:
          caught instanceof Error ? caught.message : "Network error.",
      });
    }
  }, [confirmedCount, deal.id, notes, rows, router]);

  const saving = saveState.kind === "saving";
  const done = saveState.kind === "done";
  const errored = saveState.kind === "error";

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
          <Kbd tone="mute">Step 10 · Brief</Kbd>
          <Kbd tone="mute">Step 11 · Confirm delivery</Kbd>
        </div>
        <h1 className="text-[24px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[30px]">
          Activation brief &amp; delivery
        </h1>
        <p className="max-w-3xl text-[13px] text-altr-muteSoft">
          The brand approves the activation brief in advance. After the event,
          the event team confirms what was delivered — and that confirmation
          is what unlocks payout and feeds the post-event report.
        </p>
      </header>

      <section className="mt-6 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6">
        <div className="mb-3">
          <Kbd>Deal summary</Kbd>
        </div>
        <ul className="grid gap-2 text-[12px] sm:grid-cols-2">
          <Row label="Brand" value={deal.brand_name} />
          <Row label="Event" value={deal.event_name} />
          <Row label="Tier" value={deal.tier} />
          {eventLocation ? <Row label="Location" value={eventLocation} /> : null}
          <Row label="Event date" value={new Date(deal.event_starts_at).toLocaleDateString()} />
          <Row label="Deliverables" value={`${rows.length} items`} />
        </ul>
      </section>

      <section
        className={cn(
          "mt-6 rounded-lg border p-5 sm:p-6",
          briefApproved
            ? "border-teal-500/30 bg-teal-600/5"
            : "border-altr-lime/30 bg-altr-lime/5",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <Kbd>Step 10 · Approve brief</Kbd>
            <p className="text-[12.5px] text-altr-muteSoft">
              {briefApproved
                ? "Brief locked. The list below is what the event will deliver against."
                : "Sample brief from the Title tier perks. Approve to lock scope."}
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

        <ol className="mt-5 space-y-2">
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
              <Kbd>Step 11 · Confirm delivery</Kbd>
              <p className="text-[12.5px] text-altr-muteSoft">
                Tick each item that was delivered. Leave anything that wasn&apos;t.
              </p>
            </div>
            <button
              type="button"
              onClick={submitConfirmation}
              disabled={saving || done || noneConfirmed}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-md px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                !saving && !done && !noneConfirmed &&
                  "bg-altr-lime text-altr-black hover:brightness-110 active:translate-y-[1px]",
                noneConfirmed && !done && "bg-altr-line2 text-altr-mute",
                saving && "bg-altr-lime/30 text-altr-lime",
                done && "bg-teal-600/20 text-teal-400",
              )}
              style={
                !saving && !done && !noneConfirmed
                  ? { boxShadow: "0 0 24px -6px rgba(200, 240, 74, 0.5)" }
                  : undefined
              }
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : done ? (
                <>
                  <Check className="h-4 w-4" />
                  Delivery confirmed
                </>
              ) : (
                <>
                  Confirm delivery
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {!done ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px]">
              <span className="font-mono uppercase tracking-[0.18em] text-altr-mute">
                {confirmedCount} of {rows.length} confirmed
              </span>
              <button
                type="button"
                onClick={markAllConfirmed}
                className="font-mono uppercase tracking-[0.18em] text-altr-lime transition-colors hover:brightness-110"
              >
                Mark all delivered
              </button>
            </div>
          ) : null}

          <ul className="mt-4 space-y-2">
            {rows.map((row, index) => {
              const checked = row.confirmed;
              return (
                <li key={row.label + index}>
                  <button
                    type="button"
                    onClick={() => toggleRow(index)}
                    disabled={done}
                    aria-pressed={checked}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-[12.5px] transition-colors",
                      checked
                        ? "border-altr-lime/40 bg-altr-lime/10"
                        : "border-altr-line2 bg-altr-black/40 hover:border-altr-mute",
                      done && "cursor-default opacity-90",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors",
                        checked
                          ? "border-altr-lime bg-altr-lime text-altr-black"
                          : "border-altr-line2 text-transparent",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className={cn("flex-1", checked ? "text-altr-white" : "text-altr-muteSoft")}>
                      {row.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {!done ? (
            <div className="mt-4">
              <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                Notes for the brand (optional)
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={2}
                placeholder="Anything to flag — e.g. main-stage banner went up a day late"
                className="mt-2 w-full resize-none rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12px] text-altr-muteSoft placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
              />
            </div>
          ) : null}

          {errored ? (
            <div className="mt-5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-400">
                Save failed
              </div>
              <div className="mt-1 leading-snug">{saveState.message}</div>
            </div>
          ) : null}

          {done ? (
            <div className="mt-5 rounded-md border border-teal-500/30 bg-teal-600/5 px-4 py-3 text-[12px]">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-400">
                  Delivery confirmed
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                  {new Date(saveState.saved_at).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-altr-white">
                {saveState.delivered} of {saveState.total} items delivered
              </div>
              {saveState.skipped_labels.length > 0 ? (
                <div className="mt-2 text-[11.5px] text-altr-muteSoft">
                  Skipped: {saveState.skipped_labels.join(", ")}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/demo/deals/${deal.id}`}
          className="text-[12px] text-altr-mute transition-colors hover:text-altr-white"
        >
          ← Back to settlement
        </Link>
        {done ? (
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
              View post-event report
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
