import { Wallet, type Client } from "xrpl";

// Module-level caches so the same auto-generated wallets are reused across
// requests within a single Vercel Function container. Cold starts reset these
// — acceptable for demo (EscrowFinish for an escrow created in a previous
// cold-start container would fail because XRPL requires the same Owner).
let cachedHotWallet: Wallet | null = null;
let cachedDestinationAddress: string | null = null;

export type WalletResult = {
  wallet: Wallet;
  /** true when the wallet came from the testnet faucet rather than env. */
  auto_funded: boolean;
};

export type DestinationResult = {
  address: string;
  auto_funded: boolean;
};

/**
 * Returns the hot wallet used to sign demo transactions. Prefers
 * XRPL_HOT_WALLET_SEED when set; otherwise generates a fresh wallet on first
 * call and funds it via the testnet faucet, caching it for subsequent calls.
 */
export async function getHotWallet(client: Client): Promise<WalletResult> {
  if (process.env.XRPL_HOT_WALLET_SEED) {
    return {
      wallet: Wallet.fromSeed(process.env.XRPL_HOT_WALLET_SEED),
      auto_funded: false,
    };
  }
  if (cachedHotWallet) {
    return { wallet: cachedHotWallet, auto_funded: true };
  }
  const funded = await client.fundWallet();
  cachedHotWallet = funded.wallet;
  return { wallet: funded.wallet, auto_funded: true };
}

/**
 * Returns the destination address for EscrowCreate. Prefers
 * NEXT_PUBLIC_XRPL_TESTNET_ADDRESS when set; otherwise generates + funds a
 * second wallet via the faucet so the destination account exists on-ledger.
 * Must differ from the hot wallet (XRPL rejects self-escrows).
 */
export async function getDestinationAddress(
  client: Client,
): Promise<DestinationResult> {
  if (process.env.NEXT_PUBLIC_XRPL_TESTNET_ADDRESS) {
    return {
      address: process.env.NEXT_PUBLIC_XRPL_TESTNET_ADDRESS,
      auto_funded: false,
    };
  }
  if (cachedDestinationAddress) {
    return { address: cachedDestinationAddress, auto_funded: true };
  }
  const funded = await client.fundWallet();
  cachedDestinationAddress = funded.wallet.classicAddress;
  return { address: funded.wallet.classicAddress, auto_funded: true };
}
