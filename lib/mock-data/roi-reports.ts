export type CreatorAttribution = {
  creator_id: string;
  creator_name: string;
  channel: string;
  contribution_pct: number;
};

export type ChannelBreakdown = {
  channel: string;
  description: string;
  metric: string;
};

export type RoiReport = {
  deal_id: string;
  generated_at: string;
  period_start: string;
  period_end: string;

  total_reach: number;
  total_impressions: number;
  emv_usd: number;
  spend_usd: number;
  roi_multiplier: number;

  creator_attribution: CreatorAttribution[];

  benchmark_cohort: string;
  benchmark_cohort_size: number;
  benchmark_percentile: number;
  benchmark_median_emv_usd: number;
  benchmark_median_roi_multiplier: number;

  channel_breakdown: ChannelBreakdown[];
  ai_summary: string;
};

const ROI_REPORTS: Record<string, RoiReport> = {
  dl_pbw_samsung: {
    deal_id: "dl_pbw_samsung",
    generated_at: "2026-06-24T09:30:00Z",
    period_start: "2026-06-19T00:00:00Z",
    period_end: "2026-06-23T23:59:59Z",

    total_reach: 850_000,
    total_impressions: 12_500_000,
    emv_usd: 1_850_000,
    spend_usd: 250_000,
    roi_multiplier: 7.4,

    creator_attribution: [
      {
        creator_id: "kol_coinbureau_asia",
        creator_name: "Coin Bureau Asia",
        channel: "Podcast + YouTube",
        contribution_pct: 34,
      },
      {
        creator_id: "kol_manila_crypto_times",
        creator_name: "Manila Crypto Times",
        channel: "X (Twitter)",
        contribution_pct: 22,
      },
      {
        creator_id: "kol_bloomberg_apac",
        creator_name: "Bloomberg APAC Fintech",
        channel: "Earned media",
        contribution_pct: 18,
      },
      {
        creator_id: "kol_techcrunch_asia",
        creator_name: "TechCrunch Asia",
        channel: "Earned media",
        contribution_pct: 14,
      },
      {
        creator_id: "organic",
        creator_name: "Organic + walk-in",
        channel: "On-site + search",
        contribution_pct: 12,
      },
    ],

    benchmark_cohort: "APAC blockchain conferences",
    benchmark_cohort_size: 34,
    benchmark_percentile: 92,
    benchmark_median_emv_usd: 720_000,
    benchmark_median_roi_multiplier: 3.1,

    channel_breakdown: [
      {
        channel: "Stage mentions",
        description: "Opening keynote + 6 panel slots over 3 days",
        metric: "14 spoken brand mentions",
      },
      {
        channel: "Booth traffic",
        description: "60 m² activation footprint, premium hall location",
        metric: "12,400 unique walkthroughs",
      },
      {
        channel: "Social mentions",
        description: "Hashtag #SamsungAtPBW + creator posts",
        metric: "8,247 branded mentions",
      },
      {
        channel: "Earned media",
        description: "Trade press + general business coverage",
        metric: "47 articles · 18 outlets",
      },
    ],
    ai_summary:
      "Samsung's PBW 2026 Title sponsorship delivered $1.85M in Equivalent Media Value against $250K of locked spend — a 7.4× multiplier, 92nd-percentile vs. comparable APAC blockchain conferences. The Coin Bureau Asia podcast drove the largest single share of attributable reach (34%), with Manila Crypto Times and Bloomberg APAC Fintech together contributing another 40%.",
  },
};

export function getRoiReportByDealId(dealId: string): RoiReport | undefined {
  return ROI_REPORTS[dealId];
}
