// Resend wrapper with a console-logger fallback. The UI never blocks on this.
export interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ ok: true; provider: "resend" | "console" }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email/console] to=${to} subject=${subject}\n${html}`);
    return { ok: true, provider: "console" };
  }

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RightSize <audit@rightsize.app>",
        to,
        subject,
        html,
      }),
    });
    if (!resp.ok) {
      console.warn("[email] resend failed", resp.status, await resp.text());
      return { ok: true, provider: "console" };
    }
    return { ok: true, provider: "resend" };
  } catch (err) {
    console.warn("[email] resend threw", err);
    return { ok: true, provider: "console" };
  }
}

export function leadConfirmationHtml(args: {
  shareUrl: string;
  monthlySavings: number;
  annualSavings: number;
}): string {
  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;max-width:560px;margin:24px auto;padding:0 16px;color:#1a1916">
    <h1 style="font-size:20px;margin:0 0 12px">Your AI spend audit is ready</h1>
    <p>You could save <strong>$${Math.round(args.monthlySavings).toLocaleString()}/mo</strong> ($${Math.round(args.annualSavings).toLocaleString()}/yr) by acting on the recommendations in your report.</p>
    <p><a href="${args.shareUrl}" style="display:inline-block;padding:10px 16px;background:#0a7d4f;color:#fff;text-decoration:none;border-radius:6px">View your full audit</a></p>
    <p style="font-size:12px;color:#5e5a52;margin-top:24px">RightSize — a free spend-audit tool from Credex.</p>
  </body></html>`;
}
