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
    <div className="flex w-full flex-wrap items-center gap-2 text-xs text-ink-500">
      <span className="shrink-0 whitespace-nowrap">Share this audit (PII stripped):</span>
      <code className="min-w-0 flex-1 truncate rounded bg-ink-100 px-2 py-1 font-mono text-ink-700" title={url}>
        {url}
      </code>
      <button onClick={copy} className="btn-ghost shrink-0 whitespace-nowrap text-xs">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
