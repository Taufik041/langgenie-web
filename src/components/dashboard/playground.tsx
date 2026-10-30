"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AudioLines, FileAudio, Languages, Loader2, Mic, Square, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, CopyButton } from "@/components/site/code-block";
import { MODELS, type ModelId } from "@/lib/models";
import { snippets } from "@/lib/snippets";
import { cn } from "@/lib/utils";

type Result = {
  request_id: string;
  model: ModelId;
  transcript: string;
  duration_seconds: number;
  target_language: string;
  segments?: { start: number; end: number; text: string }[];
  mock?: boolean;
};

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Playground() {
  const params = useSearchParams();
  const initial = MODELS.find((m) => m.slug === params.get("model"))?.id ?? MODELS[0].id;
  const [modelId, setModelId] = React.useState<ModelId>(initial);
  const [file, setFile] = React.useState<File | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);
  const [drag, setDrag] = React.useState(false);
  const recRef = React.useRef<MediaRecorder | null>(null);
  const chunks = React.useRef<Blob[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const model = MODELS.find((m) => m.id === modelId)!;

  React.useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  React.useEffect(() => () => void (audioUrl && URL.revokeObjectURL(audioUrl)), [audioUrl]);

  function pickFile(f: File) {
    if (!f.type.startsWith("audio/") && !/\.(wav|mp3|m4a|ogg|flac|webm)$/i.test(f.name)) return toast.error("Please choose an audio file.");
    if (f.size > 25 * 1024 * 1024) return toast.error("Audio must be 25 MB or smaller.");
    setFile(f);
    setResult(null);
    setAudioUrl(URL.createObjectURL(f));
  }

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        pickFile(new File([blob], `recording-${Date.now()}.webm`, { type: blob.type }));
      };
      rec.start();
      recRef.current = rec;
      setElapsed(0);
      setRecording(true);
    } catch {
      toast.error("Microphone access was blocked. Allow it in your browser, or upload a file instead.");
    }
  }
  function stopRec() {
    recRef.current?.stop();
    setRecording(false);
  }

  async function run() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("model", modelId);
    const res = await fetch("/api/playground", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return toast.error(data.error?.message ?? "Request failed");
    setResult(data);
  }

  const odiaOut = model.slug === "odia-odia";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid content-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1 · Choose a model</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => {
                  setModelId(m.id);
                  setResult(null);
                }}
                className={cn("rounded-2xl border p-4 text-left transition", m.id === modelId ? "border-foreground bg-card ring-2 ring-foreground/10" : "hover:bg-muted/50")}
                aria-pressed={m.id === modelId}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  {i === 0 ? <AudioLines className="size-4 text-saffron" /> : <Languages className="size-4 text-saffron" />}
                  {m.name}
                </span>
                <span className="mt-1 block font-odia text-sm text-muted-foreground">{m.odiaLabel}</span>
                <span className="mt-3 block font-mono text-[11px] text-muted-foreground">{m.id}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2 · Add Odia audio</CardTitle>
            <CardDescription>Record from your mic or upload WAV, MP3, M4A, OGG, FLAC or WebM (max 25 MB).</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="record">
              <TabsList className="w-full">
                <TabsTrigger value="record">
                  <Mic /> Record
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload /> Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="record" className="mt-4">
                <div className="flex flex-col items-center rounded-2xl border border-dashed py-10">
                  <button
                    onClick={recording ? stopRec : startRec}
                    className={cn("grid size-20 place-items-center rounded-full transition", recording ? "bg-patta text-white shadow-[0_0_0_10px_rgba(200,50,43,.15)]" : "bg-primary text-primary-foreground hover:scale-105")}
                    aria-label={recording ? "Stop recording" : "Start recording"}
                  >
                    {recording ? <Square className="size-6" /> : <Mic className="size-7" />}
                  </button>
                  <p className="mt-4 text-sm text-muted-foreground">{recording ? `Recording… ${fmtTime(elapsed)}` : "Tap to start speaking in Odia"}</p>
                  {recording && (
                    <div className="mt-4 flex h-8 items-center gap-1">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <span key={i} className="h-full w-1 origin-center animate-wave rounded-full bg-patta/70" style={{ animationDelay: `${i * 0.07}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="upload" className="mt-4">
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) pickFile(f);
                  }}
                  className={cn("flex cursor-pointer flex-col items-center rounded-2xl border border-dashed py-10 text-center transition", drag && "border-saffron bg-accent/50")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent text-[#b44d00]">
                    <Upload className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium">Drop an audio file or click to browse</p>
                  <p className="text-xs text-muted-foreground">Up to 25 MB</p>
                  <input ref={inputRef} type="file" accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac,.webm" hidden onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])} />
                </div>
              </TabsContent>
            </Tabs>

            {file && audioUrl && (
              <div className="mt-4 rounded-2xl border bg-muted/40 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <FileAudio className="size-4 text-saffron" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setAudioUrl(null);
                      setResult(null);
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Remove audio"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <audio controls src={audioUrl} className="h-10 w-full" />
              </div>
            )}

            <Button className="mt-5 h-11 w-full" shape="pill" disabled={!file || loading || recording} onClick={run}>
              {loading ? <Loader2 className="animate-spin" /> : odiaOut ? <AudioLines /> : <Languages />}
              {loading ? "Processing…" : odiaOut ? "Transcribe to Odia" : "Translate to English"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid content-start gap-6">
        <Card className="min-h-[320px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Output</CardTitle>
              <CardDescription>{odiaOut ? "Odia transcript (ଓଡ଼ିଆ)" : "English translation"}</CardDescription>
            </div>
            {result && <CopyButton value={result.transcript} />}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/6 animate-pulse rounded bg-muted" />
              </div>
            ) : result ? (
              <>
                <p className={cn("text-lg leading-relaxed", odiaOut && "font-odia text-xl")}>{result.transcript}</p>
                {result.segments && (
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Segments</p>
                    {result.segments.map((s, i) => (
                      <div key={i} className="flex gap-3 rounded-xl bg-muted/50 p-3 text-sm">
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {s.start.toFixed(1)}s – {s.end.toFixed(1)}s
                        </span>
                        <span className={odiaOut ? "font-odia" : ""}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-mono">{result.request_id}</Badge>
                  <Badge variant="outline">{result.duration_seconds.toFixed(1)}s audio</Badge>
                  {result.mock && <Badge variant="saffron">Mock output — set INFERENCE_URL to use your model</Badge>}
                </div>
              </>
            ) : (
              <div className="flex h-52 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <AudioLines className="mb-3 size-8 opacity-30" />
                Your {odiaOut ? "Odia transcript" : "English translation"} will appear here.
              </div>
            )}
          </CardContent>
        </Card>
        <div>
          <p className="mb-3 text-sm font-medium">Same request via the API</p>
          <CodeBlock tabs={snippets(modelId)} />
        </div>
      </div>
    </div>
  );
}
