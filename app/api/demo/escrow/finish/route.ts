import { NextResponse, type NextRequest } from "next/server";
import {
  EscrowFinish,
  type TxResponse,
} from "xrpl";

import { withXrplClient } from "@/lib/xrpl/client";
import { getHotWallet } from "@/lib/xrpl/auto-wallet";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  // EscrowFinish can be submitted by ANY account (not only the owner). For the
  // auto-funded demo path, the in-memory cached wallet from create may have
  // been reset by a cold start — in that case getHotWallet generates a fresh
  // wallet, which is still a valid executor.
  let txResult: TxResponse<EscrowFinish>;
  let executor = "";
  let walletAutoFunded = false;
  try {
    txResult = await withXrplClient(async (client) => {
      const hot = await getHotWallet(client);
      executor = hot.wallet.classicAddress;
      walletAutoFunded = hot.auto_funded;
      const tx: EscrowFinish = {
        TransactionType: "EscrowFinish",
        Account: hot.wallet.classicAddress,
        Owner: owner,
        OfferSequence: offerSequence,
      };
      return client.submitAndWait(tx, { wallet: hot.wallet, autofill: true });
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
    executor,
    owner,
    offer_sequence: offerSequence,
    finished_at: new Date().toISOString(),
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
    wallet_auto_funded: walletAutoFunded,
  });
}
