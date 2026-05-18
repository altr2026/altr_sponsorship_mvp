import "server-only";

import { encryptSeed } from "@/lib/crypto/wallet-seed";
import { createAdminClient } from "@/lib/supabase/admin";
import { withXrplClient } from "@/lib/xrpl/client";

export type WalletProvisionResult = {
  xrpl_address: string;
  freshly_provisioned: boolean;
};

// Postgres bytea wants `\x` + hex on the wire. supabase-js round-trips the
// string verbatim; we never let raw Buffers leak into the column value.
function toByteaLiteral(buf: Buffer): string {
  return `\\x${buf.toString("hex")}`;
}

// Postgres duplicate-key violation. We hit this when two concurrent OAuth
// callbacks try to provision the same user simultaneously (rare but
// possible). Treat as "someone else won the race" and read the address back.
const PG_UNIQUE_VIOLATION = "23505";

// Idempotently ensures a per-user custodial XRPL wallet exists. Returns the
// public classic address (safe to expose to the client). The seed never
// leaves this server module — it is encrypted with AES-256-GCM and stored
// in user_wallets via the service-role client.
//
// Wallets are funded against the configured XRPL network's testnet faucet.
// First-time provisioning typically takes 1-3s; subsequent calls early-out
// with a SELECT.
export async function ensureWalletForUser(
  userId: string,
): Promise<WalletProvisionResult> {
  if (!userId || typeof userId !== "string") {
    throw new Error("ensureWalletForUser: userId is required.");
  }

  const admin = createAdminClient();

  // Existing-row early return.
  {
    const { data, error } = await admin
      .from("user_wallets")
      .select("xrpl_address")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      throw new Error(`user_wallets SELECT failed: ${error.message}`);
    }
    if (data) {
      return { xrpl_address: data.xrpl_address, freshly_provisioned: false };
    }
  }

  // Mint + fund a fresh testnet wallet. The xrpl client.fundWallet() helper
  // generates a new keypair, calls the faucet, waits for the funding tx to
  // settle, and returns the funded Wallet.
  const funded = await withXrplClient(async (client) => client.fundWallet());
  const wallet = funded.wallet;
  if (!wallet.seed) {
    throw new Error(
      "ensureWalletForUser: xrpl faucet returned a wallet without a seed; cannot persist.",
    );
  }

  const { ciphertext, iv, tag } = encryptSeed(wallet.seed);

  const { error } = await admin.from("user_wallets").insert({
    user_id: userId,
    xrpl_address: wallet.classicAddress,
    seed_ciphertext: toByteaLiteral(ciphertext),
    seed_iv: toByteaLiteral(iv),
    seed_tag: toByteaLiteral(tag),
    network: "testnet",
    auto_funded: true,
  });

  if (error) {
    // Concurrent-callback race: another invocation already inserted. Re-read
    // the address rather than reporting a fake failure to the caller.
    if (error.code === PG_UNIQUE_VIOLATION) {
      const { data: race } = await admin
        .from("user_wallets")
        .select("xrpl_address")
        .eq("user_id", userId)
        .maybeSingle();
      if (race) {
        return {
          xrpl_address: race.xrpl_address,
          freshly_provisioned: false,
        };
      }
    }
    throw new Error(`user_wallets INSERT failed: ${error.message}`);
  }

  return {
    xrpl_address: wallet.classicAddress,
    freshly_provisioned: true,
  };
}
