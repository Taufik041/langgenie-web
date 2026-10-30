"use client";
import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMOS = {
  "odia-odia": {
    label: "Odia → Odia",
    model: "langgenie-od-od-v1",
    out: "ନମସ୍କାର, ମୁଁ ଆଜି ମୋ ଜମିର ପଟ୍ଟା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି। ଦୟାକରି ମୋତେ ସାହାଯ୍ୟ କରନ୍ତୁ।",
    odia: true,
  },
  "odia-english": {
    label: "Odia → English",
    model: "langgenie-od-en-v1",
    out: "Hello, today I would like to know about the land record of my plot. Please help me.",
    odia: false,
  },
} as const;
type Key = keyof typeof DEMOS;

const BARS = Array.from({ length: 48 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 0.75);

export function VoiceDemo() {
  const [tab, setTab] = React.useState<Key>("odia-odia");
  const [playing, setPlaying] = React.useState(false);
  const [shown, setShown] = React.useState(0);
  const demo = DEMOS[tab];
  const chars = React.useMemo(() => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      return Array.from(new Intl.Segmenter("or", { granularity: "grapheme" }).segment(demo.out), (s) => s.segment);
    }
    return Array.from(demo.out);
  }, [demo.out]);

  React.useEffect(() => {
    if (!playing) return;
    if (shown >= chars.length) {
      const t = setTimeout(() => setPlaying(false), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 38);
    return () => clearTimeout(t);
  }, [playing, shown, chars.length]);

  const start = (k: Key = tab) => {
    setTab(k);
    setShown(0);
    setPlaying(true);
  };

  React.useEffect(() => {
    const t = setTimeout(() => start("odia-odia"), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-[28px] border bg-card/90 p-2 shadow-[0_30px_80px_-30px_rgba(21,19,43,0.25)] backdrop-blur">
      <div className="rounded-[22px] border bg-background/60 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-muted p-1">
            {(Object.keys(DEMOS) as Key[]).map((k) => (
              <button
                key={k}
                onClick={() => start(k)}
                className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition", tab === k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {DEMOS[k].label}
              </button>
            ))}
          </div>
          <code className="rounded-full border bg-card px-3 py-1 font-mono text-[11.5px] text-muted-foreground">{demo.model}</code>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => (playing ? setPlaying(false) : start())}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
            aria-label={playing ? "Pause demo" : "Play demo"}
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
          </button>
          <div className="flex h-14 flex-1 items-center gap-[3px] overflow-hidden">
            {BARS.map((h, i) => (
              <span
                key={i}
                className={cn("w-full min-w-[2px] rounded-full origin-center", i / BARS.length < shown / chars.length ? "bg-saffron" : "bg-foreground/15", playing && "animate-wave")}
                style={{ height: `${h * 100}%`, animationDelay: `${(i % 12) * 0.08}s` }}
              />
            ))}
          </div>
          <span className="hidden text-xs tabular-nums text-muted-foreground sm:block">0:04</span>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 text-left">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{demo.odia ? "Transcript · ଓଡ଼ିଆ" : "Translation · English"}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", playing ? "bg-emerald-500 animate-pulse" : "bg-foreground/30")} />
              {playing ? "Listening…" : "Done"}
            </span>
          </div>
          <p className={cn("min-h-[3.5rem] text-[17px] leading-relaxed", demo.odia && "font-odia text-[18px]")}>
            {chars.slice(0, shown).join("")}
            {playing && <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-saffron" />}
          </p>
        </div>
      </div>
    </div>
  );
}
