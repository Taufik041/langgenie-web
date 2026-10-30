import "server-only";
import { NextResponse } from "next/server";
import { verifyKey } from "./api-keys";
import { runInference } from "./inference";
import { getModel, type ModelId } from "./models";

const MAX_BYTES = 25 * 1024 * 1024;
const err = (status: number, code: string, message: string) => NextResponse.json({ error: { code, message } }, { status });

export async function handleV1(req: Request, endpoint: "/v1/speech-to-text" | "/v1/speech-translate") {
  const auth = req.headers.get("authorization");
  const secret = req.headers.get("api-subscription-key") ?? (auth?.startsWith("Bearer ") ? auth.slice(7) : null);
  const key = await verifyKey(secret);
  if (!key) return err(401, "invalid_api_key", "Missing or invalid API key. Pass it in the `api-subscription-key` header.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return err(400, "invalid_request", "Request body must be multipart/form-data.");
  }
  const file = form.get("file");
  if (!(file instanceof File)) return err(400, "missing_file", "Attach audio as the `file` field.");
  if (file.size > MAX_BYTES) return err(413, "file_too_large", "Audio must be 25 MB or smaller.");

  const defaultModel: ModelId = endpoint === "/v1/speech-to-text" ? "langgenie-od-od-v1" : "langgenie-od-en-v1";
  const model = getModel(String(form.get("model") ?? defaultModel));
  if (!model || model.endpoint !== endpoint)
    return err(400, "invalid_model", `Model not supported on ${endpoint}. Use "${defaultModel}".`);

  try {
    const result = await runInference({
      modelId: model.id,
      file,
      withTimestamps: String(form.get("with_timestamps")) === "true",
      userId: key.userId,
      keyId: key.id,
      source: "api",
    });
    return NextResponse.json(result);
  } catch (e) {
    return err(502, "inference_failed", (e as Error).message);
  }
}
