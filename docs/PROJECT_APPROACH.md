# Project approach (short index)

**North-star spec (long form):** [PROJECT_APPROACH_NETLIFY.md](../PROJECT_APPROACH_NETLIFY.md) at repo root.

**Git / release:** [git-branch-workflow.md](git-branch-workflow.md) — work on `develop`, merge to `main` for production.

---

## Operational learnings (keep repeating these checks)

_Additions from staff bulk external gigs, list API parity, and community email campaign work (merged 2026-04)._

### Staff external gigs: create vs list parity

- If you add or map new columns on **create** / **bulk-create** (e.g. `role_type`, `gig_location`, `project_origin`), update **every** Netlify function that reads the same rows for the staff UI—especially **`staff-external-gigs-list.js`** `select(...)`.
- **Symptom when wrong:** data saves correctly in Supabase but the review table or list looks blank for those fields.

### Bulk import (`timeline` and tooling)

- Spreadsheet **`timeline`** values must match the **exact** allowed literals in code (see `src/lib/externalGigBulk.ts` / shared validation). Typos or alternate hyphenation (e.g. `3-6-months` vs the canonical token) will not import that field.
- Repo maintenance scripts live under **`tools/`**. The **`scripts/`** directory is gitignored, so files there will not be committed.

### Email campaigns (Resend + Netlify + Supabase)

- **Idempotency:** write to `email_delivery_log` (or equivalent) **only after** the provider confirms send success. Failed attempts should **not** consume the idempotency slot, or retries will be blocked incorrectly.
- **Rate limits:** batch sends and use a small delay between API calls; configure a **high enough** `timeout` in `netlify.toml` for functions that loop over many recipients.
- **Local Node scripts** (preview, dry-run, full send): load **`.env` / `.env.local`** explicitly—Netlify injects env vars; raw `node` does not.
- **From / reply-to:** If the copy asks people to reply (feedback, support), use a monitored **from** or **`reply_to`** aligned with that expectation; a bare `noreply@` address undermines the CTA.
- **Audience filters:** For bulk marketing-style mail, plan queries against **account status**, **verified email**, and **marketing consent / unsubscribe** fields as soon as the schema supports them—avoid blasting every non-null `email` without rules once those flags exist.

### GitHub PRs and Bugbot

- **You cannot approve your own PR** on GitHub; merging may still be allowed depending on branch protection.
- **Draft PRs** must be marked ready before merge (e.g. `gh pr ready <n>`).
- **Bugbot:** comment **`cursor review`** (or `bugbot run`) on the PR to trigger a review; see [Cursor Bugbot docs](https://cursor.com/docs/bugbot).
