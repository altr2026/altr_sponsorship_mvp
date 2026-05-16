import { NextResponse, type NextRequest } from "next/server";
import {
  convertStringToHex,
  NFTokenMintFlags,
  Wallet,
  type NFTokenMint,
  type TxResponse,
} from "xrpl";

import { pinJson } from "@/lib/ipfs/pinata";
import { withXrplClient } from "@/lib/xrpl/client";
import { getDealById, type Deal } from "@/lib/mock-data/deals";

export const runtime = "nodejs";

// xrpl exports NFTokenMintMetadata only from a deep path; mirror the shape
// here so the top-level import stays clean.
type NFTokenMintMetaShape = { nftoken_id?: string };

type PoeAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: "date" | "number";
};

type PoeMetadata = {
  schema: "altr.poe.v1";
  name: string;
  description: string;
  external_url: string;
  issued_at: string;
  issuer: string;
  attributes: PoeAttribute[];
  deal: {
    id: string;
    brand: string;
    event: string;
    tier: string;
    total_amount_usd: number;
    currency: string;
    escrow_address: string;
    escrow_tx_hash: string;
    contract_signed_at: string;
    event_starts_at: string;
    network: "xrpl-testnet";
  };
  milestones: Array<{
    id: string;
    label: string;
    trigger: string;
    amount_usd: number;
    percentage: number;
    status: string;
    released_at?: string;
  }>;
};

function appUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    request.nextUrl.origin
  );
}

function buildMetadata(deal: Deal, request: NextRequest): PoeMetadata {
  const issuedAt = new Date().toISOString();
  const externalUrl = `${appUrl(request)}/demo/deals/${deal.id}`;

  return {
    schema: "altr.poe.v1",
    name: `ALTR Proof of Engagement · ${deal.brand_name} × ${deal.event_name}`,
    description: `Cryptographic proof that ${deal.brand_name} sponsored ${deal.event_name} at the ${deal.tier} tier for $${deal.total_amount.toLocaleString("en-US")} ${deal.currency}. Settled across ${deal.milestones.length} milestones on XRPL.`,
    external_url: externalUrl,
    issued_at: issuedAt,
    issuer: "ALTR Sponsorship OS",
    attributes: [
      { trait_type: "Brand", value: deal.brand_name },
      { trait_type: "Event", value: deal.event_name },
      { trait_type: "Tier", value: deal.tier },
      {
        trait_type: "Total amount (USD)",
        value: deal.total_amount,
        display_type: "number",
      },
      { trait_type: "Currency", value: deal.currency },
      { trait_type: "Settlement network", value: "XRPL testnet" },
      { trait_type: "Escrow address", value: deal.escrow_address },
      {
        trait_type: "Contract signed",
        value: Math.floor(new Date(deal.contract_signed_at).getTime() / 1000),
        display_type: "date",
      },
      {
        trait_type: "Event date",
        value: Math.floor(new Date(deal.event_starts_at).getTime() / 1000),
        display_type: "date",
      },
    ],
    deal: {
      id: deal.id,
      brand: deal.brand_name,
      event: deal.event_name,
      tier: deal.tier,
      total_amount_usd: deal.total_amount,
      currency: deal.currency,
      escrow_address: deal.escrow_address,
      escrow_tx_hash: deal.xrpl_tx_hash,
      contract_signed_at: deal.contract_signed_at,
      event_starts_at: deal.event_starts_at,
      network: "xrpl-testnet",
    },
    milestones: deal.milestones.map((m) => ({
      id: m.id,
      label: m.label,
      trigger: m.trigger,
      amount_usd: m.amount,
      percentage: m.percentage,
      status: m.status,
      released_at: m.released_at,
    })),
  };
}

function ipfsUri(hash: string): string {
  return `ipfs://${hash}`;
}

function preflight(): { ok: true } | { ok: false; status: number; error: string } {
  if (!process.env.PINATA_JWT) {
    return {
      ok: false,
      status: 503,
      error:
        "PINATA_JWT is not set. Add it to Vercel env (Production + Preview + Development) — create a JWT at https://app.pinata.cloud/developers/api-keys.",
    };
  }
  if (!process.env.XRPL_HOT_WALLET_SEED) {
    return {
      ok: false,
      status: 503,
      error:
        "XRPL_HOT_WALLET_SEED is not set. Add it to Vercel env so the demo can sign NFTokenMint transactions.",
    };
  }
  return { ok: true };
}

export async function POST(request: NextRequest) {
  const pre = preflight();
  if (!pre.ok) {
    return NextResponse.json({ error: pre.error }, { status: pre.status });
  }

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

  const metadata = buildMetadata(deal, request);

  let pinned;
  try {
    pinned = await pinJson(metadata, {
      name: `poe-${deal.id}-${Date.now()}.json`,
      keyvalues: {
        deal_id: deal.id,
        brand: deal.brand_name,
        event: deal.event_name,
        kind: "altr.poe.v1",
      },
    });
  } catch (caught) {
    console.error("Pinata pinJson failed", caught);
    return NextResponse.json(
      {
        error: "Failed to pin metadata to IPFS. Check PINATA_JWT scopes (pinJSONToIPFS required).",
      },
      { status: 502 },
    );
  }

  let txResult: TxResponse<NFTokenMint>;
  try {
    txResult = await withXrplClient(async (client) => {
      const wallet = Wallet.fromSeed(process.env.XRPL_HOT_WALLET_SEED!);
      const tx: NFTokenMint = {
        TransactionType: "NFTokenMint",
        Account: wallet.classicAddress,
        NFTokenTaxon: 0,
        URI: convertStringToHex(ipfsUri(pinned.ipfsHash)).toUpperCase(),
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
    return NextResponse.json(
      {
        error:
          "NFTokenMint failed on XRPL. Ensure the hot wallet has reserve XRP (10+) on the configured network.",
        ipfs_hash: pinned.ipfsHash,
        gateway_url: pinned.gatewayUrl,
      },
      { status: 502 },
    );
  }

  const txMeta = txResult.result.meta as NFTokenMintMetaShape | undefined;
  const txHash = txResult.result.hash;
  const nftokenId = txMeta?.nftoken_id;

  return NextResponse.json({
    ok: true,
    ipfs_hash: pinned.ipfsHash,
    gateway_url: pinned.gatewayUrl,
    tx_hash: txHash,
    nftoken_id: nftokenId,
    explorer_url: `https://testnet.xrpl.org/transactions/${txHash}`,
    issued_at: metadata.issued_at,
    metadata,
  });
}
