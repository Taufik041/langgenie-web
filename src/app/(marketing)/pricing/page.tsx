import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pricing" };

const PLANS = [
  { name: "Starter", price: "Free", sub: "₹500 in credits to explore", cta: "Sign up", href: "/signup", features: ["Both Odia models", "Playground access", "2 API keys", "Community support"] },
  { name: "Pay as you go", price: "From ₹30", sub: "per hour of audio", cta: "Get API key", href: "/signup", featured: true, features: ["Everything in Starter", "Up to 10 API keys", "Higher rate limits", "Usage dashboard", "Email support"] },
  { name: "Enterprise", price: "Custom", sub: "volume & deployment pricing", cta: "Contact sales", href: "/contact", features: ["Private cloud / on-prem", "Custom fine-tuning on your domain", "SLA & dedicated support", "SSO & audit logs"] },
];

export default function PricingPage() {
  return (
    <div className="relative -mt-16 overflow-hidden pt-16">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Pricing</Badge>
          <h1 className="mt-6 text-5xl font-light sm:text-6xl">Simple, per-second pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Pay only for the audio you process, billed per second. No minimums.</p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-3xl border bg-card p-8", p.featured && "border-foreground shadow-[0_20px_60px_-30px_rgba(21,19,43,.45)]")}>
              <div className="flex items-center justify-between">
                <p className="font-medium">{p.name}</p>
                {p.featured && <Badge variant="saffron">Most popular</Badge>}
              </div>
              <p className="mt-6 font-display text-4xl font-light">{p.price}</p>
              <p className="text-sm text-muted-foreground">{p.sub}</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="size-4 text-saffron" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild shape="pill" variant={p.featured ? "default" : "outline"} className="mt-8 h-11">
                <Link href={p.href}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-3xl border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-light">API rates</h2>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Model ID</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Price / hour</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODELS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">
                    {m.name} <span className="ml-1 font-odia text-muted-foreground">{m.odiaLabel}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="font-mono text-xs">POST {m.endpoint}</TableCell>
                  <TableCell className="text-right">₹{m.pricePerHour}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted-foreground">Billed per second of input audio. Prices exclude GST.</p>
        </div>
      </div>
    </div>
  );
}
