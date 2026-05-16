import { NextResponse, type NextRequest } from "next/server";
import {
  EscrowFinish,
  Wallet,
  type TxResponse,
} from "xrpl";

import { withXrplClient } from "@/lib/xrpl/client";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const hotSeed = process.env.XRPL_HOT_WALLET_SEED;
  if (!hotSeed) {
    return NextResponse.json(
      {
        error:
          "XRPL_HOT_WALLET_SEED is not set. The executor wallet that submits EscrowFinish is missing from Vercel env.",
      },
      { status: 503 },
    );
  }

  let body: { owner?: string; offer_sequence?: number | string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }

  const owner = body.owner;
  if (!owner || typeof owner !== "string") {
    return NextResponse.json({ error: "owner is required." }, { status: 400 });
  }

  const offerSequenceRaw = body.offer_sequence;
  const offerSequence =
    typeof offerSequenceRaw === "string"
      ? Number(offerSequenceRaw)
      : offerSequenceRaw;
  if (typeof offerSequence !== "number" || !Number.isFinite(offerSequence) || offerSequence <= 0) {
    return NextResponse.json(
      { error: "offer_sequence must be a positive integer." },
      { status: 400 },
    );
  }

  let wallet: Wallet;
  try {
    wallet = Wallet.fromSeed(hotSeed);
  } catch (caught) {
    console.error("Wallet.fromSeed failed for XRPL_HOT_WALLET_SEED", caught);
    return NextResponse.json(
      { error: "XRPL_HOT_WALLET_SEED is not a valid wallet seed." },
      { status: 500 },
    );
  }

  let txResult: TxResponse<EscrowFinish>;
  try {
    txResult = await withXrplClient(async (client) => {
      const tx: EscrowFinish = {
        TransactionType: "EscrowFinish",
        Account: wallet.classicAddress,
        Owner: owner,
        OfferSequence: offerSequence,
      };
      return client.submitAndWait(tx, { wallet, autofill: true });
    });
  } catch (caught) {
    console.error("XRPL EscrowFinish failed", caught);
    const message = caught instanceof Error ? caught.message : "Unknown XRPL error";
    return NextResponse.json(
      {
        error: `EscrowFinish failed on XRPL: ${message}. Common causes: FinishAfter has not elapsed yet (wait until the timer is up), the escrow has already been finished or cancelled, or the (owner, offer_sequence) pair points at no live escrow object.`,
      },
      { status: 502 },
    );
  }

  const txHash = txResult.result.hash;

  return NextResponse.json({
    ok: true,
    tx_hash: txHash,
    executor: wallet.classicAddress,
    owner,
    offer_sequence: offerSequence,
    finished_at: new Date().toISOString(),
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
  });
}
