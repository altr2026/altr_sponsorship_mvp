import type { Metadata } from "next";
import {
  BadgeCheck,
  BarChart3,
  Handshake,
  ListPlus,
  Receipt,
  Search,
  Users,
} from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { WaitlistForm } from "@/components/shared/waitlist-form";

export const metadata: Metadata = {
  title: "For events",
  description:
    "List once. Match with vetted brands. Get paid faster — milestone payouts in seconds, not weeks.",
  alternates: { canonical: "/events" },
};

const STATS = [
  {
    caption: "Time to first deal",
    value: "21 days",
    context: "From listing to first signed sponsorship.",
  },
  {
    caption: "Sponsor uplift",
    value: "+47%",
    context: "Average versus prior-year direct sales.",
  },
  {
    caption: "Events on the list",
    value: "12+",
    context: "Across APAC and GCC.",
  },
];

const STEPS = [
  {
    icon: ListPlus,
    title: "List your event",
    description:
      "Add your audience profile, packages, and dates. About thirty minutes.",
  },
  {
    icon: Handshake,
    title: "Match with curated brands",
    description:
      "We bring vetted sponsors actively looking for your vertical and region.",
  },
  {
    icon: BadgeCheck,
    title: "Settle on milestones",
    description:
      "Payouts release on contract, pre-event, event day, and post-ROI.",
  },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Pricing intelligence",
    description:
      "Benchmark from twelve plus similar events so you stop leaving money on the table.",
  },
  {
    icon: Users,
    title: "Audience insights",
    description:
      "Your demographic and behavioral data, organized for sponsor decks.",
  },
  {
    icon: Search,
    title: "Sponsor matching",
    description:
      "Brands actively looking for your audience size and budget — pre-screened.",
  },
  {
    icon: Receipt,
    title: "Payment automation",
    description:
      "Milestone-based payouts. Three-second settlement. Verifiable proof of delivery.",
  },
];

const PRICING_TIERS = [
  { tier: "Title sponsor", range: "$200K – $750K" },
  { tier: "Gold", range: "$80K – $250K" },
  { tier: "Silver", range: "$25K – $80K" },
  { tier: "Booth", range: "$5K – $25K" },
];

const FAQ = [
  {
    q: "What does it cost to list?",
    a: "Free during early access. After general availability, we take a small platform fee only on settled deals.",
  },
  {
    q: "How much time does onboarding take?",
    a: "Roughly thirty minutes to add your event, audience profile, and sponsorship packages.",
  },
  {
    q: "Who can see my event data?",
    a: "Only brands you approve. Audience data stays anonymized until a deal is actively in motion.",
  },
  {
    q: "How do contracts work?",
    a: "Standardized templates with milestone-based payouts. You can also bring your own MSA if your legal team prefers it.",
  },
  {
    q: "When do we get paid?",
    a: "Each milestone releases on completion. In supported regions, funds land in your account the same day.",
  },
];

export default function EventsPage() {
  return (
    <>
      <Hero
        eyebrow="For event organizers"
        title="Your sponsorship desk, simplified."
        subtitle="List once. Match with vetted brands. Get paid faster — milestone payouts in seconds, not weeks."
        primaryCta={{ label: "List your event", href: "#waitlist" }}
        secondaryLink={{ label: "See how it works", href: "#how-it-works" }}
        trustLine="12+ events already on the list"
      />

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.caption} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-altr-line2 bg-altr-panel"
      >
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="How it works"
            title="From listing to settled in days, not months."
          />

          <ol className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-caption tabular-nums text-altr-mute">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-px flex-1 bg-gray-200"
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-altr-panel text-altr-lime [&_svg]:h-5 [&_svg]:w-5"
                    >
                      <Icon />
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p className="text-body text-altr-muteSoft">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="What you get"
            title="Tools that pay back the half-day you spend onboarding."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="flex flex-col gap-4 rounded-lg border border-altr-line2 bg-altr-panel p-6"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-altr-lime/10 text-altr-lime [&_svg]:h-5 [&_svg]:w-5"
                  >
                    <Icon />
                  </span>
                  <h3>{feature.title}</h3>
                  <p className="text-body text-altr-muteSoft">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container space-y-10 py-24">
          <SectionHeading
            eyebrow="Pricing intelligence"
            title="See what events like yours are charging."
            subtitle="Benchmarks from twelve plus events in the same vertical and region."
          />

          <div className="overflow-hidden rounded-lg border border-altr-line2 bg-altr-panel">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-altr-line2">
                  <th className="px-6 py-4 text-caption font-medium text-altr-mute">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-caption font-medium text-altr-mute">
                    Median range
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TIERS.map((row, index) => (
                  <tr
                    key={row.tier}
                    className={
                      index !== PRICING_TIERS.length - 1
                        ? "border-b border-altr-line2"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 text-body text-altr-white">
                      {row.tier}
                    </td>
                    <td className="px-6 py-4 font-mono text-body tabular-nums text-altr-white">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-altr-line2 px-6 py-4">
              <span className="text-caption text-altr-mute">
                Based on 12+ similar events in APAC and GCC.
              </span>
              <span className="text-caption font-medium text-altr-lime">
                Available after listing
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container max-w-3xl space-y-10 py-24">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions from event teams."
          />

          <div className="divide-y divide-altr-line2 rounded-lg border border-altr-line2 bg-altr-panel">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 text-body font-medium text-altr-white">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 text-caption text-altr-mute transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-body text-altr-muteSoft">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist" className="border-t border-altr-line2 bg-altr-panel">
        <div className="container grid gap-12 py-24 md:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Early access"
            title="List your event on ALTR."
            subtitle="Tell us a little about the event. We will follow up with onboarding."
          />
          <WaitlistForm defaultPersona="event" source="events_page" />
        </div>
      </section>
    </>
  );
}
