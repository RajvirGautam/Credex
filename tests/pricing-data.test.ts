import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/pricing";

const ALLOWED_DOMAINS = [
  "cursor.com",
  "github.com",
  "anthropic.com",
  "openai.com",
  "gemini.google",
  "windsurf.com",
];

describe("pricing data integrity", () => {
  it("every plan has a citation URL", () => {
    for (const t of TOOLS) {
      for (const p of t.plans) {
        expect(p.citation, `${t.id}/${p.id} missing citation`).toBeTruthy();
        expect(p.citation.startsWith("https://"), `${t.id}/${p.id} bad URL`).toBe(true);
      }
    }
  });

  it("every citation URL points at a vendor we trust", () => {
    for (const t of TOOLS) {
      for (const p of t.plans) {
        const ok = ALLOWED_DOMAINS.some((d) => p.citation.includes(d));
        expect(ok, `${t.id}/${p.id} citation domain not in allowlist: ${p.citation}`).toBe(true);
      }
    }
  });

  it("every tool has at least one paid plan or is usage-based", () => {
    for (const t of TOOLS) {
      const hasPaid = t.plans.some((p) => p.monthlyPerSeat > 0);
      const hasUsage = t.plans.some((p) => p.seatModel === "usage");
      expect(hasPaid || hasUsage, `${t.id} has no paid or usage plan`).toBe(true);
    }
  });
});
