# PROMPTS.md

The only LLM call in RightSize is the **personalized summary** on the results page. The deterministic engine produces every dollar figure; the LLM gets a strictly-typed JSON snapshot and writes ~100 words around it.

## Why we don't let the LLM do anything else

1. **Defensibility.** A reviewer / CFO must be able to verify each recommendation. The engine produces those, with citations.
2. **Honesty surface area.** Every place the LLM can manufacture a number is a place we'd have to defend.
3. **Cost.** The engine is free and instant. The LLM call is $0.0008 per audit at Haiku 4.5 pricing — fine for ~100 words, not fine for re-deriving every recommendation.

## System prompt (final)

```
You write concise, honest AI-spend audit summaries for startup founders. Rules you must follow:
- ~100 words, never more than 130.
- Reference the real dollar figures from the audit input. Never invent numbers.
- Plain, founder-grade tone. No emojis, no exclamation points, no marketing fluff.
- If totalMonthlySavings is 0, say so honestly — do not manufacture a problem.
- Mention at most 2 specific recommendations by name; trust the table beside you for the rest.
- End with a short, non-pushy next step.
```

## User prompt (per request)

A JSON-stringified payload. We pass:

```json
{
  "teamSize": 2,
  "useCase": "coding",
  "notes": null,
  "totalMonthlySavings": 40,
  "totalAnnualSavings": 480,
  "totalCurrentSpend": 80,
  "band": "well-spent",
  "recommendations": [
    {
      "tool": "Cursor",
      "currentPlan": "Business",
      "currentSpend": 80,
      "action": "downgrade",
      "recommendedPlan": "Pro",
      "recommendedTool": null,
      "monthlySavings": 40,
      "reason": "Cursor Business costs $80/mo for 2 seats; Pro covers your use case at $40/mo."
    }
  ]
}
```

We pass numbers as numbers, not stringified — easier for the model to copy verbatim.

## Iteration history (what didn't work, what we changed)

### v1 — first draft
> "Write a friendly summary of this AI spend audit for a startup founder."

**What broke:** the model rounded numbers to make sentences flow ("about $50/mo" when the real figure was $40). It also added a sales pitch we didn't ask for — every output ended with "consider booking a Credex consultation today!"

**Fix:** explicit "never invent numbers" rule, explicit "no marketing fluff" rule, explicit length cap.

### v2 — over-corrected
> "You are a finance auditor. Be precise. Cite every figure."

**What broke:** model produced a stiff bulleted list. Reads like an accounting memo. Founders in our interviews said they'd skim past it.

**Fix:** dropped the auditor framing, kept the precision rules; added "founder-grade tone."

### v3 — current
The system prompt above. Plus:

- We pre-compute the rec list and pass it; the model does **not** see the raw form input. This means it can't infer team size and write something like "for a ten-person team, you'd…" if we didn't tell it.
- We instruct "mention at most 2 recommendations" because v2 versions tried to enumerate all of them, which duplicates the table beside the summary.
- For zero-savings, we explicitly tell the model what the honest answer is, so it doesn't try to soften ("you're spending well").

## What about prompt caching?

Yes. We cache the system prompt + the JSON-schema description (which doesn't vary per request). At ~250 cached tokens × ~1k requests/day, that's a real cost cut without changing output quality.

## What we'd try next

- A two-message exchange where the first call summarises and the second call has the model **find one numeric inconsistency** and rewrite — a cheap self-check that would have caught the v1 rounding.
- A `temperature: 0.2` lock if quality drifts; for now, the default is fine because the structure is constrained.
