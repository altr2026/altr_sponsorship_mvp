import type { Metadata } from "next";

import { ConnectClient } from "./_connect-client";

export const metadata: Metadata = {
  title: "Connect wallet",
  description:
    "Connect an XRP wallet to sign deals, fund escrows, and receive payouts on XRPL.",
  robots: { index: false, follow: false },
};

export default function ConnectPage() {
  return <ConnectClient />;
}
