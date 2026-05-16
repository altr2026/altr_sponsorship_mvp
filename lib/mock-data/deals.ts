import type { SponsorTier } from "./events";

export type DealStatus =
  | "pending_signature"
  | "in_progress"
  | "complete"
  | "disputed";

export type Milestone = {
  id: string;
  label: string;
  amount: number;
  percentage: number;
  status: "pending" | "released" | "disputed";
  released_at?: string;
};

export type Deal = {
  id: string;
  event_id: string;
  brand_id: string;
  tier: SponsorTier;
  total_amount: number;
  status: DealStatus;
  milestones: Milestone[];
  xrpl_tx_hash?: string;
};

export const deals: Deal[] = [];
