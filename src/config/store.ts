import { brand } from "./brand";

/**
 * MANJOOR store identity. Internal-stage software — do not publish the product
 * catalog or checkout before legal/commercial approvals.
 * Canonical brand values live in `./brand`; contact fields are unconfirmed
 * placeholders (never invent real contact details).
 */
export const storeConfig = {
    brand: { ar: brand.ar, en: brand.en },
    name: brand.internalAppAr,
    phone: brand.contact.phone,
    whatsapp: brand.contact.whatsapp,
    address: `${brand.originAr} (عنوان تفصيلي بانتظار التأكيد)`,
    social: {
        instagram: brand.contact.instagram,
        facebook: brand.contact.facebook,
        tiktok: brand.contact.tiktok,
    },
    currency: brand.currencySymbolAr,
};
