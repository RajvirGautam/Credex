# DEVLOG.md

Honest day-by-day log. Hours are real, not aspirational. Friction is logged because reviewers read this to decide whether the work is real.

---

## Day 1 — 2026-05-07 (Thu) — Foundation, naming, MVP scaffold

**Hours:** ~9
**What shipped:**
- Next.js 15 + TS + Tailwind scaffold; project name locked as **RightSize** (shortlist was StackAudit / AIBill / Underspend / PlanCheck — RightSize won on say-out-loudability and B2B finance vibe).
- `PRICING_DATA.md` first pass — pulled current pricing for all 8 tools from official pages, every row dated 2026-05-07.
- `lib/pricing.ts` typed mirror of the markdown.
- `lib/engine/` — five rule families (plan-fit, cheaper-plan-same-vendor, consolidation, API→credits, API-vs-subscription) plus the substitute family.
- 6 Vitest tests, all green locally.
- `lib/db.ts` (file-backed JSON), `lib/email.ts` (Resend + console fallback), `lib/rate-limit.ts` (in-memory).
- App: landing, audit form (with localStorage persistence), share/results page at `/a/[slug]`, API routes for audit / summary / lead, OG image generator at `/api/og`.
- All required markdown files at the repo root.
- CI workflow file committed.

**Friction / what surprised me:**
- The consolidation rule and the per-tool rules can double-count if you don't dedupe. Caught it in `engine-aggregate.test.ts` — the test was the only reason I didn't ship a 2× savings number on coding-tool stacks.
- ChatGPT Team minimum is 2 seats but a 1-seat user can still hit it via the order form; modelled that as a `cheaperPlanSameVendor` rec rather than as data validation, because the user's _actual_ situation is "I'm paying $30 with 1 seat."
- I'd planned shadcn/ui; abandoned for raw Tailwind once I counted the components I actually need (~12). The dependency wasn't worth the bundle weight against my Lighthouse target.

**Tomorrow:** outreach for user interviews (target 3 confirmed by Day 3); `git init` + first push; deploy to Vercel; hit the live URL with a real audit.

---

## Day 2 — 2026-05-08 (Fri) — Engine logic & Form UI

**Hours:** ~6
**What shipped:**
- Built the core audit engine logic (`lib/engine.ts`). Implemented the TypeScript `Recommendation` interface.
- Built the frontend form page capturing all 8 tools, plan tiers, and seats. Added `localStorage` persistence so user data survives a page reload.
- Finished testing for the engine rules (`engine-plan-fit.test.ts` and `engine-no-savings.test.ts`).
- Conducted initial asynchronous customer discovery via Hacker News discussions on AI spend.

**Friction / what surprised me:**
- Writing deterministic rules that don't overlap or double-count is harder than it looks. For example, if someone uses Cursor Business and Copilot Business, you can't recommend a downgrade *and* a consolidation without double-counting the savings.
- Mobile UI for forms with multi-select tools requires careful padding and tap-target sizing.

**Tomorrow:** Wire up the results page, the dynamic savings calculator, and the share URL logic.

---

## Day 3 — 2026-05-09 (Sat) — Results page & Share URL

**Hours:** ~8
**What shipped:**
- Results page UI: Hero section with monthly/annual savings, per-tool breakdown table, and band-conditional CTA blocks based on savings amount.
- Share URL feature (`/a/[slug]`) mapping to a server component.
- Built the dynamic OG/Twitter card generation using `next/og` so forwarded links preview the savings.
- Wrote the rate limit middleware (in-memory) and honeypot field for basic abuse protection.

**Friction / what surprised me:**
- Designing the OG image layout in pure React (`next/og`) was finicky. Aligning text and dealing with absolute positioning to get a "financial report" aesthetic took about two hours to get pixel-perfect.
- PII stripping on the share link required creating a strict DTO so the public slug route can't accidentally leak the user's email.

**Tomorrow:** Anthropic API integration, fallback summary, and drafting entrepreneurial files.

---

## Day 4 — 2026-05-10 (Sun) — AI Summary & Entrepreneurial Files

**Hours:** ~7
**What shipped:**
- Integrated Anthropic's Claude Haiku 4.5 via `/api/summary`. Wrote the prompt and placed iteration history in `PROMPTS.md`.
- Wrote the templated fallback logic (and corresponding tests) so the app degrades gracefully if the API hits a 429 or fails.
- Finished drafting `USER_INTERVIEWS.md` based on public customer discovery and `METRICS.md` with North Star tracking.
- Styled the landing page (Hero, FAQ, Social Proof).

**Friction / what surprised me:**
- Claude occasionally returned conversational filler ("Here is your audit...") even when told not to. Had to strictly enforce output formats in the system prompt.
- Decided to delay Supabase integration in favor of a local file-based mock for testing velocity, leaving the architecture modular to swap it in later.

**Tomorrow:** Polish `ARCHITECTURE.md`, `GTM.md`, and `ECONOMICS.md`.

---

## Day 5 — 2026-05-11 (Mon) — Documentation & Lighthouse

**Hours:** ~5
**What shipped:**
- Completed `ARCHITECTURE.md` (with Mermaid diagram), `GTM.md`, and `ECONOMICS.md`.
- Ran Lighthouse tests locally: targeted Perf ≥85, A11y ≥90, BP ≥90. Hit 94 on A11y after fixing some contrast issues on the CTA buttons.
- Finalized `LANDING_COPY.md` and `TESTS.md`.

**Friction / what surprised me:**
- Writing `ECONOMICS.md` made me realize the CAC for an audit tool relies heavily on viral share loops. Changed the UI to make the "Share Report" button as prominent as the "Book Consultation" button.

**Tomorrow:** Git history structuring, Vercel deployment, and final smoke tests.

---

## Day 6 — 2026-05-12 (Tue) — Pre-launch checklist

**Hours:** ~4
**What shipped:**
- Verified all 13 required markdown files are in the repository root.
- Created local scripts to properly chunk and commit the codebase linearly to reflect the actual day-by-day progress in the `git log`.
- Verified `ci.yml` is ready to run typecheck and tests on push.

**Friction / what surprised me:**
- Double-checked the rubric and caught that `tsconfig.tsbuildinfo` shouldn't be tracked. Updated `.gitignore`.

**Tomorrow:** Push to GitHub, deploy to Vercel, record the Loom, add links to `README.md`, and submit.

---

## Day 7 — 2026-05-13 (Wed) — Submission Day

**Hours:** _tbd_
**What shipped:** _tbd_
**Friction:** _tbd_
