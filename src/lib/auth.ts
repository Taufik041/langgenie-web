import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { read, write, type User } from "./db";

export const SESSION_COOKIE = "lg_session";
const SECRET = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me";
const MAX_AGE = 60 * 60 * 24 * 7;

export const id = (p: string) => `${p}_${crypto.randomBytes(9).toString("base64url")}`;

export function hashPassword(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(pw, salt, 64).toString("hex")}`;
}
export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const test = crypto.scryptSync(pw, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, "hex"));
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}
export function createSessionToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
function parseSessionToken(token?: string): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sign(payload) !== sig) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return exp > Date.now() ? uid : null;
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export type PublicUser = Omit<User, "passwordHash">;
export async function getCurrentUser(): Promise<PublicUser | null> {
  const uid = parseSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!uid) return null;
  const user = (await read()).users.find((u) => u.id === uid);
  if (!user) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...pub } = user;
  return pub;
}

export async function createUser(input: { name: string; email: string; org: string; password: string }) {
  return write((db) => {
    const email = input.email.trim().toLowerCase();
    if (db.users.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
    const user: User = { id: id("usr"), name: input.name.trim(), email, org: input.org.trim(), passwordHash: hashPassword(input.password), createdAt: new Date().toISOString() };
    db.users.push(user);
    return user;
  });
}

export async function authenticate(email: string, password: string) {
  const user = (await read()).users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return user;
}
