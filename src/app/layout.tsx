import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "langgenie.ai — Voice AI for Odia", template: "%s · langgenie.ai" },
  description: "Odia speech-to-text and Odia-to-English speech translation APIs. Powered by BIPROS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
