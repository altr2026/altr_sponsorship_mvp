import type { Deal } from "@/lib/mock-data/deals";
import { getRoiReportByDealId, type RoiReport } from "@/lib/mock-data/roi-reports";

export type PoeAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: "date" | "number";
};

export type PoeMetadata = {
  schema: "altr.poe.v1";
  name: string;
  description: string;
  external_url: string;
  issued_at: string;
  issuer: string;
  attributes: PoeAttribute[];
  deal: {
    id: string;
    brand: string;
    event: string;
    tier: string;
    total_amount_usd: number;
    currency: string;
    escrow_address: string;
    escrow_tx_hash: string;
    contract_signed_at: string;
    event_starts_at: string;
    network: "xrpl-testnet";
  };
  milestones: Array<{
    id: string;
    label: string;
    trigger: string;
    amount_usd: number;
    percentage: number;
    status: string;
    released_at?: string;
  }>;
  roi_report?: RoiReport;
};

export type BuildPoeMetadataOptions = {
  /** Defaults to the current time. Pass a stable value for deterministic output. */
  issued_at?: string;
  /** Public-facing app origin used in external_url. */
  app_url: string;
};

export function buildPoeMetadata(
  deal: Deal,
  options: BuildPoeMetadataOptions,
): PoeMetadata {
  const issuedAt = options.issued_at ?? new Date().toISOString();
  const externalUrl = `${options.app_url.replace(/\/+$/, "")}/demo/deals/${deal.id}`;
  const roi = getRoiReportByDealId(deal.id);

  const baseAttributes: PoeAttribute[] = [
    { trait_type: "Brand", value: deal.brand_name },
    { trait_type: "Event", value: deal.event_name },
    { trait_type: "Tier", value: deal.tier },
    {
      trait_type: "Total amount (USD)",
      value: deal.total_amount,
      display_type: "number",
    },
    { trait_type: "Currency", value: deal.currency },
    { trait_type: "Settlement network", value: "XRPL testnet" },
    { trait_type: "Escrow address", value: deal.escrow_address },
    {
      trait_type: "Contract signed",
      value: Math.floor(new Date(deal.contract_signed_at).getTime() / 1000),
      display_type: "date",
    },
    {
      trait_type: "Event date",
      value: Math.floor(new Date(deal.event_starts_at).getTime() / 1000),
      display_type: "date",
    },
  ];

  const roiAttributes: PoeAttribute[] = roi
    ? [
        { trait_type: "Total reach", value: roi.total_reach, display_type: "number" },
        { trait_type: "Total impressions", value: roi.total_impressions, display_type: "number" },
        { trait_type: "EMV (USD)", value: roi.emv_usd, display_type: "number" },
        { trait_type: "ROI multiplier", value: roi.roi_multiplier, display_type: "number" },
        { trait_type: "Benchmark percentile", value: roi.benchmark_percentile, display_type: "number" },
      ]
    : [];

  return {
    schema: "altr.poe.v1",
    name: `ALTR Proof of Engagement · ${deal.brand_name} × ${deal.event_name}`,
    description: roi
      ? `Immutable on-chain ROI receipt. ${deal.brand_name} × ${deal.event_name} (${deal.tier} tier, $${deal.total_amount.toLocaleString("en-US")} ${deal.currency}) delivered $${roi.emv_usd.toLocaleString("en-US")} EMV — a ${roi.roi_multiplier}× return at the ${roi.benchmark_percentile}th percentile of ${roi.benchmark_cohort_size} comparable ${roi.benchmark_cohort}.`
      : `Cryptographic proof that ${deal.brand_name} sponsored ${deal.event_name} at the ${deal.tier} tier for $${deal.total_amount.toLocaleString("en-US")} ${deal.currency}. Settled across ${deal.milestones.length} milestones on XRPL.`,
    external_url: externalUrl,
    issued_at: issuedAt,
    issuer: "ALTR Sponsorship OS",
    attributes: [...baseAttributes, ...roiAttributes],
    deal: {
      id: deal.id,
      brand: deal.brand_name,
      event: deal.event_name,
      tier: deal.tier,
      total_amount_usd: deal.total_amount,
      currency: deal.currency,
      escrow_address: deal.escrow_address,
      escrow_tx_hash: deal.xrpl_tx_hash,
      contract_signed_at: deal.contract_signed_at,
      event_starts_at: deal.event_starts_at,
      network: "xrpl-testnet",
    },
    milestones: deal.milestones.map((m) => ({
      id: m.id,
      label: m.label,
      trigger: m.trigger,
      amount_usd: m.amount,
      percentage: m.percentage,
      status: m.status,
      released_at: m.released_at,
    })),
    roi_report: roi,
  };
}
