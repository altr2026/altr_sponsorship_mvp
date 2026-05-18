import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  type CipherGCM,
  type DecipherGCM,
} from "node:crypto";

// AES-256-GCM with a 12-byte random IV per encryption is the standard
// authenticated-encryption shape and what the Phase A1 user_wallets schema
// expects (seed_ciphertext / seed_iv / seed_tag as three bytea columns).
//
// WALLET_ENC_MASTER_KEY must be 32 random bytes, base64-encoded. Generate it
// locally and add it to the Vercel project env for Production / Preview /
// Development:
//
//   openssl rand -base64 32
//
// Key rotation is out of scope for v1. If the key ever changes, every row in
// user_wallets becomes unreadable — wallets will need to be re-provisioned.
// Document this in any future rotation runbook.

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH_BYTES = 32;
const IV_LENGTH_BYTES = 12;
const TAG_LENGTH_BYTES = 16;

let cachedKey: Buffer | null = null;

function loadMasterKey(): Buffer {
  if (cachedKey) return cachedKey;
  const raw = process.env.WALLET_ENC_MASTER_KEY;
  if (!raw) {
    throw new Error(
      "WALLET_ENC_MASTER_KEY is not set. Generate one with `openssl rand -base64 32` and add it to the Vercel project env (Production + Preview + Development).",
    );
  }
  const decoded = Buffer.from(raw, "base64");
  if (decoded.length !== KEY_LENGTH_BYTES) {
    throw new Error(
      `WALLET_ENC_MASTER_KEY must decode to ${KEY_LENGTH_BYTES} bytes (got ${decoded.length}). Generate a fresh one with \`openssl rand -base64 32\`.`,
    );
  }
  cachedKey = decoded;
  return decoded;
}

export type EncryptedSeed = {
  ciphertext: Buffer;
  iv: Buffer;
  tag: Buffer;
};

export function encryptSeed(plaintext: string): EncryptedSeed {
  if (typeof plaintext !== "string" || plaintext.length === 0) {
    throw new Error("encryptSeed: plaintext must be a non-empty string.");
  }
  const key = loadMasterKey();
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv) as CipherGCM;
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

export function decryptSeed({ ciphertext, iv, tag }: EncryptedSeed): string {
  if (!Buffer.isBuffer(ciphertext) || ciphertext.length === 0) {
    throw new Error("decryptSeed: ciphertext must be a non-empty Buffer.");
  }
  if (!Buffer.isBuffer(iv) || iv.length !== IV_LENGTH_BYTES) {
    throw new Error(
      `decryptSeed: iv must be a ${IV_LENGTH_BYTES}-byte Buffer (got ${iv?.length ?? "non-buffer"}).`,
    );
  }
  if (!Buffer.isBuffer(tag) || tag.length !== TAG_LENGTH_BYTES) {
    throw new Error(
      `decryptSeed: tag must be a ${TAG_LENGTH_BYTES}-byte Buffer (got ${tag?.length ?? "non-buffer"}).`,
    );
  }
  const key = loadMasterKey();
  const decipher = createDecipheriv(ALGORITHM, key, iv) as DecipherGCM;
  decipher.setAuthTag(tag);
  // .final() throws "Unsupported state or unable to authenticate data" when
  // the tag fails to verify — callers should treat that as a tampering or
  // wrong-key signal, not a recoverable error.
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
    "utf8",
  );
}
