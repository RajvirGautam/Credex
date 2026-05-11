import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/engine";

describe("aggregate consistency", () => {
  it("hero total equals the sum of per-tool savings", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [
        { tool: "cursor", planId: "business", seats: 1, monthlySpend: 40 },
        { tool: "chatgpt", planId: "team", seats: 1, monthlySpend: 30 },
      ],
    });
    const sum = result.recommendations.reduce((s, r) => s + r.monthlySavings, 0);
    expect(result.totalMonthlySavings).toBe(sum);
    expect(result.totalAnnualSavings).toBe(sum * 12);
  });

  it("consolidation does not double-count: dropped tools don't get extra recs on top", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [
        { tool: "cursor", planId: "pro", seats: 1, monthlySpend: 20 },
        { tool: "copilot", planId: "business", seats: 1, monthlySpend: 19 },
        { tool: "windsurf", planId: "pro", seats: 1, monthlySpend: 15 },
      ],
    });
    // Exactly one consolidation rec; cheapest (windsurf @ $15) is kept, drop cursor $20 + copilot $19 = $39/mo.
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].action).toBe("consolidate");
    expect(result.totalMonthlySavings).toBe(39);
    expect(result.totalAnnualSavings).toBe(39 * 12);
  });
});
