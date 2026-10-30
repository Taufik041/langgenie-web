import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/wordmark";

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <Wordmark />
        <p className="mt-10 font-odia text-2xl text-muted-foreground">ଏହି ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ</p>
        <h1 className="mt-2 text-5xl font-light">Page not found</h1>
        <Button asChild shape="pill" className="mt-8">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
