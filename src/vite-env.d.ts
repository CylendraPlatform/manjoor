/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_ENABLE_PUBLIC_SITE?: string;
  readonly VITE_ENABLE_LEAD_SUBMISSION?: string;
  readonly VITE_ENABLE_PUBLIC_SALES?: string;
  readonly VITE_ALLOW_INDEXING?: string;
  readonly VITE_ENABLE_WORKSHOP_PRODUCT_PROMO?: string;
  readonly VITE_BUSINESS_WHATSAPP?: string;
  readonly VITE_SITE_ORIGIN?: string;
}
