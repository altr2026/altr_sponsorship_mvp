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
  eyebrow: "Sponsorship OS · APAC + GCC",
  titleLead: "Match. Deal.",
  titleAccent: "Settle in 3 seconds.",
  subtitle:
    "Match with the right brands. Close deals faster. Prove ROI every time.",
  primaryCtaLabel: "Get early access",
  defaultPersona: "brand" as const,
};

const HERO_EVENT = {
  eyebrow: "For event organizers",
  titleLead: "Your sponsorship desk,",
  titleAccent: "simplified.",
  subtitle:
    "List once. Match with vetted brands. Get paid faster.",
  primaryCtaLabel: "List your event",
  defaultPersona: "event" as const,
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
      "Milestone payouts. Verifiable receipts. ROI you can show your board.",
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
        {/* grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* teal glow — top right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[100px] -top-[180px] -z-10 h-[400px] w-[400px] rounded-full opacity-[0.35] blur-[60px]"
          style={{ background: "#1D9E75" }}
        />
        {/* lime glow — bottom left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[150px] -left-[80px] -z-10 h-[300px] w-[300px] rounded-full opacity-[0.15] blur-[60px]"
          style={{ background: "#C8F04A" }}
        />
        <div className="container px-6 pb-12 pt-20 sm:pb-16 sm:pt-28 md:pt-36">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-caption font-medium text-altr-lime">
              <span aria-hidden="true" className="h-2 w-2 bg-altr-lime" />
              {hero.eyebrow}
            </span>
            <h1 className="max-w-5xl text-balance text-[44px] font-medium leading-[1.02] tracking-[-0.035em] text-altr-white sm:text-[64px] md:text-[80px]">
              {hero.titleLead}{" "}
              <span className="block text-teal-600 sm:inline">
                {hero.titleAccent}
              </span>
            </h1>
            <p className="max-w-xl text-body text-altr-muteSoft">
              {hero.subtitle}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/demo"
              className="inline-flex h-12 items-center gap-1.5 rounded-md bg-teal-600 px-6 text-body font-medium text-white transition-colors hover:brightness-110"
            >
              See how it works
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#waitlist"
              className="inline-flex h-12 items-center rounded-md border border-altr-line2 px-6 text-body font-medium text-altr-white transition-colors hover:border-altr-mute"
            >
              Get early access
            </Link>
          </div>
        </div>

        {/* Live event marquee */}
        <div className="border-y border-altr-line2 bg-altr-panel py-8">
          <div className="container mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-caption">
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2 items-center justify-center"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-teal-500 opacity-60" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-teal-500" />
              </span>
              <span className="font-medium text-altr-white">Live</span>
              <span className="text-altr-mute" aria-hidden="true">·</span>
              <span className="text-altr-muteSoft">
                {events.length} events accepting sponsors across APAC and GCC
              </span>
            </div>
            <Link
              href="/brands#events"
              className="hidden text-caption font-medium text-teal-400 transition-colors hover:underline sm:inline"
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
                    className="flex w-[300px] shrink-0 flex-col gap-3 rounded-lg border border-altr-line2 bg-altr-black p-5 transition-colors hover:border-altr-mute"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-medium text-teal-400">
                        {event.vertical}
                      </span>
                      <span className="font-mono text-caption text-altr-mute">
                        {event.region}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium tracking-tight text-altr-white">
                        {event.name}
                      </h3>
                      <p className="mt-1 text-caption text-altr-mute">
                        {event.location}, {event.country}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-altr-line2 pt-3">
                      <div>
                        <div className="font-mono text-caption text-altr-mute">
                          Audience
                        </div>
                        <div className="font-mono text-body tabular-nums text-altr-white">
                          {formatAttendees(event.attendees)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-caption text-altr-mute">
                          Title
                        </div>
                        <div className="font-mono text-body tabular-nums text-altr-white">
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

      <section className="border-t border-altr-line2">
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
                    "group flex h-full flex-col gap-4 rounded-lg border border-altr-line2 bg-altr-panel p-6 transition-colors",
                    !path.comingSoon && "hover:border-altr-mute hover:bg-altr-line",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-altr-lime/10 text-altr-lime [&_svg]:h-5 [&_svg]:w-5"
                    >
                      <Icon />
                    </span>
                    {path.comingSoon ? (
                      <span className="rounded-md border border-altr-line2 px-2 py-0.5 text-caption text-altr-mute">
                        Coming soon
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-altr-white">{path.title}</h3>
                  <p className="text-body text-altr-muteSoft">
                    {path.description}
                  </p>
                  {!path.comingSoon ? (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-body font-medium text-altr-lime">
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
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-altr-lime/40"
                >
                  {cardBody}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-altr-line2 bg-altr-panel">
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
                      className="h-px flex-1 bg-altr-line2"
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-altr-black text-altr-lime [&_svg]:h-5 [&_svg]:w-5"
                    >
                      <Icon />
                    </span>
                  </div>
                  <h3 className="text-altr-white">{step.title}</h3>
                  <p className="text-body text-altr-muteSoft">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container max-w-3xl space-y-10 py-24">
          <SectionHeading
            eyebrow="Why we exist"
            title="Sponsorship is broken. We're fixing it."
          />

          <div className="space-y-6 text-body text-altr-muteSoft">
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
              Settlement should take three seconds, not five days. We built
              ALTR so brands and events share a single source of truth for
              every deal — without the lag, the fees, and the trust gap of
              cross-border wires.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-altr-line2 bg-altr-panel">
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
                className="flex h-full flex-col gap-4 rounded-lg border border-altr-line2 bg-altr-black p-6"
              >
                <span className="text-caption font-medium text-altr-lime">
                  {insight.tag}
                </span>
                <h3 className="text-altr-white">{insight.title}</h3>
                <p className="text-body text-altr-muteSoft">{insight.excerpt}</p>
                <div className="mt-auto flex items-center justify-between border-t border-altr-line2 pt-4">
                  <span className="text-caption text-altr-mute">
                    {insight.date}
                  </span>
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-1 text-caption font-medium text-altr-muteSoft hover:text-altr-lime"
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
              className="inline-flex items-center gap-1.5 text-body font-medium text-altr-lime"
            >
              All insights
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="waitlist" className="border-t border-altr-line2">
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
