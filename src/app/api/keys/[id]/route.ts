import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { revokeKey } from "@/lib/api-keys";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await revokeKey(user.id, (await params).id);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Key not found" }, { status: 404 });
}
