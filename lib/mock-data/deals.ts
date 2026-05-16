import type { SponsorTier } from "./events";

export type DealStatus =
  | "pending_signature"
  | "in_progress"
  | "complete"
  | "disputed";

export type SettlementCurrency = "RLUSD" | "USDC" | "XRP";

export type MilestoneStatus = "released" | "pending" | "locked" | "disputed";

export type Milestone = {
  id: string;
  label: string;
  trigger: string;
  amount: number;
  percentage: number;
  status: MilestoneStatus;
  released_at?: string;
};

export type Deal = {
  id: string;
  event_id: string;
  event_name: string;
  brand_id: string;
  brand_name: string;
  tier: SponsorTier;
  total_amount: number;
  currency: SettlementCurrency;
  escrow_address: string;
  status: DealStatus;
  milestones: Milestone[];
  xrpl_tx_hash: string;
  contract_signed_at: string;
  event_starts_at: string;
  current_milestone_id: string;
};

export const deals: Deal[] = [
  {
    id: "dl_pbw_samsung",
    event_id: "evt_pbw_2026",
    event_name: "Philippine Blockchain Week 2026",
    brand_id: "brnd_samsung",
    brand_name: "Samsung",
    tier: "Title",
    total_amount: 250_000,
    currency: "RLUSD",
    escrow_address: "rEScRoWxRplT3stN3tABCDEF1234567890xyz",
    status: "in_progress",
    contract_signed_at: "2026-04-20T09:00:00Z",
    event_starts_at: "2026-06-19T00:00:00Z",
    current_milestone_id: "ms_pbw_m3",
    xrpl_tx_hash:
      "9F1A0B2C3D4E5F6789ABCDEF0123456789ABCDEF0123456789ABCDEF01234567",
    milestones: [
      {
        id: "ms_pbw_m1",
        label: "M1",
        trigger: "Contract signed",
        amount: 50_000,
        percentage: 20,
        status: "released",
        released_at: "2026-04-21T11:00:00Z",
      },
      {
        id: "ms_pbw_m2",
        label: "M2",
        trigger: "Pre-event (T-30d)",
        amount: 100_000,
        percentage: 40,
        status: "released",
        released_at: "2026-05-20T10:30:00Z",
      },
      {
        id: "ms_pbw_m3",
        label: "M3",
        trigger: "Event day delivered",
        amount: 75_000,
        percentage: 30,
        status: "pending",
      },
      {
        id: "ms_pbw_m4",
        label: "M4",
        trigger: "Post-ROI signed",
        amount: 25_000,
        percentage: 10,
        status: "locked",
      },
    ],
  },
];

export function getDealById(id: string): Deal | undefined {
  return deals.find((deal) => deal.id === id);
}
