import { NextResponse } from "next/server";

import { getXummSdk } from "@/lib/xumm/sdk";

export const runtime = "nodejs";

export async function POST() {
  const sdk = getXummSdk();
  if (!sdk) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Xaman API keys are not set. Add XUMM_API_KEY and XUMM_API_SECRET to the environment.",
      },
      { status: 503 },
    );
  }

  try {
    const created = await sdk.payload.create({
      txjson: { TransactionType: "SignIn" },
    });

    if (!created) {
      return NextResponse.json(
        { error: "create_failed", message: "Xaman returned no payload." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      uuid: created.uuid,
      qrPng: created.refs.qr_png,
      qrLink: created.refs.qr_uri_quality_opts?.[0] ?? created.refs.qr_png,
      websocket: created.refs.websocket_status,
      nextAlways: created.next.always,
      pushed: created.pushed,
    });
  } catch (caught) {
    console.error("xumm create failed", caught);
    return NextResponse.json(
      { error: "create_failed", message: "Could not reach Xaman API." },
      { status: 502 },
    );
  }
}
