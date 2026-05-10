import type { AuditResult } from "@/lib/engine";
import { fmtMoney } from "@/lib/format";

export default function ResultsHero({ result }: { result: AuditResult }) {
  const wellSpent = result.totalMonthlySavings === 0 || result.recommendations.length === 0;

  if (wellSpent) {
    return (
      <section className="card flex flex-col gap-3 bg-ink-900 text-white">
        <p className="text-xs uppercase tracking-wide text-ink-300">Verdict</p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">You're spending well.</h2>
        <p className="text-ink-200">
          Nothing in your stack obviously needs to change. We won't manufacture a problem to justify a CTA — re-run this audit when you add a tool or grow the team.
        </p>
      </section>
    );
  }

  return (
    <section className="card bg-ink-900 text-white">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Estimated leak</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
            {fmtMoney(result.totalMonthlySavings)}
            <span className="ml-1 text-base font-normal text-ink-300">/mo</span>
          </p>
          <p className="mt-1 text-ink-300">{fmtMoney(result.totalAnnualSavings)} per year</p>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-xs uppercase tracking-wide text-ink-300">Of your current spend</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{fmtMoney(result.totalCurrentSpend)}/mo</p>
          <p className="mt-1 text-sm text-ink-300">
            {result.totalCurrentSpend > 0
              ? `~${Math.round((result.totalMonthlySavings / result.totalCurrentSpend) * 100)}% reduction available`
              : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
