import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  Globe2,
  Receipt,
  X,
} from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { events } from "@/lib/mock-data/events";

const VERTICALS = ["Music", "Conference", "Fashion", "Wellness"] as const;
const REGIONS = ["SEA", "KR + JP", "GCC"] as const;

const MATRIX: Record<
  (typeof VERTICALS)[number],
  Record<(typeof REGIONS)[number], { count: number; range: string }>
> = {
  Music: {
    SEA: { count: 12, range: "$50K – $2M" },
    "KR + JP": { count: 8, range: "$80K – $3M" },
    GCC: { count: 6, range: "$100K – $5M" },
  },
  Conference: {
    SEA: { count: 15, range: "$30K – $500K" },
    "KR + JP": { count: 10, range: "$50K – $800K" },
    GCC: { count: 4, range: "$80K – $1M" },
  },
  Fashion: {
    SEA: { count: 6, range: "$40K – $300K" },
    "KR + JP": { count: 4, range: "$60K – $500K" },
    GCC: { count: 8, range: "$100K – $2M" },
  },
  Wellness: {
    SEA: { count: 9, range: "$20K – $200K" },
    "KR + JP": { count: 3, range: "$30K – $300K" },
    GCC: { count: 2, range: "$50K – $500K" },
  },
};

const FEATURES = [
  {
    icon: Globe2,
    title: "Curated events",
    description:
      "A hundred plus events across APAC and GCC, vetted on audience quality and operational reliability.",
  },
  {
    icon: Receipt,
    title: "Transparent pricing",
    description:
      "Real ranges, no PDF deck back-and-forth. See the price before you spend a meeting on it.",
  },
  {
    icon: BarChart3,
    title: "ROI measurement",
    description:
      "Built-in dashboard with reach, EMV, and conversion data wired directly to your spend.",
  },
  {
    icon: Database,
    title: "Verified audience data",
    description:
      "Demographic and behavioral data from event teams, normalized so you can compare across markets.",
  },
];

const COMPARISON: Array<{ category: string; old: string; altr: string }> = [
  {
    category: "Discovery",
    old: "Cold email and conference networking",
    altr: "One curated marketplace across APAC and GCC",
  },
  {
    category: "Pricing",
    old: "Custom PDF decks per event",
    altr: "Standardized tiers and median ranges",
  },
  {
    category: "Settlement",
    old: "SWIFT wires, 5 day clearing",
    altr: "XRPL settlement in 3 seconds",
  },
  {
    category: "Fees",
    old: "$5,000+ per international wire",
    altr: "Under 1% all-in, no per-wire charges",
  },
  {
    category: "ROI",
    old: "Self-reported impressions in a Google Sheet",
    altr: "Onchain proof of delivery and live ROI dashboard",
  },
];

function formatAttendees(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

export default function BrandsPage() {
  return (
    <>
      <Hero
        eyebrow="For sponsor brands"
        title="Every sponsorship in one place."
        subtitle="Transparent pricing. Audience data. ROI you can prove."
        primaryCta={{ label: "Get early access", href: "#waitlist" }}
        secondaryLink={{ label: "Browse events", href: "#events" }}
        trustLine="Built for marketing teams across APAC and GCC"
      />

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-10 py-24">
          <SectionHeading
            eyebrow="The market"
            title="One view across every vertical and region."
            subtitle="Event counts and median sponsor pricing as we have catalogued so far."
          />

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-caption font-medium text-gray-500">
                    Vertical
                  </th>
                  {REGIONS.map((region) => (
                    <th
                      key={region}
                      className="px-6 py-4 text-caption font-medium text-gray-500"
                    >
                      {region}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VERTICALS.map((vertical, index) => (
                  <tr
                    key={vertical}
                    className={
                      index !== VERTICALS.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }
                  >
                    <td className="px-6 py-5 text-body font-medium text-gray-900">
                      {vertical}
                    </td>
                    {REGIONS.map((region) => {
                      const cell = MATRIX[vertical][region];
                      return (
                        <td key={region} className="px-6 py-5">
                          <div className="text-body text-gray-900">
                            {cell.count} events
                          </div>
                          <div className="font-mono text-caption tabular-nums text-gray-500">
                            {cell.range}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="What you get"
            title="A sponsorship desk that runs on data, not relationships."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700 [&_svg]:h-5 [&_svg]:w-5"
                  >
                    <Icon />
                  </span>
                  <h3>{feature.title}</h3>
                  <p className="text-body text-gray-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="events" className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="Featured events"
            title="A taste of the catalogue."
            subtitle="Pricing and audience data unlock for approved brands after listing."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-caption font-medium text-teal-700">
                    {event.vertical}
                  </span>
                  <span className="text-caption text-gray-500">
                    {event.region}
                  </span>
                </div>
                <h3>{event.name}</h3>
                <p className="text-body text-gray-600">
                  {event.location}, {event.country} · {event.date}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                  <div>
                    <div className="font-mono text-caption tabular-nums text-gray-500">
                      Audience
                    </div>
                    <div className="font-mono text-body tabular-nums text-gray-900">
                      {formatAttendees(event.attendees)}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-caption font-medium text-gray-700">
                    Login to see details
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="container space-y-10 py-24">
          <SectionHeading
            eyebrow="Why ALTR"
            title="The difference, side by side."
          />

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-200 bg-gray-50">
              <div className="px-6 py-4 text-caption font-medium text-gray-500">
                Category
              </div>
              <div className="px-6 py-4 text-caption font-medium text-gray-500">
                The old way
              </div>
              <div className="px-6 py-4 text-caption font-medium text-teal-700">
                With ALTR
              </div>
            </div>
            {COMPARISON.map((row, index) => (
              <div
                key={row.category}
                className={
                  "grid grid-cols-[1fr_1fr_1fr]" +
                  (index !== COMPARISON.length - 1
                    ? " border-b border-gray-200"
                    : "")
                }
              >
                <div className="px-6 py-5 text-body font-medium text-gray-900">
                  {row.category}
                </div>
                <div className="flex items-start gap-2 px-6 py-5 text-body text-gray-600">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>{row.old}</span>
                </div>
                <div className="flex items-start gap-2 px-6 py-5 text-body text-gray-900">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                    aria-hidden="true"
                  />
                  <span>{row.altr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist" className="border-t border-gray-200 bg-gray-50">
        <div className="container grid gap-12 py-24 md:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Early access"
            title="Get a closer look at the catalogue."
            subtitle="Tell us about your brand and we will open access to event pricing and audience data."
          />
          <WaitlistForm defaultPersona="brand" source="brands_page" />
        </div>
      </section>
    </>
  );
}
