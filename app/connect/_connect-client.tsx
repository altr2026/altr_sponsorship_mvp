"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wallet } from "xrpl";
import { ArrowRight, Check, ExternalLink, Loader2, LogOut, X } from "lucide-react";

import { cn } from "@/lib/utils";

type WalletSource = "xumm" | "crossmark" | "gemwallet" | "demo";

type WalletState = {
  address: string;
  source: WalletSource;
  connectedAt: string;
};

type XummPayload = {
  uuid: string;
  qrPng: string;
  nextAlways: string;
};

const STORAGE_KEY = "altr.wallet";
const POLL_INTERVAL = 2000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

const PROVIDERS: Array<{
  id: WalletSource;
  label: string;
  description: string;
  status: "available" | "live" | "coming_soon";
  badge?: string;
}> = [
  {
    id: "xumm",
    label: "Xaman (Xumm)",
    description: "Sign on your phone. The most-used XRPL wallet.",
    status: "live",
    badge: "Recommended",
  },
  {
    id: "crossmark",
    label: "Crossmark",
    description: "Browser extension. Click to sign in your browser.",
    status: "coming_soon",
  },
  {
    id: "gemwallet",
    label: "GemWallet",
    description: "Browser extension. XRPL-native, lightweight.",
    status: "coming_soon",
  },
  {
    id: "demo",
    label: "Generate demo wallet",
    description:
      "Spin up a fresh XRPL testnet address right here. No real funds.",
    status: "available",
  },
];

export function ConnectClient() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState<WalletSource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [xumm, setXumm] = useState<XummPayload | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WalletState;
        if (parsed?.address) setWallet(parsed);
      }
    } catch {}
  }, []);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => stopPolling, []);

  function persist(next: WalletState | null) {
    setWallet(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function startXummPolling(payload: XummPayload) {
    pollStartRef.current = Date.now();
    stopPolling();
    pollRef.current = setInterval(async () => {
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
        stopPolling();
        setXumm(null);
        setError("Sign request timed out. Try again.");
        return;
      }
      try {
        const res = await fetch(
          `/api/auth/xumm/status?uuid=${encodeURIComponent(payload.uuid)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.cancelled || data.expired) {
          stopPolling();
          setXumm(null);
          setError(
            data.expired ? "Sign request expired." : "Sign request cancelled.",
          );
        } else if (data.signed && data.account) {
          stopPolling();
          setXumm(null);
          persist({
            address: data.account,
            source: "xumm",
            connectedAt: new Date().toISOString(),
          });
        }
      } catch (caught) {
        console.error("Xumm poll failed", caught);
      }
    }, POLL_INTERVAL);
  }

  async function handleXumm() {
    setError(null);
    setLoading("xumm");
    try {
      const res = await fetch("/api/auth/xumm/create", { method: "POST" });
      const data = await res.json();
      if (res.status === 503) {
        setError(
          "Xaman keys are not configured yet. Use Generate demo wallet for now.",
        );
        return;
      }
      if (!res.ok || !data.uuid) {
        setError(data.message ?? "Could not start Xaman sign request.");
        return;
      }
      const payload: XummPayload = {
        uuid: data.uuid,
        qrPng: data.qrPng,
        nextAlways: data.nextAlways,
      };
      setXumm(payload);
      startXummPolling(payload);
    } catch (caught) {
      console.error("Xumm create failed", caught);
      setError("Network error reaching Xaman.");
    } finally {
      setLoading(null);
    }
  }

  function cancelXumm() {
    stopPolling();
    setXumm(null);
  }

  function handleConnect(provider: WalletSource) {
    setError(null);
    if (provider === "demo") {
      setLoading("demo");
      try {
        const generated = Wallet.generate();
        persist({
          address: generated.address,
          source: "demo",
          connectedAt: new Date().toISOString(),
        });
      } catch (caught) {
        console.error("Demo wallet generation failed", caught);
        setError("Could not generate a demo wallet. Please try again.");
      } finally {
        setLoading(null);
      }
      return;
    }
    if (provider === "xumm") {
      void handleXumm();
      return;
    }
    setError(
      `${provider === "crossmark" ? "Crossmark" : "GemWallet"} integration is in progress. Use the demo wallet below to walk through the flow.`,
    );
  }

  function handleDisconnect() {
    persist(null);
    setError(null);
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
            Connect · XRPL testnet
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px] space-y-6">
          <div className="space-y-3 text-center">
            <span className="inline-block text-caption font-medium text-altr-lime">
              Sign in
            </span>
            <h1 className="text-[clamp(28px,4vw,36px)] font-medium leading-[1.1] tracking-tight text-altr-white">
              {wallet
                ? "Wallet connected."
                : xumm
                  ? "Scan with Xaman."
                  : "Connect your XRP wallet."}
            </h1>
            <p className="text-body text-altr-muteSoft">
              {wallet
                ? "You're ready to browse events, sign deals, and watch settlements clear on XRPL."
                : xumm
                  ? "Open the Xaman app on your phone, scan the QR, and approve the sign-in."
                  : "Connect a wallet to sign deals, fund escrows, and receive payouts on XRPL. Your keys never leave your device."}
            </p>
          </div>

          {wallet ? (
            <div className="space-y-4 rounded-lg border border-altr-line2 bg-altr-panel p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
                  Connected via {wallet.source === "demo" ? "demo wallet" : wallet.source}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-altr-lime/40 bg-altr-lime/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-lime">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Active
                </span>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
                  Address
                </div>
                <div className="break-all font-mono text-body text-altr-white">
                  {wallet.address}
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/demo/deals/dl_pbw_samsung"
                  className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-altr-lime px-4 text-body font-medium text-altr-black transition-colors hover:brightness-110"
                >
                  View live settlement
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-altr-line2 px-4 text-body font-medium text-altr-muteSoft transition-colors hover:border-altr-mute hover:text-altr-white"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Disconnect
                </button>
              </div>
              {wallet.source === "demo" ? (
                <p className="text-caption text-altr-mute">
                  Demo wallet. Address persists in this browser only. Funds reset between sessions. For testing only.
                </p>
              ) : null}
            </div>
          ) : xumm ? (
            <div className="space-y-4 rounded-lg border border-altr-line2 bg-altr-panel p-6">
              <div className="flex justify-center">
                <img
                  src={xumm.qrPng}
                  alt="Xaman sign request QR code"
                  width={240}
                  height={240}
                  className="rounded-md border border-altr-line2 bg-white p-3"
                />
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                Waiting for signature
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a
                  href={xumm.nextAlways}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-altr-line2 px-4 text-body font-medium text-altr-muteSoft transition-colors hover:border-altr-mute hover:text-altr-white"
                >
                  Open in Xaman
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={cancelXumm}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-altr-line2 px-4 text-body font-medium text-altr-muteSoft transition-colors hover:border-altr-mute hover:text-altr-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {PROVIDERS.map((provider) => {
                const isLoading = loading === provider.id;
                const enabled =
                  provider.status === "available" || provider.status === "live";
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleConnect(provider.id)}
                    disabled={isLoading}
                    className={cn(
                      "group flex w-full items-center justify-between gap-4 rounded-lg border bg-altr-panel p-4 text-left transition-colors disabled:opacity-60",
                      enabled
                        ? "border-altr-lime/40 hover:border-teal-400"
                        : "border-altr-line2 hover:border-altr-mute",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-body font-medium text-altr-white">
                          {provider.label}
                        </span>
                        {provider.badge ? (
                          <span className="rounded border border-altr-lime/40 bg-altr-lime/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-lime">
                            {provider.badge}
                          </span>
                        ) : null}
                        {!enabled ? (
                          <span className="rounded border border-altr-line2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
                            Coming soon
                          </span>
                        ) : null}
                      </div>
                      <span className="text-caption text-altr-mute">
                        {provider.description}
                      </span>
                    </div>
                    {isLoading ? (
                      <Loader2
                        className="h-5 w-5 shrink-0 animate-spin text-altr-lime"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          enabled
                            ? "text-altr-lime group-hover:translate-x-0.5"
                            : "text-altr-mute",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {error ? (
            <p
              role="alert"
              className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-caption text-red-300"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col items-center gap-2 pt-2 text-center">
            <Link
              href="/"
              className="text-caption text-altr-mute transition-colors hover:text-altr-white"
            >
              ← Back to home
            </Link>
            <p className="text-caption text-altr-mute">
              Your wallet, your keys. ALTR never holds your funds.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
