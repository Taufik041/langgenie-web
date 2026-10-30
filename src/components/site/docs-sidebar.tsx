"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { section: "Getting started", pages: [["Introduction", ""], ["Quickstart", "quickstart"], ["Authentication", "authentication"]] },
  { section: "Models", pages: [["Odia → Odia", "models/odia-odia"], ["Odia → English", "models/odia-english"]] },
  { section: "API reference", pages: [["Speech to Text", "api/speech-to-text"], ["Speech Translate", "api/speech-translate"], ["Errors", "errors"], ["Rate limits", "rate-limits"]] },
];

export function DocsSidebar() {
  const path = usePathname();
  return (
    <aside className="top-16 h-fit border-b py-6 lg:sticky lg:h-[calc(100svh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-10 lg:pr-6">
      <nav className="flex gap-8 overflow-x-auto lg:block lg:space-y-8">
        {NAV.map((s) => (
          <div key={s.section} className="shrink-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.section}</p>
            <ul className="flex gap-1 lg:block lg:space-y-0.5">
              {s.pages.map(([label, slug]) => {
                const href = slug ? `/docs/${slug}` : "/docs";
                const active = path === href;
                return (
                  <li key={href}>
                    <Link href={href} className={cn("block whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors", active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
