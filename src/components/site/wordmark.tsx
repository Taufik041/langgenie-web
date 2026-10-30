import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

export function Wordmark({ className, href = "/", endorse = false, inverted = false }: { className?: string; href?: string | null; endorse?: boolean; inverted?: boolean }) {
  const mark = (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("inline-flex items-center gap-2 font-display font-medium tracking-[-0.03em] text-[22px]", inverted ? "text-white" : "text-foreground")}>
        <LogoMark />
        <span>
          langgenie<span className={inverted ? "text-white/55" : "text-muted-foreground"}>.ai</span>
        </span>
      </span>
      {endorse && (
        <span className={cn("mt-1.5 font-display text-[9.5px] tracking-[0.18em] uppercase", inverted ? "text-white/55" : "text-muted-foreground")}>
          Powered by <b className={cn("font-semibold tracking-[0.12em]", inverted ? "text-white" : "text-foreground")}>BIPROS</b>
        </span>
      )}
    </span>
  );
  return href ? (
    <Link href={href} aria-label="langgenie.ai home" className="inline-flex">
      {mark}
    </Link>
  ) : (
    mark
  );
}
