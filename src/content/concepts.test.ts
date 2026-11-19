import { describe, it, expect } from "vitest";
import { CONCEPT_LABEL, MANUFACTURING_CONCEPTS, conceptById, conceptInquiryPath } from "./concepts";
import { customOrderSchema } from "@/lib/leads";

describe("manufacturing concepts", () => {
  it("lists ten independent concept cards", () => {
    expect(MANUFACTURING_CONCEPTS).toHaveLength(10);
    expect(new Set(MANUFACTURING_CONCEPTS.map((item) => item.id)).size).toBe(10);
    expect(CONCEPT_LABEL).toContain("تصميم تصوري");
  });
  it("builds an inquiry path that does not invent a product id", () => {
    expect(conceptInquiryPath("lamp-bases")).toBe("/custom-orders?concept=lamp-bases");
    expect(conceptById("missing")).toBeUndefined();
  });
  it("keeps the custom-order payload conceptual, not a catalog SKU", () => {
    const parsed = customOrderSchema.parse({
      name: "أحمد",
      phone: "07701234567",
      governorate: "كربلاء",
      preferredContact: "whatsapp",
      specifications: "طلب دراسة تصنيع مشابه لقاعدة مصباح",
      quantity: 20,
      conceptId: "lamp-bases",
      conceptTitle: "قواعد مصابيح خشبية",
    });
    expect(parsed.conceptId).toBe("lamp-bases");
    expect(parsed.specifications).not.toMatch(/public_approved|price_public/);
  });
});
