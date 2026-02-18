/**
 * Global SEO constants and helpers.
 * Single source of truth for site-wide SEO configuration.
 *
 * ROUTER: Vite + React (react-router-dom) — NOT Next.js App Router or Pages Router.
 *
 * METADATA: Use react-helmet-async (not document.title in useEffect). Social crawlers and
 * some SEO tooling can be inconsistent with JS-rendered content; Helmet gives a clean,
 * declarative per-route solution. Canonical, OG, and Twitter tags drop right in with
 * these helpers (makeTitle, canonical, absoluteUrl).
 *
 * JSON-LD: Injected client-side via the JsonLd component.
 */

export const SITE_NAME = "GigExecs"
export const SITE_URL = "https://gigexecs.com"
export const TITLE_SUFFIX = "| GigExecs"
export const DEFAULT_OG_IMAGE = "/og/default.png"

/**
 * Build a full page title with site suffix.
 */
export function makeTitle(pageTitle: string): string {
  if (!pageTitle?.trim()) return SITE_NAME
  return `${pageTitle.trim()} ${TITLE_SUFFIX}`
}

/**
 * Build canonical URL for a path.
 */
export function canonical(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${clean}`
}

/**
 * Build absolute URL for any path (assets, links, etc.).
 */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const clean = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${clean}`
}
