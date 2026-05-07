# ARCHITECTURE.md

## High-level diagram

```mermaid
flowchart LR
  user(User browser) -- POST /api/audit --> audit[/api/audit Route Handler/]
  audit -- runRules() --> engine[lib/engine: deterministic rules over lib/pricing.ts]
  audit -- generateSummary() --> summary[lib/summary]
  summary -- if ANTHROPIC_API_KEY --> claude[Anthropic Claude Haiku 4.5]
  summary -- on error or missing key --> templated[Templated fallback in lib/summary]
  audit -- createAudit() --> db[(lib/db: file JSON in v1<br/>Supabase Postgres in prod)]
  user -- GET /a/[slug] --> share[/a/[slug] server component/]
  share -- getAuditBySlug() --> db
  user -- GET /api/og?slug=… --> og[next/og ImageResponse]
  user -- POST /api/lead --> lead[/api/lead Route Handler/]
  lead -- createLead() --> db
  lead -- sendEmail() --> mail[Resend in prod / console.log in dev]
```

## Stack rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router + TypeScript | Server components keep audit logic server-side (secrets out of the bundle), built-in API routes co-locate with pages, `next/og` makes share-card generation a one-file route, Vercel deploy is one command. |
| Styling | Tailwind v3 + tiny custom design tokens | Lets us hit Lighthouse perf without a component library payload. shadcn/ui considered but skipped — for ~12 components the dependency wasn't worth it. |
| Engine | Pure TypeScript, hard-coded rules in `lib/engine/rules.ts` | Defensibility. A finance reviewer can read each rule and see the citation. LLM-as-judge would have us spend the week defending the model's output instead of the math. |
| Pricing | `lib/pricing.ts` mirrors `PRICING_DATA.md` | Single source of truth in markdown so reviewers can spot-check; typed mirror keeps the engine type-safe. Tests assert every entry has a citation on a vendor allowlist. |
| Summary | Anthropic Claude Haiku 4.5 with prompt caching | Cheap, fast, perfect fit for a 100-word personalized blurb. Templated fallback on missing key OR any error — UI never breaks. |
| DB | File-based JSON in `.data/` for v1; Supabase swap-target | Real DB doesn't add correctness at this scale and would cost a half-day. `lib/db.ts` exposes `createAudit / getAuditBySlug / createLead` — swap is a one-file change. |
| Email | Resend in prod; console logger in dev | UI never blocks on email. Falls back silently if the key or service is unavailable. |
| Rate limit | In-memory map keyed by IP, 10 req/IP/hr | Survives within a single Node process. Production swap target is Upstash Redis. |
| Hosting | Vercel | Native Next.js, free tier, preview URLs per PR, edge cache for static assets. |
| CI | GitHub Actions: lint + typecheck + tests | Green badge on every commit. |

## Data flow — happy path

1. `POST /api/audit` — payload validated against `TOOLS` allowlist + `useCase` enum, honeypot field rejected silently, IP rate-limit checked.
2. `runAudit()` returns `AuditResult` with per-tool `Recommendation[]`, totals, and a `band` (`well-spent | small | medium | large`).
3. `generateSummary()` produces a ~100-word string. AI if `ANTHROPIC_API_KEY` is set; templated otherwise. Result is persisted with the audit so the share page renders without a roundtrip.
4. `createAudit()` writes to the JSON store and returns a 10-char nanoid slug.
5. Client redirects to `/a/<slug>`. Server component reads the audit from the store and renders results, summary, per-tool breakdown, share bar, and savings-band CTA.
6. CTA submission → `POST /api/lead` → `createLead()` + `sendEmail()`.

## Honesty rails (in code, not just policy)

- `isValidRec()` rejects any rec without a citation, with annual ≠ monthly × 12, or with savings under the $10/mo noise floor.
- Consolidation marks all dropped tools so per-tool rules don't double-count.
- "You're spending well" is the explicit fallback when total monthly savings = 0 — no fake CTA.
- The share page strips identifying details (`notes`, email) before rendering — only structured numbers go on the public URL.

## Security & abuse

- Honeypot (`company_url`) field on the audit form; non-empty submissions are silently dropped.
- IP rate limit at 10 req/hr (audit) and 20 req/hr (lead).
- Server-side validation of every body field. Tool ids, plan ids, use case must be in the allowlist.
- No PII in the OG image — only the headline savings number and the slug.
- No secrets in client bundle — Anthropic + Resend keys are server-only and read in route handlers.

## What changes at 10k audits/day

- **DB**: swap `lib/db.ts` for Supabase. Schema is already laid out: `audits`, `leads`, `notify_signups`. Move slug uniqueness to a Postgres unique index.
- **Rate limit**: swap `lib/rate-limit.ts` for Upstash Redis with the same `{ ok, remaining, resetAt }` shape — call sites unchanged.
- **Summary**: keep prompt caching on; estimate ~$0.0008/audit at current Haiku pricing × 10k = ~$8/day.
- **Pricing**: schedule a weekly cron that scrapes vendor pricing pages and opens a PR against `PRICING_DATA.md` if anything moved. A human still reviews — pricing changes need a human eye.
- **OG image**: cache by `(slug, total-monthly-savings)` at the Vercel edge for 24h.
- **Compliance**: a real ToS/Privacy page, GDPR delete-by-slug endpoint, and an opt-out for the notify list.

## Swap targets (named so the swap is obvious)

- `lib/db.ts` → Supabase Postgres (same surface area).
- `lib/rate-limit.ts` → Upstash Redis (`@upstash/ratelimit`).
- `lib/email.ts` → swap Resend for Postmark/SES if Resend's free tier becomes the bottleneck.
- `lib/summary.ts` → swap to Sonnet if quality complaints come in; per-call cost roughly 4× Haiku but still < $0.01.
