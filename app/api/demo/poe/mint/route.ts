import { NextResponse, type NextRequest } from "next/server";
import {
  convertStringToHex,
  NFTokenMintFlags,
  type NFTokenMint,
  type TxResponse,
} from "xrpl";

import { pinJson } from "@/lib/ipfs/pinata";
import { withXrplClient } from "@/lib/xrpl/client";
import { getHotWallet } from "@/lib/xrpl/auto-wallet";
import { getDealById } from "@/lib/mock-data/deals";
import { buildPoeMetadata } from "@/lib/poe/metadata";

export const runtime = "nodejs";

// xrpl exports NFTokenMintMetadata only from a deep path; mirror the shape
// here so the top-level import stays clean.
type NFTokenMintMetaShape = { nftoken_id?: string };

function appUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    request.nextUrl.origin
  );
}

export async function POST(request: NextRequest) {
  let body: { deal_id?: string };
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

  const origin = appUrl(request);
  const metadata = buildPoeMetadata(deal, { app_url: origin });

  // ── 1. Metadata source: Pinata if configured, otherwise our own HTTPS endpoint ──
  let metadata_source: "pinata" | "altr-fallback" = "altr-fallback";
  let ipfs_hash: string | null = null;
  let gateway_url: string | null = null;
  let metadata_url: string;

  if (process.env.PINATA_JWT) {
    try {
      const pinned = await pinJson(metadata, {
        name: `poe-${deal.id}-${Date.now()}.json`,
        keyvalues: {
          deal_id: deal.id,
          brand: deal.brand_name,
          event: deal.event_name,
          kind: "altr.poe.v1",
        },
      });
      metadata_source = "pinata";
      ipfs_hash = pinned.ipfsHash;
      gateway_url = pinned.gatewayUrl;
      metadata_url = `ipfs://${pinned.ipfsHash}`;
    } catch (caught) {
      console.error("Pinata pinJson failed; falling back to ALTR-served metadata", caught);
      metadata_url = `${origin}/api/demo/poe/metadata/${deal.id}`;
    }
  } else {
    metadata_url = `${origin}/api/demo/poe/metadata/${deal.id}`;
  }

  // ── 2. XRPL NFTokenMint with the metadata URI ──
  let txResult: TxResponse<NFTokenMint>;
  let walletAutoFunded = false;
  let issuerAddress: string;
  try {
    txResult = await withXrplClient(async (client) => {
      const { wallet, auto_funded } = await getHotWallet(client);
      walletAutoFunded = auto_funded;
      issuerAddress = wallet.classicAddress;
      const tx: NFTokenMint = {
        TransactionType: "NFTokenMint",
        Account: wallet.classicAddress,
        NFTokenTaxon: 0,
        URI: convertStringToHex(metadata_url).toUpperCase(),
        Flags: NFTokenMintFlags.tfTransferable,
        Memos: [
          {
            Memo: {
              MemoType: convertStringToHex("altr.poe.v1").toUpperCase(),
              MemoData: convertStringToHex(deal.id).toUpperCase(),
            },
          },
        ],
      };
      return client.submitAndWait(tx, { wallet, autofill: true });
    });
  } catch (caught) {
    console.error("XRPL NFTokenMint failed", caught);
    const message = caught instanceof Error ? caught.message : "Unknown XRPL error";
    return NextResponse.json(
      {
        error: `NFTokenMint failed on XRPL: ${message}. Common causes: testnet faucet temporarily rate-limited (wait 60s and retry), or the configured XRPL_HOT_WALLET_SEED account is below the reserve.`,
        ipfs_hash,
        gateway_url,
        metadata_url,
        metadata_source,
      },
      { status: 502 },
    );
  }

  const txMeta = txResult.result.meta as NFTokenMintMetaShape | undefined;
  const txHash = txResult.result.hash;
  const nftokenId = txMeta?.nftoken_id;

  return NextResponse.json({
    ok: true,
    metadata_source,
    metadata_url,
    ipfs_hash,
    gateway_url,
    tx_hash: txHash,
    nftoken_id: nftokenId,
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
    issuer_address: issuerAddress!,
    wallet_auto_funded: walletAutoFunded,
    issued_at: metadata.issued_at,
    metadata,
  });
}
