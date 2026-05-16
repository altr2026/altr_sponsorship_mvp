import { Readable } from "node:stream";

import PinataClient, { type PinataMetadata } from "@pinata/sdk";

export type PinResult = {
  ipfsHash: string;
  gatewayUrl: string;
  size: number;
  timestamp: string;
};

export type PinMetadata = {
  name?: string;
  keyvalues?: Record<string, string | number | null>;
};

function buildPinataMetadata(
  metadata: PinMetadata,
  fallbackName?: string,
): PinataMetadata | undefined {
  const name = metadata.name ?? fallbackName;
  if (!name && !metadata.keyvalues) return undefined;
  const out: Record<string, unknown> = {};
  if (name) out.name = name;
  if (metadata.keyvalues) out.keyvalues = metadata.keyvalues;
  // PinataMetadata's index signature is too narrow for the documented
  // shape ({ name, keyvalues }) — cast through unknown.
  return out as unknown as PinataMetadata;
}

let cachedClient: PinataClient | null = null;

function getClient(): PinataClient {
  if (cachedClient) return cachedClient;

  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error(
      "PINATA_JWT is not set. Add it to .env.local (dev) and Vercel project env (Preview + Production). Create a JWT at https://app.pinata.cloud/developers/api-keys.",
    );
  }

  cachedClient = new PinataClient({ pinataJWTKey: jwt });
  return cachedClient;
}

function gatewayBase(): string {
  const raw = process.env.PINATA_GATEWAY?.trim() || "gateway.pinata.cloud";
  const host = raw.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://${host}`;
}

function toGatewayUrl(hash: string): string {
  return `${gatewayBase()}/ipfs/${hash}`;
}

export async function pinJson(
  payload: unknown,
  metadata: PinMetadata = {},
): Promise<PinResult> {
  const client = getClient();
  const pinataMetadata = buildPinataMetadata(metadata);
  const response = await client.pinJSONToIPFS(
    payload,
    pinataMetadata ? { pinataMetadata } : undefined,
  );

  return {
    ipfsHash: response.IpfsHash,
    gatewayUrl: toGatewayUrl(response.IpfsHash),
    size: response.PinSize,
    timestamp: response.Timestamp,
  };
}

export async function pinFile(
  buffer: Buffer,
  name: string,
  metadata: PinMetadata = {},
): Promise<PinResult> {
  const client = getClient();

  const stream = Readable.from(buffer) as Readable & { path?: string };
  // form-data inspects `path` for the filename; setting it ensures Pinata
  // records the original name on the pin instead of "blob".
  stream.path = name;

  const pinataMetadata = buildPinataMetadata(metadata, name);
  const response = await client.pinFileToIPFS(
    stream,
    pinataMetadata ? { pinataMetadata } : undefined,
  );

  return {
    ipfsHash: response.IpfsHash,
    gatewayUrl: toGatewayUrl(response.IpfsHash),
    size: response.PinSize,
    timestamp: response.Timestamp,
  };
}

export async function testPinataAuth(): Promise<boolean> {
  const client = getClient();
  const result = await client.testAuthentication();
  return Boolean(result?.authenticated);
}
