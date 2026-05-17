import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";
import { getEventById, events } from "@/lib/mock-data/events";
import { getRoiReportByDealId } from "@/lib/mock-data/roi-reports";

import { RenewalClient } from "./_renewal-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `Renewal · ${deal.brand_name} × ${deal.event_name}`,
    description: `Pre-filled renewal proposal anchored to the verified ROI of last year's ${deal.brand_name} × ${deal.event_name} sponsorship.`,
    robots: { index: false, follow: false },
  };
}

const EXPANSION_PICKS = [
  "evt_ultra_korea_2026",
  "evt_soundstorm_2026",
  "evt_dubai_design_week_2026",
] as const;

export default function RenewalPage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) notFound();

  const sourceEvent = getEventById(deal.event_id);
  const roi = getRoiReportByDealId(deal.id);

  const expansionEvents = EXPANSION_PICKS
    .map((id) => getEventById(id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => e.id !== deal.event_id);

  // Fall back to other events from mock-data if the curated picks aren't found.
  const fallbackExpansion =
    expansionEvents.length > 0
      ? expansionEvents
      : events.filter((e) => e.id !== deal.event_id).slice(0, 3);

  return (
    <RenewalClient
      deal={deal}
      sourceEvent={sourceEvent ?? null}
      roi={roi ?? null}
      expansionEvents={fallbackExpansion}
    />
  );
}
