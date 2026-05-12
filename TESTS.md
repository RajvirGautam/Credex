# TESTS.md

Six Vitest files. They all run with `npm test`.

| File | Covers |
|---|---|
| `tests/pricing-data.test.ts` | Every plan in `lib/pricing.ts` has a citation URL on the vendor allowlist; every tool has either a paid plan or a usage plan. |
| `tests/engine-plan-fit.test.ts` | Cursor Business → Pro for a 2-seat coding team saves exactly $40/mo, $480/yr; cited to cursor.com. Org-scale (15-person, 10-seat) Business is left alone. |
| `tests/engine-no-savings.test.ts` | A 1-seat Claude Pro user returns 0 savings, no recs, well-spent band. `bandFor()` thresholds correctly classify well-spent / small / medium / large. |
| `tests/engine-honesty.test.ts` | `isValidRec()` rejects (a) recs with savings under $10/mo and (b) recs missing a citation. End-to-end run guarantees `annualSavings === monthlySavings * 12` for every produced rec. |
| `tests/engine-aggregate.test.ts` | Hero total = sum of per-tool savings. Three coding tools (Cursor + Copilot + Windsurf) produce exactly one consolidation rec saving $39/mo — the dropped tools do **not** also generate per-tool plan-fit recs on top. |
| `tests/summary-fallback.test.ts` | Templated summary contains the real numbers from the audit ($40, $480, "cursor"). For the no-savings audit, the templated summary says "spending well" and does not contain "$0". |

## How to run

```bash
npm install
npm test            # one-shot
npm run test:watch  # watch mode
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

CI runs all four (`lint`, `typecheck`, `test`, `build`) on every push to `main` — see `.github/workflows/ci.yml`.

## What is NOT covered (called out honestly)

- API route handlers — happy path is exercised manually + via the file-DB; an integration test against a real HTTP mount is on the deferred list.
- The OG image route — visual output only; we eyeball it pre-submission.
- The `generateSummary()` AI path — the test covers the templated fallback; the AI path is exercised in dev with a real key.

If a test is missing for something you'd expect, it's because adding it would not have caught a bug I shipped — not because I forgot.
