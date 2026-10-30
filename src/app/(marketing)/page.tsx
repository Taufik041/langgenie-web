import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Building2,
  Cloud,
  Gauge,
  HardDrive,
  Languages,
  Lock,
  MapPin,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VoiceDemo } from "@/components/site/voice-demo";
import { CodeBlock } from "@/components/site/code-block";
import { MODELS } from "@/lib/models";
import { snippets } from "@/lib/snippets";

const USE_CASES = [
  "Citizen services & grievance lines",
  "Agri advisory helplines",
  "Healthcare & tele-medicine",
  "Banking & insurance calls",
  "Education & e-learning",
  "News, media & subtitles",
  "Contact-centre analytics",
  "Voice bots & IVR",
];

const FAQ = [
  ["What does langgenie.ai do?", "langgenie.ai offers two voice models for Odia: Odia → Odia speech-to-text, which returns Odia script, and Odia → English speech translation, which returns English text directly from Odia audio."],
  ["Which audio formats are supported?", "WAV, MP3, M4A, OGG/Opus, FLAC and WebM up to 25 MB per request. 16 kHz mono audio gives the best accuracy-to-size ratio."],
  ["Do you handle dialects and code-mixed speech?", "Yes. The models are tuned for everyday Odia — including regional varieties such as Sambalpuri — and speech that mixes Odia with English words."],
  ["How do I get an API key?", "Create a free account, open the dashboard and go to API Keys. Keys are shown once at creation and can be revoked at any time."],
  ["Can we deploy on our own infrastructure?", "Yes. Besides the cloud API, we support private-cloud and on-premises deployments for government and regulated enterprises. Contact us to discuss."],
];

export default function Home() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="ring-lines pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-[13px] text-muted-foreground backdrop-blur">
            <span className="font-odia text-foreground">ଓଡ଼ିଆ</span>
            <span className="h-3 w-px bg-border" />
            Odia Voice AI Platform · Powered by <b className="font-semibold text-foreground">BIPROS</b>
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl text-[44px] font-light leading-[1.02] tracking-[-0.035em] sm:text-7xl">
            Voice AI that speaks <span className="font-normal">Odia</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-8 text-muted-foreground sm:text-lg">
            Production-grade speech models for Odia. Turn Odia speech into Odia text, or translate it straight into English — with one simple API.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="xl">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          <div className="mt-16">
            <VoiceDemo />
          </div>
        </div>
      </section>

      {/* ---------------- USE CASES MARQUEE ---------------- */}
      <section className="border-y bg-card/60 py-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Built for how Odisha talks</p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-3">
            {[...USE_CASES, ...USE_CASES].map((u, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border bg-card px-4 py-2 text-sm text-foreground/75">
                {u}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MODELS ---------------- */}
      <section id="models" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="saffron">Models</Badge>
          <h2 className="mt-4 text-4xl font-light sm:text-5xl">Two models. One language we care about.</h2>
          <p className="mt-4 text-muted-foreground">Focused, not sprawling — every bit of training and evaluation goes into Odia.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {MODELS.map((m, i) => (
            <div key={m.id} className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition hover:shadow-[0_20px_60px_-30px_rgba(21,19,43,0.35)]">
              <div
                className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full opacity-60 blur-3xl"
                style={{ background: i === 0 ? "radial-gradient(circle,#ffd9b8,transparent 70%)" : "radial-gradient(circle,#dcd5ff,transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-[#b44d00]">
                    {i === 0 ? <AudioLines className="size-5" /> : <Languages className="size-5" />}
                  </span>
                  <code className="font-mono text-xs text-muted-foreground">{m.id}</code>
                </div>
                <p className="mt-8 text-sm text-muted-foreground">{m.short}</p>
                <h3 className="mt-1 text-3xl font-normal">{m.name}</h3>
                <p className="mt-1 font-odia text-lg text-foreground/70">{m.odiaLabel}</p>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">{m.description}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-muted/70 p-3">
                    <p className="text-xs text-muted-foreground">Input</p>
                    <p className="mt-0.5 font-medium">{m.input}</p>
                  </div>
                  <div className="rounded-xl bg-muted/70 p-3">
                    <p className="text-xs text-muted-foreground">Output</p>
                    <p className="mt-0.5 font-medium">{m.output}</p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                  {m.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2">
                      <Sparkles className="size-3.5 text-saffron" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Button asChild shape="pill">
                    <Link href="/dashboard/playground">
                      Try in Playground <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" shape="pill">
                    <Link href={`/models/${m.slug}`}>Learn more</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- BUILD WITH API ---------------- */}
      <section className="bg-[#0f0e1d] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Badge className="bg-white/10 text-white">Developers</Badge>
            <h2 className="mt-4 text-4xl font-light sm:text-5xl">Build anything with langgenie APIs</h2>
            <p className="mt-4 max-w-lg text-white/65">A clean REST API with predictable JSON. Go from sign-up to your first Odia transcript in under five minutes.</p>
            <ol className="mt-10 space-y-6">
              {[
                ["Get your API key", "Create a key in the dashboard. Only a hash is stored on our side."],
                ["Send Odia audio", "POST a WAV/MP3 file to /v1/speech-to-text or /v1/speech-translate."],
                ["Use the text", "Receive Odia script or English, with optional timestamps."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-xs">0{i + 1}</span>
                  <div>
                    <p className="font-medium">{t}</p>
                    <p className="text-sm text-white/60">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="xl" className="bg-white text-[#15132b] hover:bg-white/90">
                <Link href="/dashboard/api-keys">Get your API key</Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/docs/quickstart">
                  Read the quickstart <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
          <CodeBlock dark tabs={snippets("langgenie-od-od-v1")} title="speech-to-text" />
        </div>
      </section>

      {/* ---------------- PILLARS ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <Badge variant="saffron">Why langgenie</Badge>
          <h2 className="mt-4 text-4xl font-light sm:text-5xl">Made for Odia, from the ground up</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: MapPin, t: "Rooted in Odisha", d: "Trained and evaluated on real Odia speech — rural and urban, formal and everyday, with regional dialects in the mix." },
            { icon: Gauge, t: "Fast at scale", d: "Batch large archives or serve live traffic. Autoscaling inference keeps latency low as call volumes grow." },
            { icon: ShieldCheck, t: "Secure by design", d: "Hashed API keys, encrypted transport, and no training on your audio without consent. Private deployments on request." },
          ].map((p) => (
            <div key={p.t} className="rounded-3xl border bg-card p-7">
              <p.icon className="size-6 text-saffron" />
              <h3 className="mt-8 text-xl font-normal">{p.t}</h3>
              <p className="mt-2 text-[15px] leading-7 text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- DEPLOYMENT ---------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-[32px] border bg-card p-8 sm:p-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <Badge variant="outline">Enterprise-grade</Badge>
              <h2 className="mt-4 text-4xl font-light">Deploy the way you need</h2>
              <p className="mt-3 text-muted-foreground">From a quick prototype to state-wide rollouts, the same models run wherever your data must live.</p>
            </div>
            <Button asChild variant="outline" shape="pill">
              <Link href="/contact">
                Talk to sales <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Cloud, t: "langgenie Cloud", d: "Fully managed API. Sign up, get a key, start building in minutes." },
              { icon: ServerCog, t: "Private Cloud", d: "Dedicated, isolated deployment in your VPC with your own scaling limits." },
              { icon: HardDrive, t: "On-Premises", d: "Air-gapped installs for government and regulated industries." },
            ].map((d) => (
              <div key={d.t} className="rounded-2xl bg-muted/60 p-6">
                <d.icon className="size-5" />
                <p className="mt-6 font-medium">{d.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Lock className="size-4" /> Encrypted in transit</span>
            <span className="inline-flex items-center gap-2"><Building2 className="size-4" /> Data residency in India</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4" /> Role-based access</span>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-4xl font-light">Questions, answered</h2>
          <p className="mt-3 text-muted-foreground">
            Can’t find what you need? <Link href="/contact" className="underline underline-offset-4">Contact us</Link>.
          </p>
        </div>
        <Accordion type="single" collapsible className="rounded-3xl border bg-card px-6">
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#0f0e1d] px-6 py-20 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(40% 60% at 50% 100%, rgba(255,122,26,.35), transparent 70%)" }} />
          <div className="grain pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <p className="font-odia text-lg text-white/70">ଆସନ୍ତୁ, ଓଡ଼ିଆରେ କୁହନ୍ତୁ।</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-light sm:text-5xl">Start building with Odia voice AI</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/65">Free credits on sign-up. No card required.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="xl" className="bg-white text-[#15132b] hover:bg-white/90">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
