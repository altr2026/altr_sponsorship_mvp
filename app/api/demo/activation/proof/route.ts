import { NextResponse, type NextRequest } from "next/server";

import { pinJson } from "@/lib/ipfs/pinata";
import { getDealById } from "@/lib/mock-data/deals";
import { getEventById } from "@/lib/mock-data/events";

export const runtime = "nodejs";

type DeliverableStatus = "delivered" | "partial" | "missed";

type DeliverableInput = {
  label?: string;
  status?: DeliverableStatus;
  note?: string;
};

type DeliverableRecord = {
  label: string;
  status: DeliverableStatus;
  note?: string;
};

const STATUSES = new Set<DeliverableStatus>(["delivered", "partial", "missed"]);

function appUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    request.nextUrl.origin
  );
}

export async function POST(request: NextRequest) {
  if (!process.env.PINATA_JWT) {
    return NextResponse.json(
      {
        error:
          "PINATA_JWT is not set. Add it to Vercel env (Production + Preview + Development) — create a JWT at https://app.pinata.cloud/developers/api-keys.",
      },
      { status: 503 },
    );
  }

  let body: { deal_id?: string; deliverables?: DeliverableInput[] };
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

  const event = getEventById(deal.event_id);

  const rawDeliverables = Array.isArray(body.deliverables) ? body.deliverables : [];
  if (rawDeliverables.length === 0) {
    return NextResponse.json(
      { error: "deliverables must be a non-empty array." },
      { status: 400 },
    );
  }

  const deliverables: DeliverableRecord[] = [];
  for (const item of rawDeliverables) {
    if (!item || typeof item.label !== "string" || item.label.trim().length === 0) {
      return NextResponse.json(
        { error: "Each deliverable needs a non-empty label." },
        { status: 400 },
      );
    }
    if (!item.status || !STATUSES.has(item.status)) {
      return NextResponse.json(
        { error: `deliverable status must be one of: ${[...STATUSES].join(", ")}` },
        { status: 400 },
      );
    }
    deliverables.push({
      label: item.label.trim(),
      status: item.status,
      note: typeof item.note === "string" && item.note.trim().length > 0
        ? item.note.trim()
        : undefined,
    });
  }

  const deliveredCount = deliverables.filter((d) => d.status === "delivered").length;
  const partialCount = deliverables.filter((d) => d.status === "partial").length;
  const missedCount = deliverables.filter((d) => d.status === "missed").length;

  const pinnedAt = new Date().toISOString();
  const metadata = {
    schema: "altr.activation-proof.v1",
    deal: {
      id: deal.id,
      brand: deal.brand_name,
      event: deal.event_name,
      tier: deal.tier,
      total_amount_usd: deal.total_amount,
      currency: deal.currency,
      event_id: deal.event_id,
      event_starts_at: deal.event_starts_at,
      event_location: event ? `${event.location}, ${event.country}` : null,
    },
    proof: {
      pinned_at: pinnedAt,
      total_count: deliverables.length,
      delivered_count: deliveredCount,
      partial_count: partialCount,
      missed_count: missedCount,
      deliverables,
    },
    related_links: {
      settlement: `${appUrl(request)}/demo/deals/${deal.id}`,
      poe_mint: `${appUrl(request)}/demo/deals/${deal.id}/poe`,
    },
    issuer: "ALTR Sponsorship OS",
  };

  let pinned;
  try {
    pinned = await pinJson(metadata, {
      name: `activation-proof-${deal.id}-${Date.now()}.json`,
      keyvalues: {
        deal_id: deal.id,
        brand: deal.brand_name,
        event: deal.event_name,
        kind: "altr.activation-proof.v1",
      },
    });
  } catch (caught) {
    console.error("Pinata pinJson failed (activation proof)", caught);
    return NextResponse.json(
      {
        error: "Failed to pin proof to IPFS. Check PINATA_JWT scopes (pinJSONToIPFS required).",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    ipfs_hash: pinned.ipfsHash,
    gateway_url: pinned.gatewayUrl,
    pinned_at: pinnedAt,
    total_count: deliverables.length,
    delivered_count: deliveredCount,
    partial_count: partialCount,
    missed_count: missedCount,
    metadata,
  });
}
