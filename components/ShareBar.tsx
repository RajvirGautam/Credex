"use client";

import { useState } from "react";

export default function ShareBar({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {/* ignore */}
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
      <span>Share this audit (PII stripped):</span>
      <code className="rounded bg-ink-100 px-2 py-1 font-mono text-ink-700">{url}</code>
      <button onClick={copy} className="btn-ghost text-xs">{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}
