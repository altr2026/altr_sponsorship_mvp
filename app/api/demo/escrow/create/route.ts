import { NextResponse, type NextRequest } from "next/server";
import {
  EscrowCreate,
  Wallet,
  xrpToDrops,
  unixTimeToRippleTime,
  type TxResponse,
} from "xrpl";

import { withXrplClient } from "@/lib/xrpl/client";
import { getDealById } from "@/lib/mock-data/deals";

export const runtime = "nodejs";

const DEFAULT_DEMO_XRP = 10;
const FINISH_AFTER_SECONDS = 60;
const CANCEL_AFTER_SECONDS = 60 * 60 * 24 * 30;

type Preflight =
  | {
      ok: true;
      hotSeed: string;
      destination: string;
    }
  | { ok: false; status: number; error: string };

function preflight(): Preflight {
  const hotSeed = process.env.XRPL_HOT_WALLET_SEED;
  if (!hotSeed) {
    return {
      ok: false,
      status: 503,
      error:
        "XRPL_HOT_WALLET_SEED is not set. Add a funded testnet wallet seed to Vercel env so the demo can sign EscrowCreate.",
    };
  }
  const destination = process.env.NEXT_PUBLIC_XRPL_TESTNET_ADDRESS;
  if (!destination) {
    return {
      ok: false,
      status: 503,
      error:
        "NEXT_PUBLIC_XRPL_TESTNET_ADDRESS is not set. This is the destination (event) address the escrow releases to.",
    };
  }
  return { ok: true, hotSeed, destination };
}

export async function POST(request: NextRequest) {
  const pre = preflight();
  if (!pre.ok) {
    return NextResponse.json({ error: pre.error }, { status: pre.status });
  }

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

  let wallet: Wallet;
  try {
    wallet = Wallet.fromSeed(pre.hotSeed);
  } catch (caught) {
    console.error("Wallet.fromSeed failed for XRPL_HOT_WALLET_SEED", caught);
    return NextResponse.json(
      { error: "XRPL_HOT_WALLET_SEED is not a valid wallet seed." },
      { status: 500 },
    );
  }

  if (wallet.classicAddress === pre.destination) {
    return NextResponse.json(
      {
        error:
          "Hot wallet address equals destination address — XRPL rejects self-escrows. Set NEXT_PUBLIC_XRPL_TESTNET_ADDRESS to a different account.",
      },
      { status: 400 },
    );
  }

  let txResult: TxResponse<EscrowCreate>;
  try {
    txResult = await withXrplClient(async (client) => {
      const tx: EscrowCreate = {
        TransactionType: "EscrowCreate",
        Account: wallet.classicAddress,
        Destination: pre.destination,
        Amount: amountDrops,
        FinishAfter: finishAfterRipple,
        CancelAfter: cancelAfterRipple,
      };
      return client.submitAndWait(tx, { wallet, autofill: true });
    });
  } catch (caught) {
    console.error("XRPL EscrowCreate failed", caught);
    const message = caught instanceof Error ? caught.message : "Unknown XRPL error";
    return NextResponse.json(
      {
        error: `EscrowCreate failed on XRPL: ${message}. Common causes: hot wallet not funded (need ≥12 XRP — 10 base reserve + 2 owner reserve for the escrow), or destination account does not exist on the network.`,
      },
      { status: 502 },
    );
  }

  const txHash = txResult.result.hash;
  // The escrow's OfferSequence (needed for EscrowFinish later) equals the
  // Sequence of this EscrowCreate transaction after autofill.
  const escrowSequence = txResult.result.Sequence;

  return NextResponse.json({
    ok: true,
    deal_id: deal.id,
    tx_hash: txHash,
    escrow_owner: wallet.classicAddress,
    escrow_sequence: escrowSequence,
    destination: pre.destination,
    amount_xrp: amountXrp,
    amount_drops: amountDrops,
    finish_after_unix: finishAfterUnix,
    finish_after_iso: new Date(finishAfterUnix * 1000).toISOString(),
    cancel_after_unix: cancelAfterUnix,
    cancel_after_iso: new Date(cancelAfterUnix * 1000).toISOString(),
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
  });
}
