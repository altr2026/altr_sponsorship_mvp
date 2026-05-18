"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

import { cn } from "@/lib/utils";

type PayState =
  | { kind: "idle" }
  | { kind: "paying" }
  | { kind: "error"; message: string };

// Posts to /api/wallet/payout, surfaces an inline error if anything fails,
// otherwise calls router.refresh() to re-render the page so the row flips
// to "released" with the tx hash + explorer link populated by the server.
export function PayVendorButton({ payoutId }: { payoutId: string }) {
  const router = useRouter();
  const [state, setState] = useState<PayState>({ kind: "idle" });

  async function pay() {
    setState({ kind: "paying" });
    try {
      const resp = await fetch("/api/wallet/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_payout_id: payoutId }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setState({
          kind: "error",
          message: data?.error ?? `HTTP ${resp.status}`,
        });
        return;
      }
      // Success — let the server re-fetch the released row + tx hash.
      router.refresh();
      setState({ kind: "idle" });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={pay}
        disabled={state.kind === "paying"}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md px-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] transition-all",
          state.kind === "paying"
            ? "bg-altr-lime/30 text-altr-lime"
            : "bg-altr-lime text-altr-black hover:brightness-110",
        )}
      >
        {state.kind === "paying" ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Paying…
          </>
        ) : (
          <>
            <Send className="h-3 w-3" aria-hidden="true" />
            {state.kind === "error" ? "Retry" : "Pay vendor"}
          </>
        )}
      </button>
      {state.kind === "error" ? (
        <span className="max-w-[180px] text-right text-[10.5px] leading-snug text-red-300">
          {state.message}
        </span>
      ) : null}
    </div>
  );
}
