// Vendor payouts are operational data — PRIVATE to the event organizer's
// team. Brands never see this. ALTR's role: the brand's escrow money lands
// on the event wallet via the milestone schedule; what happens *after* that
// (vendor splits, payment timing, who got what) is purely the event's books.

export type VendorService =
  | "venue"
  | "stage_av"
  | "security"
  | "talent"
  | "marketing"
  | "catering"
  | "staffing"
  | "production"
  | "insurance"
  | "documentation";

export type VendorPaymentStatus =
  | "released"
  | "scheduled"
  | "withheld"
  | "disputed";

export type VendorPayout = {
  id: string;
  vendor_id: string;
  vendor_name: string;
  service: VendorService;
  milestone_id: string;
  amount_usd: number;
  status: VendorPaymentStatus;
  released_at?: string;
  note?: string;
};

const SERVICE_LABELS: Record<VendorService, string> = {
  venue: "Venue",
  stage_av: "Stage + AV",
  security: "Security",
  talent: "Talent / Speakers",
  marketing: "Marketing",
  catering: "Catering / F&B",
  staffing: "Staffing",
  production: "Production",
  insurance: "Insurance",
  documentation: "Documentation",
};

export function serviceLabel(s: VendorService): string {
  return SERVICE_LABELS[s];
}

const VENDOR_PAYOUTS: Record<string, VendorPayout[]> = {
  dl_pbw_samsung: [
    // M1 · Booking confirmed · $50K released
    {
      id: "vp_pbw_m1_smx",
      vendor_id: "v_smx_convention",
      vendor_name: "SMX Convention Center",
      service: "venue",
      milestone_id: "ms_pbw_m1",
      amount_usd: 30_000,
      status: "released",
      released_at: "2026-04-22T10:00:00Z",
      note: "Venue booking deposit · holds the June 19-21 dates.",
    },
    {
      id: "vp_pbw_m1_insurance",
      vendor_id: "v_eventshield_apac",
      vendor_name: "EventShield APAC",
      service: "insurance",
      milestone_id: "ms_pbw_m1",
      amount_usd: 15_000,
      status: "released",
      released_at: "2026-04-22T10:00:00Z",
      note: "Event cancellation + general liability cover.",
    },
    {
      id: "vp_pbw_m1_legal",
      vendor_id: "v_baker_mckenzie_mnl",
      vendor_name: "Baker McKenzie Manila",
      service: "production",
      milestone_id: "ms_pbw_m1",
      amount_usd: 5_000,
      status: "released",
      released_at: "2026-04-23T16:00:00Z",
      note: "Sponsorship contract review + amendment drafting.",
    },

    // M2 · Stage + lineup confirmed · $100K released
    {
      id: "vp_pbw_m2_stage",
      vendor_id: "v_stagecraft_asia",
      vendor_name: "Stagecraft Asia",
      service: "stage_av",
      milestone_id: "ms_pbw_m2",
      amount_usd: 35_000,
      status: "released",
      released_at: "2026-05-21T11:00:00Z",
      note: "Main stage build + Samsung-branded backdrop (3 days).",
    },
    {
      id: "vp_pbw_m2_talent",
      vendor_id: "v_blockbeat_talent",
      vendor_name: "BlockBeat Talent",
      service: "talent",
      milestone_id: "ms_pbw_m2",
      amount_usd: 20_000,
      status: "released",
      released_at: "2026-05-22T10:00:00Z",
      note: "Creator roster advance · Coin Bureau Asia + Manila Crypto Times.",
    },
    {
      id: "vp_pbw_m2_av",
      vendor_id: "v_manila_sound_light",
      vendor_name: "Manila Sound & Light",
      service: "stage_av",
      milestone_id: "ms_pbw_m2",
      amount_usd: 18_000,
      status: "released",
      released_at: "2026-05-21T11:00:00Z",
      note: "AV equipment rental · main stage + side stage.",
    },
    {
      id: "vp_pbw_m2_keynote",
      vendor_id: "v_coin_bureau_asia",
      vendor_name: "Coin Bureau Asia",
      service: "talent",
      milestone_id: "ms_pbw_m2",
      amount_usd: 12_000,
      status: "released",
      released_at: "2026-05-23T09:00:00Z",
      note: "Keynote speaker fee · Day 1 opening + podcast crossover.",
    },
    {
      id: "vp_pbw_m2_media",
      vendor_id: "v_digitalkl_media",
      vendor_name: "DigitalKL Media",
      service: "marketing",
      milestone_id: "ms_pbw_m2",
      amount_usd: 10_000,
      status: "released",
      released_at: "2026-05-21T11:00:00Z",
      note: "Pre-event media buy · APAC crypto press circuit.",
    },
    {
      id: "vp_pbw_m2_print",
      vendor_id: "v_pbw_print",
      vendor_name: "Print Production Co",
      service: "production",
      milestone_id: "ms_pbw_m2",
      amount_usd: 5_000,
      status: "released",
      released_at: "2026-05-21T11:00:00Z",
      note: "15K branded lanyards · signage · swag bags.",
    },

    // M3 · Event day delivered · $75K · scheduled (parent milestone pending)
    {
      id: "vp_pbw_m3_smx_final",
      vendor_id: "v_smx_convention",
      vendor_name: "SMX Convention Center",
      service: "venue",
      milestone_id: "ms_pbw_m3",
      amount_usd: 20_000,
      status: "scheduled",
      note: "Final venue balance · paid on event-day delivery.",
    },
    {
      id: "vp_pbw_m3_av_crew",
      vendor_id: "v_manila_sound_light",
      vendor_name: "Manila Sound & Light",
      service: "stage_av",
      milestone_id: "ms_pbw_m3",
      amount_usd: 15_000,
      status: "scheduled",
      note: "On-site AV crew + ops over 3 event days.",
    },
    {
      id: "vp_pbw_m3_security",
      vendor_id: "v_blocksec_manila",
      vendor_name: "BlockSec Manila",
      service: "security",
      milestone_id: "ms_pbw_m3",
      amount_usd: 12_000,
      status: "scheduled",
      note: "Day-of perimeter + VIP detail.",
    },
    {
      id: "vp_pbw_m3_staff",
      vendor_id: "v_eventforce_mnl",
      vendor_name: "EventForce MNL",
      service: "staffing",
      milestone_id: "ms_pbw_m3",
      amount_usd: 10_000,
      status: "scheduled",
      note: "120 hosts + volunteers across the 3-day run.",
    },
    {
      id: "vp_pbw_m3_fnb",
      vendor_id: "v_purple_oven",
      vendor_name: "Purple Oven Catering",
      service: "catering",
      milestone_id: "ms_pbw_m3",
      amount_usd: 8_000,
      status: "scheduled",
      note: "VIP green room + speakers' lounge F&B.",
    },
    {
      id: "vp_pbw_m3_stream",
      vendor_id: "v_pesoplus_stream",
      vendor_name: "Pesoplus Stream",
      service: "production",
      milestone_id: "ms_pbw_m3",
      amount_usd: 5_000,
      status: "scheduled",
      note: "Live stream + recording (main stage + builders track).",
    },
    {
      id: "vp_pbw_m3_photo",
      vendor_id: "v_manila_photo_co",
      vendor_name: "Manila Photo Co",
      service: "documentation",
      milestone_id: "ms_pbw_m3",
      amount_usd: 5_000,
      status: "scheduled",
      note: "Event photography + b-roll videography.",
    },

    // M4 · Post-event ROI · $25K · scheduled (parent milestone locked)
    {
      id: "vp_pbw_m4_audit",
      vendor_id: "v_clarity_analytics",
      vendor_name: "Clarity Analytics",
      service: "production",
      milestone_id: "ms_pbw_m4",
      amount_usd: 10_000,
      status: "scheduled",
      note: "Attendance + engagement audit · feeds into ROI report.",
    },
    {
      id: "vp_pbw_m4_pr",
      vendor_id: "v_prwire_apac",
      vendor_name: "PR Wire APAC",
      service: "marketing",
      milestone_id: "ms_pbw_m4",
      amount_usd: 8_000,
      status: "scheduled",
      note: "Post-event press release + earned media outreach.",
    },
    {
      id: "vp_pbw_m4_report",
      vendor_id: "v_blockreport_studio",
      vendor_name: "BlockReport Studio",
      service: "documentation",
      milestone_id: "ms_pbw_m4",
      amount_usd: 4_000,
      status: "scheduled",
      note: "Designed post-event report PDF + interactive dashboard.",
    },
    {
      id: "vp_pbw_m4_creator_extension",
      vendor_id: "v_blockbeat_talent",
      vendor_name: "BlockBeat Talent",
      service: "talent",
      milestone_id: "ms_pbw_m4",
      amount_usd: 3_000,
      status: "scheduled",
      note: "Creator thank-you payout + post-event reach extension.",
    },
  ],
};

export function getVendorPayoutsByDealId(dealId: string): VendorPayout[] {
  return VENDOR_PAYOUTS[dealId] ?? [];
}

export function getVendorPayoutsByMilestone(
  dealId: string,
  milestoneId: string,
): VendorPayout[] {
  return getVendorPayoutsByDealId(dealId).filter(
    (p) => p.milestone_id === milestoneId,
  );
}
