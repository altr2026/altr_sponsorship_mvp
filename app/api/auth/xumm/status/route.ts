import { NextResponse } from "next/server";

import { getXummSdk } from "@/lib/xumm/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sdk = getXummSdk();
  if (!sdk) {
    return NextResponse.json(
      { error: "not_configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) {
    return NextResponse.json(
      { error: "uuid_required" },
      { status: 400 },
    );
  }

  try {
    const payload = await sdk.payload.get(uuid);
    if (!payload) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      signed: payload.meta.signed,
      resolved: payload.meta.resolved,
      cancelled: payload.meta.cancelled,
      expired: payload.meta.expired,
      account: payload.response?.account ?? null,
      txid: payload.response?.txid ?? null,
    });
  } catch (caught) {
    console.error("xumm status failed", caught);
    return NextResponse.json(
      { error: "status_failed" },
      { status: 502 },
    );
  }
}
