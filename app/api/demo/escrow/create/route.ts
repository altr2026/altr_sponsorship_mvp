import { NextResponse, type NextRequest } from "next/server";
import {
  EscrowCreate,
  xrpToDrops,
  unixTimeToRippleTime,
  type TxResponse,
} from "xrpl";

import { withXrplClient } from "@/lib/xrpl/client";
import { getHotWallet, getDestinationAddress } from "@/lib/xrpl/auto-wallet";
import { getDealById } from "@/lib/mock-data/deals";

export const runtime = "nodejs";

const DEFAULT_DEMO_XRP = 10;
const FINISH_AFTER_SECONDS = 60;
const CANCEL_AFTER_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  let body: { deal_id?: string; amount_xrp?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }

  const dealId = body.deal_id;
  if (!dealId || typeof dealId !== "string") {
    return NextResponse.json({ error: "deal_id is required." }, { status: 400 });
  }

  const deal = getDealById(dealId);
  if (!deal) {
    return NextResponse.json({ error: `Unknown deal: ${dealId}` }, { status: 404 });
  }

  const amountXrp =
    typeof body.amount_xrp === "number" && body.amount_xrp > 0
      ? body.amount_xrp
      : DEFAULT_DEMO_XRP;

  let amountDrops: string;
  try {
    amountDrops = xrpToDrops(amountXrp);
  } catch (caught) {
    return NextResponse.json(
      { error: `amount_xrp invalid: ${(caught as Error).message}` },
      { status: 400 },
    );
  }

  // EscrowCreate uses the Ripple epoch (seconds since 2000-01-01 UTC).
  const nowUnix = Math.floor(Date.now() / 1000);
  const finishAfterUnix = nowUnix + FINISH_AFTER_SECONDS;
  const cancelAfterUnix = nowUnix + CANCEL_AFTER_SECONDS;
  const finishAfterRipple = unixTimeToRippleTime(finishAfterUnix);
  const cancelAfterRipple = unixTimeToRippleTime(cancelAfterUnix);

  let txResult: TxResponse<EscrowCreate>;
  let ownerAddress = "";
  let destinationAddress = "";
  let walletAutoFunded = false;
  let destinationAutoFunded = false;
  try {
    txResult = await withXrplClient(async (client) => {
      const hot = await getHotWallet(client);
      const dest = await getDestinationAddress(client);

      ownerAddress = hot.wallet.classicAddress;
      destinationAddress = dest.address;
      walletAutoFunded = hot.auto_funded;
      destinationAutoFunded = dest.auto_funded;

      if (ownerAddress === destinationAddress) {
        throw new Error(
          "Hot wallet address equals destination address — XRPL rejects self-escrows. Unset NEXT_PUBLIC_XRPL_TESTNET_ADDRESS to let the demo auto-generate a second wallet, or point it at a different account.",
        );
      }

      const tx: EscrowCreate = {
        TransactionType: "EscrowCreate",
        Account: hot.wallet.classicAddress,
        Destination: dest.address,
        Amount: amountDrops,
        FinishAfter: finishAfterRipple,
        CancelAfter: cancelAfterRipple,
      };
      return client.submitAndWait(tx, { wallet: hot.wallet, autofill: true });
    });
  } catch (caught) {
    console.error("XRPL EscrowCreate failed", caught);
    const message = caught instanceof Error ? caught.message : "Unknown XRPL error";
    return NextResponse.json(
      {
        error: `EscrowCreate failed on XRPL: ${message}. Common causes: testnet faucet temporarily rate-limited (wait 60s and retry), or the configured hot wallet is below the reserve (need ≥12 XRP — 10 base reserve + 2 owner reserve for the escrow).`,
      },
      { status: 502 },
    );
  }

  const txHash = txResult.result.hash;
  const escrowSequence = txResult.result.Sequence;

  return NextResponse.json({
    ok: true,
    deal_id: deal.id,
    tx_hash: txHash,
    escrow_owner: ownerAddress,
    escrow_sequence: escrowSequence,
    destination: destinationAddress,
    amount_xrp: amountXrp,
    amount_drops: amountDrops,
    finish_after_unix: finishAfterUnix,
    finish_after_iso: new Date(finishAfterUnix * 1000).toISOString(),
    cancel_after_unix: cancelAfterUnix,
    cancel_after_iso: new Date(cancelAfterUnix * 1000).toISOString(),
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
    wallet_auto_funded: walletAutoFunded,
    destination_auto_funded: destinationAutoFunded,
  });
}
