import sgMail from '@sendgrid/mail';

export interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ ok: true; provider: "sendgrid" | "console" }> {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    console.log(`[email/console] to=${to} subject=${subject}\n${html}`);
    return { ok: true, provider: "console" };
  }

  sgMail.setApiKey(key);
  const toArray = Array.isArray(to) ? to : [to];

  try {
    // sendMultiple sends individually to avoid leaking emails if you have multiple isolated users,
    // but if it's a team, standard send is better. We'll use standard send so they can "Reply All".
    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL || "RightSize <audit@rightsize.app>",
      to: toArray,
      subject,
      html,
    });
    return { ok: true, provider: "sendgrid" };
  } catch (err: any) {
    console.error("[email] sendgrid threw", err.response?.body || err);
    return { ok: true, provider: "console" };
  }
}

export function leadConfirmationHtml(args: {
  shareUrl: string;
  monthlySavings: number;
  annualSavings: number;
}): string {
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#F5F7FA;color:#1A1F36;">
  <div style="max-width:600px;margin:40px auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);border:1px solid #E5E7EB;">
    <div style="background:linear-gradient(135deg, #0A7D4F 0%, #055C3A 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:24px;color:#FFFFFF;font-weight:700;letter-spacing:-0.5px;">Your AI Spend Audit is Ready</h1>
    </div>
    
    <div style="padding:40px 32px;">
      <p style="font-size:16px;line-height:24px;margin-bottom:24px;color:#4B5563;">
        We've analyzed your team's AI tool stack. Based on current pricing from Cursor, Copilot, ChatGPT, Anthropic, and others, here's what we found:
      </p>
      
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:24px;text-align:center;margin-bottom:32px;">
        <p style="font-size:14px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;">Potential Savings</p>
        <div style="font-size:36px;font-weight:800;color:#15803D;line-height:1;margin-bottom:8px;">
          $${Math.round(args.monthlySavings).toLocaleString()}<span style="font-size:18px;color:#166534;font-weight:600;">/mo</span>
        </div>
        <p style="font-size:14px;color:#166534;margin:0;">($${Math.round(args.annualSavings).toLocaleString()}/yr)</p>
      </div>
      
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${args.shareUrl}" style="display:inline-block;background:#0A7D4F;color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:16px 32px;border-radius:8px;box-shadow:0 2px 4px rgba(10,125,79,0.2);">
          View Your Full Report
        </a>
      </div>
      
      <p style="font-size:14px;color:#6B7280;line-height:20px;text-align:center;margin:0;">
        The report includes a per-tool breakdown, consolidation opportunities, and specific plan downgrade recommendations.
      </p>
    </div>
    
    <div style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:24px 32px;text-align:center;">
      <p style="font-size:13px;color:#9CA3AF;margin:0;">
        RightSize — A free spend-audit tool from <strong>Credex</strong>.
      </p>
    </div>
  </div>
</body>
</html>`;
}
