# RightSize — Free 60-second AI spend audit

A free web app that audits a startup's AI tool spend across 8 vendors (Cursor, Copilot, Claude.ai, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf) and tells the founder exactly what to downgrade, drop, switch, or route through Credex credits. Every dollar figure cites a vendor pricing page.

Built for the **Credex Round 1** assignment.

> **Live URL:** _add after Vercel deploy_
> **Repo:** _add after `git remote add origin …`_

## What it does

1. Visitor fills the form (8 tools, plan tier, monthly spend, seats, team size, primary use case). Form persists across reload via `localStorage`.
2. Server runs the deterministic audit engine — hard-coded rules over a typed pricing dataset.
3. Results page renders instantly: hero (monthly + annual savings), per-tool breakdown, AI-written ~100-word summary (Anthropic Claude Haiku 4.5; templated fallback when the API is missing or erroring).
4. CTA varies by savings band — "consultation" if the leak is large, "email me the report" if medium/small, "you're spending well" if there's nothing to fix. We don't manufacture savings.
5. A unique public share URL (`/a/<slug>`) renders the same report with PII stripped, and ships an OG/Twitter card image generated on-demand.

## Quickstart

```bash
npm install
cp .env.local.example .env.local   # optional; app degrades gracefully without keys
npm run dev
```

Open `http://localhost:3000`. Without env keys: AI summary uses the templated fallback, leads log to console instead of sending email, the file-based DB persists to `.data/`.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Decisions (5 trade-offs called out)

1. **Next.js 15 over Svelte/Vanilla.** Server-side audit, edge-friendly OG image generation via `next/og`, Vercel one-click deploy. Bundle size hit was acceptable; risk-adjusted-time was not.
2. **Hard-coded engine rules over LLM-as-judge.** A finance person reading our recommendations should be able to verify them line-by-line. LLMs are reserved for the personalized summary, where creativity helps and a wrong number doesn't break trust.
3. **File-based JSON store over Supabase in v1.** The assignment doesn't require multi-instance scale, and a real DB at this stage would cost a half-day of setup against zero correctness gain. The DB module is one swap-out away from Supabase — see `ARCHITECTURE.md §swap-targets`.
4. **No hCaptcha, only honeypot + IP rate-limit.** The product's core promise is "60 seconds, no friction" — a CAPTCHA in the value-first path murders conversion. Honeypot + 10 req/IP/hr in-memory limit covers the abuse surface for an audit tool.
5. **Skipping the bonus by default.** Rubric weights say polish, audit defensibility, and entrepreneurial files are higher leverage than a PDF export or `<script>` widget. Bonus only attempted if Days 1–5 finish clean.

## Tests

Six Vitest files under `tests/` (see `TESTS.md`):

- `pricing-data.test.ts` — every plan has a citation URL on a vendor allowlist.
- `engine-plan-fit.test.ts` — Cursor Business → Pro saves $40/mo; org-scale teams kept on Business.
- `engine-no-savings.test.ts` — Already-optimal stack returns 0 savings, well-spent band, no manufactured CTA.
- `engine-honesty.test.ts` — Sub-$10/mo savings suppressed; missing citation rejected; annual = monthly × 12.
- `engine-aggregate.test.ts` — Hero total = sum of per-tool savings; consolidation doesn't double-count.
- `summary-fallback.test.ts` — Templated summary contains real numbers when the AI path is unavailable.

Run with `npm test`. CI runs lint + typecheck + tests on every push.

## Screenshots

_Add 3+ screenshots or a 30s Loom here before submission._

- Landing page (hero, FAQ, sample finding card)
- Audit form mid-fill (multiple tools enabled, total spend running tally)
- Results page (hero, per-tool breakdown, savings-band CTA, OG-card preview)

## Required files (Credex submission checklist)

| File | Purpose |
|------|---------|
| `README.md` | This file |
| `ARCHITECTURE.md` | Stack rationale, data flow, scale notes |
| `DEVLOG.md` | Day-by-day work log |
| `REFLECTION.md` | 5 questions answered honestly |
| `TESTS.md` | What each test covers and how to run |
| `PRICING_DATA.md` | Source of truth for every $ figure with citations |
| `PROMPTS.md` | Full LLM prompts + iteration history |
| `GTM.md` | Go-to-market plan |
| `ECONOMICS.md` | Unit economics + $1M ARR scenario |
| `USER_INTERVIEWS.md` | 3 real interviews summarised |
| `LANDING_COPY.md` | Hero, sub, CTA, FAQ, social proof |
| `METRICS.md` | North Star + inputs + pivot trigger |
| `.github/workflows/ci.yml` | CI: lint + typecheck + tests |

## Acknowledgements

- Pricing pulled from each vendor's own pricing page on 2026-05-07. See `PRICING_DATA.md` for the dated citation table.
- Stack: Next.js 15 · TypeScript · Tailwind · Anthropic SDK · Vitest · Vercel.
