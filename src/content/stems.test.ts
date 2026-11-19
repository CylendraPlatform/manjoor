import { describe, expect, it } from "vitest";
import { STEM_MODELS, stemBySlug, stemInquiryPath } from "./stems";

describe("workshop stem catalog", () => {
  it("publishes eight distinct real-product models without prices", () => {
    expect(STEM_MODELS).toHaveLength(8);
    expect(new Set(STEM_MODELS.map((item) => item.image)).size).toBe(8);
    expect(STEM_MODELS.every((item) => item.image.startsWith("/workshop/stems/"))).toBe(true);
    expect(STEM_MODELS.every((item) => item.title.startsWith("بكار خشبي"))).toBe(true);
    expect(STEM_MODELS.every((item) => !/\d+\s*د\.ع|IQD/.test(`${item.title} ${item.descriptor}`))).toBe(true);
  });

  it("routes model inquiry to the existing wholesale lead form", () => {
    expect(stemBySlug("bakara-05")?.sourceFile).toBe("manjoor (21).jpg");
    expect(stemInquiryPath("bakara-01")).toBe("/wholesale?model=bakara-01");
  });
});
