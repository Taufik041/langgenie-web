export type ModelId = "langgenie-od-od-v1" | "langgenie-od-en-v1";

export type VoiceModel = {
  id: ModelId;
  slug: "odia-odia" | "odia-english";
  name: string;
  short: string;
  odiaLabel: string;
  endpoint: "/v1/speech-to-text" | "/v1/speech-translate";
  input: string;
  output: string;
  description: string;
  highlights: string[];
  pricePerHour: number; // INR
};

export const MODELS: VoiceModel[] = [
  {
    id: "langgenie-od-od-v1",
    slug: "odia-odia",
    name: "Odia → Odia",
    short: "Speech-to-Text",
    odiaLabel: "ଓଡ଼ିଆ → ଓଡ଼ିଆ",
    endpoint: "/v1/speech-to-text",
    input: "Odia speech (audio)",
    output: "Odia text (ଓଡ଼ିଆ script)",
    description:
      "Transcribe spoken Odia into accurate Odia script — built for real-world accents, code-mixed speech and regional dialects like Sambalpuri.",
    highlights: ["Native Odia script output", "Dialect-aware (incl. Sambalpuri)", "Word-level timestamps", "Handles code-mixed Odia-English"],
    pricePerHour: 30,
  },
  {
    id: "langgenie-od-en-v1",
    slug: "odia-english",
    name: "Odia → English",
    short: "Speech Translation",
    odiaLabel: "ଓଡ଼ିଆ → English",
    endpoint: "/v1/speech-translate",
    input: "Odia speech (audio)",
    output: "English text",
    description:
      "Speak in Odia, get fluent English. Direct speech-to-English translation in a single call — no separate transcription step needed.",
    highlights: ["Direct speech → English", "Preserves names & numbers", "Segment timestamps", "One API call, low latency"],
    pricePerHour: 45,
  },
];

export const getModel = (id: string) => MODELS.find((m) => m.id === id || m.slug === id);
