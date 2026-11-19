import { z } from "zod";
import { db } from "@/integrations/supabase/db";
import { features } from "@/config/features";
import { toIraqiE164 } from "@/lib/phone";
import { getAttribution } from "@/lib/analytics";

/**
 * Lead capture — client service contract.
 *
 * Submission is gated behind `features.leadSubmission`. While the lead backend
 * (RLS, rate limiting, anti-spam) is unverified on the isolated MANJOOR DB,
 * the flag stays OFF: the UI validates and builds the request but callers must
 * surface an honest "not yet active" state rather than a false success.
 *
 * Persistence (when enabled) goes through a single narrow RPC
 * `submit_quote_request` (SECURITY DEFINER, insert-only, no public SELECT on
 * lead tables) — see supabase/migrations for the definition. This client never
 * reads lead tables directly.
 */

const IRAQI_GOVERNORATES = [
  "بغداد", "البصرة", "نينوى", "أربيل", "النجف", "كربلاء", "بابل", "ذي قار",
  "الأنبار", "ديالى", "كركوك", "صلاح الدين", "واسط", "ميسان", "المثنى",
  "القادسية", "دهوك", "السليمانية", "حلبجة",
] as const;

export const quoteLineItemSchema = z.object({
  productId: z.string().uuid({ message: "معرّف منتج غير صالح" }),
  name: z.string().min(1),
  quantity: z.number().int().positive({ message: "الكمية يجب أن تكون أكبر من صفر" }),
});

/** Normalizes to E.164 so the server regex and stored value stay consistent. */
export const iraqiPhoneSchema = z.string().transform((value, ctx) => {
  const e164 = toIraqiE164(value);
  if (!e164) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "رقم هاتف عراقي غير صالح" });
    return z.NEVER;
  }
  return e164;
});

export const leadContactSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(120),
  phone: iraqiPhoneSchema,
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  governorate: z.enum(IRAQI_GOVERNORATES, { message: "اختر المحافظة" }),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  preferredContact: z.enum(["whatsapp", "phone"]).default("whatsapp"),
  notes: z.string().trim().max(1000, "الملاحظة طويلة جداً").optional().or(z.literal("")),
});

export const quoteRequestSchema = leadContactSchema.extend({
  items: z.array(quoteLineItemSchema).min(1, "أضف منتجاً واحداً على الأقل"),
});

export const wholesaleLeadSchema = leadContactSchema.extend({
  productInterest: z.string().trim().min(2, "اذكر المنتجات التي تهمّك").max(300),
  expectedQuantity: z.string().trim().max(120).optional().or(z.literal("")),
});

export const customOrderSchema = leadContactSchema.extend({
  specifications: z.string().trim().min(10, "صف المواصفات بوضوح").max(1000),
  dimensions: z.string().trim().max(120).optional().or(z.literal("")),
  quantity: z.number().int().positive({ message: "الكمية يجب أن تكون أكبر من صفر" }),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type WholesaleLeadInput = z.infer<typeof wholesaleLeadSchema>;
export type CustomOrderInput = z.infer<typeof customOrderSchema>;

export class LeadSubmissionDisabledError extends Error {
  constructor() {
    super("ميزة إرسال الطلبات غير مفعّلة بعد — قيد التجهيز الأمني.");
    this.name = "LeadSubmissionDisabledError";
  }
}

export interface LeadSubmissionResult {
  referenceNumber: string;
}

async function submitViaRpc(
  source: "quote_request" | "wholesale" | "custom_order" | "contact",
  payload: QuoteRequestInput | WholesaleLeadInput | CustomOrderInput,
): Promise<LeadSubmissionResult> {
  if (!features.leadSubmission) throw new LeadSubmissionDisabledError();
  const attribution = getAttribution();
  const { data, error } = await db.rpc("submit_quote_request", {
    p_source: source,
    p_payload: payload as unknown as Record<string, unknown>,
    p_attribution: attribution as unknown as Record<string, unknown>,
  });
  if (error) throw error;
  const ref = typeof data === "object" && data && "reference" in data
    ? String((data as { reference: unknown }).reference)
    : "";
  if (!ref) throw new Error("لم يتم تأكيد حفظ الطلب");
  return { referenceNumber: ref };
}

export function submitQuoteRequest(input: QuoteRequestInput): Promise<LeadSubmissionResult> {
  const parsed = quoteRequestSchema.parse(input);
  return submitViaRpc("quote_request", parsed);
}

export function submitWholesaleLead(input: WholesaleLeadInput): Promise<LeadSubmissionResult> {
  const parsed = wholesaleLeadSchema.parse(input);
  return submitViaRpc("wholesale", parsed);
}

export function submitCustomOrder(input: CustomOrderInput): Promise<LeadSubmissionResult> {
  const parsed = customOrderSchema.parse(input);
  const note = [parsed.specifications, parsed.dimensions ? `الأبعاد التقريبية: ${parsed.dimensions}` : ""]
    .filter(Boolean)
    .join("\n");
  const shaped: WholesaleLeadInput = {
    name: parsed.name,
    phone: parsed.phone,
    businessName: parsed.businessName,
    governorate: parsed.governorate,
    city: parsed.city,
    preferredContact: parsed.preferredContact,
    notes: note,
    productInterest: "تصنيع حسب الطلب",
    expectedQuantity: String(parsed.quantity),
  };
  return submitViaRpc("custom_order", shaped);
}

export const contactLeadSchema = leadContactSchema.extend({
  message: z.string().trim().min(5, "اكتب رسالتك").max(1000),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

export function submitContactInquiry(input: ContactLeadInput): Promise<LeadSubmissionResult> {
  const parsed = contactLeadSchema.parse(input);
  const shaped: WholesaleLeadInput = {
    name: parsed.name,
    phone: parsed.phone,
    businessName: parsed.businessName,
    governorate: parsed.governorate,
    city: parsed.city,
    preferredContact: parsed.preferredContact,
    notes: parsed.message,
    productInterest: "تواصل عام",
    expectedQuantity: "",
  };
  return submitViaRpc("contact", shaped);
}

export { IRAQI_GOVERNORATES };

export interface ContactDraft {
  name: string;
  phone: string;
  businessName: string;
  governorate: string;
  city: string;
  preferredContact: "whatsapp" | "phone";
  notes: string;
}

export function emptyContact(): ContactDraft {
  return {
    name: "",
    phone: "",
    businessName: "",
    governorate: "",
    city: "",
    preferredContact: "whatsapp",
    notes: "",
  };
}

export function zodFieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
