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
    currency: "USDC",
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
        trigger: "Booking confirmed · contract on-chain",
        amount: 50_000,
        percentage: 20,
        status: "released",
        released_at: "2026-04-21T11:00:00Z",
      },
      {
        id: "ms_pbw_m2",
        label: "M2",
        trigger: "Stage construction + artist lineup confirmed",
        amount: 100_000,
        percentage: 40,
        status: "released",
        released_at: "2026-05-20T10:30:00Z",
      },
      {
        id: "ms_pbw_m3",
        label: "M3",
        trigger: "Day 1 doors open · attendance verified",
        amount: 75_000,
        percentage: 30,
        status: "pending",
      },
      {
        id: "ms_pbw_m4",
        label: "M4",
        trigger: "Post-event ROI report + audience data verified",
        amount: 25_000,
        percentage: 10,
        status: "locked",
      },
    ],
  },
  // Historical Samsung deals — used by the Step 15 portfolio dashboard.
  // No XRPL flow attached; these are settled records imported into the brand
  // history. event_id intentionally points at events not in the discovery
  // mock-data so getEventById returns undefined (Phase 02 didn't exist yet).
  {
    id: "dl_kbw_samsung_2025",
    event_id: "evt_kbw_2025",
    event_name: "Korea Blockchain Week 2025",
    brand_id: "brnd_samsung",
    brand_name: "Samsung",
    tier: "Title",
    total_amount: 180_000,
    currency: "USDC",
    escrow_address: "rHiStOrYkBwS4ms5ng2025XYZabcd1234567",
    status: "complete",
    contract_signed_at: "2025-07-15T09:00:00Z",
    event_starts_at: "2025-09-01T00:00:00Z",
    current_milestone_id: "ms_kbw_m4",
    xrpl_tx_hash:
      "8E2B1C3D4E5F6789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789",
    milestones: [
      { id: "ms_kbw_m1", label: "M1", trigger: "Contract signed", amount: 36_000, percentage: 20, status: "released", released_at: "2025-07-16T11:00:00Z" },
      { id: "ms_kbw_m2", label: "M2", trigger: "Pre-event (T-30d)", amount: 72_000, percentage: 40, status: "released", released_at: "2025-08-02T10:00:00Z" },
      { id: "ms_kbw_m3", label: "M3", trigger: "Event day delivered", amount: 54_000, percentage: 30, status: "released", released_at: "2025-09-05T18:00:00Z" },
      { id: "ms_kbw_m4", label: "M4", trigger: "Post-ROI signed", amount: 18_000, percentage: 10, status: "released", released_at: "2025-09-25T12:00:00Z" },
    ],
  },
  {
    id: "dl_token2049_samsung_2025",
    event_id: "evt_token2049_sg_2025",
    event_name: "Token2049 Singapore 2025",
    brand_id: "brnd_samsung",
    brand_name: "Samsung",
    tier: "Gold",
    total_amount: 120_000,
    currency: "RLUSD",
    escrow_address: "rHiStOrYt2049Smsg2025DEFabcdef987654",
    status: "complete",
    contract_signed_at: "2025-08-10T09:00:00Z",
    event_starts_at: "2025-10-01T00:00:00Z",
    current_milestone_id: "ms_t2049_m4",
    xrpl_tx_hash:
      "7D3C0E1F4A5B6789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456ABC",
    milestones: [
      { id: "ms_t2049_m1", label: "M1", trigger: "Contract signed", amount: 24_000, percentage: 20, status: "released", released_at: "2025-08-11T11:00:00Z" },
      { id: "ms_t2049_m2", label: "M2", trigger: "Pre-event (T-30d)", amount: 48_000, percentage: 40, status: "released", released_at: "2025-09-02T10:00:00Z" },
      { id: "ms_t2049_m3", label: "M3", trigger: "Event day delivered", amount: 36_000, percentage: 30, status: "released", released_at: "2025-10-03T19:00:00Z" },
      { id: "ms_t2049_m4", label: "M4", trigger: "Post-ROI signed", amount: 12_000, percentage: 10, status: "released", released_at: "2025-10-20T12:00:00Z" },
    ],
  },
];

export function getDealById(id: string): Deal | undefined {
  return deals.find((deal) => deal.id === id);
}

export function getDealsByBrandId(brandId: string): Deal[] {
  return deals.filter((deal) => deal.brand_id === brandId);
}
