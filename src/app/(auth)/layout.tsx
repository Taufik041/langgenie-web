import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/site/wordmark";
import { getCurrentUser } from "@/lib/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <Wordmark />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">
          By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-[#0f0e1d] text-white lg:block">
        <div className="absolute inset-0" style={{ background: "radial-gradient(50% 50% at 70% 30%, rgba(139,123,255,.35), transparent 70%), radial-gradient(50% 50% at 30% 80%, rgba(255,122,26,.35), transparent 70%)" }} />
        <div className="grain absolute inset-0 opacity-70" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Wordmark inverted endorse href={null} />
          <div>
            <p className="font-odia text-4xl leading-snug">ଆପଣଙ୍କ ସ୍ୱର,<br />ଆପଣଙ୍କ ଭାଷା।</p>
            <p className="mt-3 text-white/60">Your voice, your language.</p>
            <div className="mt-10 grid max-w-md gap-3">
              {[
                ["Odia → Odia", "ନମସ୍କାର, ମୁଁ ଆଜି ମୋ ଜମିର ପଟ୍ଟା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି।", true],
                ["Odia → English", "Hello, today I would like to know about the land record of my plot.", false],
              ].map(([l, t, o]) => (
                <div key={String(l)} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs text-white/50">{l}</p>
                  <p className={o ? "mt-1 font-odia text-[15px]" : "mt-1 text-[15px]"}>{t}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} langgenie.ai · A BIPROS product</p>
        </div>
      </div>
    </div>
  );
}
