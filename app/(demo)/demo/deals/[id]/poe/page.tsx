import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";

import { PoeMintClient } from "./_poe-mint-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `Proof of Engagement · ${deal.brand_name} × ${deal.event_name}`,
    description: `Mint a permanent on-chain Proof of Engagement NFT for the ${deal.brand_name} × ${deal.event_name} sponsorship. Metadata pinned to IPFS, token minted on XRPL.`,
    robots: { index: false, follow: false },
  };
}

export default function PoeMintPage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) notFound();
  return <PoeMintClient deal={deal} />;
}
