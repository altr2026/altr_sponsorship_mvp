"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-body text-gray-900 placeholder:text-gray-400 focus:border-altr-lime focus:outline-none focus:ring-2 focus:ring-altr-lime/30";

type NewsletterFormProps = {
  className?: string;
};

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        persona: "newsletter",
        source: "insights_newsletter",
      });

      if (insertError && insertError.code !== "23505") {
        console.error("Newsletter insert failed", insertError);
        setError("Something went wrong. Try again in a moment.");
      } else {
        setDone(true);
        setEmail("");
      }
    } catch (caught) {
      console.error("Newsletter insert threw", caught);
      setError("We could not reach our servers. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6",
        className,
      )}
    >
      {done ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-h3 font-medium text-gray-900">
            You are subscribed.
          </h3>
          <p className="text-body text-gray-600">
            The next monthly read will land in your inbox.
          </p>
        </div>
      ) : (
        <>
          <label className="flex flex-col gap-2">
            <span className="text-caption font-medium text-gray-700">
              Email
            </span>
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
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-body text-destructive"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-altr-lime px-5 text-body font-medium text-altr-black transition-colors hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </button>

          <p className="text-caption text-gray-500">
            One email a month. Unsubscribe anytime.
          </p>
        </>
      )}
    </form>
  );
}
