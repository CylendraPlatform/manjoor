/**
 * Canonical MANJOOR brand identity (single source of truth).
 *
 * MANJOOR (منجور) — Iraqi woodcraft manufacturing & commerce platform, Karbala.
 * Dukany was the original code foundation; "Bounty" was an intermediate
 * adaptation codename. Neither is the current product identity.
 *
 * Trademark clearance is still pending: this identity is approved for INTERNAL
 * development only, not public commercial launch.
 *
 * Contact / social fields are intentionally EMPTY placeholders. Do not invent
 * phone numbers, domains, or social handles — fill them only with confirmed,
 * real values (ideally from environment configuration) when available.
 */
export const brand = {
  ar: "منجور",
  en: "MANJOOR",
  sloganAr: "فنّ الخشب العراقي",
  internalApp: "MANJOOR Manufacturing OS",
  internalAppAr: "منجور — نظام إدارة التصنيع",
  originAr: "كربلاء، العراق",
  category: "Woodcraft, Décor & Manufacturing",
  currency: "IQD",
  currencySymbolAr: "د.ع",
  /**
   * Official artwork must be supplied under `public/brand/` (see its README).
   * These paths are wired and ready; the files are provided by the brand owner
   * and are NOT generated here.
   */
  logo: {
    horizontal: "/brand/manjoor-logo-horizontal.png",
    icon: "/brand/manjoor-icon.png",
    footer: "/brand/manjoor-logo-horizontal.png",
  },
  contact: {
    phone: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;
