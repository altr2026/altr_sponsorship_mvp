import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "ALTR sponsorship platform live demo. Brand to event settlement on XRPL testnet.",
};

type Role = {
  tag: string;
  label: string;
  description: string;
  href: string;
  cta: string;
};

const ROLES: Role[] = [
  {
    tag: "Role · 01",
    label: "I'm a brand",
    description:
      "Discover vetted events, configure milestones, lock RLUSD in XRPL escrow, release on delivery.",
    href: "/demo/discover",
    cta: "Start at Discovery",
  },
  {
    tag: "Role · 02",
    label: "I'm an event",
    description:
      "Receive sponsor offers, accept milestones, watch funds settle to your wallet in three seconds.",
    href: "/demo/events/evt_pbw_2026",
    cta: "See your event page",
  },
  {
    tag: "Role · 03",
    label: "I'm reviewing",
    description:
      "Tour the full flow without signing anything. Read-only walk-through for grant reviewers.",
    href: "/demo/deals/dl_pbw_samsung",
    cta: "Jump to settlement",
  },
];

export default function DemoEntryPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12 md:px-10 md:py-16">
      <div className="space-y-3">
        <Kbd>Demo</Kbd>
        <h1 className="text-[32px] font-medium leading-[1.15] tracking-tight text-altr-white sm:text-[40px]">
          ALTR sponsorship platform · live demo
        </h1>
        <p className="max-w-2xl text-[14px] text-altr-muteSoft">
          A walk-through of the brand to event sponsorship flow, settled on
          XRPL testnet. Pick a role to start, or jump straight to the
          settlement screen.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {ROLES.map((role) => (
          <Link
            key={role.label}
            href={role.href}
            className="group flex h-full flex-col gap-3 rounded-lg border border-altr-line bg-altr-panel p-6 transition-all hover:-translate-y-0.5 hover:border-altr-lime/60 hover:bg-altr-panel/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-altr-lime/40"
          >
            <div className="flex items-start justify-between gap-3">
              <Kbd>{role.tag}</Kbd>
              <ArrowUpRight
                className="h-4 w-4 text-altr-mute transition-colors group-hover:text-altr-lime"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-[18px] font-medium text-altr-white">
              {role.label}
            </h3>
            <p className="text-[12px] leading-snug text-altr-mute">
              {role.description}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-altr-muteSoft transition-colors group-hover:text-altr-lime">
              {role.cta} →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Link
          href="/demo/deals/dl_pbw_samsung"
          className="inline-flex h-11 items-center rounded-md bg-altr-lime px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-black transition-all hover:brightness-110 active:translate-y-[1px]"
        >
          View settlement demo →
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-altr-mute">
          Samsung × PBW 2026 · $250K RLUSD escrow
        </span>
      </div>
    </div>
  );
}
