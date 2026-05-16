"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type PersonalProvider = "google" | "apple" | "twitter";

const SOCIAL_PROVIDERS: Array<{
  id: PersonalProvider;
  label: string;
  letter: string;
  enabled: boolean;
}> = [
  { id: "google", label: "Continue with Google", letter: "G", enabled: true },
  { id: "apple", label: "Continue with Apple", letter: "", enabled: false },
  { id: "twitter", label: "Continue with X", letter: "X", enabled: false },
];

const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.kr",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "naver.com",
  "daum.net",
  "kakao.com",
  "hanmail.net",
  "qq.com",
  "163.com",
  "126.com",
]);

type ConnectClientProps = {
  initialError?: string | null;
};

export function ConnectClient({ initialError = null }: ConnectClientProps = {}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError);

  async function continueWithEmail(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    const domain = trimmed.split("@")[1] ?? "";
    if (!domain || PERSONAL_DOMAINS.has(domain)) {
      setError(
        "Please use your work email (personal addresses like gmail / naver / yahoo not accepted).",
      );
      return;
    }

    setSubmitting("email");
    try {
      const supabase = createClient();
      await supabase
        .from("waitlist")
        .insert({ email: trimmed, persona: "brand", source: "connect_email" });
    } catch (caught) {
      console.warn("Connect email save failed (non-blocking)", caught);
    } finally {
      router.push("/demo");
    }
  }

  async function continueWithProvider(id: PersonalProvider) {
    setError(null);
    setSubmitting(id);

    if (id !== "google") {
      setSubmitting(null);
      setError("Apple and X sign-in are coming soon. Use Google or email for now.");
      return;
    }

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/demo`,
        },
      });
      if (oauthError) throw oauthError;
      // signInWithOAuth triggers a redirect; the spinner stays until the
      // browser navigates to Google.
    } catch (caught) {
      console.error("Google OAuth start failed", caught);
      setSubmitting(null);
      setError(
        "Couldn't start Google sign-in. Try again, or use your work email below.",
      );
    }
  }

  function continueAsGuest() {
    router.push("/demo");
  }

  return (
    <div className="flex min-h-screen flex-col bg-altr-black text-altr-white">
      <header className="border-b border-altr-line2 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-[640px] items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/altr-logo-white.png"
              alt="ALTR"
              width={1500}
              height={512}
              priority
              className="h-6 w-auto"
            />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
            Sign in
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="space-y-3 text-center">
            <span className="inline-flex items-center gap-2 text-caption font-medium text-teal-400">
              <span aria-hidden="true" className="h-2 w-2 bg-teal-500" />
              Sign in · ALTR
            </span>
            <h1 className="text-[clamp(28px,4vw,34px)] font-medium leading-[1.1] tracking-tight text-altr-white">
              Create your account.
            </h1>
            <p className="text-body text-altr-muteSoft">
              One tap to start. We set up your secure ALTR account in seconds —
              no passwords to remember. Your data stays yours.
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-caption text-red-300"
            >
              {error}
            </p>
          ) : null}

          <div className="space-y-2">
            {SOCIAL_PROVIDERS.map((provider) => {
              const loading = submitting === provider.id;
              const isDisabled = !provider.enabled || !!submitting;
              return (
                <button
                  key={provider.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => continueWithProvider(provider.id)}
                  aria-disabled={!provider.enabled || undefined}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md border border-altr-line2 bg-altr-panel px-4 py-3",
                    "text-body font-medium text-altr-white transition-colors",
                    provider.enabled
                      ? "hover:border-altr-mute disabled:opacity-60"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-altr-black text-[12px] font-bold text-altr-muteSoft">
                    {provider.letter}
                  </span>
                  <span className="flex-1 text-left">{provider.label}</span>
                  {!provider.enabled ? (
                    <span className="rounded border border-altr-line2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
                      Soon
                    </span>
                  ) : loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-altr-mute group-hover:text-altr-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center gap-3">
            <span className="h-px flex-1 bg-altr-line2" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
              or
            </span>
            <span className="h-px flex-1 bg-altr-line2" />
          </div>

          <form onSubmit={continueWithEmail} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!!submitting}
              className="h-11 w-full rounded-md border border-altr-line2 bg-altr-black px-3 text-body text-altr-white placeholder:text-altr-mute focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!!submitting || !email}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-md bg-teal-600 px-5 text-body font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
            >
              {submitting === "email" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Continue with email
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 pt-2 text-center">
            <button
              type="button"
              onClick={continueAsGuest}
              className="text-caption text-altr-muteSoft transition-colors hover:text-altr-white"
            >
              Skip for now — continue as guest →
            </button>
            <p className="text-caption text-altr-mute">
              Bank-level security. No passwords, no seed phrases. ALTR never
              holds your money.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
