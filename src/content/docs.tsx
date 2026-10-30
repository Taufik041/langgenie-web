import Link from "next/link";
import { CodeBlock } from "@/components/site/code-block";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE, sampleResponse, snippets } from "@/lib/snippets";
import { MODELS } from "@/lib/models";

export type DocPage = { slug: string; title: string; section: string; description: string; body: React.ReactNode };

function Params({ rows, headers = ["Field", "Type", "Required", "Description"] }: { rows: string[][]; headers?: string[] }) {
  return (
    <div className="my-5 rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={h} className={i === 0 ? "pl-4" : i === headers.length - 1 ? "pr-4" : ""}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r[0]}>
              {r.map((c, i) => (
                <TableCell key={i} className={i === 0 ? "pl-4 font-mono text-[13px]" : i === r.length - 1 ? "whitespace-normal pr-4 text-muted-foreground" : "text-muted-foreground"}>{c}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return <div className="my-5 rounded-2xl border border-saffron/30 bg-accent/60 p-4 text-[14px] leading-6">{children}</div>;
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <div className="my-5 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 font-mono text-[13px]">
      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">{method}</span>
      <span>{API_BASE}{path}</span>
    </div>
  );
}

const commonParams = (model: string): string[][] => [
  ["file", "binary", "Yes", "Audio file. WAV, MP3, M4A, OGG/Opus, FLAC or WebM. Max 25 MB."],
  ["model", "string", "No", `Model ID. Defaults to "${model}".`],
  ["with_timestamps", "boolean", "No", "Return segment-level start/end times. Default false."],
];

export const DOCS: DocPage[] = [
  {
    slug: "",
    section: "Getting started",
    title: "Introduction",
    description: "Voice AI for Odia — what langgenie offers and how it fits into your product.",
    body: (
      <>
        <p>
          <b>langgenie.ai</b> provides speech models built specifically for Odia. There are exactly two capabilities, each exposed as a simple REST endpoint:
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          {MODELS.map((m) => (
            <Link key={m.id} href={`/docs/models/${m.slug}`} className="rounded-2xl border bg-card p-5 no-underline hover:bg-muted/40">
              <p className="text-sm text-muted-foreground">{m.short}</p>
              <p className="mt-1 text-lg font-medium">{m.name}</p>
              <p className="font-odia text-muted-foreground">{m.odiaLabel}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">POST {m.endpoint}</p>
            </Link>
          ))}
        </div>
        <h2>How it works</h2>
        <ul>
          <li>Create an account and generate an API key from the dashboard.</li>
          <li>Send an audio file with your key in the <code>api-subscription-key</code> header.</li>
          <li>Receive JSON containing the Odia transcript or English translation.</li>
        </ul>
        <p>
          Ready? Jump to the <Link href="/docs/quickstart">Quickstart</Link>, or try both models without code in the <Link href="/dashboard/playground">Playground</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "quickstart",
    section: "Getting started",
    title: "Quickstart",
    description: "Make your first Odia transcription request in under five minutes.",
    body: (
      <>
        <h2>1. Get an API key</h2>
        <p>
          <Link href="/signup">Sign up</Link>, open <Link href="/dashboard/api-keys">Dashboard → API Keys</Link> and click <b>Create new key</b>. Copy the key — it’s only shown once.
        </p>
        <h2>2. Transcribe Odia speech</h2>
        <p>Send any Odia audio file to the speech-to-text endpoint:</p>
        <CodeBlock className="my-5" tabs={snippets("langgenie-od-od-v1")} />
        <h2>3. Or translate it to English</h2>
        <p>Same request shape, different endpoint and model:</p>
        <CodeBlock className="my-5" tabs={snippets("langgenie-od-en-v1")} />
        <h2>4. Read the response</h2>
        <CodeBlock className="my-5" tabs={[{ label: "JSON", code: sampleResponse("langgenie-od-od-v1") }]} title="200 OK" />
        <Callout>
          <b>Tip:</b> 16 kHz mono WAV gives the best balance of accuracy and upload size. Longer files are supported up to 25 MB per request.
        </Callout>
      </>
    ),
  },
  {
    slug: "authentication",
    section: "Getting started",
    title: "Authentication",
    description: "Authenticate every request with an API key.",
    body: (
      <>
        <p>
          All API requests require an API key sent in the <code>api-subscription-key</code> header. <code>Authorization: Bearer &lt;key&gt;</code> is also accepted.
        </p>
        <CodeBlock className="my-5" tabs={[{ label: "HTTP", code: `POST /v1/speech-to-text HTTP/1.1\nHost: api.langgenie.ai\napi-subscription-key: lg_live_xxxxxxxxxxxxxxxxxxxx\nContent-Type: multipart/form-data; boundary=...` }]} />
        <h2>Managing keys</h2>
        <ul>
          <li>Create up to 10 active keys per workspace in <Link href="/dashboard/api-keys">API Keys</Link>.</li>
          <li>Keys are shown once. We store only a SHA-256 hash, so lost keys can’t be recovered — create a new one.</li>
          <li>Revoke a key instantly if it’s exposed. Requests with a revoked key return <code>401</code>.</li>
        </ul>
        <Callout>Never embed API keys in mobile apps or browser code. Call langgenie from your backend and proxy results to clients.</Callout>
      </>
    ),
  },
  {
    slug: "models/odia-odia",
    section: "Models",
    title: "Odia → Odia",
    description: "Speech-to-Text: transcribe Odia speech into Odia script.",
    body: (
      <>
        <p className="font-odia text-lg">ଓଡ଼ିଆ → ଓଡ଼ିଆ</p>
        <p>
          <code>langgenie-od-od-v1</code> converts spoken Odia into text written in Odia script. It is tuned for everyday speech, including regional varieties such as Sambalpuri and code-mixed Odia–English.
        </p>
        <h2>Specs</h2>
        <Params
          rows={[
            ["Model ID", "langgenie-od-od-v1"],
            ["Endpoint", "POST /v1/speech-to-text"],
            ["Input", "Odia speech, up to 25 MB"],
            ["Output", "Odia script (UTF-8), optional segment timestamps"],
          ]}
          headers={["Property", "Value"]}
        />
        <p>
          See the <Link href="/docs/api/speech-to-text">API reference</Link> for all parameters.
        </p>
      </>
    ),
  },
  {
    slug: "models/odia-english",
    section: "Models",
    title: "Odia → English",
    description: "Speech translation: get English text directly from Odia speech.",
    body: (
      <>
        <p className="font-odia text-lg">ଓଡ଼ିଆ → English</p>
        <p>
          <code>langgenie-od-en-v1</code> translates spoken Odia directly into English text in one step — no intermediate transcription call needed. Names, places and numbers are preserved.
        </p>
        <h2>Specs</h2>
        <Params
          rows={[
            ["Model ID", "langgenie-od-en-v1"],
            ["Endpoint", "POST /v1/speech-translate"],
            ["Input", "Odia speech, up to 25 MB"],
            ["Output", "English text, optional segment timestamps"],
          ]}
          headers={["Property", "Value"]}
        />
        <p>
          See the <Link href="/docs/api/speech-translate">API reference</Link> for all parameters.
        </p>
      </>
    ),
  },
  {
    slug: "api/speech-to-text",
    section: "API reference",
    title: "Speech to Text",
    description: "Transcribe Odia audio into Odia text.",
    body: (
      <>
        <Endpoint method="POST" path="/v1/speech-to-text" />
        <h2>Headers</h2>
        <Params rows={[["api-subscription-key", "string", "Yes", "Your API key."]]} />
        <h2>Body · multipart/form-data</h2>
        <Params rows={commonParams("langgenie-od-od-v1")} />
        <h2>Example</h2>
        <CodeBlock className="my-5" tabs={snippets("langgenie-od-od-v1")} />
        <h2>Response</h2>
        <CodeBlock className="my-5" tabs={[{ label: "JSON", code: sampleResponse("langgenie-od-od-v1") }]} title="200 OK" />
      </>
    ),
  },
  {
    slug: "api/speech-translate",
    section: "API reference",
    title: "Speech Translate",
    description: "Translate Odia audio into English text.",
    body: (
      <>
        <Endpoint method="POST" path="/v1/speech-translate" />
        <h2>Headers</h2>
        <Params rows={[["api-subscription-key", "string", "Yes", "Your API key."]]} />
        <h2>Body · multipart/form-data</h2>
        <Params rows={commonParams("langgenie-od-en-v1")} />
        <h2>Example</h2>
        <CodeBlock className="my-5" tabs={snippets("langgenie-od-en-v1")} />
        <h2>Response</h2>
        <CodeBlock className="my-5" tabs={[{ label: "JSON", code: sampleResponse("langgenie-od-en-v1") }]} title="200 OK" />
      </>
    ),
  },
  {
    slug: "errors",
    section: "API reference",
    title: "Errors",
    description: "Error format and status codes.",
    body: (
      <>
        <p>Errors return a JSON body with a machine-readable code and a human-readable message:</p>
        <CodeBlock className="my-5" tabs={[{ label: "JSON", code: `{\n  "error": {\n    "code": "invalid_api_key",\n    "message": "Missing or invalid API key."\n  }\n}` }]} />
        <Params
          rows={[
            ["400", "invalid_request", "Body isn’t multipart/form-data, or a parameter is invalid (missing_file, invalid_model)."],
            ["401", "invalid_api_key", "Key missing, malformed or revoked."],
            ["413", "file_too_large", "Audio exceeds 25 MB."],
            ["429", "rate_limited", "Too many requests — back off and retry."],
            ["502", "inference_failed", "Temporary model error. Safe to retry."],
          ]}
          headers={["Status", "Code", "Meaning"]}
        />
      </>
    ),
  },
  {
    slug: "rate-limits",
    section: "API reference",
    title: "Rate limits",
    description: "Default request limits by plan.",
    body: (
      <>
        <Params
          rows={[
            ["Starter", "60 req/min", "Up to 2 concurrent requests."],
            ["Pay as you go", "300 req/min", "Up to 10 concurrent requests."],
            ["Enterprise", "Custom", "Dedicated capacity on request."],
          ]}
          headers={["Plan", "Requests", "Concurrency"]}
        />
        <p>
          When limited you’ll receive <code>429</code>. Retry with exponential backoff. Need more? <Link href="/contact">Contact us</Link>.
        </p>
      </>
    ),
  },
];

export const getDoc = (slug: string) => DOCS.find((d) => d.slug === slug);
export const DOC_SECTIONS = Array.from(new Set(DOCS.map((d) => d.section))).map((s) => ({ section: s, pages: DOCS.filter((d) => d.section === s) }));
