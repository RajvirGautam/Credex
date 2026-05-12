"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, type ToolId, type UseCase } from "@/lib/pricing";

interface PerToolEntry {
  enabled: boolean;
  planId: string;
  monthlySpend: string;
  seats: string;
}

type FormState = {
  teamSize: string;
  useCase: UseCase;
  notes: string;
  email: string;
  honeypot: string;
  perTool: Record<ToolId, PerToolEntry>;
};

const STORAGE_KEY = "rightsize.audit.v1";

function defaultPerTool(): Record<ToolId, PerToolEntry> {
  const obj = {} as Record<ToolId, PerToolEntry>;
  for (const t of TOOLS) {
    obj[t.id] = {
      enabled: false,
      planId: t.plans.find((p) => p.monthlyPerSeat > 0)?.id ?? t.plans[0].id,
      monthlySpend: "",
      seats: "1",
    };
  }
  return obj;
}

function defaultState(): FormState {
  return {
    teamSize: "1",
    useCase: "coding",
    notes: "",
    email: "",
    honeypot: "",
    perTool: defaultPerTool(),
  };
}

/* ---------- Toggle switch ---------- */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
        checked ? "bg-brand-500" : "bg-ink-200"
      }`}
    >
      <span className="sr-only">Enable tool</span>
      <span
        aria-hidden
        className={`pointer-events-none h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ---------- Custom select wrapper ---------- */

function Select({
  id,
  value,
  onChange,
  className = "",
  children,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input w-full appearance-none cursor-pointer pr-8 ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-ink-400">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </span>
    </div>
  );
}

/* ---------- Tool icon marks ---------- */

function ToolMark({ id }: { id: ToolId }) {
  const marks: Record<ToolId, React.ReactNode> = {
    cursor: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#0e0d0b" />
        <path d="M9 8 L23 16 L16 16 L16 23 Z" fill="#fff" />
        <path d="M9 8 L9 22 L16 23 L16 16 Z" fill="#fff" opacity="0.55" />
      </svg>
    ),
    copilot: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#24292e" />
        <circle cx="12" cy="17" r="2.4" fill="#fff" />
        <circle cx="20" cy="17" r="2.4" fill="#fff" />
        <path d="M11 11h10v3.6c0 1.5-2.2 2.4-5 2.4s-5-.9-5-2.4Z" fill="#fff" />
      </svg>
    ),
    claude: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#D97757" />
        <path
          d="M9 22 L13.6 10 L15.6 10 L11 22 Z M16.6 10 L18.6 10 L23.2 22 L21.2 22 L19.7 18 L15.4 18 L17.6 13.4 L17.1 12 L16.6 10 Z M18.4 16.5 L17.6 14.4 L16.8 16.5 Z"
          fill="#fff"
        />
      </svg>
    ),
    chatgpt: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#10A37F" />
        <path
          d="M22.5 14.4a4.4 4.4 0 0 0-.4-3.6 4.45 4.45 0 0 0-4.8-2.1 4.4 4.4 0 0 0-3.3-1.5 4.45 4.45 0 0 0-4.25 3.1 4.4 4.4 0 0 0-2.95 2.1 4.45 4.45 0 0 0 .55 5.2 4.4 4.4 0 0 0 .4 3.6 4.45 4.45 0 0 0 4.8 2.1 4.4 4.4 0 0 0 3.3 1.5 4.45 4.45 0 0 0 4.25-3.1 4.4 4.4 0 0 0 2.95-2.1 4.45 4.45 0 0 0-.55-5.2Zm-6.6 9.2a3.3 3.3 0 0 1-2.1-.76l.1-.06 3.5-2a.57.57 0 0 0 .29-.5v-4.93l1.48.86a.05.05 0 0 1 .03.04v4.07a3.3 3.3 0 0 1-3.3 3.28Zm-7.1-3a3.3 3.3 0 0 1-.4-2.2l.1.06 3.5 2a.57.57 0 0 0 .58 0l4.27-2.46v1.7a.05.05 0 0 1-.02.05l-3.54 2.04a3.3 3.3 0 0 1-4.5-1.2Zm-.92-7.6a3.3 3.3 0 0 1 1.72-1.45v4.14a.57.57 0 0 0 .29.5l4.25 2.45-1.48.86a.05.05 0 0 1-.05 0L8.96 18.5a3.3 3.3 0 0 1-1.08-4.5Zm12.15 2.83-4.27-2.47L17.27 12.5a.05.05 0 0 1 .05 0l3.54 2.04a3.3 3.3 0 0 1-.5 5.95v-4.14a.57.57 0 0 0-.32-.51Zm1.47-2.22-.1-.06-3.5-2.03a.57.57 0 0 0-.58 0l-4.25 2.46v-1.71a.05.05 0 0 1 .02-.04l3.54-2.04a3.3 3.3 0 0 1 4.9 3.42Zm-9.25 3.04-1.48-.85a.05.05 0 0 1-.03-.04V11.7a3.3 3.3 0 0 1 5.42-2.54l-.1.06-3.5 2a.57.57 0 0 0-.29.5Zm.8-1.73 1.9-1.1 1.9 1.1v2.18l-1.9 1.1-1.9-1.1Z"
          fill="#fff"
        />
      </svg>
    ),
    "anthropic-api": (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#0e0d0b" />
        <path
          d="M12.4 9 L8 23 H10.7 L11.7 19.7 H15.5 L16.5 23 H19.2 L14.8 9 Z M12.3 17.4 L13.6 13 L14.9 17.4 Z"
          fill="#D97757"
        />
        <path d="M19.5 9 L24 23 H21.3 L17 9 Z" fill="#D97757" />
      </svg>
    ),
    "openai-api": (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#1a1a1a" />
        <circle cx="16" cy="16" r="6.5" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="16" cy="16" r="2.5" fill="#fff" />
      </svg>
    ),
    gemini: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="gem-card" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b8bff" />
            <stop offset="100%" stopColor="#a563ff" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="#f8f9ff" />
        <path
          d="M16 6 C16 11 21 16 26 16 C21 16 16 21 16 26 C16 21 11 16 6 16 C11 16 16 11 16 6 Z"
          fill="url(#gem-card)"
        />
      </svg>
    ),
    windsurf: (
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#13b8a6" />
        <path d="M5 19c4-1 6 1 9 1s5-2 8-2 4 1 5 1v3c-1 0-2-1-5-1s-5 2-8 2-5-2-9-1Z" fill="#fff" />
        <path
          d="M5 13c4-1 6 1 9 1s5-2 8-2 4 1 5 1v3c-1 0-2-1-5-1s-5 2-8 2-5-2-9-1Z"
          fill="#fff"
          opacity="0.55"
        />
      </svg>
    ),
  };
  return <>{marks[id] ?? null}</>;
}

const CATEGORY_PILL: Record<string, string> = {
  coding:   "bg-brand-50 text-brand-700",
  writing:  "bg-violet-50 text-violet-700",
  mixed:    "bg-amber-50 text-amber-700",
  research: "bg-emerald-50 text-emerald-700",
  data:     "bg-sky-50 text-sky-700",
};

/* ---------- Section label ---------- */

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 font-mono text-[10px] font-semibold text-ink-500">
        {n}
      </span>
      <h2 className="text-lg font-semibold text-ink-900">{children}</h2>
    </div>
  );
}

/* ---------- Main form ---------- */

export default function ToolForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...defaultState(), ...parsed, perTool: { ...defaultPerTool(), ...parsed.perTool } });
      }
    } catch {/* ignore */}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {/* ignore */}
  }, [state]);

  const enabledCount = useMemo(
    () => Object.values(state.perTool).filter((t) => t.enabled).length,
    [state.perTool],
  );

  const totalSpend = useMemo(() => {
    return Object.entries(state.perTool).reduce((sum, [, v]) => {
      if (!v.enabled) return sum;
      const n = Number(v.monthlySpend);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
  }, [state.perTool]);

  function setTool(id: ToolId, patch: Partial<PerToolEntry>) {
    setState((s) => ({ ...s, perTool: { ...s.perTool, [id]: { ...s.perTool[id], ...patch } } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (state.honeypot) return;
    if (enabledCount === 0) {
      setError("Pick at least one tool.");
      return;
    }

    const payload = {
      teamSize: Math.max(1, Number(state.teamSize) || 1),
      useCase: state.useCase,
      notes: state.notes,
      email: state.email,
      honeypot: state.honeypot,
      tools: TOOLS.filter((t) => state.perTool[t.id].enabled).map((t) => {
        const e = state.perTool[t.id];
        return {
          tool: t.id,
          planId: e.planId,
          seats: Math.max(1, Number(e.seats) || 1),
          monthlySpend: Math.max(0, Number(e.monthlySpend) || 0),
        };
      }),
    };

    setSubmitting(true);
    try {
      const resp = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        setError(txt || "Audit failed. Try again in a minute.");
        setSubmitting(false);
        return;
      }
      const json = (await resp.json()) as { slug: string };
      router.push(`/a/${json.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Honeypot */}
      <input
        type="text"
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        value={state.honeypot}
        onChange={(e) => setState((s) => ({ ...s, honeypot: e.target.value }))}
        className="absolute -left-[9999px] h-px w-px opacity-0"
        aria-hidden
      />

      {/* Live summary strip — always rendered to avoid layout shift */}
      <div className={`rounded-2xl border p-4 shadow-sm transition-colors duration-300 flex items-center min-h-16 ${
        enabledCount > 0
          ? "border-brand-200 bg-gradient-to-r from-brand-50 via-white to-brand-50"
          : "border-ink-100 bg-ink-50/60"
      }`}>
        {enabledCount > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-chip">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M8 1 L9.8 5.8 L15 8 L9.8 10.2 L8 15 L6.2 10.2 L1 8 L6.2 5.8 Z" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-ink-900">
                  {enabledCount} tool{enabledCount !== 1 ? "s" : ""} selected
                </span>
                {totalSpend > 0 && (
                  <>
                    <span className="mx-2 text-ink-300">·</span>
                    <span className="text-ink-600">
                      ${Math.round(totalSpend).toLocaleString()}/mo tracked
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-brand text-sm disabled:opacity-60"
            >
              {submitting ? "Auditing…" : "Run audit →"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-400">
            Toggle tools below — your spend summary will appear here.
          </p>
        )}
      </div>

      {/* ── 01 Team context ── */}
      <div className="space-y-4">
        <SectionLabel n="01">Team context</SectionLabel>
        <div className="card space-y-0 p-0 overflow-hidden">
          <div className="grid divide-y divide-ink-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="space-y-2 p-5">
              <label className="label" htmlFor="teamSize">
                Team size
              </label>
              <input
                id="teamSize"
                type="number"
                min={1}
                value={state.teamSize}
                onChange={(e) => setState((s) => ({ ...s, teamSize: e.target.value }))}
                className="input"
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-2 p-5">
              <label className="label" htmlFor="useCase">
                Primary use case
              </label>
              <Select
                id="useCase"
                value={state.useCase}
                onChange={(v) => setState((s) => ({ ...s, useCase: v as UseCase }))}
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data / analysis</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </Select>
            </div>
            <div className="space-y-2 p-5">
              <label className="label" htmlFor="notes">
                Context{" "}
                <span className="normal-case font-normal text-ink-400">(optional)</span>
              </label>
              <input
                id="notes"
                type="text"
                value={state.notes}
                onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
                placeholder="e.g. heavy code review…"
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 02 AI stack ── */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <SectionLabel n="02">Your AI stack</SectionLabel>
          <p className="text-xs text-ink-400 pb-0.5">Toggle the tools you pay for</p>
        </div>

        <div className="grid gap-2.5">
          {TOOLS.map((t) => {
            const e = state.perTool[t.id];
            const isUsage = t.plans.every((p) => p.seatModel === "usage");
            return (
              <div
                key={t.id}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                  e.enabled
                    ? "border-brand-200 shadow-soft"
                    : "border-ink-100 shadow-sm opacity-80 hover:opacity-100"
                }`}
              >
                {/* Tool header row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Icon mark */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
                    <ToolMark id={t.id} />
                  </div>

                  {/* Name + category */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink-900">{t.name}</p>
                    <span
                      className={`pill mt-0.5 inline-flex text-[10px] py-0.5 ${
                        CATEGORY_PILL[t.category] ?? "bg-ink-50 text-ink-500"
                      }`}
                    >
                      {t.category}
                    </span>
                  </div>

                  {/* Toggle */}
                  <Toggle
                    checked={e.enabled}
                    onChange={(v) => setTool(t.id, { enabled: v })}
                  />
                </div>

                {/* Expanded fields */}
                {e.enabled && (
                  <div className="border-t border-brand-100 bg-brand-50/30 px-4 pb-4 pt-3">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <label className="label" htmlFor={`${t.id}-plan`}>Plan</label>
                        <Select
                          id={`${t.id}-plan`}
                          value={e.planId}
                          onChange={(v) => setTool(t.id, { planId: v })}
                          className="bg-white"
                        >
                          {t.plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                              {p.monthlyPerSeat > 0
                                ? ` — $${p.monthlyPerSeat}/${p.seatModel === "per-seat" ? "seat" : "mo"}`
                                : ""}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="label" htmlFor={`${t.id}-spend`}>
                          Monthly spend{" "}
                          <span className="normal-case font-normal text-ink-400">(USD)</span>
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-ink-400">
                            $
                          </span>
                          <input
                            id={`${t.id}-spend`}
                            type="number"
                            min={0}
                            step="any"
                            value={e.monthlySpend}
                            onChange={(ev) => setTool(t.id, { monthlySpend: ev.target.value })}
                            className="input bg-white"
                            style={{ paddingLeft: "1.5rem" }}
                            placeholder={isUsage ? "250" : "40"}
                          />
                        </div>
                      </div>
                      {!isUsage && (
                        <div className="space-y-1.5">
                          <label className="label" htmlFor={`${t.id}-seats`}>Seats</label>
                          <input
                            id={`${t.id}-seats`}
                            type="number"
                            min={1}
                            value={e.seats}
                            onChange={(ev) => setTool(t.id, { seats: ev.target.value })}
                            className="input bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>



      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0V5Zm.75 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-gradient-to-r from-ink-50 to-white p-5 shadow-sm">
        <button
          type="submit"
          disabled={submitting}
          className="btn-accent text-base disabled:opacity-60"
        >
          {submitting ? "Auditing…" : "Run my audit →"}
        </button>
        <p className="text-sm text-ink-500">
          {enabledCount === 0
            ? "Select at least one tool above."
            : `Auditing ${enabledCount} tool${enabledCount !== 1 ? "s" : ""} · takes about 2 seconds.`}
        </p>
        <button
          type="button"
          className="btn-ghost ml-auto text-sm"
          onClick={() => {
            setState(defaultState());
            try { localStorage.removeItem(STORAGE_KEY); } catch {/* */}
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
