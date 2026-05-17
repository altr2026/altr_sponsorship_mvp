import type { Metadata } from "next";

import { EventBriefClient } from "./_event-brief-client";

export const metadata: Metadata = {
  title: "Build your sponsor brief · Demo",
  description:
    "Event-side intake. Tell ALTR who you want at your event — vertical, tier focus, audience signal — and we draft the matching brands, the deck, and the deal contracts.",
  robots: { index: false, follow: false },
};

export default function EventBriefPage() {
  return <EventBriefClient />;
}
