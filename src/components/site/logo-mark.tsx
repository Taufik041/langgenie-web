import { cn } from "@/lib/utils";

/**
 * Wave Bars mark. The neutral bars follow currentColor, so the mark matches
 * whatever text colour it sits in (light, dark or inverted).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("size-7 shrink-0", className)}>
      <rect x="5" y="24" width="7" height="16" rx="3.5" fill="currentColor" />
      <rect x="16.5" y="14" width="7" height="36" rx="3.5" fill="currentColor" />
      <rect x="28.5" y="5" width="7" height="54" rx="3.5" fill="var(--saffron)" />
      <rect x="40.5" y="16" width="7" height="32" rx="3.5" fill="currentColor" />
      <rect x="52" y="25" width="7" height="14" rx="3.5" fill="var(--patta)" />
    </svg>
  );
}
