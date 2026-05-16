"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { PersonaToggle, type Persona } from "@/components/shared/persona-toggle";

type WaitlistFormData = {
  persona: Persona;
  email: string;
  brandName?: string;
  eventName?: string;
  region?: "APAC" | "GCC";
  orgName?: string;
  role?: string;
};

type WaitlistFormProps = {
  onSubmit?: (data: WaitlistFormData) => Promise<void> | void;
  className?: string;
};

const inputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-body text-gray-900 placeholder:text-gray-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

const labelClass = "text-caption font-medium uppercase text-gray-500";

export function WaitlistForm({ onSubmit, className }: WaitlistFormProps) {
  const [persona, setPersona] = useState<Persona>("brand");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [eventName, setEventName] = useState("");
  const [region, setRegion] = useState<"APAC" | "GCC">("APAC");
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  function reset() {
    setEmail("");
    setBrandName("");
    setEventName("");
    setRegion("APAC");
    setOrgName("");
    setRole("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const data: WaitlistFormData = {
      persona,
      email,
      ...(persona === "brand" && { brandName }),
      ...(persona === "event" && { eventName, region }),
      ...(persona === "admin" && { orgName, role }),
    };

    try {
      await onSubmit?.(data);
      setOpen(true);
      reset();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <span className={labelClass}>I am a</span>
          <PersonaToggle value={persona} onChange={setPersona} />
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

        {persona === "brand" ? (
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Brand or company</span>
            <input
              type="text"
              required
              placeholder="Samsung"
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              className={inputClass}
            />
          </label>
        ) : null}

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
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Region</span>
              <select
                value={region}
                onChange={(event) =>
                  setRegion(event.target.value as "APAC" | "GCC")
                }
                className={inputClass}
              >
                <option value="APAC">APAC</option>
                <option value="GCC">GCC</option>
              </select>
            </label>
          </>
        ) : null}

        {persona === "admin" ? (
          <>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Organization</span>
              <input
                type="text"
                required
                placeholder="Internal team or partner agency"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Role</span>
              <input
                type="text"
                required
                placeholder="Operations lead"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className={inputClass}
              />
            </label>
          </>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-teal-600 px-5 text-body font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request early access"}
        </button>

        <p className="text-caption text-gray-500">
          We will only use your email to share access details. No newsletters.
        </p>
      </form>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-8 data-[state=open]:animate-in data-[state=closed]:animate-out">
            <Dialog.Title className="text-h2 font-medium text-gray-900">
              You are on the list
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-body text-gray-600">
              Thanks for the interest. We will reach out as soon as early access
              opens for your region.
            </Dialog.Description>
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-md bg-gray-900 px-4 text-body font-medium text-white transition-colors hover:bg-gray-800"
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
