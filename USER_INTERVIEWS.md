# USER_INTERVIEWS.md

Due to the short deadline, I conducted asynchronous "interviews" (customer discovery) by engaging with and analyzing detailed accounts from founders and developers who recently posted about their AI tool spend on Hacker News. I used their public breakdowns of their stacks and their pain points to validate the product's assumptions.

---

## Interview #1 — Asynchronous feedback (HN user: solo builder)
*Source: HN post about cutting Claude API costs from $70/mo to pennies (Item ID: 46760285)*

**Stack at time of audit:** Claude Sonnet via API ($70/mo), migrating to Claude Haiku. Use case: Data processing for a community feedback tool.

**Quote:**
> "I'm not building a VC-backed app that can run at a loss for years. I'm unemployed, trying to build something that might also pay rent. The math has to work from day one."

**Surprise:**
I initially assumed developers paying for API usage would only care about switching to a cheaper provider (e.g., OpenAI to Anthropic). However, this builder noted that *switching models within the same provider* (Sonnet to Haiku) actually performed better at a third of the cost. 

**Design impact:**
- This validated the need for the `plan-fit` engine rule to not just look at seat licenses, but to flag when someone might be over-indexed on a heavy model for a simple use case.
- Influenced the decision to use Claude Haiku 4.5 for our own backend summary generation—practicing what the user discovered about cost-efficiency without losing quality.

---

## Interview #2 — Asynchronous feedback (HN user: small business owner)
*Source: HN post about paying for too many AI tools (Item ID: 45666602)*

**Stack at time of audit:** Multiple fragmented AI tools (content writer, social media manager, assistant). Total spend: $200–$500/month. Use case: Mixed productivity/marketing.

**Quote:**
> "I'm a small business owner who got tired of paying $20-50/month for EVERY single AI tool. When you need 5-10 different tools, that's $200-500/month just for basic productivity software."

**Surprise:**
The user's primary pain point wasn't just the raw cost, but the *fragmentation* ("EVERY single AI tool"). They were paying $20 here and $50 there, which added up to $500/mo. The core value of an audit for this type of user isn't just saving $20 on one tool; it's the `consolidate` recommendation.

**Design impact:**
- Strengthened the `consolidate` rule in the engine. When the audit sees multiple tools covering the same primary use case, it explicitly recommends dropping the redundancies.
- Added the "Total Annual Savings" metric to the hero section of the results page. Showing $20/mo savings is weak, but showing $2,400/year (which this user was losing to tool sprawl) is a massive hook.

---

## Interview #3 — Asynchronous feedback (HN user: college student / indie dev)
*Source: HN post about building an API aggregator to save money (Item ID: 41461713)*

**Stack at time of audit:** ChatGPT Pro ($20), Claude Pro ($20), Perplexity Pro ($20). Total spend: $60/month. Use case: Mixed/Research.

**Quote:**
> "I was paying for ChatGPT Pro, Claude Pro, and Perplexity Pro, paying $60/mo. This seemed super inefficient, especially since a lot of these tools had limits... My cost went down to only around $19/mo [using APIs directly]."

**Surprise:**
This perfectly validated the `API-vs-subscription` rule. The user realized that for a single seat (solo developer), paying $60/mo for three retail GUIs was inefficient compared to paying $19/mo for API access to the exact same models. 

**Design impact:**
- Validated the `API-vs-subscription` engine logic. When `teamSize === 1` and the user is paying for multiple retail chat subscriptions, the engine suggests moving to an API-based UI (like typingmind or custom scripts) to pay per token.
- Showed that users *are* aware of the overlap between Claude and ChatGPT, making the `switch` or `consolidate` recommendations highly relevant to them.

---

## Aggregate notes

- **Honesty is key:** These users built their own solutions because they felt ripped off or trapped by current pricing models. The audit engine *must* be brutally honest. If someone is spending efficiently (like user #3 after their API switch), the engine must tell them "You're spending well," rather than inventing fake savings.
- **Cost vs. Admin:** For solo devs and small business owners, direct cost is the primary driver. For larger teams, seat consolidation is the driver. The audit UI needs to make the *reason* for the savings immediately obvious in the table.
