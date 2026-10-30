import { NextResponse } from "next/server";
import { createUser, setSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { name, email, org, password } = await req.json().catch(() => ({}));
  if (!name || !email || !password) return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (String(password).length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  try {
    const user = await createUser({ name, email, org: org ?? "", password });
    await setSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
