"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { CalendarPlus, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { schedulePayout } from "./_payout-actions";
import {
  INITIAL_SCHEDULE_STATE,
  type SchedulePayoutState,
} from "./_payout-types";

export type PayoutFormVendor = { id: string; name: string };
export type PayoutFormMilestone = { id: string; label: string };

export function SchedulePayoutForm({
  dealId,
  vendors,
  milestones,
}: {
  dealId: string;
  vendors: PayoutFormVendor[];
  milestones: PayoutFormMilestone[];
}) {
  const [state, formAction] = useFormState<SchedulePayoutState, FormData>(
    schedulePayout,
    INITIAL_SCHEDULE_STATE,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (vendors.length === 0) {
    return (
      <p className="rounded-md border border-altr-line2 bg-altr-black/40 px-4 py-3 text-[12px] text-altr-mute">
        Add a vendor in the directory above before scheduling a payout.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-md border border-altr-line2 bg-altr-black/40 p-4"
    >
      <input type="hidden" name="deal_id" value={dealId} />

      <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
        <Field label="Vendor">
          <select
            name="vendor_id"
            required
            defaultValue=""
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12.5px] text-altr-white focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          >
            <option value="" disabled>
              Select vendor…
            </option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Milestone (optional)">
          <select
            name="milestone_id"
            defaultValue=""
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12.5px] text-altr-white focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          >
            <option value="">— none —</option>
            {milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Amount (XRP)">
          <input
            name="amount_xrp"
            type="number"
            min="0.000001"
            max="1000000"
            step="0.000001"
            required
            inputMode="decimal"
            placeholder="0.0"
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 font-mono text-[12.5px] text-altr-white placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          />
        </Field>
      </div>

      <Field label="Note (optional)" className="mt-3">
        <input
          name="note"
          maxLength={200}
          placeholder="What this payout is for"
          className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12px] text-altr-muteSoft placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
        />
      </Field>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11.5px] leading-snug">
          {state.error ? (
            <span className="text-red-300">{state.error}</span>
          ) : state.ok ? (
            <span className="text-altr-lime">Scheduled.</span>
          ) : null}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md px-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-all",
        pending
          ? "bg-altr-lime/30 text-altr-lime"
          : "bg-altr-lime text-altr-black hover:brightness-110",
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Scheduling…
        </>
      ) : (
        <>
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Schedule payout
        </>
      )}
    </button>
  );
}
