"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import {
  PersonaToggle,
  type PersonaOption,
} from "@/components/shared/persona-toggle";
import { createClient } from "@/lib/supabase/client";
import type { WaitlistInsert } from "@/lib/supabase/types";

type WaitlistPersona = "event" | "brand";

const PERSONA_OPTIONS: PersonaOption<WaitlistPersona>[] = [
  { value: "event", label: "Event" },
  { value: "brand", label: "Brand" },
];

const VERTICALS = [
  "Music festival",
  "Conference",
  "Fashion show",
  "Wellness event",
  "Sports event",
  "Other",
];

const EVENT_SIZES = [
  "Under 1,000",
  "1,000 – 10,000",
  "10,000 – 50,000",
  "50,000+",
];

const SPONSOR_TARGET_BUDGETS = [
  "Under $50K",
  "$50K – $250K",
  "$250K – $1M",
  "$1M+",
];

const REGIONS = ["APAC", "GCC", "Both"];

const BUDGET_TIERS = [
  "Under $100K",
  "$100K – $500K",
  "$500K – $5M",
  "$5M+",
];

const inputClass =
  "h-10 w-full rounded-md border border-altr-line2 bg-altr-black px-3 text-body text-altr-white placeholder:text-altr-mute focus:border-altr-lime focus:outline-none focus:ring-2 focus:ring-altr-lime/30";

const selectClass = cn(inputClass, "appearance-none pr-8");

const labelClass = "text-caption font-medium text-altr-muteSoft";

type WaitlistFormProps = {
  source?: string;
  defaultPersona?: WaitlistPersona;
  className?: string;
};

export function WaitlistForm({
  source = "waitlist_form",
  defaultPersona = "event",
  className,
}: WaitlistFormProps) {
  const [persona, setPersona] = useState<WaitlistPersona>(defaultPersona);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventVertical, setEventVertical] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventSize, setEventSize] = useState("");
  const [sponsorTargetBudget, setSponsorTargetBudget] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [targetVertical, setTargetVertical] = useState("");
  const [regionFocus, setRegionFocus] = useState("");
  const [budgetTier, setBudgetTier] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  function reset() {
    setEmail("");
    setNotes("");
    setEventName("");
    setEventVertical("");
    setEventLocation("");
    setEventSize("");
    setSponsorTargetBudget("");
    setCompanyName("");
    setTargetVertical("");
    setRegionFocus("");
    setBudgetTier("");
  }

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setErrorMessage(null);
    setDuplicate(false);
    setSubmitting(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedNotes = notes.trim();

    const payload: WaitlistInsert = {
      email: trimmedEmail,
      persona,
      notes: trimmedNotes || null,
      source,
      ...(persona === "event"
        ? {
            event_name: eventName.trim(),
            event_vertical: eventVertical,
            event_location: eventLocation.trim(),
            event_size: eventSize,
            sponsor_target_budget: sponsorTargetBudget,
          }
        : {
            company_name: companyName.trim(),
            target_vertical: targetVertical,
            region_focus: regionFocus,
            budget_tier: budgetTier,
          }),
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("waitlist").insert(payload);

      if (error) {
        if (error.code === "23505") {
          setDuplicate(true);
          setOpen(true);
          reset();
        } else {
          console.error("Waitlist insert failed", error);
          setErrorMessage(
            "Something went wrong on our end. Please try again in a moment.",
          );
        }
      } else {
        setDuplicate(false);
        setOpen(true);
        reset();
      }
    } catch (caught) {
      console.error("Waitlist insert threw", caught);
      setErrorMessage(
        "We could not reach our servers. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-5 rounded-lg border border-altr-line2 bg-altr-panel p-6",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <span className={labelClass}>I am a</span>
          <PersonaToggle
            value={persona}
            onChange={setPersona}
            options={PERSONA_OPTIONS}
          />
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </label>

        {persona === "event" ? (
          <>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Event name</span>
              <input
                type="text"
                required
                placeholder="Sole DXB"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                className={inputClass}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Vertical</span>
                <select
                  required
                  value={eventVertical}
                  onChange={(event) => setEventVertical(event.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {VERTICALS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Location</span>
                <input
                  type="text"
                  required
                  placeholder="Dubai"
                  value={eventLocation}
                  onChange={(event) => setEventLocation(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Event size</span>
                <select
                  required
                  value={eventSize}
                  onChange={(event) => setEventSize(event.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {EVENT_SIZES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Sponsor budget target</span>
                <select
                  required
                  value={sponsorTargetBudget}
                  onChange={(event) =>
                    setSponsorTargetBudget(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {SPONSOR_TARGET_BUDGETS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        ) : (
          <>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Company</span>
              <input
                type="text"
                required
                placeholder="Samsung"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className={inputClass}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Target vertical</span>
                <select
                  required
                  value={targetVertical}
                  onChange={(event) => setTargetVertical(event.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {VERTICALS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Region focus</span>
                <select
                  required
                  value={regionFocus}
                  onChange={(event) => setRegionFocus(event.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {REGIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Annual budget</span>
              <select
                required
                value={budgetTier}
                onChange={(event) => setBudgetTier(event.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Select…
                </option>
                {BUDGET_TIERS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Notes (optional)</span>
          <textarea
            rows={3}
            placeholder="Anything else we should know?"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={cn(inputClass, "h-auto py-2 leading-snug")}
          />
        </label>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-body text-red-300"
          >
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-altr-lime px-5 text-body font-medium text-altr-black transition-colors hover:brightness-110 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request early access"}
        </button>

        <p className="text-caption text-altr-mute">
          We will only use your email to share access details. No newsletters.
        </p>
      </form>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-altr-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-altr-line2 bg-altr-panel p-8 data-[state=open]:animate-in data-[state=closed]:animate-out">
            <Dialog.Title className="text-h2 font-medium text-altr-white">
              {duplicate ? "You are already on the list" : "You are on the list"}
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-body text-altr-muteSoft">
              {duplicate
                ? "We already have this email saved for that persona. We will reach out as access opens for your region."
                : "Thanks for the interest. We will reach out as soon as early access opens for your region."}
            </Dialog.Description>
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-md bg-altr-lime px-4 text-body font-medium text-altr-black transition-colors hover:brightness-110"
                >
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
