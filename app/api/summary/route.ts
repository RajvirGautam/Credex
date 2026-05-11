import { NextResponse } from "next/server";
import { getAuditBySlug, updateAuditSummary } from "@/lib/db";
import { generateSummary, templatedSummary } from "@/lib/summary";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  const audit = await getAuditBySlug(slug);
  if (!audit) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (audit.summary) return NextResponse.json(audit.summary);

  try {
    const s = await generateSummary({
      result: audit.results,
      teamSize: audit.inputs.teamSize,
      useCase: audit.inputs.useCase,
      notes: audit.inputs.notes,
    });
    await updateAuditSummary(slug, s);
    return NextResponse.json(s);
  } catch {
    const text = templatedSummary(audit.results);
    return NextResponse.json({ text, source: "fallback" as const });
  }
}
