-- Phase C1 — vendors (event-side directory of payees).
--
-- One row per vendor an event organizer wants to pay. Owned by the event
-- organizer's Supabase user; brand-side users never write or read these.
-- The xrp_address is the static destination the payout signing route
-- (Phase C3) will send Payment transactions to.
--
-- v1 is intentionally minimal: name, free-text service label, XRP address,
-- optional note. Per-vendor login + auto-wallet is a v2 enhancement
-- mentioned in the original architecture note.
--
-- Run order: 003_user_wallets.sql must be applied first (this migration is
-- independent of it but ships alongside its consumers).

CREATE TABLE vendors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL CHECK (length(trim(name)) > 0),
  service         TEXT,
  -- Classic XRP address regex: starts with 'r', base58 alphabet, 25-35 chars.
  -- Tightens what the route layer accepts; defensive belt for direct INSERTs.
  xrp_address     TEXT NOT NULL CHECK (xrp_address ~ '^r[1-9A-HJ-NP-Za-km-z]{24,34}$'),
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Same payee should not be added twice under the same owner. If a vendor
  -- provides two services, model it as one vendor row + two vendor_payouts
  -- rows pointing at the same vendor_id.
  UNIQUE (owner_user_id, xrp_address)
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Owner CRUD: SELECT / INSERT / UPDATE / DELETE only their own rows.
CREATE POLICY "owner_selects_own_vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "owner_inserts_own_vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "owner_updates_own_vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "owner_deletes_own_vendors"
  ON vendors FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_user_id);

-- Service-role full access — needed by the payout signing route to read the
-- vendor.xrp_address even if the route is invoked from a server context
-- where session cookies might be stale or absent.
CREATE POLICY "service_role_full_access_vendors"
  ON vendors FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE INDEX idx_vendors_owner ON vendors(owner_user_id);
