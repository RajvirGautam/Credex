# REFLECTION.md

> Five questions, answered honestly. 150–400 words each.

## 1. What did you choose to build, and why this product over the obvious "spend audit"?

I built RightSize as the literal product Credex described — but the design choice that mattered was treating the audit engine as a **finance-grade artefact, not an LLM party trick**. The temptation was to wrap GPT around the input and call it a day; the discipline is to make every recommendation defendable line-by-line by a CFO who's never used AI.

So: the engine is hard-coded TypeScript rules, every dollar figure cites a dated vendor URL, the noise floor is $10/mo (so we don't manufacture micro-savings), and the "you're spending well" branch is treated as an equally valid outcome — not a failure mode that needs dressing up. The LLM was reserved for the one place creativity helps and a wrong number doesn't matter: the ~100-word personalized summary.

The risk I accepted: a hard-coded engine misses edge cases an LLM might catch. The risk I refused: an LLM that hallucinates a $400/mo "savings" that finance can't verify and won't trust.

## 2. What's the single thing you most underestimated?

Consolidation double-counting. The rule "you're paying for two coding tools, drop one" is obvious in English; in code, it interacts with the per-tool plan-fit rule in a way that quietly inflates the hero number. I caught it because of `engine-aggregate.test.ts` — which I had only written because the plan said "≥5 tests." If I'd skipped that test in the name of moving fast, the demo audit would have shown ~2× the real savings number, and any reviewer who tried to verify would have lost trust in the whole thing.

Lesson banked: write the aggregation test before the aggregation rule, not after.

## 3. If you had two more weeks, what would you build next?

In order:

1. **Real Supabase + a per-vendor pricing scraper** that opens a weekly PR against `PRICING_DATA.md` so the dataset never goes stale. The DB swap is already a one-file change; the scraper is the harder part.
2. **Connect-your-billing path** — let teams paste their Stripe/credit-card receipt summary instead of typing each tool. Three of three interviewees said the form felt long, and they're right.
3. **Benchmark mode** — "companies your size pay an average of $X/dev for AI tools." Needs anonymised aggregate data, which we'll have after a few weeks of audits.
4. **PDF export for finance.** Not because PDFs are good but because that's the artefact people forward.

Bonus items in the original plan (embeddable widget, referral codes) I'd defer further. They're growth toys, not product depth.

## 4. What did your three user interviews change?

Three founders/eng-leaders, two solo, one Series A. The most useful surprise: nobody wanted the "consolidate" recommendation framed as a switch — they wanted to keep both tools and just downgrade the more expensive one. So the rule fires only when the headline savings beat the noise floor and the use case actually overlaps.

Second change: the "you're spending well" page used to have a CTA. All three interviewees said it felt manipulative — if the answer is no, sell me later. Removed the CTA; replaced with an opt-in "notify me when this changes." Conversion will be lower; trust will not.

Third: the audit form used to ask for company name and role up front. Two of three closed the tab. Moved both to optional fields after the value reveals.

Full notes in `USER_INTERVIEWS.md`.

## 5. What would you do differently next time?

I'd commit on Day 0. The repo started clean on Day 1, which means my "first commit" is also the day I started building — which means the rubric criterion "commits on ≥5 distinct calendar days" is mathematically tighter than it needs to be. Next time: open the repo the moment I read the prompt, commit the empty scaffold, and treat each day's work as an addition.

I'd also write the Decisions section of the README on Day 1, not Day 7. Forces clarity about trade-offs while you can still change them.
