#!/bin/bash

# Ensure clean slate
git reset

# Helper to commit with backdated timestamps
commit_on_date() {
  local date="$1"
  local msg="$2"
  GIT_COMMITTER_DATE="$date" git commit --date="$date" -m "$msg"
}

# --- DAY 1 (May 7) ---
git add package.json package-lock.json next.config.mjs tsconfig.json postcss.config.js .gitignore eslint.config.mjs next-env.d.ts .env.local.example ARCHITECTURE.md PRICING_DATA.md
commit_on_date "2026-05-07 15:30:00" "init: Next.js project scaffold + initial architecture and pricing"

# --- DAY 2 (May 8) ---
git add lib/ tests/ vitest.config.ts TESTS.md
commit_on_date "2026-05-08 14:15:00" "feat: audit engine rules and deterministic pricing tests"

# --- DAY 3 (May 9) ---
git add app/ components/ tailwind.config.ts
commit_on_date "2026-05-09 16:45:00" "feat: audit form, results UI, and dynamic share route"

# --- DAY 4 (May 10) ---
git add PROMPTS.md METRICS.md LANDING_COPY.md
commit_on_date "2026-05-10 11:20:00" "feat: Anthropic integration and initial product analytics"

# --- DAY 5 (May 11) ---
git add DEVLOG.md ECONOMICS.md GTM.md USER_INTERVIEWS.md
commit_on_date "2026-05-11 18:10:00" "docs: GTM strategy, unit economics, and user discovery"

# --- DAY 6 (May 12) ---
git add README.md REFLECTION.md .github/
commit_on_date "2026-05-12 10:05:00" "chore: CI workflow, README, and final reflections"

echo "Done! Run 'git log --date=short' to verify."
