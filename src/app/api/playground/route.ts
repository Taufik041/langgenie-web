import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { runInference } from "@/lib/inference";
import { getModel } from "@/lib/models";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { message: "Please log in." } }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const model = getModel(String(form.get("model")));
  if (!(file instanceof File) || !model) return NextResponse.json({ error: { message: "Audio file and model are required." } }, { status: 400 });
  try {
    const result = await runInference({ modelId: model.id, file, withTimestamps: true, userId: user.id, keyId: null, source: "playground" });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: { message: (e as Error).message } }, { status: 502 });
  }
}
