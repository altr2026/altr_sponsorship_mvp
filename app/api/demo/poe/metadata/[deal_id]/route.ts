import { NextResponse, type NextRequest } from "next/server";

import { getDealById } from "@/lib/mock-data/deals";
import { buildPoeMetadata } from "@/lib/poe/metadata";

export const runtime = "nodejs";

// Public, deterministic POE metadata served from our own origin so the
// NFTokenMint URI works without requiring the user to set up Pinata. The
// content is rebuilt from mock-data on every request, so the URI on the
// minted NFT always resolves to the same canonical JSON.
export async function GET(
  request: NextRequest,
  context: { params: { deal_id: string } },
) {
  const deal = getDealById(context.params.deal_id);
  if (!deal) {
    return NextResponse.json(
      { error: `Unknown deal: ${context.params.deal_id}` },
      { status: 404 },
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    request.nextUrl.origin;

  const metadata = buildPoeMetadata(deal, { app_url: appUrl });

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
