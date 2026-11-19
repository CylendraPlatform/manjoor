/**
 * Phase 02 feature flags (sales-first platform).
 *
 * These are SEPARATE, independently-gated capabilities. Defaults are SAFE
 * (public submission and direct checkout off) and must stay off until the
 * backend has passed security/RLS testing on the isolated MANJOOR database.
 *
 * - publicSite:        render the public marketing website + catalog browsing.
 * - leadSubmission:    allow quote-request / wholesale lead submission to persist.
 *                      Until the lead backend (RLS + rate limiting) is verified,
 *                      keep OFF — the UI still builds and validates the request
 *                      but reports an honest "not yet active" state.
 * - directCheckout:    the P0 direct-purchase lockdown (inherited, unchanged).
 */
const flag = (value: string | undefined) => value === "true";

export const features = {
  publicSite: flag(import.meta.env.VITE_ENABLE_PUBLIC_SITE),
  leadSubmission: flag(import.meta.env.VITE_ENABLE_LEAD_SUBMISSION),
  // Inherited P0 flag — do not change its default meaning.
  directCheckout: flag(import.meta.env.VITE_ENABLE_PUBLIC_SALES),
  // Legacy env gate. Public bakarat now live as a static workshop catalog, not this flag.
  workshopProductPromo: flag(import.meta.env.VITE_ENABLE_WORKSHOP_PRODUCT_PROMO),
} as const;
