import { ExternalLink, Wallet as WalletIcon } from "lucide-react";

import { Kbd } from "@/components/demo/kbd";

export type WalletPanelData = {
  xrpl_address: string;
  network: string;
  auto_funded: boolean;
  balance_xrp: string;
  account_exists: boolean;
};

export function WalletPanel({ wallet }: { wallet: WalletPanelData }) {
  const explorerUrl =
    wallet.network === "mainnet"
      ? `https://livenet.xrpl.org/accounts/${wallet.xrpl_address}`
      : `https://testnet.xrpl.org/accounts/${wallet.xrpl_address}`;

  return (
    <section
      aria-label="Your custodial wallet"
      className="mt-5 rounded-lg border border-altr-line bg-altr-panel p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <WalletIcon
              className="h-4 w-4 text-altr-lime"
              aria-hidden="true"
            />
            <Kbd>Your custodial wallet</Kbd>
            <span className="inline-flex items-center rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
              Demo · not for real funds
            </span>
          </div>
          <p className="max-w-xl text-[12.5px] leading-snug text-altr-muteSoft">
            Auto-provisioned for you on sign-in. The vendor-payout flow
            (Phase C) will sign Payment transactions from this address to
            vendor wallets you configure.
          </p>
        </div>

        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
            Balance
          </div>
          <div className="mt-1 font-mono text-[26px] font-medium leading-none tabular-nums text-altr-white">
            {wallet.balance_xrp}{" "}
            <span className="text-[14px] text-altr-mute">XRP</span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            {wallet.network}
            {wallet.account_exists ? null : " · unfunded"}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-altr-line2 bg-altr-black/40 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-altr-mute">
            Address
          </span>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-altr-lime hover:underline"
          >
            Open in explorer
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-1 break-all font-mono text-[12px] text-altr-white">
          {wallet.xrpl_address}
        </div>
      </div>
    </section>
  );
}
