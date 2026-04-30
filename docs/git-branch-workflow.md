# Git branch workflow: develop → main

**Date:** 2026-03-25  
**Purpose:** Safe testing before production-facing `main`.

## Branches

| Branch | Role |
|--------|------|
| **`develop`** | Default for feature work, fixes, and experiments. Push here first. Use for Netlify branch deploys / previews tied to non-production. |
| **`main`** | Stable line aligned with production (or production-ready deploy). **Do not** commit day-to-day work directly to `main`. |

## Standard flow

1. **`git checkout develop`** and **`git pull origin develop`** before starting work.
2. Implement changes; commit on **`develop`**.
3. **`git push origin develop`** and test (preview, QA, stakeholders).
4. When ready to release: merge **`develop` → `main`** (fast-forward or merge commit), then **`git push origin main`**.

## Emergency / hotfix

- Prefer branching from **`main`** as `hotfix/…`, merging back to both **`main`** and **`develop`**, unless the team agrees otherwise.

## Enforcement

- Cursor project rule **Git: develop first, main for release** applies this workflow to agent-assisted work.
- If you ask to push or merge in a way that skips **`develop`**, the agent should remind you of this doc and suggest the safer path.

## GitHub PR notes

- **Self-approval:** GitHub does not allow you to *approve* your own pull request; you can still **merge** if branch protection allows it.
- **Draft PRs:** Mark ready before merging (for example: `gh pr ready <number>`).
- **Bugbot:** Comment `cursor review` on the PR to trigger [Cursor Bugbot](https://cursor.com/docs/bugbot).

See **[PROJECT_APPROACH.md](PROJECT_APPROACH.md)** for implementation pitfalls (API `select` parity, bulk import literals, campaign email idempotency, etc.).
