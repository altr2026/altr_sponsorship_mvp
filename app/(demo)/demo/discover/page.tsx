import type { Metadata } from "next";

import { events } from "@/lib/mock-data/events";

import { DiscoverClient } from "./_discover-client";

export const metadata: Metadata = {
  title: "Discover · Demo",
  description:
    "Browse vetted live events across APAC and GCC. Filter by vertical, region, audience size, and sponsorship budget.",
  robots: { index: false, follow: false },
};

export default function DiscoverPage() {
  return <DiscoverClient events={events} />;
}
