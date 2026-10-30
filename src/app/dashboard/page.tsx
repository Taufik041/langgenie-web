import Link from "next/link";
import { ArrowRight, AudioLines, BookOpen, FlaskConical, KeyRound, Languages } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getUsage } from "@/lib/usage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { CodeBlock } from "@/components/site/code-block";
import { MODELS } from "@/lib/models";
import { snippets } from "@/lib/snippets";

export const metadata = { title: "Dashboard" };

export default async function Overview() {
  const user = (await getCurrentUser())!;
  const u = await getUsage(user.id);
  const first = user.name.split(" ")[0];
  return (
    <>
      <PageHeader
        title={`Namaskar, ${first}`}
        description="Here’s what’s happening with your Odia voice workloads."
        action={
          <Button asChild shape="pill">
            <Link href="/dashboard/api-keys">
              <KeyRound /> Create API key
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Requests", u.total.toLocaleString("en-IN")],
          ["Audio processed", `${(u.seconds / 60).toFixed(1)} min`],
          ["Estimated spend", `₹${u.cost.toFixed(2)}`],
          ["Active API keys", String(u.keys)],
        ].map(([k, v]) => (
          <Card key={k} className="gap-2 py-5">
            <CardHeader className="px-5">
              <CardDescription>{k}</CardDescription>
            </CardHeader>
            <CardContent className="px-5 font-display text-3xl font-light">{v}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audio processed · last 14 days</CardTitle>
            <CardDescription>Across API and Playground</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={u.byDay} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Three steps to your first transcript</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { href: "/dashboard/api-keys", icon: KeyRound, t: "Create an API key", done: u.keys > 0 },
              { href: "/dashboard/playground", icon: FlaskConical, t: "Try a model in the Playground", done: u.byModel.some((m) => m.requests > 0) },
              { href: "/docs/quickstart", icon: BookOpen, t: "Follow the quickstart", done: false },
            ].map((s) => (
              <Link key={s.t} href={s.href} className="flex items-center gap-3 rounded-xl border p-3 text-sm hover:bg-muted/50">
                <span className={`grid size-8 place-items-center rounded-lg ${s.done ? "bg-emerald-50 text-emerald-700" : "bg-accent text-[#b44d00]"}`}>
                  <s.icon className="size-4" />
                </span>
                <span className={s.done ? "text-muted-foreground line-through" : ""}>{s.t}</span>
                <ArrowRight className="ml-auto size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-normal">Your models</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {MODELS.map((m, i) => {
          const s = u.byModel.find((x) => x.model.id === m.id)!;
          return (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-[#b44d00]">{i === 0 ? <AudioLines className="size-5" /> : <Languages className="size-5" />}</span>
                  <div>
                    <CardTitle className="text-base">
                      {m.name} <span className="ml-1 font-odia font-normal text-muted-foreground">{m.odiaLabel}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs">{m.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {s.requests} requests · {(s.seconds / 60).toFixed(1)} min
                </span>
                <Button asChild size="sm" variant="outline" shape="pill">
                  <Link href={`/dashboard/playground?model=${m.slug}`}>Open in Playground</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-normal">Quick integration</h2>
      <CodeBlock tabs={snippets("langgenie-od-od-v1")} />
    </>
  );
}
