/**
 * Public-sales gate (MANJOOR P0). No customer ordering, affiliate, or outbound
 * campaigns by default. Client-side gating is UX only; database RPCs must also
 * be disabled in staging.
 *
 * This module keeps the historical `bounty` filename/export as a stable
 * technical reference (the intermediate adaptation codename); the brand shown
 * to users is MANJOOR, sourced from `./brand`.
 */
import { brand } from "./brand";

export const publicSalesEnabled = import.meta.env.VITE_ENABLE_PUBLIC_SALES === "true";
export const bounty = {
  workingName: brand.internalAppAr,
  internalOnly: !publicSalesEnabled,
  currency: brand.currency,
} as const;
