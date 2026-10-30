import "server-only";
import crypto from "crypto";
import { getModel, type ModelId } from "./models";
import { write } from "./db";

export type InferenceResult = {
  request_id: string;
  model: ModelId;
  transcript: string;
  source_language: "od-IN";
  target_language: "od-IN" | "en-IN";
  duration_seconds: number;
  segments?: { start: number; end: number; text: string }[];
  mock?: boolean;
};

const MOCK: Record<ModelId, { text: string; segments: string[] }> = {
  "langgenie-od-od-v1": {
    text: "ନମସ୍କାର, ମୁଁ ଆଜି ମୋ ଜମିର ପଟ୍ଟା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି। ଦୟାକରି ମୋତେ ସାହାଯ୍ୟ କରନ୍ତୁ।",
    segments: ["ନମସ୍କାର, ମୁଁ ଆଜି ମୋ ଜମିର ପଟ୍ଟା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି।", "ଦୟାକରି ମୋତେ ସାହାଯ୍ୟ କରନ୍ତୁ।"],
  },
  "langgenie-od-en-v1": {
    text: "Hello, today I would like to know about the land record (patta) of my plot. Please help me.",
    segments: ["Hello, today I would like to know about the land record (patta) of my plot.", "Please help me."],
  },
};

/** Rough duration estimate from byte size when we can't decode audio server-side. */
const estimateSeconds = (bytes: number) => Math.max(1, Math.round((bytes / 16000) * 10) / 10);

export async function runInference(opts: {
  modelId: ModelId;
  file: File;
  withTimestamps?: boolean;
  userId: string;
  keyId: string | null;
  source: "api" | "playground";
}): Promise<InferenceResult> {
  const model = getModel(opts.modelId)!;
  const duration = estimateSeconds(opts.file.size);
  let result: InferenceResult;

  if (process.env.INFERENCE_URL) {
    // Forward to your real model server (e.g. fine-tuned Whisper). Expected to return { transcript, segments? }.
    const fd = new FormData();
    fd.append("file", opts.file);
    fd.append("with_timestamps", String(!!opts.withTimestamps));
    const res = await fetch(`${process.env.INFERENCE_URL.replace(/\/$/, "")}/${model.slug}`, {
      method: "POST",
      headers: process.env.INFERENCE_API_KEY ? { Authorization: `Bearer ${process.env.INFERENCE_API_KEY}` } : {},
      body: fd,
    });
    if (!res.ok) throw new Error(`Inference server error (${res.status})`);
    const data = await res.json();
    result = {
      request_id: `req_${crypto.randomBytes(8).toString("hex")}`,
      model: model.id,
      transcript: data.transcript ?? data.text ?? "",
      source_language: "od-IN",
      target_language: model.slug === "odia-odia" ? "od-IN" : "en-IN",
      duration_seconds: data.duration_seconds ?? duration,
      segments: opts.withTimestamps ? data.segments : undefined,
    };
  } else {
    await new Promise((r) => setTimeout(r, 900)); // simulate latency
    const m = MOCK[model.id];
    const half = Math.round((duration / 2) * 100) / 100;
    result = {
      request_id: `req_${crypto.randomBytes(8).toString("hex")}`,
      model: model.id,
      transcript: m.text,
      source_language: "od-IN",
      target_language: model.slug === "odia-odia" ? "od-IN" : "en-IN",
      duration_seconds: duration,
      segments: opts.withTimestamps
        ? [
            { start: 0, end: half, text: m.segments[0] },
            { start: half, end: duration, text: m.segments[1] },
          ]
        : undefined,
      mock: true,
    };
  }

  await write((db) =>
    void db.usage.push({
      id: result.request_id,
      userId: opts.userId,
      keyId: opts.keyId,
      model: model.id,
      seconds: result.duration_seconds,
      status: 200,
      at: new Date().toISOString(),
      source: opts.source,
    })
  );
  return result;
}
