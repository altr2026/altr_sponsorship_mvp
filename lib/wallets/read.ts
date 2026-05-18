import "server-only";

import { dropsToXrp } from "xrpl";

import { createAdminClient } from "@/lib/supabase/admin";
import { withXrplClient } from "@/lib/xrpl/client";

export type StoredWallet = {
  xrpl_address: string;
  network: string;
  auto_funded: boolean;
};

// Returns the user's wallet row (public fields only — never the seed bytes).
// Uses the service-role client so it works in any server context, including
// API routes that have already validated the session. CALLERS MUST PASS A
// user_id THEY HAVE AUTHENTICATED — admin reads bypass RLS, so a wrong id
// would leak someone else's address.
export async function getWalletForUser(
  userId: string,
): Promise<StoredWallet | null> {
  if (!userId) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("user_wallets")
    .select("xrpl_address, network, auto_funded")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    throw new Error(`user_wallets SELECT failed: ${error.message}`);
  }
  return data ?? null;
}

export type WalletBalance = {
  balance_xrp: string;
  balance_drops: string;
  account_exists: boolean;
};

// Live on-ledger balance via account_info on the validated ledger. Returns
// account_exists=false (balance 0) when the address has not been funded yet
// — under normal conditions this should not happen for auto-provisioned
// wallets, but we handle it so a missing-account error never bubbles up to
// the dashboard.
export async function getBalanceForAddress(
  address: string,
): Promise<WalletBalance> {
  return withXrplClient(async (client) => {
    try {
      const resp = await client.request({
        command: "account_info",
        account: address,
        ledger_index: "validated",
      });
      const drops = resp.result.account_data.Balance;
      return {
        balance_xrp: dropsToXrp(drops).toString(),
        balance_drops: drops,
        account_exists: true,
      };
    } catch (e: unknown) {
      // xrpl.js throws RippledError with .data.error="actNotFound" for
      // accounts that have never received a funding payment.
      const err = e as { data?: { error?: string } } | undefined;
      if (err?.data?.error === "actNotFound") {
        return {
          balance_xrp: "0",
          balance_drops: "0",
          account_exists: false,
        };
      }
      throw e;
    }
  });
}
