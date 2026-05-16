import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";
import { getEventById } from "@/lib/mock-data/events";

import { ActivationClient } from "./_activation-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `Activation · ${deal.brand_name} × ${deal.event_name}`,
    description: `Approve the activation brief, then capture delivery proof for the ${deal.brand_name} × ${deal.event_name} sponsorship.`,
    robots: { index: false, follow: false },
  };
}

export default function ActivationPage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) notFound();

  const event = getEventById(deal.event_id);
  const tierPackage = event?.sponsor_packages.find((p) => p.tier === deal.tier);
  const deliverables = tierPackage?.perks ?? [];

  return (
    <ActivationClient
      deal={deal}
      deliverables={deliverables}
      eventLocation={event ? `${event.location}, ${event.country}` : null}
    />
  );
}
