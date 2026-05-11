# METRICS.md

## North Star

> **Verified-savings-acted-on per week.**

Not "audits run" (vanity), not "leads captured" (proxy). The North Star is the dollars we cause to be re-routed or saved by users who acted on a RightSize recommendation. Verified by:

1. The user submits an email + clicks "yes I'm acting on this" on the results page (one-tap), OR
2. The user replies to the confirmation email saying they cancelled, downgraded, switched, or moved to credits, OR
3. (Eventually) the user routes spend through Credex credits — we observe that directly.

## Three input metrics (instrument-first; we wire these on Day 1)

1. **Audit completion rate** — % of `/audit` page-views that result in a successful `POST /api/audit`. Target: ≥ 60% inside the first 30 days. If lower, the form is too long.
2. **Email-submit rate by savings band** — % of results-page views that submit an email, segmented by `well-spent / small / medium / large`. We expect a steep gradient. Target: large-band ≥ 50%, medium ≥ 30%. If the gradient is flat, the band-conditional CTA isn't doing its job.
3. **Share-link follow rate** — % of `/a/<slug>` views that come from outside our owned channels (referral header is not us). This is the unfair-channel metric — if shares don't compound, the GTM model breaks.

## Pivot trigger

If, after 4 weeks live and ≥200 audits run:

- **Large-band audits are <5% of total** *and*
- **Share-link follow rate is <8%**

…we pivot. The audit funnel isn't a credible top-of-funnel for Credex marketplace conversion; we'd reposition RightSize as a paid-tier finance-ops tool (one-shot $99 audit + monthly monitoring for ~$29/mo) and stop subsidising it as marketing.

If only one of those two metrics is bad, we fix it (form length, OG card design, CTA copy) before pivoting.

## What we won't measure as a North Star

- "Total recommended savings shown" — easy to inflate by relaxing rules; corrupts the engine.
- "Audits per visitor" — a re-run is usually noise.
- "Time on site" — anti-correlated with our promise of a 60-second product.

## How we instrument it

- Every `POST /api/audit` and `POST /api/lead` writes a structured log line to Vercel logs. Aggregated nightly.
- A privacy-respecting analytics tool (Plausible) for traffic + referrer breakdown.
- The "I'm acting on this" button posts a one-line ack to the same DB so the verified-savings number is real, not estimated.
- Weekly review: produce one chart with the North Star, three input metrics, and a one-line note on what changed.
