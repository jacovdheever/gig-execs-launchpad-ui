/**
 * Global positioning wording map.
 * Use when updating page copy to replace discouraged terms with preferred ones.
 * Do not run codemods — apply manually during content updates.
 */

const POSITIONING_MAP: Record<string, string> = {
  marketplace: "premium network",
  gigs: "engagements",
  freelancers: "independent consultants",
  bidding: "matching",
}

/**
 * Suggest a preferred replacement for a discouraged term.
 * Returns the replacement if found, otherwise the original term.
 */
export function suggestReplacement(term: string): string {
  const key = term.toLowerCase().trim()
  return POSITIONING_MAP[key] ?? term
}

/**
 * Full mapping for reference during content updates.
 */
export const positioningMap = POSITIONING_MAP as Readonly<Record<string, string>>
