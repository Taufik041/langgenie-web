export const metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-5xl font-light">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div className="prose-docs mt-10">
        <p>This is a placeholder for the langgenie.ai Privacy Policy. Replace it with the final text reviewed by your legal team before launch.</p>
      </div>
    </div>
  );
}
