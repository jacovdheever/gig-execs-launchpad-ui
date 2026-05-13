/**
 * Per-route metadata via react-helmet-async.
 * Use on each page for reliable indexing and social sharing cards.
 * Helpers (makeTitle, canonical, absoluteUrl) drop right in.
 */

import { Helmet } from "react-helmet-async"
import {
  makeTitle,
  canonical,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo"

export interface PageMetaProps {
  title: string
  description?: string
  /** Path for canonical (e.g. "/clients"). Defaults to current path if not set. */
  path?: string
  /** OG image path. Defaults to DEFAULT_OG_IMAGE. */
  ogImage?: string
  /** Override canonical URL entirely (rare). */
  canonicalUrl?: string
  /** OG type (e.g. "article" for blog posts). Defaults to "website". */
  ogType?: string
  /**
   * Use as the literal document &lt;title&gt; (no `makeTitle` / "| GigExecs" suffix).
   * Use when marketing needs an exact browser title string.
   */
  exactDocumentTitle?: string
  /** Overrides og:title and defaults twitter:title when twitterTitle is omitted. */
  ogTitle?: string
  /** Overrides twitter:title when different from og:title. */
  twitterTitle?: string
  /** Overrides og:description when different from meta description. */
  ogDescription?: string
  /** Overrides twitter:description. Falls back to ogDescription then description. */
  twitterDescription?: string
}

export function PageMeta({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  ogType = "website",
  exactDocumentTitle,
  ogTitle,
  twitterTitle,
  ogDescription,
  twitterDescription,
}: PageMetaProps) {
  const canonicalLink = canonicalUrl ?? (path ? canonical(path) : undefined)
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage)
  const documentTitle = exactDocumentTitle ?? makeTitle(title)
  const openGraphTitle = ogTitle ?? documentTitle
  const twitterCardTitle = twitterTitle ?? openGraphTitle
  const openGraphDescription = ogDescription ?? description
  const twitterCardDescription =
    twitterDescription ?? ogDescription ?? description

  return (
    <Helmet>
      <title>{documentTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalLink && <link rel="canonical" href={canonicalLink} />}
      {canonicalLink && <meta property="og:url" content={canonicalLink} />}
      <meta property="og:title" content={openGraphTitle} />
      {openGraphDescription && (
        <meta property="og:description" content={openGraphDescription} />
      )}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterCardTitle} />
      {twitterCardDescription && (
        <meta name="twitter:description" content={twitterCardDescription} />
      )}
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  )
}
