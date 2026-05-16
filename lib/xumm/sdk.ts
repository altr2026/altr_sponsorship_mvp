import { XummSdk } from "xumm-sdk";

let cached: XummSdk | null = null;

export function getXummSdk(): XummSdk | null {
  const apiKey = process.env.XUMM_API_KEY;
  const apiSecret = process.env.XUMM_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  if (cached) return cached;
  cached = new XummSdk(apiKey, apiSecret);
  return cached;
}
