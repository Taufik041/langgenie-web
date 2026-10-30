import "server-only";
import crypto from "crypto";
import { read, write, type ApiKey } from "./db";
import { id } from "./auth";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export type PublicKey = Omit<ApiKey, "hash">;
const strip = ({ hash, ...k }: ApiKey): PublicKey => (void hash, k);

export async function listKeys(userId: string): Promise<PublicKey[]> {
  return (await read()).apiKeys.filter((k) => k.userId === userId).map(strip).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Returns the full secret ONCE. Only a SHA-256 hash is stored. */
export async function createKey(userId: string, name: string) {
  const secret = `lg_live_${crypto.randomBytes(24).toString("base64url")}`;
  const key: ApiKey = {
    id: id("key"),
    userId,
    name: name.trim() || "Untitled key",
    prefix: secret.slice(0, 12),
    hash: sha(secret),
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null,
  };
  await write((db) => void db.apiKeys.push(key));
  return { key: strip(key), secret };
}

export async function revokeKey(userId: string, keyId: string) {
  return write((db) => {
    const k = db.apiKeys.find((x) => x.id === keyId && x.userId === userId);
    if (!k) return false;
    k.revokedAt = new Date().toISOString();
    return true;
  });
}

export async function verifyKey(secret: string | null) {
  if (!secret) return null;
  const h = sha(secret);
  return write((db) => {
    const k = db.apiKeys.find((x) => x.hash === h && !x.revokedAt);
    if (k) k.lastUsedAt = new Date().toISOString();
    return k ?? null;
  });
}
