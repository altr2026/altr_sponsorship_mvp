import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";

import { EscrowCreateClient } from "./_escrow-create-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `Create escrow · ${deal.brand_name} × ${deal.event_name}`,
    description: `Submit a real XRPL EscrowCreate for the ${deal.brand_name} × ${deal.event_name} sponsorship on testnet.`,
    robots: { index: false, follow: false },
  };
}

export default function EscrowCreatePage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) notFound();
  return <EscrowCreateClient deal={deal} />;
}
