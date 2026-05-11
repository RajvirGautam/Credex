import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/engine";
import { templatedSummary } from "@/lib/summary";

describe("summary fallback", () => {
  it("templated summary contains the real numbers from the audit", () => {
    const result = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [{ tool: "cursor", planId: "business", seats: 2, monthlySpend: 80 }],
    });
    const text = templatedSummary(result);
    expect(text).toContain("$40");        // monthly savings
    expect(text).toContain("$480");        // annual savings
    expect(text.toLowerCase()).toContain("cursor");
  });

  it("templated summary handles the no-savings case without manufacturing numbers", () => {
    const result = runAudit({
      teamSize: 1,
      useCase: "writing",
      tools: [{ tool: "claude", planId: "pro", seats: 1, monthlySpend: 20 }],
    });
    const text = templatedSummary(result);
    expect(text.toLowerCase()).toContain("spending well");
    expect(text).not.toContain("$0");
  });
});
