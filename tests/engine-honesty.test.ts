import { describe, it, expect } from "vitest";
import { isValidRec, runAudit } from "@/lib/engine";
import type { Recommendation } from "@/lib/engine";

describe("engine honesty", () => {
  it("rejects a recommendation with savings under $10/mo", () => {
    const rec: Recommendation = {
      tool: "cursor",
      toolName: "Cursor",
      currentPlan: "Pro",
      currentSpend: 20,
      action: "downgrade",
      recommendedPlan: "Hobby",
      monthlySavings: 5,
      annualSavings: 60,
      reason: "test",
      citation: "https://cursor.com/pricing",
    };
    expect(isValidRec(rec)).toBe(false);
  });

  it("rejects a recommendation that is missing a citation", () => {
    const rec: Recommendation = {
      tool: "cursor",
      toolName: "Cursor",
      currentPlan: "Business",
      currentSpend: 40,
      action: "downgrade",
      recommendedPlan: "Pro",
      monthlySavings: 20,
      annualSavings: 240,
      reason: "test",
      citation: "",
    };
    expect(isValidRec(rec)).toBe(false);
  });

  it("never claims annual != monthly * 12", () => {
    const result = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [{ tool: "cursor", planId: "business", seats: 2, monthlySpend: 80 }],
    });
    for (const r of result.recommendations) {
      expect(r.annualSavings).toBe(r.monthlySavings * 12);
    }
  });
});
