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

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { WaitlistForm } from "@/components/shared/waitlist-form";
import { cn } from "@/lib/utils";

const HERO_DEFAULT = {
  eyebrow: "Sponsorship OS for APAC + GCC",
  title: "Sponsorship that pays for itself.",
  subtitle:
    "Discover events, deal directly with brands, settle on XRPL — and measure ROI in one place.",
  primaryCta: { label: "Get early access", href: "#waitlist" },
  secondaryLink: { label: "See how it works", href: "#how-it-works" },
  trustLine: "Trusted by Ultra · Wanderlust · 12+ partners",
};

const HERO_EVENT = {
  eyebrow: "For event organizers",
  title: "Your sponsorship desk, simplified.",
  subtitle:
    "List once. Match with vetted brands. Get paid faster — with milestone payouts settled on XRPL.",
  primaryCta: { label: "List your event", href: "#waitlist" },
  secondaryLink: { label: "See how it works", href: "#how-it-works" },
  trustLine: "12+ events already on the list",
};

const PARTNERS = [
  { name: "Ultra", placeholder: false },
  { name: "Wanderlust", placeholder: false },
  { name: "Coming soon", placeholder: true },
  { name: "Coming soon", placeholder: true },
  { name: "Coming soon", placeholder: true },
];

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

type HomePageProps = {
  searchParams: {
    role?: string;
  };
};

export default function HomePage({ searchParams }: HomePageProps) {
  const hero = searchParams.role === "event" ? HERO_EVENT : HERO_DEFAULT;

  return (
    <>
      <Hero {...hero} />

      <section className="border-t border-gray-200 bg-white">
        <div className="container py-10">
          <p className="text-caption text-gray-500">Working with</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-3">
            {PARTNERS.map((partner, index) =>
              partner.placeholder ? (
                <span
                  key={`partner-${index}`}
                  className="rounded-md border border-dashed border-gray-200 px-3 py-1 text-caption text-gray-400"
                >
                  {partner.name}
                </span>
              ) : (
                <span
                  key={`partner-${index}`}
                  className="text-h3 font-medium tracking-tight text-gray-400"
                >
                  {partner.name}
                </span>
              ),
            )}
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
