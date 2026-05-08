import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/engine";

describe("plan-fit rule", () => {
  it("Cursor Business with 2 seats / coding-only / small team → recommends Pro, saves $40/mo", () => {
    const result = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [{ tool: "cursor", planId: "business", seats: 2, monthlySpend: 80 }],
    });
    expect(result.recommendations).toHaveLength(1);
    const rec = result.recommendations[0];
    expect(rec.tool).toBe("cursor");
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("Pro");
    expect(rec.monthlySavings).toBe(40);
    expect(rec.annualSavings).toBe(480);
    expect(rec.citation).toContain("cursor.com");
  });

  it("Cursor Business with 15-person team is left alone (org-scale needs the tier)", () => {
    const result = runAudit({
      teamSize: 15,
      useCase: "coding",
      tools: [{ tool: "cursor", planId: "business", seats: 10, monthlySpend: 400 }],
    });
    // No plan-fit downgrade; the engine should suppress with empty recs.
    expect(result.recommendations).toHaveLength(0);
    expect(result.totalMonthlySavings).toBe(0);
  });
});
