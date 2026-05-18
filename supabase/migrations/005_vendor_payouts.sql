-- Phase C1 — vendor_payouts (settlement ledger between event wallet + vendors).
--
-- Each row represents one intended payment from an event organizer's
-- custodial wallet to a vendor's XRP address. Lifecycle:
--   scheduled -> released  (Phase C3 payout route flips this after submitAndWait)
--   scheduled -> withheld   (UI: hold pending vendor follow-up)
--   scheduled -> disputed   (UI: vendor + brand to reconcile)
--
-- deal_id / milestone_id are TEXT pointers to the mock data in
-- lib/mock-data/deals.ts — when deals move into Supabase (post-v2) these
-- can be promoted to UUID FK constraints.
--
-- Amounts are stored as bigint XRP drops to match the on-ledger native
-- unit. USD conversion is purely a presentation concern.
--
-- Run order: 004_vendors.sql must be applied first.

CREATE TABLE vendor_payouts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- RESTRICT so we cannot orphan or silently drop payouts when a vendor is
  -- deleted. The UI must explicitly archive payouts first.
  vendor_id       UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  deal_id         TEXT NOT NULL,
  milestone_id    TEXT,
  amount_drops    BIGINT NOT NULL CHECK (amount_drops > 0),
  status          TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'released', 'withheld', 'disputed')),
  -- Populated by the payout signing route on a successful submitAndWait.
  tx_hash         TEXT,
  released_at     TIMESTAMPTZ,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE vendor_payouts ENABLE ROW LEVEL SECURITY;

-- Owner reads all of their own payouts (dashboard listing).
CREATE POLICY "owner_selects_own_payouts"
  ON vendor_payouts FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id);

-- Owner can create a payout under their own user id only.
CREATE POLICY "owner_inserts_own_payouts"
  ON vendor_payouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

-- Owner can edit metadata on their own rows. Status flips to 'released'
-- happen via service-role (the signing route — see Phase C3) so the tx_hash
-- + released_at fields cannot be forged from a regular client session.
CREATE POLICY "owner_updates_own_payouts"
  ON vendor_payouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- Owner can delete only scheduled payouts. Released / withheld / disputed
-- rows are audit history and must stay put.
CREATE POLICY "owner_deletes_scheduled_payouts"
  ON vendor_payouts FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_user_id AND status = 'scheduled');

CREATE POLICY "service_role_full_access_payouts"
  ON vendor_payouts FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

CREATE INDEX idx_payouts_owner_deal ON vendor_payouts(owner_user_id, deal_id);
CREATE INDEX idx_payouts_owner_status ON vendor_payouts(owner_user_id, status);
CREATE INDEX idx_payouts_vendor ON vendor_payouts(vendor_id);
