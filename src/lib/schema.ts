/**
 * JSON-LD schema builders for structured data.
 * Pure functions that return schema.org-compliant objects.
 */

import { SITE_NAME, SITE_URL, absoluteUrl } from "./seo"

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServiceSchemaInput {
  name: string
  description: string
  url?: string
  provider?: string
}

export interface BlogIndexSchemaInput {
  name: string
  description: string
  url?: string
  numberOfItems?: number
  itemListElement?: Array<{ name: string; url: string }>
}

/**
 * Organization schema (company/brand).
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon-32x32.png"),
  }
}

/**
 * WebSite schema (site-level search).
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * BreadcrumbList schema.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/**
 * FAQPage schema.
 */
export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generic Service schema builder.
 */
export function serviceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url ? absoluteUrl(input.url) : SITE_URL,
    provider: input.provider
      ? { "@type": "Organization", name: input.provider }
      : { "@type": "Organization", name: SITE_NAME },
  }
}

/**
 * Generic Blog/Collection schema builder.
 */
export function blogIndexSchema(input: BlogIndexSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url ? absoluteUrl(input.url) : absoluteUrl("/blog"),
    numberOfItems: input.numberOfItems ?? 0,
    ...(input.itemListElement?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: input.itemListElement.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.name,
              url: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
            })),
          },
        }
      : {}),
  }
}
