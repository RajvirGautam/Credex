import type { Recommendation } from "@/lib/engine";
import { fmtMoney } from "@/lib/format";

const ACTION_LABEL: Record<Recommendation["action"], string> = {
  keep: "Keep",
  downgrade: "Downgrade",
  switch: "Switch",
  consolidate: "Consolidate",
  "use-credits": "Use credits",
};

const ACTION_COLOR: Record<Recommendation["action"], string> = {
  keep: "bg-ink-100 text-ink-700",
  downgrade: "bg-amber-100 text-amber-800",
  switch: "bg-sky-100 text-sky-800",
  consolidate: "bg-purple-100 text-purple-800",
  "use-credits": "bg-green-100 text-green-800",
};

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <article className="card">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-500">{rec.toolName}</p>
          <h3 className="mt-1 text-base font-medium">
            {rec.currentPlan}
            {rec.recommendedTool || rec.recommendedPlan ? (
              <> → {rec.recommendedTool ? rec.recommendedToolName : rec.recommendedPlan}</>
            ) : null}
          </h3>
        </div>
        <span className={`pill ${ACTION_COLOR[rec.action]}`}>{ACTION_LABEL[rec.action]}</span>
      </header>

      <p className="mt-3 text-sm text-ink-700">{rec.reason}</p>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4">
        <div>
          <p className="label">Now</p>
          <p className="font-mono text-sm">{fmtMoney(rec.currentSpend)}/mo</p>
        </div>
        <div>
          <p className="label">Save</p>
          <p className="font-mono text-sm text-accent">{fmtMoney(rec.monthlySavings)}/mo</p>
        </div>
        <div>
          <p className="label">Per year</p>
          <p className="font-mono text-sm">{fmtMoney(rec.annualSavings)}</p>
        </div>
      </div>

      <footer className="mt-3 text-xs text-ink-500">
        Cited:{" "}
        <a className="underline hover:text-ink-700" href={rec.citation} target="_blank" rel="noreferrer noopener">
          {new URL(rec.citation).hostname}
        </a>
      </footer>
    </article>
  );
}
