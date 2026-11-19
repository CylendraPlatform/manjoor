import { describe, it, expect } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl, isWhatsAppConfigured, toWaNumber } from "./whatsapp";

describe("WhatsApp link builder", () => {
  it("builds a product-context message with quantity", () => {
    const msg = buildWhatsAppMessage({ productName: "صندوق خشبي", quantity: 50, topic: "product" });
    expect(msg).toContain("صندوق خشبي");
    expect(msg).toContain("50");
  });
  it("builds a wholesale message", () => {
    expect(buildWhatsAppMessage({ topic: "wholesale" })).toContain("الجملة");
  });
  it("strips non-digits from the number", () => {
    expect(toWaNumber("+964 770-123-4567")).toBe("9647701234567");
  });
  it("returns null when no business number is configured (never invents one)", () => {
    // brand.contact.whatsapp is an empty placeholder by default.
    expect(isWhatsAppConfigured()).toBe(false);
    expect(buildWhatsAppUrl({ topic: "general" })).toBeNull();
  });
});
