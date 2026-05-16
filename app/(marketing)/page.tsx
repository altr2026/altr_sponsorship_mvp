import { CircuitBoard, Globe2, Wallet } from "lucide-react";

import { FeatureCard } from "@/components/shared/feature-card";
import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { WaitlistForm } from "@/components/shared/waitlist-form";

export default function HomePage() {
  return (
    <>
      <Hero
        title="Sponsorship OS for live events."
        subtitle="Discover events, settle deals on XRPL in three seconds, measure ROI on-chain. Built for APAC and GCC."
        primaryCta={{ label: "Get early access", href: "#waitlist" }}
        secondaryLink={{ label: "See the demo", href: "/demo" }}
        trustLine="Pilot partners across Seoul, Dubai, and Singapore"
      />

      <section id="product" className="border-t border-gray-200">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="Product"
            title="One platform for the full sponsorship lifecycle."
            subtitle="Replace cold emails, PDF decks, and SWIFT wires with discovery, deals, settlement, and measurement in one place."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Globe2 />}
              title="Discover"
              description="A standardized feed of APAC and GCC live events with verified attendance and audience data."
            />
            <FeatureCard
              icon={<Wallet />}
              title="Settle"
              description="Milestone-based escrow on XRPL settles in three seconds with multi-currency off-ramp built in."
            />
            <FeatureCard
              icon={<CircuitBoard />}
              title="Measure"
              description="On-chain reputation and reporting that unlocks renewals and sponsorship financing."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50">
        <div className="container space-y-12 py-24">
          <SectionHeading
            eyebrow="Market"
            title="A hundred-billion dollar market still running on PDFs."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              caption="Global market"
              value="$100B+"
              context="Annual brand sponsorship spend across live events."
            />
            <StatCard
              caption="APAC and GCC growth"
              value="12–14%"
              context="CAGR with no dominant operating system today."
            />
            <StatCard
              caption="Settlement"
              value="3s"
              context="On XRPL, versus five days through SWIFT for a $250K deal."
            />
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
