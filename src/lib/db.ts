import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny JSON-file store used as a MOCK backend.
 * Swap this module for Postgres/Supabase/Prisma without touching the UI.
 */
export type User = { id: string; name: string; email: string; org: string; passwordHash: string; createdAt: string };
export type ApiKey = { id: string; userId: string; name: string; prefix: string; hash: string; createdAt: string; lastUsedAt: string | null; revokedAt: string | null };
export type UsageEvent = { id: string; userId: string; keyId: string | null; model: string; seconds: number; status: number; at: string; source: "api" | "playground" };
type DB = { users: User[]; apiKeys: ApiKey[]; usage: UsageEvent[] };

const DB_PATH = path.join(process.cwd(), ".data", "db.json");
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8")) as DB;
  } catch {
    return { users: [], apiKeys: [], usage: [] };
  }
}

export async function read(): Promise<DB> {
  await queue;
  return load();
}

/** Serialised read-modify-write so concurrent requests don't clobber each other. */
export function write<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}
