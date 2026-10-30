"use client";
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors", className)}
      aria-label="Copy code"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

type Tab = { label: string; code: string };

/** Lightweight code panel with optional language tabs (no heavy highlighter dependency). */
export function CodeBlock({ tabs, title, className, dark = false }: { tabs: Tab[]; title?: string; className?: string; dark?: boolean }) {
  const [active, setActive] = React.useState(0);
  const code = tabs[active].code;
  return (
    <div className={cn("overflow-hidden rounded-2xl border", dark ? "bg-[#14122a] border-white/10 text-white" : "bg-card", className)}>
      <div className={cn("flex items-center justify-between gap-2 border-b px-3 py-2", dark && "border-white/10")}>
        <div className="flex items-center gap-1 overflow-x-auto">
          {title && <span className={cn("px-2 text-xs font-medium", dark ? "text-white/60" : "text-muted-foreground")}>{title}</span>}
          {tabs.length > 1 &&
            tabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  i === active ? (dark ? "bg-white/10 text-white" : "bg-muted text-foreground") : dark ? "text-white/55 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
        </div>
        <CopyButton value={code} className={dark ? "text-white/60 hover:bg-white/10 hover:text-white" : ""} />
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-6 font-mono">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

// Minimal token colouring: strings, comments, keywords.
function highlight(src: string) {
  const re = /(#.*$|\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|const|await|async|with|as|open|print|requests|fetch|new|return|curl|def|for|in)\b/gm;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? "text-[#8a86a3] italic" : m[2] ? "text-[#e9853b]" : "text-[#8b7bff]";
    out.push(
      <span key={i++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}
