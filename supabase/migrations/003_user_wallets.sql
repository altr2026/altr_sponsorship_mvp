-- Phase A1 — per-user custodial XRPL wallet storage.
--
-- One row per Supabase auth.users user. Provisioned server-side on the OAuth
-- callback (or on first authenticated visit, in Phase A3) by calling the XRPL
-- testnet faucet, encrypting the resulting seed with AES-256-GCM under
-- WALLET_ENC_MASTER_KEY (Vercel env), and inserting here via service-role.
--
-- Security model (demo only):
--   * Seed material lives in ciphertext at rest. Only the service-role key
--     can decrypt — application code that needs to sign loads the row server-
--     side, never returns seed to the client.
--   * RLS lets the row owner read their own xrpl_address (so the client can
--     show the public address), but inserts/updates/deletes are service-role
--     only. The ciphertext columns are technically SELECT-able by the owner,
--     but they are useless without the master key.
--   * Production MUST replace this with HSM/KMS-backed signing or a non-
--     custodial multi-sig scheme. Master-key compromise = all-wallet
--     compromise.
--
-- Run order: 001_waitlist.sql + 002_newsletter_persona.sql must be applied
-- first. This migration is additive and does not touch existing tables.

CREATE TABLE user_wallets (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xrpl_address   TEXT NOT NULL UNIQUE,
  seed_ciphertext BYTEA NOT NULL,
  seed_iv        BYTEA NOT NULL,
  seed_tag       BYTEA NOT NULL,
  network        TEXT NOT NULL DEFAULT 'testnet'
                   CHECK (network IN ('testnet', 'mainnet')),
  auto_funded    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Owner can read their own row (so the client can show their public address).
-- The seed columns are still ciphertext — meaningless without the master key.
CREATE POLICY "owner_reads_own_wallet"
  ON user_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service-role can read everything (needed to load + decrypt seeds for
-- signing). Bypasses RLS by default but the explicit policy documents intent.
CREATE POLICY "service_role_reads_all"
  ON user_wallets FOR SELECT
  TO service_role
  USING (TRUE);

-- Only service-role can insert (provisioning route uses the service-role
-- client). authenticated/anon cannot create rows for themselves — prevents
-- a client from injecting an attacker-controlled address.
CREATE POLICY "service_role_inserts"
  ON user_wallets FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- Updates and deletes are service-role only too. Even the owner cannot
-- rotate or drop their wallet through the client.
CREATE POLICY "service_role_updates"
  ON user_wallets FOR UPDATE
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE POLICY "service_role_deletes"
  ON user_wallets FOR DELETE
  TO service_role
  USING (TRUE);

CREATE INDEX idx_user_wallets_address ON user_wallets(xrpl_address);
