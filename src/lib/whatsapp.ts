import { brand } from "@/config/brand";

/**
 * Builds a WhatsApp deep link to the APPROVED business number with a
 * context-aware Arabic message. Returns null when no real business number is
 * configured (never invents a number).
 */
export interface WhatsAppContext {
  productName?: string;
  productRef?: string;
  quantity?: number;
  topic?: "wholesale" | "custom" | "product" | "general";
}

export function buildWhatsAppMessage(ctx: WhatsAppContext = {}): string {
  const lines: string[] = ["مرحباً منجور،"];
  if (ctx.topic === "wholesale") {
    lines.push("أرغب بالاستفسار عن أسعار الجملة.");
  } else if (ctx.topic === "custom") {
    lines.push("أرغب بطلب تصنيع قطعة خشبية حسب الطلب.");
  } else if (ctx.productName) {
    lines.push(`شفت هذا المنتج بموقع منجور وأريد أعرف سعر الجملة: ${ctx.productName}`);
  } else {
    lines.push("أرغب بالاستفسار عن منتجاتكم.");
  }
  if (ctx.quantity && ctx.quantity > 0) lines.push(`الكمية المطلوبة تقريباً: ${ctx.quantity}`);
  if (ctx.productRef) lines.push(`رقم المنتج: ${ctx.productRef}`);
  return lines.join("\n");
}

/** Normalizes a phone number to digits only (wa.me format, no +). */
export function toWaNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function buildWhatsAppUrl(ctx: WhatsAppContext = {}): string | null {
  const number = toWaNumber(brand.contact.whatsapp);
  if (!number) return null; // no approved number configured
  const text = encodeURIComponent(buildWhatsAppMessage(ctx));
  return `https://wa.me/${number}?text=${text}`;
}
