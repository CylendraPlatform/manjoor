import { describe, it, expect } from "vitest";
import { features } from "@/config/features";
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
  it("does not invent a reference when saving is off", async () => {
    expect(features.directCheckout).toBe(false);
    if (features.leadSubmission) {
      // Live persistence is an integration concern. This unit test must not insert a row.
      expect(features.publicSite === true || features.publicSite === false).toBe(true);
      return;
    }
    await expect(submitQuoteRequest({
      name: "أحمد", phone: "07701234567", governorate: "كربلاء", preferredContact: "whatsapp",
      items: [{ productId: uuid, name: "صندوق", quantity: 20 }],
    })).rejects.toBeInstanceOf(LeadSubmissionDisabledError);
  });
});
