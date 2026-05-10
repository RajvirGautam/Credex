import { NextResponse } from "next/server";
import { createLead, getAuditBySlug } from "@/lib/db";
import { leadConfirmationHtml, sendEmail } from "@/lib/email";
import { checkRateLimit, ipFromHeaders } from "@/lib/rate-limit";

interface InboundBody {
  slug: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const ip = ipFromHeaders(req.headers);
  const rl = checkRateLimit(ip, 20, 60 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  let body: InboundBody;
  try {
    body = (await req.json()) as InboundBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.honeypot) return NextResponse.json({ ok: true }); // silently drop bots
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!body.slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const audit = await getAuditBySlug(body.slug);
  if (!audit) return NextResponse.json({ error: "Audit not found" }, { status: 404 });

  const lead = await createLead({
    auditId: audit.id,
    email: body.email,
    company: body.company,
    role: body.role,
    teamSize: body.teamSize,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const shareUrl = `${baseUrl}/a/${audit.slug}`;
  const subject = audit.results.totalMonthlySavings > 0
    ? `Your AI spend audit — $${Math.round(audit.results.totalMonthlySavings).toLocaleString()}/mo of leakage`
    : `Your AI spend audit — you're spending well`;

  await sendEmail({
    to: body.email,
    subject,
    html: leadConfirmationHtml({
      shareUrl,
      monthlySavings: audit.results.totalMonthlySavings,
      annualSavings: audit.results.totalAnnualSavings,
    }),
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
