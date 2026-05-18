import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ensureWalletForUser } from "@/lib/wallets/provision";

const SAFE_NEXT_DEFAULT = "/demo";

// Bound on first-login latency. XRPL testnet faucet usually replies in
// 1-3s; cap so a flaky network can't strand the user on /auth/callback.
// On timeout we log and continue to the redirect — provisioning will retry
// on the user's next sign-in.
const PROVISION_TIMEOUT_MS = 8_000;

function safeNext(raw: string | null): string {
  if (!raw) return SAFE_NEXT_DEFAULT;
  if (!raw.startsWith("/") || raw.startsWith("//")) return SAFE_NEXT_DEFAULT;
  return raw;
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(
      () => reject(new Error(`${label}: timeout after ${ms}ms`)),
      ms,
    );
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/connect?error=missing_code`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase exchangeCodeForSession failed", error);
    return NextResponse.redirect(`${origin}/connect?error=auth_failed`);
  }

  // Best-effort custodial-wallet provisioning. Awaited (with a hard ceiling)
  // so the row is committed before the user lands on a page that may read
  // it, but failures never block the redirect — the user will retry on
  // their next sign-in and the dashboard will show an unprovisioned state
  // in the meantime.
  const userId = data?.session?.user?.id;
  if (userId) {
    try {
      const result = await withTimeout(
        ensureWalletForUser(userId),
        PROVISION_TIMEOUT_MS,
        "ensureWalletForUser",
      );
      if (result.freshly_provisioned) {
        console.log(
          `[wallets] provisioned ${result.xrpl_address} for user ${userId}`,
        );
      }
    } catch (e) {
      console.error(
        `[wallets] provision failed for user ${userId} (continuing to redirect):`,
        e,
      );
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
