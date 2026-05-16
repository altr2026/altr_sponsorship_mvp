import { Client } from "xrpl";

const DEFAULT_NETWORK = "wss://s.altnet.rippletest.net:51233";

export function getXrplNetwork(): string {
  return process.env.NEXT_PUBLIC_XRPL_NETWORK ?? DEFAULT_NETWORK;
}

export function createXrplClient(): Client {
  return new Client(getXrplNetwork());
}

export async function withXrplClient<T>(
  fn: (client: Client) => Promise<T>,
): Promise<T> {
  const client = createXrplClient();
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.disconnect();
  }
}
