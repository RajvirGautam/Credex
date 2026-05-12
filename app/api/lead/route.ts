import { NextResponse } from "next/server";
import { createLead, getAuditBySlug } from "@/lib/db";
import { leadConfirmationHtml, sendEmail } from "@/lib/email";
import { checkRateLimit, ipFromHeaders } from "@/lib/rate-limit";

interface InboundBody {
  slug: string;
  email: string | string[];
  company?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
  monthlySavings?: number;
  annualSavings?: number;
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
  
  if (!body.email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Handle multiple comma-separated emails or array of emails
  const emailArray = Array.isArray(body.email) 
    ? body.email 
    : body.email.split(',').map(e => e.trim());
    
  const validEmails = emailArray.filter(e => EMAIL_RE.test(e));

  if (validEmails.length === 0) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!body.slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const audit = await getAuditBySlug(body.slug);
  
  // Vercel /tmp workaround: If we hit a different serverless container, the audit won't be in /tmp.
  // We use the values passed from the client as a fallback so the email still sends!
  const monthlySavings = audit?.results.totalMonthlySavings ?? body.monthlySavings ?? 0;
  const annualSavings = audit?.results.totalAnnualSavings ?? body.annualSavings ?? 0;
  const auditId = audit?.id ?? `fallback-${body.slug}`;

  const lead = await createLead({
    auditId: auditId,
    email: validEmails.join(', '), // Store as comma-separated string in DB
    company: body.company,
    role: body.role,
    teamSize: body.teamSize,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const shareUrl = `${baseUrl}/a/${body.slug}`;
  const subject = monthlySavings > 0
    ? `Your AI spend audit — $${Math.round(monthlySavings).toLocaleString()}/mo of leakage`
    : `Your AI spend audit — you're spending well`;

  await sendEmail({
    to: validEmails,
    subject,
    html: leadConfirmationHtml({
      shareUrl,
      monthlySavings: monthlySavings,
      annualSavings: annualSavings,
    }),
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
