/** Bounty phase P0: no customer ordering, affiliate, or outbound campaigns by default.
 * Client-side gating is UX only; database RPCs must also be disabled in staging.
 */
export const publicSalesEnabled = import.meta.env.VITE_ENABLE_PUBLIC_SALES === "true";
export const bounty = {
  workingName: "باونتي — إدارة المعمل",
  internalOnly: !publicSalesEnabled,
  currency: "IQD",
} as const;
