import ToolForm from "@/components/ToolForm";

export const metadata = {
  title: "Run your audit · RightSize",
};

export default function AuditPage() {
  return (
    <div>
      {/* Page hero */}
      <section className="hero-bg border-b border-ink-100/60 pb-7 pt-7">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Free · No login · Saves locally
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            Tell us what you pay for.
          </h1>
          <p className="mt-3 max-w-lg text-base text-ink-500">
            Toggle each AI tool, pick your plan and monthly spend. Hard-coded rules —
            every recommendation cites the vendor pricing page.
          </p>

          <div className="mt-6 flex flex-wrap gap-5">
            {[
              "Deterministic rules, no guesswork",
              "Every recommendation cited",
              "Below $10/mo savings suppressed",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-ink-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form body */}
      <div className="mx-auto max-w-5xl px-6 pt-5 pb-8">
        <ToolForm />
      </div>
    </div>
  );
}
