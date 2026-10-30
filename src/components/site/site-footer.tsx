import Link from "next/link";
import { Wordmark } from "./wordmark";

const COLS = [
  { title: "Models", links: [["Odia → Odia", "/models/odia-odia"], ["Odia → English", "/models/odia-english"], ["Pricing", "/pricing"]] },
  { title: "Developers", links: [["Documentation", "/docs"], ["Quickstart", "/docs/quickstart"], ["API Reference", "/docs/api/speech-to-text"], ["Playground", "/dashboard/playground"], ["API Keys", "/dashboard/api-keys"]] },
  { title: "Company", links: [["About", "/contact"], ["Contact Us", "/contact"], ["Careers", "/contact"]] },
  { title: "Legal", links: [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Wordmark endorse />
          <p className="mt-5 font-odia text-[15px] text-foreground/80">ଓଡ଼ିଆ ପାଇଁ ସ୍ୱର AI</p>
          <p className="mt-1 text-sm text-muted-foreground">Voice AI for every Odia speaker — Odia speech-to-text and Odia-to-English translation through one simple API.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-medium">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="text-sm text-muted-foreground hover:text-foreground">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} langgenie.ai · A BIPROS product. All rights reserved.</span>
          <span>Built for Odia.</span>
        </div>
      </div>
    </footer>
  );
}
