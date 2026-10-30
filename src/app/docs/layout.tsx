import { SiteHeader } from "@/components/site/site-header";
import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[240px_1fr]">
        <DocsSidebar />
        <div className="min-w-0 py-10">{children}</div>
      </div>
    </>
  );
}
