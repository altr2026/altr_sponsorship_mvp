import type { Metadata } from "next";

import { ConnectClient } from "./_connect-client";

export const metadata: Metadata = {
  title: "Connect wallet",
  description:
    "Connect an XRP wallet to sign deals, fund escrows, and receive payouts on XRPL.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: { error?: string };
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Sign-in was cancelled before it finished. Try again.",
  auth_failed:
    "We couldn't complete sign-in. Try again, or use your work email below.",
};

export default function ConnectPage({ searchParams }: PageProps) {
  const initialError = searchParams.error
    ? AUTH_ERROR_MESSAGES[searchParams.error] ?? null
    : null;
  return <ConnectClient initialError={initialError} />;
}
