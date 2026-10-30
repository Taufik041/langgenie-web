import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Playground } from "@/components/dashboard/playground";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <>
      <PageHeader title="Playground" description="Record or upload Odia audio and see the output instantly. Playground runs count toward your usage." />
      <Suspense>
        <Playground />
      </Suspense>
    </>
  );
}
