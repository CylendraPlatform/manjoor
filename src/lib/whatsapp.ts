import { brand } from "@/config/brand";

/**
 * Builds a WhatsApp deep link to the configured business number only.
 * Never uses visitor-supplied phone numbers.
 */
export interface WhatsAppContext {
  productName?: string;
  productRef?: string;
  model?: string;
  quantity?: number;
  referenceNumber?: string;
  topic?: "wholesale" | "custom" | "product" | "general" | "followup";
}

export function toWaNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Normalize local Iraqi mobiles (07…) to wa.me digits with country code 964. */
export function normalizeBusinessWhatsApp(raw: string): string {
  let digits = toWaNumber(raw);
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length >= 10) digits = `964${digits.slice(1)}`;
  else if (digits.length === 10 && digits.startsWith("7")) digits = `964${digits}`;
  if (!/^9647\d{9}$/.test(digits)) return "";
  return digits;
}

export function configuredWhatsAppNumber(): string {
  const fromEnv = import.meta.env.VITE_BUSINESS_WHATSAPP ?? "";
  return normalizeBusinessWhatsApp(fromEnv || brand.contact.whatsapp);
}

export function isWhatsAppConfigured(): boolean {
  return configuredWhatsAppNumber().length > 0;
}

export function buildWhatsAppMessage(ctx: WhatsAppContext = {}): string {
  const reference = ctx.referenceNumber?.trim() ?? "";
  if (reference) {
    return `السلام عليكم، قدمت طلباً لدى منجور وأرغب بمتابعته. رقم الطلب: ${reference}.`;
  }
  if (ctx.topic === "wholesale") {
    return "السلام عليكم، أريد الاستفسار عن تجهيز كميات جملة من منتجات منجور.";
  }
  if (ctx.topic === "custom") {
    return "السلام عليكم، أريد الاستفسار عن تصنيع قطعة خشبية حسب الطلب.";
  }
  const model = (ctx.model ?? ctx.productRef ?? "").trim();
  if (ctx.topic === "product" && model) {
    return `السلام عليكم، أريد الاستفسار عن بكار خشبي من منجور، الموديل: ${model}.`;
  }
  return "السلام عليكم، أريد الاستفسار عن منتجات منجور الخشبية.";
}

export function buildWhatsAppUrl(
  ctx: WhatsAppContext = {},
  businessNumber = configuredWhatsAppNumber(),
): string | null {
  const number = normalizeBusinessWhatsApp(businessNumber);
  if (!number) return null;
  const text = encodeURIComponent(buildWhatsAppMessage(ctx));
  return `https://wa.me/${number}?text=${text}`;
}
