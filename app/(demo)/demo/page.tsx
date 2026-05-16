import type { Metadata } from "next";
import Link from "next/link";

import { Kbd } from "@/components/demo/kbd";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "ALTR sponsorship platform live demo. Brand to event settlement on XRPL testnet.",
};

const ROLES = [
  {
    tag: "Role · 01",
    label: "I'm a brand",
    description:
      "Discover vetted events, configure milestones, lock RLUSD in XRPL escrow, release on delivery.",
  },
  {
    tag: "Role · 02",
    label: "I'm an event",
    description:
      "Receive sponsor offers, accept milestones, watch funds settle to your wallet in three seconds.",
  },
  {
    tag: "Role · 03",
    label: "I'm reviewing",
    description:
      "Tour the full flow without signing anything. Read-only walk-through for grant reviewers.",
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
          <article
            key={role.label}
            className="flex h-full flex-col gap-3 rounded-lg border border-altr-line bg-altr-panel p-6"
          >
            <Kbd>{role.tag}</Kbd>
            <h3 className="text-[18px] font-medium text-altr-white">
              {role.label}
            </h3>
            <p className="text-[12px] leading-snug text-altr-mute">
              {role.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Link
          href="/demo/deals/dl_pbw_samsung"
          className="inline-flex h-11 items-center rounded-md bg-altr-yellow px-5 font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-altr-black transition-all hover:brightness-110 active:translate-y-[1px]"
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
