import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditBySlug } from "@/lib/db";
import ResultsHero from "@/components/ResultsHero";
import RecommendationCard from "@/components/RecommendationCard";
import ResultsCta from "@/components/ResultsCta";
import SummaryBlock from "@/components/SummaryBlock";
import ShareBar from "@/components/ShareBar";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = await getAuditBySlug(slug);
  if (!a) return { title: "Audit not found · RightSize" };
  const dollars = `$${Math.round(a.results.totalMonthlySavings).toLocaleString()}/mo`;
  const title = a.results.totalMonthlySavings > 0
    ? `${dollars} of AI spend leak — RightSize audit`
    : `Spending well — RightSize audit`;
  const desc = a.results.totalMonthlySavings > 0
    ? `Audit found ${dollars} ($${Math.round(a.results.totalAnnualSavings).toLocaleString()}/yr) of leakage across ${a.inputs.tools.length} AI tool${a.inputs.tools.length === 1 ? "" : "s"}.`
    : `This stack is already tuned. RightSize couldn't find $10/mo+ of leakage.`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [{ url: `${baseUrl()}/api/og?slug=${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [`${baseUrl()}/api/og?slug=${slug}`],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { slug } = await params;
  const audit = await getAuditBySlug(slug);
  if (!audit) notFound();

  const shareUrl = `${baseUrl()}/a/${slug}`;
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
      <ResultsHero result={audit.results} />

      <SummaryBlock
        initialText={audit.summary?.text}
        source={audit.summary?.source}
        slug={slug}
      />

      {audit.results.recommendations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Per-tool breakdown</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {audit.results.recommendations.map((r, i) => (
              <RecommendationCard key={`${r.tool}-${i}`} rec={r} />
            ))}
          </div>
        </section>
      )}

      <ResultsCta result={audit.results} slug={slug} />
      <ShareBar url={shareUrl} />

      {Object.keys(audit.results.suppressed).length > 0 && (
        <details className="card">
          <summary className="cursor-pointer text-sm font-medium">Why some tools weren't flagged</summary>
          <ul className="mt-3 space-y-1 text-sm text-ink-600">
            {Object.entries(audit.results.suppressed).map(([k, v]) => (
              <li key={k}><span className="font-mono text-ink-700">{k}</span> — {v}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
