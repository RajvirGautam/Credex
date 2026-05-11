import type { AuditResult } from "@/lib/engine";

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

export function templatedSummary(result: AuditResult): string {
  const { totalMonthlySavings, totalAnnualSavings, recommendations, band } = result;

  if (totalMonthlySavings === 0 || recommendations.length === 0) {
    return "Looks like you're spending well. Nothing in your current AI stack obviously needs changing — your tier choices match how your team actually uses these tools. Re-run this audit when you add a tool or grow the team.";
  }

  const top = recommendations
    .slice()
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 2);

  const verbs = top.map((r) => {
    if (r.action === "downgrade") return `dropping ${r.toolName} from ${r.currentPlan} to ${r.recommendedPlan}`;
    if (r.action === "switch") return `switching ${r.toolName} to ${r.recommendedToolName ?? r.recommendedPlan}`;
    if (r.action === "consolidate") return `consolidating ${r.toolName} into ${r.recommendedToolName}`;
    if (r.action === "use-credits") return `routing ${r.toolName} usage through Credex credits`;
    return `revisiting ${r.toolName}`;
  });

  const bandLine =
    band === "large" ? "That's a large enough leak to be worth a 20-minute call." :
    band === "medium" ? "Worth fixing this quarter." :
    "A small but real leak — easy to close in an afternoon.";

  return `Your stack has about ${fmt(totalMonthlySavings)}/mo of leakage (${fmt(totalAnnualSavings)}/yr). The biggest wins are ${verbs.join(" and ")}. ${bandLine} Each recommendation links to the vendor's pricing page so you can verify before changing anything.`;
}

export interface SummaryRequest {
  result: AuditResult;
  teamSize: number;
  useCase: string;
  notes?: string;
}

// Calls Anthropic if ANTHROPIC_API_KEY is set; otherwise returns the templated summary.
// Falls back to templated on ANY error so the UI never breaks.
export async function generateSummary(req: SummaryRequest): Promise<{ text: string; source: "ai" | "fallback" }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { text: templatedSummary(req.result), source: "fallback" };

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: key });
    const userPrompt = buildPrompt(req);
    const resp = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [
        { role: "user", content: userPrompt },
      ],
      system: SYSTEM_PROMPT,
    });
    const block = resp.content[0];
    const text = block && block.type === "text" ? block.text.trim() : "";
    if (!text) return { text: templatedSummary(req.result), source: "fallback" };
    return { text, source: "ai" };
  } catch {
    return { text: templatedSummary(req.result), source: "fallback" };
  }
}

const SYSTEM_PROMPT = `You write concise, honest AI-spend audit summaries for startup founders. Rules you must follow:
- ~100 words, never more than 130.
- Reference the real dollar figures from the audit input. Never invent numbers.
- Plain, founder-grade tone. No emojis, no exclamation points, no marketing fluff.
- If totalMonthlySavings is 0, say so honestly — do not manufacture a problem.
- Mention at most 2 specific recommendations by name; trust the table beside you for the rest.
- End with a short, non-pushy next step.`;

function buildPrompt(req: SummaryRequest): string {
  return JSON.stringify({
    teamSize: req.teamSize,
    useCase: req.useCase,
    notes: req.notes ?? null,
    totalMonthlySavings: req.result.totalMonthlySavings,
    totalAnnualSavings: req.result.totalAnnualSavings,
    totalCurrentSpend: req.result.totalCurrentSpend,
    band: req.result.band,
    recommendations: req.result.recommendations.map((r) => ({
      tool: r.toolName,
      currentPlan: r.currentPlan,
      currentSpend: r.currentSpend,
      action: r.action,
      recommendedPlan: r.recommendedPlan,
      recommendedTool: r.recommendedToolName,
      monthlySavings: r.monthlySavings,
      reason: r.reason,
    })),
  }, null, 2);
}
