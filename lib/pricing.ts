// Pricing source of truth — mirrors PRICING_DATA.md.
// Every plan MUST have a citation URL or it is rejected by tests/engine.

export type ToolId =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface Plan {
  id: string;            // e.g. "pro", "business"
  label: string;
  monthlyPerSeat: number; // USD per seat per month (annualised price for vendors that quote annual)
  // Plans where seats don't apply (single-user only) set seatModel="single".
  seatModel: "per-seat" | "single" | "usage";
  citation: string;      // vendor URL with date pulled (date in PRICING_DATA.md)
  notes?: string;
}

export interface Tool {
  id: ToolId;
  name: string;
  category: "coding" | "writing" | "research" | "data" | "mixed";
  plans: Plan[];
  // Cheapest "good enough" cross-tool substitute for this tool when the use case allows it.
  substitutes?: Array<{ to: ToolId; ifUseCase: UseCase[]; planId: string; note: string }>;
}

export const TOOLS: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: [
      { id: "free", label: "Hobby", monthlyPerSeat: 0, seatModel: "per-seat", citation: "https://cursor.com/pricing" },
      { id: "pro", label: "Pro", monthlyPerSeat: 20, seatModel: "per-seat", citation: "https://cursor.com/pricing" },
      { id: "business", label: "Business", monthlyPerSeat: 40, seatModel: "per-seat", citation: "https://cursor.com/pricing" },
    ],
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { id: "free", label: "Free", monthlyPerSeat: 0, seatModel: "per-seat", citation: "https://github.com/features/copilot/plans" },
      { id: "pro", label: "Pro (Individual)", monthlyPerSeat: 10, seatModel: "per-seat", citation: "https://github.com/features/copilot/plans" },
      { id: "business", label: "Business", monthlyPerSeat: 19, seatModel: "per-seat", citation: "https://github.com/features/copilot/plans" },
      { id: "enterprise", label: "Enterprise", monthlyPerSeat: 39, seatModel: "per-seat", citation: "https://github.com/features/copilot/plans" },
    ],
    substitutes: [
      { to: "cursor", ifUseCase: ["coding", "mixed"], planId: "pro", note: "Cursor Pro covers the same IDE-completion need at the same headline price." },
    ],
  },
  {
    id: "claude",
    name: "Claude.ai",
    category: "writing",
    plans: [
      { id: "free", label: "Free", monthlyPerSeat: 0, seatModel: "single", citation: "https://www.anthropic.com/pricing" },
      { id: "pro", label: "Pro", monthlyPerSeat: 20, seatModel: "single", citation: "https://www.anthropic.com/pricing" },
      { id: "max-5x", label: "Max 5x", monthlyPerSeat: 100, seatModel: "single", citation: "https://www.anthropic.com/pricing" },
      { id: "max-20x", label: "Max 20x", monthlyPerSeat: 200, seatModel: "single", citation: "https://www.anthropic.com/pricing" },
      { id: "team", label: "Team", monthlyPerSeat: 30, seatModel: "per-seat", citation: "https://www.anthropic.com/pricing", notes: "monthly billing; $25/seat annual" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "mixed",
    plans: [
      { id: "free", label: "Free", monthlyPerSeat: 0, seatModel: "single", citation: "https://openai.com/chatgpt/pricing/" },
      { id: "plus", label: "Plus", monthlyPerSeat: 20, seatModel: "single", citation: "https://openai.com/chatgpt/pricing/" },
      { id: "pro", label: "Pro", monthlyPerSeat: 200, seatModel: "single", citation: "https://openai.com/chatgpt/pricing/" },
      { id: "team", label: "Team", monthlyPerSeat: 30, seatModel: "per-seat", citation: "https://openai.com/chatgpt/pricing/", notes: "monthly billing; $25/seat annual" },
      { id: "enterprise", label: "Enterprise", monthlyPerSeat: 60, seatModel: "per-seat", citation: "https://openai.com/chatgpt/pricing/", notes: "indicative; custom pricing" },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "mixed",
    plans: [
      { id: "usage", label: "Pay-as-you-go", monthlyPerSeat: 0, seatModel: "usage", citation: "https://www.anthropic.com/api" },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "mixed",
    plans: [
      { id: "usage", label: "Pay-as-you-go", monthlyPerSeat: 0, seatModel: "usage", citation: "https://openai.com/api/pricing/" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "mixed",
    plans: [
      { id: "free", label: "Free", monthlyPerSeat: 0, seatModel: "single", citation: "https://gemini.google/subscriptions/" },
      { id: "pro", label: "AI Pro", monthlyPerSeat: 20, seatModel: "single", citation: "https://gemini.google/subscriptions/" },
      { id: "ultra", label: "AI Ultra", monthlyPerSeat: 250, seatModel: "single", citation: "https://gemini.google/subscriptions/" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: [
      { id: "free", label: "Free", monthlyPerSeat: 0, seatModel: "per-seat", citation: "https://windsurf.com/pricing" },
      { id: "pro", label: "Pro", monthlyPerSeat: 15, seatModel: "per-seat", citation: "https://windsurf.com/pricing" },
      { id: "teams", label: "Teams", monthlyPerSeat: 35, seatModel: "per-seat", citation: "https://windsurf.com/pricing" },
    ],
    substitutes: [
      { to: "cursor", ifUseCase: ["coding", "mixed"], planId: "pro", note: "Cursor Pro is more mature for the same use case at $5 more." },
    ],
  },
];

export function getTool(id: ToolId): Tool {
  const t = TOOLS.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown tool ${id}`);
  return t;
}

export function getPlan(toolId: ToolId, planId: string): Plan {
  const t = getTool(toolId);
  const p = t.plans.find((x) => x.id === planId);
  if (!p) throw new Error(`Unknown plan ${toolId}/${planId}`);
  return p;
}

// Coding-substitute groups: paying two of these with the same primary use case = consolidation candidate.
export const CODING_TOOLS: ToolId[] = ["cursor", "copilot", "windsurf"];
