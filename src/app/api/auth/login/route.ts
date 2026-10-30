import { NextResponse } from "next/server";
import { authenticate, setSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const user = email && password ? await authenticate(email, password) : null;
  if (!user) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  await setSession(user.id);
  return NextResponse.json({ ok: true });
}
