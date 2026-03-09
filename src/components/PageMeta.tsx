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
}

export function PageMeta({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  ogType = "website",
}: PageMetaProps) {
  const canonicalLink = canonicalUrl ?? (path ? canonical(path) : undefined)
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage)

  return (
    <Helmet>
      <title>{makeTitle(title)}</title>
      {description && <meta name="description" content={description} />}
      {canonicalLink && <link rel="canonical" href={canonicalLink} />}
      {canonicalLink && <meta property="og:url" content={canonicalLink} />}
      <meta property="og:title" content={makeTitle(title)} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={makeTitle(title)} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  )
}
