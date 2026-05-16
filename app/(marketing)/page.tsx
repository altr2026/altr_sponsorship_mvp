import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Handshake,
  Layers,
  ListPlus,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { events } from "@/lib/mock-data/events";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const HERO_DEFAULT = {
  eyebrow: "Sponsorship OS for APAC + GCC",
  title: "Sponsorship that pays for itself.",
  subtitle:
    "Discover events, deal directly with brands, settle on XRPL in three seconds, measure ROI on-chain.",
  primaryCta: { label: "Get early access", href: "#waitlist" },
};

const HERO_EVENT = {
  eyebrow: "For event organizers",
  title: "Your sponsorship desk, simplified.",
  subtitle:
    "List once. Match with vetted brands. Get paid faster — settled on XRPL in three seconds.",
  primaryCta: { label: "List your event", href: "#waitlist" },
};

const PATHS = [
  {
    icon: CalendarDays,
    title: "For events",
    description:
      "List once, match with brands actively looking for your audience.",
    href: "/events",
    comingSoon: false,
  },
  {
    icon: Briefcase,
    title: "For brands",
    description:
      "Every sponsorship in one place, with transparent pricing and audience data.",
    href: "/brands",
    comingSoon: false,
  },
  {
    icon: Layers,
    title: "For agencies",
    description:
      "White-label the platform for your clients. Same workflow, your brand.",
    href: "#",
    comingSoon: true,
  },
];

const STEPS = [
  {
    icon: ListPlus,
    title: "List",
    description:
      "Add your event in thirty minutes. Audience, pricing, and packages in one place.",
  },
  {
    icon: Handshake,
    title: "Match",
    description:
      "We bring vetted brands actively looking for your audience and budget.",
  },
  {
    icon: BadgeCheck,
    title: "Settle and measure",
    description:
      "Milestone payouts on XRPL. Onchain receipts. ROI you can show your board.",
  },
];

const INSIGHTS = [
  {
    tag: "Market data",
    title: "GCC sponsorship hits 6.88 billion in 2025",
    excerpt:
      "Saudi Arabia and the UAE drove twelve percent of new deal volume across music and sports.",
    date: "Apr 2026",
  },
  {
    tag: "Pricing",
    title: "Music festival pricing: APAC versus GCC",
    excerpt:
      "Title sponsorships in Seoul run thirty percent below Dubai for the same audience size.",
    date: "Mar 2026",
  },
  {
    tag: "Trends",
    title: "Why Saudi Arabia is the next sponsorship frontier",
    excerpt:
      "Vision 2030 and a young population are pulling global brands into the kingdom.",
    date: "Feb 2026",
  },
];

function formatAttendees(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function formatTitlePrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

type HomePageProps = {
  searchParams: {
    role?: string;
  };
};

export default function HomePage({ searchParams }: HomePageProps) {
  const hero = searchParams.role === "event" ? HERO_EVENT : HERO_DEFAULT;
  const marqueeEvents = [...events, ...events];

  return (
    <>
      {/* STEP 0 — the hook */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-altr-pink/20 blur-3xl"
        />
        <div className="container px-6 pb-12 pt-20 text-center sm:pb-16 sm:pt-28 md:pt-36">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-caption font-medium text-teal-700">
              <span aria-hidden="true" className="h-2 w-2 bg-altr-pink" />
              {hero.eyebrow}
            </span>
            <h1 className="mx-auto max-w-5xl text-balance text-[44px] font-medium leading-[1.02] tracking-[-0.035em] text-gray-900 sm:text-[64px] md:text-[80px]">
              {hero.title}
            </h1>
            <p className="mx-auto max-w-xl text-body text-gray-600">
              {hero.subtitle}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href={hero.primaryCta.href}
              className="inline-flex h-12 items-center rounded-md bg-teal-600 px-6 text-body font-medium text-white transition-colors hover:bg-teal-700"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 text-body font-medium text-gray-900 transition-colors hover:text-teal-700"
            >
              See how it works
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Live event marquee */}
        <div className="border-y border-gray-200 bg-white py-8">
          <div className="container mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-caption">
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2 items-center justify-center"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-altr-pink opacity-60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-altr-pink" />
              </span>
              <span className="font-medium text-gray-900">Live</span>
              <span className="text-gray-400" aria-hidden="true">·</span>
              <span className="text-gray-500">
                {events.length} events accepting sponsors across APAC and GCC
              </span>
            </div>
            <Link
              href="/brands#events"
              className="hidden text-caption font-medium text-teal-700 transition-colors hover:underline sm:inline"
            >
              Browse all →
            </Link>
          </div>

          <div className="overflow-hidden">
            <div className="flex w-max gap-4 pl-6 [animation:marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
              {marqueeEvents.map((event, index) => {
                const titlePackage = event.sponsor_packages.find(
                  (p) => p.tier === "Title",
                );
                return (
                  <article
                    key={`${event.id}-${index}`}
                    aria-hidden={index >= events.length ? "true" : undefined}
                    className="flex w-[300px] shrink-0 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-medium text-teal-700">
                        {event.vertical}
                      </span>
                      <span className="font-mono text-caption text-gray-500">
                        {event.region}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium tracking-tight">
                        {event.name}
                      </h3>
                      <p className="mt-1 text-caption text-gray-500">
                        {event.location}, {event.country}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
                      <div>
                        <div className="font-mono text-caption text-gray-500">
                          Audience
                        </div>
                        <div className="font-mono text-body tabular-nums text-gray-900">
                          {formatAttendees(event.attendees)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-caption text-gray-500">
                          Title
                        </div>
                        <div className="font-mono text-body tabular-nums text-gray-900">
                          {titlePackage
                            ? formatTitlePrice(titlePackage.price)
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="Three paths"
            title="One platform, every sponsorship role."
            subtitle="Whether you run an event, market a brand, or service both as an agency."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {PATHS.map((path) => {
              const Icon = path.icon;
              const cardBody = (
                <div
                  className={cn(
                    "group flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 transition-colors",
                    !path.comingSoon && "hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700 [&_svg]:h-5 [&_svg]:w-5"
                    >
                      <Icon />
                    </span>
                    {path.comingSoon ? (
                      <span className="rounded-md border border-gray-200 px-2 py-0.5 text-caption text-gray-500">
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                  <h3>{path.title}</h3>
                  <p className="text-body text-gray-600">{path.description}</p>
                  {!path.comingSoon ? (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-body font-medium text-teal-700">
                      Learn more
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  ) : null}
                </div>
              );

              return path.comingSoon ? (
                <div key={path.title}>{cardBody}</div>
              ) : (
                <Link
                  key={path.title}
                  href={path.href}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  {cardBody}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-gray-200 bg-gray-50">
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
                    <span className="font-mono text-caption tabular-nums text-gray-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-px flex-1 bg-gray-200"
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-teal-700 [&_svg]:h-5 [&_svg]:w-5"
                    >
                      <Icon />
                    </span>
                  </div>
                  <h3>{step.title}</h3>
                  <p className="text-body text-gray-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="container max-w-3xl space-y-10 py-24">
          <SectionHeading
            eyebrow="Why we exist"
            title="Sponsorship is broken. We're fixing it."
          />

          <div className="space-y-6 text-body text-gray-700">
            <p>
              Sponsorship today still runs on PDF decks, three-week deal cycles,
              and SWIFT wires that arrive a week after the event ends. Brands
              cannot compare offers across markets. Events cannot price what
              they are worth. Nobody can prove the ROI.
            </p>
            <p>
              We are building ALTR because APAC and GCC are growing twelve
              percent a year, and there is still no operating system for
              sponsorship in either region. The companies running the next
              decade of festivals, conferences, and brand activations deserve
              better tools.
            </p>
            <p>
              We built on XRPL because settlement should take three seconds, not
              five days. Onchain memos let brands and events share a single
              source of truth for what was agreed and paid — without trusting a
              middleman with the funds.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="From the lab"
            title="Latest market data and pricing benchmarks."
            subtitle="A monthly read on what is happening in APAC and GCC sponsorship."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {INSIGHTS.map((insight) => (
              <article
                key={insight.title}
                className="flex h-full flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
              >
                <span className="text-caption font-medium text-teal-700">
                  {insight.tag}
                </span>
                <h3>{insight.title}</h3>
                <p className="text-body text-gray-600">{insight.excerpt}</p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-caption text-gray-500">
                    {insight.date}
                  </span>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-1 text-caption font-medium text-gray-700 hover:text-teal-700"
                  >
                    Read more
                    <ArrowUpRight
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-body font-medium text-teal-700"
            >
              All insights
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="waitlist" className="border-t border-gray-200">
        <div className="container grid gap-12 py-24 md:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Early access"
            title="Join brands and events shaping the rollout."
            subtitle="Tell us a little about you. We will reach out as access opens for your region."
          />
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
