"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  PersonaToggle,
  type PersonaOption,
} from "@/components/shared/persona-toggle";
import type { WaitlistInsert } from "@/lib/supabase/types";

type EarlyAccessPersona = "event" | "brand";

const PERSONA_OPTIONS: PersonaOption<EarlyAccessPersona>[] = [
  { value: "brand", label: "Brand" },
  { value: "event", label: "Event" },
];

const inputClass =
  "h-11 w-full rounded-md border border-altr-line2 bg-altr-black px-3 text-body text-altr-white placeholder:text-altr-mute focus:border-altr-lime focus:outline-none focus:ring-2 focus:ring-altr-lime/30";
const labelClass = "text-caption font-medium text-altr-muteSoft";

type EarlyAccessDialogProps = {
  children: ReactNode;
  source?: string;
  defaultPersona?: EarlyAccessPersona;
};

export function EarlyAccessDialog({
  children,
  source = "hero_cta",
  defaultPersona = "brand",
}: EarlyAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [persona, setPersona] = useState<EarlyAccessPersona>(defaultPersona);
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");

  function resetState() {
    setDone(false);
    setDuplicate(false);
    setError(null);
    setEmail("");
    setOrgName("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // reset on close so reopen starts fresh
      setTimeout(resetState, 200);
    }
  }

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: WaitlistInsert = {
      email: email.trim().toLowerCase(),
      persona,
      source,
      ...(persona === "brand"
        ? { company_name: orgName.trim() }
        : { event_name: orgName.trim() }),
    };

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert(payload);

      if (insertError) {
        if (insertError.code === "23505") {
          setDuplicate(true);
          setDone(true);
        } else {
          console.error("Early access insert failed", insertError);
          setError(
            "Something went wrong. Try again, or use the full form below.",
          );
        }
      } else {
        setDone(true);
      }
    } catch (caught) {
      console.error("Early access insert threw", caught);
      setError("We could not reach our servers. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-altr-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-altr-line2 bg-altr-panel p-7",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
          )}
        >
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-altr-mute transition-colors hover:bg-altr-line2 hover:text-altr-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Dialog.Close>

          {done ? (
            <div className="flex flex-col gap-3">
              <Dialog.Title className="text-h2 font-medium text-altr-white">
                {duplicate ? "You are already on the list" : "You are on the list"}
              </Dialog.Title>
              <Dialog.Description className="text-body text-altr-muteSoft">
                {duplicate
                  ? "We already have this email saved. We will reach out as access opens for your region."
                  : "Thanks. We will reach out as soon as early access opens for your region."}
              </Dialog.Description>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="inline-flex h-10 items-center rounded-md bg-altr-lime px-4 text-body font-medium text-altr-black transition-colors hover:brightness-110"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Dialog.Title className="text-h2 font-medium text-altr-white">
                  Get early access
                </Dialog.Title>
                <Dialog.Description className="text-body text-altr-muteSoft">
                  Tell us who you are. We will reach out as access opens for
                  your region.
                </Dialog.Description>
              </div>

              <div className="flex flex-col gap-2">
                <span className={labelClass}>I am a</span>
                <PersonaToggle
                  value={persona}
                  onChange={setPersona}
                  options={PERSONA_OPTIONS}
                  ariaLabel="Choose persona"
                />
              </div>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>
                  {persona === "brand" ? "Company" : "Event"}
                </span>
                <input
                  type="text"
                  required
                  placeholder={
                    persona === "brand" ? "Samsung" : "Ultra Korea 2026"
                  }
                  value={orgName}
                  onChange={(event) => setOrgName(event.target.value)}
                  className={inputClass}
                />
              </label>

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

              {error ? (
                <p
                  role="alert"
                  className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-caption text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-md bg-altr-lime px-5 text-body font-medium text-altr-black transition-colors hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Get early access"}
              </button>

              <p className="text-caption text-altr-mute">
                Need more fields? Use the{" "}
                <a
                  href="#waitlist"
                  onClick={() => handleOpenChange(false)}
                  className="text-altr-lime hover:underline"
                >
                  full waitlist form
                </a>
                .
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
