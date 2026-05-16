import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/shared/hero";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Five phases from waitlist to sponsorship financing. Each phase ships a working product.",
  alternates: { canonical: "/roadmap" },
};

const PHASES = [
  {
    label: "Phase 0",
    title: "Marketing and waitlist",
    description:
      "altr.haus live with the founding waitlist for events and brands. The page you are reading.",
    status: "Live",
    timeline: "Now",
  },
  {
    label: "Phase 1",
    title: "Brand onboarding and curated discovery",
    description:
      "First brands match with founding events. Pricing intelligence opens — what a tier is worth, vs. what it costs.",
    status: "Building",
    timeline: "Q3 2026",
  },
  {
    label: "Phase 2",
    title: "Direct deal flow",
    description:
      "Standard contracts, milestone configuration, Stripe rails for fiat. The deal moves from email to dashboard.",
    status: "Next",
    timeline: "Q4 2026",
  },
  {
    label: "Phase 3",
    title: "Milestone settlement",
    description:
      "Three-second settlement on XRPL. Verifiable proof of delivery for every milestone. POE NFT mints per closed deal.",
    status: "Next",
    timeline: "Q1 2027",
  },
  {
    label: "Phase 4",
    title: "Sponsorship financing",
    description:
      "Reputation-based credit unlocks financing for events with a track record. Marketplace becomes infrastructure.",
    status: "Future",
    timeline: "Q2 2027",
  },
];

const STATUS_TONE: Record<string, string> = {
  Live: "text-altr-lime",
  Building: "text-altr-lime",
  Next: "text-altr-muteSoft",
  Future: "text-altr-mute",
};

export default function RoadmapPage() {
  return (
    <>
      <Hero
        eyebrow="Roadmap"
        title="Five phases, one direction."
        subtitle="Each phase ships a working product. Each unlocks the next. We publish dates so you can hold us to them."
        primaryCta={{ label: "Join the waitlist", href: "/#waitlist" }}
        secondaryLink={{ label: "Read the manifesto", href: "/manifesto" }}
      />

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container space-y-12 py-24">
          <ol className="relative space-y-6">
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-[19px] top-2 hidden w-px bg-altr-line2 md:block"
            />
            {PHASES.map((phase) => (
              <li
                key={phase.label}
                className="grid gap-4 md:grid-cols-[140px_1fr] md:gap-6"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-altr-line2 bg-altr-black font-mono text-[11px] font-bold text-altr-muteSoft md:grid"
                  >
                    {phase.label.split(" ")[1]}
                  </span>
                  <div>
                    <div className="font-mono text-caption uppercase tracking-[0.18em] text-altr-mute">
                      {phase.label}
                    </div>
                    <div className={"mt-1 font-mono text-[11px] uppercase tracking-[0.18em] " + (STATUS_TONE[phase.status] ?? "text-altr-mute")}>
                      {phase.status} · {phase.timeline}
                    </div>
                  </div>
                </div>
                <article className="rounded-lg border border-altr-line2 bg-altr-panel p-6">
                  <h3 className="text-altr-white">{phase.title}</h3>
                  <p className="mt-3 text-body text-altr-muteSoft">
                    {phase.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container flex flex-col items-start gap-6 py-20 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <span className="text-caption font-medium text-altr-lime">
              Want a closer look?
            </span>
            <h2 className="text-altr-white">See the demo before the roadmap ships.</h2>
            <p className="text-body text-altr-muteSoft">
              The settlement and POE-mint flows are running on XRPL testnet today. Walk through them in the demo.
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
          >
            Open the demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
