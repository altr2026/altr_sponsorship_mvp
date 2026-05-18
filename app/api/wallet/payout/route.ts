import { NextResponse, type NextRequest } from "next/server";
import { Wallet, type Payment } from "xrpl";

import { decryptSeed } from "@/lib/crypto/wallet-seed";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { withXrplClient } from "@/lib/xrpl/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Postgrest returns bytea columns as the literal string `\xDEADBEEF`.
function byteaToBuffer(literal: string): Buffer {
  const hex = literal.startsWith("\\x") ? literal.slice(2) : literal;
  return Buffer.from(hex, "hex");
}

export async function POST(req: NextRequest) {
  // 1. Authn — must be a Supabase-authenticated session.
  const supabase = createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json(
      { status: "not_authenticated" },
      { status: 401 },
    );
  }

  // 2. Body.
  let body: { vendor_payout_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const payoutId = body.vendor_payout_id;
  if (!payoutId || typeof payoutId !== "string") {
    return NextResponse.json(
      { error: "vendor_payout_id required" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // 3. Load the payout, verify owner + scheduled status. Admin client read
  // because we'll also update with privileged status / tx_hash fields below.
  const { data: payout, error: payoutErr } = await admin
    .from("vendor_payouts")
    .select("id, owner_user_id, vendor_id, amount_drops, status")
    .eq("id", payoutId)
    .maybeSingle();
  if (payoutErr) {
    return NextResponse.json({ error: payoutErr.message }, { status: 500 });
  }
  if (!payout) {
    return NextResponse.json({ error: "payout_not_found" }, { status: 404 });
  }
  if (payout.owner_user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (payout.status !== "scheduled") {
    return NextResponse.json(
      { error: `payout_already_${payout.status}` },
      { status: 409 },
    );
  }

  // 4. Resolve vendor destination address.
  const { data: vendor, error: vendorErr } = await admin
    .from("vendors")
    .select("xrp_address, name")
    .eq("id", payout.vendor_id)
    .maybeSingle();
  if (vendorErr || !vendor) {
    return NextResponse.json({ error: "vendor_not_found" }, { status: 404 });
  }

  // 5. Load + decrypt wallet seed. Integrity-check the derived address
  // against the stored xrpl_address as a tamper / key-mismatch detector.
  const { data: walletRow, error: walletErr } = await admin
    .from("user_wallets")
    .select("xrpl_address, seed_ciphertext, seed_iv, seed_tag, network")
    .eq("user_id", user.id)
    .maybeSingle();
  if (walletErr || !walletRow) {
    return NextResponse.json(
      { error: "wallet_not_provisioned" },
      { status: 404 },
    );
  }

  let signerWallet: Wallet;
  try {
    const seed = decryptSeed({
      ciphertext: byteaToBuffer(walletRow.seed_ciphertext),
      iv: byteaToBuffer(walletRow.seed_iv),
      tag: byteaToBuffer(walletRow.seed_tag),
    });
    signerWallet = Wallet.fromSeed(seed);
  } catch (e) {
    console.error("[api/wallet/payout] seed decrypt failed:", e);
    return NextResponse.json(
      { error: "seed_decrypt_failed" },
      { status: 500 },
    );
  }
  if (signerWallet.classicAddress !== walletRow.xrpl_address) {
    console.error(
      "[api/wallet/payout] derived address mismatch — possible tampering",
      { stored: walletRow.xrpl_address, derived: signerWallet.classicAddress },
    );
    return NextResponse.json(
      { error: "wallet_integrity_failure" },
      { status: 500 },
    );
  }

  // 6. Build + submit the Payment.
  let txHash: string;
  try {
    const result = await withXrplClient(async (client) => {
      const tx: Payment = {
        TransactionType: "Payment",
        Account: signerWallet.classicAddress,
        Destination: vendor.xrp_address,
        Amount: String(payout.amount_drops),
      };
      const prepared = await client.autofill(tx);
      const signed = signerWallet.sign(prepared);
      return await client.submitAndWait(signed.tx_blob);
    });
    const meta = result.result.meta;
    const code =
      meta && typeof meta === "object" && "TransactionResult" in meta
        ? (meta.TransactionResult as string)
        : null;
    if (code !== "tesSUCCESS") {
      return NextResponse.json(
        { error: `xrpl_${code ?? "unknown"}` },
        { status: 500 },
      );
    }
    txHash = result.result.hash;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/wallet/payout] submit failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // 7. Mark released. If this UPDATE fails after a successful tx, the
  // payment still went through on-ledger — log loudly so an operator can
  // reconcile by hand. We do NOT roll back the tx (XRPL payments are final).
  const releasedAt = new Date().toISOString();
  const { error: updErr } = await admin
    .from("vendor_payouts")
    .update({
      status: "released",
      tx_hash: txHash,
      released_at: releasedAt,
    })
    .eq("id", payoutId);
  if (updErr) {
    console.error(
      "[api/wallet/payout] tx succeeded but DB update failed — reconcile manually:",
      { payoutId, txHash, error: updErr },
    );
  }

  const explorerUrl =
    walletRow.network === "mainnet"
      ? `https://livenet.xrpl.org/transactions/${txHash}`
      : `https://testnet.xrpl.org/transactions/${txHash}`;

  return NextResponse.json({
    status: "ok",
    tx_hash: txHash,
    explorer_url: explorerUrl,
    released_at: releasedAt,
  });
}
