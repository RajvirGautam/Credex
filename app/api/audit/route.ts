import { NextResponse } from "next/server";
import { runAudit, type AuditInput } from "@/lib/engine";
import { TOOLS, type ToolId } from "@/lib/pricing";
import { createAudit } from "@/lib/db";
import { generateSummary } from "@/lib/summary";
import { checkRateLimit, ipFromHeaders } from "@/lib/rate-limit";

const VALID_TOOL_IDS = new Set<string>(TOOLS.map((t) => t.id));

interface InboundTool {
  tool: string;
  planId: string;
  monthlySpend: number;
  seats: number;
}

interface InboundBody {
  tools: InboundTool[];
  teamSize: number;
  useCase: AuditInput["useCase"];
  notes?: string;
  email?: string;
  honeypot?: string;
}

function isValidUseCase(s: unknown): s is AuditInput["useCase"] {
  return s === "coding" || s === "writing" || s === "data" || s === "research" || s === "mixed";
}

export async function POST(req: Request) {
  const ip = ipFromHeaders(req.headers);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  let body: InboundBody;
  try {
    body = (await req.json()) as InboundBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.honeypot) {
    // Pretend success so the bot doesn't retry, but don't write anything.
    return NextResponse.json({ slug: "blocked" }, { status: 200 });
  }

  if (!Array.isArray(body.tools) || body.tools.length === 0) {
    return NextResponse.json({ error: "Pick at least one tool." }, { status: 400 });
  }
  if (!isValidUseCase(body.useCase)) {
    return NextResponse.json({ error: "Bad useCase." }, { status: 400 });
  }

  const sanitized: AuditInput = {
    teamSize: Math.max(1, Math.floor(Number(body.teamSize) || 1)),
    useCase: body.useCase,
    notes: typeof body.notes === "string" ? body.notes.slice(0, 280) : undefined,
    tools: body.tools
      .filter((t) => VALID_TOOL_IDS.has(t.tool))
      .map((t) => ({
        tool: t.tool as ToolId,
        planId: String(t.planId),
        monthlySpend: Math.max(0, Number(t.monthlySpend) || 0),
        seats: Math.max(1, Math.floor(Number(t.seats) || 1)),
      })),
  };

  if (sanitized.tools.length === 0) {
    return NextResponse.json({ error: "No valid tools in payload." }, { status: 400 });
  }

  const result = runAudit(sanitized);

  // Generate summary up front so the share page renders complete on first load.
  const summary = await generateSummary({
    result,
    teamSize: sanitized.teamSize,
    useCase: sanitized.useCase,
    notes: sanitized.notes,
  });

  const record = await createAudit({ inputs: sanitized, results: result, summary });

  return NextResponse.json({ slug: record.slug, monthlySavings: result.totalMonthlySavings });
}
