import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createKey, listKeys } from "@/lib/api-keys";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ keys: await listKeys(user.id) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json().catch(() => ({ name: "" }));
  const active = (await listKeys(user.id)).filter((k) => !k.revokedAt).length;
  if (active >= 10) return NextResponse.json({ error: "You can have at most 10 active keys." }, { status: 400 });
  return NextResponse.json(await createKey(user.id, String(name ?? "")));
}
