import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Why we are building ALTR. The sponsorship operating system for APAC and GCC.",
  alternates: { canonical: "/manifesto" },
};

const PRINCIPLES = [
  {
    eyebrow: "Principle 01",
    title: "Sponsorship deserves software.",
    body: "Sponsorship is a hundred-billion-dollar global market that still runs on cold email, PDF decks, and SWIFT wires. Events lose deals because they cannot price what they are worth. Brands lose campaigns because they cannot compare what they are buying. Everyone loses time because the workflow is glued together with relationships instead of software.",
  },
  {
    eyebrow: "Principle 02",
    title: "The window is APAC and GCC.",
    body: "APAC and GCC are growing twelve to fourteen percent a year. There is no dominant operating system for sponsorship in either region — only fragmented agencies and one-off relationships. That is the window we are building into.",
  },
  {
    eyebrow: "Principle 03",
    title: "Settlement in three seconds, not five days.",
    body: "We built ALTR so brands and events share a single source of truth for every deal — without the lag, the fees, and the trust gap of cross-border wires. Once settlement is proven, reputation-based credit turns this from a marketplace into infrastructure.",
  },
];

export default function ManifestoPage() {
  return (
    <>
      <Hero
        eyebrow="Manifesto"
        title="Why we are building ALTR."
        subtitle="Sponsorship deserves better than cold emails and PDF decks. The three principles below are why we started, and why we keep going."
        primaryCta={{ label: "See the roadmap", href: "/roadmap" }}
        secondaryLink={{ label: "View pricing", href: "/pricing" }}
      />

      <section className="border-t border-altr-line2">
        <div className="container max-w-3xl space-y-16 py-24">
          {PRINCIPLES.map((p) => (
            <article key={p.eyebrow} className="space-y-3">
              <span className="text-caption font-medium text-altr-lime">
                {p.eyebrow}
              </span>
              <h2 className="text-altr-white">{p.title}</h2>
              <p className="text-body text-altr-muteSoft">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container flex flex-col items-start gap-6 py-20 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            eyebrow="What comes next"
            title="Five phases, one direction."
            subtitle="Each phase ships a working product. Each unlocks the next."
          />
          <Link
            href="/roadmap"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-altr-lime px-6 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-altr-black transition-all hover:brightness-110"
          >
            Read the roadmap
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
