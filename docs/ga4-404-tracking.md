# GA4: track 404 “not found” URLs

The app fires a custom event when users hit the React `NotFound` page (unknown client-side routes).

## Event sent from the app

| Field | Value |
|--------|--------|
| **Event name** | `not_found` |
| **Parameters** | See below |

| Parameter | Description | Example |
|-----------|-------------|---------|
| `requested_path` | Path only (no query string) | `/old-page` |
| `query_string` | Query string **without** leading `?` (only if present) | `tab=1` |
| `referrer` | `document.referrer` when the browser sent one | `https://google.com/` |

Measurement ID in `index.html`: `G-00XM3VF4VW` (same property receives the event).

---

## What to configure in GA4

Do this in the **same GA4 property** that uses `G-00XM3VF4VW`.

### 1) Mark the event as a key event (optional)

1. **Admin** (gear) → **Data display** → **Events**
2. Find **`not_found`** (appears after real traffic; can take 24–48 hours, or use DebugView—see below)
3. Toggle **Mark as key event** if you want it highlighted as a conversion-style metric

### 2) Register custom dimensions (recommended)

So you can break down and explore by path/referrer:

1. **Admin** → **Data display** → **Custom definitions** → **Custom dimensions** → **Create custom dimension**
2. Create **one row per parameter** (names must match **exactly**):

| Dimension name (your label) | Scope | Event parameter |
|-----------------------------|--------|-----------------|
| Not found — path | Event | `requested_path` |
| Not found — query | Event | `query_string` |
| Not found — referrer | Event | `referrer` |

**Note:** New custom dimensions only apply to **new** data from the creation time forward (GA4 does not backfill).

### 3) Verify with DebugView (recommended before waiting on reports)

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore) (Chrome) or add `?debug_mode=true` to the URL if you use debug mode elsewhere
2. **Admin** → **Data display** → **DebugView**
3. Open a bad URL on your site (e.g. `https://gigexecs.com/does-not-exist`)
4. You should see event **`not_found`** with the parameters

### 4) Reports / Explorations

- **Explore** → **Free form** (or **Blank** exploration)
- **Dimensions:** add your custom dimensions + **Event name**
- **Metrics:** **Event count**
- **Filter:** **Event name** exactly matches `not_found`
- **Rows:** `requested_path` (and optionally `referrer`)

You can also add **Page path** / **Page location** for context, but the dedicated parameters above are what we send for 404 analysis.

---

## Limits & behavior

- **SPA routing:** `netlify.toml` serves `index.html` for all paths (`/*` → `/index.html` **200**), so the app loads and this event fires for unknown routes.
- **Hard 404s:** If a URL never loads your app (e.g. missing asset, edge rule), this event will **not** fire—use CDN/server logs for those.
- **PII:** Avoid putting emails or tokens in URLs; `query_string` is logged as sent.
