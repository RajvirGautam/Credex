"use client";

import { useState } from "react";
import type { AuditResult } from "@/lib/engine";
import { fmtMoney } from "@/lib/format";

interface Props {
  result: AuditResult;
  slug: string;
  defaultEmail?: string;
}

export default function ResultsCta({ result, slug, defaultEmail }: Props) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email, company }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        setError(t || "Could not send. Try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (result.totalMonthlySavings === 0 || result.recommendations.length === 0) {
    return (
      <section className="card">
        <h3 className="font-medium">Want a heads-up if that changes?</h3>
        <p className="mt-1 text-sm text-ink-600">
          We'll email you only if vendor pricing or new optimizations would unlock real savings for a stack like yours. Maybe twice a year.
        </p>
        {!done ? (
          <form onSubmit={submit} className="mt-4 flex flex-wrap gap-2">
            <input
              type="email"
              required
              placeholder="you@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input flex-1 min-w-[220px]"
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving…" : "Notify me"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-accent">Done — we'll be in touch only when it matters.</p>
        )}
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </section>
    );
  }

  if (result.band === "large") {
    return (
      <section className="card border-accent bg-accent/5">
        <p className="pill bg-accent text-white">Large opportunity</p>
        <h3 className="mt-3 text-xl font-semibold">
          You'd save {fmtMoney(result.totalMonthlySavings)}/mo. Worth a 20-minute call.
        </h3>
        <p className="mt-2 text-sm text-ink-700">
          Credex can route most of these tools through our credit marketplace. Book a free consultation — we'll walk through the report with you and show what's actually moveable this quarter.
        </p>
        {!done ? (
          <form onSubmit={submit} className="mt-4 grid gap-2 md:grid-cols-2">
            <input
              type="email"
              required
              placeholder="you@startup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input"
            />
            <button type="submit" disabled={submitting} className="btn-accent md:col-span-2">
              {submitting ? "Sending…" : "Email me the report + book consultation"}
            </button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-accent">Sent. Check your inbox — we'll follow up to schedule.</p>
        )}
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </section>
    );
  }

  // "small" or "medium" → email-gated full report.
  return (
    <section className="card">
      <h3 className="font-medium">Email me the full report</h3>
      <p className="mt-1 text-sm text-ink-600">
        Includes the breakdown above plus a permanent share URL you can forward to finance. No sales follow-up unless you ask.
      </p>
      {!done ? (
        <form onSubmit={submit} className="mt-4 flex flex-wrap gap-2">
          <input
            type="email"
            required
            placeholder="you@startup.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input flex-1 min-w-[220px]"
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Sending…" : "Email me"}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-accent">Sent. Check your inbox.</p>
      )}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </section>
  );
}
