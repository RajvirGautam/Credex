# PRICING_DATA.md

Source of truth for every dollar figure used by the audit engine. The TypeScript file `lib/pricing.ts` mirrors the rows below. Each row cites the vendor URL it was pulled from and the date pulled. Re-verify within 48 hours of submission.

**Date pulled (initial):** 2026-05-07
**Currency:** USD, monthly headline

---

## Cursor — https://cursor.com/pricing  *(pulled 2026-05-07)*

| Plan     | Per seat / mo | Notes |
|----------|---------------|-------|
| Hobby    | $0            | Free tier |
| Pro      | $20           | Individual paid tier |
| Business | $40           | Team admin + privacy |

## GitHub Copilot — https://github.com/features/copilot/plans  *(pulled 2026-05-07)*

| Plan          | Per seat / mo | Notes |
|---------------|---------------|-------|
| Free          | $0            | Limited completions |
| Pro (Individual) | $10        | Individual paid |
| Business      | $19           | Team admin |
| Enterprise    | $39           | Org-level |

## Claude.ai — https://www.anthropic.com/pricing  *(pulled 2026-05-07)*

| Plan      | Per seat / mo | Notes |
|-----------|---------------|-------|
| Free      | $0            | |
| Pro       | $20           | Single-user, monthly |
| Max 5x    | $100          | Single-user, higher caps |
| Max 20x   | $200          | Single-user, top caps |
| Team      | $30 (monthly) / $25 (annual) | Multi-seat |

## ChatGPT — https://openai.com/chatgpt/pricing/  *(pulled 2026-05-07)*

| Plan       | Per seat / mo | Notes |
|------------|---------------|-------|
| Free       | $0            | |
| Plus       | $20           | Single-user |
| Pro        | $200          | Single-user, top caps |
| Team       | $30 (monthly) / $25 (annual) | Multi-seat, ≥2 |
| Enterprise | ~$60 indicative | Custom contract; shown as floor |

## Anthropic API — https://www.anthropic.com/api  *(pulled 2026-05-07)*

Usage-based. The audit treats user-reported monthly spend as authoritative; recommendations focus on caching, model-tier downgrade, and Credex credits rather than plan switches.

## OpenAI API — https://openai.com/api/pricing/  *(pulled 2026-05-07)*

Usage-based. Same treatment as Anthropic API above.

## Gemini — https://gemini.google/subscriptions/  *(pulled 2026-05-07)*

| Plan      | Per seat / mo | Notes |
|-----------|---------------|-------|
| Free      | $0            | |
| AI Pro    | $20           | Single-user |
| AI Ultra  | $250          | Single-user, premium models |

## Windsurf — https://windsurf.com/pricing  *(pulled 2026-05-07)*

| Plan   | Per seat / mo | Notes |
|--------|---------------|-------|
| Free   | $0            | |
| Pro    | $15           | Individual paid |
| Teams  | $35           | Team admin |

---

## Honesty notes

- All "Team / annual" prices are normalised to **monthly headline** — the price the buyer sees on the checkout page if they pick monthly billing — to avoid hiding savings in annual prepay math.
- Indicative enterprise prices (ChatGPT Enterprise) are floors, never used to manufacture savings against an unknown contract.
- API tools are not eligible for plan-fit recommendations; they are eligible for Credex-credits recommendations only.
