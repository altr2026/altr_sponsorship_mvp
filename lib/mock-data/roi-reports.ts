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
  dl_kbw_samsung_2025: {
    deal_id: "dl_kbw_samsung_2025",
    generated_at: "2025-09-25T11:00:00Z",
    period_start: "2025-09-01T00:00:00Z",
    period_end: "2025-09-05T23:59:59Z",
    total_reach: 520_000,
    total_impressions: 7_300_000,
    emv_usd: 1_044_000,
    spend_usd: 180_000,
    roi_multiplier: 5.8,
    creator_attribution: [
      { creator_id: "kol_naver_techblog", creator_name: "Naver Tech Blog", channel: "Long-form", contribution_pct: 28 },
      { creator_id: "kol_kakao_ventures", creator_name: "Kakao Ventures Twitter", channel: "X (Twitter)", contribution_pct: 21 },
      { creator_id: "kol_koreaherald_tech", creator_name: "Korea Herald Tech", channel: "Earned media", contribution_pct: 19 },
      { creator_id: "kol_starnews_kr", creator_name: "Starnews KR", channel: "Earned media", contribution_pct: 15 },
      { creator_id: "organic", creator_name: "Organic + walk-in", channel: "On-site", contribution_pct: 17 },
    ],
    benchmark_cohort: "APAC blockchain conferences",
    benchmark_cohort_size: 28,
    benchmark_percentile: 78,
    benchmark_median_emv_usd: 580_000,
    benchmark_median_roi_multiplier: 2.9,
    channel_breakdown: [
      { channel: "Stage mentions", description: "Keynote + 4 panels", metric: "9 brand mentions" },
      { channel: "Booth traffic", description: "30 m² activation footprint", metric: "6,800 walkthroughs" },
      { channel: "Social mentions", description: "#SamsungAtKBW + creator posts", metric: "4,120 mentions" },
      { channel: "Earned media", description: "KR tech + general press", metric: "29 articles" },
    ],
    ai_summary:
      "Samsung's KBW 2025 Title sponsorship delivered $1.04M EMV against $180K of spend — a 5.8× multiplier, 78th percentile vs comparable APAC blockchain conferences. Naver Tech Blog drove the largest single attributable share (28%).",
  },
  dl_token2049_samsung_2025: {
    deal_id: "dl_token2049_samsung_2025",
    generated_at: "2025-10-22T11:00:00Z",
    period_start: "2025-10-01T00:00:00Z",
    period_end: "2025-10-04T23:59:59Z",
    total_reach: 410_000,
    total_impressions: 5_100_000,
    emv_usd: 720_000,
    spend_usd: 120_000,
    roi_multiplier: 6.0,
    creator_attribution: [
      { creator_id: "kol_milk_road", creator_name: "Milk Road", channel: "Newsletter", contribution_pct: 31 },
      { creator_id: "kol_tushar_jain", creator_name: "Tushar Jain", channel: "X (Twitter)", contribution_pct: 24 },
      { creator_id: "kol_techinasia", creator_name: "Tech in Asia", channel: "Earned media", contribution_pct: 17 },
      { creator_id: "kol_dlnews", creator_name: "DL News", channel: "Earned media", contribution_pct: 13 },
      { creator_id: "organic", creator_name: "Organic + walk-in", channel: "On-site", contribution_pct: 15 },
    ],
    benchmark_cohort: "APAC blockchain conferences",
    benchmark_cohort_size: 28,
    benchmark_percentile: 83,
    benchmark_median_emv_usd: 380_000,
    benchmark_median_roi_multiplier: 3.1,
    channel_breakdown: [
      { channel: "Stage mentions", description: "2 panels (Gold tier)", metric: "5 brand mentions" },
      { channel: "Booth traffic", description: "24 m² booth", metric: "5,400 walkthroughs" },
      { channel: "Social mentions", description: "#SamsungAtToken2049", metric: "3,640 mentions" },
      { channel: "Earned media", description: "Crypto trade press", metric: "21 articles" },
    ],
    ai_summary:
      "Samsung's Token2049 Singapore 2025 Gold sponsorship returned $720K EMV on $120K spend — a 6.0× multiplier, 83rd percentile. Milk Road newsletter alone drove 31% of attributable reach.",
  },
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
