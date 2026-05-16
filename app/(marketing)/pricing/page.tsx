import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Hero } from "@/components/shared/hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three plans for sponsorship — Discover (free), Settle (1.5% per deal), Enterprise (custom). No platform fees on Discover or Settle.",
  alternates: { canonical: "/pricing" },
};

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceCadence?: string;
  priceFootnote?: string;
  cta: { label: string; href: string };
  highlight?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: "discover",
    name: "Discover",
    tagline: "Browse, list, and shortlist. Zero commitment.",
    price: "Free",
    priceCadence: "forever",
    cta: { label: "Start free", href: "/connect" },
    features: [
      "List one event or browse the full catalog",
      "Audience insights on every event page",
      "Sponsor-tier comparison + saved shortlists",
      "Up to 3 saved sponsorship briefs",
      "Email support",
    ],
  },
  {
    id: "settle",
    name: "Settle",
    tagline: "The full deal flow. Pay only when money moves.",
    price: "1.5%",
    priceCadence: "per deal value",
    priceFootnote: "No platform fee. Charged on settled milestones only.",
    cta: { label: "Open the demo", href: "/demo" },
    highlight: true,
    features: [
      "Everything in Discover",
      "Unlimited events + brands",
      "Milestone escrow on XRPL (settle in seconds)",
      "Multi-currency: RLUSD, USDC, XRP, local fiat off-ramp",
      "Standard contracts + signature flow",
      "Live ROI dashboard per deal",
      "POE NFT minted per closed deal (Step 14)",
      "Priority support · 1-business-day response",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Multi-brand orgs and agencies. Custom rates.",
    price: "Custom",
    priceCadence: "annual + per-deal blended",
    cta: { label: "Talk to us", href: "mailto:hello@altr.haus" },
    features: [
      "Everything in Settle",
      "SSO (Google Workspace, Okta, custom SAML)",
      "Multi-brand workspaces + role-based access",
      "Negotiated per-deal rate (under 1%)",
      "Custom contracts + legal review",
      "Dedicated CSM + Slack channel",
      "SLA-backed uptime + 24/7 incident response",
      "Sponsorship financing access (Phase 4)",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What does \"1.5% per deal value\" actually mean?",
    a: "We charge 1.5% on each settled milestone. A $100,000 deal with four milestones triggers four fee events totaling $1,500 over the life of the deal — never upfront. If a deal is cancelled before settlement, you pay nothing.",
  },
  {
    q: "Do events pay anything?",
    a: "Events pay nothing to list, browse offers, or accept deals. The 1.5% on the Settle plan is charged to the brand side. Enterprise rates are negotiated.",
  },
  {
    q: "How does escrow work without us holding funds?",
    a: "Funds lock on XRPL through native EscrowCreate transactions. ALTR is never a custodian — the brand wallet locks funds directly to the event wallet, time-gated and milestone-gated. We add the rails, not the bank account.",
  },
  {
    q: "What if I need to off-ramp to local currency?",
    a: "RLUSD on XRPL converts to PHP, SGD, KRW, AED, and others via Ripple Payments partners. Typical same-day settlement to a local bank account. Available on Settle and Enterprise plans.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, anytime. Discover → Settle is self-serve. Settle → Enterprise requires a short conversation about volume and contract terms.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Hero
        eyebrow="Pricing"
        title="Three plans. No platform fees on Discover or Settle."
        subtitle="Pay only when money moves. Built so events and brands can prove ROI before either side commits to anything."
        primaryCta={{ label: "Open the demo", href: "/demo" }}
        secondaryLink={{ label: "Read the manifesto", href: "/manifesto" }}
      />

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={cn(
                  "relative flex h-full flex-col gap-5 rounded-2xl border bg-altr-black p-6 sm:p-8",
                  plan.highlight
                    ? "border-altr-lime/60 shadow-[0_0_40px_-12px_rgba(200,240,74,0.35)]"
                    : "border-altr-line2",
                )}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-6 rounded-full border border-altr-lime/40 bg-altr-black px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-altr-lime">
                    Most popular
                  </span>
                ) : null}

                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
                    {plan.name}
                  </div>
                  <p className="text-[13px] text-altr-muteSoft">{plan.tagline}</p>
                </div>

                <div className="border-y border-altr-line2 py-5">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-mono text-[36px] font-medium tracking-tight text-altr-white",
                        plan.highlight && "text-altr-lime",
                      )}
                    >
                      {plan.price}
                    </span>
                    {plan.priceCadence ? (
                      <span className="text-[12px] text-altr-mute">
                        {plan.priceCadence}
                      </span>
                    ) : null}
                  </div>
                  {plan.priceFootnote ? (
                    <div className="mt-2 text-[11px] text-altr-mute">
                      {plan.priceFootnote}
                    </div>
                  ) : null}
                </div>

                <ul className="flex flex-1 flex-col gap-2.5 text-[12.5px] text-altr-muteSoft">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          plan.highlight ? "text-altr-lime" : "text-altr-muteSoft",
                        )}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.cta.href}
                  className={cn(
                    "inline-flex h-11 items-center justify-center gap-2 rounded-md font-mono text-[12px] font-bold uppercase tracking-[0.22em] transition-all",
                    plan.highlight
                      ? "bg-altr-lime text-altr-black hover:brightness-110"
                      : "border border-altr-line2 text-altr-muteSoft hover:border-altr-mute hover:text-altr-white",
                  )}
                >
                  {plan.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-[12px] text-altr-mute">
            All prices in USD. RLUSD / USDC / XRP supported on every plan. Local fiat off-ramp via Ripple Payments partners.
          </p>
        </div>
      </section>

      <section className="border-t border-altr-line2">
        <div className="container max-w-3xl space-y-10 py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions about pricing."
          />
          <dl className="space-y-6">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-altr-line2 bg-altr-panel p-5 sm:p-6"
              >
                <dt className="text-[15px] font-medium text-altr-white">
                  {item.q}
                </dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-altr-muteSoft">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-altr-line2 bg-altr-panel">
        <div className="container flex flex-col items-start gap-6 py-20 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <span className="text-caption font-medium text-altr-lime">
              Still comparing?
            </span>
            <h2 className="text-altr-white">Walk through the live demo.</h2>
            <p className="text-body text-altr-muteSoft">
              See the discovery → deal → escrow → POE flow on XRPL testnet before you sign up for anything.
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
