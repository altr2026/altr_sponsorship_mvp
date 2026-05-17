import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/mock-data/deals";
import { getRoiReportByDealId } from "@/lib/mock-data/roi-reports";

import { PoeMintClient } from "./_poe-mint-client";

type PageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const deal = getDealById(params.id);
  if (!deal) return { title: "Deal not found" };
  return {
    title: `ROI report · ${deal.brand_name} × ${deal.event_name}`,
    description: `Post-event ROI report for the ${deal.brand_name} × ${deal.event_name} sponsorship. Anchored on XRPL with metadata pinned to IPFS via the POE NFT.`,
    robots: { index: false, follow: false },
  };
}

export default function PoeMintPage({ params }: PageProps) {
  const deal = getDealById(params.id);
  if (!deal) notFound();
  const roi = getRoiReportByDealId(deal.id);
  return <PoeMintClient deal={deal} roi={roi ?? null} />;
}
