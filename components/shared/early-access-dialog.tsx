"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  PersonaToggle,
  type PersonaOption,
} from "@/components/shared/persona-toggle";
import type { WaitlistInsert } from "@/lib/supabase/types";

type AccountPersona = "event" | "brand";

const PERSONA_OPTIONS: PersonaOption<AccountPersona>[] = [
  { value: "brand", label: "Sponsor" },
  { value: "event", label: "Event" },
];

const inputClass =
  "h-11 w-full rounded-md border border-altr-line2 bg-altr-black px-3 text-body text-altr-white placeholder:text-altr-mute focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30";
const labelClass = "text-caption font-medium text-altr-muteSoft";

type EarlyAccessDialogProps = {
  children: ReactNode;
  source?: string;
  defaultPersona?: AccountPersona;
};

export function EarlyAccessDialog({
  children,
  source = "hero_see_how",
  defaultPersona = "brand",
}: EarlyAccessDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<AccountPersona>(defaultPersona);
  const [email, setEmail] = useState("");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setError(null);
        setEmail("");
      }, 200);
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
    };

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert(payload);

      if (insertError && insertError.code !== "23505") {
        console.error("Account create failed", insertError);
        setError("Something went wrong. Try again in a moment.");
        return;
      }

      setOpen(false);
      router.push("/demo");
    } catch (caught) {
      console.error("Account create threw", caught);
      setError("Network error. Check your connection and try again.");
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 bg-altr-lime" />
                <span className="text-caption font-medium text-altr-lime">
                  Sign in · ALTR
                </span>
              </div>
              <Dialog.Title className="text-h2 font-medium text-altr-white">
                Create your account
              </Dialog.Title>
              <Dialog.Description className="text-body text-altr-muteSoft">
                Work email only. We will route you into the right walk-through.
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
              <span className={labelClass}>Work email</span>
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
              className="inline-flex h-11 items-center justify-center rounded-md bg-teal-600 px-5 text-body font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Continue to demo"}
            </button>

            <p className="text-caption text-altr-mute">
              No password yet. We will email you if we need to reach out.
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
