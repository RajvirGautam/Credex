"use client";

import { useEffect, useState } from "react";

export default function SummaryBlock({
  initialText,
  source,
  slug,
}: {
  initialText?: string;
  source?: "ai" | "fallback";
  slug: string;
}) {
  const [text, setText] = useState<string>(initialText ?? "");
  const [src, setSrc] = useState<"ai" | "fallback" | undefined>(source);
  const [loading, setLoading] = useState(!initialText);

  useEffect(() => {
    if (initialText) return;
    let alive = true;
    fetch(`/api/summary?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setText(j.text);
        setSrc(j.source);
      })
      .catch(() => {/* templated already used server-side; nothing to do */})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [initialText, slug]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <p className="label">Summary</p>
        {src && (
          <span className="text-[10px] uppercase tracking-wide text-ink-400">
            {src === "ai" ? "AI-written" : "Templated"}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">
        {loading ? "Writing your summary…" : text}
      </p>
    </div>
  );
}
