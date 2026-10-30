import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/site/code-block";
import { MODELS, getModel } from "@/lib/models";
import { sampleResponse, snippets } from "@/lib/snippets";

export function generateStaticParams() {
  return MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = getModel((await params).slug);
  return { title: m ? `${m.name} ${m.short}` : "Model" };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = getModel((await params).slug);
  if (!m) notFound();
  const other = MODELS.find((x) => x.id !== m.id)!;
  return (
    <>
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <Badge variant="outline">{m.short}</Badge>
          <h1 className="mt-6 text-5xl font-light sm:text-7xl">{m.name}</h1>
          <p className="mt-3 font-odia text-2xl text-foreground/70">{m.odiaLabel}</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{m.description}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl">
              <Link href="/dashboard/playground">Try in Playground</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={`/docs/api/${m.endpoint.split("/").pop()}`}>API reference</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-3">
        {[
          ["Model ID", m.id],
          ["Endpoint", `POST ${m.endpoint}`],
          ["Price", `₹${m.pricePerHour} / hour of audio`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="mt-2 font-mono text-[15px]">{v}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-light">What it’s good at</h2>
          <ul className="mt-6 space-y-3">
            {m.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-[15px]">
                <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent text-[#b44d00]">
                  <Check className="size-3" />
                </span>
                {h}
              </li>
            ))}
            <li className="flex items-start gap-3 text-[15px]">
              <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent text-[#b44d00]">
                <Check className="size-3" />
              </span>
              WAV, MP3, M4A, OGG, FLAC, WebM · up to 25 MB
            </li>
          </ul>
          <h3 className="mt-12 text-lg font-medium">Sample response</h3>
          <CodeBlock className="mt-3" tabs={[{ label: "JSON", code: sampleResponse(m.id) }]} title="200 OK" />
        </div>
        <div>
          <h2 className="text-3xl font-light">Quick integration</h2>
          <CodeBlock className="mt-6" tabs={snippets(m.id)} />
          <Link href={`/models/${other.slug}`} className="mt-8 flex items-center justify-between rounded-2xl border bg-card p-6 hover:bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Also available</p>
              <p className="mt-1 text-xl">
                {other.name} <span className="font-odia text-base text-muted-foreground">· {other.odiaLabel}</span>
              </p>
            </div>
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
