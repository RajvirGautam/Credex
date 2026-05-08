import type { ToolId, UseCase } from "@/lib/pricing";

export interface ToolInput {
  tool: ToolId;
  planId: string;       // current plan id
  monthlySpend: number; // USD per month, what the user actually pays
  seats: number;        // 1 for single-user products
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;     // total people in the company
  useCase: UseCase;     // primary use case
  // Free-form context the user can provide; consumed by the AI summary, not the engine.
  notes?: string;
}

export type RecommendationAction =
  | "keep"
  | "downgrade"
  | "switch"
  | "use-credits"
  | "consolidate";

export interface Recommendation {
  tool: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;       // monthly $ user reported
  action: RecommendationAction;
  recommendedPlan?: string;
  recommendedTool?: ToolId;
  recommendedToolName?: string;
  monthlySavings: number;
  annualSavings: number;
  reason: string;             // one sentence, references real numbers
  citation: string;           // vendor URL
}

export interface AuditResult {
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  band: "well-spent" | "small" | "medium" | "large";
  // Map of toolId -> reason it was suppressed (for transparency / debugging).
  suppressed: Record<string, string>;
}
