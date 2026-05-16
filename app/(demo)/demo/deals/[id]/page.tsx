import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";

import { SettlementClient } from "./_settlement-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) {
    return { title: "Deal not found" };
  }
  return {
    title: `Settlement · ${deal.brand_name} × ${deal.event_name}`,
    description: `${deal.tier} sponsorship · $${deal.total_amount.toLocaleString()} ${deal.currency} on XRPL · 4-milestone escrow.`,
    robots: { index: false, follow: false },
  };
}

export default function DealSettlementPage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) {
    notFound();
  }
  return <SettlementClient deal={deal} />;
}
