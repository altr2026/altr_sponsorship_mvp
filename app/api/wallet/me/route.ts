import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  getBalanceForAddress,
  getWalletForUser,
} from "@/lib/wallets/read";

// Live wallet info for the currently signed-in user. The frontend may poll
// this to refresh balance after a payout. JSON only — never returns the
// encrypted seed.
//
// Response shapes:
//   401 { status: "not_authenticated" }
//   200 { status: "not_provisioned" }
//   200 { status: "ok", xrpl_address, network, auto_funded,
//         balance_xrp, balance_drops, account_exists }
//   500 { status: "error", error }

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json(
      { status: "not_authenticated" },
      { status: 401 },
    );
  }

  try {
    const wallet = await getWalletForUser(user.id);
    if (!wallet) {
      return NextResponse.json(
        { status: "not_provisioned" },
        { status: 200 },
      );
    }
    const balance = await getBalanceForAddress(wallet.xrpl_address);
    return NextResponse.json({
      status: "ok",
      xrpl_address: wallet.xrpl_address,
      network: wallet.network,
      auto_funded: wallet.auto_funded,
      ...balance,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/wallet/me] failed", message);
    return NextResponse.json(
      { status: "error", error: message },
      { status: 500 },
    );
  }
}
