import { describe, it, expect } from "vitest";
import { runAudit, bandFor } from "@/lib/engine";

describe("no-savings / well-spent path", () => {
  it("an already-optimal stack returns 0 savings and the well-spent band", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "writing",
      tools: [
        { tool: "claude", planId: "pro", seats: 1, monthlySpend: 20 },
      ],
    });
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations).toHaveLength(0);
    expect(result.band).toBe("well-spent");
  });

  it("bandFor classifies thresholds correctly", () => {
    expect(bandFor(0)).toBe("well-spent");
    expect(bandFor(50)).toBe("well-spent");
    expect(bandFor(150)).toBe("small");
    expect(bandFor(800)).toBe("medium");
    expect(bandFor(2500)).toBe("large");
  });
});
