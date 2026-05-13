/**
 * Client-side flags (must mirror Netlify env for consistent UX; server remains authoritative).
 * Set `VITE_GIG_ACCESS_ENFORCEMENT=true` alongside Netlify `GIG_ACCESS_ENFORCEMENT=true` for rollout.
 */
export function isGigAccessEnforcementEnabled(): boolean {
  return import.meta.env.VITE_GIG_ACCESS_ENFORCEMENT === 'true';
}
