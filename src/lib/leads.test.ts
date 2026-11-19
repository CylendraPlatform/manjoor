import { describe, it, expect } from "vitest";
import { quoteRequestSchema, wholesaleLeadSchema, LeadSubmissionDisabledError, submitQuoteRequest } from "./leads";

const uuid = "11111111-1111-1111-1111-111111111111";

describe("lead validation", () => {
  it("accepts a valid quote request", () => {
    const r = quoteRequestSchema.safeParse({
      name: "أحمد", phone: "07701234567", governorate: "كربلاء", preferredContact: "whatsapp",
      items: [{ productId: uuid, name: "صندوق", quantity: 20 }],
    });
    expect(r.success).toBe(true);
  });
  it("rejects zero/negative quantities", () => {
    const r = quoteRequestSchema.safeParse({
      name: "أحمد", phone: "07701234567", governorate: "كربلاء",
      items: [{ productId: uuid, name: "صندوق", quantity: 0 }],
    });
    expect(r.success).toBe(false);
  });
  it("rejects an empty item list", () => {
    const r = quoteRequestSchema.safeParse({ name: "أحمد", phone: "07701234567", governorate: "كربلاء", items: [] });
    expect(r.success).toBe(false);
  });
  it("rejects invalid phone", () => {
    const r = wholesaleLeadSchema.safeParse({ name: "أحمد", phone: "123", governorate: "بغداد", productInterest: "تحف" });
    expect(r.success).toBe(false);
  });
  it("blocks submission while the backend flag is OFF (honest failure, no false success)", async () => {
    await expect(submitQuoteRequest({
      name: "أحمد", phone: "07701234567", governorate: "كربلاء", preferredContact: "whatsapp",
      items: [{ productId: uuid, name: "صندوق", quantity: 20 }],
    })).rejects.toBeInstanceOf(LeadSubmissionDisabledError);
  });
});
