import { describe, it, expect } from "vitest";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  normalizeBusinessWhatsApp,
  toWaNumber,
} from "./whatsapp";

const TEST_NUMBER = "9647871857930";

describe("WhatsApp number normalization", () => {
  it("strips non-digits", () => {
    expect(toWaNumber("+964 787-185-7930")).toBe("9647871857930");
  });

  it("converts a local Iraqi 07 number to wa.me format", () => {
    expect(normalizeBusinessWhatsApp("07871857930")).toBe(TEST_NUMBER);
  });

  it("accepts the international test number", () => {
    expect(normalizeBusinessWhatsApp("+9647871857930")).toBe(TEST_NUMBER);
  });

  it("rejects empty or non-Iraqi values", () => {
    expect(normalizeBusinessWhatsApp("")).toBe("");
    expect(normalizeBusinessWhatsApp("12345")).toBe("");
  });
});

describe("WhatsApp messages", () => {
  it("uses the general inquiry copy", () => {
    expect(buildWhatsAppMessage({ topic: "general" })).toBe(
      "السلام عليكم، أريد الاستفسار عن منتجات منجور الخشبية.",
    );
  });

  it("uses bakarat model copy without inventing quantity", () => {
    expect(buildWhatsAppMessage({ topic: "product", model: "bakara-02" })).toBe(
      "السلام عليكم، أريد الاستفسار عن بكار خشبي من منجور، الموديل: bakara-02.",
    );
  });

  it("uses wholesale copy", () => {
    expect(buildWhatsAppMessage({ topic: "wholesale" })).toBe(
      "السلام عليكم، أريد الاستفسار عن تجهيز كميات جملة من منتجات منجور.",
    );
  });

  it("uses custom manufacturing copy", () => {
    expect(buildWhatsAppMessage({ topic: "custom" })).toBe(
      "السلام عليكم، أريد الاستفسار عن تصنيع قطعة خشبية حسب الطلب.",
    );
  });

  it("includes a saved reference only when provided", () => {
    expect(buildWhatsAppMessage({ topic: "followup", referenceNumber: "MJ-1001" })).toBe(
      "السلام عليكم، قدمت طلباً لدى منجور وأرغب بمتابعته. رقم الطلب: MJ-1001.",
    );
  });
});

describe("WhatsApp URLs", () => {
  it("encodes Arabic text and uses only the business number", () => {
    const url = buildWhatsAppUrl({ topic: "general" }, TEST_NUMBER);
    expect(url).toBe(
      `https://wa.me/${TEST_NUMBER}?text=${encodeURIComponent("السلام عليكم، أريد الاستفسار عن منتجات منجور الخشبية.")}`,
    );
  });

  it("returns null when no business number is configured", () => {
    expect(buildWhatsAppUrl({ topic: "general" }, "")).toBeNull();
  });
});
