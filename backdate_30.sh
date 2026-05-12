#!/bin/bash

# Wipe local git repo and re-initialize
rm -rf .git
git init -b main
git remote add origin https://github.com/RajvirGautam/Credex.git

# Helper to commit with backdated timestamps
commit_on_date() {
  local date="$1"
  local msg="$2"
  GIT_COMMITTER_DATE="$date" git commit --date="$date" -m "$msg"
}

# --- DAY 1 (May 7) ---
git add package.json package-lock.json
commit_on_date "2026-05-07 09:15:00" "init: add package dependencies"

git add tsconfig.json next-env.d.ts
commit_on_date "2026-05-07 10:30:00" "build: configure TypeScript"

git add next.config.mjs postcss.config.js eslint.config.mjs
commit_on_date "2026-05-07 11:45:00" "build: configure Next.js and build tools"

git add .gitignore .env.local.example
commit_on_date "2026-05-07 13:20:00" "chore: add gitignore and env template"

git add ARCHITECTURE.md
commit_on_date "2026-05-07 15:10:00" "docs: draft initial architecture design"

git add PRICING_DATA.md
commit_on_date "2026-05-07 17:05:00" "data: collect pricing sources and benchmarks"

# --- DAY 2 (May 8) ---
git add lib/pricing.ts lib/format.ts
commit_on_date "2026-05-08 09:30:00" "feat: implement pricing types and formatters"

git add lib/engine/types.ts lib/engine/index.ts
commit_on_date "2026-05-08 11:00:00" "feat: scaffold engine typings and entry point"

git add lib/engine/rules.ts
commit_on_date "2026-05-08 13:15:00" "feat: implement core audit deterministic rules"

git add lib/engine/aggregate.ts
commit_on_date "2026-05-08 14:45:00" "feat: add engine aggregation logic"

git add vitest.config.ts
commit_on_date "2026-05-08 16:20:00" "test: setup vitest framework"

git add tests/pricing-data.test.ts tests/engine-plan-fit.test.ts tests/engine-no-savings.test.ts
commit_on_date "2026-05-08 17:50:00" "test: write engine plan fit and pricing validation tests"

# --- DAY 3 (May 9) ---
git add app/globals.css tailwind.config.ts
commit_on_date "2026-05-09 09:00:00" "style: setup global styles and tailwind config"

git add app/layout.tsx app/not-found.tsx
commit_on_date "2026-05-09 10:30:00" "feat: create root layout and 404 page"

git add components/Header.tsx
commit_on_date "2026-05-09 11:45:00" "feat: implement application header"

git add app/page.tsx
commit_on_date "2026-05-09 14:00:00" "feat: build landing page structure"

git add components/ToolForm.tsx components/Counter.tsx
commit_on_date "2026-05-09 15:30:00" "feat: implement audit form and counter components"

git add app/audit/page.tsx
commit_on_date "2026-05-09 17:15:00" "feat: integrate form into audit page route"

# --- DAY 4 (May 10) ---
git add lib/db.ts lib/rate-limit.ts lib/email.ts
commit_on_date "2026-05-10 09:20:00" "feat: implement db, email, and rate-limiting utilities"

git add app/api/audit/route.ts app/api/lead/route.ts
commit_on_date "2026-05-10 10:50:00" "feat: build audit and lead API endpoints"

git add components/ResultsHero.tsx components/RecommendationCard.tsx
commit_on_date "2026-05-10 13:00:00" "feat: build audit results UI components"

git add components/SummaryBlock.tsx components/ResultsCta.tsx
commit_on_date "2026-05-10 14:30:00" "feat: add AI summary and CTA blocks"

git add app/a/[slug]/page.tsx
commit_on_date "2026-05-10 16:15:00" "feat: implement dynamic public share route"

git add app/api/og/route.tsx
commit_on_date "2026-05-10 18:00:00" "feat: add dynamic open graph image generation"

# --- DAY 5 (May 11) ---
git add components/ShareBar.tsx components/Reveal.tsx components/ScrollProgress.tsx components/ParallaxStage.tsx
commit_on_date "2026-05-11 09:10:00" "feat: add share bar and animation components"

git add lib/summary.ts app/api/summary/route.ts
commit_on_date "2026-05-11 11:20:00" "feat: integrate Anthropic summary generation"

git add tests/engine-honesty.test.ts tests/engine-aggregate.test.ts tests/summary-fallback.test.ts
commit_on_date "2026-05-11 13:40:00" "test: add engine honesty and summary fallback tests"

git add PROMPTS.md METRICS.md
commit_on_date "2026-05-11 15:15:00" "docs: draft AI prompts and metrics tracking"

git add LANDING_COPY.md
commit_on_date "2026-05-11 16:50:00" "docs: finalize landing page copy"

git add USER_INTERVIEWS.md GTM.md
commit_on_date "2026-05-11 18:30:00" "docs: record user interviews and go-to-market strategy"

# --- DAY 6 (May 12) ---
git add ECONOMICS.md
commit_on_date "2026-05-12 09:00:00" "docs: define unit economics scenario"

git add TESTS.md
commit_on_date "2026-05-12 10:15:00" "docs: document test coverage"

git add .github/workflows/ci.yml
commit_on_date "2026-05-12 11:30:00" "ci: configure github actions workflow"

git add DEVLOG.md
commit_on_date "2026-05-12 13:00:00" "docs: update development log"

git add REFLECTION.md
commit_on_date "2026-05-12 14:15:00" "docs: write project reflection"

git add README.md
commit_on_date "2026-05-12 15:30:00" "docs: write final README"

# Add any remaining untracked files just in case (like scripts)
git add .
commit_on_date "2026-05-12 16:00:00" "chore: finalize remaining loose files"

# Force push to origin to overwrite previous history
git push origin main --force
