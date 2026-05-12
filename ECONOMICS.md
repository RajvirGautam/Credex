# ECONOMICS.md

> All numbers below are honest order-of-magnitude estimates with the assumptions stated inline. Real numbers replace these as soon as we have 30 audits / 30 days of data.

## Lead value

A "lead" = an email submitted on the results page. Not all leads convert; below splits by savings band:

| Savings band | Share of audits (assumed) | Email submission rate | Conversion to a Credex credit purchase | LTV per converted lead |
|---|---|---|---|---|
| Well-spent ($0/mo savings) | 25% | 8% (notify-me list) | 5% (long-term, when their stack changes) | ~$200 |
| Small ($10–$100/mo) | 35% | 22% | 8% | ~$400 |
| Medium ($100–$500/mo) | 28% | 38% | 18% | ~$1,200 |
| Large (>$500/mo) | 12% | 55% | 30% | ~$3,500 |

Blended lead → revenue:

```
0.25*0.08*0.05*200 + 0.35*0.22*0.08*400 + 0.28*0.38*0.18*1200 + 0.12*0.55*0.30*3500
≈ 0.20 + 2.46 + 22.97 + 69.30
≈ $94.93 of expected revenue per audit submitted
```

We're rounding aggressively in either direction; the honest read is "between $30 and $150 of expected gross profit per audit, with most of the variance coming from the large-savings band."

## CAC per channel (rough estimates)

| Channel | CAC per audit submitted | Notes |
|---|---|---|
| Direct outreach (week 1) | ~$0 cash, ~$25 of my time | Bad CAC math but high signal |
| Producthunt launch | $0 cash, ~$200 of my time + supporter goodwill | One-time spike, not sustainable |
| Reddit + Indie Hackers organic | ~$0–$15 if we pay for moderation |
| SEO (comparison pages) | $30/article one-time, $0 ongoing | Compounds; pays back at audit #2 |
| Newsletter sponsorships | $80–$200 per audit | Only worth it if blended LTV > $300 |
| Paid (Google Ads, X Ads) | $40–$80 per audit | Last resort; we should compound organic first |

## $1M ARR scenario math

To get to $1M ARR via the audit funnel, we need to sustain enough conversion volume that the recurring credit-purchase revenue clears $83.3k/mo.

Take the medium- and large-band converters. Average LTV is ~$2,000, but recurring revenue per active converter is closer to ~$400/year (most credit purchases are quarterly top-ups).

To run $1M ARR:

- Need ~2,500 active converters at any given time.
- At an 18% blended convert-rate-of-large-band-leads, we need ~14,000 large+medium leads in the active book.
- At a 38% submission rate on those bands and a ~12% share of audits hitting them, **we need ~310,000 audits run cumulatively.**

That's the wrong frame, though. The right frame is:
> _"If we run 30 audits/day from organic + content, that's ~11k/yr — about 4% of our $1M-ARR target audit volume. We need 25× that, which is realistic only with a SEO compounding base + ~1 paid channel + 1 partnership."_

Honest read: $1M ARR is plausible inside 18 months **only if** the share-card unfair channel actually compounds. If it doesn't, this stays a useful lead funnel but is not the primary business — Credex's marketplace is.

## Sensitivity (the two numbers that move everything)

1. **Large-band share of audits.** Currently estimated at 12% — if it's 4%, the funnel barely covers its own CAC. If it's 25%, $1M ARR happens in 12 months.
2. **Conversion of large-band leads to credit purchase.** Currently estimated at 30% — every percentage point is worth ~$30k ARR at scale.

The first thing I'd instrument post-launch is the actual band distribution of submitted audits, because the model is most sensitive to it and we have zero real data.
