"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronDown, Menu, AudioLines, Languages, BookOpen, Code2, FlaskConical, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Wordmark } from "./wordmark";
import { cn } from "@/lib/utils";

const MENUS = [
  {
    label: "Models",
    items: [
      { href: "/models/odia-odia", title: "Odia → Odia", desc: "Speech-to-Text in Odia script", icon: AudioLines },
      { href: "/models/odia-english", title: "Odia → English", desc: "Speech translation to English", icon: Languages },
    ],
  },
  {
    label: "Developers",
    items: [
      { href: "/docs", title: "Documentation", desc: "Guides & quickstart", icon: BookOpen },
      { href: "/docs/api/speech-to-text", title: "API Reference", desc: "Endpoints, params, errors", icon: Code2 },
      { href: "/dashboard/playground", title: "Playground", desc: "Try models in your browser", icon: FlaskConical },
      { href: "/dashboard/api-keys", title: "API Keys", desc: "Create & manage tokens", icon: KeyRound },
    ],
  },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState<string | null>(null);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={cn("sticky top-0 z-40 w-full transition-all", scrolled ? "bg-background/80 backdrop-blur-xl border-b" : "bg-transparent border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
          {MENUS.map((m) => (
            <div key={m.label} className="relative" onMouseEnter={() => setOpen(m.label)}>
              <button
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14.5px] text-foreground/80 hover:text-foreground"
                onClick={() => setOpen(open === m.label ? null : m.label)}
                aria-expanded={open === m.label}
              >
                {m.label}
                <ChevronDown className={cn("size-3.5 transition-transform", open === m.label && "rotate-180")} />
              </button>
              {open === m.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                  <div className="w-[340px] rounded-2xl border bg-card p-2 shadow-xl shadow-black/5 animate-in fade-in-0 zoom-in-95">
                    {m.items.map((it) => (
                      <Link key={it.href} href={it.href} onClick={() => setOpen(null)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted">
                        <span className="mt-0.5 grid size-9 place-items-center rounded-lg bg-accent text-[#b44d00]">
                          <it.icon className="size-[18px]" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{it.title}</span>
                          <span className="block text-[13px] text-muted-foreground">{it.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" className="rounded-full px-3.5 py-2 text-[14.5px] text-foreground/80 hover:text-foreground">Pricing</Link>
          <Link href="/docs" className="rounded-full px-3.5 py-2 text-[14.5px] text-foreground/80 hover:text-foreground">Docs</Link>
          <Link href="/contact" className="rounded-full px-3.5 py-2 text-[14.5px] text-foreground/80 hover:text-foreground">Company</Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="secondary" shape="pill" className="h-10 px-5">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild shape="pill" className="h-10 px-5">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Wordmark />
            <div className="mt-6 flex flex-col gap-6 overflow-y-auto">
              {MENUS.map((m) => (
                <div key={m.label}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  {m.items.map((it) => (
                    <Link key={it.href} href={it.href} className="flex items-center gap-3 rounded-lg py-2 text-[15px]">
                      <it.icon className="size-4 text-[#b44d00]" />
                      {it.title}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="flex flex-col gap-2 text-[15px]">
                <Link href="/pricing">Pricing</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="secondary" shape="pill" className="flex-1">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild shape="pill" className="flex-1">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
