import type { Metadata } from "next";

import { events, getEventById, type Event } from "@/lib/mock-data/events";

import { NewDealClient } from "./_new-deal-client";

export const metadata: Metadata = {
  title: "New deal · Demo",
  description:
    "Configure a sponsorship offer: pick a package, set milestones, choose the settlement rail.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: {
    event?: string;
    tier?: string;
  };
};

export default function NewDealPage({ searchParams }: PageProps) {
  const requested = searchParams.event
    ? getEventById(searchParams.event)
    : undefined;
  const event: Event = requested ?? events[0];
  const initialTier =
    event.sponsor_packages.find((p) => p.tier === searchParams.tier)?.tier ??
    "Title";

  return <NewDealClient event={event} initialTier={initialTier} />;
}
