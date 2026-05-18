"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { addVendor } from "./_vendor-actions";
import {
  INITIAL_ADD_VENDOR_STATE,
  type AddVendorState,
} from "./_vendor-types";

// Service options mirror lib/mock-data/vendors.ts so the directory and the
// existing mock per-milestone payout tables speak the same vocabulary.
const SERVICE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Select service…" },
  { value: "venue", label: "Venue" },
  { value: "stage_av", label: "Stage + AV" },
  { value: "security", label: "Security" },
  { value: "talent", label: "Talent / Speakers" },
  { value: "marketing", label: "Marketing" },
  { value: "catering", label: "Catering / F&B" },
  { value: "staffing", label: "Staffing" },
  { value: "production", label: "Production" },
  { value: "insurance", label: "Insurance" },
  { value: "documentation", label: "Documentation" },
];

export function AddVendorForm({ dealId }: { dealId: string }) {
  const [state, formAction] = useFormState<AddVendorState, FormData>(
    addVendor,
    INITIAL_ADD_VENDOR_STATE,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-md border border-altr-line2 bg-altr-black/40 p-4"
    >
      <input type="hidden" name="deal_id" value={dealId} />

      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1.4fr]">
        <Field label="Name">
          <input
            name="name"
            required
            maxLength={120}
            placeholder="e.g. Manila Stage Co."
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12.5px] text-altr-white placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          />
        </Field>

        <Field label="Service">
          <select
            name="service"
            defaultValue=""
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12.5px] text-altr-white focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="XRP address">
          <input
            name="xrp_address"
            required
            pattern="^r[1-9A-HJ-NP-Za-km-z]{24,34}$"
            placeholder="r..."
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-md border border-altr-line2 bg-altr-black px-3 py-2 font-mono text-[12px] text-altr-white placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
          />
        </Field>
      </div>

      <Field label="Note (optional)" className="mt-3">
        <textarea
          name="note"
          rows={2}
          maxLength={500}
          placeholder="Anything to remember about this payee — contract terms, contact, payment cadence"
          className="w-full resize-none rounded-md border border-altr-line2 bg-altr-black px-3 py-2 text-[12px] text-altr-muteSoft placeholder:text-altr-mute focus:border-altr-lime/60 focus:outline-none focus:ring-2 focus:ring-altr-lime/30"
        />
      </Field>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11.5px] leading-snug">
          {state.error ? (
            <span className="text-red-300">{state.error}</span>
          ) : state.ok ? (
            <span className="text-altr-lime">Vendor added.</span>
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
          Adding…
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add vendor
        </>
      )}
    </button>
  );
}
