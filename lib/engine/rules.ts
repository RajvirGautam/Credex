import { CODING_TOOLS, getPlan, getTool, type ToolId } from "@/lib/pricing";
import type { AuditInput, Recommendation, ToolInput } from "./types";

const NOISE_FLOOR_USD = 10; // suppress recs below $10/mo savings — see PROMPTS/engine-honesty rules

function expectedMonthlyForPlan(toolId: ToolId, planId: string, seats: number): number {
  const plan = getPlan(toolId, planId);
  if (plan.seatModel === "per-seat") return plan.monthlyPerSeat * Math.max(1, seats);
  if (plan.seatModel === "single") return plan.monthlyPerSeat;
  return 0; // usage-based; we trust the user's reported spend
}

function tool(input: ToolInput) {
  return getTool(input.tool);
}

function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

// Rule 1: plan-fit — overpaying for a tier whose features they don't need.
// e.g., Cursor Business with 2 seats / coding use → Pro is enough.
function planFit(input: ToolInput, audit: AuditInput): Recommendation | null {
  const t = tool(input);
  if (input.tool === "anthropic-api" || input.tool === "openai-api") return null;
  const current = getPlan(input.tool, input.planId);
  if (current.monthlyPerSeat === 0) return null;

  // Find the cheapest paid plan in the same tool whose seatModel matches and price is lower.
  const cheaperPaid = t.plans
    .filter((p) => p.id !== current.id && p.monthlyPerSeat > 0 && p.monthlyPerSeat < current.monthlyPerSeat)
    .filter((p) => p.seatModel === current.seatModel)
    .sort((a, b) => a.monthlyPerSeat - b.monthlyPerSeat)[0];
  if (!cheaperPaid) return null;

  // Heuristic for "you need the higher tier": team size >= 10 or seats >= 5 → keep business/team.
  // We only downgrade when team is small AND seats <= 3.
  if (audit.teamSize >= 10 || input.seats > 3) return null;

  const recCost = expectedMonthlyForPlan(input.tool, cheaperPaid.id, input.seats);
  const monthlySavings = Math.max(0, input.monthlySpend - recCost);
  if (monthlySavings < NOISE_FLOOR_USD) return null;

  return {
    tool: input.tool,
    toolName: t.name,
    currentPlan: current.label,
    currentSpend: input.monthlySpend,
    action: "downgrade",
    recommendedPlan: cheaperPaid.label,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `${t.name} ${current.label} costs ${fmtMoney(input.monthlySpend)}/mo for ${input.seats} seat${input.seats === 1 ? "" : "s"}; ${cheaperPaid.label} covers your use case at ${fmtMoney(recCost)}/mo.`,
    citation: cheaperPaid.citation,
  };
}

// Rule 2: cheaper-plan-same-vendor — Team plan ($30 x N) when individual seats would be cheaper for the headcount.
// e.g., ChatGPT Team @ 1 seat would be billed at the team minimum; Plus is $20.
function cheaperPlanSameVendor(input: ToolInput, _audit: AuditInput): Recommendation | null {
  const t = tool(input);
  const current = getPlan(input.tool, input.planId);
  if (current.seatModel !== "per-seat") return null;
  if (current.monthlyPerSeat === 0) return null;

  // Find a single-seat plan in the same vendor that's cheaper than seats * current.
  const single = t.plans.find((p) => p.seatModel === "single" && p.monthlyPerSeat > 0 && p.monthlyPerSeat < current.monthlyPerSeat);
  if (!single) return null;

  // Only fire when seats is 1 — beyond 1 seat, single-user plans aren't a substitute.
  if (input.seats !== 1) return null;

  const recCost = single.monthlyPerSeat;
  const monthlySavings = Math.max(0, input.monthlySpend - recCost);
  if (monthlySavings < NOISE_FLOOR_USD) return null;

  return {
    tool: input.tool,
    toolName: t.name,
    currentPlan: current.label,
    currentSpend: input.monthlySpend,
    action: "downgrade",
    recommendedPlan: single.label,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `${t.name} ${current.label} is a multi-seat plan but you only have 1 seat; the single-user ${single.label} plan is ${fmtMoney(recCost)}/mo.`,
    citation: single.citation,
  };
}

// Rule 3: cross-tool consolidation — paying for two coding tools when one covers the use case.
// Returns at most one consolidation rec per audit; the caller should dedupe so we don't double-count.
function consolidationRec(audit: AuditInput): Recommendation | null {
  if (!["coding", "mixed"].includes(audit.useCase)) return null;
  const codingPaid = audit.tools.filter(
    (t) => CODING_TOOLS.includes(t.tool) && t.monthlySpend > 0,
  );
  if (codingPaid.length < 2) return null;

  // Keep the cheapest, drop the others.
  const sorted = [...codingPaid].sort((a, b) => a.monthlySpend - b.monthlySpend);
  const keep = sorted[0];
  const drop = sorted.slice(1);
  const dropSpend = drop.reduce((s, x) => s + x.monthlySpend, 0);
  if (dropSpend < NOISE_FLOOR_USD) return null;

  const dropNames = drop.map((d) => getTool(d.tool).name).join(" + ");
  const keepName = getTool(keep.tool).name;
  return {
    tool: drop[0].tool,                  // attach to the first dropped tool for sort/grouping
    toolName: dropNames,
    currentPlan: drop.map((d) => getPlan(d.tool, d.planId).label).join(" / "),
    currentSpend: dropSpend,
    action: "consolidate",
    recommendedTool: keep.tool,
    recommendedToolName: keepName,
    monthlySavings: dropSpend,
    annualSavings: dropSpend * 12,
    reason: `You're paying for ${codingPaid.length} coding tools (${codingPaid.map((t) => getTool(t.tool).name).join(", ")}); pick one — ${keepName} at ${fmtMoney(keep.monthlySpend)}/mo is your cheapest — and drop ${dropNames} (${fmtMoney(dropSpend)}/mo).`,
    citation: getTool(keep.tool).plans[0].citation,
  };
}

// Rule 4: API → Credex credits — when monthly API spend is large enough that Credex margins beat retail.
// Conservative threshold: $200/mo API spend triggers the recommendation; assumed credit savings 10%.
function credexCreditsForApi(input: ToolInput, _audit: AuditInput): Recommendation | null {
  if (input.tool !== "anthropic-api" && input.tool !== "openai-api") return null;
  if (input.monthlySpend < 200) return null;
  const t = tool(input);
  const monthlySavings = Math.round(input.monthlySpend * 0.10);
  if (monthlySavings < NOISE_FLOOR_USD) return null;
  return {
    tool: input.tool,
    toolName: t.name,
    currentPlan: "Pay-as-you-go",
    currentSpend: input.monthlySpend,
    action: "use-credits",
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `At ${fmtMoney(input.monthlySpend)}/mo on ${t.name}, buying through Credex credits typically saves ~10% (${fmtMoney(monthlySavings)}/mo) without changing how you call the API.`,
    citation: t.plans[0].citation,
  };
}

// Rule 5: API-vs-subscription — heavy single-user research/writing on ChatGPT Plus + low API spend → flag.
// Conservative — we only suggest API when team_size === 1 AND use_case is research/writing AND user already has API spend signal.
function apiVsSubscription(input: ToolInput, audit: AuditInput): Recommendation | null {
  if (input.tool !== "chatgpt") return null;
  const current = getPlan(input.tool, input.planId);
  if (current.id !== "plus") return null;
  if (audit.teamSize !== 1) return null;
  if (!["research", "writing"].includes(audit.useCase)) return null;
  // Only flag when the user is NOT already heavy on the OpenAI API (otherwise the rec is noise).
  const openaiApi = audit.tools.find((t) => t.tool === "openai-api");
  if (openaiApi && openaiApi.monthlySpend > 30) return null;
  // Estimated API spend for a light single user: ~$8/mo. Savings = $20 - $8 = $12.
  const monthlySavings = 12;
  return {
    tool: input.tool,
    toolName: tool(input).name,
    currentPlan: current.label,
    currentSpend: input.monthlySpend,
    action: "switch",
    recommendedTool: "openai-api",
    recommendedToolName: "OpenAI API + a thin client",
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `As a solo ${audit.useCase} user on ChatGPT Plus, switching to direct API access via a lightweight client typically lands at ~$8/mo for similar usage — about ${fmtMoney(monthlySavings)}/mo cheaper.`,
    citation: getTool("openai-api").plans[0].citation,
  };
}

// Rule 6: cross-tool substitute — substitution within same use case, e.g. Copilot Business → Cursor Pro.
// We only fire substitution when the consolidation rule didn't already cover it.
function substituteRec(input: ToolInput, audit: AuditInput, alreadyConsolidated: Set<ToolId>): Recommendation | null {
  if (alreadyConsolidated.has(input.tool)) return null;
  const t = tool(input);
  if (!t.substitutes?.length) return null;
  const sub = t.substitutes.find((s) => s.ifUseCase.includes(audit.useCase));
  if (!sub) return null;
  // Don't recommend a switch to a tool the user already pays for (consolidation handles that).
  const alreadyHas = audit.tools.find((x) => x.tool === sub.to && x.monthlySpend > 0);
  if (alreadyHas) return null;
  const recPlan = getPlan(sub.to, sub.planId);
  if (recPlan.seatModel !== "per-seat") return null;
  const recCost = recPlan.monthlyPerSeat * Math.max(1, input.seats);
  const monthlySavings = input.monthlySpend - recCost;
  if (monthlySavings < NOISE_FLOOR_USD) return null;
  const recTool = getTool(sub.to);
  return {
    tool: input.tool,
    toolName: t.name,
    currentPlan: getPlan(input.tool, input.planId).label,
    currentSpend: input.monthlySpend,
    action: "switch",
    recommendedTool: sub.to,
    recommendedToolName: recTool.name,
    recommendedPlan: recPlan.label,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: `${sub.note} You'd save ${fmtMoney(monthlySavings)}/mo at ${input.seats} seat${input.seats === 1 ? "" : "s"}.`,
    citation: recPlan.citation,
  };
}

// Honesty filter — applied as a last step on every produced rec.
export function isValidRec(rec: Recommendation): boolean {
  if (!rec.citation) return false;
  if (!rec.reason) return false;
  if (rec.monthlySavings < NOISE_FLOOR_USD) return false;
  if (rec.annualSavings !== rec.monthlySavings * 12) return false;
  return true;
}

export function runRules(audit: AuditInput): {
  recs: Recommendation[];
  suppressed: Record<string, string>;
} {
  const out: Recommendation[] = [];
  const suppressed: Record<string, string> = {};

  // Pre-compute consolidation; if it fires, mark the dropped tools so we don't add per-tool switch recs on top.
  const consol = consolidationRec(audit);
  const consolidatedTools = new Set<ToolId>();
  if (consol) {
    out.push(consol);
    audit.tools
      .filter((t) => CODING_TOOLS.includes(t.tool) && t.monthlySpend > 0)
      .forEach((t) => consolidatedTools.add(t.tool));
  }

  for (const t of audit.tools) {
    if (t.monthlySpend === 0) continue;

    // If consolidation already accounted for this coding tool, skip per-tool recs to avoid double-counting.
    if (consolidatedTools.has(t.tool)) continue;

    // Try rules in priority order; first match per tool wins.
    const candidates: Array<Recommendation | null> = [
      planFit(t, audit),
      cheaperPlanSameVendor(t, audit),
      apiVsSubscription(t, audit),
      credexCreditsForApi(t, audit),
      substituteRec(t, audit, consolidatedTools),
    ];
    const winner = candidates.find((c) => c && isValidRec(c));
    if (winner) {
      out.push(winner);
    } else {
      // Surface why nothing fired — useful for debugging and for the suppressed map shown in dev.
      suppressed[t.tool] = "No rule produced a recommendation above the $10/mo noise floor.";
    }
  }

  return { recs: out, suppressed };
}
