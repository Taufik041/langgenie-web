import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOCS, getDoc } from "@/content/docs";

export function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug ? d.slug.split("/") : [] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const doc = getDoc(((await params).slug ?? []).join("/"));
  return { title: doc ? `${doc.title} · Docs` : "Docs", description: doc?.description };
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = ((await params).slug ?? []).join("/");
  const doc = getDoc(slug);
  if (!doc) notFound();
  const i = DOCS.indexOf(doc);
  const prev = DOCS[i - 1];
  const next = DOCS[i + 1];
  const href = (s: string) => (s ? `/docs/${s}` : "/docs");
  return (
    <article className="max-w-3xl">
      <p className="text-sm font-medium text-saffron">{doc.section}</p>
      <h1 className="mt-2 text-4xl font-light">{doc.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{doc.description}</p>
      <div className="prose-docs mt-8">{doc.body}</div>
      <div className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2">
        {prev ? (
          <Link href={href(prev.slug)} className="rounded-2xl border p-4 hover:bg-muted/50">
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="size-3" /> Previous</span>
            <span className="mt-1 block font-medium">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={href(next.slug)} className="rounded-2xl border p-4 text-right hover:bg-muted/50">
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next <ArrowRight className="size-3" /></span>
            <span className="mt-1 block font-medium">{next.title}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
