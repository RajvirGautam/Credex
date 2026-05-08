import type { AuditInput, AuditResult } from "./types";
import { runRules } from "./rules";

export function bandFor(monthlySavings: number): AuditResult["band"] {
  if (monthlySavings < 100) return "well-spent";
  if (monthlySavings < 500) return "small";
  if (monthlySavings < 2000) return "medium";
  return "large";
}

export function runAudit(input: AuditInput): AuditResult {
  const { recs, suppressed } = runRules(input);
  const totalMonthlySavings = recs.reduce((s, r) => s + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = input.tools.reduce((s, t) => s + t.monthlySpend, 0);
  return {
    recommendations: recs,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    band: bandFor(totalMonthlySavings),
    suppressed,
  };
}
