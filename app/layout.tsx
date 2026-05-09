import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "RightSize — Free 60-second AI spend audit",
  description:
    "Tell us your AI tools and spend. Get a defensible breakdown of where you're overpaying — and exactly what to switch to.",
  openGraph: {
    title: "RightSize — Free AI spend audit",
    description: "60 seconds. No login. See what you'd save.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RightSize — Free AI spend audit",
    description: "60 seconds. No login. See what you'd save.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ScrollProgress />
        <Header />
        <main>{children}</main>
        <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6 text-xs text-ink-500">
          A free audit tool from <span className="font-medium text-ink-700">Credex</span>. Recommendations cite vendor pricing pages — verify before changing anything.
        </footer>
      </body>
    </html>
  );
}
