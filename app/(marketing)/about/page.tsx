import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Building the sponsorship OS for APAC and GCC — manifesto, roadmap, and team behind ALTR.",
  alternates: { canonical: "/about" },
};

const PHASES = [
  {
    label: "Phase 0",
    title: "Marketing and waitlist",
    description: "altr.haus live with the founding waitlist for events and brands.",
    status: "Live",
  },
  {
    label: "Phase 1",
    title: "Brand onboarding and curated discovery",
    description: "First brands match with founding events. Pricing intelligence opens.",
    status: "Q3 2026",
  },
  {
    label: "Phase 2",
    title: "Direct deal flow",
    description: "Standard contracts, milestone configuration, Stripe rails for fiat.",
    status: "Q4 2026",
  },
  {
    label: "Phase 3",
    title: "XRPL milestone settlement",
    description: "Onchain escrow with RLUSD, three-second settlement, public proof.",
    status: "Q1 2027",
  },
  {
    label: "Phase 4",
    title: "Sponsorship financing",
    description: "Onchain reputation unlocks BNPL credit for events with track record.",
    status: "Q2 2027",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About"
        title="Building the sponsorship OS for APAC and GCC."
        subtitle="We believe sponsorship deserves better than cold emails and PDF decks."
        primaryCta={{ label: "Read the manifesto", href: "#manifesto" }}
        secondaryLink={{ label: "See the roadmap", href: "#roadmap" }}
      />

      <section
        id="manifesto"
        className="border-t border-altr-line2"
      >
        <div className="container max-w-3xl space-y-10 py-24">
          <SectionHeading
            eyebrow="Manifesto"
            title="Why we are building ALTR."
          />

          <div className="space-y-6 text-body text-altr-muteSoft">
            <p>
              Sponsorship is a hundred billion dollar global market that still
              runs on cold email, PDF decks, and SWIFT wires. Events lose deals
              because they cannot price what they are worth. Brands lose
              campaigns because they cannot compare what they are buying.
              Everyone loses time because the workflow is glued together with
              relationships instead of software.
            </p>
            <p>
              APAC and GCC are growing twelve to fourteen percent a year. There
              is no dominant operating system for sponsorship in either region
              — only fragmented agencies and one-off relationships. That is the
              window we are building into.
            </p>
            <p>
              We built ALTR on XRPL because settlement should take three
              seconds, not five days. Onchain memos let brands and events share
              a single source of truth for what was agreed and what was paid —
              without trusting a middleman with the money. Once settlement is
              proven, onchain reputation unlocks the financing that turns this
              from a marketplace into infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-t border-altr-line2 bg-altr-panel">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="Roadmap"
            title="Five phases, one direction."
            subtitle="Each phase ships a working product. Each unlocks the next."
          />

          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {PHASES.map((phase) => (
              <li
                key={phase.label}
                className="flex h-full flex-col gap-3 rounded-lg border border-altr-line2 bg-altr-panel p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-caption tabular-nums text-altr-mute">
                    {phase.label}
                  </span>
                  <span
                    className={
                      "text-caption font-medium " +
                      (phase.status === "Live"
                        ? "text-teal-400"
                        : "text-altr-mute")
                    }
                  >
                    {phase.status}
                  </span>
                </div>
                <h3>{phase.title}</h3>
                <p className="text-body text-altr-muteSoft">{phase.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container grid gap-12 py-24 md:grid-cols-2">
          <div className="space-y-4">
            <span className="text-caption font-medium text-teal-400">Team</span>
            <h2>Founders to be announced.</h2>
            <p className="text-body text-altr-muteSoft">
              ALTR is being built by a small team across Seoul and Dubai. Full
              team and biographies will be added here closer to launch.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-caption font-medium text-teal-400">
              Investors
            </span>
            <h2>In conversation.</h2>
            <p className="text-body text-altr-muteSoft">
              We are in active conversations with a small number of strategic
              partners. Announcements will land here when there is something
              concrete to share.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container grid gap-12 py-24 md:grid-cols-[1fr_1fr]">
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch."
            subtitle="For partnerships, press, and everything else, the team reads every email."
          />
          <div className="flex flex-col gap-3">
            <Link
              href="mailto:hello@altr.haus"
              className="inline-flex items-center justify-between rounded-lg border border-altr-line2 bg-altr-panel px-6 py-5 transition-colors hover:border-altr-mute"
            >
              <div className="flex flex-col">
                <span className="text-caption text-altr-mute">Email</span>
                <span className="text-body font-medium text-gray-900">
                  hello@altr.haus
                </span>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-altr-mute"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="https://twitter.com/altr2026"
              className="inline-flex items-center justify-between rounded-lg border border-altr-line2 bg-altr-panel px-6 py-5 transition-colors hover:border-altr-mute"
            >
              <div className="flex flex-col">
                <span className="text-caption text-altr-mute">Twitter</span>
                <span className="text-body font-medium text-gray-900">
                  @altr2026
                </span>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-altr-mute"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="https://linkedin.com/company/altr2026"
              className="inline-flex items-center justify-between rounded-lg border border-altr-line2 bg-altr-panel px-6 py-5 transition-colors hover:border-altr-mute"
            >
              <div className="flex flex-col">
                <span className="text-caption text-altr-mute">LinkedIn</span>
                <span className="text-body font-medium text-gray-900">
                  /company/altr2026
                </span>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-altr-mute"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
